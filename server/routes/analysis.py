from fastapi import APIRouter
import json
from pathlib import Path
from collections import defaultdict
from firebase_admin import firestore
from database import init_db
from dotenv import load_dotenv

load_dotenv()

init_db()

router = APIRouter()

def return_email():
    db = firestore.client()
    users = db.collection("users").get()
    email = ""
    for user in users:
        email = user.to_dict()['email']
        break
    return email


@router.get("/analysis")
def get_analysis():
    db = firestore.client()
    transactions = db.collection("transactions").document(return_email()).get()
    transactions = transactions.to_dict()["transactions"]
    debit = defaultdict(float)
    credit = defaultdict(float)
    subscriptions = defaultdict(float)
    for transaction in transactions:
        if transaction["amount"] < 0:
            debit[transaction["category"]] += round(-1 * transaction["amount"], 2)
            if transaction["category"] == "Subscriptions":
                subscriptions[transaction["place"]] += round(-1 * transaction["amount"], 2)
        else:
            credit[transaction["category"]] += round(transaction["amount"], 2)
    return {"debit": debit, "credit": credit, "subscriptions": subscriptions}
