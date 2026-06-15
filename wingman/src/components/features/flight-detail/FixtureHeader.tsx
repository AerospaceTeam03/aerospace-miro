import { cn } from "@/lib/utils";
import type { FlightFixture, RiskLevel } from "@/types/flightDetail";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const riskStyles: Record<RiskLevel, string> = {
  RED: "bg-red-500/15 text-red-600 dark:text-red-400 ring-red-500/40",
  AMBER: "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/40",
  GREEN: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/40",
};

const dotStyles: Record<RiskLevel, string> = {
  RED: "bg-red-500",
  AMBER: "bg-amber-500",
  GREEN: "bg-emerald-500",
};

export default function FixtureHeader({ flight }: { flight: FlightFixture }) {
  return (
    <header className="flex flex-col gap-4">
      {/* Back navigation */}
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Link>

      {/* Flight identity + risk badge */}
      <div className="border-border flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">
              {flight.carrier} {flight.flightNumber}
            </h1>
            <span className="text-muted-foreground font-mono text-sm">{flight.tail}</span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">{flight.date}</span>
          </div>
          <p className="text-foreground font-semibold">
            {flight.origin} → {flight.destination}
          </p>
          <p className="text-muted-foreground text-sm">
            Scheduled dep{" "}
            <span className="font-mono tabular-nums">{flight.scheduledDep}</span>
            {" · "}
            Arr{" "}
            <span className="font-mono tabular-nums">{flight.scheduledArr}</span>
            {" · "}
            {flight.distanceKm.toLocaleString("en-US")} km
          </p>
        </div>

        {/* Large risk badge */}
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <div className={cn("flex items-center gap-3 rounded-2xl px-5 py-3 ring-1", riskStyles[flight.risk])}>
            <span className={cn("size-4 shrink-0 rounded-full", dotStyles[flight.risk])} />
            <span className="text-xl font-bold tracking-wide">{flight.risk}</span>
          </div>
          <span className="text-muted-foreground text-xs tabular-nums">
            Risk score {flight.riskScore}/100 · {flight.predictedDelayBand}
          </span>
        </div>
      </div>

      {/* Recommended action summary — highlighted box */}
      <div className={cn(
        "rounded-xl border p-4",
        flight.risk === "RED"
          ? "border-red-500/40 bg-red-500/10"
          : flight.risk === "AMBER"
            ? "border-amber-500/40 bg-amber-500/10"
            : "border-emerald-500/40 bg-emerald-500/10"
      )}>
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
          Recommended action · {flight.owner} · {flight.interventionWindow}
        </p>
        <p className="text-foreground mt-1 text-sm font-medium">{flight.recommendedAction}</p>
      </div>
    </header>
  );
}
