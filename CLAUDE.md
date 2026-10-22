# CLAUDE.md — daybook (formerly KanbanIA / FH-p4-b3)

Guidance for Claude Code when working in this repository. Read this fully before making changes.

## 1. What this project is

**Today:** "KanbanIA", a Vue 3 + Vite + vue-router single-page app built as a university project (Factores Humanos, p4-b3). Spanish UI and comments. A collaborative kanban board with a landing page, fake login, dashboard of boards, board view with drag-and-drop columns/tasks, labels, checklists, comments, members and a stats view.

**Goal:** turn it into **daybook**, Eshaan's personal to-do app with a visual calendar, backed by a **real Go API and a local PostgreSQL database**, and publish a clean demo version on GitHub as a portfolio piece.

This is step 1 of a 5-step plan:
1. **Planner web app + local backend** ← this repo, now
2. Cloud hosting (VPS + Docker Compose + Caddy, frontend on Cloudflare)
3. iOS app (SwiftUI) using this API
4. macOS app (same SwiftUI codebase)
5. Budgeting app (reuses the API/auth/infra patterns)

So design the API for **multiple clients**: web (cookie sessions) now, iOS/macOS (bearer tokens) later. Publish an OpenAPI spec.

**This is a learning project.** Eshaan is a professional software engineer but new to Go, backend-from-scratch, Postgres and cloud. When you make changes:
- Explain *why* briefly (a sentence or two) for any new concept: migrations, sessions, indexes, transactions, CORS, etc.
- **Go is new to Eshaan.** When code introduces a Go idiom for the first time (interfaces, `context.Context`, error wrapping with `%w` / `errors.Is`, goroutines, struct embedding, `defer`, generics), explain it briefly. Write idiomatic Go (small interfaces, errors as values, no panics for control flow), not TypeScript in Go syntax.
- **`docs/LEARNING.md` is the living build log and portfolio write-up.** A milestone isn't done until its chapter there is filled in (goal, what was built, concepts with small excerpts from this repo, "try it yourself" commands, gotchas, what I'd do differently), new glossary entries are added, and any design choice is recorded in the decision log (append, never rewrite). Write it for a reader new to the topic. If it passes ~1,500 lines, split it into `docs/learning/*.md` with an index.
- Prefer small, reviewable steps over large rewrites. One milestone task per session/PR.
- When there's a real design choice, state the options and trade-offs in 2–3 lines, recommend one, and ask before going ahead if it's hard to reverse.
- Don't add dependencies without saying what they're for.

## 2. Current code — what you'll find

```
index.html                  # lang="es", title "KanbanIA"
src/
  main.js, App.vue
  router/index.js           # routes: / (Home), /login, /dashboard, /board/:id ; auth guard via authService.isAuthenticated()
  views/                    # HomeView, LoginView, DashboardView, BoardView (large: kanban + DnD + modals)
  components/
    home/                   # HeroSection etc. (marketing landing page)
    dashboard/              # DashboardHeader, BoardCard, NewBoardCard, CreateBoardModal
    board/                  # TaskCard, TaskModal, CommentSection, stats/BoardStats ...
  services/                 # authService, boardService, columnService, taskService, labelService,
                            # checklistService, commentService, userService
  data/                     # in-memory mock "DB": boards.js, columns.js, tasks.js, labels.js, users.js
  utils/asyncUtils.js       # delay(ms) used to fake latency
```

Key facts:
- **Services are the seam.** Every service function is `async`, does `await delay(300)`, then mutates objects in `src/data/`. Replacing their bodies with `fetch` calls is the migration path — keep their signatures stable where reasonable so views change little.
- **Auth is fake:** `MOCK_USERS` in `authService.js` (`demo@example.com` / `demo123`), a base64 "token" in `localStorage`. Must be replaced by real sessions (httpOnly cookie). Never store auth tokens in `localStorage`.
- **Data shapes:** boards `{id:number, title, description, lastActivity, members[], owner}`; columns per board `{id:number, title, taskIds[]}`; tasks keyed by board then id `'task-<n>'` with `priority 'low'|'medium'|'high'`, `dueDate`, `labels` (hex colour strings), `timeEstimation` (hours), `checklist {id,title,items[]}`, `comments[]`, `assignedMembers[]`, `blocked`, `blockReason`, timestamps as ISO strings.
- Note: `BoardView` defaults `checklists: []` while data uses a single `checklist` object — normalise this in the new model.
- Tooling: Vite 6, ESLint 9 + oxlint + Prettier (`npm run lint`, `npm run format`). No tests yet. No TypeScript yet.
- Styling today: scoped CSS, dark gradient theme (`#1a1a2e → #16213e`), glassy cards. **This is being replaced** by the daybook identity in `docs/STYLE_GUIDE.md` (Ivory/Fern light, Dim Grey/Lavender dark) with tokens in `src/styles/tokens.css`. New or touched UI uses semantic tokens only (`var(--color-*)`), never raw hex. Run `node scripts/check-contrast.mjs` after changing any colour.
- Deployed today to GitHub Pages via `.github/workflows/deploy.yml`; `vite.config.js` `base` must match the repo name (`/daybook/`).

## 3. Target architecture (step 1)

```
repo/
  web/                 # the existing Vue app, moved here with `git mv`
  server/              # new Go API (its own Go module, not an npm workspace)
    go.mod             # module github.com/em1ttal/daybook/server
    cmd/
      api/main.go      # entrypoint: load config, open pgx pool, build router, listen, graceful shutdown
      seed/main.go     # demo user + sample lists/tasks
    api/
      openapi.yaml     # HAND-WRITTEN contract, source of truth (spec-first)
      oapi-codegen.yaml
    internal/
      config/          # env parsing + validation (fail fast on startup)
      httpapi/         # gen.go (oapi-codegen output, committed) + handlers implementing StrictServerInterface
      auth/            # password hashing, sessions, service
      lists/ statuses/ tasks/ labels/   # service logic per domain (business rules, transactions)
      db/
        queries/*.sql  # SQL written by hand, input to sqlc
        sqlc/          # sqlc output (committed)
        migrations/    # goose SQL migrations (committed), embedded with go:embed
      middleware/      # request log, recover, session auth, CORS (dev), rate limit, security headers
      problem/         # RFC 9457 problem+json helpers
    sqlc.yaml
    .air.toml          # live reload in dev
  docs/
    LEARNING.md        # living build log + portfolio write-up (see §1)
    STYLE_GUIDE.md     # visual identity, tokens, contrast rules
  scripts/check-contrast.mjs
  docker-compose.yml   # postgres (+ api later)
  .env.example         # committed; real .env is gitignored
  package.json         # npm workspaces: ["web"] + scripts that call the Makefile
  Makefile             # Go/DB tasks: gen, migrate, seed, test, lint
  README.md
  CLAUDE.md
```

### Stack decisions
| Concern | Choice | Notes |
|---|---|---|
| Database | **PostgreSQL 18** in Docker (`postgres:18` pinned to a minor tag, never `latest`) | Chosen over SQLite: same DB as production/cloud and the future budget app. Named volume for data. |
| Server language | **Go**, latest stable | Check go.dev before pinning `go`/`toolchain` in `go.mod`. Eshaan is learning Go — see §1. |
| Web tooling runtime | Node.js **current LTS** | Only for `web/` (Vite). Pin in `.nvmrc` / `engines`. |
| HTTP | Standard library `net/http` `ServeMux` (method + path patterns) | No web framework: learn plain Go. Middleware are `func(http.Handler) http.Handler`. |
| API contract | **Spec-first**: hand-written `server/api/openapi.yaml` (OpenAPI 3.x) → `oapi-codegen` (strict server, std-http) | Design the endpoint in the spec *first*, then regenerate, then implement. iOS/macOS clients generated later with `swift-openapi-generator`. |
| Request validation | `kin-openapi` request-validator middleware (from the spec) + domain rules in services | |
| DB driver | `pgx/v5` with `pgxpool` | |
| Queries | **sqlc** (SQL files → typed Go) | No ORM. Hand-written SQL, generated code committed. |
| Migrations | **goose**, plain `.sql` files committed, embedded in the binary | Run on demand via `make migrate`, not automatically on startup (yet). |
| API docs | Serve `openapi.yaml` and a static Swagger UI / Scalar page at `/api/docs` | |
| Password hashing | `golang.org/x/crypto/argon2` (**argon2id**, PHC-encoded string with salt + params) | |
| Sessions (web) | Random 32-byte token (`crypto/rand`) in a `sessions` table, sent as `httpOnly; Secure; SameSite=Lax` cookie | Store a SHA-256 hash of the token, not the raw token. Add bearer tokens for mobile in step 3 using the same table. |
| Logging | `log/slog` (JSON in prod, text in dev) | Never log passwords, tokens or cookies. |
| Security middleware | Security headers (own small middleware), `rs/cors` (dev only: Vite origin), `golang.org/x/time/rate` per-IP limiter on auth routes | |
| Tests | `go test` + `net/http/httptest` against a separate test database (`daybook_test`); table-driven tests | Web: Vitest when tests are added. |
| Lint | `golangci-lint`, `go vet`, `gofmt` | |
| Dev reload | `air` | |
| **Huma spike** (after M2) | On a throwaway branch, re-implement `/health` + lists with **Huma** (code-first) to compare with spec-first | Don't merge. Write the comparison in `docs/LEARNING.md`. |
| Frontend state | **Pinia** (add) | Replace ad-hoc refs shared across views. |
| Calendar | FullCalendar (`@fullcalendar/vue3`, daygrid/timegrid/interaction) or Schedule-X | Verify licences of the plugins used (drag-and-drop must be free/MIT). Ask Eshaan if unsure. |
| Dates | Store `timestamptz` (UTC) in DB; display in user's time zone (default `Europe/Madrid`); date-only fields as `date` | |

Code-generation tools (`oapi-codegen`, `sqlc`, `goose`, `air`) are pinned via Go 1.24+ `tool` directives in `go.mod` (`go tool sqlc …`), so everyone uses the same versions without global installs. `golangci-lint` is the exception: its maintainers recommend installing the binary (Homebrew locally, the official GitHub Action in CI).

Use the latest stable versions of each package at the time of install, and mention any major-version upgrade (e.g. Vite 6 → current) as its own step.

### Data model (first version)
All tables: `id uuid` primary key (UUIDv7 via `uuidv7()` in Postgres 18, or generated in app), `created_at`, `updated_at timestamptz`. Every user-owned table has `user_id` FK and **every query filters by the session user's id**.

- `users` — email (unique, lowercased), password_hash, display_name, timezone (default `'Europe/Madrid'`).
- `sessions` — token_hash (unique), user_id, expires_at, user_agent, created_at.
- `lists` — replaces "boards": name, description, colour, position, archived_at.
- `statuses` — kanban columns per list: list_id, name, position, is_done (boolean, marks "completed" columns).
- `tasks` — list_id, status_id, title, notes, priority (`low|medium|high` CHECK), position (within status), due_date (`date`, nullable), scheduled_start / scheduled_end (`timestamptz`, nullable; CHECK end > start), all_day (bool), estimate_minutes, completed_at, blocked_reason (nullable).
- `labels` — user_id, name, colour; `task_labels` (task_id, label_id) join table.
- `checklist_items` — task_id, text, done, position.
- Later (not now): `recurrence_rule` (RRULE text) on tasks, `reminders`, `comments`→`task_notes`.

Ordering: use integer `position` with gaps (e.g. 1000, 2000…) and renumber when gaps run out, or a fractional-index string. Explain the choice.

Drop for now: board members, avatars, multi-user collaboration, comments by other users. Keep code paths simple for a single user, but schema stays multi-tenant (`user_id`) so the public demo can have a demo user.

### API (v1, all JSON, prefix `/api/v1`)
- `POST /auth/register` (can be disabled by env flag in production), `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- `GET/POST /lists`, `GET/PATCH/DELETE /lists/:id`
- `GET/POST /lists/:id/statuses`, `PATCH/DELETE /statuses/:id`, `POST /lists/:id/statuses/reorder`
- `GET /tasks?listId=&statusId=&from=&to=&due=today|overdue&completed=` — `from`/`to` power the calendar view
- `POST /tasks`, `GET/PATCH/DELETE /tasks/:id`, `POST /tasks/:id/move` (status + position in one transaction)
- `GET/POST /labels`, `PATCH/DELETE /labels/:id`; label assignment via `PATCH /tasks/:id` (`labelIds`)
- `POST /tasks/:id/checklist`, `PATCH/DELETE /checklist-items/:id`
- `GET /health` (no auth)

Conventions: 201 + body on create, 204 on delete, 400 validation errors and 404 not-found as RFC 9457 `application/problem+json`; 404 (not 403) when a resource belongs to another user. Cursor or limit/offset pagination where lists can grow. camelCase JSON, snake_case SQL.

## 4. Milestones (do them in order, one PR each)

**M0 — Repo prep**
- [ ] Move the Vue app into `web/` with `git mv` (including `src/styles/tokens.css`); root `package.json` with npm workspaces (`["web"]`) and scripts (`dev`, `lint`, `test`, `db:up`, `db:migrate`, `db:seed`) that call the Makefile for Go/DB tasks.
- [ ] `server/` Go module skeleton: `go mod init github.com/em1ttal/daybook/server`, `cmd/api/main.go` serving `GET /health`, root `Makefile`.
- [ ] `.gitignore` (node_modules, dist, `.env*` except `.env.example`), `.nvmrc`, `.editorconfig`.
- [ ] Decide language policy (see §6) and note it in README.

**M1 — Local database**
- [ ] `docker-compose.yml` with Postgres 18, healthcheck, named volume, port bound to `127.0.0.1` only.
- [ ] Goose SQL migration(s) for the model above (written by hand, committed), sqlc config + first queries, `cmd/seed` with a demo user (`demo@example.com` / a demo password from `.env.example`) and realistic sample lists/tasks (some scheduled this week so the calendar isn't empty).
- [ ] Explain to Eshaan how to connect with `psql` / a GUI (TablePlus, DBeaver) and run a couple of example queries.

**M2 — API**
- [ ] Write `api/openapi.yaml` for auth + health first (schemas, problem+json error component, cookie security scheme); generate with `oapi-codegen`. Extend the spec one domain at a time *before* implementing it.
- [ ] Server foundation: config validation, `slog` logger (never log cookies/passwords), middleware chain (recover, request log, security headers, CORS for the Vite dev origin), spec validation middleware, errors → problem+json, graceful shutdown, docs at `/api/docs`.
- [ ] Auth (register/login/logout/me, argon2id, cookie sessions, rate-limited login).
- [ ] Lists, statuses, tasks, labels, checklist: spec → sqlc queries → service → handler.
- [ ] Tests: auth flow, CRUD happy paths, **cross-user access returns 404**, move-task transaction, validation errors. CI-ready check that generated code (`make gen`) has no diff.
- [ ] (After M2, optional) Huma spike, see the stack table.

**M3 — Frontend on the real API**
- [ ] `web/src/api/client.js` (fetch wrapper: base URL from `import.meta.env.VITE_API_URL`, `credentials: 'include'`, JSON, error mapping). Vite dev proxy `/api → http://localhost:8080` so cookies are same-origin in dev.
- [ ] Replace each service's body with API calls, one service at a time; delete `src/data/*` and `delay()` when unused.
- [ ] Real login/logout; router guard calls `/auth/me` (cache in a Pinia `useAuthStore`).
- [ ] Loading and error states; optimistic drag-and-drop with rollback on failure.

**M4 — Planner pivot**
- [ ] Rename boards → lists in UI/routes (`/lists/:id`), remove members/avatars/collaboration UI.
- [ ] Reskin to the daybook identity: import `tokens.css` globally, replace the `#1a1a2e` gradient/glass styles with semantic tokens, add a light/dark/system theme toggle (sets `data-theme` on `<html>`; persisting the choice in `localStorage` is fine because it isn't auth data). Follow `docs/STYLE_GUIDE.md`.
- [ ] Calendar view (`/calendar`): month/week/day, shows tasks with `scheduled_start` (time blocks) and `due_date` (all-day markers); drag to reschedule; click empty slot to create.
- [ ] Today/Agenda view (`/today`): overdue, due today, scheduled today.
- [ ] Replace the marketing landing page with a redirect to `/today` when logged in.
- [ ] English UI via `vue-i18n` with `en` default and existing Spanish strings kept as `es`.

**M5 — GitHub-ready demo**
- [ ] README: what it is, screenshots/GIF, features, stack, architecture diagram (Mermaid), "Run locally" in ≤3 commands (`npm i`, `npm run db:up && npm run db:migrate && npm run db:seed`, `npm run dev`), demo credentials, roadmap (steps 2–5).
- [ ] GitHub Actions: web (install, lint, build) and server (`setup-go`, `gofmt`/`go vet`/`golangci-lint`, generated-code-up-to-date check, `go test` with a Postgres service container).
- [ ] `docs/LEARNING.md` polished as the portfolio write-up and linked from the README.
- [ ] MIT licence; no real personal data anywhere in the repo or its history.

Later (step 2, not now): Dockerfile for the API (multi-stage), production compose with Caddy, deploy workflow, backups.

## 5. Commands

Once M0–M2 exist, keep these working (update this section if they change):
```bash
npm install                 # root: installs web/ (Go deps are fetched by `go` automatically)
npm run db:up               # docker compose up -d postgres
npm run db:migrate          # make migrate → go tool goose up
npm run db:seed             # make seed → go run ./cmd/seed
npm run dev                 # web (Vite) + server (air) concurrently; API on :8080
npm run test                # make test (go test ./...) + web tests when they exist
npm run lint && npm run format   # eslint/oxlint/prettier + gofmt/go vet/golangci-lint
make gen                    # oapi-codegen + sqlc generate (run after editing openapi.yaml or queries/*.sql)
node scripts/check-contrast.mjs  # after changing colours
```
Before reporting a task as done: run lint, `go vet`, `go build ./...` and tests, and say what you ran.

## 6. Conventions
- **Language:** new code, identifiers, comments, commit messages and docs in **English** (international portfolio). Translate existing Spanish comments when you touch a file; don't do a mass translation PR unless asked.
- Commits: Conventional Commits (`feat(api): add task move endpoint`). Small, focused.
- Go: `gofmt` formatting, package names short and lower-case, errors wrapped with context (`fmt.Errorf("load task: %w", err)`), `context.Context` as first parameter, pass `pgx.Tx`/query interfaces down for transactions, no global DB variable. JSON fields camelCase via struct tags (generated from the spec).
- Migrate `web/` to TS gradually (new files in `.ts`/`<script setup lang="ts">`) only after M3 — ask first.
- Vue: Composition API with `<script setup>`; keep components small — split `BoardView.vue` (very large) into column/task-list components as you touch it.
- SQL: snake_case, explicit FK `ON DELETE` behaviour (tasks cascade with list; labels cascade from `task_labels`), indexes on every FK and on `(user_id, scheduled_start)`, `(user_id, due_date)`.
- Money is irrelevant here, but if any numeric/currency field appears later: never floats.

## 7. Guardrails
- Never commit secrets, `.env`, database dumps or real personal tasks. The public repo only has seeded demo data.
- Never store auth tokens in `localStorage`; never log passwords, session tokens or cookies.
- Every data-access query is scoped by `user_id` from the session — no exceptions; add a test when adding an endpoint.
- Postgres port bound to localhost in compose; don't expose it publicly.
- Don't run destructive commands (dropping the DB volume, `git push --force`, deleting branches) without asking.
- Pin Docker image tags; don't use `latest`.
- If something in this file conflicts with what Eshaan asks in the session, follow Eshaan and offer to update this file.
