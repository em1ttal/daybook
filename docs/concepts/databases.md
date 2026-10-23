# Databases

### Migrations
Versioned, ordered SQL files that change the database schema (`001_create_users.sql`, `002_add_tasks.sql`…). The database records which ones have already run, so every environment (my laptop, CI, the server) ends up with exactly the same schema by running "all migrations not yet applied". They are committed to Git like code.

### Transactions
A group of SQL statements that succeed or fail together (`BEGIN … COMMIT`, or `ROLLBACK` on error). Moving a task changes its column and also shifts other tasks' positions. Without a transaction, a crash halfway through could leave two tasks in the same position.

### Composite foreign keys
A foreign key over more than one column: `FOREIGN KEY (list_id, user_id) REFERENCES lists (id, user_id)`. The parent needs a matching `UNIQUE (id, user_id)`. daybook uses them so a child row (a status, a task) can only point at a parent owned by the **same user**. The database enforces it even if the application code has a bug.

### UUIDv7
A 128-bit ID whose first bits are a timestamp and the rest random. Like UUIDv4 it can't be guessed or counted, but new IDs sort after old ones, so the primary-key index grows at one end instead of being scattered. Postgres 18 generates them with `uuidv7()`.

### Object storage
A service that stores files ("objects") under a key, like a huge dictionary: `PUT key → bytes`, `GET key → bytes`. It's built for large blobs, cheap per GB, and can hand out temporary *presigned URLs* so clients download directly. Amazon S3 defined the API; Cloudflare R2 and MinIO speak the same one.
