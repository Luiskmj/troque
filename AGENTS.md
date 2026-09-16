# AGENTS.md — Troque Rápido

## Project Overview
Brazilian reverse-logistics shipping platform ("Troque Rápido"). Express + TypeORM + MySQL backend API. The repo also contains frontend React files (CRA-style), but they were uploaded as a flat dump with no directory structure — the frontend cannot run as-is.

## What Runs
Only the **compiled backend** is runnable. The TypeScript source (`src/`) is missing; the compiled JS lives in `dist.tar.gz` (extracted to `dist/` at container startup). The `dist/` directory includes its own `node_modules`.

## Architecture
- **Backend**: Express API on port 5002 (hardcoded in compiled `dist/server.js`), mapped to host port 3000.
- **Database**: MySQL 8.0 with database `troque_rapido`, root user, password `docker`.
- **ORM**: TypeORM 0.2 with SnakeNamingStrategy. Migrations run automatically on startup via `node node_modules/typeorm/cli.js migration:run`.
- **Cron jobs**: Three node-cron jobs start with the server (admin logistics fulfillment, test period expiry, old file cleanup). They only fire on schedule, not at startup.

## Setup
```
docker compose -f docker-compose.base44.yml up -d
```
The API service:
1. Extracts `dist.tar.gz` if `dist/node_modules` doesn't exist
2. Copies `ormconfig.js` into `dist/`
3. Creates a landing page at `dist/dist/public/index.html` (served by Express static middleware)
4. Runs TypeORM migrations
5. Starts `node server.js`

MySQL must be healthy before the API starts (compose `depends_on` with `condition: service_healthy` + `restart: on-failure:5`).

## Verification
- `curl http://localhost:3000/ping` → `{"message":"API is running"}`
- Root `/` serves a simple HTML landing page

## Environment Variables
- Database vars (`DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASS`, `DATABASE_NAME`) are set in compose `environment:`.
- `TYPEORM_ENTITIES=./modules/**/infra/typeorm/entities/*.js` (relative to `dist/` working dir)
- Non-critical vars (AUTH_SECRET, API_SECRET, APP_ID, etc.) have placeholders in `.env.base44-defaults`.
- External service credentials (Nuvemshop, SMTP email, Vindi payments) are optional — the app boots without them. Real values should be provided via the dashboard secrets.

## Known Limitations
- No live-reload: the compiled JS doesn't support HMR. Use `reload_preview` after changes.
- Frontend source files exist at repo root but have no directory structure — imports are broken and the frontend cannot run.
- `synchronize: true` in ormconfig causes crashes (ER_WRONG_AUTO_KEY on orders_products). Migrations are used instead.
