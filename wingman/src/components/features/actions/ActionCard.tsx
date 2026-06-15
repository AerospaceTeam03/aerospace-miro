import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Placeholder — to be driven by recommendations generated from the risk model.
// Turns a flagged flight into a concrete decision the controller can act on.
const priorityStyles = {
  low: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  high: "bg-red-500/15 text-red-600 dark:text-red-400",
};

export default function ActionCard({
  flight,
  priority,
  recommendation,
  reason,
  window: actionWindow,
}: {
  flight: string;
  priority: "low" | "medium" | "high";
  recommendation: string;
  reason: string;
  window: string;
}) {
  return (
    <div className="border-border flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-foreground font-semibold">{flight}</span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-semibold capitalize",
              priorityStyles[priority]
            )}
          >
            {priority}
          </span>
          <span className="text-muted-foreground text-xs">
            act within {actionWindow}
          </span>
        </div>
        <p className="text-foreground text-sm font-medium">{recommendation}</p>
        <p className="text-muted-foreground text-xs">{reason}</p>
      </div>

      <div className="flex shrink-0 gap-2">
        <Button variant="default" size="sm">
          Accept
        </Button>
        <Button variant="ghost" size="sm">
          Dismiss
        </Button>
      </div>
    </div>
  );
}
