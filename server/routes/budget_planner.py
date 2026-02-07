from fastapi import APIRouter, Body, Depends, Query
from google.cloud.firestore import Client as FirestoreClient
from collections import defaultdict

from database import get_db

router = APIRouter()


def _date_key(t: dict) -> str:
    """Sort key for transaction date (date or transaction_date, first 10 chars)."""
    td = t.get("date") or t.get("transaction_date") or ""
    return (td[:10] if isinstance(td, str) else str(td)[:10]) if td else ""


def _take_last_n_by_date(transactions: list, n: int) -> list:
    """Return the last N transactions when sorted by date (ascending)."""
    if n <= 0 or not transactions:
        return transactions
    sorted_tx = sorted(transactions, key=_date_key)
    return sorted_tx[-n:] if len(sorted_tx) > n else sorted_tx


def _get_user_doc_id(db: FirestoreClient, user_email: str) -> str | None:
    """Return the Firestore document ID for the user with this email, or None."""
    user_email = user_email.strip().lower()
    query = db.collection("users").where("email", "==", user_email).limit(1)
    docs = list(query.stream())
    if not docs:
        return None
    return docs[0].id


@router.get("/generate_budget")
def generate_budget(
    user_email: str = Query(..., description="User email to generate budget for"),
    db: FirestoreClient = Depends(get_db),
    last_n: int | None = Query(None, description="Use only the last N transactions by date (default: all)"),
):
    """Get or compute budget (income, expenses, savings, categories). Optionally use only the last N transactions by date."""
    user_doc_id = _get_user_doc_id(db, user_email)
    if not user_doc_id:
        return {"income": 0, "expenses": 0, "savings": 0, "categories": {}}

    user_ref = db.collection("users").document(user_doc_id)
    user_doc = user_ref.get()
    if not user_doc.exists:
        return {"income": 0, "expenses": 0, "savings": 0, "categories": {}}

    use_last_n = last_n is not None and last_n > 0

    user_data = user_doc.to_dict()
    if user_data.get("budget") and not use_last_n:
        return user_data["budget"]

    tx_ref = db.collection("transactions").document(user_email.strip().lower())
    tx_doc = tx_ref.get()
    if not tx_doc.exists:
        budget = {"income": 0, "expenses": 0, "savings": 0, "categories": {}}
        if not use_last_n:
            user_ref.update({"budget": budget})
        return budget

    transactions = tx_doc.to_dict().get("transactions") or []
    if use_last_n:
        transactions = _take_last_n_by_date(transactions, last_n)

    income = 0.0
    expenses = 0.0
    categories = defaultdict(float)
    for t in transactions:
        amount = t.get("amount") or 0
        if isinstance(amount, (int, float)):
            if amount < 0:
                expenses += amount

                cat = t.get("category") or "Other"
                categories[cat] += amount
            else:
                income += amount
    savings = income 
    print(income, expenses, savings)
    categories = {k: round(v, 2) for k, v in categories.items()}
    income = round(income, 2)
    expenses = round(expenses, 2)
    savings = round(savings, 2)
 

    budget = {
        "income": income,
        "expenses": expenses,
        "savings": savings,
        "categories": categories,
    }
    if not use_last_n:
        user_ref.update({"budget": budget})
    return budget


@router.get("/budget_plan")
def get_budget_plan(
    user_email: str = Query(..., description="User email"),
    db: FirestoreClient = Depends(get_db),
):
    """Get the user's budget plan (category limits) and savings goal/reason."""
    user_doc_id = _get_user_doc_id(db, user_email)
    if not user_doc_id:
        return {"plan": {}, "savings_goal": "", "savings_reason": ""}
    user_doc = db.collection("users").document(user_doc_id).get()
    if not user_doc.exists:
        return {"plan": {}, "savings_goal": "", "savings_reason": ""}
    data = user_doc.to_dict() or {}
    return {
        "plan": data.get("budget_plan") or {},
        "savings_goal": data.get("savings_goal") or "",
        "savings_reason": data.get("savings_reason") or "",
    }


@router.post("/update_budget")
def update_budget(
    user_email: str = Query(..., description="User email to update budget plan for"),
    body: dict = Body(..., description="Budget plan (category limits) and optional savings_goal, savings_reason"),
    db: FirestoreClient = Depends(get_db),
):
    """Update the user's budget plan and optional savings goal/reason."""
    user_doc_id = _get_user_doc_id(db, user_email)
    if not user_doc_id:
        return {"message": "User not found", "ok": False}

    user_ref = db.collection("users").document(user_doc_id)

    # Category limits only (numeric)
    plan = {
        k: float(v)
        for k, v in body.items()
        if k not in ("savings_goal", "savings_reason") and isinstance(v, (int, float)) and v >= 0
    }
    savings_goal = str(body.get("savings_goal") or "").strip()
    savings_reason = str(body.get("savings_reason") or "").strip()

    update_data = {"budget_plan": plan, "savings_goal": savings_goal, "savings_reason": savings_reason}
    user_ref.update(update_data)
    return {"message": "Budget plan updated successfully", "ok": True}
