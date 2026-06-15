import { cn } from "@/lib/utils";
import type { RiskDriver } from "@/types/flightDetail";

const impactStyles = {
  High: "text-red-600 dark:text-red-400",
  Medium: "text-amber-600 dark:text-amber-400",
  Low: "text-muted-foreground",
};

export default function RiskDriverCards({ drivers }: { drivers: RiskDriver[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Risk drivers</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {drivers.map((d) => (
          <div
            key={d.name}
            className={cn(
              "border-border flex flex-col gap-2 rounded-xl border p-4",
              d.breached && "border-l-2 border-l-red-500"
            )}
          >
            {/* Driver name + impact */}
            <div className="flex items-start justify-between gap-2">
              <p className="text-foreground text-sm font-semibold">{d.name}</p>
              <span className={cn("shrink-0 text-xs font-semibold", impactStyles[d.impact])}>
                {d.impact} impact
              </span>
            </div>

            {/* Value vs threshold */}
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div>
                <p className="text-muted-foreground uppercase tracking-wide">Value</p>
                <p className={cn("font-mono font-semibold", d.breached ? "text-red-600 dark:text-red-400" : "text-foreground")}>
                  {d.value}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground uppercase tracking-wide">Safe threshold</p>
                <p className="text-foreground font-mono">{d.threshold}</p>
              </div>
            </div>

            {/* Evidence */}
            <p className="text-muted-foreground text-xs">{d.evidence}</p>

            {/* Breached indicator */}
            {d.breached && (
              <span className="self-start rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400">
                Threshold breached
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
