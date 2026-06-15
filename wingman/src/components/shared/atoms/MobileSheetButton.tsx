"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function MobileSheetButton({
  route,
  label,
  icon,
}: {
  route: string;
  label: string;
  icon: ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === route || pathname.startsWith(`${route}/`);
  return (
    <Link
      href={route}
      className={cn(
        "hover:bg-accent hover:text-accent-foreground text-muted-foreground flex w-full max-w-60 items-center gap-3 rounded-lg border p-4 transition-colors",
        {
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground border-transparent":
            isActive,
        }
      )}
    >
      {icon}
      <p className="text-base font-semibold">{label}</p>
    </Link>
  );
}
