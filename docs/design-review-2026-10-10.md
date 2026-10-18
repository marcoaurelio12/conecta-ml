# Design & UX review — Conecta front end (2026-10-10)

A full pass over the front end against [`frontend-improvement-brief.md`](frontend-improvement-brief.md).
Everything below is implemented and verified by `tsc --noEmit` and `npm run build`; no
backend behaviour changed (there is none yet).

---

## 1. Audit findings

Findings beyond the brief's known issues, found while reworking each screen.

| # | Finding | Where | Fix |
|---|---------|-------|-----|
| 1 | Status labels stored in English ("In Progress", "Completed") on a PT-PT page, so action buttons always fell through to "Iniciar" | `Learning`, `ModuleCard` | `src/types/status.ts` — PT-PT unions as the single source of truth (B3) |
| 2 | Document filter options in English matching no fixture ("All Types" → nothing) | `DocumentFilters` | typed arrays from `@/types/document` |
| 3 | Dashboard quick link pointed at `/support`; the route is `/it-support` | `Index` | corrected |
| 4 | "Ver Calendário" CTA targeted a `/calendar` route that was removed → 404 | `MeetingsCard` | CTA removed; card now honest about sample data |
| 5 | Org-chart dialog navigated between people by dispatching an `open-employee` event that no page listened to — manager/report links did nothing | `OrgChart` | listener added in the page |
| 6 | "Ver o meu cartão" hard-coded employee id `1` (the CEO) — worked for everyone except the person it is about | `OrgChart` | uses the signed-in user's id |
| 7 | Dashboard "integration progress" was a fake timer animating 65 → 68 % | `Index` | reads the real persisted checklist |
| 8 | Benefit cards showed a primary "Inscrever-se Agora" button that redirected to a stub page; the rich fixture detail (costs, eligibility, steps) was never rendered | `Benefits` | one "Saber mais" opens a page-level dialog with the existing data |
| 9 | Support ticket asked users to retype name and email the session already has | `SupportTicket` | prefilled read-only from `CurrentUserContext` |
| 10 | Privacy link pointed to a non-existent `/documents/privacy-policy` | `Feedback` | points to `/documents` |
| 11 | Skeleton used a `loading-spinner` class that exists nowhere in the CSS | `OrgChart` | `Skeleton` primitives |
| 12 | Stock photos hotlinked from pravatar.cc and Unsplash — third-party brands in a fictional-company product, and they break offline | org chart, learning cards | initials avatars (`AvatarFallback`), brand-tint covers with icons |
| 13 | "Onbording" typo on the dashboard | `MeetingsCard` | fixed |
| 14 | Unused `src/components/onboarding/` folder (Lovable leftover): EN copy "Welcome to MyApp!", hardcoded hex, and a TypeScript error | deleted | grep-confirmed zero references first |
| 15 | Three toast systems in parallel (Radix `Toaster`, `use-toast`, Sonner) with different styling | app-wide | Sonner only; Radix toast files deleted |
| 16 | `import * as Icons from "lucide-react"` defeated tree-shaking: Benefits route chunk 773 KB | `BenefitCard` | explicit icon map → 16 KB |

## 2. The brief's three questions

**Keep the Nortia blue?** Yes — but as an accent on neutral surfaces, not as the surface
itself. `#007EA7` survives as `--primary` (4.57:1 on white, AA for normal text); the flat
`#CCDBDC` section washes are gone, replaced by a near-white canvas, white cards and a
dark-ink sidebar rail. The brand now reads as one deliberate colour instead of a background
paint.

**Sidebar or grouped top navigation?** Sidebar. The roadmap adds three role-governance
screens (Pessoas, Aprovações, Auditoria) on top of six employee screens; a grouped top bar
hides items the user is not allowed to open, while a rail filtered by role shows exactly
what each persona may use — which is also a preview of the M1 role-aware UI. The shadcn
sidebar primitives were already installed, it collapses to icons, and it becomes a sheet
on mobile. Trade-off accepted: one more shell to maintain.

**Which new screen to design first?** Sign-in. M1 (25 Oct) is the nearest milestone and
everything else is gated behind it; the pattern is well-established (Microsoft's Entra
sign-in, Okta, Gov.br), so it is mostly a styling decision on top of the new tokens — and
the "Terminar sessão" action already exists in the header, so the screen has somewhere to
return to.

## 3. What changed, by workstream

- **A1 Colour & hierarchy** — token rebuild in `src/index.css` + `tailwind.config.ts`;
  `success`/`warning` states; card-on-canvas hierarchy; uniform icon tiles.
- **A2 Typeface** — Inter Variable self-hosted via `@fontsource-variable/inter` (Latin,
  Latin-ext + other subsets); no CDN dependency.
- **A3 Dark mode** — `next-themes` (`conecta.theme`, system default) with a header toggle;
  the dark palette re-toned to blue-slate rather than inverted teal.
- **A4 Hardcoded colours** — `nortiaPalette` extension deleted; fixture `color` fields
  removed from `benefitData`; every component uses semantic Tailwind classes. Remaining
  hexes are only in `index.css` token comments and the confetti fallback palette.
- **A5 Accessibility** — `:focus-visible` outline globally, `aria-pressed` filter chips,
  keyboard handlers on org-chart nodes, `aria-live` save confirmations, contrast-checked
  token values, PT-PT `aria-label`s on icon-only buttons.
- **A6 Motion** — three duration tokens + one easing curve, `duration-fast`/`ease-out-quart`
  utilities, fade-in keyframe, global `prefers-reduced-motion` override; confetti skips
  entirely when reduced motion is on.
- **B1 Navigation** — role-aware sidebar (see §2) with milestone badges on gated items;
  dev-only role switcher in the sidebar footer.
- **B2 Mock auth** — `CurrentUserContext` + four fixtures reused from the org-chart data
  so the org chart stays truthful; `RequireRole` guard redirects to home.
- **B3 Typed statuses** — `src/types/status.ts` for module statuses, benefit statuses and
  benefit categories (findings 1–2).
- **B4 Persistence** — `usePersistentState` under versioned `conecta.*` keys
  (`checklist.v1`, `learning.v1`, `bookmarks.v1`, `role`, `theme`), try/catch-guarded,
  shaped like future API bodies; save confirmation on the checklist.
- **B5 Routing** — `/support` → `/it-support`, dead `/calendar` and `/benefits/:id`
  removed, learning filters in the URL (`useSearchParams`), 404 page shows the attempted
  path.
- **B6 Toasts** — Sonner only.
- **B7 Performance** — all routes `React.lazy` + Suspense; explicit lucide imports.

## 4. Verification

| Metric | Before | After |
|--------|--------|-------|
| `tsc --noEmit` | 2 errors | 0 errors |
| Entry JS chunk | 1,391.40 kB (322.45 kB gzip), single chunk | 302.00 kB (98.12 kB gzip) |
| Heaviest route chunk | — | 104.04 kB (29.71 kB gzip, Feedback: form + zod) |
| CSS | one file | 66.64 kB (12.00 kB gzip) |
| First load (JS + CSS, gzip) | ~322 kB | ~110 kB |

Interactive testing (screen reader pass, keyboard-only walkthrough, dark-mode spot check in
a real browser) is still to do — the checks above are static.

## 5. Next, per milestone

- **M1 (25 Oct)** — design and build the Sign-in screen against the new tokens; map Entra
  app roles to the four `Role` values already in `src/types/user.ts`; replace the mock
  `CurrentUserContext` provider with the OIDC session, keeping the interface unchanged.
- **M2 (8 Nov)** — Pessoas screens; the fixtures in `src/data/employeeData.ts` already
  carry manager links, so the HR list can reuse the org-chart data path.
- **M3 (22 Nov)** — Aprovações, Os meus acessos, Auditoria; the sidebar groups and
  `RequireRole` gating for these routes already exist behind milestone badges.

---

## 6. Critique round (same day)

A second pass with the Impeccable critique flow — an independent design-review assessment
plus the project's deterministic detector — scored the reworked UI **21/40** (heuristic
band: acceptable) and found what the rework had not touched: the product's high-stakes
moments still performed confidence it does not have. The detector itself came back clean
(0 findings, 105 files), which matches the token work; everything below is judgement-level.

Fixed in the same run (decision 011 in [`decisions.md`](decisions.md)):

- **P0** — checklist reset now confirmed by an AlertDialog and moved out of the filter row;
  benefit fixture icons are a typed `BenefitIcon` union checked against the icon map with
  `satisfies` (three icons — including the two top cards — were silently rendering "?").
- **P1** — feedback progress counts written answers (not focused sections); org-chart search
  returns clickable people, plus "Repor vista", zoom bounds and a "centrar em mim" pan; the
  file drop zone is keyboard-operable and lost its decorative progress bar.
- **P2** — ITSupport received the rework it had missed: PT-PT copy, single gutter, honest
  deduplicated toast, a distinct 24/7 emergency line, search on the guides tab.
- Shell — skip link, focus moves to `#content` on navigation, sr-only "Close" → "Fechar",
  "Hoje" deadlines use the warning colour with a clock glyph, lazy routes sit behind an
  error boundary, M2/M3 badges carry an explanatory tooltip, the `/learning/:id` phantom
  route and the fictional "Esc" shortcut row are gone.

Open items for a later pass: TaskCard ignores the `storage` event (two tabs can disagree),
Documents' six-control filter stack, checklist accordions all open by default, and the
org-chart fixtures are all-Anglo names for a fictional Portuguese company.

Snapshot: `.impeccable/critique/2026-10-10T17-59-38Z__src.md` (first entry for this target;
re-run `$impeccable critique` to start a trend).
