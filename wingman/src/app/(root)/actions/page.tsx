import ActionCard from "@/components/features/actions/ActionCard";

// Placeholder recommendations — to be generated from flagged flights.
const actions = [
  {
    flight: "4Y210",
    priority: "high" as const,
    recommendation: "Swap to standby tail 4Y-M-4",
    reason: "Inbound aircraft running +60 min into a 48-min turnaround. Swap recovers the FRA → DJE departure.",
    window: "45 min",
  },
  {
    flight: "4Y206",
    priority: "high" as const,
    recommendation: "Secure controlled departure time, pre-alert crew",
    reason: "Thunderstorms and an ATC flow restriction at FRA from 07:30; 175 passengers on the Hurghada service at risk.",
    window: "1 h 10 min",
  },
  {
    flight: "4Y802",
    priority: "medium" as const,
    recommendation: "Pre-stage ground handling for FRA → BRI",
    reason: "Inbound 15 min late into a 52-min turnaround; pre-staging absorbs the late arrival.",
    window: "40 min",
  },
];

export default function ActionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Actions</h1>
        <p className="text-muted-foreground">
          The controller&apos;s queue: each flagged flight turned into a concrete
          recommendation, with the reason and the window to act on it.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="border-border rounded-xl border p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Pending
          </p>
          <p className="text-foreground mt-1 text-2xl font-bold tabular-nums">
            3
          </p>
        </div>
        <div className="border-border rounded-xl border p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            High priority
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-red-600 dark:text-red-400">
            2
          </p>
        </div>
        <div className="border-border rounded-xl border p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Resolved today
          </p>
          <p className="text-foreground mt-1 text-2xl font-bold tabular-nums">
            11
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Pending recommendations</h2>
        {actions.map((a) => (
          <ActionCard key={a.flight} {...a} />
        ))}
        <p className="text-muted-foreground text-xs">
          Placeholder data. Accept / Dismiss are not yet wired up.
        </p>
      </section>
    </div>
  );
}
