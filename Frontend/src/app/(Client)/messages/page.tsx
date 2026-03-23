import { MessageContainer } from "@/components/main/client/message/message-container";

export const metadata = {
  title: "Messages | ExpoLaw",
  description: "Message your lawyers and manage your legal communications",
};

export default function MessagePage() {
  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <div className="container mx-auto py-6">
        <p className="text-2xl ml-2 font-bold text-amber-200 mb-6">Messages</p>
        <MessageContainer />
      </div>
    </main>
  );
}
