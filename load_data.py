import pandas as pd
import mysql.connector

df = pd.read_csv("flights_weather_sample.csv")

conn = mysql.connector.connect(
    host="localhost",
    user="anastasiyahenechka",
    password="Test123",
    database="flightsdb"  # or create a new one called flightsdb
)

cursor = conn.cursor()

# Create table
cursor.execute("""
CREATE TABLE IF NOT EXISTS flights (
    flight_id VARCHAR(50),
    date DATE,
    day_of_week INT,
    carrier VARCHAR(10),
    flight_number VARCHAR(10),
    tail_number VARCHAR(20),
    origin VARCHAR(10),
    dest VARCHAR(10),
    dep_hour INT,
    distance_km FLOAT,
    temp_c FLOAT,
    wind_speed_kmh FLOAT,
    wind_gust_kmh FLOAT,
    precip_mm FLOAT,
    snowfall_cm FLOAT,
    cloud_cover_pct FLOAT,
    weather_code INT,
    dep_delay_min FLOAT,
    delayed_15 FLOAT,
    cancelled INT,
    delay_cause VARCHAR(50)
)
""")

# Insert rows
for _, row in df.iterrows():
    cursor.execute("""
        INSERT INTO flights VALUES 
        (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, tuple(row[["flight_id","date","day_of_week","carrier","flight_number",
                     "tail_number","origin","dest","dep_hour","distance_km",
                     "temp_c","wind_speed_kmh","wind_gust_kmh","precip_mm",
                     "snowfall_cm","cloud_cover_pct","weather_code",
                     "dep_delay_min","delayed_15","cancelled","delay_cause"]]))

conn.commit()
conn.close()
print("Done! Loaded", len(df), "rows")