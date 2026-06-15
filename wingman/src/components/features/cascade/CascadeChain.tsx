import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

// Placeholder — to be driven by real rotations (OpenSky tail tracking) where
// each leg inherits the delay of the previous one. Shows how one late aircraft
// drags the rest of its day.
type Leg = {
  flight: string;
  route: string;
  scheduled: string;
  delay: number;
};

const legStyle = (delay: number) =>
  delay >= 60
    ? "border-red-500/40 bg-red-500/10"
    : delay >= 20
      ? "border-amber-500/40 bg-amber-500/10"
      : "border-emerald-500/40 bg-emerald-500/10";

export default function CascadeChain({
  tail,
  legs,
}: {
  tail: string;
  legs: Leg[];
}) {
  return (
    <div className="border-border flex flex-col gap-3 rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <p className="text-foreground font-semibold">Aircraft {tail}</p>
        <p className="text-muted-foreground text-xs uppercase tracking-wide">
          {legs.length} legs today
        </p>
      </div>

      <div className="flex flex-wrap items-stretch gap-2">
        {legs.map((leg, i) => (
          <div key={leg.flight} className="flex items-stretch gap-2">
            <div
              className={cn(
                "flex min-w-32 flex-col gap-1 rounded-lg border p-3",
                legStyle(leg.delay)
              )}
            >
              <p className="text-foreground text-sm font-semibold">
                {leg.flight}
              </p>
              <p className="text-muted-foreground text-xs tabular-nums">
                {leg.route}
              </p>
              <p className="text-muted-foreground text-xs tabular-nums">
                STD {leg.scheduled}
              </p>
              <p className="mt-1 text-xs font-semibold tabular-nums">
                {leg.delay === 0 ? "On time" : `+${leg.delay} min`}
              </p>
            </div>
            {i < legs.length - 1 && (
              <ArrowRight className="text-muted-foreground my-auto size-5 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
