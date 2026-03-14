"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Settings, Bell } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useProjectStore } from "@/lib/project-store";
import ProjectAvatar from "@/components/ProjectAvatar";
import WorkspacePicker from "@/components/WorkspacePicker";
import ProjectBrowser from "@/components/ProjectBrowser";
import { cn } from "@/lib/utils";

// ─── Tooltip wrapper ──────────────────────────────────────────────────────────

function Tooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative group/tip flex items-center justify-center">
      {children}
      <div className="pointer-events-none absolute left-full ml-2.5 z-50 whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface IconRailProps {
  onToggleActivity: () => void;
  hasUnread: boolean;
  activityOpen: boolean;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function IconRail({
  onToggleActivity,
  hasUnread,
  activityOpen,
}: IconRailProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { getActiveProject } = useProjectStore();

  const [showWorkspacePicker, setShowWorkspacePicker] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);

  const pickerRef = useRef<HTMLDivElement>(null);
  const activeProject = getActiveProject();

  // Close workspace picker on outside click
  useEffect(() => {
    if (!showWorkspacePicker) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowWorkspacePicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showWorkspacePicker]);

  return (
    <>
      {/* Rail */}
      <div className="relative flex flex-col items-center w-14 flex-shrink-0 bg-slate-950 border-r border-slate-800 py-3 gap-2 z-20">
        {/* ── Active project icon — click to open workspace picker ── */}
        <div ref={pickerRef} className="relative">
          <Tooltip
            label={
              activeProject
                ? `${activeProject.name} — switch space`
                : "Switch space"
            }
          >
            <button
              onClick={() => setShowWorkspacePicker((v) => !v)}
              className={cn(
                "transition-all duration-150 flex-shrink-0",
                showWorkspacePicker
                  ? "ring-2 ring-white ring-offset-2 ring-offset-slate-950 rounded-xl"
                  : "opacity-90 hover:opacity-100",
              )}
            >
              {activeProject ? (
                <ProjectAvatar
                  name={activeProject.name}
                  color={activeProject.color}
                  icon={activeProject.icon}
                  size="sm"
                />
              ) : (
                <div className="w-7 h-7 rounded-xl bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                  ?
                </div>
              )}
            </button>
          </Tooltip>

          {showWorkspacePicker && (
            <WorkspacePicker
              onClose={() => setShowWorkspacePicker(false)}
              onOpenBrowser={() => {
                setShowWorkspacePicker(false);
                setShowBrowser(true);
              }}
            />
          )}
        </div>

        {/* ── Thin divider ── */}
        <div className="w-6 h-px bg-slate-800" />

        {/* ── Activity / notifications ── */}
        <Tooltip label="Activity">
          <button
            onClick={onToggleActivity}
            className={cn(
              "relative w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
              activityOpen
                ? "bg-slate-700 text-white"
                : "text-slate-500 hover:text-slate-200 hover:bg-slate-800",
            )}
          >
            <Bell className="w-4 h-4" />
            {hasUnread && !activityOpen && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 border border-slate-950" />
            )}
          </button>
        </Tooltip>

        {/* ── Browse / join spaces ── */}
        <Tooltip label="Browse spaces">
          <button
            onClick={() => setShowBrowser(true)}
            className="w-7 h-7 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 hover:border-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Bottom: settings + account ── */}
        <div className="flex flex-col items-center gap-2 pt-2 border-t border-slate-800 w-full px-1.5">
          <Tooltip label="Settings">
            <button
              onClick={() => router.push("/settings")}
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                pathname === "/settings"
                  ? "bg-slate-700 text-white"
                  : "text-slate-500 hover:text-slate-200 hover:bg-slate-800",
              )}
            >
              <Settings className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip label="Account">
            <button
              onClick={() => router.push("/settings")}
              className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white hover:bg-indigo-500 transition-colors"
            >
              K
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Space browser modal */}
      {showBrowser && <ProjectBrowser onClose={() => setShowBrowser(false)} />}
    </>
  );
}
