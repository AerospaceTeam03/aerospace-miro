import type { AlternativeAction, FlightFixture } from "@/types/flightDetail";

export default function ActionPlaybook({ flight }: { flight: FlightFixture }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Action playbook</h2>

      {/* Primary action */}
      <div className="border-border flex flex-col gap-3 rounded-xl border p-4">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
          Primary recommendation
        </p>
        <p className="text-foreground font-semibold">{flight.recommendedAction}</p>

        <div className="grid gap-3 sm:grid-cols-3">
          <Fact label="Owner" value={flight.owner} />
          <Fact label="Deadline" value={flight.interventionWindow} />
          <Fact label="Confidence" value={flight.confidenceLevel} />
        </div>

        <p className="text-muted-foreground text-xs">
          <span className="font-semibold">Expected impact: </span>
          {flight.expectedImpact}
        </p>
        <p className="text-muted-foreground text-xs">
          <span className="font-semibold">EU261 liability: </span>
          {flight.eu261Exposure}
        </p>
      </div>

      {/* Alternative actions */}
      {flight.alternativeActions.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
            Alternative actions
          </p>
          {flight.alternativeActions.map((alt) => (
            <AlternativeCard key={alt.label} action={alt} />
          ))}
        </div>
      )}
    </section>
  );
}

function AlternativeCard({ action }: { action: AlternativeAction }) {
  return (
    <div className="border-border flex flex-col gap-2 rounded-xl border p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-foreground text-sm font-semibold">{action.label}</p>
        {action.minutesRecovered > 0 && (
          <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            ~{action.minutesRecovered} min recovered
          </span>
        )}
      </div>
      <p className="text-muted-foreground text-xs">{action.description}</p>
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="text-muted-foreground">
          <span className="font-semibold">Trade-off:</span> {action.tradeOff}
        </span>
        <span className="text-muted-foreground">
          <span className="font-semibold">Owner:</span> {action.owner}
        </span>
        <span className="text-muted-foreground">
          <span className="font-semibold">Deadline:</span> {action.deadline}
        </span>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs uppercase tracking-wide">{label}</p>
      <p className="text-foreground text-sm font-semibold">{value}</p>
    </div>
  );
}
