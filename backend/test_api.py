"""
test_api.py - Comprehensive smoke test suite for MoneyMind FastAPI backend.

Tests all API endpoints including authentication, trade journal,
and all existing functionality.
"""
import sys
import os
import asyncio

# Ensure we're in the backend directory
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app
from database import init_db

# Create tables before running tests
asyncio.run(init_db())

client = TestClient(app)

# Track auth token for authenticated tests
AUTH_TOKEN = None
TEST_USER_ID = None


def test_health():
    """Test health check endpoint."""
    print("\n" + "=" * 60)
    print("TEST: /health")
    r = client.get("/health")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    data = r.json()
    assert data["status"] == "ok"
    print(f"Health: {data['status']}, db={data.get('database', 'n/a')}")


def test_root():
    """Test root endpoint."""
    print("\nTEST: /")
    r = client.get("/")
    assert r.status_code == 200, f"Root failed: {r.text}"
    data = r.json()
    assert data["status"] == "running"
    print(f"Root: {data['name']} v{data['version']}")


def test_explain():
    """Test explain endpoint."""
    print("\nTEST: /explain?term=Beta")
    r = client.get("/explain?term=Beta")
    assert r.status_code == 200, f"Explain failed: {r.text}"
    data = r.json()
    assert "eli5" in data
    assert "analogy" in data
    print(f"Explain: term={data['term']}, source={data['source']}")


def test_explain_all():
    """Test explain/all endpoint."""
    print("\nTEST: /explain/all")
    r = client.get("/explain/all")
    assert r.status_code == 200, f"Explain all failed: {r.text}"
    data = r.json()
    assert isinstance(data, list)
    print(f"Glossary terms: {len(data)}")


def test_risk_score():
    """Test risk-score endpoint."""
    print("\nTEST: /risk-score?ticker=AAPL")
    r = client.get("/risk-score?ticker=AAPL")
    assert r.status_code == 200, f"Risk score failed: {r.text}"
    data = r.json()
    assert "score" in data
    assert "label" in data
    print(f"Risk: score={data['score']}, label={data['label']}, source={data['source']}")


def test_hype_score():
    """Test hype-score endpoint."""
    print("\nTEST: /hype-score?ticker=GME")
    r = client.get("/hype-score?ticker=GME")
    assert r.status_code == 200, f"Hype score failed: {r.text}"
    data = r.json()
    assert "hype_score" in data
    assert "label" in data
    print(f"Hype: score={data['hype_score']}, label={data['label']}, source={data['source']}")


def test_coach_evaluate():
    """Test coach/evaluate endpoint."""
    print("\nTEST: /coach/evaluate")
    r = client.post("/coach/evaluate", json={
        "ticker": "TSLA",
        "asset_name": "Tesla Inc.",
        "amount": 1000.0,
        "user_risk_tolerance": "Moderate",
        "risk_score": 68.0,
        "risk_label": "High",
        "hype_score": 75.0,
        "hype_label": "Hype-driven",
    })
    assert r.status_code == 200, f"Coach evaluate failed: {r.text}"
    data = r.json()
    assert "status" in data
    assert "socratic_questions" in data
    print(f"Coach: status={data['status']}, questions={len(data['socratic_questions'])}")


def test_price():
    """Test price endpoint."""
    print("\nTEST: /price/AAPL")
    r = client.get("/price/AAPL")
    assert r.status_code == 200, f"Price failed: {r.text}"
    data = r.json()
    assert "price" in data
    print(f"Price: {data['ticker']}=${data['price']}, source={data['source']}")


def test_price_all():
    """Test price/all endpoint."""
    print("\nTEST: /price/all")
    r = client.get("/price/all")
    assert r.status_code == 200, f"Price all failed: {r.text}"
    data = r.json()
    assert isinstance(data, list)
    print(f"All prices: {len(data)} assets")


def test_auth_register():
    """Test user registration."""
    global AUTH_TOKEN, TEST_USER_ID
    print("\nTEST: /auth/register")
    r = client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User",
        "user_type": "investor",
    })
    assert r.status_code == 201, f"Register failed: {r.text}"
    data = r.json()
    assert "access_token" in data
    assert "user" in data
    AUTH_TOKEN = data["access_token"]
    TEST_USER_ID = data["user"]["id"]
    print(f"Registered: user_id={TEST_USER_ID[:8]}..., email={data['user']['email']}")


def test_auth_login():
    """Test user login."""
    global AUTH_TOKEN
    print("\nTEST: /auth/login")
    r = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "testpassword123",
    })
    assert r.status_code == 200, f"Login failed: {r.text}"
    data = r.json()
    assert "access_token" in data
    AUTH_TOKEN = data["access_token"]
    print(f"Logged in: token={AUTH_TOKEN[:20]}...")


def test_auth_me():
    """Test authenticated profile endpoint."""
    global AUTH_TOKEN
    print("\nTEST: /auth/me")
    r = client.get("/auth/me", headers={"Authorization": f"Bearer {AUTH_TOKEN}"})
    assert r.status_code == 200, f"Auth me failed: {r.text}"
    data = r.json()
    assert data["email"] == "test@example.com"
    print(f"Profile: {data['full_name']}, fitness={data['fitness_score']}")


def test_auth_demo():
    """Test demo login endpoint."""
    print("\nTEST: /auth/demo")
    r = client.post("/auth/demo")
    assert r.status_code == 200, f"Demo login failed: {r.text}"
    data = r.json()
    assert "access_token" in data
    print(f"Demo user: {data['user']['email']}")


def test_trade_journal():
    """Test trade journal CRUD."""
    global AUTH_TOKEN
    print("\nTEST: /journal/trades (create)")
    r = client.post("/journal/trades", json={
        "ticker": "AAPL",
        "asset_name": "Apple Inc.",
        "asset_type": "stock",
        "amount": 500.0,
        "price": 150.0,
        "risk_score": 35.0,
        "risk_label": "Low",
        "hype_score": 20.0,
        "hype_label": "Fundamentals-driven",
        "user_risk_tolerance": "Moderate",
        "fitness_delta": 6,
        "rationale": "Strong fundamentals and consistent growth",
    }, headers={"Authorization": f"Bearer {AUTH_TOKEN}"})
    assert r.status_code == 201, f"Create trade failed: {r.text}"
    trade = r.json()
    trade_id = trade["id"]
    print(f"Trade created: {trade['ticker']} ${trade['amount']}, fitness_delta={trade['fitness_delta']}")

    print("\nTEST: /journal/trades (list)")
    r = client.get("/journal/trades", headers={"Authorization": f"Bearer {AUTH_TOKEN}"})
    assert r.status_code == 200, f"List trades failed: {r.text}"
    trades = r.json()
    assert len(trades) >= 1
    print(f"Trades listed: {len(trades)}")

    print(f"\nTEST: /journal/trades/{trade_id}")
    r = client.get(f"/journal/trades/{trade_id}", headers={"Authorization": f"Bearer {AUTH_TOKEN}"})
    assert r.status_code == 200, f"Get trade failed: {r.text}"
    print(f"Trade retrieved: {r.json()['ticker']}")


def test_fitness_profile():
    """Test fitness profile endpoint."""
    global AUTH_TOKEN
    print("\nTEST: /journal/fitness")
    r = client.get("/journal/fitness", headers={"Authorization": f"Bearer {AUTH_TOKEN}"})
    assert r.status_code == 200, f"Fitness profile failed: {r.text}"
    data = r.json()
    assert "score" in data
    assert "tier" in data
    assert "history" in data
    print(f"Fitness: score={data['score']}, tier={data['tier']}")


def test_api_price_compat():
    """Test backward-compatible /api/price endpoint."""
    print("\nTEST: /api/price/AAPL (backward compat)")
    r = client.get("/api/price/AAPL")
    assert r.status_code == 200, f"API price compat failed: {r.text}"
    data = r.json()
    assert "price" in data
    print(f"API price compat: {data['ticker']}=${data['price']}")


def run_all_tests():
    """Run all tests in sequence."""
    tests = [
        test_health,
        test_root,
        test_explain,
        test_explain_all,
        test_risk_score,
        test_hype_score,
        test_coach_evaluate,
        test_price,
        test_price_all,
        test_auth_register,
        test_auth_login,
        test_auth_me,
        test_auth_demo,
        test_trade_journal,
        test_fitness_profile,
        test_api_price_compat,
    ]

    passed = 0
    failed = 0

    print("\n" + "=" * 60)
    print("MoneyMind Backend Test Suite")
    print("=" * 60)

    for test_fn in tests:
        try:
            test_fn()
            passed += 1
            print(f"  PASS: {test_fn.__name__}")
        except Exception as exc:
            failed += 1
            print(f"  FAIL: {test_fn.__name__} - {exc}")

    print("\n" + "=" * 60)
    print(f"Results: {passed} passed, {failed} failed out of {len(tests)} tests")
    print("=" * 60)

    if failed > 0:
        sys.exit(1)
    else:
        print("\n[ALL TESTS PASSED SUCCESSFULLY!]")
        sys.exit(0)


if __name__ == "__main__":
    run_all_tests()
