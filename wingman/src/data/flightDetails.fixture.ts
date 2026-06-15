// Rich fixture data for Flight Deep Detail.
// Each flight is hand-crafted to represent a realistic OCC scenario.
// Keys match the flight codes in src/components/features/dashboard/data.ts.
// Fields marked "validation" are historical outcomes — NOT available pre-departure.

import type { FlightFixture } from "@/types/flightDetail";

export const fixtureFlights: Record<string, FlightFixture> = {

  // ── 1. RED · CASCADE · AA 1450 ORD → LAX ─────────────────────────────────────
  // Late inbound aircraft + 48-min turnaround = almost zero recovery buffer.
  "AA 1450": {
    flightId: "AA1450-20240107",
    carrier: "American Airlines",
    flightNumber: "1450",
    tail: "N28478",
    origin: "ORD",
    destination: "LAX",
    date: "2024-01-07",
    dayOfWeek: "Sunday",
    scheduledDep: "07:05",
    scheduledArr: "09:40",
    depHour: 7,
    distanceKm: 2808,

    risk: "RED",
    riskScore: 87,
    predictedDelayBand: "45–70 min at risk",
    causeCategory: "CASCADE",
    explanation:
      "The inbound aircraft (N28478, arriving from PHX on AA 871) landed 60 minutes late " +
      "due to a ground stop at Phoenix earlier this morning. With only 48 minutes of " +
      "scheduled turnaround — 12 below the 60-minute safe threshold — there is almost " +
      "no physical buffer to absorb the delay. AA 1450 is expected to depart 50–70 " +
      "minutes late unless an aircraft swap is executed.",

    recommendedAction:
      "Execute aircraft swap to standby tail N34501 at Gate B14. Standby " +
      "aircraft is fueled and available. Act before 06:40 to complete paperwork.",
    alternativeActions: [
      {
        label: "Accelerate ground handling",
        description:
          "Request two additional cleaning and catering crews to compress turnaround " +
          "from 48 to 36 minutes. Requires ground handling coordinator approval.",
        minutesRecovered: 12,
        tradeOff: "Still leaves 48-min delay; partial recovery only.",
        owner: "Ground Handling",
        deadline: "06:30",
      },
      {
        label: "Protect next rotation",
        description:
          "Accept the delay on AA 1450 but shield LAX → JFK (AA 287, N28478 next leg) " +
          "by assigning a standby tail at LAX. Stops cascade at LAX.",
        minutesRecovered: 0,
        tradeOff: "AA 1450 passengers absorb full delay; LAX departure protected.",
        owner: "Network Control",
        deadline: "07:00",
      },
      {
        label: "Retime departure slot",
        description:
          "Negotiate a 08:00 departure slot with ATC. Reduces runway queue risk " +
          "during peak 07:00–08:00 bank.",
        minutesRecovered: 5,
        tradeOff: "Minimal gain; still delay-affected downstream.",
        owner: "Airport Coordination",
        deadline: "06:45",
      },
    ],
    owner: "Dispatcher",
    interventionWindow: "Best action before 06:40",
    confidenceLevel: "High",
    confidenceReason:
      "Inbound aircraft has already landed. Turnaround time is fixed by ground ops " +
      "physical constraints. No uncertainty in delay source.",
    expectedImpact:
      "Without action: 60-min departure delay, 178 passengers affected, " +
      "EU261 exposure up to €400/pax for 1,500–3,500 km route. " +
      "With aircraft swap: delay reduced to ≤10 min.",
    eu261Exposure: "Maximum exposure: €400 × 178 pax = €71,200 if delay exceeds 3 h",

    causalSteps: [
      {
        step: "AA 871 (PHX → ORD) arrived 60 min late.",
        detail:
          "Ground stop at Phoenix Sky Harbor at 03:30 due to low visibility. " +
          "Aircraft N28478 absorbed 60 min of delay before even departing PHX.",
      },
      {
        step: "Scheduled turnaround for AA 1450 is 48 min.",
        detail:
          "Gate B22, standard narrow-body turnaround. Minimum physical process time " +
          "(deplaning + cleaning + catering + fueling + boarding) is approximately 45 min.",
        isBottleneck: true,
      },
      {
        step: "Late gate arrival at 07:17 — 60 min after scheduled 06:17.",
        detail:
          "With only 48 min of turnaround, earliest possible doors-closed is 08:05. " +
          "No buffer remains. Any minor friction (catering truck queue, fueling delay) " +
          "pushes departure past 08:15.",
      },
      {
        step: "ORD 07:00–08:00 peak departure bank reduces slot flexibility.",
        detail:
          "ATC departure rate is at capacity. A later departure cannot be recovered " +
          "with a faster taxi or shorter block time. Delay propagates to LAX arrival.",
      },
      {
        step: "AA 1450 is projected to depart at 08:05–08:15, 60–70 min late.",
        detail:
          "Next rotation of N28478 at LAX (AA 287 → JFK, dep 11:30) will absorb " +
          "the same 60-min cascade unless a standby tail is assigned at LAX.",
        isBottleneck: false,
      },
    ],

    riskDrivers: [
      {
        name: "Inbound aircraft delay",
        value: "+60 min (gate arr 07:17)",
        threshold: "Warning at +15 min",
        impact: "High",
        evidence: "AA 871 landed 07:12, gate assigned 07:17. Logged by ramp system.",
        breached: true,
      },
      {
        name: "Scheduled turnaround buffer",
        value: "48 min",
        threshold: "Safe threshold: 60 min",
        impact: "High",
        evidence:
          "48-min turn is below minimum recovery buffer for B737 at ORD. " +
          "Historical on-time rate for sub-50-min turns: 34%.",
        breached: true,
      },
      {
        name: "Departure bank congestion",
        value: "Peak 07:00–08:00",
        threshold: "Caution above 85% slot utilisation",
        impact: "Medium",
        evidence:
          "ORD departure rate at 96% slot capacity in this bank. Recovery rerouting " +
          "not available.",
        breached: true,
      },
      {
        name: "Downstream leg at risk",
        value: "AA 287 LAX → JFK dep 11:30",
        threshold: "Cascade threshold: inbound delay > 30 min",
        impact: "Medium",
        evidence:
          "N28478 scheduled LAX turnaround is 55 min. A 60-min late arrival at LAX " +
          "propagates to AA 287 unless standby tail assigned.",
        breached: true,
      },
    ],

    turnaroundSteps: [
      { label: "Gate arrival", scheduledTime: "06:17", estimatedTime: "07:17", status: "bottleneck" },
      { label: "Deplaning complete", scheduledTime: "06:30", estimatedTime: "07:30", status: "at_risk" },
      { label: "Cabin cleaning", scheduledTime: "06:30", estimatedTime: "07:30", status: "bottleneck" },
      { label: "Catering loaded", scheduledTime: "06:42", estimatedTime: "07:47", status: "at_risk" },
      { label: "Fueling complete", scheduledTime: "06:40", estimatedTime: "07:45", status: "at_risk" },
      { label: "Boarding begins", scheduledTime: "06:45", estimatedTime: "07:47", status: "at_risk" },
      { label: "Doors closed", scheduledTime: "07:00", estimatedTime: "08:02", status: "at_risk" },
      { label: "Pushback", scheduledTime: "07:05", estimatedTime: "08:05", status: "at_risk" },
    ],
    turnaroundBottleneck:
      "Gate arrival 60 min late forces all subsequent steps to shift in lockstep. " +
      "Cabin cleaning cannot begin until the inbound passengers deplane. " +
      "This is the physical constraint that prevents any meaningful recovery.",

    inboundChain: [
      {
        flightCode: "AA 871",
        origin: "PHX",
        destination: "ORD",
        scheduledDep: "03:45",
        estimatedDep: "04:45",
        delayMin: 60,
        position: "previous",
      },
      {
        flightCode: "AA 1450",
        origin: "ORD",
        destination: "LAX",
        scheduledDep: "07:05",
        estimatedDep: "08:05",
        delayMin: 60,
        position: "current",
      },
      {
        flightCode: "AA 287",
        origin: "LAX",
        destination: "JFK",
        scheduledDep: "11:30",
        estimatedDep: "12:30",
        delayMin: 60,
        position: "next",
      },
    ],

    weather: {
      location: "ORD",
      tempC: -3,
      windSpeedKmh: 18,
      windGustKmh: 28,
      precipMm: 0,
      snowfallCm: 0,
      cloudCoverPct: 55,
      weatherCode: 3,
      conditions: "Partly cloudy",
      operationalNote:
        "Weather is not a primary driver today. Light winds below de-icing thresholds. " +
        "Ground operations are unaffected by conditions.",
    },

    auditTrail: [
      { time: "06:00", event: "Risk score calculated: 87 (RED). Primary cause: cascade from AA 871." },
      { time: "06:05", event: "Alert sent to dispatcher on duty (Thomas R.)." },
      { time: "06:08", event: "Dispatcher opened Flight Deep Detail for AA 1450." },
      { time: "06:12", event: "Aircraft swap recommendation generated: standby N34501 at B14." },
      { time: "06:20", event: "Action status: pending dispatcher decision." },
    ],

    validation: {
      actualDepDelayMin: 58,
      actualArrDelayMin: 51,
      delayCause: "Late aircraft (carrier delay, code B)",
      delayed15: true,
      cancelled: false,
    },
  },

  // ── 2. RED · WEATHER · AA 588 ORD → DFW ──────────────────────────────────────
  // Snow showers + gusts 56 km/h. De-icing mandatory. Runway reduced capacity.
  "AA 588": {
    flightId: "AA588-20240107",
    carrier: "American Airlines",
    flightNumber: "588",
    tail: "N174AA",
    origin: "ORD",
    destination: "DFW",
    date: "2024-01-07",
    dayOfWeek: "Sunday",
    scheduledDep: "07:50",
    scheduledArr: "10:10",
    depHour: 7,
    distanceKm: 1293,

    risk: "RED",
    riskScore: 91,
    predictedDelayBand: "60–90 min at risk",
    causeCategory: "WEATHER",
    explanation:
      "Active snow showers (4 cm/hr) and crosswind gusts at 56 km/h are creating severe " +
      "ground operations friction at ORD. De-icing is mandatory and the current queue is " +
      "45 minutes. Runway 10R has a 40% reduced departure rate due to braking action " +
      "advisories. Combined, these factors make an on-time departure very unlikely.",

    recommendedAction:
      "Contact ORD ground operations to secure a de-icing slot no later than 07:00. " +
      "Pre-brief crew on weather hold procedures. If de-icing queue exceeds 60 min, " +
      "coordinate with ATC for a controlled departure time (CDT).",
    alternativeActions: [
      {
        label: "Request controlled departure time (CDT)",
        description:
          "Negotiate a specific ATC departure slot to reduce time on the de-icing pad " +
          "with engines running. Minimises fuel burn and crew stress during hold.",
        minutesRecovered: 15,
        tradeOff: "Does not reduce total delay; optimises the wait.",
        owner: "Airport Coordination",
        deadline: "07:10",
      },
      {
        label: "Monitor for improved braking action",
        description:
          "Runway braking action advisories are updated every 30 min. If advisory " +
          "improves to GOOD before 08:00, departure rate recovers and delay reduces.",
        minutesRecovered: 25,
        tradeOff: "Uncertain — dependent on weather improvement.",
        owner: "Dispatcher",
        deadline: "07:30",
      },
      {
        label: "Coordinate with passengers at gate",
        description:
          "Brief gate agents on expected 60–90 min delay. Pre-position catering " +
          "crew for a supplementary service. Activate EU261 information notices.",
        minutesRecovered: 0,
        tradeOff: "Passenger service action only; does not reduce delay.",
        owner: "Ground Handling",
        deadline: "07:00",
      },
    ],
    owner: "Airport Coordination",
    interventionWindow: "Book de-icing slot before 07:00",
    confidenceLevel: "High",
    confidenceReason:
      "Current METAR shows active snow and 56 km/h gusts. De-icing mandatory per ops spec. " +
      "Queue is confirmed at 45 min. Weather forecast shows conditions persisting until 10:00.",
    expectedImpact:
      "Without action: 70–90 min departure delay. 154 passengers affected. " +
      "DFW connections at risk for 38 passengers. EU261 exposure for delays over 3 h.",
    eu261Exposure: "Maximum exposure: €250 × 154 pax = €38,500 if delay exceeds 3 h",

    causalSteps: [
      {
        step: "Active snow showers at ORD since 05:30 (4 cm/hr, 4 cm accumulation).",
        detail:
          "METAR 06:50Z: SN 4CM, VIS 1.2 SM, BKN008. De-icing mandatory for all " +
          "departures per ORD winter ops policy.",
        isBottleneck: true,
      },
      {
        step: "Crosswind gusts 56 km/h — exceeding 35 km/h caution threshold.",
        detail:
          "B737-800 crosswind limit is 65 km/h. Currently within limits but above " +
          "caution threshold. Adds de-icing time (fluid must be reapplied if hold " +
          "exceeds 15 min in gusting conditions).",
      },
      {
        step: "De-icing queue at 07:00: 45-minute wait confirmed by ground ops.",
        detail:
          "6 aircraft ahead of AA 588 in the de-icing queue. Two de-icing positions " +
          "active. Throughput: ~8 min per aircraft.",
        isBottleneck: true,
      },
      {
        step: "Runway 10R reduced departure rate: braking action FAIR (advisory).",
        detail:
          "ORD ops has issued braking action advisories. Runway 10R departure rate " +
          "reduced 40% (from 42 to 25 deps/hr). Slot availability constrained.",
      },
      {
        step: "Combined effect: departure no earlier than 08:50 under current conditions.",
        detail:
          "De-icing (45 min) + post-de-icing taxi (20 min) + reduced slot availability " +
          "= 65 min delay minimum. Crew duty time remains within limits.",
      },
    ],

    riskDrivers: [
      {
        name: "Snowfall rate",
        value: "4 cm/hr at ORD",
        threshold: "De-icing mandatory above 0.5 cm/hr",
        impact: "High",
        evidence: "METAR 06:50Z confirms active SN. De-icing trigger exceeded 8×.",
        breached: true,
      },
      {
        name: "Wind gusts",
        value: "56 km/h",
        threshold: "Caution above 35 km/h",
        impact: "High",
        evidence:
          "Gusts above 35 km/h reduce de-icing fluid hold-over time by ~40%. " +
          "Re-application required if hold exceeds 15 min.",
        breached: true,
      },
      {
        name: "De-icing queue",
        value: "45 min wait",
        threshold: "Warning above 20 min",
        impact: "High",
        evidence: "Ground ops confirmed: 6 aircraft ahead, 2 pads active.",
        breached: true,
      },
      {
        name: "Runway departure rate",
        value: "−40% capacity (25 deps/hr)",
        threshold: "Alert below 30 deps/hr",
        impact: "Medium",
        evidence: "Braking action FAIR on 10R. ORD ATIS confirms reduced rate.",
        breached: true,
      },
    ],

    turnaroundSteps: [
      { label: "Gate arrival (inbound)", scheduledTime: "06:50", estimatedTime: "06:50", status: "ok" },
      { label: "Deplaning complete", scheduledTime: "07:05", estimatedTime: "07:05", status: "ok" },
      { label: "Cabin cleaning", scheduledTime: "07:05", estimatedTime: "07:05", status: "ok" },
      { label: "Fueling complete", scheduledTime: "07:20", estimatedTime: "07:20", status: "ok" },
      { label: "Catering loaded", scheduledTime: "07:25", estimatedTime: "07:25", status: "ok" },
      { label: "Boarding complete", scheduledTime: "07:40", estimatedTime: "07:40", status: "ok" },
      { label: "De-icing (queue start)", scheduledTime: "07:45", estimatedTime: "07:45", status: "bottleneck" },
      { label: "De-icing complete", scheduledTime: "07:48", estimatedTime: "08:30", status: "bottleneck" },
      { label: "Pushback", scheduledTime: "07:50", estimatedTime: "08:50", status: "at_risk" },
    ],
    turnaroundBottleneck:
      "Ground turnaround itself is clean and on schedule. The entire delay originates in " +
      "the mandatory de-icing queue. Aircraft is ready to depart but cannot push back " +
      "until de-icing is complete.",

    inboundChain: [
      {
        flightCode: "AA 2201",
        origin: "DFW",
        destination: "ORD",
        scheduledDep: "04:30",
        estimatedDep: "04:30",
        delayMin: 0,
        position: "previous",
      },
      {
        flightCode: "AA 588",
        origin: "ORD",
        destination: "DFW",
        scheduledDep: "07:50",
        estimatedDep: "08:50",
        delayMin: 60,
        position: "current",
      },
      {
        flightCode: "AA 591",
        origin: "DFW",
        destination: "ORD",
        scheduledDep: "12:00",
        estimatedDep: "12:00",
        delayMin: 0,
        position: "next",
      },
    ],

    weather: {
      location: "ORD",
      tempC: -2,
      windSpeedKmh: 38,
      windGustKmh: 56,
      precipMm: 2.8,
      snowfallCm: 4.0,
      cloudCoverPct: 95,
      weatherCode: 73,
      conditions: "Moderate snow",
      operationalNote:
        "Conditions are at the severe end of winter ops. De-icing is mandatory. " +
        "Gusts above 35 km/h reduce fluid hold-over time significantly — " +
        "re-application needed if hold exceeds 15 min. Runway braking FAIR. " +
        "Crews should expect minimum 60-min delay. DFW destination is clear (18°C).",
    },

    auditTrail: [
      { time: "05:30", event: "METAR updated: active snow, gusts 52 km/h. De-icing ops activated at ORD." },
      { time: "06:00", event: "Risk score calculated: 91 (RED). Primary cause: weather / de-icing." },
      { time: "06:02", event: "Alert sent to dispatcher and airport coordination." },
      { time: "06:10", event: "Dispatcher opened Flight Deep Detail for AA 588." },
      { time: "06:15", event: "De-icing slot request initiated with ground ops." },
      { time: "06:20", event: "Action status: pending — de-icing slot not yet confirmed." },
    ],

    validation: {
      actualDepDelayMin: 72,
      actualArrDelayMin: 68,
      delayCause: "Weather (NAS delay, code W)",
      delayed15: true,
      cancelled: false,
    },
  },

  // ── 3. AMBER · CONGESTION · UA 884 ORD → DEN ─────────────────────────────────
  // ATC ground stop + peak departure bank. Recoverable with slot strategy.
  "UA 884": {
    flightId: "UA884-20240107",
    carrier: "United Airlines",
    flightNumber: "884",
    tail: "N36476",
    origin: "ORD",
    destination: "DEN",
    date: "2024-01-07",
    dayOfWeek: "Sunday",
    scheduledDep: "06:40",
    scheduledArr: "08:30",
    depHour: 6,
    distanceKm: 1452,

    risk: "AMBER",
    riskScore: 48,
    predictedDelayBand: "15–35 min at risk",
    causeCategory: "CONGESTION",
    explanation:
      "A 20-minute ATC ground stop was issued at ORD at 05:45 due to departure rate " +
      "restrictions during the early-morning bank. The ground stop has since been lifted, " +
      "but a queue of 14 aircraft has built up. UA 884 is estimated 22 minutes behind " +
      "schedule. Aircraft, crew and passengers are ready — this is a pure ATC/slot issue.",

    recommendedAction:
      "Coordinate with ATC to optimise slot position for UA 884. " +
      "Request priority sequencing as a short-haul domestic with connection risk at DEN. " +
      "Monitor queue; if delay grows past 30 min, activate DEN connection protection.",
    alternativeActions: [
      {
        label: "Activate connection protection at DEN",
        description:
          "Pre-alert DEN gate agents and connecting flight dispatchers. " +
          "UA 884 feeds 12 connections at DEN. Holding UA 1145 (DEN → SFO) 15 min " +
          "protects 8 of those passengers.",
        minutesRecovered: 0,
        tradeOff: "Delays UA 1145 SFO departure by 15 min. Network trade-off.",
        owner: "Network Control",
        deadline: "06:30",
      },
      {
        label: "Request reduced taxi sequence",
        description:
          "Ask ground control for a direct taxi route to reduce taxi-out time " +
          "from 18 min to 12 min. Partially offsets ATC delay.",
        minutesRecovered: 6,
        tradeOff: "Minor gain only. Requires ground control approval.",
        owner: "Airport Coordination",
        deadline: "06:20",
      },
    ],
    owner: "Dispatcher",
    interventionWindow: "Connection protection decision before 06:30",
    confidenceLevel: "Medium",
    confidenceReason:
      "Queue position has been confirmed by ATC. However, ground stop could be re-issued " +
      "if traffic builds again. Estimate carries ±10 min uncertainty.",
    expectedImpact:
      "22-min delay expected. 12 connecting passengers at risk at DEN. " +
      "No EU261 exposure below 3-hour threshold. Minor passenger service impact.",
    eu261Exposure: "No EU261 exposure expected — delay under 3 h",

    causalSteps: [
      {
        step: "ATC issued a 20-min ground stop at ORD at 05:45.",
        detail:
          "ORD departure rate temporarily restricted due to en-route traffic management " +
          "initiative (TMI) over the ORD–DEN corridor. All departures held at gate.",
      },
      {
        step: "Ground stop lifted at 06:05, but queue of 14 aircraft has accumulated.",
        detail:
          "14 aircraft were held during the ground stop. Departure sequence resumes at " +
          "normal rate, creating a 22-min average delay for queued aircraft.",
        isBottleneck: true,
      },
      {
        step: "UA 884 is 9th in departure sequence. Estimated pushback 07:02.",
        detail:
          "8 aircraft ahead, average gap 2.5 min between departures. " +
          "Estimated taxi-out time: 18 min. Wheels-up around 07:20.",
      },
      {
        step: "12 connecting passengers at DEN with minimum connect time of 35 min.",
        detail:
          "UA 884 scheduled arrival DEN 08:30. Earliest connection UA 1145 dep 08:55. " +
          "With 22-min delay, arrival 08:52 — 3-min connect margin. Extremely tight.",
      },
    ],

    riskDrivers: [
      {
        name: "ATC ground stop impact",
        value: "22 min delay accumulated",
        threshold: "Alert above 15 min",
        impact: "Medium",
        evidence: "Ground stop confirmed by ORD clearance delivery. Queue position 9 of 14.",
        breached: true,
      },
      {
        name: "Departure bank congestion",
        value: "96% slot utilisation",
        threshold: "Alert above 85%",
        impact: "Medium",
        evidence: "Peak 06:00–07:30 bank. Recovery slot not available before 07:00.",
        breached: true,
      },
      {
        name: "DEN connection risk",
        value: "12 pax, 3-min margin",
        threshold: "Minimum connect time: 35 min",
        impact: "Medium",
        evidence:
          "With 22-min delay, arrival DEN 08:52 vs UA 1145 departure 08:55. " +
          "Connect margin collapses below minimum.",
        breached: true,
      },
      {
        name: "Aircraft and crew",
        value: "Ready — no issue",
        threshold: "N/A",
        impact: "Low",
        evidence:
          "N36476 completed turnaround on time. Crew is duty-legal. " +
          "No aircraft or crew issue contributing to delay.",
        breached: false,
      },
    ],

    turnaroundSteps: [
      { label: "Gate arrival (inbound)", scheduledTime: "05:45", estimatedTime: "05:45", status: "ok" },
      { label: "Deplaning complete", scheduledTime: "05:58", estimatedTime: "05:58", status: "ok" },
      { label: "Cabin cleaning", scheduledTime: "05:58", estimatedTime: "05:58", status: "ok" },
      { label: "Fueling complete", scheduledTime: "06:10", estimatedTime: "06:10", status: "ok" },
      { label: "Catering loaded", scheduledTime: "06:15", estimatedTime: "06:15", status: "ok" },
      { label: "Boarding complete", scheduledTime: "06:30", estimatedTime: "06:30", status: "ok" },
      { label: "Doors closed", scheduledTime: "06:35", estimatedTime: "06:35", status: "ok" },
      { label: "Pushback (ATC hold)", scheduledTime: "06:40", estimatedTime: "07:02", status: "bottleneck" },
    ],
    turnaroundBottleneck:
      "Ground turnaround is complete and on schedule. Aircraft is ready to push. " +
      "The only constraint is ATC slot availability. Pushback is blocked until queue clears.",

    inboundChain: [
      {
        flightCode: "UA 401",
        origin: "DEN",
        destination: "ORD",
        scheduledDep: "02:30",
        estimatedDep: "02:30",
        delayMin: 0,
        position: "previous",
      },
      {
        flightCode: "UA 884",
        origin: "ORD",
        destination: "DEN",
        scheduledDep: "06:40",
        estimatedDep: "07:02",
        delayMin: 22,
        position: "current",
      },
      {
        flightCode: "UA 885",
        origin: "DEN",
        destination: "ORD",
        scheduledDep: "10:15",
        estimatedDep: "10:37",
        delayMin: 22,
        position: "next",
      },
    ],

    weather: {
      location: "ORD",
      tempC: -4,
      windSpeedKmh: 15,
      windGustKmh: 22,
      precipMm: 0,
      snowfallCm: 0,
      cloudCoverPct: 40,
      weatherCode: 2,
      conditions: "Partly cloudy",
      operationalNote:
        "Weather is not a factor for this flight. Conditions are within normal " +
        "winter operations at ORD. No de-icing required. DEN destination clear and cold (−5°C).",
    },

    auditTrail: [
      { time: "05:45", event: "ATC ground stop issued at ORD. Queue building." },
      { time: "06:00", event: "Risk score calculated: 48 (AMBER). Cause: ATC congestion." },
      { time: "06:05", event: "Ground stop lifted. 14-aircraft queue confirmed." },
      { time: "06:10", event: "Alert sent to dispatcher." },
      { time: "06:15", event: "Dispatcher opened Flight Deep Detail for UA 884." },
      { time: "06:20", event: "Connection protection review initiated for DEN." },
    ],

    validation: {
      actualDepDelayMin: 25,
      actualArrDelayMin: 18,
      delayCause: "NAS delay — ATC flow control (code N)",
      delayed15: true,
      cancelled: false,
    },
  },

  // ── 4. AMBER · TIGHT TURNAROUND · AA 2230 ORD → BOS ──────────────────────────
  // Inbound 15 min late + 52-min turn. Recoverable if ground handling acts early.
  "AA 2230": {
    flightId: "AA2230-20240107",
    carrier: "American Airlines",
    flightNumber: "2230",
    tail: "N339AA",
    origin: "ORD",
    destination: "BOS",
    date: "2024-01-07",
    dayOfWeek: "Sunday",
    scheduledDep: "08:15",
    scheduledArr: "11:40",
    depHour: 8,
    distanceKm: 1373,

    risk: "AMBER",
    riskScore: 51,
    predictedDelayBand: "15–35 min at risk",
    causeCategory: "TIGHT_TURNAROUND",
    explanation:
      "The inbound aircraft (N339AA) is arriving 15 minutes late from CLT. The scheduled " +
      "turnaround is 52 minutes — 8 below the safe threshold. Under normal conditions this " +
      "would be manageable, but with 15 min late arrival the buffer shrinks to zero. " +
      "If ground handling begins preparations before gate arrival (pre-staged catering, " +
      "cleaning crew ready), the delay can be held to 10–15 min. Without early action, " +
      "expect 25–35 min departure delay.",

    recommendedAction:
      "Pre-stage ground handling at Gate C18 before inbound arrival. " +
      "Request cleaning crew and catering truck to be ready at gate by 07:45. " +
      "This compresses effective turnaround to ~38 min and absorbs the 15-min late arrival.",
    alternativeActions: [
      {
        label: "Accept delay and protect BOS connections",
        description:
          "If pre-staging is not possible, accept a 25-min delay and notify " +
          "BOS gate agents. 6 connecting passengers at BOS with connections after 12:30 " +
          "are not at risk.",
        minutesRecovered: 0,
        tradeOff: "25-min delay absorbed. Passengers arrive on acceptable schedule.",
        owner: "Dispatcher",
        deadline: "07:50",
      },
      {
        label: "Reduce taxi buffer",
        description:
          "Request gate hold preference from ground control to reduce taxi-out " +
          "from 20 to 12 min. Partially offsets the turnaround compression.",
        minutesRecovered: 8,
        tradeOff: "Minor, requires ground control coordination.",
        owner: "Airport Coordination",
        deadline: "08:00",
      },
    ],
    owner: "Ground Handling",
    interventionWindow: "Pre-stage crews by 07:45 to absorb late arrival",
    confidenceLevel: "Medium",
    confidenceReason:
      "Inbound AA 1891 (CLT → ORD) is currently showing 15-min delay, confirmed by " +
      "last ACARS report. Delay is stable and not growing. If pre-staging happens, " +
      "on-time departure is achievable.",
    expectedImpact:
      "With pre-staging: 10–15 min delay. Without action: 25–35 min delay. " +
      "No EU261 exposure. No significant downstream cascade from N339AA.",
    eu261Exposure: "No EU261 exposure expected — delay well under 3 h",

    causalSteps: [
      {
        step: "AA 1891 (CLT → ORD, tail N339AA) is arriving 15 min late.",
        detail:
          "Delay from CLT was weather-related (thunderstorm ground stop at CLT at 05:00). " +
          "Delay has been stable at 15 min for the last 90 min.",
      },
      {
        step: "Scheduled turnaround for AA 2230 at ORD is 52 min.",
        detail:
          "Gate C18. Standard narrow-body turnaround. 52 min is below the 60-min " +
          "recovery threshold, leaving 8 min of buffer under normal conditions.",
        isBottleneck: true,
      },
      {
        step: "With 15-min late arrival, effective turnaround buffer is eliminated.",
        detail:
          "Inbound gate arrival: 07:47 (sched 07:32). Adding 52 min turnaround = " +
          "earliest departure 08:39. Scheduled departure is 08:15. Delay = 24 min.",
      },
      {
        step: "Pre-staging ground handling can recover up to 14 min.",
        detail:
          "Cleaning crew and catering pre-positioned at gate compresses sequential " +
          "steps (deplaning → cleaning → catering) into parallel operations. " +
          "Effective turnaround drops from 52 to 38 min.",
      },
    ],

    riskDrivers: [
      {
        name: "Inbound delay",
        value: "+15 min (gate arr 07:47)",
        threshold: "Warning at +15 min",
        impact: "Medium",
        evidence: "AA 1891 CLT→ORD ACARS last update: +15 min. Stable.",
        breached: true,
      },
      {
        name: "Turnaround buffer",
        value: "52 min (0 min buffer after late arrival)",
        threshold: "Safe threshold: 60 min",
        impact: "Medium",
        evidence:
          "52-min scheduled turn becomes 37-min effective turn with 15-min late arrival. " +
          "Historical on-time rate for 37-min turns at ORD: 51%.",
        breached: true,
      },
      {
        name: "Pre-staging opportunity",
        value: "Available — 45 min lead time",
        threshold: "Intervention needed if lead time > 30 min",
        impact: "Medium",
        evidence:
          "45 min until inbound arrival. Ground handling pre-staging is feasible. " +
          "This is the key recovery lever.",
        breached: false,
      },
    ],

    turnaroundSteps: [
      { label: "Gate arrival (inbound)", scheduledTime: "07:32", estimatedTime: "07:47", status: "at_risk" },
      { label: "Cleaning crew staged", scheduledTime: "07:32", estimatedTime: "07:32", status: "ok" },
      { label: "Deplaning complete", scheduledTime: "07:45", estimatedTime: "08:00", status: "at_risk" },
      { label: "Cabin cleaning", scheduledTime: "07:45", estimatedTime: "07:50", status: "ok" },
      { label: "Catering pre-staged", scheduledTime: "07:40", estimatedTime: "07:40", status: "ok" },
      { label: "Catering loaded", scheduledTime: "07:55", estimatedTime: "08:05", status: "at_risk" },
      { label: "Fueling complete", scheduledTime: "07:55", estimatedTime: "08:05", status: "ok" },
      { label: "Boarding complete", scheduledTime: "08:07", estimatedTime: "08:20", status: "at_risk" },
      { label: "Pushback", scheduledTime: "08:15", estimatedTime: "08:28", status: "bottleneck" },
    ],
    turnaroundBottleneck:
      "The bottleneck is the late gate arrival combined with the compressed turnaround. " +
      "Pre-staging cleaning and catering is the only lever available to the ground team. " +
      "If pre-staging happens, the 24-min delay compresses to about 13 min.",

    inboundChain: [
      {
        flightCode: "AA 1891",
        origin: "CLT",
        destination: "ORD",
        scheduledDep: "05:45",
        estimatedDep: "06:00",
        delayMin: 15,
        position: "previous",
      },
      {
        flightCode: "AA 2230",
        origin: "ORD",
        destination: "BOS",
        scheduledDep: "08:15",
        estimatedDep: "08:39",
        delayMin: 24,
        position: "current",
      },
      {
        flightCode: "AA 2231",
        origin: "BOS",
        destination: "ORD",
        scheduledDep: "13:00",
        estimatedDep: "13:24",
        delayMin: 24,
        position: "next",
      },
    ],

    weather: {
      location: "ORD",
      tempC: -1,
      windSpeedKmh: 20,
      windGustKmh: 30,
      precipMm: 0.2,
      snowfallCm: 0,
      cloudCoverPct: 70,
      weatherCode: 51,
      conditions: "Light drizzle",
      operationalNote:
        "Light drizzle and 30 km/h gusts are marginal but below de-icing thresholds. " +
        "Weather is not a primary driver. Ground operations normal. " +
        "BOS destination: Cloudy, 3°C, winds 25 km/h — normal winter conditions.",
    },

    auditTrail: [
      { time: "06:00", event: "Risk score calculated: 51 (AMBER). Cause: tight turnaround + late inbound." },
      { time: "06:10", event: "Alert sent to dispatcher and ground handling coordinator." },
      { time: "06:15", event: "Dispatcher opened Flight Deep Detail for AA 2230." },
      { time: "06:18", event: "Pre-staging recommendation sent to Gate C18 ground crew." },
      { time: "06:25", event: "Action status: pending — ground handling confirmation awaited." },
    ],

    validation: {
      actualDepDelayMin: 18,
      actualArrDelayMin: 14,
      delayCause: "Late aircraft (carrier delay, code B)",
      delayed15: true,
      cancelled: false,
    },
  },

  // ── 5. GREEN · CARRIER (CONTROL) · AA 102 ORD → MIA ─────────────────────────
  // Everything nominal. Shown to illustrate what a healthy flight looks like.
  "AA 102": {
    flightId: "AA102-20240107",
    carrier: "American Airlines",
    flightNumber: "102",
    tail: "N801AW",
    origin: "ORD",
    destination: "MIA",
    date: "2024-01-07",
    dayOfWeek: "Sunday",
    scheduledDep: "06:15",
    scheduledArr: "10:40",
    depHour: 6,
    distanceKm: 1923,

    risk: "GREEN",
    riskScore: 12,
    predictedDelayBand: "Under 10 min expected",
    causeCategory: "CASCADE",
    explanation:
      "AA 102 is tracking clean across all risk dimensions. The inbound aircraft arrived " +
      "8 minutes early, giving 83 minutes of effective turnaround time. Weather at ORD is " +
      "clear. No ATC restrictions. Crew is legal and ready. This flight is the control " +
      "case — included in the briefing to show what a healthy operation looks like.",

    recommendedAction: "No action required. Monitor standard departure sequence.",
    alternativeActions: [],
    owner: "Dispatcher",
    interventionWindow: "No intervention needed",
    confidenceLevel: "High",
    confidenceReason:
      "All pre-flight checks are green. Aircraft is at gate, fueled, and boarding. " +
      "No weather, ATC, crew or maintenance issues detected.",
    expectedImpact:
      "On-time departure expected. No passenger impact. MIA destination clear.",
    eu261Exposure: "No exposure — flight on time",

    causalSteps: [
      {
        step: "AA 1201 (MIA → ORD, tail N801AW) arrived 8 minutes early.",
        detail:
          "Favourable winds on the MIA → ORD sector. Aircraft arrived at gate 05:07 " +
          "instead of scheduled 05:15.",
      },
      {
        step: "Turnaround of 68 min is well above the 60-min safe threshold.",
        detail:
          "Gate E5. Full standard turnaround. 68 min gives 8 min of positive buffer. " +
          "All ground steps are tracking on or ahead of schedule.",
      },
      {
        step: "No ATC restrictions, no weather, crew fully legal.",
        detail:
          "ORD departures flowing normally on 09R/27L. Crew reported in at 05:00 with " +
          "full duty hours available. No MEL items on N801AW.",
      },
      {
        step: "AA 102 is expected to depart on time at 06:15.",
        detail: "All pre-departure checks nominal. No risk factors identified.",
      },
    ],

    riskDrivers: [
      {
        name: "Inbound delay",
        value: "−8 min (early arrival)",
        threshold: "Warning at +15 min",
        impact: "Low",
        evidence: "N801AW arrived gate 05:07. Ahead of schedule.",
        breached: false,
      },
      {
        name: "Turnaround buffer",
        value: "68 min",
        threshold: "Safe threshold: 60 min",
        impact: "Low",
        evidence: "8 min of positive buffer. All ground steps on track.",
        breached: false,
      },
      {
        name: "Weather",
        value: "Clear, −3°C, 12 km/h winds",
        threshold: "No thresholds exceeded",
        impact: "Low",
        evidence: "METAR ORD 05:50Z: SKC, 12 km/h, −3°C. No restrictions.",
        breached: false,
      },
      {
        name: "Crew status",
        value: "Fully legal, 9h duty remaining",
        threshold: "Alert below 3h remaining",
        impact: "Low",
        evidence: "Crew reported 05:00. FAR 117 duty clock at 1h of 12h limit.",
        breached: false,
      },
    ],

    turnaroundSteps: [
      { label: "Gate arrival (early)", scheduledTime: "05:15", estimatedTime: "05:07", status: "ok" },
      { label: "Deplaning complete", scheduledTime: "05:28", estimatedTime: "05:20", status: "ok" },
      { label: "Cabin cleaning", scheduledTime: "05:28", estimatedTime: "05:20", status: "ok" },
      { label: "Catering loaded", scheduledTime: "05:40", estimatedTime: "05:32", status: "ok" },
      { label: "Fueling complete", scheduledTime: "05:45", estimatedTime: "05:37", status: "ok" },
      { label: "Boarding begins", scheduledTime: "05:50", estimatedTime: "05:42", status: "ok" },
      { label: "Doors closed", scheduledTime: "06:10", estimatedTime: "06:08", status: "ok" },
      { label: "Pushback", scheduledTime: "06:15", estimatedTime: "06:13", status: "ok" },
    ],
    turnaroundBottleneck: "No bottleneck identified. All turnaround steps are on or ahead of schedule.",

    inboundChain: [
      {
        flightCode: "AA 1201",
        origin: "MIA",
        destination: "ORD",
        scheduledDep: "02:00",
        estimatedDep: "02:00",
        delayMin: 0,
        position: "previous",
      },
      {
        flightCode: "AA 102",
        origin: "ORD",
        destination: "MIA",
        scheduledDep: "06:15",
        estimatedDep: "06:13",
        delayMin: 0,
        position: "current",
      },
      {
        flightCode: "AA 103",
        origin: "MIA",
        destination: "ORD",
        scheduledDep: "12:30",
        estimatedDep: "12:30",
        delayMin: 0,
        position: "next",
      },
    ],

    weather: {
      location: "ORD",
      tempC: -3,
      windSpeedKmh: 12,
      windGustKmh: 18,
      precipMm: 0,
      snowfallCm: 0,
      cloudCoverPct: 10,
      weatherCode: 0,
      conditions: "Clear sky",
      operationalNote:
        "Ideal winter ops conditions at ORD. Cold but dry, light winds. No de-icing required. " +
        "MIA destination is 24°C, clear — no arrival weather issues expected.",
    },

    auditTrail: [
      { time: "06:00", event: "Risk score calculated: 12 (GREEN). No risk factors flagged." },
      { time: "06:05", event: "Flight included in morning briefing as control reference." },
      { time: "06:08", event: "Dispatcher reviewed AA 102 — no action taken." },
      { time: "06:13", event: "Pushback 2 min ahead of schedule." },
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
