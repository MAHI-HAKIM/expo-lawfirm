"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAccountNav } from "./user-account-nav";
import { usePathname } from "next/navigation";
import { UserData } from "@/types";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/auth.service";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface DashboardHeaderProps {
  isCollapsed: boolean;
  sidebarItems?: SidebarItem[];
}

export default function Header({
  isCollapsed,
  sidebarItems,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUserData(user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const pageTitle =
    sidebarItems?.find((item) => item.href === pathname)?.title ||
    (userData?.role
      ? `${
          userData.role.charAt(0).toUpperCase() + userData.role.slice(1)
        } Dashboard`
      : "Dashboard");

  return (
    <header
      className={`fixed top-0 z-30 py-2 mb-1 transition-all duration-300 ${
        isCollapsed ? "left-16 right-0" : "left-64 right-0"
      }`}
      style={{
        backgroundColor: "#121212",
        boxShadow: "0 1px 0px rgba(240, 208, 120, 0.25)",
        fontFamily: "sans-serif",
      }}
    >
      <div className="flex h-full items-center justify-between px-4">
        <h1
          className="text-md tracking-wide"
          style={{
            color: "#F0D078",
            fontSize: "1.5rem",
            fontWeight: 500,
            margin: 0,
            fontFamily: "sans-serif",
          }}
        >
          {pageTitle}
        </h1>

        <UserAccountNav user={userData} />
      </div>
    </header>
  );
}
