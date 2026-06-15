import type { FlightDetail } from "./data";
import BigRiskLight from "./BigRiskLight";

export default function FlightHeader({ flight }: { flight: FlightDetail }) {
  return (
    <header className="border-border flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{flight.code}</h1>
          <span className="text-muted-foreground text-sm font-mono">{flight.tail}</span>
        </div>
        <p className="text-muted-foreground text-sm">
          {flight.origin} → {flight.destination}
        </p>
        <p className="text-sm">
          Scheduled <span className="font-mono tabular-nums">{flight.scheduled}</span>
          {" · "}
          Estimated{" "}
          <span
            className={
              flight.estimated !== flight.scheduled
                ? "font-mono font-semibold tabular-nums text-amber-600 dark:text-amber-400"
                : "font-mono tabular-nums"
            }
          >
            {flight.estimated}
          </span>
        </p>
      </div>

      <div className="flex flex-col items-start gap-1 sm:items-end">
        <BigRiskLight risk={flight.risk} />
        <span className="text-muted-foreground text-xs tabular-nums">
          Risk score {flight.riskScore}%
        </span>
      </div>
    </header>
  );
}
