"use client";

import { format } from "date-fns";
import { CaseType, Lawyer } from "@/services/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Calendar,
  FileText,
  CheckCircle,
  User,
  PenSquare,
  Paperclip,
  Edit,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ReviewStepProps {
  selectedCaseType: CaseType | null;
  selectedLawyer: Lawyer | null;
  selectedTime: string | null;
  selectedDate: Date;
  description: string;
  documents: File[];
  onSubmit: () => void;
  isSubmitting: boolean;
  onEditStep: (stepIndex: number) => void;
}

export function ReviewStep({
  selectedCaseType,
  selectedLawyer,
  selectedTime,
  selectedDate,
  description,
  documents,
  onSubmit,
  isSubmitting,
  onEditStep,
}: ReviewStepProps) {
  if (!selectedCaseType || !selectedLawyer || !selectedTime) {
    return (
      <Card className="bg-[#21201f] border-0 shadow-lg rounded-lg overflow-hidden">
        <CardContent className="pt-6">
          <div className="text-center p-6">
            <p className="text-amber-100/60">
              Please complete all previous steps before reviewing your
              appointment.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format time for display (09:00 to 9:00 AM)
  const formatTimeDisplay = (time: string | null) => {
    if (!time) return "Not selected";

    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <Card className="bg-[#21201f] border-0 shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-[#2a251e] border-b border-[#4d3f29]/30 py-4">
        <CardTitle className="text-xl font-bold text-[#d4af37]">
          Review Your Appointment
        </CardTitle>
        <CardDescription className="text-amber-100/70">
          Please verify all details before confirming your booking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        {/* Services and Lawyer Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Case Type Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <PenSquare className="h-5 w-5 text-[#d4af37]" />
                <h3 className="font-medium text-base text-[#d4af37]">
                  Legal Service
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditStep(0)}
                className="h-8 text-[#d4af37] hover:bg-[#353434] hover:text-[#d4af37] px-2"
              >
                <Edit className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            </div>
            <div className="border border-[#4d3f29]/30 rounded-md p-3 bg-[#353434]">
              <Badge className="bg-[#B8860B] hover:bg-[#9A7209] text-black font-medium text-sm px-2 py-0.5">
                {selectedCaseType.name}
              </Badge>
              <p className="mt-2 text-amber-100/90 text-sm">
                {selectedCaseType.description}
              </p>
            </div>
          </div>

          {/* Lawyer Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-[#d4af37]" />
                <h3 className="font-medium text-base text-[#d4af37]">
                  Attorney
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditStep(0)}
                className="h-8 text-[#d4af37] hover:bg-[#353434] hover:text-[#d4af37] px-2"
              >
                <Edit className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            </div>
            <div className="border border-[#4d3f29]/30 rounded-md p-3 bg-[#353434]">
              <div className="flex items-start space-x-3">
                <Avatar className="h-12 w-12 border border-[#4d3f29]/50 shadow-sm">
                  <AvatarImage
                    src={selectedLawyer.profile_image}
                    alt={selectedLawyer.full_name}
                  />
                  <AvatarFallback className="bg-[#B8860B]/20 text-[#d4af37] text-base">
                    {selectedLawyer.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-base text-amber-100">
                    {selectedLawyer.full_name}
                  </h4>
                  <div className="flex items-center mt-1">
                    <Badge className="bg-[#B8860B] hover:bg-[#9A7209] text-black font-medium text-xs">
                      {selectedLawyer.specialization}
                    </Badge>
                  </div>
                  {selectedLawyer.experience && (
                    <p className="text-amber-100/70 mt-1 text-xs">
                      {selectedLawyer.experience} experience
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-[#4d3f29]/20 my-2" />

        {/* Schedule Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-[#d4af37]" />
              <h3 className="font-medium text-base text-[#d4af37]">Schedule</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(1)}
              className="h-8 text-[#d4af37] hover:bg-[#353434] hover:text-[#d4af37] px-2"
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-amber-100">
              Date & Time Details
            </h3>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-amber-100/60">Date:</span>
                <span className="text-amber-100">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-100/60">Time:</span>
                <span className="text-amber-100">
                  {formatTimeDisplay(selectedTime)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-[#4d3f29]/20 my-2" />

        {/* Case Details Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <PenSquare className="h-5 w-5 text-[#d4af37]" />
              <h3 className="font-medium text-base text-[#d4af37]">
                Case Details
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(2)}
              className="h-8 text-[#d4af37] hover:bg-[#353434] hover:text-[#d4af37] px-2"
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          </div>
          <div className="border border-[#4d3f29]/30 rounded-md p-3 bg-[#353434]">
            <p className="text-amber-100 whitespace-pre-wrap text-sm">
              {description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Documents Section */}
        {documents.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <Paperclip className="h-5 w-5 text-[#d4af37]" />
                <h3 className="font-medium text-base text-[#d4af37]">
                  Uploaded Documents
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditStep(2)}
                className="h-8 text-[#d4af37] hover:bg-[#353434] hover:text-[#d4af37] px-2"
              >
                <Edit className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            </div>
            <div className="border border-[#4d3f29]/30 rounded-md p-3 bg-[#2a251e]/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-[#353434] border border-[#4d3f29]/30 rounded-md p-2"
                  >
                    <FileText className="h-5 w-5 text-[#d4af37]" />
                    <div className="overflow-hidden">
                      <span className="text-amber-100 truncate block text-sm">
                        {doc.name}
                      </span>
                      <span className="text-amber-100/50 text-xs">
                        ({(doc.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 p-5 border-t border-[#4d3f29]/30 bg-[#2a251e]/50">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full bg-[#B8860B] hover:bg-[#9A7209] text-black font-semibold h-12 text-base"
        >
          {isSubmitting ? (
            <span className="flex items-center space-x-2">
              <span className="animate-spin">◌</span>
              <span>Processing...</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Confirm Appointment</span>
            </span>
          )}
        </Button>
        <p className="text-xs text-center text-amber-100/60">
          By confirming, you agree to our terms and conditions regarding
          appointment scheduling and cancellation policies.
        </p>
      </CardFooter>
    </Card>
  );
}
