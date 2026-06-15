"""
Wingman — Financial Impact Layer
=================================
This adds dollar-quantified cost calculations on top of the existing prediction model.

What this does for each flight:
1. Calculates Expected Cost of Doing Nothing (ECDN)
2. Calculates Cost of Recommended Intervention
3. Calculates Expected Avoidable Loss (EAL) = the savings if dispatcher acts
4. Re-ranks flights by EAL instead of probability

Run AFTER step5_reasons.py — it expects flights_final.csv to exist.
"""

import pandas as pd
import numpy as np

# ============================================================================
# COST PARAMETERS - all assumptions in one place, easy to defend
# ============================================================================

# Aircraft operating cost per minute (industry blended averages, USD)
# Source: Airlines for America 2024 data, Eurocontrol benchmarks
COST_PER_MIN = {
    'regional': 80,      # CRJ, Embraer, turboprops
    'narrowbody': 110,   # A320, 737 — most common
    'widebody': 350,     # A330, 787
    'longhaul': 600,     # A380, 777-300ER
}

# Average passengers per aircraft type
PAX_PER_AIRCRAFT = {
    'regional': 70,
    'narrowbody': 150,
    'widebody': 250,
    'longhaul': 400,
}

# Cascade propagation factor - how much delay carries to next leg
# Industry estimates: 0.3-0.7, we use 0.5 as middle ground
CASCADE_PROPAGATION = 0.5

# Connection density by route type (% of passengers connecting)
CONNECTION_DENSITY = {
    'hub_to_hub': 0.50,
    'hub_to_spoke': 0.30,
    'spoke_to_spoke': 0.10,
}

# Cost per missed connection (rebooking + service recovery)
COST_PER_MISSED_CONNECTION = 300

# EU261 compensation tiers (in USD, converted from EUR)
EU261_COST_PER_PAX = {
    'short': 270,    # <1500km, 3hr+ delay
    'medium': 430,   # 1500-3500km, 3hr+ delay
    'long': 650,     # >3500km, 4hr+ delay
}

# Cancellation cost range
CANCELLATION_COST_BASE = 80000  # narrowbody domestic
CANCELLATION_COST_EU = 215000   # widebody EU with full EU261

# Intervention costs (early action, 4+ hours before departure)
INTERVENTION_COSTS = {
    'cascade': 2500,        # aircraft swap
    'turnaround': 600,      # buffer extension
    'weather': 1200,        # monitor + deicing prep
    'congestion': 400,      # retime
    'demand': 800,          # standby crew pre-position
    'low_risk': 0,
}

# Intervention efficacy - % of cost the action actually eliminates
INTERVENTION_EFFICACY = {
    'cascade': 0.85,
    'turnaround': 0.65,
    'weather': 0.50,
    'congestion': 0.70,
    'demand': 0.60,
    'low_risk': 0.0,
}

# Operational overhead multiplier (diffuse costs - dispatcher attention, gates, etc)
OPERATIONAL_OVERHEAD = 1.07


# ============================================================================
# HELPER FUNCTIONS - assign aircraft type and route type from data
# ============================================================================

def classify_aircraft(distance_km):
    """Approximate aircraft type from flight distance.
    Without aircraft type data in the CSV, we use distance as a proxy."""
    if distance_km < 800:
        return 'regional'
    elif distance_km < 3500:
        return 'narrowbody'
    elif distance_km < 7000:
        return 'widebody'
    else:
        return 'longhaul'


def classify_route(origin, dest):
    """Classify route as hub-to-hub, hub-to-spoke, or spoke-to-spoke.
    Major US hubs based on the dataset airports."""
    major_hubs = {'ORD', 'DEN', 'ATL', 'DFW', 'LAX', 'JFK', 'SFO', 'SEA', 
                  'PHX', 'IAH', 'CLT', 'MSP', 'LGA', 'EWR', 'MIA', 'BOS'}
    
    origin_hub = origin in major_hubs
    dest_hub = dest in major_hubs
    
    if origin_hub and dest_hub:
        return 'hub_to_hub'
    elif origin_hub or dest_hub:
        return 'hub_to_spoke'
    else:
        return 'spoke_to_spoke'


def eu261_tier(distance_km):
    """Return EU261 compensation tier based on flight distance."""
    if distance_km < 1500:
        return 'short'
    elif distance_km < 3500:
        return 'medium'
    else:
        return 'long'


def remaining_legs_estimate(dep_hour):
    """Estimate remaining legs today for this aircraft.
    Earlier in the day = more downstream impact."""
    if dep_hour < 8:
        return 4
    elif dep_hour < 12:
        return 3
    elif dep_hour < 16:
        return 2
    elif dep_hour < 19:
        return 1
    else:
        return 0  # last flight of the day, no downstream cascade


# ============================================================================
# CORE COST CALCULATIONS
# ============================================================================

def calculate_expected_delay_minutes(row):
    """Use the model's probability to estimate expected delay magnitude.
    Higher probability = likely larger delay."""
    prob = row.get('delay_probability', 0)
    
    # Simple mapping: probability to expected delay minutes
    # Calibrated against typical industry delay distributions
    if prob > 0.8:
        return 60
    elif prob > 0.7:
        return 45
    elif prob > 0.5:
        return 30
    elif prob > 0.3:
        return 18
    else:
        return 8


def calculate_direct_cost(row, aircraft_type):
    """Cost 1: Direct operational cost of the delay itself."""
    expected_minutes = calculate_expected_delay_minutes(row)
    return expected_minutes * COST_PER_MIN[aircraft_type]


def calculate_cascade_cost(row, aircraft_type):
    """Cost 2: Delay propagation to downstream flights this aircraft will do."""
    inbound_delay = row.get('inbound_delay', 0)
    remaining_legs = remaining_legs_estimate(row.get('dep_hour', 12))
    cost_per_min = COST_PER_MIN[aircraft_type]
    
    cascade_total = 0
    for leg_num in range(1, remaining_legs + 1):
        # Each subsequent leg absorbs less of the delay (geometric decay)
        leg_impact = inbound_delay * (CASCADE_PROPAGATION ** leg_num) * cost_per_min
        cascade_total += leg_impact
    
    return cascade_total


def calculate_connection_cost(row, aircraft_type, route_type):
    """Cost 3: Missed connections cost."""
    expected_minutes = calculate_expected_delay_minutes(row)
    
    # Connections only at risk if delay is significant (>30 min)
    if expected_minutes < 30:
        return 0
    
    total_pax = PAX_PER_AIRCRAFT[aircraft_type]
    connecting_pax = total_pax * CONNECTION_DENSITY[route_type]
    
    # % of connecting pax who actually miss depends on delay severity
    miss_rate = min(0.5, expected_minutes / 120)  # caps at 50%
    
    missed_pax = connecting_pax * miss_rate
    return missed_pax * COST_PER_MISSED_CONNECTION


def calculate_eu261_exposure(row, aircraft_type, distance_km, is_eu_flight=False):
    """Cost 4: EU261 passenger compensation exposure.
    Only applies if delay crosses 3-hour threshold AND it's an EU flight."""
    if not is_eu_flight:
        return 0
    
    expected_minutes = calculate_expected_delay_minutes(row)
    
    # Probability that delay crosses 3-hour (180 min) threshold
    if expected_minutes < 60:
        threshold_prob = 0.05
    elif expected_minutes < 90:
        threshold_prob = 0.15
    elif expected_minutes < 120:
        threshold_prob = 0.35
    else:
        threshold_prob = 0.70
    
    tier = eu261_tier(distance_km)
    total_pax = PAX_PER_AIRCRAFT[aircraft_type]
    
    return threshold_prob * total_pax * EU261_COST_PER_PAX[tier]


def calculate_cancellation_risk(row, is_eu_flight=False):
    """Cost 5: Tail risk of full cancellation."""
    inbound_delay = row.get('inbound_delay', 0)
    
    # Cancellation probability rises sharply with severe inbound delays
    if inbound_delay < 60:
        cancel_prob = 0.01
    elif inbound_delay < 90:
        cancel_prob = 0.05
    elif inbound_delay < 120:
        cancel_prob = 0.12
    else:
        cancel_prob = 0.25
    
    base_cost = CANCELLATION_COST_EU if is_eu_flight else CANCELLATION_COST_BASE
    return cancel_prob * base_cost


def calculate_ecdn(row, is_eu_flight=False):
    """Expected Cost of Doing Nothing - sum all cost categories.
    Returns dict with breakdown + total."""
    
    aircraft_type = classify_aircraft(row.get('distance_km', 1500))
    route_type = classify_route(row.get('origin', ''), row.get('dest', ''))
    distance_km = row.get('distance_km', 1500)
    
    direct = calculate_direct_cost(row, aircraft_type)
    cascade = calculate_cascade_cost(row, aircraft_type)
    connections = calculate_connection_cost(row, aircraft_type, route_type)
    eu261 = calculate_eu261_exposure(row, aircraft_type, distance_km, is_eu_flight)
    cancellation = calculate_cancellation_risk(row, is_eu_flight)
    
    subtotal = direct + cascade + connections + eu261 + cancellation
    overhead = subtotal * (OPERATIONAL_OVERHEAD - 1)
    total = subtotal + overhead
    
    return {
        'direct_cost': round(direct),
        'cascade_cost': round(cascade),
        'connection_cost': round(connections),
        'eu261_exposure': round(eu261),
        'cancellation_risk': round(cancellation),
        'operational_overhead': round(overhead),
        'ecdn_total': round(total),
        'aircraft_type': aircraft_type,
        'route_type': route_type,
    }


def calculate_intervention_savings(row, ecdn_total):
    """Cost 6: What the recommended action costs vs how much it saves."""
    reason_type = row.get('reason_type', 'low_risk')
    
    intervention_cost = INTERVENTION_COSTS.get(reason_type, 1000)
    efficacy = INTERVENTION_EFFICACY.get(reason_type, 0.5)
    
    # Expected Avoidable Loss = how much we save by acting
    savings = (ecdn_total * efficacy) - intervention_cost
    
    return {
        'intervention_cost': intervention_cost,
        'intervention_efficacy_pct': int(efficacy * 100),
        'expected_avoidable_loss': round(max(0, savings)),
    }


# ============================================================================
# URGENCY SCORE - replaces simple risk ranking
# ============================================================================

def calculate_urgency_score(row):
    """Operational Urgency Score combining:
    - Expected Avoidable Loss (the financial dimension)
    - Time to act (the time dimension)
    
    Higher score = act sooner."""
    eal = row.get('expected_avoidable_loss', 0)
    
    # Time to departure proxy - earlier flights need attention first
    dep_hour = row.get('dep_hour', 12)
    
    # Flights departing in next 2-3 hours are most urgent
    # In production this would use actual time-to-departure
    if dep_hour < 8:
        time_urgency = 1.5  # morning flights, dispatcher seeing them at 5am have time
    elif dep_hour < 12:
        time_urgency = 2.0  # mid-morning, action window closing
    elif dep_hour < 17:
        time_urgency = 1.0  # afternoon, plenty of time at 5am
    else:
        time_urgency = 0.8  # evening, lower priority for morning briefing
    
    # Composite urgency score
    return round(eal * time_urgency)


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    print("Loading flights with predictions and reasons...")
    df = pd.read_csv("flights_final.csv")
    print(f"Loaded {len(df)} flights")
    
    # For demo purposes, mark some flights as EU (you can toggle this)
    # In production this would come from origin/dest country lookup
    df['is_eu_flight'] = False  # all US in our dataset
    
    print("\nCalculating financial impact for every flight...")
    
    # Apply ECDN calculation to each flight
    ecdn_results = df.apply(lambda row: calculate_ecdn(row, row['is_eu_flight']), axis=1)
    ecdn_df = pd.DataFrame(ecdn_results.tolist())
    df = pd.concat([df, ecdn_df], axis=1)
    
    # Apply intervention savings calculation
    savings_results = df.apply(
        lambda row: calculate_intervention_savings(row, row['ecdn_total']), axis=1
    )
    savings_df = pd.DataFrame(savings_results.tolist())
    df = pd.concat([df, savings_df], axis=1)
    
    # Calculate the urgency score
    df['urgency_score'] = df.apply(calculate_urgency_score, axis=1)
    
    # Save the enriched dataset
    df.to_csv("flights_with_financials.csv", index=False)
    print("Saved flights_with_financials.csv")
    
    # ========================================================================
    # SUMMARY REPORTING - the numbers for your pitch
    # ========================================================================
    
    print("\n" + "="*70)
    print("WINGMAN FINANCIAL IMPACT SUMMARY")
    print("="*70)
    
    total_at_risk = df['ecdn_total'].sum()
    total_savings = df['expected_avoidable_loss'].sum()
    
    print(f"\nTotal money at risk across all flights: ${total_at_risk:,.0f}")
    print(f"Total potential savings if Wingman alerts acted on: ${total_savings:,.0f}")
    print(f"Total intervention cost: ${df['intervention_cost'].sum():,.0f}")
    print(f"Net ROI multiplier: {total_savings / max(1, df['intervention_cost'].sum()):.1f}x")
    
    print("\n" + "-"*70)
    print("BY RISK LEVEL")
    print("-"*70)
    
    for risk in ['RED', 'AMBER', 'GREEN']:
        subset = df[df['risk'] == risk]
        if len(subset) > 0:
            print(f"\n{risk} flights ({len(subset)}):")
            print(f"  Avg money at risk:  ${subset['ecdn_total'].mean():,.0f}")
            print(f"  Avg avoidable loss: ${subset['expected_avoidable_loss'].mean():,.0f}")
            print(f"  Total at stake:     ${subset['ecdn_total'].sum():,.0f}")
    
    print("\n" + "-"*70)
    print("TOP 10 FLIGHTS BY EXPECTED AVOIDABLE LOSS")
    print("-"*70)
    
    top10 = df.nlargest(10, 'expected_avoidable_loss')[
        ['flight_id', 'origin', 'dest', 'risk', 'reason_text', 
         'ecdn_total', 'intervention_cost', 'expected_avoidable_loss']
    ]
    print(top10.to_string(index=False))
    
    print("\n" + "-"*70)
    print("FINANCIAL BREAKDOWN OF TOP FLIGHT (your demo flight)")
    print("-"*70)
    
    top_flight = df.nlargest(1, 'expected_avoidable_loss').iloc[0]
    print(f"\nFlight: {top_flight['flight_id']}")
    print(f"Route: {top_flight['origin']} -> {top_flight['dest']}")
    print(f"Aircraft type: {top_flight['aircraft_type']}")
    print(f"Risk: {top_flight['risk']}")
    print(f"Reason: {top_flight['reason_text']}")
    print(f"\nCost breakdown:")
    print(f"  Direct delay cost:    ${top_flight['direct_cost']:,}")
    print(f"  Cascade to downstream: ${top_flight['cascade_cost']:,}")
    print(f"  Missed connections:    ${top_flight['connection_cost']:,}")
    print(f"  EU261 exposure:        ${top_flight['eu261_exposure']:,}")
    print(f"  Cancellation risk:     ${top_flight['cancellation_risk']:,}")
    print(f"  Operational overhead:  ${top_flight['operational_overhead']:,}")
    print(f"  TOTAL AT RISK:         ${top_flight['ecdn_total']:,}")
    print(f"\nRecommended action: {top_flight['recommended_action']}")
    print(f"Intervention cost:        ${top_flight['intervention_cost']:,}")
    print(f"Intervention efficacy:    {top_flight['intervention_efficacy_pct']}%")
    print(f"EXPECTED AVOIDABLE LOSS:  ${top_flight['expected_avoidable_loss']:,}")
    
    print("\n" + "="*70)
    print("Done. Use flights_with_financials.csv for the dashboard.")
    print("="*70)


if __name__ == "__main__":
    main()