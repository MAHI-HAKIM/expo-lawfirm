"use client";

import { Button } from "@/components/ui/button";
import { specializationColors } from "@/types/Lawyer";

interface SpecializationFilterProps {
  selectedSpecialization: string | null;
  onSpecializationChange: (specialization: string | null) => void;
  availableSpecializations: string[];
}

export function SpecializationFilter({
  selectedSpecialization,
  onSpecializationChange,
  availableSpecializations,
}: SpecializationFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        onClick={() => onSpecializationChange(null)}
        variant="outline"
        size="sm"
        className={`${
          selectedSpecialization === null
            ? "bg-amber-800 text-white border-amber-800"
            : "bg-transparent text-gray-400 hover:text-white"
        } transition-colors duration-150`}
      >
        All Specializations
      </Button>
      {availableSpecializations.map((specialization) => {
        const colors =
          specializationColors[
            specialization as keyof typeof specializationColors
          ] || specializationColors.default;
        return (
          <Button
            key={specialization}
            onClick={() => onSpecializationChange(specialization)}
            variant="outline"
            size="sm"
            className={`${
              selectedSpecialization === specialization ? "border-2" : "border"
            } transition-colors duration-150`}
            style={{
              backgroundColor:
                selectedSpecialization === specialization
                  ? colors.bg
                  : "transparent",
              color:
                selectedSpecialization === specialization
                  ? colors.text
                  : colors.bg,
              borderColor: colors.bg,
            }}
          >
            {specialization}
          </Button>
        );
      })}
    </div>
  );
}
