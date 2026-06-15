import { cn } from "@/lib/utils";
import type { TurnaroundStep } from "@/types/flightDetail";

const statusStyles: Record<TurnaroundStep["status"], string> = {
  ok: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  at_risk: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  bottleneck: "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400",
};

const statusLabel: Record<TurnaroundStep["status"], string> = {
  ok: "On track",
  at_risk: "At risk",
  bottleneck: "Bottleneck",
};

export default function TurnaroundTimeline({
  steps,
  bottleneckNote,
}: {
  steps: TurnaroundStep[];
  bottleneckNote: string;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Ground turnaround timeline</h2>

      <div className="border-border overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border bg-muted/40 border-b text-left">
              <th className="px-4 py-2 font-medium">Step</th>
              <th className="px-4 py-2 font-medium tabular-nums">Scheduled</th>
              <th className="px-4 py-2 font-medium tabular-nums">Estimated</th>
              <th className="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((step) => (
              <tr
                key={step.label}
                className={cn(
                  "border-border border-b last:border-0",
                  step.status === "bottleneck" && "bg-red-500/5"
                )}
              >
                <td className="px-4 py-2.5 font-medium">{step.label}</td>
                <td className="px-4 py-2.5 font-mono tabular-nums text-muted-foreground">
                  {step.scheduledTime}
                </td>
                <td className={cn(
                  "px-4 py-2.5 font-mono tabular-nums font-semibold",
                  step.estimatedTime !== step.scheduledTime
                    ? step.status === "bottleneck"
                      ? "text-red-600 dark:text-red-400"
                      : "text-amber-600 dark:text-amber-400"
                    : "text-foreground"
                )}>
                  {step.estimatedTime}
                </td>
                <td className="px-4 py-2.5">
                  <span className={cn(
                    "rounded-full border px-2 py-0.5 text-xs font-semibold",
                    statusStyles[step.status]
                  )}>
                    {statusLabel[step.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-muted-foreground text-xs">{bottleneckNote}</p>
    </section>
  );
}
