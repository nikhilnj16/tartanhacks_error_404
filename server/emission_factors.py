"""
Emission factors (kg CO2e per $ spent) for spend-based carbon footprint.
Based on EPA and industry averages (e.g. Mastercard/Cogo). Used for hackathon MVP.
"""
from typing import Final

# kg CO2 equivalent per dollar spent
# Categories from user data + standard ones from the spec
EMISSION_FACTORS: Final[dict[str, float]] = {
    # High impact
    "Fuel": 1.0,  # 0.80–1.20, direct combustion
    # Food
    "Food": 0.5,  # 0.40–0.60, fast food / supply chain
    "Groceries": 0.4,  # 0.30–0.50
    # Utilities
    "Utilities": 0.4,  # electric / grid
    # Low impact
    "Rent": 0.03,  # 0.01–0.05, administrative
    "Insurance": 0.03,  # same as Rent/Insurance
    "Subscriptions": 0.02,  # data center usage
    # Other
    "Leisure": 0.25,  # entertainment / general estimate
}

# Default for any category not in the map (avoid KeyError)
DEFAULT_EMISSION_FACTOR: Final[float] = 0.2


def get_emission_factor(category: str) -> float:
    """Return kg CO2e per $ for the category, or default if unknown."""
    return EMISSION_FACTORS.get(category.strip(), DEFAULT_EMISSION_FACTOR)


def kg_co2e_from_spend(amount_usd: float, category: str) -> float:
    """Carbon footprint (kg CO2e) = |amount| * emission factor. Use positive spend (e.g. abs(amount))."""
    spend = abs(float(amount_usd))
    return round(spend * get_emission_factor(category), 4)
