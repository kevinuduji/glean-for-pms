"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Lock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/workspace-store";
import CreateTeamModal from "@/components/modals/CreateTeamModal";

const COLOR_BG: Record<string, string> = {
  emerald: "bg-emerald-500",
  violet:  "bg-violet-500",
  rose:    "bg-rose-500",
  amber:   "bg-amber-500",
  indigo:  "bg-indigo-500",
  sky:     "bg-sky-500",
  orange:  "bg-orange-500",
};

interface TeamSwitcherPanelProps {
  isCollapsed: boolean;
}

export default function TeamSwitcherPanel({ isCollapsed }: TeamSwitcherPanelProps) {
  const router = useRouter();
  const {
    getVisibleTeams,
    activeTeamId,
    setActiveTeam,
    getWorkspaceRole,
  } = useWorkspaceStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const teams = getVisibleTeams();
  const isAdmin = getWorkspaceRole() === "admin";

  if (isCollapsed) {
    return (
      <div className="px-2 pb-2 space-y-1">
        {/* All teams dot */}
        <button
          type="button"
          onClick={() => setActiveTeam(null)}
          className={cn(
            "w-12 h-8 mx-auto flex items-center justify-center rounded-lg transition-colors",
            activeTeamId === null
              ? "bg-slate-700"
              : "hover:bg-slate-800"
          )}
          title="All Teams"
        >
          <div className="w-2 h-2 rounded-full bg-slate-400" />
        </button>
        {teams.map((team) => (
          <button
            key={team.id}
            type="button"
            onClick={() => setActiveTeam(team.id)}
            className={cn(
              "w-12 h-8 mx-auto flex items-center justify-center rounded-lg transition-colors",
              activeTeamId === team.id
                ? "bg-slate-700"
                : "hover:bg-slate-800"
            )}
            title={team.name}
          >
            {team.visibility === "private" ? (
              <Lock className="w-3 h-3 text-slate-400" />
            ) : (
              <div className={cn("w-2 h-2 rounded-full", COLOR_BG[team.color] ?? "bg-slate-500")} />
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="px-3 pb-1">
        {/* Section header */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
            Teams
          </span>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="p-0.5 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
              title="Create team"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* All teams row */}
        <button
          type="button"
          onClick={() => setActiveTeam(null)}
          className={cn(
            "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] transition-colors",
            activeTeamId === null
              ? "bg-slate-800 text-slate-200"
              : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
          )}
        >
          <div className="w-2 h-2 rounded-full bg-slate-500 flex-shrink-0" />
          <span className="flex-1 text-left">All Teams</span>
        </button>

        {/* Team rows */}
        {teams.map((team) => (
          <div key={team.id} className="flex items-center group">
            <button
              type="button"
              onClick={() => setActiveTeam(team.id)}
              className={cn(
                "flex-1 flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] transition-colors",
                activeTeamId === team.id
                  ? "bg-slate-800 text-slate-200"
                  : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
              )}
            >
              {team.visibility === "private" ? (
                <Lock className="w-3 h-3 text-slate-500 flex-shrink-0" />
              ) : (
                <div
                  className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    COLOR_BG[team.color] ?? "bg-slate-500"
                  )}
                />
              )}
              <span className="flex-1 text-left text-nowrap truncate">{team.name}</span>
            </button>
            {/* Navigate to team profile on chevron click */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/teams/${team.slug}`);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-500 hover:text-slate-300 transition-all"
              title={`Open ${team.name} profile`}
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <CreateTeamModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
}
