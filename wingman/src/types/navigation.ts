import {
  CloudSun,
  LayoutDashboard,
  ListTodo,
  Network,
  PlaneTakeoff,
  Users,
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
    icon: PlaneTakeoff,
    route: "/flights",
    label: "Flights",
  },
  {
    icon: CloudSun,
    route: "/weather",
    label: "Weather",
  },
  {
    icon: Network,
    route: "/cascade",
    label: "Cascade",
  },
  {
    icon: ListTodo,
    route: "/actions",
    label: "Actions",
  },
  {
    icon: Users,
    route: "/crew",
    label: "Crew",
  },
];
