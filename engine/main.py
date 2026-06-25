"""
EduPulse Engine — FastAPI Server
Serves the AI Chatbot and Recommendation Engine via REST + SSE.

Run from inside engine/:
    .venv\\Scripts\\uvicorn main:app --reload --port 8000
"""

import os, json, asyncio
from typing import AsyncGenerator
from dotenv import load_dotenv

# ── Robust .env loading ───────────────────────────────────────────────────────
# Works whether uvicorn is run from engine/ or from the project root
_THIS_FILE = os.path.abspath(__file__)          # .../EduPulse/engine/main.py
_ENGINE_DIR = os.path.dirname(_THIS_FILE)       # .../EduPulse/engine
_ROOT_DIR   = os.path.dirname(_ENGINE_DIR)      # .../EduPulse

_env_path = os.path.join(_ROOT_DIR, '.env')
if os.path.exists(_env_path):
    load_dotenv(_env_path, override=True)
    print(f'✅ Loaded .env from: {_env_path}')
else:
    print(f'⚠️  .env not found at: {_env_path}')

BASE_URL = os.getenv('OPEN_ROUTER_BASE_URL', 'https://openrouter.ai/api/v1')
API_KEY  = os.getenv('OPEN_ROUTER_API_KEY', '')
MODEL    = os.getenv('OPEN_ROUTER_MODEL', 'openai/gpt-4o-mini')
DB_RAW   = os.getenv('DATABASE_URL', 'mysql+pymysql://root@localhost:3306/edupulse')

DB_URL = DB_RAW.replace('mysql://', 'mysql+pymysql://', 1) if DB_RAW.startswith('mysql://') else DB_RAW

ARTIFACTS = os.path.join(_ENGINE_DIR, 'artifacts')

# ── Startup diagnostics ───────────────────────────────────────────────────────
print(f'   OPEN_ROUTER_BASE_URL : {BASE_URL}')
print(f'   OPEN_ROUTER_API_KEY  : {"SET (" + API_KEY[:12] + "...)" if API_KEY else "NOT SET ⚠️"}')
print(f'   OPEN_ROUTER_MODEL    : {MODEL}')
print(f'   DATABASE_URL         : {DB_URL.split("@")[1] if "@" in DB_URL else DB_URL}')
print(f'   ARTIFACTS DIR        : {ARTIFACTS}')

# ── Imports ───────────────────────────────────────────────────────────────────
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy import create_engine, text
from openai import OpenAI
from duckduckgo_search import DDGS
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder

# ── Clients (created after env is loaded) ────────────────────────────────────
llm_client = OpenAI(base_url=BASE_URL, api_key=API_KEY)
db_engine  = create_engine(DB_URL, pool_pre_ping=True, pool_recycle=3600)

# ── Load recommendation artifacts ────────────────────────────────────────────
_model       = None
_svd         = None
_le_student  = None
_le_resource = None
_metadata    = None

def _load_artifacts():
    global _model, _svd, _le_student, _le_resource, _metadata
    try:
        _model       = joblib.load(os.path.join(ARTIFACTS, 'xgb_recommender.pkl'))
        _svd         = joblib.load(os.path.join(ARTIFACTS, 'svd_model.pkl'))
        _le_student  = joblib.load(os.path.join(ARTIFACTS, 'le_student.pkl'))
        _le_resource = joblib.load(os.path.join(ARTIFACTS, 'le_resource.pkl'))
        with open(os.path.join(ARTIFACTS, 'recommender_metadata.json')) as f:
            _metadata = json.load(f)
        print('✅ Recommendation artifacts loaded')
    except FileNotFoundError:
        print('⚠️  Recommendation artifacts not found — run recommendation.ipynb first')

_load_artifacts()

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(title='EduPulse Engine', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# ── Helpers ───────────────────────────────────────────────────────────────────

def get_db_context() -> str:
    """Pull real-time stats from MySQL for the chatbot system prompt."""
    try:
        with db_engine.connect() as conn:
            total_students  = conn.execute(text('SELECT COUNT(*) FROM student')).scalar()
            overdue_tuition = conn.execute(text("SELECT COUNT(*) FROM student WHERE tuitionStatus='Overdue'")).scalar()
            pending_medical = conn.execute(text("SELECT COUNT(*) FROM student WHERE medicalStatus='Pending'")).scalar()
            total_resources = conn.execute(text('SELECT COUNT(*) FROM resource')).scalar()
            open_tickets    = conn.execute(text("SELECT COUNT(*) FROM ticket WHERE status='open'")).scalar()
            total_campaigns = conn.execute(text('SELECT COUNT(*) FROM campaign')).scalar()
            recent_campaigns = conn.execute(text(
                'SELECT title, audience, sentDate FROM campaign ORDER BY createdAt DESC LIMIT 5'
            )).fetchall()
            faculties = conn.execute(text(
                'SELECT DISTINCT faculty FROM student ORDER BY faculty'
            )).fetchall()
            recent_tickets = conn.execute(text(
                "SELECT subject, studentMatricule, status FROM ticket ORDER BY createdAt DESC LIMIT 5"
            )).fetchall()

        return f"""## EduPulse Live Database — {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M')}
- **Total Students**: {total_students:,}
- **Overdue Tuition**: {overdue_tuition:,} students
- **Pending Medical Clearance**: {pending_medical:,} students
- **Total Academic Resources**: {total_resources:,}
- **Open Support Tickets**: {open_tickets}
- **Total Campaigns**: {total_campaigns}
- **Faculties**: {', '.join(r[0] for r in faculties)}
- **Recent Campaigns**: {'; '.join(f"{r[0]} → {r[1]} ({r[2]})" for r in recent_campaigns) or 'None'}
- **Recent Tickets**: {'; '.join(f"#{r[1]} — {r[0]} [{r[2]}]" for r in recent_tickets) or 'None'}"""
    except Exception as e:
        return f'[Database context unavailable: {e}]'


def web_search(query: str, max_results: int = 4) -> str:
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=max_results))
        if not results:
            return ''
        return '\n'.join(f"- **{r['title']}**: {r['body']}" for r in results)
    except Exception:
        return ''


def build_system_prompt(db_context: str, search_context: str = '') -> str:
    prompt = f"""You are EduPulse AI, an intelligent academic assistant for the EduPulse university management platform.

You have real-time access to the EduPulse database. Current platform status:

{db_context}

## Your Capabilities
- Answer questions about student clearances, tuition, medical status, and support tickets using live database data
- Recommend academic resources (past papers, notes, video lectures) for any course or department
- Explain university processes clearly and accurately
- Provide study guidance, exam tips, and academic advice
- Search the web for current academic information and resources

## Response Style
- Always respond in **rich markdown** with headers, bullet points, tables, and code blocks where relevant
- Be accurate, professional, and helpful
- When referencing platform data, cite the live figures above
- Format resource recommendations as structured lists with titles and descriptions
"""
    if search_context:
        prompt += f'\n## Relevant Web Information\n{search_context}\n'
    return prompt


# ── Schemas ───────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []


class RecommendRequest(BaseModel):
    studentId: str | None = None
    dept: str | None = None
    faculty: str | None = None
    level: int | None = None
    limit: int = 10


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get('/health')
def health():
    return {
        'status': 'ok',
        'model': MODEL,
        'api_key_set': bool(API_KEY),
        'artifacts_loaded': _model is not None,
    }


@app.post('/chat')
async def chat_endpoint(req: ChatRequest):
    """Stream AI chatbot response token-by-token via SSE."""
    if not API_KEY:
        raise HTTPException(status_code=503, detail='OPEN_ROUTER_API_KEY is not set in .env')

    async def generate() -> AsyncGenerator[bytes, None]:
        db_ctx = get_db_context()

        academic_kws = ['latest', 'current', 'recent', 'recommend', 'resource', 'how to',
                        'study', 'exam', 'course', 'learn', 'tutorial', 'research', 'find']
        should_search = any(kw in req.message.lower() for kw in academic_kws)
        search_ctx = web_search(f'university education {req.message}') if should_search else ''

        system_prompt = build_system_prompt(db_ctx, search_ctx)

        messages = [
            {'role': 'system', 'content': system_prompt},
            *req.history[-10:],
            {'role': 'user', 'content': req.message},
        ]

        try:
            stream = llm_client.chat.completions.create(
                model=MODEL,
                messages=messages,
                temperature=0.7,
                max_tokens=1500,
                stream=True,
            )
            for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    yield f'data: {json.dumps({"token": delta})}\n\n'.encode()
                    await asyncio.sleep(0)
            yield b'data: [DONE]\n\n'
        except Exception as e:
            yield f'data: {json.dumps({"token": f"\n\n⚠️ Error: {e}"})}\n\n'.encode()
            yield b'data: [DONE]\n\n'

    return StreamingResponse(generate(), media_type='text/event-stream', headers={
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
    })


@app.post('/recommend')
def recommend_endpoint(req: RecommendRequest):
    """Return ML-scored resource recommendations for a student."""
    try:
        conditions = ['1=1']
        params: dict = {}
        if req.faculty:
            conditions.append('faculty = :faculty')
            params['faculty'] = req.faculty
        if req.dept:
            conditions.append('dept = :dept')
            params['dept'] = req.dept
        if req.level:
            conditions.append('level = :level')
            params['level'] = req.level

        where = ' AND '.join(conditions)
        with db_engine.connect() as conn:
            rows = conn.execute(text(
                f'SELECT id, title, description, type, url, faculty, dept, level FROM resource WHERE {where} LIMIT 200'
            ), params).fetchall()

        if not rows:
            return {'recommendations': [], 'message': 'No resources found for the given filters.'}

        df_res = pd.DataFrame(rows, columns=['id', 'title', 'description', 'type', 'url', 'faculty', 'dept', 'level'])

        scored = []
        if _model is not None and req.studentId:
            try:
                known_students  = set(_le_student.classes_)
                known_resources = set(_le_resource.classes_)

                if req.studentId in known_students:
                    s_enc   = int(_le_student.transform([req.studentId])[0])
                    le_fac  = LabelEncoder().fit(df_res['faculty'].astype(str))
                    le_dept = LabelEncoder().fit(df_res['dept'].astype(str))
                    le_type = LabelEncoder().fit(df_res['type'].astype(str))

                    for _, row in df_res.iterrows():
                        r_enc = int(_le_resource.transform([row['id']])[0]) if row['id'] in known_resources else 0
                        feat = np.array([[
                            s_enc, r_enc,
                            int(le_fac.transform([str(row['faculty'])])[0]),
                            int(le_dept.transform([str(row['dept'])])[0]),
                            int(row['level']) // 100,
                            int(le_type.transform([str(row['type'])])[0]),
                            0, 0, int(row['level']),
                        ]], dtype=float)
                        prob = float(_model.predict_proba(feat)[0][1])
                        scored.append({'score': prob, **row.to_dict()})
                    scored.sort(key=lambda x: x['score'], reverse=True)
                else:
                    scored = df_res.sample(min(req.limit, len(df_res))).to_dict('records')
            except Exception:
                scored = df_res.sample(min(req.limit, len(df_res))).to_dict('records')
        else:
            scored = df_res.sample(min(req.limit, len(df_res))).to_dict('records')

        result = scored[:req.limit]

        context_note = 'Resources selected based on your profile and interaction history.'
        if API_KEY:
            try:
                ctx_resp = llm_client.chat.completions.create(
                    model=MODEL,
                    messages=[{'role': 'user', 'content': (
                        f"In one sentence, explain why these resources are useful "
                        f"for a {'Level ' + str(req.level) + ' ' if req.level else ''}"
                        f"{req.dept or 'university'} student: "
                        f"{[r['title'] for r in result[:5]]}"
                    )}],
                    max_tokens=120,
                )
                context_note = ctx_resp.choices[0].message.content
            except Exception:
                pass

        return {
            'recommendations': result,
            'context': context_note,
            'total_available': len(df_res),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
