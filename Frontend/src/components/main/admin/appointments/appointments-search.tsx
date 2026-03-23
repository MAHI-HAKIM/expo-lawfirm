"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface AppointmentsSearchProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onSearchChange?: (search: string) => void;
  searchQuery?: string;
}

interface StatusOption {
  label: string;
  value: string;
  colors?: {
    bg: string;
    text: string;
  };
}

const statusOptions: StatusOption[] = [
  { label: "All Appointments", value: "all" },
  {
    label: "Pending",
    value: "pending",
    colors: { bg: "#FCD34D", text: "#92400E" }, // Amber for pending
  },
  {
    label: "Approved",
    value: "approved",
    colors: { bg: "#34D399", text: "#065F46" }, // Green for approved
  },
  {
    label: "Cancelled",
    value: "cancelled",
    colors: { bg: "#F87171", text: "#991B1B" }, // Red for cancelled
  },
  {
    label: "Past",
    value: "past",
    colors: { bg: "#9CA3AF", text: "#1F2937" }, // Gray for past
  },
];

export function AppointmentsSearch({
  selectedStatus,
  onStatusChange,
  onSearchChange = () => {},
  searchQuery = "",
}: AppointmentsSearchProps) {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
        <Input
          type="search"
          placeholder="Search appointments..."
          className="pl-9 bg-[#252525] border-amber-200/20 text-white"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex space-x-2">
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px] bg-[#252525] border-amber-200/20 text-white">
            <Filter className="mr-2 h-4 w-4 shrink-0 text-amber-200" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-[#252525] border-amber-200/20">
            {statusOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className={`text-white hover:bg-amber-200/10 focus:bg-amber-200/10 focus:text-white ${
                  option.value !== "all" ? "flex items-center" : ""
                }`}
              >
                {option.value !== "all" && option.colors && (
                  <span
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: option.colors.bg }}
                  />
                )}
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex space-x-1">
          <Button
            variant="outline"
            onClick={() => {
              onStatusChange("all");
              onSearchChange("");
            }}
            className="border-white/20 text-white/80 hover:bg-white/5"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
