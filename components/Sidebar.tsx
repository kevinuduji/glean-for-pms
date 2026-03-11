"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FlaskConical,
  Plug,
  Settings,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  SquarePen,
  MessageSquare,
  FolderPlus,
  Compass,
  ChevronRight,
  FolderOpen,
  Plus,
  Users,
  TrendingUp,
  Cpu,
  Palette,
  Shield,
  Rocket,
  Zap,
  Globe,
  Lock,
  Star,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import SearchModal from "./SearchModal";
import { useAgentStore } from "@/lib/store";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { useRouter } from "next/navigation";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import PlanBadge from "./PlanBadge";
import DebugRoleSwitcher from "./DebugRoleSwitcher";

const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp, Cpu, Palette, Shield, Rocket, Zap, Globe, Lock, Star, Users,
};

const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/agent", label: "New Chat", icon: SquarePen },
  { href: "/experiments", label: "Experiments", icon: FlaskConical },
  { href: "/discover", label: "Discover", icon: Compass },
];

const bottomNavItems = [
  { href: "/connectors", label: "Connectors", icon: Plug },
  { href: "/settings", label: "Settings", icon: Settings },
];

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const router = useRouter();

  const {
    getVisibleTeams,
    getVisibleFolders,
    setActiveTeam,
    setActiveFolder,
    activeTeamId,
    activeFolderId,
    getActivePlan,
  } = useWorkspaceStore();

  const { savedChats, loadChat, activeChatId, projects, resetAgent } = useAgentStore();

  const visibleTeams = getVisibleTeams();
  const activePlan = getActivePlan();

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

  const handleNewChat = (e: React.MouseEvent) => {
    e.preventDefault();
    resetAgent();
    if (pathname !== "/agent") {
      router.push("/agent");
    }
  };

  const toggleTeam = (teamId: string) => {
    setExpandedTeams((prev) => {
      const next = new Set(prev);
      if (next.has(teamId)) {
        next.delete(teamId);
      } else {
        next.add(teamId);
      }
      return next;
    });
  };

  return (
    <div
      className={cn(
        "h-full bg-slate-900 flex flex-col border-r border-slate-800 flex-shrink-0 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "xl:w-56 lg:w-52 w-52",
      )}
    >
      {/* Workspace Switcher or collapse toggle */}
      {!isCollapsed ? (
        <div className="flex items-start gap-1 pt-2 pr-2">
          <div className="flex-1 min-w-0">
            <WorkspaceSwitcher />
          </div>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 mt-3 mr-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors flex-shrink-0"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="px-4 pt-4 pb-2 flex items-center justify-center">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Search Button */}
      <div className={cn("px-2 pb-2 mt-1", isCollapsed && "flex justify-center mt-2")}>
        <button
          onClick={() => setIsSearchOpen(true)}
          className={cn(
            "flex items-center gap-3 px-3 py-1.5 w-full rounded-lg text-[13px] transition-all relative text-slate-400 hover:text-slate-200 hover:bg-slate-800",
            isCollapsed && "justify-center px-0 w-12 h-12 mx-auto",
          )}
          title={isCollapsed ? "Search (⌘K)" : ""}
        >
          <Search className={cn("flex-shrink-0", isCollapsed ? "w-5 h-5" : "w-4 h-4")} />
          {!isCollapsed && (
            <div className="flex items-center justify-between flex-1">
              <span className="text-nowrap font-medium">Search</span>
              <div className="flex items-center gap-1 text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 font-medium">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Nav items */}
      <nav className={cn("px-2 space-y-0.5", isCollapsed && "space-y-2")}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/agent" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={href === "/agent" ? handleNewChat : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] transition-all relative",
                isCollapsed && "justify-center px-0 w-12 h-12 mx-auto",
                active
                  ? "text-slate-200 bg-slate-800"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800",
              )}
              title={isCollapsed ? label : ""}
            >
              <Icon className={cn("flex-shrink-0", isCollapsed ? "w-5 h-5" : "w-4 h-4")} />
              {!isCollapsed && <span className="text-nowrap font-medium">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Teams Section */}
      {!isCollapsed && visibleTeams.length > 0 && (
        <div className="mt-4 border-t border-slate-800/50 pt-3">
          <div className="px-5 mb-1 flex items-center justify-between group">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Teams
            </span>
            <button
              onClick={() => router.push("/settings/workspace/teams?new=true")}
              className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100"
              title="Create team"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="px-2 space-y-0.5">
            {visibleTeams.map((team) => {
              const TeamIcon = ICON_MAP[team.icon] ?? Users;
              const isExpanded = expandedTeams.has(team.id);
              const isActiveTeam = activeTeamId === team.id;
              const teamFolders = getVisibleFolders(team.id);
              const dotColor = colorMap[team.color] ?? "bg-slate-500";

              return (
                <div key={team.id}>
                  <button
                    onClick={() => {
                      setActiveTeam(isActiveTeam ? null : team.id);
                      toggleTeam(team.id);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] transition-all",
                      isActiveTeam
                        ? "text-slate-200 bg-slate-800"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60",
                    )}
                  >
                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0", dotColor)} />
                    <TeamIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="flex-1 text-left text-nowrap font-medium truncate">
                      {team.name}
                    </span>
                    <ChevronRight
                      className={cn(
                        "w-3 h-3 text-slate-600 transition-transform duration-200",
                        isExpanded && "rotate-90",
                      )}
                    />
                  </button>

                  {/* Folders */}
                  {isExpanded && teamFolders.length > 0 && (
                    <div className="ml-6 mt-0.5 space-y-0.5 border-l border-slate-800 pl-2">
                      {teamFolders.map((folder) => {
                        const isActiveFolder = activeFolderId === folder.id;
                        return (
                          <button
                            key={folder.id}
                            onClick={() => setActiveFolder(isActiveFolder ? null : folder.id)}
                            className={cn(
                              "w-full flex items-center gap-2 px-2 py-1 rounded-md text-[12px] transition-all",
                              isActiveFolder
                                ? "text-slate-200 bg-slate-800"
                                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/40",
                            )}
                          >
                            <FolderOpen className="w-3 h-3 flex-shrink-0" />
                            <span className="text-nowrap truncate font-medium">{folder.name}</span>
                            {folder.visibility === "private" && (
                              <Lock className="w-2.5 h-2.5 text-slate-600 flex-shrink-0 ml-auto" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chat History Section - Scrollable */}
      {!isCollapsed && (
        <div className="flex-1 flex flex-col min-h-0 mt-3 border-t border-slate-800/50 pt-3">
          <div className="px-5 mb-2 flex items-center justify-between group">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              History
            </span>
            <button className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100">
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide px-2 space-y-0.5">
            {savedChats.length === 0 ? (
              <div className="px-3 py-8 text-center">
                <p className="text-[11px] text-slate-600 font-medium">No chats yet</p>
              </div>
            ) : (
              savedChats.map((chat) => {
                const project = projects.find((p) => p.id === chat.projectId);
                return (
                  <button
                    key={chat.id}
                    onClick={() => {
                      loadChat(chat.id);
                      if (pathname !== "/agent") router.push("/agent");
                    }}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all text-left relative group",
                      activeChatId === chat.id
                        ? "text-slate-200 bg-slate-800 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                    )}
                  >
                    <MessageSquare
                      className={cn(
                        "w-3.5 h-3.5 flex-shrink-0",
                        activeChatId === chat.id
                          ? "text-indigo-400"
                          : "text-slate-500 group-hover:text-slate-300",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{chat.title}</p>
                      {project && (
                        <p
                          className={cn(
                            "text-[9px] font-bold uppercase tracking-wider opacity-60",
                            project.color === "indigo" ? "text-indigo-400"
                            : project.color === "emerald" ? "text-emerald-400"
                            : project.color === "amber" ? "text-amber-400"
                            : project.color === "rose" ? "text-rose-400"
                            : "text-slate-400",
                          )}
                        >
                          {project.name}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {isCollapsed && <div className="flex-1" />}

      {/* Debug Role Switcher (dev tools) */}
      {!isCollapsed && <DebugRoleSwitcher />}

      <div className={cn("h-px bg-slate-800 mx-3 mb-2", isCollapsed && "mx-2")} />

      {/* Bottom items */}
      <div className={cn("px-2 pb-2 space-y-0.5", isCollapsed && "space-y-2")}>
        {bottomNavItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] transition-all relative",
                isCollapsed && "justify-center px-0 w-12 h-12 mx-auto",
                active
                  ? "text-slate-200 bg-slate-800"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800",
              )}
              title={isCollapsed ? label : ""}
            >
              <Icon className={cn("flex-shrink-0", isCollapsed ? "w-5 h-5" : "w-4 h-4")} />
              {!isCollapsed && <span className="text-nowrap">{label}</span>}
            </Link>
          );
        })}
      </div>

      {/* User info */}
      <div className="px-3 py-2.5 border-t border-slate-800 min-h-[57px]">
        <Link
          href="/settings"
          className={cn("flex items-center gap-2.5 hover:opacity-80 transition-opacity", isCollapsed && "justify-center")}
        >
          <div
            className={cn(
              "rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0",
              isCollapsed ? "w-9 h-9" : "w-7 h-7",
            )}
          >
            <span className={cn("text-white font-semibold", isCollapsed ? "text-sm" : "text-xs")}>
              K
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 text-[11px] font-medium truncate">Kevin</p>
              <PlanBadge plan={activePlan} />
            </div>
          )}
        </Link>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
