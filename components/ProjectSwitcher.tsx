"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/lib/project-store";
import ProjectAvatar from "./ProjectAvatar";
import CreateProjectModal from "./CreateProjectModal";

export default function ProjectSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { getAllProjects, getActiveProject, activeProjectId, setActiveProject } = useProjectStore();
  const projects = getAllProjects();
  const activeProject = getActiveProject();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative w-full" ref={dropdownRef}>
        {/* Trigger */}
        <button
          onClick={() => setIsOpen((o) => !o)}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all text-left",
            isOpen ? "bg-slate-800" : "hover:bg-slate-800/60",
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
            <div className="w-6 h-6 rounded-md bg-slate-700 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-slate-200 text-[13px] font-semibold truncate leading-tight">
              {activeProject?.name ?? "No project"}
            </p>
            <p className="text-slate-500 text-[10px] font-medium">Project</p>
          </div>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-slate-500 flex-shrink-0 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute left-0 top-full mt-1 w-full z-50 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
            <div className="py-1 max-h-64 overflow-y-auto">
              {projects.map((project) => {
                const isActive = project.id === activeProjectId;
                return (
                  <button
                    key={project.id}
                    onClick={() => {
                      setActiveProject(project.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 transition-all text-left",
                      isActive
                        ? "bg-slate-700/60"
                        : "hover:bg-slate-700/40",
                    )}
                  >
                    <ProjectAvatar
                      name={project.name}
                      color={project.color}
                      icon={project.icon}
                      size="sm"
                    />
                    <span className="flex-1 text-[13px] font-medium text-slate-200 truncate">
                      {project.name}
                    </span>
                    {isActive && (
                      <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-slate-700">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowCreate(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 transition-all font-medium"
              >
                <div className="w-6 h-6 rounded-md border border-dashed border-slate-600 flex items-center justify-center flex-shrink-0">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                New Project
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </>
  );
}
