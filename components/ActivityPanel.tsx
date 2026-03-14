"use client";

import { useRouter } from "next/navigation";
import { X, Bell, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_ACTIVITY, type ActivityItem } from "@/lib/mock-data/activity";

interface ActivityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const severityConfig = {
  critical: {
    dot: "bg-red-500",
    icon: AlertTriangle,
    iconColor: "text-red-400",
    badge: "bg-red-500/10 text-red-400 border border-red-500/20",
    label: "Critical",
  },
  warning: {
    dot: "bg-amber-500",
    icon: AlertTriangle,
    iconColor: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    label: "Warning",
  },
  info: {
    dot: "bg-indigo-500",
    icon: Info,
    iconColor: "text-indigo-400",
    badge: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    label: "Info",
  },
};

export default function ActivityPanel({ isOpen, onClose }: ActivityPanelProps) {
  const router = useRouter();
  const unreadCount = MOCK_ACTIVITY.filter((a) => !a.read).length;

  const handleItemClick = (item: ActivityItem) => {
    router.push(`/section/${item.sectionId}/overview`);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 z-30" onClick={onClose} />}

      {/* Panel */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 z-40 w-80 bg-slate-900 border-r border-slate-800 flex flex-col",
          "transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-slate-400" />
            <span className="text-[14px] font-semibold text-slate-100">
              Activity
            </span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {MOCK_ACTIVITY.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <Bell className="w-8 h-8 text-slate-700" />
              <p className="text-[13px] text-slate-600">No activity yet</p>
            </div>
          ) : (
            <div className="py-2">
              {MOCK_ACTIVITY.map((item) => {
                const cfg = severityConfig[item.severity];
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "w-full text-left px-4 py-3 hover:bg-slate-800/60 transition-colors group",
                      !item.read && "bg-slate-800/30",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Severity dot */}
                      <div className="flex-shrink-0 pt-1">
                        <div className={cn("w-2 h-2 rounded-full", cfg.dot)} />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Message */}
                        <p className="text-[13px] text-slate-200 leading-snug mb-1.5 group-hover:text-white transition-colors">
                          {item.message}
                        </p>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-[11px] text-slate-500">
                            {item.workspaceName}
                          </span>
                          <span className="text-[11px] text-slate-700">›</span>
                          <span className="text-[11px] text-slate-500">
                            {item.projectName}
                          </span>
                          <span className="text-[11px] text-slate-700">›</span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            #{item.sectionName}
                          </span>
                        </div>

                        {/* Timestamp + severity */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-slate-600">
                            {item.timestamp}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-medium px-1.5 py-px rounded-sm",
                              cfg.badge,
                            )}
                          >
                            {cfg.label}
                          </span>
                          {!item.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 ml-auto flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 px-4 py-2.5">
          <p className="text-[11px] text-slate-600 text-center">
            Showing alerts from all workspaces
          </p>
        </div>
      </div>
    </>
  );
}
