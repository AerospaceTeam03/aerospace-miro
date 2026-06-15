import type { RiskLevel } from "@/types/flightDetail";

// ── Scenario simulator risk formula ───────────────────────────────────────────
// This is a transparent, deterministic scoring function — not a trained model.
// Every factor is visible and labelled so dispatchers can understand it.

export type SimulatorInputs = {
  inboundDelayMin: number;       // 0–90
  turnaroundMin: number;         // 40–90
  weatherSeverity: "none" | "light" | "heavy";
  congestionLevel: "low" | "moderate" | "high";
  action: "none" | "aircraft_swap" | "extra_crew" | "retime" | "standby_crew";
};

export type SimulatorResult = {
  score: number;
  level: RiskLevel;
  delayBand: string;
  explanation: string;
  minutesRecovered: number;
};

export function calculateScenarioRisk(inputs: SimulatorInputs): SimulatorResult {
  let score = 0;
  const factors: string[] = [];

  // Inbound delay: significant above 15 min, each minute adds risk
  if (inputs.inboundDelayMin > 15) {
    const contribution = Math.min((inputs.inboundDelayMin - 15) * 2, 40);
    score += contribution;
    factors.push(`inbound delay ${inputs.inboundDelayMin} min (+${contribution} pts)`);
  }

  // Tight turnaround: every minute below 60 min tightens risk
  if (inputs.turnaroundMin < 60) {
    const contribution = Math.min((60 - inputs.turnaroundMin) * 1.5, 30);
    score += contribution;
    factors.push(`turnaround ${inputs.turnaroundMin} min (+${Math.round(contribution)} pts)`);
  }

  // Weather adds friction to ground operations
  if (inputs.weatherSeverity === "light") {
    score += 10;
    factors.push("light weather (+10 pts)");
  } else if (inputs.weatherSeverity === "heavy") {
    score += 25;
    factors.push("heavy weather (+25 pts)");
  }

  // Congestion limits recovery options
  if (inputs.congestionLevel === "moderate") {
    score += 10;
    factors.push("moderate congestion (+10 pts)");
  } else if (inputs.congestionLevel === "high") {
    score += 20;
    factors.push("high congestion (+20 pts)");
  }

  // Mitigation actions reduce score
  let recovered = 0;
  if (inputs.action === "aircraft_swap") {
    score -= 30;
    recovered = 30;
    factors.push("aircraft swap (−30 pts, ~30 min recovered)");
  } else if (inputs.action === "extra_crew") {
    score -= 15;
    recovered = 15;
    factors.push("extra ground crew (−15 pts, ~15 min recovered)");
  } else if (inputs.action === "retime") {
    score -= 20;
    recovered = 20;
    factors.push("departure retime (−20 pts, ~20 min recovered)");
  } else if (inputs.action === "standby_crew") {
    score -= 10;
    recovered = 10;
    factors.push("standby crew called (−10 pts, ~10 min recovered)");
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  const level: RiskLevel = score >= 70 ? "RED" : score >= 40 ? "AMBER" : "GREEN";

  const delayBand =
    score >= 70
      ? "45–90 min at risk"
      : score >= 40
        ? "15–45 min at risk"
        : "under 15 min expected";

  const explanation = buildExplanation(inputs, level, factors);

  return { score, level, delayBand, explanation, minutesRecovered: recovered };
}

function buildExplanation(
  inputs: SimulatorInputs,
  level: RiskLevel,
  factors: string[]
): string {
  if (level === "GREEN") {
    return "With current inputs the flight is within safe parameters. No immediate action required.";
  }
  const actionText =
    inputs.action !== "none"
      ? " The selected mitigation reduces risk but does not eliminate it entirely."
      : " No mitigation selected — risk remains unaddressed.";
  return `Risk is driven by: ${factors.slice(0, 3).join(", ")}.${actionText}`;
}

// ── Weather code label (WMO interpretation code → plain English) ───────────────
export function getWeatherLabel(code: number): string {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Mainly clear / partly cloudy";
  if (code <= 9) return "Fog or rime fog";
  if (code <= 19) return "Precipitation";
  if (code <= 29) return "Thunderstorm";
  if (code <= 39) return "Blowing snow / dust";
  if (code <= 49) return "Fog";
  if (code <= 59) return "Drizzle";
  if (code <= 69) return "Rain";
  if (code <= 79) return "Snow / ice pellets";
  if (code <= 82) return "Rain showers";
  if (code <= 86) return "Snow showers";
  if (code <= 99) return "Thunderstorm with hail";
  return "Unknown";
}

// ── Risk level from numeric score ──────────────────────────────────────────────
export function getRiskLevel(score: number): RiskLevel {
  return score >= 70 ? "RED" : score >= 40 ? "AMBER" : "GREEN";
}
