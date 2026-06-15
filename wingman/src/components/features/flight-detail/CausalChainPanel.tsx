import type { CausalStep } from "@/types/flightDetail";
import { AlertTriangle } from "lucide-react";

// Narrative causal chain for fixture flights.
// Each step is a plain-English fact grounded in real data fields.
export default function CausalChainPanel({ steps }: { steps: CausalStep[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Causal chain</h2>
      <p className="text-muted-foreground text-xs">
        Step-by-step explanation of why this flight is at risk. Every fact is
        grounded in data — no black-box scoring.
      </p>

      <ol className="flex flex-col gap-2">
        {steps.map((s, i) => (
          <li
            key={i}
            className={`border-border flex gap-3 rounded-xl border p-3 ${
              s.isBottleneck ? "border-amber-500/40 bg-amber-500/10" : ""
            }`}
          >
            {/* Step number */}
            <span className="text-muted-foreground mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums">
              {i + 1}
            </span>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <p className="text-foreground text-sm font-semibold">{s.step}</p>
                {s.isBottleneck && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="size-3" />
                    Bottleneck
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-xs">{s.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
