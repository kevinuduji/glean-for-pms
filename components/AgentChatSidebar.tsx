"use client";

import { useEffect, useState, useRef } from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Edit2,
  FolderOpen,
  X,
} from "lucide-react";
import { useAgentStore, Chat } from "@/lib/store";
import type { Project } from "@/lib/types/project";
import { useProjectStore } from "@/lib/project-store";
import { cn } from "@/lib/utils";

const COLOR_DOT: Record<string, string> = {
  indigo: "bg-indigo-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  violet: "bg-violet-500",
  sky: "bg-sky-500",
};

// ─── Chat row ─────────────────────────────────────────────────────────────

function ChatRow({
  chat,
  projects,
  isActive,
  onLoad,
  onDelete,
  onRename,
  onMove,
}: {
  chat: Chat;
  projects: Project[];
  isActive: boolean;
  onLoad: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
  onMove: (projectId: string | null) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(chat.title);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!menuOpen && !moveOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setMoveOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen, moveOpen]);

  const commitRename = () => {
    const t = draft.trim();
    if (t) onRename(t);
    setEditing(false);
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-xs",
        isActive
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-800",
      )}
      onClick={() => !editing && !menuOpen && !moveOpen && onLoad()}
    >
      <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 opacity-50" />

      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitRename();
            if (e.key === "Escape") {
              setDraft(chat.title);
              setEditing(false);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 min-w-0 bg-white border border-indigo-300 rounded px-1.5 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
      ) : (
        <span className="flex-1 min-w-0 truncate">{chat.title}</span>
      )}

      {!editing && (
        <button
          className={cn(
            "ml-auto p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-200 transition-opacity flex-shrink-0",
            (menuOpen || moveOpen) && "opacity-100",
          )}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
            setMoveOpen(false);
          }}
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Dropdown */}
      {(menuOpen || moveOpen) && (
        <div
          ref={menuRef}
          className="absolute right-0 top-7 z-50 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          {moveOpen ? (
            <>
              <p className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Move to project
              </p>
              <button
                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                onClick={() => {
                  onMove(null);
                  setMoveOpen(false);
                  setMenuOpen(false);
                }}
              >
                Uncategorized
              </button>
              {projects.map((p) => (
                <button
                  key={p.id}
                  className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                  onClick={() => {
                    onMove(p.id);
                    setMoveOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0",
                      COLOR_DOT[p.color],
                    )}
                  />
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
            </>
          ) : (
            <>
              <button
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                onClick={() => {
                  setEditing(true);
                  setDraft(chat.title);
                  setMenuOpen(false);
                }}
              >
                <Edit2 className="w-3 h-3" /> Rename
              </button>
              <button
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                onClick={() => {
                  setMoveOpen(true);
                }}
              >
                <FolderOpen className="w-3 h-3" /> Move to project
              </button>
              <div className="h-px bg-slate-100 my-1" />
              <button
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-red-50 text-red-600"
                onClick={() => {
                  onDelete();
                  setMenuOpen(false);
                }}
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────

export default function AgentChatSidebar() {
  const {
    hydrate,
    savedChats,
    activeChatId,
    conversation,
    isRunning,
    resetAgent,
    loadChat,
    deleteChat,
    renameChat,
    moveChatToProject,
  } = useAgentStore();

  const { getJoinedProjects } = useProjectStore();
  const projects = getJoinedProjects();

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingProjectName, setEditingProjectName] = useState("");

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => {
      const s = new Set(prev);
      if (s.has(id)) {
        s.delete(id);
      } else {
        s.add(id);
      }
      return s;
    });
  };

  const handleNewChat = () => resetAgent(true);

  const commitProjectRename = (id: string) => {
    setEditingProjectId(null);
  };

  const hasUnsavedConversation = conversation.length > 0 && !activeChatId;
  const uncategorized = savedChats.filter((c) => !c.projectId);

  return (
    <div className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-3 pt-4 pb-3 border-b border-slate-100">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
          Chats
        </h2>
        <button
          onClick={handleNewChat}
          disabled={isRunning}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Chat
        </button>

        {/* In-progress indicator */}
        {hasUnsavedConversation && (
          <div className="mt-2 px-2 py-1.5 bg-indigo-50 rounded-md flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
            <span className="text-[10px] text-indigo-600 font-medium truncate">
              Current conversation
            </span>
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {savedChats.length === 0 && projects.length === 0 && (
          <div className="px-3 py-6 text-center space-y-1">
            <p className="text-xs text-slate-400">No saved chats yet.</p>
            <p className="text-[10px] text-slate-300">
              Click <strong className="text-slate-400">New Chat</strong> after a
              conversation to save it.
            </p>
          </div>
        )}

        {/* Projects */}
        {projects.map((project) => {
          const chats = savedChats.filter((c) => c.projectId === project.id);
          const isCollapsed = collapsed.has(project.id);
          const isEditing = editingProjectId === project.id;

          return (
            <div key={project.id}>
              {/* Project header row */}
              <div
                className="flex items-center gap-1.5 px-1.5 py-1.5 rounded-md hover:bg-slate-100 group cursor-pointer"
                onClick={() => toggleCollapse(project.id)}
              >
                <span
                  className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    COLOR_DOT[project.color],
                  )}
                />

                {isEditing ? (
                  <input
                    autoFocus
                    value={editingProjectName}
                    onChange={(e) => setEditingProjectName(e.target.value)}
                    onBlur={() => commitProjectRename(project.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitProjectRename(project.id);
                      if (e.key === "Escape") setEditingProjectId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 min-w-0 text-xs font-medium bg-white border border-indigo-300 rounded px-1.5 py-0.5 focus:outline-none"
                  />
                ) : (
                  <span className="flex-1 min-w-0 text-xs font-medium text-slate-700 truncate">
                    {project.name}
                  </span>
                )}

                <span className="text-[10px] text-slate-400 tabular-nums">
                  {chats.length}
                </span>
                {isCollapsed ? (
                  <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
                )}

                {/* Project actions */}
                <div
                  className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Chats in project */}
              {!isCollapsed && (
                <div className="ml-4 space-y-0.5 mt-0.5">
                  {chats.length === 0 ? (
                    <p className="px-2 py-1 text-[10px] text-slate-300 italic">
                      Empty project
                    </p>
                  ) : (
                    chats.map((chat) => (
                      <ChatRow
                        key={chat.id}
                        chat={chat}
                        projects={projects}
                        isActive={activeChatId === chat.id}
                        onLoad={() => loadChat(chat.id)}
                        onDelete={() => deleteChat(chat.id)}
                        onRename={(title) => renameChat(chat.id, title)}
                        onMove={(pid) => moveChatToProject(chat.id, pid)}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Uncategorized chats */}
        {uncategorized.length > 0 && (
          <div>
            {projects.length > 0 && (
              <p className="px-2 pt-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Uncategorized
              </p>
            )}
            <div className="space-y-0.5">
              {uncategorized.map((chat) => (
                <ChatRow
                  key={chat.id}
                  chat={chat}
                  projects={projects}
                  isActive={activeChatId === chat.id}
                  onLoad={() => loadChat(chat.id)}
                  onDelete={() => deleteChat(chat.id)}
                  onRename={(title) => renameChat(chat.id, title)}
                  onMove={(pid) => moveChatToProject(chat.id, pid)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2.5 border-t border-slate-100" />
    </div>
  );
}
