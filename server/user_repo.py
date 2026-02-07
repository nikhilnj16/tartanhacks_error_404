"""
Firestore operations for users. Use these instead of direct DB access.
"""
from datetime import datetime

from google.cloud.firestore import Client as FirestoreClient

from models.user import User

USERS_COLLECTION = "users"


def _doc_to_user(doc) -> User:
    """Build a User from a Firestore document snapshot."""
    data = doc.to_dict()
    return User(
        id=doc.id,
        email=data["email"],
        hashed_password=data["hashed_password"],
        full_name=data.get("full_name"),
        name=data.get("name"),
        phone_number=data.get("phone_number"),
        created_at=data.get("created_at"),
    )


def get_user_by_id(db: FirestoreClient, user_id: str) -> User | None:
    """Return the user with the given id, or None."""
    ref = db.collection(USERS_COLLECTION).document(user_id)
    doc = ref.get()
    if not doc.exists:
        return None
    return _doc_to_user(doc)


def get_user_by_email(db: FirestoreClient, email: str) -> User | None:
    """Return the user with the given email, or None. Email comparison is case-insensitive."""
    email_lower = email.strip().lower()
    query = (
        db.collection(USERS_COLLECTION)
        .where("email", "==", email_lower)
        .limit(1)
    )
    docs = list(query.stream())
    if not docs:
        return None
    return _doc_to_user(docs[0])


def create_user(
    db: FirestoreClient,
    email: str,
    hashed_password: str,
    full_name: str | None = None,
    name: str | None = None,
    phone_number: str | None = None,
) -> User:
    """Create a new user in Firestore and return the User with id and created_at."""
    email_lower = email.strip().lower()
    now = datetime.utcnow()
    data = {
        "email": email_lower,
        "hashed_password": hashed_password,
        "full_name": full_name,
        "name": name,
        "phone_number": phone_number,
        "created_at": now,
    }
    ref = db.collection(USERS_COLLECTION).document()
    ref.set(data)
    return User(
        id=ref.id,
        email=email_lower,
        hashed_password=hashed_password,
        full_name=full_name,
        name=name,
        phone_number=phone_number,
        created_at=now,
    )
