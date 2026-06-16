// Flight Deep Detail — compact "Flight Briefing" for fixture flights, simpler
// fallback for others.
import ActionBox from "@/components/features/flight-detail/ActionBox";
import CausalChain from "@/components/features/flight-detail/CausalChain";
import DataPanel from "@/components/features/flight-detail/DataPanel";
import FlightBriefing, {
  type CostSummary,
} from "@/components/features/flight-detail/FlightBriefing";
import FlightHeader from "@/components/features/flight-detail/FlightHeader";
import { flightDetails } from "@/components/features/flight-detail/data";
import { fixtureFlights } from "@/data/flightDetails.fixture";
import { getFlightExposure } from "@/components/features/savings-estimator/compute";
import { estimatorFlights } from "@/components/features/savings-estimator/data";
import { ASSUMED_RECOVERY_MIN, eu261Threshold } from "@/components/features/savings-estimator/finance";
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

    // Reuse the Savings Estimator's pure cost model for the priced flights, so
    // the Cost tab matches the Savings page exactly. No new data is invented.
    const priced = estimatorFlights.find((e) => e.flightNumber === fixture.flightNumber);
    const cost: CostSummary | null = priced
      ? (() => {
          const x = getFlightExposure(priced);
          return {
            gross: x.grossCost,
            mitigated: x.mitigatedCost,
            avoidable: x.avoidableSavings,
            crossesEu261: x.crossesEu261,
            thresholdMin: eu261Threshold(x.size),
            bracketLabel: x.bracketLabel,
            recoveryMin: ASSUMED_RECOVERY_MIN,
          };
        })()
      : null;

    return <FlightBriefing flight={fixture} cost={cost} simInitial={simInitial} />;
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
