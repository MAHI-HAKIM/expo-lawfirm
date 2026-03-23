import { Suspense } from "react";
import {
  getAllAppointments,
  approveAppointment,
  cancelAppointmentAdmin,
} from "@/services/admin/appointments.service";
import { AppointmentsTable } from "@/components/main/admin/appointments/appointments-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function AppointmentsPage() {
  try {
    // Fetch appointments data
    const appointments = await getAllAppointments();

    console.log("appointments", appointments);

    // Handle approve action
    async function handleApprove(id: number) {
      "use server";
      const result = await approveAppointment(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to approve appointment");
      }
    }

    // Handle cancel action
    async function handleCancel(id: number) {
      "use server";
      const result = await cancelAppointmentAdmin(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to cancel appointment");
      }
    }

    return (
      <div className="container mx-auto py-6 space-y-6">
        <Card className="bg-[#1a1a1a] border-[#333]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-amber-200">
              Manage Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<TableSkeleton />}>
              <AppointmentsTable
                appointments={appointments}
                onApprove={handleApprove}
                onCancel={handleCancel}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Error in AppointmentsPage:", error);
    return (
      <div className="container mx-auto py-6">
        <Card className="bg-[#1a1a1a] border-[#333]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-400">
              Error Loading Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              There was an error loading the appointments. Please try again
              later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default AppointmentsPage;
