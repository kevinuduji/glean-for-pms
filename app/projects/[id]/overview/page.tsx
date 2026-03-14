"use client";

import { cn } from "@/lib/utils";
import { useWorkspaceProjectStore } from "@/lib/workspace-project-store";
import { SEED_WORKSPACE_PROJECTS } from "@/lib/mock-data/workspace-projects";
import {
  Users,
  Calendar,
  Globe,
  Lock,
  MessageSquare,
  FlaskConical,
  UserPlus,
  FileEdit,
  Compass,
  Settings,
} from "lucide-react";

const colorBgMap: Record<string, string> = {
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

const colorTextMap: Record<string, string> = {
  emerald: "text-emerald-400",
  violet: "text-violet-400",
  rose: "text-rose-400",
  amber: "text-amber-400",
  indigo: "text-indigo-400",
  sky: "text-sky-400",
  orange: "text-orange-400",
  teal: "text-teal-400",
  slate: "text-slate-400",
};

type ActivityItem = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  message: string;
  time: string;
};

function getActivityItems(projectName: string): ActivityItem[] {
  return [
    {
      id: "1",
      icon: UserPlus,
      iconColor: "text-emerald-400",
      message: `Sarah Chen joined ${projectName}`,
      time: "2 hours ago",
    },
    {
      id: "2",
      icon: FlaskConical,
      iconColor: "text-indigo-400",
      message: "New experiment idea added: A/B test for onboarding flow",
      time: "5 hours ago",
    },
    {
      id: "3",
      icon: MessageSquare,
      iconColor: "text-violet-400",
      message: "3 new messages in the project chat",
      time: "Yesterday at 4:12 PM",
    },
    {
      id: "4",
      icon: FileEdit,
      iconColor: "text-amber-400",
      message: "Project description updated",
      time: "2 days ago",
    },
  ];
}

interface ProjectOverviewPageProps {
  params: { id: string };
}

export default function ProjectOverviewPage({ params }: ProjectOverviewPageProps) {
  const { userProjects } = useWorkspaceProjectStore();

  const project =
    SEED_WORKSPACE_PROJECTS.find((p) => p.id === params.id) ??
    userProjects.find((p) => p.id === params.id);

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950">
        <p className="text-slate-500 text-sm">Project not found.</p>
      </div>
    );
  }

  const activityItems = getActivityItems(project.name);
  const createdDate = new Date(project.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="h-full overflow-y-auto bg-slate-950">
      <div className="max-w-3xl mx-auto px-8 py-8 space-y-6">
        {/* Project hero */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0",
                colorBgMap[project.color] ?? "bg-slate-600"
              )}
            >
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-slate-100 mb-1">
                {project.name}
              </h1>
              {project.description ? (
                <p className="text-sm text-slate-400 leading-relaxed">
                  {project.description}
                </p>
              ) : (
                <p className="text-sm text-slate-600 italic">
                  No description set.
                </p>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-5 pt-5 border-t border-slate-800 grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-slate-500" />
              <div>
                <div className="text-sm font-semibold text-slate-200">
                  {project.memberCount ?? 1}
                </div>
                <div className="text-[11px] text-slate-500">Members</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              <div>
                <div className="text-sm font-semibold text-slate-200">
                  {createdDate}
                </div>
                <div className="text-[11px] text-slate-500">Created</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              {project.isPublic ? (
                <Globe className="w-4 h-4 text-emerald-400" />
              ) : (
                <Lock className="w-4 h-4 text-rose-400" />
              )}
              <div>
                <div
                  className={cn(
                    "text-sm font-semibold",
                    project.isPublic ? "text-emerald-400" : "text-rose-400"
                  )}
                >
                  {project.isPublic ? "Public" : "Private"}
                </div>
                <div className="text-[11px] text-slate-500">Visibility</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: MessageSquare, label: "Chats", color: "text-violet-400", href: `/projects/${params.id}/chats` },
            { icon: FlaskConical, label: "Experiments", color: "text-indigo-400", href: `/projects/${params.id}/experiments` },
            { icon: Compass, label: "Discover", color: "text-emerald-400", href: `/projects/${params.id}/discover` },
          ].map(({ icon: Icon, label, color, href }) => (
            <a
              key={label}
              href={href}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-slate-700 hover:bg-slate-800/50 transition-all group"
            >
              <Icon className={cn("w-5 h-5", color)} />
              <span className="text-[13px] font-medium text-slate-300 group-hover:text-slate-200">
                {label}
              </span>
            </a>
          ))}
        </div>

        {/* Recent activity */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="px-5 py-4 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-slate-200">
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-slate-800">
            {activityItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-start gap-3 px-5 py-3.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className={cn("w-3.5 h-3.5", item.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">{item.message}</p>
                    <span className="text-[11px] text-slate-600">{item.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
