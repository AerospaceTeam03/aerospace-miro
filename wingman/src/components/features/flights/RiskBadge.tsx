import { cn } from "@/lib/utils";

type RiskLevel = "low" | "medium" | "high";

const styles: Record<RiskLevel, string> = {
  low: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  high: "bg-red-500/15 text-red-600 dark:text-red-400",
};

export default function RiskBadge({
  level,
  value,
}: {
  level: RiskLevel;
  value: number;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums",
        styles[level]
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {value}%
    </span>
  );
}
