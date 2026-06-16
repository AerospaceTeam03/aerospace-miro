// Rich fixture data for Flight Deep Detail.
// Each flight is hand-crafted to represent a realistic Discover Airlines (4Y)
// OCC scenario out of Frankfurt (FRA). Keys match the flight codes in
// src/components/features/dashboard/data.ts. Flight number, route, distance,
// aircraft size class and passenger count (Cust_num) are real values from
// SIZED_FRA_DISC_DATA.csv; tails are deterministic demo identifiers (4Y-S/M/L-n).
// Fields marked "validation" are historical outcomes — NOT available pre-departure.

import type { FlightFixture } from "@/types/flightDetail";

export const fixtureFlights: Record<string, FlightFixture> = {

  // ── 1. RED · CASCADE · 4Y210 FRA → DJE ───────────────────────────────────────
  // Late inbound aircraft + tight turnaround = almost zero recovery buffer.
  "4Y210": {
    flightId: "4Y210-20260616",
    carrier: "Discover Airlines",
    flightNumber: "4Y210",
    tail: "4Y-M-1",
    origin: "FRA",
    destination: "DJE",
    date: "2026-06-16",
    dayOfWeek: "Tuesday",
    scheduledDep: "04:45",
    scheduledArr: "06:30",
    depHour: 4,
    distanceKm: 1806,

    risk: "RED",
    riskScore: 87,
    predictedDelayBand: "45–70 min at risk",
    causeCategory: "CASCADE",
    explanation:
      "The inbound aircraft (4Y-M-1, arriving overnight from Hurghada on 4Y207) landed 60 " +
      "minutes late after a late-evening ground hold at FRA. With only 48 minutes of " +
      "scheduled turnaround — 12 below the 60-minute safe threshold — there is almost " +
      "no physical buffer to absorb the delay. 4Y210 to Djerba is expected to depart " +
      "50–70 minutes late unless an aircraft swap is executed.",

    recommendedAction:
      "Execute aircraft swap to standby tail 4Y-M-4 at the FRA leisure pier. Standby " +
      "aircraft is fueled and available. Act before 04:20 to complete paperwork.",
    alternativeActions: [
      {
        label: "Accelerate ground handling",
        description:
          "Request two additional cleaning and catering crews to compress turnaround " +
          "from 48 to 36 minutes. Requires ground handling coordinator approval.",
        minutesRecovered: 12,
        tradeOff: "Still leaves a ~48-min delay; partial recovery only.",
        owner: "Ground Handling",
        deadline: "04:15",
      },
      {
        label: "Protect next rotation",
        description:
          "Accept the delay on 4Y210 but shield the aircraft's next leg (4Y211 DJE → FRA) " +
          "by holding a standby tail at FRA. Stops the cascade spreading into the afternoon.",
        minutesRecovered: 0,
        tradeOff: "4Y210 passengers absorb the full delay; the return leg is protected.",
        owner: "Network Control",
        deadline: "04:40",
      },
      {
        label: "Retime departure slot",
        description:
          "Negotiate a 05:30 departure slot with ATC to reduce runway queue risk during " +
          "the early-morning leisure bank.",
        minutesRecovered: 5,
        tradeOff: "Minimal gain; still delay-affected downstream.",
        owner: "Airport Coordination",
        deadline: "04:25",
      },
    ],
    owner: "Dispatcher",
    interventionWindow: "Best action before 04:20",
    confidenceLevel: "High",
    confidenceReason:
      "Inbound aircraft has already landed. Turnaround time is fixed by ground ops " +
      "physical constraints. No uncertainty in the delay source.",
    expectedImpact:
      "Without action: ~60-min departure delay, 175 passengers affected, " +
      "EU261 exposure up to €400/pax on this 1,500–3,500 km route. " +
      "With aircraft swap: delay reduced to ≤10 min.",
    eu261Exposure: "Maximum exposure: €400 × 175 pax = €70,000 if delay exceeds 3 h",

    causalSteps: [
      {
        step: "4Y207 (HRG → FRA) arrived 60 min late overnight.",
        detail:
          "A late-evening ground hold at Frankfurt pushed the inbound rotation back. " +
          "Aircraft 4Y-M-1 absorbed 60 min of delay before the morning turn even began.",
      },
      {
        step: "Scheduled turnaround for 4Y210 is 48 min.",
        detail:
          "Standard narrow-body leisure turnaround. Minimum physical process time " +
          "(deplaning + cleaning + catering + fueling + boarding) is approximately 45 min.",
        isBottleneck: true,
      },
      {
        step: "Late gate arrival forces doors-closed no earlier than 05:33.",
        detail:
          "With only 48 min of turnaround there is no buffer remaining. Any minor friction " +
          "(catering truck queue, fueling delay) pushes departure past 05:45.",
      },
      {
        step: "FRA early-morning leisure bank reduces slot flexibility.",
        detail:
          "Departure rate is near capacity in this bank. A later departure cannot be " +
          "recovered with a faster taxi or shorter block time. Delay propagates to DJE arrival.",
      },
      {
        step: "4Y210 is projected to depart 05:35–05:45, 50–60 min late.",
        detail:
          "The return leg 4Y211 (DJE → FRA) will absorb the same cascade unless a standby " +
          "tail is assigned at FRA.",
        isBottleneck: false,
      },
    ],

    riskDrivers: [
      {
        name: "Inbound aircraft delay",
        value: "+60 min",
        threshold: "Warning at +15 min",
        impact: "High",
        evidence: "4Y207 landed 60 min late overnight. Logged by ramp system.",
        breached: true,
      },
      {
        name: "Scheduled turnaround buffer",
        value: "48 min",
        threshold: "Safe threshold: 60 min",
        impact: "High",
        evidence:
          "48-min turn is below the minimum recovery buffer for the type at FRA. " +
          "Historical on-time rate for sub-50-min turns: 34%.",
        breached: true,
      },
      {
        name: "Departure bank congestion",
        value: "Early-morning leisure peak",
        threshold: "Caution above 85% slot utilisation",
        impact: "Medium",
        evidence: "FRA departure rate near capacity in this bank. Recovery rerouting not available.",
        breached: true,
      },
      {
        name: "Downstream leg at risk",
        value: "4Y211 DJE → FRA",
        threshold: "Cascade threshold: inbound delay > 30 min",
        impact: "Medium",
        evidence:
          "A 60-min late arrival at DJE propagates to the return leg unless a standby tail " +
          "is assigned at FRA.",
        breached: true,
      },
    ],

    turnaroundSteps: [
      { label: "Gate arrival", scheduledTime: "03:57", estimatedTime: "04:57", status: "bottleneck" },
      { label: "Deplaning complete", scheduledTime: "04:10", estimatedTime: "05:10", status: "at_risk" },
      { label: "Cabin cleaning", scheduledTime: "04:10", estimatedTime: "05:10", status: "bottleneck" },
      { label: "Catering loaded", scheduledTime: "04:22", estimatedTime: "05:27", status: "at_risk" },
      { label: "Fueling complete", scheduledTime: "04:20", estimatedTime: "05:25", status: "at_risk" },
      { label: "Boarding begins", scheduledTime: "04:25", estimatedTime: "05:27", status: "at_risk" },
      { label: "Doors closed", scheduledTime: "04:40", estimatedTime: "05:32", status: "at_risk" },
      { label: "Pushback", scheduledTime: "04:45", estimatedTime: "05:35", status: "at_risk" },
    ],
    turnaroundBottleneck:
      "Gate arrival 60 min late forces all subsequent steps to shift in lockstep. " +
      "Cabin cleaning cannot begin until the inbound passengers deplane. " +
      "This is the physical constraint that prevents any meaningful recovery.",

    inboundChain: [
      {
        flightCode: "4Y207",
        origin: "HRG",
        destination: "FRA",
        scheduledDep: "21:30",
        estimatedDep: "22:30",
        delayMin: 60,
        position: "previous",
      },
      {
        flightCode: "4Y210",
        origin: "FRA",
        destination: "DJE",
        scheduledDep: "04:45",
        estimatedDep: "05:35",
        delayMin: 50,
        position: "current",
      },
      {
        flightCode: "4Y211",
        origin: "DJE",
        destination: "FRA",
        scheduledDep: "07:30",
        estimatedDep: "08:20",
        delayMin: 50,
        position: "next",
      },
    ],

    weather: {
      location: "FRA",
      tempC: 14,
      windSpeedKmh: 16,
      windGustKmh: 26,
      precipMm: 0,
      snowfallCm: 0,
      cloudCoverPct: 40,
      weatherCode: 2,
      conditions: "Partly cloudy",
      operationalNote:
        "Weather is not a primary driver today. Light winds, dry. Ground operations are " +
        "unaffected by conditions. The delay is purely a cascade from the late inbound.",
    },

    auditTrail: [
      { time: "03:40", event: "Risk score calculated: 87 (RED). Primary cause: cascade from 4Y207." },
      { time: "03:45", event: "Alert sent to dispatcher on duty." },
      { time: "03:48", event: "Dispatcher opened Flight Deep Detail for 4Y210." },
      { time: "03:52", event: "Aircraft swap recommendation generated: standby 4Y-M-4." },
      { time: "04:00", event: "Action status: pending dispatcher decision." },
    ],

    validation: {
      actualDepDelayMin: 52,
      actualArrDelayMin: 47,
      delayCause: "Late aircraft (reactionary delay)",
      delayed15: true,
      cancelled: false,
    },
  },

  // ── 2. RED · WEATHER · 4Y206 FRA → HRG ────────────────────────────────────────
  // Summer convective weather + gusts at FRA. Flow restrictions and a long queue.
  "4Y206": {
    flightId: "4Y206-20260616",
    carrier: "Discover Airlines",
    flightNumber: "4Y206",
    tail: "4Y-M-2",
    origin: "FRA",
    destination: "HRG",
    date: "2026-06-16",
    dayOfWeek: "Tuesday",
    scheduledDep: "08:20",
    scheduledArr: "13:00",
    depHour: 8,
    distanceKm: 3324,

    risk: "RED",
    riskScore: 91,
    predictedDelayBand: "60–90 min at risk",
    causeCategory: "WEATHER",
    explanation:
      "A line of convective thunderstorms is crossing the Frankfurt area with gusts at " +
      "56 km/h. ATC has imposed a departure-rate restriction and the runway queue has " +
      "grown to 45 minutes. Combined with reduced spacing during the cells, an on-time " +
      "departure for the Hurghada service is very unlikely.",

    recommendedAction:
      "Coordinate with FRA airport ops and ATC for a controlled departure time (CDT) " +
      "before the next storm cell. Pre-brief crew on the weather hold and re-clearance " +
      "procedure. If the queue exceeds 60 min, activate passenger care at the gate.",
    alternativeActions: [
      {
        label: "Request controlled departure time (CDT)",
        description:
          "Negotiate a specific ATC departure slot to minimise time holding short with " +
          "engines running. Reduces fuel burn and crew stress during the wait.",
        minutesRecovered: 15,
        tradeOff: "Does not reduce total delay; optimises the wait.",
        owner: "Airport Coordination",
        deadline: "08:40",
      },
      {
        label: "Monitor for a gap between cells",
        description:
          "Convective cells are moving through every 30–40 min. If a gap opens before " +
          "09:30, the departure rate recovers and the delay reduces.",
        minutesRecovered: 25,
        tradeOff: "Uncertain — dependent on the weather clearing.",
        owner: "Dispatcher",
        deadline: "09:00",
      },
      {
        label: "Coordinate with passengers at gate",
        description:
          "Brief gate agents on the expected 60–90 min delay. Pre-position catering " +
          "for a supplementary service and activate EU261 information notices.",
        minutesRecovered: 0,
        tradeOff: "Passenger service action only; does not reduce delay.",
        owner: "Ground Handling",
        deadline: "08:30",
      },
    ],
    owner: "Airport Coordination",
    interventionWindow: "Secure a CDT before 08:40",
    confidenceLevel: "High",
    confidenceReason:
      "Current METAR shows thunderstorms and 56 km/h gusts. ATC flow restriction is " +
      "confirmed and the queue is at 45 min. Forecast shows cells persisting until ~10:30.",
    expectedImpact:
      "Without action: 70–90 min departure delay. 175 passengers affected. " +
      "EU261 exposure for delays over 3 h on this 1,500–3,500 km route.",
    eu261Exposure: "Maximum exposure: €400 × 175 pax = €70,000 if delay exceeds 3 h",

    causalSteps: [
      {
        step: "Thunderstorms over the Frankfurt area since 07:30.",
        detail:
          "METAR 07:50Z: TS, gusts 56 km/h, CB to the west. ATC has reduced the departure " +
          "rate while cells transit the departure corridors.",
        isBottleneck: true,
      },
      {
        step: "Crosswind gusts 56 km/h — above the 35 km/h caution threshold.",
        detail:
          "Within aircraft limits but adds spacing on departure and can force re-sequencing " +
          "if a cell sits over the active runway.",
      },
      {
        step: "Departure queue at 08:20: 45-minute wait confirmed by ground ops.",
        detail:
          "Aircraft are holding short pending flow-rate clearance. Throughput is roughly " +
          "half the normal rate during the cells.",
        isBottleneck: true,
      },
      {
        step: "Runway departure rate reduced ~40% during convective activity.",
        detail:
          "ATC flow control has cut the rate while CBs transit. Slot availability for the " +
          "08:00–09:30 bank is constrained.",
      },
      {
        step: "Combined effect: departure no earlier than 09:25 under current conditions.",
        detail:
          "Queue (45 min) + reduced slot availability ≈ 65 min delay minimum. Crew duty " +
          "time remains within limits.",
      },
    ],

    riskDrivers: [
      {
        name: "Convective weather",
        value: "Thunderstorms at FRA",
        threshold: "Flow restriction when CB over corridors",
        impact: "High",
        evidence: "METAR 07:50Z confirms active TS. ATC departure-rate restriction in force.",
        breached: true,
      },
      {
        name: "Wind gusts",
        value: "56 km/h",
        threshold: "Caution above 35 km/h",
        impact: "High",
        evidence: "Gusts above 35 km/h add departure spacing and re-sequencing risk.",
        breached: true,
      },
      {
        name: "Departure queue",
        value: "45 min wait",
        threshold: "Warning above 20 min",
        impact: "High",
        evidence: "Ground ops confirmed: aircraft holding short pending flow clearance.",
        breached: true,
      },
      {
        name: "Runway departure rate",
        value: "−40% capacity",
        threshold: "Alert below 30 deps/hr",
        impact: "Medium",
        evidence: "ATC flow control cut the rate while CBs transit. FRA ATIS confirms.",
        breached: true,
      },
    ],

    turnaroundSteps: [
      { label: "Gate arrival (inbound)", scheduledTime: "07:20", estimatedTime: "07:20", status: "ok" },
      { label: "Deplaning complete", scheduledTime: "07:35", estimatedTime: "07:35", status: "ok" },
      { label: "Cabin cleaning", scheduledTime: "07:35", estimatedTime: "07:35", status: "ok" },
      { label: "Fueling complete", scheduledTime: "07:50", estimatedTime: "07:50", status: "ok" },
      { label: "Catering loaded", scheduledTime: "07:55", estimatedTime: "07:55", status: "ok" },
      { label: "Boarding complete", scheduledTime: "08:10", estimatedTime: "08:10", status: "ok" },
      { label: "Doors closed", scheduledTime: "08:15", estimatedTime: "08:15", status: "ok" },
      { label: "Pushback (ATC flow hold)", scheduledTime: "08:20", estimatedTime: "09:25", status: "bottleneck" },
    ],
    turnaroundBottleneck:
      "Ground turnaround is clean and on schedule. The aircraft is ready to depart but " +
      "cannot push until ATC releases it from the weather-driven flow hold.",

    inboundChain: [
      {
        flightCode: "4Y205",
        origin: "HRG",
        destination: "FRA",
        scheduledDep: "01:30",
        estimatedDep: "01:30",
        delayMin: 0,
        position: "previous",
      },
      {
        flightCode: "4Y206",
        origin: "FRA",
        destination: "HRG",
        scheduledDep: "08:20",
        estimatedDep: "09:25",
        delayMin: 65,
        position: "current",
      },
      {
        flightCode: "4Y207",
        origin: "HRG",
        destination: "FRA",
        scheduledDep: "14:30",
        estimatedDep: "15:35",
        delayMin: 65,
        position: "next",
      },
    ],

    weather: {
      location: "FRA",
      tempC: 19,
      windSpeedKmh: 38,
      windGustKmh: 56,
      precipMm: 8.4,
      snowfallCm: 0,
      cloudCoverPct: 90,
      weatherCode: 95,
      conditions: "Thunderstorm",
      operationalNote:
        "Convective weather is the primary driver. ATC has restricted the departure rate " +
        "while cells transit the corridors. Gusts above 35 km/h add departure spacing. " +
        "Crews should expect a minimum 60-min delay. Hurghada destination is clear and hot.",
    },

    auditTrail: [
      { time: "07:30", event: "METAR updated: thunderstorms, gusts 52 km/h. ATC flow restriction at FRA." },
      { time: "07:45", event: "Risk score calculated: 91 (RED). Primary cause: convective weather." },
      { time: "07:48", event: "Alert sent to dispatcher and airport coordination." },
      { time: "07:55", event: "Dispatcher opened Flight Deep Detail for 4Y206." },
      { time: "08:00", event: "CDT request initiated with ATC." },
      { time: "08:05", event: "Action status: pending — departure slot not yet confirmed." },
    ],

    validation: {
      actualDepDelayMin: 72,
      actualArrDelayMin: 66,
      delayCause: "Weather (ATC flow control)",
      delayed15: true,
      cancelled: false,
    },
  },

  // ── 3. AMBER · CONGESTION · 4Y530 FRA → IBZ ───────────────────────────────────
  // ATC ground stop + peak departure bank. Recoverable with slot strategy.
  "4Y530": {
    flightId: "4Y530-20260616",
    carrier: "Discover Airlines",
    flightNumber: "4Y530",
    tail: "4Y-S-1",
    origin: "FRA",
    destination: "IBZ",
    date: "2026-06-16",
    dayOfWeek: "Tuesday",
    scheduledDep: "09:30",
    scheduledArr: "11:45",
    depHour: 9,
    distanceKm: 1365,

    risk: "AMBER",
    riskScore: 48,
    predictedDelayBand: "15–35 min at risk",
    causeCategory: "CONGESTION",
    explanation:
      "A 20-minute ATC ground stop was issued at FRA at 08:35 due to departure-rate " +
      "restrictions during the morning leisure bank. The ground stop has since been lifted, " +
      "but a queue of 14 aircraft has built up. 4Y530 to Ibiza is estimated 22 minutes " +
      "behind schedule. Aircraft, crew and passengers are ready — this is a pure ATC/slot issue.",

    recommendedAction:
      "Coordinate with ATC to optimise the slot position for 4Y530. Request priority " +
      "sequencing as a short-haul leisure departure. Monitor the queue; if the delay grows " +
      "past 30 min, brief gate agents on the revised arrival time at Ibiza.",
    alternativeActions: [
      {
        label: "Hold for a better slot",
        description:
          "Accept the current queue position rather than burning fuel holding short. " +
          "The morning bank clears by 10:00, after which the rate recovers.",
        minutesRecovered: 0,
        tradeOff: "No recovery, but avoids unnecessary fuel burn and crew fatigue.",
        owner: "Dispatcher",
        deadline: "09:20",
      },
      {
        label: "Request reduced taxi sequence",
        description:
          "Ask ground control for a direct taxi route to cut taxi-out time from 18 to " +
          "12 min. Partially offsets the ATC delay.",
        minutesRecovered: 6,
        tradeOff: "Minor gain only. Requires ground control approval.",
        owner: "Airport Coordination",
        deadline: "09:10",
      },
    ],
    owner: "Dispatcher",
    interventionWindow: "Slot decision before 09:20",
    confidenceLevel: "Medium",
    confidenceReason:
      "Queue position has been confirmed by ATC. However, the ground stop could be " +
      "re-issued if traffic builds again. The estimate carries ±10 min uncertainty.",
    expectedImpact:
      "22-min delay expected. 85 passengers affected. No EU261 exposure below the 3-hour " +
      "threshold. Minor passenger service impact only.",
    eu261Exposure: "No EU261 exposure expected — delay under 3 h",

    causalSteps: [
      {
        step: "ATC issued a 20-min ground stop at FRA at 08:35.",
        detail:
          "FRA departure rate temporarily restricted due to an en-route traffic management " +
          "initiative on the southbound corridor. All departures held at the gate.",
      },
      {
        step: "Ground stop lifted at 08:55, but a queue of 14 aircraft has accumulated.",
        detail:
          "Departures resume at the normal rate, creating a ~22-min average delay for the " +
          "aircraft that were held.",
        isBottleneck: true,
      },
      {
        step: "4Y530 is 9th in the departure sequence. Estimated pushback 09:52.",
        detail:
          "8 aircraft ahead, average gap 2.5 min between departures. Estimated taxi-out " +
          "18 min, wheels-up around 10:10.",
      },
      {
        step: "No connection or downstream risk identified.",
        detail:
          "Ibiza is a point-to-point leisure leg with no tight connections at the far end. " +
          "The 22-min delay is contained to this flight.",
      },
    ],

    riskDrivers: [
      {
        name: "ATC ground stop impact",
        value: "22 min accumulated",
        threshold: "Alert above 15 min",
        impact: "Medium",
        evidence: "Ground stop confirmed by FRA clearance delivery. Queue position 9 of 14.",
        breached: true,
      },
      {
        name: "Departure bank congestion",
        value: "Morning leisure peak",
        threshold: "Alert above 85% slot utilisation",
        impact: "Medium",
        evidence: "Peak 08:00–10:00 bank. Recovery slot not available before 10:00.",
        breached: true,
      },
      {
        name: "Aircraft and crew",
        value: "Ready — no issue",
        threshold: "N/A",
        impact: "Low",
        evidence: "4Y-S-1 completed turnaround on time. Crew is duty-legal.",
        breached: false,
      },
    ],

    turnaroundSteps: [
      { label: "Gate arrival (inbound)", scheduledTime: "08:30", estimatedTime: "08:30", status: "ok" },
      { label: "Deplaning complete", scheduledTime: "08:43", estimatedTime: "08:43", status: "ok" },
      { label: "Cabin cleaning", scheduledTime: "08:43", estimatedTime: "08:43", status: "ok" },
      { label: "Fueling complete", scheduledTime: "08:55", estimatedTime: "08:55", status: "ok" },
      { label: "Catering loaded", scheduledTime: "09:00", estimatedTime: "09:00", status: "ok" },
      { label: "Boarding complete", scheduledTime: "09:20", estimatedTime: "09:20", status: "ok" },
      { label: "Doors closed", scheduledTime: "09:25", estimatedTime: "09:25", status: "ok" },
      { label: "Pushback (ATC hold)", scheduledTime: "09:30", estimatedTime: "09:52", status: "bottleneck" },
    ],
    turnaroundBottleneck:
      "Ground turnaround is complete and on schedule. The aircraft is ready to push. " +
      "The only constraint is ATC slot availability while the queue clears.",

    inboundChain: [
      {
        flightCode: "4Y531",
        origin: "IBZ",
        destination: "FRA",
        scheduledDep: "05:30",
        estimatedDep: "05:30",
        delayMin: 0,
        position: "previous",
      },
      {
        flightCode: "4Y530",
        origin: "FRA",
        destination: "IBZ",
        scheduledDep: "09:30",
        estimatedDep: "09:52",
        delayMin: 22,
        position: "current",
      },
      {
        flightCode: "4Y531",
        origin: "IBZ",
        destination: "FRA",
        scheduledDep: "12:30",
        estimatedDep: "12:52",
        delayMin: 22,
        position: "next",
      },
    ],

    weather: {
      location: "FRA",
      tempC: 17,
      windSpeedKmh: 15,
      windGustKmh: 22,
      precipMm: 0,
      snowfallCm: 0,
      cloudCoverPct: 30,
      weatherCode: 1,
      conditions: "Mainly clear",
      operationalNote:
        "Weather is not a factor for this flight. Conditions are within normal summer " +
        "operations at FRA. Ibiza destination clear and warm.",
    },

    auditTrail: [
      { time: "08:35", event: "ATC ground stop issued at FRA. Queue building." },
      { time: "08:45", event: "Risk score calculated: 48 (AMBER). Cause: ATC congestion." },
      { time: "08:55", event: "Ground stop lifted. 14-aircraft queue confirmed." },
      { time: "09:00", event: "Alert sent to dispatcher." },
      { time: "09:05", event: "Dispatcher opened Flight Deep Detail for 4Y530." },
    ],

    validation: {
      actualDepDelayMin: 25,
      actualArrDelayMin: 18,
      delayCause: "ATC flow control",
      delayed15: true,
      cancelled: false,
    },
  },

  // ── 4. AMBER · TIGHT TURNAROUND · 4Y802 FRA → BRI ────────────────────────────
  // Inbound 15 min late + 52-min turn. Recoverable if ground handling acts early.
  "4Y802": {
    flightId: "4Y802-20260616",
    carrier: "Discover Airlines",
    flightNumber: "4Y802",
    tail: "4Y-S-2",
    origin: "FRA",
    destination: "BRI",
    date: "2026-06-16",
    dayOfWeek: "Tuesday",
    scheduledDep: "07:55",
    scheduledArr: "09:55",
    depHour: 7,
    distanceKm: 1176,

    risk: "AMBER",
    riskScore: 51,
    predictedDelayBand: "15–35 min at risk",
    causeCategory: "TIGHT_TURNAROUND",
    explanation:
      "The inbound aircraft (4Y-S-2) is arriving 15 minutes late from Palma. The scheduled " +
      "turnaround is 52 minutes — 8 below the safe threshold. Under normal conditions this " +
      "would be manageable, but with the 15-min late arrival the buffer shrinks to zero. " +
      "If ground handling begins preparations before gate arrival (pre-staged catering, " +
      "cleaning crew ready), the delay on the Bari service can be held to 10–15 min. " +
      "Without early action, expect 25–35 min departure delay.",

    recommendedAction:
      "Pre-stage ground handling at the gate before the inbound arrival. Request the " +
      "cleaning crew and catering truck to be ready by 07:25. This compresses the effective " +
      "turnaround to ~38 min and absorbs the 15-min late arrival.",
    alternativeActions: [
      {
        label: "Accept delay and brief Bari",
        description:
          "If pre-staging is not possible, accept a 25-min delay and notify Bari ground " +
          "handling of the revised arrival time. No tight connections at the far end.",
        minutesRecovered: 0,
        tradeOff: "25-min delay absorbed. Passengers arrive on an acceptable schedule.",
        owner: "Dispatcher",
        deadline: "07:30",
      },
      {
        label: "Reduce taxi buffer",
        description:
          "Request a gate-hold preference from ground control to cut taxi-out from 20 to " +
          "12 min. Partially offsets the turnaround compression.",
        minutesRecovered: 8,
        tradeOff: "Minor, requires ground control coordination.",
        owner: "Airport Coordination",
        deadline: "07:40",
      },
    ],
    owner: "Ground Handling",
    interventionWindow: "Pre-stage crews by 07:25 to absorb the late arrival",
    confidenceLevel: "Medium",
    confidenceReason:
      "The inbound 4Y801 (PMI → FRA) is currently showing a 15-min delay, confirmed by the " +
      "last position report. The delay is stable and not growing. With pre-staging, an " +
      "on-time departure is achievable.",
    expectedImpact:
      "With pre-staging: 10–15 min delay. Without action: 25–35 min delay. " +
      "No EU261 exposure. No significant downstream cascade.",
    eu261Exposure: "No EU261 exposure expected — delay well under 3 h",

    causalSteps: [
      {
        step: "4Y801 (PMI → FRA, tail 4Y-S-2) is arriving 15 min late.",
        detail:
          "The delay out of Palma was a morning slot restriction. It has been stable at " +
          "15 min for the last 90 min.",
      },
      {
        step: "Scheduled turnaround for 4Y802 at FRA is 52 min.",
        detail:
          "Standard narrow-body turnaround. 52 min is below the 60-min recovery threshold, " +
          "leaving 8 min of buffer under normal conditions.",
        isBottleneck: true,
      },
      {
        step: "With a 15-min late arrival, the effective turnaround buffer is eliminated.",
        detail:
          "Inbound gate arrival 07:18 (sched 07:03). Adding 52 min turnaround = earliest " +
          "departure 08:10. Scheduled departure is 07:55. Delay = 15–24 min.",
      },
      {
        step: "Pre-staging ground handling can recover up to 14 min.",
        detail:
          "Cleaning crew and catering pre-positioned at the gate let deplaning, cleaning and " +
          "catering overlap. Effective turnaround drops from 52 to 38 min.",
      },
    ],

    riskDrivers: [
      {
        name: "Inbound delay",
        value: "+15 min (gate arr 07:18)",
        threshold: "Warning at +15 min",
        impact: "Medium",
        evidence: "4Y801 PMI→FRA last position report: +15 min. Stable.",
        breached: true,
      },
      {
        name: "Turnaround buffer",
        value: "52 min (0 min after late arrival)",
        threshold: "Safe threshold: 60 min",
        impact: "Medium",
        evidence:
          "A 52-min scheduled turn becomes a 37-min effective turn with a 15-min late " +
          "arrival. Historical on-time rate for 37-min turns at FRA: 51%.",
        breached: true,
      },
      {
        name: "Pre-staging opportunity",
        value: "Available — 40 min lead time",
        threshold: "Intervention needed if lead time > 30 min",
        impact: "Medium",
        evidence:
          "40 min until inbound arrival. Ground handling pre-staging is feasible — the key " +
          "recovery lever.",
        breached: false,
      },
    ],

    turnaroundSteps: [
      { label: "Gate arrival (inbound)", scheduledTime: "07:03", estimatedTime: "07:18", status: "at_risk" },
      { label: "Cleaning crew staged", scheduledTime: "07:03", estimatedTime: "07:03", status: "ok" },
      { label: "Deplaning complete", scheduledTime: "07:16", estimatedTime: "07:31", status: "at_risk" },
      { label: "Cabin cleaning", scheduledTime: "07:16", estimatedTime: "07:21", status: "ok" },
      { label: "Catering pre-staged", scheduledTime: "07:11", estimatedTime: "07:11", status: "ok" },
      { label: "Catering loaded", scheduledTime: "07:26", estimatedTime: "07:36", status: "at_risk" },
      { label: "Fueling complete", scheduledTime: "07:26", estimatedTime: "07:36", status: "ok" },
      { label: "Boarding complete", scheduledTime: "07:47", estimatedTime: "08:00", status: "at_risk" },
      { label: "Pushback", scheduledTime: "07:55", estimatedTime: "08:08", status: "bottleneck" },
    ],
    turnaroundBottleneck:
      "The bottleneck is the late gate arrival combined with the compressed turnaround. " +
      "Pre-staging cleaning and catering is the only lever available to the ground team. " +
      "If pre-staging happens, the ~24-min delay compresses to about 13 min.",

    inboundChain: [
      {
        flightCode: "4Y801",
        origin: "PMI",
        destination: "FRA",
        scheduledDep: "05:15",
        estimatedDep: "05:30",
        delayMin: 15,
        position: "previous",
      },
      {
        flightCode: "4Y802",
        origin: "FRA",
        destination: "BRI",
        scheduledDep: "07:55",
        estimatedDep: "08:08",
        delayMin: 13,
        position: "current",
      },
      {
        flightCode: "4Y803",
        origin: "BRI",
        destination: "FRA",
        scheduledDep: "10:40",
        estimatedDep: "10:53",
        delayMin: 13,
        position: "next",
      },
    ],

    weather: {
      location: "FRA",
      tempC: 16,
      windSpeedKmh: 20,
      windGustKmh: 30,
      precipMm: 0.2,
      snowfallCm: 0,
      cloudCoverPct: 60,
      weatherCode: 51,
      conditions: "Light drizzle",
      operationalNote:
        "Light drizzle and 30 km/h gusts are marginal but below operational thresholds. " +
        "Weather is not a primary driver. Ground operations are normal. Bari destination " +
        "is warm and clear.",
    },

    auditTrail: [
      { time: "06:30", event: "Risk score calculated: 51 (AMBER). Cause: tight turnaround + late inbound." },
      { time: "06:40", event: "Alert sent to dispatcher and ground handling coordinator." },
      { time: "06:45", event: "Dispatcher opened Flight Deep Detail for 4Y802." },
      { time: "06:48", event: "Pre-staging recommendation sent to the gate ground crew." },
      { time: "06:55", event: "Action status: pending — ground handling confirmation awaited." },
    ],

    validation: {
      actualDepDelayMin: 16,
      actualArrDelayMin: 12,
      delayCause: "Late aircraft (reactionary delay)",
      delayed15: true,
      cancelled: false,
    },
  },

  // ── 5. GREEN · CARRIER (CONTROL) · 4Y10 FRA → CUN ────────────────────────────
  // Everything nominal. Shown to illustrate what a healthy long-haul looks like.
  "4Y10": {
    flightId: "4Y10-20260616",
    carrier: "Discover Airlines",
    flightNumber: "4Y10",
    tail: "4Y-L-1",
    origin: "FRA",
    destination: "CUN",
    date: "2026-06-16",
    dayOfWeek: "Tuesday",
    scheduledDep: "10:00",
    scheduledArr: "16:05",
    depHour: 10,
    distanceKm: 8605,

    risk: "GREEN",
    riskScore: 12,
    predictedDelayBand: "Under 10 min expected",
    causeCategory: "CASCADE",
    explanation:
      "4Y10 to Cancún is tracking clean across all risk dimensions. The inbound aircraft " +
      "arrived early, giving a comfortable long-haul turnaround. Weather at FRA is clear, " +
      "there are no ATC restrictions, and the crew is legal and ready. This flight is the " +
      "control case — included in the briefing to show what a healthy operation looks like.",

    recommendedAction: "No action required. Monitor the standard departure sequence.",
    alternativeActions: [],
    owner: "Dispatcher",
    interventionWindow: "No intervention needed",
    confidenceLevel: "High",
    confidenceReason:
      "All pre-flight checks are green. Aircraft is at the gate, fueled, and boarding. " +
      "No weather, ATC, crew or maintenance issues detected.",
    expectedImpact:
      "On-time departure expected. No passenger impact. Cancún destination clear.",
    eu261Exposure: "No exposure — flight on time",

    causalSteps: [
      {
        step: "The inbound aircraft (tail 4Y-L-1) arrived early overnight.",
        detail:
          "Favourable winds on the inbound long-haul sector. The aircraft was on stand well " +
          "ahead of the scheduled turnaround start.",
      },
      {
        step: "Long-haul turnaround is comfortably above the safe threshold.",
        detail:
          "Full wide-body turnaround with positive buffer. All ground steps are tracking " +
          "on or ahead of schedule.",
      },
      {
        step: "No ATC restrictions, no weather, crew fully legal.",
        detail:
          "FRA departures flowing normally. Crew reported in with full duty hours available. " +
          "No deferred maintenance items on the aircraft.",
      },
      {
        step: "4Y10 is expected to depart on time at 10:00.",
        detail: "All pre-departure checks nominal. No risk factors identified.",
      },
    ],

    riskDrivers: [
      {
        name: "Inbound delay",
        value: "Early arrival",
        threshold: "Warning at +15 min",
        impact: "Low",
        evidence: "Inbound aircraft on stand ahead of schedule.",
        breached: false,
      },
      {
        name: "Turnaround buffer",
        value: "Positive buffer",
        threshold: "Safe threshold: 60 min",
        impact: "Low",
        evidence: "All ground steps on track with margin to spare.",
        breached: false,
      },
      {
        name: "Weather",
        value: "Clear, light winds",
        threshold: "No thresholds exceeded",
        impact: "Low",
        evidence: "METAR FRA: few clouds, light winds. No restrictions.",
        breached: false,
      },
      {
        name: "Crew status",
        value: "Fully legal",
        threshold: "Alert below 3h remaining",
        impact: "Low",
        evidence: "Crew reported on time with full duty hours available.",
        breached: false,
      },
    ],

    turnaroundSteps: [
      { label: "Gate arrival (early)", scheduledTime: "07:30", estimatedTime: "07:20", status: "ok" },
      { label: "Deplaning complete", scheduledTime: "07:45", estimatedTime: "07:35", status: "ok" },
      { label: "Cabin cleaning", scheduledTime: "07:45", estimatedTime: "07:35", status: "ok" },
      { label: "Catering loaded", scheduledTime: "08:30", estimatedTime: "08:20", status: "ok" },
      { label: "Fueling complete", scheduledTime: "08:45", estimatedTime: "08:35", status: "ok" },
      { label: "Boarding begins", scheduledTime: "09:10", estimatedTime: "09:05", status: "ok" },
      { label: "Doors closed", scheduledTime: "09:50", estimatedTime: "09:48", status: "ok" },
      { label: "Pushback", scheduledTime: "10:00", estimatedTime: "09:58", status: "ok" },
    ],
    turnaroundBottleneck: "No bottleneck identified. All turnaround steps are on or ahead of schedule.",

    inboundChain: [
      {
        flightCode: "4Y11",
        origin: "CUN",
        destination: "FRA",
        scheduledDep: "18:30",
        estimatedDep: "18:30",
        delayMin: 0,
        position: "previous",
      },
      {
        flightCode: "4Y10",
        origin: "FRA",
        destination: "CUN",
        scheduledDep: "10:00",
        estimatedDep: "09:58",
        delayMin: 0,
        position: "current",
      },
      {
        flightCode: "4Y11",
        origin: "CUN",
        destination: "FRA",
        scheduledDep: "18:30",
        estimatedDep: "18:30",
        delayMin: 0,
        position: "next",
      },
    ],

    weather: {
      location: "FRA",
      tempC: 18,
      windSpeedKmh: 12,
      windGustKmh: 18,
      precipMm: 0,
      snowfallCm: 0,
      cloudCoverPct: 10,
      weatherCode: 0,
      conditions: "Clear sky",
      operationalNote:
        "Ideal operating conditions at FRA. Clear and dry, light winds. No restrictions. " +
        "Cancún destination is hot and clear — no arrival weather issues expected.",
    },

    auditTrail: [
      { time: "09:00", event: "Risk score calculated: 12 (GREEN). No risk factors flagged." },
      { time: "09:05", event: "Flight included in morning briefing as control reference." },
      { time: "09:08", event: "Dispatcher reviewed 4Y10 — no action taken." },
      { time: "09:58", event: "Pushback 2 min ahead of schedule." },
    ],

    validation: {
      actualDepDelayMin: 0,
      actualArrDelayMin: 0,
      delayCause: "None",
      delayed15: false,
      cancelled: false,
    },
  },
};
