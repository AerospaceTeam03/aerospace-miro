import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import joblib

df = pd.read_csv("flights_with_features.csv")

# Drop cancelled flights (no delay info)
df = df[df['delayed_15'].notna()].copy()

# Features the dispatcher would know BEFORE the flight
features = [
    'inbound_delay',
    'turnaround_minutes',
    'tight_turnaround',
    'dep_hour',
    'day_of_week',
    'distance_km',
    'temp_c',
    'wind_speed_kmh',
    'wind_gust_kmh',
    'precip_mm',
    'snowfall_cm',
    'cloud_cover_pct',
    'weather_code',
]

X = df[features].fillna(0)
y = df['delayed_15'].astype(int)

# Split into training and testing
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Train Random Forest
print("Training model...")
model = RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

# Test it
y_pred = model.predict(X_test)
print("\n=== Model Performance ===")
print(classification_report(y_test, y_pred, target_names=['On Time', 'Delayed']))

# Feature importance — this is the explainability gold
print("\n=== Feature Importance ===")
importances = pd.Series(model.feature_importances_, index=features).sort_values(ascending=False)
print(importances)

# Save model for the dashboard
joblib.dump(model, "wingman_model.pkl")
print("\nSaved wingman_model.pkl")

# Generate predictions for ALL flights
df['delay_probability'] = model.predict_proba(X)[:, 1]

def risk_label(prob):
    if prob > 0.7: return 'RED'
    elif prob > 0.4: return 'AMBER'
    else: return 'GREEN'

df['risk'] = df['delay_probability'].apply(risk_label)

print("\n=== Risk Distribution ===")
print(df['risk'].value_counts())

df.to_csv("flights_with_predictions.csv", index=False)
print("Saved flights_with_predictions.csv")