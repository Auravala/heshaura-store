import asyncio
import os
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

from passlib.context import CryptContext  # noqa: E402

from database import db  # noqa: E402
from seed_data import DRAFT_PRODUCTS, PRODUCTS, SEED_USERS  # noqa: E402

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def seed_products() -> int:
    for product in PRODUCTS:
        await db.products.replace_one({"slug": product["slug"]}, product, upsert=True)
    for product in DRAFT_PRODUCTS:
        await db.products.update_one({"slug": product["slug"]}, {"$setOnInsert": product}, upsert=True)
    await db.products.update_many({"published": {"$exists": False}}, {"$set": {"published": True}})
    return await db.products.count_documents({})


UPLOAD_SRC = Path(__file__).parent / "uploads" / "products"
MIME_BY_EXT = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp"}


async def seed_draft_images() -> int:
    from storage import APP_NAME, init_storage, put_object

    init_storage()
    uploaded = 0
    for product in DRAFT_PRODUCTS:
        doc = await db.products.find_one({"slug": product["slug"]})
        if not doc or doc.get("images"):
            continue
        paths = []
        for filename in product.get("image_files", []):
            src = UPLOAD_SRC / product["slug"] / filename
            if not src.exists():
                continue
            result = put_object(
                f"{APP_NAME}/products/{product['slug']}/{filename}",
                src.read_bytes(),
                MIME_BY_EXT.get(src.suffix.lower(), "application/octet-stream"),
            )
            paths.append(result["path"])
        if paths:
            await db.products.update_one(
                {"slug": product["slug"]}, {"$set": {"images": paths, "image": paths[0]}}
            )
            uploaded += len(paths)
    return uploaded


async def seed_users() -> int:
    created = 0
    for user in SEED_USERS:
        password = os.environ.get(user["password_env"], "")
        email = user["email"].lower()
        existing = await db.users.find_one({"email": email})
        if existing:
            await db.users.update_one({"email": email}, {"$set": {"role": user["role"]}})
            continue
        if not password:
            continue
        await db.users.insert_one(
            {
                "name": user["name"],
                "email": email,
                "password_hash": pwd_context.hash(password),
                "role": user["role"],
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )
        created += 1
    return created


async def run_seed() -> None:
    product_count = await seed_products()
    users_created = await seed_users()
    images_uploaded = 0
    try:
        images_uploaded = await seed_draft_images()
    except Exception as exc:
        print(f"Draft image upload skipped: {exc}")
    print(
        f"Seed complete: {product_count} products in catalog, {users_created} new users created, "
        f"{images_uploaded} draft images uploaded"
    )


if __name__ == "__main__":
    asyncio.run(run_seed())
