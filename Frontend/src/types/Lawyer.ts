export const specializations = [
  "Criminal Law",
  "Family Law",
  "Corporate Law",
  "Real Estate Law",
  "General Practice",
] as const;

export type Specialization = (typeof specializations)[number];

export const specializationColors = {
  "Criminal Law": {
    bg: "rgba(255, 165, 0, 0.2)", // Orange
    text: "#FFA500",
  },
  "Family Law": {
    bg: "rgba(59, 130, 246, 0.2)", // blue
    text: "#3B82F6",
  },
  "Corporate Law": {
    bg: "rgba(16, 185, 129, 0.2)", // green
    text: "#10B981",
  },
  "Real Estate Law": {
    bg: "rgba(245, 158, 11, 0.2)", // amber
    text: "#F59E0B",
  },
  "General Practice": {
    bg: "rgba(139, 92, 246, 0.2)", // purple
    text: "#8B5CF6",
  },
  default: {
    bg: "rgba(156, 163, 175, 0.2)", // gray
    text: "#9CA3AF",
  },
} as const;

export interface Lawyer {
  id: number;
  phone: unknown;
  email: string;
  full_name: string;
  phone_number?: string;
  specialization: string;
  bio?: string;
  profile_image?: string;
  experience?: string;
}

export const mockLawyers: Lawyer[] = [
  {
    id: 1,
    email: "lawyer1@example.com",
    full_name: "John Doe",
    phone: "1234567890",
    specialization: "Criminal Law",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    email: "lawyer2@example.com",
    full_name: "Jane Smith",
    phone: "0987654321",
    specialization: "Family Law",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 3,
    email: "lawyer3@example.com",
    full_name: "Michael Brown",
    phone: "5551234567",
    specialization: "Corporate Law",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 4,
    email: "lawyer4@example.com",
    full_name: "Emily Johnson",
    phone: "4445556666",
    specialization: "Immigration Law",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 5,
    email: "lawyer5@example.com",
    full_name: "David Lee",
    phone: "3334445555",
    specialization: "Tax Law",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

export const lawyersFilterItems = [
  { label: "Criminal Law", value: "criminal_law" },
  { label: "Family Law", value: "family_law" },
  { label: "Corporate Law", value: "corporate_law" },
  { label: "Real Estate Law", value: "real_estate_law" },
  { label: "General Practice", value: "general_practice" },
];
