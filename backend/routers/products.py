from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query

from database import db
from models import Product
from seed_data import CATEGORIES

router = APIRouter(prefix="/products", tags=["products"])

CATEGORY_IDS = {c["id"] for c in CATEGORIES}
VALID_FLAGS = {"featured", "bestseller", "newArrival"}
VALID_SORTS = {"featured", "newest", "price-asc", "price-desc"}
PROJECTION = {"_id": 0}


@router.get("", response_model=List[Product], response_model_exclude_none=True)
async def list_products(
    category: Optional[str] = Query(default=None),
    flags: Optional[str] = Query(default=None),
    in_stock: bool = Query(default=False),
    max_price: Optional[int] = Query(default=None, ge=0),
    sort: str = Query(default="featured"),
):
    if sort not in VALID_SORTS:
        raise HTTPException(status_code=400, detail=f"Invalid sort: {sort}")

    categories = [c.strip() for c in category.split(",") if c.strip()] if category else []
    bad_categories = [c for c in categories if c not in CATEGORY_IDS]
    if bad_categories:
        raise HTTPException(status_code=400, detail=f"Unknown category: {', '.join(bad_categories)}")

    flag_list = [f.strip() for f in flags.split(",") if f.strip()] if flags else []
    bad_flags = [f for f in flag_list if f not in VALID_FLAGS]
    if bad_flags:
        raise HTTPException(status_code=400, detail=f"Unknown flag: {', '.join(bad_flags)}")

    docs = await db.products.find({}, PROJECTION).to_list(1000)

    results = []
    for p in docs:
        if categories and p.get("category") not in categories:
            continue
        if flag_list and not all(p.get("flags", {}).get(f) for f in flag_list):
            continue
        if in_stock and p.get("stock", 0) <= 0:
            continue
        if max_price is not None and p.get("price", 0) > max_price:
            continue
        results.append(p)

    if sort == "price-asc":
        results.sort(key=lambda p: p.get("price", 0))
    elif sort == "price-desc":
        results.sort(key=lambda p: p.get("price", 0), reverse=True)
    elif sort == "newest":
        results.sort(key=lambda p: p.get("createdAt", 0), reverse=True)
    else:
        results.sort(key=lambda p: bool(p.get("flags", {}).get("featured")), reverse=True)

    return results


@router.get("/{slug}", response_model=Product, response_model_exclude_none=True)
async def get_product_by_slug(slug: str):
    doc = await db.products.find_one({"slug": slug}, PROJECTION)
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return doc
