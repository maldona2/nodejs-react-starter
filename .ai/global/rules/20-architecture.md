# Architecture Loading Policy

## Layers And Canonical Sources

| Scope | Source of truth | Load when the task touches |
|---|---|---|
| API surface | `backend/src/routes/**`, `backend/src/app.ts` | HTTP routes, middleware order, CORS |
| Business logic | `backend/src/services/**` | domain behavior, orchestration |
| Data | `backend/src/db/**`, `backend/src/db/migrations/**` | schema, queries, migrations |
| Domain types | `backend/src/domain/**` | shared shapes between layers |
| UI | `frontend/src/pages/**`, `frontend/src/components/**` | screens, components |
| Client API | `frontend/src/lib/**` | any call to the backend |
| Infra | `docker-compose*.yml`, `*/Dockerfile` | runtime, ports, env wiring |

## Loading Precedence

- Load progressively. Read only the layers the task touches; do not load the
  whole tree by default.
- Read the route and its service before editing either. A route change that does
  not read its service is a guess.
- A change that crosses a layer boundary must read both sides in the same task.

## Boundaries

- Routes parse and authorize; services hold logic; `db/` holds SQL. Do not call
  `pool.query` from a route handler.
- Register new Express routes in `backend/src/app.ts`, before the error handler.
- Components never call the backend directly; they go through `frontend/src/lib/`.
- Longer-form architecture decisions, when they exist, live in
  `docs/conventions/architecture/`. `.ai/` defines the loading policy only and
  does not restate them.
