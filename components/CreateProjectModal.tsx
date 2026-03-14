"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROJECT_COLORS, PROJECT_ICONS, type ProjectColor } from "@/lib/types/project";
import { useProjectStore } from "@/lib/project-store";
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

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const { createProject } = useProjectStore();

  const [name, setName] = useState("");
  const [color, setColor] = useState<ProjectColor>("indigo");
  const [icon, setIcon] = useState<string | null>(null);

  if (!isOpen) return null;

  function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;
    createProject({ name: trimmed, color, icon });
    handleClose();
  }

  function handleClose() {
    setName("");
    setColor("indigo");
    setIcon(null);
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
          <h2 className="text-slate-100 text-[15px] font-semibold">New Project</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Live preview + Name */}
          <div className="flex items-center gap-4">
            <ProjectAvatar
              name={name || "P"}
              color={color}
              icon={icon}
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
                placeholder="e.g. Mobile App"
                autoFocus
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-[14px] text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              />
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  title={COLOR_LABELS[c]}
                  className={cn(
                    "w-7 h-7 rounded-full transition-all",
                    COLOR_SWATCHES[c],
                    color === c
                      ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110"
                      : "opacity-70 hover:opacity-100 hover:scale-105",
                  )}
                />
              ))}
            </div>
          </div>

          {/* Icon picker */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Icon
              </label>
              {icon && (
                <button
                  onClick={() => setIcon(null)}
                  className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Use letter instead
                </button>
              )}
            </div>
            <div className="grid grid-cols-9 gap-1.5">
              {PROJECT_ICONS.map((iconName) => (
                <IconButton
                  key={iconName}
                  iconName={iconName}
                  selected={icon === iconName}
                  color={color}
                  onClick={() => setIcon(icon === iconName ? null : iconName)}
                />
              ))}
            </div>
          </div>
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
                : "bg-slate-700 text-slate-500 cursor-not-allowed",
            )}
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Icon Button ──────────────────────────────────────────────────────────────

import dynamic from "next/dynamic";
import type { LucideProps } from "lucide-react";
import type { ComponentType } from "react";

// Lazy-load icons for the grid
const ICON_COMPONENTS: Record<string, ComponentType<LucideProps>> = {};

function IconButton({
  iconName,
  selected,
  color,
  onClick,
}: {
  iconName: string;
  selected: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded-lg transition-all",
        selected
          ? "bg-slate-700 ring-2 ring-indigo-500"
          : "hover:bg-slate-800 text-slate-500 hover:text-slate-300",
      )}
    >
      <ProjectAvatar
        name="·"
        color={selected ? color : "slate"}
        icon={iconName}
        size="xs"
      />
    </button>
  );
}
