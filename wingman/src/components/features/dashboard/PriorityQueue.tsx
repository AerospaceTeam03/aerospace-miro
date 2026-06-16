"use client";

import { cn } from "@/lib/utils";
import { ArrowRight, Check } from "lucide-react";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import BracketActions from "./BracketActions";
import BracketBadge from "./BracketBadge";
import DecisionDialog from "./DecisionDialog";
import SeverityBar from "./SeverityBar";
import {
  eur,
  flightKey,
  isActionable,
  reasonCopy,
  sortByBracketThenTime,
  type Flight,
} from "./data";

const TOP_N = 10;

export default function PriorityQueue({
  flights,
  decisions,
  setDecisions,
}: {
  flights: Flight[];
  // Locked-in decisions (flight key → chosen action label) owned by DashboardView so the
  // "Need action" KPI can react to them. In-memory only — resets on refresh / day change.
  decisions: Record<string, string>;
  setDecisions: Dispatch<SetStateAction<Record<string, string>>>;
}) {
  const [actionableOnly, setActionableOnly] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [activeFlight, setActiveFlight] = useState<Flight | null>(null);

  const sorted = useMemo(() => {
    const filtered = actionableOnly ? flights.filter(isActionable) : flights;
    return sortByBracketThenTime(filtered);
  }, [flights, actionableOnly]);

  const rows = showAll ? sorted : sorted.slice(0, TOP_N);
  const decidedCount = sorted.filter((f) => decisions[flightKey(f)]).length;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Act now</h2>
          <p className="text-muted-foreground text-sm">
            Ordered by delay severity, then departure time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-xs font-semibold tabular-nums">
            {decidedCount} of {sorted.length} actioned
          </span>
          <button
            type="button"
            onClick={() => setActionableOnly((v) => !v)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
              actionableOnly
                ? "border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {actionableOnly ? "Showing actionable only" : "Show actionable only"}
          </button>
        </div>
      </div>

      <div className="border-border overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border bg-muted/40 border-b text-left">
              <th className="px-4 py-2 font-medium">Flight</th>
              <th className="px-4 py-2 font-medium">Route</th>
              <th className="px-4 py-2 font-medium">STD</th>
              <th className="px-4 py-2 font-medium">Severity</th>
              <th className="px-4 py-2 font-medium">Why</th>
              <th className="px-4 py-2 font-medium">Recommended action</th>
              <th className="px-4 py-2 text-right font-medium">Avoidable loss</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((flight) => {
              const decision = decisions[flightKey(flight)];
              return (
                <tr
                  key={flightKey(flight)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Lock in an action for ${flight.code}`}
                  onClick={() => setActiveFlight(flight)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveFlight(flight);
                    }
                  }}
                  className={cn(
                    "border-border hover:bg-muted/40 focus-visible:bg-muted/40 cursor-pointer border-b align-top transition-colors outline-none last:border-0",
                    decision && "opacity-60"
                  )}
                >
                  <td className="px-4 py-3">
                    <span className="font-semibold">{flight.code}</span>
                    <span className="text-muted-foreground block text-xs">
                      {flight.aircraft} · {flight.pax} pax
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 font-medium">
                      FRA
                      <ArrowRight className="text-muted-foreground h-3 w-3" />
                      {flight.destination}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {flight.destinationName}
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{flight.scheduled}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      <BracketBadge bracket={flight.bracket} />
                      <SeverityBar
                        probability={flight.delayProbability}
                        bracket={flight.bracket}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wide">
                      {reasonCopy[flight.reasonType]}
                    </span>
                    <p className="max-w-60">{flight.reasonText}</p>
                  </td>
                  <td className="text-muted-foreground px-4 py-3">
                    {decision ? (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-emerald-600 dark:text-emerald-400 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                          <Check className="h-3 w-3" /> Actioned
                        </span>
                        <span className="text-foreground flex items-start gap-2 font-medium">
                          <Check className="text-emerald-600 dark:text-emerald-400 mt-0.5 h-3.5 w-3.5 shrink-0" />
                          {decision}
                        </span>
                      </div>
                    ) : (
                      <BracketActions flight={flight} compact />
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">
                    {flight.avoidableLoss > 0 ? eur(flight.avoidableLoss) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          Showing {rows.length} of {sorted.length} flights. Click a row to lock in a decision.
        </p>
        {sorted.length > TOP_N && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="border-border text-muted-foreground hover:text-foreground rounded-full border px-3 py-1 text-xs font-semibold transition-colors"
          >
            {showAll ? `Show top ${TOP_N}` : `Show all ${sorted.length}`}
          </button>
        )}
      </div>

      <DecisionDialog
        flight={activeFlight}
        chosen={activeFlight ? decisions[flightKey(activeFlight)] : undefined}
        onChoose={(action) => {
          if (!activeFlight) return;
          setDecisions((prev) => ({ ...prev, [flightKey(activeFlight)]: action }));
          setActiveFlight(null);
        }}
        onClear={() => {
          if (!activeFlight) return;
          setDecisions((prev) => {
            const next = { ...prev };
            delete next[flightKey(activeFlight)];
            return next;
          });
          setActiveFlight(null);
        }}
        onOpenChange={(open) => {
          if (!open) setActiveFlight(null);
        }}
      />
    </section>
  );
}
