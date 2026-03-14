"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Hash,
  LayoutDashboard,
  MessageSquare,
  FlaskConical,
  Compass,
  Users,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSectionStore } from "@/lib/section-store";
import { useWorkspaceProjectStore } from "@/lib/workspace-project-store";
import { SEED_SECTIONS } from "@/lib/mock-data/sections";
import { SEED_WORKSPACE_PROJECTS } from "@/lib/mock-data/workspace-projects";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "experiments", label: "Experiments", icon: FlaskConical },
  { id: "discover", label: "Discover", icon: Compass },
];

export default function SectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const pathname = usePathname();
  const { setActiveSection, userSections } = useSectionStore();

  useEffect(() => {
    setActiveSection(params.id);
  }, [params.id, setActiveSection]);

  // Find section from seeds or user sections
  const section =
    SEED_SECTIONS.find((s) => s.id === params.id) ||
    userSections.find((s) => s.id === params.id);

  // Find parent workspace project
  const wsProject = SEED_WORKSPACE_PROJECTS.find(
    (p) => p.id === section?.projectId,
  );

  const sectionName = section?.name ?? params.id;

  return (
    <div className="flex flex-col h-full">
      {/* ── Top bar: # section-name ── */}
      <div className="flex-shrink-0 bg-slate-900 border-b border-slate-800">
        {/* Header row */}
        <div className="flex items-center justify-between px-5 h-12">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span className="text-[15px] font-semibold text-slate-100 leading-none">
              {sectionName}
            </span>
            {wsProject && (
              <>
                <span className="text-slate-700 text-[13px] mx-1">·</span>
                <span className="text-[12px] text-slate-500">
                  {wsProject.name}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            {wsProject?.memberCount && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-slate-500 text-[12px] font-medium">
                <Users className="w-3.5 h-3.5" />
                <span>{wsProject.memberCount}</span>
              </div>
            )}
            <button className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab bar row */}
        <div className="flex items-center px-3 gap-0.5">
          {TABS.map(({ id, label, icon: Icon }) => {
            const href = `/section/${params.id}/${id}`;
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={id}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium transition-all relative",
                  active
                    ? "text-indigo-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500 after:rounded-t-sm"
                    : "text-slate-500 hover:text-slate-300",
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
