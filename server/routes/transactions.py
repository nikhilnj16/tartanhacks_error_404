from fastapi import APIRouter
import os
from pathlib import Path
import json

router = APIRouter()

file_path = Path(__file__).parent.parent / "data" / "user_persona_1_transactions.json"

@router.get("/transactions")
def get_transactions():
    with open(file_path, "r") as f:
        transactions = json.load(f)
    return transactions["transactions"][:5]