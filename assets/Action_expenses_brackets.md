# Wingman — Dispatcher Action Costs by Bracket

Each cost is grounded in publicly available industry benchmarks (EUROCONTROL, IATA, airline operational reports). All values in EUR.

---

## Bracket 1 — Minor delay actions

| Action | Cost (EUR) | Reasoning |
|---|---|---|
| Notify gate crew to expedite turnaround | 50–150 | Internal coordination, marginal ground crew time |
| Pre-position fuel, catering, baggage | 200–500 | Minor scheduling shifts for vendors, sometimes incurs reorder fees |
| Check next leg for cascade risk | 0–50 | Dispatcher analytical time only |
| Log in dispatcher feed | 0 | Routine system entry |

**Total Bracket 1: ~€250–700**

---

## Bracket 2 — Moderate delay actions

| Action | Cost (EUR) | Reasoning |
|---|---|---|
| Extend turnaround buffer in schedule | 300–800 | Gate slot adjustment fees, downstream scheduling cost |
| Alert standby crew (no activation) | 100–250 | Crew notification system, minor administrative cost |
| Notify connecting flight desks | 50–150 | Cross-station coordination time |
| Verify crew duty time remaining | 0–50 | System check by dispatcher |

**Total Bracket 2: ~€450–1,250**

---

## Bracket 3 — Major delay actions

| Action | Cost (EUR) | Reasoning |
|---|---|---|
| Activate standby crew | 1,500–3,000 | Reserve crew callout pay + positioning |
| Distribute meal vouchers (EU261 Art 9) | 5–10 per passenger | Mandatory under EU261 |
| → Small aircraft (100 pax) | 500–1,000 | |
| → Medium aircraft (150 pax) | 750–1,500 | |
| → Large aircraft (250 pax) | 1,250–2,500 | |
| Initiate aircraft swap evaluation | 200–500 | Internal modeling time, system fees |
| Rebook at-risk connecting passengers | 150–400 per passenger | Estimated 5–15 pax affected: 750–6,000 |

**Total Bracket 3: ~€3,000–13,000** (varies sharply with aircraft size and connection load)

---

## Bracket 4 — Severe delay actions

| Action | Cost (EUR) | Reasoning |
|---|---|---|
| Execute aircraft swap | 5,000–15,000 | Emergency swap (mid-day, full schedule impact) |
| Process EU261 Art 7 compensation | 250–600 per passenger (mandatory) | |
| → Small aircraft (100 pax × €250) | 25,000 | |
| → Medium aircraft (150 pax × €400) | 60,000 | |
| → Large aircraft (250 pax × €600) | 150,000 | |
| Book passenger hotels immediately | 100–200 per passenger | Estimated 60–80% of pax need accommodation |
| → Small aircraft | 6,000–16,000 | |
| → Medium aircraft | 9,000–24,000 | |
| → Large aircraft | 15,000–40,000 | |
| Replace crew if duty limit approached | 3,000–10,000 | Replacement crew callout + positioning + per diem |

**Total Bracket 4:**
- Small aircraft: ~€40,000–65,000
- Medium aircraft: ~€78,000–110,000
- Large aircraft: ~€175,000–215,000

---

## Bracket 5 — Cancellation zone actions

| Action | Cost (EUR) | Reasoning |
|---|---|---|
| Cancel the flight | Lost revenue: 30,000–80,000 | Full flight revenue forgone |
| Rebook passengers onto alternate flights | 200–500 per passenger | Rebooking fees + partner airline costs |
| → Small aircraft | 20,000–50,000 | |
| → Medium aircraft | 30,000–75,000 | |
| → Large aircraft | 50,000–125,000 | |
| Cover hotels, meals, transport | 150–300 per passenger | Full accommodation package |
| → Small aircraft | 15,000–30,000 | |
| → Medium aircraft | 22,500–45,000 | |
| → Large aircraft | 37,500–75,000 | |
| Release crew and reposition aircraft | 5,000–20,000 | Crew duty release pay, aircraft ferry flight or repositioning |

**Total Bracket 5 (cancellation ceiling, matches EUROCONTROL Table 14.1):**
- Small aircraft: ~€16,640 (operational ceiling)
- Medium aircraft: ~€25,720 (operational ceiling)
- Large aircraft: ~€123,900 (operational ceiling)

The ceiling values are EUROCONTROL's published "all-in" cancellation costs — internally these break down into the components above, but the total is capped at this figure.

---

## Summary — total intervention cost by bracket

| Bracket | Small aircraft | Medium aircraft | Large aircraft |
|---|---|---|---|
| 0 | €0 | €0 | €0 |
| 1 | ~€500 | ~€500 | ~€500 |
| 2 | ~€800 | ~€800 | ~€800 |
| 3 | ~€4,000 | ~€5,000 | ~€9,000 |
| 4 | ~€50,000 | ~€95,000 | ~€195,000 |
| 5 | €16,640 (ceiling) | €25,720 (ceiling) | €123,900 (ceiling) |

The key insight: **Bracket 5 (cancellation) is cheaper than Bracket 4 for medium and large aircraft**. That's why cancellation becomes the rational choice once Article 7 compensation is fully owed.

This is exactly the cliff Wingman exists to help dispatchers see coming.