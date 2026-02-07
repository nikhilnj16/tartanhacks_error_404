"""
Database configuration for the smart budgeting app.
Uses Firebase Firestore. Credentials via FIREBASE_SERVICE_ACCOUNT_JSON only (no files in repo).
"""
import json
import os
from typing import Generator

from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# Load .env from server dir and project root so it's found regardless of cwd
_server_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(_server_dir, ".env"))
load_dotenv()  # also cwd (e.g. project root)

# Firestore client (set after init)
_firestore_client: firestore.Client | None = None


def _get_credential():
    """Build Firebase credential from FIREBASE_SERVICE_ACCOUNT_JSON env (JSON string). No credential files in repo."""
    json_str = (os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON") or "").strip()
    if not json_str:
        raise ValueError(
            "Firebase credentials not set. In .env set FIREBASE_SERVICE_ACCOUNT_JSON to the full "
            "service account JSON as a single line. Never commit .env or the JSON."
        )
    try:
        info = json.loads(json_str)
        return credentials.Certificate(info)
    except json.JSONDecodeError as e:
        raise ValueError(f"FIREBASE_SERVICE_ACCOUNT_JSON is invalid JSON: {e}") from e


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
