"use client";

import { useMemo, useState } from "react";
import AirportWeatherCard from "./AirportWeatherCard";
import type { EnrichedDestination } from "./weather";
import type { Hub } from "@/types/destination";
import { cn } from "@/lib/utils";

type HubFilter = "all" | Hub;
type SeasonFilter = "all" | "year-round" | "seasonal";

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="border-border inline-flex rounded-lg border p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-md px-3 py-1 text-sm font-medium transition-colors",
            value === opt.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function WeatherGrid({
  destinations,
}: {
  destinations: EnrichedDestination[];
}) {
  const [hub, setHub] = useState<HubFilter>("all");
  const [season, setSeason] = useState<SeasonFilter>("all");
  const [country, setCountry] = useState<string>("all");

  const countries = useMemo(
    () =>
      Array.from(new Set(destinations.map((d) => d.country))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [destinations]
  );

  const filtered = useMemo(
    () =>
      destinations.filter((d) => {
        if (hub !== "all" && !d.hubs.includes(hub)) return false;
        if (season === "seasonal" && !d.seasonal) return false;
        if (season === "year-round" && d.seasonal) return false;
        if (country !== "all" && d.country !== country) return false;
        return true;
      }),
    [destinations, hub, season, country]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented<HubFilter>
          value={hub}
          onChange={setHub}
          options={[
            { value: "all", label: "All hubs" },
            { value: "FRA", label: "FRA" },
            { value: "MUC", label: "MUC" },
          ]}
        />
        <Segmented<SeasonFilter>
          value={season}
          onChange={setSeason}
          options={[
            { value: "all", label: "All" },
            { value: "year-round", label: "Year-round" },
            { value: "seasonal", label: "Seasonal" },
          ]}
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="border-border bg-background text-foreground rounded-lg border px-3 py-1.5 text-sm"
        >
          <option value="all">All countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <span className="text-muted-foreground ml-auto text-sm tabular-nums">
          {filtered.length} of {destinations.length}
        </span>
      </div>

      {filtered.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((d) => (
            <AirportWeatherCard key={d.airport} {...d} />
          ))}
        </section>
      ) : (
        <p className="text-muted-foreground py-8 text-center text-sm">
          No destinations match these filters.
        </p>
      )}
    </div>
  );
}
