// Typed fixture for the Savings Estimator, curated from the Discover Airlines
// FRA schedule (src/data/discover_fra_schedule.csv / .json). This is a
// representative slice covering all three aircraft-size bands; every row's
// flightNumber, route, distanceKm, csvSize and custNum are real CSV values.
//
// Columns mirrored from the source: record_id, flight_number, route,
// origin_iata, destination_iata, distance_km, Size, Cust_num.
//
// baselineDelayMin / riskProbability are the pre-departure scenario the OCC desk
// is reasoning about today — they are NOT in the schedule CSV and are illustrative.

export type EstimatorFlight = {
  recordId: string;
  flightNumber: string;
  route: string;
  originIata: string;
  destinationIata: string;
  distanceKm: number;
  csvSize: "S" | "M" | "L";
  custNum: number;
  baselineDelayMin: number;
  riskProbability: number; // 0..1
};

export const estimatorFlights: EstimatorFlight[] = [
  // ── Short-haul (S, <1500 km) ──────────────────────────────────────────────
  { recordId: "4Y912-FRA-SPU", flightNumber: "4Y912", route: "FRA-SPU", originIata: "FRA", destinationIata: "SPU", distanceKm: 931, csvSize: "S", custNum: 85, baselineDelayMin: 35, riskProbability: 0.30 },
  { recordId: "4Y910-FRA-ZAD", flightNumber: "4Y910", route: "FRA-ZAD", originIata: "FRA", destinationIata: "ZAD", distanceKm: 835, csvSize: "S", custNum: 85, baselineDelayMin: 75, riskProbability: 0.25 },
  { recordId: "4Y802-FRA-BRI", flightNumber: "4Y802", route: "FRA-BRI", originIata: "FRA", destinationIata: "BRI", distanceKm: 1176, csvSize: "S", custNum: 85, baselineDelayMin: 110, riskProbability: 0.40 },
  { recordId: "4Y530-FRA-IBZ", flightNumber: "4Y530", route: "FRA-IBZ", originIata: "FRA", destinationIata: "IBZ", distanceKm: 1365, csvSize: "S", custNum: 85, baselineDelayMin: 190, riskProbability: 0.20 },
  { recordId: "4Y512-FRA-PMI", flightNumber: "4Y512", route: "FRA-PMI", originIata: "FRA", destinationIata: "PMI", distanceKm: 1252, csvSize: "S", custNum: 85, baselineDelayMin: 20, riskProbability: 0.15 },

  // ── Medium-haul (M, 1500–5000 km) ─────────────────────────────────────────
  { recordId: "4Y210-FRA-DJE", flightNumber: "4Y210", route: "FRA-DJE", originIata: "FRA", destinationIata: "DJE", distanceKm: 1806, csvSize: "M", custNum: 175, baselineDelayMin: 140, riskProbability: 0.45 },
  { recordId: "4Y1200-FRA-RHO", flightNumber: "4Y1200", route: "FRA-RHO", originIata: "FRA", destinationIata: "RHO", distanceKm: 2179, csvSize: "M", custNum: 175, baselineDelayMin: 200, riskProbability: 0.35 },
  { recordId: "4Y202-FRA-RAK", flightNumber: "4Y202", route: "FRA-RAK", originIata: "FRA", destinationIata: "RAK", distanceKm: 2468, csvSize: "M", custNum: 175, baselineDelayMin: 175, riskProbability: 0.40 },
  { recordId: "4Y302-FRA-LPA", flightNumber: "4Y302", route: "FRA-LPA", originIata: "FRA", destinationIata: "LPA", distanceKm: 3185, csvSize: "M", custNum: 175, baselineDelayMin: 65, riskProbability: 0.30 },
  { recordId: "4Y206-FRA-HRG", flightNumber: "4Y206", route: "FRA-HRG", originIata: "FRA", destinationIata: "HRG", distanceKm: 3324, csvSize: "M", custNum: 175, baselineDelayMin: 95, riskProbability: 0.50 },

  // ── Long-haul (L, >5000 km) ───────────────────────────────────────────────
  { recordId: "4Y52-FRA-MSP", flightNumber: "4Y52", route: "FRA-MSP", originIata: "FRA", destinationIata: "MSP", distanceKm: 7049, csvSize: "L", custNum: 325, baselineDelayMin: 90, riskProbability: 0.25 },
  { recordId: "4Y10-FRA-CUN", flightNumber: "4Y10", route: "FRA-CUN", originIata: "FRA", destinationIata: "CUN", distanceKm: 8605, csvSize: "L", custNum: 325, baselineDelayMin: 160, riskProbability: 0.45 },
  { recordId: "4Y152-FRA-MRU", flightNumber: "4Y152", route: "FRA-MRU", originIata: "FRA", destinationIata: "MRU", distanceKm: 9200, csvSize: "L", custNum: 325, baselineDelayMin: 210, riskProbability: 0.35 },
  { recordId: "4Y54-FRA-LAS", flightNumber: "4Y54", route: "FRA-LAS", originIata: "FRA", destinationIata: "LAS", distanceKm: 8962, csvSize: "L", custNum: 325, baselineDelayMin: 250, riskProbability: 0.30 },
];
