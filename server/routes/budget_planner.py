from fastapi import APIRouter
from firebase_admin import firestore
from dotenv import load_dotenv
from database import init_db
from collections import defaultdict

load_dotenv()

init_db()

def return_email():
    db = firestore.client()
    users = db.collection("users").get()
    email = ""
    docID = ""
    for user in users:
        email = user.to_dict()['email']
        docID = user.id
        break
    return email , docID

router = APIRouter()

@router.get("/generate_budget")
def generate_budget():
    db = firestore.client()
    user_email , docID = return_email()

    users = db.collection("users").get()
    
    for user in users:
        if user.to_dict()['email'] == user_email:
            if user.to_dict().get("budget"):
                return user.to_dict()["budget"]
            else:

                transactions = db.collection("transactions").document(user_email).get()
                transactions = transactions.to_dict()["transactions"]
                savings = 0
                income = 0
                expenses = 0
                categories = defaultdict(float)
                for transaction in transactions:
                    if transaction["amount"] < 0:
                        expenses += transaction["amount"]
                        categories[transaction["category"]] += transaction["amount"]
                    else:
                        income += transaction["amount"]
                savings = income - expenses
                categories = {k: round(v, 2) for k, v in categories.items()}
                income = round(income, 2)
                expenses = round(expenses, 2)
                savings = round(savings, 2)

                budget = {
                    "income": income,
                    "expenses": expenses,
                    "savings": savings,
                    "categories": categories
                }

                db.collection("users").document(docID).update({"budget": budget})
                return budget

@router.post("/update_budget")
def update_budget(budget: dict):
    db = firestore.client()
    user_email , docID = return_email()
    db.collection("users").document(docID).update({"budget": budget})
    return {"message": "Budget updated successfully"}
