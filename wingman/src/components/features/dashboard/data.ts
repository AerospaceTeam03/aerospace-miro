// Wingman dashboard — Discover Airlines (4Y) operation out of Frankfurt (FRA).
//
// Curated demo day. The numbers mirror what the FOREST Random Forest + financial
// engine produce per flight (delay-severity bracket, the cost of doing nothing, and the
// share of that cost a timely intervention recovers). To be replaced with the live feed.

export type Bracket = "B0" | "B1" | "B2" | "B3" | "B4" | "B5";

export type ReasonType =
  | "CASCADE"
  | "WEATHER"
  | "CONGESTION"
  | "TIGHT_TURNAROUND"
  | "DEMAND"
  | "LOW_RISK";

export type BracketMeta = {
  label: string;
  range: string;
  severity: number; // 0 (on time) … 5 (cancellation zone) — used for ordering
  badge: string; // pill classes
  bar: string; // severity-bar fill classes
  dot: string; // small status dot classes
  actions: string[]; // dispatcher action set (assets/brackets-action-map.md)
};

// Single source of truth: colour, ordering, and the action set all derive from here.
export const brackets: Record<Bracket, BracketMeta> = {
  B0: {
    label: "On time",
    range: "0–15 min",
    severity: 0,
    badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
    actions: ["Monitor"],
  },
  B1: {
    label: "Minor delay",
    range: "15–60 min",
    severity: 1,
    badge: "bg-yellow-400/20 text-yellow-700 dark:text-yellow-400",
    bar: "bg-yellow-400",
    dot: "bg-yellow-400",
    actions: [
      "Notify gate crew to expedite turnaround",
      "Pre-position fuel, catering, and baggage",
      "Check next leg for cascade risk",
      "Log in dispatcher feed",
    ],
  },
  B2: {
    label: "Moderate delay",
    range: "60–120 min",
    severity: 2,
    badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    bar: "bg-amber-500",
    dot: "bg-amber-500",
    actions: [
      "Extend turnaround buffer in schedule",
      "Alert standby crew (do not activate yet)",
      "Notify connecting flight desks",
      "Verify crew duty time remaining",
    ],
  },
  B3: {
    label: "Major delay",
    range: "120–180 min",
    severity: 3,
    badge: "bg-red-500/15 text-red-600 dark:text-red-400",
    bar: "bg-red-500",
    dot: "bg-red-500",
    actions: [
      "Activate standby crew",
      "Distribute meal vouchers (EU261 Article 9)",
      "Initiate aircraft swap evaluation",
      "Rebook at-risk connecting passengers",
    ],
  },
  B4: {
    label: "Severe delay",
    range: "180–300 min",
    severity: 4,
    badge: "bg-rose-700/15 text-rose-700 dark:text-rose-400",
    bar: "bg-rose-700",
    dot: "bg-rose-700",
    actions: [
      "Execute aircraft swap",
      "Process EU261 Article 7 compensation",
      "Book passenger hotels immediately",
      "Replace crew if duty limit approached",
    ],
  },
  B5: {
    label: "Cancellation zone",
    range: "300+ min",
    severity: 5,
    badge: "bg-zinc-900/15 text-zinc-900 dark:bg-zinc-100/15 dark:text-zinc-100",
    bar: "bg-zinc-900 dark:bg-zinc-100",
    dot: "bg-zinc-900 dark:bg-zinc-100",
    actions: [
      "Cancel the flight",
      "Rebook passengers onto alternate flights",
      "Cover hotels, meals, transport",
      "Release crew and reposition aircraft",
    ],
  },
};

export const reasonCopy: Record<ReasonType, string> = {
  CASCADE: "Cascade",
  WEATHER: "Weather",
  CONGESTION: "Congestion",
  TIGHT_TURNAROUND: "Tight turnaround",
  DEMAND: "Demand",
  LOW_RISK: "Low risk",
};

export type Aircraft = "A320" | "A330" | "A350";

export type Flight = {
  code: string; // "4Y 1340"
  destination: string; // IATA
  destinationName: string;
  aircraft: Aircraft;
  scheduled: string; // STD, FRA local
  bracket: Bracket;
  delayProbability: number; // 0–1, model output
  predictedDelayMin: number;
  reasonType: ReasonType;
  reasonText: string; // desk-style note: the "why"
  ecdn: number; // Expected Cost of Doing Nothing (€)
  avoidableLoss: number; // recoverable if the dispatcher acts in time (€)
  eu261Exposure: number; // EU261 compensation/care exposure (€)
};

// Placeholder operation — to be replaced with real flight + weather feeds.
export const operationalDate = "FRA · Mon 7 Jan";

export const flights: Flight[] = [
  {
    code: "4Y 510",
    destination: "PUJ",
    destinationName: "Punta Cana",
    aircraft: "A350",
    scheduled: "09:55",
    bracket: "B4",
    delayProbability: 0.86,
    predictedDelayMin: 240,
    reasonType: "CASCADE",
    reasonText: "Inbound A350 from PUJ 215 min late; crew duty limit at risk",
    ecdn: 132000,
    avoidableLoss: 58000,
    eu261Exposure: 90000,
  },
  {
    code: "4Y 1520",
    destination: "HRG",
    destinationName: "Hurghada",
    aircraft: "A320",
    scheduled: "08:40",
    bracket: "B4",
    delayProbability: 0.84,
    predictedDelayMin: 205,
    reasonType: "CASCADE",
    reasonText: "Assigned aircraft AOG; no spare at FRA before 11:00",
    ecdn: 34000,
    avoidableLoss: 15500,
    eu261Exposure: 40000,
  },
  {
    code: "4Y 1818",
    destination: "PMI",
    destinationName: "Palma de Mallorca",
    aircraft: "A320",
    scheduled: "10:05",
    bracket: "B5",
    delayProbability: 0.94,
    predictedDelayMin: 320,
    reasonType: "CASCADE",
    reasonText: "Inbound A320 cancelled; next available aircraft 13:30",
    ecdn: 58000,
    avoidableLoss: 22000,
    eu261Exposure: 25000,
  },
  {
    code: "4Y 622",
    destination: "CUN",
    destinationName: "Cancún",
    aircraft: "A330",
    scheduled: "10:40",
    bracket: "B3",
    delayProbability: 0.74,
    predictedDelayMin: 150,
    reasonType: "CASCADE",
    reasonText: "Inbound A330 turnaround compressed to 38 min",
    ecdn: 71000,
    avoidableLoss: 29000,
    eu261Exposure: 24000,
  },
  {
    code: "4Y 1340",
    destination: "LPA",
    destinationName: "Gran Canaria",
    aircraft: "A320",
    scheduled: "07:05",
    bracket: "B3",
    delayProbability: 0.73,
    predictedDelayMin: 145,
    reasonType: "CASCADE",
    reasonText: "Inbound A320 from LPA 132 min late on previous leg",
    ecdn: 22500,
    avoidableLoss: 9800,
    eu261Exposure: 25000,
  },
  {
    code: "4Y 88",
    destination: "MLE",
    destinationName: "Malé",
    aircraft: "A330",
    scheduled: "12:20",
    bracket: "B2",
    delayProbability: 0.52,
    predictedDelayMin: 95,
    reasonType: "WEATHER",
    reasonText: "Convective weather en-route; ATC flow regulation likely",
    ecdn: 38000,
    avoidableLoss: 14000,
    eu261Exposure: 0,
  },
  {
    code: "4Y 1208",
    destination: "TFS",
    destinationName: "Tenerife South",
    aircraft: "A320",
    scheduled: "07:35",
    bracket: "B2",
    delayProbability: 0.56,
    predictedDelayMin: 90,
    reasonType: "WEATHER",
    reasonText: "Gusts 53 km/h forecast at FRA 07–09Z",
    ecdn: 9400,
    avoidableLoss: 3300,
    eu261Exposure: 0,
  },
  {
    code: "4Y 1102",
    destination: "PMI",
    destinationName: "Palma de Mallorca",
    aircraft: "A320",
    scheduled: "06:30",
    bracket: "B1",
    delayProbability: 0.31,
    predictedDelayMin: 35,
    reasonType: "CONGESTION",
    reasonText: "FRA departure slot pushed 25 min by morning ATC flow",
    ecdn: 4200,
    avoidableLoss: 1100,
    eu261Exposure: 0,
  },
  {
    code: "4Y 1466",
    destination: "HER",
    destinationName: "Heraklion",
    aircraft: "A320",
    scheduled: "08:15",
    bracket: "B1",
    delayProbability: 0.36,
    predictedDelayMin: 45,
    reasonType: "TIGHT_TURNAROUND",
    reasonText: "Turnaround 35 min, below 45 min minimum",
    ecdn: 5100,
    avoidableLoss: 1400,
    eu261Exposure: 0,
  },
  {
    code: "4Y 740",
    destination: "MRU",
    destinationName: "Mauritius",
    aircraft: "A350",
    scheduled: "21:10",
    bracket: "B1",
    delayProbability: 0.33,
    predictedDelayMin: 40,
    reasonType: "DEMAND",
    reasonText: "Late catering uplift expected on full long-haul load",
    ecdn: 19000,
    avoidableLoss: 5200,
    eu261Exposure: 0,
  },
  {
    code: "4Y 930",
    destination: "WDH",
    destinationName: "Windhoek",
    aircraft: "A330",
    scheduled: "19:50",
    bracket: "B1",
    delayProbability: 0.3,
    predictedDelayMin: 38,
    reasonType: "DEMAND",
    reasonText: "High load factor; extended boarding expected",
    ecdn: 16000,
    avoidableLoss: 4200,
    eu261Exposure: 0,
  },
  {
    code: "4Y 1604",
    destination: "FUE",
    destinationName: "Fuerteventura",
    aircraft: "A320",
    scheduled: "09:10",
    bracket: "B0",
    delayProbability: 0.08,
    predictedDelayMin: 5,
    reasonType: "LOW_RISK",
    reasonText: "On schedule, no risk drivers",
    ecdn: 0,
    avoidableLoss: 0,
    eu261Exposure: 0,
  },
  {
    code: "4Y 1712",
    destination: "RHO",
    destinationName: "Rhodes",
    aircraft: "A320",
    scheduled: "09:30",
    bracket: "B0",
    delayProbability: 0.11,
    predictedDelayMin: 8,
    reasonType: "LOW_RISK",
    reasonText: "On schedule, no risk drivers",
    ecdn: 0,
    avoidableLoss: 0,
    eu261Exposure: 0,
  },
];

// A flight is "actionable" once it leaves the on-time bracket (B0 is monitor-only).
export const isActionable = (f: Flight) => brackets[f.bracket].severity >= 1;

// Order the desk acts in: most severe bracket first, then earliest departure.
export function sortByBracketThenTime(list: Flight[]): Flight[] {
  return [...list].sort((a, b) => {
    const sev = brackets[b.bracket].severity - brackets[a.bracket].severity;
    if (sev !== 0) return sev;
    return a.scheduled.localeCompare(b.scheduled);
  });
}

const eurFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export const eur = (n: number) => eurFormatter.format(n);

export const sum = (list: Flight[], key: "ecdn" | "avoidableLoss" | "eu261Exposure") =>
  list.reduce((acc, f) => acc + f[key], 0);
