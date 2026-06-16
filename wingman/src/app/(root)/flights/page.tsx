import FlightRiskTable from "@/components/features/flights/FlightRiskTable";

export default function FlightsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Flights</h1>
        <p className="text-muted-foreground">
          The morning read: today&apos;s flights ranked by delay risk, each with
          the driver behind it and a recommended action — not a bare score.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="border-border rounded-xl border p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Flights tracked
          </p>
          <p className="text-foreground mt-1 text-2xl font-bold tabular-nums">
            128
          </p>
        </div>
        <div className="border-border rounded-xl border p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            High risk
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-red-600 dark:text-red-400">
            7
          </p>
        </div>
        <div className="border-border rounded-xl border p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Actions suggested
          </p>
          <p className="text-foreground mt-1 text-2xl font-bold tabular-nums">
            5
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Risk watchlist</h2>
        <FlightRiskTable />
        <p className="text-muted-foreground text-xs">
          Discover Airlines (4Y) FRA schedule sample. Live flight positions
          (OpenSky) joined against weather to come.
        </p>
      </section>
    </div>
  );
}
