"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface InsightCardProps {
  title: string;
  description: string;
  priority?: "critical" | "high" | "medium" | "low";
  source?: string;
  timestamp?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const priorityConfig = {
  critical: {
    badge: "bg-red-100 text-red-700 border-red-200",
    border: "border-l-4 border-l-red-400",
    dot: "bg-red-400",
  },
  high: {
    badge: "bg-amber-100 text-amber-700 border-amber-200", 
    border: "border-l-4 border-l-amber-400",
    dot: "bg-amber-400",
  },
  medium: {
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    border: "border-l-4 border-l-blue-400", 
    dot: "bg-blue-400",
  },
  low: {
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    border: "",
    dot: "bg-slate-400",
  },
};

export function InsightCard({
  title,
  description,
  priority = "medium",
  source,
  timestamp,
  icon: Icon,
  actions,
  onClick,
  className,
  children,
}: InsightCardProps) {
  const config = priorityConfig[priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={cn(
        "bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200",
        config.border,
        onClick && "cursor-pointer",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-indigo-600" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 text-sm leading-snug">
              {title}
            </h3>
            {source && (
              <p className="text-xs text-slate-500 mt-0.5">{source}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {priority !== "low" && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border",
                config.badge,
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
              {priority}
            </span>
          )}
          {timestamp && (
            <span className="text-xs text-slate-400">{timestamp}</span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 leading-relaxed mb-3">
        {description}
      </p>

      {/* Children content */}
      {children && <div className="mb-3">{children}</div>}

      {/* Actions */}
      {actions && (
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          {actions}
        </div>
      )}
    </motion.div>
  );
}

export function InsightCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-slate-200 rounded-lg" />
        <div className="flex-1">
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-1" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
        <div className="w-16 h-5 bg-slate-100 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-3 bg-slate-200 rounded w-5/6" />
      </div>
      <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
        <div className="h-7 bg-slate-100 rounded w-20" />
        <div className="h-7 bg-slate-100 rounded w-24" />
      </div>
    </div>
  );
}