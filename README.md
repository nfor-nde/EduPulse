# EduPulse — University Academic Portal & CRM

EduPulse is a full-stack EdTech platform built for higher education institutions. It combines a student-facing academic portal with an administrative CRM, a real-time support ticketing system, a resource library, and an AI-powered engine for recommendations and intelligent chat support.

---

## Tech Stack

| Layer     | Technology                                              |
| --------- | ------------------------------------------------------- |
| Frontend  | Next.js 16 (App Router), React 19, Tailwind CSS v4      |
| Backend   | Next.js API Routes (Node.js)                            |
| Database  | MySQL via Prisma ORM                                    |
| Auth      | JWT (jose) stored in HTTP-only cookies                  |
| Real-time | Server-Sent Events (SSE)                                |
| AI Engine | Python — FastAPI, OpenRouter LLM, XGBoost, scikit-learn |
| Email     | Nodemailer (SMTP)                                       |

---

## Project Structure

```
EduPulse/
├── app/
│   ├── (student)/          # Student-facing portal
│   │   ├── page.tsx        # Homepage with live DB stats
│   │   ├── resources/      # Resource library with pagination & filters
│   │   └── tickets/        # Support ticket portal with real-time SSE
│   ├── (admin)/            # Admin CRM (protected)
│   │   └── admin/
│   │       ├── overview/   # Dashboard with KPIs and activity feed
│   │       ├── students/   # Paginated student directory
│   │       ├── finance/    # Tuition & medical clearance management
│   │       ├── campaigns/  # Broadcast campaign composer
│   │       └── support/    # Real-time support desk with SSE + polling
│   └── api/                # REST API routes
│       ├── auth/           # Login, logout, session (JWT)
│       ├── students/       # Student CRUD
│       ├── resources/      # Resource library
│       ├── tickets/        # Ticket CRUD + SSE stream
│       ├── campaigns/      # Campaign management
│       ├── activity/       # Activity feed
│       ├── interactions/   # Student interaction tracking
│       ├── stats/          # Live homepage statistics
│       ├── chat/           # AI chatbot proxy → FastAPI
│       └── recommend/      # Recommendation engine proxy → FastAPI
├── components/
│   ├── chatbot.tsx         # Streaming AI chatbot with markdown rendering
│   ├── PdfViewer.tsx       # In-app PDF viewer
│   └── YoutubeViewer.tsx   # Embedded YouTube player
├── context/
│   └── AppContext.tsx      # Global state — students, tickets, resources
├── engine/                 # Python AI engine (FastAPI)
│   ├── main.py             # FastAPI server — /chat, /recommend, /health
│   ├── recommendation.ipynb # ML recommendation model training notebook
│   ├── chatbot.ipynb       # AI chatbot documentation & demo notebook
│   ├── requirements.txt    # Python dependencies
│   ├── .venv/              # Python virtual environment
│   └── artifacts/          # Trained models and evaluation plots
├── lib/
│   ├── db.ts               # Prisma client singleton
│   ├── jwt.ts              # JWT sign/verify helpers
│   ├── sse.ts              # SSE pub/sub broadcast system
│   └── email.ts            # Nodemailer email utility
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seeder (~5,000 students, ~20,000 resources)
└── types/
    └── index.ts            # Shared TypeScript interfaces
```

---

## Features

### Student Portal

- **Homepage** — Live statistics pulled directly from the database (past papers count, video tutorials, active students, faculties covered)
- **Resource Library** — Browse 20,000+ academic resources (lecture notes, past papers, video lectures) with full-text search and filters by faculty, department, level, and type; paginated with 24 items per page
- **Support Tickets** — Submit, track, and reply to support tickets; real-time updates via SSE so new admin replies appear instantly without refresh
- **AI Chatbot** — Floating chat widget powered by an LLM (OpenRouter) with real-time database access and web search; responses rendered as rich markdown

### Admin CRM

- **Overview Dashboard** — KPI cards (total students, overdue tuition, pending medical, open tickets), clearance progress bars, scrollable activity feed
- **Student Directory** — Paginated table of all students with search, tuition status, and medical status indicators
- **Finance & Clearance** — Tabbed view for overdue tuition and pending medical clearances; mark paid / approve clearance actions; paginated
- **Broadcast Campaigns** — Compose and send announcements to targeted student cohorts; paginated campaign history table
- **Support Desk** — Real-time ticket queue with SSE subscription and 10-second polling fallback; split-panel chat console with student dossier sidebar; paginated ticket list

### AI Engine (Python)

- **Recommendation Engine** — Hybrid XGBoost + SVD collaborative filtering model trained on student interaction data; predicts resource relevance per student profile; artifacts saved to `engine/artifacts/`
- **AI Chatbot Backend** — FastAPI streaming endpoint that injects live DB context into every LLM prompt, performs DuckDuckGo web searches for current information, and streams tokens via SSE to the frontend
- **Notebooks** — `recommendation.ipynb` and `chatbot.ipynb` document the full ML pipeline with EDA visualisations, confusion matrices, learning curves, feature importance plots, and architecture diagrams

---

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL running locally
- Python 3.11+

### 1. Install Node dependencies

```bash
npm install
```

### 2. Configure environment

Copy and fill in `.env`:

```env
DATABASE_URL="mysql://root@localhost:3306/edupulse"
JWT_SECRET="your-secret"
JWT_EXPIRES_IN="7d"

SMTP_HOST="smtp.ethereal.email"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-pass"
EMAIL_FROM="EduPulse <noreply@edupulse.edu>"

OPEN_ROUTER_BASE_URL=https://openrouter.ai/api/v1
OPEN_ROUTER_API_KEY=your-openrouter-key
OPEN_ROUTER_MODEL=openai/gpt-4o-mini

ENGINE_URL=http://localhost:8000
```

### 3. Set up the database

```bash
npx prisma migrate dev
npx prisma db seed
```

The seed script creates ~5,000 students, ~20,000 academic resources, support tickets, campaigns, and 100,000+ student interaction records.

### 4. Run the Next.js app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Run the Python AI engine

```bash
cd engine
.venv\Scripts\activate.ps1        # Windows
# source .venv/bin/activate   # macOS/Linux

# First run — train the recommendation model
jupyter notebook recommendation.ipynb

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

The engine will be available at [http://localhost:8000](http://localhost:8000). The Next.js app proxies `/api/chat` and `/api/recommend` to this server.

---

## Demo Credentials

| Role      | ID            | Password                               |
| --------- | ------------- | -------------------------------------- |
| Student   | `EP2026-1234` | `password`                             |
| Admin CRM | —             | Navigate directly to `/admin/overview` |

---

## Key Scripts

```bash
npm run dev       # Start Next.js dev server (Turbopack)
npm run build     # Production build
npm run lint      # ESLint
npx prisma studio # Visual DB browser
npx prisma db seed # Re-seed the database
```

---

## Real-time Architecture

Ticket updates flow through a lightweight in-process SSE pub/sub system (`lib/sse.ts`). When a student sends a reply or an admin changes a ticket status, the PATCH handler broadcasts the update to all connected SSE clients instantly. The admin support desk also polls every 10 seconds as a fallback to guarantee consistency.

## AI Chatbot Architecture

```
Next.js Frontend
      │  POST /api/chat (SSE stream)
      ▼
Next.js /api/chat route  ──proxy──▶  FastAPI /chat
                                          │
                              ┌───────────┼────────────┐
                              ▼           ▼            ▼
                          MySQL DB   DuckDuckGo    OpenRouter
                        (live data)  (web search)  LLM API
                                          │
                              streaming tokens (SSE)
                                          │
                      React frontend renders markdown
```
