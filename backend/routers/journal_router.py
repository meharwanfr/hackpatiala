"""
routers/journal_router.py - Trade journal and fitness score endpoints.

Provides CRUD for paper trade journal entries and fitness score tracking.
All endpoints require authentication.
"""

from __future__ import annotations

import json
import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from auth import get_current_user
from database import get_db
from models import FitnessLog, TradeJournal, User
from schemas import (
    FitnessLogEntry,
    FitnessProfileResponse,
    TradeCreate,
    TradeResponse,
)

logger = logging.getLogger("moneymind.journal")
router = APIRouter()


# ═══════════════════════════════════════════════════════════════════════════
# Trade Journal CRUD
# ═══════════════════════════════════════════════════════════════════════════


@router.get("/trades", response_model=list[TradeResponse])
async def list_trades(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    ticker: Optional[str] = Query(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List the current user's trade journal entries with pagination."""
    query = select(TradeJournal).where(TradeJournal.user_id == user.id)
    if ticker:
        query = query.where(TradeJournal.ticker == ticker.upper())
    query = query.order_by(TradeJournal.created_at.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    trades = result.scalars().all()
    return trades


@router.post("/trades", response_model=TradeResponse, status_code=status.HTTP_201_CREATED)
async def create_trade(
    body: TradeCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new trade journal entry."""
    trade = TradeJournal(
        user_id=user.id,
        ticker=body.ticker.upper(),
        asset_name=body.asset_name,
        asset_type=body.asset_type,
        amount=body.amount,
        price=body.price,
        risk_score=body.risk_score,
        risk_label=body.risk_label,
        hype_score=body.hype_score,
        hype_label=body.hype_label,
        user_risk_tolerance=body.user_risk_tolerance,
        answers=json.dumps(body.answers),
        fitness_delta=body.fitness_delta,
        rationale=body.rationale,
    )
    db.add(trade)
    await db.flush()

    # Update user's fitness score
    user.fitness_score = max(0, min(100, user.fitness_score + body.fitness_delta))
    user.fitness_tier = _compute_tier(user.fitness_score)

    # Log the fitness change
    fitness_log = FitnessLog(
        user_id=user.id,
        delta=body.fitness_delta,
        reason=f"Paper trade: {body.ticker.upper()} — {body.rationale[:100] if body.rationale else 'Trade executed'}",
        ticker=body.ticker.upper(),
        new_score=user.fitness_score,
    )
    db.add(fitness_log)
    await db.flush()

    logger.info(
        "Trade created: %s %s $%.2f by user %s (fitness %+d -> %d)",
        body.ticker, body.asset_name, body.amount, user.id[:8],
        body.fitness_delta, user.fitness_score,
    )

    return trade


@router.get("/trades/{trade_id}", response_model=TradeResponse)
async def get_trade(
    trade_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific trade journal entry."""
    result = await db.execute(
        select(TradeJournal).where(
            TradeJournal.id == trade_id,
            TradeJournal.user_id == user.id,
        )
    )
    trade = result.scalar_one_or_none()
    if trade is None:
        raise HTTPException(status_code=404, detail="Trade not found.")
    return trade


@router.delete("/trades/{trade_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trade(
    trade_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a trade journal entry."""
    result = await db.execute(
        select(TradeJournal).where(
            TradeJournal.id == trade_id,
            TradeJournal.user_id == user.id,
        )
    )
    trade = result.scalar_one_or_none()
    if trade is None:
        raise HTTPException(status_code=404, detail="Trade not found.")

    await db.delete(trade)
    await db.flush()


# ═══════════════════════════════════════════════════════════════════════════
# Fitness Score
# ═══════════════════════════════════════════════════════════════════════════


@router.get("/fitness", response_model=FitnessProfileResponse)
async def get_fitness_profile(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get the user's complete fitness profile with history and trades."""
    # Fetch fitness logs
    logs_result = await db.execute(
        select(FitnessLog)
        .where(FitnessLog.user_id == user.id)
        .order_by(FitnessLog.created_at.desc())
        .limit(100)
    )
    logs = logs_result.scalars().all()

    # Fetch recent trades
    trades_result = await db.execute(
        select(TradeJournal)
        .where(TradeJournal.user_id == user.id)
        .order_by(TradeJournal.created_at.desc())
        .limit(50)
    )
    trades = trades_result.scalars().all()

    return FitnessProfileResponse(
        score=user.fitness_score,
        tier=user.fitness_tier,
        risk_tolerance=user.risk_tolerance,
        history=logs,
        trades=trades,
    )


@router.post("/fitness/log", response_model=FitnessLogEntry, status_code=status.HTTP_201_CREATED)
async def create_fitness_log(
    delta: int = Query(..., ge=-100, le=100),
    reason: str = Query(..., min_length=1, max_length=500),
    ticker: Optional[str] = Query(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Log a fitness score change (for non-trade-related events)."""
    user.fitness_score = max(0, min(100, user.fitness_score + delta))
    user.fitness_tier = _compute_tier(user.fitness_score)

    log = FitnessLog(
        user_id=user.id,
        delta=delta,
        reason=reason,
        ticker=ticker,
        new_score=user.fitness_score,
    )
    db.add(log)
    await db.flush()

    return log


@router.get("/fitness/history", response_model=list[FitnessLogEntry])
async def get_fitness_history(
    limit: int = Query(50, ge=1, le=200),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get the user's fitness score change history."""
    result = await db.execute(
        select(FitnessLog)
        .where(FitnessLog.user_id == user.id)
        .order_by(FitnessLog.created_at.desc())
        .limit(limit)
    )
    return result.scalars().all()


# ═══════════════════════════════════════════════════════════════════════════
# Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _compute_tier(score: int) -> str:
    """Map fitness score to a tier name."""
    if score >= 90:
        return "Zen Master"
    elif score >= 75:
        return "Disciplined Investor"
    elif score >= 50:
        return "Mindful Saver"
    else:
        return "Rookie Observer"
