"use server";

import axiosInstance from "@/lib/axios";
import { Lawyer } from "@/types/Lawyer";
import { revalidatePath } from "next/cache";
import { isWeekend } from "date-fns";
import { getAuthToken } from "./users.service";
import { getMyAppointments } from "./appointments.service";
import { apiClient } from "@/utils/api-client";

/* Get all lawyers */
export async function getAllLawyers(): Promise<Lawyer[]> {
  try {
    const response = await axiosInstance("/api/users/list-lawyers/");

    // Only log the data part of the response, not the entire response object
    if (response?.data) {
      console.log("Lawyers data:", response.data);
    }

    // Return only the data array, not the entire response object
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    return [];
  }
}

/* Register Lawyer */
export async function registerLawyer(formData: {
  full_name: string;
  email: string;
  phone: string;
  specialization: string;
  bio: string;
}) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return { error: "Authentication token not found" };
    }

    // Transform the data to match the exact required format
    const requestData = {
      email: formData.email,
      full_name: formData.full_name,
      phone: formData.phone,
      specialization: formData.specialization,
      bio: formData.bio || "",
    };

    const response = await apiClient("/api/auth/create-lawyer/", {
      method: "POST",
      body: requestData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response:", response);
    // Revalidate all paths that might show lawyer data
    revalidatePath("/lawyers");
    revalidatePath("/admin/lawyers");
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true, data: response };
  } catch (error: any) {
    console.error("Error registering lawyer:", error);
    return {
      success: false,
      error: error.message || "Failed to register lawyer",
    };
  }
}

/* Delete Lawyer */
export async function deleteLawyer(lawyerId: number) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return { error: "Authentication token not found" };
    }

    console.log("lawyerId", lawyerId);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const url = `${baseUrl}/api/users/lawyer/${lawyerId}/delete/`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Delete response status:", response.status);

    revalidatePath("/lawyers");
    revalidatePath("/admin");

    // 2xx status codes indicate success
    if (response.status >= 200 && response.status < 300) {
      return { success: true };
    } else {
      // Handle non-2xx responses
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error("Error deleting lawyer:", error);
    throw error;
  }
}

/* Get lawyers with appointments for the current user */
export async function getLawyersWithAppointments() {
  try {
    const token = await getAuthToken();

    if (!token) {
      return { error: "Authentication token not found" };
    }

    // First get user's appointments
    const appointments = await getMyAppointments();

    // Get unique lawyer IDs from appointments
    const lawyerIds = [...new Set(appointments.map((app) => app.lawyer))];

    // Get all lawyers
    const allLawyers = await getAllLawyers();

    // Filter lawyers to only those with appointments
    const lawyersWithAppointments = allLawyers
      .filter((lawyer) => lawyerIds.includes(lawyer.id))
      .map((lawyer) => ({
        id: lawyer.id,
        name: lawyer.full_name,
        email: lawyer.email,
        specialization: lawyer.specialization,
      }));

    return { success: true, data: lawyersWithAppointments };
  } catch (error) {
    console.error("Error fetching lawyers with appointments:", error);
    return { error: "Failed to fetch lawyers" };
  }
}
