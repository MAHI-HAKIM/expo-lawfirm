import { DashboardShell } from "@/components/main/client/dashbaord/dashboard-shell";
import { DashboardHeader } from "@/components/main/client/dashbaord/dashboard-header";
import { AdminDashboardCards } from "@/components/main/admin/admin-dashboard-cards";
import { AdminAppointmentsList } from "@/components/main/admin/admin-appointments-list";
import { AdminPendingApprovals } from "@/components/main/admin/admin-pending-approvals";
import { AdminStatsChart } from "@/components/main/admin/admin-stats-chart";
import { getCurrentUser } from "@/services/auth.service";

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  return (
    <div>
      <DashboardShell>
        <DashboardHeader
          heading={`Admin Dashboard`}
          text="Manage appointments, clients, and lawyers"
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AdminDashboardCards />
        </div>

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 mt-4">
          <AdminStatsChart className="col-span-2" />
        </div>

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7 mt-4">
          <AdminAppointmentsList className="col-span-4" />
          <AdminPendingApprovals className="col-span-3" />
        </div>
      </DashboardShell>
    </div>
  );
}
