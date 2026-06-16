import { cn } from "@/lib/utils";
import { brackets, type Bracket } from "./data";

// Width encodes the model's delay probability; colour encodes the severity bracket.
export default function SeverityBar({
  probability,
  bracket,
}: {
  probability: number;
  bracket: Bracket;
}) {
  const pct = Math.round(probability * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="bg-muted h-2 w-full min-w-20 overflow-hidden rounded-full">
        <div
          className={cn("h-full rounded-full", brackets[bracket].bar)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-muted-foreground w-9 text-right text-xs tabular-nums">
        {pct}%
      </span>
    </div>
  );
}
