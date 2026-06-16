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
  // Ranked dispatcher action set (assets/brackets-action-map.md). `label` is the action
  // the operator executes; `detail` is the one-line "why" shown in the decision dialog.
  actions: { label: string; detail: string }[];
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
    actions: [
      {
        label: "Monitor",
        detail: "On profile — keep it on the watchlist and let the model re-score it.",
      },
    ],
  },
  B1: {
    label: "Minor delay",
    range: "15–60 min",
    severity: 1,
    badge: "bg-yellow-400/20 text-yellow-700 dark:text-yellow-400",
    bar: "bg-yellow-400",
    dot: "bg-yellow-400",
    actions: [
      {
        label: "Notify gate crew to expedite turnaround",
        detail: "Get the ground team moving early to claw back minutes before they compound.",
      },
      {
        label: "Pre-position fuel, catering, and baggage",
        detail: "Stage services at the gate so the turnaround isn't waiting on suppliers.",
      },
      {
        label: "Check next leg for cascade risk",
        detail: "Confirm the aircraft's following rotation still has enough buffer to absorb this.",
      },
      {
        label: "Log in dispatcher feed",
        detail: "Record the call so the rest of the desk has the same picture.",
      },
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
      {
        label: "Extend turnaround buffer in schedule",
        detail: "Push the next departure out now so the delay doesn't cascade down the rotation.",
      },
      {
        label: "Alert standby crew (do not activate yet)",
        detail: "Put reserves on notice so they're ready if this slips into the next bracket.",
      },
      {
        label: "Notify connecting flight desks",
        detail: "Give downline stations a head start on at-risk passenger connections.",
      },
      {
        label: "Verify crew duty time remaining",
        detail: "Check the operating crew can still legally finish the rotation under this delay.",
      },
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
      {
        label: "Activate standby crew",
        detail: "Bring reserves on duty now so the next leg isn't lost to duty-time limits.",
      },
      {
        label: "Distribute meal vouchers (EU261 Article 9)",
        detail: "Meet the care obligation early and take pressure off the gate.",
      },
      {
        label: "Initiate aircraft swap evaluation",
        detail: "Start sizing a spare airframe before the delay forces the decision.",
      },
      {
        label: "Rebook at-risk connecting passengers",
        detail: "Move tight connections proactively while alternative seats still exist.",
      },
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
      {
        label: "Execute aircraft swap",
        detail: "Commit the spare airframe to save the rotation instead of riding the delay out.",
      },
      {
        label: "Process EU261 Article 7 compensation",
        detail: "Trigger the compensation workflow now to contain the EU261 exposure.",
      },
      {
        label: "Book passenger hotels immediately",
        detail: "Secure rooms before inventory tightens overnight and costs climb.",
      },
      {
        label: "Replace crew if duty limit approached",
        detail: "Swap in fresh crew so a duty breach doesn't turn the delay into a cancellation.",
      },
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
      {
        label: "Cancel the flight",
        detail: "Cut losses on an unrecoverable rotation and free the slot and crew.",
      },
      {
        label: "Rebook passengers onto alternate flights",
        detail: "Reaccommodate immediately while seats on partner and later services remain.",
      },
      {
        label: "Cover hotels, meals, transport",
        detail: "Discharge the EU261 care duty and keep stranded passengers looked after.",
      },
      {
        label: "Release crew and reposition aircraft",
        detail: "Reset crew and airframe so the cancellation doesn't damage tomorrow's plan.",
      },
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
