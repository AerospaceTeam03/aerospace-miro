// Normalized Discover Airlines data adapter — the single source of truth for
// the app's flight/airline data. Everything app-facing derives from here.
//
//   • discoverFlights      — the FRA schedule from SIZED_FRA_DISC_DATA.csv
//   • discoverDestinations — destination metadata from
//                            discover_airlines_destinations.json
//
// No data is invented: identity, route, distance, size and passenger counts all
// come from the CSV; city/airport/country/timezone/coordinates from the JSON.
// Aircraft are represented as the three CSV size classes (S / M / L) with
// deterministic demo tail identifiers (4Y-S-1, 4Y-M-1, …) — never random and
// never a US/American carrier code.

import scheduleData from "./discover_fra_schedule.json";
import destinationsData from "./discover_airlines_destinations.json";
import type { Destination, DestinationsFile } from "@/types/destination";

export type CsvSize = "S" | "M" | "L";

export type DiscoverFlight = {
  recordId: string;
  flightNumber: string;
  route: string;
  originIata: string;
  originAirport: string;
  destinationIata: string;
  destinationAirport: string;
  daysOfWeek: string[];
  departureTimeLocal: string;
  arrivalTimeLocal: string;
  duration: string;
  originCoordinates: [number, number];
  destinationCoordinates: [number, number];
  distanceKm: number;
  qualityFlag: string;
  size: CsvSize;
  custNum: number;
};

export const AIRLINE = {
  name: "Discover Airlines",
  iata: "4Y",
  icao: "OCN",
  callsign: "OCEAN",
  bases: ["FRA", "MUC"] as const,
} as const;

export const discoverFlights = scheduleData as DiscoverFlight[];

export const discoverDestinations = (destinationsData as DestinationsFile)
  .destinations;

const destinationByIata = new Map<string, Destination>(
  discoverDestinations.map((d) => [d.iata, d])
);

/** Destination metadata for an IATA code, when the JSON has it. */
export function getDestination(iata: string): Destination | undefined {
  return destinationByIata.get(iata);
}

/** Human label for the three CSV aircraft size classes. */
export const aircraftClassLabel: Record<CsvSize, string> = {
  S: "Short/medium leisure",
  M: "Medium-haul",
  L: "Long-haul",
};

/**
 * Deterministic demo tail/aircraft identifier from the size class and an index,
 * e.g. tailId("M", 3) → "4Y-M-3". Not a real registration; never random.
 */
export function tailId(size: CsvSize, index: number): string {
  return `${AIRLINE.iata}-${size}-${index}`;
}

/** Look up a scheduled Discover flight by its flight number (first match). */
export function getDiscoverFlight(flightNumber: string): DiscoverFlight | undefined {
  return discoverFlights.find((f) => f.flightNumber === flightNumber);
}
