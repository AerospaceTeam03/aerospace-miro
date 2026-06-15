import pandas as pd

df = pd.read_csv("flights_with_cascade.csv")
df['date'] = pd.to_datetime(df['date'])

# Build a proper datetime for scheduled departure
df['sched_dep_datetime'] = pd.to_datetime(
    df['date'].dt.strftime('%Y-%m-%d') + ' ' + df['sched_dep_local']
)

# For each aircraft chain, calculate time between previous arrival and this departure
df = df.sort_values(['tail_number', 'sched_dep_datetime']).reset_index(drop=True)
df['prev_sched_arr'] = df.groupby('tail_number')['scheduled_arr_local'].shift(1)
df['prev_date'] = df.groupby('tail_number')['date'].shift(1)

# Calculate turnaround in minutes (simplified — for the dispatcher view this is good enough)
df['turnaround_minutes'] = df.groupby('tail_number')['sched_dep_datetime'].diff().dt.total_seconds() / 60
df['turnaround_minutes'] = df['turnaround_minutes'].fillna(120)  # default 2hr if first flight

# Tight turnaround flag
df['tight_turnaround'] = (df['turnaround_minutes'] < 60).astype(int)

df.to_csv("flights_with_features.csv", index=False)
print("Saved flights_with_features.csv")

# Check: do tight turnarounds correlate with delays?
print("\nTurnaround impact:")
print("Avg turnaround for delayed flights:", df[df['delayed_15']==1]['turnaround_minutes'].mean())
print("Avg turnaround for on-time flights:", df[df['delayed_15']==0]['turnaround_minutes'].mean())
print("\nDelay rate when tight turnaround (<60 min):", df[df['tight_turnaround']==1]['delayed_15'].mean())
print("Delay rate when normal turnaround:", df[df['tight_turnaround']==0]['delayed_15'].mean())