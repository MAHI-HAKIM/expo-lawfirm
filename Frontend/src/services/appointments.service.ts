"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/utils/api-client";
import { isWeekend } from "date-fns";
import { getAuthToken } from "./users.service";
import { cookies } from "next/headers";

export interface AppointmentFormData {
  case_type_id: number;
  lawyer_id: number;
  time_slot_id: number;
  description: string;
  documents?: File[];
}

export interface Appointment {
  id: number;
  lawyer: number;
  lawyer_name?: string;
  date: string;
  time: string;
  description?: string;
  case_type_id?: number;
  created_at?: string;
  status?: string;
}

export type Lawyer = {
  id: number;
  full_name: string;
  email: string;
  specialization: string;
  profile_image?: string;
  experience?: string;
};

export type CaseType = {
  id: number;
  name: string;
  description?: string;
};

export type TimeSlot = {
  id: number;
  lawyer_id: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  date: string;
};

// Get all lawyers
export async function getLawyers() {
  try {
    const response = await apiClient("/api/lawyers/");
    return response;
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    throw error;
  }
}

// Get all case types
export async function getCaseTypes() {
  try {
    const response = await apiClient("/api/case-types/");
    return response;
  } catch (error) {
    console.error("Error fetching case types:", error);
    throw error;
  }
}

// Get available time slots for a specific lawyer on a specific date
export async function getLawyerTimeSlots(lawyerId: number, date: string) {
  try {
    const response = await apiClient(
      `/api/lawyers/${lawyerId}/timeslots/?date=${date}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching lawyer time slots:", error);
    throw error;
  }
}

// Create a new appointment
export async function createAppointment(appointmentData: AppointmentFormData) {
  try {
    const response = await apiClient("/api/appointments/", {
      method: "POST",
      body: appointmentData,
    });

    revalidatePath("/dashboard");
    revalidatePath("/appointments");
    return { success: true, data: response };
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    return {
      success: false,
      error: error.message || "Failed to create appointment",
    };
  }
}

// Mock data for initial development
export async function getMockLawyers(): Promise<Lawyer[]> {
  return [
    {
      id: 1,
      full_name: "Jane Smith",
      email: "jane.smith@expolaw.com",
      specialization: "Family Law",
      profile_image: "/lawyers/jane-smith.jpg",
      experience: "10 years",
    },
    {
      id: 2,
      full_name: "John Doe",
      email: "john.doe@expolaw.com",
      specialization: "Criminal Law",
      profile_image: "/lawyers/john-doe.jpg",
      experience: "15 years",
    },
    {
      id: 3,
      full_name: "Sarah Johnson",
      email: "sarah.johnson@expolaw.com",
      specialization: "Corporate Law",
      profile_image: "/lawyers/sarah-johnson.jpg",
      experience: "8 years",
    },
    {
      id: 4,
      full_name: "Michael Chen",
      email: "michael.chen@expolaw.com",
      specialization: "Immigration Law",
      profile_image: "/lawyers/michael-chen.jpg",
      experience: "12 years",
    },
    {
      id: 5,
      full_name: "Emily Martinez",
      email: "emily.martinez@expolaw.com",
      specialization: "Real Estate Law",
      profile_image: "/lawyers/emily-martinez.jpg",
      experience: "7 years",
    },
    {
      id: 6,
      full_name: "David Wilson",
      email: "david.wilson@expolaw.com",
      specialization: "Family Law",
      profile_image: "/lawyers/david-wilson.jpg",
      experience: "6 years",
    },
    {
      id: 7,
      full_name: "Lisa Taylor",
      email: "lisa.taylor@expolaw.com",
      specialization: "Corporate Law",
      profile_image: "/lawyers/lisa-taylor.jpg",
      experience: "9 years",
    },
  ];
}

export async function getMockCaseTypes(): Promise<CaseType[]> {
  return [
    {
      id: 1,
      name: "Family Law",
      description:
        "Divorce, child custody, adoption, and other family-related legal matters",
    },
    {
      id: 2,
      name: "Criminal Law",
      description:
        "Legal representation for those accused of criminal offenses and defense strategies",
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
      name: "Immigration Law",
      description:
        "Visa applications, citizenship processes, deportation defense, and refugee status",
    },
  ];
}

export async function getMockTimeSlots(
  lawyerId: number,
  date: string
): Promise<TimeSlot[]> {
  // Check if the date is a weekend
  const dateObj = new Date(date);
  if (isWeekend(dateObj)) {
    // Return empty array for weekends
    return [];
  }

  // Create a seeded random based on date and lawyer ID for consistent results
  const seedValue = parseInt(date.replace(/-/g, "")) + lawyerId;
  const seededRandom = (max: number) => {
    const x = Math.sin(seedValue * 9999) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };

  // Create time slots from 9 AM to 5 PM with 1-hour intervals
  const timeSlots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 17;

  // Implement a few fixed unavailable slots based on lawyer schedule
  // These could represent regular commitments like lunch, meetings, etc.
  const fixedUnavailableSlots: Record<number, number[]> = {
    1: [12], // Jane Smith: lunch at 12-1
    2: [10, 14], // John Doe: unavailable at 10-11 and 2-3
    3: [13, 16], // Sarah Johnson: unavailable at 1-2 and 4-5
    4: [11, 15], // Michael Chen: unavailable at 11-12 and 3-4
    5: [10, 13], // Emily Martinez: unavailable at 10-11 and 1-2
    6: [9, 14], // David Wilson: unavailable at 9-10 and 2-3
    7: [11, 16], // Lisa Taylor: unavailable at 11-12 and 4-5
  };

  // Generate booked appointments for the lawyer on this date (random but deterministic)
  const bookedAppointments: number[] = [];
  const numberOfBookings = seededRandom(3); // 0-2 random bookings per day

  for (let i = 0; i < numberOfBookings; i++) {
    const randomHour = startHour + seededRandom(endHour - startHour);
    if (
      !bookedAppointments.includes(randomHour) &&
      !fixedUnavailableSlots[lawyerId]?.includes(randomHour)
    ) {
      bookedAppointments.push(randomHour);
    }
  }

  // Create all time slots and mark appropriate ones as unavailable
  for (let hour = startHour; hour < endHour; hour++) {
    const startTime = `${hour.toString().padStart(2, "0")}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;

    // Check if this hour is unavailable (fixed schedule or booked)
    const isUnavailable =
      fixedUnavailableSlots[lawyerId]?.includes(hour) ||
      bookedAppointments.includes(hour);

    timeSlots.push({
      id: hour - startHour + 1,
      lawyer_id: lawyerId,
      start_time: startTime,
      end_time: endTime,
      is_available: !isUnavailable,
      date,
    });
  }

  return timeSlots;
}

/**
 * Fetches available appointment times for a specific lawyer on a given date
 */
export async function getAvailableTimes(
  lawyerId: number,
  date: string
): Promise<string[]> {
  try {
    const response = await apiClient(
      `/api/appointments/available-times/?lawyer_id=${lawyerId}&date=${date}`
    );

    if (response?.available_times) {
      console.log("Available times:", response.available_times);
      return response.available_times;
    }

    return [];
  } catch (error) {
    console.error("Error fetching available times:", error);
    return [];
  }
}

/**
 * Books an appointment with a lawyer
 */
export async function bookAppointment(appointmentData: {
  lawyer: number;
  date: string;
  time: string;
  description?: string;
  case_type_id?: number;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAuthToken();

    if (!token) {
      return { success: false, error: "Authentication token not found" };
    }

    const response = await apiClient("/api/appointments/create/", {
      method: "POST",
      body: appointmentData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    revalidatePath("/appointments");
    revalidatePath("/dashboard");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error booking appointment:", error);
    return {
      success: false,
      error: error.message || "Failed to book appointment",
    };
  }
}

/**
 * Fetches all appointments for the current user
 */
export async function getMyAppointments(): Promise<Appointment[]> {
  try {
    return await apiClient("/api/appointments/my-appointments/");
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
}

/**
 * Cancels an appointment by ID
 */
export async function cancelAppointment(appointmentId: number) {
  try {
    await apiClient(`/api/appointments/cancel/${appointmentId}/`, {
      method: "PATCH",
    });

    revalidatePath("/appointments");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error canceling appointment:", error);
    return {
      success: false,
      error: "Failed to cancel appointment",
    };
  }
}
