"use client";

// Compact "Flight Briefing" layout for the rich fixture flights. Condenses the
// previously long stacked detail view into: a one-row header, a decision card
// (why / action / impact), three tabs (Risk / Operations / Cost) and collapsed
// progressive-disclosure sections for secondary / demo-only detail. Reuses the
// existing presentational components rather than introducing new data.

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FlightFixture, RiskLevel } from "@/types/flightDetail";
import type { SimulatorInputs } from "@/lib/riskUtils";
import ScenarioSimulator from "./ScenarioSimulator";
import TurnaroundTimeline from "./TurnaroundTimeline";
import InboundChain from "./InboundChain";
import WeatherPanel from "./WeatherPanel";
import AuditTrail from "./AuditTrail";
import ValidationOutcome from "./ValidationOutcome";

export type CostSummary = {
  gross: number;
  mitigated: number;
  avoidable: number;
  crossesEu261: boolean;
  thresholdMin: number;
  bracketLabel: string;
  recoveryMin: number;
};

const causeLabel: Record<FlightFixture["causeCategory"], string> = {
  CASCADE: "Late inbound aircraft (cascade)",
  WEATHER: "Weather-driven ground friction",
  CONGESTION: "ATC / departure bank congestion",
  TIGHT_TURNAROUND: "Tight turnaround window",
  COMBINED: "Combined factors",
};

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
const impactStyles: Record<"High" | "Medium" | "Low", string> = {
  High: "text-red-600 dark:text-red-400",
  Medium: "text-amber-600 dark:text-amber-400",
  Low: "text-muted-foreground",
};

const eur = (n: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));

const firstSentence = (text: string) => {
  const t = text.split(". ")[0].trim();
  return t.endsWith(".") ? t : `${t}.`;
};

type TabId = "risk" | "ops" | "cost";

export default function FlightBriefing({
  flight,
  cost,
  simInitial,
}: {
  flight: FlightFixture;
  cost: CostSummary | null;
  simInitial: SimulatorInputs;
}) {
  const [tab, setTab] = useState<TabId>("risk");
  const primaryAlt = flight.alternativeActions[0];

  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Link>

      {/* ── 1. Briefing header (one compact row) ─────────────────────────── */}
      <header className="border-border flex flex-col gap-3 rounded-xl border p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-xl font-bold">{flight.flightNumber}</span>
          <span className="text-foreground text-sm font-semibold">
            {flight.origin} → {flight.destination}
          </span>
          <Chip>{flight.tail}</Chip>
          <span className="text-muted-foreground text-xs tabular-nums">
            dep {flight.scheduledDep} · {flight.distanceKm.toLocaleString("en-US")} km
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-xs">{causeLabel[flight.causeCategory]}</span>
          <span className="text-muted-foreground text-xs">·</span>
          <span className="text-muted-foreground text-xs tabular-nums">
            {flight.interventionWindow}
          </span>
          <div className={cn("flex items-center gap-2 rounded-xl px-3 py-1.5 ring-1", riskStyles[flight.risk])}>
            <span className={cn("size-2.5 shrink-0 rounded-full", dotStyles[flight.risk])} />
            <span className="text-sm font-bold tracking-wide">{flight.risk}</span>
            <span className="text-xs font-medium tabular-nums opacity-80">{flight.riskScore}/100</span>
          </div>
        </div>
      </header>

      {/* ── 2. Decision card (why / action / impact) ─────────────────────── */}
      <section className="grid gap-2 sm:grid-cols-3">
        <DecisionCell label="Why flagged" tone="neutral">
          <p className="text-foreground text-sm font-medium">{causeLabel[flight.causeCategory]}</p>
          <p className="text-muted-foreground mt-0.5 text-xs">{firstSentence(flight.explanation)}</p>
        </DecisionCell>
        <DecisionCell label="Action now" tone={flight.risk}>
          <p className="text-foreground text-sm font-medium">{flight.recommendedAction}</p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {flight.owner} · {flight.interventionWindow}
          </p>
        </DecisionCell>
        <DecisionCell label="Impact if ignored" tone="neutral">
          <p className="text-foreground text-sm font-medium">{firstSentence(flight.expectedImpact)}</p>
          {cost && (
            <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">
              Exposure {eur(cost.gross)} · avoidable{" "}
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {eur(cost.avoidable)}
              </span>
            </p>
          )}
        </DecisionCell>
      </section>

      {/* ── 3. Tabs: Risk / Operations / Cost ────────────────────────────── */}
      <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1 text-sm">
        {([
          { id: "risk", label: "Risk" },
          { id: "ops", label: "Operations" },
          { id: "cost", label: "Cost" },
        ] as const).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 font-medium transition-colors",
              tab === t.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="border-border rounded-xl border p-3">
        {tab === "risk" && <RiskTab flight={flight} />}
        {tab === "ops" && <OpsTab flight={flight} primaryAlt={primaryAlt} />}
        {tab === "cost" && <CostTab flight={flight} cost={cost} />}
      </div>

      {/* ── 4. Progressive disclosure (collapsed by default) ─────────────── */}
      <Disclosure summary="Scenario simulator">
        <ScenarioSimulator initialInputs={simInitial} />
      </Disclosure>
      <Disclosure summary="Extended weather detail">
        <WeatherPanel weather={flight.weather} />
      </Disclosure>
      <Disclosure summary="Decision audit trail">
        <AuditTrail entries={flight.auditTrail} />
      </Disclosure>
      <Disclosure summary="Historical outcome (demo / judge only)">
        <ValidationOutcome outcome={flight.validation} />
      </Disclosure>
    </div>
  );
}

// ── Tab bodies ──────────────────────────────────────────────────────────────

function RiskTab({ flight }: { flight: FlightFixture }) {
  const steps = flight.causalSteps.slice(0, 4);
  const drivers = flight.riskDrivers.slice(0, 3);
  return (
    <div className="flex flex-col gap-3">
      <div>
        <SubLabel>Causal chain</SubLabel>
        <ol className="mt-1.5 flex flex-col gap-1">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-muted-foreground tabular-nums">{i + 1}.</span>
              <span>
                <span className={cn("font-medium", s.isBottleneck && "text-amber-600 dark:text-amber-400")}>
                  {s.step}
                </span>
                {s.isBottleneck && (
                  <span className="ml-1.5 rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                    Bottleneck
                  </span>
                )}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="border-border/60 border-t pt-3">
        <SubLabel>Top risk drivers</SubLabel>
        <ul className="mt-1.5 flex flex-col gap-1.5">
          {drivers.map((d) => (
            <li key={d.name} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2">
                {d.breached && <span className="size-1.5 shrink-0 rounded-full bg-red-500" />}
                <span className="font-medium">{d.name}</span>
                <span className="text-muted-foreground font-mono text-xs">{d.value}</span>
              </span>
              <span className={cn("shrink-0 text-xs font-semibold", impactStyles[d.impact])}>
                {d.impact}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-border/60 border-t pt-3">
        <SubLabel>Confidence / data status</SubLabel>
        <p className="text-foreground mt-1 text-sm">
          {flight.confidenceLevel} confidence —{" "}
          <span className="text-muted-foreground">{flight.confidenceReason}</span>
        </p>
      </div>
    </div>
  );
}

function OpsTab({
  flight,
  primaryAlt,
}: {
  flight: FlightFixture;
  primaryAlt?: FlightFixture["alternativeActions"][number];
}) {
  return (
    <div className="flex flex-col gap-4">
      <TurnaroundTimeline steps={flight.turnaroundSteps} bottleneckNote={flight.turnaroundBottleneck} />
      <InboundChain legs={flight.inboundChain} />
      <div className="border-border/60 grid gap-3 border-t pt-3 sm:grid-cols-2">
        <div>
          <SubLabel>Owner & recommended action</SubLabel>
          <p className="text-foreground mt-1 text-sm font-medium">{flight.recommendedAction}</p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {flight.owner} · {flight.interventionWindow}
          </p>
        </div>
        {primaryAlt && (
          <div>
            <SubLabel>Alternative</SubLabel>
            <p className="text-foreground mt-1 text-sm font-medium">
              {primaryAlt.label}
              {primaryAlt.minutesRecovered > 0 && (
                <span className="ml-1.5 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  ~{primaryAlt.minutesRecovered} min
                </span>
              )}
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">{primaryAlt.tradeOff}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CostTab({ flight, cost }: { flight: FlightFixture; cost: CostSummary | null }) {
  if (!cost) {
    // No matching priced flight — fall back to the impact text already in the
    // fixture rather than inventing figures.
    return (
      <div className="flex flex-col gap-2 text-sm">
        <p className="text-foreground">{flight.expectedImpact}</p>
        <p className="text-muted-foreground text-xs">{flight.eu261Exposure}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2 text-center">
        <CostStat label="Gross exposure" value={eur(cost.gross)} tone="text-foreground" />
        <CostStat label="Mitigated" value={eur(cost.mitigated)} tone="text-foreground" />
        <CostStat
          label={`Avoidable (−${cost.recoveryMin} min)`}
          value={eur(cost.avoidable)}
          tone="text-emerald-600 dark:text-emerald-400"
        />
      </div>
      <div
        className={cn(
          "rounded-lg border px-3 py-2 text-xs",
          cost.crossesEu261
            ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
            : "border-border text-muted-foreground"
        )}
      >
        {cost.crossesEu261
          ? `EU261 cliff crossed — delay exceeds the ${cost.thresholdMin}-min compensation threshold.`
          : `Below the EU261 ${cost.thresholdMin}-min compensation threshold.`}
      </div>
      <p className="text-muted-foreground text-[11px] leading-relaxed">
        <span className="text-foreground font-semibold">Method.</span> {cost.bracketLabel}. Estimate from
        delay brackets, aircraft size, passenger count and EU261-style exposure. Not an accounting system.
      </p>
    </div>
  );
}

// ── Small building blocks ─────────────────────────────────────────────────────

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="border-border text-muted-foreground rounded-full border px-2 py-0.5 font-mono text-xs">
      {children}
    </span>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">{children}</p>
  );
}

function DecisionCell({
  label,
  tone,
  children,
}: {
  label: string;
  tone: RiskLevel | "neutral";
  children: React.ReactNode;
}) {
  const toneStyle =
    tone === "RED"
      ? "border-red-500/40 bg-red-500/5"
      : tone === "AMBER"
        ? "border-amber-500/40 bg-amber-500/5"
        : tone === "GREEN"
          ? "border-emerald-500/40 bg-emerald-500/5"
          : "border-border";
  return (
    <div className={cn("flex flex-col gap-1 rounded-xl border p-3", toneStyle)}>
      <SubLabel>{label}</SubLabel>
      {children}
    </div>
  );
}

function CostStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="bg-muted/40 rounded-lg py-2">
      <p className="text-muted-foreground text-[10px] uppercase">{label}</p>
      <p className={cn("mt-0.5 text-sm font-bold tabular-nums", tone)}>{value}</p>
    </div>
  );
}

function Disclosure({ summary, children }: { summary: string; children: React.ReactNode }) {
  return (
    <details className="border-border group rounded-xl border">
      <summary className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm font-medium select-none">
        {summary}
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-border/60 border-t p-3">{children}</div>
    </details>
  );
}
