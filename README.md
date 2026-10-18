# Conecta — employee onboarding platform

Onboarding portal for **Nortia**, a fictional mid-sized company. New hires read the
mandatory policies, follow their onboarding checklist, find documents and people, and get
help — while HR and IT see who has completed what.

> **Status:** front-end prototype. Being rebuilt into a real application in phases (below).
> All company data, people and policies are fictional.

## Why this exists

During an HR internship at a large Portuguese public transport company (2025) I saw how
onboarding really works: policies sent as PDFs, no record of who read what, new hires
asking the same questions, and accounts created by hand. I designed this portal as my
internship project. This repository turns that prototype into a working system centred
on what sits behind every onboarding: **identity and access management** — HR as the
source of truth, accounts and access that follow the role, and access that is reviewed
and can be audited.

## Roadmap

| Phase | What works | Status |
|---|---|---|
| 0 | Clean prototype, fictional company, repository | ✅ |
| 1 | **Microsoft Entra ID sign-in (OIDC)** · app roles (employee, manager, HR, IAM admin) decide what each person sees · deployed on Azure with **Bicep + GitHub Actions** (OIDC federated credential, no stored secrets) | ⏳ |
| 2 | **Joiner–mover–leaver automation (Python + Microsoft Graph)**: HR registers a hire → account, manager and birthright groups from the role matrix; mover → old access removed, new access added; leaver → account disabled, sessions revoked, access removed · role matrix as code · append-only audit log | ⏳ |
| 3 | **Access governance**: access requests with manager approval and expiry · separation-of-duties checks · recertification campaigns with evidence export · drift and orphan-account report | ⏳ |
| 4 | **Native Entra features compared with my own build**: Conditional Access, PIM, access reviews and access packages · a SAML app · logs in Log Analytics with KQL · PowerShell admin toolkit | ⏳ |
| Later | AI assistant over company documents that respects each user's access · SCIM provisioning | — |

Full plan, milestones and licensing constraints: [`docs/iam-roadmap.md`](docs/iam-roadmap.md).
Design decisions and their reasons: [`docs/decisions.md`](docs/decisions.md).

## What is in the prototype

Dashboard · onboarding checklist · learning · documents library · org chart · benefits ·
IT support + tickets · feedback. UI in Portuguese (PT).

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui. Planned: Microsoft Entra ID +
MSAL, Azure Static Web Apps, Azure Functions (Python) with a managed identity, Microsoft
Graph, Azure SQL, Bicep, GitHub Actions, Microsoft Graph PowerShell for admin scripts.

## Run locally

```sh
npm install
npm run dev   # http://localhost:8080
```

`npm run build:demo` builds the public demo: the role switcher stays visible in the sidebar
("Ver o portal como") and a header notice says the company and people are fictional. Until
Entra ID sign-in arrives in phase 1, switching roles is how a visitor sees what each role
(employee, manager, HR, IAM admin) is allowed to use.

## Origin and honesty note

The 2025 prototype UI was generated with Lovable (an AI app builder) from my own design and
content. The rebuild is done by me with AI-assisted development (Claude Code); every
design decision is written down in `docs/decisions.md` so it can be explained.

— Marco Henriques
