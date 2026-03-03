"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pin,
  Sparkles,
  X,
  TrendingUp,
  TrendingDown,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAgentStore } from "@/lib/store";
import ToolLogo, { Tool } from "@/components/ToolLogo";

type Metric = {
  id: string;
  title: string;
  value: string;
  delta: string;
  deltaPositive: boolean | null;
  badge?: string;
  badgeColor?: string;
  source: string;
  sourceTool: Tool;
  signal: string;
};

const METRIC_CATALOG: Metric[] = [
  {
    id: "checkout",
    title: "Checkout Completion Rate",
    value: "61%",
    delta: "-17% since Dec 1",
    deltaPositive: false,
    badge: "P0",
    badgeColor: "bg-red-100 text-red-700",
    source: "Amplitude",
    sourceTool: "amplitude",
    signal:
      "Dropped from 78% at 14:23 UTC Dec 1 — correlates with payments-service v2.4.1 deploy.",
  },
  {
    id: "payment-latency",
    title: "Payments P95 Latency",
    value: "8,100ms",
    delta: "+2,282% since Dec 1",
    deltaPositive: false,
    badge: "Critical",
    badgeColor: "bg-red-100 text-red-700",
    source: "Prometheus",
    sourceTool: "prometheus",
    signal:
      "Spiked from 340ms on Dec 1. Only payments-service affected — rollback recommended.",
  },
  {
    id: "dau",
    title: "Daily Active Users",
    value: "11,847",
    delta: "+3.2% vs last week",
    deltaPositive: true,
    source: "Amplitude",
    sourceTool: "amplitude",
    signal:
      "Up 3.2% week-over-week. Consistent with Sept growth trend, no anomalies.",
  },
  {
    id: "signup-funnel",
    title: "Signup Funnel Completion",
    value: "22.9%",
    delta: "-15.4% vs last month",
    deltaPositive: false,
    badge: "Drop",
    badgeColor: "bg-red-100 text-red-700",
    source: "Amplitude",
    sourceTool: "amplitude",
    signal:
      "Email verification dropped 34% in Nov vs 8% in Oct. Root cause: broken alias email support.",
  },
  {
    id: "validation-errors",
    title: "Validation Errors",
    value: "2,847",
    delta: "+9,400% since Nov 4",
    deltaPositive: false,
    badge: "Spike",
    badgeColor: "bg-red-100 text-red-700",
    source: "Sentry",
    sourceTool: "sentry",
    signal:
      "Spiked Nov 4 after email validation regex change in commit a3f92c.",
  },
  {
    id: "feature-adoption",
    title: "Feature Adoption: Advanced Filters",
    value: "31% MAU",
    delta: "+6% vs target",
    deltaPositive: true,
    source: "Amplitude",
    sourceTool: "amplitude",
    signal:
      "Exceeded 25% MAU target. Users with filters show 67% D30 retention vs 43% without — 24-point lift.",
  },
  {
    id: "homepage-conversion",
    title: "Homepage → Signup Conversion",
    value: "2.8%",
    delta: "-0.3% since Oct 14",
    deltaPositive: false,
    source: "Amplitude",
    sourceTool: "amplitude",
    signal:
      "Slight dip after homepage v2 launch Oct 14. Pricing section has 0 tracking events — coverage gap.",
  },
  {
    id: "active-experiments",
    title: "Active Experiments",
    value: "2 running",
    delta: "1 significant result",
    deltaPositive: true,
    source: "Amplitude",
    sourceTool: "amplitude",
    signal:
      "Homepage CTA sticky (72% confidence) and Billing comparison table (44% confidence) both active.",
  },
  {
    id: "api-error-rate",
    title: "API Global Error Rate",
    value: "0.42%",
    delta: "+0.05% spike",
    deltaPositive: false,
    source: "Datadog",
    sourceTool: "datadog",
    signal:
      "Slight elevation in /auth endpoints trace errors. Correlates with legacy provider maintenance.",
  },
  {
    id: "notion-backlog",
    title: "Strategic Dept Backlog",
    value: "14 items",
    delta: "+2 this week",
    deltaPositive: null,
    source: "Notion",
    sourceTool: "notion",
    signal:
      'High-priority roadmap items added to "Q2 Core" board. Need prioritization sync.',
  },
];

export default function InsightsPage() {
  const router = useRouter();
  const { setQuery } = useAgentStore();

  // Customization state
  const [activeMetricIds, setActiveMetricIds] = useState<string[]>([
    "checkout",
    "payment-latency",
    "dau",
    "signup-funnel",
    "validation-errors",
  ]);
  const [pinnedId, setPinnedId] = useState<string>("checkout");

  const activeMetrics = useMemo(() => {
    return activeMetricIds
      .map((id) => METRIC_CATALOG.find((m) => m.id === id))
      .filter((m): m is Metric => !!m);
  }, [activeMetricIds]);

  const pinned =
    activeMetrics.find((m) => m.id === pinnedId) ?? activeMetrics[0];
  const secondary = activeMetrics.filter((m) => m.id !== pinnedId);

  const goToAgent = (text: string) => {
    setQuery(text);
    router.push("/agent");
  };

  const removeMetric = (id: string) => {
    setActiveMetricIds((prev) => prev.filter((mid) => mid !== id));
    if (pinnedId === id) {
      const next = activeMetricIds.find((mid) => mid !== id);
      if (next) setPinnedId(next);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col mb-8 gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Insights</h1>
          <p className="text-slate-500 text-sm mt-1">
            Signals from your connected connectors. Pin your focus metric to
            monitor closely.
          </p>
        </div>

        {/* Omni-search / Command Palette */}
        <div className="relative group shadow-sm hover:shadow-md transition-shadow rounded-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Sparkles className="h-5 w-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Ask agent to analyze insights or validate a hypothesis... (Cmd+K)"
            className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder-slate-400"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                goToAgent(e.currentTarget.value.trim());
              }
            }}
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <div className="hidden sm:flex items-center gap-1.5 opacity-50">
              <kbd className="px-2 py-1 bg-slate-100 rounded text-[10px] font-mono font-bold text-slate-500">
                ⌘
              </kbd>
              <kbd className="px-2 py-1 bg-slate-100 rounded text-[10px] font-mono font-bold text-slate-500">
                K
              </kbd>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-3 space-y-4">
          {/* Pinned focus metric */}
          {pinned && (
            <motion.div
              key={pinned.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 relative group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-wide">
                    Focus
                  </span>
                </div>
                <div
                  className="flex items-center gap-2 group/link cursor-pointer"
                  title={`View in ${pinned.source}`}
                >
                  <ToolLogo tool={pinned.sourceTool} size="sm" />
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover/link:text-indigo-500 transition-colors opacity-0 group-hover:opacity-100" />
                </div>
              </div>

              <h2 className="text-base font-medium text-slate-700 mt-1">
                {pinned.title}
              </h2>
              <div className="flex items-baseline gap-4 mt-3">
                <p className="text-5xl font-bold text-slate-900 tracking-tight">
                  {pinned.value}
                </p>
                <div className="flex items-center gap-1.5 mb-1">
                  {pinned.deltaPositive === true && (
                    <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
                  )}
                  {pinned.deltaPositive === false && (
                    <TrendingDown className="w-4 h-4 text-red-500 flex-shrink-0" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      pinned.deltaPositive === true
                        ? "text-green-600"
                        : pinned.deltaPositive === false
                          ? "text-red-600"
                          : "text-slate-500",
                    )}
                  >
                    {pinned.delta}
                  </span>
                  {pinned.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-1 ${pinned.badgeColor}`}
                    >
                      {pinned.badge}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {pinned.signal}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-start mt-5 pt-5 border-t border-zinc-100">
                <button
                  onClick={() =>
                    goToAgent(
                      `Tell me more about ${pinned.title}: ${pinned.signal}`,
                    )
                  }
                  className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Ask agent about this metric
                </button>
              </div>
            </motion.div>
          )}

          {/* Secondary metrics — compact list */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden transition-all">
            <div className="divide-y divide-zinc-50">
              <AnimatePresence initial={false}>
                {secondary.map((m) => (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50/80 transition-colors group relative"
                  >
                    <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => removeMetric(m.id)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Remove metric"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setPinnedId(m.id)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 transition-all"
                        title="Set as focus metric"
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Title + signal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {m.title}
                        </p>
                        {m.badge && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${m.badgeColor} flex-shrink-0 leading-none`}
                          >
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {m.signal}
                      </p>
                    </div>

                    {/* Value + delta */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-900 leading-none">
                        {m.value}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1.5">
                        {m.deltaPositive === true && (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        )}
                        {m.deltaPositive === false && (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                        <span
                          className={cn(
                            "text-[11px] font-medium leading-none",
                            m.deltaPositive === true
                              ? "text-green-600"
                              : m.deltaPositive === false
                                ? "text-red-500"
                                : "text-slate-400",
                          )}
                        >
                          {m.delta}
                        </span>
                      </div>
                    </div>

                    {/* Source Tool Logo */}
                    <div className="ml-2 flex-shrink-0">
                      <ToolLogo tool={m.sourceTool} size="sm" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
