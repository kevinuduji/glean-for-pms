"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  FlaskConical,
  Plug,
  Settings,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  GitMerge,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/agent", label: "Agent", icon: Sparkles },
  { href: "/experiments", label: "Experiments", icon: FlaskConical },
  { href: "/product-history", label: "Product History", icon: GitMerge },
  { href: "/discover", label: "Discover", icon: Search },
];

const bottomNavItems = [
  { href: "/connectors", label: "Connectors", icon: Plug },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "h-full bg-slate-900 flex flex-col border-r border-slate-800 flex-shrink-0 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "xl:w-56 lg:w-52 w-52",
      )}
    >
      {/* Sidebar Toggle */}
      <div
        className={cn(
          "px-4 pt-4 pb-2 flex items-center",
          isCollapsed ? "justify-center" : "justify-end",
        )}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav items - Scrollable */}
      <nav
        className={cn(
          "flex-1 px-2 space-y-0.5 overflow-y-auto scrollbar-hide",
          isCollapsed && "space-y-2",
        )}
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
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
              <Icon
                className={cn(
                  "flex-shrink-0",
                  isCollapsed ? "w-5 h-5" : "w-4 h-4",
                )}
              />
              {!isCollapsed && <span className="text-nowrap">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div
        className={cn("h-px bg-slate-800 mx-3 mb-2", isCollapsed && "mx-2")}
      />

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
              <Icon
                className={cn(
                  "flex-shrink-0",
                  isCollapsed ? "w-5 h-5" : "w-4 h-4",
                )}
              />
              {!isCollapsed && <span className="text-nowrap">{label}</span>}
            </Link>
          );
        })}
      </div>

      {/* User info */}
      <div className="px-3 py-2.5 border-t border-slate-800 min-h-[57px]">
        <div
          className={cn(
            "flex items-center gap-2.5",
            isCollapsed && "justify-center",
          )}
        >
          <div
            className={cn(
              "rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0",
              isCollapsed ? "w-9 h-9" : "w-7 h-7",
            )}
          >
            <span
              className={cn(
                "text-white font-semibold",
                isCollapsed ? "text-sm" : "text-xs",
              )}
            >
              K
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 text-[11px] font-medium truncate">
                Kevin
              </p>
              <p className="text-slate-500 text-[10px] truncate">Pro Plan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
