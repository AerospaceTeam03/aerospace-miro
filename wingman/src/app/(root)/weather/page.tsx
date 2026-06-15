import AirportWeatherCard from "@/components/features/weather/AirportWeatherCard";
import WeatherGrid from "@/components/features/weather/WeatherGrid";
import { enrich, fetchCurrentWeather } from "@/components/features/weather/weather";
import data from "@/data/discover_airlines_destinations.json";
import type { DestinationsFile, Hub } from "@/types/destination";

const { destinations } = data as DestinationsFile;

// The two operating bases. They're where the network is flown *from*, so they
// aren't in the destinations list — pin them at the top of the ops view.
const hubs = [
  {
    iata: "FRA",
    city: "Frankfurt",
    country: "Germany",
    lat: 50.0379,
    lon: 8.5622,
    hubs: ["FRA"] as Hub[],
    seasonal: false,
  },
  {
    iata: "MUC",
    city: "Munich",
    country: "Germany",
    lat: 48.3538,
    lon: 11.7861,
    hubs: ["MUC"] as Hub[],
    seasonal: false,
  },
];

export default async function WeatherPage() {
  // One batched Open-Meteo request for hubs + every destination, in order.
  const points = [...hubs, ...destinations].map((d) => ({
    lat: d.lat,
    lon: d.lon,
  }));
  const weather = await fetchCurrentWeather(points);

  const hubCards = hubs.map((h, i) => enrich(h, weather[i]));
  const destinationCards = destinations.map((d, i) =>
    enrich(d, weather[hubs.length + i])
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Weather</h1>
        <p className="text-muted-foreground">
          The external driver behind most delays. Live conditions across the
          network, flagged by their likely impact on operations.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-muted-foreground text-sm font-semibold uppercase tracking-wide">
          Operating bases
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {hubCards.map((h) => (
            <AirportWeatherCard key={h.airport} {...h} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-muted-foreground text-sm font-semibold uppercase tracking-wide">
          Destinations
        </h2>
        <WeatherGrid destinations={destinationCards} />
      </section>

      <p className="text-muted-foreground text-xs">
        Current conditions from Open-Meteo (WMO weather codes, winds in knots),
        refreshed every 30 minutes. Operational impact is a transparent rule on
        wind speed and weather code — not a black box.
      </p>
    </div>
  );
}
