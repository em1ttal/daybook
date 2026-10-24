# CLAUDE.md — daybook

Guidance for Claude Code in this repository. This root file covers the whole project. **Folder-specific rules live next to the code** and are loaded when you work there:
- [`web/CLAUDE.md`](web/CLAUDE.md): the Vue app
- [`server/CLAUDE.md`](server/CLAUDE.md): the Go API
- later: `infra/CLAUDE.md` (step 2), `apple/CLAUDE.md` (steps 3–4), created with those folders

## 1. What this project is

**daybook** is Eshaan's personal to-do app with a visual calendar, backed by a real Go API and PostgreSQL, and published on GitHub as a portfolio piece. It started as "KanbanIA", a university Vue project (Factores Humanos, p4-b3) with a fake in-memory backend.

The project has **4 steps**:
1. **Planner web app + local backend** ← now
2. Cloud hosting (VPS + Docker Compose + Caddy, frontend on Cloudflare, files on R2)
3. iOS app (SwiftUI) on this API
4. macOS app (same SwiftUI codebase)

So the API is designed for **multiple clients**: web (cookie sessions) now, iOS/macOS (bearer tokens) later, with a published OpenAPI spec.

**Current step and milestone checklist:** [`docs/steps/1-planner/README.md`](docs/steps/1-planner/README.md). Do milestones in order, one task per session/PR.

## 2. This is a learning project

Eshaan is a professional software engineer but new to Go, backend-from-scratch, Postgres, security and cloud. When you make changes:
- Explain *why* briefly (a sentence or two) for any new concept: migrations, sessions, indexes, transactions, CORS, etc.
- **Go is new to Eshaan.** See `server/CLAUDE.md` for which idioms to explain and how.
- **Testing and CI are learning goals**, not chores. Write tests with each feature (same PR), say *which kind* of test and why that level. Build CI workflows by hand, one job at a time, explaining each step. Strategy: [0009](docs/decisions/0009-testing-strategy.md), [0010](docs/decisions/0010-ci-by-hand.md).
- **Security is a learning goal**, in every layer: backend, frontend, files, cloud, native apps and CI. For every control you add, say **which threat it stops**. Checklists: [`docs/security/`](docs/security/README.md). Add a test for security behaviour like any other feature.
- **The app is multilingual by design.** No user-facing string is hard-coded anywhere: it goes in `locales/<code>/messages.json` and is looked up by key. Design: [`docs/architecture/i18n.md`](docs/architecture/i18n.md).
- When there's a real design choice, state the options and trade-offs in 2–3 lines, recommend one, and ask before going ahead if it's hard to reverse.
- Prefer small, reviewable steps. Don't add dependencies without saying what they're for.

## 3. Docs are part of the work

`docs/` (start at [`docs/README.md`](docs/README.md)) is the living build log and portfolio write-up for **all 4 steps**, in many short files. A milestone isn't done until:
- its chapter in `docs/steps/<step>/` is written (Goal · What I built · Concepts with small excerpts from this repo · Security · Try it yourself · Gotchas · What I'd do differently), and its box is ticked in the step's `README.md`;
- new concepts are added to `docs/concepts/<topic>.md`;
- design choices are recorded as a new file in `docs/decisions/` (never edit an accepted record; supersede it);
- `docs/architecture/` matches reality (data model, API, repository layout).

Write for a reader new to the topic. Keep files short (under ~200 lines); split by topic when they grow. Docs are in English first; translations go in `docs/<code>/` later.

## 4. Architecture (read before designing anything)

| Topic | Doc |
|---|---|
| Features and screens | [docs/product/features.md](docs/product/features.md) |
| System overview, life of a request | [docs/architecture/overview.md](docs/architecture/overview.md) |
| Repository layout, today and target | [docs/architecture/repository.md](docs/architecture/repository.md) |
| How the Go server is organised, and why | [docs/architecture/server-layout.md](docs/architecture/server-layout.md) |
| Database tables, keys, indexes | [docs/architecture/data-model.md](docs/architecture/data-model.md) |
| API endpoints, errors, auth | [docs/architecture/api.md](docs/architecture/api.md) |
| Files and images | [docs/architecture/files-and-images.md](docs/architecture/files-and-images.md) |
| Languages | [docs/architecture/i18n.md](docs/architecture/i18n.md) |
| Visual identity | [docs/design/style-guide.md](docs/design/style-guide.md), [docs/design/icon.md](docs/design/icon.md) |
| Installing tools | [docs/setup.md](docs/setup.md) |

New folders are created at the path shown in the target layout, so nothing has to move later. Don't create empty placeholder folders.

Cross-cutting stack choices (details in the folder CLAUDE.md files):

| Concern | Choice |
|---|---|
| Database | **PostgreSQL 18** in Docker, image pinned to a minor tag (never `latest`) |
| API contract | **Spec-first** hand-written OpenAPI 3.x in `server/api/openapi.yaml` |
| Auth | Server-side sessions: `httpOnly` cookie for web, bearer token for Apple apps, same `sessions` table |
| Files | Metadata in Postgres, bytes in object storage (local folder in dev, Cloudflare R2 in prod) |
| Languages | `locales/<code>/messages.json` + `flag.svg` at the repo root, `en` is the source |
| Dates | `timestamptz` (UTC) for moments, `date` for days, displayed in the user's time zone |
| Tests | `go test` + a real test database; Vitest + MSW; Playwright for a few end-to-end flows |
| CI | GitHub Actions, written by hand. Use the Node/Go versions from `.nvmrc` / `go.mod`. |
| Runtimes | Go: latest stable (check go.dev before pinning). Node.js: current LTS, pinned in `.nvmrc`. |

Use the latest stable version of each package when installing it, and treat any major-version upgrade (e.g. Vite 6 → current) as its own step.

## 5. Commands

From the repo root. Keep these working, and update this list when they change:
```bash
npm install                 # installs web/ (Go fetches its own dependencies)
npm run dev                 # web (Vite); from M3 also the API (air) on :8080
npm run build               # production build of web/
npm run lint                # eslint + oxlint (web); from M0 also gofmt/go vet/golangci-lint
npm run format              # prettier (web)
npm run test                # from M0: go test; from M5: Vitest too
npm run db:up | db:migrate | db:seed   # from M2: Postgres in Docker, goose, seed data
make gen                    # from M3: oapi-codegen + sqlc (after editing openapi.yaml or queries/*.sql)
node scripts/check-contrast.mjs        # after changing any colour
npm run icons               # after changing anything in brand/icons/ (commit the output)
```
Before reporting a task as done, run lint, build and tests (plus `go vet` and `go build ./...` once the server exists) and say what you ran.

## 6. Conventions
- **Language:** code, identifiers, comments, commit messages and docs in **English**. Translate existing Spanish comments when you touch a file; no mass translation PRs unless asked. User-facing text is never written inline in any language: it goes in the locale files.
- **Commits:** Conventional Commits (`feat(api): add task move endpoint`), small and focused. Branch: `dev`, PRs into `main`.
- **Naming:** camelCase JSON, snake_case SQL.
- Every user-owned row has `user_id`, and every query filters by the session user's id.

## 7. Guardrails
- Never commit secrets, `.env`, database dumps, uploads (`var/`) or real personal tasks. The public repo only has seeded demo data.
- Never store auth tokens in `localStorage`; never log passwords, session tokens, cookies or `Authorization` headers.
- Every data-access query is scoped by `user_id` from the session, no exceptions. Each new endpoint gets a cross-user test (→ 404).
- No hard-coded user-facing strings in new or touched code; add the key to every locale in the same change.
- Postgres is bound to localhost in dev and never exposed publicly anywhere.
- Don't run destructive commands (dropping the DB volume, `git push --force`, deleting branches) without asking.
- Pin Docker image tags; never `latest`.
- If something here conflicts with what Eshaan asks in the session, follow Eshaan and offer to update this file.
