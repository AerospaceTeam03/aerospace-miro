import { cn } from "@/lib/utils";
import { riskCopy, type RiskLevel } from "./data";

const riskStyles: Record<RiskLevel, string> = {
  RED: "bg-red-500/15 text-red-600 dark:text-red-400",
  AMBER: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  GREEN: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

export default function RiskBadge({ risk }: { risk: RiskLevel }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-semibold",
        riskStyles[risk]
      )}
    >
      {riskCopy[risk]}
    </span>
  );
}
