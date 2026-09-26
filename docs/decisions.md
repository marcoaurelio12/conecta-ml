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
