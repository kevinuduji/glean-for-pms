"use client";

import {
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Eye,
  MousePointer,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSectionStore } from "@/lib/section-store";
import { SEED_WORKSPACE_PROJECTS } from "@/lib/mock-data/workspace-projects";

// Mock per-section stats (keyed by sectionId)
const SECTION_STATS: Record<
  string,
  {
    label: string;
    value: string;
    delta: string;
    trend: "up" | "down" | "flat";
    icon: React.ElementType;
  }[]
> = {
  "s-fi-duration": [
    {
      label: "Duration Gap",
      value: "4.2 yrs",
      delta: "+18%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      label: "DV01",
      value: "$142K",
      delta: "-3.1%",
      trend: "down",
      icon: Activity,
    },
    {
      label: "Hedging Ratio",
      value: "87%",
      delta: "0%",
      trend: "flat",
      icon: Minus,
    },
  ],
  "s-cd-onboarding": [
    {
      label: "Completion Rate",
      value: "61%",
      delta: "-9pts",
      trend: "down",
      icon: TrendingDown,
    },
    {
      label: "Avg Time",
      value: "3m 12s",
      delta: "+1.1%",
      trend: "up",
      icon: Clock,
    },
    {
      label: "Drop-off Step",
      value: "Step 4",
      delta: "",
      trend: "flat",
      icon: Activity,
    },
  ],
  "s-bt-mrr": [
    {
      label: "MRR",
      value: "$1.04M",
      delta: "+6.2%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      label: "Churn Rate",
      value: "1.8%",
      delta: "-0.3pts",
      trend: "down",
      icon: TrendingDown,
    },
    {
      label: "New Customers",
      value: "84",
      delta: "+12%",
      trend: "up",
      icon: TrendingUp,
    },
  ],
};

const DEFAULT_STATS = [
  {
    label: "Views",
    value: "2,840",
    delta: "+4.2%",
    trend: "up" as const,
    icon: Eye,
  },
  {
    label: "Avg Session",
    value: "3m 12s",
    delta: "+1.1%",
    trend: "up" as const,
    icon: Clock,
  },
  {
    label: "Bounce Rate",
    value: "38%",
    delta: "-2.3%",
    trend: "down" as const,
    icon: MousePointer,
  },
];

const RECENT_ACTIVITY = [
  {
    label: "Experiment 'CTA Variant B' completed with 94% confidence",
    time: "2h ago",
    type: "experiment",
  },
  {
    label: "New chat session started in this section",
    time: "4h ago",
    type: "chat",
  },
  {
    label: "Metric threshold crossed: Bounce Rate > 40%",
    time: "1d ago",
    type: "alert",
  },
  {
    label: "Section created and connected to Amplitude",
    time: "3d ago",
    type: "setup",
  },
];

export default function SectionOverviewPage({
  params,
}: {
  params: { id: string };
}) {
  const { getActiveSection } = useSectionStore();
  const section = getActiveSection();
  const wsProject = SEED_WORKSPACE_PROJECTS.find(
    (p) => p.id === section?.projectId,
  );

  const stats = SECTION_STATS[params.id] ?? DEFAULT_STATS;

  return (
    <div className="bg-slate-950 h-full overflow-y-auto">
      <div className="px-8 py-8 max-w-4xl mx-auto">
        {/* Section intro */}
        <div className="mb-8">
          <h1 className="text-[22px] font-bold text-slate-100 mb-1">
            {section?.name ?? "Section"}
          </h1>
          <p className="text-[14px] text-slate-500">
            {section?.description
              ? section.description
              : wsProject
                ? `A section of ${wsProject.name}`
                : "Metrics and insights for this section"}
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isUp = stat.trend === "up";
            const isDown = stat.trend === "down";
            return (
              <div
                key={stat.label}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] text-slate-500 font-medium uppercase tracking-wide">
                    {stat.label}
                  </span>
                  <Icon className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-[26px] font-bold text-slate-100 leading-none">
                    {stat.value}
                  </span>
                  {stat.delta && (
                    <span
                      className={cn(
                        "text-[12px] font-semibold mb-0.5",
                        isUp
                          ? "text-emerald-400"
                          : isDown
                            ? "text-red-400"
                            : "text-slate-500",
                      )}
                    >
                      {stat.delta}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800">
            <h2 className="text-[14px] font-semibold text-slate-200">
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-slate-800/60">
            {RECENT_ACTIVITY.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full flex-shrink-0",
                      item.type === "alert"
                        ? "bg-amber-500"
                        : item.type === "experiment"
                          ? "bg-indigo-500"
                          : item.type === "chat"
                            ? "bg-emerald-500"
                            : "bg-slate-600",
                    )}
                  />
                  <span className="text-[13px] text-slate-300">
                    {item.label}
                  </span>
                </div>
                <span className="text-[11px] text-slate-600 flex-shrink-0 ml-4">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
