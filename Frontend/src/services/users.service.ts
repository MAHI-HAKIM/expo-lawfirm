"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserData } from "@/types";
import { apiClient } from "@/utils/api-client";
import { revalidatePath } from "next/cache";

export interface Role {
  id: number;
  name: string;
}

// Helper function to get auth token
export const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
};

// Get all users (for admin)
export async function listUsers() {
  const token = await getAuthToken();
  if (!token) {
    redirect("/signin");
  }

  try {
    const response = await apiClient("/api/users/list-all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error: any) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(profileData: UserData) {
  const token = await getAuthToken();
  if (!token) {
    redirect("/signin");
  }

  try {
    const response = await apiClient("/api/users/profile/update/", {
      method: "POST",
      body: profileData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
}

// Set user role
export async function setUserRole(userId: number, roleId: number) {
  const token = await getAuthToken();
  if (!token) {
    redirect("/signin");
  }

  try {
    // Explicitly set token for server-side execution
    const response = await apiClient(`/api/users/${userId}/set-role/`, {
      method: "PUT",
      body: { role_id: roleId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error(`Failed to set role for user ${userId}:`, error);
    throw error;
  }
}

// Delete user
export async function deleteUser(userId: number) {
  const token = await getAuthToken();
  if (!token) {
    redirect("/signin");
  }

  try {
    // Get the base URL from environment or use the default
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const url = `${baseUrl}/api/users/${userId}/delete/`;

    console.log("Deleting user from:", url);

    // Make a direct fetch call to ensure proper handling of 204
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Delete response status:", response.status);

    revalidatePath("/users");
    revalidatePath("/admin");

    // 2xx status codes indicate success
    if (response.status >= 200 && response.status < 300) {
      return true;
    } else {
      // Handle non-2xx responses
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error(`Failed to delete user ${userId}:`, error);
    throw error;
  }
}

// Get user details
export async function getUserDetails(userId: number) {
  const token = await getAuthToken();
  if (!token) {
    redirect("/signin");
  }

  try {
    // Explicitly set token for server-side execution
    const response = await apiClient(`/api/users/${userId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error(`Failed to get user ${userId} details:`, error);
    throw error;
  }
}

// Get user statistics for admin dashboard
export async function getUserStats() {
  const token = await getAuthToken();
  if (!token) {
    redirect("/signin");
  }

  try {
    // Explicitly set token for server-side execution
    const response = await apiClient("/api/users/stats/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch user statistics:", error);
    throw error;
  }
}

interface ProfileUpdateData {
  full_name?: string;
  phone?: string;
}

interface PasswordResetData {
  current_password: string;
  new_password: string;
}

/**
 * Updates the current user's profile
 */
export async function updateProfile(
  data: ProfileUpdateData
): Promise<{ success: boolean; error?: string }> {
  try {
    const accessToken = await getAuthToken();

    if (!accessToken) {
      return { success: false, error: "Not authenticated" };
    }

    console.log("new data ", data);
    const response = await apiClient("/api/users/profile/update/", {
      method: "PATCH",
      body: data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // Revalidate paths that might show user data
    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("Error updating profile:", error);

    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Failed to update profile";

    return { success: false, error: errorMessage };
  }
}

/**
 * Resets the current user's password
 */
export async function resetPassword(
  data: PasswordResetData
): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return { success: false, error: "Not authenticated" };
    }

    await apiClient("/api/users/reset-password/", {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error resetting password:", error);

    // Handle specific error responses
    if (error.response?.status === 400) {
      if (error.response.data?.current_password) {
        return { success: false, error: "Current password is incorrect" };
      }

      if (error.response.data?.new_password) {
        return { success: false, error: error.response.data.new_password[0] };
      }
    }

    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Failed to reset password";

    return { success: false, error: errorMessage };
  }
}
