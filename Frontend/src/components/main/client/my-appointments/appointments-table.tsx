"use client";

import { useState, useEffect } from "react";
import { format, parseISO, isBefore, startOfToday } from "date-fns";
import {
  Appointment,
  cancelAppointment,
  getMyAppointments,
} from "@/services/appointments.service";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, Calendar, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { TableSkeleton } from "./table-skeleton";

export function AppointmentsTable() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState<number | null>(null);

  useEffect(() => {
    async function loadAppointments() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMyAppointments();
        console.log("Appointments data:", data);
        setAppointments(data);
      } catch (err) {
        console.error("Failed to load appointments:", err);
        setError("Failed to load your appointments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    loadAppointments();
  }, []);

  // Filter appointments based on date and status
  const today = startOfToday();

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

  // Handle appointment cancellation
  const handleCancelAppointment = async (id: number) => {
    try {
      setIsCancelling(id);
      const result = await cancelAppointment(id);

      if (result.success) {
        toast.success("Appointment cancelled successfully");
        // Update the appointment status in the state
        setAppointments(
          appointments.map((app) =>
            app.id === id ? { ...app, status: "cancelled" } : app
          )
        );
      } else {
        toast.error(result.error || "Failed to cancel appointment");
      }
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsCancelling(null);
    }
  };

  // Render appointment status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-600 hover:bg-amber-700">Pending</Badge>
        );
      case "cancelled":
        return <Badge className="bg-red-600 hover:bg-red-700">Cancelled</Badge>;
      case "approved":
        return (
          <Badge className="bg-green-600 hover:bg-green-700">Approved</Badge>
        );
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Unknown</Badge>;
    }
  };

  // Show loading state
  if (isLoading) {
    return <TableSkeleton />;
  }

  // Show error message
  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
        <p className="text-red-400">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-4 border-amber-600 text-amber-300 hover:bg-amber-900/30"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Show empty state if no appointments
  if (appointments.length === 0) {
    return (
      <div className="p-6 text-center">
        <Calendar className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-amber-200 mb-2">
          No Appointments Found
        </h3>
        <p className="text-gray-400 mb-4">
          You haven&apos;t booked any appointments yet.
        </p>
        <Button
          onClick={() => (window.location.href = "/book-appointment")}
          className="bg-amber-600 hover:bg-amber-700 text-black"
        >
          Book an Appointment
        </Button>
      </div>
    );
  }

  const renderAppointmentTable = (
    appointmentsList: Appointment[],
    showCancelButton: boolean = true
  ) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#333]">
            <th className="text-left py-4 px-2 text-amber-200">Lawyer</th>
            <th className="text-left py-4 px-2 text-amber-200">Date</th>
            <th className="text-left py-4 px-2 text-amber-200">Time</th>
            <th className="text-left py-4 px-2 text-amber-200">Status</th>
            {showCancelButton && (
              <th className="text-right py-4 px-2 text-amber-200">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {appointmentsList.map((appointment) => (
            <tr
              key={appointment.id}
              className="border-b border-[#333] hover:bg-[#2a2a2a]"
            >
              <td className="py-4 px-2 text-white">
                {appointment.lawyer_name || `Lawyer #${appointment.lawyer}`}
              </td>
              <td className="py-4 px-2 text-white">
                {format(parseISO(appointment.date), "MMM dd, yyyy")}
              </td>
              <td className="py-4 px-2 text-white">{appointment.time}</td>
              <td className="py-4 px-2">
                {renderStatusBadge(appointment.status || "pending")}
              </td>
              {showCancelButton && (
                <td className="py-4 px-2 text-right">
                  {(appointment.status === "pending" ||
                    appointment.status === "approved") &&
                    !isBefore(parseISO(appointment.date), today) && (
                      <Button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        variant="destructive"
                        size="sm"
                        disabled={isCancelling === appointment.id}
                        className="bg-red-800 hover:bg-red-700"
                      >
                        {isCancelling === appointment.id ? (
                          "Cancelling..."
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-1" /> Cancel
                          </>
                        )}
                      </Button>
                    )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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
