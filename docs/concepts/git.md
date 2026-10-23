# Git and repo structure

### git mv and history
Git doesn't really record renames. It stores snapshots and *detects* a rename when a deleted file and an added file have nearly the same content. `git mv` is `mv` plus `git add`, and moving files *without editing them in the same commit* keeps the content identical, so `git log --follow web/src/App.vue` still shows the file's history from before the move.

### Monorepo
One repository holding several projects (here a Vue app now, a Go API next). Cross-cutting changes, like an API change plus the frontend that uses it, land in one PR.

### npm workspaces
The root `package.json` lists sub-packages (`"workspaces": ["web"]`). `npm install` at the root installs every workspace into one shared `node_modules` with one `package-lock.json`, and `npm run dev -w web` runs a script inside that workspace.
