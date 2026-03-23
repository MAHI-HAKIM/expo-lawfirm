import { Metadata } from "next";
import { getCurrentUser } from "@/services/auth.service";
import { AppointmentsTable } from "@/components/main/client/my-appointments/appointments-table";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "My Appointments | ExpoLaw",
  description: "View and manage your legal appointments",
};

export default async function MyAppointmentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif text-amber-100 mb-6">
        My Appointments
      </h1>

      <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6">
        <AppointmentsTable />
      </div>
    </div>
  );
}
