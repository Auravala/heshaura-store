from typing import Dict, List, Optional

from pydantic import BaseModel, EmailStr, Field


class VariantOption(BaseModel):
    id: str
    label: str
    priceDelta: Optional[int] = None
    stock: Optional[int] = None


class ProductVariant(BaseModel):
    type: str
    label: str
    options: List[VariantOption]


class ProductFlags(BaseModel):
    featured: bool = False
    bestseller: bool = False
    newArrival: bool = False


class Product(BaseModel):
    id: str
    slug: str
    name: str
    price: Optional[int] = None
    mrp: Optional[int] = None
    stock: Optional[int] = None
    flags: ProductFlags = Field(default_factory=ProductFlags)
    category: str
    image: str = ""
    images: List[str] = Field(default_factory=list)
    materials: List[str] = Field(default_factory=list)
    createdAt: int = 0
    variants: Optional[List[ProductVariant]] = None
    published: bool = True


class ProductAdminUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    price: Optional[int] = Field(default=None, ge=0)
    mrp: Optional[int] = Field(default=None, ge=0)
    stock: Optional[int] = Field(default=None, ge=0)
    category: Optional[str] = None
    main_image: Optional[str] = None
    published: Optional[bool] = None


class ImageReorder(BaseModel):
    images: List[str]


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str = "customer"


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class OrderItemIn(BaseModel):
    slug: str
    qty: int = Field(ge=1, le=99)
    variant: Optional[Dict[str, str]] = None


class CustomerIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=20)


class OrderCreate(BaseModel):
    customer: CustomerIn
    items: List[OrderItemIn] = Field(min_length=1)
