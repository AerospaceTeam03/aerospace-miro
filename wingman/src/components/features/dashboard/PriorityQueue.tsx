"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import BracketActions from "./BracketActions";
import BracketBadge from "./BracketBadge";
import SeverityBar from "./SeverityBar";
import {
  eur,
  isActionable,
  reasonCopy,
  sortByBracketThenTime,
  type Flight,
} from "./data";

const TOP_N = 10;

export default function PriorityQueue({ flights }: { flights: Flight[] }) {
  const [actionableOnly, setActionableOnly] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const sorted = useMemo(() => {
    const filtered = actionableOnly ? flights.filter(isActionable) : flights;
    return sortByBracketThenTime(filtered);
  }, [flights, actionableOnly]);

  const rows = showAll ? sorted : sorted.slice(0, TOP_N);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Act now</h2>
          <p className="text-muted-foreground text-sm">
            Ordered by delay severity, then departure time.
          </p>
        </div>
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
            {rows.map((flight, i) => (
              <tr
                key={`${flight.code}-${flight.scheduled}-${i}`}
                className="border-border border-b align-top last:border-0"
              >
                <td className="p-0">
                  <Link
                    href={`/flight-deep-detail/${encodeURIComponent(flight.code)}`}
                    className="hover:bg-muted/40 flex flex-col px-4 py-3"
                  >
                    <span className="font-semibold">{flight.code}</span>
                    <span className="text-muted-foreground text-xs">
                      {flight.aircraft} · {flight.pax} pax
                    </span>
                  </Link>
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
                  <BracketActions bracket={flight.bracket} compact />
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
                  {flight.avoidableLoss > 0 ? eur(flight.avoidableLoss) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          Showing {rows.length} of {sorted.length} flights. Each row links to the Flight Deep
          Detail view.
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
    </section>
  );
}
