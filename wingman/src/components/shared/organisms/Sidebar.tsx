import SidebarButton from "@/components/shared/atoms/SidebarButton";
import { cn } from "@/lib/utils";
import { RouteItem, sidebarLinks } from "@/types/navigation";
import { PlaneIcon } from "lucide-react";
import Link from "next/link";
import { ComponentProps } from "react";

export default function Sidebar({ className }: ComponentProps<"aside">) {
  return (
    <aside
      className={cn(
        "border-border sticky top-0 left-0 flex w-fit flex-col gap-4 border-r px-2 py-4 lg:px-4 2xl:px-6",
        className
      )}
    >
      <Link
        href="/"
        className="mb-18 flex cursor-pointer items-center gap-2 2xl:mb-8"
      >
        <PlaneIcon className="text-primary size-9 shrink-0" />
        <h1 className="text-foreground hidden text-2xl font-bold 2xl:block">
          Wingman
        </h1>
      </Link>
      {sidebarLinks.map((item: RouteItem) => {
        return (
          <SidebarButton
            key={item.route}
            route={item.route}
            label={item.label}
            icon={<item.icon className="size-6 shrink-0" />}
          />
        );
      })}
    </aside>
  );
}
