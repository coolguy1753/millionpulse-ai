# MillionPulse AI — Architecture & Build Specification

**Product:** MillionPulse AI — a B2B Customer Success platform by **Million Square Solutions** that generates Executive Business Reviews (EBRs) and Quarterly Business Reviews (QBRs) from connected data + uploads.

**Status:** Frontend prototype complete (React, no build step). This document is the blueprint for the production backend + integration.

> This repo currently contains the **frontend/design prototype** only. Data is mocked (`data.js`, `clients.js`, `verticals.js`, `blueprints.js`) and state is held in React + `localStorage`. Everything below specifies the backend/services required to make it real.

---

## 1. Tenancy model — three levels

| Level | Who | Logs into | Sees |
|---|---|---|---|
| **L1 — HQ / Owner** | Million Square (super-admins, CS ops) | `MillionPulse AI.html` | Everything: all clients, verticals, template library, all reviews, billing, users/roles, settings |
| **L2 — B2B Client** | A client company (e.g. Experience.com) | `Client Portal.html` | **Only their workspace**: their accounts, reviews, templates, data sources, generate |
| **L3 — Client's customers** | e.g. a mortgage co. served by Experience.com | *No login* | Receive a **shared review link / PDF** (secure link, optional password + expiry) |

**Decision:** L3 is intentionally **not** a login system. Reviews are shareable artifacts (HTML/PDF). Building per-end-customer accounts would be high security/scale cost for low value.

Isolation rule: **every domain row carries `workspace_id`**; every query is scoped to the caller's workspace(s). L1 super-admins bypass scoping; L2 users are pinned to one workspace; account-level roles further narrow to assigned accounts.

---

## 2. Personas, roles & access

Roles are defined once and applied per workspace (see `clients.js` / Team & Roles page).

| Role | Scope | Key permissions |
|---|---|---|
| **Super Admin** | All clients (HQ) | Full platform: clients, verticals, templates, users, billing |
| **Workspace Admin** | One workspace | Manage users, accounts, data sources, all reviews in their workspace |
| **CSM** | Assigned accounts | Manage assigned accounts, generate EBRs/QBRs |
| **Search Rank Specialist** | Assigned accounts | Own Search Rank & review data, contribute to reviews |
| **Viewer / Exec** | Read-only | View dashboards & shared reviews |

**Permission matrix** (capabilities × roles) is the source of truth — see the *Team & Roles → Roles & permissions* screen. Enforce it server-side on every endpoint, not just in the UI.

---

## 3. Information architecture (pages already designed)

**L1 — MillionPulse HQ**
- Overview (KPIs, clients, activity)
- Clients (list · **Add Client 5-step wizard** · Client detail + onboarding checklist)
- Verticals (grid · detail with dashboard + **3 EBR / 3 QBR blueprints** per vertical)
- Template Library (master catalog, versioning, usage)
- All Reviews (global log)
- Billing & Plans (MRR/ARR, per-client)
- Team & Roles (users · invite · permission matrix)
- Settings (org, security/SSO/2FA, API keys, notifications)

**L2 — Client workspace** (same components, scoped to one workspace)
- Dashboard · Accounts · Reviews · Templates · Data Sources · Generate wizard · Review viewer
- **Team** (workspace-scoped members · invite teammate · roles reference) — client's own Workspace Admin manages their people
- **Workspace Settings** (organization profile, notification prefs, connected data sources, read-only plan view)
- **Share review** — from the review viewer, produce a secure view-only link (optional password + expiry) or email it directly to the client's own customer (the L3 delivery mechanism — no L3 login)

**Client auth flow** (`clientauth.jsx`): sign in · forgot · reset · invite · 2FA · workspace picker · welcome.

---

## 4. Data model (core entities)

```
Organization (Million Square — the platform owner)
 └─ Client            id, name, domain, logo, vertical_id, plan, region, arr, status(prospect|onboarding|active|churned), onboarding_progress
     └─ Workspace     id, client_id  (1:1 with Client; the tenant boundary)
         ├─ Account   id, workspace_id, name, tier, arr, seats, health, nps, adoption, tickets,
         │            region, csm_id, sr_specialist_id, auto_renewal_date, term_start_date, srp_tier, structure(single|multi), brands[]
         ├─ Review    id, workspace_id, account_id, kind(EBR|QBR), template_id, structure, tier,
         │            status(draft|in_review|published), owner_id, quarter, created_at, deck_url, onepager_url, pdf_url
         ├─ DataSourceConnection  id, workspace_id, provider(salesforce|hubspot|pendo|zendesk|delighted|gainsight|...), status, last_sync_at
         └─ Upload    id, workspace_id, review_id?, filename, kind(nps|campaign|survey|users|generic), parsed_json, uploaded_at

Vertical      id, name, icon, color, status(active|planned), metrics_def, dashboard_def
TemplateBlueprint  id, vertical_id, kind(EBR|QBR), name, use, sentiment_focus, sections[]     (see blueprints.js)
Template      id, blueprint_id?, name, kind, vertical_id, version, status(live|draft), html_source, onepager_source, used_by_count
User          id, name, email, status(invited|active|disabled), last_active
Membership    id, user_id, workspace_id|'all', role_id, assigned_account_ids[]               (user ↔ workspace ↔ role)
Role          id, name, scope, permissions{capability: none|partial|full}
Subscription  id, client_id, plan, seats, mrr, arr, billing_status(paid|trial|due), renewal_date
Invite        id, email, role_id, workspace_id, token, expires_at
ShareLink     id, review_id, token, password_hash?, expires_at   (L3 delivery)
AuditLog      id, actor_id, action, entity, workspace_id, meta, created_at
```

Relationships: Client 1—1 Workspace; Workspace 1—N Accounts/Reviews/Connections/Uploads; User N—N Workspaces via Membership (with Role + assigned accounts).

---

## 5. API surface (REST sketch — all scoped by auth context)

```
Auth
  POST /auth/login            {email,password} → {token, memberships[]}
  POST /auth/sso/callback
  POST /auth/2fa/verify       {code}
  POST /auth/invite/accept    {token, name, password}
  POST /auth/forgot | /reset

HQ (super-admin)
  GET  /clients | POST /clients                 (Add Client wizard payload)
  GET  /clients/:id | PATCH /clients/:id
  GET  /verticals | POST /verticals
  GET  /templates | POST /templates | PATCH /templates/:id     (library + versioning)
  GET  /reviews                                  (global, all workspaces)
  GET  /billing/subscriptions
  GET  /users | POST /users/invite | PATCH /memberships/:id
  GET  /roles                                    (permission matrix)
  GET/PATCH /settings/org

Workspace (scoped by :wsId or token)
  GET  /ws/:id/dashboard
  GET  /ws/:id/accounts | POST | PATCH /accounts/:id          (incl. renewal-date edits, admin-gated)
  POST /ws/:id/accounts/import                                 (CSV / CRM sync)
  GET  /ws/:id/reviews | GET /reviews/:id
  GET  /ws/:id/templates
  GET  /ws/:id/sources | POST /sources/:provider/connect
  POST /ws/:id/reviews/generate   → job                        (the generation pipeline, §7)
  GET  /jobs/:id                                               (poll generation progress)
  POST /reviews/:id/share         → {url}                      (L3 share link)
```

Multi-tenancy: derive workspace scope from the JWT `memberships`. Reject any `workspace_id` the caller isn't a member of. Super-admin claim lifts the scope.

---

## 6. Auth & security

- **Identity:** email+password + **TOTP 2FA**; **SAML/OIDC SSO** for enterprise (Settings → Security toggles already modeled).
- **Sessions:** short-lived JWT + refresh; configurable session timeout (Settings).
- **Enforcement:** every endpoint checks (a) authenticated, (b) member of target workspace, (c) role permits the capability. UI hides controls but the server is authoritative.
- **Data isolation:** row-level `workspace_id` filter (Postgres RLS is a strong fit). Uploads/decks stored per-workspace prefix in object storage.
- **Audit:** write an `AuditLog` row for every mutating action (compliance for FinTech/HealthTech clients).
- **API keys:** per-org keys for programmatic generation (Settings → API access).

---

## 7. EBR / QBR generation pipeline (the core value)

Modeled today by the Generate wizard + `ebr-templates/`. Production flow:

```
1. Intake        brief fields (org, period, renewal dates, seats, Google metrics) + template selection
2. Ingest        pull connected sources (CRM/usage/support/NPS) + parse 4 uploaded xlsx
                   (Experience.com: NPS, Campaign, Survey, User Details reports)
3. Analyze       compute metrics; run sentiment analysis on verbatims/comments;
                   rank LOs by NPS, score Search Rank (SRS), extract themes;
                   infer strategic posture (Protect / Close)
4. Compose       pick locked template (Single/Multi × SRP550/SRP850 for Experience.com,
                   or the vertical blueprint's sections); fill placeholders with real data
5. Render        interactive HTML deck + 1-page summary HTML; export PDF (headless browser / LibreOffice)
6. Deliver       store deck_url/onepager_url/pdf_url; publish; optional ShareLink for the client's customer
```

- Run as an **async job** (queue + worker); the wizard polls `/jobs/:id` and shows the step list (already built).
- **Templates are locked, versioned artifacts.** Content is data-driven; structure is not editable per-run. Keep the Experience.com EBR System (`EBR-System-Knowledge-Base.md`) as the reference implementation; each vertical's `blueprints.js` entry becomes a real template when a client is finalized.
- Sentiment/analysis engine is the AI layer — customer-comment keyword/theme extraction, detractor identification, per-vertical signal focus (see each blueprint's *Signals*).

---

## 8. Integrations

| Category | Providers | Used for |
|---|---|---|
| CRM | Salesforce, HubSpot | Accounts, renewals, contacts |
| Product usage | Pendo, Amplitude | Adoption, feature usage |
| Support | Zendesk, Intercom | Tickets, CSAT, verbatims |
| Health & NPS | Delighted, Gainsight | NPS, health scores |
| Uploads | xls/xlsx/csv | Experience.com's 4 reports + ad-hoc data |
| Export | Headless Chrome / LibreOffice | PDF generation |

Each connection is per-workspace with its own OAuth tokens + sync cadence.

---

## 9. Frontend → production

- Current: React 18 + Babel-in-browser, files loaded via `<script>`, mock data on `window`.
- Production: migrate to a bundler (Vite/Next), replace `data.js`/`clients.js`/`verticals.js`/`blueprints.js` with an **API client layer** — keep the same component props so screens don't change. Swap `localStorage` auth for real session handling.
- The components are already **workspace-scoped via props** (`ws` object), which maps cleanly onto per-tenant API responses.

**File map (prototype):**
`MillionPulse AI.html` (L1 host) · `Client Portal.html` (L2 host) · `app.jsx` (L1 routing/auth gate) · `client.jsx` (L2 app) · `clientpages.jsx` (L2 Team + Workspace Settings) · `clientauth.jsx` (client auth flow) · `login.jsx` (admin login) · `admin.jsx` (overview + verticals) · `clients.jsx` (clients + wizard + detail) · `roles.jsx` (team & roles) · `hq.jsx` (library, reviews, billing, settings) · `dash.jsx` `lists.jsx` `generate.jsx` `review.jsx` (workspace screens; `review.jsx` also hosts the Share modal) · `shell.jsx` `ui.jsx` (shell + primitives) · `styles.css` (design tokens) · `blueprints.js` (per-vertical EBR/QBR blueprints) · `clients.js` `verticals.js` `data.js` (mock data) · `ebr-templates/` (5 locked Experience.com templates).

---

## 10. Suggested stack & phasing

- **Stack:** Postgres (+ Row-Level Security), Node/TypeScript API (NestJS or Fastify), Redis + queue (BullMQ) for generation jobs, object storage (S3) for decks/uploads, headless-browser render service, Auth (Auth.js/WorkOS for SSO).
- **Phase 1:** Auth + tenancy + Clients/Workspaces/Users/Roles CRUD; wire L1 & L2 read screens to the API.
- **Phase 2:** Data-source connectors + upload parsing; Accounts import.
- **Phase 3:** Generation pipeline (Experience.com system first, then per-vertical templates); PDF export; share links.
- **Phase 4:** Billing, audit log, analytics, notifications.

---

*Generated as the build spec for the MillionPulse AI prototype in this repo. Pair with `EBR-System-Knowledge-Base.md` (in `/uploads`) for the Experience.com generation reference.*
