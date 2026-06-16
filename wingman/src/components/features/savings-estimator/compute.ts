// Derives the per-flight financial picture used by the KPI row, the exposure
// table and the breakdown card. Uses the baseline delays already present in the
// repo fixture; "avoidable" assumes early action recovers ASSUMED_RECOVERY_MIN.

import {
  ASSUMED_RECOVERY_MIN,
  calculateDelayCost,
  estimateAvoidableSavings,
  eu261Threshold,
  getAircraftSize,
  getDelayBracket,
  getPassengers,
  getPriority,
  type AircraftSize,
  type DelayCostBreakdown,
  type Priority,
} from "./finance";
import { estimatorFlights, type EstimatorFlight } from "./data";

export type FlightExposure = {
  flight: EstimatorFlight;
  size: AircraftSize;
  passengers: number;
  bracketId: string;
  bracketLabel: string;
  breakdown: DelayCostBreakdown;
  grossCost: number;
  mitigatedDelay: number;
  mitigatedCost: number;
  avoidableSavings: number;
  priority: Priority;
  crossesEu261: boolean;
};

export function getFlightExposure(flight: EstimatorFlight): FlightExposure {
  const size = getAircraftSize(flight.distanceKm, flight.csvSize);
  const passengers = getPassengers(size, flight.custNum);
  const mitigatedDelay = Math.max(0, flight.baselineDelayMin - ASSUMED_RECOVERY_MIN);
  const breakdown = calculateDelayCost(size, passengers, flight.baselineDelayMin);
  const mitigatedCost = calculateDelayCost(size, passengers, mitigatedDelay).total;
  const bracket = getDelayBracket(flight.baselineDelayMin);

  return {
    flight,
    size,
    passengers,
    bracketId: bracket.id,
    bracketLabel: bracket.label,
    breakdown,
    grossCost: breakdown.total,
    mitigatedDelay,
    mitigatedCost,
    avoidableSavings: estimateAvoidableSavings(
      flight.baselineDelayMin,
      mitigatedDelay,
      size,
      passengers
    ),
    priority: getPriority(breakdown.total),
    crossesEu261: flight.baselineDelayMin >= eu261Threshold(size),
  };
}

export function getAllExposures(): FlightExposure[] {
  return estimatorFlights.map(getFlightExposure).sort((a, b) => b.grossCost - a.grossCost);
}
