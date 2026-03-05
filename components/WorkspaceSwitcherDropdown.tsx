"use client";

import { useRef, useEffect, useState } from "react";
import { Check, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/workspace-store";
import CreateWorkspaceModal from "@/components/modals/CreateWorkspaceModal";
import Link from "next/link";

interface WorkspaceSwitcherDropdownProps {
  onClose: () => void;
}

export default function WorkspaceSwitcherDropdown({ onClose }: WorkspaceSwitcherDropdownProps) {
  const { workspaces, activeWorkspaceId, setActiveWorkspace } = useWorkspaceStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <>
      <div
        ref={ref}
        className="absolute top-full left-0 mt-1 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 py-1 overflow-hidden"
      >
        {/* Workspaces list */}
        <div className="px-1 py-1">
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              type="button"
              onClick={() => {
                setActiveWorkspace(ws.id);
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-700 transition-colors text-left"
            >
              <div className={cn("w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0", ws.logoColor)}>
                <span className="text-white font-bold text-[11px]">{ws.logoInitial}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 text-[12px] font-medium truncate">{ws.name}</p>
                <p className="text-slate-500 text-[10px] capitalize">{ws.plan} plan</p>
              </div>
              {ws.id === activeWorkspaceId && (
                <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>

        <div className="h-px bg-slate-700 mx-2" />

        {/* Actions */}
        <div className="px-1 py-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              setShowCreateModal(true);
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-700 transition-colors text-left"
          >
            <div className="w-6 h-6 rounded-md bg-slate-700 flex items-center justify-center flex-shrink-0">
              <Plus className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <span className="text-slate-300 text-[12px]">Create workspace</span>
          </button>

          <Link
            href="/settings?tab=workspace"
            onClick={onClose}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <div className="w-6 h-6 rounded-md bg-slate-700 flex items-center justify-center flex-shrink-0">
              <Settings className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <span className="text-slate-300 text-[12px]">Workspace settings</span>
          </Link>
        </div>
      </div>

      {showCreateModal && <CreateWorkspaceModal onClose={() => setShowCreateModal(false)} />}
    </>
  );
}
