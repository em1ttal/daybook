# web/CLAUDE.md — the Vue app

Rules for working in `web/`. The root [`CLAUDE.md`](../CLAUDE.md) still applies.

## What's here today
A Vue 3 + Vite 6 + vue-router single-page app, inherited from KanbanIA. Spanish UI and comments. Paths below are relative to `web/`.

```
index.html                  # lang="es", title "KanbanIA"
src/
  main.js, App.vue
  router/index.js           # / (Home), /login, /dashboard, /board/:id; guard via authService.isAuthenticated()
  views/                    # HomeView, LoginView, DashboardView, BoardView (very large: kanban + DnD + modals)
  components/               # home/ (landing page), dashboard/, board/ (TaskCard, TaskModal, CommentSection, stats/)
  services/                 # authService, boardService, columnService, taskService, labelService,
                            # checklistService, commentService, userService
  data/                     # in-memory mock "DB": boards, columns, tasks, labels, users
  styles/tokens.css         # daybook design tokens
  utils/asyncUtils.js       # delay(ms), fakes network latency
```

Key facts:
- **Services are the seam.** Every service function is `async`, does `await delay(300)`, then mutates `src/data/`. Moving to the API means replacing their bodies with `fetch` calls (M5). Keep signatures stable where reasonable so views change little.
- **Auth is fake:** `MOCK_USERS` in `authService.js` (`demo@example.com` / `demo123`) and a base64 "token" in `localStorage`. It's replaced by the real session cookie in M5. Never store auth tokens in `localStorage`.
- **Old data shapes:**
  - boards `{id, title, description, lastActivity, members[], owner}`; columns `{id, title, taskIds[]}`;
  - tasks keyed `'task-<n>'`, with hex `labels`, `timeEstimation` in hours, one `checklist` object (`BoardView` wrongly defaults `checklists: []`), `comments[]`, `assignedMembers[]`, `blocked`/`blockReason`.

  The new model is in [docs/architecture/data-model.md](../docs/architecture/data-model.md). Map to it, don't copy the old shapes.
- `vite.config.js` `base` is `/daybook/` (GitHub Pages path).
- No tests, no TypeScript yet. Known lint errors (unused variables) are fixed in M0.

## Target (M5–M6)
- `src/api/client.js`: fetch wrapper. Base URL from `import.meta.env.VITE_API_URL`, `credentials: 'include'`, JSON, and problem+json `code` → a translated message. Vite dev proxy `/api → http://localhost:8080` keeps cookies same-origin.
- `src/stores/`: **Pinia** stores (`useAuthStore` cached from `/auth/me`, then per domain). They replace ad-hoc refs shared across views.
- `src/i18n/`: the `vue-i18n` setup that discovers `../locales/*/messages.json` with `import.meta.glob` (needs an `@locales` alias and `server.fs.allow: ['..']`). See [docs/architecture/i18n.md](../docs/architecture/i18n.md).
- Routes: `/today` (home after login), `/calendar`, `/lists`, `/lists/:id`, `/settings`, `/login`, `/register`.
- Calendar: FullCalendar (`@fullcalendar/vue3`, daygrid/timegrid/interaction) or Schedule-X. Check the licences of the plugins used (drag-and-drop must be free/MIT), and ask Eshaan if unsure.

## Conventions
- Composition API with `<script setup>`. Keep components small: split `BoardView.vue` into column/task-list components as you touch it.
- **Strings:** every user-facing string through `t('feature.key')`, including `aria-label`, `title`, `placeholder` and alt text. Plurals and placeholders in the message, never string concatenation. Dates and numbers via `Intl` (`d()`/`n()`).
- **Styling:**
  - Follow [docs/design/style-guide.md](../docs/design/style-guide.md). New or touched UI uses semantic tokens only (`var(--color-*)`), never raw hex.
  - The old dark gradient (`#1a1a2e → #16213e`) and glassy cards are being replaced.
  - Use CSS logical properties (`margin-inline-start`) so right-to-left languages stay possible.
  - User-picked colours are palette keys ([0013](../docs/decisions/0013-colour-keys.md)).
  - Run `node scripts/check-contrast.mjs` (from the root) after any colour change.
- **Security:** follow [docs/security/frontend.md](../docs/security/frontend.md). No `v-html` on user content; no secrets in `VITE_*` variables (the bundle is public).
- **Tests (from M5):** Vitest + Vue Test Utils for stores, the API client and components with logic. Fake the API with **MSW**, not hand-mocked `fetch`. Explain each test's level.
- TypeScript: only after M5, gradually (new files in `.ts` / `<script setup lang="ts">`), and ask first.
- Translate Spanish comments to English in files you touch.

## Commands
From the repo root: `npm run dev`, `npm run build`, `npm run lint`, `npm run format`. Inside `web/`, the same scripts work without the `-w web` prefix.
