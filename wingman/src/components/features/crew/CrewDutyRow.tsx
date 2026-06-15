import { cn } from "@/lib/utils";

// Placeholder — to be driven by real crew rosters and duty-time rules.
// Flags crews approaching their legal duty limit, a common cascade driver.
const barColor = (pct: number) =>
  pct >= 90 ? "bg-red-500" : pct >= 75 ? "bg-amber-500" : "bg-emerald-500";

export default function CrewDutyRow({
  crew,
  flight,
  dutyUsed,
  dutyLimit,
}: {
  crew: string;
  flight: string;
  dutyUsed: number;
  dutyLimit: number;
}) {
  const pct = Math.round((dutyUsed / dutyLimit) * 100);
  return (
    <div className="border-border flex flex-col gap-2 rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-foreground font-semibold">{crew}</p>
          <p className="text-muted-foreground text-xs">on {flight}</p>
        </div>
        <p className="text-foreground text-sm font-semibold tabular-nums">
          {dutyUsed}h / {dutyLimit}h
        </p>
      </div>

      <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
        <div
          className={cn("h-full rounded-full", barColor(pct))}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>

      <p className="text-muted-foreground text-xs tabular-nums">
        {pct}% of duty used
        {pct >= 90 ? " — reserve crew recommended" : ""}
      </p>
    </div>
  );
}
