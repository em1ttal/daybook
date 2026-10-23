# server/CLAUDE.md — the Go API

Rules for working in `server/`. The root [`CLAUDE.md`](../CLAUDE.md) still applies. The code starts in M0 (step 1); until then this file is the plan.

## Teaching Go
Eshaan is learning Go. When code introduces an idiom for the first time, explain it briefly in the conversation **and** add it to [docs/concepts/go.md](../docs/concepts/go.md). Idioms to explain on first use:
- packages and `internal/`, exported vs unexported names
- `defer`
- errors as values, wrapping with `%w`, `errors.Is` / `errors.As`
- interfaces (small, defined by the consumer), struct embedding
- `context.Context`, goroutines and channels, generics

Write idiomatic Go, not TypeScript in Go syntax:
- small interfaces, errors returned (no panics for control flow);
- no global DB variable: dependencies are passed in;
- `context.Context` as the first parameter;
- errors wrapped with context (`fmt.Errorf("load task: %w", err)`);
- short lower-case package names, `gofmt` formatting.

## Layout (target)
```
go.mod                 # module github.com/em1ttal/daybook/server; tools pinned with `tool` directives
cmd/api/main.go        # load config, open pgx pool, build router, listen, graceful shutdown
cmd/seed/main.go       # demo user, Inbox, sample lists/tasks (some this week)
api/openapi.yaml       # HAND-WRITTEN contract, source of truth
api/oapi-codegen.yaml
sqlc.yaml
.air.toml              # live reload in dev
internal/
  config/              # env parsing + validation, fail fast on startup
  httpapi/             # gen.go (oapi-codegen output, committed) + handlers implementing StrictServerInterface
  middleware/          # recover, request log, security headers, Origin check, session auth, CORS (dev), rate limit
  problem/             # RFC 9457 problem+json helpers, stable `code`s
  auth/ users/         # argon2id, sessions, accounts
  lists/ statuses/ tasks/ labels/ checklist/   # business rules + transactions per domain
  files/               # uploads; storage/ with the Storage interface, localfs (M4) and s3 (step 2)
  db/
    migrations/        # goose .sql files, embedded with go:embed
    queries/*.sql      # hand-written SQL, sqlc input
    sqlc/              # sqlc output (committed)
  testutil/            # test DB setup (daybook_test), fixtures
Dockerfile             # step 2
```
Design docs: [data model](../docs/architecture/data-model.md), [API](../docs/architecture/api.md), [files](../docs/architecture/files-and-images.md).

## Stack
| Concern | Choice |
|---|---|
| HTTP | Standard library `net/http` `ServeMux` (method + path patterns). No framework. Middleware are `func(http.Handler) http.Handler`. |
| Contract | Spec-first: edit `openapi.yaml` **first**, then `make gen`, then implement. `oapi-codegen` strict server, std-http. |
| Validation | `kin-openapi` request validator (from the spec) + domain rules in services |
| DB | `pgx/v5` + `pgxpool`; **sqlc** for queries (no ORM); **goose** migrations, run on demand (`make migrate`), not at startup |
| Passwords | `golang.org/x/crypto/argon2`, argon2id, PHC-encoded string with salt + params |
| Sessions | 32 random bytes (`crypto/rand`), SHA-256 hash stored, cookie `HttpOnly; Secure; SameSite=Lax`; bearer tokens (step 3) use the same table |
| Logging | `log/slog`: JSON in prod, text in dev. Never passwords, tokens, cookies. |
| Security | own security-headers middleware, `rs/cors` (dev only), `golang.org/x/time/rate` per-IP limiter on auth routes |
| Docs | serve `openapi.yaml` + a Swagger UI / Scalar page at `/api/docs` |
| Tools | `sqlc`, `goose`, `oapi-codegen`, `air`, `govulncheck` via `go tool` (pinned in `go.mod`); `golangci-lint` installed as a binary |
| Huma spike | after M3, on a throwaway branch: `/health` + lists with Huma (code-first) to compare. Don't merge; write up the comparison. |

## Rules
- **Every query filters by `user_id`** from the session. Return 404, not 403, for another user's resource.
- SQL: snake_case, explicit `ON DELETE`, composite FKs `(parent_id, user_id)` as in the data model, an index on every FK, `(user_id, scheduled_start)` and `(user_id, due_date)`.
- Transactions: pass `pgx.Tx` / a query interface down. Moving a task (status + positions) is one transaction.
- Errors to clients are problem+json with a stable `code`; never leak SQL or stack traces.
- No user-facing prose from the server. Default names it creates (Inbox, To do/Doing/Done) come from the user's locale.
- Security checklist: [docs/security/backend.md](../docs/security/backend.md) (and [files.md](../docs/security/files.md) in M4).

## Tests
- **Unit** (table-driven, no I/O): position maths, `due=today` ranges in a time zone, validation, password hash round-trip.
- **Integration** (main layer): the real router via `httptest` against a real Postgres `daybook_test`, migrated fresh, each test isolated (transaction or truncate). Cover the auth flow, CRUD, **cross-user → 404**, the move-task transaction, validation `code`s, and security behaviour (Origin check, rate limit, headers, expired session).
- **Contract:** check responses against `openapi.yaml` with kin-openapi.
- Every bug fix gets a regression test.

## Commands (from the repo root, once they exist)
```bash
make gen          # oapi-codegen + sqlc generate
make migrate      # go tool goose up
make seed         # go run ./cmd/seed
make test         # go test ./...
make lint         # gofmt -l, go vet, golangci-lint, govulncheck
```
Before saying a task is done: `go vet ./...`, `go build ./...`, the tests, and lint.
