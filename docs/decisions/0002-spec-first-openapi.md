# 0002 · API contract: spec-first OpenAPI
*2026-10-23 · accepted*

- **Context:** Three clients (web, iOS, macOS) need to agree on one API.
- **Options:** *Spec-first*: hand-write `openapi.yaml`, then generate server stubs (`oapi-codegen`) and clients from it. *Code-first*: write Go handlers and let a framework such as **Huma** generate the spec.
- **Choice:** spec-first, with a Huma comparison spike after the API milestone.
- **Why:** writing the spec by hand makes me design the API (resources, status codes, error shapes) before coding it, which is the skill I want to learn. The same file generates the Swift client in step 3. Code-first is faster day to day and is common in industry, so I'll build a few endpoints with Huma on a throwaway branch and record the comparison here.
