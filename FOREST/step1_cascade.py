import pandas as pd

# Load the data
df = pd.read_csv("flights_weather_sample.csv")
print("Loaded", len(df), "flights")

# Convert date to a proper datetime so sorting works correctly
df['date'] = pd.to_datetime(df['date'])

# Sort flights so each aircraft's flights are in chronological order
# This is critical — the cascade only makes sense if flights are in time order
df = df.sort_values(['tail_number', 'date', 'dep_hour']).reset_index(drop=True)

# For each tail_number group, look at the previous row's arrival delay
# That's how late this aircraft was on its last flight
df['inbound_delay'] = df.groupby('tail_number')['arr_delay_min'].shift(1)

# The first flight of each aircraft has no "previous" — fill with 0
df['inbound_delay'] = df['inbound_delay'].fillna(0)

# Save the new dataset
df.to_csv("flights_with_cascade.csv", index=False)
print("Saved flights_with_cascade.csv")

# Show some examples so we can sanity check
print("\nSample — one aircraft's chain of flights:")
sample_tail = df['tail_number'].dropna().iloc[100]
sample = df[df['tail_number'] == sample_tail][
    ['date', 'dep_hour', 'origin', 'dest', 'arr_delay_min', 'inbound_delay', 'delayed_15']
]
print(sample)

# Quick stats
print("\nCascade impact check:")
print("Avg inbound_delay for flights that were delayed_15:", 
      df[df['delayed_15']==1]['inbound_delay'].mean())
print("Avg inbound_delay for flights that were on time:", 
      df[df['delayed_15']==0]['inbound_delay'].mean())