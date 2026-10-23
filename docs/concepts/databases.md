# Databases

### Migrations
Versioned, ordered SQL files that change the database schema (`001_create_users.sql`, `002_add_tasks.sql`…). The database records which ones have already run, so every environment (my laptop, CI, the server) ends up with exactly the same schema by running "all migrations not yet applied". They are committed to Git like code.

### Transactions
A group of SQL statements that succeed or fail together (`BEGIN … COMMIT`, or `ROLLBACK` on error). Moving a task changes its column and also shifts other tasks' positions. Without a transaction, a crash halfway through could leave two tasks in the same position.
