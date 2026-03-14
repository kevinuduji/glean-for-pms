"use client";

import { useState, useMemo } from "react";
import { Search, X, Lock, Users, Check, Globe } from "lucide-react";
import { useProjectStore } from "@/lib/project-store";
import { ENTERPRISE_PROJECTS } from "@/lib/mock-data/enterprise-projects";
import ProjectAvatar from "@/components/ProjectAvatar";
import InviteCodeModal from "@/components/InviteCodeModal";
import type { Project } from "@/lib/types/project";
import { cn } from "@/lib/utils";

interface ProjectBrowserProps {
  onClose: () => void;
  /** When true, renders as full-page onboarding (no close button, no backdrop click-to-close) */
  isOnboarding?: boolean;
}

// ─── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  isJoined,
  onJoin,
  onEnterCode,
}: {
  project: Project;
  isJoined: boolean;
  onJoin: () => void;
  onEnterCode: () => void;
}) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col gap-3 hover:border-slate-600 hover:bg-slate-800 transition-all duration-150">
      {/* Header row */}
      <div className="flex items-start gap-3">
        <ProjectAvatar
          name={project.name}
          color={project.color}
          icon={project.icon}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-semibold text-white truncate">{project.name}</h3>
            {!project.isPublic && (
              <Lock className="w-3 h-3 text-slate-500 flex-shrink-0" />
            )}
            {project.isPublic && (
              <Globe className="w-3 h-3 text-slate-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Users className="w-3 h-3 text-slate-500" />
            <span className="text-[11px] text-slate-500">
              {project.memberCount?.toLocaleString() ?? 0} member
              {project.memberCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {project.description}
        </p>
      )}

      {/* Action */}
      {isJoined ? (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 rounded-lg w-fit">
          <Check className="w-3 h-3 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Joined</span>
        </div>
      ) : project.isPublic ? (
        <button
          onClick={onJoin}
          className="self-start px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          Join
        </button>
      ) : (
        <button
          onClick={onEnterCode}
          className="self-start flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors"
        >
          <Lock className="w-3 h-3" />
          Enter invite code
        </button>
      )}
    </div>
  );
}

// ─── Browser ──────────────────────────────────────────────────────────────────

export default function ProjectBrowser({ onClose, isOnboarding = false }: ProjectBrowserProps) {
  const { joinedProjectIds, joinProject, getJoinedProjects } = useProjectStore();
  const [query, setQuery] = useState("");
  const [codeTarget, setCodeTarget] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return ENTERPRISE_PROJECTS;
    return ENTERPRISE_PROJECTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [query]);

  const publicProjects = filtered.filter((p) => p.isPublic);
  const privateProjects = filtered.filter((p) => !p.isPublic);

  const handlePublicJoin = (id: string) => {
    joinProject(id);
  };

  const handleCodeSuccess = () => {
    setCodeTarget(null);
    if (isOnboarding) {
      // onboarding: close browser after first join
      onClose();
    }
  };

  // For onboarding: render as full-page instead of modal
  if (isOnboarding) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center overflow-y-auto py-16 px-4">
        <BrowserContent
          query={query}
          setQuery={setQuery}
          publicProjects={publicProjects}
          privateProjects={privateProjects}
          joinedProjectIds={joinedProjectIds}
          onPublicJoin={handlePublicJoin}
          onEnterCode={setCodeTarget}
          isOnboarding={isOnboarding}
          onClose={onClose}
        />

        {codeTarget && (
          <InviteCodeModal
            project={codeTarget}
            onSuccess={handleCodeSuccess}
            onClose={() => setCodeTarget(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <BrowserContent
          query={query}
          setQuery={setQuery}
          publicProjects={publicProjects}
          privateProjects={privateProjects}
          joinedProjectIds={joinedProjectIds}
          onPublicJoin={handlePublicJoin}
          onEnterCode={setCodeTarget}
          isOnboarding={false}
          onClose={onClose}
        />
      </div>

      {codeTarget && (
        <InviteCodeModal
          project={codeTarget}
          onSuccess={handleCodeSuccess}
          onClose={() => setCodeTarget(null)}
        />
      )}
    </div>
  );
}

// ─── Inner content (shared between modal + onboarding) ───────────────────────

function BrowserContent({
  query,
  setQuery,
  publicProjects,
  privateProjects,
  joinedProjectIds,
  onPublicJoin,
  onEnterCode,
  isOnboarding,
  onClose,
}: {
  query: string;
  setQuery: (q: string) => void;
  publicProjects: Project[];
  privateProjects: Project[];
  joinedProjectIds: string[];
  onPublicJoin: (id: string) => void;
  onEnterCode: (p: Project) => void;
  isOnboarding: boolean;
  onClose: () => void;
}) {
  return (
    <div className={cn("flex flex-col", isOnboarding ? "w-full max-w-2xl" : "flex-1 min-h-0")}>
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between px-6 border-b border-slate-800",
          isOnboarding ? "py-0 mb-6 border-none" : "py-4"
        )}
      >
        <div>
          {isOnboarding && (
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">
              BlackRock
            </p>
          )}
          <h2 className="text-lg font-bold text-white">
            {isOnboarding ? "Join your first space" : "Browse spaces"}
          </h2>
          {isOnboarding && (
            <p className="text-sm text-slate-400 mt-1">
              Public spaces are open to all BlackRock SSO members. Private spaces require an invite code or link.
            </p>
          )}
        </div>
        {!isOnboarding && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search */}
      <div className={cn("flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 rounded-xl px-3", isOnboarding ? "mb-6" : "mx-4 my-3")}>
        <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects…"
          className="flex-1 bg-transparent py-2.5 text-sm text-slate-200 placeholder:text-slate-500 border-none outline-none"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-slate-500 hover:text-slate-300">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Scrollable content */}
      <div className={cn("overflow-y-auto px-4 pb-6 space-y-6", !isOnboarding && "flex-1")}>
        {/* Public spaces */}
        {publicProjects.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Public Spaces — Open to all BlackRock SSO members
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {publicProjects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  isJoined={joinedProjectIds.includes(p.id)}
                  onJoin={() => onPublicJoin(p.id)}
                  onEnterCode={() => onEnterCode(p)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Private spaces */}
        {privateProjects.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Private Spaces — Invite code or private link required
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {privateProjects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  isJoined={joinedProjectIds.includes(p.id)}
                  onJoin={() => {}}
                  onEnterCode={() => onEnterCode(p)}
                />
              ))}
            </div>
          </section>
        )}

        {publicProjects.length === 0 && privateProjects.length === 0 && (
          <div className="py-16 text-center text-slate-500">
            <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No projects match &quot;{query}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
