# File upload security

*Applies from step 1, M4.* Design: [architecture/files-and-images.md](../architecture/files-and-images.md).

- [ ] **Size limit** with `http.MaxBytesReader` (10 MB). Stops disk and memory exhaustion.
- [ ] **Sniff the type from the bytes**, with an allow-list (JPEG, PNG, WebP, GIF, PDF). The client's `Content-Type` and file extension can be faked.
- [ ] **No SVG or HTML uploads.** Both can contain scripts that run if the file is opened in the browser.
- [ ] **Strip EXIF metadata** from images by re-encoding them. Phone photos contain GPS coordinates.
- [ ] **Random storage keys**, never the user's file name. Stops path traversal (`../../etc/passwd`) and overwrites.
- [ ] Serve with `X-Content-Type-Options: nosniff`, and `Content-Disposition: attachment` for anything that isn't an image.
- [ ] **Private bucket + short-lived URLs** (15 minutes). A copied link stops working.
- [ ] Ownership check on every file endpoint (another user's file → 404).
- [ ] Image decoding limits (max pixel dimensions), to block "decompression bombs": tiny files that expand to gigabytes in memory.
- [ ] Later: a per-user storage quota.

Tests: an 11 MB upload → 413 · a `.png` that is really HTML → 400 · an SVG → 400 · another user's file → 404 · EXIF gone after upload.
