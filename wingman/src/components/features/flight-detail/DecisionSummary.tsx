import type { FlightFixture } from "@/types/flightDetail";

const causeLabel: Record<FlightFixture["causeCategory"], string> = {
  CASCADE: "Late inbound aircraft (cascade)",
  WEATHER: "Weather-driven ground friction",
  CONGESTION: "ATC / departure bank congestion",
  TIGHT_TURNAROUND: "Tight turnaround window",
  COMBINED: "Combined factors",
};

export default function DecisionSummary({ flight }: { flight: FlightFixture }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Decision summary</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card label="Why this flight is flagged">
          <p className="text-foreground text-sm font-medium">{causeLabel[flight.causeCategory]}</p>
          <p className="text-muted-foreground mt-1 text-xs">{flight.explanation}</p>
        </Card>

        <Card label="What to do now">
          <p className="text-foreground text-sm font-medium">{flight.recommendedAction}</p>
          <p className="text-muted-foreground mt-1 text-xs">Owner: {flight.owner}</p>
        </Card>

        <Card label="Best intervention window">
          <p className="text-foreground text-sm font-semibold">{flight.interventionWindow}</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Confidence: {flight.confidenceLevel} — {flight.confidenceReason}
          </p>
        </Card>

        <Card label="Expected operational impact">
          <p className="text-muted-foreground text-xs">{flight.expectedImpact}</p>
          {flight.eu261Exposure !== "No EU261 exposure expected — delay under 3 h" &&
            flight.eu261Exposure !== "No exposure — flight on time" && (
              <p className="text-muted-foreground mt-2 text-xs font-semibold">
                ⚖ {flight.eu261Exposure}
              </p>
            )}
        </Card>
      </div>
    </section>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-border flex flex-col gap-1 rounded-xl border p-4">
      <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">{label}</p>
      {children}
    </div>
  );
}
