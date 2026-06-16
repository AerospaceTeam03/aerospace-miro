import RiskBadge from "@/components/features/flights/RiskBadge";

// Placeholder data — to be replaced with real flights
// joined against weather. Shape mirrors the decision a duty controller makes:
// not a bare score, but risk + the driver behind it + a recommended action.
type FlightRisk = {
  flight: string;
  route: string;
  scheduled: string;
  level: "low" | "medium" | "high";
  risk: number;
  driver: string;
  action: string;
};

const flights: FlightRisk[] = [
  {
    flight: "4Y210",
    route: "FRA → DJE",
    scheduled: "04:45",
    level: "high",
    risk: 87,
    driver: "Inbound aircraft delayed, tight turnaround",
    action: "Swap to standby tail 4Y-M-4",
  },
  {
    flight: "4Y206",
    route: "FRA → HRG",
    scheduled: "08:20",
    level: "high",
    risk: 91,
    driver: "Thunderstorms + ATC flow restriction at FRA",
    action: "Secure controlled departure time, brief pax",
  },
  {
    flight: "4Y530",
    route: "FRA → IBZ",
    scheduled: "09:30",
    level: "medium",
    risk: 48,
    driver: "ATC ground-stop queue at FRA",
    action: "Optimise slot, monitor queue",
  },
  {
    flight: "4Y1200",
    route: "FRA → RHO",
    scheduled: "04:45",
    level: "low",
    risk: 8,
    driver: "Clear weather, on-time inbound",
    action: "No action — monitor",
  },
];

export default function FlightRiskTable() {
  return (
    <div className="border-border overflow-hidden rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-muted-foreground text-left text-xs uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 font-medium">Flight</th>
            <th className="px-4 py-3 font-medium">Route</th>
            <th className="px-4 py-3 font-medium">STD</th>
            <th className="px-4 py-3 font-medium">Delay risk</th>
            <th className="px-4 py-3 font-medium">Main driver</th>
            <th className="px-4 py-3 font-medium">Recommended action</th>
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {flights.map((f) => (
            <tr key={f.flight} className="hover:bg-muted/30 transition-colors">
              <td className="text-foreground px-4 py-3 font-semibold">
                {f.flight}
              </td>
              <td className="text-muted-foreground px-4 py-3 tabular-nums">
                {f.route}
              </td>
              <td className="text-muted-foreground px-4 py-3 tabular-nums">
                {f.scheduled}
              </td>
              <td className="px-4 py-3">
                <RiskBadge level={f.level} value={f.risk} />
              </td>
              <td className="text-muted-foreground px-4 py-3">{f.driver}</td>
              <td className="text-foreground px-4 py-3">{f.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
