// utils/api.ts

import { getCurrentApiUrl } from "@/lib/axios";

/**
 * Constructs a full API URL from a path
 * Handles both relative and absolute paths
 */
export function getApiUrl(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${getCurrentApiUrl()}/${cleanPath}`;
}

/**
 * Checks if a URL is absolute (starts with http:// or https://)
 */
export function isAbsoluteUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Example usage for getServerSideProps or other server-side data fetching
 */
export async function fetchServerSideData(path: string, token?: string) {
  const url = getApiUrl(path);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Use node-fetch or similar for SSR
  const res = await fetch(url, { headers });
  return res.json();
}
