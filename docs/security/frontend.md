# Frontend security (Vue app)

*Applies from step 1, M5.*

- [ ] **XSS:** Vue escapes `{{ }}` output, so a task titled `<script>` shows as text. **Never use `v-html` on user content.** If rich text is ever needed, sanitise it (DOMPurify) first.
- [ ] **Content Security Policy** sent by the server: `default-src 'self'`, no inline scripts, `img-src 'self'` plus the storage domain. If an XSS bug slips through, CSP stops the injected script from running or sending data away.
- [ ] **No tokens in `localStorage` or `sessionStorage`.** Any script on the page can read them. The session lives in an `httpOnly` cookie the page can't touch. (Theme and language preferences in `localStorage` are fine: they aren't secrets.)
- [ ] `credentials: 'include'` only on calls to our own API.
- [ ] Links to user-provided URLs get `rel="noopener noreferrer"`.
- [ ] Don't put secrets in `VITE_*` variables: everything in the bundle is public.
- [ ] `npm audit` in CI; keep dependencies few and updated.
- [ ] Remember: **frontend checks are for user experience**, not security. A user can skip the UI and call the API directly, so the server repeats every rule.

Tests: a component test that renders a task titled `<img src=x onerror=alert(1)>` and checks it appears as text.
