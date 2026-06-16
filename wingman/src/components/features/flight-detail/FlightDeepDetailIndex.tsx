"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { flights, type CauseCode, type RiskLevel } from "@/components/features/flight-detail/flightsData";
import RiskBadge from "@/components/features/flight-detail/RiskBadge";
import { flightDetails } from "@/components/features/flight-detail/data";
import { fixtureFlights } from "@/data/flightDetails.fixture";

const riskOrder: Record<RiskLevel, number> = { RED: 0, AMBER: 1, GREEN: 2 };

const causeReason: Record<CauseCode, string> = {
  CASCADE: "Late inbound aircraft eating into a tight turnaround.",
  WEATHER: "Weather at or near operational limits adding ground delay.",
  CONGESTION: "Airport congestion / ATC flow control queuing the departure.",
  CARRIER: "Normal operations — no upstream delay detected.",
};

// Short, human reason for a flight: prefer the hand-crafted fixture explanation.
function reasonFor(code: string, cause: CauseCode): string {
  const fixture = fixtureFlights[code];
  if (fixture) {
    const first = fixture.explanation.split(". ")[0];
    return first.endsWith(".") ? first : `${first}.`;
  }
  return causeReason[cause];
}

function actionFor(code: string): string {
  return fixtureFlights[code]?.recommendedAction ?? flightDetails[code]?.recommendation ?? "—";
}

function tailFor(code: string): string {
  return fixtureFlights[code]?.tail ?? "—";
}

type Tab = "ALL" | RiskLevel;
const tabs: Tab[] = ["ALL", "RED", "AMBER", "GREEN"];

export default function FlightDeepDetailIndex() {
  const [tab, setTab] = useState<Tab>("ALL");

  const counts = useMemo(
    () => ({
      RED: flights.filter((f) => f.risk === "RED").length,
      AMBER: flights.filter((f) => f.risk === "AMBER").length,
      GREEN: flights.filter((f) => f.risk === "GREEN").length,
    }),
    []
  );

  const rows = useMemo(() => {
    const filtered = tab === "ALL" ? flights : flights.filter((f) => f.risk === tab);
    return [...filtered].sort((a, b) => {
      const riskDiff = riskOrder[a.risk] - riskOrder[b.risk];
      if (riskDiff !== 0) return riskDiff;
      return b.riskScore - a.riskScore;
    });
  }, [tab]);

  // ── Empty / error fallback ────────────────────────────────────────────────
  if (flights.length === 0) {
    return (
      <div className="border-border text-muted-foreground flex flex-col items-center gap-2 rounded-xl border border-dashed p-10 text-center">
        <TriangleAlert className="size-6" />
        <p className="font-medium">No flight data available</p>
        <p className="text-sm">Fixtures are missing or failed to load. Check the data feed.</p>
      </div>
    );
  }

  const summary: { level: RiskLevel; label: string; style: string }[] = [
    { level: "RED", label: "Red — act now", style: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400" },
    { level: "AMBER", label: "Amber — monitor", style: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400" },
    { level: "GREEN", label: "Green — nominal", style: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {summary.map((s) => (
          <div key={s.level} className={cn("flex flex-col gap-1 rounded-xl border p-4", s.style)}>
            <span className="text-3xl font-bold tabular-nums">{counts[s.level]}</span>
            <span className="text-xs font-semibold tracking-wide uppercase opacity-80">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
              tab === t
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "ALL" ? "All" : t.charAt(0) + t.slice(1).toLowerCase()}
            {t !== "ALL" && <span className="ml-1 opacity-70">{counts[t]}</span>}
          </button>
        ))}
      </div>

      {/* Most critical flights */}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Most critical flights</h2>
        <ul className="flex flex-col gap-3">
          {rows.map((f) => (
            <li key={f.code}>
              <Link
                href={`/flight-deep-detail/${encodeURIComponent(f.code)}`}
                className="border-border hover:border-primary/50 hover:bg-muted/40 group flex flex-col gap-3 rounded-xl border p-4 transition-colors sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{f.code}</span>
                    <span className="text-muted-foreground text-sm">FRA → {f.destination}</span>
                    <span className="text-muted-foreground text-sm">· Tail {tailFor(f.code)}</span>
                    <RiskBadge risk={f.risk} />
                  </div>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Reason: </span>
                    {reasonFor(f.code, f.cause)}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Recommended: </span>
                    {actionFor(f.code)}
                  </p>
                </div>
                <span className="text-primary flex shrink-0 items-center gap-1 self-end text-sm font-semibold sm:self-center">
                  Open deep detail
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
