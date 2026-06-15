// Live weather for the destination network, fetched from Open-Meteo and mapped
// into the props AirportWeatherCard expects. The condition/impact derivations
// are deliberately simple and transparent — an ops desk should be able to read
// the rule, not trust a black box.

import type { Condition, Impact } from "./AirportWeatherCard";
import type { Destination, Hub } from "@/types/destination";

export type CurrentWeather = {
  temperatureC: number;
  windKt: number;
  weatherCode: number;
};

export type EnrichedDestination = {
  airport: string;
  name: string;
  condition: Condition;
  summary: string;
  temperature: string;
  wind: string;
  impact: Impact;
  seasonal: boolean;
  country: string;
  hubs: Hub[];
};

const OPEN_METEO = "https://api.open-meteo.com/v1/forecast";

type OpenMeteoCurrent = {
  current?: {
    temperature_2m?: number;
    wind_speed_10m?: number;
    weather_code?: number;
  };
};

/**
 * Fetch current conditions for many points in a single batched Open-Meteo
 * request. Returns one entry per input point, in order; `null` where weather
 * is unavailable (request failed or a point returned nothing) so callers can
 * degrade gracefully instead of throwing the page.
 */
export async function fetchCurrentWeather(
  points: { lat: number; lon: number }[]
): Promise<(CurrentWeather | null)[]> {
  if (points.length === 0) return [];

  const params = new URLSearchParams({
    latitude: points.map((p) => p.lat).join(","),
    longitude: points.map((p) => p.lon).join(","),
    current: "temperature_2m,wind_speed_10m,weather_code",
    wind_speed_unit: "kn",
    timezone: "auto",
  });

  try {
    const res = await fetch(`${OPEN_METEO}?${params}`, {
      // Re-fetch at most every 30 minutes — current conditions don't move faster
      // than that for our purposes, and it keeps us well within Open-Meteo limits.
      next: { revalidate: 1800 },
    });
    if (!res.ok) return points.map(() => null);

    const data = (await res.json()) as OpenMeteoCurrent | OpenMeteoCurrent[];
    // A single coordinate returns an object; multiple return an array.
    const list = Array.isArray(data) ? data : [data];

    return points.map((_, i) => {
      const current = list[i]?.current;
      if (
        !current ||
        current.temperature_2m == null ||
        current.wind_speed_10m == null ||
        current.weather_code == null
      ) {
        return null;
      }
      return {
        temperatureC: current.temperature_2m,
        windKt: current.wind_speed_10m,
        weatherCode: current.weather_code,
      };
    });
  } catch {
    return points.map(() => null);
  }
}

// WMO weather interpretation codes → the five card conditions.
export function conditionFromCode(code: number): Condition {
  if (code === 0) return "clear";
  if (code <= 3 || code === 45 || code === 48) return "cloudy";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  return "rain"; // drizzle, rain, showers and thunderstorms (51–67, 80–82, 95–99)
}

/**
 * Transparent operational-impact rule:
 *  - high   — winds ≥ 25 kt, or thunderstorm, or any snow
 *  - medium — winds ≥ 15 kt, or rain/drizzle/fog
 *  - low    — otherwise
 */
export function impactFor(code: number, windKt: number): Impact {
  const thunderstorm = code >= 95;
  const snow = (code >= 71 && code <= 77) || code === 85 || code === 86;
  if (windKt >= 25 || thunderstorm || snow) return "high";

  const wet = (code >= 45 && code <= 67) || (code >= 80 && code <= 82);
  if (windKt >= 15 || wet) return "medium";

  return "low";
}

const codeLabels: [test: (c: number) => boolean, label: string][] = [
  [(c) => c === 0, "Clear skies"],
  [(c) => c === 1, "Mainly clear"],
  [(c) => c === 2, "Partly cloudy"],
  [(c) => c === 3, "Overcast"],
  [(c) => c === 45 || c === 48, "Fog"],
  [(c) => c >= 51 && c <= 57, "Drizzle"],
  [(c) => c >= 61 && c <= 67, "Rain"],
  [(c) => c >= 71 && c <= 77, "Snow"],
  [(c) => c >= 80 && c <= 82, "Rain showers"],
  [(c) => c === 85 || c === 86, "Snow showers"],
  [(c) => c >= 95, "Thunderstorms"],
];

export function summaryFor(code: number, windKt: number): string {
  const sky = codeLabels.find(([test]) => test(code))?.[1] ?? "Mixed conditions";
  const kt = Math.round(windKt);
  const windPhrase =
    windKt >= 25
      ? `strong winds ${kt} kt`
      : windKt >= 15
        ? `gusty winds ${kt} kt`
        : `winds ${kt} kt`;
  return `${sky}, ${windPhrase}.`;
}

/** Map a destination + its (possibly missing) weather into card-ready data. */
export function enrich(
  dest: Pick<
    Destination,
    "iata" | "city" | "country" | "hubs" | "seasonal"
  >,
  weather: CurrentWeather | null
): EnrichedDestination {
  const base = {
    airport: dest.iata,
    name: dest.city,
    seasonal: dest.seasonal,
    country: dest.country,
    hubs: dest.hubs,
  };

  if (!weather) {
    return {
      ...base,
      condition: "cloudy",
      summary: "Weather unavailable.",
      temperature: "—",
      wind: "—",
      impact: "low",
    };
  }

  return {
    ...base,
    condition: conditionFromCode(weather.weatherCode),
    summary: summaryFor(weather.weatherCode, weather.windKt),
    temperature: `${Math.round(weather.temperatureC)}°C`,
    wind: `${Math.round(weather.windKt)} kt`,
    impact: impactFor(weather.weatherCode, weather.windKt),
  };
}
