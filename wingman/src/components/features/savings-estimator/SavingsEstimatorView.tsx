"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Plane, TrendingDown, TriangleAlert } from "lucide-react";
import type { FlightExposure } from "./compute";
import { ASSUMED_RECOVERY_MIN, eu261Threshold, formatEUR, type Priority } from "./finance";
import { CostComposition, ExposureSpark, MitigationBar } from "./SavingsVisuals";

const priorityText: Record<Priority, string> = {
  Low: "text-muted-foreground",
  Medium: "text-amber-600 dark:text-amber-400",
  High: "text-orange-600 dark:text-orange-400",
  Critical: "text-red-600 dark:text-red-400",
};

const priorityDot: Record<Priority, string> = {
  Low: "bg-muted-foreground/40",
  Medium: "bg-amber-500",
  High: "bg-orange-500",
  Critical: "bg-red-500",
};

const priorityBadge: Record<Priority, string> = {
  Low: "border-border text-muted-foreground",
  Medium: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  High: "border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400",
  Critical: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
};

export default function SavingsEstimatorView({ exposures }: { exposures: FlightExposure[] }) {
  const [selectedId, setSelectedId] = useState(exposures[0]?.flight.recordId);
  const selected = exposures.find((e) => e.flight.recordId === selectedId) ?? exposures[0];

  const totalExposure = exposures.reduce((s, e) => s + e.grossCost, 0);
  const totalAvoidable = exposures.reduce((s, e) => s + e.avoidableSavings, 0);
  const cliffCount = exposures.filter((e) => e.crossesEu261).length;
  const highest = exposures[0];
  const maxCost = highest?.grossCost ?? 1;
  const avoidablePct = totalExposure > 0 ? Math.round((totalAvoidable / totalExposure) * 100) : 0;

  const metrics = [
    { label: "Total exposure", value: formatEUR(totalExposure), tone: "text-foreground", hint: undefined as string | undefined },
    {
      label: "Avoidable savings",
      value: formatEUR(totalAvoidable),
      tone: "text-emerald-600 dark:text-emerald-400",
      hint: `${avoidablePct}% of exposure`,
    },
    {
      label: "EU261 cliff",
      value: `${cliffCount} flight${cliffCount === 1 ? "" : "s"}`,
      tone: "text-amber-600 dark:text-amber-400",
      hint: undefined,
    },
    {
      label: "Highest exposure",
      value: highest ? `${highest.flight.flightNumber} · ${formatEUR(highest.grossCost)}` : "—",
      tone: "text-foreground",
      hint: undefined,
    },
  ];

  const stats = [
    { k: "Size", v: selected.size },
    { k: "Pax", v: String(selected.passengers) },
    { k: "Delay", v: `${selected.flight.baselineDelayMin}m` },
    { k: "Bracket", v: selected.bracketId },
  ];

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden">
      {/* Financial exposure bar */}
      <header className="bg-card/40 ring-border animate-in fade-in slide-in-from-top-1 flex flex-col gap-3 rounded-2xl px-4 py-2.5 ring-1 duration-200 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-xl">
            <TrendingDown className="size-4" />
          </span>
          <div className="flex flex-col leading-tight">
            <h1 className="text-base font-bold tracking-tight">Savings Estimator</h1>
            <p className="text-muted-foreground text-xs">Delay risk, priced for early action.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col leading-tight">
              <span className="text-muted-foreground text-[10px] tracking-wide uppercase">
                {m.label}
              </span>
              <span className={cn("text-sm font-semibold tabular-nums", m.tone)}>{m.value}</span>
              {m.hint && (
                <span className="text-muted-foreground text-[10px] tabular-nums">{m.hint}</span>
              )}
            </div>
          ))}
        </div>

        <span className="border-border text-muted-foreground hidden shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase lg:inline-block">
          Pre-departure estimate
        </span>
      </header>

      {/* Cockpit: flight list + cost briefing */}
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-3">
        {/* Flights by exposure */}
        <section className="bg-card/40 ring-border flex min-h-0 flex-col rounded-2xl ring-1 lg:col-span-2">
          <div className="flex items-baseline justify-between px-4 pt-3 pb-2">
            <h2 className="text-sm font-semibold">Flights by exposure</h2>
            <span className="text-muted-foreground text-[11px]">
              {exposures.length} flights · select to brief
            </span>
          </div>

          {/* Column legend */}
          <div className="text-muted-foreground border-border/60 flex items-center gap-3 border-b px-3 pb-1.5 text-[10px] tracking-wide uppercase">
            <span className="w-2 shrink-0" />
            <span className="w-12 shrink-0">Flight</span>
            <span className="w-16 shrink-0">Route</span>
            <span className="w-5 shrink-0 text-center">Sz</span>
            <span className="w-12 shrink-0 text-right">Delay</span>
            <span className="hidden w-16 shrink-0 sm:block" />
            <span className="flex-1 text-right">Exposure</span>
            <span className="w-14 shrink-0 text-right">Priority</span>
          </div>

          <ul className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-2">
            {exposures.map((e) => {
              const active = e.flight.recordId === selected.flight.recordId;
              return (
                <li key={e.flight.recordId}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(e.flight.recordId)}
                    aria-pressed={active}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-left text-sm transition-[background-color,box-shadow,color] duration-200 ease-out",
                      active
                        ? "bg-primary/10 ring-primary/30 shadow-sm ring-1"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <span className={cn("size-2 shrink-0 rounded-full", priorityDot[e.priority])} />
                    <span className="w-12 shrink-0 font-semibold">{e.flight.flightNumber}</span>
                    <span className="text-muted-foreground w-16 shrink-0">{e.flight.route}</span>
                    <span className="text-muted-foreground w-5 shrink-0 text-center">{e.size}</span>
                    <span className="text-muted-foreground w-12 shrink-0 text-right tabular-nums">
                      {e.flight.baselineDelayMin}m
                    </span>
                    <ExposureSpark value={e.grossCost} max={maxCost} />
                    <span className="flex-1 text-right font-medium tabular-nums">
                      {formatEUR(e.grossCost)}
                    </span>
                    <span
                      className={cn(
                        "w-14 shrink-0 text-right text-xs font-semibold",
                        priorityText[e.priority]
                      )}
                    >
                      {e.priority}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Cost briefing */}
        <aside className="bg-card/40 ring-border flex min-h-0 flex-col rounded-2xl ring-1">
          <div
            key={selected.flight.recordId}
            className="animate-in fade-in slide-in-from-right-2 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 duration-200 ease-out"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col leading-tight">
                <span className="text-muted-foreground text-[10px] tracking-wide uppercase">
                  Cost briefing
                </span>
                <span className="flex items-center gap-1.5 text-lg font-bold">
                  <Plane className="text-muted-foreground size-3.5" />
                  {selected.flight.flightNumber}
                </span>
                <span className="text-muted-foreground text-xs">
                  {selected.flight.route} · {selected.flight.distanceKm.toLocaleString()} km
                </span>
              </div>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-xs font-semibold",
                  priorityBadge[selected.priority]
                )}
              >
                {selected.priority}
              </span>
            </div>

            {/* Stat chips */}
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {stats.map((c) => (
                <div key={c.k} className="bg-muted/40 rounded-lg py-1.5">
                  <p className="text-muted-foreground text-[10px] uppercase">{c.k}</p>
                  <p className="text-sm font-semibold tabular-nums">{c.v}</p>
                </div>
              ))}
            </div>

            {/* Mitigation payoff */}
            <div className="border-border/60 border-t pt-3">
              <MitigationBar
                gross={selected.grossCost}
                mitigated={selected.mitigatedCost}
                avoidable={selected.avoidableSavings}
                recoveryMin={ASSUMED_RECOVERY_MIN}
              />
            </div>

            {/* Cost composition */}
            <div className="border-border/60 border-t pt-3">
              <CostComposition breakdown={selected.breakdown} />
            </div>

            {/* Plain-English explanation */}
            <p className="text-muted-foreground text-xs leading-relaxed">
              {selected.bracketLabel}. Acting early to recover {ASSUMED_RECOVERY_MIN} min cuts exposure
              from {formatEUR(selected.grossCost)} to {formatEUR(selected.mitigatedCost)}, avoiding{" "}
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {formatEUR(selected.avoidableSavings)}
              </span>
              .
            </p>

            {selected.crossesEu261 && (
              <p className="flex items-start gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-600 transition-colors duration-200 dark:text-red-400">
                <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  EU261 cliff crossed — delay exceeds the {eu261Threshold(selected.size)}-min
                  threshold for size {selected.size}.
                </span>
              </p>
            )}

            {/* Method card (pinned to bottom) */}
            <p className="text-muted-foreground bg-muted/30 mt-auto rounded-lg px-3 py-2 text-[10px] leading-relaxed">
              <span className="text-foreground font-semibold">Method.</span> Estimate based on delay
              brackets, aircraft size, passenger count and EU261-style exposure. Not an accounting system.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
