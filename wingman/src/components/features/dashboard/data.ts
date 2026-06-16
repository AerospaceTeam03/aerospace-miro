// Wingman dashboard — Discover Airlines (4Y) operation out of Frankfurt (FRA).
//
// The schedule comes from the real network CSV (src/data/schedule.generated.ts). The risk
// bracket/probability and the financial figures are derived from it — financials
// deterministically (finance.ts), bracket/probability via a transparent rule (risk.ts) that
// stands in for the FOREST Random Forest until its FRA output is wired.

import type { AircraftSize } from "@/data/schedule.generated";

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

// One operating flight: real schedule fields + derived risk + derived financials.
export type Flight = {
  // schedule (from the CSV)
  code: string; // "4Y 1340"
  flightNo: string; // "4Y1340"
  route: string; // "FRA-LPA"
  destination: string; // IATA
  destinationName: string;
  scheduled: string; // STD, FRA local
  arrival: string; // STA, local
  durationMin: number;
  distanceKm: number;
  size: AircraftSize; // S | M | L
  pax: number;
  aircraft: string; // representative type, e.g. "A330"
  // derived risk (risk.ts)
  bracket: Bracket;
  delayProbability: number; // 0–1
  predictedDelayMin: number;
  reasonType: ReasonType;
  reasonText: string; // the "why", quoting a real driver
  // derived financials (finance.ts)
  ecdn: number; // Expected Cost of Doing Nothing (€)
  avoidableLoss: number; // recoverable if the dispatcher acts in time (€)
  eu261Exposure: number; // EU261 compensation/care exposure (€)
};

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
