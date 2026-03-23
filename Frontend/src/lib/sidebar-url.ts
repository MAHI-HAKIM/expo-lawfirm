import {
  Calendar,
  MessageSquare,
  Users,
  User,
  LayoutDashboard,
  ShieldUser,
  FileClock,
} from "lucide-react";

export const clientSidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Book Appointment",
    href: "/book-appointment",
    icon: Calendar,
  },
  {
    title: "My Appointments",
    href: "/my-appointments",
    icon: FileClock,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    title: "My Profile",
    href: "/profile",
    icon: User,
  },
];

export const adminSidebarItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Appointments", href: "/appointments", icon: FileClock },
  { title: "Lawyers", href: "/lawyers", icon: ShieldUser },
  { title: "Users", href: "/users", icon: Users },
];
