"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderKanban, Globe, Lock, Users, Plus, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/lib/project-store";
import { useWorkspaceProjectStore } from "@/lib/workspace-project-store";
import type { WorkspaceProject } from "@/lib/types/workspace-project";
import CreateWorkspaceProjectModal from "@/components/CreateWorkspaceProjectModal";
import WorkspaceProjectInviteModal from "@/components/WorkspaceProjectInviteModal";

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-600",
  violet: "bg-violet-600",
  rose: "bg-rose-600",
  amber: "bg-amber-500",
  indigo: "bg-indigo-600",
  sky: "bg-sky-500",
  orange: "bg-orange-500",
  teal: "bg-teal-600",
  slate: "bg-slate-600",
};

const colorDotMap: Record<string, string> = {
  emerald: "bg-emerald-400",
  violet: "bg-violet-400",
  rose: "bg-rose-400",
  amber: "bg-amber-400",
  indigo: "bg-indigo-400",
  sky: "bg-sky-400",
  orange: "bg-orange-400",
  teal: "bg-teal-400",
  slate: "bg-slate-400",
};

function ProjectCard({
  project,
  isJoined,
  onOpen,
  onJoin,
  onEnterCode,
}: {
  project: WorkspaceProject;
  isJoined: boolean;
  onOpen: () => void;
  onJoin: () => void;
  onEnterCode: () => void;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all group">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm",
            colorMap[project.color] ?? "bg-slate-600"
          )}
        >
          {project.name.charAt(0).toUpperCase()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-slate-200 truncate">
              {project.name}
            </span>
            {project.isPublic ? (
              <Globe className="w-3 h-3 text-slate-500 flex-shrink-0" />
            ) : (
              <Lock className="w-3 h-3 text-rose-400 flex-shrink-0" />
            )}
          </div>
          {project.description && (
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
              {project.description}
            </p>
          )}
          {project.memberCount != null && (
            <div className="flex items-center gap-1 mt-2">
              <Users className="w-3 h-3 text-slate-500" />
              <span className="text-[11px] text-slate-500">
                {project.memberCount} member{project.memberCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="flex-shrink-0">
          {isJoined ? (
            <button
              onClick={onOpen}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Open
              <ChevronRight className="w-3 h-3" />
            </button>
          ) : project.isPublic ? (
            <button
              onClick={onJoin}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg border border-slate-700 hover:border-slate-600 transition-all"
            >
              Join
            </button>
          ) : (
            <button
              onClick={onEnterCode}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 text-xs font-semibold rounded-lg border border-slate-700 hover:border-rose-800 transition-all"
            >
              <Lock className="w-3 h-3" />
              Enter code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const { getActiveProject, activeProjectId } = useProjectStore();
  const {
    getAllProjectsForWorkspace,
    joinedProjectIds,
    joinWorkspaceProject,
    setActiveWorkspaceProject,
  } = useWorkspaceProjectStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [inviteProject, setInviteProject] = useState<WorkspaceProject | null>(null);

  const activeWorkspace = getActiveProject();
  const allProjects = activeWorkspace
    ? getAllProjectsForWorkspace(activeWorkspace.id)
    : [];

  const publicProjects = allProjects.filter((p) => p.isPublic);
  const privateProjects = allProjects.filter((p) => !p.isPublic);

  function handleOpen(project: WorkspaceProject) {
    setActiveWorkspaceProject(project.id);
    router.push(`/projects/${project.id}/overview`);
  }

  function handleJoin(project: WorkspaceProject) {
    const ok = joinWorkspaceProject(project.id);
    if (ok) {
      router.push(`/projects/${project.id}/overview`);
    }
  }

  return (
    <div className="h-full bg-slate-950 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-slate-500 font-medium">
                {activeWorkspace?.name ?? "Workspace"}
              </span>
              <span className="text-slate-700">/</span>
              <span className="text-xs text-slate-400 font-medium">Projects</span>
            </div>
            <div className="flex items-center gap-2.5">
              <FolderKanban className="w-5 h-5 text-indigo-400" />
              <h1 className="text-xl font-bold text-slate-100">Projects</h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Sub-projects within{" "}
              <span className="text-slate-400 font-medium">
                {activeWorkspace?.name ?? "this workspace"}
              </span>
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            New project
          </button>
        </div>

        {allProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
              <FolderKanban className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="text-base font-semibold text-slate-300 mb-1">
              No projects yet
            </h3>
            <p className="text-sm text-slate-500 max-w-xs">
              Create your first project to start organising work within this
              workspace.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-5 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create first project
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Public Projects */}
            {publicProjects.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                    Public Projects
                  </span>
                  <span className="text-[11px] text-slate-600">
                    ({publicProjects.length})
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {publicProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      isJoined={joinedProjectIds.includes(project.id)}
                      onOpen={() => handleOpen(project)}
                      onJoin={() => handleJoin(project)}
                      onEnterCode={() => setInviteProject(project)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Private Projects */}
            {privateProjects.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                    Private Projects
                  </span>
                  <span className="text-[11px] text-slate-600">
                    ({privateProjects.length})
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {privateProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      isJoined={joinedProjectIds.includes(project.id)}
                      onOpen={() => handleOpen(project)}
                      onJoin={() => handleJoin(project)}
                      onEnterCode={() => setInviteProject(project)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {activeWorkspace && (
        <CreateWorkspaceProjectModal
          isOpen={isCreateOpen}
          workspaceId={activeWorkspace.id}
          onClose={() => setIsCreateOpen(false)}
        />
      )}
      {inviteProject && (
        <WorkspaceProjectInviteModal
          project={inviteProject}
          onClose={() => setInviteProject(null)}
        />
      )}
    </div>
  );
}
