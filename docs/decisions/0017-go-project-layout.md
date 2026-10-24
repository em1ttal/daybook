# 0017 · Go project layout: the official module guide, packages by domain
*2026-10-24 · accepted*

- **Context:** I want the Go server structured the way experienced Go developers expect, and to understand why. The popular [golang-standards/project-layout](https://github.com/golang-standards/project-layout) repo looks like a standard, but it says itself that it isn't one and is overkill for small projects.
- **Options:** copy the full golang-standards tree; follow the Go team's [module layout guide](https://go.dev/doc/modules/layout); invent my own.
- **Choice:** the official guide's *server project* layout: `cmd/<program>/` for each binary, all logic in `internal/`, plus `api/` for the OpenAPI spec. Packages are split by **domain** (`tasks`, `auth`, `files`), not by layer (`handlers`, `services`). No `/pkg`, no `/vendor`, no `/src`. Other golang-standards folders map to the monorepo root (`web/`, `scripts/`, `docs/`, `infra/`, `brand/`).
- **Why:** `internal/` is enforced by the compiler, so the code can be refactored without breaking anyone. Domain packages keep a feature in one place and make dependencies between features visible. Using the golang-standards *names* where a folder is needed means other Go developers recognise the layout. Full explanation: [server-layout.md](../architecture/server-layout.md).
