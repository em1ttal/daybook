# Repository layout

Two trees: what exists **today**, and the **target** for all four steps. Every new folder is created at its target path, so nothing has to move later. Folders aren't created before they're needed: Git doesn't track empty folders, and placeholders go stale.

## Today

```
daybook/
├── package.json         # root: npm workspaces ["web"]; npm run dev|build|lint|format forward to web/
├── package-lock.json    # one lockfile for every workspace
├── web/                 # the Vue 3 + Vite front end (workspace "@daybook/web")
│   ├── CLAUDE.md        # rules for the AI assistant when working in web/
│   ├── package.json, index.html, vite.config.js, eslint.config.js, jsconfig.json
│   ├── public/          # static files copied as-is (favicon)
│   └── src/             # main.js, App.vue, router/, views/, components/, services/ (fake API),
│                        # data/ (mock data), styles/tokens.css, utils/
├── server/CLAUDE.md     # the Go plan; the code starts in M0
├── docs/                # these docs (start at docs/README.md)
├── scripts/check-contrast.mjs
├── .editorconfig, .prettierrc.json, .gitattributes, .vscode/   # shared by every package
├── CLAUDE.md            # instructions for the AI assistant
└── README.md
```

## Target

The tag after each folder says when it appears (M = step 1 milestone, see [step 1](../steps/1-planner/README.md)).

```
daybook/
├── CLAUDE.md, README.md, LICENSE
├── package.json         # workspaces + scripts that call the Makefile            (M0)
├── Makefile             # Go/DB tasks: gen, migrate, seed, test, lint             (M0)
├── docker-compose.yml   # Postgres for local dev                                  (M2)
├── .env.example, .nvmrc                                                           (M0)
├── brand/icons/<id>/    # icon masters (light.svg, dark.svg), shared by web and Apple (M1)
├── locales/             # one folder per language: <code>/messages.json + flag.svg (M5)
│   ├── en/
│   └── es/
├── server/              # Go API, its own Go module                               (M0–M4)
│   ├── CLAUDE.md
│   ├── go.mod
│   ├── cmd/api/         # entrypoint: config, DB pool, router, graceful shutdown
│   ├── cmd/seed/        # demo user + sample data
│   ├── api/openapi.yaml # the hand-written API contract
│   └── internal/
│       ├── config/      # env parsing, fail fast
│       ├── httpapi/     # generated server code + handlers
│       ├── middleware/  # logging, recover, auth, CSRF/Origin, CORS, rate limit, headers
│       ├── problem/     # RFC 9457 error responses
│       ├── auth/ users/                     # accounts, passwords, sessions
│       ├── lists/ statuses/ tasks/ labels/ checklist/   # planner domains
│       ├── files/       # uploads + storage/ (localfs now, s3 in step 2)          (M4)
│       ├── db/          # migrations/, queries/ (SQL), sqlc/ (generated)
│       └── testutil/    # test database helpers
├── web/                 # Vue app                                                 (now)
│   ├── CLAUDE.md
│   └── src/             # adds api/ (fetch client), stores/ (Pinia), i18n/ (loader) (M5)
├── infra/               # step 2: production compose, Caddyfile, backup scripts
├── apple/               # steps 3–4: one Xcode project, iOS + macOS targets
│   └── CLAUDE.md
├── scripts/             # check-contrast, gen-icons (M1), check-locales (M5)
├── docs/
├── .github/workflows/   # CI, written by hand                                     (M3+)
└── var/                 # gitignored: local uploads in dev                        (M4)
```

### Why these places
- **`locales/` and `brand/` at the root**, not inside `web/`: the Apple apps (and the server, for error codes) use the same files. See [i18n](i18n.md).
- **`server/` is not an npm workspace.** Go has its own module system. The root `package.json` and the `Makefile` are the single entry point for commands.
- **`apple/` holds one Xcode project** with an iOS target and a macOS target, sharing most SwiftUI code. Steps 3 and 4 build in the same folder.
- **`infra/`** holds only deployment files. The API's `Dockerfile` lives in `server/`, next to the code it builds.
