import { cn } from "@/lib/utils";
import type { FlightDetail } from "./data";

const riskHighlight: Record<FlightDetail["risk"], string> = {
  RED: "border-red-500/40 bg-red-500/10",
  AMBER: "border-amber-500/40 bg-amber-500/10",
  GREEN: "border-emerald-500/40 bg-emerald-500/10",
};

export default function ActionBox({ flight }: { flight: FlightDetail }) {
  return (
    <section
      className={cn(
        "flex flex-col gap-2 rounded-xl border p-4",
        riskHighlight[flight.risk]
      )}
    >
      <h2 className="text-lg font-semibold">Recommended action</h2>
      <p className="text-foreground text-sm font-medium">{flight.recommendation}</p>
      <p className="text-muted-foreground text-xs">{flight.eu261Exposure}</p>
    </section>
  );
}
