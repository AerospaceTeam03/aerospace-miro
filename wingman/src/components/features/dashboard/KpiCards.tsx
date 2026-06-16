import { eur, isActionable, sum, type Flight } from "./data";

export default function KpiCards({ flights }: { flights: Flight[] }) {
  const total = flights.length;
  const needAction = flights.filter(isActionable).length;
  const costOfDoingNothing = sum(flights, "ecdn");
  const recoverable = sum(flights, "avoidableLoss");

  const kpis = [
    {
      label: "Flights today",
      value: total,
      hint: "Discover · FRA",
      className: "text-foreground",
    },
    {
      label: "Need action",
      value: needAction,
      hint: "beyond on-time",
      className: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Cost of doing nothing",
      value: eur(costOfDoingNothing),
      hint: "exposure if no action",
      className: "text-foreground",
    },
    {
      label: "Recoverable today",
      value: eur(recoverable),
      hint: "if acted on in time",
      className: "text-emerald-600 dark:text-emerald-400",
    },
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
          <p className="text-muted-foreground mt-1 text-xs">{kpi.hint}</p>
        </div>
      ))}
    </section>
  );
}
