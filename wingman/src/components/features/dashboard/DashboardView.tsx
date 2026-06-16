"use client";

import { useMemo, useState } from "react";
import BracketBreakdown from "./BracketBreakdown";
import KpiCards from "./KpiCards";
import OperationalClock from "./OperationalClock";
import PriorityQueue from "./PriorityQueue";
import WeekdaySwitcher from "./WeekdaySwitcher";
import {
  buildOperation,
  currentWeekday,
  operationalLabel,
  type Weekday,
} from "./operation";

export default function DashboardView() {
  const today = currentWeekday();
  const [selectedDay, setSelectedDay] = useState<Weekday>(today);
  // Locked-in decisions: flight key → chosen action label. In-memory only — resets on refresh
  // and when the operator switches to a different day's operation.
  const [decisions, setDecisions] = useState<Record<string, string>>({});

  const flights = useMemo(() => buildOperation(selectedDay), [selectedDay]);

  const selectDay = (day: Weekday) => {
    setSelectedDay(day);
    setDecisions({});
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <OperationalClock label={operationalLabel(selectedDay)} />
        </div>
        <WeekdaySwitcher
          selected={selectedDay}
          today={today}
          onSelect={selectDay}
        />
      </header>

      <KpiCards flights={flights} decisions={decisions} />
      <BracketBreakdown flights={flights} />
      <PriorityQueue
        flights={flights}
        decisions={decisions}
        setDecisions={setDecisions}
      />
    </div>
  );
}
