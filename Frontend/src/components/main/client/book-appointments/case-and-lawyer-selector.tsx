"use client";

import { useState } from "react";
import { CaseSelection } from "./case-selection";
import { LawyerList } from "./lawyer-list";

interface CaseAndLawyerSelectorProps {
  onSelectCaseType: (caseTypeId: number) => void;
  onSelectLawyer: (lawyerId: number) => void;
  selectedCaseTypeId: number | null;
  selectedLawyerId: number | null;
}

export function CaseAndLawyerSelector({
  onSelectCaseType,
  onSelectLawyer,
  selectedCaseTypeId,
  selectedLawyerId,
}: CaseAndLawyerSelectorProps) {
  const [selectedSpecialization, setSelectedSpecialization] = useState<
    string | null
  >(null);

  // Handler for case type selection that sets the specialization for filtering lawyers
  const handleCaseTypeSelection = (caseId: number, caseName: string) => {
    onSelectCaseType(caseId);
    setSelectedSpecialization(caseName);
    console.log(`Selected case: ${caseName}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#2e2d2d] p-3 rounded-xl">
      {/* Case Type Selection */}
      <CaseSelection
        onSelectCaseType={handleCaseTypeSelection}
        selectedCaseTypeId={selectedCaseTypeId}
      />

      {/* Lawyer Selection */}
      <LawyerList
        selectedSpecialization={selectedSpecialization}
        onSelectLawyer={onSelectLawyer}
        selectedLawyerId={selectedLawyerId}
      />
    </div>
  );
}
