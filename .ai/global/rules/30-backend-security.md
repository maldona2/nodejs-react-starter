# Backend Security Rules

Canonical for `backend/src/**`. These are trust-boundary rules: apply them
before writing the happy path, not after.

## Input Validation

- Validate every request body, query string, route param, and header with a `zod`
  schema at the route boundary. Never pass `req.body` into a service unparsed.
- Parse with `schema.parse()`/`safeParse()` and reject with `400` on failure.
  Do not fall back to defaults for missing required fields.
- Reject unknown keys (`z.object({...}).strict()`) on any payload that reaches
  the database or the filesystem.
- Enforce explicit bounds on every string, array, and number that reaches
  storage (`.max()`, `.int()`, `.positive()`).

## Database

- Use parameterized queries only: `pool.query('... WHERE id = $1', [id])`.
  Never build SQL with template literals or string concatenation.
- Never interpolate user input into identifiers (table/column names). Map user
  input to an allowlist of literal identifiers instead.
- Migrations live in `backend/src/db/migrations/NNN_description.sql` and are
  append-only. Never edit an applied migration.

## AuthN / AuthZ

- Authorization is per-route and explicit. A route with no authorization check
  is a public route; if it is not meant to be public, it is a defect.
- Check ownership, not just authentication: verify the authenticated subject may
  act on the specific resource id, on every read and write.
- Never trust an id, role, tenant, or permission value taken from the request
  body or a client-supplied header.

## Secrets And Configuration

- Never commit secrets. Configuration comes from environment variables only.
- Fail closed at startup: if a required env var is missing, throw and exit
  (see `backend/src/db/connect.ts`). Never substitute an insecure default.
- Never log secrets, tokens, passwords, full request bodies, or authorization
  headers. `pino` redaction is required for any field that may carry them.

## Responses And Errors

- Never return a raw `Error.message` or stack to the client for a `5xx`. Return
  a generic message; the detail goes to the logger only.
- Client-safe error text is allowed for `4xx` only, and only when the message is
  authored by the application (not derived from a driver or library).
- Do not return fields the caller is not authorized to read. Serialize explicitly;
  never spread a database row straight into a response.

## Transport And Middleware

- CORS uses an explicit origin allowlist (see `backend/src/app.ts`). Never use
  `origin: true` or `origin: '*'` together with `credentials: true`.
- Apply rate limiting to authentication routes and to any route that sends mail,
  writes files, or calls a paid third party.
- Keep body size limits explicit on `express.json()` and `express.urlencoded()`.
- Uploads served from `/uploads` must never derive a filesystem path from a
  client-supplied name. Store under a generated id and resolve-and-verify the
  path stays inside the uploads root.
