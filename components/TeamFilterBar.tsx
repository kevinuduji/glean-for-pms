"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/workspace-store";
import type { FolderItem } from "@/lib/types/workspace";

const COLOR_DOT: Record<string, string> = {
  emerald: "bg-emerald-500",
  violet:  "bg-violet-500",
  rose:    "bg-rose-500",
  amber:   "bg-amber-500",
  indigo:  "bg-indigo-500",
  sky:     "bg-sky-500",
  orange:  "bg-orange-500",
};

interface TeamFilterBarProps {
  contentType: FolderItem["contentType"];
  selectedTeamId: string | null;
  selectedFolderId?: string | null;
  onTeamChange: (teamId: string | null) => void;
  onFolderChange?: (folderId: string | null) => void;
}

export default function TeamFilterBar({
  contentType,
  selectedTeamId,
  selectedFolderId = null,
  onTeamChange,
  onFolderChange,
}: TeamFilterBarProps) {
  const { getVisibleTeams, getVisibleFolders, folderItems } = useWorkspaceStore();

  const teams = getVisibleTeams();

  // Only show teams that have content of this type
  const teamsWithContent = teams.filter((team) => {
    const teamFolderIds = new Set(
      getVisibleFolders(team.id).map((f) => f.id)
    );
    return folderItems.some(
      (i) => i.contentType === contentType && teamFolderIds.has(i.folderId)
    );
  });

  const foldersForSelectedTeam = selectedTeamId
    ? getVisibleFolders(selectedTeamId).filter((f) =>
        folderItems.some((i) => i.folderId === f.id && i.contentType === contentType)
      )
    : [];

  if (teamsWithContent.length === 0) return null;

  return (
    <div className="space-y-2">
      {/* Team pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => { onTeamChange(null); onFolderChange?.(null); }}
          className={cn(
            "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border",
            selectedTeamId === null
              ? "bg-slate-800 border-slate-600 text-slate-200"
              : "bg-transparent border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600"
          )}
        >
          All Teams
        </button>
        {teamsWithContent.map((team) => (
          <button
            key={team.id}
            type="button"
            onClick={() => {
              onTeamChange(team.id);
              onFolderChange?.(null);
            }}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border",
              selectedTeamId === team.id
                ? "bg-slate-800 border-slate-600 text-slate-200"
                : "bg-transparent border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600"
            )}
          >
            {team.visibility === "private" ? (
              <Lock className="w-2.5 h-2.5" />
            ) : (
              <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", COLOR_DOT[team.color] ?? "bg-slate-500")} />
            )}
            {team.name}
          </button>
        ))}
      </div>

      {/* Folder sub-pills — only when a team is selected and it has multiple folders */}
      {selectedTeamId && foldersForSelectedTeam.length > 1 && onFolderChange && (
        <div className="flex items-center gap-1 flex-wrap pl-1">
          <span className="text-slate-600 text-[10px] mr-1">└</span>
          <button
            type="button"
            onClick={() => onFolderChange(null)}
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] transition-colors border",
              selectedFolderId === null
                ? "bg-slate-800 border-slate-600 text-slate-300"
                : "bg-transparent border-slate-700 text-slate-600 hover:text-slate-400"
            )}
          >
            All folders
          </button>
          {foldersForSelectedTeam.map((folder) => (
            <button
              key={folder.id}
              type="button"
              onClick={() => onFolderChange(folder.id)}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] transition-colors border",
                selectedFolderId === folder.id
                  ? "bg-slate-800 border-slate-600 text-slate-300"
                  : "bg-transparent border-slate-700 text-slate-600 hover:text-slate-400"
              )}
            >
              {folder.visibility === "private" && <Lock className="w-2 h-2" />}
              {folder.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
