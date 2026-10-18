# IAM roadmap — Conecta as a small identity governance platform

Last updated: 2026-10-01 · Decisions behind this plan: [`decisions.md`](decisions.md) 005–008.

## Goal

Turn Conecta into a working, small-scale identity governance system for **Nortia**
(fictional, ~25 employees) on **Microsoft Entra ID**:

- HR is the source of truth — a hire, a move or a leave in Conecta changes the identity
  in Entra ID automatically (joiner–mover–leaver).
- Access follows roles (birthright) or an approved, time-bound request — nothing else.
- Managers recertify their team's access on a schedule; unconfirmed access is removed.
- Every change can be explained to an auditor: who, what, when, why.

Scope comes from a review of 15 IAM job ads in Portugal (Oct 2026). Most repeated
requirements: Entra ID (12/15), JML / provisioning (11), scripting + APIs (9), access
recertification (8), RBAC (8), MFA / SSO (7), SAML / OAuth / OIDC (6), PAM (6),
compliance (6).

## Architecture

```
 Conecta front end (React, Azure Static Web Apps)
   │  sign-in: OIDC (MSAL, auth code + PKCE) · app roles in the token drive the UI
   │  calls API with the user's access token
   ▼
 JML / governance engine (Azure Functions, Python) ── managed identity, no secrets
   │  HTTP + timer triggers (start dates, last days, expiries, nightly drift check)
   │  Microsoft Graph (REST)
   ▼
 Microsoft Entra ID — users · groups · manager · app roles · sessions

 Azure SQL ── HR records · access grants · requests · review campaigns · audit log (append-only)
 roles.yaml (git) ── role matrix + separation-of-duties rules, changed only by pull request
 Bicep + GitHub Actions (OIDC federated credential) ── all of the above, no stored secrets
```

## Licensing shapes the design

Checked against Microsoft Learn on 2026-10-01 (Entra ID Governance licensing fundamentals).

| Capability | Licence | How Conecta uses it |
|---|---|---|
| Users, groups, app registrations, app roles, OIDC sign-in, revoke sessions | Free | **Core — built on this, works all year at €0** |
| Conditional Access · Terms of use · API-driven inbound provisioning · logs to Log Analytics | P1 | Trial window (M4) |
| Access reviews · PIM · entitlement management (access packages, SoD) · ID Protection | P2 | Trial window (M4) |
| Lifecycle Workflows | Entra ID Governance | Out of reach for a lab tenant — the engine does this job |

**Principle:** build the governance logic in Conecta on Entra ID Free; switch on the
native features during **one 31-day P2 trial** and document both side by side
(`docs/build-vs-native.md`). The P2 trial is once per tenant, so the date is planned.

## Role model (Nortia)

- 5 departments: People (HR), Finance, Operations, Sales, IT · ~25 fictional employees.
- Group naming: `grp-<scope>-<resource>-<level>` — e.g. `grp-all-staff`,
  `grp-fin-members`, `grp-fin-erp-read`, `grp-fin-payments-create`,
  `grp-fin-payments-approve`.
- **Birthright access:** derived from department + job title, granted on hire, recomputed
  on move.
- **Requestable access:** manager approval, justification, expires (default 90 days).
- **Separation of duties (examples):** payments create ↔ payments approve; payroll ↔ IT
  admin. A conflicting request is blocked before it reaches the approver.
- **Conecta app roles:** Employee, Manager, HR, IAM Admin — assigned to groups once at
  setup, so the engine never holds permission to assign app roles (decision 007).

## Milestones

Assumes ~6 h/week. Each milestone ends with a `decisions.md` entry and a short demo
recording.

### M0 — Foundation · by 11 Oct

- Azure free account + **budget alert** before any resource.
- Tenant `nortia` (onmicrosoft.com), admin account with MFA, **2 emergency-access
  (break-glass) accounts**.
- App registration for Conecta with the 4 app roles.
- **Done when:** tenant and budget alert exist; decisions 005–008 written.

### M1 — Sign-in and roles · by 25 Oct

- MSAL React sign-in; app-role claims decide which screens each person sees (HR →
  "Pessoas", manager → "Aprovações", IAM admin → "Auditoria").
- Bicep for the Static Web App; GitHub Actions deploys with an **OIDC federated
  credential** (workload identity federation — no secret in GitHub).
- **Done when:** public URL; 4 test users each see only their own screens.

### M2 — Joiner–mover–leaver · by 8 Nov ← minimum version for the CV

- Function App (Python) + managed identity + Azure SQL, in Bicep.
- `roles.yaml` + loader; HR screen "Pessoas": hire / change role / leave.
- **Joiner:** create user, set department, job title and manager, add birthright groups,
  assign the onboarding checklist; first sign-in with a temporary credential.
- **Mover:** recompute birthright — remove what the old role gave, add the new one;
  requested access goes back to the new manager for re-approval (no privilege creep).
- **Leaver** (timer, end of last day): disable account, revoke sessions, remove group
  memberships, record everything; delete after 30 days.
- **Audit log:** actor, action, target, before/after, timestamp, correlation id —
  append-only.
- Seed script: 25 employees across the 5 departments.
- **Done when:** a 2-minute recording shows hire → move → leave, the Entra admin center
  matches, and the audit log tells the same story.

### M3 — Governance · by 22 Nov

- "Os meus acessos": each employee sees their access **and why** (role X / request #N,
  expires on …) and can request more, with justification.
- Manager approval · SoD check · expiry job removes expired grants.
- **Recertification campaign:** IAM admin opens it; each manager keeps or removes their
  reports' requested access; no answer by the deadline → removed; evidence exported as
  CSV for auditors.
- **Drift and orphan report** (nightly): Entra memberships not explained by a role or an
  approved request; Entra accounts with no HR record.
- **Done when:** one full campaign with its evidence file; a manual change made directly
  in Entra appears in the next drift report.

### M4 — Native Entra, inside the 31-day P2 trial · 23 Nov → 20 Dec

- **Conditional Access:** MFA for everyone, block legacy authentication,
  phishing-resistant MFA for admins — report-only first, break-glass excluded.
- **PIM** for admin roles: eligible, approval, time-limited activation.
- Native **access review** and one **access package** with SoD → compared with M3 in
  `docs/build-vs-native.md`.
- One **SAML** application (Microsoft Entra SAML Toolkit) next to Conecta's OIDC — what
  each protocol is for.
- Sign-in and audit logs → Log Analytics; 3 saved **KQL** queries in `kql/`.
- **PowerShell admin toolkit** (Microsoft Graph PowerShell): bulk import from CSV,
  emergency leaver, access report for one user.
- **Done when:** build-vs-native document and screenshots committed before the trial
  ends.

### Later (after January 2027)

AI assistant over company documents that respects each user's access (the former
phase 3) · SCIM endpoint so Entra can provision into Conecta · identities for AI agents.

## Honest limits

- Not SailPoint or Saviynt. The same concepts at small scale: identity = HR record +
  grants; certification campaign; SoD policy; orphan / uncorrelated accounts.
- Fictional company and data; one tenant; no on-premises AD or Entra Connect.
