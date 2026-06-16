import { Check } from "lucide-react";
import { brackets, type Bracket } from "./data";

// The predefined dispatcher action set for a bracket (assets/brackets-action-map.md).
// `compact` shows the primary action plus a "+N" count for the queue rows; the full
// checklist is shown when expanded.
export default function BracketActions({
  bracket,
  compact = false,
}: {
  bracket: Bracket;
  compact?: boolean;
}) {
  const actions = brackets[bracket].actions;

  if (compact) {
    const [primary, ...rest] = actions;
    return (
      <span className="flex items-center gap-2">
        <span className="font-medium">{primary}</span>
        {rest.length > 0 && (
          <span className="text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 text-xs tabular-nums">
            +{rest.length}
          </span>
        )}
      </span>
    );
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {actions.map((action) => (
        <li key={action} className="flex items-start gap-2 text-sm">
          <Check className="text-muted-foreground mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{action}</span>
        </li>
      ))}
    </ul>
  );
}
