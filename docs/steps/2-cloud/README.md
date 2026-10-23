# Step 2 · Cloud hosting
*Status: planned*

**Goal:** run daybook on the internet: the API and Postgres on a small VPS with Docker Compose behind Caddy (automatic HTTPS), the web app on Cloudflare, and files on Cloudflare R2.

## Planned milestones
- A production `Dockerfile` for the API (multi-stage: build with Go, run on a tiny base image as a non-root user).
- `infra/`: production compose file, Caddyfile, environment and secrets on the server.
- A hardened VPS: SSH keys only, firewall, automatic updates.
- The `s3` storage implementation for R2 ([files and images](../../architecture/files-and-images.md)).
- A deploy workflow in GitHub Actions, written by hand.
- Encrypted off-site database backups, with a **tested restore**.
- Monitoring: health checks, logs, an uptime alert.

## What I'll learn
Linux server basics, Docker images and Compose, reverse proxies and TLS, DNS, secrets management, backups, and deploying from CI.

## Security checkpoint
[security/cloud.md](../../security/cloud.md), written up at the end of the step.
