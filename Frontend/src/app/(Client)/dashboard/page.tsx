import { DashboardShell } from "@/components/main/client/dashbaord/dashboard-shell";
import { DashboardCards } from "@/components/main/client/dashbaord/dashboard-cards";
import { UpcomingAppointments } from "@/components/main/client/dashbaord/upcoming-appointments";
import { Notifications } from "@/components/main/client/dashbaord/notifications";
import { DashboardHeader } from "@/components/main/client/dashbaord/dashboard-header";
import { getCurrentUser } from "@/services/auth.service";

export default async function ClientDashboard() {
  const user = await getCurrentUser();
  console.log("user", user);
  return (
    <div>
      <DashboardShell>
        <DashboardHeader
          heading={`Welcome back, ${user?.full_name} `}
          text="Manage your legal appointments and communications"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCards />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <UpcomingAppointments className="col-span-4" />
          <Notifications className="col-span-3" />
        </div>
      </DashboardShell>
    </div>
  );
}
