# Repository layout

This tree is updated whenever the structure changes. Folders marked *planned* don't exist yet.

```
daybook/
├── package.json         # root: npm workspaces ["web"]; `npm run dev|build|lint|format` forward to web/
├── package-lock.json    # one lockfile for every workspace
├── web/                 # the Vue 3 + Vite front end (workspace "@daybook/web")
│   ├── package.json     # web's own dependencies and scripts
│   ├── index.html       # Vite entry page
│   ├── vite.config.js   # base path /daybook/ (GitHub Pages), "@" alias → web/src
│   ├── eslint.config.js, jsconfig.json
│   ├── public/          # static files copied as-is (favicon)
│   └── src/
│       ├── main.js, App.vue
│       ├── router/      # routes + auth guard
│       ├── views/       # one component per page (Home, Login, Dashboard, Board)
│       ├── components/  # home/, dashboard/, board/ building blocks
│       ├── services/    # the "API" layer; fake today, real fetch calls in M3
│       ├── data/        # in-memory mock data (deleted in M3)
│       ├── styles/tokens.css  # daybook colour/space tokens (see the style guide)
│       └── utils/
├── server/              # planned (M0 step 2): Go API
├── docs/                # these docs (start at docs/README.md)
├── scripts/check-contrast.mjs   # prints WCAG contrast ratios for the palette
├── .editorconfig, .prettierrc.json, .gitattributes, .vscode/   # shared by every package
├── CLAUDE.md            # instructions for the AI assistant: plan, stack, conventions
└── README.md
```
