"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getAvailableTimes } from "@/services/appointments.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";

interface TimeSlotSelectorProps {
  lawyerId: number | null;
  onSelectTimeSlot: (time: string) => void;
  selectedTime: string | null;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function TimeSlotSelector({
  lawyerId,
  onSelectTimeSlot,
  selectedTime,
  selectedDate,
  onDateChange,
}: TimeSlotSelectorProps) {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Format the selected date for API calls and display
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  // Fetch available times when lawyer or date changes
  useEffect(() => {
    async function fetchAvailableTimes() {
      if (!lawyerId) return;

      setIsLoading(true);
      try {
        const times = await getAvailableTimes(lawyerId, formattedDate);
        setAvailableTimes(times);
      } catch (error) {
        console.error("Error fetching available times:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAvailableTimes();
  }, [lawyerId, formattedDate]);

  // Format time for display (e.g., "09:00" to "9:00 AM")
  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Date Selection */}
      <Card className="border-0 shadow-lg rounded-lg overflow-hidden bg-[#21201f] dark:bg-[#2d2823]">
        <CardHeader className="bg-[#2a251e] border-b border-[#4d3f29]/30">
          <CardTitle className="text-xl font-bold text-[#d4af37]">
            Select Date
          </CardTitle>
          <CardDescription className="text-amber-100/70">
            Choose an available appointment date
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateChange(date)}
            className="text-amber-100"
            disabled={{ before: new Date() }}
          />
        </CardContent>
      </Card>

      {/* Time Slots */}
      <Card className="border-0 shadow-lg rounded-lg overflow-hidden bg-[#21201f] dark:bg-[#2d2823]">
        <CardHeader className="bg-[#2a251e] border-b border-[#4d3f29]/30">
          <CardTitle className="text-xl font-bold text-[#d4af37]">
            Available Times
          </CardTitle>
          <CardDescription className="text-amber-100/70">
            Select a time slot for {format(selectedDate, "MMMM d, yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          {!lawyerId ? (
            <div className="p-6 text-center border border-dashed rounded-md border-[#4d3f29]/60 bg-[#2a251e]/50">
              <p className="text-amber-100/60">
                Please select a lawyer first to see available times.
              </p>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-12 w-full bg-[#2a251e]" />
              ))}
            </div>
          ) : availableTimes.length === 0 ? (
            <div className="p-6 text-center border border-dashed rounded-md border-[#4d3f29]/60 bg-[#2a251e]/50">
              <p className="text-amber-100/60">
                No available time slots for this date. Please select another
                date.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={`h-12 ${
                    selectedTime === time
                      ? "bg-[#B8860B] hover:bg-[#9A7209] text-black"
                      : "border-[#4d3f29]/40 text-amber-100 hover:bg-[#353434] hover:border-[#B8860B]/70"
                  }`}
                  onClick={() => onSelectTimeSlot(time)}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {formatTimeDisplay(time)}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
