import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PersonNode } from "./PersonNode";
import { usePersistentState } from "@/hooks/usePersistentState";
import { EmployeeType } from "@/types/employee";

/** Zoom bounds and timing mirror the Open Design prototype this engine was ported from. */
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 2;
const MOVE_DURATION = 300;
const VIEW_SAVE_DELAY = 250;

const EXPANDED_STORAGE_KEY = "conecta.orgchart.expanded.v1";
const VIEW_STORAGE_KEY = "conecta.orgchart.view.v1";

type ViewState = { x: number; y: number; k: number };

type EmployeeNode = EmployeeType & { children: EmployeeNode[] };

export interface OrgChartHandle {
  zoomBy: (factor: number) => void;
  resetView: () => void;
  toggleAll: () => void;
  /** Opens every ancestor of the person, then animates their card to the centre. */
  centerOnEmployee: (id: string) => void;
}

interface OrgChartVisualizationProps {
  employees: EmployeeType[];
  /** Ids matching the current search; while searching, everyone else is dimmed. */
  matchIds: ReadonlySet<string>;
  searching: boolean;
  currentUserId?: string;
  onNodeClick: (employee: EmployeeType) => void;
  /** Lets the page label the expand/collapse-all button from the real state. */
  onAnyCollapsedChange?: (anyCollapsed: boolean) => void;
  /** Rendered inside the canvas — the page uses it for the meta pill overlay. */
  overlay?: React.ReactNode;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function buildTree(employees: EmployeeType[]): EmployeeNode | null {
  const map = new Map<string, EmployeeNode>();
  employees.forEach((employee) => map.set(employee.id, { ...employee, children: [] }));

  let root: EmployeeNode | null = null;
  employees.forEach((employee) => {
    const node = map.get(employee.id);
    if (!node) return;
    if (employee.managerId === null) {
      root = node;
    } else {
      map.get(employee.managerId)?.children.push(node);
    }
  });
  return root;
}

const countAll = (node: EmployeeNode): number =>
  1 + node.children.reduce((sum, child) => sum + countAll(child), 0);

function readStoredView(): ViewState | null {
  try {
    const stored = localStorage.getItem(VIEW_STORAGE_KEY);
    const parsed = stored ? (JSON.parse(stored) as ViewState) : null;
    if (parsed && isFinite(parsed.k) && parsed.k >= MIN_ZOOM && parsed.k <= MAX_ZOOM) {
      return parsed;
    }
  } catch {
    // Corrupted or unavailable storage — fall through to a fresh view.
  }
  return null;
}

/** id -> manager id, so ancestors can be opened without walking the tree. */
function buildBossMap(tree: EmployeeNode): Record<string, string | null> {
  const bosses: Record<string, string | null> = {};
  (function walk(node: EmployeeNode, boss: string | null) {
    bosses[node.id] = boss;
    node.children.forEach((child) => walk(child, node.id));
  })(tree, null);
  return bosses;
}

function edgePath(px: number, py: number, cx: number, cy: number): string {
  if (Math.abs(cx - px) < 1.5) return `<path d="M${px} ${py} L${cx} ${cy}"/>`;
  const mid = py + 28;
  const r = 9;
  const s = cx > px ? 1 : -1;
  return (
    `<path d="M${px} ${py} L${px} ${mid - r}` +
    ` Q${px} ${mid} ${px + s * r} ${mid}` +
    ` L${cx - s * r} ${mid}` +
    ` Q${cx} ${mid} ${cx} ${mid + r}` +
    ` L${cx} ${cy}"/>`
  );
}

/**
 * Canvas engine ported from the Open Design organogram prototype: pointer pan
 * (with a drag-distance guard so card taps stay taps), wheel + pinch zoom,
 * per-node collapse toggles, SVG elbow connectors measured from the real card
 * positions, and a persisted view. View lives in localStorage under a
 * `conecta.*` key so a reload restores exactly where the person left off.
 */
export const OrgChartVisualization = forwardRef<OrgChartHandle, OrgChartVisualizationProps>(
  (
    {
      employees,
      matchIds,
      searching,
      currentUserId,
      onNodeClick,
      onAnyCollapsedChange,
      overlay,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const layerRef = useRef<HTMLDivElement>(null);
    const treeRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const tree = useMemo(() => buildTree(employees), [employees]);

    // Fresh visitors see the top of the hierarchy: the root and its direct reports.
    const defaultExpanded = useMemo(() => {
      const defaults: Record<string, boolean> = {};
      if (tree) {
        (function walk(node: EmployeeNode, depth: number) {
          defaults[node.id] = depth <= 1;
          node.children.forEach((child) => walk(child, depth + 1));
        })(tree, 0);
      }
      return defaults;
    }, [tree]);

    const [expanded, setExpanded] = usePersistentState<Record<string, boolean>>(
      EXPANDED_STORAGE_KEY,
      defaultExpanded
    );
    // Stored maps may predate new fixture people; fall back to the defaults per id.
    const isExpanded = useCallback(
      (id: string) => expanded[id] ?? defaultExpanded[id] ?? false,
      [expanded, defaultExpanded]
    );

    const [view, setViewState] = useState<ViewState>(() => readStoredView() ?? { x: 0, y: 0, k: 1 });
    const [hasSavedView] = useState(() => readStoredView() !== null);
    const viewRef = useRef(view);
    viewRef.current = view;
    // A stored view is the person's own decision; only fresh sessions auto-fit.
    const userMoved = useRef(hasSavedView);

    const [isPanning, setPanning] = useState(false);
    const pointers = useRef(new Map<number, { x: number; y: number }>());
    const pinch = useRef<{ d: number; cx: number; cy: number; k: number; vx: number; vy: number } | null>(null);
    const dragDist = useRef(0);
    const moveRaf = useRef(0);
    const edgeRaf = useRef(0);

    // Persist the view debounced: wheel and pan fire dozens of updates a second.
    useEffect(() => {
      const timer = window.setTimeout(() => {
        try {
          localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(view));
        } catch {
          // Storage unavailable — the session keeps working from memory.
        }
      }, VIEW_SAVE_DELAY);
      return () => window.clearTimeout(timer);
    }, [view]);

    const setView = useCallback((next: ViewState) => {
      viewRef.current = next;
      setViewState(next);
    }, []);

    const centerView = useCallback(() => {
      const container = containerRef.current;
      const treeEl = treeRef.current;
      if (!container || !treeEl) return;
      const rect = container.getBoundingClientRect();
      const width = treeEl.offsetWidth;
      const height = treeEl.offsetHeight;
      const k = clamp(Math.min((rect.width - 48) / width, (rect.height - 48) / height, 1), MIN_ZOOM, 1);
      setView({ k, x: (rect.width - width * k) / 2, y: (rect.height - height * k) / 2 });
    }, [setView]);

    const zoomAt = useCallback(
      (factor: number, clientX: number, clientY: number) => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const px = clientX - rect.left;
        const py = clientY - rect.top;
        userMoved.current = true;
        const prev = viewRef.current;
        const k2 = clamp(prev.k * factor, MIN_ZOOM, MAX_ZOOM);
        if (k2 === prev.k) return;
        const s = k2 / prev.k;
        setView({ k: k2, x: px - (px - prev.x) * s, y: py - (py - prev.y) * s });
      },
      [setView]
    );

    const moveTo = useCallback(
      (duration: number, tx: number, ty: number) => {
        cancelAnimationFrame(moveRaf.current);
        if (!duration) {
          setView({ ...viewRef.current, x: tx, y: ty });
          return;
        }
        const from = viewRef.current;
        const start = performance.now();
        const step = (now: number) => {
          const p = clamp((now - start) / duration, 0, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setView({
            k: from.k,
            x: from.x + (tx - from.x) * eased,
            y: from.y + (ty - from.y) * eased,
          });
          if (p < 1) moveRaf.current = requestAnimationFrame(step);
        };
        moveRaf.current = requestAnimationFrame(step);
      },
      [setView]
    );

    // Edges live inside the scaled layer, so they are measured in tree-local
    // coordinates and only need redrawing when the tree shape changes.
    const drawEdges = useCallback(() => {
      const treeEl = treeRef.current;
      const svg = svgRef.current;
      if (!treeEl || !svg || !tree) return;
      const k = viewRef.current.k || 1;
      const treeRect = treeEl.getBoundingClientRect();
      const width = treeRect.width / k;
      const height = treeRect.height / k;
      svg.setAttribute("width", String(width));
      svg.setAttribute("height", String(height));
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

      const rel = (el: Element) => {
        const r = el.getBoundingClientRect();
        return { x: (r.left - treeRect.left) / k, y: (r.top - treeRect.top) / k, w: r.width / k, h: r.height / k };
      };

      let out = "";
      (function walk(node: EmployeeNode) {
        const children = isExpanded(node.id) ? node.children : [];
        if (!children.length) return;
        const parentEl = treeEl.querySelector(`[data-employee-id="${node.id}"]`);
        if (!parentEl) return;
        const parentRect = rel(parentEl);
        const px = parentRect.x + parentRect.w / 2;
        const py = parentRect.y + parentRect.h;
        children.forEach((child) => {
          const childEl = treeEl.querySelector(`[data-employee-id="${child.id}"]`);
          if (!childEl) return;
          const childRect = rel(childEl);
          out += edgePath(px, py, childRect.x + childRect.w / 2, childRect.y);
          walk(child);
        });
      })(tree);

      svg.innerHTML = `<g style="fill:none;stroke:hsl(var(--border));stroke-width:1.5;stroke-linecap:round">${out}</g>`;
    }, [tree, isExpanded]);

    const scheduleEdges = useCallback(() => {
      cancelAnimationFrame(edgeRaf.current);
      edgeRaf.current = requestAnimationFrame(() => {
        edgeRaf.current = requestAnimationFrame(drawEdges);
      });
    }, [drawEdges]);

    // Fresh sessions fit the whole tree; returning sessions keep their saved view.
    const refitOrRedraw = useCallback(() => {
      if (!userMoved.current && !hasSavedView) centerView();
      else scheduleEdges();
    }, [centerView, scheduleEdges, hasSavedView]);

    useLayoutEffect(() => {
      if (!hasSavedView) centerView();
      scheduleEdges();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      scheduleEdges();
    }, [scheduleEdges, expanded]);

    useEffect(() => {
      const container = containerRef.current;
      const observer = new ResizeObserver(refitOrRedraw);
      if (container) observer.observe(container);
      window.addEventListener("resize", refitOrRedraw);
      const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
      fonts?.ready.then(refitOrRedraw).catch(() => undefined);
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", refitOrRedraw);
      };
    }, [refitOrRedraw]);

    useEffect(
      () => () => {
        cancelAnimationFrame(moveRaf.current);
        cancelAnimationFrame(edgeRaf.current);
      },
      []
    );

    // Wheel zoom needs a non-passive native listener to preventDefault.
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const onWheel = (event: WheelEvent) => {
        event.preventDefault();
        zoomAt(Math.exp(-event.deltaY * 0.0016), event.clientX, event.clientY);
      };
      container.addEventListener("wheel", onWheel, { passive: false });
      return () => container.removeEventListener("wheel", onWheel);
    }, [zoomAt]);

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      dragDist.current = 0;
      if (pointers.current.size === 2) {
        const container = containerRef.current;
        const [a, b] = [...pointers.current.values()];
        if (container) {
          const rect = container.getBoundingClientRect();
          pinch.current = {
            d: Math.hypot(a.x - b.x, a.y - b.y),
            cx: (a.x + b.x) / 2 - rect.left,
            cy: (a.y + b.y) / 2 - rect.top,
            k: viewRef.current.k,
            vx: viewRef.current.x,
            vy: viewRef.current.y,
          };
        }
      }
      // Capture only gestures that start on empty canvas; card and toggle
      // pointers must keep their click target.
      const target = event.target as HTMLElement;
      if (!target.closest("[role='button'],[data-toggle]")) {
        containerRef.current?.setPointerCapture?.(event.pointerId);
      }
    };

    useEffect(() => {
      const onPointerMove = (event: PointerEvent) => {
        if (!pointers.current.has(event.pointerId)) return;
        const previous = pointers.current.get(event.pointerId)!;
        pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

        if (pointers.current.size === 2 && pinch.current) {
          const container = containerRef.current;
          if (!container) return;
          const [a, b] = [...pointers.current.values()];
          const rect = container.getBoundingClientRect();
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          const cx = (a.x + b.x) / 2 - rect.left;
          const cy = (a.y + b.y) / 2 - rect.top;
          const start = pinch.current;
          const k2 = clamp(start.k * (d / start.d), MIN_ZOOM, MAX_ZOOM);
          const s = k2 / start.k;
          userMoved.current = true;
          setView({ k: k2, x: cx - (start.cx - start.vx) * s, y: cy - (start.cy - start.vy) * s });
          return;
        }

        const dx = event.clientX - previous.x;
        const dy = event.clientY - previous.y;
        dragDist.current += Math.abs(dx) + Math.abs(dy);
        if (dragDist.current > 6 && !isPanning) setPanning(true);
        userMoved.current = true;
        setViewState((current) => ({ ...current, x: current.x + dx, y: current.y + dy }));
      };

      const endPointer = (event: PointerEvent) => {
        if (!pointers.current.delete(event.pointerId)) return;
        if (pointers.current.size < 2) pinch.current = null;
        if (pointers.current.size === 0) setPanning(false);
        // dragDist survives until the next pointerdown on purpose: the click
        // event that follows a pan-drag must still be suppressed.
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", endPointer);
      window.addEventListener("pointercancel", endPointer);
      return () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", endPointer);
        window.removeEventListener("pointercancel", endPointer);
      };
      // isPanning is read only to avoid redundant state writes.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setView]);

    const anyCollapsedNow = useCallback(() => {
      if (!tree) return false;
      return (function walk(node: EmployeeNode): boolean {
        if (node.children.length && !isExpanded(node.id)) return true;
        return node.children.some(walk);
      })(tree);
    }, [tree, isExpanded]);

    useEffect(() => {
      onAnyCollapsedChange?.(anyCollapsedNow());
    }, [anyCollapsedNow, onAnyCollapsedChange]);

    const toggleNode = useCallback(
      (id: string) => {
        userMoved.current = true;
        setExpanded({ ...expanded, [id]: !isExpanded(id) });
      },
      [expanded, isExpanded, setExpanded]
    );

    const toggleAll = useCallback(() => {
      if (!tree) return;
      userMoved.current = true;
      const open = anyCollapsedNow();
      const next = { ...expanded };
      (function walk(node: EmployeeNode) {
        if (node.children.length) next[node.id] = open;
        node.children.forEach(walk);
      })(tree);
      setExpanded(next);
    }, [tree, expanded, anyCollapsedNow, setExpanded]);

    const centerOnEmployee = useCallback(
      (id: string) => {
        if (!tree) return;
        userMoved.current = true;
        const bosses = buildBossMap(tree);
        const next = { ...expanded };
        let changed = false;
        let current = bosses[id];
        while (current) {
          if (!isExpanded(current)) {
            next[current] = true;
            changed = true;
          }
          current = bosses[current];
        }
        if (changed) setExpanded(next);

        // Two frames so a re-render from the expansion lands before measuring.
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            const treeEl = treeRef.current;
            const container = containerRef.current;
            const card = treeEl?.querySelector(`[data-employee-id="${id}"]`);
            if (!treeEl || !container || !card) return;
            const treeRect = treeEl.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const viewRect = container.getBoundingClientRect();
            // Card offsets are screen-space (already scaled), so the translate
            // that centres them is simply the distance to the viewport centre.
            const lx = cardRect.left - treeRect.left + cardRect.width / 2;
            const ly = cardRect.top - treeRect.top + cardRect.height / 2;
            moveTo(MOVE_DURATION, viewRect.width / 2 - lx, viewRect.height / 2 - ly - 12);
          })
        );
      },
      [tree, expanded, isExpanded, setExpanded, moveTo]
    );

    // Search that matches someone opens their branch so the match is visible.
    useEffect(() => {
      if (!searching || matchIds.size === 0 || !tree) return;
      const bosses = buildBossMap(tree);
      const next = { ...expanded };
      let changed = false;
      matchIds.forEach((id) => {
        let current = bosses[id];
        while (current) {
          if (!isExpanded(current)) {
            next[current] = true;
            changed = true;
          }
          current = bosses[current];
        }
      });
      if (changed) {
        userMoved.current = true;
        setExpanded(next);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchIds, searching]);

    useImperativeHandle(
      ref,
      () => ({
        zoomBy: (factor) => {
          const container = containerRef.current;
          if (!container) return;
          const rect = container.getBoundingClientRect();
          zoomAt(factor, rect.left + rect.width / 2, rect.top + rect.height / 2);
        },
        resetView: () => {
          userMoved.current = true;
          centerView();
        },
        toggleAll,
        centerOnEmployee,
      }),
      [zoomAt, centerView, toggleAll, centerOnEmployee]
    );

    const renderNode = (node: EmployeeNode, isRoot: boolean): React.ReactNode => {
      const direct = node.children.length;
      const team = countAll(node) - 1;
      const isOpen = isExpanded(node.id);
      return (
        <div key={node.id} className="flex flex-col items-center">
          <PersonNode
            employee={node}
            directCount={direct}
            teamCount={team}
            isRoot={isRoot}
            isCurrentUser={node.id === currentUserId}
            isMatch={searching && matchIds.has(node.id)}
            isDim={searching && matchIds.size > 0 && !matchIds.has(node.id)}
            onClick={(_, source) => {
              // Keyboard activation is never suppressed by the drag guard.
              if (source === "keyboard" || dragDist.current < 6) onNodeClick(node);
            }}
          />
          {direct > 0 && (
            <>
              <button
                type="button"
                data-toggle={node.id}
                aria-expanded={isOpen}
                aria-label={
                  isOpen
                    ? `Recolher equipa de ${node.name}`
                    : `Mostrar ${team} pessoas da equipa de ${node.name}`
                }
                onClick={() => toggleNode(node.id)}
                className={
                  "relative z-10 -mt-3 grid size-6 place-items-center rounded-full border font-mono text-[10px] leading-none tabular-nums transition-colors duration-fast motion-reduce:transition-none " +
                  (isOpen
                    ? "border-border bg-card text-foreground hover:bg-accent"
                    : "border-foreground bg-foreground text-background hover:bg-foreground/85")
                }
              >
                {isOpen ? "−" : `+${team}`}
              </button>
              {isOpen && (
                <div className="flex items-start justify-center gap-5 pt-14 max-[920px]:gap-3.5 max-[920px]:pt-12">
                  {node.children.map((child) => renderNode(child, false))}
                </div>
              )}
            </>
          )}
        </div>
      );
    };

    return (
      <div
        ref={containerRef}
        data-org-viewport=""
        role="group"
        aria-label="Árvore organizacional — arraste para navegar, use a roda para aproximar"
        className={
          "relative h-[560px] select-none overflow-hidden rounded-lg bg-muted/30 " +
          (isPanning ? "cursor-grabbing" : "cursor-grab")
        }
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
      >
        <div
          ref={layerRef}
          className="absolute left-0 top-0 origin-top-left will-change-transform"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})` }}
        >
          <div ref={treeRef} className="relative w-max p-12 pb-16 max-[920px]:p-8">
            <svg ref={svgRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 overflow-visible" />
            {tree && <div className="relative flex items-start justify-center">{renderNode(tree, true)}</div>}
          </div>
        </div>
        {!tree && (
          <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-muted-foreground">
            Sem dados de colaboradores para mostrar.
          </p>
        )}
        {overlay}
      </div>
    );
  }
);

OrgChartVisualization.displayName = "OrgChartVisualization";
