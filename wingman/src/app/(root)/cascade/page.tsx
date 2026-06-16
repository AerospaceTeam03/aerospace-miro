import CascadeChain from "@/components/features/cascade/CascadeChain";

// Placeholder rotations — to be replaced with real tail tracking (OpenSky).
const rotations = [
  {
    tail: "4Y-M-1",
    legs: [
      { flight: "4Y210", route: "FRA → DJE", scheduled: "04:45", delay: 50 },
      { flight: "4Y211", route: "DJE → FRA", scheduled: "07:30", delay: 65 },
      { flight: "4Y1408", route: "FRA → VAR", scheduled: "14:45", delay: 95 },
    ],
  },
  {
    tail: "4Y-S-1",
    legs: [
      { flight: "4Y530", route: "FRA → IBZ", scheduled: "09:30", delay: 22 },
      { flight: "4Y531", route: "IBZ → FRA", scheduled: "12:30", delay: 35 },
    ],
  },
  {
    tail: "4Y-S-2",
    legs: [
      { flight: "4Y802", route: "FRA → BRI", scheduled: "07:55", delay: 15 },
      { flight: "4Y803", route: "BRI → FRA", scheduled: "10:40", delay: 20 },
      { flight: "4Y912", route: "FRA → SPU", scheduled: "16:10", delay: 25 },
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
