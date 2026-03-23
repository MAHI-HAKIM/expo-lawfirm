"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import DashboardSidebar from "@/components/main/Sidebar";
import { clientSidebarItems } from "@/lib/sidebar-url";
import Header from "@/components/main/Header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className="min-h-screen font-serif"
      style={{
        fontFamily: "sans-serif",
      }}
    >
      {/* Sidebar */}
      <DashboardSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        sidebarItems={clientSidebarItems}
      />

      <Header isCollapsed={isCollapsed} />

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          isCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {/* Page Content */}
        <main className="px-6 py-10 pt-10 ">{children}</main>
      </div>
    </div>
  );
}
