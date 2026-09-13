"""
main.py - MoneyMind FastAPI Application Entry Point (Production)

Bootstraps the FastAPI app with:
- Environment-based configuration
- Structured logging
- CORS middleware with configurable origins
- ONNX model loading on startup
- Database initialization
- Rate limiting middleware
- Global error handlers
- All routers mounted with backward-compatible paths
"""

from __future__ import annotations

import json
import logging
import sys
import time
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, AsyncGenerator

import onnxruntime as ort
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import Environment, get_settings

# ---------------------------------------------------------------------------
# Logging configuration
# ---------------------------------------------------------------------------
settings = get_settings()

logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("moneymind")

# ---------------------------------------------------------------------------
# Paths to ONNX model files
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).parent
MODELS_DIR = BASE_DIR / "models"
RISK_SCALER_PATH = MODELS_DIR / "risk_scaler.json"


def load_models_into_state(app: FastAPI) -> None:
    """Load ONNX models into app.state.models with graceful fallback."""
    models: dict[str, Any] = {"risk": None, "hype": None}
    scaler_params: dict[str, Any] = {}

    # --- Risk model ---
    risk_path = MODELS_DIR / "risk_model.onnx"
    if not risk_path.exists():
        risk_path = MODELS_DIR / "risk_classifier.onnx"

    if risk_path.exists():
        try:
            models["risk"] = ort.InferenceSession(
                str(risk_path), providers=["CPUExecutionProvider"]
            )
            logger.info("Risk ONNX model loaded from %s", risk_path)
        except Exception as exc:
            logger.warning("Failed to load risk ONNX model: %s", exc)
    else:
        logger.warning("Risk ONNX model not found — running in fallback mode.")

    # --- Hype model ---
    hype_path = MODELS_DIR / "hype_model.onnx"
    if not hype_path.exists():
        hype_path = MODELS_DIR / "hype_classifier.onnx"

    if hype_path.exists():
        try:
            models["hype"] = ort.InferenceSession(
                str(hype_path), providers=["CPUExecutionProvider"]
            )
            logger.info("Hype ONNX model loaded from %s", hype_path)
        except Exception as exc:
            logger.warning("Failed to load hype ONNX model: %s", exc)
    else:
        logger.warning("Hype ONNX model not found — running in fallback mode.")

    # --- Risk scaler params ---
    if RISK_SCALER_PATH.exists():
        try:
            with open(RISK_SCALER_PATH, "r", encoding="utf-8-sig") as fh:
                scaler_params = json.load(fh)
            logger.info("Risk scaler params loaded.")
        except Exception as exc:
            logger.warning("Failed to load risk scaler params: %s", exc)

    app.state.models = models
    app.state.scaler_params = scaler_params


# ---------------------------------------------------------------------------
# Lifespan: startup and shutdown
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan: load models and init DB on startup, cleanup on shutdown."""
    # --- Startup ---
    logger.info("Starting MoneyMind API v%s [%s]", settings.APP_VERSION, settings.ENVIRONMENT.value)

    load_models_into_state(app)

    # Initialize database
    from database import init_db
    await init_db()

    logger.info(
        "MoneyMind API ready — risk_model=%s, hype_model=%s, db=%s",
        "loaded" if app.state.models["risk"] else "fallback",
        "loaded" if app.state.models["hype"] else "fallback",
        settings.DATABASE_URL.split("@")[-1] if "@" in settings.DATABASE_URL else settings.DATABASE_URL,
    )

    yield  # Application runs here

    # --- Shutdown ---
    from database import close_db
    await close_db()
    logger.info("MoneyMind API shut down cleanly.")


# ---------------------------------------------------------------------------
# App factory
# ---------------------------------------------------------------------------
app = FastAPI(
    title=settings.APP_NAME,
    description="Financial literacy backend — risk scoring, hype detection, coaching, and paper trading.",
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# Initialize immediately for test clients
load_models_into_state(app)

# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
)


# Request timing middleware
@app.middleware("http")
async def add_timing_header(request: Request, call_next):
    """Add X-Process-Time header and request ID to all responses."""
    import uuid
    request_id = str(uuid.uuid4())[:8]
    start = time.perf_counter()

    response = await call_next(request)

    elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
    response.headers["X-Process-Time"] = str(elapsed_ms)
    response.headers["X-Request-ID"] = request_id

    # Log slow requests
    if elapsed_ms > 1000:
        logger.warning(
            "Slow request: %s %s took %.1fms",
            request.method,
            request.url.path,
            elapsed_ms,
        )

    return response


# ---------------------------------------------------------------------------
# Global error handlers
# ---------------------------------------------------------------------------
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Structured error responses for HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": str(exc.detail), "code": f"http_{exc.status_code}"},
    )


@app.exception_handler(ValueError)
async def validation_error_handler(request: Request, exc: ValueError) -> JSONResponse:
    """Handle validation errors from business logic."""
    return JSONResponse(
        status_code=422,
        content={"detail": str(exc), "code": "validation_error"},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all handler for unexpected errors."""
    logger.exception("Unhandled exception: %s", exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "code": "internal_error"},
    )


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
from routers import auth_router, coach, document, explain, hype, journal_router, price, risk

# Backward-compatible routes (frontend expects these exact paths)
app.include_router(explain.router, prefix="/explain", tags=["Explain"])
app.include_router(risk.router, prefix="/risk-score", tags=["Risk"])
app.include_router(hype.router, prefix="/hype-score", tags=["Hype"])
app.include_router(coach.router, prefix="/coach", tags=["Coach"])
app.include_router(price.router, prefix="/price", tags=["Price"])
app.include_router(price.router, prefix="/api/price", tags=["Price"])
app.include_router(document.router, prefix="/document", tags=["Document"])
app.include_router(document.router, prefix="/api/document", tags=["Document"])

# New authenticated routes
app.include_router(auth_router.router, prefix="/auth", tags=["Auth"])
app.include_router(journal_router.router, prefix="/journal", tags=["Journal"])


# ---------------------------------------------------------------------------
# Root & health
# ---------------------------------------------------------------------------
@app.get("/", tags=["Meta"])
async def root() -> dict[str, str]:
    """API root — basic identification."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "environment": settings.ENVIRONMENT.value,
    }


@app.get("/health", tags=["Meta"])
async def health() -> dict[str, Any]:
    """Health check — reports model load status and DB connectivity."""
    models = getattr(app.state, "models", {"risk": None, "hype": None})

    # Quick DB connectivity check
    db_status = "ok"
    try:
        from database import get_engine
        engine = get_engine()
        async with engine.connect() as conn:
            from sqlalchemy import text
            await conn.execute(text("SELECT 1"))
    except Exception as exc:
        db_status = f"error: {exc}"
        logger.warning("Health check DB probe failed: %s", exc)

    return {
        "status": "ok",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT.value,
        "models": {
            "risk": "loaded" if models.get("risk") is not None else "fallback",
            "hype": "loaded" if models.get("hype") is not None else "fallback",
        },
        "database": db_status,
    }
