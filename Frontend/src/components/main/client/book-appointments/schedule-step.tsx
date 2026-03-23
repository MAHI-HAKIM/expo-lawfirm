"use client";

import { useState, useEffect } from "react";
import {
  format,
  isWeekend,
  isBefore,
  startOfDay,
  isToday,
  parseISO,
  isSameDay,
} from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Lawyer } from "@/services/mock-data";
import { getAvailableTimes } from "@/services/appointments.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  CalendarIcon,
  Clock2,
  User,
  XCircle,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ScheduleStepProps {
  onSelectTimeSlot: (time: string) => void;
  selectedTimeSlot: string | null;
  selectedLawyerId: number | null;
  isLoading: boolean;
  onDateChange: (date: Date) => void;
  selectedDate: Date;
  lawyer: Lawyer | null;
}

export function ScheduleStep({
  onSelectTimeSlot,
  selectedTimeSlot,
  selectedLawyerId,
  isLoading: initialLoading,
  onDateChange,
  selectedDate,
  lawyer,
}: ScheduleStepProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [filteredTimes, setFilteredTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(initialLoading);

  // Format the selected date for API
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  // Fetch available times when lawyer or date changes
  useEffect(() => {
    async function fetchAvailableTimes() {
      if (!selectedLawyerId) return;

      setIsLoading(true);
      try {
        const times = await getAvailableTimes(selectedLawyerId, formattedDate);
        setAvailableTimes(times);
      } catch (error) {
        console.error("Error fetching available times:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAvailableTimes();
  }, [selectedLawyerId, formattedDate]);

  // Filter out past times for today
  useEffect(() => {
    if (isToday(selectedDate)) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Filter times that are in the future
      const filtered = availableTimes.filter((timeString) => {
        const [hours, minutes] = timeString.split(":").map(Number);
        return (
          hours > currentHour ||
          (hours === currentHour && minutes > currentMinute)
        );
      });

      setFilteredTimes(filtered);

      // If the selected time is now in the past, clear it
      if (selectedTimeSlot) {
        const [selectedHours, selectedMinutes] = selectedTimeSlot
          .split(":")
          .map(Number);
        if (
          selectedHours < currentHour ||
          (selectedHours === currentHour && selectedMinutes <= currentMinute)
        ) {
          onSelectTimeSlot("");
        }
      }
    } else {
      // For future dates, all available times are valid
      setFilteredTimes(availableTimes);
    }
  }, [availableTimes, selectedDate, selectedTimeSlot, onSelectTimeSlot]);

  const today = startOfDay(new Date());

  // Function to check if a date is disabled
  const isDateDisabled = (date: Date) => {
    return isWeekend(date) || isBefore(date, today);
  };

  // Format time for display
  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="bg-[#21201f] border-0 shadow-lg">
          <CardHeader className="bg-[#2a251e] border-b border-[#4d3f29]/30">
            <Skeleton className="h-8 w-2/3 bg-[#383838]" />
            <Skeleton className="h-4 w-full bg-[#383838]" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Skeleton className="h-16 w-full bg-[#383838]" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full bg-[#383838]" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="bg-[#21201f] border-0 shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-[#2a251e] border-b border-[#4d3f29]/30">
        <CardTitle className="text-xl font-bold text-[#d4af37]">
          Schedule Your Appointment
        </CardTitle>
        <CardDescription className="text-amber-100/70">
          {lawyer
            ? `Select a convenient time to meet with ${lawyer.full_name}`
            : "Choose your preferred date and time"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {lawyer && (
            <div className="flex items-center p-4 bg-[#353434] rounded-md border border-[#4d3f29]/40">
              <User className="h-5 w-5 text-[#d4af37] mr-3" />
              <span className="text-amber-100">
                <span className="font-medium">{lawyer.full_name}</span> •{" "}
                {lawyer.specialization}
              </span>
            </div>
          )}

          <div className="space-y-6">
            {/* Date Selection */}
            <div className="space-y-4">
              <p className="text-lg font-medium text-[#d4af37] flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Select a Date
              </p>

              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-between bg-[#383838] hover:bg-[#454545] border-[#4d3f29]/40 hover:border-[#B8860B]/70 text-amber-100 h-12 px-4 ${
                      !selectedLawyerId ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    disabled={!selectedLawyerId}
                  >
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-5 w-5 text-[#d4af37]" />
                      <span>{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-[#2c2c2c] border border-[#4d3f29]/40"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        onDateChange(date);
                        setCalendarOpen(false);
                      }
                    }}
                    disabled={isDateDisabled}
                    className="rounded-md"
                    classNames={{
                      day_selected:
                        "bg-[#B8860B] text-white hover:bg-[#B8860B] font-bold",
                      day_today:
                        "bg-[#B8860B]/20 text-[#d4af37] font-bold ring-1 ring-[#d4af37]",
                      day_outside: "text-gray-500 opacity-50",
                      day: "h-10 w-10 font-normal text-amber-100 hover:bg-[#3b3022] hover:text-[#d4af37] focus:bg-[#3b3022]",
                      head_cell: "text-[#d4af37] font-medium",
                      table: "mx-auto",
                      row: "flex space-x-1 mt-1",
                      cell: "h-10 w-10 p-0 relative",
                      nav_button: "text-amber-100 hover:text-[#d4af37] p-1",
                      nav: "space-x-1 flex items-center px-2 py-1",
                      caption: "text-amber-100 py-1 font-medium",
                      months: "bg-[#2a251e] rounded-md",
                      month: "p-3",
                    }}
                    modifiersClassNames={{
                      weekend: "bg-[#333333] text-gray-500",
                      disabled:
                        "text-gray-500 bg-[#2c2c2c]/50 line-through cursor-not-allowed",
                    }}
                    modifiers={{
                      weekend: (date) => isWeekend(date),
                    }}
                  />
                </PopoverContent>
              </Popover>

              {!selectedLawyerId && (
                <p className="text-amber-100/60 text-sm">
                  Please select a lawyer first to view available dates
                </p>
              )}

              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#B8860B]/20 border border-[#d4af37] mr-2"></div>
                  <span className="text-amber-100/70">Today</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#B8860B] mr-2"></div>
                  <span className="text-amber-100/70">Selected date</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#333333] mr-2"></div>
                  <span className="text-amber-100/70">Weekend/unavailable</span>
                </div>
              </div>
            </div>

            {/* Time Slots Section */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-lg font-medium text-[#d4af37] flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Available Time Slots
                </p>
                <div className="text-sm font-medium text-amber-100/70">
                  {format(selectedDate, "EEE, MMM d, yyyy")}
                </div>
              </div>

              {!selectedLawyerId ? (
                <div className="flex flex-col items-center justify-center h-40 border border-dashed border-[#4d3f29]/60 rounded-md p-6 bg-[#2a251e]/50">
                  <User className="h-10 w-10 text-amber-100/30 mb-3" />
                  <p className="text-center text-amber-100/60">
                    Please select a lawyer first
                  </p>
                </div>
              ) : isWeekend(selectedDate) ? (
                <div className="flex flex-col items-center justify-center h-60 border border-dashed border-[#4d3f29]/60 rounded-md p-6 bg-[#2a251e]/50">
                  <XCircle className="h-12 w-12 text-amber-100/30 mb-4" />
                  <p className="text-center text-amber-100/60">
                    No appointments available on weekends.
                    <br />
                    <span className="text-sm mt-1 text-amber-100/40">
                      Please select a weekday.
                    </span>
                  </p>
                </div>
              ) : isToday(selectedDate) &&
                filteredTimes.length === 0 &&
                availableTimes.length > 0 ? (
                <div className="flex flex-col items-center justify-center h-60 border border-dashed border-[#4d3f29]/60 rounded-md p-6 bg-[#2a251e]/50">
                  <AlertTriangle className="h-12 w-12 text-amber-600/70 mb-4" />
                  <p className="text-center text-amber-100/70">
                    All appointments for today have reserved or passed.
                    <br />
                    <span className="text-sm mt-1 block text-amber-100/60">
                      Please select a future date for your appointment.
                    </span>
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-amber-600/50 bg-amber-950/30 text-amber-200 hover:bg-amber-900/30"
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      // Skip weekends
                      while (isWeekend(tomorrow)) {
                        tomorrow.setDate(tomorrow.getDate() + 1);
                      }
                      onDateChange(tomorrow);
                    }}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Try Next Available Day
                  </Button>
                </div>
              ) : filteredTimes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 border border-dashed border-[#4d3f29]/60 rounded-md p-6 bg-[#2a251e]/50">
                  <Clock2 className="h-12 w-12 text-amber-100/30 mb-4" />
                  <p className="text-center text-amber-100/60">
                    No available time slots for this date.
                    <br />
                    <span className="text-sm mt-1 text-amber-100/40">
                      Please select another date.
                    </span>
                  </p>
                </div>
              ) : (
                <div className="border border-[#4d3f29]/40 rounded-lg overflow-hidden shadow-md bg-[#2a251e]/30">
                  {isToday(selectedDate) && (
                    <div className="bg-[#3b3022] py-2 px-4 border-b border-[#4d3f29]/40">
                      <p className="text-amber-100/80 text-sm flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                        Showing only upcoming times for today
                      </p>
                    </div>
                  )}
                  <div className="bg-[#353434] py-2 px-4 border-b border-[#4d3f29]/30">
                    <h4 className="text-[#d4af37] font-medium">
                      Select a time
                    </h4>
                  </div>
                  <ScrollArea className="h-64 p-3">
                    <div className="grid grid-cols-2 gap-3 p-2">
                      {filteredTimes.map((time) => (
                        <Button
                          key={time}
                          variant="outline"
                          className={`h-auto py-3 justify-start ${
                            selectedTimeSlot === time
                              ? "bg-[#3b3022] border-[#B8860B] text-[#d4af37]"
                              : "bg-[#383838] border-[#4d3f29]/40 text-amber-100 hover:bg-[#3b3022] hover:border-[#B8860B]/70"
                          }`}
                          onClick={() => onSelectTimeSlot(time)}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{formatTimeDisplay(time)}</span>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
