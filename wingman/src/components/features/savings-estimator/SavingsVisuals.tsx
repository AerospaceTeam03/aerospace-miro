// Small, pure presentational pieces for the Savings Estimator briefing.
// Kept separate from SavingsEstimatorView so the layout stays readable and the
// visuals can be reused / tested in isolation. No data logic here — they only
// render numbers handed down from compute.ts / finance.ts.

import { cn } from "@/lib/utils";
import { formatEUR, type DelayCostBreakdown } from "./finance";

/**
 * Mitigation bar: the full width is the gross exposure. The muted segment is the
 * cost that remains after acting early; the emerald segment is the avoidable
 * saving. Makes the "act early" payoff legible at a glance.
 */
export function MitigationBar({
  gross,
  mitigated,
  avoidable,
  recoveryMin,
}: {
  gross: number;
  mitigated: number;
  avoidable: number;
  recoveryMin: number;
}) {
  const safeGross = Math.max(gross, 1);
  const mitigatedPct = Math.min(100, (mitigated / safeGross) * 100);
  const avoidablePct = Math.max(0, 100 - mitigatedPct);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-muted-foreground text-[10px] tracking-wide uppercase">
          Acting early (−{recoveryMin} min) avoids
        </span>
        <span className="text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
          {formatEUR(avoidable)}
        </span>
      </div>
      <div className="bg-muted flex h-2.5 w-full overflow-hidden rounded-full">
        <div
          className="bg-muted-foreground/40 h-full transition-[width] duration-300 ease-out"
          style={{ width: `${mitigatedPct}%` }}
        />
        <div
          className="h-full bg-emerald-500 transition-[width] duration-300 ease-out"
          style={{ width: `${avoidablePct}%` }}
        />
      </div>
      <div className="text-muted-foreground flex items-center justify-between text-[11px] tabular-nums">
        <span>Mitigated {formatEUR(mitigated)}</span>
        <span>Gross {formatEUR(gross)}</span>
      </div>
    </div>
  );
}

type Segment = { key: string; label: string; value: number; dot: string; bar: string };

/**
 * Cost composition: a stacked bar + legend breaking the gross exposure into its
 * variable disruption, EU261 compensation and passenger-care components.
 */
export function CostComposition({ breakdown }: { breakdown: DelayCostBreakdown }) {
  const segments: Segment[] = [
    {
      key: "variable",
      label: "Variable disruption",
      value: breakdown.variable,
      dot: "bg-primary",
      bar: "bg-primary",
    },
    {
      key: "eu261",
      label: "EU261 compensation",
      value: breakdown.eu261,
      dot: "bg-amber-500",
      bar: "bg-amber-500",
    },
    {
      key: "care",
      label: breakdown.careModelled ? "Passenger care" : "Passenger care (not modelled)",
      value: breakdown.care,
      dot: "bg-violet-500",
      bar: "bg-violet-500",
    },
  ];
  const total = Math.max(breakdown.total, 1);
  const visible = segments.filter((s) => s.value > 0);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground text-[10px] tracking-wide uppercase">
        Cost composition
      </span>
      <div className="bg-muted flex h-2.5 w-full overflow-hidden rounded-full">
        {visible.map((s) => (
          <div
            key={s.key}
            className={cn("h-full transition-[width] duration-300 ease-out", s.bar)}
            style={{ width: `${(s.value / total) * 100}%` }}
          />
        ))}
      </div>
      <ul className="flex flex-col gap-1 text-xs">
        {segments.map((s) => (
          <li key={s.key} className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <span className={cn("size-2 shrink-0 rounded-full", s.dot)} />
              {s.label}
            </span>
            <span className="font-medium tabular-nums">{formatEUR(s.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Thin relative-exposure bar used inside each flight row in the list, so the
 * magnitude of each flight's exposure is scannable without reading every euro.
 */
export function ExposureSpark({ value, max }: { value: number; max: number }) {
  const pct = Math.max(2, Math.min(100, (value / Math.max(max, 1)) * 100));
  return (
    <span className="bg-muted relative hidden h-1.5 w-16 shrink-0 overflow-hidden rounded-full sm:block">
      <span
        className="bg-primary/60 absolute inset-y-0 left-0 rounded-full"
        style={{ width: `${pct}%` }}
      />
    </span>
  );
}
