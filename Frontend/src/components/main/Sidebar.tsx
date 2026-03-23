"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/services/auth.service";

type SidebarItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

interface SideBarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  sidebarItems?: SidebarItem[];
}

export default function DashboardSidebar({
  isCollapsed,
  setIsCollapsed,
  sidebarItems,
}: SideBarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div
          className="flex h-full flex-col shadow-2xs"
          style={{
            backgroundColor: "#121212",
            fontFamily: "sans-serif",
            boxShadow: "1px 0px 0px rgba(240, 208, 120, 0.25)",
          }}
        >
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4">
            {!isCollapsed && (
              <>
                <img src="/logo.png" alt="Expo Law" className="h-8 w-auto" />
                <span
                  className="text-lg font-semibold tracking-tight"
                  style={{
                    color: "#F0D078",
                    fontFamily: "sans-serif",
                  }}
                >
                  Expo Law
                </span>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 text-yellow-400"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-2 py-6">
            {sidebarItems?.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-800 font-sans",
                  pathname === item.href
                    ? "bg-gray-800 font-semibold"
                    : "text-gray-300"
                )}
                style={pathname === item.href ? { color: "#F0D078" } : {}}
              >
                <item.icon
                  className="h-4 w-4"
                  style={
                    pathname === item.href
                      ? { color: "#F0D078" }
                      : { color: "rgba(240, 208, 120, 0.5)" }
                  }
                />
                {!isCollapsed && (
                  <span className="ml-3" style={{ fontFamily: "inherit" }}>
                    {item.title}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="mt-auto border-t border-gray-800 p-4">
            <Link
              href="#"
              className="flex items-center rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800 font-sans"
            >
              <span className="mr-2" style={{ color: "#F0D078" }}>
                N
              </span>
              {!isCollapsed && (
                <span style={{ fontFamily: "inherit" }}>Contact Support</span>
              )}
            </Link>
            <Button
              variant="ghost"
              className="mt-2 w-full justify-start px-3 py-2 text-sm font-normal text-gray-300 hover:bg-gray-800 font-sans"
              onClick={(e) => {
                e.preventDefault();
                signOut();
              }}
            >
              <LogOut className="mr-3 h-4 w-4" style={{ color: "#F0D078" }} />
              {!isCollapsed && (
                <span style={{ fontFamily: "inherit" }}>Logout</span>
              )}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
