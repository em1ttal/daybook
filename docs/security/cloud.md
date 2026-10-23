# Cloud security

*Applies in step 2.*

## The server (VPS)
- [ ] SSH **keys only**: `PasswordAuthentication no`, `PermitRootLogin no`, a normal user with `sudo`.
- [ ] Firewall: allow only 22 (SSH), 80 and 443. Everything else closed.
- [ ] Automatic security updates (`unattended-upgrades`) and `fail2ban` against SSH guessing.
- [ ] Postgres **never** reachable from the internet: internal Docker network only.

## Containers
- [ ] Run as a non-root user, with a read-only filesystem where possible and no extra Linux capabilities.
- [ ] Small base images (distroless or scratch for the Go binary), pinned tags, scanned for known vulnerabilities (e.g. Trivy) in CI.

## Network and TLS
- [ ] HTTPS everywhere through Caddy (automatic certificates), with HTTP redirected. HSTS once it works.
- [ ] Cloudflare in front: DNS, WAF rules, rate limits, hiding the server's IP.
- [ ] Cookies `Secure`, and the API trusting `X-Forwarded-For` **only** from the proxy.

## Secrets
- [ ] Production secrets on the server only (an env file readable by the service user, or Docker secrets), never in Git or in images.
- [ ] Separate credentials per environment; R2 keys limited to one bucket.
- [ ] A rotation plan: how to change the database password or R2 keys without downtime.

## Backups and recovery
- [ ] Daily encrypted database backups, stored off the server.
- [ ] **A restore tested on a schedule.** A backup that has never been restored is a hope, not a backup.

## Monitoring
- [ ] Uptime check and alert; logs kept for a set time; failed logins visible.
