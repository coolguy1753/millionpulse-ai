# MillionPulse AI — Production Build (Phase 1)

This is the **production application** built from the design prototype, following
`ARCHITECTURE.md` and `COWORK-HANDOFF.md`. The old prototype files (`*.jsx`,
`*.html`, `styles.css`, `data.js`, …) still live at the repo root as **design
reference** and are not used by the running app.

The real app lives in:

```
apps/api   →  backend  (NestJS + Prisma + Postgres, with Row-Level Security)
apps/web   →  frontend (Vite + React + TypeScript)
```

---

## What Phase 1 delivers

- **Multi-tenancy**: every workspace-owned row carries `workspaceId`; access is
  enforced on the server by a `TenantGuard` **and** by Postgres Row-Level
  Security. A client user can never read another client's data.
- **Auth**: email + password (bcrypt), JWT access/refresh tokens, 2FA-ready
  (TOTP), SSO-ready.
- **Roles & permissions**: the exact permission matrix from `ARCHITECTURE.md §2`,
  enforced per endpoint.
- **Data model**: all core entities (Client, Workspace, Account, Review, User,
  Membership, Role, Template, Vertical, DataSourceConnection, Subscription,
  ShareLink, AuditLog, …), seeded with the prototype's data.
- **Screens wired to the API**: HQ Overview, Clients, Team & Roles, and a
  workspace Dashboard — recreated with the prototype's exact design tokens.

Later phases (data connectors, the EBR/QBR generation pipeline, billing) are
scaffolded as clearly-marked placeholders.

---

## Prerequisites (install once)

1. **Node.js 20+** — https://nodejs.org (LTS)
2. **pnpm** — after Node is installed, open a terminal and run: `npm install -g pnpm`
3. **Docker Desktop** — https://www.docker.com/products/docker-desktop (runs
   Postgres + Redis locally, no manual database setup needed)

---

## First-time setup

Open a terminal **in this folder** and run:

```bash
# 1. Copy the environment template
cp .env.example .env        # (Windows PowerShell: copy .env.example .env)

# 2. One command: install, start the database, create tables, apply security, seed data
pnpm setup
```

`pnpm setup` runs, in order: install dependencies → start Postgres/Redis in
Docker → generate the Prisma client → create the database tables → apply
Row-Level Security policies → seed the prototype data.

---

## Run it (every time)

Two terminals (or one, using the combined command):

```bash
pnpm dev
```

This starts:

- API  → http://localhost:4000/api
- Web  → http://localhost:5173  ← **open this in your browser**

### Log in

| Login | Sees |
|---|---|
| `priya@millionsquare.com` | HQ / everything (super-admin) |
| `sarah.mitchell@experience.com` | Only the Experience.com workspace |
| `aisha@millionsquare.com` | Milltex workspace (CSM) |

Password for all seeded users: **`password123`**

---

## Handy commands

```bash
pnpm dev            # run API + web together
pnpm dev:api        # just the backend
pnpm dev:web        # just the frontend
pnpm db:up          # start Postgres + Redis
pnpm db:down        # stop them
pnpm db:seed        # re-seed the database
pnpm --filter @millionpulse/api prisma:studio   # browse the database in a GUI
```

---

## Project layout

```
apps/api/
  prisma/
    schema.prisma      # the data model
    rls.sql            # Row-Level Security policies
    seed.ts            # loads the prototype data
  src/
    auth/              # login, JWT, 2FA, strategy
    common/            # guards (tenant + capability) and decorators
    modules/
      clients/         # HQ: /clients
      hq/              # HQ: /verticals, /roles, /users
      workspace/       # scoped: /ws/:wsId/dashboard|accounts|reviews|…
    prisma/            # PrismaService (binds tenant context for RLS)
    main.ts

apps/web/
  src/
    lib/               # api client, auth context, types
    ui/                # design-token primitives + app shell
    screens/           # Login, Overview, Clients, TeamRoles, WorkspaceDashboard
    index.css          # the prototype's design tokens (ported verbatim)
    App.tsx            # routing + auth gate
```

---

## Troubleshooting

- **"port 5432 already in use"** — another Postgres is running. Stop it, or edit
  the port in `docker-compose.yml` and `.env`.
- **API can't connect to the database** — make sure Docker Desktop is running and
  `pnpm db:up` succeeded.
- **Reset everything** — `pnpm db:down`, delete the Docker volume, then `pnpm setup`.
