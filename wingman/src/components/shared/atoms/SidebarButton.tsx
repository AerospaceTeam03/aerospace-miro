"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function SidebarButton({
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
        "text-muted-foreground to-background flex items-center justify-center gap-3 rounded-lg border bg-linear-0 from-blue-50 py-2 shadow-xs shadow-blue-200/60 transition-all hover:border-blue-200 hover:text-blue-700 hover:shadow-md md:p-3 2xl:justify-start",
        {
          "border-none bg-linear-65 from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/40 hover:from-blue-600 hover:to-blue-400 hover:text-white":
            isActive,
        }
      )}
    >
      {icon}
      <p className="hidden text-base font-semibold 2xl:block">{label}</p>
    </Link>
  );
}
