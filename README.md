# MillionPulse AI

A B2B Customer Success product by **Million Square Solutions** — a unified **EBR / QBR generation tool**.

Multi-tenant prototype: each client (e.g. **Experience.com**, **Milltex**) is an isolated workspace with its own accounts, reviews, data-source connections, and templates.

## Highlights
- **Dashboard** — portfolio KPIs, reviews due, health distribution, AI insight
- **Accounts** — CSM + Search Rank Specialist, ARR, auto-renewal / renewal dates (admin-editable), computed **EBR Window** (90 days pre-renewal), and **QBR eligibility** ($5K ARR threshold)
- **Generate wizard** — standard review flow, plus the **Experience.com EBR System** flow (intake brief + 4 report uploads → Single/Multi × SRP550/SRP850 → interactive deck + 1-page summary)
- **Templates** — workspace-scoped; the 4 locked Experience.com EBR templates live here
- **Workspace switcher** — full tenant isolation
- **Tweaks panel** — brand colors, radius, density

## Run it
No build step. Open `MillionPulse AI.html` in a browser (or serve the folder with any static server, e.g. `npx serve`).

## Structure
- `MillionPulse AI.html` — entry point (loads everything)
- `styles.css` — design tokens + global styles
- `data.js` — mock data (workspaces, accounts, templates, EBR system config)
- `ui.jsx` — icons + UI primitives
- `shell.jsx` — sidebar, topbar, workspace switcher
- `dash.jsx` · `lists.jsx` · `generate.jsx` · `review.jsx` — screens
- `app.jsx` — routing + state
- `tweaks-panel.jsx` — Tweaks controls
- `ebr-templates/` — the 5 Experience.com EBR System templates (4 decks + 1-pager)

Built as an interactive HTML prototype (React + Babel, no bundler).
