# -*- coding: utf-8 -*-
"""
Created on Mon Jun 15 18:52:07 2026

@author: mijuw
"""

from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# -----------------------------
# 1) Load one file or many files
# -----------------------------
def load_flight_data(path_or_folder):
    """
    Load one CSV file or all CSV files from a folder into one DataFrame.
    """
    p = Path(path_or_folder)

    if p.is_file():
        dfs = [pd.read_csv(p)]
    else:
        dfs = [pd.read_csv(f) for f in sorted(p.glob("*.csv"))]

    df = pd.concat(dfs, ignore_index=True)

    # Parse dates if present
    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
    
    return df


# -----------------------------------------
# 2) Prepare weekday and delay reason fields
# -----------------------------------------
def prepare_flight_data(df):
    df = df.copy()

    # Weekday labels in Monday -> Sunday order
    weekday_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    # Use existing day_of_week if available, otherwise derive from date
    if "day_of_week" in df.columns:
        # Handle numeric weekday codes like 1-7
        weekday_map = {
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday",
            7: "Sunday",
        }

        if pd.api.types.is_numeric_dtype(df["day_of_week"]):
            df["weekday"] = df["day_of_week"].map(weekday_map)
        else:
            # If already stored as names, normalize text
            df["weekday"] = df["day_of_week"].astype(str).str.strip().str.title()
    elif "date" in df.columns:
        df["weekday"] = df["date"].dt.day_name()
    else:
        raise ValueError("Need either a 'day_of_week' column or a 'date' column.")

    df["weekday"] = pd.Categorical(df["weekday"], categories=weekday_order, ordered=True)

    # Detect delay-reason minute columns, e.g. late_aircraft_delay_min, weather_delay_min
    # Exclude overall delay columns.
    delay_reason_cols = [
        c for c in df.columns
        if c.endswith("_delay_min") and c not in ["dep_delay_min", "arr_delay_min"]
    ]

    # Convert delay columns to numeric safely
    for col in delay_reason_cols + [c for c in ["dep_delay_min", "arr_delay_min"] if c in df.columns]:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    return df, delay_reason_cols



# ---------------------------------------------------
# 3) Build stacked weekday barplot for delay reasons
# ---------------------------------------------------
def plot_weekday_delay_composition(df, reason_cols):
    weekly = (
        df.groupby("weekday", observed=True)[reason_cols]
          .sum()
          .reindex(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
    )

    ax = weekly.plot(kind="bar", stacked=True, figsize=(12, 6))
    ax.set_xlabel("Weekday")
    ax.set_ylabel("Total delay minutes")
    ax.set_title("Delay reasons by weekday")
    ax.legend(title="Delay reason", bbox_to_anchor=(1.02, 1), loc="upper left")
    plt.tight_layout()
    script_dir = Path(__file__).parent
    plt.savefig(script_dir /"2015DataDelaysPerWeekDay")
    plt.show()


# -----------------------------
# 4) Correlation matrix example
# -----------------------------
def plot_correlation_matrix_all_entries(df):
    numeric_df = df.select_dtypes(include="number").copy()

    # Optional: remove ID-like columns if they were read as numeric
    corr = numeric_df.corr()

    plt.figure(figsize=(12, 8))
    plt.imshow(corr, aspect="auto")
    plt.colorbar(label="Correlation")
    plt.xticks(range(len(corr.columns)), corr.columns, rotation=90)
    plt.yticks(range(len(corr.columns)), corr.columns)
    plt.title("Correlation matrix")
    plt.tight_layout()
    script_dir = Path(__file__).parent
    plt.savefig(script_dir / "Correlations_2015Data.png")
    plt.show()

    return corr

# -----------------------------
# 4) Correlation matrix specific colums
# -----------------------------
def plot_correlation_matrix(df):
    numeric_df = df.select_dtypes(include="number").copy()

    # Optional: remove ID-like columns if they were read as numeric
    #corr = numeric_df.corr()
    cols = [ # fix colums
    "temperature",
    "wind_speed",
    "precip_mm",
    "weather_delay_min",
    "arr_delay_min",
    "dep_delay_min"
    ]

    corr = df[cols].corr()

    plt.figure(figsize=(12, 8))
    plt.imshow(corr, aspect="auto")
    plt.colorbar(label="Correlation")
    plt.xticks(range(len(corr.columns)), corr.columns, rotation=90)
    plt.yticks(range(len(corr.columns)), corr.columns)
    plt.title("Correlation matrix")
    plt.tight_layout()
    script_dir = Path(__file__).parent
    plt.savefig(script_dir /"Important_Correlations_2015Data.png")
    plt.show()

    return corr

def plot_delay_correlation_heatmap(df, cols):

    cols = [
        "air_system_delay_min",
        "security_delay_min",
        "airline_delay_min",
        "late_aircraft_delay_min",
        "weather_delay_min",
        "dep_delay_min",
        "arr_delay_min"
    ]

    # Keep only columns that actually exist
    cols = [c for c in cols if c in df.columns]

    corr = df[cols].corr()

    plt.figure(figsize=(10, 8))

    im = plt.imshow(corr)

    plt.colorbar(im, label="Correlation")

    plt.xticks(
        range(len(corr.columns)),
        corr.columns,
        rotation=45,
        ha="right"
    )

    plt.yticks(
        range(len(corr.columns)),
        corr.columns
    )

    plt.title("Delay Correlation Matrix")

    # Add correlation values to cells
    for i in range(len(corr)):
        for j in range(len(corr)):
            plt.text(
                j,
                i,
                f"{corr.iloc[i, j]:.2f}",
                ha="center",
                va="center",
                fontsize=8
            )

    plt.tight_layout()
    script_dir = Path(__file__).parent
    plt.savefig(script_dir /"DelayCorrelation.png")
    plt.show()

    return corr


# -----------------------------
# Example usage
# -----------------------------
if __name__ == "__main__":
    
    script_dir = Path(__file__).parent
    #csv_file = script_dir / "flights_weather_smaller_sample.csv"

    # Read a single file:
    #weather data
    df = load_flight_data(script_dir /"flights_weather_sample_10airports.csv")

    #print(df.columns)
    # Or read all CSVs in a folder:
    #df = load_flight_data(".")

    
    df_p, delay_reason_cols = prepare_flight_data(df)
    #print("Columns used as delay reasons:", delay_reason_cols)


#%%
    # heatmat delay resons
    plot_delay_correlation_heatmap(df, delay_reason_cols)
    
    # composition
    #plot_weekday_delay_composition(df_p, delay_reason_cols)
    
    #correlation
    #corr = plot_correlation_matrix_all_entries(df_p)
   
    #tail number
    tail_number_delay = (df.groupby("tail_number")["dep_delay_min"].mean())
    #tail_number_delay.plot(kind="bar")
    
    #hourly delay
    hourly_delay = (df_p.groupby("dep_hour")["dep_delay_min"].mean())
    #hourly_delay.plot(kind="bar")
    
    # airport delay
    airport_delay = (
    df.groupby("origin")["dep_delay_min"]
      .mean()
      .sort_values())
    #airport_delay.plot(kind='bar')
    
    #distance vs delay
    #plt.scatter(df_p["distance_km"],df_p["dep_delay_min"])
    
    #dep delav vs arriv delay
    #-> am ende linearer zusammenhang
    #->
    #plt.scatter(df["dep_delay_min"],df["arr_delay_min"])
    x=[i for i in range(0,1500,100)]
    #plt.plot(x,x,color='r')
    
    #delay vs cancelation 
    #plt.scatter(df_p["arr_delay_min"],df["cancelled"])
    