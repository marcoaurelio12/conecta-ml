# Design decisions

One entry per decision: what was decided, the options, and **why**. Written so that every
choice in this project can be explained in an interview without notes.

---

## 001 — Fictional company "Nortia" (2026-09-26)

**Decision:** replace every reference to the internship company with a fictional one.
**Why:** the prototype was built during an internship; the brand, internal domains and
policies are not mine to publish. A fictional company keeps the story ("I saw this
problem in a real HR department") without exposing anyone.

## 002 — Remove Botpress and Lovable tooling (2026-09-26)

**Decision:** drop the embedded Botpress chatbot script and the Lovable build plugin.
**Why:** the chatbot lived in a third-party account, not in this code, so it showed nothing
I built. Phase 3 replaces it with an assistant that answers from the company documents
and respects each user's permissions. The Lovable plugin is only needed inside Lovable.

## 003 — Azure as the target platform (2026-09-26)

**Decision:** back end, identity and hosting on Microsoft Azure (Static Web Apps,
Functions, Entra ID), not the Cloudflare/Hetzner stack I use day to day.
**Why:** most Portuguese employers run on Microsoft; the project doubles as hands-on
practice for AZ-900 → AZ-104 / SC-300 / AI-102. Trade-off: slower start on a less
familiar stack.

## 004 — Infrastructure as code and CI/CD in phase 1, PowerShell in phase 2 (2026-09-26)

**Decision:** move Bicep + GitHub Actions from the last phase to the first, and write the
joiner–mover–leaver automation in PowerShell (Microsoft Graph SDK).
**Why:** a review of ~25 Portuguese job ads for Azure / workplace / system administrator
roles showed PowerShell and infrastructure as code (Bicep or Terraform) with pipelines as
the most repeated requirements. Building them in from the start is also less work than
retrofitting. Bicep over Terraform: native to Azure and simpler to start; Terraform can
come later.

## 005 — Refocus on identity and access management; engine in Python (2026-10-01)

**Decision:** the project becomes an identity governance project on Entra ID —
joiner–mover–leaver, role-based access, access requests, recertification, audit (plan:
[`iam-roadmap.md`](iam-roadmap.md)). The engine is written in Python (Azure Functions)
calling Microsoft Graph; PowerShell stays for a small admin toolkit. The AI assistant is
parked until after January 2027. Replaces the PowerShell part of 004.
**Why:** a review of 15 IAM job ads in Portugal (Oct 2026) put Entra ID in 12, JML /
provisioning in 11, scripting + APIs in 9 and access recertification in 8 —
recertification was not in the plan at all. Python is the language I already use, has
good Graph support, and the ads ask for "PowerShell or Python". Trade-off: Azure / system
administrator ads lean towards PowerShell, so the admin scripts stay in PowerShell.

## 006 — Governance built on Entra ID Free; premium features in one trial window (2026-10-01)

**Decision:** the core logic runs on the Entra ID Free tier. The native premium features
(Conditional Access, PIM, access reviews, access packages) are switched on during one
31-day P2 trial and compared with my own version in `docs/build-vs-native.md`.
**Why:** access reviews, PIM and entitlement management need P2; Lifecycle Workflows need
Entra ID Governance; the P2 trial is 31 days, once per tenant. Building on Free keeps the
demo working all year at €0, and building the mechanics myself is how I learn what the
native features do. Trade-off: my version is simpler than Microsoft's — the comparison
document says where and why.

## 007 — The engine's own access: managed identity and least privilege (2026-10-01)

**Decision:** the Function App signs in to Graph with a system-assigned managed identity,
with only the application permissions the JML tasks need (user write, group membership
write, revoke sessions — exact permission names confirmed when building M2). Conecta's app
roles are assigned to groups once, at setup, so the engine never holds
`AppRoleAssignment.ReadWrite.All`. Admin groups are role-assignable, which ordinary group
permissions cannot modify. GitHub Actions reaches Azure through an OIDC federated
credential.
**Why:** an automation that can create users is itself a privileged identity. A managed
identity has no secret to leak or rotate. `AppRoleAssignment.ReadWrite.All` would let the
engine grant itself any permission — a known escalation path — so it is designed out.

## 008 — Role matrix as code (2026-10-01)

**Decision:** departments, job titles, birthright groups, requestable groups and
separation-of-duties rules live in `roles.yaml`, versioned in git and changed only by pull
request.
**Why:** the role matrix decides who gets what by default — the most sensitive
configuration in identity governance. In git every change has an author, a date, a reason
and a review: change control an auditor can follow. Trade-off: HR cannot edit roles in the
UI, on purpose.

## 009 — Design tokens rebuilt around the Nortia blue; role-aware sidebar shell (2026-10-10)

**Decision:** the Nortia teal (#007EA7) stays as `--primary`, but every surface is
re-derived as HSL design tokens in `src/index.css` and consumed only through Tailwind
semantic classes (`bg-background`, `text-muted-foreground`, …) — no component names a hex
or a bare colour any more. The palette gains `success`/`warning` states, the sidebar gets
its own dark-ink token set, Inter Variable is self-hosted, dark mode ships via
`next-themes` (system default, toggle in the header), and motion uses three duration
tokens that collapse under `prefers-reduced-motion`. Navigation is a shadcn sidebar
(collapsible to icons, sheet on mobile) whose groups are filtered by the signed-in role,
not a horizontal grouped navbar.
**Why:** the old UI painted sections in flat #CCDBDC, so nothing receded and hierarchy
came from font size alone; semantic tokens make hierarchy structural and are what makes a
real dark theme possible at all (hardcoded hexes would ignore it). The sidebar wins over a
grouped top bar because three of the six roadmap screens are role-gated (Pessoas,
Aprovações, Auditoria) and a rail shows the user what they may use instead of hiding it;
the shadcn primitives were already installed. Trade-off: one more shell to maintain, and
the Inter files add ~220 KB of static assets (cached after first load).

## 010 — The front end behaves like the future API (2026-10-10)

**Decision:** a mock `CurrentUserContext` with four role fixtures drives the UI (role
switcher is dev-only, persisted at `conecta.role`); progress, bookmarks and filters persist
through one `usePersistentState` hook under versioned `conecta.*` keys shaped like the
future PATCH bodies; every domain status and category label lives in `src/types/status.ts`
as a PT-PT union with its badge variant; Sonner is the only toast system; all routes are
`React.lazy` chunks behind a Suspense fallback.
**Why:** M1 needs role-aware screens and M2/M3 need progress and audit trails — mocking
the shapes now means the Entra ID sign-in and the real API drop in behind the same
interfaces. The typed unions close the bug class this pass actually found ("In Progress"
buttons on a Portuguese page, English document filters that matched nothing). One toast
system and per-route chunks fix the two review findings that were pure debt: three competing
toast implementations, and a single 1,391 kB entry chunk. After the pass the entry chunk is
302 kB (98 KB gzip) and the heaviest route is 104 KB (30 KB gzip) — a star import of
lucide-react was briefly inflating the Benefits route to 773 KB until the icon map became
explicit.

## 011 — Guard rails for the moments that matter (2026-10-10)

**Decision:** an Impeccable critique pass (dual assessment: independent design review plus
the deterministic detector, 21/40) surfaced the product's sharp edges, and the fixes chose
one principle: at high-stakes moments the interface tells the truth. The checklist reset —
the only destructive action in the product — moved out of the filter row and behind an
AlertDialog ("Repor a lista de verificação?"); every progress indicator now counts real
work (feedback progress reads the written answers, not the last focused section; the
dashboard states that day 1 comes pre-ticked); a download button that cannot download says
so instead of firing a success toast; the org-chart search answers with clickable people
instead of instructions; the file drop zone is keyboard-operable; lazy routes sit behind an
error boundary; and the deadline badge uses the warning colour so "Hoje" reads as urgency,
not as an error.
**Why:** the critique's two P0s (silent progress loss; two question-mark icons on the
highest-scan-position benefit cards — fixture icons `dollar-sign`, `credit-card`,
`piggy-bank` were missing from the icon map) and the emotional-journey finding (the
product's purpose — finishing onboarding — landed as a muted grey sentence) share one
root: the UI performing confidence it does not have. Benefit fixture icons are now a typed
union (`BenefitIcon`) checked against the icon map with `satisfies`, so a missing icon is a
compile error rather than a "?" in production.

## 012 — The organogram becomes the Open Design canvas (2026-10-10)

**Decision:** the `/org-chart` screen now runs the interactive organogram first prototyped
in Open Design, ported to the app's stack. The canvas engine (`OrgChartVisualization`) does
pointer pan with a drag-distance guard so card taps stay taps, wheel and pinch zoom clamped
to 0.4–2×, per-node collapse toggles that show "+N" for the hidden team, SVG elbow
connectors measured from the real card positions, and a view (pan/zoom + which branches are
open) persisted under `conecta.orgchart.*` keys so a reload restores where the person left
off. The profile side sheet (`EmployeeDetailsSheet`, on the shadcn Sheet) replaces the
details dialog and adds team stats and a "Centrar na árvore" action; manager and report
navigation happens through callbacks instead of the old window `CustomEvent`. Search keeps
the accessible results list and adds the prototype's in-canvas behaviour: matches ring,
everyone else dims, and ancestors auto-expand. Person cards keep `employeeData` as the only
data source and use the app tokens only, in both themes.
**Why:** the prototype was the approved interaction design and the old visualization was
the weakest screen — no collapse, no persisted view, no measured connectors. Options
considered: dropping the prototype file into `public/` (rejected — foreign branding,
outside the app's navigation and theme) and rebuilding on `@ctrl/react-orgchart` (rejected
— no per-node collapse or measured connectors, the two things the prototype is about).
Trade-offs: the canvas engine is ours to maintain (tsc-clean, ~300 lines, no new
dependencies); `@ctrl/react-orgchart` is now unused and can be dropped from package.json in
a cleanup pass; `EmployeeDetailsDialog` and the already-unimported `EmployeeListView` were
removed, and both remain recoverable from git.
