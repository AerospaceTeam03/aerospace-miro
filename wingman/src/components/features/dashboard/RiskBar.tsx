import { cn } from "@/lib/utils";
import type { RiskLevel } from "./data";

const riskBarStyles: Record<RiskLevel, string> = {
  RED: "bg-red-500",
  AMBER: "bg-amber-500",
  GREEN: "bg-emerald-500",
};

export default function RiskBar({
  score,
  risk,
}: {
  score: number;
  risk: RiskLevel;
}) {
  return (
    <div className="bg-muted h-2 w-full min-w-24 overflow-hidden rounded-full">
      <div
        className={cn("h-full rounded-full", riskBarStyles[risk])}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}
