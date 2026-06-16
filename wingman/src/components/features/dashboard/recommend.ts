// Per-flight action recommendations. The bracket gives the severity-appropriate playbook
// (data.ts); this re-ranks that playbook for the individual flight by its reason + attributes
// and interpolates the flight's real figures into the copy, so two same-bracket flights read
// differently. Transparent and deterministic — no hidden model.

import {
  brackets,
  eur,
  type ActionTag,
  type Flight,
  type ReasonType,
} from "./data";

export type RecommendedAction = { label: string; detail: string };

// Which action categories each delay reason pushes to the top of the list.
const reasonBoost: Record<ReasonType, Partial<Record<ActionTag, number>>> = {
  CONGESTION: { flow: 3, crew: 2, comms: 1 },
  DEMAND: { pax: 3, swap: 2 },
  CASCADE: { swap: 3, flow: 2 },
  WEATHER: { pax: 3, swap: 2 },
  TIGHT_TURNAROUND: { crew: 3, flow: 2 },
  LOW_RISK: {},
};

// Same minutes → text formatter risk.ts uses, kept local to avoid a cross-module import.
function durationText(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  return `${h}h${m > 0 ? `${m}m` : ""}`;
}

// Tailor an action's copy to this specific flight. Returns the (possibly) rewritten label and
// detail; falls back to the playbook wording when no figure applies.
function tailor(
  action: { label: string; detail: string; tag: ActionTag },
  flight: Flight
): RecommendedAction {
  const base = action.detail.replace(/\.$/, "");
  const longHaul = flight.distanceKm > 6000;
  let label = action.label;
  let extra: string | null = null;

  switch (action.tag) {
    case "pax":
      if (label.startsWith("Rebook")) label = `${label} (${flight.pax} pax)`;
      extra =
        flight.eu261Exposure > 0
          ? `${flight.pax} pax, ${eur(flight.eu261Exposure)} EU261 at risk`
          : `${flight.pax} pax affected`;
      break;
    case "swap":
      extra = `${flight.aircraft}${longHaul ? ", long-haul rotation to " + flight.destination : ""}`;
      break;
    case "crew":
      extra = `${durationText(flight.predictedDelayMin)} slip vs. crew duty limits`;
      break;
    case "flow":
      extra = `STD ${flight.scheduled} → ${flight.destination}`;
      break;
    case "comms":
      extra = `${flight.destinationName} connections`;
      break;
    case "monitor":
      extra = null;
      break;
  }

  return { label, detail: extra ? `${base} — ${extra}` : action.detail };
}

export function recommendActions(flight: Flight): RecommendedAction[] {
  const pool = brackets[flight.bracket].actions;
  const boosts = reasonBoost[flight.reasonType];
  const longHaul = flight.distanceKm > 6000;
  const heavyPax = flight.pax >= 250 || flight.eu261Exposure > 50000;

  const score = (tag: ActionTag) => {
    let s = boosts[tag] ?? 0;
    if (tag === "pax" && heavyPax) s += 2;
    if (tag === "swap" && longHaul) s += 2;
    return s;
  };

  return pool
    .map((action, idx) => ({ action, idx, s: score(action.tag) }))
    .sort((a, b) => b.s - a.s || a.idx - b.idx) // higher score first; ties keep playbook order
    .map(({ action }) => tailor(action, flight));
}
