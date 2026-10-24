# Go

### Go context
`context.Context` is passed as the first argument through every layer of a request. It carries a deadline or cancellation signal (if the browser disconnects, the database query is cancelled too) and request-scoped values such as the authenticated user's id.

### Modules and packages
A **module** is a folder with a `go.mod` file: a versioned unit with a name (`github.com/em1ttal/daybook/server`) and its dependencies. A **package** is one folder of `.go` files that all start with the same `package name` line. You import packages by path: `github.com/em1ttal/daybook/server/internal/tasks`. Go has no file-level imports and no folder-in-folder packages.

### `cmd/` and `internal/`
Two folder names with meaning. `cmd/<name>/` holds a `package main`, one per program. `internal/` is enforced by the compiler: only code inside the parent of `internal/` may import it, so it can be refactored without breaking anyone outside. See [server-layout.md](../architecture/server-layout.md).

### Exported names
A name starting with a capital letter (`tasks.Service`, `NewStore`) is visible outside its package; a lower-case one (`parseRange`) isn't. That's Go's only access control: no `public`/`private` keywords.
