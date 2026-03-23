"use client";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: string | null;
  currentDirection: "asc" | "desc" | null;
  onSort: (key: string) => void;
}

export function SortableHeader({
  label,
  sortKey,
  currentSort,
  currentDirection,
  onSort,
}: SortableHeaderProps) {
  const isActive = currentSort === sortKey;

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`-ml-4 h-8 hover:bg-transparent ${
        isActive ? "text-amber-200" : "text-gray-400"
      }`}
      onClick={() => onSort(sortKey)}
    >
      {label}
      <ArrowUpDown
        className={`ml-1 h-4 w-4 ${
          isActive
            ? "text-amber-200"
            : "text-gray-400 opacity-50 group-hover:opacity-100"
        }`}
      />
      {isActive && (
        <span className="ml-1 text-xs">
          {currentDirection === "asc" ? "↑" : "↓"}
        </span>
      )}
    </Button>
  );
}
