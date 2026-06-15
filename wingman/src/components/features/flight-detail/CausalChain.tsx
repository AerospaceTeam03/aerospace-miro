import { ArrowRight } from "lucide-react";
import type { CausalNode } from "./data";

export default function CausalChain({ nodes }: { nodes: CausalNode[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Causal chain</h2>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-2">
        {nodes.map((node, i) => (
          <div key={node.label} className="flex flex-1 items-center gap-2">
            <div className="border-border bg-muted/30 flex flex-1 flex-col gap-1 rounded-xl border p-3">
              <p className="text-foreground text-sm font-semibold">{node.label}</p>
              <p className="text-muted-foreground text-xs">{node.detail}</p>
            </div>
            {i < nodes.length - 1 && (
              <ArrowRight className="text-muted-foreground hidden size-5 shrink-0 sm:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
