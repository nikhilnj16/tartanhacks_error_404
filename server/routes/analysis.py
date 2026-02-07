from fastapi import APIRouter
import json
from pathlib import Path
from collections import defaultdict


router = APIRouter()

file_path = Path(__file__).parent.parent / "data" / "user_persona_1_transactions.json"

with open(file_path, "r") as f:
    transactions = json.load(f)


@router.get("/analysis")
def get_analysis():
    debit = defaultdict(float)
    credit = defaultdict(float)
    subscriptions = defaultdict(float)
    for transaction in transactions["transactions"]:
        if transaction["amount"] < 0:
            debit[transaction["category"]] += round(-1 * transaction["amount"], 2)
            if transaction["category"] == "Subscriptions":
                subscriptions[transaction["place"]] += round(-1 * transaction["amount"], 2)
        else:
            credit[transaction["category"]] += round(transaction["amount"], 2)
    return {"debit": debit, "credit": credit, "subscriptions": subscriptions}
