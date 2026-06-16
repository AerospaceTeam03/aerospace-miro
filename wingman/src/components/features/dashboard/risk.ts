// Transparent, deterministic risk rule — a documented stand-in for the FOREST Random Forest
// until its FRA output is wired. Every signal here exists in the schedule CSV, so each
// prediction is fully explainable (no black box). Stable per flight (seeded by recordId).

import type { ScheduleFlight } from "@/data/schedule.generated";
import { brackets, type Bracket, type ReasonType } from "./data";
import { sizeMeta } from "./finance";

export type RiskAssessment = {
  bracket: Bracket;
  delayProbability: number;
  predictedDelayMin: number;
  reasonType: ReasonType;
  reasonText: string;
};

// Stable pseudo-random value in [0,1) from the record id — the idiosyncratic spread that a
// real model would capture from features we don't have here (weather, tail rotation, etc.).
function hashUnit(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

// FRA departure-bank congestion: the early-morning wave and the midday bank are the pinch
// points where slot/flow pressure builds.
function congestion(hour: number): { score: number; window: string | null } {
  if (hour === 4 || hour === 5) return { score: 0.22, window: "early-morning wave" };
  if (hour >= 10 && hour <= 12) return { score: 0.28, window: "midday bank" };
  if (hour === 13) return { score: 0.18, window: "afternoon push" };
  if (hour >= 6 && hour <= 9) return { score: 0.1, window: null };
  return { score: 0.12, window: null };
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function bracketFor(p: number): Bracket {
  if (p < 0.15) return "B0";
  if (p < 0.32) return "B1";
  if (p < 0.5) return "B2";
  if (p < 0.68) return "B3";
  if (p < 0.85) return "B4";
  return "B5";
}

// Representative predicted minutes per bracket (midpoint of the bracket's range).
const minutesFor: Record<Bracket, number> = {
  B0: 8,
  B1: 35,
  B2: 90,
  B3: 150,
  B4: 230,
  B5: 330,
};

function durationText(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h${m > 0 ? `${m}m` : ""}`;
}

export function assessRisk(f: ScheduleFlight): RiskAssessment {
  const hour = Number(f.departure.slice(0, 2));
  const { score: congestionScore, window } = congestion(hour);

  const sizeFactor = f.size === "L" ? 0.12 : f.size === "M" ? 0.05 : 0;
  const longHaulFactor = f.distanceKm > 6000 ? 0.12 : f.distanceKm > 3000 ? 0.05 : 0;
  const exposure = sizeFactor + longHaulFactor;
  const jitter = (hashUnit(f.recordId) - 0.5) * 0.3;

  const delayProbability = clamp(0.05 + congestionScore + exposure + jitter, 0.02, 0.97);
  const bracket = bracketFor(delayProbability);
  const predictedDelayMin = minutesFor[bracket];

  let reasonType: ReasonType;
  let reasonText: string;
  if (brackets[bracket].severity === 0) {
    reasonType = "LOW_RISK";
    reasonText = "On schedule — no significant risk drivers";
  } else if (exposure > 0 && exposure >= congestionScore) {
    reasonType = "DEMAND";
    const haul = f.distanceKm > 3000 ? "long-haul" : "high-load";
    reasonText = `${sizeMeta[f.size].aircraft}, ${f.pax} pax, ${durationText(
      f.durationMin
    )} to ${f.destination} — ${haul} exposure`;
  } else {
    reasonType = "CONGESTION";
    reasonText = `Departs ${f.departure} into FRA ${window ?? "departure flow"} — slot/flow pressure`;
  }

  return { bracket, delayProbability, predictedDelayMin, reasonType, reasonText };
}
