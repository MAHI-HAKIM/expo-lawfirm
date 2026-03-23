"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Static case types with their descriptions
const CASE_TYPES = [
  {
    id: 1,
    name: "Criminal Law",
    description:
      "Legal representation for those accused of criminal offenses and defense strategies",
  },
  {
    id: 2,
    name: "Family Law",
    description:
      "Divorce, child custody, adoption, and other family-related legal matters",
  },
  {
    id: 3,
    name: "Corporate Law",
    description:
      "Business formation, corporate governance, mergers & acquisitions, and contracts",
  },
  {
    id: 4,
    name: "Real Estate Law",
    description:
      "Property transactions, title issues, landlord-tenant disputes, and zoning regulations",
  },
  {
    id: 5,
    name: "General Practice",
    description:
      "General legal consultation and services covering a wide range of legal issues",
  },
];

interface CaseSelectionProps {
  onSelectCaseType: (caseId: number, caseName: string) => void;
  selectedCaseTypeId: number | null;
}

export function CaseSelection({
  onSelectCaseType,
  selectedCaseTypeId,
}: CaseSelectionProps) {
  return (
    <Card className="border-0 shadow-lg rounded-lg overflow-hidden bg-[#21201f] dark:bg-[#2d2823]">
      <CardHeader className="bg-[#2a251e] border-b border-[#4d3f29]/30">
        <CardTitle className="text-xl font-bold text-[#d4af37]">
          Select Legal Service
        </CardTitle>
        <CardDescription className="text-amber-100/70">
          Choose the type of legal assistance you need
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-5">
        <RadioGroup
          value={selectedCaseTypeId?.toString() || ""}
          onValueChange={(value) => {
            const caseId = parseInt(value, 10);
            const caseName =
              CASE_TYPES.find((ct) => ct.id === caseId)?.name || "";
            onSelectCaseType(caseId, caseName);
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {CASE_TYPES.map((caseType) => (
            <div
              key={caseType.id}
              className={`flex items-start space-x-2 p-3 rounded-md ${
                selectedCaseTypeId === caseType.id
                  ? "bg-[#353434] border border-[#B8860B]/50 shadow-[0_0_10px_rgba(184,134,11,0.2)]"
                  : "border border-[#4d3f29]/40 bg-[#383838] hover:bg-[#35302a] hover:border-[#4d3f29]/80"
              } transition-all duration-200 cursor-pointer`}
              onClick={() => onSelectCaseType(caseType.id, caseType.name)}
            >
              <RadioGroupItem
                value={caseType.id.toString()}
                id={`case-type-${caseType.id}`}
                className="mt-1 border-[#B8860B] text-[#ffd875]"
              />
              <div className="space-y-1 flex-1">
                <Label
                  htmlFor={`case-type-${caseType.id}`}
                  className="text-base text-[#f4c243] font-bold cursor-pointer"
                >
                  {caseType.name}
                </Label>
                <p className="text-sm text-gray-200">{caseType.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
