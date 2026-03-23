"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UserCircle,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  getAllAppointments,
  approveAppointment,
  cancelAppointmentAdmin,
} from "@/services/admin/appointments.service";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface AdminPendingApprovalsProps {
  className?: string;
}

interface PendingAppointment {
  id: number;
  client_full_name: string;
  lawyer_full_name: string;
  date: string;
  time: string;
  description?: string;
  status: string;
}

export function AdminPendingApprovals({
  className,
}: AdminPendingApprovalsProps) {
  const [pendingAppointments, setPendingAppointments] = useState<
    PendingAppointment[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  const fetchPendingAppointments = async () => {
    try {
      const data = await getAllAppointments();
      const pending = data.filter(
        (app: PendingAppointment) => app.status === "pending"
      );
      setPendingAppointments(pending);
    } catch (error) {
      console.error("Error fetching pending appointments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch pending appointments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      setActionLoading(id);
      const result = await approveAppointment(id);
      if (result.success) {
        toast({
          title: "Success",
          description: "Appointment approved successfully",
        });
        // Remove the approved appointment from the list
        setPendingAppointments((prev) => prev.filter((app) => app.id !== id));
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve appointment",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setActionLoading(id);
      const result = await cancelAppointmentAdmin(id);
      if (result.success) {
        toast({
          title: "Success",
          description: "Appointment cancelled successfully",
        });
        // Remove the cancelled appointment from the list
        setPendingAppointments((prev) => prev.filter((app) => app.id !== id));
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel appointment",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

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
          Pending Approvals
        </CardTitle>
        <CardDescription
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontFamily: "sans-serif",
          }}
        >
          Appointments requiring your approval
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        {isLoading ? (
          <div
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              textAlign: "center",
              padding: "20px",
              fontFamily: "sans-serif",
            }}
          >
            Loading pending appointments...
          </div>
        ) : pendingAppointments.length === 0 ? (
          <div
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              textAlign: "center",
              padding: "20px",
              fontFamily: "sans-serif",
            }}
          >
            No pending appointments at this time
          </div>
        ) : (
          <div className="space-y-3">
            {pendingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                style={{
                  backgroundColor: "#252525",
                  borderRadius: "0.5rem",
                  padding: "12px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                className="hover:shadow-md hover:transform hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex gap-3">
                    <div
                      style={{
                        backgroundColor: "rgba(148, 163, 184, 0.1)",
                        borderRadius: "50%",
                        padding: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Calendar
                        style={{
                          color: "#94A3B8",
                          height: "18px",
                          width: "18px",
                        }}
                      />
                    </div>
                    <div>
                      <h4
                        style={{
                          color: "white",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          marginBottom: "2px",
                          fontFamily: "sans-serif",
                        }}
                      >
                        Appointment Request
                      </h4>
                      <p
                        style={{
                          color: "rgba(255, 255, 255, 0.7)",
                          fontSize: "0.8rem",
                          marginBottom: "2px",
                          fontFamily: "sans-serif",
                        }}
                      >
                        {appointment.client_full_name} with{" "}
                        {appointment.lawyer_full_name}
                      </p>
                      <p
                        style={{
                          color: "rgba(255, 255, 255, 0.5)",
                          fontSize: "0.7rem",
                          fontFamily: "sans-serif",
                        }}
                      >
                        {format(new Date(appointment.date), "MMM dd, yyyy")} at{" "}
                        {appointment.time}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 justify-end">
                  <Button
                    onClick={() => handleReject(appointment.id)}
                    variant="outline"
                    size="sm"
                    disabled={actionLoading === appointment.id}
                    style={{
                      borderColor: "rgba(248, 113, 113, 0.4)",
                      color: "#F87171",
                      padding: "0 10px",
                      height: "28px",
                      fontSize: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontFamily: "sans-serif",
                    }}
                  >
                    <XCircle size={14} />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(appointment.id)}
                    size="sm"
                    disabled={actionLoading === appointment.id}
                    style={{
                      backgroundColor: "rgba(52, 211, 153, 0.2)",
                      color: "#34D399",
                      padding: "0 10px",
                      height: "28px",
                      fontSize: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontFamily: "sans-serif",
                      border: "1px solid rgba(52, 211, 153, 0.4)",
                    }}
                  >
                    <CheckCircle size={14} />
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
