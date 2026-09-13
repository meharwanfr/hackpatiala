"""initial_schema

Revision ID: 001
Revises:
Create Date: 2025-01-01

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── users table ──────────────────────────────────────────────────
    op.create_table(
        "users",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("email", sa.String(255), unique=True, nullable=False, index=True),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("user_type", sa.String(50), server_default="investor"),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("1")),
        sa.Column("fitness_score", sa.Integer(), server_default=sa.text("70")),
        sa.Column("fitness_tier", sa.String(50), server_default="Rookie Observer"),
        sa.Column("risk_tolerance", sa.String(50), server_default="Moderate"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ── trade_journals table ─────────────────────────────────────────
    op.create_table(
        "trade_journals",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("ticker", sa.String(20), nullable=False, index=True),
        sa.Column("asset_name", sa.String(255), nullable=False),
        sa.Column("asset_type", sa.String(20), server_default="stock"),
        sa.Column("amount", sa.Float(), nullable=False),
        sa.Column("price", sa.Float(), nullable=False),
        sa.Column("risk_score", sa.Float(), nullable=False),
        sa.Column("risk_label", sa.String(20), nullable=False),
        sa.Column("hype_score", sa.Float(), nullable=False),
        sa.Column("hype_label", sa.String(50), nullable=False),
        sa.Column("user_risk_tolerance", sa.String(50), server_default="Moderate"),
        sa.Column("answers", sa.Text(), server_default="{}"),
        sa.Column("fitness_delta", sa.Integer(), server_default=sa.text("0")),
        sa.Column("rationale", sa.Text(), server_default=""),
        sa.Column("counterfactual_return", sa.Float(), server_default=sa.text("0.0")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name="fk_trades_user"),
    )
    op.create_index("ix_trades_user_ticker", "trade_journals", ["user_id", "ticker"])
    op.create_index("ix_trades_created", "trade_journals", ["created_at"])

    # ── fitness_logs table ───────────────────────────────────────────
    op.create_table(
        "fitness_logs",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("delta", sa.Integer(), nullable=False),
        sa.Column("reason", sa.Text(), nullable=False),
        sa.Column("ticker", sa.String(20), nullable=True),
        sa.Column("new_score", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name="fk_fitness_user"),
    )
    op.create_index("ix_fitness_user_created", "fitness_logs", ["user_id", "created_at"])

    # ── glossary_cache table ─────────────────────────────────────────
    op.create_table(
        "glossary_cache",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("term", sa.String(255), unique=True, nullable=False, index=True),
        sa.Column("slug", sa.String(255), unique=True, nullable=False),
        sa.Column("eli5", sa.Text(), nullable=False),
        sa.Column("analogy", sa.Text(), nullable=False),
        sa.Column("keywords", sa.Text(), server_default="[]"),
        sa.Column("source", sa.String(50), server_default="curated"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("glossary_cache")
    op.drop_table("fitness_logs")
    op.drop_table("trade_journals")
    op.drop_table("users")
