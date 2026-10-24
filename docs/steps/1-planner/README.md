# Step 1 · Planner web app + local backend

**Goal:** turn KanbanIA into daybook, backed by a real Go API and a local PostgreSQL database, and publish a clean demo on GitHub. **Order:** define the app → build the backend → move the frontend onto it.

Each milestone gets a chapter, written as it's built, with the same template: **Goal · What I built · Concepts · Security · Try it yourself · Gotchas · What I'd do differently**. A milestone is done when its boxes are ticked *and* its chapter is written.

| Milestone | Chapter | Status |
|---|---|---|
| M0 · Repo prep | [m0-repo-prep.md](m0-repo-prep.md) | 🚧 in progress |
| M1 · Define the app | [m1-define-the-app.md](m1-define-the-app.md) | 🚧 in review |
| M2 · Local database | | not started |
| M3 · API | | not started |
| M4 · Files and images | | not started |
| M5 · Frontend on the real API | | not started |
| M6 · Planner UI | | not started |
| M7 · Demo-ready | | not started |

## M0 · Repo prep
- [x] Move the Vue app into `web/` with `git mv`; root `package.json` with npm workspaces.
- [x] Remove the inherited GitHub Pages workflow ([0010](../../decisions/0010-ci-by-hand.md)).
- [ ] `server/` Go module: `go mod init github.com/em1ttal/daybook/server`, `cmd/api/main.go` serving `GET /health`, root `Makefile`, `npm run test` → `make test`.
- [ ] `.gitignore` (`.env*` except `.env.example`, `var/`), `.nvmrc` + `engines` with the current Node LTS.
- [ ] Fix the inherited lint errors so `npm run lint` passes.
- [ ] Note the language policy in the README (code and docs in English, UI translated).

## M1 · Define the app (docs only)
- [x] [Features and screens](../../product/features.md)
- [x] [Data model](../../architecture/data-model.md), [API](../../architecture/api.md), [files and images](../../architecture/files-and-images.md), [i18n](../../architecture/i18n.md), [repository layout](../../architecture/repository.md)
- [x] [Security plan](../../security/README.md) and [setup guide](../../setup.md)
- [x] Icon concepts, and the [selectable-icons design](../../design/icon.md)
- [x] Three icons in `brand/icons/` (default: `monogram`) and `npm run icons` to export the favicons
- [ ] Review the open questions in [features.md](../../product/features.md) and sign off

## M2 · Local database
- [ ] `docker-compose.yml`: Postgres 18 (pinned minor tag), healthcheck, named volume, port bound to `127.0.0.1` only.
- [ ] Goose migrations for every table in the [data model](../../architecture/data-model.md), written by hand.
- [ ] `sqlc.yaml` and the first queries.
- [ ] `cmd/seed`: demo user (password from `.env.example`), an Inbox, sample lists and tasks (some scheduled this week so the calendar isn't empty).
- [ ] Connect with `psql` and a GUI (TablePlus or DBeaver), and run a few example queries.

## M3 · API
- [ ] `api/openapi.yaml` for health + auth first (schemas, problem+json, cookie security scheme), generated with `oapi-codegen`. Each later domain goes into the spec *before* it's implemented.
- [ ] Foundation: config validation, `slog` logging (never cookies or passwords), middleware (recover, request log, security headers, Origin check, CORS for the Vite dev origin), spec validation, errors → problem+json, timeouts, graceful shutdown, docs at `/api/docs`.
- [ ] Auth: register/login/logout/me, argon2id, cookie sessions, rate-limited login, session list + revoke.
- [ ] Lists, statuses, tasks, labels, checklist: spec → SQL → service → handler.
- [ ] Tests with each domain: unit tests for pure logic; integration tests against `daybook_test` for the auth flow, CRUD, **cross-user access → 404**, the move-task transaction, and validation `code`s; responses checked against the spec.
- [ ] **First CI workflow, by hand** (`.github/workflows/server.yml`): gofmt, `go vet`, golangci-lint, `govulncheck`, generated code up to date, `go test` with a Postgres service container.
- [ ] Security checkpoint: go through [security/backend.md](../../security/backend.md) and write up the results.
- [ ] (Optional) Huma spike on a throwaway branch, compared in the chapter.

## M4 · Files and images
- [ ] `Storage` interface + `localfs`; `files` endpoints; task attachments; profile picture.
- [ ] Size limit, type sniffing, EXIF stripping, short-lived URLs, orphan cleanup job.
- [ ] Tests: oversized and wrong-type uploads rejected, another user's file → 404.
- [ ] Security checkpoint: [security/files.md](../../security/files.md).

## M5 · Frontend on the real API
- [ ] **i18n foundation first:** `vue-i18n`, `locales/en` + `locales/es`, folder discovery, locale detection, `<html lang>`, lint for raw strings and missing keys. From here on, every touched component uses `t()`.
- [ ] **Web tests:** Vitest + Vue Test Utils + MSW; first tests for the API client and auth store. Add a `web` job to CI (install, lint, test, build, `npm audit`).
- [ ] `web/src/api/client.js`: fetch wrapper (`credentials: 'include'`, JSON, problem `code` → translated message). Vite dev proxy `/api → :8080`.
- [ ] Replace each service with API calls, one at a time; delete `src/data/` and `delay()`.
- [ ] Real login/logout; the router guard calls `/auth/me` (Pinia `useAuthStore`).
- [ ] Loading and error states; optimistic drag-and-drop with rollback, and a test for the rollback.

## M6 · Planner UI
- [ ] Boards → lists in UI and routes; remove members, avatars of others, collaboration UI.
- [ ] Reskin to the [style guide](../../design/style-guide.md): tokens everywhere, light/dark/system theme toggle.
- [ ] Today (`/today`) and Calendar (`/calendar`: month/week/day, drag to reschedule, click to create).
- [ ] Settings: profile and picture, time zone, language selector (flag + native name), theme, app icon picker, sessions.
- [ ] Attachments in the task modal.
- [ ] Finish i18n: no raw strings left, `es` complete, dates and calendar localised.
- [ ] Replace the marketing landing page with a redirect to `/today` when logged in.
- [ ] Security checkpoint: [security/frontend.md](../../security/frontend.md) (CSP, no `v-html` on user content).

## M7 · Demo-ready
- [ ] README: screenshots/GIF, features, stack, architecture diagram, "run locally" in ≤3 commands, demo credentials, roadmap.
- [ ] Playwright end-to-end tests for the critical flows, in `en` and `es`, in CI.
- [ ] CI polish: required checks on `main`, caching, Dependabot, CodeQL, a demo deploy workflow written by hand.
- [ ] Docs polished; Spanish translations of the README and docs.
- [ ] Choose a licence (learn the options first; until then the code is "all rights reserved" by default). No real personal data anywhere in the repo or its history.
- [ ] **Step 1 security review**: the full [security checklist](../../security/README.md#step-checkpoints), written up.
