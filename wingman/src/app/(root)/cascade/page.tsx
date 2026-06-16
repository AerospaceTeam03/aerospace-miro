import CascadeChain, {
  type Leg,
} from "@/components/features/cascade/CascadeChain";

// Illustrative rotations for Discover Airlines' (4Y) Frankfurt operation. Flight numbers
// and routes are drawn from the real network (src/data/schedule.generated.ts); return legs
// follow the carrier's even/odd convention. The delay propagates leg to leg — the cascade.
// To be replaced with real tail tracking (OpenSky), where each leg inherits the previous
// leg's delay and the cause is pulled from the live driver.
type Rotation = {
  tail: string;
  aircraft: string;
  pax: number;
  legs: Leg[];
};

const rotations: Rotation[] = [
  {
    // Short-haul Mediterranean feeder — fog at FRA in the morning never gets clawed back.
    tail: "D-AIWB",
    aircraft: "A320-214",
    pax: 85,
    legs: [
      {
        flight: "4Y 512",
        route: "FRA → PMI",
        scheduled: "06:55",
        delay: 30,
        cause: "FRA low-visibility procedures — morning fog",
      },
      {
        flight: "4Y 513",
        route: "PMI → FRA",
        scheduled: "10:25",
        delay: 50,
        cause: "Late inbound aircraft (4Y 512)",
      },
      {
        flight: "4Y 530",
        route: "FRA → IBZ",
        scheduled: "14:20",
        delay: 70,
        cause: "Late inbound + FRA departure slot held",
      },
      {
        flight: "4Y 531",
        route: "IBZ → FRA",
        scheduled: "18:35",
        delay: 95,
        cause: "Late inbound aircraft (4Y 530)",
      },
    ],
  },
  {
    // Wide-body transatlantic — the late feeders strand its connecting load at FRA.
    tail: "D-AXGD",
    aircraft: "A330-203",
    pax: 325,
    legs: [
      {
        flight: "4Y 10",
        route: "FRA → CUN",
        scheduled: "10:25",
        delay: 25,
        cause: "Holding for connecting pax off delayed feeders",
      },
      {
        flight: "4Y 11",
        route: "CUN → FRA",
        scheduled: "18:40",
        delay: 45,
        cause: "Late inbound + crew duty-time pressure",
      },
    ],
  },
  {
    // Medium-haul A321 — a held departure slot snowballs across three legs.
    tail: "D-AIWD",
    aircraft: "A321-211",
    pax: 175,
    legs: [
      {
        flight: "4Y 206",
        route: "FRA → HRG",
        scheduled: "08:20",
        delay: 15,
        cause: "FRA departure slot delay",
      },
      {
        flight: "4Y 207",
        route: "HRG → FRA",
        scheduled: "14:15",
        delay: 25,
        cause: "Late inbound aircraft (4Y 206)",
      },
      {
        flight: "4Y 900",
        route: "FRA → DBV",
        scheduled: "19:30",
        delay: 35,
        cause: "Late inbound + tight evening turnaround",
      },
    ],
  },
];

const downstreamLegs = rotations.reduce((n, r) => n + r.legs.length - 1, 0);
const worstDelay = Math.max(
  ...rotations.flatMap((r) => r.legs.map((l) => l.delay))
);

export default function CascadePage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Cascade</h1>
        <p className="text-muted-foreground">
          Where one late aircraft drags the rest of the schedule. The trigger is
          usually upstream of the flight that ends up late — a morning slip at
          Frankfurt compounds leg by leg across each tail&apos;s day.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="border-border rounded-xl border p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Rotations at risk
          </p>
          <p className="text-foreground mt-1 text-2xl font-bold tabular-nums">
            {rotations.length}
          </p>
        </div>
        <div className="border-border rounded-xl border p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Downstream legs affected
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400">
            {downstreamLegs}
          </p>
        </div>
        <div className="border-border rounded-xl border p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Worst-case delay
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-red-600 dark:text-red-400">
            +{worstDelay} min
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Affected rotations</h2>
        {rotations.map((r) => (
          <CascadeChain
            key={r.tail}
            tail={r.tail}
            aircraft={r.aircraft}
            pax={r.pax}
            legs={r.legs}
          />
        ))}
        <p className="text-muted-foreground text-xs">
          Illustrative rotations for Discover&apos;s FRA operation. Production
          wires to live tail tracking (OpenSky), with delay propagated leg to
          leg and the cause pulled from the live driver.
        </p>
      </section>
    </div>
  );
}
