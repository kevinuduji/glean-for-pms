"use client";

import { useState } from "react";
import { X, UserPlus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { USERS, SEED_WORKSPACE_MEMBERS } from "@/lib/mock-data/workspace";
import type { TeamRole } from "@/lib/types/workspace";

interface TeamMemberModalProps {
  teamId: string;
  onClose: () => void;
}

export default function TeamMemberModal({ teamId, onClose }: TeamMemberModalProps) {
  const { teamMembers, addTeamMember, activeWorkspaceId } = useWorkspaceStore();
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [role, setRole] = useState<TeamRole>("member");

  const currentTeamUserIds = new Set(
    teamMembers.filter((m) => m.teamId === teamId).map((m) => m.userId)
  );

  const workspaceUserIds = new Set(
    SEED_WORKSPACE_MEMBERS
      .filter((m) => m.workspaceId === activeWorkspaceId)
      .map((m) => m.userId)
  );

  const eligibleUsers = USERS.filter(
    (u) =>
      workspaceUserIds.has(u.id) &&
      !currentTeamUserIds.has(u.id) &&
      (u.displayName.toLowerCase().includes(search.toLowerCase()) ||
        u.handle.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAdd = () => {
    if (!selectedUserId) return;
    addTeamMember(teamId, selectedUserId, role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-4 h-4 text-slate-400" />
            <h2 className="text-slate-100 text-[13px] font-semibold">Add Team Member</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg">
            <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workspace members..."
              className="flex-1 bg-transparent text-slate-100 text-[13px] placeholder:text-slate-500 focus:outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* User list */}
        <div className="px-5 pb-2 max-h-48 overflow-y-auto">
          {eligibleUsers.length === 0 ? (
            <p className="text-slate-500 text-[12px] py-4 text-center">
              {search ? "No matching members found." : "All workspace members are already in this team."}
            </p>
          ) : (
            <div className="space-y-0.5">
              {eligibleUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelectedUserId(user.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left",
                    selectedUserId === user.id
                      ? "bg-indigo-600/20 border border-indigo-600/30"
                      : "hover:bg-slate-800"
                  )}
                >
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-xs", user.avatarColor)}>
                    {user.avatarInitial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-200 text-[12px] font-medium truncate">{user.displayName}</p>
                    <p className="text-slate-500 text-[11px] truncate">@{user.handle}</p>
                  </div>
                  {selectedUserId === user.id && (
                    <div className="ml-auto w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Role */}
        <div className="px-5 pb-4">
          <label className="block text-slate-400 text-[11px] font-medium mb-1.5">Role</label>
          <div className="flex gap-2">
            {(["member", "lead"] as TeamRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "flex-1 py-1.5 rounded-lg text-[12px] font-medium capitalize transition-colors",
                  role === r
                    ? "bg-slate-700 text-slate-100"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
                )}
              >
                {r}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-slate-600 text-[11px]">
            {role === "lead" ? "Team leads can manage settings and members." : "Members can view and contribute to team content."}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-slate-400 text-[13px] hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedUserId}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-[13px] font-medium hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Add Member
          </button>
        </div>
      </div>
    </div>
  );
}
