import { cn } from "@/lib/utils";
import { brackets, type Bracket } from "./data";

export default function BracketBadge({
  bracket,
  showRange = true,
}: {
  bracket: Bracket;
  showRange?: boolean;
}) {
  const meta = brackets[bracket];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap",
        meta.badge
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
      {showRange && (
        <span className="font-normal opacity-70">· {meta.range}</span>
      )}
    </span>
  );
}
