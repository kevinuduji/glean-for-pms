"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import {
  FolderOpen,
  Plus,
  Lock,
  Globe,
  Users,
  Settings,
  ChevronRight,
  ArrowLeft,
  FlaskConical,
  Lightbulb,
  GitMerge,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { USERS } from "@/lib/mock-data/workspace";
import VisibilityToggle from "@/components/VisibilityToggle";
import CreateFolderModal from "@/components/modals/CreateFolderModal";
import TeamMemberModal from "@/components/modals/TeamMemberModal";
import type { Visibility } from "@/lib/types/workspace";
import * as LucideIcons from "lucide-react";
import Link from "next/link";

const COLOR_BG: Record<string, string> = {
  emerald: "bg-emerald-500",
  violet:  "bg-violet-500",
  rose:    "bg-rose-500",
  amber:   "bg-amber-500",
  indigo:  "bg-indigo-500",
  sky:     "bg-sky-500",
  orange:  "bg-orange-500",
};

const COLOR_BORDER: Record<string, string> = {
  emerald: "border-emerald-500/30",
  violet:  "border-violet-500/30",
  rose:    "border-rose-500/30",
  amber:   "border-amber-500/30",
  indigo:  "border-indigo-500/30",
  sky:     "border-sky-500/30",
  orange:  "border-orange-500/30",
};

const CONTENT_TYPE_ICON: Record<string, React.ElementType> = {
  experiment: FlaskConical,
  recommendation: Lightbulb,
  retro: GitMerge,
  chat: MessageSquare,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TeamIcon({ name, className }: { name: string; className?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[name];
  if (!Icon) return <Users className={className} />;
  return <Icon className={className} />;
}

function TeamProfileInner() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const {
    teams,
    canSeeTeam,
    canSeeFolder,
    getVisibleFolders,
    getFolderItems,
    getTeamFolders,
    getAllTeamMembers,
    isTeamMember,
    getWorkspaceRole,
    updateTeamVisibility,
    removeTeamMember,
  } = useWorkspaceStore();

  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const team = teams.find((t) => t.slug === slug);

  if (!team) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Team not found.</p>
      </div>
    );
  }

  if (!canSeeTeam(team.id)) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 text-sm font-medium">Access Restricted</p>
          <p className="text-slate-500 text-xs mt-1">You don&apos;t have access to this team.</p>
        </div>
      </div>
    );
  }

  const workspaceRole = getWorkspaceRole();
  const isAdmin = workspaceRole === "admin";
  const isMember = isTeamMember(team.id);
  const canManage = isAdmin || (isMember && getAllTeamMembers(team.id).find((m) => m.userId === "user-kevin")?.role === "lead");

  const visibleFolders = getVisibleFolders(team.id);
  const allTeamFolders = getTeamFolders(team.id);
  const teamMembers = getAllTeamMembers(team.id);

  const totalItems = allTeamFolders.reduce(
    (sum, folder) => sum + getFolderItems(folder.id).length,
    0
  );

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Banner */}
      <div
        className={cn(
          "border-b border-slate-800 px-8 pt-6 pb-5",
          "bg-gradient-to-r from-slate-900 to-slate-900/80"
        )}
      >
        {/* Back */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-slate-500 text-[12px] hover:text-slate-300 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                COLOR_BG[team.color] ?? "bg-slate-600"
              )}
            >
              <TeamIcon name={team.icon} className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-slate-100 text-xl font-semibold">{team.name}</h1>
                {team.visibility === "private" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-[10px] text-slate-400">
                    <Lock className="w-2.5 h-2.5" /> Private
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-[10px] text-slate-400">
                    <Globe className="w-2.5 h-2.5" /> Public
                  </span>
                )}
              </div>
              {team.description && (
                <p className="text-slate-400 text-[13px] mt-0.5">{team.description}</p>
              )}
            </div>
          </div>

          {canManage && (
            <Link
              href={`/settings?tab=teams`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-[12px] hover:bg-slate-700 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Manage
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-4">
          <span className="text-slate-500 text-[12px]">
            <span className="text-slate-300 font-medium">{teamMembers.length}</span> member{teamMembers.length !== 1 ? "s" : ""}
          </span>
          <span className="text-slate-500 text-[12px]">
            <span className="text-slate-300 font-medium">{allTeamFolders.length}</span> folder{allTeamFolders.length !== 1 ? "s" : ""}
          </span>
          <span className="text-slate-500 text-[12px]">
            <span className="text-slate-300 font-medium">{totalItems}</span> item{totalItems !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Visibility toggle — admin/lead only */}
        {canManage && (
          <div className="flex items-center gap-3 mt-4">
            <span className="text-slate-500 text-[11px]">Access:</span>
            <VisibilityToggle
              value={team.visibility}
              onChange={(v: Visibility) => updateTeamVisibility(team.id, v)}
              size="sm"
            />
          </div>
        )}
      </div>

      <div className="px-8 py-6 max-w-4xl space-y-8">
        {/* Members */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-slate-300 text-[13px] font-semibold">Members</h2>
            {canManage && (
              <button
                type="button"
                onClick={() => setShowAddMember(true)}
                className="flex items-center gap-1.5 text-indigo-400 text-[12px] hover:text-indigo-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add member
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {teamMembers.map((m) => {
              const user = USERS.find((u) => u.id === m.userId);
              if (!user) return null;
              return (
                <div
                  key={m.userId}
                  className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-800/60 border border-slate-700/60 rounded-lg"
                >
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold text-[10px] flex-shrink-0", user.avatarColor)}>
                    {user.avatarInitial}
                  </div>
                  <div>
                    <p className="text-slate-200 text-[11px] font-medium">{user.displayName}</p>
                    <p className="text-slate-500 text-[10px] capitalize">{m.role}</p>
                  </div>
                  {canManage && m.userId !== "user-kevin" && (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(team.id, m.userId)}
                      className="ml-1 text-slate-600 hover:text-slate-400 transition-colors text-[10px]"
                      title="Remove"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Folders */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-slate-300 text-[13px] font-semibold">Folders</h2>
            {(canManage || isMember) && (
              <button
                type="button"
                onClick={() => setShowCreateFolder(true)}
                className="flex items-center gap-1.5 text-indigo-400 text-[12px] hover:text-indigo-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                New folder
              </button>
            )}
          </div>

          {visibleFolders.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-700 rounded-xl">
              <FolderOpen className="w-6 h-6 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-[12px]">No folders yet.</p>
              {(canManage || isMember) && (
                <button
                  type="button"
                  onClick={() => setShowCreateFolder(true)}
                  className="mt-2 text-indigo-400 text-[12px] hover:text-indigo-300 transition-colors"
                >
                  Create the first folder
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {visibleFolders.map((folder) => {
                const items = getFolderItems(folder.id);
                const isVisible = canSeeFolder(folder.id);
                if (!isVisible) return null;

                const contentCounts = items.reduce(
                  (acc, item) => {
                    acc[item.contentType] = (acc[item.contentType] ?? 0) + 1;
                    return acc;
                  },
                  {} as Record<string, number>
                );

                return (
                  <Link
                    key={folder.id}
                    href={`/folders/${folder.id}`}
                    className={cn(
                      "group flex flex-col gap-2 p-4 bg-slate-900 border rounded-xl hover:bg-slate-800/60 transition-colors",
                      COLOR_BORDER[folder.color] ?? "border-slate-700"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {folder.visibility === "private" ? (
                          <Lock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        ) : (
                          <FolderOpen className={cn("w-4 h-4 flex-shrink-0", `text-${folder.color}-400`)} />
                        )}
                        <span className="text-slate-200 text-[13px] font-medium">{folder.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0 mt-0.5" />
                    </div>

                    {folder.description && (
                      <p className="text-slate-500 text-[11px] line-clamp-2">{folder.description}</p>
                    )}

                    {/* Content type badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {Object.entries(contentCounts).map(([type, count]) => {
                        const Icon = CONTENT_TYPE_ICON[type];
                        return (
                          <span
                            key={type}
                            className="inline-flex items-center gap-1 text-slate-500 text-[10px]"
                          >
                            {Icon && <Icon className="w-3 h-3" />}
                            {count} {type}{count !== 1 ? "s" : ""}
                          </span>
                        );
                      })}
                      {items.length === 0 && (
                        <span className="text-slate-600 text-[10px]">Empty</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {showCreateFolder && (
        <CreateFolderModal
          teamId={team.id}
          teamColor={team.color}
          onClose={() => setShowCreateFolder(false)}
        />
      )}
      {showAddMember && (
        <TeamMemberModal teamId={team.id} onClose={() => setShowAddMember(false)} />
      )}
    </div>
  );
}

export default function TeamProfilePage() {
  return (
    <Suspense>
      <TeamProfileInner />
    </Suspense>
  );
}
