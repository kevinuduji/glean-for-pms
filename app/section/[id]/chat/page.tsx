"use client";

import { MessageSquare, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAgentStore } from "@/lib/store";
import { useSectionStore } from "@/lib/section-store";
import { cn } from "@/lib/utils";

export default function SectionChatPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { savedChats, loadChat } = useAgentStore();
  const { getActiveSection } = useSectionStore();
  const section = getActiveSection();

  // Filter chats for this section (sectionId field may not exist on older chats)
  const sectionChats = savedChats.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c) => (c as any).sectionId === params.id
  );

  const handleNewChat = () => {
    router.push("/agent");
  };

  const handleLoadChat = (chatId: string) => {
    loadChat(chatId);
    router.push("/agent");
  };

  return (
    <div className="bg-slate-950 h-full overflow-y-auto">
      <div className="px-8 py-8 max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[18px] font-bold text-slate-100">Chats</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              Conversations scoped to {section?.name ?? "this section"}
            </p>
          </div>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Chat
          </button>
        </div>

        {sectionChats.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-slate-600" />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-semibold text-slate-300 mb-1">No chats yet</p>
              <p className="text-[13px] text-slate-500">
                Start an AI chat scoped to this section&apos;s data and context.
              </p>
            </div>
            <button
              onClick={handleNewChat}
              className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold rounded-lg transition-colors"
            >
              Start a new chat
            </button>
          </div>
        ) : (
          /* Chat list */
          <div className="space-y-2">
            {sectionChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleLoadChat(chat.id)}
                className={cn(
                  "w-full text-left px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800",
                  "hover:bg-slate-800 hover:border-slate-700 transition-all group"
                )}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                  <span className="text-[14px] text-slate-300 group-hover:text-slate-100 font-medium truncate">
                    {chat.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
