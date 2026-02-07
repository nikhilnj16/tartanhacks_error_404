"""
Carbon footprint API: spend-based method (transaction amount × category emission factor).
Includes impact classification: Low / Medium / High vs baseline (avg $ per txn in category).
User email is passed in the request (query param); no auth header required.
"""
from collections import defaultdict

from fastapi import APIRouter, Depends, Query
from google.cloud.firestore import Client as FirestoreClient

from database import get_db
from transaction_repo import get_transactions_for_user
from emission_factors import EMISSION_FACTORS, DEFAULT_EMISSION_FACTOR, get_emission_factor, kg_co2e_from_spend

router = APIRouter(prefix="/carbon", tags=["carbon"])

# Impact vs baseline: Low < 70%, Medium 70–130%, High > 130%
IMPACT_LOW_THRESHOLD = 0.70   # ratio < this → Low
IMPACT_HIGH_THRESHOLD = 1.30  # ratio > this → High


def _impact_level(ratio: float) -> str:
    """Classify impact: Low (< 70% of baseline), Medium (70–130%), High (> 130%)."""
    if ratio < IMPACT_LOW_THRESHOLD:
        return "Low"
    if ratio <= IMPACT_HIGH_THRESHOLD:
        return "Medium"
    return "High"


@router.get("/factors")
def get_emission_factors():
    """Return emission factors (kg CO2e per $) used for spend-based footprint. EPA/industry-based."""
    return {
        "factors_kg_co2e_per_usd": dict(EMISSION_FACTORS),
        "default_for_unknown_category": DEFAULT_EMISSION_FACTOR,
    }


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


@router.get("/footprint")
def get_carbon_footprint(
    user_email: str = Query(..., description="User email (e.g. current user) to compute footprint for"),
    db: FirestoreClient = Depends(get_db),
    last_n: int | None = Query(None, description="Use only the last N transactions by date (default: all)"),
    include_transactions: bool = Query(False, description="Include per-transaction impact classification"),
):
    """
    Compute carbon footprint (kg CO2e) from the given user's transactions (Firestore).
    Pass user email in query; no auth header required. Only spending (negative amounts) is counted.
    Optionally use only the last N transactions by date.

    **Impact classification** (vs baseline = average $ per transaction in that category):
    - **Low**: transaction amount < 70% of category average
    - **Medium**: between 70% and 130% of category average
    - **High**: transaction amount > 130% of category average
    """
    transactions = get_transactions_for_user(db, user_email)
    if last_n is not None and last_n > 0:
        transactions = _take_last_n_by_date(transactions, last_n)
    spending = [t for t in transactions if (t.get("amount") or 0) < 0]

    # 1) Baseline per category: average $ per transaction in that category
    cat_sum: dict[str, float] = defaultdict(float)
    cat_count: dict[str, int] = defaultdict(int)
    for t in spending:
        cat = t.get("category", "Other")
        amt = t.get("amount", 0)
        if isinstance(amt, (int, float)):
            cat_sum[cat] += abs(amt)
            cat_count[cat] += 1
    baseline_avg_usd: dict[str, float] = {
        cat: (cat_sum[cat] / cat_count[cat] if cat_count[cat] else 0.0)
        for cat in cat_sum
    }

    # 2) Totals and per-transaction impact
    total_kg_co2e = 0.0
    by_category: dict[str, dict] = defaultdict(lambda: {
        "amount_spent_usd": 0.0,
        "kg_co2e": 0.0,
        "emission_factor": 0.0,
        "baseline_avg_usd_per_txn": 0.0,
        "impact_low_count": 0,
        "impact_medium_count": 0,
        "impact_high_count": 0,
    })
    transactions_with_impact: list[dict] = []

    for t in spending:
        amount = t.get("amount", 0)
        category = t.get("category", "Other")
        spend = abs(amount) if isinstance(amount, (int, float)) else 0.0
        ef = get_emission_factor(category)
        kg = kg_co2e_from_spend(spend, category)
        total_kg_co2e += kg

        baseline = baseline_avg_usd.get(category) or (spend or 1.0)
        ratio = spend / baseline if baseline else 0.0
        impact = _impact_level(ratio)

        by_category[category]["amount_spent_usd"] += spend
        by_category[category]["kg_co2e"] += kg
        by_category[category]["emission_factor"] = ef
        by_category[category]["baseline_avg_usd_per_txn"] = round(baseline, 2)
        if impact == "Low":
            by_category[category]["impact_low_count"] += 1
        elif impact == "Medium":
            by_category[category]["impact_medium_count"] += 1
        else:
            by_category[category]["impact_high_count"] += 1

        if include_transactions:
            transactions_with_impact.append({
                "transaction_id": t.get("transaction_id"),
                "place": t.get("place"),
                "amount_usd": round(spend, 2),
                "category": category,
                "kg_co2e": round(kg, 4),
                "ratio_to_baseline": round(ratio, 4),
                "impact_level": impact,
            })

    by_category_serializable = {}
    for cat, data in sorted(by_category.items()):
        by_category_serializable[cat] = {
            "amount_spent_usd": round(data["amount_spent_usd"], 2),
            "kg_co2e": round(data["kg_co2e"], 4),
            "emission_factor_kg_co2e_per_usd": data["emission_factor"],
            "baseline_avg_usd_per_txn": data["baseline_avg_usd_per_txn"],
            "impact_breakdown": {
                "low": data["impact_low_count"],
                "medium": data["impact_medium_count"],
                "high": data["impact_high_count"],
            },
        }

    out = {
        "total_kg_co2e": round(total_kg_co2e, 4),
        "by_category": by_category_serializable,
        "transaction_count_used": len(spending),
        "classification_logic": {
            "baseline": "average $ per transaction in that category (this dataset)",
            "low": f"transaction < {IMPACT_LOW_THRESHOLD * 100:.0f}% of baseline",
            "medium": f"between {IMPACT_LOW_THRESHOLD * 100:.0f}% and {IMPACT_HIGH_THRESHOLD * 100:.0f}% of baseline",
            "high": f"transaction > {IMPACT_HIGH_THRESHOLD * 100:.0f}% of baseline",
        },
    }
    if include_transactions:
        out["transactions_with_impact"] = transactions_with_impact
    return out
