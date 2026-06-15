import Link from "next/link";
import type { FlightDetail } from "./data";

export default function DataPanel({ flight }: { flight: FlightDetail }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="border-border rounded-xl border p-4">
        <p className="text-muted-foreground text-xs uppercase tracking-wide">
          Weather at {flight.weather.location}
        </p>
        <p className="text-foreground mt-1 text-lg font-semibold">
          {flight.weather.conditions}
        </p>
        <p className="text-muted-foreground text-xs">
          {flight.weather.tempC}°C · wind {flight.weather.windKmh} km/h
          {flight.weather.snowCm > 0 && ` · snow ${flight.weather.snowCm} cm`}
        </p>
      </div>

      <div className="border-border rounded-xl border p-4">
        <p className="text-muted-foreground text-xs uppercase tracking-wide">
          Tail number
        </p>
        <Link
          href={`/tail-tracker/${encodeURIComponent(flight.tail)}`}
          className="text-primary mt-1 block text-lg font-semibold underline-offset-2 hover:underline"
        >
          {flight.tail}
        </Link>
        <p className="text-muted-foreground text-xs">View Tail Tracker</p>
      </div>

      <div className="border-border rounded-xl border p-4">
        <p className="text-muted-foreground text-xs uppercase tracking-wide">
          Distance
        </p>
        <p className="text-foreground mt-1 text-lg font-semibold tabular-nums">
          {flight.distanceKm.toLocaleString("en-US")} km
        </p>
        <p className="text-muted-foreground text-xs">
          {flight.origin} → {flight.destination}
        </p>
      </div>

      <div className="border-border rounded-xl border p-4">
        <p className="text-muted-foreground text-xs uppercase tracking-wide">
          ETA destination
        </p>
        <p className="text-foreground mt-1 text-lg font-semibold tabular-nums">
          {flight.etaDestination}
        </p>
        <p className="text-muted-foreground text-xs">Estimated arrival, local time</p>
      </div>
    </section>
  );
}
