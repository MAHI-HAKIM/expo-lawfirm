"use client";

import { Message } from "@/types/message";
import { format } from "date-fns";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-amber-200 text-sm">Loading...</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <p className="text-sm">No messages yet</p>
        <p className="text-xs text-gray-500">
          Send a message to start the conversation
        </p>
      </div>
    );
  }

  return (
    <div className="px-3 py-2 space-y-1.5">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.isFromLawyer ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`max-w-[85%] rounded-xl px-2.5 py-1 ${
              message.isFromLawyer
                ? "bg-[#2a2a2a] text-white rounded-tl-sm"
                : "bg-amber-600 text-black rounded-tr-sm"
            }`}
          >
            <div className="break-words text-sm leading-snug">
              {message.content}
            </div>
            <div
              className={`text-[10px] mt-0.5 flex justify-end ${
                message.isFromLawyer ? "text-gray-400" : "text-amber-900"
              }`}
            >
              {format(new Date(message.timestamp), "h:mm a")}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
