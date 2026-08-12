# Frontend Security Rules

Canonical for `frontend/src/**`.

## Rendering

- Never use `dangerouslySetInnerHTML`. If untrusted HTML must be rendered,
  state the requirement explicitly and sanitize with a vetted library first.
- Never build a DOM `href`, `src`, or `action` from unvalidated input. Reject
  any URL whose scheme is not `http:` or `https:`.
- Do not render server error payloads verbatim; map them to application copy.

## Data Handling

- The frontend is not a trust boundary. Client-side validation is UX only —
  every rule enforced here must also be enforced in the backend.
- Never store tokens or secrets in `localStorage` or `sessionStorage`. Prefer
  `httpOnly` cookies issued by the backend.
- No secrets in `import.meta.env` values shipped to the browser. Anything
  prefixed `VITE_` is public by definition.

## API Access

- All backend calls go through the shared client in `frontend/src/lib/`.
  Do not call `fetch`/`axios` directly from components.
- Never disable TLS verification or proxy around CORS to reach an origin the
  backend allowlist rejects.

## Dependencies

- No new runtime dependency for what the platform already provides
  (`<input type="date">`, `Intl`, `URL`, `crypto.randomUUID`).
- Adding a dependency that touches auth, crypto, or HTML sanitization requires
  stating why an existing one does not cover it.
