import { cn } from "@/lib/utils";
import { riskCopy, type RiskLevel } from "@/components/features/dashboard/data";

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

export default function BigRiskLight({ risk }: { risk: RiskLevel }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl px-5 py-3 ring-1",
        riskStyles[risk]
      )}
    >
      <span className={cn("size-4 shrink-0 rounded-full", dotStyles[risk])} />
      <span className="text-xl font-bold tracking-wide">{riskCopy[risk]}</span>
    </div>
  );
}
