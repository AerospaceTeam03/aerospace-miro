import type { AuditEntry } from "@/types/flightDetail";

export default function AuditTrail({ entries }: { entries: AuditEntry[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Decision audit trail</h2>

      <ol className="border-border flex flex-col divide-y rounded-xl border overflow-hidden">
        {entries.map((entry, i) => (
          <li key={i} className="flex items-start gap-3 px-4 py-3">
            <span className="text-muted-foreground mt-0.5 shrink-0 font-mono text-xs tabular-nums">
              {entry.time}
            </span>
            <span className="text-foreground text-sm">{entry.event}</span>
          </li>
        ))}
      </ol>

      <p className="text-muted-foreground text-xs">
        Fixture-based audit log. In production, entries are written in real time
        as the risk engine, alerts and dispatcher actions occur.
      </p>
    </section>
  );
}
