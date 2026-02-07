from fastapi import APIRouter, Body, Depends, Query
from firebase_admin import firestore
from pydantic import BaseModel

from database import init_db, get_db
from dotenv import load_dotenv
from models.valid_transaction import validate_transaction
from routes.LLMcall import get_prediction
from transaction_repo import add_transaction_for_user

load_dotenv()

init_db()

router = APIRouter()


class DummyTransactionPayload(BaseModel):
    amount: int | float
    category: str
    date: str
    place: str
    time: str
    transaction_id: str


@router.post("/transactions/dummy")
def add_dummy_transaction(
    user_email: str = Query(..., description="User email (document ID for transactions)"),
    body: DummyTransactionPayload = Body(..., description="Transaction record to add"),
    db: firestore.Client = Depends(get_db),
):
    """
    Add a single transaction to the given user's transactions in Firestore.
    Request body: amount, category, date, place, time, transaction_id.
    """
    transaction = body.model_dump()
    count = add_transaction_for_user(db, user_email, transaction)
    return {
        "message": "Transaction added",
        "user_email": user_email.strip().lower(),
        "transaction": transaction,
        "total_transactions": count,
    }


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
    
