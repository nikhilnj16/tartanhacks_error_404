from pydantic import BaseModel
from datetime import date, datetime

class Transaction(BaseModel):
    date: date
    time: datetime
    transaction_id: str
    amount: float
    place: str
    category: str

