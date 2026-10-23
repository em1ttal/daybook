# CI and supply-chain security

*Applies from the first workflow (step 1, M3).*

## GitHub Actions
- [ ] `permissions:` set at the top of every workflow, starting from `contents: read`. The default `GITHUB_TOKEN` can do more than a build needs.
- [ ] Secrets only in Actions secrets, scoped to environments for deploys. Never echoed in logs.
- [ ] Workflows triggered by pull requests from forks don't get secrets (the default; don't use `pull_request_target` carelessly).
- [ ] Actions pinned to a major version (`actions/checkout@v5`). The stricter option, pinning to a full commit SHA, is explained when the first workflow is written.

## Dependencies
- [ ] Lockfiles committed (`package-lock.json`, `go.sum`), and CI installs exactly them (`npm ci`).
- [ ] **Dependabot** for npm, Go modules and GitHub Actions.
- [ ] `govulncheck` and `npm audit` in CI.
- [ ] New dependencies are justified in the PR (CLAUDE.md rule): fewer packages, fewer risks.

## Repository
- [ ] **Secret scanning and push protection** turned on (see [setup.md](../setup.md#github-security-settings)).
- [ ] **CodeQL** code scanning for Go and JavaScript (M7).
- [ ] Branch protection on `main`: required checks, no force pushes (M7).
