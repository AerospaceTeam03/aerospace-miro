import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import { ComponentProps } from "react";

export default function Topbar({ className }: ComponentProps<"header">) {
  return (
    <header
      className={cn(
        "border-border flex h-9 items-center justify-end border-b p-2",
        className
      )}
    >
      <Button variant="ghost" size="icon-sm">
        <MoreVertical />
      </Button>
    </header>
  );
}
