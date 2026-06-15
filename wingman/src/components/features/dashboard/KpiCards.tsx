import { flights } from "./data";

export default function KpiCards() {
  const total = flights.length;
  const redCount = flights.filter((f) => f.risk === "RED").length;
  const amberCount = flights.filter((f) => f.risk === "AMBER").length;
  const riskMinutes = flights
    .filter((f) => f.risk !== "GREEN")
    .reduce((sum, f) => sum + f.delayMinutes, 0);

  const kpis = [
    { label: "Total flights today", value: total, className: "text-foreground" },
    { label: "Flights in red", value: redCount, className: "text-red-600 dark:text-red-400" },
    { label: "Flights in amber", value: amberCount, className: "text-amber-600 dark:text-amber-400" },
    { label: "Delay minutes at risk", value: `+${riskMinutes}`, className: "text-foreground" },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="border-border rounded-xl border p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            {kpi.label}
          </p>
          <p className={`mt-1 text-2xl font-bold tabular-nums ${kpi.className}`}>
            {kpi.value}
          </p>
        </div>
      ))}
    </section>
  );
}
