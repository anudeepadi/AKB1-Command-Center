# AKB1 Command Center

**The Operating System for Elite Delivery Leaders**

A Bloomberg Terminal-inspired command center with 12 live modules, 9 KPI calculators, streaming AI assistance, and a curated prompt toolkit — built for Senior PMs, RTEs, and CTOs who operate at enterprise scale.

**[Live Demo →](https://akb1-command-center-production.up.railway.app)**

---

## Why This Exists

Enterprise delivery leaders juggle 10+ disconnected tools — spreadsheets for KPIs, separate risk trackers, manual status reports, generic AI chatbots. None of them speak the language of delivery operations.

AKB1 replaces all of that with a single, keyboard-driven interface where every tool is one keystroke away.

---

## What's Inside

### Core Modules

| Module | What It Does |
|--------|-------------|
| **KPI Engine** | 9 live calculators — Utilization, Margin, Velocity, CPI, SLA, SPI, CFR, Attrition, PI Predictability — with formulas, industry benchmarks, and worked examples |
| **Risk Heat Map** | Interactive 5×5 probability × impact matrix with a live risk register and export |
| **Sprint & PI Planner** | SAFe-aligned capacity calculator with team parameters, velocity modeling, and innovation buffer |
| **Pricing Calculator** | Bill rate derivation, T&M vs fixed price comparison, and full team cost modeling with leverage analysis |
| **Decision Matrix** | Structured decision framework generating Conservative / Balanced / Strategic options with AI-backed recommendations |
| **Estimation Engine** | PERT 3-point, T-shirt sizing, and delivery forecasting with cost modeling |
| **Status Report Generator** | RAG-based executive report builder with metrics, decisions, and risks — copy-paste ready |

### AI & Prompt Tools

| Module | What It Does |
|--------|-------------|
| **AI Terminal** | Streaming Gemini AI calibrated with a delivery-specific system prompt — persistent chat sessions stored in SQLite |
| **Prompt Lab** | 9 "cheat codes" (reusable prompt patterns) with a live prompt analyzer and quality scoring |
| **Prompt Builder** | Role → Task → Format → Constraint assembler that generates copy-paste prompts with strength scoring |
| **AI Arsenal** | Runtime profiles (Gemini Flash, Flash-Lite), routing guide, and model comparison |

### Platform Features

- **Command Palette** — `Cmd+K` to jump to any module instantly
- **Persistent State** — Risk registers, status reports, and chat sessions survive across sessions via SQLite
- **Responsive Design** — Full mobile support with adaptive sidebar, panel toggling, and touch-friendly interactions
- **Bloomberg Aesthetic** — Dark terminal workspace contrasted against a warm marketing landing page

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Client (Vite)                  │
│  React 18 · Tailwind · Framer Motion · Radix UI │
│  TanStack Query · Wouter (hash routing)          │
├─────────────────────────────────────────────────┤
│                 Express Server                   │
│  Bootstrap API · Chat Sessions · SSE Streaming   │
│  Tool Draft Persistence · Static File Serving    │
├─────────────────────────────────────────────────┤
│              SQLite (Drizzle ORM)                │
│  chat_sessions · messages · tool_drafts          │
│  app_state · modules                             │
├─────────────────────────────────────────────────┤
│               Gemini API (SSE)                   │
│  gemini-2.5-flash · Delivery system prompt       │
│  20-message context window · Demo fallback       │
└─────────────────────────────────────────────────┘
```

**Stack:** React 18, TypeScript, Vite, Express 5, SQLite, Drizzle ORM, Gemini API, Tailwind CSS, Framer Motion, Radix UI, TanStack Query

---

## Running Locally

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# Set GEMINI_API_KEY in .env (optional — runs in demo mode without it)

# 3. Start
npm run dev

# 4. Open
open http://localhost:5000
```

Database stored at `data/akb1.sqlite` by default.

## Production Build

```bash
npm run build
npm run start
```

## Deploy to Railway

This repo includes a `Dockerfile` with a pinned Node runtime that supports `node:sqlite`.

1. Push to GitHub
2. Create a new Railway project from the repo
3. Add a volume mounted at `/app/data`
4. Set environment variables:

```
NODE_ENV=production
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
SQLITE_DB_PATH=/app/data/akb1.sqlite
```

5. Deploy — Railway injects `PORT` automatically

**Health check:** `GET /api/health`

---

## Project Context

This was built as a portfolio project to demonstrate:

- **Full-stack TypeScript** — shared types between client and server, strict mode, zero `any`
- **Real-time AI integration** — SSE streaming from Gemini with persistent session management
- **Domain-driven design** — 12 modules built around actual enterprise delivery workflows (SAFe, KPIs, risk management, pricing)
- **Production deployment** — Dockerized, Railway-hosted, SQLite persistence with volume mounts
- **UI/UX engineering** — Bloomberg-inspired terminal aesthetic, command palette, Framer Motion animations, responsive design

---

## License

MIT
