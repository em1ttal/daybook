# M1 · Define the app
*Status: in review*

- **Goal:** decide what daybook is and how it's built, *before* writing backend code, so the database, API and folders don't have to change shape later.
- **What I built** (all docs):
  - [Features and screens](../../product/features.md): a single-person planner with lists, a calendar and a Today view.
  - [Data model](../../architecture/data-model.md): ten tables, with `user_id` on every owned row and composite foreign keys.
  - [API](../../architecture/api.md): endpoints, status codes, problem+json error codes.
  - [Files and images](../../architecture/files-and-images.md): metadata in Postgres, bytes in object storage.
  - [i18n](../../architecture/i18n.md): one folder per language at the repo root.
  - [Security plan](../../security/README.md), [setup guide](../../setup.md), [target repository layout](../../architecture/repository.md), and a new icon ([design/icon.md](../../design/icon.md)).
- **Concepts:**
  - **Design before code.** Changing a table after it has data needs a migration and sometimes a data fix. Changing a doc costs nothing.
  - **Composite foreign keys.** A status points at `(list_id, user_id)` on `lists`, not only `list_id`. The database itself guarantees that a child row and its parent belong to the same user:
    ```sql
    FOREIGN KEY (list_id, user_id) REFERENCES lists (id, user_id) ON DELETE CASCADE
    ```
  - **Object storage.** A service for storing files ("objects") by key, like a huge dictionary. Cheaper and simpler than a database for large blobs. Amazon S3 defined the API that most providers (Cloudflare R2, MinIO) copy.
- **Security:** writing the threat model first ([security/README.md](../../security/README.md)) shaped the design: 404 instead of 403, `user_id` everywhere, the Origin check, no SVG uploads.
- **Try it yourself:** read [data-model.md](../../architecture/data-model.md) and try to answer: what happens to a task's labels when its list is deleted? (Answer: the task is deleted with its list, and `task_labels` rows go with it. The labels themselves stay.)
- **Gotchas:** _(to be filled in after review)_
- **What I'd do differently:** _(to be filled in)_
