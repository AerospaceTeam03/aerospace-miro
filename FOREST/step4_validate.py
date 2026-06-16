import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
import joblib

df = pd.read_csv("flights_with_features.csv")
df = df[df['delayed_15'].notna()].copy()

features = ['inbound_delay','turnaround_minutes','tight_turnaround','dep_hour',
            'day_of_week','distance_km','temp_c','wind_speed_kmh','wind_gust_kmh',
            'precip_mm','snowfall_cm','cloud_cover_pct','weather_code']

X = df[features].fillna(0)
y = df['delayed_15'].astype(int)

model = RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42, n_jobs=-1)

# 5-fold cross validation — splits data 5 different ways, trains 5 times
scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print("Cross-validation accuracy across 5 folds:", scores)
print(f"Average: {scores.mean():.3f} (+/- {scores.std():.3f})")

# Same for recall on delays
recall_scores = cross_val_score(model, X, y, cv=5, scoring='recall')
print(f"\nRecall on delayed flights across 5 folds: {recall_scores.mean():.3f} (+/- {recall_scores.std():.3f})")