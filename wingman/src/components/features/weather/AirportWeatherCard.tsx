import { cn } from "@/lib/utils";
import { Cloud, CloudRain, CloudSnow, Sun, Wind } from "lucide-react";

type Condition = "clear" | "cloudy" | "rain" | "snow" | "wind";

const conditionIcon: Record<Condition, typeof Sun> = {
  clear: Sun,
  cloudy: Cloud,
  rain: CloudRain,
  snow: CloudSnow,
  wind: Wind,
};

const impactStyles = {
  low: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  high: "bg-red-500/15 text-red-600 dark:text-red-400",
};

export default function AirportWeatherCard({
  airport,
  name,
  condition,
  summary,
  temperature,
  wind,
  impact,
}: {
  airport: string;
  name: string;
  condition: Condition;
  summary: string;
  temperature: string;
  wind: string;
  impact: "low" | "medium" | "high";
}) {
  const Icon = conditionIcon[condition];
  return (
    <div className="border-border flex flex-col gap-3 rounded-xl border p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-foreground text-lg font-bold">{airport}</p>
          <p className="text-muted-foreground text-xs">{name}</p>
        </div>
        <Icon className="text-muted-foreground size-7 shrink-0" />
      </div>

      <p className="text-muted-foreground text-sm">{summary}</p>

      <div className="text-muted-foreground flex items-center gap-4 text-sm tabular-nums">
        <span>{temperature}</span>
        <span className="flex items-center gap-1">
          <Wind className="size-3.5" /> {wind}
        </span>
      </div>

      <span
        className={cn(
          "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
          impactStyles[impact]
        )}
      >
        <span className="size-1.5 rounded-full bg-current" />
        {impact} ops impact
      </span>
    </div>
  );
}
