"use client";

import { useState } from "react";
import { X, FolderPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/workspace-store";
import VisibilityToggle from "@/components/VisibilityToggle";
import type { Visibility } from "@/lib/types/workspace";

const COLOR_OPTIONS = [
  { name: "emerald", bg: "bg-emerald-500" },
  { name: "violet",  bg: "bg-violet-500" },
  { name: "rose",    bg: "bg-rose-500" },
  { name: "amber",   bg: "bg-amber-500" },
  { name: "indigo",  bg: "bg-indigo-500" },
  { name: "sky",     bg: "bg-sky-500" },
  { name: "orange",  bg: "bg-orange-500" },
];

interface CreateFolderModalProps {
  teamId: string;
  teamColor?: string;
  onClose: () => void;
  onCreated?: (folderId: string) => void;
}

export default function CreateFolderModal({
  teamId,
  teamColor = "indigo",
  onClose,
  onCreated,
}: CreateFolderModalProps) {
  const { createFolder } = useWorkspaceStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(teamColor);
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!name.trim()) {
      setError("Folder name is required.");
      return;
    }
    const id = createFolder(teamId, {
      name: name.trim(),
      description: description.trim(),
      color,
      visibility,
    });
    onCreated?.(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FolderPlus className="w-4 h-4 text-slate-400" />
            <h2 className="text-slate-100 text-[13px] font-semibold">New Folder</h2>
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
          <div>
            <label className="block text-slate-400 text-[11px] font-medium mb-1.5">
              Folder Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="e.g. Q1 Experiments, Bug Hunt"
              maxLength={48}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-[13px] placeholder:text-slate-500 focus:outline-none focus:border-slate-500"
              autoFocus
            />
            {error && <p className="mt-1 text-red-400 text-[11px]">{error}</p>}
          </div>

          <div>
            <label className="block text-slate-400 text-[11px] font-medium mb-1.5">
              Description <span className="text-slate-600">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this folder for?"
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-[13px] placeholder:text-slate-500 focus:outline-none focus:border-slate-500 resize-none"
            />
          </div>

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

          <div>
            <label className="block text-slate-400 text-[11px] font-medium mb-1.5">Access</label>
            <VisibilityToggle value={visibility} onChange={setVisibility} />
            <p className="mt-1.5 text-slate-500 text-[11px]">
              {visibility === "public"
                ? "All team members can see this folder."
                : "Only invited folder members can see this folder."}
            </p>
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
            Create Folder
          </button>
        </div>
      </div>
    </div>
  );
}
