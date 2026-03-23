"use client";

import {
  Users,
  CalendarClock,
  UserCheck,
  Briefcase,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listUsers } from "@/services/users.service";
import { UserData } from "@/types";
import { getAllLawyers } from "@/services/lawyers.service";
import { getAllAppointments } from "@/services/admin/appointments.service";
import {
  startOfMonth,
  isWithinInterval,
  startOfToday,
  endOfMonth,
} from "date-fns";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalAppointments: number;
  registeredClients: number;
  registeredLawyers: number;
  pendingApprovals: number;
}

export function AdminDashboardCards() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    registeredClients: 0,
    registeredLawyers: 0,
    pendingApprovals: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch all required data
        const [userData, lawyerData, appointmentsData] = await Promise.all([
          listUsers(),
          getAllLawyers(),
          getAllAppointments(),
        ]);

        // Calculate clients count
        const clientUsers = userData
          ? userData.filter((user: { role: string }) => user.role === "client")
          : [];

        // Calculate this month's appointments
        const today = startOfToday();
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);

        const thisMonthAppointments = appointmentsData.filter((appointment) => {
          const appointmentDate = new Date(appointment.date);
          return isWithinInterval(appointmentDate, {
            start: monthStart,
            end: monthEnd,
          });
        });

        // Calculate pending approvals
        const pendingAppointments = appointmentsData.filter(
          (appointment) => appointment.status === "pending"
        );

        setStats({
          totalAppointments: thisMonthAppointments.length,
          registeredClients: clientUsers.length,
          registeredLawyers: lawyerData?.length || 0,
          pendingApprovals: pendingAppointments.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statsConfig = [
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: CalendarClock,
      description: "This month",
      color: "#F0D078",
      bgColor: "rgba(240, 208, 120, 0.1)",
      borderColor: "rgba(240, 208, 120, 0.3)",
    },
    {
      title: "Registered Clients",
      value: stats.registeredClients,
      icon: Users,
      description: "Total clients",
      color: "#94A3B8",
      bgColor: "rgba(148, 163, 184, 0.1)",
      borderColor: "rgba(148, 163, 184, 0.3)",
    },
    {
      title: "Registered Lawyers",
      value: stats.registeredLawyers,
      icon: Briefcase,
      description: "Total lawyers",
      color: "#34D399",
      bgColor: "rgba(52, 211, 153, 0.1)",
      borderColor: "rgba(52, 211, 153, 0.3)",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: Clock,
      description: "Requiring review",
      color: "#F87171",
      bgColor: "rgba(248, 113, 113, 0.1)",
      borderColor: "rgba(248, 113, 113, 0.3)",
    },
  ];

  if (isLoading) {
    return (
      <>
        {[1, 2, 3, 4].map((index) => (
          <Card
            key={index}
            style={{
              backgroundColor: "#1E1E1E",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              height: "150px",
            }}
            className="mb-2 animate-pulse"
          >
            <div className="h-full flex items-center justify-center">
              <div className="text-white/20">Loading...</div>
            </div>
          </Card>
        ))}
      </>
    );
  }

  return (
    <>
      {statsConfig.map((stat) => (
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
