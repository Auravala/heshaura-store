import asyncio
import os
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

from passlib.context import CryptContext  # noqa: E402

from database import db  # noqa: E402
from seed_data import PRODUCTS, SEED_USERS  # noqa: E402

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def seed_products() -> int:
    for product in PRODUCTS:
        await db.products.replace_one({"slug": product["slug"]}, product, upsert=True)
    return await db.products.count_documents({})


async def seed_users() -> int:
    created = 0
    for user in SEED_USERS:
        password = os.environ.get(user["password_env"], "")
        if not password:
            continue
        email = user["email"].lower()
        if await db.users.find_one({"email": email}):
            continue
        await db.users.insert_one(
            {
                "name": user["name"],
                "email": email,
                "password_hash": pwd_context.hash(password),
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )
        created += 1
    return created


async def run_seed() -> None:
    product_count = await seed_products()
    users_created = await seed_users()
    print(f"Seed complete: {product_count} products in catalog, {users_created} new users created")


if __name__ == "__main__":
    asyncio.run(run_seed())
