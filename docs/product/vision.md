# What daybook is

daybook is my personal to-do app with a visual calendar: lists of tasks on kanban boards, plus a calendar and a "today" view showing what is scheduled and what is due. It started as **KanbanIA**, a university group project (Human Factors in Computing, with [Alejandro Penalba](https://github.com/APenalba)): a Vue front end with a fake, in-memory backend. I'm turning it into a real full-stack product to learn backend development, databases, security and cloud deployment from scratch.

What the app does, screen by screen: [features.md](features.md).

## Roadmap

| Step | What | Status |
|---|---|---|
| [1](../steps/1-planner/README.md) | Planner web app + Go API + PostgreSQL, run locally | 🚧 in progress |
| [2](../steps/2-cloud/README.md) | Cloud hosting (VPS, Docker Compose, Caddy; frontend on Cloudflare) | planned |
| [3](../steps/3-ios/README.md) | iOS app (SwiftUI) on the same API | planned |
| [4](../steps/4-macos/README.md) | macOS app (same SwiftUI codebase) | planned |

Each step has its own folder in [`steps/`](../steps/) with the plan and the build log.

## Learning tracks
Four topics run through every step instead of being a phase of their own:
- **Go and backend design**: see [concepts/go.md](../concepts/go.md)
- **Testing and CI**: see [0009](../decisions/0009-testing-strategy.md), [0010](../decisions/0010-ci-by-hand.md)
- **Internationalisation**: see [architecture/i18n.md](../architecture/i18n.md)
- **Security**: see [security/](../security/README.md)
