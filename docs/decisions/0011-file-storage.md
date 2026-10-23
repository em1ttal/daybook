# 0011 · Files: metadata in Postgres, bytes in object storage
*2026-10-23 · accepted*

- **Context:** tasks need attachments (images, PDFs) and users need a profile picture. Files can be large, and the app moves to the cloud in step 2.
- **Options:** bytes in Postgres (`bytea`); files on the server's disk; object storage (S3-compatible) behind an interface.
- **Choice:** a `files` metadata table, and bytes in object storage behind a Go `Storage` interface: a local folder in dev, Cloudflare R2 in production. Uploads go through the API for now. Downloads use short-lived URLs.
- **Why:** keeps the database and its backups small, and a server's disk disappears when the server is replaced. The interface makes the switch to R2 a config change, and it's a good first Go interface to write. Direct-to-R2 uploads and thumbnails are left for when there are many files. Details: [files and images](../architecture/files-and-images.md).
