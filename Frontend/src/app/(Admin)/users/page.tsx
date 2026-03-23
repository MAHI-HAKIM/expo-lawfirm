import { Suspense } from "react";
import { UsersList } from "@/components/main/admin/users/users-list";
import { UsersTableSkeleton } from "@/components/main/admin/users/users-skeleton";
import { SearchBar } from "@/components/main/admin/users/search-bar";
import { SearchBarSkeleton } from "@/components/main/admin/users/search-bar-skeleton";
import { DashboardHeader } from "@/components/main/client/dashbaord/dashboard-header";
import { DashboardShell } from "@/components/main/client/dashbaord/dashboard-shell";
import { clientFilterItems } from "@/types/client";

export default function UsersPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="User Management"
        text="Manage clients, view histories, and control accounts"
      />

      <div className="space-y-4">
        <Suspense fallback={<SearchBarSkeleton />}>
          <SearchBar filterItems={clientFilterItems} />
        </Suspense>

        <div
          className="rounded-md border"
          style={{
            borderColor: "rgba(240, 208, 120, 0.2)",
            backgroundColor: "#1E1E1E",
          }}
        >
          <Suspense fallback={<UsersTableSkeleton />}>
            <UsersList />
          </Suspense>
        </div>
      </div>
    </DashboardShell>
  );
}
