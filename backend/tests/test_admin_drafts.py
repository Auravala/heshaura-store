"""Admin panel + draft import regression tests (iteration 3)."""
import io
import os
import urllib.parse

import pytest
import requests
from PIL import Image

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://backend-launch-8.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

OWNER = {"email": "shaiileshvala@gmail.com", "password": os.environ.get("SEED_OWNER_PASSWORD", "")}
CUSTOMER = {"email": "customer@heshaura.in", "password": os.environ.get("TEST_CUSTOMER_PASSWORD", "")}

DRAFT_SLUG = "seafoam-leaf-bracelet"
AQUA_SLUG = "aqua-star-charm-bracelet"

# Original image order to restore Seafoam after tests
SEAFOAM_ORIGINAL = [
    "heshaura-store/products/seafoam-leaf-bracelet/Seafoam Leaf Bracelet 3.png",
    "heshaura-store/products/seafoam-leaf-bracelet/Seafoam Leaf Bracelet 2.png",
    "heshaura-store/products/seafoam-leaf-bracelet/Seafoam Leaf Bracelet 1.png",
]


def _login(email, password):
    r = requests.post(f"{API}/auth/login", json={"email": email, "password": password}, timeout=15)
    assert r.status_code == 200, f"login failed for {email}: {r.status_code} {r.text}"
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def owner_token():
    return _login(OWNER["email"], OWNER["password"])


@pytest.fixture(scope="session")
def customer_token():
    return _login(CUSTOMER["email"], CUSTOMER["password"])


@pytest.fixture(scope="session")
def owner_headers(owner_token):
    return {"Authorization": f"Bearer {owner_token}"}


def _make_png(color=(255, 0, 0), size=(64, 64)) -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", size, color).save(buf, format="PNG")
    return buf.getvalue()


# ---------- REGRESSION: public storefront ----------

def test_public_products_still_12():
    r = requests.get(f"{API}/products", timeout=15)
    assert r.status_code == 200
    assert len(r.json()) == 12


def test_public_draft_pdp_404():
    r = requests.get(f"{API}/products/{DRAFT_SLUG}", timeout=15)
    assert r.status_code == 404


def test_public_order_rejects_draft(customer_token):
    hdrs = {"Authorization": f"Bearer {customer_token}"}
    payload = {
        "customer": {"name": "T", "email": CUSTOMER["email"], "phone": "+919000000000"},
        "items": [{"slug": DRAFT_SLUG, "qty": 1}],
        "shipping_address": {"line1": "1 Test St", "city": "Mumbai", "state": "MH", "pincode": "400001", "country": "IN"},
    }
    r = requests.post(f"{API}/orders", json=payload, headers=hdrs, timeout=15)
    assert r.status_code == 400
    assert "unavailable" in r.text.lower() or "unavailable" in r.json().get("detail", "").lower()


def test_public_order_accepts_published(customer_token):
    hdrs = {"Authorization": f"Bearer {customer_token}"}
    payload = {
        "customer": {"name": "T", "email": CUSTOMER["email"], "phone": "+919000000000"},
        "items": [{"slug": "classic-evil-eye-bracelet", "qty": 1}],
        "shipping_address": {"line1": "1 Test St", "city": "Mumbai", "state": "MH", "pincode": "400001", "country": "IN"},
    }
    r = requests.post(f"{API}/orders", json=payload, headers=hdrs, timeout=15)
    assert r.status_code in (200, 201), r.text


# ---------- Admin auth guards ----------

def test_admin_list_requires_token():
    r = requests.get(f"{API}/admin/products", timeout=15)
    assert r.status_code == 401


def test_admin_list_rejects_customer(customer_token):
    r = requests.get(f"{API}/admin/products", headers={"Authorization": f"Bearer {customer_token}"}, timeout=15)
    assert r.status_code == 403


def test_admin_list_owner_returns_23(owner_headers):
    r = requests.get(f"{API}/admin/products", headers=owner_headers, timeout=15)
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 23, f"expected 23, got {len(items)}"
    drafts = [p for p in items if p.get("published") is False]
    assert len(drafts) == 11
    for d in drafts:
        assert d.get("price") is None and d.get("mrp") is None and d.get("stock") is None, f"draft {d['slug']} not blank"


# ---------- Publish guard + lifecycle ----------

def test_publish_lifecycle(owner_headers):
    url = f"{API}/admin/products/{DRAFT_SLUG}"
    # 1. publish without price → 400
    r = requests.patch(url, json={"published": True}, headers=owner_headers, timeout=15)
    assert r.status_code == 400
    assert "price" in r.json().get("detail", "").lower()

    # 2. publish with all fields → 200 and public count 13
    r = requests.patch(url, json={"price": 499, "mrp": 799, "stock": 7, "published": True}, headers=owner_headers, timeout=15)
    assert r.status_code == 200, r.text
    assert r.json()["published"] is True

    pub = requests.get(f"{API}/products", timeout=15).json()
    assert len(pub) == 13

    pdp = requests.get(f"{API}/products/{DRAFT_SLUG}", timeout=15)
    assert pdp.status_code == 200
    assert len(pdp.json()["images"]) == 3

    # 3. unpublish → back to 12
    r = requests.patch(url, json={"published": False}, headers=owner_headers, timeout=15)
    assert r.status_code == 200
    pub = requests.get(f"{API}/products", timeout=15).json()
    assert len(pub) == 12


# ---------- Image management ----------

def test_image_management_full_flow(owner_headers):
    slug_url = f"{API}/admin/products/{DRAFT_SLUG}"
    # initial state
    doc = requests.get(f"{API}/admin/products", headers=owner_headers, timeout=15).json()
    seafoam = next(p for p in doc if p["slug"] == DRAFT_SLUG)
    assert len(seafoam["images"]) == 3

    png = _make_png((0, 255, 0))
    # add 4th image → 201
    r = requests.post(
        f"{slug_url}/images",
        headers=owner_headers,
        files={"file": ("TEST_extra.png", png, "image/png")},
        timeout=20,
    )
    assert r.status_code == 201, r.text
    assert len(r.json()["images"]) == 4

    # 5th → 400
    png2 = _make_png((0, 0, 255))
    r = requests.post(
        f"{slug_url}/images",
        headers=owner_headers,
        files={"file": ("TEST_fifth.png", png2, "image/png")},
        timeout=20,
    )
    assert r.status_code == 400
    assert "maximum 4" in r.json().get("detail", "").lower()

    # delete index 3 (the TEST_extra we added) → back to 3
    r = requests.delete(f"{slug_url}/images/3", headers=owner_headers, timeout=15)
    assert r.status_code == 200
    assert len(r.json()["images"]) == 3

    # reorder with reversed list → 200
    current = r.json()["images"]
    reversed_list = list(reversed(current))
    r = requests.post(f"{slug_url}/images/reorder", json={"images": reversed_list}, headers=owner_headers, timeout=15)
    assert r.status_code == 200
    assert r.json()["images"] == reversed_list

    # restore original order
    r = requests.post(f"{slug_url}/images/reorder", json={"images": SEAFOAM_ORIGINAL}, headers=owner_headers, timeout=15)
    assert r.status_code == 200
    assert r.json()["images"] == SEAFOAM_ORIGINAL

    # replace index 0 — read original file bytes from uploads folder so storage stays intact
    orig_name = SEAFOAM_ORIGINAL[0].rsplit("/", 1)[-1]
    upload_path = f"/app/backend/uploads/products/{DRAFT_SLUG}/{orig_name}"
    with open(upload_path, "rb") as f:
        orig_bytes = f.read()
    r = requests.post(
        f"{slug_url}/images/0/replace",
        headers=owner_headers,
        files={"file": (orig_name, orig_bytes, "image/png")},
        timeout=30,
    )
    assert r.status_code == 200

    # PATCH main_image to second image
    doc_after = r.json()
    second = doc_after["images"][1]
    r = requests.patch(slug_url, json={"main_image": second}, headers=owner_headers, timeout=15)
    assert r.status_code == 200
    assert r.json()["image"] == second

    # restore main_image to first
    first = r.json()["images"][0]
    requests.patch(slug_url, json={"main_image": first}, headers=owner_headers, timeout=15)


def test_invalid_image_rejected(owner_headers):
    slug_url = f"{API}/admin/products/{DRAFT_SLUG}/images"
    # .txt extension
    r = requests.post(
        slug_url, headers=owner_headers,
        files={"file": ("bad.txt", b"hello world", "text/plain")}, timeout=15,
    )
    assert r.status_code == 400

    # fake .png (not really a PNG)
    r = requests.post(
        slug_url, headers=owner_headers,
        files={"file": ("fake.png", b"not really a png", "image/png")}, timeout=15,
    )
    assert r.status_code == 400


# ---------- Object storage serving ----------

def test_files_endpoint_serves_image(owner_headers):
    items = requests.get(f"{API}/admin/products", headers=owner_headers, timeout=15).json()
    draft = next(p for p in items if p["slug"] == AQUA_SLUG)
    path = draft["images"][0]
    encoded = urllib.parse.quote(path, safe="")
    r = requests.get(f"{API}/files/{encoded}", timeout=15)
    assert r.status_code == 200, r.text[:200]
    assert r.headers.get("content-type", "").startswith("image/")


# ---------- Draft counts sanity ----------

def test_aqua_has_3_images(owner_headers):
    items = requests.get(f"{API}/admin/products", headers=owner_headers, timeout=15).json()
    aqua = next(p for p in items if p["slug"] == AQUA_SLUG)
    assert len(aqua["images"]) == 3
