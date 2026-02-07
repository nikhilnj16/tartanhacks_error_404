"""
Authentication routes: signup and login.
"""
from fastapi import APIRouter, Body, Depends, HTTPException, status
from google.cloud.firestore import Client as FirestoreClient

from database import get_db
from models.user import UserSignup, UserLogin, UserResponse, TokenResponse
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_user_by_email,
)
from user_repo import create_user as create_user_in_db

router = APIRouter(prefix="/auth", tags=["auth"])


def _parse_login(raw: dict) -> UserLogin:
    """Accept either { email, password } or { body: { email, password } }."""
    if "body" in raw and isinstance(raw["body"], dict):
        return UserLogin(**raw["body"])
    return UserLogin(**raw)


def _user_response(user):
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        name=user.name,
        phone_number=user.phone_number,
        created_at=user.created_at,
    )


@router.post("/signup", response_model=TokenResponse)
def signup(body: UserSignup = Body(...), db: FirestoreClient = Depends(get_db)):
    """Register a new user. Requires email, password, name, phone_number. Returns JWT and user info."""
    if get_user_by_email(db, body.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists",
        )
    user = create_user_in_db(
        db,
        email=body.email,
        hashed_password=hash_password(body.password),
        full_name=body.full_name,
        name=body.name,
        phone_number=body.phone_number,
    )
    access_token = create_access_token(data={"sub": user.id})
    return TokenResponse(
        access_token=access_token,
        user=_user_response(user),
    )


@router.post("/login", response_model=TokenResponse)
def login(raw: dict = Body(...), db: FirestoreClient = Depends(get_db)):
    """Authenticate user and return JWT and user info."""
    body = _parse_login(raw)
    user = get_user_by_email(db, body.email)
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    access_token = create_access_token(data={"sub": user.id})
    return TokenResponse(
        access_token=access_token,
        user=_user_response(user),
    )
