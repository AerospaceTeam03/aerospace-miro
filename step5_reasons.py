import pandas as pd

df = pd.read_csv("flights_with_predictions.csv")

def get_reason(row):
    reasons = []
    if row['inbound_delay'] > 30:
        reasons.append(('cascade', "Inbound aircraft " + str(int(row['inbound_delay'])) + " min late on previous leg"))
    elif row['inbound_delay'] > 15:
        reasons.append(('cascade', "Inbound aircraft slightly late (" + str(int(row['inbound_delay'])) + " min)"))
    if 0 < row['turnaround_minutes'] < 60:
        reasons.append(('turnaround', "Tight turnaround (" + str(int(row['turnaround_minutes'])) + " min)"))
    elif 60 <= row['turnaround_minutes'] < 90:
        reasons.append(('turnaround', "Moderate turnaround (" + str(int(row['turnaround_minutes'])) + " min)"))
    if row['snowfall_cm'] > 2:
        reasons.append(('weather', "Heavy snow at origin (" + str(round(row['snowfall_cm'],1)) + " cm)"))
    elif row['snowfall_cm'] > 0.5:
        reasons.append(('weather', "Light snow at origin (" + str(round(row['snowfall_cm'],1)) + " cm)"))
    if row['wind_gust_kmh'] > 65:
        reasons.append(('weather', "High wind gusts (" + str(int(row['wind_gust_kmh'])) + " km/h)"))
    elif row['wind_gust_kmh'] > 40:
        reasons.append(('weather', "Moderate wind gusts (" + str(int(row['wind_gust_kmh'])) + " km/h)"))
    if row['weather_code'] == 45:
        reasons.append(('weather', "Fog at origin"))
    elif row['weather_code'] == 95:
        reasons.append(('weather', "Thunderstorm at origin"))
    if row['dep_hour'] in [17, 18, 19, 20]:
        reasons.append(('congestion', "Evening peak congestion bank"))
    elif row['dep_hour'] in [6, 7, 8]:
        reasons.append(('congestion', "Morning peak bank"))
    if row['day_of_week'] in [1, 5]:
        reasons.append(('demand', "High-demand travel day"))
    if not reasons:
        return ('low_risk', "Multiple minor factors combined")
    priority = {'cascade': 1, 'turnaround': 2, 'weather': 3, 'congestion': 4, 'demand': 5, 'low_risk': 6}
    reasons.sort(key=lambda x: priority[x[0]])
    return reasons[0]

df['reason_type'], df['reason_text'] = zip(*df.apply(get_reason, axis=1))

action_map = {
    'cascade': "Consider aircraft swap or extend turnaround",
    'turnaround': "Add ground time buffer or expedite handling",
    'weather': "Monitor weather, prepare for ground stop",
    'congestion': "Retime departure if possible to avoid peak",
    'demand': "Pre-position standby crew",
    'low_risk': "Monitor as normal"
}

df['recommended_action'] = df['reason_type'].map(action_map)
df.to_csv("flights_final.csv", index=False)

print("=== Sample RED flights ===")
print(df[df['risk']=='RED'][['flight_id','origin','dest','reason_text','recommended_action']].head(10).to_string())

print("\n=== Sample AMBER flights ===")
print(df[df['risk']=='AMBER'][['flight_id','origin','dest','reason_text','recommended_action']].head(5).to_string())

print("\n=== Reason distribution (all flights) ===")
total = len(df)
counts = df['reason_type'].value_counts()
for reason, count in counts.items():
    pct = count / total * 100
    print(f"{reason:12s} {count:5d}  ({pct:.1f}%)")

print("\n=== Reason distribution within RED flights only ===")
red_df = df[df['risk']=='RED']
red_total = len(red_df)
red_counts = red_df['reason_type'].value_counts()
for reason, count in red_counts.items():
    pct = count / red_total * 100
    print(f"{reason:12s} {count:5d}  ({pct:.1f}%)")