import { CheckCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

export default function TabSteps({
  steps,
  currentStep,
  setCurrentStep,
}: {
  steps: any[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}) {
  return (
    <div>
      <Tabs
        value={steps[currentStep].id}
        className="mb-12"
        onValueChange={(value) => {
          const stepIndex = steps.findIndex((step) => step.id === value);
          if (stepIndex >= 0) {
            setCurrentStep(stepIndex);
          }
        }}
      >
        <TabsList className="grid grid-cols-4 w-full p-1 mb-15 bg-transparent rounded-lg shadow-sm ">
          {steps.map((step, index) => (
            <TabsTrigger
              key={step.id}
              value={step.id}
              disabled={index > 0 && !steps[index - 1].isComplete}
              className="relative data-[state=active]:bg-transparent data-[state=active]:text-[#D4AF37] flex flex-col items-center space-y-2 py-3 px-4 hover:bg-transparent"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-base transition-all border-2
                  ${
                    step.isComplete
                      ? "bg-[#D4AF37] text-gray-900 border-[#D4AF37]"
                      : index === currentStep
                      ? "border-[#D4AF37] text-[#D4AF37] bg-yellow-700"
                      : "border-yellow-500 text-yellow-500  bg-transparent"
                  }`}
              >
                {step.isComplete ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  step.icon
                )}
              </div>
              <span className="text-sm text-gray-700">{step.label}</span>
              {index < steps.length - 1 && (
                <div className="absolute top-10 left-full w-full h-[1px] -translate-x-1/2 bg-gray-300 z-0" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
