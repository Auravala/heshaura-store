"""Backend tests for HESHAURA Store — Account 3.
Covers products, auth, orders as per frozen spec.
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or "https://backend-launch-8.preview.emergentagent.com"
BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"

# Password comes from env so no credential is committed. Set TEST_CUSTOMER_PASSWORD
# (see /app/memory/test_credentials.md, gitignored) before running auth tests.
SEED_CUSTOMER = {"email": "customer@heshaura.in", "password": os.environ.get("TEST_CUSTOMER_PASSWORD", "")}


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def customer_token(session):
    if not SEED_CUSTOMER["password"]:
        pytest.skip("TEST_CUSTOMER_PASSWORD not set")
    r = session.post(f"{API}/auth/login", json=SEED_CUSTOMER, timeout=15)
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


# ---------- Health ----------
def test_health(session):
    r = session.get(f"{API}/health", timeout=10)
    assert r.status_code == 200
    body = r.json()
    assert body.get("status") == "ok" or body.get("ok") is True or "ok" in str(body).lower()


# ---------- Products ----------
def test_products_list_12(session):
    r = session.get(f"{API}/products", timeout=15)
    assert r.status_code == 200
    data = r.json()
    items = data if isinstance(data, list) else data.get("items", data.get("products", []))
    assert len(items) == 12, f"expected 12, got {len(items)}"
    required = {"id", "slug", "name", "price", "mrp", "stock", "flags", "category", "image", "materials", "createdAt"}
    missing = required - set(items[0].keys())
    assert not missing, f"missing fields: {missing}"


def test_products_category_evil_eye(session):
    r = session.get(f"{API}/products", params={"category": "evil-eye"}, timeout=15)
    assert r.status_code == 200
    items = r.json() if isinstance(r.json(), list) else r.json().get("items", [])
    assert len(items) == 2, f"expected 2 evil-eye, got {len(items)}"


def test_products_in_stock_excludes_sold_out(session):
    r = session.get(f"{API}/products", params={"in_stock": "true"}, timeout=15)
    assert r.status_code == 200
    items = r.json() if isinstance(r.json(), list) else r.json().get("items", [])
    slugs = [p["slug"] for p in items]
    assert "adjustable-black-thread-bracelet" not in slugs


def test_products_max_price(session):
    r = session.get(f"{API}/products", params={"max_price": 500}, timeout=15)
    assert r.status_code == 200
    items = r.json() if isinstance(r.json(), list) else r.json().get("items", [])
    for p in items:
        assert p["price"] <= 500


@pytest.mark.parametrize("sort", ["price-asc", "price-desc", "newest", "featured"])
def test_products_sort_ok(session, sort):
    r = session.get(f"{API}/products", params={"sort": sort}, timeout=15)
    assert r.status_code == 200


def test_products_sort_invalid(session):
    r = session.get(f"{API}/products", params={"sort": "bogus-sort"}, timeout=15)
    assert r.status_code == 400


def test_products_category_invalid(session):
    r = session.get(f"{API}/products", params={"category": "not-a-real-category"}, timeout=15)
    assert r.status_code == 400


def test_product_detail_variants(session):
    r = session.get(f"{API}/products/classic-evil-eye-bracelet", timeout=15)
    assert r.status_code == 200
    p = r.json()
    assert p["slug"] == "classic-evil-eye-bracelet"
    assert "variants" in p and p["variants"], "expected color variants"


def test_product_detail_404(session):
    r = session.get(f"{API}/products/does-not-exist-xyz", timeout=15)
    assert r.status_code == 404


# ---------- Auth ----------
def test_login_seed_customer(session):
    r = session.post(f"{API}/auth/login", json=SEED_CUSTOMER, timeout=15)
    assert r.status_code == 200
    body = r.json()
    assert "access_token" in body and body.get("user", {}).get("email") == SEED_CUSTOMER["email"]


def test_login_wrong_password(session):
    r = session.post(f"{API}/auth/login", json={"email": SEED_CUSTOMER["email"], "password": "WrongPass!123"}, timeout=15)
    assert r.status_code == 401


def test_me_no_token(session):
    r = session.get(f"{API}/auth/me", timeout=15)
    assert r.status_code == 401


def test_me_with_token(session, customer_token):
    r = session.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {customer_token}"}, timeout=15)
    assert r.status_code == 200
    assert r.json()["email"] == SEED_CUSTOMER["email"]


def test_register_and_duplicate(session):
    email = f"TEST_user_{uuid.uuid4().hex[:8]}@heshaura.in"
    payload = {"name": "TEST User", "email": email, "password": "TestPass@123"}
    r = session.post(f"{API}/auth/register", json=payload, timeout=15)
    assert r.status_code == 201, r.text
    body = r.json()
    assert "access_token" in body and body["user"]["email"].lower() == email.lower()
    # Duplicate
    r2 = session.post(f"{API}/auth/register", json=payload, timeout=15)
    assert r2.status_code == 409, f"expected 409 dup, got {r2.status_code} {r2.text}"


# ---------- Orders ----------
@pytest.fixture(scope="module")
def order_id_holder():
    return {}


def test_create_order(session, customer_token, order_id_holder):
    hdrs = {"Authorization": f"Bearer {customer_token}"}
    payload = {
        "customer": {"name": "Test Buyer", "email": SEED_CUSTOMER["email"], "phone": "+919000000000"},
        "items": [{"slug": "classic-evil-eye-bracelet", "qty": 1}],
        "shipping_address": {"line1": "1 Test St", "city": "Mumbai", "state": "MH", "pincode": "400001", "country": "IN"},
    }
    r = session.post(f"{API}/orders", json=payload, headers=hdrs, timeout=20)
    assert r.status_code in (200, 201), r.text
    o = r.json()
    assert o.get("status") == "pending_payment"
    assert o.get("payment", {}).get("gateway") == "cashfree"
    assert o.get("payment", {}).get("status") == "pending"
    assert isinstance(o.get("total_paise"), int), f"total_paise not int: {o.get('total_paise')!r}"
    assert isinstance(o.get("subtotal_paise"), int)
    # unit_price_paise must be price*100
    assert o["items"][0]["unit_price_paise"] == 59900
    oid = o.get("order_id") or o.get("id")
    assert oid
    order_id_holder["id"] = oid


def test_fetch_order(session, customer_token, order_id_holder):
    oid = order_id_holder.get("id")
    if not oid:
        pytest.skip("no order id from previous test")
    hdrs = {"Authorization": f"Bearer {customer_token}"}
    r = session.get(f"{API}/orders/{oid}", headers=hdrs, timeout=15)
    assert r.status_code == 200
    assert r.json().get("status") == "pending_payment"


def test_order_unknown_slug(session, customer_token):
    hdrs = {"Authorization": f"Bearer {customer_token}"}
    payload = {
        "customer": {"name": "T", "email": SEED_CUSTOMER["email"], "phone": "+919000000000"},
        "items": [{"slug": "not-a-real-slug", "qty": 1}],
        "shipping_address": {"line1": "1 Test St", "city": "Mumbai", "state": "MH", "pincode": "400001", "country": "IN"},
    }
    r = session.post(f"{API}/orders", json=payload, headers=hdrs, timeout=15)
    assert r.status_code == 400


def test_order_qty_zero(session, customer_token):
    hdrs = {"Authorization": f"Bearer {customer_token}"}
    payload = {
        "customer": {"name": "T", "email": SEED_CUSTOMER["email"], "phone": "+919000000000"},
        "items": [{"slug": "classic-evil-eye-bracelet", "qty": 0}],
        "shipping_address": {"line1": "1 Test St", "city": "Mumbai", "state": "MH", "pincode": "400001", "country": "IN"},
    }
    r = session.post(f"{API}/orders", json=payload, headers=hdrs, timeout=15)
    assert r.status_code == 422


def test_order_unknown_id(session, customer_token):
    hdrs = {"Authorization": f"Bearer {customer_token}"}
    r = session.get(f"{API}/orders/nonexistent-id-xyz", headers=hdrs, timeout=15)
    assert r.status_code == 404
