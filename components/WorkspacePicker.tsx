"use client";

import { useRouter } from "next/navigation";
import { Check, FolderSearch, Plus } from "lucide-react";
import { useProjectStore } from "@/lib/project-store";
import ProjectAvatar from "@/components/ProjectAvatar";
import { useState } from "react";
import CreateProjectModal from "@/components/CreateProjectModal";
import { cn } from "@/lib/utils";

interface WorkspacePickerProps {
  onClose: () => void;
  onOpenBrowser: () => void;
}

export default function WorkspacePicker({ onClose, onOpenBrowser }: WorkspacePickerProps) {
  const router = useRouter();
  const { getJoinedProjects, activeProjectId, setActiveProject } = useProjectStore();
  const [showCreate, setShowCreate] = useState(false);

  const joinedProjects = getJoinedProjects();

  const handleSwitch = (id: string) => {
    setActiveProject(id);
    onClose();
  };

  return (
    <>
      {/* Dropdown panel — positioned right of the workspace button */}
      <div className="absolute top-0 left-full ml-2.5 z-50 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-800">
          <p className="text-xs font-semibold text-slate-200">Your Spaces</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {joinedProjects.length} space{joinedProjects.length !== 1 ? "s" : ""} joined
          </p>
        </div>

        {/* Joined space list */}
        <div className="py-1.5 max-h-60 overflow-y-auto">
          {joinedProjects.length === 0 ? (
            <p className="px-4 py-3 text-xs text-slate-500 italic">No spaces joined yet.</p>
          ) : (
            joinedProjects.map((project) => {
              const isActive = project.id === activeProjectId;
              return (
                <button
                  key={project.id}
                  onClick={() => handleSwitch(project.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 transition-colors text-left",
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                  )}
                >
                  <ProjectAvatar
                    name={project.name}
                    color={project.color}
                    icon={project.icon}
                    size="xs"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{project.name}</p>
                    {project.isEnterprise && (
                      <p className="text-[10px] text-slate-500">Enterprise</p>
                    )}
                  </div>
                  {isActive && <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
                </button>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-800 py-1.5">
          <button
            onClick={() => {
              onOpenBrowser();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <FolderSearch className="w-4 h-4 flex-shrink-0" />
            Browse all spaces
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            Create a personal space
          </button>
        </div>
      </div>

      <CreateProjectModal
        isOpen={showCreate}
        onClose={() => {
          setShowCreate(false);
          onClose();
        }}
      />
    </>
  );
}
