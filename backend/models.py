"""
models.py - SQLAlchemy ORM models for MoneyMind.

Defines the database schema for users, trade journals, fitness logs,
and glossary cache. All models use UUID primary keys for distributed
safety and automatic timestamp tracking.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    """User account with profile and fitness data."""

    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    user_type: Mapped[str] = mapped_column(String(50), default="investor")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Fitness profile
    fitness_score: Mapped[int] = mapped_column(Integer, default=70)
    fitness_tier: Mapped[str] = mapped_column(String(50), default="Rookie Observer")
    risk_tolerance: Mapped[str] = mapped_column(String(50), default="Moderate")

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=_utcnow
    )

    # Relationships
    trades: Mapped[list["TradeJournal"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    fitness_logs: Mapped[list["FitnessLog"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class TradeJournal(Base):
    """Paper trade journal entries for a user."""

    __tablename__ = "trade_journals"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    ticker: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    asset_name: Mapped[str] = mapped_column(String(255), nullable=False)
    asset_type: Mapped[str] = mapped_column(String(20), default="stock")
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    risk_score: Mapped[float] = mapped_column(Float, nullable=False)
    risk_label: Mapped[str] = mapped_column(String(20), nullable=False)
    hype_score: Mapped[float] = mapped_column(Float, nullable=False)
    hype_label: Mapped[str] = mapped_column(String(50), nullable=False)
    user_risk_tolerance: Mapped[str] = mapped_column(String(50), default="Moderate")
    answers: Mapped[str] = mapped_column(Text, default="{}")  # JSON string of coach answers
    fitness_delta: Mapped[int] = mapped_column(Integer, default=0)
    rationale: Mapped[str] = mapped_column(Text, default="")
    counterfactual_return: Mapped[float] = mapped_column(Float, default=0.0)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user: Mapped["User"] = relationship(back_populates="trades")

    __table_args__ = (
        Index("ix_trades_user_ticker", "user_id", "ticker"),
        Index("ix_trades_created", "created_at"),
    )


class FitnessLog(Base):
    """Fitness score change log entries."""

    __tablename__ = "fitness_logs"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    delta: Mapped[int] = mapped_column(Integer, nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    ticker: Mapped[str] = mapped_column(String(20), nullable=True)
    new_score: Mapped[int] = mapped_column(Integer, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user: Mapped["User"] = relationship(back_populates="fitness_logs")

    __table_args__ = (
        Index("ix_fitness_user_created", "user_id", "created_at"),
    )


class GlossaryCache(Base):
    """Cached glossary terms (optional, for dynamic updates)."""

    __tablename__ = "glossary_cache"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    term: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    eli5: Mapped[str] = mapped_column(Text, nullable=False)
    analogy: Mapped[str] = mapped_column(Text, nullable=False)
    keywords: Mapped[str] = mapped_column(Text, default="[]")  # JSON array string
    source: Mapped[str] = mapped_column(String(50), default="curated")

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=_utcnow
    )
