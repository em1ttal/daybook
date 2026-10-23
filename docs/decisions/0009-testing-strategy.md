# 0009 · Testing strategy: a test pyramid, tests written with each feature
*2026-10-23 · accepted*

- **Context:** the project has no tests, and learning to test a backend and a frontend properly is one of my goals.
- **Choice:** Go unit tests for pure logic, and Go integration tests (real router + real Postgres test database) as the main layer for the API, with responses checked against the OpenAPI spec. On the web, Vitest + Vue Test Utils, with MSW faking the API. A few Playwright end-to-end tests at the end. Tests go in the same PR as the feature.
- **Why:** integration tests against a real database catch the bugs that matter here (wrong SQL, a missing `user_id` filter, a broken transaction). Mocking the database would hide exactly those. Many fast tests at the bottom and a few slow ones at the top keep the suite fast enough to run on every change. See [test pyramid](../concepts/testing-and-ci.md#test-pyramid).
