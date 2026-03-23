"use client";

import { useState, useEffect } from "react";
import { Lawyer } from "@/types/message";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLawyersWithAppointments } from "@/services/lawyers.service";
import toast from "react-hot-toast";

interface LawyerSelectProps {
  onSelect: (lawyer: Lawyer | null) => void;
  selected: Lawyer | null;
}

export function LawyerSelect({ onSelect, selected }: LawyerSelectProps) {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLawyers() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getLawyersWithAppointments();

        if (result.error) {
          setError(result.error);
          toast.error(result.error);
          return;
        }

        if (result.success && result.data) {
          setLawyers(result.data);
        }
      } catch (error) {
        console.error("Failed to load lawyers:", error);
        setError("Failed to load lawyers. Please try again later.");
        toast.error("Failed to load lawyers");
      } finally {
        setIsLoading(false);
      }
    }

    loadLawyers();
  }, []);

  const handleSelect = (lawyerId: string) => {
    const lawyer = lawyers.find((l) => l.id === parseInt(lawyerId));
    onSelect(lawyer || null);
  };

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Loading lawyers..." />
        </SelectTrigger>
      </Select>
    );
  }

  if (error) {
    return <div className="text-red-400 text-sm">{error}</div>;
  }

  if (lawyers.length === 0) {
    return (
      <div className="text-amber-200 text-sm">
        No lawyers found. Book an appointment first to start messaging.
      </div>
    );
  }

  return (
    <Select onValueChange={handleSelect} value={selected?.id.toString()}>
      <SelectTrigger className="w-full bg-[#2a2a2a] border-[#3a3a3a] text-white">
        <SelectValue placeholder="Select a lawyer to message" />
      </SelectTrigger>
      <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a]">
        {lawyers.map((lawyer) => (
          <SelectItem
            key={lawyer.id}
            value={lawyer.id.toString()}
            className="text-white hover:bg-[#3a3a3a]"
          >
            {lawyer.name} - {lawyer.specialization}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
