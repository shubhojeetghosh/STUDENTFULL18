"""
Database Configuration
======================
SQLAlchemy engine + session factory for the Neon PostgreSQL database.
Uses psycopg v3 driver (postgresql+psycopg://).
"""

import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# Load .env from the backend/ directory regardless of working directory
_env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(_env_path)

DATABASE_URL = os.getenv("DATABASE_URL", "")

if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL not found. "
        "Ensure backend/.env exists with a valid DATABASE_URL."
    )


# ── Engine ────────────────────────────────────────────────────────────────────
# pool_pre_ping keeps connections alive through Neon's auto-suspend.
# echo=False in production; set to True locally for SQL debugging.
engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_recycle=300,          # recycle every 5 min — suits Neon's idle timeout
)

# ── Session factory ───────────────────────────────────────────────────────────
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# ── Declarative base (SQLAlchemy 2.x style) ───────────────────────────────────
class Base(DeclarativeBase):
    pass


# ── FastAPI dependency ────────────────────────────────────────────────────────
def get_db():
    """
    Yields a database session for use in FastAPI route dependencies.
    Automatically closes the session after the request completes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
