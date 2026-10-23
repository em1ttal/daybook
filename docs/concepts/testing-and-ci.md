# Testing and CI

### Test pyramid
A guide for how many tests to write at each level. The base is lots of fast **unit tests** (one function, no database or network). The middle is fewer **integration tests** (several parts working together, e.g. an HTTP handler with a real database). The top is a handful of slow **end-to-end tests** (a real browser clicking through the app). The higher the level, the more confidence each test gives, and the slower and more fragile it is.

### CI (continuous integration)
Running the checks (format, lint, build, tests) automatically on every push and pull request, on a clean machine, so "works on my machine" problems show up before merging. In GitHub Actions, a *workflow* (a YAML file in `.github/workflows/`) has *triggers* (`on: push`), *jobs* that run on fresh virtual machines (*runners*), and each job has *steps* (shell commands or reusable *actions*).
