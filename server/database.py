"""
Database configuration for the smart budgeting app.
Uses Firebase Firestore. Configure via service account JSON.
"""
import json
import os
from typing import Generator

from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

load_dotenv()

# Firestore client (set after init)
_firestore_client: firestore.Client | None = None


def _get_credential():
    """Build Firebase credential from env: file path or JSON string. Falls back to same-dir JSON."""
    # Option 1: Path to service account JSON file (strip whitespace – no space after = in .env)
    path = (os.getenv("GOOGLE_APPLICATION_CREDENTIALS") or "").strip()
    if path and os.path.isfile(path):
        return credentials.Certificate(path)
    # Option 2: JSON string (e.g. in production / serverless)
    json_str = (os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON") or "").strip()
    if json_str:
        try:
            info = json.loads(json_str)
            return credentials.Certificate(info)
        except json.JSONDecodeError:
            raise ValueError("FIREBASE_SERVICE_ACCOUNT_JSON is invalid JSON")
    # Option 3: Look for service account JSON in same directory as this file
    _dir = os.path.dirname(os.path.abspath(__file__))
    for name in os.listdir(_dir):
        if "adminsdk" in name.lower() and name.endswith(".json"):
            candidate = os.path.join(_dir, name)
            if os.path.isfile(candidate):
                return credentials.Certificate(candidate)
    raise ValueError(
        "Firebase credentials not found. Set GOOGLE_APPLICATION_CREDENTIALS (path to JSON) "
        "or FIREBASE_SERVICE_ACCOUNT_JSON (JSON string), or place a *adminsdk*.json file in the server folder."
    )


def init_db() -> None:
    """Initialize Firebase Admin and Firestore. Safe to call multiple times (no-op if already initialized)."""
    global _firestore_client
    if _firestore_client is not None:
        return
    if not firebase_admin._apps:
        cred = _get_credential()
        firebase_admin.initialize_app(cred)
    _firestore_client = firestore.client()


def get_db() -> Generator[firestore.Client, None, None]:
    """Dependency that yields the Firestore client. Ensures init_db() has been called."""
    init_db()
    assert _firestore_client is not None
    yield _firestore_client
