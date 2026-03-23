"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";

interface MessageInputProps {
  onSend: (content: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    try {
      setIsSending(true);
      await onSend(message.trim());
      setMessage("");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 text-gray-400 hover:text-amber-200 hover:bg-[#333]"
        onClick={() => {}}
      >
        <Paperclip className="h-4 w-4" />
      </Button>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="min-h-[32px] max-h-[100px] bg-[#333] border-none text-white text-sm resize-none rounded-xl px-2.5 py-1 focus:ring-1 focus:ring-amber-600"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() || isSending}
        className="h-7 w-7 shrink-0 rounded-full bg-amber-600 hover:bg-amber-700 text-black"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
