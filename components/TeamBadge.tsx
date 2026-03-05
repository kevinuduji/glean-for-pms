"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/workspace-store";
import type { FolderItem } from "@/lib/types/workspace";
import Link from "next/link";

const COLOR_DOT: Record<string, string> = {
  emerald: "bg-emerald-500",
  violet:  "bg-violet-500",
  rose:    "bg-rose-500",
  amber:   "bg-amber-500",
  indigo:  "bg-indigo-500",
  sky:     "bg-sky-500",
  orange:  "bg-orange-500",
};

interface TeamBadgeProps {
  contentId: string;
  contentType: FolderItem["contentType"];
  className?: string;
  /** If true, wraps the badge in a link to the team profile */
  linkable?: boolean;
}

export default function TeamBadge({
  contentId,
  contentType,
  className,
  linkable = false,
}: TeamBadgeProps) {
  const { getTeamForContent, getContentFolder } = useWorkspaceStore();

  const team = getTeamForContent(contentId, contentType);
  const folder = getContentFolder(contentId, contentType);

  if (!team || !folder) return null;

  const badge = (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium",
        "bg-slate-800 border border-slate-700 text-slate-400",
        className
      )}
    >
      {team.visibility === "private" ? (
        <Lock className="w-2.5 h-2.5" />
      ) : (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full flex-shrink-0",
            COLOR_DOT[team.color] ?? "bg-slate-500"
          )}
        />
      )}
      <span>{team.name}</span>
      {folder.visibility === "private" && team.visibility !== "private" && (
        <Lock className="w-2.5 h-2.5 text-slate-600" />
      )}
    </span>
  );

  if (linkable) {
    return (
      <Link href={`/teams/${team.slug}`} className="hover:opacity-80 transition-opacity">
        {badge}
      </Link>
    );
  }

  return badge;
}
