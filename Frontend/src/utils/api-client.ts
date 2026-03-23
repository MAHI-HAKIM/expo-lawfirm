import axiosInstance from "@/lib/axios";
import { cookies } from "next/headers";

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Universal API client that works in both server and client environments
 * Automatically handles authentication and proper request formatting
 */
export async function apiClient(path: string, options: FetchOptions = {}) {
  const isServer = typeof window === "undefined";

  if (isServer) {
    // Server-side request handling
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("access_token")?.value;

      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(
        path.startsWith("http")
          ? path
          : `${process.env.NEXT_PUBLIC_API_URL}${path}`,
        {
          method: options.method || "GET",
          headers,
          ...(options.body && { body: JSON.stringify(options.body) }),
          cache: "no-store", // Disable caching for server-side requests
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const errorMessage =
          error.detail ||
          error.email ||
          error.password ||
          error.non_field_errors ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error(`Server-side API error for ${path}:`, error);
      throw error;
    }
  } else {
    // Client-side request handling
    try {
      const method = options.method?.toLowerCase() || "get";
      const config = {
        headers: options.headers,
      };

      let response;
      switch (method) {
        case "get":
          response = await axiosInstance.get(path, config);
          break;
        case "post":
          response = await axiosInstance.post(path, options.body, config);
          break;
        case "put":
          response = await axiosInstance.put(path, options.body, config);
          break;
        case "patch":
          response = await axiosInstance.patch(path, options.body, config);
          break;
        case "delete":
          response = await axiosInstance.delete(path, config);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      return response.data;
    } catch (error: any) {
      console.error(`Client-side API error for ${path}:`, error);
      throw new Error(
        error.response?.data?.detail || error.message || "API request failed"
      );
    }
  }
}
