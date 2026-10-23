# M0 · Repo prep
*Status: in progress (step 1 of 4 done)*

- **Goal:** turn a single Vue app into a monorepo with `web/` and `server/` folders, and add shared tooling.
- **What I built:**
  - Renamed the project to **daybook** and removed the inherited Pages workflow (see [0010](../../decisions/0010-ci-by-hand.md)).
  - Moved the Vue app into `web/` with `git mv`. Repo-wide config (`.editorconfig`, `.prettierrc.json`, `.gitattributes`, `.vscode/`) stayed at the root, because those tools search parent folders for their config file.
  - Added a root `package.json` that declares `web` as an npm workspace, and deleted the two stale lockfiles (`bun.lockb`, the old `package-lock.json`) so there is one fresh lockfile at the root.
  - _Still to do: Go module in `server/` with `GET /health`, root Makefile, `.nvmrc`, `.gitignore` for `.env`._
- **Concepts** (full entries in [concepts/git.md](../../concepts/git.md)):
  - **`git mv` and history.** Moving files *without editing them in the same commit* lets Git detect the rename, so `git log --follow web/src/App.vue` still shows the file's history from before the move.
  - **Monorepo.** One repository holding several projects, so an API change and the frontend that uses it land in one PR.
  - **npm workspaces.** The root `package.json` lists sub-packages:
    ```json
    "workspaces": ["web"],
    "scripts": { "dev": "npm run dev -w web" }
    ```
    The Go server is *not* a workspace: Go has its own module system (`go.mod`), and the root scripts will call it through the Makefile.
- **Try it yourself:**
  ```bash
  npm install                         # from the repo root
  npm run dev                         # → http://localhost:5173/daybook/
  git log --follow --oneline web/src/App.vue   # history survives the move
  npm ls --workspaces                 # what each workspace depends on
  ```
- **Gotchas:**
  - Renaming the GitHub repo redirects Git URLs but **not** GitHub Pages, so Vite's `base` path had to change from `/FH-p4-b3/` to `/daybook/`.
  - After moving the folder, my local `dev` branch was still tracking `origin/main`, so a plain `git push` went to `main`. Check with `git status -sb` (it shows `dev...origin/dev`) and fix with `git branch --set-upstream-to=origin/dev`.
  - Undoing that push meant moving `main` back with `git push --force-with-lease`. A `git revert` would have been wrong here: when `dev` is merged later, the revert commit would silently undo dev's changes. `--force-with-lease` only overwrites the branch if it is still at the commit you expect.
  - oxlint's `--ignore-path .gitignore` is resolved from the folder the command runs in. After the move, scripts run inside `web/`, so it became `--ignore-path ../.gitignore`.
  - Any push to `main`, including a force push, re-runs the workflows triggered by it. Moving `main` back rebuilt the old Pages site with the old `base` path and broke the live demo. Workflows react to *every* push, not just the ones you meant.
  - Rewriting the root `package.json` in the same commit as moving the old one to `web/` made Git see "edited + new file" instead of a rename. Splitting it into two commits (pure move, then the new file) kept the history.
- **What I'd do differently:** _(to be filled in)_
