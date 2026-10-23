# 0006 · Ordering tasks: integer positions with gaps
*2026-10-23 · accepted*

- **Why:** positions go 1000, 2000, 3000… so moving a task between two others gives it the midpoint (e.g. 1500), which updates one row. When there's no gap left, that column is renumbered inside a [transaction](../concepts/databases.md#transactions). The alternative, fractional-index strings, never needs renumbering but is harder to read in `psql`.
