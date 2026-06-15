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
        "hover:bg-accent hover:text-accent-foreground text-muted-foreground flex items-center justify-center gap-3 rounded-lg border py-2 transition-colors md:p-3 2xl:justify-start",
        {
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground border-transparent":
            isActive,
        }
      )}
    >
      {icon}
      <p className="hidden text-base font-semibold 2xl:block">{label}</p>
    </Link>
  );
}
