"""
User model and Pydantic schemas for authentication.
User data is stored in Firestore; this model represents a user in memory.
"""
from datetime import datetime
from pydantic import BaseModel, EmailStr


# In-memory / API model (backed by Firestore)
class User(BaseModel):
    id: str
    email: str
    hashed_password: str
    full_name: str | None = None
    name: str | None = None
    phone_number: str | None = None
    created_at: datetime | None = None

    class Config:
        from_attributes = True


# ----- Request/response schemas -----

class UserSignup(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone_number: str
    full_name: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str | None = None
    name: str | None = None
    phone_number: str | None = None
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
