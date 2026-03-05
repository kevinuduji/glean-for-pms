"use client";

import { useState } from "react";
import { X, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/workspace-store";

const COLORS = [
  { name: "bg-indigo-600", label: "Indigo" },
  { name: "bg-emerald-600", label: "Emerald" },
  { name: "bg-violet-600", label: "Violet" },
  { name: "bg-rose-600", label: "Rose" },
  { name: "bg-amber-600", label: "Amber" },
  { name: "bg-sky-600", label: "Sky" },
  { name: "bg-orange-600", label: "Orange" },
];

interface CreateWorkspaceModalProps {
  onClose: () => void;
}

export default function CreateWorkspaceModal({ onClose }: CreateWorkspaceModalProps) {
  const { createWorkspace, setActiveWorkspace } = useWorkspaceStore();
  const [name, setName] = useState("");
  const [color, setColor] = useState("bg-indigo-600");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!name.trim()) {
      setError("Workspace name is required.");
      return;
    }
    const id = createWorkspace(name.trim(), color);
    setActiveWorkspace(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            <h2 className="text-slate-100 text-[13px] font-semibold">Create Workspace</h2>
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
              Workspace Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="e.g. Acme Corp"
              maxLength={48}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-[13px] placeholder:text-slate-500 focus:outline-none focus:border-slate-500"
              autoFocus
            />
            {error && <p className="mt-1 text-red-400 text-[11px]">{error}</p>}
          </div>

          {/* Color */}
          <div>
            <label className="block text-slate-400 text-[11px] font-medium mb-1.5">
              Logo Color
            </label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.name)}
                  className={cn(
                    "w-7 h-7 rounded-full transition-all",
                    c.name,
                    color === c.name ? "ring-2 ring-offset-2 ring-offset-slate-900 ring-white" : ""
                  )}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-800 rounded-lg border border-slate-700">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", color)}>
              <span className="text-white font-bold text-sm">
                {name[0]?.toUpperCase() || "W"}
              </span>
            </div>
            <div>
              <p className="text-slate-200 text-[13px] font-medium">{name || "Workspace Name"}</p>
              <p className="text-slate-500 text-[11px]">Free Plan · Private</p>
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
            Create Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
