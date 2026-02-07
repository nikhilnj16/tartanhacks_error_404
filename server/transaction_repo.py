"""
Firestore access for user transactions.
Collection: transactions. Document ID: user email. Field: "transactions" (array).
"""
from typing import Any

from google.cloud.firestore import Client as FirestoreClient

TRANSACTIONS_COLLECTION = "transactions"


def get_transactions_for_user(db: FirestoreClient, user_email: str) -> list[dict[str, Any]]:
    """
    Load the transactions array for a user from Firestore.
    Document ID = user email; field "transactions" = array of transaction objects.
    Returns empty list if document or field is missing.
    """
    ref = db.collection(TRANSACTIONS_COLLECTION).document(user_email.strip().lower())
    doc = ref.get()
    if not doc.exists:
        return []
    data = doc.to_dict()
    transactions = data.get("transactions")
    if not isinstance(transactions, list):
        return []
    return list(transactions)


def add_transaction_for_user(
    db: FirestoreClient, user_email: str, transaction: dict[str, Any]
) -> int:
    """
    Append one transaction to the user's transactions array in Firestore.
    Document ID = user email (lowercase); field "transactions" = array.
    Returns the new length of the transactions array.
    """
    key = user_email.strip().lower()
    ref = db.collection(TRANSACTIONS_COLLECTION).document(key)
    doc = ref.get()
    if doc.exists:
        data = doc.to_dict() or {}
        current = list(data.get("transactions") or [])
    else:
        current = []
    current.append(transaction)
    ref.set({"transactions": current})
    return len(current)
