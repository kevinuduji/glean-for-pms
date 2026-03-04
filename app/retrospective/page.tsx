"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitMerge,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Share2,
  Download,
  Sparkles,
  Minus,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";
import {
  retroFeatures,
  RetroFeature,
  MetricRow,
  ThreadItem,
  Verdict,
} from "@/lib/mock-data/retrospective";
import ToolLogo from "@/components/ToolLogo";
import { cn } from "@/lib/utils";

// ─── Verdict config ───────────────────────────────────────────────────────────

const verdictConfig = {
  met: {
    icon: "✅",
    label: "Goal Met",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
    chipBg: "bg-green-100",
    chipText: "text-green-700",
    pillBg: "bg-green-50",
    pillText: "text-green-700",
    pillBorder: "border-green-200",
    pillActiveBg: "bg-green-600",
    pillActiveText: "text-white",
  },
  partial: {
    icon: "⚠️",
    label: "Partially Met",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    chipBg: "bg-amber-100",
    chipText: "text-amber-700",
    pillBg: "bg-amber-50",
    pillText: "text-amber-700",
    pillBorder: "border-amber-200",
    pillActiveBg: "bg-amber-500",
    pillActiveText: "text-white",
  },
  missed: {
    icon: "❌",
    label: "Goal Missed",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    chipBg: "bg-red-100",
    chipText: "text-red-700",
    pillBg: "bg-red-50",
    pillText: "text-red-700",
    pillBorder: "border-red-200",
    pillActiveBg: "bg-red-600",
    pillActiveText: "text-white",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatGeneratedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseShipDate(dateStr: string): number {
  return new Date(dateStr).getTime() || 0;
}

// ─── Stat Chips ───────────────────────────────────────────────────────────────

function StatChips({
  features,
  activeVerdict,
}: {
  features: RetroFeature[];
  activeVerdict: "all" | Verdict;
}) {
  const total = features.length;
  const met = features.filter((f) => f.verdict === "met").length;
  const partial = features.filter((f) => f.verdict === "partial").length;
  const missed = features.filter((f) => f.verdict === "missed").length;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span
        className={cn(
          "text-[11px] font-medium px-2 py-0.5 rounded-full border",
          activeVerdict === "all"
            ? "bg-slate-800 text-white border-slate-800"
            : "bg-slate-100 text-slate-500 border-slate-200",
        )}
      >
        {total} total
      </span>
      <span
        className={cn(
          "text-[11px] font-medium px-2 py-0.5 rounded-full border",
          activeVerdict === "met"
            ? "bg-green-600 text-white border-green-600"
            : "bg-green-50 text-green-700 border-green-200",
        )}
      >
        ✅ {met} met
      </span>
      <span
        className={cn(
          "text-[11px] font-medium px-2 py-0.5 rounded-full border",
          activeVerdict === "partial"
            ? "bg-amber-500 text-white border-amber-500"
            : "bg-amber-50 text-amber-700 border-amber-200",
        )}
      >
        ⚠️ {partial} partial
      </span>
      <span
        className={cn(
          "text-[11px] font-medium px-2 py-0.5 rounded-full border",
          activeVerdict === "missed"
            ? "bg-red-600 text-white border-red-600"
            : "bg-red-50 text-red-700 border-red-200",
        )}
      >
        ❌ {missed} missed
      </span>
    </div>
  );
}

// ─── Search Input ─────────────────────────────────────────────────────────────

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search features, teams, tickets…"
        className="w-full bg-slate-100 text-xs text-slate-700 placeholder-slate-400 rounded-lg pl-8 pr-7 py-2 outline-none focus:ring-1 focus:ring-indigo-300 focus:bg-white transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

// ─── Verdict Pills ────────────────────────────────────────────────────────────

function VerdictPills({
  value,
  onChange,
}: {
  value: "all" | Verdict;
  onChange: (v: "all" | Verdict) => void;
}) {
  const options: { key: "all" | Verdict; label: string }[] = [
    { key: "all", label: "All" },
    { key: "met", label: "✅ Met" },
    { key: "partial", label: "⚠️ Partial" },
    { key: "missed", label: "❌ Missed" },
  ];

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {options.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            "text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all",
            value === key
              ? key === "all"
                ? "bg-slate-800 text-white border-slate-800"
                : key === "met"
                  ? "bg-green-600 text-white border-green-600"
                  : key === "partial"
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-red-600 text-white border-red-600"
              : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({
  feature,
  isSelected,
  onClick,
}: {
  feature: RetroFeature;
  isSelected: boolean;
  onClick: () => void;
}) {
  const vc = verdictConfig[feature.verdict];
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border p-4 transition-all duration-150 cursor-pointer",
        isSelected
          ? "border-indigo-400 bg-indigo-50/50 ring-1 ring-indigo-200 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md",
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-semibold text-slate-900 leading-snug">
          {feature.name}
        </p>
        <span
          className={cn(
            "flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap",
            vc.chipBg,
            vc.chipText,
          )}
        >
          {vc.icon} {vc.label}
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-2">
        {feature.owningTeam} · {feature.shipDateRelative}
      </p>
      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
        {feature.originalGoal}
      </p>
      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
          {feature.jiraTicket}
        </span>
        <span className="text-[10px] font-mono bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded">
          {feature.version}
        </span>
        <span className="text-[10px] bg-slate-50 text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">
          {feature.quarter}
        </span>
        <span className="text-[10px] text-slate-400 ml-auto">
          {feature.shipDate}
        </span>
      </div>
    </button>
  );
}

// ─── Report Skeleton ──────────────────────────────────────────────────────────

function ReportSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-16 bg-slate-100 rounded-2xl" />
      <div className="space-y-2">
        <div className="h-3 w-28 bg-slate-100 rounded" />
        <div className="h-10 bg-slate-100 rounded-xl" />
        <div className="h-10 bg-slate-100 rounded-xl" />
        <div className="h-10 bg-slate-100 rounded-xl" />
        <div className="h-10 bg-slate-100 rounded-xl" />
      </div>
      <div className="space-y-3">
        <div className="h-3 w-40 bg-slate-100 rounded" />
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-100 rounded w-5/6" />
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-100 rounded w-4/6" />
      </div>
      <div className="space-y-4">
        <div className="h-3 w-48 bg-slate-100 rounded" />
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-100 rounded w-28" />
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-28 bg-slate-100 rounded-2xl" />
      <div className="h-20 bg-indigo-50 rounded-2xl" />
    </div>
  );
}

// ─── Metrics Table ────────────────────────────────────────────────────────────

function MetricsTable({ metrics }: { metrics: MetricRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Metric
            </th>
            <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Before
            </th>
            <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              After
            </th>
            <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Change
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {metrics.map((m, i) => (
            <tr key={i} className={cn(m.isPrimary && "bg-slate-50/70")}>
              <td
                className={cn(
                  "px-4 py-3 text-slate-700",
                  m.isPrimary && "font-semibold text-slate-900",
                )}
              >
                {m.label}
                {m.isPrimary && (
                  <span className="ml-2 text-xs font-normal text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">
                    primary
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right text-slate-500 tabular-nums">
                {m.before}
              </td>
              <td
                className={cn(
                  "px-4 py-3 text-right tabular-nums font-medium",
                  m.isPrimary ? "text-slate-900" : "text-slate-700",
                )}
              >
                {m.after}
              </td>
              <td className="px-4 py-3 text-right">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-semibold",
                    m.delta === "—"
                      ? "text-slate-400"
                      : m.deltaPositive
                        ? "text-green-600"
                        : "text-red-500",
                  )}
                >
                  {m.delta === "—" ? (
                    <Minus className="w-3 h-3" />
                  ) : m.deltaPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {m.delta}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Thread Item ──────────────────────────────────────────────────────────────

function ThreadCard({ item }: { item: ThreadItem }) {
  return (
    <div className="flex gap-3">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold",
          item.avatarColor,
        )}
      >
        {item.avatarInitial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-xs font-semibold text-slate-800">
            {item.author}
          </span>
          <ToolLogo tool={item.source} size="sm" />
          <span className="text-xs text-slate-400">{item.timestamp}</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
        {item.reactions && item.reactions.length > 0 && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {item.reactions.map((r, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 transition-colors px-2 py-0.5 rounded-full text-slate-600 cursor-default"
              >
                {r.emoji} {r.count}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section Heading ──────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
      {children}
    </h3>
  );
}

// ─── Retro Report ─────────────────────────────────────────────────────────────

function RetroReport({ feature }: { feature: RetroFeature }) {
  const vc = verdictConfig[feature.verdict];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="text-xs text-slate-400">
            {feature.owningTeam} · {feature.jiraTicket} · Shipped{" "}
            {feature.shipDate}
          </p>
          <span className="text-[10px] font-mono bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded">
            {feature.version}
          </span>
          <span className="text-[10px] bg-slate-50 text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">
            {feature.quarter}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{feature.name}</h2>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          {feature.originalGoal}
        </p>
      </div>

      {/* 1. Verdict Banner */}
      <div
        className={cn(
          "flex items-start gap-4 p-4 rounded-2xl border",
          vc.bg,
          vc.border,
        )}
      >
        <span className="text-2xl leading-none mt-0.5">{vc.icon}</span>
        <div>
          <span
            className={cn(
              "inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1",
              vc.chipBg,
              vc.chipText,
            )}
          >
            {vc.label}
          </span>
          <p className={cn("text-sm font-medium leading-relaxed", vc.text)}>
            {feature.verdictSummary}
          </p>
        </div>
      </div>

      {/* 2. Metrics Comparison */}
      <div>
        <SectionHeading>Metrics Comparison</SectionHeading>
        <MetricsTable metrics={feature.metrics} />
      </div>

      {/* 3. What the Data Says */}
      <div>
        <SectionHeading>What the Data Says</SectionHeading>
        <ul className="space-y-3">
          {feature.narrativeBullets.map((bullet, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-2" />
              <p className="text-sm text-slate-700 leading-relaxed">{bullet}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. What Was Decided and Why */}
      <div>
        <SectionHeading>What Was Decided and Why</SectionHeading>
        <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
          {feature.thread.map((item, i) => (
            <div key={i}>
              {i > 0 && <div className="h-px bg-slate-200 my-4" />}
              <ThreadCard item={item} />
            </div>
          ))}
        </div>
      </div>

      {/* 5. Lessons for Next Time */}
      <div>
        <SectionHeading>Lessons for Next Time</SectionHeading>
        <div className="space-y-3">
          {feature.lessons.map((lesson, i) => (
            <div
              key={i}
              className="flex gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200"
            >
              <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700 leading-relaxed">{lesson}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Feeds Into Prioritization */}
      <div>
        <SectionHeading>Feeds into Prioritization</SectionHeading>
        <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/60 flex items-start gap-3">
          <GitMerge className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-indigo-800 mb-1">
              {feature.roadmapInitiative} · {feature.roadmapEpic}
            </p>
            <p className="text-xs text-indigo-700 leading-relaxed">
              {feature.roadmapConnection}
            </p>
            <p className="text-xs text-indigo-400 mt-2">
              This finding is influencing{" "}
              <span className="font-semibold text-indigo-600">
                {feature.roadmapInfluenceCount} active recommendations
              </span>{" "}
              in your Insights feed.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-xs text-slate-400">
          Generated by Probe AI · {formatGeneratedAt(feature.generatedAt)}
        </p>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Share2 className="w-3.5 h-3.5" />
            Share Retro
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

// ─── No Results State ─────────────────────────────────────────────────────────

function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
        <SlidersHorizontal className="w-5 h-5 text-slate-400" />
      </div>
      <p className="text-sm font-semibold text-slate-700 mb-1">
        No features match
      </p>
      <p className="text-xs text-slate-400 mb-3">
        Try adjusting your filters or search term.
      </p>
      <button
        onClick={onClear}
        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RetrospectivePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [verdictFilter, setVerdictFilter] = useState<"all" | Verdict>("all");
  const [teamFilter, setTeamFilter] = useState("All");
  const [sortBy, setSortBy] = useState<
    "date-desc" | "date-asc" | "name" | "verdict"
  >("date-desc");

  const teams = useMemo(() => {
    const t = Array.from(
      new Set(retroFeatures.map((f) => f.owningTeam)),
    ).sort();
    return ["All", ...t];
  }, []);

  const filteredAndSorted = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let result = retroFeatures.filter((f) => {
      if (verdictFilter !== "all" && f.verdict !== verdictFilter) return false;
      if (teamFilter !== "All" && f.owningTeam !== teamFilter) return false;
      if (q) {
        const haystack = [
          f.name,
          f.owningTeam,
          f.jiraTicket,
          f.originalGoal,
          f.quarter,
          f.version,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "date-desc") {
        return parseShipDate(b.shipDate) - parseShipDate(a.shipDate);
      }
      if (sortBy === "date-asc") {
        return parseShipDate(a.shipDate) - parseShipDate(b.shipDate);
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "verdict") {
        const order = { met: 0, partial: 1, missed: 2 };
        return order[a.verdict] - order[b.verdict];
      }
      return 0;
    });

    return result;
  }, [searchQuery, verdictFilter, teamFilter, sortBy]);

  const selectedFeature =
    retroFeatures.find((f) => f.id === selectedId) ?? null;

  const hasActiveFilters =
    searchQuery !== "" || verdictFilter !== "all" || teamFilter !== "All";

  const clearAllFilters = () => {
    setSearchQuery("");
    setVerdictFilter("all");
    setTeamFilter("All");
  };

  const handleSelect = (id: string) => {
    if (id === selectedId) return;
    setSelectedId(id);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1400);
  };

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      {/* Left panel — Feature selector */}
      <div
        className={cn(
          "flex-shrink-0 border-slate-200 bg-white overflow-y-auto flex flex-col transition-all duration-500 ease-in-out z-10",
          selectedFeature
            ? "w-full md:w-80 border-b md:border-b-0 md:border-r"
            : "w-full",
        )}
      >
        {/* Header + controls — sticky */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 pt-5 pb-4 space-y-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Retrospective</h1>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Review shipped features and their measured outcomes.
            </p>
          </div>

          {/* Stat chips */}
          <StatChips features={retroFeatures} activeVerdict={verdictFilter} />

          {/* Search */}
          <SearchInput value={searchQuery} onChange={setSearchQuery} />

          {/* Verdict filter pills */}
          <VerdictPills value={verdictFilter} onChange={setVerdictFilter} />

          {/* Team + Sort row */}
          <div className="flex items-center gap-2">
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="flex-1 min-w-0 text-xs bg-white border border-slate-200 text-slate-600 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-indigo-300 cursor-pointer"
            >
              {teams.map((t) => (
                <option key={t} value={t}>
                  {t === "All" ? "All teams" : t}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="flex-1 min-w-0 text-xs bg-white border border-slate-200 text-slate-600 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-indigo-300 cursor-pointer"
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="name">A → Z</option>
              <option value="verdict">By verdict</option>
            </select>
          </div>

          {/* Results count + clear */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {filteredAndSorted.length}{" "}
                {filteredAndSorted.length === 1 ? "result" : "results"}
              </span>
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                id="clear-filters-btn"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Feature list */}
        <div
          className={cn(
            "flex-1 p-4 transition-all duration-300",
            selectedFeature
              ? "space-y-3"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
          )}
        >
          {filteredAndSorted.length === 0 ? (
            <NoResults onClear={clearAllFilters} />
          ) : (
            filteredAndSorted.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                isSelected={selectedId === feature.id}
                onClick={() => handleSelect(feature.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Right panel — Report */}
      {selectedFeature && (
        <div className="flex-1 overflow-y-auto bg-slate-50 relative scroll-smooth">
          <div className="sticky top-0 z-30 flex justify-end p-6 pointer-events-none">
            <button
              onClick={() => setSelectedId(null)}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 shadow-sm transition-all group pointer-events-auto"
              title="Close report and expand list"
              id="close-report-btn"
            >
              <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
            </button>
          </div>

          <div className="-mt-16">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key={`loading-${selectedId}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="p-8 pt-0"
                >
                  <div className="flex items-center gap-2 mb-6 text-sm text-slate-400">
                    <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                    Generating retrospective…
                  </div>
                  <ReportSkeleton />
                </motion.div>
              ) : (
                <motion.div
                  key={selectedId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-8 pt-0 max-w-4xl mx-auto"
                >
                  <RetroReport feature={selectedFeature} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
