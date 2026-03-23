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
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

type FilterItem = {
  label: string;
  value: string;
};

export function SearchBar({ filterItems }: { filterItems: FilterItem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [role, setRole] = useState(searchParams.get("role") || "all");

  // Create query string from search params
  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([name, value]) => {
        if (value === null || value === "") {
          newSearchParams.delete(name);
        } else {
          newSearchParams.set(name, value);
        }
      });

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const handleSearch = () => {
    const queryString = createQueryString({
      q: searchQuery,
      role: role === "all" ? null : role,
    });

    router.push(`/admin/users${queryString ? `?${queryString}` : ""}`);
  };

  const handleClear = () => {
    setSearchQuery("");
    setRole("all");
    router.push("/admin/users");
  };

  return (
    <div
      className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"
      style={{ fontFamily: "sans-serif" }}
    >
      <div className="relative flex-1">
        <Search
          className="absolute left-2.5 top-2.5 h-4 w-4"
          style={{ color: "rgba(255, 255, 255, 0.5)" }}
        />
        <Input
          type="search"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          style={{
            backgroundColor: "#252525",
            borderColor: "rgba(240, 208, 120, 0.2)",
            color: "white",
          }}
          // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      <div className="flex space-x-2">
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger
            className="w-[130px]"
            style={{
              backgroundColor: "#252525",
              borderColor: "rgba(240, 208, 120, 0.2)",
              color: "white",
            }}
          >
            <Filter
              className="mr-2 h-4 w-4 shrink-0"
              style={{ color: "#F0D078" }}
            />
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent
            style={{
              backgroundColor: "#252525",
              borderColor: "rgba(240, 208, 120, 0.2)",
              color: "white",
            }}
          >
            <SelectItem value="all">All</SelectItem>
            {filterItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex space-x-1">
          <Button
            // onClick={handleSearch}
            style={{
              backgroundColor: "rgba(240, 208, 120, 0.2)",
              color: "#F0D078",
              borderColor: "rgba(240, 208, 120, 0.3)",
              border: "1px solid",
            }}
          >
            Search
          </Button>

          <Button
            variant="outline"
            // onClick={handleClear}
            style={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "rgba(255, 255, 255, 0.8)",
            }}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
