# Security

### Sessions vs tokens
A *session* is state stored on the server (a row in `sessions`), and the client holds only a random ID. A *self-contained token* (JWT) carries the user's data, signed by the server. Sessions are easy to revoke and keep secrets off the client. JWTs avoid a database lookup per request but are hard to revoke. We store only a **hash** of the session ID, so a leaked database dump can't be used to log in.

### Threat model
A written answer to "what are we protecting, from whom, and how could they get in?". It turns security from a vague worry into a list of specific risks, each with a defence. daybook's is in [security/README.md](../security/README.md).

### Hashing vs encryption
**Hashing** is one-way: you can check that a password matches its hash, but you can't get the password back. **Encryption** is two-way: with the key, you get the original back. Passwords and session tokens are *hashed*. Backups are *encrypted*, because they need to be restored.

### Salt
A random value stored next to each password hash, so two people with the same password get different hashes. It stops attackers from using precomputed tables of common-password hashes.

### XSS (cross-site scripting)
An attacker gets their JavaScript to run on your page, usually by saving it as data (a task title) that the page later inserts as HTML. That script can do anything the user can. Defence: escape output (Vue does by default), never insert user HTML, and add a CSP.

### CSRF (cross-site request forgery)
A different website makes your browser send a request to daybook. The browser attaches the session cookie automatically, so the request runs as you. Defences: `SameSite` cookies and checking the `Origin` header.

### SameSite cookies
A cookie attribute that controls whether the browser sends the cookie on requests started by *other* sites. `Lax` (daybook's choice) sends it when you follow a link to the site, but not on cross-site POSTs, images or scripts.

### CSP (Content Security Policy)
A response header listing where the page may load scripts, styles and images from. If an attacker injects a script, the browser refuses to run it because it isn't from an allowed source.

### TLS and HSTS
**TLS** is the encryption behind HTTPS: nobody between the browser and server can read or change the traffic. **HSTS** is a header telling the browser "only ever use HTTPS for this site", so a first plain-HTTP request can't be intercepted.

### Least privilege
Give every user, process, key and token only the permissions it needs, and no more. If it's compromised, the damage is limited. Examples: the CI token is read-only, the R2 key works on one bucket, the API container runs as non-root.

### Supply-chain attack
Attacking the software you depend on (an npm package, a GitHub Action, a Docker image) instead of your code. Defences: fewer dependencies, lockfiles, pinned versions, automated vulnerability alerts.
