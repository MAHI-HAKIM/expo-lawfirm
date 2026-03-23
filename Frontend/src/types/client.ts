export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export interface Appointment {
  id: string;
  title: string;
  lawyerId: string;
  lawyerName: string;
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  details: string;
}

export interface Lawyer {
  id: string;
  name: string;
  image: string;
  specialties: string[];
  experience: string;
  education: string;
  availability: string;
  bio: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export const clientFilterItems = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];
