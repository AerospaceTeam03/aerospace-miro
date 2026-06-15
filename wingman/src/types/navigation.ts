import {
  LayoutDashboard,
  Package,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type RouteItem = {
  icon: LucideIcon;
  route: string;
  label: string;
};

export const sidebarLinks: RouteItem[] = [
  {
    icon: LayoutDashboard,
    route: "/",
    label: "Dashboard",
  },
  {
    icon: Package,
    route: "/items",
    label: "Items",
  },
  {
    icon: Settings,
    route: "/settings",
    label: "Settings",
  },
];
