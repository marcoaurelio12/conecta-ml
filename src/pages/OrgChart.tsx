import { useCallback, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Crosshair,
  Expand,
  MapPin,
  RotateCcw,
  Search,
  Shrink,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import {
  OrgChartHandle,
  OrgChartVisualization,
} from "@/components/org-chart/OrgChartVisualization";
import { EmployeeDetailsSheet } from "@/components/org-chart/EmployeeDetailsSheet";
import { employeeData } from "@/data/employeeData";
import { EmployeeType } from "@/types/employee";
import { useCurrentUser } from "@/contexts/CurrentUserContext";

const SEARCH_RESULT_LIMIT = 6;

const OrgChart = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(null);
  // Label state for the expand/collapse-all button, reported by the canvas.
  const [anyCollapsed, setAnyCollapsed] = useState(true);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const chartRef = useRef<OrgChartHandle>(null);
  const { user } = useCurrentUser();

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: () => Promise.resolve(employeeData),
  });

  // One match computation feeds both the accessible results list and the
  // canvas highlight/dim, so the two never disagree.
  const matchIds = useMemo(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();
    if (!query) return new Set<string>();
    return new Set(
      employees
        .filter(
          (employee) =>
            employee.name.toLowerCase().includes(query) ||
            employee.title.toLowerCase().includes(query) ||
            employee.department.toLowerCase().includes(query)
        )
        .map((employee) => employee.id)
    );
  }, [employees, debouncedSearchQuery]);
  const isSearching = debouncedSearchQuery.trim().length >= 2;

  const searchResults = useMemo(
    () => employees.filter((employee) => matchIds.has(employee.id)),
    [employees, matchIds]
  );

  const departmentCount = useMemo(
    () => new Set(employees.map((employee) => employee.department)).size,
    [employees]
  );

  // A result answers twice: the profile opens and the chart pans to the card.
  const handleSelectFromSearch = useCallback((employee: EmployeeType) => {
    setSelectedEmployee(employee);
    chartRef.current?.centerOnEmployee(employee.id);
  }, []);

  const handleCenterOnTree = useCallback((employee: EmployeeType) => {
    setSelectedEmployee(null);
    chartRef.current?.centerOnEmployee(employee.id);
  }, []);

  const handleNodeClick = useCallback((employee: EmployeeType) => {
    setSelectedEmployee(employee);
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Organograma</h1>
            <p className="mt-1 text-muted-foreground">
              Conheça a estrutura da empresa e quem faz o quê.
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar colaboradores…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
              aria-label="Pesquisar colaboradores"
            />
          </div>
        </div>

        {debouncedSearchQuery && (
          <div className="rounded-lg border bg-card p-2" role="region" aria-label="Resultados da pesquisa">
            {searchResults.length === 0 ? (
              <p className="px-2 py-2 text-sm text-muted-foreground">
                Nenhum colaborador corresponde a “{debouncedSearchQuery}”.
              </p>
            ) : (
              <>
                <p className="px-2 pb-1 pt-1.5 text-xs font-medium text-muted-foreground">
                  {searchResults.length} resultado{searchResults.length > 1 ? "s" : ""}
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {searchResults.slice(0, SEARCH_RESULT_LIMIT).map((employee) => (
                    <li key={employee.id}>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 gap-2"
                        onClick={() => handleSelectFromSearch(employee)}
                      >
                        {employee.name}
                        <span className="text-xs font-normal text-muted-foreground">
                          {employee.title}
                        </span>
                      </Button>
                    </li>
                  ))}
                </ul>
                {searchResults.length > SEARCH_RESULT_LIMIT && (
                  <p className="px-2 py-2 text-xs text-muted-foreground">
                    E mais {searchResults.length - SEARCH_RESULT_LIMIT} — refine a pesquisa.
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <div className="rounded-lg border bg-card p-4">
          <div className="mb-4 flex flex-wrap justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => chartRef.current?.zoomBy(1.2)}
                aria-label="Aumentar zoom"
              >
                <ZoomIn className="mr-1 size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Aumentar</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => chartRef.current?.zoomBy(1 / 1.2)}
                aria-label="Diminuir zoom"
              >
                <ZoomOut className="mr-1 size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Diminuir</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => chartRef.current?.resetView()}
                aria-label="Repor vista"
              >
                <RotateCcw className="mr-1 size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Repor vista</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => chartRef.current?.toggleAll()}
                aria-label={anyCollapsed ? "Expandir todos os ramos" : "Recolher todos os ramos"}
              >
                {anyCollapsed ? (
                  <Expand className="mr-1 size-4" aria-hidden="true" />
                ) : (
                  <Shrink className="mr-1 size-4" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">{anyCollapsed ? "Expandir tudo" : "Recolher tudo"}</span>
              </Button>
            </div>
            <Button size="sm" onClick={() => chartRef.current?.centerOnEmployee(user.id)}>
              <Crosshair className="mr-1 size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Centrar no meu cartão</span>
              <span className="sm:hidden">O meu cartão</span>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex h-[560px] flex-col items-center gap-4 pt-8">
              <Skeleton className="size-24 rounded-lg" />
              <Skeleton className="h-8 w-64 rounded-lg" />
              <Skeleton className="h-8 w-64 rounded-lg" />
            </div>
          ) : (
            <OrgChartVisualization
              ref={chartRef}
              employees={employees}
              matchIds={matchIds}
              searching={isSearching}
              currentUserId={user.id}
              onNodeClick={handleNodeClick}
              onAnyCollapsedChange={setAnyCollapsed}
              overlay={
                <p className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full border bg-background/85 px-3.5 py-2 text-xs tabular-nums text-muted-foreground backdrop-blur">
                  <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                  {employees.length} pessoas · {departmentCount} áreas
                </p>
              }
            />
          )}
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            Arraste para navegar, use a roda para aproximar e toque numa pessoa para ver os detalhes.
          </p>
        </div>
      </div>

      <EmployeeDetailsSheet
        employee={selectedEmployee}
        allEmployees={employees}
        onClose={() => setSelectedEmployee(null)}
        onNavigate={setSelectedEmployee}
        onCenterOnTree={handleCenterOnTree}
      />
    </DashboardLayout>
  );
};

export default OrgChart;
