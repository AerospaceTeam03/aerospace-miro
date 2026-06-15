import KpiCards from "@/components/features/dashboard/KpiCards";
import FlightTable from "@/components/features/dashboard/FlightTable";
import OperationalClock from "@/components/features/dashboard/OperationalClock";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <OperationalClock />
      </header>

      <KpiCards />
      <FlightTable />
    </div>
  );
}
