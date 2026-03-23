import { format, addDays, isWeekend } from "date-fns";

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

export type AppointmentFormData = {
  case_type_id: number;
  lawyer_id: number;
  time_slot_id: number;
  description: string;
  documents?: File[];
};

// Mock lawyers data
export const MOCK_LAWYERS: Lawyer[] = [
  {
    id: 1,
    full_name: "Jane Smith",
    email: "jane.smith@expolaw.com",
    specialization: "Family Law",
    profile_image: "https://randomuser.me/api/portraits/women/44.jpg",
    experience: "10 years",
  },
  {
    id: 2,
    full_name: "John Doe",
    email: "john.doe@expolaw.com",
    specialization: "Criminal Law",
    profile_image: "https://randomuser.me/api/portraits/men/32.jpg",
    experience: "15 years",
  },
  {
    id: 3,
    full_name: "Sarah Johnson",
    email: "sarah.johnson@expolaw.com",
    specialization: "Corporate Law",
    profile_image: "https://randomuser.me/api/portraits/women/68.jpg",
    experience: "8 years",
  },
  {
    id: 4,
    full_name: "Michael Chen",
    email: "michael.chen@expolaw.com",
    specialization: "Immigration Law",
    profile_image: "https://randomuser.me/api/portraits/men/26.jpg",
    experience: "12 years",
  },
  {
    id: 5,
    full_name: "Emily Martinez",
    email: "emily.martinez@expolaw.com",
    specialization: "Real Estate Law",
    profile_image: "https://randomuser.me/api/portraits/women/17.jpg",
    experience: "7 years",
  },
  {
    id: 6,
    full_name: "David Wilson",
    email: "david.wilson@expolaw.com",
    specialization: "Family Law",
    profile_image: "https://randomuser.me/api/portraits/men/42.jpg",
    experience: "6 years",
  },
  {
    id: 7,
    full_name: "Lisa Taylor",
    email: "lisa.taylor@expolaw.com",
    specialization: "Corporate Law",
    profile_image: "https://randomuser.me/api/portraits/women/27.jpg",
    experience: "9 years",
  },
];

// Mock case types data
export const MOCK_CASE_TYPES: CaseType[] = [
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

// Generate mock time slots for a given lawyer and date
export function generateMockTimeSlots(
  lawyerId: number,
  date: string
): TimeSlot[] {
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

  // Some slots should be unavailable
  // Use the lawyer ID as a seed to make some slots unavailable in a deterministic way
  const unavailableHours: Record<number, number[]> = {
    1: [12, 15], // Jane Smith: unavailable at 12-1 PM and 3-4 PM
    2: [10, 14], // John Doe: unavailable at 10-11 AM and 2-3 PM
    3: [13, 16], // Sarah Johnson: unavailable at 1-2 PM and 4-5 PM
    4: [11, 15], // Michael Chen: unavailable at 11-12 PM and 3-4 PM
    5: [9, 16], // Emily Martinez: unavailable at 9-10 AM and 4-5 PM
    6: [12, 14], // David Wilson: unavailable at 12-1 PM and 2-3 PM
    7: [10, 13], // Lisa Taylor: unavailable at 10-11 AM and 1-2 PM
  };

  let slotId = 1;
  for (let hour = startHour; hour < endHour; hour++) {
    const startTime = `${hour}:00`;
    const endTime = `${hour + 1}:00`;

    // Determine if this slot is available
    const isAvailable = !unavailableHours[lawyerId]?.includes(hour);

    timeSlots.push({
      id: slotId++,
      lawyer_id: lawyerId,
      start_time: startTime,
      end_time: endTime,
      is_available: isAvailable,
      date: date,
    });
  }

  return timeSlots;
}

// Simulate API response for booking creation
export function mockCreateAppointment(appointmentData: AppointmentFormData) {
  // Simulate API delay
  return new Promise<{ success: boolean; data?: any; error?: string }>(
    (resolve) => {
      setTimeout(() => {
        // 95% success rate
        if (Math.random() > 0.05) {
          resolve({
            success: true,
            data: {
              id: Math.floor(Math.random() * 1000),
              ...appointmentData,
              status: "confirmed",
              created_at: new Date().toISOString(),
            },
          });
        } else {
          resolve({
            success: false,
            error: "Failed to book appointment. Please try again.",
          });
        }
      }, 1500); // 1.5 second delay
    }
  );
}
