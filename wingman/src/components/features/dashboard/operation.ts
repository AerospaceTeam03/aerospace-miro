// Builds the enriched operation for a given weekday: real schedule → risk → financials.

import { schedule, type Weekday } from "@/data/schedule.generated";
import type { Flight } from "./data";
import { computeFinancials, sizeMeta } from "./finance";
import { assessRisk } from "./risk";

export type { Weekday };

export const WEEKDAYS: Weekday[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Real current weekday (Date.getDay(): 0 = Sunday).
export function currentWeekday(): Weekday {
  const map: Weekday[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return map[new Date().getDay()];
}

export const operationalLabel = (day: Weekday) => `FRA · ${day}`;

const cache = new Map<Weekday, Flight[]>();

export function buildOperation(day: Weekday): Flight[] {
  const cached = cache.get(day);
  if (cached) return cached;

  const flights: Flight[] = schedule
    .filter((f) => f.days.includes(day))
    .map((f) => {
      const risk = assessRisk(f);
      const fin = computeFinancials({
        size: f.size,
        distanceKm: f.distanceKm,
        pax: f.pax,
        bracket: risk.bracket,
        predictedDelayMin: risk.predictedDelayMin,
        reasonType: risk.reasonType,
      });
      return {
        code: f.code,
        flightNo: f.flightNo,
        route: f.route,
        destination: f.destination,
        destinationName: f.destinationName,
        scheduled: f.departure,
        arrival: f.arrival,
        durationMin: f.durationMin,
        distanceKm: f.distanceKm,
        size: f.size,
        pax: f.pax,
        aircraft: sizeMeta[f.size].aircraft,
        ...risk,
        ...fin,
      } satisfies Flight;
    });

  cache.set(day, flights);
  return flights;
}
