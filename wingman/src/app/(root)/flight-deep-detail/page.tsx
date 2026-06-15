import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import FlightDeepDetailIndex from "@/components/features/flight-detail/FlightDeepDetailIndex";

export default function FlightDeepDetailPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold">Flight Deep Detail</h1>
        <p className="text-muted-foreground">
          Operational drill-down for dispatcher decisions — pick a flight to see
          its delay risk, the factors driving it, and the recommended action.
        </p>
      </header>

      <FlightDeepDetailIndex />
    </div>
  );
}
