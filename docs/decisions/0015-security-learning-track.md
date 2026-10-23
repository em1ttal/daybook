# 0015 · Security as a learning track across every step
*2026-10-23 · accepted*

- **Context:** I want to learn how to secure an app end to end: backend, frontend, cloud deployment, native apps and CI. Security added at the end tends to become a list of patches.
- **Options:** a "security hardening" milestone near the end; or security designed in from the start, with checkpoints.
- **Choice:** designed in. A threat model and per-area checklists in [`docs/security/`](../security/README.md), a *Security* section in every milestone chapter, tests for security behaviour, and a written review at the end of each step. Baselines: OWASP Top 10 and ASVS.
- **Why:** most of the important controls (`user_id` scoping, hashed tokens, cookie flags, upload checks) are cheap when designed in and expensive to retrofit. Writing down *which threat each control stops* is the part that turns it into learning, not just copying rules.
