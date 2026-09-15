import io
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from PIL import Image

from database import db
from models import ImageReorder, ProductAdminUpdate, UserPublic
from routers.auth import get_current_user
from seed_data import CATEGORIES
from storage import APP_NAME, put_object

router = APIRouter(prefix="/admin", tags=["admin"])

CATEGORY_IDS = {c["id"] for c in CATEGORIES}
ALLOWED_EXT = {".png", ".jpg", ".jpeg", ".webp"}
ALLOWED_FORMATS = {"PNG", "JPEG", "WEBP"}
MIME_BY_EXT = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp"}
MAX_IMAGES = 4
MAX_BYTES = 10 * 1024 * 1024
PROJECTION = {"_id": 0}


async def require_admin(user: UserPublic = Depends(get_current_user)) -> UserPublic:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


async def get_product_or_404(slug: str):
    doc = await db.products.find_one({"slug": slug}, PROJECTION)
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return doc


async def read_valid_image(file: UploadFile) -> tuple:
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(status_code=400, detail="Only PNG, JPG and WebP images are allowed")
    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=400, detail="Image exceeds 10 MB")
    try:
        im = Image.open(io.BytesIO(data))
        im.verify()
        if im.format not in ALLOWED_FORMATS:
            raise ValueError("bad format")
    except Exception:
        raise HTTPException(status_code=400, detail="File is not a valid PNG, JPG or WebP image")
    return data, MIME_BY_EXT[ext]


@router.get("/products")
async def list_all_products(_: UserPublic = Depends(require_admin)):
    return await db.products.find({}, PROJECTION).to_list(1000)


@router.patch("/products/{slug}")
async def update_product(slug: str, body: ProductAdminUpdate, _: UserPublic = Depends(require_admin)):
    doc = await get_product_or_404(slug)
    updates = {}
    if body.name is not None:
        updates["name"] = body.name.strip()
    if body.price is not None:
        updates["price"] = body.price
    if body.mrp is not None:
        updates["mrp"] = body.mrp
    if body.stock is not None:
        updates["stock"] = body.stock
    if body.category is not None:
        if body.category not in CATEGORY_IDS:
            raise HTTPException(status_code=400, detail=f"Unknown category: {body.category}")
        updates["category"] = body.category
    if body.main_image is not None:
        if body.main_image not in doc.get("images", []):
            raise HTTPException(status_code=400, detail="main_image must be one of the product's images")
        updates["image"] = body.main_image
    if body.published is not None:
        if body.published:
            merged = {**doc, **updates}
            if not merged.get("price") or merged["price"] <= 0:
                raise HTTPException(status_code=400, detail="Set a price above ₹0 before publishing")
            if merged.get("stock") is None:
                raise HTTPException(status_code=400, detail="Set stock before publishing")
            if not merged.get("image"):
                raise HTTPException(status_code=400, detail="Add at least one image before publishing")
        updates["published"] = body.published
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    await db.products.update_one({"slug": slug}, {"$set": updates})
    return await get_product_or_404(slug)


@router.post("/products/{slug}/images", status_code=201)
async def upload_image(slug: str, file: UploadFile, _: UserPublic = Depends(require_admin)):
    doc = await get_product_or_404(slug)
    images = doc.get("images", [])
    if len(images) >= MAX_IMAGES:
        raise HTTPException(status_code=400, detail="Maximum 4 images per product")
    data, content_type = await read_valid_image(file)
    filename = Path(file.filename).name
    path = f"{APP_NAME}/products/{slug}/{filename}"
    if path in images:
        raise HTTPException(status_code=409, detail="An image with this filename already exists — use replace instead")
    result = put_object(path, data, content_type)
    updates = {"images": images + [result["path"]]}
    if not doc.get("image"):
        updates["image"] = result["path"]
    await db.products.update_one({"slug": slug}, {"$set": updates})
    return await get_product_or_404(slug)


@router.post("/products/{slug}/images/{index}/replace")
async def replace_image(slug: str, index: int, file: UploadFile, _: UserPublic = Depends(require_admin)):
    doc = await get_product_or_404(slug)
    images = doc.get("images", [])
    if index < 0 or index >= len(images):
        raise HTTPException(status_code=404, detail="Image not found")
    data, content_type = await read_valid_image(file)
    filename = Path(file.filename).name
    result = put_object(f"{APP_NAME}/products/{slug}/{filename}", data, content_type)
    old_path = images[index]
    images[index] = result["path"]
    updates = {"images": images}
    if doc.get("image") == old_path:
        updates["image"] = result["path"]
    await db.products.update_one({"slug": slug}, {"$set": updates})
    return await get_product_or_404(slug)


@router.delete("/products/{slug}/images/{index}")
async def delete_image(slug: str, index: int, _: UserPublic = Depends(require_admin)):
    doc = await get_product_or_404(slug)
    images = doc.get("images", [])
    if index < 0 or index >= len(images):
        raise HTTPException(status_code=404, detail="Image not found")
    removed = images.pop(index)
    updates = {"images": images}
    if doc.get("image") == removed:
        updates["image"] = images[0] if images else ""
    await db.products.update_one({"slug": slug}, {"$set": updates})
    return await get_product_or_404(slug)


@router.post("/products/{slug}/images/reorder")
async def reorder_images(slug: str, body: ImageReorder, _: UserPublic = Depends(require_admin)):
    doc = await get_product_or_404(slug)
    current = doc.get("images", [])
    if sorted(body.images) != sorted(current):
        raise HTTPException(status_code=400, detail="Reorder list must contain exactly the existing images")
    await db.products.update_one({"slug": slug}, {"$set": {"images": body.images}})
    return await get_product_or_404(slug)
