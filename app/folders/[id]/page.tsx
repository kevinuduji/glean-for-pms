"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import {
  FolderOpen,
  Lock,
  Globe,
  Plus,
  ArrowLeft,
  FlaskConical,
  Lightbulb,
  GitMerge,
  MessageSquare,
  Settings,
  UserPlus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { USERS } from "@/lib/mock-data/workspace";
import VisibilityToggle from "@/components/VisibilityToggle";
import type { Visibility } from "@/lib/types/workspace";

const COLOR_BORDER: Record<string, string> = {
  emerald: "border-emerald-500/30",
  violet:  "border-violet-500/30",
  rose:    "border-rose-500/30",
  amber:   "border-amber-500/30",
  indigo:  "border-indigo-500/30",
  sky:     "border-sky-500/30",
  orange:  "border-orange-500/30",
};

const CONTENT_TYPE_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string; href: (id: string) => string }> = {
  experiment:     { icon: FlaskConical, label: "Experiment",     color: "text-violet-400",  href: () => "/experiments" },
  recommendation: { icon: Lightbulb,   label: "Recommendation", color: "text-amber-400",   href: () => "/recommendations" },
  retro:          { icon: GitMerge,    label: "Retrospective",  color: "text-emerald-400", href: () => "/retrospective" },
  chat:           { icon: MessageSquare, label: "Chat",         color: "text-sky-400",     href: () => "/agent" },
};

function FolderViewInner() {
  const params = useParams();
  const router = useRouter();
  const folderId = params.id as string;

  const {
    folders,
    teams,
    canSeeFolder,
    canEditFolder,
    isTeamMember,
    getWorkspaceRole,
    getFolderItems,
    getFolderMembers,
    addFolderMember,
    removeFolderMember,
    removeItemFromFolder,
    updateFolderVisibility,
    deleteFolder,
  } = useWorkspaceStore();

  const [showSettings, setShowSettings] = useState(false);

  const folder = folders.find((f) => f.id === folderId);

  if (!folder) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Folder not found.</p>
      </div>
    );
  }

  if (!canSeeFolder(folder.id)) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 text-sm font-medium">Access Restricted</p>
          <p className="text-slate-500 text-xs mt-1">You don&apos;t have permission to view this folder.</p>
        </div>
      </div>
    );
  }

  const canEdit = canEditFolder(folder.id);
  const workspaceRole = getWorkspaceRole();
  const isAdmin = workspaceRole === "admin";
  const parentTeam = teams.find((t) => t.id === folder.teamId);
  const isOnParentTeam = parentTeam ? isTeamMember(parentTeam.id) : false;

  const items = getFolderItems(folder.id);
  const folderMembersRaw = getFolderMembers(folder.id);

  const handleDeleteFolder = () => {
    if (confirm(`Delete folder "${folder.name}"? This cannot be undone.`)) {
      deleteFolder(folder.id);
      router.push(parentTeam ? `/teams/${parentTeam.slug}` : "/");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="border-b border-slate-800 px-8 pt-6 pb-5">
        {/* Breadcrumb — only shown if user is a team member */}
        {isOnParentTeam && parentTeam && (
          <button
            type="button"
            onClick={() => router.push(`/teams/${parentTeam.slug}`)}
            className="flex items-center gap-1.5 text-slate-500 text-[12px] hover:text-slate-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {parentTeam.name} team
          </button>
        )}
        {!isOnParentTeam && (
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-slate-500 text-[12px] hover:text-slate-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        )}

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {folder.visibility === "private" ? (
              <Lock className="w-6 h-6 text-slate-400" />
            ) : (
              <FolderOpen className={cn("w-6 h-6", `text-${folder.color}-400`)} />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-slate-100 text-xl font-semibold">{folder.name}</h1>
                {folder.visibility === "private" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-[10px] text-slate-400">
                    <Lock className="w-2.5 h-2.5" /> Private
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-[10px] text-slate-400">
                    <Globe className="w-2.5 h-2.5" /> Public
                  </span>
                )}
              </div>
              {folder.description && (
                <p className="text-slate-400 text-[13px] mt-0.5">{folder.description}</p>
              )}
            </div>
          </div>

          {canEdit && (
            <button
              type="button"
              onClick={() => setShowSettings((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-[12px] hover:bg-slate-700 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </button>
          )}
        </div>

        {/* Visibility toggle */}
        {canEdit && (
          <div className="flex items-center gap-3 mt-4">
            <span className="text-slate-500 text-[11px]">Access:</span>
            <VisibilityToggle
              value={folder.visibility}
              onChange={(v: Visibility) => updateFolderVisibility(folder.id, v)}
              size="sm"
            />
          </div>
        )}
      </div>

      <div className="px-8 py-6 max-w-4xl space-y-8">
        {/* Inline settings panel */}
        {showSettings && canEdit && (
          <section className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl space-y-4">
            <h3 className="text-slate-200 text-[13px] font-semibold">Folder Settings</h3>

            {/* Members */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-[11px] font-medium">Folder Members</span>
                <span className="text-slate-500 text-[11px]">(private folders only)</span>
              </div>
              <div className="space-y-1">
                {folderMembersRaw.map((m) => {
                  const user = USERS.find((u) => u.id === m.userId);
                  if (!user) return null;
                  return (
                    <div key={m.userId} className="flex items-center gap-2 py-1">
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold text-[10px] flex-shrink-0", user.avatarColor)}>
                        {user.avatarInitial}
                      </div>
                      <span className="text-slate-300 text-[12px] flex-1">{user.displayName}</span>
                      <span className="text-slate-500 text-[11px] capitalize">{m.role}</span>
                      {m.userId !== "user-kevin" && (
                        <button
                          type="button"
                          onClick={() => removeFolderMember(folder.id, m.userId)}
                          className="text-slate-600 hover:text-red-400 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Danger zone */}
            <div className="pt-2 border-t border-slate-700">
              <button
                type="button"
                onClick={handleDeleteFolder}
                className="flex items-center gap-1.5 text-red-400 text-[12px] hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete folder
              </button>
            </div>
          </section>
        )}

        {/* Folder Members (compact, shown outside settings too) */}
        {folderMembersRaw.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-slate-300 text-[13px] font-semibold">Folder Members</h2>
              {canEdit && (
                <button
                  type="button"
                  className="flex items-center gap-1 text-indigo-400 text-[12px] hover:text-indigo-300 transition-colors"
                  title="Add folder member"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Add
                </button>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {folderMembersRaw.map((m) => {
                const user = USERS.find((u) => u.id === m.userId);
                if (!user) return null;
                return (
                  <div
                    key={m.userId}
                    className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg"
                    title={`${user.displayName} (${m.role})`}
                  >
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-white font-semibold text-[9px] flex-shrink-0", user.avatarColor)}>
                      {user.avatarInitial}
                    </div>
                    <span className="text-slate-300 text-[11px]">{user.displayName}</span>
                    <span className="text-slate-600 text-[10px] capitalize">{m.role}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Content */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-slate-300 text-[13px] font-semibold">
              Contents
              <span className="ml-2 text-slate-600 text-[11px] font-normal">({items.length})</span>
            </h2>
            {canEdit && (
              <button
                type="button"
                className="flex items-center gap-1.5 text-indigo-400 text-[12px] hover:text-indigo-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add content
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-700 rounded-xl">
              <FolderOpen className="w-6 h-6 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-[12px]">No content in this folder yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => {
                const config = CONTENT_TYPE_CONFIG[item.contentType];
                if (!config) return null;
                const Icon = config.icon;
                const addedByUser = USERS.find((u) => u.id === item.addedBy);

                return (
                  <Link
                    key={item.id}
                    href={config.href(item.contentId)}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-3 bg-slate-900 border rounded-xl hover:bg-slate-800/60 transition-colors",
                      COLOR_BORDER[folder.color] ?? "border-slate-700"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 flex-shrink-0", config.color)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-200 text-[12px] font-medium">{item.contentId}</span>
                        <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[9px] text-slate-400 capitalize">
                          {config.label}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Added by {addedByUser?.displayName ?? "unknown"} ·{" "}
                        {new Date(item.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {canEdit && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          removeItemFromFolder(folder.id, item.contentId);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-600 hover:text-red-400 transition-all"
                        title="Remove from folder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function FolderPage() {
  return (
    <Suspense>
      <FolderViewInner />
    </Suspense>
  );
}
