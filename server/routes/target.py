# backend/app/routes/target.py

from fastapi import APIRouter
from pydantic import BaseModel
import datetime

from models.goal_state import target_profile

router = APIRouter()

def compute_goal_status():
    today = datetime.date.today()
    target_date = datetime.date.fromisoformat(target_profile["target_date"])

    days_left = max((target_date - today).days, 0)

    remaining_amount = max(
        target_profile["target_amount"] - target_profile["current_savings"], 0
    )

    if days_left > 0:
        daily_savings_required = round(remaining_amount / days_left, 2)
    else:
        daily_savings_required = 0

    return {
        "goal_name": target_profile["name"],
        "target_date": target_profile["target_date"],
        "days_left": days_left,
        "current_savings": target_profile["current_savings"],
        "remaining_amount": remaining_amount,
        "daily_savings_required": daily_savings_required
    }


@router.get("/target")
def get_target():
    return compute_goal_status()


class SavingsInput(BaseModel):
    amount: float


@router.post("/target/add-savings")
def add_savings(data: SavingsInput):
    if data.amount <= 0:
        return {"error": "Savings amount must be positive"}

    target_profile["current_savings"] += data.amount

    if target_profile["current_savings"] >= target_profile["target_amount"]:
        return {
            "message": "Congratulations! You have reached your savings goal!",
            "updated_goal": compute_goal_status()
        }

    return {
        "message": f"Added ${data.amount} to savings",
        "updated_goal": compute_goal_status()
    }
