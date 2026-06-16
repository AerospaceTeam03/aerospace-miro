import BracketBreakdown from "@/components/features/dashboard/BracketBreakdown";
import KpiCards from "@/components/features/dashboard/KpiCards";
import OperationalClock from "@/components/features/dashboard/OperationalClock";
import PriorityQueue from "@/components/features/dashboard/PriorityQueue";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <OperationalClock />
      </header>

      <KpiCards />
      <PriorityQueue />
      <BracketBreakdown />
    </div>
  );
}
