# Backend security (Go API)

*Applies from step 1, M3.* Each item says what it stops.

## Accounts and passwords
- [ ] **argon2id** for password hashing, with a random salt and the parameters stored in the PHC string. Stops a leaked database from revealing passwords quickly: argon2id is slow and memory-hungry on purpose.
- [ ] Minimum length (12+), no maximum below 64, and no composition rules. Long passphrases beat `P@ssw0rd1`.
- [ ] **Same response for "no such email" and "wrong password"** (`auth.invalid_credentials`), and similar response times. Stops *account enumeration*: finding out who has an account.
- [ ] **Rate limit** login and register per IP and per account. Stops password guessing.

## Sessions
- [ ] 32 random bytes from `crypto/rand`; store **only the SHA-256 hash**. A leaked `sessions` table can't be used to log in.
- [ ] Cookie flags `HttpOnly` (JavaScript can't read it), `Secure` (HTTPS only), `SameSite=Lax` (not sent on cross-site POSTs), `Path=/`.
- [ ] **New session on login**, old one dropped. Stops *session fixation*.
- [ ] Idle timeout and absolute expiry; logout deletes the row; "log out other devices" deletes the rest.

## Authorization
- [ ] Every query filters by the session's `user_id`, and the tests prove it (**cross-user → 404**). This is OWASP's #1 risk, *broken access control*.
- [ ] 404, not 403, for another user's resource, so IDs can't be probed.

## Requests
- [ ] **CSRF:** `SameSite=Lax` plus an `Origin` header check on POST/PATCH/DELETE. Stops other websites from acting as me.
- [ ] Validate every request against the OpenAPI spec, then apply business rules in the service. Never trust client data.
- [ ] **SQL injection:** only parameterised queries (sqlc). No string-built SQL.
- [ ] Body size limits, and server timeouts (`ReadHeaderTimeout`, `ReadTimeout`, `WriteTimeout`, `IdleTimeout`). Stops slow or huge requests from tying up the server (*slowloris*).
- [ ] CORS only for the Vite dev origin, never `*` with credentials.

## Responses
- [ ] Security headers: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` (or CSP `frame-ancestors`), `Strict-Transport-Security` in production.
- [ ] Errors never leak stack traces or SQL; the problem `detail` is safe to show.

## Secrets and logs
- [ ] Secrets only from environment variables; `.env` never committed; config fails fast if one is missing.
- [ ] Never log passwords, tokens, cookies or `Authorization` headers. Log the user ID and request ID instead.

## Dependencies
- [ ] `govulncheck ./...` locally and in CI. It reports only the vulnerabilities your code actually calls.

## Tests that prove it
Cross-user access → 404 · wrong `Origin` → 403 · the sixth quick login attempt → 429 · security headers present · an expired session → 401 · password never appears in logs.
