// Deterministic financial engine — README / EUROCONTROL benchmarks + EU261.
// Inputs come straight from the schedule CSV (distance, size, pax); only the delay bracket
// and predicted minutes are derived (risk.ts). No randomness here.

import type { AircraftSize } from "@/data/schedule.generated";
import { brackets, type Bracket, type ReasonType } from "./data";

type CostTier = "small" | "medium" | "large";

// Aircraft label + cost tier per CSV size code (S=85, M=175, L=325 pax).
export const sizeMeta: Record<AircraftSize, { aircraft: string; tier: CostTier }> = {
  S: { aircraft: "A320", tier: "small" },
  M: { aircraft: "A321", tier: "medium" },
  L: { aircraft: "A330", tier: "large" },
};

// EUROCONTROL per-minute delay cost (€) by cost tier and bracket (README table).
const perMinByTier: Record<CostTier, Partial<Record<Bracket, number>>> = {
  small: { B1: 20, B2: 36, B3: 45, B4: 54, B5: 54 },
  medium: { B1: 50, B2: 55, B3: 70, B4: 85, B5: 85 },
  large: { B1: 140, B2: 150, B3: 190, B4: 230, B5: 230 },
};

// EU261 Article 7 compensation per passenger (€) by great-circle distance band.
function eu261Band(distanceKm: number): number {
  if (distanceKm <= 1500) return 250;
  if (distanceKm <= 3500) return 400;
  return 600;
}

// Share of ECDN a timely intervention can recover, by dominant cause.
const efficacyByReason: Record<ReasonType, number> = {
  CASCADE: 0.5,
  CONGESTION: 0.5,
  TIGHT_TURNAROUND: 0.45,
  DEMAND: 0.4,
  WEATHER: 0.3,
  LOW_RISK: 0,
};

const OVERHEAD = 1.07; // diffuse desk/gate overhead multiplier
const round = (n: number) => Math.round(n / 100) * 100;

export function computeFinancials(args: {
  size: AircraftSize;
  distanceKm: number;
  pax: number;
  bracket: Bracket;
  predictedDelayMin: number;
  reasonType: ReasonType;
}): { ecdn: number; eu261Exposure: number; avoidableLoss: number } {
  const { size, distanceKm, pax, bracket, predictedDelayMin, reasonType } = args;
  const sev = brackets[bracket].severity;

  const perMin = perMinByTier[sizeMeta[size].tier][bracket] ?? 0;
  const directCost = perMin * predictedDelayMin;

  let eu261 = 0;
  if (sev >= 3) eu261 += 15 * pax; // Art 9 care (meals/refreshments) from ~120 min
  if (sev >= 4) eu261 += eu261Band(distanceKm) * pax; // Art 7 compensation from ~180 min
  if (sev === 5) eu261 += 0.5 * eu261Band(distanceKm) * pax; // rebooking + extended care

  const ecdn = round((directCost + eu261) * OVERHEAD);
  const eu261Exposure = round(eu261);
  const avoidableLoss = round(ecdn * efficacyByReason[reasonType]);

  return { ecdn, eu261Exposure, avoidableLoss };
}
