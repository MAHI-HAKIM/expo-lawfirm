"use client";

import { useEffect, useState } from "react";
import { MessageList } from "@/components/main/client/message/message-list";
import { MessageInput } from "@/components/main/client/message/message-input";
import { ConversationList } from "@/components/main/client/message/conversation-list";
import { Lawyer } from "@/types/message";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { getLawyersWithAppointments } from "@/services/lawyers.service";

// Temporary mock data for development
const mockLawyers: Lawyer[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    specialization: "Family Law",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    specialization: "Criminal Law",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    specialization: "Corporate Law",
  },
];

export function MessageContainer() {
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [messages] = useState([]); // We'll implement this later
  const [isLoading, setIsLoading] = useState(false); // We'll implement this later
  const [showConversations, setShowConversations] = useState(true);

  const handleLawyerSelect = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer);
    setShowConversations(false);
  };

  useEffect(() => {
    async function loadLawyers() {
      try {
        setIsLoading(true);
        const result = await getLawyersWithAppointments();

        if (result.error) {
          toast.error(result.error);
          return;
        }

        if (result.success && result.data) {
          setLawyers(result.data);
        }
      } catch (error) {
        console.error("Failed to load lawyers:", error);
        toast.error("Failed to load lawyers");
      } finally {
        setIsLoading(false);
      }
    }

    loadLawyers();
  }, []);

  console.log("lawyers", lawyers);

  return (
    <div className="flex h-[calc(90vh-5rem)] max-h-[800px]">
      {/* Left sidebar - Conversation list */}
      <div
        className={`w-72 flex-shrink-0 transition-all duration-300 ${
          !showConversations && "hidden md:block"
        }`}
      >
        <ConversationList
          lawyers={lawyers}
          selectedLawyer={selectedLawyer}
          onSelect={handleLawyerSelect}
        />
      </div>

      {/* Right side - Chat area */}
      <div
        className={`flex-1 flex flex-col bg-[#1a1a1a] ${
          showConversations && "hidden md:flex"
        }`}
      >
        {selectedLawyer ? (
          <>
            {/* Chat header */}
            <div className="py-1.5 px-4 border-b border-[#333] flex items-center gap-3 bg-[#2a2a2a]">
              <button
                onClick={() => setShowConversations(true)}
                className="md:hidden text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <p className="font-medium text-white text-sm">
                  {selectedLawyer.name}
                </p>
                <p className="text-xs text-gray-400">
                  {selectedLawyer.specialization}
                </p>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <MessageList messages={messages} isLoading={isLoading} />
            </div>

            {/* Message input */}
            <div className="px-2 py-1.5 border-t border-[#333] bg-[#2a2a2a]">
              <MessageInput onSend={() => {}} />
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Select a lawyer to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
