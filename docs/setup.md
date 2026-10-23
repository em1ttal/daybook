# Setup

Everything to install, grouped by step. Install only the current step's tools. Each tool has a command to check that it worked. Commands are for macOS with [Homebrew](https://brew.sh).

*Versions checked on 2026-10-23: Go 1.27.3, Node.js 24 LTS ("Krypton"). Node 26 becomes LTS at the end of October 2026; check [nodejs.org](https://nodejs.org/en/about/previous-releases) before pinning `.nvmrc`.*

## Step 1 · Planner web app + local backend

| Tool | What it's for | Install | Check |
|---|---|---|---|
| Homebrew | Installs everything else | see [brew.sh](https://brew.sh) | `brew --version` |
| Git | Version control | `brew install git` | `git --version` |
| fnm | Switches Node versions per project; reads `.nvmrc` | `brew install fnm`, then add `eval "$(fnm env --use-on-cd)"` to `~/.zshrc` | `fnm --version` |
| Node.js (LTS) | Runs Vite and the web tooling | `fnm install` in the repo (uses `.nvmrc`) | `node -v` |
| Go | Builds and runs the API | `brew install go` | `go version` |
| Docker runtime | Runs Postgres in a container | [OrbStack](https://orbstack.dev) (lighter on a Mac) or [Docker Desktop](https://www.docker.com/products/docker-desktop/) | `docker compose version` |
| golangci-lint | Go linter (many checks in one tool) | `brew install golangci-lint` | `golangci-lint --version` |
| psql | Command-line Postgres client | `brew install libpq`, then `brew link --force libpq` | `psql --version` |
| A database GUI (optional) | Browse tables visually | [TablePlus](https://tableplus.com) or [DBeaver](https://dbeaver.io) | open it |
| GitHub CLI (optional) | Pull requests from the terminal | `brew install gh`, then `gh auth login` | `gh --version` |

**VS Code extensions:** Go (`golang.go`), Vue (`Vue.volar`), ESLint, Prettier, EditorConfig. The repo suggests them in `.vscode/extensions.json`.

### Go tools you don't install
`sqlc`, `goose`, `oapi-codegen`, `air` and `govulncheck` are pinned in `server/go.mod` with `tool` directives and run with `go tool <name>`. The first run downloads the exact version in `go.mod`, so everyone (and CI) uses the same version, with nothing installed globally. `golangci-lint` is the exception: its maintainers recommend the prebuilt binary.

### First run
```bash
git clone https://github.com/em1ttal/daybook.git && cd daybook
fnm install          # Node version from .nvmrc
npm install          # installs web/ through npm workspaces
npm run dev          # → http://localhost:5173/daybook/
```
From M2 on, also: `npm run db:up && npm run db:migrate && npm run db:seed`.

### GitHub security settings
One-time, in the repo on github.com → **Settings → Code security**:
1. Turn on **Dependabot alerts** and **Dependabot security updates**.
2. Turn on **Secret scanning** and **Push protection**, so GitHub blocks a push that contains a key or token.
3. (M7) Set up **CodeQL** code scanning, and add a branch protection rule for `main` (required checks, no force pushes).

Why: [security/ci-and-supply-chain.md](security/ci-and-supply-chain.md).

## Step 2 · Cloud hosting (outline)
- An SSH key: `ssh-keygen -t ed25519`, with a passphrase.
- Accounts: a VPS provider, Cloudflare (DNS, Pages, R2).
- The VPS gets Docker and Caddy through `infra/`. Nothing more to install on the Mac.

## Steps 3–4 · iOS and macOS (outline)
- Xcode from the Mac App Store, then `xcode-select --install` for the command-line tools.
- An Apple Developer account for devices and TestFlight (free for running on your own device, paid for distribution).
