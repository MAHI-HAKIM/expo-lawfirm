export type AppointmentStatus =
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled";

export type UserData = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  is_staff: boolean;
  role: string;
};

export interface Appointment {
  id: string;
  title: string;
  attorneyName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  avatarUrl?: string;
}

export interface Notification {
  id: string;
  type: "appointment" | "message" | "document" | "other";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface StatCard {
  title: string;
  count: number;
  description: string;
  icon: React.ReactNode;
}
