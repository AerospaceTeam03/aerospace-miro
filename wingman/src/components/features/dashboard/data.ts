export type RiskLevel = "RED" | "AMBER" | "GREEN";

export type CauseCode = "CASCADE" | "WEATHER" | "CARRIER" | "CONGESTION";

export type Flight = {
  code: string;
  destination: string;
  scheduled: string;
  risk: RiskLevel;
  cause: CauseCode;
  riskScore: number;
  delayMinutes: number;
};

// Placeholder operation — to be replaced with real flight + weather feeds.
export const operationalDate = "ORD · Jan 7";

export const flights: Flight[] = [
  { code: "AA 102", destination: "MIA", scheduled: "06:15", risk: "GREEN", cause: "CARRIER", riskScore: 12, delayMinutes: 0 },
  { code: "UA 884", destination: "DEN", scheduled: "06:40", risk: "AMBER", cause: "CONGESTION", riskScore: 48, delayMinutes: 22 },
  { code: "AA 1450", destination: "LAX", scheduled: "07:05", risk: "RED", cause: "CASCADE", riskScore: 87, delayMinutes: 65 },
  { code: "DL 219", destination: "ATL", scheduled: "07:20", risk: "GREEN", cause: "CARRIER", riskScore: 8, delayMinutes: 0 },
  { code: "UA 305", destination: "EWR", scheduled: "07:35", risk: "AMBER", cause: "WEATHER", riskScore: 55, delayMinutes: 28 },
  { code: "AA 588", destination: "DFW", scheduled: "07:50", risk: "RED", cause: "WEATHER", riskScore: 91, delayMinutes: 74 },
  { code: "UA 1190", destination: "SFO", scheduled: "08:05", risk: "GREEN", cause: "CARRIER", riskScore: 15, delayMinutes: 0 },
  { code: "AA 2230", destination: "BOS", scheduled: "08:15", risk: "AMBER", cause: "CASCADE", riskScore: 51, delayMinutes: 31 },
  { code: "DL 940", destination: "SEA", scheduled: "08:30", risk: "GREEN", cause: "CARRIER", riskScore: 10, delayMinutes: 0 },
  { code: "UA 712", destination: "IAH", scheduled: "08:45", risk: "RED", cause: "CONGESTION", riskScore: 83, delayMinutes: 58 },
  { code: "AA 91", destination: "PHX", scheduled: "09:00", risk: "AMBER", cause: "CASCADE", riskScore: 46, delayMinutes: 25 },
  { code: "UA 455", destination: "JFK", scheduled: "09:20", risk: "GREEN", cause: "CARRIER", riskScore: 6, delayMinutes: 0 },
];

export const riskCopy: Record<RiskLevel, string> = {
  RED: "Red",
  AMBER: "Amber",
  GREEN: "Green",
};
