import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from database import db
from models import OrderCreate

router = APIRouter(prefix="/orders", tags=["orders"])

PROJECTION = {"_id": 0}


@router.post("", status_code=201)
async def create_order(body: OrderCreate):
    line_items = []
    total_paise = 0
    for item in body.items:
        product = await db.products.find_one({"slug": item.slug}, {"_id": 0})
        if not product:
            raise HTTPException(status_code=400, detail=f"Unknown product: {item.slug}")
        unit_price_paise = int(product["price"]) * 100
        line_total_paise = unit_price_paise * item.qty
        total_paise += line_total_paise
        line_items.append(
            {
                "product_id": product["id"],
                "slug": product["slug"],
                "name": product["name"],
                "qty": item.qty,
                "unit_price_paise": unit_price_paise,
                "line_total_paise": line_total_paise,
                "variant": item.variant,
            }
        )

    order = {
        "order_id": uuid.uuid4().hex,
        "customer": body.customer.model_dump(),
        "items": line_items,
        "subtotal_paise": total_paise,
        "total_paise": total_paise,
        "currency": "INR",
        "status": "pending_payment",
        "payment": {
            "gateway": "cashfree",
            "status": "pending",
            "cf_order_id": None,
            "gateway_ref": None,
        },
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.orders.insert_one(order)
    order.pop("_id", None)
    return order


@router.get("/{order_id}")
async def get_order(order_id: str):
    order = await db.orders.find_one({"order_id": order_id}, PROJECTION)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
