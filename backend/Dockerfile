# ═══════════════════════════════════════════════════════════════════════════
# MoneyMind Backend - Multi-stage Docker Build
# ═══════════════════════════════════════════════════════════════════════════

# ── Stage 1: Build dependencies ──────────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /build

# Install system dependencies for compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first (layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ── Stage 2: Production image ───────────────────────────────────────────
FROM python:3.12-slim AS production

# Security: non-root user
RUN groupadd -r moneymind && useradd -r -g moneymind -d /app moneymind

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy application code
COPY . .

# Create data directories with correct permissions
RUN mkdir -p /app/data /app/models && chown -R moneymind:moneymind /app

# Switch to non-root user
USER moneymind

# Environment variables for production
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    ENVIRONMENT=production \
    LOG_LEVEL=INFO

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD python -c "import httpx; r = httpx.get('http://localhost:8000/health'); assert r.status_code == 200"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--loop", "uvloop", "--http", "httptools"]
