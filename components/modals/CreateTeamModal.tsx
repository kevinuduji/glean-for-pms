"use client";

import { useState } from "react";
import { X, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/workspace-store";
import VisibilityToggle from "@/components/VisibilityToggle";
import type { Visibility } from "@/lib/types/workspace";
import * as LucideIcons from "lucide-react";

const COLOR_OPTIONS = [
  { name: "emerald", bg: "bg-emerald-500" },
  { name: "violet",  bg: "bg-violet-500" },
  { name: "rose",    bg: "bg-rose-500" },
  { name: "amber",   bg: "bg-amber-500" },
  { name: "indigo",  bg: "bg-indigo-500" },
  { name: "sky",     bg: "bg-sky-500" },
  { name: "orange",  bg: "bg-orange-500" },
];

const ICON_OPTIONS = [
  "TrendingUp", "Cpu", "Palette", "Shield", "Rocket",
  "Zap", "Globe", "Lock", "Star", "Users",
];

function TeamIcon({ name, className }: { name: string; className?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[name];
  if (!Icon) return <Users className={className} />;
  return <Icon className={className} />;
}

interface CreateTeamModalProps {
  onClose: () => void;
  onCreated?: (teamId: string) => void;
}

export default function CreateTeamModal({ onClose, onCreated }: CreateTeamModalProps) {
  const { createTeam } = useWorkspaceStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("emerald");
  const [icon, setIcon] = useState("TrendingUp");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!name.trim()) {
      setError("Team name is required.");
      return;
    }
    const id = createTeam({ name: name.trim(), description: description.trim(), color, icon, visibility });
    onCreated?.(id);
    onClose();
  };

  const selectedColor = COLOR_OPTIONS.find((c) => c.name === color);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-slate-400" />
            <h2 className="text-slate-100 text-[13px] font-semibold">Create Team</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-slate-400 text-[11px] font-medium mb-1.5">
              Team Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="e.g. Growth, Platform, Design"
              maxLength={32}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-[13px] placeholder:text-slate-500 focus:outline-none focus:border-slate-500"
              autoFocus
            />
            {error && <p className="mt-1 text-red-400 text-[11px]">{error}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-400 text-[11px] font-medium mb-1.5">
              Description <span className="text-slate-600">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this team work on?"
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-[13px] placeholder:text-slate-500 focus:outline-none focus:border-slate-500 resize-none"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-slate-400 text-[11px] font-medium mb-1.5">Color</label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.name)}
                  className={cn(
                    "w-6 h-6 rounded-full transition-all",
                    c.bg,
                    color === c.name ? "ring-2 ring-offset-2 ring-offset-slate-900 ring-white" : ""
                  )}
                />
              ))}
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-slate-400 text-[11px] font-medium mb-1.5">Icon</label>
            <div className="flex gap-1.5 flex-wrap">
              {ICON_OPTIONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    icon === i
                      ? "bg-slate-600 text-slate-100"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
                  )}
                  title={i}
                >
                  <TeamIcon name={i} className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-slate-400 text-[11px] font-medium mb-1.5">Access</label>
            <VisibilityToggle value={visibility} onChange={setVisibility} />
            <p className="mt-1.5 text-slate-500 text-[11px]">
              {visibility === "public"
                ? "All workspace members can see this team."
                : "Only invited members can see this team."}
            </p>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-800 rounded-lg border border-slate-700">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", selectedColor?.bg ?? "bg-slate-600")}>
              <TeamIcon name={icon} className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-slate-200 text-[13px] font-medium">{name || "Team Name"}</p>
              <p className="text-slate-500 text-[11px] capitalize">{visibility} · You (lead)</p>
            </div>
          </div>
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
            onClick={handleCreate}
            disabled={!name.trim()}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-[13px] font-medium hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Create Team
          </button>
        </div>
      </div>
    </div>
  );
}
