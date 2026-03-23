import { Suspense } from "react";
import { UsersList } from "@/components/main/admin/users/users-list";
import { UsersTableSkeleton } from "@/components/main/admin/users/users-skeleton";
import { SearchBar } from "@/components/main/admin/users/search-bar";
import { DashboardHeader } from "@/components/main/client/dashbaord/dashboard-header";
import { DashboardShell } from "@/components/main/client/dashbaord/dashboard-shell";
import { LawyersList } from "@/components/main/admin/lawyers/lawyers-list";
import { RegisterLawyerModal } from "@/components/main/admin/lawyers/register-lawyer-modal";
import { lawyersFilterItems } from "@/types/Lawyer";

export default function LawyerPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <DashboardHeader
          heading="User Management"
          text="Manage clients, view histories, and control accounts"
        />
        <RegisterLawyerModal />
      </div>

      <div className="space-y-4">
        <div
          className="rounded-md border"
          style={{
            borderColor: "rgba(240, 208, 120, 0.2)",
            backgroundColor: "#1E1E1E",
          }}
        >
          <Suspense fallback={<UsersTableSkeleton />}>
            <LawyersList />
          </Suspense>
        </div>
      </div>
    </DashboardShell>
  );
}
