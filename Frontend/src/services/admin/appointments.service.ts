"use server";
import { apiClient } from "@/utils/api-client";
import { getAuthToken } from "../users.service";
import { revalidatePath } from "next/cache";

export interface AdminAppointment {
  id: number;
  lawyer_id: number;
  lawyer_full_name: string;
  lawyer_email: string;
  client_id: number;
  client_full_name: string;
  client_email: string;
  date: string;
  time: string;
  description?: string;
  created_at: string;
  status: "pending" | "approved" | "cancelled";
}

export async function getAllAppointments(): Promise<AdminAppointment[]> {
  try {
    const accessToken = await getAuthToken();

    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    const response = await apiClient("/api/appointments/all-appointments/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  } catch (error: any) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
}

export async function approveAppointment(
  appointmentId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const accessToken = await getAuthToken();

    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    const response = await apiClient(
      `/api/appointments/lawyer/appointment-status/${appointmentId}/`,
      {
        method: "PATCH",
        body: {
          status: "approved",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    revalidatePath("/appointments");
    revalidatePath("/dashboard");
    revalidatePath("/admin");
    revalidatePath("/my-appointments");
    return { success: true };
  } catch (error: any) {
    console.error("Error approving appointment:", error);
    return {
      success: false,
      error: error.message || "Failed to approve appointment",
    };
  }
}

export async function cancelAppointmentAdmin(
  appointmentId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const accessToken = await getAuthToken();

    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    const response = await apiClient(
      `/api/appointments/lawyer/appointment-status/${appointmentId}/`,
      {
        method: "PATCH",
        body: {
          status: "cancelled",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    revalidatePath("/appointments");
    revalidatePath("/dashboard");
    revalidatePath("/admin");
    revalidatePath("/my-appointments");
    return { success: true };
  } catch (error: any) {
    console.error("Error canceling appointment:", error);
    return {
      success: false,
      error: error.message || "Failed to cancel appointment",
    };
  }
}
