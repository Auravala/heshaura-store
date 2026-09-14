from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

import logging  # noqa: E402
import os  # noqa: E402

from fastapi import FastAPI  # noqa: E402
from starlette.middleware.cors import CORSMiddleware  # noqa: E402

from database import client, db  # noqa: E402
from routers import auth, orders, products  # noqa: E402
from seed import seed_products, seed_users  # noqa: E402

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


api_router.include_router(products.router)
api_router.include_router(auth.router)
api_router.include_router(orders.router)
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
    await seed_users()
    if os.environ.get("SEED_PRODUCTS_ON_STARTUP", "false").strip().lower() == "true":
        await seed_products()
        logger.info("Startup complete: indexes ensured, product seed applied (SEED_PRODUCTS_ON_STARTUP=true)")
    else:
        logger.info("Startup complete: indexes ensured, product seeding skipped (SEED_PRODUCTS_ON_STARTUP is not true)")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
