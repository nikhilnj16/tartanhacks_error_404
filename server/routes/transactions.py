from fastapi import APIRouter
import os
from pathlib import Path
import json
from firebase_admin import firestore
from database import init_db
from dotenv import load_dotenv
from models.valid_transaction import validate_transaction
from routes.LLMcall import get_prediction

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

@router.get("/transactions_valid")
def get_transactions_valid(user_email: str):
    db = firestore.client()
    transactions = db.collection("transactions").document(user_email).get()
    txns = transactions.to_dict().get("transactions", [])
    for txn in txns:
        txn["category"] = validate_transaction(txn)
    return txns
        


@router.get("/prediction")
def reflect_transaction(user_email: str):
    db = firestore.client()
    transactions = db.collection("transactions").document(user_email).get()
    txns = transactions.to_dict().get("transactions", [])
    for txn in txns:
        txn["category"] = validate_transaction(txn)
    bad_transactions = [txn for txn in txns if txn["category"] == "Discretionary"]

    users = db.collection("users").get()
    users = [user.to_dict() for user in users]

    user_budget = {}    

    for user in users:
        if user["email"] == user_email:
            if user["budget_plan"]:
                user_budget = user["budget_plan"]
            elif user["budget"]:
                user_budget = user["budget"]
            
            user_budget["target_item"] = user["target_item"]
            user_budget["target_amount"] = user["target_amount"]
      
            break
    return get_prediction(bad_transactions, user_budget)
    

from datetime import datetime
from pydantic import BaseModel

class TransactionInput(BaseModel):
    user_email: str
    amount: float
    place: str
    category: str
    transaction_id: str

