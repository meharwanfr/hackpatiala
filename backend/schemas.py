"""
schemas.py - Pydantic request/response schemas for MoneyMind API.

Centralizes all API schemas for validation, serialization, and documentation.
These match the frontend TypeScript interfaces in src/types.ts.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ═══════════════════════════════════════════════════════════════════════════
# Auth Schemas
# ═══════════════════════════════════════════════════════════════════════════


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    full_name: str = Field(..., min_length=1, max_length=255)
    user_type: str = Field(default="investor", pattern=r"^(investor|student|educator)$")


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserProfile"


class UserProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    full_name: str
    user_type: str
    fitness_score: int
    fitness_tier: str
    risk_tolerance: str
    created_at: datetime


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=255)
    risk_tolerance: Optional[str] = Field(None, pattern=r"^(Conservative|Moderate|Aggressive)$")


# ═══════════════════════════════════════════════════════════════════════════
# Risk Schemas
# ═══════════════════════════════════════════════════════════════════════════


class RiskInput(BaseModel):
    ticker: Optional[str] = None
    annualized_vol: Optional[float] = Field(None, description="Annualized volatility")
    beta_vs_spy: Optional[float] = Field(None, description="Beta relative to S&P 500")
    max_drawdown_1yr: Optional[float] = Field(None, description="Maximum 1yr drawdown")
    log_market_cap: Optional[float] = Field(None, description="Natural log of market cap")
    sector_encoded: Optional[float] = Field(None, description="Sector numeric code")
    avg_volume_zscore: Optional[float] = Field(0.0, description="Volume z-score")


class RiskResponse(BaseModel):
    ticker: Optional[str]
    score: float
    label: str
    confidence: float
    components: dict[str, Any]
    source: str


# ═══════════════════════════════════════════════════════════════════════════
# Hype Schemas
# ═══════════════════════════════════════════════════════════════════════════


class HypeInput(BaseModel):
    ticker: Optional[str] = None
    headlines: Optional[list[str]] = Field(None, description="Headlines or social posts")


class HeadlineBreakdown(BaseModel):
    headline: str
    score: float


class HypeResponse(BaseModel):
    ticker: Optional[str]
    hype_score: float
    label: str
    breakdown: list[HeadlineBreakdown]
    headlines_analyzed: int
    source: str


# ═══════════════════════════════════════════════════════════════════════════
# Explain Schemas
# ═══════════════════════════════════════════════════════════════════════════


class ExplainResponse(BaseModel):
    term: str
    slug: str
    eli5: str
    analogy: str
    keywords: list[str] = []
    source: str


# ═══════════════════════════════════════════════════════════════════════════
# Coach Schemas
# ═══════════════════════════════════════════════════════════════════════════


class CoachEvaluateRequest(BaseModel):
    ticker: str
    asset_name: Optional[str] = None
    amount: float = Field(..., gt=0, description="Hypothetical investment amount ($)")
    user_risk_tolerance: str = Field("Moderate", pattern=r"^(Conservative|Moderate|Aggressive)$")
    risk_score: float = Field(..., ge=0, le=100)
    risk_label: str = Field("Medium", pattern=r"^(Low|Medium|High)$")
    hype_score: float = Field(..., ge=0, le=100)
    hype_label: str = Field("Fundamentals-driven")


class SocraticQuestion(BaseModel):
    id: str
    question: str
    why_it_matters: str
    options: list[str] = []


class CoachEvaluateResponse(BaseModel):
    ticker: str
    asset_name: str
    amount: float
    risk_match: bool
    hype_warning: bool
    status: str
    coach_headline: str
    socratic_questions: list[SocraticQuestion]
    fitness_impact_preview: int
    source: str


# ═══════════════════════════════════════════════════════════════════════════
# Price Schemas
# ═══════════════════════════════════════════════════════════════════════════


class PriceData(BaseModel):
    ticker: str
    name: str
    price: float
    change24h: float
    currency: str = "USD"
    priceHistory: list[float] = []
    priceHistory7d: list[float] = []
    source: str
    is_fallback: bool = False


# ═══════════════════════════════════════════════════════════════════════════
# Document Schemas
# ═══════════════════════════════════════════════════════════════════════════


class DocumentSummaryResponse(BaseModel):
    filename: str
    file_type: str
    word_count: int
    truncated: bool
    summary: str
    key_fact: str
    takeaway: str
    source: str


# ═══════════════════════════════════════════════════════════════════════════
# Trade Journal Schemas
# ═══════════════════════════════════════════════════════════════════════════


class TradeCreate(BaseModel):
    ticker: str
    asset_name: str
    asset_type: str = "stock"
    amount: float = Field(..., gt=0)
    price: float = Field(..., gt=0)
    risk_score: float
    risk_label: str
    hype_score: float
    hype_label: str
    user_risk_tolerance: str = "Moderate"
    answers: dict[str, str] = {}
    fitness_delta: int = 0
    rationale: str = ""


class TradeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    ticker: str
    asset_name: str
    asset_type: str
    amount: float
    price: float
    risk_score: float
    risk_label: str
    hype_score: float
    hype_label: str
    user_risk_tolerance: str
    answers: str
    fitness_delta: int
    rationale: str
    counterfactual_return: float
    created_at: datetime


# ═══════════════════════════════════════════════════════════════════════════
# Fitness Schemas
# ═══════════════════════════════════════════════════════════════════════════


class FitnessLogEntry(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    delta: int
    reason: str
    ticker: Optional[str]
    new_score: int
    created_at: datetime


class FitnessProfileResponse(BaseModel):
    score: int
    tier: str
    risk_tolerance: str
    history: list[FitnessLogEntry]
    trades: list[TradeResponse]


# ═══════════════════════════════════════════════════════════════════════════
# Common
# ═══════════════════════════════════════════════════════════════════════════


class ErrorResponse(BaseModel):
    detail: str
    code: str = "error"


class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
    models: dict[str, str]
    database: str
