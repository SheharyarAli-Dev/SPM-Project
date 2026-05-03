# DOCKER_REPORT.md — Containerization Report
## Payment & Escrow Management Module (Module 7)

**Date:** 2026-05-03  
**Docker Hub Username:** anasatdocker  
**Module:** Payment & Escrow Management (Module 7)

---

## Overview

The module has been fully containerized using Docker. Both the backend (NestJS) and frontend (Next.js) are published to Docker Hub and can be run via a single `docker-compose up -d` command.

---

## Docker Hub Images

| Image | URL |
|---|---|
| **Backend** | `anasatdocker/spm-module7-backend:latest` |
| **Frontend** | `anasatdocker/spm-module7-frontend:latest` |

---

## Files Added

| File | Description |
|---|---|
| `module-7-backend/Dockerfile` | Multi-stage build for NestJS backend |
| `module-7-backend/.dockerignore` | Excludes node_modules, dist, .env, logs |
| `frontend/Dockerfile` | Multi-stage build for Next.js frontend |
| `frontend/.dockerignore` | Excludes node_modules, .next, .env |
| `docker-compose.yml` | Orchestrates backend + frontend containers |
| `.env.example` | Template for required environment variables |
| `.gitignore` | Prevents .env from being committed |
| `.dockerignore` | Root-level Docker ignore file |

---

## Architecture

```
┌─────────────────────────────────────────┐
│             Docker Network               │
│                                         │
│  ┌─────────────────┐  ┌───────────────┐ │
│  │   spm_module7   │  │  spm_module7  │ │
│  │    backend      │  │   frontend    │ │
│  │  (NestJS:3001)  │  │ (Next.js:3000)│ │
│  └────────┬────────┘  └───────────────┘ │
│           │                             │
└───────────┼─────────────────────────────┘
            │ host.docker.internal
            ▼
┌─────────────────────┐
│  Local PostgreSQL   │
│  (spm_db : 5432)    │
│  [with real data]   │
└─────────────────────┘
```

The backend connects to the **local PostgreSQL** database via `host.docker.internal` so all existing data is available without needing to seed the Docker DB.

---

## Dockerfile Details

### Backend (`module-7-backend/Dockerfile`)
- **Base image:** `node:20-alpine`
- **Build stage:** Installs all deps, runs `npm run build` (TypeScript compile)
- **Production stage:** Only copies compiled `dist/` and production `node_modules`
- **Port:** 3001
- **Start command:** `node dist/main`

### Frontend (`frontend/Dockerfile`)
- **Base image:** `node:20-alpine`
- **Build stage:** Runs `npm run build` with `output: 'standalone'` in Next.js config
- **Production stage:** Copies standalone output, static files, and public assets
- **Port:** 3000
- **Start command:** `node server.js`

---

## docker-compose.yml

Two services:

| Service | Image | Port | Description |
|---|---|---|---|
| `backend` | `anasatdocker/spm-module7-backend:latest` | 3001 | NestJS API |
| `frontend` | `anasatdocker/spm-module7-frontend:latest` | 3000 | Next.js UI |

Backend uses `extra_hosts: host.docker.internal:host-gateway` to resolve the host machine's PostgreSQL.

---

## Environment Variables

All secrets are passed via environment variables — **never hardcoded** in images.

| Variable | Default | Description |
|---|---|---|
| `DB_HOST` | `host.docker.internal` | Database host |
| `DB_PORT` | `5432` | Database port |
| `DB_USERNAME` | `postgres` | Database user |
| `DB_PASSWORD` | *(required)* | Database password |
| `DB_NAME` | `spm_db` | Database name |
| `ADMIN_KEY` | `change-me-in-production` | Admin API key |
| `FRONTEND_URL` | `http://localhost:3000` | Allowed CORS origin |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Backend URL for frontend |

The `.env` file is **gitignored**. A `.env.example` template is provided.

---

## How to Run

### Prerequisites
- Docker Desktop installed and running
- Local PostgreSQL running with `spm_db` database and data

### Steps

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your DB password:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and set `DB_PASSWORD`:
   ```
   DB_PASSWORD=your_postgres_password
   ```
4. Start the containers:
   ```bash
   docker-compose up -d
   ```
5. Access the app:
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:3001

### Stop
```bash
docker-compose down
```

---

## Security Considerations

- `.env` files are excluded from both Git (`.gitignore`) and Docker images (`.dockerignore`)
- No secrets are hardcoded in Dockerfiles or source code
- `ADMIN_KEY` and `DB_PASSWORD` must be explicitly set in `.env`
- Images use minimal `node:20-alpine` base to reduce attack surface
- Multi-stage builds ensure no dev dependencies or source TypeScript in production image

