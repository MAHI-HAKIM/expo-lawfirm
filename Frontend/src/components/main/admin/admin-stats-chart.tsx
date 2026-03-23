"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminStatsChartProps {
  className?: string;
}

export function AdminStatsChart({ className }: AdminStatsChartProps) {
  const [activeTab, setActiveTab] = useState("week");

  // Sample data - would be fetched from API in real application
  const weeklyData = [
    { name: "Mon", appointments: 12 },
    { name: "Tue", appointments: 18 },
    { name: "Wed", appointments: 15 },
    { name: "Thu", appointments: 20 },
    { name: "Fri", appointments: 25 },
    { name: "Sat", appointments: 18 },
    { name: "Sun", appointments: 10 },
  ];

  const monthlyData = [
    { name: "Week 1", appointments: 80 },
    { name: "Week 2", appointments: 95 },
    { name: "Week 3", appointments: 85 },
    { name: "Week 4", appointments: 76 },
  ];

  const dailyData = [
    { name: "9AM", appointments: 2 },
    { name: "10AM", appointments: 4 },
    { name: "11AM", appointments: 3 },
    { name: "12PM", appointments: 1 },
    { name: "1PM", appointments: 2 },
    { name: "2PM", appointments: 5 },
    { name: "3PM", appointments: 4 },
    { name: "4PM", appointments: 3 },
    { name: "5PM", appointments: 2 },
  ];

  return (
    <Card
      className={className}
      style={{
        backgroundColor: "#1E1E1E",
        border: "1px solid rgba(240, 208, 120, 0.2)",
        borderRadius: "0.75rem",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      <CardHeader className="pb-2">
        <CardTitle
          style={{
            color: "#F0D078",
            fontFamily: "sans-serif",
            fontSize: "1.25rem",
          }}
        >
          Appointment Analytics
        </CardTitle>
        <CardDescription
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontFamily: "sans-serif",
          }}
        >
          Overview of appointment trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="week"
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList
            style={{
              backgroundColor: "rgba(240, 208, 120, 0.1)",
              borderRadius: "0.5rem",
            }}
          >
            <TabsTrigger
              value="day"
              style={{
                color: activeTab === "day" ? "#121212" : "#F0D078",
                backgroundColor:
                  activeTab === "day" ? "#F0D078" : "transparent",
                fontFamily: "sans-serif",
              }}
            >
              Today
            </TabsTrigger>
            <TabsTrigger
              value="week"
              style={{
                color: activeTab === "week" ? "#121212" : "#F0D078",
                backgroundColor:
                  activeTab === "week" ? "#F0D078" : "transparent",
                fontFamily: "sans-serif",
              }}
            >
              This Week
            </TabsTrigger>
            <TabsTrigger
              value="month"
              style={{
                color: activeTab === "month" ? "#121212" : "#F0D078",
                backgroundColor:
                  activeTab === "month" ? "#F0D078" : "transparent",
                fontFamily: "sans-serif",
              }}
            >
              This Month
            </TabsTrigger>
          </TabsList>
          <TabsContent value="day" className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <XAxis
                    dataKey="name"
                    stroke="rgba(255, 255, 255, 0.4)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="rgba(255, 255, 255, 0.4)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E1E1E",
                      borderColor: "rgba(240, 208, 120, 0.3)",
                      color: "white",
                      fontFamily: "sans-serif",
                    }}
                  />
                  <Bar
                    dataKey="appointments"
                    fill="#F0D078"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="week" className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis
                    dataKey="name"
                    stroke="rgba(255, 255, 255, 0.4)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="rgba(255, 255, 255, 0.4)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E1E1E",
                      borderColor: "rgba(240, 208, 120, 0.3)",
                      color: "white",
                      fontFamily: "sans-serif",
                    }}
                  />
                  <Bar
                    dataKey="appointments"
                    fill="#F0D078"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="month" className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis
                    dataKey="name"
                    stroke="rgba(255, 255, 255, 0.4)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="rgba(255, 255, 255, 0.4)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E1E1E",
                      borderColor: "rgba(240, 208, 120, 0.3)",
                      color: "white",
                      fontFamily: "sans-serif",
                    }}
                  />
                  <Bar
                    dataKey="appointments"
                    fill="#F0D078"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
