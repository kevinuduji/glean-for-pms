"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Hash,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Folder,
  Plus,
  Plug,
  Search,
  MoreHorizontal,
  Bell,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SearchModal from "./SearchModal";
import WorkspacePicker from "./WorkspacePicker";
import ProjectBrowser from "./ProjectBrowser";
import { useProjectStore } from "@/lib/project-store";
import { useWorkspaceProjectStore } from "@/lib/workspace-project-store";
import { useSectionStore } from "@/lib/section-store";
import {
  SECTIONS_BY_PROJECT,
  FOLDERS_BY_PROJECT,
} from "@/lib/mock-data/sections";
import type { Section, SectionFolder } from "@/lib/types/section";
import ActivityPanel from "./ActivityPanel";
import { MOCK_ACTIVITY } from "@/lib/mock-data/activity";

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
  indigo: "bg-indigo-500",
  sky: "bg-sky-500",
  orange: "bg-orange-500",
  slate: "bg-slate-500",
  teal: "bg-teal-500",
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showWorkspacePicker, setShowWorkspacePicker] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);
  const [collapsedProjects, setCollapsedProjects] = useState<Set<string>>(
    new Set(),
  );
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(
    new Set(),
  );
  const [activityOpen, setActivityOpen] = useState(false);
  const hasUnread = MOCK_ACTIVITY.some((a) => !a.read);

  const pickerRef = useRef<HTMLDivElement>(null);

  const { activeProjectId, getActiveProject } = useProjectStore();
  const { getJoinedProjectsForWorkspace } = useWorkspaceProjectStore();
  const {
    activeSectionId,
    setActiveSection,
    getSectionsForProject,
    getFoldersForProject,
  } = useSectionStore();

  const activeWorkspace = getActiveProject();

  // Projects for the active workspace
  const projects = activeWorkspace
    ? getJoinedProjectsForWorkspace(activeWorkspace.id)
    : [];

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

  // Keyboard shortcut ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleProject = (id: string) => {
    setCollapsedProjects((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleFolder = (id: string) => {
    setCollapsedFolders((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSectionClick = (section: Section) => {
    setActiveSection(section.id);
    router.push(`/section/${section.id}/overview`);
  };

  const renderSections = (sections: Section[]) =>
    sections.map((section) => {
      const isActive =
        activeSectionId === section.id ||
        pathname.startsWith(`/section/${section.id}/`);
      return (
        <button
          key={section.id}
          onClick={() => handleSectionClick(section)}
          className={cn(
            "group w-full flex items-center gap-1.5 px-3 py-[5px] rounded-md text-left transition-all",
            isActive
              ? "bg-slate-700/80 text-white"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
          )}
        >
          <Hash
            className={cn(
              "w-3.5 h-3.5 flex-shrink-0 mr-0.5",
              isActive
                ? "text-slate-300"
                : "text-slate-600 group-hover:text-slate-400",
            )}
          />
          <span className="text-[13px] truncate leading-snug">
            {section.name}
          </span>
        </button>
      );
    });

  const renderFoldersAndSections = (projectId: string) => {
    const allSections = getSectionsForProject(projectId);
    const allFolders = getFoldersForProject(projectId);

    // Standalone sections (no folder)
    const standaloneSections = allSections.filter((s) => !s.folderId);

    return (
      <>
        {allFolders.map((folder) => {
          const folderSections = allSections.filter(
            (s) => s.folderId === folder.id,
          );
          const isCollapsed = collapsedFolders.has(folder.id);
          return (
            <div key={folder.id}>
              {/* Folder header */}
              <button
                onClick={() => toggleFolder(folder.id)}
                className="w-full flex items-center gap-1.5 px-3 py-[5px] text-left hover:bg-slate-800/30 rounded-md transition-colors group"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-slate-600 flex-shrink-0" />
                )}
                {isCollapsed ? (
                  <Folder className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                ) : (
                  <FolderOpen className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                )}
                <span className="text-[12px] text-slate-400 font-medium truncate group-hover:text-slate-200 transition-colors">
                  {folder.name}
                </span>
              </button>
              {/* Folder sections */}
              {!isCollapsed && (
                <div className="pl-4">{renderSections(folderSections)}</div>
              )}
            </div>
          );
        })}
        {/* Standalone sections */}
        {renderSections(standaloneSections)}
      </>
    );
  };

  return (
    <>
      <div className="h-full w-60 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* ── Workspace header ── */}
        <div ref={pickerRef} className="relative border-b border-slate-800">
          <button
            onClick={() => setShowWorkspacePicker((v) => !v)}
            className="w-full flex items-center gap-2.5 px-3 py-3 hover:bg-slate-800/40 transition-colors"
          >
            {activeWorkspace && (
              <span
                className={cn(
                  "w-2 h-2 rounded-full flex-shrink-0",
                  colorMap[activeWorkspace.color] ?? "bg-slate-500",
                )}
              />
            )}
            <span className="text-[14px] font-bold text-slate-100 truncate flex-1 text-left">
              {activeWorkspace?.name ?? "Select workspace"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          </button>

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

        {/* ── Search ── */}
        <div className="px-2 pt-2 pb-1">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 w-full rounded-lg text-[13px] transition-all text-slate-500 hover:text-slate-300 hover:bg-slate-800"
          >
            <Search className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="flex-1 text-left">Search</span>
            <div className="flex items-center gap-0.5 text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 font-medium">
              <span>⌘</span>
              <span>K</span>
            </div>
          </button>
        </div>

        {/* ── Project / Section hierarchy ── */}
        <div className="flex-1 overflow-y-auto scrollbar-hide py-1 px-2 space-y-0.5">
          {projects.length === 0 ? (
            <div className="px-3 py-6 text-center">
              <p className="text-[12px] text-slate-600">
                No projects joined. Browse spaces to find projects.
              </p>
            </div>
          ) : (
            projects.map((project) => {
              const isCollapsed = collapsedProjects.has(project.id);
              return (
                <div key={project.id} className="mb-1">
                  {/* Project header */}
                  <div className="flex items-center group">
                    <button
                      onClick={() => toggleProject(project.id)}
                      className="flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-slate-800/40 transition-colors text-left"
                    >
                      {isCollapsed ? (
                        <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-slate-600 flex-shrink-0" />
                      )}
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full flex-shrink-0",
                          colorMap[project.color] ?? "bg-slate-500",
                        )}
                      />
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 truncate group-hover:text-slate-300 transition-colors">
                        {project.name}
                      </span>
                    </button>
                    <button className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-600 hover:text-slate-400 hover:bg-slate-800 transition-all mr-1">
                      <MoreHorizontal className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Sections */}
                  {!isCollapsed && (
                    <div className="ml-1 mt-0.5 space-y-0.5">
                      {renderFoldersAndSections(project.id)}

                      {/* Add section */}
                      <button className="w-full flex items-center gap-1.5 px-3 py-[5px] text-[11px] text-slate-700 hover:text-slate-400 transition-colors rounded-md hover:bg-slate-800/30">
                        <Plus className="w-3 h-3" />
                        Add section
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-slate-800 px-2 py-2 space-y-0.5">
          {/* Connectors */}
          <Link
            href="/connectors"
            className={cn(
              "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] transition-all",
              pathname.startsWith("/connectors")
                ? "text-slate-200 bg-slate-800"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800",
            )}
          >
            <Plug className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-medium">Connectors</span>
          </Link>

          {/* Divider */}
          <div className="h-px bg-slate-800 mx-1 my-1" />

          {/* Activity + Settings row */}
          <div className="flex items-center gap-1 px-1">
            {/* Activity bell */}
            <button
              onClick={() => setActivityOpen((v) => !v)}
              className={cn(
                "relative flex items-center justify-center w-7 h-7 rounded-lg transition-colors",
                activityOpen
                  ? "bg-slate-700 text-slate-200"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800",
              )}
              title="Activity"
            >
              <Bell className="w-3.5 h-3.5" />
              {hasUnread && (
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
              )}
            </button>

            {/* Settings */}
            <button
              onClick={() => router.push("/settings")}
              className={cn(
                "flex items-center justify-center w-7 h-7 rounded-lg transition-colors",
                pathname === "/settings"
                  ? "bg-slate-700 text-slate-200"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800",
              )}
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Account avatar */}
            <button
              onClick={() => router.push("/settings")}
              className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white hover:bg-indigo-500 transition-colors flex-shrink-0"
              title="Account"
            >
              K
            </button>
          </div>
        </div>
      </div>

      {/* Search modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Space browser */}
      {showBrowser && <ProjectBrowser onClose={() => setShowBrowser(false)} />}

      {/* Activity panel */}
      <ActivityPanel
        isOpen={activityOpen}
        onClose={() => setActivityOpen(false)}
      />
    </>
  );
}
