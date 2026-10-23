# API

The HTTP API that every client (web, iOS, macOS) uses. The source of truth will be the hand-written `server/api/openapi.yaml` ([0002](../decisions/0002-spec-first-openapi.md)). This page is the plan it's written from.

All JSON, all under `/api/v1`. Writing `:id` means a UUID.

## Endpoints

| Area | Endpoints | Milestone |
|---|---|---|
| Health | `GET /health` (no auth) | M0 |
| Auth | `POST /auth/register` (can be turned off by env flag), `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`, `PATCH /auth/me` (display name, time zone, locale, avatarFileId) | M3 |
| Sessions | `GET /auth/sessions`, `DELETE /auth/sessions/:id` ("log out other devices") | M3 |
| Lists | `GET/POST /lists`, `GET/PATCH/DELETE /lists/:id` | M3 |
| Statuses | `GET/POST /lists/:id/statuses`, `PATCH/DELETE /statuses/:id`, `POST /lists/:id/statuses/reorder` | M3 |
| Tasks | `GET /tasks?listId=&statusId=&from=&to=&due=today\|overdue&completed=`, `POST /tasks`, `GET/PATCH/DELETE /tasks/:id`, `POST /tasks/:id/move` (status + position in one transaction) | M3 |
| Labels | `GET/POST /labels`, `PATCH/DELETE /labels/:id`. Assign with `PATCH /tasks/:id {labelIds}`. | M3 |
| Checklist | `POST /tasks/:id/checklist`, `PATCH/DELETE /checklist-items/:id` | M3 |
| Files | `POST /files` (multipart upload), `GET /files/:id`, `GET /files/:id/content`, `DELETE /files/:id`, `POST /tasks/:id/attachments {fileId}`, `DELETE /tasks/:id/attachments/:fileId` | M4 |

`from`/`to` power the calendar: they return tasks whose time block or due date falls in that range.

## Conventions
- **Status codes:** 201 + the new resource on create, 204 on delete, 400 for validation errors, 401 when not logged in, 404 when not found, 409 for conflicts (e.g. deleting a status that still has tasks), 413 for an upload that's too big, 429 when rate-limited.
- **404, not 403, for another user's resource.** A 403 would confirm that the ID exists.
- **JSON is camelCase**, SQL is snake_case. Dates are `YYYY-MM-DD`; moments are RFC 3339 in UTC (`2026-10-23T09:00:00Z`).
- **Pagination:** limit + cursor on endpoints whose results can grow (tasks, files).
- **PATCH** sends only the fields that change. `null` clears a nullable field.

## Errors: RFC 9457 problem+json
Every error has the same shape, with content type `application/problem+json`:

```json
{
  "type": "/problems/validation",
  "title": "Validation failed",
  "status": 400,
  "code": "validation.failed",
  "errors": [{ "field": "title", "code": "validation.required" }]
}
```

- **`code` is what clients use.** It's stable and machine-readable (`task.not_found`, `auth.invalid_credentials`, `file.too_large`). Clients translate it with the `errors.*` keys in [locales](i18n.md). `title` and `detail` are English and only for developers.
- **Login errors don't say which part was wrong.** A wrong email and a wrong password both return `auth.invalid_credentials`, so the API can't be used to find out who has an account. See [security/backend.md](../security/backend.md).

## Authentication
- **Web:** an `httpOnly; Secure; SameSite=Lax` cookie named `session`. Unsafe methods (POST, PATCH, DELETE) must also send an `Origin` header that matches the app's origin, which blocks cross-site request forgery.
- **iOS/macOS (step 3):** `Authorization: Bearer <token>`. Same `sessions` table, `kind = 'bearer'`.
- Both are declared as security schemes in the spec, so generated clients know about them.

## Docs
The running server serves the spec at `/api/openapi.yaml` and a reference page at `/api/docs`.
