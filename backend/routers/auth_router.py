"""
routers/auth_router.py - Authentication and user management endpoints.

Provides registration, login, profile management, and demo mode.
All endpoints are fully backward-compatible with the frontend's
localStorage-based auth flow.
"""

from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from auth import (
    create_access_token,
    get_current_user,
    get_optional_user,
    hash_password,
    verify_password,
)
from config import get_settings
from database import get_db
from models import User
from schemas import (
    TokenResponse,
    UserCreate,
    UserLogin,
    UserProfile,
    UserProfileUpdate,
)

logger = logging.getLogger("moneymind.auth_router")
router = APIRouter()


def _user_to_profile(user: User) -> UserProfile:
    """Convert ORM User to Pydantic UserProfile."""
    return UserProfile(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        user_type=user.user_type,
        fitness_score=user.fitness_score,
        fitness_tier=user.fitness_tier,
        risk_tolerance=user.risk_tolerance,
        created_at=user.created_at,
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(body: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user account."""
    # Check for existing email
    result = await db.execute(select(User).where(User.email == body.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user = User(
        email=body.email,
        full_name=body.full_name,
        hashed_password=hash_password(body.password),
        user_type=body.user_type,
    )
    db.add(user)
    await db.flush()  # Get the ID without committing

    token = create_access_token({"sub": user.id, "email": user.email})
    logger.info("New user registered: %s", user.email)

    return TokenResponse(
        access_token=token,
        user=_user_to_profile(user),
    )


@router.post("/login", response_model=TokenResponse)
async def login(body: UserLogin, db: AsyncSession = Depends(get_db)):
    """Login with email and password."""
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()

    if user is None or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated.",
        )

    token = create_access_token({"sub": user.id, "email": user.email})
    logger.info("User logged in: %s", user.email)

    return TokenResponse(
        access_token=token,
        user=_user_to_profile(user),
    )


@router.post("/demo", response_model=TokenResponse)
async def demo_login(db: AsyncSession = Depends(get_db)):
    """Quick demo login — creates or returns demo user without requiring credentials.

    This supports the frontend's "Quick Demo" button flow.
    """
    demo_email = "investor@FundBee.demo"
    result = await db.execute(select(User).where(User.email == demo_email))
    user = result.scalar_one_or_none()

    if user is None:
        user = User(
            email=demo_email,
            full_name="Demo Investor",
            hashed_password=hash_password("demo-password-not-used"),
            user_type="investor",
            fitness_score=70,
            fitness_tier="Rookie Observer",
            risk_tolerance="Moderate",
        )
        db.add(user)
        await db.flush()
        logger.info("Demo user created: %s", demo_email)

    token = create_access_token({"sub": user.id, "email": user.email})

    return TokenResponse(
        access_token=token,
        user=_user_to_profile(user),
    )


@router.get("/me", response_model=UserProfile)
async def get_profile(user: User = Depends(get_current_user)):
    """Get the current authenticated user's profile."""
    return _user_to_profile(user)


@router.put("/me", response_model=UserProfile)
async def update_profile(
    body: UserProfileUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update the current user's profile."""
    if body.full_name is not None:
        user.full_name = body.full_name
    if body.risk_tolerance is not None:
        user.risk_tolerance = body.risk_tolerance

    await db.flush()
    return _user_to_profile(user)


@router.get("/check")
async def auth_check(user: Optional[User] = Depends(get_optional_user)):
    """Check if the current request is authenticated.

    Returns user info if authenticated, null user if not.
    Used by frontend to sync auth state on page load.
    """
    if user is None:
        return {"authenticated": False, "user": None}
    return {"authenticated": True, "user": _user_to_profile(user)}
