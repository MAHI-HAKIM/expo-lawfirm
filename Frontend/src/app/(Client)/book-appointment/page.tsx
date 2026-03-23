import { Suspense } from "react";
import { DashboardShell } from "@/components/main/client/dashbaord/dashboard-shell";
import { DashboardHeader } from "@/components/main/client/dashbaord/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingWizard } from "@/components/main/client/book-appointments/booking-wizard";

export default function BookAppointments() {
  return (
    <DashboardShell>
      <div className="">
        <Suspense fallback={<BookingWizardSkeleton />}>
          <BookingWizard />
        </Suspense>
      </div>
    </DashboardShell>
  );
}

function BookingWizardSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-5 gap-2 w-full">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center space-y-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <div className="space-y-4 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start space-x-2">
              <Skeleton className="h-4 w-4 mt-1" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
