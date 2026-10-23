# 0004 · Data access: sqlc + goose, not an ORM
*2026-10-23 · accepted*

- **Why:** I write plain SQL (which teaches me SQL), and sqlc generates type-safe Go functions from it, so a typo in a column name fails at build time rather than at runtime. Goose runs [migrations](../concepts/databases.md#migrations) that are plain `.sql` files committed to Git. An ORM like GORM hides the SQL, which is the part I want to learn.
