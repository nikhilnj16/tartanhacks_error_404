from fastapi import APIRouter
from pydantic import BaseModel

from routes.target import compute_goal_status

user_profile = {
    "hourly_wage": 15.00
}

router = APIRouter()

class PurchaseInput(BaseModel):
    amount: float
    merchant: str   

@router.post("/reflection/purchase")
def reflect_purchase(data: PurchaseInput):
    if data.amount <= 0:
        return {"error": "Purchase amount must be positive"}

    goal_status = compute_goal_status()
    daily_savings_required = goal_status["daily_savings_required"]
    hourly_wage = user_profile["hourly_wage"]
    if hourly_wage <= 0:
        return {"error": "Hourly wage must be positive"}

    if daily_savings_required == 0:
        return {
            "message": "Goal already funded or no time left",
            "goal_status": goal_status
        }

    labor_hours = round(data.amount / hourly_wage, 2)

    goal_delay_days = round(data.amount / daily_savings_required, 1)
    return {
        "headline": "What did this cost you?",
        "merchant": data.merchant,
        "purchase_amount": data.amount,
        "reflection": {
            "labor_hours": labor_hours,
            "labor_message": (
                f"You worked {labor_hours} hours to pay for this."
            ),
            "goal_name": goal_status["goal_name"],
            "goal_delay_days": goal_delay_days,
            "goal_message": (
                f"This purchase pushed your '{goal_status['goal_name']}' "
                f"back by {goal_delay_days} days."
            )
        }
    }
