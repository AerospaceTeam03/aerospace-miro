"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Lock } from "lucide-react";
import BracketBadge from "./BracketBadge";
import { reasonCopy, type Flight } from "./data";
import { recommendActions } from "./recommend";

// Lets the operator review the bracket's ranked actions and lock in one decision for a
// flight. Controlled by the parent: `flight` non-null opens it, `chosen` is the currently
// locked-in action label (if any). Choosing an action locks it in and closes the dialog.
export default function DecisionDialog({
  flight,
  chosen,
  onChoose,
  onClear,
  onOpenChange,
}: {
  flight: Flight | null;
  chosen?: string;
  onChoose: (action: string) => void;
  onClear: () => void;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={!!flight} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {flight && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {flight.code}
                <span className="text-muted-foreground flex items-center gap-1 text-sm font-normal">
                  FRA
                  <ArrowRight className="h-3 w-3" />
                  {flight.destination} · {flight.scheduled}
                </span>
              </DialogTitle>
              <DialogDescription asChild>
                <div className="flex flex-col gap-2">
                  <BracketBadge bracket={flight.bracket} />
                  <span>
                    <span className="text-foreground font-semibold uppercase tracking-wide">
                      {reasonCopy[flight.reasonType]}
                    </span>{" "}
                    {flight.reasonText}
                  </span>
                </div>
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                Recommended actions — pick one to lock in
              </p>
              {recommendActions(flight).map((action, i) => {
                const isChosen = chosen === action.label;
                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => onChoose(action.label)}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                      isChosen
                        ? "border-emerald-500/50 bg-emerald-500/10"
                        : "border-border hover:border-foreground/20 hover:bg-muted/50"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                        isChosen
                          ? "bg-emerald-500 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isChosen ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-2 font-medium">
                        {action.label}
                        {i === 0 && !isChosen && (
                          <span className="text-muted-foreground rounded-full border px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide">
                            Top pick
                          </span>
                        )}
                        {isChosen && (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide">
                            <Lock className="h-3 w-3" /> Locked in
                          </span>
                        )}
                      </span>
                      <span className="text-muted-foreground text-xs">{action.detail}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {chosen && (
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={onClear}>
                  Clear decision
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
