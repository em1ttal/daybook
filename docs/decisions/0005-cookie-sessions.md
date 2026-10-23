# 0005 · Auth: server-side sessions in a cookie
*2026-10-23 · accepted*

- **Why:** a random token is stored *hashed* in a `sessions` table and sent as an `httpOnly; Secure; SameSite=Lax` cookie. Logging out or revoking a session deletes a database row. JWTs can't be revoked before they expire without extra machinery. Mobile apps will send the same kind of token as a `Bearer` header, backed by the same table. See [sessions vs tokens](../concepts/security.md#sessions-vs-tokens).
