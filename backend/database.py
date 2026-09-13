"""
database.py - Async SQLAlchemy engine and session management.

Supports SQLite (development) and PostgreSQL (production).
Uses connection pooling for production performance.
"""

from __future__ import annotations

import logging
from typing import AsyncGenerator

from sqlalchemy import MetaData, event, text
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from config import get_settings

logger = logging.getLogger("moneymind.database")

# Naming convention for constraints (helps Alembic generate migrations)
CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    """Base class for all ORM models."""

    metadata = MetaData(naming_convention=CONVENTION)


def _build_engine(settings=None):
    """Create the async engine with appropriate pool settings."""
    if settings is None:
        settings = get_settings()

    url = settings.DATABASE_URL

    # SQLite-specific: use aiosqlite driver if plain sqlite path
    if url.startswith("sqlite://"):
        url = url.replace("sqlite://", "sqlite+aiosqlite://", 1)

    is_sqlite = "sqlite" in url.lower()
    is_test = settings.ENVIRONMENT.value == "testing"

    connect_args = {}
    pool_kwargs = {}

    if is_sqlite:
        connect_args["check_same_thread"] = False
        # SQLite doesn't support pool_size/max_overflow
        pool_kwargs["poolclass"] = None  # use default StaticPool for SQLite
    else:
        pool_kwargs["pool_size"] = 5
        pool_kwargs["max_overflow"] = 10
        pool_kwargs["pool_timeout"] = 30
        pool_kwargs["pool_recycle"] = 1800

    engine = create_async_engine(
        url,
        echo=settings.DEBUG and not is_test,
        connect_args=connect_args,
        **pool_kwargs,
    )

    return engine


# Module-level engine and session factory (initialized lazily)
_engine = None
_session_factory = None


def get_engine():
    """Get or create the async engine singleton."""
    global _engine
    if _engine is None:
        _engine = _build_engine()
    return _engine


def get_session_factory():
    """Get or create the session factory singleton."""
    global _session_factory
    if _session_factory is None:
        _session_factory = async_sessionmaker(
            bind=get_engine(),
            class_=AsyncSession,
            expire_on_commit=False,
        )
    return _session_factory


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency that provides a database session."""
    factory = get_session_factory()
    async with factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """Create all tables (for development). Use Alembic in production."""
    engine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created successfully.")


async def close_db() -> None:
    """Dispose of the engine pool on shutdown."""
    global _engine, _session_factory
    if _engine is not None:
        await _engine.dispose()
        _engine = None
        _session_factory = None
        logger.info("Database connection pool closed.")
