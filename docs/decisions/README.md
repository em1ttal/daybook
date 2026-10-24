# Decision log

Each design decision gets one short file (an *ADR*, architecture decision record). Records are never rewritten: if a decision changes, a new record **supersedes** the old one, and the old one's status line says so.

| # | Decision | Status |
|---|---|---|
| [0001](0001-go.md) | Backend language: Go | accepted |
| [0002](0002-spec-first-openapi.md) | API contract: spec-first OpenAPI | accepted |
| [0003](0003-postgresql.md) | Database: PostgreSQL over SQLite | accepted |
| [0004](0004-sqlc-and-goose.md) | Data access: sqlc + goose, not an ORM | accepted |
| [0005](0005-cookie-sessions.md) | Auth: server-side sessions in a cookie | accepted |
| [0006](0006-position-gaps.md) | Ordering tasks: integer positions with gaps | accepted |
| [0007](0007-visual-identity.md) | Visual identity: Ivory/Fern light, Dim Grey/Lavender dark | accepted |
| [0008](0008-multilingual.md) | Multilingual from the start | accepted (location superseded by 0012) |
| [0009](0009-testing-strategy.md) | Testing strategy: a test pyramid | accepted |
| [0010](0010-ci-by-hand.md) | CI: rebuild the workflow by hand | accepted |
| [0011](0011-file-storage.md) | Files: metadata in Postgres, bytes in object storage | accepted |
| [0012](0012-locale-folders.md) | Languages: one folder per locale at the repo root | accepted |
| [0013](0013-colour-keys.md) | User-picked colours are palette keys | accepted |
| [0014](0014-docs-structure.md) | Docs: many short files | accepted |
| [0015](0015-security-learning-track.md) | Security as a learning track | accepted |
| [0016](0016-selectable-icons.md) | App icons: several, chosen by each user | accepted |
| [0017](0017-go-project-layout.md) | Go project layout: official guide, packages by domain | accepted |

## Template

```markdown
# NNNN · Title
*YYYY-MM-DD · accepted | superseded by NNNN*

- **Context:** what problem or constraint prompted this.
- **Options:** the realistic alternatives, with trade-offs.
- **Choice:** what was picked.
- **Why:** the reasoning, and what would make me revisit it.
```
