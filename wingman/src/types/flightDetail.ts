// Types for the rich Flight Deep Detail fixture layer.
// These are pre-flight decision fields only.
// Outcome / validation fields are in ValidationOutcome and clearly separated in the UI.

export type RiskLevel = "RED" | "AMBER" | "GREEN";

export type CauseCategory =
  | "CASCADE"
  | "WEATHER"
  | "CONGESTION"
  | "TIGHT_TURNAROUND"
  | "COMBINED";

export type OperationalOwner =
  | "Dispatcher"
  | "Crew Control"
  | "Ground Handling"
  | "Airport Coordination"
  | "Maintenance"
  | "Network Control";

export type RiskDriver = {
  name: string;
  value: string;
  threshold: string;
  impact: "High" | "Medium" | "Low";
  evidence: string;
  breached: boolean; // true = value exceeds safe threshold
};

// One step in the human-readable causal explanation
export type CausalStep = {
  step: string;
  detail: string;
  isBottleneck?: boolean;
};

// One step in the ground turnaround timeline
export type TurnaroundStep = {
  label: string;
  scheduledTime: string;
  estimatedTime: string;
  status: "ok" | "at_risk" | "bottleneck";
};

// One leg in the tail rotation chain (previous / current / next)
export type LegInfo = {
  flightCode: string;
  origin: string;
  destination: string;
  scheduledDep: string;
  estimatedDep: string;
  delayMin: number;
  position: "previous" | "current" | "next";
};

export type AlternativeAction = {
  label: string;
  description: string;
  minutesRecovered: number;
  tradeOff: string;
  owner: OperationalOwner;
  deadline: string;
};

export type WeatherData = {
  location: string;
  tempC: number;
  windSpeedKmh: number;
  windGustKmh: number;
  precipMm: number;
  snowfallCm: number;
  cloudCoverPct: number;
  weatherCode: number; // WMO weather interpretation code
  conditions: string;  // label for the WMO code
  operationalNote: string; // plain-English operational meaning for dispatcher
};

export type AuditEntry = {
  time: string;
  event: string;
};

// Historical outcome — must only appear in a clearly labelled, visually separated section.
// These fields are NOT available to the dispatcher before departure.
export type ValidationOutcome = {
  actualDepDelayMin: number;
  actualArrDelayMin: number;
  delayCause: string;
  delayed15: boolean;
  cancelled: boolean;
};

export type FlightFixture = {
  // ── Flight identity ────────────────────────────────────────────────────────
  flightId: string;
  carrier: string;
  flightNumber: string;
  tail: string;
  origin: string;
  destination: string;
  date: string;
  dayOfWeek: string;
  scheduledDep: string;
  scheduledArr: string;
  depHour: number;
  distanceKm: number;

  // ── Risk summary (pre-flight) ──────────────────────────────────────────────
  risk: RiskLevel;
  riskScore: number; // 0–100, never shown alone
  predictedDelayBand: string; // e.g. "40–65 min at risk"
  causeCategory: CauseCategory;
  explanation: string; // plain English, no ML jargon

  // ── Decision fields ────────────────────────────────────────────────────────
  recommendedAction: string;
  alternativeActions: AlternativeAction[];
  owner: OperationalOwner;
  interventionWindow: string;
  confidenceLevel: "High" | "Medium" | "Low";
  confidenceReason: string;
  expectedImpact: string;
  eu261Exposure: string;

  // ── Causal narrative ───────────────────────────────────────────────────────
  causalSteps: CausalStep[];

  // ── Risk driver cards ──────────────────────────────────────────────────────
  riskDrivers: RiskDriver[];

  // ── Ground turnaround timeline ─────────────────────────────────────────────
  turnaroundSteps: TurnaroundStep[];
  turnaroundBottleneck: string;

  // ── Tail rotation chain ────────────────────────────────────────────────────
  inboundChain: LegInfo[];

  // ── Weather context ────────────────────────────────────────────────────────
  weather: WeatherData;

  // ── Decision audit trail ───────────────────────────────────────────────────
  auditTrail: AuditEntry[];

  // ── Historical validation — NOT pre-flight data ────────────────────────────
  validation: ValidationOutcome;
};
