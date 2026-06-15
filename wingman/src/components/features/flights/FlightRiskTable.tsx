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
    flight: "LH 402",
    route: "FRA → JFK",
    scheduled: "08:10",
    level: "high",
    risk: 78,
    driver: "Inbound aircraft delayed 2 legs back",
    action: "Swap to standby tail",
  },
  {
    flight: "LH 711",
    route: "FRA → ORD",
    scheduled: "09:25",
    level: "high",
    risk: 64,
    driver: "Thunderstorms forecast at departure",
    action: "Hold connecting pax, pre-alert crew",
  },
  {
    flight: "LH 1024",
    route: "MUC → LHR",
    scheduled: "10:05",
    level: "medium",
    risk: 41,
    driver: "Crew approaching duty limit",
    action: "Line up reserve crew",
  },
  {
    flight: "LH 218",
    route: "FRA → CDG",
    scheduled: "10:40",
    level: "low",
    risk: 12,
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
