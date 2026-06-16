import { cn } from "@/lib/utils";
import {
  brackets,
  eur,
  reasonCopy,
  sum,
  type Bracket,
  type Flight,
  type ReasonType,
} from "./data";

const bracketOrder: Bracket[] = ["B5", "B4", "B3", "B2", "B1", "B0"];

export default function BracketBreakdown({ flights }: { flights: Flight[] }) {
  // How many flights sit in each bracket.
  const counts = bracketOrder.map((b) => ({
    bracket: b,
    count: flights.filter((f) => f.bracket === b).length,
  }));

  // Where today's cost exposure is concentrated, by cause.
  const totalEcdn = sum(flights, "ecdn");
  const byCause = Object.entries(
    flights.reduce<Record<string, number>>((acc, f) => {
      acc[f.reasonType] = (acc[f.reasonType] ?? 0) + f.ecdn;
      return acc;
    }, {})
  )
    .map(([reason, ecdn]) => ({ reason: reason as ReasonType, ecdn }))
    .filter((r) => r.ecdn > 0)
    .sort((a, b) => b.ecdn - a.ecdn);

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="border-border rounded-xl border p-4">
        <h3 className="text-sm font-semibold">Bracket distribution</h3>
        <p className="text-muted-foreground mb-3 text-xs">
          Flights by predicted delay severity
        </p>
        <div className="flex flex-wrap gap-2">
          {counts.map(({ bracket, count }) => (
            <div
              key={bracket}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2",
                count > 0 ? brackets[bracket].badge : "bg-muted text-muted-foreground"
              )}
            >
              <span className="text-lg font-bold tabular-nums">{count}</span>
              <span className="text-xs font-medium">{brackets[bracket].label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-border rounded-xl border p-4">
        <h3 className="text-sm font-semibold">Exposure by cause</h3>
        <p className="text-muted-foreground mb-3 text-xs">
          Share of today&apos;s {eur(totalEcdn)} cost of doing nothing
        </p>
        <div className="flex flex-col gap-2.5">
          {byCause.map(({ reason, ecdn }) => (
            <div key={reason} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{reasonCopy[reason]}</span>
                <span className="text-muted-foreground tabular-nums">
                  {eur(ecdn)}
                </span>
              </div>
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${totalEcdn > 0 ? Math.round((ecdn / totalEcdn) * 100) : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
