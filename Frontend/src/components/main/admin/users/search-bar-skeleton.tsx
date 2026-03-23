import { Skeleton } from "@/components/ui/skeleton";

export function SearchBarSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      <Skeleton className="h-10 flex-1" />
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-[130px]" />
        <div className="flex space-x-1">
          <Skeleton className="h-10 w-[80px]" />
          <Skeleton className="h-10 w-[80px]" />
        </div>
      </div>
    </div>
  );
}
