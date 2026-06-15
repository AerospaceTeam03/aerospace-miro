import CrewDutyRow from "@/components/features/crew/CrewDutyRow";

// Placeholder rosters — mocking crew duty data.
const crews = [
  { crew: "Crew A — Capt. Weber", flight: "LH 402", dutyUsed: 12, dutyLimit: 13 },
  { crew: "Crew B — Capt. Hoffmann", flight: "LH 711", dutyUsed: 10, dutyLimit: 13 },
  { crew: "Crew C — Capt. Becker", flight: "LH 1024", dutyUsed: 8, dutyLimit: 13 },
  { crew: "Crew D — Capt. Schulz", flight: "LH 218", dutyUsed: 5, dutyLimit: 13 },
];

export default function CrewPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Crew</h1>
        <p className="text-muted-foreground">
          Crews approaching their duty limit — when a delay pushes a crew over,
          the flight cannot operate. Spot it before it becomes the next delay.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="border-border rounded-xl border p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Crews on duty
          </p>
          <p className="text-foreground mt-1 text-2xl font-bold tabular-nums">
            42
          </p>
        </div>
        <div className="border-border rounded-xl border p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Near duty limit
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-red-600 dark:text-red-400">
            1
          </p>
        </div>
        <div className="border-border rounded-xl border p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Reserve crews available
          </p>
          <p className="text-foreground mt-1 text-2xl font-bold tabular-nums">
            6
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Duty status</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {crews.map((c) => (
            <CrewDutyRow key={c.crew} {...c} />
          ))}
        </div>
        <p className="text-muted-foreground text-xs">
          Placeholder data. Wire to real crew rosters and duty-time rules.
        </p>
      </section>
    </div>
  );
}
