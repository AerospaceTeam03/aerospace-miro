import {
  CloudSun,
  LayoutDashboard,
  Network,
  Telescope,
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
    icon: CloudSun,
    route: "/weather",
    label: "Weather",
  },
  {
    icon: Telescope,
    route: "/flight-deep-detail",
    label: "Flight Deep Detail",
  },
  {
    icon: Network,
    route: "/cascade",
    label: "Cascade tracker",
  },
];
