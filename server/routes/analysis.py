from collections import defaultdict

from fastapi import APIRouter, Depends, Query

from database import get_db
from transaction_repo import get_transactions_for_user
from google.cloud.firestore import Client as FirestoreClient

router = APIRouter()


@router.get("/analysis")
def get_analysis(
    user_email: str = Query(..., description="User email to fetch analysis for"),
    db: FirestoreClient = Depends(get_db),
):
    """Return debit/credit by category for the given user's transactions. No auth header required."""
    transactions = get_transactions_for_user(db, user_email)
    debit = defaultdict(float)
    credit = defaultdict(float)
    for t in transactions:
        amount = t.get("amount", 0)
        category = t.get("category", "Other")
        if isinstance(amount, (int, float)):
            if amount < 0:
                debit[category] += round(-1 * amount, 2)
            else:
                credit[category] += round(amount, 2)
    return {"debit": dict(debit), "credit": dict(credit)}
