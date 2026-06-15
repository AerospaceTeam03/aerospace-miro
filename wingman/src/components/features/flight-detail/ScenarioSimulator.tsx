"use client";

import { cn } from "@/lib/utils";
import { calculateScenarioRisk, type SimulatorInputs } from "@/lib/riskUtils";
import type { RiskLevel } from "@/types/flightDetail";
import { useState } from "react";

const riskBadgeStyles: Record<RiskLevel, string> = {
  RED: "bg-red-500/15 text-red-600 dark:text-red-400 ring-red-500/40",
  AMBER: "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/40",
  GREEN: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/40",
};

// Default simulator state matches the AA 1450 RED cascade scenario
const DEFAULT_INPUTS: SimulatorInputs = {
  inboundDelayMin: 60,
  turnaroundMin: 48,
  weatherSeverity: "none",
  congestionLevel: "low",
  action: "none",
};

export default function ScenarioSimulator({
  initialInputs = DEFAULT_INPUTS,
}: {
  initialInputs?: Partial<SimulatorInputs>;
}) {
  const [inputs, setInputs] = useState<SimulatorInputs>({
    ...DEFAULT_INPUTS,
    ...initialInputs,
  });

  const result = calculateScenarioRisk(inputs);

  function set<K extends keyof SimulatorInputs>(key: K, value: SimulatorInputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">What-if scenario simulator</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          Deterministic formula — not a trained model
        </span>
      </div>

      <p className="text-muted-foreground text-xs">
        Adjust the inputs below to see how the risk changes. The formula is
        transparent: every factor is shown in the output explanation.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {/* ── Inputs ────────────────────────────────────── */}
        <div className="border-border flex flex-col gap-4 rounded-xl border p-4">
          <p className="text-sm font-semibold">Adjust scenario inputs</p>

          {/* Inbound delay slider */}
          <SliderField
            label={`Inbound delay: ${inputs.inboundDelayMin} min`}
            min={0}
            max={90}
            value={inputs.inboundDelayMin}
            onChange={(v) => set("inboundDelayMin", v)}
            note="Risk rises sharply above 15 min"
          />

          {/* Turnaround slider */}
          <SliderField
            label={`Turnaround duration: ${inputs.turnaroundMin} min`}
            min={30}
            max={90}
            value={inputs.turnaroundMin}
            onChange={(v) => set("turnaroundMin", v)}
            note="Safe threshold is 60 min"
          />

          {/* Weather severity */}
          <SelectField
            label="Weather severity"
            value={inputs.weatherSeverity}
            onChange={(v) => set("weatherSeverity", v as SimulatorInputs["weatherSeverity"])}
            options={[
              { value: "none", label: "None — clear conditions" },
              { value: "light", label: "Light — drizzle or light snow" },
              { value: "heavy", label: "Heavy — snow showers or gusts >50 km/h" },
            ]}
          />

          {/* Congestion level */}
          <SelectField
            label="Departure bank congestion"
            value={inputs.congestionLevel}
            onChange={(v) => set("congestionLevel", v as SimulatorInputs["congestionLevel"])}
            options={[
              { value: "low", label: "Low — normal flow" },
              { value: "moderate", label: "Moderate — ATC ground stop recently lifted" },
              { value: "high", label: "High — active ground stop, peak bank" },
            ]}
          />

          {/* Mitigation action */}
          <SelectField
            label="Selected mitigation action"
            value={inputs.action}
            onChange={(v) => set("action", v as SimulatorInputs["action"])}
            options={[
              { value: "none", label: "None — no action taken" },
              { value: "aircraft_swap", label: "Aircraft swap (−30 pts, ~30 min)" },
              { value: "extra_crew", label: "Extra ground crew (−15 pts, ~15 min)" },
              { value: "retime", label: "Retime departure (−20 pts, ~20 min)" },
              { value: "standby_crew", label: "Standby crew called (−10 pts, ~10 min)" },
            ]}
          />
        </div>

        {/* ── Results ────────────────────────────────────── */}
        <div className="border-border flex flex-col gap-3 rounded-xl border p-4">
          <p className="text-sm font-semibold">Simulated outcome</p>

          {/* Risk level */}
          <div className="flex items-center gap-3">
            <span className={cn("rounded-2xl px-4 py-2 text-lg font-bold ring-1", riskBadgeStyles[result.level])}>
              {result.level}
            </span>
            <div>
              <p className="text-foreground text-sm font-semibold tabular-nums">
                Score: {result.score}/100
              </p>
              <p className="text-muted-foreground text-xs">{result.delayBand}</p>
            </div>
          </div>

          {/* Minutes recovered */}
          {result.minutesRecovered > 0 && (
            <div className="rounded-lg bg-emerald-500/10 px-3 py-2">
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                ~{result.minutesRecovered} min recovered by selected action
              </p>
            </div>
          )}

          {/* Explanation */}
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
              Explanation
            </p>
            <p className="text-foreground text-sm">{result.explanation}</p>
          </div>

          {/* Formula legend */}
          <details className="mt-auto">
            <summary className="text-muted-foreground cursor-pointer text-xs hover:text-foreground">
              Show scoring formula
            </summary>
            <div className="text-muted-foreground mt-2 space-y-1 text-xs">
              <p>• Inbound delay &gt;15 min: +2 pts per minute (max +40)</p>
              <p>• Turnaround &lt;60 min: +1.5 pts per minute below threshold (max +30)</p>
              <p>• Light weather: +10 pts</p>
              <p>• Heavy weather: +25 pts</p>
              <p>• Moderate congestion: +10 pts</p>
              <p>• High congestion: +20 pts</p>
              <p>• Aircraft swap: −30 pts · Retime: −20 pts</p>
              <p>• Extra crew: −15 pts · Standby crew: −10 pts</p>
              <p>• RED ≥70 · AMBER ≥40 · GREEN &lt;40</p>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}

// ── Local UI primitives ──────────────────────────────────────────────────────

function SliderField({
  label,
  min,
  max,
  value,
  onChange,
  note,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  note: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-foreground text-xs font-semibold">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
      <p className="text-muted-foreground text-xs">{note}</p>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-foreground text-xs font-semibold">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-border bg-background text-foreground rounded-lg border px-2 py-1.5 text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
