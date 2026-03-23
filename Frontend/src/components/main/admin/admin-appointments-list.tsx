"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Clock, CheckCircle, XCircle } from "lucide-react";
import { getAllAppointments } from "@/services/admin/appointments.service";
import { format } from "date-fns";

interface AdminAppointmentsListProps {
  className?: string;
}

export function AdminAppointmentsList({
  className,
}: AdminAppointmentsListProps) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAllAppointments();
        // Sort appointments by date (newest first)
        const sortedAppointments = data.sort((a: any, b: any) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateB.getTime() - dateA.getTime();
        });
        setAppointments(sortedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge
            style={{
              backgroundColor: "rgba(52, 211, 153, 0.2)",
              color: "#34D399",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontFamily: "sans-serif",
            }}
          >
            <CheckCircle size={12} />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge
            style={{
              backgroundColor: "rgba(148, 163, 184, 0.2)",
              color: "#94A3B8",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontFamily: "sans-serif",
            }}
          >
            <Clock size={12} />
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            style={{
              backgroundColor: "rgba(248, 113, 113, 0.2)",
              color: "#F87171",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontFamily: "sans-serif",
            }}
          >
            <XCircle size={12} />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge
            style={{
              backgroundColor: "rgba(240, 208, 120, 0.2)",
              color: "#F0D078",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontFamily: "sans-serif",
            }}
          >
            <CalendarClock size={12} />
            {status}
          </Badge>
        );
    }
  };

  if (isLoading) {
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
            Loading...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

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
          Recent Appointments
        </CardTitle>
        <CardDescription
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontFamily: "sans-serif",
          }}
        >
          All consultation appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow
              style={{
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <TableHead
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontFamily: "sans-serif",
                  fontSize: "0.8rem",
                }}
              >
                Client
              </TableHead>
              <TableHead
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontFamily: "sans-serif",
                  fontSize: "0.8rem",
                }}
              >
                Lawyer
              </TableHead>
              <TableHead
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontFamily: "sans-serif",
                  fontSize: "0.8rem",
                }}
              >
                Date & Time
              </TableHead>
              <TableHead
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontFamily: "sans-serif",
                  fontSize: "0.8rem",
                }}
              >
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow
                key={appointment.id}
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  transition: "background-color 0.2s",
                }}
                className="hover:bg-gray-900"
              >
                <TableCell
                  style={{
                    color: "white",
                    fontFamily: "sans-serif",
                    fontSize: "0.875rem",
                  }}
                >
                  {appointment.client_full_name || "N/A"}
                </TableCell>
                <TableCell
                  style={{
                    color: "white",
                    fontFamily: "sans-serif",
                    fontSize: "0.875rem",
                  }}
                >
                  {appointment.lawyer_full_name || "N/A"}
                </TableCell>
                <TableCell
                  style={{
                    color: "white",
                    fontFamily: "sans-serif",
                    fontSize: "0.875rem",
                  }}
                >
                  {format(new Date(appointment.date), "MMM dd, yyyy")},{" "}
                  {appointment.time}
                </TableCell>
                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
