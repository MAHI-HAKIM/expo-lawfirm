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
