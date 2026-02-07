import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from scipy.sparse import hstack


try:
    model = joblib.load('regression_model/dynamic_expenditure_model.pkl')
    scaler = joblib.load('regression_model/dynamic_scaler.pkl')
    tfidf = joblib.load('regression_model/dynamic_tfidf.pkl')
    feature_columns = joblib.load('regression_model/dynamic_feature_columns.pkl')
    

    
except Exception as e:
    print(f"\n❌ ERROR loading files: {e}")
    exit(1)


def extract_dynamic_features(transaction):   
    amount = abs(transaction['amount'])
    category = transaction['category']
    place = transaction['place']
    dt = datetime.strptime(transaction['date'], '%Y-%m-%d')
    day_of_week = dt.weekday()
    day_of_month = dt.day
    is_weekend = 1 if day_of_week >= 5 else 0
    is_month_start = 1 if day_of_month <= 5 else 0
    
    time_obj = datetime.strptime(transaction['time'], '%H:%M:%S')
    hour = time_obj.hour
    is_morning = 1 if 6 <= hour < 12 else 0
    is_afternoon = 1 if 12 <= hour < 18 else 0
    is_evening = 1 if 18 <= hour < 24 else 0
    is_night = 1 if 0 <= hour < 6 else 0
    
    amount_log = np.log1p(amount)
    is_large_expense = 1 if amount > 100 else 0
    is_small_expense = 1 if amount < 10 else 0
    is_medium_expense = 1 if 10 <= amount <= 50 else 0
    
    categories = ['Housing & Bills', 'Health', 'Entertainment', 'Shopping', 
                  'Transport', 'Food', 'Personal', 'Subscriptions', 'Income & Transfers']
    category_features = {f'category_{i}': 1 if category == cat else 0 
                        for i, cat in enumerate(categories)}
    
    place_lower = place.lower()
    is_recurring = 1 if any(word in place_lower for word in ['auto-pay', 'subscription', 'monthly']) else 0
    contains_insurance = 1 if 'insurance' in place_lower else 0
    suggests_grocery = 1 if any(word in place_lower for word in ['grocery', 'groceries', 'market']) else 0
    suggests_fuel = 1 if any(word in place_lower for word in ['gas', 'fuel', 'station']) else 0
    suggests_health = 1 if any(word in place_lower for word in ['pharmacy', 'medical', 'doctor', 'hospital', 'clinic']) else 0
    suggests_entertainment = 1 if any(word in place_lower for word in ['movie', 'cinema', 'theater', 'concert', 'bar', 'club']) else 0
    place_word_count = len(place.split())
    has_hyphen = 1 if '-' in place else 0
    
    features = {
        'amount': amount,
        'amount_log': amount_log,
        'is_large_expense': is_large_expense,
        'is_small_expense': is_small_expense,
        'is_medium_expense': is_medium_expense,
        'day_of_week': day_of_week,
        'day_of_month': day_of_month,
        'is_weekend': is_weekend,
        'is_month_start': is_month_start,
        'hour': hour,
        'is_morning': is_morning,
        'is_afternoon': is_afternoon,
        'is_evening': is_evening,
        'is_night': is_night,
        'is_recurring': is_recurring,
        'contains_insurance': contains_insurance,
        'suggests_grocery': suggests_grocery,
        'suggests_fuel': suggests_fuel,
        'suggests_health': suggests_health,
        'suggests_entertainment': suggests_entertainment,
        'place_word_count': place_word_count,
        'has_hyphen': has_hyphen,
        **category_features
    }
    
    return features, place


def validate_transaction(transaction):
    if transaction['amount'] < 0:
        features, place_text = extract_dynamic_features(transaction)
        feature_df = pd.DataFrame([features])[feature_columns]
        
        structured_scaled = scaler.transform(feature_df)
            
        tfidf_features = tfidf.transform([place_text])
            
        X_combined = hstack([structured_scaled, tfidf_features])
            
        prediction = model.predict(X_combined)[0]
        probability = model.predict_proba(X_combined)[0]
            
        pred_label = "Important" if prediction == 1 else "Discretionary"
        confidence = max(probability)
        return pred_label, confidence




