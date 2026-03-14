"use client";

import { useState } from "react";
import { X, Lock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceProjectStore } from "@/lib/workspace-project-store";
import ProjectAvatar from "./ProjectAvatar";

const COLOR_LABELS: Record<string, string> = {
  indigo: "Indigo",
  emerald: "Emerald",
  violet: "Violet",
  rose: "Rose",
  amber: "Amber",
  sky: "Sky",
  orange: "Orange",
  teal: "Teal",
  slate: "Slate",
};

const COLOR_SWATCHES: Record<string, string> = {
  indigo: "bg-indigo-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
  sky: "bg-sky-500",
  orange: "bg-orange-500",
  teal: "bg-teal-500",
  slate: "bg-slate-500",
};

const COLORS = Object.keys(COLOR_SWATCHES);

interface CreateWorkspaceProjectModalProps {
  isOpen: boolean;
  workspaceId: string;
  onClose: () => void;
}

export default function CreateWorkspaceProjectModal({
  isOpen,
  workspaceId,
  onClose,
}: CreateWorkspaceProjectModalProps) {
  const { createWorkspaceProject } = useWorkspaceProjectStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("indigo");
  const [isPublic, setIsPublic] = useState(true);
  const [inviteCode, setInviteCode] = useState("");

  if (!isOpen) return null;

  function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;
    createWorkspaceProject({
      workspaceId,
      name: trimmed,
      color,
      description: description.trim() || undefined,
      isPublic,
      inviteCode: !isPublic ? inviteCode.trim().toUpperCase() || undefined : undefined,
    });
    handleClose();
  }

  function handleClose() {
    setName("");
    setDescription("");
    setColor("indigo");
    setIsPublic(true);
    setInviteCode("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-slate-100 text-[15px] font-semibold">
            New Project
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Live preview + Name */}
          <div className="flex items-center gap-4">
            <ProjectAvatar
              name={name || "P"}
              color={color}
              icon={null}
              size="lg"
            />
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Project Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="e.g. Q1 Research"
                autoFocus
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-[14px] text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Description{" "}
              <span className="normal-case font-normal text-slate-600">
                (optional)
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-[13px] text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all resize-none"
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  title={COLOR_LABELS[c]}
                  className={cn(
                    "w-7 h-7 rounded-full transition-all",
                    COLOR_SWATCHES[c],
                    color === c
                      ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110"
                      : "opacity-70 hover:opacity-100 hover:scale-105"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Visibility toggle */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              Visibility
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsPublic(true)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[13px] font-medium transition-all",
                  isPublic
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                    : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                )}
              >
                <Globe className="w-3.5 h-3.5" />
                Public
              </button>
              <button
                onClick={() => setIsPublic(false)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[13px] font-medium transition-all",
                  !isPublic
                    ? "bg-rose-600/20 border-rose-500 text-rose-300"
                    : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                )}
              >
                <Lock className="w-3.5 h-3.5" />
                Private
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-600">
              {isPublic
                ? "Anyone in the workspace can join."
                : "Requires an invite code to join."}
            </p>
          </div>

          {/* Invite code (only for private) */}
          {!isPublic && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Invite Code{" "}
                <span className="normal-case font-normal text-slate-600">
                  (optional)
                </span>
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="e.g. SECRET42"
                maxLength={12}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-[13px] text-slate-100 placeholder-slate-500 font-mono tracking-widest uppercase outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-[13px] font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className={cn(
              "px-5 py-2 text-[13px] font-semibold rounded-lg transition-all",
              name.trim()
                ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
            )}
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
