# Aerospace03

## Team Miron
- Anastasiya Henechka, Comp. Business Analytics; Maths & Economics
- Martí Roca Bosch, Business Administration
- Miriam Weigand, Physics
- Aaron Kreuzer, Computer Science

## Challenge: DATAbility |  Ready for Takeoff

Every day, thousands of flights are delayed or cancelled. For an airline that adds up to billions a
year, and on any given day it turns a tidy schedule into a mess.
What makes it expensive is the way it spreads. A plane that lands late leaves late on its next leg,
and the one after that. The crew runs into its duty limit. Passengers miss connections. By evening,
one delay from the morning has turned into a dozen. Someone has to catch that early, and that
someone sits at the airline’s operations desk, the dispatcher or duty controller who keeps the day
running. Hours before a flight, they decide what is at risk and what to do about it, whether to hold
a connection, move an aircraft, or call in a standby crew.
The catch is that the reason a flight slips is usually nowhere near the flight. It is weather closing in
on the departure airport, or a knock-on from a delay two legs back. The data that would show it
coming is all there, just scattered: the schedule in one system, the weather in another, the live state
of the fleet somewhere else again. Nobody has pulled it into a straight answer to the only question
that matters at 7am, which flights are about to go wrong, and why. So the desk spends the day
reacting. And when a tool does put a number on a flight, the controller usually ignores it, because
a risk score with no reason attached is just one more thing blinking on a screen.

---

 # Our Progduct: Wingman

**An explainable delay intelligence tool for airline Operations Control Centers (OCCs).**

Wingman helps dispatchers identify high-risk flights before departure, understand *why* a delay is likely to happen, and estimate its potential financial impact.


## Customer

We built Wingman for the **Flight Operations Controller (Dispatcher)** in the **Operations Control Center (OCC)** of **Discover Airlines**.

The OCC is responsible for monitoring daily flight operations and taking preventive actions before delays cascade through the network. Typical decisions include:

- Calling standby crews
- Reassigning aircraft
- Managing turnaround disruptions
- Mitigating weather-related operational risks

Current workflows rely on multiple disconnected systems, making proactive decision-making difficult.

---

## Problem

Most delay prediction systems answer:

> "Will this flight be delayed?"

However, dispatchers need to answer:

> "Which flight should I act on right now?"

A probability score alone is not actionable. Controllers need:

1. An explainable prediction
2. The likely cause of disruption
3. The operational severity
4. The financial consequences of inaction

---

## Solution

Wingman combines flight, schedule, and weather data to provide:

- Delay prediction
- Explainable risk drivers
- Delay severity classification
- Estimated financial exposure
- Flight prioritization based on business impact

The result is a decision-support tool that transforms delay risk into actionable operational recommendations.

---

## Machine Learning Approach

We trained a **Random Forest model** on historical flight and weather data to predict flight delays.

Rather than predicting exact delay minutes, delays are classified into operationally meaningful severity brackets:

| Bracket | Delay Duration | Severity |
|----------|---------------|----------|
| B0 | 0–15 min | On Time |
| B1 | 15–60 min | Minor Delay |
| B2 | 60–120 min | Moderate Delay |
| B3 | 120–180 min | Major Delay |
| B4 | 180–300 min | Severe Delay |
| B5 | 300+ min | Cancellation Zone |

These brackets align with operational and regulatory thresholds used by airlines and allow dispatchers to focus on decisions rather than raw delay values.


---

## Financial Impact Engine

To make delay risk actionable, Wingman converts predicted delays into estimated financial exposure.

The model combines:

- Variable operating costs (fuel, crew, maintenance)
- Delay propagation costs
- Passenger compensation obligations under EU261

### Delay Cost Thresholds

| Delay | Operational Impact |
|---------|-------------------|
| 0–15 min | Absorbed by schedule buffer |
| 15–60 min | Additional operating costs |
| 60–120 min | Network delay propagation begins |
| 120–180 min | Passenger care obligations (EU261 Article 9) |
| 180–300 min | Passenger compensation triggered (EU261 Article 7) |
| 300+ min | Cancellation becomes economically preferable |

---

## Aircraft Assumptions

To estimate delay costs without access to airline-internal accounting systems, flights are grouped into three aircraft categories:

| Size | Route Distance | Assumed Passengers |
|--------|---------------|-------------------|
| Small | < 1,500 km | 100 |
| Medium | 1,500–5,000 km | 150 |
| Large | > 5,000 km | 250 |

Representative per-minute delay costs were derived from EUROCONTROL delay cost benchmarks:

| Size | B1 | B2 | B3 | B4 |
|--------|------|------|------|------|
| Small | €20/min | €36/min | €45/min | €54/min |
| Medium | €50/min | €55/min | €70/min | €85/min |
| Large | €140/min | €150/min | €190/min | €230/min |

This allows Wingman to estimate the expected economic impact of a predicted delay before departure.

---

## Business Value

Wingman shifts disruption management from reactive to proactive.

Instead of prioritizing flights by delay probability alone, dispatchers can prioritize based on:

- Expected financial loss
- Compensation exposure
- Operational severity
- Network impact

For airlines this means:

- Reduced EU261 payouts
- Reduced reactionary delays
- Better resource allocation
- Faster operational decision-making
- More consistent shift handovers

---

## Why Wingman?

Most tools predict delays.

**Wingman predicts, explains, and quantifies the cost of doing nothing.**


