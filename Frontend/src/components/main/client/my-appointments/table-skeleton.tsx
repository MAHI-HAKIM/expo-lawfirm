"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  // Generate 5 skeleton rows
  const skeletonRows = Array(5)
    .fill(0)
    .map((_, i) => (
      <tr key={i} className="border-b border-[#333]">
        <td className="py-4 px-2">
          <Skeleton className="h-4 w-32 bg-[#2a2a2a]" />
        </td>
        <td className="py-4 px-2">
          <Skeleton className="h-4 w-24 bg-[#2a2a2a]" />
        </td>
        <td className="py-4 px-2">
          <Skeleton className="h-4 w-16 bg-[#2a2a2a]" />
        </td>
        <td className="py-4 px-2">
          <Skeleton className="h-5 w-20 bg-[#2a2a2a] rounded-full" />
        </td>
        <td className="py-4 px-2 text-right">
          <Skeleton className="h-8 w-20 bg-[#2a2a2a] rounded-md ml-auto" />
        </td>
      </tr>
    ));

  return (
    <div>
      {/* Skeleton for tabs */}
      <div className="mb-6 flex gap-2">
        <Skeleton className="h-10 w-32 bg-[#2a2a2a] rounded-lg" />
        <Skeleton className="h-10 w-32 bg-[#2a2a2a] rounded-lg" />
      </div>

      {/* Skeleton for table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="text-left py-4 px-2 text-amber-200">Lawyer</th>
              <th className="text-left py-4 px-2 text-amber-200">Date</th>
              <th className="text-left py-4 px-2 text-amber-200">Time</th>
              <th className="text-left py-4 px-2 text-amber-200">Status</th>
              <th className="text-right py-4 px-2 text-amber-200">Actions</th>
            </tr>
          </thead>
          <tbody>{skeletonRows}</tbody>
        </table>
      </div>
    </div>
  );
}
