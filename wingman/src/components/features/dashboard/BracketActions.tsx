import { Check } from "lucide-react";
import { brackets, type Bracket } from "./data";

// The predefined dispatcher action set for a bracket (assets/brackets-action-map.md).
// `compact` shows the first three actions plus a "+N" count for the queue rows; the full
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
    const shown = actions.slice(0, 3);
    const remaining = actions.length - shown.length;
    return (
      <ul className="flex flex-col gap-1">
        {shown.map((action) => (
          <li key={action.label} className="flex items-start gap-2">
            <Check className="text-muted-foreground mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="font-medium">{action.label}</span>
          </li>
        ))}
        {remaining > 0 && (
          <li className="text-muted-foreground pl-[1.375rem] text-xs tabular-nums">
            +{remaining} more
          </li>
        )}
      </ul>
    );
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {actions.map((action) => (
        <li key={action.label} className="flex items-start gap-2 text-sm">
          <Check className="text-muted-foreground mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{action.label}</span>
        </li>
      ))}
    </ul>
  );
}
