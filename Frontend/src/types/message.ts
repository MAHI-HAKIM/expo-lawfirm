export interface Lawyer {
  id: number;
  name: string;
  email: string;
  specialization: string;
  avatarUrl?: string;
}

export interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  timestamp: string;
  isFromLawyer: boolean;
}
