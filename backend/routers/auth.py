import os
from datetime import datetime, timedelta, timezone

import jwt
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext

from database import db
from models import LoginRequest, RegisterRequest, TokenResponse, UserPublic

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer = HTTPBearer(auto_error=False)
ALGORITHM = "HS256"


def create_access_token(user_id: str, email: str) -> str:
    hours = int(os.environ.get("JWT_EXPIRY_HOURS", "24"))
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=hours),
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=ALGORITHM)


def public_user(user) -> UserPublic:
    return UserPublic(
        id=str(user["_id"]),
        name=user.get("name", ""),
        email=user["email"],
        role=user.get("role", "customer"),
    )


async def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
) -> UserPublic:
    if not creds:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(creds.credentials, os.environ["JWT_SECRET"], algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    try:
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    except Exception:
        user = None
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return public_user(user)


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(body: RegisterRequest):
    email = body.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="Email already registered")
    doc = {
        "name": body.name.strip(),
        "email": email,
        "password_hash": pwd_context.hash(body.password),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await db.users.insert_one(doc)
    doc["_id"] = result.inserted_id
    return TokenResponse(
        access_token=create_access_token(str(result.inserted_id), email),
        user=public_user(doc),
    )


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest):
    email = body.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not pwd_context.verify(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return TokenResponse(
        access_token=create_access_token(str(user["_id"]), email),
        user=public_user(user),
    )


@router.get("/me", response_model=UserPublic)
async def me(user: UserPublic = Depends(get_current_user)):
    return user
