---
name: nodejs-react-starter-workflow
description: Execute common nodejs-react-starter development workflows and commands. Use when tasks involve building, testing, linting, type checking, or other runtime operations.
---

# nodejs-react-starter Workflow Runbook

## Build

- All: `npm run build` (from root — installs + builds frontend and backend)
- Backend only: `cd backend && npm run build`
- Frontend only: `cd frontend && npm run build`

## Dev

- Start all (DB + frontend + backend): `npm run start:dev` (from root)
- Backend only: `cd backend && npm run dev`
- Frontend only: `cd frontend && npm run dev`

## Quality

- Lint: `npm run lint` (from root, runs both)
- Format check: `npm run format:check`
- Format fix: `npm run format`
- Tests: `npm run test` (from root, runs both)
- Backend tests: `cd backend && npm run test`
- Frontend tests: `cd frontend && npm run test`
- Coverage: `cd backend && npm run test:coverage` / `cd frontend && npm run test:coverage`

## Database

- Migrate: `cd backend && npm run db:migrate`
- Migrations location: `backend/src/db/migrations/NNN_description.sql`

## Docker

- Dev: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`
- Prod: `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`

## URLs (dev)

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- PostgreSQL: localhost:5432

## Usage Notes

- Prefer project scripts from `package.json` over ad-hoc commands.
- Add shadcn components: `cd frontend && npx shadcn@latest add [component-name]`
- Register new Express routes in `backend/src/app.ts`.
- If local environment overrides exist, apply `.ai/local/rules/*.md` after global rules.
