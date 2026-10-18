# Frontend improvement brief — Conecta (open for design feedback)

Last updated: 2026-10-10 · Status: **proposal — nothing below is decided yet** ·
Roadmap context: [`iam-roadmap.md`](iam-roadmap.md) · Decisions log: [`decisions.md`](decisions.md)

This document describes what we want to improve in the Conecta front end, in both
**visual design** and **application logic**, and asks for feedback. If you are a
designer, a UX researcher or a front-end developer, the sections marked **feedback
wanted** are direct questions to you.

---

## 1. What Conecta is — and what it is becoming

Conecta is the employee onboarding portal of **Nortia**, a fictional mid-sized
company (~25 employees). Today it is a front-end prototype: dashboard, onboarding
checklist, learning catalogue, document library, org chart, benefits, IT support,
feedback. UI copy is **Portuguese (PT-PT)**; everything runs on mock data.

The project is being rebuilt as a small **identity and access management (IAM)**
system on Microsoft Entra ID. What this means for the front end:

- **M1 (by 25 Oct):** real sign-in (OIDC); the UI becomes **role-aware** — Employee,
  Manager, HR and IAM Admin see different screens.
- **M2 (by 8 Nov):** HR screens to hire / move / leaver people ("Pessoas"); every
  change is written to an append-only audit log.
- **M3 (by 22 Nov):** "Os meus acessos" (my access + why), manager approvals,
  recertification campaigns, drift report.

So the front end must grow from a "new-hire portal" into a **role-aware workplace
tool** — without losing the clean, friendly onboarding feel.

## 2. Current state (honest)

Stack: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui. No state library
beyond React; `@tanstack/react-query` is installed but unused; no tests yet.

- 11 routes / 9 screens, one flat navigation bar, no concept of "current user" or
  roles (the org chart hardcodes user id 1 as "me").
- One teal/blue palette (`nortiaPalette` in `tailwind.config.ts`) applied to both
  background and cards, so surfaces barely separate; a dark header uses one
  hardcoded colour (`#2DD4BF` in `AuthenticatedLayout.tsx`).
- Dark-mode tokens exist (`src/index.css`) but nothing switches them.
- Two toast systems mounted at once (Radix toaster + Sonner).
- All data is static TypeScript files (`src/data/`); checklist/learning progress
  lives only in component state (lost on refresh).
- Bundle is one 1.4 MB chunk (no route-level code splitting).

## 3. Workstream A — visual design system

**A1. Colour and hierarchy.** Today background, cards and popovers share the same
tint (`#CCDBDC`), which flattens the interface. Proposal to evaluate: neutral
canvas, white/elevated cards, the existing blue family reserved for primary actions
and links, and one semantic colour per concept (success/warning/danger already exist
as shadcn tokens but are barely used). *Feedback wanted: keep the "Nortia blue"
identity or propose a new direction?*

**A2. Typography.** No font is loaded; the app renders in the system default.
Choose and self-host one PT-friendly typeface (e.g. Inter, Source Sans 3) and
define the type scale (display / heading / body / caption) in tokens.

**A3. Dark mode.** Wire `next-themes` (already a dependency), re-tone the dark
palette to match A1, and make the header/footer respect it.

**A4. Kill hardcoded colours.** Replace the inline `#2DD4BF` and per-component hex
values (`src/data/benefitData.ts` colours) with design tokens, so theming is
possible at all.

**A5. Accessibility pass.** Contrast audit of the teal-on-teal surfaces, visible
focus states on the custom nav, keyboard traps in dialogs, `prefers-reduced-motion`
for the confetti effect and card hovers.

**A6. Motion language.** One consistent set of durations/easings for hover, dialog
and page transitions, documented as tokens.

## 4. Workstream B — information architecture and app logic

**B1. Role-aware navigation (prepares M1).** The flat 7-item bar does not scale to
Employee / Manager / HR / IAM Admin. Proposal: restructure into a sidebar (or
grouped top nav) with a personal area (Início, Checklist, Formação, Documentos,
Benefícios), a people area (Pessoas — HR), a governance area (Aprovações — Manager;
Auditoria — IAM Admin), and a "switch role" control visible only in dev builds.
*Feedback wanted: sidebar vs grouped top nav at this scale?*

**B2. Mock auth provider.** A `CurrentUserContext` with the four roles, backed by
fixtures, so MSAL can replace it in M1 without touching screens; route guards that
hide/redirect by role. This also removes the hardcoded "current user = CEO".

**B3. Data layer.** A typed API client (`src/api/`) over fixtures with
`@tanstack/react-query`, so M2's Azure Functions backend swaps in without screen
rewrites. Statuses and labels become typed unions in one place (PT-PT), ending the
class of bug where code compares `"Eligible"` against `"Elegível"` — three of these
were found and fixed in the last audit.

**B4. Persisted progress.** Checklist and learning progress in `localStorage` now
(with the same shapes the API will use), optimistic UI, and a visible "saved" state.

**B5. Routing and deep links.** Opening a learning module navigates to
`/learning/:id`, which remounts the page and loses search/filter state; decide the
pattern (search params vs. state + history sync) and apply it to all dialogs.
Fix the "Ver Calendário" link that currently leads to a 404 route.

**B6. One toast system.** Standardise on Sonner (or Radix) and delete the other.

**B7. Performance.** Route-level code splitting (`React.lazy`) and manual chunks
for recharts/lucide; target < 300 KB gzipped on first load.

## 5. Workstream C — new screens to design (wireframes wanted)

These screens exist only as roadmap bullet points; they need flows and wireframes.
All copy PT-PT.

1. **Sign-in** (M1) — first brand moment; needs states for: signed out, no access,
   pending account.
2. **Pessoas** (M2, HR) — the hire / change role / leave flows. Key question: how
   does HR confirm a *mover* diff ("these 3 groups will be removed, these 2 added")
   without feeling like a database tool?
3. **Aprovações** (M3, Manager) — approval queue with justification, remaining
   time, and the separation-of-duties block state.
4. **Os meus acessos** (M3, Employee) — my access and *why* (role vs. request),
   with expiry dates; requesting more with justification.
5. **Auditoria** (M3, IAM Admin) — append-only log view: filters, correlation id,
   before/after diffs; evidence export.

*Feedback wanted: which of these should be designed first, and what reference
products (e.g. Entra, Okta, Workday) do their equivalent screens well?*

## 6. Constraints (non-negotiable)

- UI copy in **PT-PT**; code, commits and docs in English.
- shadcn/ui + Tailwind; no new UI frameworks.
- **Nortia is fictional** — no real company names, brands, domains or colours
  (that includes real transit brands — the prototype's origin story is public).
- No backend yet: everything mocked, but shaped like the future API.
- Every implemented change lands with an entry in `docs/decisions.md`.
- Solo maintainer, ~6 h/week — prefer incremental improvements over rewrites.

## 7. How to review / contribute

- Run it: `npm install && npm run dev` → http://localhost:8080.
- Best entry points: `src/index.css` (tokens), `tailwind.config.ts` (palette),
  `src/components/layouts/AuthenticatedLayout.tsx` (shell), `src/pages/` (screens).
- Feedback as GitHub issues or direct comments on this file; wireframes as issues
  with attachments. Questions in any of PT / EN are welcome.

## 8. Out of scope for now

Backend and Entra ID work (roadmap M1–M2), the AI document assistant (parked
until after January 2027), and any real-person data.
