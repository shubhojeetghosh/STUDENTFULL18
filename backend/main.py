import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


from backend.quiz_engine.repository.postgres import (
    PostgresExamRepository,
    PostgresAttemptRepository,
    PostgresAudioTracker,
)
from backend.quiz_engine.repository.in_memory import (
    InMemoryExamRepository,
    InMemoryAttemptRepository,
    InMemoryAudioTracker,
)

from backend.quiz_engine.routes.quiz_routes import router as quiz_router
from backend.quiz_engine.routes.attempt_routes import router as attempt_router


# ============================================================
# LOAD ENVIRONMENT
# ============================================================

load_dotenv()

USE_DB = os.getenv("USE_DB", "true").lower() == "true"

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000",
)


# ============================================================
# APPLICATION LIFESPAN
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    if USE_DB:
        app.state.exam_repo = PostgresExamRepository()
        app.state.attempt_repo = PostgresAttemptRepository()
        app.state.audio_tracker = PostgresAudioTracker()

        print("Database mode: PostgreSQL/Neon")

    else:
        app.state.exam_repo = InMemoryExamRepository()
        app.state.attempt_repo = InMemoryAttemptRepository()
        app.state.audio_tracker = InMemoryAudioTracker()

        print("Database mode: In-memory")

    yield

# ============================================================
# CREATE FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Quiz Platform API",
    version="1.0.0",
    lifespan=lifespan,
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# STATIC / MEDIA FILES
# ============================================================

MEDIA_FOLDER = os.getenv("MEDIA_FOLDER", "./media")

if os.path.isdir(MEDIA_FOLDER):
    app.mount(
        "/media",
        StaticFiles(directory=MEDIA_FOLDER),
        name="media",
    )


# ============================================================
# ROUTES
# ============================================================

app.include_router(quiz_router)
app.include_router(attempt_router)


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Quiz Platform API is running",
        "database": "postgresql" if USE_DB else "in-memory",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "database": "postgresql" if USE_DB else "in-memory",
    }