from fastapi import APIRouter, Depends, Query

from database import get_db
from transaction_repo import get_transactions_for_user
from google.cloud.firestore import Client as FirestoreClient

router = APIRouter()


@router.get("/transactions")
def get_transactions(
    user_email: str = Query(..., description="User email to fetch transactions for"),
    db: FirestoreClient = Depends(get_db),
    limit: int | None = Query(None, description="Max number of transactions to return"),
):
    """Return transactions from Firestore for the given user email. No auth header required."""
    transactions = get_transactions_for_user(db, user_email)
    if limit is not None:
        transactions = transactions[:limit]
    return {"transactions": transactions}
