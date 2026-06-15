// Types for the Discover Airlines destination dataset
// (src/data/discover_airlines_destinations.json).

export type Hub = "FRA" | "MUC";

export type Destination = {
  city: string;
  airport: string;
  iata: string;
  icao: string;
  country: string;
  /** Airport reference-point latitude, decimal degrees (WGS84). */
  lat: number;
  /** Airport reference-point longitude, decimal degrees (WGS84). */
  lon: number;
  /** IANA timezone of the airport, e.g. "Europe/Athens". */
  timezone: string;
  /** Operating bases that serve this destination. */
  hubs: Hub[];
  /** true = operated only part of the year per the 2026 schedule. */
  seasonal: boolean;
};

export type DestinationsMeta = {
  airline: string;
  iata: string;
  icao: string;
  callsign: string;
  parent: string;
  operating_bases: string[];
  scope: string;
  generated: string;
  sources: string[];
  field_notes: Record<string, string>;
  count: number;
};

export type DestinationsFile = {
  _meta: DestinationsMeta;
  destinations: Destination[];
};
