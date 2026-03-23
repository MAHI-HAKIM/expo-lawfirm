"use client";

import { useState, useEffect } from "react";
import { getAllLawyers } from "@/services/lawyers.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Lawyer {
  id: number;
  full_name: string;
  email: string;
  specialization: string;
  bio?: string;
  phone?: unknown;
}

interface LawyerListProps {
  selectedSpecialization: string | null;
  onSelectLawyer: (lawyerId: number) => void;
  selectedLawyerId: number | null;
}

export function LawyerList({
  selectedSpecialization,
  onSelectLawyer,
  selectedLawyerId,
}: LawyerListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch lawyers from the backend
  useEffect(() => {
    async function fetchLawyers() {
      setIsLoading(true);
      try {
        const fetchedLawyers = await getAllLawyers();
        setLawyers(fetchedLawyers);
        console.log("Lawyers fetched:", fetchedLawyers);
      } catch (error) {
        console.error("Error fetching lawyers:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLawyers();
  }, []);

  // Filter lawyers based on search query and selected specialization
  const filteredLawyers = lawyers.filter((lawyer) => {
    const matchesSearch =
      lawyer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.specialization.toLowerCase().includes(searchQuery.toLowerCase());

    // If a specialization is selected, filter by it
    if (selectedSpecialization) {
      return matchesSearch && lawyer.specialization === selectedSpecialization;
    }

    return matchesSearch;
  });

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg rounded-lg overflow-hidden bg-[#21201f]">
        <CardHeader className="bg-[#2a251e] border-b border-[#4d3f29]/30">
          <Skeleton className="h-8 w-2/3 bg-[#2a251e]" />
          <Skeleton className="h-4 w-full bg-[#2a251e]" />
        </CardHeader>
        <CardContent className="pt-5">
          <Skeleton className="h-10 w-full mb-4 bg-[#2a251e]" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-start space-x-3 p-3 rounded-md border border-[#4d3f29]/40 bg-[#383838]"
              >
                <Skeleton className="h-4 w-4 mt-3 bg-[#2a251e]" />
                <Skeleton className="h-12 w-12 rounded-full bg-[#2a251e]" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-1/3 bg-[#2a251e]" />
                  <Skeleton className="h-4 w-1/4 bg-[#2a251e]" />
                  <Skeleton className="h-4 w-1/2 bg-[#2a251e]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg rounded-lg overflow-hidden bg-[#21201f] dark:bg-[#2d2823]">
      <CardHeader className="bg-[#2a251e] border-b border-[#4d3f29]/30">
        <CardTitle className="text-xl font-bold text-[#d4af37]">
          Select Attorney
        </CardTitle>
        <CardDescription className="text-amber-100/70">
          Choose a legal professional for your case
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-5">
        {selectedSpecialization ? (
          <>
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-100/50"
                size={18}
              />
              <Input
                placeholder="Search by name..."
                className="pl-10 bg-[#4b4b4b] border-[#4d3f29]/40 focus:border-[#B8860B]/70 focus:ring-[#B8860B]/20 text-amber-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {filteredLawyers.length === 0 ? (
              <div className="p-4 text-center border border-dashed rounded-md border-[#4d3f29]/60 bg-[#2a251e]/50">
                <p className="text-amber-100/60">
                  No attorneys available for {selectedSpecialization}.
                </p>
              </div>
            ) : (
              <RadioGroup
                value={selectedLawyerId?.toString() || ""}
                onValueChange={(value) => onSelectLawyer(parseInt(value, 10))}
                className="space-y-3"
              >
                {filteredLawyers.map((lawyer) => (
                  <div
                    key={lawyer.id}
                    className={`flex items-start space-x-3 p-3 rounded-md ${
                      selectedLawyerId === lawyer.id
                        ? "bg-[#353434] border border-[#B8860B]/50 shadow-[0_0_10px_rgba(184,134,11,0.2)]"
                        : "border border-[#4d3f29]/40 bg-[#383838] hover:bg-[#35302a] hover:border-[#4d3f29]/80"
                    } transition-all duration-200 cursor-pointer`}
                    onClick={() => onSelectLawyer(lawyer.id)}
                  >
                    <RadioGroupItem
                      value={lawyer.id.toString()}
                      id={`lawyer-${lawyer.id}`}
                      className="mt-3 border-[#B8860B] text-[#B8860B]"
                    />
                    <Avatar className="h-12 w-12 border border-[#4d3f29]/70 shadow-md">
                      <AvatarFallback className="bg-[#B8860B]/20 text-[#d4af37]">
                        {lawyer.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <Label
                        htmlFor={`lawyer-${lawyer.id}`}
                        className="text-base font-medium text-amber-100 cursor-pointer"
                      >
                        {lawyer.full_name}
                      </Label>
                      <div className="flex items-center">
                        <Badge className="bg-[#B8860B] hover:bg-[#9A7209] text-black font-medium">
                          {lawyer.specialization}
                        </Badge>
                      </div>
                      <p className="text-sm text-amber-100/50">
                        {lawyer.email}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}
          </>
        ) : (
          <div className="p-6 text-center border border-dashed rounded-md border-[#4d3f29]/60 bg-[#2a251e]/50">
            <p className="text-amber-100/60">
              Please select a case type first to see available attorneys.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
