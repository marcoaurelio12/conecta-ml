# conecta-ml — Conecta (Nortia onboarding portal)

Marco's **portfolio project** for the January 2027 job search — since 2026-10-01 an
**IAM / identity governance** project (decision 005), also the hands-on lab for SC-300.
Not a client repo. Technical plan and milestones: `docs/iam-roadmap.md`. Career
deadlines: `..\..\marco\PLANO-SMART.md` (O2) and `..\..\marco\CARREIRA.md`.

- Stack: React 18 + TS + Vite + Tailwind + shadcn/ui. Target: Azure Static Web Apps
  (front end) + Azure Functions in **Python** (JML engine, managed identity) + Azure SQL,
  Entra ID, Microsoft Graph; PowerShell only for the admin toolkit. Dev server:
  `npm run dev` (port 8080).
- Engine's Graph permissions are least privilege (decision 007) — never add
  `AppRoleAssignment.ReadWrite.All` or directory-wide admin roles to it.
- **Company is fictional (Nortia, `nortia.example`).** Never reintroduce the internship
  company's name, domains, policies or colours.
- **Every non-trivial decision → new entry in `docs/decisions.md`** (what, options, why).
  Marco must be able to explain each piece in an interview; explain as you build.
- Code, commits and docs in English; UI copy in Portuguese (PT-PT).
- No secrets in git (`.env*` ignored). Azure costs: budget alert must exist before any
  paid resource.
