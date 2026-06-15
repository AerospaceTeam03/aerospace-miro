import { cn } from "@/lib/utils";
import type { LegInfo } from "@/types/flightDetail";
import { ArrowRight } from "lucide-react";

const positionStyles: Record<LegInfo["position"], string> = {
  previous: "border-border bg-muted/20",
  current: "border-primary/40 bg-primary/5 ring-1 ring-primary/20",
  next: "border-border bg-muted/20",
};

const delayColor = (min: number) =>
  min === 0
    ? "text-emerald-600 dark:text-emerald-400"
    : min < 20
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400";

export default function InboundChain({ legs }: { legs: LegInfo[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Tail rotation chain</h2>
      <p className="text-muted-foreground text-xs">
        All legs for this aircraft today. Delay accumulates down the chain
        unless a standby tail absorbs it.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
        {legs.map((leg, i) => (
          <div key={leg.flightCode} className="flex flex-1 items-center gap-2">
            <div className={cn(
              "flex flex-1 flex-col gap-2 rounded-xl border p-3",
              positionStyles[leg.position]
            )}>
              {/* Position label */}
              <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                {leg.position === "previous"
                  ? "Previous leg"
                  : leg.position === "current"
                    ? "▶ This flight"
                    : "Next leg"}
              </span>

              {/* Flight code and route */}
              <div>
                <p className="text-foreground font-semibold">{leg.flightCode}</p>
                <p className="text-muted-foreground text-xs">
                  {leg.origin} → {leg.destination}
                </p>
              </div>

              {/* Times */}
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div>
                  <p className="text-muted-foreground">Scheduled dep</p>
                  <p className="font-mono tabular-nums">{leg.scheduledDep}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Est. dep</p>
                  <p className={cn("font-mono font-semibold tabular-nums", delayColor(leg.delayMin))}>
                    {leg.estimatedDep}
                  </p>
                </div>
              </div>

              {/* Delay badge */}
              <span className={cn(
                "self-start rounded-full px-2 py-0.5 text-xs font-semibold",
                leg.delayMin === 0
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : leg.delayMin < 20
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    : "bg-red-500/15 text-red-600 dark:text-red-400"
              )}>
                {leg.delayMin === 0 ? "On time" : `+${leg.delayMin} min`}
              </span>
            </div>

            {i < legs.length - 1 && (
              <ArrowRight className="text-muted-foreground hidden size-5 shrink-0 sm:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
