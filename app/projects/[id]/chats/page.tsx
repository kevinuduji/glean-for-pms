"use client";

import { useRouter } from "next/navigation";
import { MessageSquare, Plus, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAgentStore } from "@/lib/store";
import { useWorkspaceProjectStore } from "@/lib/workspace-project-store";
import { SEED_WORKSPACE_PROJECTS } from "@/lib/mock-data/workspace-projects";

interface ProjectChatsPageProps {
  params: { id: string };
}

export default function ProjectChatsPage({ params }: ProjectChatsPageProps) {
  const router = useRouter();
  const { savedChats, loadChat } = useAgentStore();
  const { userProjects } = useWorkspaceProjectStore();

  const project =
    SEED_WORKSPACE_PROJECTS.find((p) => p.id === params.id) ??
    userProjects.find((p) => p.id === params.id);

  // Filter chats that belong to this project
  const projectChats = savedChats.filter((c) => c.projectId === params.id);

  function handleOpenChat(chatId: string) {
    loadChat(chatId);
    router.push("/agent");
  }

  function handleNewChat() {
    router.push("/agent");
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    }
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-950">
      <div className="max-w-3xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Chats</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Conversations in{" "}
              <span className="text-slate-400">{project?.name ?? params.id}</span>
            </p>
          </div>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            New chat
          </button>
        </div>

        {/* Chat list */}
        {projectChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="text-base font-semibold text-slate-300 mb-1">
              No chats yet
            </h3>
            <p className="text-sm text-slate-500 max-w-xs">
              Start a new chat to begin collaborating on this project with the
              AI assistant.
            </p>
            <button
              onClick={handleNewChat}
              className="mt-5 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Start a new chat
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {projectChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleOpenChat(chat.id)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 hover:bg-slate-800/50 transition-all text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-indigo-600/20 transition-colors">
                    <MessageSquare className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate">
                      {chat.title}
                    </p>
                    {chat.messages.length > 0 && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {chat.messages[chat.messages.length - 1]?.content?.slice(0, 80)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-600" />
                    <span className="text-[11px] text-slate-600">
                      {formatDate(chat.updatedAt)}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
