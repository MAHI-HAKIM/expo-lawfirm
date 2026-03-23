"use client";

import { useState } from "react";
import { Lawyer } from "@/services/appointments.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

interface LawyerSelectStepProps {
  onSelectLawyer: (lawyerId: number) => void;
  selectedLawyerId: number | null;
  lawyers: Lawyer[];
  selectedCaseTypeId: number | null;
  isLoading: boolean;
}

export function LawyerSelectStep({
  onSelectLawyer,
  selectedLawyerId,
  lawyers,
  selectedCaseTypeId,
  isLoading,
}: LawyerSelectStepProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (lawyerId: string) => {
    onSelectLawyer(parseInt(lawyerId, 10));
  };

  // Filter lawyers based on search query and selected case type
  const filteredLawyers = lawyers.filter((lawyer) => {
    const matchesSearch =
      lawyer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.specialization.toLowerCase().includes(searchQuery.toLowerCase());

    // If no case type selected or if the lawyer specializes in this case type
    // In a real implementation, you'd have more precise matching logic
    const matchesCaseType =
      !selectedCaseTypeId ||
      lawyer.specialization
        .toLowerCase()
        .includes(
          lawyers
            .find((l) => l.id === selectedCaseTypeId)
            ?.specialization.toLowerCase() || ""
        );

    return matchesSearch && matchesCaseType;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-full mb-4" />
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Skeleton className="h-4 w-4 mt-3" />
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="border border-amber-200/20 dark:border-amber-800/20 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-amber-600 dark:text-amber-500">
          Select a Lawyer
        </CardTitle>
        <CardDescription>
          Choose an attorney with expertise in your case type
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-6">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            size={18}
          />
          <Input
            placeholder="Search by name or specialization..."
            className="pl-10 border-amber-200 dark:border-amber-800 focus-visible:ring-amber-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredLawyers.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No lawyers found matching your criteria.
            </p>
          </div>
        ) : (
          <RadioGroup
            value={selectedLawyerId?.toString() || ""}
            onValueChange={handleChange}
            className="space-y-6"
          >
            {filteredLawyers.map((lawyer) => (
              <div key={lawyer.id} className="flex items-start space-x-3">
                <RadioGroupItem
                  value={lawyer.id.toString()}
                  id={`lawyer-${lawyer.id}`}
                  className="mt-3 border-amber-500 text-amber-500"
                />
                <Avatar className="h-12 w-12 border-2 border-amber-600">
                  <AvatarImage
                    src={lawyer.profile_image}
                    alt={lawyer.full_name}
                  />
                  <AvatarFallback className="bg-amber-100 text-amber-800">
                    {lawyer.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <Label
                    htmlFor={`lawyer-${lawyer.id}`}
                    className="text-lg font-medium"
                  >
                    {lawyer.full_name}
                  </Label>
                  <div className="flex items-center">
                    <Badge className="bg-amber-600 hover:bg-amber-700">
                      {lawyer.specialization}
                    </Badge>
                    {lawyer.experience && (
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {lawyer.experience} experience
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {lawyer.email}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
}
