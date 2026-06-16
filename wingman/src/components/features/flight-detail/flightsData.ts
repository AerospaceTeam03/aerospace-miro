// Self-contained flight list for the Flight Deep Detail feature.
//
// The dashboard moved to the richer Discover/FRA bracket model; this keeps the
// deep-detail view on a simpler risk/cause shape. Flight identity, destination
// and scheduled time are real values from SIZED_FRA_DISC_DATA.csv (see
// src/data/discover.ts). The risk / cause / score / delay fields are the
// illustrative pre-departure scenario — they are NOT in the schedule CSV.

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

export const flights: Flight[] = [
  { code: "4Y210", destination: "DJE", scheduled: "04:45", risk: "RED", cause: "CASCADE", riskScore: 87, delayMinutes: 65 },
  { code: "4Y206", destination: "HRG", scheduled: "08:20", risk: "RED", cause: "WEATHER", riskScore: 91, delayMinutes: 74 },
  { code: "4Y152", destination: "MRU", scheduled: "17:45", risk: "RED", cause: "CASCADE", riskScore: 83, delayMinutes: 58 },
  { code: "4Y530", destination: "IBZ", scheduled: "09:30", risk: "AMBER", cause: "CONGESTION", riskScore: 48, delayMinutes: 22 },
  { code: "4Y802", destination: "BRI", scheduled: "07:55", risk: "AMBER", cause: "CASCADE", riskScore: 51, delayMinutes: 31 },
  { code: "4Y54", destination: "LAS", scheduled: "09:20", risk: "AMBER", cause: "WEATHER", riskScore: 55, delayMinutes: 28 },
  { code: "4Y302", destination: "LPA", scheduled: "09:55", risk: "AMBER", cause: "CONGESTION", riskScore: 46, delayMinutes: 25 },
  { code: "4Y1240", destination: "LCA", scheduled: "11:10", risk: "AMBER", cause: "CASCADE", riskScore: 49, delayMinutes: 24 },
  { code: "4Y10", destination: "CUN", scheduled: "10:00", risk: "GREEN", cause: "CARRIER", riskScore: 12, delayMinutes: 0 },
  { code: "4Y1200", destination: "RHO", scheduled: "04:45", risk: "GREEN", cause: "CARRIER", riskScore: 8, delayMinutes: 0 },
  { code: "4Y912", destination: "SPU", scheduled: "16:10", risk: "GREEN", cause: "CARRIER", riskScore: 10, delayMinutes: 0 },
  { code: "4Y76", destination: "YYC", scheduled: "13:30", risk: "GREEN", cause: "CARRIER", riskScore: 15, delayMinutes: 0 },
];

export const riskCopy: Record<RiskLevel, string> = {
  RED: "Red",
  AMBER: "Amber",
  GREEN: "Green",
};
