"use server";

import { getAuthToken } from "./users.service";
import { apiClient } from "@/utils/api-client";
import { Message } from "@/types/message";

export async function getMessagesWithLawyer(
  lawyerId: number
): Promise<{ success: boolean; data?: Message[]; error?: string }> {
  try {
    const token = await getAuthToken();

    if (!token) {
      return { success: false, error: "Authentication token not found" };
    }

    const response = await apiClient(`/api/messages/${lawyerId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response };
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch messages",
    };
  }
}

export async function sendMessage(
  lawyerId: number,
  content: string
): Promise<{ success: boolean; data?: Message; error?: string }> {
  try {
    const token = await getAuthToken();

    if (!token) {
      return { success: false, error: "Authentication token not found" };
    }

    const response = await apiClient("/api/messages/send/", {
      method: "POST",
      body: {
        lawyer_id: lawyerId,
        content,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response };
  } catch (error: any) {
    console.error("Error sending message:", error);
    return {
      success: false,
      error: error.message || "Failed to send message",
    };
  }
}
