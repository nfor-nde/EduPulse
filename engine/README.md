# EduPulse Engine

Python engine for the AI Chatbot and Recommendation System.

## Setup

```bash
# From this directory
.venv\Scripts\activate          # Windows
source .venv/bin/activate       # macOS/Linux

pip install -r requirements.txt
```

## Run Notebooks
Open `recommendation.ipynb` and `chatbot.ipynb` in VS Code or Jupyter to train models and explore the system.

## Run FastAPI Server

```bash
.venv\Scripts\uvicorn main:app --reload --port 8000
```

The server will be available at `http://localhost:8000`.

**Endpoints:**
- `GET /health` — Health check
- `POST /chat` — Streaming AI chatbot (SSE)
- `POST /recommend` — Resource recommendations

## Environment
Reads from the root `.env` file automatically:
- `DATABASE_URL` — MySQL connection
- `OPEN_ROUTER_BASE_URL` — OpenRouter API base
- `OPEN_ROUTER_API_KEY` — API key
- `OPEN_ROUTER_MODEL` — LLM model name

## Artifacts
Run `recommendation.ipynb` first to generate trained model artifacts in `artifacts/`.
