import { getWeatherLabel } from "@/lib/riskUtils";
import type { WeatherData } from "@/types/flightDetail";

function Cell({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="border-border rounded-xl border p-3">
      <p className="text-muted-foreground text-xs uppercase tracking-wide">{label}</p>
      <p className="text-foreground mt-1 font-semibold">{value}</p>
      {sub && <p className="text-muted-foreground text-xs">{sub}</p>}
    </div>
  );
}

function windInterpretation(gust: number): string {
  if (gust > 50) return "Severe — de-icing hold-over time reduced, possible ground stop";
  if (gust > 35) return "Caution — above crosswind comfort threshold, monitor closely";
  if (gust > 20) return "Moderate — normal ops, no restrictions";
  return "Light — no operational impact";
}

function snowInterpretation(cm: number): string {
  if (cm >= 3) return "Heavy — de-icing mandatory, reduced runway capacity";
  if (cm >= 0.5) return "Moderate — de-icing likely, check ops policy";
  if (cm > 0) return "Light — monitor, de-icing may be required";
  return "None";
}

function cloudInterpretation(pct: number): string {
  if (pct >= 90) return "Overcast — IFR conditions possible";
  if (pct >= 60) return "Mostly cloudy — reduced visibility may apply";
  if (pct >= 30) return "Partly cloudy — no impact expected";
  return "Clear — no impact";
}

export default function WeatherPanel({ weather }: { weather: WeatherData }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">
        Weather context — {weather.location}
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Cell
          label="Conditions"
          value={weather.conditions}
          sub={`WMO code ${weather.weatherCode} — ${getWeatherLabel(weather.weatherCode)}`}
        />
        <Cell
          label="Temperature"
          value={`${weather.tempC}°C`}
          sub={weather.tempC < -5 ? "Cold — de-icing checks required" : "Within normal range"}
        />
        <Cell
          label="Wind speed"
          value={`${weather.windSpeedKmh} km/h`}
          sub={`Gusts: ${weather.windGustKmh} km/h`}
        />
        <Cell
          label="Wind gusts — operational impact"
          value={windInterpretation(weather.windGustKmh)}
          sub={weather.windGustKmh > 35 ? `${weather.windGustKmh} km/h exceeds 35 km/h caution threshold` : "Below caution threshold"}
        />
        <Cell
          label="Snowfall"
          value={snowInterpretation(weather.snowfallCm)}
          sub={weather.snowfallCm > 0 ? `${weather.snowfallCm} cm this hour` : "No snowfall"}
        />
        <Cell
          label="Precipitation"
          value={weather.precipMm > 0 ? `${weather.precipMm} mm` : "None"}
          sub={weather.precipMm > 2 ? "Heavy — ramp operations may slow" : "Within normal range"}
        />
        <Cell
          label="Cloud cover"
          value={`${weather.cloudCoverPct}%`}
          sub={cloudInterpretation(weather.cloudCoverPct)}
        />
      </div>

      {/* Operational summary */}
      <div className="border-border rounded-xl border p-3">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
          Operational note
        </p>
        <p className="text-foreground mt-1 text-sm">{weather.operationalNote}</p>
      </div>
    </section>
  );
}
