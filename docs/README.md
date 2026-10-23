# daybook docs

> A living build log and portfolio write-up for all four steps of daybook. Every milestone adds a short chapter: what was built, the concepts behind it, the security angle, and the mistakes along the way. Written so that someone new to the topic (including me, months from now) can follow it.

## Start here
1. **[What daybook is](product/vision.md)**: the idea, the roadmap and the learning tracks.
2. **[Setup](setup.md)**: everything to install, step by step.
3. **[Architecture overview](architecture/overview.md)**: the big picture, and the life of one request.
4. **[Step 1 plan](steps/1-planner/README.md)**: the milestones, and the build log so far.

## Map

| Folder | What's in it |
|---|---|
| [product/](product/vision.md) | [Vision and roadmap](product/vision.md) · [features and screens](product/features.md) |
| [architecture/](architecture/overview.md) | [Overview](architecture/overview.md) · [repository layout](architecture/repository.md) · [data model](architecture/data-model.md) · [API](architecture/api.md) · [files and images](architecture/files-and-images.md) · [i18n](architecture/i18n.md) |
| [design/](design/style-guide.md) | [Style guide](design/style-guide.md) · [icon](design/icon.md) |
| [security/](security/README.md) | Threat model, then one checklist per area: backend, frontend, files, cloud, native apps, CI |
| [decisions/](decisions/README.md) | One short record per design decision (append-only) |
| [steps/](steps/1-planner/README.md) | Build log: [1 · planner](steps/1-planner/README.md) · [2 · cloud](steps/2-cloud/README.md) · [3 · iOS](steps/3-ios/README.md) · [4 · macOS](steps/4-macos/README.md) |
| [concepts/](concepts/README.md) | Glossary by topic: Git, Go, databases, HTTP, security, testing and CI, i18n |
| [resources.md](resources.md) | Links to official docs |

## Which file to update when
- Built something → the milestone's chapter in `steps/`, and tick its box in the step's `README.md`.
- Made a design choice → a new file in `decisions/` (never edit an old one; supersede it).
- Met a new concept → an entry in `concepts/`.
- Changed the database, API or folders → the matching page in `architecture/`.
