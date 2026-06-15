import ActionCard from "@/components/features/actions/ActionCard";

// Placeholder recommendations — to be generated from flagged flights.
const actions = [
  {
    flight: "LH 402",
    priority: "high" as const,
    recommendation: "Swap to standby tail D-AIXC",
    reason: "Inbound aircraft running +65 min, two legs back. Swap recovers JFK departure.",
    window: "45 min",
  },
  {
    flight: "LH 711",
    priority: "high" as const,
    recommendation: "Hold ORD connection, pre-alert reserve crew",
    reason: "Thunderstorms forecast at FRA from 09:00; 18 connecting passengers at risk.",
    window: "1 h 10 min",
  },
  {
    flight: "LH 1024",
    priority: "medium" as const,
    recommendation: "Assign reserve crew for MUC → LHR",
    reason: "Operating crew projected to hit duty limit before turnaround.",
    window: "2 h",
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
