"use client";

import { useState, useEffect } from "react";
import { CalendarClock, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMyAppointments } from "@/services/appointments.service";
import { format, isBefore, parseISO, startOfToday } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardCards() {
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const appointments = await getMyAppointments();

        console.log("appointments", appointments);
        const today = startOfToday();

        // Calculate stats
        const upcoming = appointments.filter(
          (app) =>
            !isBefore(parseISO(app.date), today) && app.status === "approved"
        ).length;

        const completed = appointments.filter(
          (app) =>
            isBefore(parseISO(app.date), today) && app.status === "approved"
        ).length;

        const pending = appointments.filter(
          (app) => app.status === "pending"
        ).length;
        const cancelled = appointments.filter(
          (app) => app.status === "cancelled"
        ).length;

        setStats([
          {
            title: "Upcoming",
            value: upcoming.toString(),
            icon: CalendarClock,
            description: "Scheduled appointments",
            color: "#F0D078",
            bgColor: "rgba(240, 208, 120, 0.1)",
            borderColor: "rgba(240, 208, 120, 0.3)",
          },
          {
            title: "Pending",
            value: pending.toString(),
            icon: Clock,
            description: "Awaiting confirmation",
            color: "#94A3B8",
            bgColor: "rgba(148, 163, 184, 0.1)",
            borderColor: "rgba(148, 163, 184, 0.3)",
          },
          {
            title: "Completed",
            value: completed.toString(),
            icon: CheckCircle,
            description: "Past appointments",
            color: "#34D399",
            bgColor: "rgba(52, 211, 153, 0.1)",
            borderColor: "rgba(52, 211, 153, 0.3)",
          },
          {
            title: "Cancelled",
            value: cancelled.toString(),
            icon: XCircle,
            description: "Cancelled appointments",
            color: "#F87171",
            bgColor: "rgba(248, 113, 113, 0.1)",
            borderColor: "rgba(248, 113, 113, 0.3)",
          },
        ]);
      } catch (error) {
        console.error("Failed to load appointments:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <>
        {[1, 2, 3, 4].map((index) => (
          <Card
            key={index}
            style={{
              backgroundColor: "#1E1E1E",
              borderRadius: "0.75rem",
              height: "150px",
            }}
            className="mb-2"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  return (
    <>
      {stats.map((stat) => (
        <Card
          key={stat.title}
          style={{
            backgroundColor: "#1E1E1E",
            border: `1px solid ${stat.borderColor}`,
            borderRadius: "0.75rem",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease",
            overflow: "hidden",
            position: "relative",
            height: "150px",
          }}
          className="hover:shadow-lg mb-2"
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "4px",
              height: "100%",
              backgroundColor: stat.color,
            }}
          />
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-1"
            style={{
              paddingLeft: "1.25rem",
              paddingTop: "0.75rem",
              paddingBottom: "0.25rem",
            }}
          >
            <CardTitle
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: stat.color,
                fontFamily: "sans-serif",
              }}
            >
              {stat.title}
            </CardTitle>
            <div
              style={{
                backgroundColor: stat.bgColor,
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <stat.icon
                style={{
                  height: "16px",
                  width: "16px",
                  color: stat.color,
                }}
              />
            </div>
          </CardHeader>
          <CardContent
            style={{
              paddingLeft: "1.25rem",
              paddingTop: "0.25rem",
              paddingBottom: "0.75rem",
            }}
          >
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "white",
                fontFamily: "sans-serif",
                marginBottom: "0.125rem",
              }}
            >
              {stat.value}
            </div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: "sans-serif",
              }}
            >
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
