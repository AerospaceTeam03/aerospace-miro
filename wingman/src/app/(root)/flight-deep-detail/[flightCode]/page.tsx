// Flight Deep Detail — rich view for fixture flights, simpler fallback for others.
import ActionBox from "@/components/features/flight-detail/ActionBox";
import ActionPlaybook from "@/components/features/flight-detail/ActionPlaybook";
import AuditTrail from "@/components/features/flight-detail/AuditTrail";
import CausalChain from "@/components/features/flight-detail/CausalChain";
import CausalChainPanel from "@/components/features/flight-detail/CausalChainPanel";
import DataPanel from "@/components/features/flight-detail/DataPanel";
import DecisionSummary from "@/components/features/flight-detail/DecisionSummary";
import FixtureHeader from "@/components/features/flight-detail/FixtureHeader";
import FlightHeader from "@/components/features/flight-detail/FlightHeader";
import InboundChain from "@/components/features/flight-detail/InboundChain";
import RiskDriverCards from "@/components/features/flight-detail/RiskDriverCards";
import ScenarioSimulator from "@/components/features/flight-detail/ScenarioSimulator";
import TurnaroundTimeline from "@/components/features/flight-detail/TurnaroundTimeline";
import ValidationOutcome from "@/components/features/flight-detail/ValidationOutcome";
import WeatherPanel from "@/components/features/flight-detail/WeatherPanel";
import { flightDetails } from "@/components/features/flight-detail/data";
import { fixtureFlights } from "@/data/flightDetails.fixture";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function FlightDeepDetailPage({
  params,
}: {
  params: Promise<{ flightCode: string }>;
}) {
  const { flightCode } = await params;
  const key = decodeURIComponent(flightCode);

  // ── Rich fixture view (5 hand-crafted flights) ─────────────────────────────
  const fixture = fixtureFlights[key];
  if (fixture) {
    // Simulator initial inputs come from the fixture's primary risk drivers
    const simInitial = {
      inboundDelayMin: fixture.causeCategory === "CASCADE" || fixture.causeCategory === "TIGHT_TURNAROUND"
        ? (fixture.inboundChain.find((l) => l.position === "current")?.delayMin ?? 0)
        : 0,
      turnaroundMin: fixture.causeCategory === "TIGHT_TURNAROUND" ? 52 : 60,
      weatherSeverity:
        fixture.causeCategory === "WEATHER"
          ? ("heavy" as const)
          : fixture.weather.windGustKmh > 35 || fixture.weather.snowfallCm > 0
            ? ("light" as const)
            : ("none" as const),
      congestionLevel:
        fixture.causeCategory === "CONGESTION" ? ("high" as const) : ("low" as const),
      action: "none" as const,
    };

    return (
      <div className="flex flex-col gap-8">
        <FixtureHeader flight={fixture} />
        <DecisionSummary flight={fixture} />
        <CausalChainPanel steps={fixture.causalSteps} />
        <RiskDriverCards drivers={fixture.riskDrivers} />
        <TurnaroundTimeline
          steps={fixture.turnaroundSteps}
          bottleneckNote={fixture.turnaroundBottleneck}
        />
        <InboundChain legs={fixture.inboundChain} />
        <ActionPlaybook flight={fixture} />
        <ScenarioSimulator initialInputs={simInitial} />
        <WeatherPanel weather={fixture.weather} />
        <AuditTrail entries={fixture.auditTrail} />
        <ValidationOutcome outcome={fixture.validation} />
      </div>
    );
  }

  // ── Simpler fallback view (remaining 7 dashboard flights) ──────────────────
  const flight = flightDetails[key];
  if (flight) {
    return (
      <div className="flex flex-col gap-6">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>
        <FlightHeader flight={flight} />
        <CausalChain nodes={flight.causalChain} />
        <DataPanel flight={flight} />
        <ActionBox flight={flight} />
      </div>
    );
  }

  // ── 404 ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Link>
      <h1 className="text-2xl font-bold">Flight not found</h1>
      <p className="text-muted-foreground">
        No data found for flight <strong>{key}</strong>.
      </p>
    </div>
  );
}
