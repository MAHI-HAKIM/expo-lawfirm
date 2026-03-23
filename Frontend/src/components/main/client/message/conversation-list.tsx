"use client";

import { Lawyer } from "@/types/message";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface ConversationListProps {
  lawyers: Lawyer[];
  selectedLawyer: Lawyer | null;
  onSelect: (lawyer: Lawyer) => void;
}

export function ConversationList({
  lawyers,
  selectedLawyer,
  onSelect,
}: ConversationListProps) {
  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] border-r border-[#333]">
      {/* Header */}
      <div className="p-2 border-b border-[#333]">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search lawyers..."
            className="w-full bg-[#2a2a2a] border-none rounded-md pl-8 pr-2 py-1.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {lawyers.length === 0 ? (
          <div className="p-2 text-center text-gray-400 text-sm">
            No lawyers available.
          </div>
        ) : (
          <div className="divide-y divide-[#333]">
            {lawyers.map((lawyer) => (
              <button
                key={lawyer.id}
                onClick={() => onSelect(lawyer)}
                className={cn(
                  "w-full py-2 px-3 flex items-center gap-2 hover:bg-[#2a2a2a] transition-colors",
                  selectedLawyer?.id === lawyer.id && "bg-[#2a2a2a]"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-amber-700 text-black text-sm">
                    {lawyer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white text-sm truncate">
                      {lawyer.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {lawyer.specialization}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
