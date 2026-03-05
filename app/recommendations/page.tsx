"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  FlaskConical,
  GitBranch,
  GitMerge,
  Github,
  History,
  Lightbulb,
  MessageSquare,
  Play,
  RotateCcw,
  Sparkles,
  TicketIcon,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  buildUnifiedFeed,
  buildMockPR,
  type FeedItem,
  type FeedItemType,
  type MockPR,
  type UnifiedPriority,
} from "@/lib/mock-data/unified-feed";
import { type Source, type Area } from "@/lib/mock-data/recommendations";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_PRIORITIES: UnifiedPriority[] = ["critical", "high", "medium"];
const ALL_SOURCES: Source[] = [
  "Amplitude",
  "GitHub",
  "Sentry",
  "Prometheus",
  "UX",
];
const ALL_AREAS: Area[] = [
  "Acquisition",
  "Activation",
  "Retention",
  "Revenue",
  "Performance",
];

// ─── Config Maps ──────────────────────────────────────────────────────────────

const priorityConfig: Record<
  UnifiedPriority,
  { label: string; emoji: string; badge: string; border: string }
> = {
  critical: {
    label: "Critical",
    emoji: "🔴",
    badge: "bg-red-50 text-red-700 border border-red-200",
    border: "border-l-4 border-l-red-400",
  },
  high: {
    label: "High",
    emoji: "🟡",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    border: "",
  },
  medium: {
    label: "Medium",
    emoji: "🟢",
    badge: "bg-green-50 text-green-700 border border-green-200",
    border: "",
  },
};

const issueTypeConfig: Record<string, { label: string; color: string }> = {
  "rage-click": { label: "Rage Click", color: "bg-red-100 text-red-700" },
  "dead-click": { label: "Dead Click", color: "bg-amber-100 text-amber-700" },
  "drop-off": { label: "Drop-off", color: "bg-slate-100 text-slate-600" },
  "repeated-navigation": {
    label: "Repeated Nav",
    color: "bg-orange-100 text-orange-700",
  },
};

const sourceConfig: Record<Source, { color: string; bg: string }> = {
  Amplitude: { color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200" },
  GitHub: { color: "text-slate-700", bg: "bg-slate-100 border-slate-300" },
  Sentry: { color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  Prometheus: { color: "text-red-700", bg: "bg-red-50 border-red-200" },
  UX: { color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
};

const ownerConfig: Record<"Engineering" | "PM" | "Design", { color: string }> =
  {
    Engineering: { color: "bg-blue-50 text-blue-700 border border-blue-200" },
    PM: { color: "bg-indigo-50 text-indigo-700 border border-indigo-200" },
    Design: { color: "bg-violet-50 text-violet-700 border border-violet-200" },
  };

const contextTypeConfig: Record<
  "retrospective" | "incident" | "decision",
  { icon: React.FC<{ className?: string }>; label: string; color: string }
> = {
  retrospective: {
    icon: GitMerge,
    label: "Retro",
    color: "text-indigo-600 bg-indigo-50",
  },
  incident: {
    icon: AlertTriangle,
    label: "Incident",
    color: "text-red-600 bg-red-50",
  },
  decision: {
    icon: MessageSquare,
    label: "Decision",
    color: "text-amber-600 bg-amber-50",
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Filters = {
  types: Set<FeedItemType>;
  priorities: Set<UnifiedPriority>;
  sources: Set<Source>;
  areas: Set<Area>;
  showResolved: boolean;
};

type FeedTab = "all" | "recommendation" | "friction-session";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const now = new Date("2026-03-04T12:00:00Z");
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "1 day ago";
  return `${diffDays}d ago`;
}

function getItemHeadline(item: FeedItem): string {
  if (item.feedType === "recommendation") return item.source.headline;
  return (
    item.source.flaggedReason ??
    `Session #${item.source.id} — flagged ${item.source.issueType ?? "issue"}`
  );
}

function getItemSummary(item: FeedItem): string {
  if (item.feedType === "recommendation") return item.source.evidenceSummary;
  return (
    item.source.agentAnnotation ?? `Path: ${item.source.pageViews.join(" → ")}`
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-20 h-5 bg-slate-200 rounded-full" />
        <div className="w-16 h-5 bg-slate-100 rounded-full" />
        <div className="ml-auto w-14 h-4 bg-slate-100 rounded" />
      </div>
      <div className="w-full h-4 bg-slate-200 rounded" />
      <div className="w-3/4 h-4 bg-slate-200 rounded" />
      <div className="w-2/3 h-3 bg-slate-100 rounded" />
      <div className="flex gap-2 pt-1">
        <div className="w-20 h-7 bg-slate-100 rounded-md" />
        <div className="w-20 h-7 bg-slate-100 rounded-md" />
        <div className="ml-auto w-16 h-7 bg-slate-100 rounded-md" />
      </div>
    </div>
  );
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onChange}
      className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 transition-colors w-full text-left"
    >
      <div
        className={cn(
          "w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
          checked
            ? "bg-indigo-600 border-indigo-600"
            : "border-slate-300 bg-white hover:border-slate-400",
        )}
      >
        {checked && (
          <svg className="w-2 h-2 text-white" viewBox="0 0 8 8" fill="none">
            <path
              d="M1.5 4L3 5.5L6.5 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span>{label}</span>
    </button>
  );
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

function FilterSidebar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  function toggleSet<T>(set: Set<T>, value: T): Set<T> {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  }

  return (
    <div className="w-[220px] flex-shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-y-auto">
      {/* Filters */}
      <div className="p-4 space-y-5 flex-1">
        {/* Type */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Type
          </p>
          <div className="space-y-2">
            <Checkbox
              checked={filters.types.has("recommendation")}
              onChange={() =>
                onChange({
                  ...filters,
                  types: toggleSet(
                    filters.types,
                    "recommendation" as FeedItemType,
                  ),
                })
              }
              label="💡 Recommendations"
            />
            <Checkbox
              checked={filters.types.has("friction-session")}
              onChange={() =>
                onChange({
                  ...filters,
                  types: toggleSet(
                    filters.types,
                    "friction-session" as FeedItemType,
                  ),
                })
              }
              label="⚡ Attention"
            />
          </div>
        </div>

        {/* Priority */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Priority
          </p>
          <div className="space-y-2">
            {ALL_PRIORITIES.map((p) => (
              <Checkbox
                key={p}
                checked={filters.priorities.has(p)}
                onChange={() =>
                  onChange({
                    ...filters,
                    priorities: toggleSet(filters.priorities, p),
                  })
                }
                label={
                  p === "critical"
                    ? "🔴 Critical"
                    : p === "high"
                      ? "🟡 High"
                      : "🟢 Medium"
                }
              />
            ))}
          </div>
        </div>

        {/* Source */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Source
          </p>
          <div className="space-y-2">
            {ALL_SOURCES.map((s) => (
              <Checkbox
                key={s}
                checked={filters.sources.has(s)}
                onChange={() =>
                  onChange({
                    ...filters,
                    sources: toggleSet(filters.sources, s),
                  })
                }
                label={s}
              />
            ))}
          </div>
        </div>

        {/* Area */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Area
          </p>
          <div className="space-y-2">
            {ALL_AREAS.map((a) => (
              <Checkbox
                key={a}
                checked={filters.areas.has(a)}
                onChange={() =>
                  onChange({ ...filters, areas: toggleSet(filters.areas, a) })
                }
                label={a}
              />
            ))}
          </div>
        </div>

        {/* Show resolved */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-600">Show resolved</span>
          <button
            onClick={() =>
              onChange({ ...filters, showResolved: !filters.showResolved })
            }
            className={cn(
              "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
              filters.showResolved ? "bg-indigo-600" : "bg-slate-200",
            )}
          >
            <span
              className={cn(
                "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform",
                filters.showResolved ? "translate-x-4" : "translate-x-1",
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Feed Item Card ───────────────────────────────────────────────────────────

function FeedItemCard({
  item,
  selected,
  onClick,
  onCreateTicket,
  onFixInGitHub,
}: {
  item: FeedItem;
  selected: boolean;
  onClick: () => void;
  onCreateTicket: () => void;
  onFixInGitHub: () => void;
}) {
  const pc = priorityConfig[item.unifiedPriority];
  const isSession = item.feedType === "friction-session";
  const headline = getItemHeadline(item);
  const summary = getItemSummary(item);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      onClick={onClick}
      className={cn(
        "relative bg-white border rounded-xl p-4 cursor-pointer transition-all duration-150 group",
        item.unifiedPriority === "critical" && pc.border,
        selected
          ? "border-indigo-400 ring-1 ring-indigo-200 bg-indigo-50/20 shadow-md"
          : "border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5",
      )}
    >
      {/* Row 1: Type + Priority + New + Time */}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        {/* Type badge */}
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border",
            isSession
              ? "bg-orange-50 text-orange-700 border-orange-200"
              : "bg-indigo-50 text-indigo-700 border-indigo-200",
          )}
        >
          {isSession ? (
            <Play className="w-2.5 h-2.5" />
          ) : (
            <Lightbulb className="w-2.5 h-2.5" />
          )}
          {isSession
            ? item.source.issueType
              ? issueTypeConfig[item.source.issueType]?.label
              : "Attention"
            : "Recommendation"}
        </span>

        {/* Priority badge */}
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
            pc.badge,
          )}
        >
          {pc.emoji} {pc.label}
        </span>

        {item.isNew && (
          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
            New
          </span>
        )}

        <span className="ml-auto text-[10px] text-slate-400 flex items-center gap-1 flex-shrink-0">
          <Clock className="w-3 h-3" />
          {relativeTime(item.detectedAt)}
          <span className="text-slate-300">·</span>
          <span className="text-slate-400">{item.area}</span>
        </span>
      </div>

      {/* Row 2: Headline */}
      <p className="text-sm font-semibold text-slate-900 leading-snug mb-1.5 line-clamp-2">
        {headline}
      </p>

      {/* Row 3: Summary / annotation */}
      <div className="flex items-start gap-1 mb-3">
        {isSession && item.source.agentAnnotation && (
          <Sparkles className="w-3 h-3 text-indigo-400 mt-0.5 flex-shrink-0" />
        )}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
          {summary}
        </p>
      </div>

      {/* Row 4: Sources / impact */}
      <div className="flex items-center gap-2 flex-wrap">
        {isSession ? (
          <>
            {item.source.issueType && (
              <span
                className={cn(
                  "text-[10px] font-medium px-1.5 py-0.5 rounded border",
                  issueTypeConfig[item.source.issueType]?.color,
                )}
              >
                PostHog Session
              </span>
            )}
            <span className="flex items-center gap-1 text-[10px] text-slate-400 ml-auto">
              <Users className="w-3 h-3" />~{item.source.impactScore} affected
            </span>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1 flex-wrap">
              {item.source.sources.map((s) => {
                const sc = sourceConfig[s];
                return (
                  <span
                    key={s}
                    className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded border",
                      sc.bg,
                      sc.color,
                    )}
                  >
                    {s}
                  </span>
                );
              })}
            </div>
            {item.source.confidence !== null ? (
              <span
                className="text-[10px] text-slate-400 ml-auto"
                title={item.source.confidenceReason}
              >
                {item.source.confidence}% confidence{" "}
                <span className="text-slate-300">ⓘ</span>
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 ml-auto italic">
                Requires triage
              </span>
            )}
          </>
        )}
      </div>

      {/* Row 5: Actions */}
      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
        {!isSession && (
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center gap-1 text-[11px] font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2 py-1 rounded-md transition-colors"
          >
            <FlaskConical className="w-3 h-3" />
            Experiment
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCreateTicket();
          }}
          className="flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors"
        >
          <TicketIcon className="w-3 h-3" />
          Ticket
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFixInGitHub();
          }}
          className="flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-1 rounded-md transition-colors"
        >
          <Github className="w-3 h-3" />
          Generate changes
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="ml-auto text-[11px] text-slate-400 hover:text-slate-600 px-1 py-1 rounded transition-colors"
        >
          Dismiss
        </button>
      </div>
    </motion.div>
  );
}

// ─── Unified Detail Panel ─────────────────────────────────────────────────────

function UnifiedDetailPanel({
  item,
  onClose,
  onCreateTicket,
  onFixInGitHub,
}: {
  item: FeedItem;
  onClose: () => void;
  onCreateTicket: () => void;
  onFixInGitHub: () => void;
}) {
  const pc = priorityConfig[item.unifiedPriority];
  const isSession = item.feedType === "friction-session";

  return (
    <motion.div
      initial={{ x: 24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 24, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-[420px] flex-shrink-0 border-l border-slate-200 bg-white flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-start gap-2 mb-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border flex-shrink-0",
              isSession
                ? "bg-orange-50 text-orange-700 border-orange-200"
                : "bg-indigo-50 text-indigo-700 border-indigo-200",
            )}
          >
            {isSession ? (
              <Play className="w-2.5 h-2.5" />
            ) : (
              <Lightbulb className="w-2.5 h-2.5" />
            )}
            {isSession
              ? item.source.issueType
                ? issueTypeConfig[item.source.issueType]?.label
                : "Attention"
              : "Recommendation"}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0",
              pc.badge,
            )}
          >
            {pc.emoji} {pc.label}
          </span>
          {item.isNew && (
            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
              New
            </span>
          )}
          <button
            onClick={onClose}
            className="ml-auto p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <h2 className="text-sm font-bold text-slate-900 leading-snug">
          {getItemHeadline(item)}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {isSession
            ? `Session #${item.source.id} · ${item.source.userId} · ${formatDuration(item.source.duration)}`
            : item.source.impactStatement}
        </p>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-5 space-y-6">
          {isSession ? (
            // ── Session Detail Content ──────────────────────────────────────
            <>
              {/* Page Flow */}
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3" />
                  Page Flow
                </h3>
                <div className="flex items-center gap-1 flex-wrap">
                  {item.source.pageViews.map((page, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {page}
                      </span>
                      {i < item.source.pageViews.length - 1 && (
                        <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Session Stats */}
              <section>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-slate-900">
                      {formatDuration(item.source.duration)}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Duration
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                    <p
                      className={cn(
                        "text-lg font-bold",
                        item.source.converted
                          ? "text-green-600"
                          : "text-red-600",
                      )}
                    >
                      {item.source.converted ? "Conv." : "Abandon"}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Outcome</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-slate-900">
                      ~{item.source.impactScore}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Users affected
                    </p>
                  </div>
                </div>
              </section>

              {/* Flagged Reason */}
              {item.source.flaggedReason && (
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3" />
                    What Happened
                  </h3>
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <p className="text-sm text-red-800 leading-relaxed">
                      {item.source.flaggedReason}
                    </p>
                  </div>
                </section>
              )}

              {/* AI Annotation */}
              {item.source.agentAnnotation && (
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    AI Diagnosis
                  </h3>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                    <p className="text-sm text-indigo-800 leading-relaxed">
                      {item.source.agentAnnotation}
                    </p>
                  </div>
                </section>
              )}

              {/* Suggested Investigation Prompts */}
              {item.source.suggestedPrompts.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3" />
                    Investigate with Agent
                  </h3>
                  <div className="space-y-2">
                    {item.source.suggestedPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        className="w-full text-left text-xs text-indigo-700 bg-white border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 rounded-lg px-3 py-2 transition-colors leading-relaxed"
                      >
                        "{prompt}"
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            // ── Recommendation Detail Content ───────────────────────────────
            <>
              {/* Full Diagnosis */}
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Full Diagnosis
                </h3>
                <div className="space-y-3">
                  {item.source.diagnosis.split("\n\n").map((para, i) => (
                    <p
                      key={i}
                      className="text-sm text-slate-600 leading-relaxed"
                    >
                      {para.trim()}
                    </p>
                  ))}
                </div>
              </section>

              {/* Evidence Chain */}
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Zap className="w-3 h-3" />
                  Evidence Chain
                </h3>
                <div className="space-y-0">
                  {item.source.evidenceChain.map((step, i) => {
                    const sc = sourceConfig[step.source];
                    const isLast = i === item.source.evidenceChain.length - 1;
                    return (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center flex-shrink-0 pt-1">
                          <div
                            className={cn(
                              "w-2.5 h-2.5 rounded-full border-2 flex-shrink-0",
                              i === 0
                                ? "border-indigo-500 bg-indigo-100"
                                : "border-slate-400 bg-slate-100",
                            )}
                          />
                          {!isLast && (
                            <div className="w-px flex-1 bg-slate-200 border-l border-dashed border-slate-300 mt-1 mb-1 min-h-[20px]" />
                          )}
                        </div>
                        <div className={cn("pb-4", isLast && "pb-0")}>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={cn(
                                "text-[10px] font-semibold px-1.5 py-0.5 rounded border",
                                sc.bg,
                                sc.color,
                              )}
                            >
                              {step.source}
                            </span>
                            {step.timestamp && (
                              <span className="text-[10px] text-slate-400">
                                {step.timestamp}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {step.signal}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Next Steps */}
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3" />
                  Suggested Next Steps
                </h3>
                <div className="space-y-3">
                  {item.source.nextSteps.map((step) => (
                    <div key={step.order} className="flex gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 mt-0.5">
                        {step.order}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 leading-relaxed mb-1">
                          {step.action}
                        </p>
                        <span
                          className={cn(
                            "inline-flex text-[10px] font-semibold px-1.5 py-0.5 rounded",
                            ownerConfig[step.owner].color,
                          )}
                        >
                          {step.owner}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Related Context */}
              {item.source.relatedContext.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <History className="w-3 h-3" />
                    Related Context
                  </h3>
                  <div className="space-y-2">
                    {item.source.relatedContext.map((ctx, i) => {
                      const cfg = contextTypeConfig[ctx.type];
                      const Icon = cfg.icon;
                      return (
                        <div
                          key={i}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <div
                              className={cn(
                                "w-4 h-4 rounded flex items-center justify-center",
                                cfg.color,
                              )}
                            >
                              <Icon className="w-2.5 h-2.5" />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-700">
                              {ctx.label}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {ctx.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Ignore Consequence */}
              <section>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-amber-700 mb-1">
                        What happens if you ignore this?
                      </p>
                      <p className="text-xs text-amber-700 leading-relaxed">
                        {item.source.ignoreConsequence}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
          <div className="h-2" />
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="flex-shrink-0 px-5 py-3 border-t border-slate-100 bg-white flex items-center gap-2">
        {!isSession && (
          <button className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
            <FlaskConical className="w-3.5 h-3.5" />
            Start Experiment
          </button>
        )}
        <button
          onClick={onCreateTicket}
          className="flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <TicketIcon className="w-3.5 h-3.5" />
          Create Ticket
        </button>
        <button
          onClick={onFixInGitHub}
          className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Github className="w-3.5 h-3.5" />
          Generate changes
        </button>
      </div>
    </motion.div>
  );
}

// ─── Empty Detail State ───────────────────────────────────────────────────────

function EmptyDetail() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-[420px] flex-shrink-0 border-l border-slate-200 bg-white flex-col items-center justify-center text-center p-10 hidden lg:flex"
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
        <Lightbulb className="w-6 h-6 text-slate-300" />
      </div>
      <p className="text-sm font-semibold text-slate-400 mb-1">
        Select an issue
      </p>
      <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
        Click any card to see the full diagnosis, evidence, and one-click
        actions.
      </p>
    </motion.div>
  );
}

// ─── Jira Ticket Modal ────────────────────────────────────────────────────────

function JiraTicketModal({
  item,
  onClose,
  onSubmit,
}: {
  item: FeedItem;
  onClose: () => void;
  onSubmit: (ticketId: string) => void;
}) {
  const isSession = item.feedType === "friction-session";

  const defaultTitle = isSession
    ? `[${item.source.issueType ? issueTypeConfig[item.source.issueType]?.label : "UX Issue"}] ${(item.source.flaggedReason ?? "").slice(0, 60)}`
    : item.source.headline.slice(0, 80);

  const defaultDescription = isSession
    ? [
        `## Issue`,
        item.source.agentAnnotation ?? "",
        ``,
        `## Affected Session`,
        `Session #${item.source.id} | User: ${item.source.userId}`,
        `Path: ${item.source.pageViews.join(" → ")}`,
        `Duration: ${formatDuration(item.source.duration)} | Outcome: ${item.source.converted ? "Converted" : "Abandoned"}`,
        ``,
        `## Impact`,
        `~${item.source.impactScore} users estimated affected`,
      ].join("\n")
    : [
        `## Recommendation`,
        item.source.headline,
        ``,
        `## Impact`,
        item.source.impactStatement,
        ``,
        `## Evidence`,
        item.source.evidenceSummary,
        ``,
        `## Next Steps`,
        ...item.source.nextSteps.map(
          (s) => `${s.order}. ${s.action} (${s.owner})`,
        ),
        ``,
        `## What Happens if Ignored`,
        item.source.ignoreConsequence,
      ].join("\n");

  const defaultPriority =
    item.unifiedPriority === "critical"
      ? "P1"
      : item.unifiedPriority === "high"
        ? "P2"
        : "P3";
  const defaultLabels = isSession
    ? [item.source.issueType ?? "bug", "session-replay", "PM-flagged"]
    : [
        item.source.area.toLowerCase(),
        "probe-recommendation",
        item.source.priority,
      ];

  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);
  const [priority, setPriority] = useState<"P1" | "P2" | "P3">(defaultPriority);
  const [assignee, setAssignee] = useState("Unassigned");
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = () => {
    const id = `JIRA-${1040 + Math.floor(Math.random() * 20)}`;
    setTicketId(id);
    setSubmitted(true);
    onSubmit(id);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {!submitted ? (
          <>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <TicketIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Create Jira Ticket
                </h2>
                <p className="text-xs text-slate-500">
                  Pre-filled from{" "}
                  {isSession ? "attention item" : "recommendation"} context
                </p>
              </div>
              <button
                onClick={onClose}
                className="ml-auto p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full text-xs font-mono border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value as "P1" | "P2" | "P3")
                    }
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                  >
                    <option value="P1">P1 — Critical</option>
                    <option value="P2">P2 — High</option>
                    <option value="P3">P3 — Medium</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Assignee
                  </label>
                  <select
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                  >
                    <option>Unassigned</option>
                    <option>Engineering</option>
                    <option>Kevin</option>
                    <option>Alex Chen</option>
                    <option>Priya Nair</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                  Labels
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {defaultLabels.filter(Boolean).map((label) => (
                    <span
                      key={label}
                      className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={onClose}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="ml-auto flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <TicketIcon className="w-4 h-4" />
                Create in Jira
              </button>
            </div>
          </>
        ) : (
          <div className="px-6 py-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Ticket created
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {ticketId} is open and ready for triage.
            </p>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 mb-6">
              <span className="text-sm font-mono text-slate-700">
                {ticketId}
              </span>
              <button
                onClick={handleCopy}
                className="ml-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── GitHub PR Modal ──────────────────────────────────────────────────────────

function GitHubPRModal({
  item,
  onClose,
}: {
  item: FeedItem;
  onClose: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [pr] = useState<MockPR>(() => buildMockPR(item));
  const [prTitle, setPrTitle] = useState(pr.prTitle);
  const [prDescription, setPrDescription] = useState(pr.prDescription);
  const [branch, setBranch] = useState(pr.branch);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
            <Github className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Generate changes
            </h2>
            <p className="text-xs text-slate-500">
              {step === 1
                ? "Review proposed changes"
                : step === 2
                  ? "Edit PR description"
                  : "PR created"}
            </p>
          </div>
          {/* Step indicator */}
          <div className="ml-auto flex items-center gap-1.5 mr-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  s <= step ? "bg-emerald-500" : "bg-slate-200",
                )}
              />
            ))}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Proposed Changes */}
        {step === 1 && (
          <>
            <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                  Branch name
                </label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <GitBranch className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <input
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="flex-1 text-xs font-mono bg-transparent focus:outline-none text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 mb-2 block">
                  Proposed changes
                </label>
                <div className="space-y-3">
                  {pr.proposedDiff.map((file, fi) => (
                    <div
                      key={fi}
                      className="border border-slate-200 rounded-lg overflow-hidden"
                    >
                      <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-600">
                          {file.path}
                        </span>
                      </div>
                      <div className="bg-slate-950 p-3 overflow-x-auto">
                        {file.lines.map((line, li) => (
                          <div
                            key={li}
                            className={cn(
                              "text-[11px] font-mono leading-relaxed px-1",
                              line.type === "add" &&
                                "text-emerald-400 bg-emerald-950/40",
                              line.type === "remove" &&
                                "text-red-400 bg-red-950/40 line-through",
                              line.type === "context" && "text-slate-400",
                            )}
                          >
                            {line.type === "add"
                              ? "+ "
                              : line.type === "remove"
                                ? "- "
                                : "  "}
                            {line.content}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-700">
                  <span className="font-semibold">Review carefully.</span> These
                  changes are AI-generated based on the issue diagnosis. Verify
                  correctness before creating the PR.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={onClose}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                className="ml-auto flex items-center gap-2 bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Review PR Description
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* Step 2: PR Description */}
        {step === 2 && (
          <>
            <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                  PR Title
                </label>
                <input
                  value={prTitle}
                  onChange={(e) => setPrTitle(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                  Description
                </label>
                <textarea
                  value={prDescription}
                  onChange={(e) => setPrDescription(e.target.value)}
                  rows={10}
                  className="w-full text-xs font-mono border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Assignees
                  </label>
                  <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white">
                    <option>Engineering Team</option>
                    <option>Alex Chen</option>
                    <option>Priya Nair</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Labels
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] font-medium bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                      bug
                    </span>
                    <span className="text-[11px] font-medium bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                      probe-fix
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="ml-auto flex items-center gap-2 bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Github className="w-4 h-4" />
                Create Draft PR
              </button>
            </div>
          </>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="px-6 py-12 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <Check className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              PR #{pr.prNumber} created
            </h3>
            <p className="text-sm text-slate-500 mb-2">
              <code className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">
                {branch}
              </code>
            </p>
            <p className="text-sm text-slate-500 mb-6">
              Ready for review. Assign a reviewer before merging.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View PR on GitHub
              </button>
              <button
                onClick={onClose}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors px-4 py-2"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RecommendationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [feedTab, setFeedTab] = useState<FeedTab>("all");
  const [ticketModalItem, setTicketModalItem] = useState<FeedItem | null>(null);
  const [githubModalItem, setGithubModalItem] = useState<FeedItem | null>(null);
  const [filters, setFilters] = useState<Filters>({
    types: new Set(),
    priorities: new Set(),
    sources: new Set(),
    areas: new Set(),
    showResolved: false,
  });

  const allItems = buildUnifiedFeed();

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const filtered = allItems.filter((item) => {
    if (!filters.showResolved && item.resolved) return false;

    // Type filter (sidebar checkboxes take precedence; if neither is checked, use the tab)
    const hasTypeFilter = filters.types.size > 0;
    if (hasTypeFilter && !filters.types.has(item.feedType)) return false;
    if (!hasTypeFilter && feedTab !== "all" && item.feedType !== feedTab)
      return false;

    if (
      filters.priorities.size > 0 &&
      !filters.priorities.has(item.unifiedPriority)
    )
      return false;

    if (filters.areas.size > 0 && !filters.areas.has(item.area as Area))
      return false;

    if (filters.sources.size > 0) {
      if (item.feedType === "recommendation") {
        if (!item.source.sources.some((s) => filters.sources.has(s)))
          return false;
      } else {
        // Sessions don't have sources in the same sense; skip source filter for them
        // unless "UX" is explicitly selected (sessions are UX signals)
        if (!filters.sources.has("UX")) return false;
      }
    }

    return true;
  });

  const selectedItem = allItems.find((i) => i.feedId === selectedId) ?? null;

  function handleSelect(feedId: string) {
    setSelectedId((prev) => (prev === feedId ? null : feedId));
    setMobileDetailOpen(true);
  }

  const criticalCount = allItems.filter(
    (i) => i.unifiedPriority === "critical" && !i.resolved,
  ).length;

  return (
    <div className="flex h-full overflow-hidden bg-slate-50">
      {/* Left Sidebar — hidden on mobile */}
      <div className="hidden md:flex">
        <FilterSidebar filters={filters} onChange={setFilters} />
      </div>

      {/* Center Feed */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Feed Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0">
          <div className="flex items-start gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">
                  Recommendations
                </h1>
                {criticalCount > 0 && (
                  <span className="text-[11px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                    {criticalCount} critical
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Friction sessions and AI recommendations — sorted by impact.
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] text-slate-400">
                Updated 4 min ago
              </span>
            </div>
          </div>

          {/* Type Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 w-fit">
            {(["all", "recommendation", "friction-session"] as const).map(
              (tab) => {
                const label =
                  tab === "all"
                    ? "All"
                    : tab === "recommendation"
                      ? "Recommendations"
                      : "Attention";
                const count =
                  tab === "all"
                    ? allItems.filter((i) => !i.resolved).length
                    : allItems.filter((i) => i.feedType === tab && !i.resolved)
                        .length;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setFeedTab(tab);
                      setFilters((f) => ({ ...f, types: new Set() }));
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                      feedTab === tab && filters.types.size === 0
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700",
                    )}
                  >
                    {tab === "recommendation" && (
                      <Lightbulb className="w-3 h-3" />
                    )}
                    {tab === "friction-session" && <Play className="w-3 h-3" />}
                    {label}
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-1 py-0.5 rounded-full min-w-[18px] text-center",
                        feedTab === tab && filters.types.size === 0
                          ? "bg-slate-100 text-slate-600"
                          : "bg-slate-200 text-slate-500",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* Feed Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {isLoading ? (
            <div className="space-y-3 max-w-2xl">
              {[...Array(5)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-500">
                No issues match your filters
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try adjusting or clearing your filters.
              </p>
              <button
                onClick={() => {
                  setFilters({
                    types: new Set(),
                    priorities: new Set(),
                    sources: new Set(),
                    areas: new Set(),
                    showResolved: false,
                  });
                  setFeedTab("all");
                }}
                className="mt-4 flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 px-3 py-1.5 bg-indigo-50 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-w-2xl">
              <AnimatePresence mode="popLayout">
                {filtered.map((item) => (
                  <FeedItemCard
                    key={item.feedId}
                    item={item}
                    selected={selectedId === item.feedId}
                    onClick={() => handleSelect(item.feedId)}
                    onCreateTicket={() => setTicketModalItem(item)}
                    onFixInGitHub={() => setGithubModalItem(item)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Right Detail Panel — desktop */}
      <div className="hidden lg:flex">
        <AnimatePresence mode="wait">
          {selectedItem ? (
            <UnifiedDetailPanel
              key={selectedItem.feedId}
              item={selectedItem}
              onClose={() => setSelectedId(null)}
              onCreateTicket={() => setTicketModalItem(selectedItem)}
              onFixInGitHub={() => setGithubModalItem(selectedItem)}
            />
          ) : (
            <EmptyDetail key="empty" />
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Detail Sheet */}
      <AnimatePresence>
        {mobileDetailOpen && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            onClick={() => setMobileDetailOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="absolute inset-x-0 bottom-0 top-12 bg-white rounded-t-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <UnifiedDetailPanel
                item={selectedItem}
                onClose={() => {
                  setMobileDetailOpen(false);
                  setSelectedId(null);
                }}
                onCreateTicket={() => setTicketModalItem(selectedItem)}
                onFixInGitHub={() => setGithubModalItem(selectedItem)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Jira Ticket Modal */}
      <AnimatePresence>
        {ticketModalItem && (
          <JiraTicketModal
            item={ticketModalItem}
            onClose={() => setTicketModalItem(null)}
            onSubmit={(_id) => {
              setTimeout(() => setTicketModalItem(null), 2000);
            }}
          />
        )}
      </AnimatePresence>

      {/* GitHub PR Modal */}
      <AnimatePresence>
        {githubModalItem && (
          <GitHubPRModal
            item={githubModalItem}
            onClose={() => setGithubModalItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
