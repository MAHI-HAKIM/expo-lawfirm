"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserData } from "@/types";
import { apiClient } from "@/utils/api-client";
import { revalidatePath } from "next/cache";

// Interface for auth tokens
interface AuthTokens {
  access: string;
  refresh: string;
}

// Helper function to set auth cookies
async function setAuthCookies(tokens: AuthTokens) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "access_token",
    value: tokens.access,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "lax",
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", tokens.access);
  }

  cookieStore.set({
    name: "refresh_token",
    value: tokens.refresh,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
  });
}

/**
 * Helper function to fetch user data with a token
 */
async function fetchUserData(token: string): Promise<UserData> {
  try {
    const response = await apiClient("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch user data: ${error}`);
  }
}

/**
 * Helper function to refresh the auth token
 */
async function refreshAuthToken(refreshToken: string): Promise<AuthTokens> {
  const response = await apiClient("/api/auth/refresh/", {
    method: "POST",
    body: { refresh: refreshToken },
  });
  return response;
}

/**
 * Server action to get the current authenticated user's data
 * This function only retrieves user data and does not modify cookies
 */
export async function getCurrentUser(): Promise<UserData | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return null;
  }

  try {
    return await fetchUserData(accessToken);
  } catch (error) {
    return null;
  }
}

/**
 * Server action to refresh user session
 * This function handles token refresh and cookie updates
 */
export async function refreshUserSession(): Promise<UserData | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    await clearAuthCookies();
    return null;
  }

  try {
    const newTokens = await refreshAuthToken(refreshToken);
    await setAuthCookies(newTokens);
    return await fetchUserData(newTokens.access);
  } catch (error) {
    await clearAuthCookies();
    return null;
  }
}

/**
 * Server action to register a new user
 */
export async function registerUser(
  formData: any
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Form Data", formData);

    const response = await apiClient("/api/auth/register/", {
      method: "POST",
      body: formData,
    });
    const data: AuthTokens = response;

    await setAuthCookies(data);
    revalidatePath("/users");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      const errorData = error.message;
      if (errorData.includes("email")) {
        return { success: false, error: errorData };
      } else if (errorData.includes("password")) {
        return { success: false, error: errorData };
      } else if (errorData.includes("non_field_errors")) {
        return { success: false, error: errorData };
      } else if (errorData.includes("detail")) {
        return { success: false, error: errorData };
      }
    }
    return { success: false, error: "Registration failed" };
  }
}

interface SignInResponse {
  success: boolean;
  error?: string;
  userData?: {
    id: number;
    role: string;
    email: string;
    full_name: string;
  };
}

/**
 * Server action to sign in a user
 */
export async function signIn(formData: any): Promise<SignInResponse> {
  try {
    const response = await apiClient("/api/auth/login/", {
      method: "POST",
      body: formData,
    });

    if (response.access) {
      // Set auth cookies
      await setAuthCookies({
        access: response.access,
        refresh: response.refresh,
      });

      // Get user data
      const userData = await apiClient("/api/users/me/", {
        headers: {
          Authorization: `Bearer ${response.access}`,
        },
      });

      return {
        success: true,
        userData: {
          id: userData.id,
          role: userData.role,
          email: userData.email,
          full_name: userData.full_name,
        },
      };
    }

    return { success: false, error: "Invalid response from server" };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: error.message || "Failed to sign in",
    };
  }
}

/**
 * Server action to sign out a user
 */
export async function signOut(): Promise<void> {
  await clearAuthCookies();
  redirect("/");
}

/**
 * Helper function to clear auth cookies
 */
async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

/**
 * Server action to check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Server action to get auth status and user data
 */
export async function getAuthStatus(): Promise<{
  authenticated: boolean;
  userData: UserData | null;
}> {
  const user = await getCurrentUser();
  return {
    authenticated: user !== null,
    userData: user,
  };
}
