# Security

### Sessions vs tokens
A *session* is state stored on the server (a row in `sessions`), and the client holds only a random ID. A *self-contained token* (JWT) carries the user's data, signed by the server. Sessions are easy to revoke and keep secrets off the client. JWTs avoid a database lookup per request but are hard to revoke. We store only a **hash** of the session ID, so a leaked database dump can't be used to log in.
