import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

// Illustrative rotation for Discover Airlines (4Y) out of Frankfurt. Each leg inherits
// the delay of the previous one — that is the cascade. Every leg carries a plain-language
// `cause` so the desk sees *why* it slipped, not just a number (the Wingman premise).
// Production wires this to live tail tracking (OpenSky) with delay propagated leg to leg.
export type Leg = {
  flight: string; // "4Y 512"
  route: string; // "FRA → PMI"
  scheduled: string; // STD, FRA local
  delay: number; // minutes
  cause: string; // why this leg slipped, in plain language
};

const legStyle = (delay: number) =>
  delay >= 60
    ? "border-red-500/40 bg-red-500/10"
    : delay >= 20
      ? "border-amber-500/40 bg-amber-500/10"
      : "border-emerald-500/40 bg-emerald-500/10";

export default function CascadeChain({
  tail,
  aircraft,
  pax,
  legs,
}: {
  tail: string;
  aircraft: string;
  pax: number;
  legs: Leg[];
}) {
  return (
    <div className="border-border flex flex-col gap-3 rounded-xl border p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-foreground font-semibold">
          Aircraft {tail}
          <span className="text-muted-foreground ml-2 text-sm font-normal">
            {aircraft} · {pax} pax
          </span>
        </p>
        <p className="text-muted-foreground text-xs uppercase tracking-wide">
          {legs.length} legs today
        </p>
      </div>

      <div className="flex flex-wrap items-stretch gap-2">
        {legs.map((leg, i) => (
          <div key={leg.flight} className="flex items-stretch gap-2">
            <div
              className={cn(
                "flex min-w-40 max-w-48 flex-col gap-1 rounded-lg border p-3",
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
              <p className="text-muted-foreground mt-1 text-[11px] leading-snug">
                {leg.cause}
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
