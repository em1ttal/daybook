# 0010 · CI: delete the inherited workflow and rebuild it by hand
*2026-10-23 · accepted*

- **Context:** the course project shipped a copied GitHub Pages workflow (Node 18, deleted the lockfile before installing).
- **Choice:** remove it now. Write CI from scratch in steps: a server job when the API has tests, a web job when the frontend has tests, end-to-end tests and a demo deploy at the end of step 1.
- **Why:** I want to understand every line of the pipeline, not maintain a template I didn't write. Building it one job at a time makes each concept (triggers, runners, caching, service containers) its own lesson. See [CI](../concepts/testing-and-ci.md#ci-continuous-integration).
