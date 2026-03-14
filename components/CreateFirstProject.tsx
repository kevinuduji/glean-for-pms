"use client";

import { useState } from "react";
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

export default function CreateFirstProject() {
  const { createProject } = useProjectStore();

  const [name, setName] = useState("");
  const [color, setColor] = useState<ProjectColor>("indigo");
  const [icon, setIcon] = useState<string | null>(null);

  function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;
    createProject({ name: trimmed, color, icon });
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
          </div>
          <h1 className="text-slate-100 text-2xl font-bold mb-2">
            Create your first project
          </h1>
          <p className="text-slate-400 text-[14px]">
            Projects keep your work organized — each one has its own KPIs,
            experiments, connectors, and chat history.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-7">
          {/* Preview + Name */}
          <div className="flex items-center gap-5">
            <ProjectAvatar
              name={name || "P"}
              color={color}
              icon={icon}
              size="lg"
            />
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="e.g. Mobile App, B2B Platform…"
                autoFocus
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-[14px] text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Color
            </label>
            <div className="flex flex-wrap gap-3">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  title={COLOR_LABELS[c]}
                  className={cn(
                    "w-8 h-8 rounded-full transition-all",
                    COLOR_SWATCHES[c],
                    color === c
                      ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110"
                      : "opacity-60 hover:opacity-100 hover:scale-105",
                  )}
                />
              ))}
            </div>
          </div>

          {/* Icon */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Icon <span className="normal-case font-normal text-slate-600">(optional)</span>
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
            <div className="grid grid-cols-9 gap-2">
              {PROJECT_ICONS.map((iconName) => (
                <button
                  key={iconName}
                  onClick={() => setIcon(icon === iconName ? null : iconName)}
                  className={cn(
                    "h-9 flex items-center justify-center rounded-lg transition-all",
                    icon === iconName
                      ? "bg-slate-700 ring-2 ring-indigo-500"
                      : "hover:bg-slate-800",
                  )}
                >
                  <ProjectAvatar
                    name="·"
                    color={icon === iconName ? color : "slate"}
                    icon={iconName}
                    size="xs"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className={cn(
              "w-full py-3 text-[14px] font-semibold rounded-xl transition-all",
              name.trim()
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                : "bg-slate-800 text-slate-500 cursor-not-allowed",
            )}
          >
            Create Project →
          </button>
        </div>
      </div>
    </div>
  );
}
