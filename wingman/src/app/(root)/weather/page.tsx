import AirportWeatherCard from "@/components/features/weather/AirportWeatherCard";

// Placeholder data — to be replaced with Open-Meteo forecasts and
// NOAA/METAR (METeorological Aerodrome Report) reports for the airports in the operation's network.
const airports = [
  {
    airport: "FRA",
    name: "Frankfurt",
    condition: "rain" as const,
    summary: "Thunderstorms building from 09:00, gusty crosswinds expected.",
    temperature: "19°C",
    wind: "24 kt",
    impact: "high" as const,
  },
  {
    airport: "MUC",
    name: "Munich",
    condition: "cloudy" as const,
    summary: "Overcast with low cloud base, occasional light showers.",
    temperature: "16°C",
    wind: "11 kt",
    impact: "medium" as const,
  },
  {
    airport: "JFK",
    name: "New York",
    condition: "clear" as const,
    summary: "Clear skies, light winds. No weather constraints expected.",
    temperature: "23°C",
    wind: "7 kt",
    impact: "low" as const,
  },
  {
    airport: "ORD",
    name: "Chicago",
    condition: "wind" as const,
    summary: "Strong sustained winds, possible ground delay program.",
    temperature: "14°C",
    wind: "31 kt",
    impact: "high" as const,
  },
];

export default function WeatherPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Weather</h1>
        <p className="text-muted-foreground">
          The external driver behind most delays. Conditions across the network,
          flagged by their likely impact on operations.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {airports.map((a) => (
          <AirportWeatherCard key={a.airport} {...a} />
        ))}
      </section>

      <p className="text-muted-foreground text-xs">
        Placeholder data. Wire to Open-Meteo (forecast) and NOAA/METAR (reports).
      </p>
    </div>
  );
}
