// Pre-departure financial estimator for OCC dispatchers.
//
// This module is the single source of truth for the Savings Estimator math.
// Every function is pure and transparent — no black box. The numbers come from
// public EU261 assumptions and route-size proxies, not an accounting system.

export type AircraftSize = "S" | "M" | "L";

export type DelayBracket = {
  id: "B0" | "B1" | "B2" | "B3" | "B4" | "B5";
  label: string;
  minMinutes: number;
  maxMinutes: number; // exclusive upper bound; Infinity for the last bracket
};

// Delay brackets — ordered, contiguous, covering 0..∞ minutes.
export const delayBrackets: DelayBracket[] = [
  { id: "B0", label: "On time / absorbed by buffer", minMinutes: 0, maxMinutes: 15 },
  { id: "B1", label: "Minor delay", minMinutes: 15, maxMinutes: 60 },
  { id: "B2", label: "Moderate delay / reactionary risk", minMinutes: 60, maxMinutes: 120 },
  { id: "B3", label: "Major delay / care obligation risk", minMinutes: 120, maxMinutes: 180 },
  { id: "B4", label: "Severe delay / EU261 compensation cliff", minMinutes: 180, maxMinutes: 300 },
  { id: "B5", label: "Cancellation zone", minMinutes: 300, maxMinutes: Infinity },
];

// Variable cost per minute, by aircraft size and cost tier. Tiers map to the
// B1–B4 cost bands; minutes inside B0 are free (absorbed by schedule buffer) and
// B5 minutes continue to accrue at the B4 rate.
const variableCostPerMin: Record<AircraftSize, { B1: number; B2: number; B3: number; B4: number }> = {
  S: { B1: 20, B2: 36, B3: 45, B4: 54 },
  M: { B1: 50, B2: 55, B3: 70, B4: 85 },
  L: { B1: 140, B2: 150, B3: 190, B4: 230 },
};

// EU261-style compensation per passenger, by size.
const eu261PerPax: Record<AircraftSize, number> = { S: 250, M: 400, L: 600 };

// Minutes at which the compensation obligation triggers.
const eu261ThresholdMin: Record<AircraftSize, number> = { S: 180, M: 180, L: 240 };

// Flat care / voucher obligation that kicks in from 120 min. L is not modelled
// from public data and is reported as such.
const careFrom120: Record<AircraftSize, number | null> = { S: 500, M: 750, L: null };

// Default passenger estimate when the source feed has no Cust_num.
const fallbackPax: Record<AircraftSize, number> = { S: 100, M: 150, L: 250 };

/** Classify aircraft size from distance, preferring an explicit CSV value. */
export function getAircraftSize(distanceKm: number, csvSize?: string | null): AircraftSize {
  const normalized = csvSize?.trim().toUpperCase();
  if (normalized === "S" || normalized === "M" || normalized === "L") return normalized;
  if (distanceKm < 1500) return "S";
  if (distanceKm <= 5000) return "M";
  return "L";
}

/** Passenger estimate: prefer the feed's Cust_num, otherwise a size fallback. */
export function getPassengers(size: AircraftSize, custNum?: number | null): number {
  return custNum && custNum > 0 ? custNum : fallbackPax[size];
}

/** Return the delay bracket a given minute count falls into. */
export function getDelayBracket(minutes: number): DelayBracket {
  const m = Math.max(0, minutes);
  return (
    delayBrackets.find((b) => m >= b.minMinutes && m < b.maxMinutes) ??
    delayBrackets[delayBrackets.length - 1]
  );
}

// Progressive variable cost: each minute is charged at the rate of the band it
// sits in. This is what makes the cost curve non-linear — minutes deep in a
// delay cost far more than the first ones.
function variableDelayCost(size: AircraftSize, delayMinutes: number): number {
  const m = Math.max(0, delayMinutes);
  const rates = variableCostPerMin[size];
  const tiers: { from: number; to: number; rate: number }[] = [
    { from: 0, to: 15, rate: 0 },
    { from: 15, to: 60, rate: rates.B1 },
    { from: 60, to: 120, rate: rates.B2 },
    { from: 120, to: 180, rate: rates.B3 },
    { from: 180, to: Infinity, rate: rates.B4 },
  ];
  let cost = 0;
  for (const tier of tiers) {
    if (m <= tier.from) break;
    const minutesInTier = Math.min(m, tier.to) - tier.from;
    cost += minutesInTier * tier.rate;
  }
  return Math.round(cost);
}

export type DelayCostBreakdown = {
  variable: number;
  eu261: number;
  care: number;
  careModelled: boolean;
  total: number;
};

/** Full cost of a delay: variable disruption + EU261 + care/voucher. */
export function calculateDelayCost(
  size: AircraftSize,
  passengers: number,
  delayMinutes: number
): DelayCostBreakdown {
  const variable = variableDelayCost(size, delayMinutes);

  const eu261 =
    delayMinutes >= eu261ThresholdMin[size] ? passengers * eu261PerPax[size] : 0;

  const careValue = careFrom120[size];
  const careModelled = careValue !== null;
  const care = careModelled && delayMinutes >= 120 ? careValue : 0;

  return { variable, eu261, care, careModelled, total: variable + eu261 + care };
}

/**
 * Avoidable money if a delay is reduced from originalDelay to mitigatedDelay.
 * Simply the difference in total cost, floored at zero.
 */
export function estimateAvoidableSavings(
  originalDelay: number,
  mitigatedDelay: number,
  size: AircraftSize,
  passengers: number
): number {
  const grossCost = calculateDelayCost(size, passengers, originalDelay).total;
  const mitigatedCost = calculateDelayCost(size, passengers, Math.max(0, mitigatedDelay)).total;
  return Math.max(grossCost - mitigatedCost, 0);
}

/** EU261 trigger threshold (minutes) for a size — exposed for UI labelling. */
export function eu261Threshold(size: AircraftSize): number {
  return eu261ThresholdMin[size];
}

/** Format a number as whole euros, e.g. 71200 → "€71,200". */
export function formatEUR(value: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export type Priority = "Low" | "Medium" | "High" | "Critical";

/** Priority label from total (unmitigated) exposure. */
export function getPriority(grossCost: number): Priority {
  if (grossCost >= 100000) return "Critical";
  if (grossCost >= 25000) return "High";
  if (grossCost >= 7000) return "Medium";
  return "Low";
}

// Assumed recovery from early dispatcher action (an aircraft swap), used to
// quantify avoidable cost. Documented assumption, not a per-flight data point.
export const ASSUMED_RECOVERY_MIN = 45;
