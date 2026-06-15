import CascadeChain from "@/components/features/cascade/CascadeChain";

// Placeholder rotations — to be replaced with real tail tracking (OpenSky).
const rotations = [
  {
    tail: "D-AIMA",
    legs: [
      { flight: "LH 402", route: "FRA → JFK", scheduled: "08:10", delay: 65 },
      { flight: "LH 403", route: "JFK → FRA", scheduled: "14:30", delay: 80 },
      { flight: "LH 218", route: "FRA → CDG", scheduled: "22:05", delay: 95 },
    ],
  },
  {
    tail: "D-AIXB",
    legs: [
      { flight: "LH 711", route: "FRA → ORD", scheduled: "09:25", delay: 40 },
      { flight: "LH 712", route: "ORD → FRA", scheduled: "16:10", delay: 55 },
    ],
  },
  {
    tail: "D-AINC",
    legs: [
      { flight: "LH 1024", route: "MUC → LHR", scheduled: "10:05", delay: 15 },
      { flight: "LH 1025", route: "LHR → MUC", scheduled: "13:40", delay: 20 },
      { flight: "LH 1088", route: "MUC → VIE", scheduled: "18:15", delay: 25 },
    ],
  },
];

export default function CascadePage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Cascade</h1>
        <p className="text-muted-foreground">
          Where one late aircraft drags the rest of the schedule. Each rotation
          shows how a delay compounds leg by leg across the day.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="border-border rounded-xl border p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Rotations at risk
          </p>
          <p className="text-foreground mt-1 text-2xl font-bold tabular-nums">
            3
          </p>
        </div>
        <div className="border-border rounded-xl border p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Downstream legs affected
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400">
            8
          </p>
        </div>
        <div className="border-border rounded-xl border p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Worst-case delay
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-red-600 dark:text-red-400">
            +95 min
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Affected rotations</h2>
        {rotations.map((r) => (
          <CascadeChain key={r.tail} tail={r.tail} legs={r.legs} />
        ))}
        <p className="text-muted-foreground text-xs">
          Placeholder data. Wire to real tail rotations (OpenSky) with delay
          propagated leg to leg.
        </p>
      </section>
    </div>
  );
}
