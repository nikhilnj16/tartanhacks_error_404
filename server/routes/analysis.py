from fastapi import APIRouter
from collections import defaultdict
from firebase_admin import firestore
from datetime import datetime
import calendar

router = APIRouter()



@router.get("/analysis")
def get_analysis(user_email: str):
    db = firestore.client()
    
    email = user_email
    if not email:
        return {"error": "No user found"}
        
    doc_ref = db.collection("transactions").document(email)
    doc = doc_ref.get()
    
    if not doc.exists:
        return {
            "spending": {}, 
            "weekly_expenditure": {}, 
            "monthly_expenditure": 0.0
        }

    transactions = doc.to_dict().get("transactions", [])
    
    if not transactions:
        return {
            "spending": {}, 
            "weekly_expenditure": {}, 
            "monthly_expenditure": 0.0
        }

    # 1. Find the most recent date in the dataset
    # We use this to determine which "Month" to summarize
    dates = [t.get("date", "") for t in transactions if t.get("date")]
    if not dates:
        return {"error": "No valid dates found in transactions"}
        
    latest_date_str = max(dates)
    latest_date = datetime.strptime(latest_date_str, "%Y-%m-%d")
    
    target_year = latest_date.year
    target_month = latest_date.month

    # 2. Initialize Aggregators
    spending_by_category = defaultdict(float)
    weekly_expenditure = defaultdict(float)
    total_monthly_expenditure = 0.0

    # 3. Iterate and Filter
    for t in transactions:
        date_str = t.get("date", "")
        if not date_str:
            continue
            
        t_date = datetime.strptime(date_str, "%Y-%m-%d")
        
        # Filter: Only process transactions from the Target Month
        if t_date.year == target_year and t_date.month == target_month:
            amount = t.get("amount", 0)
            
            # Only count Expenses (negative amounts)
            if amount < 0:
                abs_amount = round(abs(amount), 2)
                category = t.get("category", "Uncategorized")
                
                # A. Spending by Category
                spending_by_category[category] += abs_amount
                
                # B. Weekly Expenditure
                # Using ISO week number (or you can calculate 'Week 1', 'Week 2' based on day)
                week_num = t_date.isocalendar()[1]
                week_key = f"Week {week_num}"
                weekly_expenditure[week_key] += abs_amount
                
                # C. Total Monthly Expenditure
                total_monthly_expenditure += abs_amount

    return {
        "spending": spending_by_category,
        "weekly_expenditure": weekly_expenditure,
        "monthly_expenditure": round(total_monthly_expenditure, 2)
    }