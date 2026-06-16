"use client";

import { cn } from "@/lib/utils";
import { WEEKDAYS, type Weekday } from "./operation";

const SHORT: Record<Weekday, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

export default function WeekdaySwitcher({
  selected,
  today,
  onSelect,
}: {
  selected: Weekday;
  today: Weekday;
  onSelect: (day: Weekday) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {WEEKDAYS.map((day) => {
        const isSelected = day === selected;
        const isToday = day === today;
        return (
          <button
            key={day}
            type="button"
            onClick={() => onSelect(day)}
            aria-pressed={isSelected}
            className={cn(
              "relative rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
              isSelected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {SHORT[day]}
            {isToday && (
              <span
                className={cn(
                  "ml-1 text-[10px] font-bold",
                  isSelected ? "opacity-80" : "text-primary"
                )}
              >
                ●
              </span>
            )}
          </button>
        );
      })}
      <span className="text-muted-foreground ml-1 text-xs">● = today</span>
    </div>
  );
}
