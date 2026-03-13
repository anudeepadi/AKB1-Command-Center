# AKB1 Command Center

Gemini-first delivery dashboard with a consistent workbench UI, local SQLite persistence, and a single Express server that serves both the API and the built client.

## Stack

- Frontend: React + Vite + TanStack Query + Framer Motion
- Backend: Express + TypeScript
- Storage: SQLite via Node `node:sqlite`
- AI provider: Gemini API via `GEMINI_API_KEY`

## Local Run

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Set `GEMINI_API_KEY` in `.env`.

4. Start the app:

```bash
npm run dev
```

5. Open `http://localhost:5000`.

The local database is stored at `data/akb1.sqlite` by default.

## Production Build

```bash
npm run build
npm run start
```

## Railway Deploy

This repo includes a `Dockerfile`, so Railway can deploy it directly with a pinned Node runtime that supports `node:sqlite`.

1. Push the repo to GitHub.
2. In Railway, create a new project from that repo.
3. Add a volume and mount it at `/app/data`.
4. Set these environment variables in Railway:

```bash
NODE_ENV=production
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
SQLITE_DB_PATH=/app/data/akb1.sqlite
```

5. Deploy.

Railway will inject `PORT` automatically. After deploy, it will build the Docker image, start the server on that port, and persist the SQLite database on the mounted volume.

## Health Check

Use `GET /api/health` to verify the service is up.
