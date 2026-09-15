from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

import logging  # noqa: E402
import os  # noqa: E402

from fastapi import FastAPI, HTTPException  # noqa: E402
from starlette.middleware.cors import CORSMiddleware  # noqa: E402

from database import client, db  # noqa: E402
from routers import admin, auth, orders, products  # noqa: E402
from seed import seed_products, seed_users  # noqa: E402
from storage import get_object, init_storage  # noqa: E402

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(title="HESHAURA API")

from fastapi import APIRouter  # noqa: E402

api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"message": "HESHAURA API"}


@api_router.get("/health")
async def health():
    await db.command("ping")
    return {"status": "ok", "db": "ok"}


@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    from fastapi import Response

    try:
        data, content_type = get_object(path)
    except Exception:
        raise HTTPException(status_code=404, detail="File not found")
    return Response(content=data, media_type=content_type)


api_router.include_router(products.router)
api_router.include_router(auth.router)
api_router.include_router(orders.router)
api_router.include_router(admin.router)
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ["CORS_ORIGINS"].split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await db.products.create_index("slug", unique=True)
    await db.products.create_index("id", unique=True)
    await db.users.create_index("email", unique=True)
    await db.orders.create_index("order_id", unique=True)
    await db.products.update_many({"published": {"$exists": False}}, {"$set": {"published": True}})
    try:
        init_storage()
        logger.info("Object storage initialized")
    except Exception as exc:
        logger.error("Storage init failed: %s", exc)
    await seed_users()
    if os.environ.get("SEED_PRODUCTS_ON_STARTUP", "false").strip().lower() == "true":
        await seed_products()
        logger.info("Startup complete: indexes ensured, product seed applied (SEED_PRODUCTS_ON_STARTUP=true)")
    else:
        logger.info("Startup complete: indexes ensured, product seeding skipped (SEED_PRODUCTS_ON_STARTUP is not true)")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
