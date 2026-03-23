"use client";

import { useState, useEffect } from "react";
import { CaseType } from "@/services/appointments.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface CaseTypeStepProps {
  onSelectCaseType: (caseTypeId: number) => void;
  selectedCaseTypeId: number | null;
  caseTypes: CaseType[];
  isLoading: boolean;
}

export function CaseTypeStep({
  onSelectCaseType,
  selectedCaseTypeId,
  caseTypes,
  isLoading,
}: CaseTypeStepProps) {
  const handleChange = (caseTypeId: string) => {
    onSelectCaseType(parseInt(caseTypeId, 10));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start space-x-2">
                  <Skeleton className="h-4 w-4 mt-1" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-1/3" />
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
          Select Case Type
        </CardTitle>
        <CardDescription>
          Choose the type of legal assistance you need
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedCaseTypeId?.toString() || ""}
          onValueChange={handleChange}
          className="space-y-4"
        >
          {caseTypes.map((caseType) => (
            <div key={caseType.id} className="flex items-start space-x-2">
              <RadioGroupItem
                value={caseType.id.toString()}
                id={`case-type-${caseType.id}`}
                className="mt-1 border-amber-500 text-amber-500"
              />
              <div className="space-y-1.5 flex-1">
                <Label
                  htmlFor={`case-type-${caseType.id}`}
                  className="text-lg font-medium flex items-center"
                >
                  {caseType.name}
                  <Badge className="ml-2 bg-amber-600 hover:bg-amber-700">
                    Popular
                  </Badge>
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {caseType.description}
                </p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
