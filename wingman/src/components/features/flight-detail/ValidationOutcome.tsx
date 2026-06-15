import type { ValidationOutcome as TValidationOutcome } from "@/types/flightDetail";

// This section shows historical outcome data.
// These fields are NOT available to the dispatcher before departure.
// They are included here for demo and judge explanation only.
export default function ValidationOutcome({ outcome }: { outcome: TValidationOutcome }) {
  return (
    <section className="flex flex-col gap-3">
      {/* Strong visual separator to prevent data leakage confusion */}
      <div className="border-border rounded-xl border border-dashed p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Historical outcome
          </span>
          <span className="text-muted-foreground text-xs">
            — not available to the dispatcher before departure
          </span>
        </div>

        <p className="text-muted-foreground mb-3 text-xs">
          This panel is included for hackathon demonstration and judge review only. In a
          production system, it would be hidden from the operational view and accessible
          only in post-flight analysis.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Fact
            label="Actual departure delay"
            value={outcome.actualDepDelayMin === 0 ? "On time" : `+${outcome.actualDepDelayMin} min`}
            highlight={outcome.actualDepDelayMin > 0}
          />
          <Fact
            label="Actual arrival delay"
            value={outcome.actualArrDelayMin === 0 ? "On time" : `+${outcome.actualArrDelayMin} min`}
            highlight={outcome.actualArrDelayMin > 0}
          />
          <Fact
            label="Delay cause (official)"
            value={outcome.delayCause}
            highlight={false}
          />
          <Fact
            label="Delayed 15+ min"
            value={outcome.delayed15 ? "Yes" : "No"}
            highlight={outcome.delayed15}
          />
        </div>

        {outcome.cancelled && (
          <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400">
            Flight was cancelled.
          </p>
        )}
      </div>
    </section>
  );
}

function Fact({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight: boolean;
}) {
  return (
    <div>
      <p className="text-muted-foreground text-xs uppercase tracking-wide">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${highlight ? "text-amber-600 dark:text-amber-400" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
