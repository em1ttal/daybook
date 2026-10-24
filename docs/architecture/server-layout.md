# How the Go server is laid out, and why

Go itself only cares about **modules** (a folder with a `go.mod`) and **packages** (one folder = one package). Everything else about folder names is convention. Decision record: [0017](../decisions/0017-go-project-layout.md).

## Two sources, and which one wins
- **The official guide:** [Organizing a Go module](https://go.dev/doc/modules/layout), from the Go team. It's short, and it's what daybook follows. For a server it says: *"it's recommended to keep the Go packages implementing the server's logic in the `internal` directory"* and *"it's a good idea to keep all Go commands together in a `cmd` directory."*
- **[golang-standards/project-layout](https://github.com/golang-standards/project-layout):** a popular community repo listing folders seen in big Go projects. Despite the name, it says itself that it is *"NOT an official standard defined by the core Go dev team"*, and that for learning or personal projects *"this project layout is an overkill"*. It's useful as a **vocabulary**: when you see `/cmd` or `/deployments` in someone's repo, you know what it means. daybook borrows names from it where a folder is needed, and skips the rest.

## The server's folders

```
server/
├── go.mod               # the module: github.com/em1ttal/daybook/server
├── cmd/
│   ├── api/main.go      # one folder per program you can run
│   └── seed/main.go
├── api/openapi.yaml     # the API contract (not Go code)
└── internal/            # all the Go code that isn't a main()
    ├── config/  middleware/  problem/  httpapi/
    ├── auth/  users/  lists/  statuses/  tasks/  labels/  checklist/  files/
    ├── db/              # migrations/, queries/, sqlc/
    └── testutil/
```

### `cmd/<program>/`
Each folder holds a `package main` that builds into one binary: `go build ./cmd/api` gives an `api` program, `go run ./cmd/seed` runs the seeder. **Keep `main.go` thin:** read config, build the pieces, wire them together, start. Logic in `main` can't be tested or reused, so it goes in `internal/`.

### `internal/`
This one is enforced by the **compiler**, not just convention: code under `internal/` can only be imported from inside the folder that contains it (here, `server/`). Nothing outside can depend on it, so it can be renamed and refactored freely. The official guide recommends keeping code in `internal` *"as much as possible"*. A server exports nothing, so all of its packages live here.

### Packages by domain, not by layer
Two ways to slice a backend:

| By layer | By domain (daybook) |
|---|---|
| `handlers/`, `services/`, `repositories/`, `models/` | `tasks/`, `lists/`, `auth/`, `files/` |
| Adding a feature touches four folders | Adding a feature mostly touches one |
| Everything can import everything | Dependencies between domains are visible in the imports |

Go culture prefers packages named after **what they provide**, so `tasks.Service` reads well at the call site. Avoid grab-bag names like `utils`, `common`, `helpers` or `models`: they say nothing and attract unrelated code. The exceptions are cross-cutting packages that really are one job each: `middleware`, `problem`, `config`, and `httpapi` (the generated server code).

### `api/`
Contract files that aren't Go: here, `openapi.yaml`. The same name `golang-standards` uses for *"API specifications and schema or protocol definition files"*.

### `testdata/`
Any package can have a `testdata/` folder for test fixtures. The Go tool ignores folders with this exact name when building, so fixtures never end up in the binary. (Ordinary tests sit next to the code as `*_test.go`; Go has no separate test tree.)

## The golang-standards folders, mapped to daybook

daybook is a monorepo, so several of these live at the **repo root** instead of inside `server/`, shared with the web and Apple apps.

| golang-standards | What it's for | In daybook |
|---|---|---|
| `/cmd` | Programs (`main` packages) | `server/cmd/` ✅ |
| `/internal` | Private code, compiler-enforced | `server/internal/` ✅ |
| `/api` | API specs | `server/api/` ✅ |
| `/pkg` | Code meant for *other* projects to import | **Skipped.** A server exports nothing. It's also the most disputed folder in the repo: it adds a level of nesting without the compiler protection `internal/` gives. |
| `/vendor` | Copies of dependencies | **Skipped.** Go modules + `go.sum` download exact versions; vendoring is for offline or locked-down builds. |
| `/src` | — | **Never.** The guide calls it a Java habit; in Go it's confusing because of the old `GOPATH/src`. |
| `/web` | Web assets and SPAs | Root `web/` (the Vue app is a project of its own) |
| `/configs` | Config templates | Root `.env.example`. Config comes from environment variables ([12-factor](https://12factor.net/config)). |
| `/scripts` | Build and tooling scripts | Root `scripts/` + the `Makefile` |
| `/build` | Packaging and CI | `server/Dockerfile` (step 2) + `.github/workflows/` |
| `/deployments` | Deployment configs | Root `infra/` (step 2) |
| `/test` | Extra test apps and data | `internal/testutil/` + `testdata/` folders. Tests live next to the code. |
| `/tools` | Supporting tools | `tool` directives in `go.mod` (`go tool sqlc`), no folder needed |
| `/docs` | Documentation | Root `docs/` |
| `/assets` | Images, logos | Root `brand/` |
| `/init`, `/githooks`, `/examples`, `/third_party`, `/website` | — | Not needed |

## Rules of thumb
- **Start small, add folders when there's code to put in them.** The M0 skeleton is just `go.mod` and `cmd/api/main.go`; `internal/` packages appear as each feature is built.
- One folder = one package; the package name is the last part of the folder path (`internal/tasks` → `package tasks`).
- If two domains need each other, that's a design smell: move the shared part into a smaller package, or let the higher-level one call the lower-level one, never both ways. Go refuses import cycles at compile time.
