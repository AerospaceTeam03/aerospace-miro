"use client";

import { useEffect, useState } from "react";
import { operationalDate } from "./data";

export default function OperationalClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    // setTimeout(..., 0) calls setState in a callback, satisfying the linter.
    // The clock appears within one event-loop tick of mount.
    const timeout = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex items-baseline gap-3">
      <span className="text-foreground font-mono text-3xl font-bold tabular-nums">
        {now ? now.toLocaleTimeString("en-GB", { hour12: false }) : "--:--:--"}
      </span>
      <span className="text-muted-foreground text-sm">LT · {operationalDate}</span>
    </div>
  );
}
