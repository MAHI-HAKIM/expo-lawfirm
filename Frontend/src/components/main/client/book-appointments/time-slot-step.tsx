"use client";

import { useState, useEffect } from "react";
import { format, addDays, isToday, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlot } from "@/services/appointments.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";

interface TimeSlotStepProps {
  onSelectTimeSlot: (timeSlotId: number) => void;
  selectedTimeSlotId: number | null;
  selectedLawyerId: number | null;
  timeSlots: TimeSlot[];
  isLoading: boolean;
  onDateChange: (date: Date) => void;
  selectedDate: Date;
}

export function TimeSlotStep({
  onSelectTimeSlot,
  selectedTimeSlotId,
  selectedLawyerId,
  timeSlots,
  isLoading,
  onDateChange,
  selectedDate,
}: TimeSlotStepProps) {
  const handleTimeSlotChange = (timeSlotId: string) => {
    onSelectTimeSlot(parseInt(timeSlotId, 10));
  };

  // Filter time slots that are available
  const availableTimeSlots = timeSlots.filter((slot) => slot.is_available);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Skeleton className="h-72 w-full" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
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
          Select Appointment Time
        </CardTitle>
        <CardDescription>
          Choose a date and time that works for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Calendar for date selection */}
          <div>
            <h3 className="mb-2 font-medium">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date: Date | undefined) => date && onDateChange(date)}
              className="border rounded-md p-3 border-amber-200 dark:border-amber-800"
              classNames={{
                day_selected: "bg-amber-600 text-white hover:bg-amber-600",
                day_today:
                  "bg-amber-100 text-amber-900 dark:bg-amber-800/20 dark:text-amber-400",
              }}
              disabled={{ before: new Date() }}
            />

            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <p>• Available dates are shown in the calendar</p>
              <p>• Today is highlighted with a circle</p>
            </div>
          </div>

          {/* Time slots for selected date */}
          <div>
            <h3 className="mb-3 font-medium">
              Available Time Slots for {format(selectedDate, "MMMM d, yyyy")}
              {isToday(selectedDate) && (
                <Badge className="ml-2 bg-amber-600">Today</Badge>
              )}
            </h3>

            {availableTimeSlots.length === 0 ? (
              <div className="p-4 text-center border rounded-md border-amber-200 dark:border-amber-800">
                <Clock className="mx-auto h-12 w-12 text-amber-600 mb-2 opacity-70" />
                <p className="text-gray-600 dark:text-gray-400">
                  No available time slots for this date. Please select another
                  date.
                </p>
              </div>
            ) : (
              <RadioGroup
                value={selectedTimeSlotId?.toString() || ""}
                onValueChange={handleTimeSlotChange}
                className="space-y-3"
              >
                {availableTimeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center border rounded-md p-3 border-amber-200 dark:border-amber-800 transition-colors hover:bg-amber-50 dark:hover:bg-amber-900/10"
                  >
                    <RadioGroupItem
                      value={slot.id.toString()}
                      id={`time-slot-${slot.id}`}
                      className="border-amber-500 text-amber-500"
                    />
                    <Label
                      htmlFor={`time-slot-${slot.id}`}
                      className="flex flex-1 ml-3 cursor-pointer"
                    >
                      <Clock className="h-5 w-5 mr-2 text-amber-600" />
                      <span>
                        {slot.start_time} - {slot.end_time}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
