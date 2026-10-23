# Go

### Go context
`context.Context` is passed as the first argument through every layer of a request. It carries a deadline or cancellation signal (if the browser disconnects, the database query is cancelled too) and request-scoped values such as the authenticated user's id.
