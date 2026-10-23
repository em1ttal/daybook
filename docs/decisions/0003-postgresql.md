# 0003 · Database: PostgreSQL over SQLite
*2026-10-23 · accepted*

- **Why:** I'll use the same database locally, in the cloud and in the budgeting app. It has real `timestamptz`, `CHECK` constraints and `uuidv7()` (new in Postgres 18), and it is what most companies run. SQLite would be simpler locally but would need a migration later.
