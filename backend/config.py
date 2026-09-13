"""
config.py - Production configuration via environment variables.

Uses pydantic-settings for type-safe, validated configuration with
sensible defaults. Supports both SQLite (dev) and PostgreSQL (prod).
"""

from __future__ import annotations

import os
from enum import Enum
from functools import lru_cache
from pathlib import Path
from typing import Optional

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(str, Enum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"
    TESTING = "testing"


class Settings(BaseSettings):
    """Application settings loaded from environment variables and .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── App ──────────────────────────────────────────────────────────────
    APP_NAME: str = "MoneyMind API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: Environment = Environment.DEVELOPMENT
    DEBUG: bool = Field(default=False)
    LOG_LEVEL: str = Field(default="INFO")

    # ── CORS ─────────────────────────────────────────────────────────────
    CORS_ORIGINS: list[str] = Field(
        default=["http://localhost:5173", "http://localhost:3000"],
        description="Allowed CORS origins",
    )

    # ── Auth ─────────────────────────────────────────────────────────────
    SECRET_KEY: str = Field(
        default="change-me-in-production-use-openssl-rand-hex-32",
        description="JWT signing secret. MUST override in production.",
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60 * 24 * 7, description="Token TTL in minutes")
    ALGORITHM: str = "HS256"

    # ── Database ─────────────────────────────────────────────────────────
    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///./moneymind.db",
        description="Async SQLAlchemy database URL",
    )

    # ── External APIs ────────────────────────────────────────────────────
    GEMINI_API_KEY: str = Field(default="", description="Google Gemini API key")
    STOCK_API_KEY: str = Field(default="", description="Finnhub / Twelve Data API key")

    # ── Rate Limiting ────────────────────────────────────────────────────
    RATE_LIMIT_PER_MINUTE: int = Field(default=60, description="Requests per minute per IP")

    # ── File Uploads ─────────────────────────────────────────────────────
    MAX_UPLOAD_SIZE_MB: int = Field(default=5, description="Max document upload size in MB")

    @property
    def max_upload_bytes(self) -> int:
        return self.MAX_UPLOAD_SIZE_MB * 1024 * 1024

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v: str) -> str:
        if v == "change-me-in-production-use-openssl-rand-hex-32":
            import warnings
            warnings.warn(
                "SECRET_KEY is using the default value. "
                "Set a secure SECRET_KEY in production!",
                stacklevel=2,
            )
        return v


@lru_cache
def get_settings() -> Settings:
    """Cached singleton for application settings."""
    return Settings()
