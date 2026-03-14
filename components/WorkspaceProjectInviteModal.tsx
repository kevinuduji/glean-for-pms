"use client";

import { useState, useRef, useEffect } from "react";
import { Lock, X, AlertCircle } from "lucide-react";
import { useWorkspaceProjectStore } from "@/lib/workspace-project-store";
import ProjectAvatar from "@/components/ProjectAvatar";
import type { WorkspaceProject } from "@/lib/types/workspace-project";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface WorkspaceProjectInviteModalProps {
  project: WorkspaceProject;
  onClose: () => void;
}

export default function WorkspaceProjectInviteModal({
  project,
  onClose,
}: WorkspaceProjectInviteModalProps) {
  const { joinWorkspaceProject } = useWorkspaceProjectStore();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    const ok = joinWorkspaceProject(project.id, trimmed);
    if (ok) {
      onClose();
      router.push(`/projects/${project.id}/overview`);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden transition-transform",
          shake && "animate-shake"
        )}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Project preview */}
        <div className="flex flex-col items-center pt-8 pb-5 px-6 border-b border-slate-800 bg-slate-950/50">
          <ProjectAvatar
            name={project.name}
            color={project.color}
            icon={null}
            size="lg"
          />
          <h2 className="mt-3 text-base font-semibold text-white">
            {project.name}
          </h2>
          {project.description && (
            <p className="mt-1 text-xs text-slate-400 text-center max-w-[200px]">
              {project.description}
            </p>
          )}
          <div className="flex items-center gap-1.5 mt-2">
            <Lock className="w-3 h-3 text-slate-500" />
            <p className="text-xs text-slate-500">Private project</p>
          </div>
        </div>

        {/* Code input */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
              Enter invite code
            </label>
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
                if (e.key === "Escape") onClose();
              }}
              placeholder="e.g. SECRET42"
              maxLength={12}
              className={cn(
                "w-full px-3 py-2.5 bg-slate-800 border rounded-xl text-white placeholder:text-slate-600 text-sm font-mono tracking-widest text-center uppercase focus:outline-none transition-colors",
                error
                  ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              )}
            />
            {error && (
              <p className="flex items-center gap-1.5 mt-2 text-xs text-rose-400">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                Invalid code — check with your team and try again.
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!code.trim()}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Join Project
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-6px);
          }
          40% {
            transform: translateX(6px);
          }
          60% {
            transform: translateX(-4px);
          }
          80% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
