from fastapi import APIRouter
import os
from pathlib import Path
import json
from firebase_admin import firestore
from database import init_db
from dotenv import load_dotenv

load_dotenv()

init_db()

router = APIRouter()



@router.get("/transactions")
def get_transactions(user_email: str):
    db = firestore.client()
    transactions = db.collection("transactions").document(user_email).get()
    if not transactions.exists:
        return []
    return transactions.to_dict().get("transactions", [])
