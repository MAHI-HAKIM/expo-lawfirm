"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllLawyers } from "@/services/lawyers.service";
import { LawyersActions } from "./lawyers-action";
import { specializationColors } from "@/types/Lawyer";
import { format } from "date-fns";
import { Lawyer } from "@/types/Lawyer";
import { LawyersSearch } from "./lawyers-search";

export function LawyersList() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Get unique specializations from lawyers
  const availableSpecializations = Array.from(
    new Set(lawyers.map((lawyer) => lawyer.specialization))
  );

  // Filter lawyers based on selected specialization
  const filteredLawyers =
    selectedSpecialization === "all"
      ? lawyers
      : lawyers.filter(
          (lawyer) => lawyer.specialization === selectedSpecialization
        );

  const getSpecializationStyle = (specialization: string) => {
    const colors =
      specializationColors[
        specialization as keyof typeof specializationColors
      ] || specializationColors.default;
    return {
      backgroundColor: colors.bg,
      color: colors.text,
      padding: "2px 8px",
      borderRadius: "4px",
      fontSize: "0.75rem",
    };
  };

  const formatDate = (date: Date) => {
    return format(date, "MMM d, yyyy");
  };

  // Fetch lawyers on component mount
  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setIsLoading(true);
        const data = await getAllLawyers();
        setLawyers(data);
      } catch (error) {
        console.error("Error fetching lawyers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-amber-200">Loading lawyers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <LawyersSearch
        selectedSpecialization={selectedSpecialization}
        onSpecializationChange={setSelectedSpecialization}
        availableSpecializations={availableSpecializations}
      />

      <div className="w-full overflow-auto rounded-lg border border-[#333] shadow-lg bg-[#1a1a1a]/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#333] hover:bg-[#1a1a1a]/70">
              <TableHead className="px-6 py-4 text-left text-amber-200/70 font-medium">
                Name
              </TableHead>
              <TableHead className="px-6 py-4 text-left text-amber-200/70 font-medium">
                Email
              </TableHead>
              <TableHead className="px-6 py-4 text-left text-amber-200/70 font-medium">
                Specialization
              </TableHead>
              <TableHead className="px-6 py-4 text-left text-amber-200/70 font-medium">
                Joined
              </TableHead>
              <TableHead className="px-6 py-4 text-left text-amber-200/70 font-medium">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-right text-amber-200/70 font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLawyers.length > 0 ? (
              filteredLawyers.map((lawyer: Lawyer) => (
                <TableRow
                  key={`lawyer-${lawyer.full_name}-${lawyer.email}`}
                  className="border-b border-[#333] hover:bg-[#1a1a1a]/70 transition-colors duration-150"
                >
                  <TableCell className="px-6 py-5 text-white font-medium">
                    {lawyer.full_name}
                  </TableCell>
                  <TableCell className="px-6 py-5 text-white">
                    {lawyer.email}
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <span style={getSpecializationStyle(lawyer.specialization)}>
                      {lawyer.specialization}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-white">
                    {formatDate(new Date())}
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm">
                      Active
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-right">
                    <LawyersActions lawyer={lawyer} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-gray-400"
                >
                  {selectedSpecialization === "all"
                    ? "No lawyers found."
                    : `No lawyers found with ${selectedSpecialization} specialization.`}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
