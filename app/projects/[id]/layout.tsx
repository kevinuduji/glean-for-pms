"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useWorkspaceProjectStore } from "@/lib/workspace-project-store";
import { SEED_WORKSPACE_PROJECTS } from "@/lib/mock-data/workspace-projects";
import { LayoutDashboard, MessageSquare, FlaskConical, Compass } from "lucide-react";

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

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "chats", label: "Chats", icon: MessageSquare },
  { id: "experiments", label: "Experiments", icon: FlaskConical },
  { id: "discover", label: "Discover", icon: Compass },
];

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const pathname = usePathname();
  const { userProjects, setActiveWorkspaceProject } = useWorkspaceProjectStore();

  const projectId = params.id;

  // Find project from seeds or user projects
  const project =
    SEED_WORKSPACE_PROJECTS.find((p) => p.id === projectId) ??
    userProjects.find((p) => p.id === projectId);

  // Set as active on mount
  useEffect(() => {
    if (project) {
      setActiveWorkspaceProject(projectId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Project header + tab bar */}
      <div className="border-b border-slate-800 bg-slate-900">
        {/* Project name row */}
        <div className="px-8 pt-5 pb-0">
          {project ? (
            <div className="flex items-center gap-2.5 mb-4">
              <span
                className={cn(
                  "w-2.5 h-2.5 rounded-full flex-shrink-0",
                  colorDotMap[project.color] ?? "bg-slate-400"
                )}
              />
              <span className="text-[15px] font-semibold text-slate-200">
                {project.name}
              </span>
              {!project.isPublic && (
                <span className="text-[10px] font-semibold text-rose-400 bg-rose-900/30 border border-rose-800/50 px-1.5 py-0.5 rounded-full">
                  Private
                </span>
              )}
            </div>
          ) : (
            <div className="h-6 w-32 bg-slate-800 rounded animate-pulse mb-4" />
          )}

          {/* Tabs */}
          <div className="flex items-center gap-1">
            {tabs.map(({ id, label, icon: Icon }) => {
              const href = `/projects/${projectId}/${id}`;
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={id}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-[13px] font-medium rounded-t-lg border-b-2 transition-all",
                    isActive
                      ? "text-indigo-400 border-indigo-500 bg-slate-800/50"
                      : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-800/30"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
