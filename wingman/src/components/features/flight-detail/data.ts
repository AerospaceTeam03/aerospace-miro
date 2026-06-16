import { flights, type CauseCode, type RiskLevel } from "./flightsData";
import {
  AIRLINE,
  getDestination,
  getDiscoverFlight,
  tailId,
  type CsvSize,
} from "@/data/discover";

export type CausalNode = {
  label: string;
  detail: string;
};

export type FlightDetail = {
  code: string;
  tail: string;
  origin: string;
  destination: string;
  scheduled: string;
  estimated: string;
  risk: RiskLevel;
  riskScore: number;
  causalChain: CausalNode[];
  weather: {
    location: string;
    tempC: number;
    windKmh: number;
    snowCm: number;
    conditions: string;
  };
  distanceKm: number;
  etaDestination: string;
  recommendation: string;
  eu261Exposure: string;
};

// Causal narratives for the simpler fallback view. The hand-crafted rich
// scenarios live in src/data/flightDetails.fixture.ts; this is the generic
// pre-departure story per cause code for the remaining Discover flights.
const causalChains: Record<CauseCode, (f: (typeof flights)[number]) => CausalNode[]> = {
  CASCADE: (f) => [
    { label: `Inbound +${f.delayMinutes - 5} min`, detail: "Previous rotation arrived late into FRA" },
    { label: "Turnaround 52 min / buffer 4 min", detail: "Standard turnaround leaves almost no slack" },
    { label: `Knock-on +${Math.max(f.delayMinutes - 20, 5)} min`, detail: "Delay carries over to this departure" },
    { label: `Departure risk: ${f.riskScore}%`, detail: "Compounded delay driving departure risk" },
  ],
  WEATHER: (f) => [
    { label: "Gusts 56 km/h", detail: "Crosswind near operational limits at FRA" },
    { label: "+12 min ground delay", detail: "De-icing and runway spacing impact" },
    { label: "Turnaround 52 min / buffer 4 min", detail: "Standard turnaround leaves almost no slack" },
    { label: `Departure risk: ${f.riskScore}%`, detail: "Weather-driven delay propagating to departure" },
  ],
  CONGESTION: (f) => [
    { label: "Ground stop FRA 20 min", detail: "ATC flow control limiting departure rate" },
    { label: `Queue position +${Math.max(f.delayMinutes - 10, 5)} min`, detail: "Aircraft queued behind congestion backlog" },
    { label: "Turnaround 52 min / buffer 4 min", detail: "Standard turnaround leaves almost no slack" },
    { label: `Departure risk: ${f.riskScore}%`, detail: "Airport congestion driving departure risk" },
  ],
  CARRIER: (f) => [
    { label: "Inbound on time", detail: "No upstream delay detected" },
    { label: "Turnaround 52 min / buffer 4 min", detail: "Standard turnaround on schedule" },
    { label: "No knock-on delay", detail: "Crew and aircraft ready ahead of departure" },
    { label: `Departure risk: ${f.riskScore}%`, detail: "Low residual risk from normal operations" },
  ],
};

function estimateTime(scheduled: string, delayMinutes: number): string {
  const [h, m] = scheduled.split(":").map(Number);
  const total = h * 60 + m + delayMinutes;
  const eh = Math.floor(total / 60) % 24;
  const em = total % 60;
  return `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
}

function eu261For(distanceKm: number, risk: RiskLevel, passengers: number): string {
  if (risk === "GREEN") return "No exposure — flight on time";
  const perPax = distanceKm > 3500 ? 600 : distanceKm > 1500 ? 400 : 250;
  const total = perPax * passengers;
  return `Maximum exposure: €${total.toLocaleString("en-US")} if +3h`;
}

// Deterministic tail per flight: numbered within its CSV size class, e.g.
// "4Y-M-1". Built once over the dashboard flights so each code maps stably.
const sizeCounters: Record<CsvSize, number> = { S: 0, M: 0, L: 0 };
const tailByCode: Record<string, string> = {};
for (const f of flights) {
  const row = getDiscoverFlight(f.code);
  const size = (row?.size ?? "M") as CsvSize;
  sizeCounters[size] += 1;
  tailByCode[f.code] = row ? tailId(size, sizeCounters[size]) : `${AIRLINE.iata}-M-0`;
}

export const flightDetails: Record<string, FlightDetail> = Object.fromEntries(
  flights.map((f) => {
    const row = getDiscoverFlight(f.code);
    const dest = getDestination(f.destination);
    const distanceKm = row?.distanceKm ?? 0;
    const passengers = row?.custNum ?? 0;
    const estimated = estimateTime(f.scheduled, f.delayMinutes);
    return [
      f.code,
      {
        code: f.code,
        tail: tailByCode[f.code],
        origin: row?.originIata ?? "FRA",
        destination: f.destination,
        scheduled: f.scheduled,
        estimated,
        risk: f.risk,
        riskScore: f.riskScore,
        causalChain: causalChains[f.cause](f),
        weather: {
          // Live weather lives on the Weather page; the fallback detail view has
          // no static per-destination weather, so it is reported as unavailable
          // rather than invented.
          location: dest ? `${dest.city} (${f.destination})` : f.destination,
          tempC: 0,
          windKmh: 0,
          snowCm: 0,
          conditions: "Data unavailable",
        },
        distanceKm,
        etaDestination:
          distanceKm > 0
            ? estimateTime(estimated, Math.round((distanceKm / 800) * 60))
            : "—",
        recommendation:
          f.risk === "RED"
            ? `Consider an aircraft swap — check standby tail availability before ${f.scheduled}.`
            : f.risk === "AMBER"
              ? "Monitor the inbound leg and pre-alert reserve crew if the delay grows."
              : "No action required — flight within normal parameters.",
        eu261Exposure: eu261For(distanceKm, f.risk, passengers),
      } satisfies FlightDetail,
    ];
  })
);
