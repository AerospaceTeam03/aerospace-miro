"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMemo, useState } from "react";
import { flights, type RiskLevel } from "./data";
import RiskBadge from "./RiskBadge";
import RiskBar from "./RiskBar";

const riskOrder: Record<RiskLevel, number> = { RED: 0, AMBER: 1, GREEN: 2 };

export default function FlightTable() {
  const [showOnlyRed, setShowOnlyRed] = useState(false);

  const rows = useMemo(() => {
    const filtered = showOnlyRed
      ? flights.filter((f) => f.risk === "RED")
      : flights;

    return [...filtered].sort((a, b) => {
      const riskDiff = riskOrder[a.risk] - riskOrder[b.risk];
      if (riskDiff !== 0) return riskDiff;
      return a.scheduled.localeCompare(b.scheduled);
    });
  }, [showOnlyRed]);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Today&apos;s flights</h2>
        <button
          type="button"
          onClick={() => setShowOnlyRed((v) => !v)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
            showOnlyRed
              ? "border-red-500/40 bg-red-500/15 text-red-600 dark:text-red-400"
              : "border-border text-muted-foreground hover:text-foreground"
          )}
        >
          {showOnlyRed ? "Showing reds only" : "Show reds only"}
        </button>
      </div>

      <div className="border-border overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border bg-muted/40 border-b text-left">
              <th className="px-4 py-2 font-medium">Flight</th>
              <th className="px-4 py-2 font-medium">Destination</th>
              <th className="px-4 py-2 font-medium">Scheduled</th>
              <th className="px-4 py-2 font-medium">Risk</th>
              <th className="px-4 py-2 font-medium">Cause</th>
              <th className="px-4 py-2 font-medium">Risk level</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((flight) => (
              <tr key={flight.code} className="border-border border-b last:border-0">
                <td className="p-0">
                  <Link
                    href={`/flight-deep-detail/${encodeURIComponent(flight.code)}`}
                    className="hover:bg-muted/40 flex items-center px-4 py-3 font-semibold"
                  >
                    {flight.code}
                  </Link>
                </td>
                <td className="text-muted-foreground px-4 py-3">{flight.destination}</td>
                <td className="px-4 py-3 tabular-nums">{flight.scheduled}</td>
                <td className="px-4 py-3">
                  <RiskBadge risk={flight.risk} />
                </td>
                <td className="text-muted-foreground px-4 py-3 text-xs font-medium tracking-wide">
                  {flight.cause}
                </td>
                <td className="px-4 py-3">
                  <RiskBar score={flight.riskScore} risk={flight.risk} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-muted-foreground text-xs">
        Placeholder data. Each row links to the Flight Deep Detail view.
      </p>
    </section>
  );
}
