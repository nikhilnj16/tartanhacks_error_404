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

def return_email():
    db = firestore.client()
    print(db)
    users = db.collection("users").get()
    email = ""
    for user in users:
        email = user.to_dict()['email']
    return email

@router.get("/transactions")
def get_transactions():
    db = firestore.client()
    transactions = db.collection("transactions").document(return_email()).get()
    return transactions.to_dict()["transactions"]
