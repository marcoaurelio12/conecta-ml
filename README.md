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
internship project. This repository turns that prototype into a working system that
covers the three things onboarding actually needs: **cloud, identity and automation**.

## Roadmap

| Phase | What works | Status |
|---|---|---|
| 0 | Clean prototype, fictional company, repository | ✅ |
| 1 | Deployed on Azure with **infrastructure as code (Bicep) and CI/CD (GitHub Actions)** from day one · Microsoft Entra ID sign-in · roles (employee, HR, admin) · policies stored in a database · "read and accepted" recorded with timestamp · audit export | ⏳ |
| 2 | Joiner–mover–leaver automation with **PowerShell + Microsoft Graph**: HR registers a hire → account created, added to the department group, onboarding checklist assigned; leaver → account disabled, access removed; every action logged | ⏳ |
| 3 | AI assistant answering from company documents, with sources — and respecting each user's access rights | ⏳ |
| 4 | Monitoring, cost alerts and hardening | ⏳ |

Design decisions and their reasons: [`docs/decisions.md`](docs/decisions.md).

## What is in the prototype

Dashboard · onboarding checklist · learning · documents library · org chart · benefits ·
IT support + tickets · feedback. UI in Portuguese (PT).

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui. Planned: Azure Static Web Apps +
Azure Functions, Bicep, GitHub Actions, Microsoft Entra ID, Microsoft Graph + PowerShell,
an LLM API for the assistant.

## Run locally

```sh
npm install
npm run dev   # http://localhost:8080
```

## Origin and honesty note

The 2025 prototype UI was generated with Lovable (an AI app builder) from my own design and
content. The rebuild is done by me with AI-assisted development (Claude Code); every
design decision is written down in `docs/decisions.md` so it can be explained.

— Marco Henriques
