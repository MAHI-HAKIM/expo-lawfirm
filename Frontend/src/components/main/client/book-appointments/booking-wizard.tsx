"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CaseAndLawyerSelector } from "./case-and-lawyer-selector";
import { ScheduleStep } from "./schedule-step";
import { DetailsStep } from "./details-step";
import { ReviewStep } from "./review-step";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import {
  MOCK_CASE_TYPES,
  type CaseType,
  type Lawyer,
} from "@/services/mock-data";
import TabSteps from "./tab-steps";
import { getAllLawyers } from "@/services/lawyers.service";
import { bookAppointment } from "@/services/appointments.service";
import toast from "react-hot-toast";

export function BookingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step data
  const [caseTypes, setCaseTypes] = useState<CaseType[]>([]);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);

  // Selected values
  const [selectedCaseTypeId, setSelectedCaseTypeId] = useState<number | null>(
    null
  );
  const [selectedLawyerId, setSelectedLawyerId] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [description, setDescription] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);

  // Computed values based on selections
  const selectedCaseType =
    caseTypes.find((ct) => ct.id === selectedCaseTypeId) || null;
  const selectedLawyer = lawyers.find((l) => l.id === selectedLawyerId) || null;

  // Load initial mock data
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        // Simulate delay to show loading state
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get case types from mock data for now
        setCaseTypes(MOCK_CASE_TYPES);

        // Fetch real lawyers from backend
        const fetchedLawyers = await getAllLawyers();
        setLawyers(fetchedLawyers);
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Steps configuration
  const steps = [
    {
      id: "case-lawyer",
      label: "Select Service",
      description: "Choose case type & lawyer",
      icon: "1",
      content: (
        <CaseAndLawyerSelector
          onSelectCaseType={handleCaseTypeSelect}
          onSelectLawyer={setSelectedLawyerId}
          selectedCaseTypeId={selectedCaseTypeId}
          selectedLawyerId={selectedLawyerId}
        />
      ),
      isComplete: selectedCaseTypeId !== null && selectedLawyerId !== null,
    },
    {
      id: "schedule",
      label: "Schedule",
      description: "Select date & time",
      icon: "2",
      content: (
        <ScheduleStep
          onSelectTimeSlot={setSelectedTime}
          selectedTimeSlot={selectedTime}
          selectedLawyerId={selectedLawyerId}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          isLoading={isLoading}
          lawyer={selectedLawyer}
        />
      ),
      isComplete: selectedTime !== null,
    },
    {
      id: "details",
      label: "Details",
      description: "Add case details",
      icon: "3",
      content: (
        <DetailsStep
          description={description}
          onDescriptionChange={setDescription}
          documents={documents}
          onDocumentsChange={setDocuments}
        />
      ),
      isComplete: description.trim().length > 0,
    },
    {
      id: "review",
      label: "Review",
      description: "Confirm booking",
      icon: "4",
      content: (
        <ReviewStep
          selectedCaseType={selectedCaseType}
          selectedLawyer={selectedLawyer}
          selectedTime={selectedTime}
          selectedDate={selectedDate}
          description={description}
          documents={documents}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onEditStep={handleEditStep}
        />
      ),
      isComplete: false,
    },
  ];

  // Handle case type selection - filter lawyers
  function handleCaseTypeSelect(caseTypeId: number) {
    setSelectedCaseTypeId(caseTypeId);
    setSelectedLawyerId(null); // Reset lawyer selection when case type changes
    setSelectedTime(null); // Reset time selection when case type changes
  }

  // Handle date change - clear time selection when date changes
  function handleDateChange(date: Date) {
    setSelectedDate(date);
    setSelectedTime(null);
  }

  function handleEditStep(stepIndex: number) {
    setCurrentStep(stepIndex);
  }

  function goToNextStep() {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  function goToPreviousStep() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  async function handleSubmit() {
    if (!selectedLawyerId || !selectedTime) {
      toast.error("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);

    // Create a loading toast that we can dismiss on success or error
    const loadingToast = toast.loading("Booking your appointment...");

    try {
      // Create appointment data with the required fields for the API
      const appointmentData = {
        lawyer: selectedLawyerId,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        // Include description and case_type_id as optional fields
        ...(description && { description }),
        ...(selectedCaseTypeId && { case_type_id: selectedCaseTypeId }),
      };

      console.log("appointmentData ", appointmentData);

      // Use the bookAppointment function
      const result = await bookAppointment(appointmentData);

      console.log("result ", result);

      if (result.success) {
        toast.dismiss(loadingToast);
        toast.success("Your appointment has been successfully scheduled!");

        // Redirect to dashboard or appointments page
        router.push("/dashboard");
      } else {
        toast.dismiss(loadingToast);
        toast.error(
          result.error || "Failed to book appointment. Please try again."
        );
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.dismiss(loadingToast);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Progress tabs */}
      <TabSteps
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />

      {/* Content - only render once */}
      <div className="mt-6 mb-10">{steps[currentStep].content}</div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-10 mb-16">
        <Button
          onClick={goToPreviousStep}
          variant="outline"
          disabled={currentStep === 0}
          className="border-[#4d3f29]/40 text-amber-100 hover:bg-[#353434] hover:border-[#B8860B]/70 px-6 py-4 text-base"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button
            onClick={goToNextStep}
            disabled={!steps[currentStep].isComplete || isLoading}
            className="bg-[#B8860B] hover:bg-[#9A7209] text-black font-semibold px-8 py-4 text-base"
          >
            Next
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedLawyerId || !selectedTime}
            className="bg-[#B8860B] hover:bg-[#9A7209] text-black font-semibold px-8 py-4 text-base"
          >
            {isSubmitting ? "Processing..." : "Confirm Booking"}
            <CheckCircle className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
