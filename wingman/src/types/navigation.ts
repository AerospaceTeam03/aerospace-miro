import {
  CloudSun,
  LayoutDashboard,
  Network,
  PiggyBank,
  Sunrise,
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
    icon: Sunrise,
    route: "/morning-briefing",
    label: "Morning briefing",
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
  {
    icon: PiggyBank,
    route: "/savings-estimator",
    label: "Savings estimator",
  },
];
