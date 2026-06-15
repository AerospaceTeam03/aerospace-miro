import { flights, type CauseCode, type RiskLevel } from "@/components/features/dashboard/data";

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

// Placeholder — to be replaced with real flight, weather and tail-rotation data.
const causalChains: Record<CauseCode, (f: (typeof flights)[number]) => CausalNode[]> = {
  CASCADE: (f) => [
    { label: `Inbound +${f.delayMinutes - 5} min`, detail: "Previous rotation arrived late" },
    { label: "Turnaround 52 min / buffer 4 min", detail: "Standard turnaround leaves almost no slack" },
    { label: `Knock-on +${Math.max(f.delayMinutes - 20, 5)} min`, detail: "Delay carries over to this departure" },
    { label: `Departure risk: ${f.riskScore}%`, detail: "Compounded delay driving departure risk" },
  ],
  WEATHER: (f) => [
    { label: "Gusts 56 km/h", detail: "Crosswind near operational limits at ORD" },
    { label: "+12 min ground delay", detail: "De-icing and runway spacing impact" },
    { label: "Turnaround 52 min / buffer 4 min", detail: "Standard turnaround leaves almost no slack" },
    { label: `Departure risk: ${f.riskScore}%`, detail: "Weather-driven delay propagating to departure" },
  ],
  CONGESTION: (f) => [
    { label: "Ground stop ORD 20 min", detail: "ATC flow control limiting departure rate" },
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

function eu261For(distanceKm: number, risk: RiskLevel): string {
  if (risk === "GREEN") return "No exposure — flight on time";
  const perPax = distanceKm > 3500 ? 600 : distanceKm > 1500 ? 400 : 250;
  const pax = 180;
  const total = perPax * pax;
  return `Maximum exposure: €${total.toLocaleString("en-US")} if +3h`;
}

const destinationInfo: Record<string, { distanceKm: number; weatherConditions: string; windKmh: number; tempC: number; snowCm: number }> = {
  MIA: { distanceKm: 1920, weatherConditions: "Clear", windKmh: 18, tempC: 24, snowCm: 0 },
  DEN: { distanceKm: 1450, weatherConditions: "Windy", windKmh: 42, tempC: 5, snowCm: 0 },
  LAX: { distanceKm: 2800, weatherConditions: "Clear", windKmh: 14, tempC: 18, snowCm: 0 },
  ATL: { distanceKm: 1100, weatherConditions: "Overcast", windKmh: 20, tempC: 9, snowCm: 0 },
  EWR: { distanceKm: 1170, weatherConditions: "Rain", windKmh: 33, tempC: 7, snowCm: 0 },
  DFW: { distanceKm: 1290, weatherConditions: "Snow showers", windKmh: 56, tempC: -2, snowCm: 4 },
  SFO: { distanceKm: 2960, weatherConditions: "Fog", windKmh: 12, tempC: 13, snowCm: 0 },
  BOS: { distanceKm: 1370, weatherConditions: "Cloudy", windKmh: 27, tempC: 3, snowCm: 0 },
  SEA: { distanceKm: 2780, weatherConditions: "Clear", windKmh: 16, tempC: 8, snowCm: 0 },
  IAH: { distanceKm: 1510, weatherConditions: "Thunderstorms", windKmh: 38, tempC: 21, snowCm: 0 },
  PHX: { distanceKm: 2330, weatherConditions: "Clear", windKmh: 10, tempC: 22, snowCm: 0 },
  JFK: { distanceKm: 1190, weatherConditions: "Cloudy", windKmh: 24, tempC: 4, snowCm: 0 },
};

const tailNumbers: Record<string, string> = {
  "AA 102": "N801AW",
  "UA 884": "N36476",
  "AA 1450": "N28478",
  "DL 219": "N912DL",
  "UA 305": "N504UA",
  "AA 588": "N174AA",
  "UA 1190": "N667UA",
  "AA 2230": "N339AA",
  "DL 940": "N855DL",
  "UA 712": "N228UA",
  "AA 91": "N701AA",
  "UA 455": "N480UA",
};

export const flightDetails: Record<string, FlightDetail> = Object.fromEntries(
  flights.map((f) => {
    const dest = destinationInfo[f.destination];
    const estimated = estimateTime(f.scheduled, f.delayMinutes);
    return [
      f.code,
      {
        code: f.code,
        tail: tailNumbers[f.code] ?? "N000XX",
        origin: "ORD",
        destination: f.destination,
        scheduled: f.scheduled,
        estimated,
        risk: f.risk,
        riskScore: f.riskScore,
        causalChain: causalChains[f.cause](f),
        weather: {
          location: f.destination,
          tempC: dest.tempC,
          windKmh: dest.windKmh,
          snowCm: dest.snowCm,
          conditions: dest.weatherConditions,
        },
        distanceKm: dest.distanceKm,
        etaDestination: estimateTime(estimated, Math.round((dest.distanceKm / 800) * 60)),
        recommendation:
          f.risk === "RED"
            ? `Consider an aircraft swap — check standby tail availability before ${f.scheduled}.`
            : f.risk === "AMBER"
              ? "Monitor the inbound leg and pre-alert reserve crew if the delay grows."
              : "No action required — flight within normal parameters.",
        eu261Exposure: eu261For(dest.distanceKm, f.risk),
      } satisfies FlightDetail,
    ];
  })
);
