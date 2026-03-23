"use client";

import { useState } from "react";
import { format, parseISO, isBefore, startOfToday } from "date-fns";
import { AdminAppointment } from "@/services/admin/appointments.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SortableHeader } from "./sortable-header";

interface AppointmentsTableProps {
  appointments: AdminAppointment[];
  onApprove: (id: number) => Promise<void>;
  onCancel: (id: number) => Promise<void>;
}

export function AppointmentsTable({
  appointments,
  onApprove,
  onCancel,
}: AppointmentsTableProps) {
  const today = startOfToday();
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  // Filter appointments based on status and date
  const pastAppointments = appointments.filter((appointment) => {
    const appointmentDate = parseISO(appointment.date);
    return isBefore(appointmentDate, today);
  });

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending"
  );

  const approvedAppointments = appointments.filter(
    (appointment) => appointment.status === "approved"
  );

  const cancelledAppointments = appointments.filter(
    (appointment) => appointment.status === "cancelled"
  );

  // Sort all appointments by date (newest first)
  const allAppointmentsSorted = [...appointments].sort((a, b) => {
    const dateA = parseISO(a.date);
    const dateB = parseISO(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  // Render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-600">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-600">Approved</Badge>;
      case "cancelled":
        return <Badge className="bg-red-600">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-600">Unknown</Badge>;
    }
  };

  const handleApprove = async (id: number) => {
    try {
      setActionLoading(id);
      await onApprove(id);
      toast({
        title: "Appointment approved",
        description: "The appointment has been successfully approved.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      setActionLoading(id);
      await onCancel(id);
      toast({
        title: "Appointment cancelled",
        description: "The appointment has been successfully cancelled.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortAppointments = (appointmentsList: AdminAppointment[]) => {
    if (!sortKey || !sortDirection) return appointmentsList;

    return [...appointmentsList].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortKey) {
        case "client":
          aValue = a.client_full_name.toLowerCase();
          bValue = b.client_full_name.toLowerCase();
          break;
        case "client_email":
          aValue = a.client_email.toLowerCase();
          bValue = b.client_email.toLowerCase();
          break;
        case "lawyer":
          aValue = a.lawyer_full_name.toLowerCase();
          bValue = b.lawyer_full_name.toLowerCase();
          break;
        case "lawyer_email":
          aValue = a.lawyer_email.toLowerCase();
          bValue = b.lawyer_email.toLowerCase();
          break;
        case "date":
          aValue = new Date(`${a.date} ${a.time}`).getTime();
          bValue = new Date(`${b.date} ${b.time}`).getTime();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  const renderAppointmentTable = (
    appointmentsList: AdminAppointment[],
    showActions: boolean = true
  ) => {
    const sortedAppointments = sortAppointments(appointmentsList);

    return (
      <div className="rounded-lg border border-[#333] shadow-lg bg-[#1a1a1a]/50 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <div className="max-h-[480px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-amber-800/40 hover:[&::-webkit-scrollbar-thumb]:bg-amber-800/60">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-[#333] bg-[#1a1a1a]">
                  <th className="px-6 py-4 text-left">
                    <SortableHeader
                      label="Client"
                      sortKey="client"
                      currentSort={sortKey}
                      currentDirection={sortDirection}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <SortableHeader
                      label="Lawyer"
                      sortKey="lawyer"
                      currentSort={sortKey}
                      currentDirection={sortDirection}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <SortableHeader
                      label="Date & Time"
                      sortKey="date"
                      currentSort={sortKey}
                      currentDirection={sortDirection}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <SortableHeader
                      label="Status"
                      sortKey="status"
                      currentSort={sortKey}
                      currentDirection={sortDirection}
                      onSort={handleSort}
                    />
                  </th>
                  {showActions && (
                    <th className="px-6 py-4 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333]">
                {sortedAppointments.map((appointment) => {
                  const appointmentDate = parseISO(appointment.date);
                  const isPast = isBefore(appointmentDate, today);
                  const isLoading = actionLoading === appointment.id;

                  return (
                    <tr
                      key={appointment.id}
                      className="hover:bg-[#1a1a1a]/70 transition-colors duration-150"
                    >
                      <td className="px-6 py-5 text-white">
                        <div className="font-medium">
                          {appointment.client_full_name || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-white">
                        <div className="font-medium">
                          {appointment.lawyer_full_name || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-white">
                        <div className="font-medium">
                          {format(parseISO(appointment.date), "MMM dd, yyyy")}
                          <div className="text-sm text-gray-400 mt-0.5">
                            {appointment.time}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {renderStatusBadge(appointment.status)}
                      </td>
                      {showActions &&
                        !isPast &&
                        appointment.status === "pending" && (
                          <td className="px-6 py-5 text-right">
                            <div className="flex justify-end gap-3">
                              <Button
                                onClick={() => handleApprove(appointment.id)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 gap-2 px-4 py-2 h-auto shadow-md hover:shadow-lg transition-all duration-150"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <Check className="h-4 w-4" />
                                    <span>Approve</span>
                                  </>
                                )}
                              </Button>
                              <Button
                                onClick={() => handleCancel(appointment.id)}
                                size="sm"
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700 gap-2 px-4 py-2 h-auto shadow-md hover:shadow-lg transition-all duration-150"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <X className="h-4 w-4" />
                                    <span>Cancel</span>
                                  </>
                                )}
                              </Button>
                            </div>
                          </td>
                        )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-6 bg-[#2a2a2a] border border-[#3a3a3a]">
        <TabsTrigger
          value="all"
          className="data-[state=active]:bg-amber-800 data-[state=active]:text-white"
        >
          All ({appointments.length})
        </TabsTrigger>
        <TabsTrigger
          value="pending"
          className="data-[state=active]:bg-amber-800 data-[state=active]:text-white"
        >
          Pending ({pendingAppointments.length})
        </TabsTrigger>
        <TabsTrigger
          value="approved"
          className="data-[state=active]:bg-amber-800 data-[state=active]:text-white"
        >
          Approved ({approvedAppointments.length})
        </TabsTrigger>
        <TabsTrigger
          value="cancelled"
          className="data-[state=active]:bg-amber-800 data-[state=active]:text-white"
        >
          Cancelled ({cancelledAppointments.length})
        </TabsTrigger>
        <TabsTrigger
          value="past"
          className="data-[state=active]:bg-amber-800 data-[state=active]:text-white"
        >
          Past ({pastAppointments.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        {renderAppointmentTable(allAppointmentsSorted)}
      </TabsContent>

      <TabsContent value="pending">
        {pendingAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No pending appointments.</p>
          </div>
        ) : (
          renderAppointmentTable(pendingAppointments)
        )}
      </TabsContent>

      <TabsContent value="approved">
        {approvedAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No approved appointments.</p>
          </div>
        ) : (
          renderAppointmentTable(approvedAppointments)
        )}
      </TabsContent>

      <TabsContent value="cancelled">
        {cancelledAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No cancelled appointments.</p>
          </div>
        ) : (
          renderAppointmentTable(cancelledAppointments, false)
        )}
      </TabsContent>

      <TabsContent value="past">
        {pastAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No past appointments.</p>
          </div>
        ) : (
          renderAppointmentTable(pastAppointments, false)
        )}
      </TabsContent>
    </Tabs>
  );
}
