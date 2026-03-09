"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  ChevronRight,
  Clock,
  FlaskConical,
  GitMerge,
  History,
  Lightbulb,
  MessageSquare,
  RotateCcw,
  Sparkles,
  TicketIcon,
  X,
  Zap,
} from "lucide-react";
import {
  recommendations,
  type Recommendation,
  type Priority,
  type Source,
  type Area,
} from "@/lib/mock-data/recommendations";
import { cn } from "@/lib/utils";

const STACK_HEALTH = [
  { name: "Amplitude", status: "green" },
  { name: "GitHub", status: "green" },
  { name: "Sentry", status: "yellow" },
  { name: "Prometheus", status: "green" },
] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

type Filters = {
  priorities: Set<Priority>;
  sources: Set<Source>;
  areas: Set<Area>;
  showResolved: boolean;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const ALL_PRIORITIES: Priority[] = ["critical", "high", "medium"];
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

const priorityConfig: Record<
  Priority,
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

const sourceConfig: Record<Source, { color: string; bg: string }> = {
  Amplitude: { color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200" },
  GitHub: { color: "text-slate-700", bg: "bg-slate-100 border-slate-300" },
  Sentry: { color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  Prometheus: { color: "text-red-700", bg: "bg-red-50 border-red-200" },
  UX: { color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
};

const ownerConfig: Record<
  "Engineering" | "PM" | "Design",
  { color: string }
> = {
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

// ─── Helper: relative time ────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const now = new Date("2026-03-03T12:00:00Z");
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-16 h-5 bg-slate-200 rounded-full" />
        <div className="w-8 h-5 bg-slate-100 rounded-full" />
        <div className="ml-auto w-14 h-4 bg-slate-100 rounded" />
      </div>
      <div className="w-full h-4 bg-slate-200 rounded" />
      <div className="w-3/4 h-4 bg-slate-200 rounded" />
      <div className="w-2/3 h-3 bg-slate-100 rounded" />
      <div className="flex gap-2 pt-1">
        <div className="w-16 h-5 bg-slate-100 rounded-full" />
        <div className="w-16 h-5 bg-slate-100 rounded-full" />
        <div className="ml-auto w-20 h-5 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

// ─── Checkbox ────────────────────────────────────────────────────────────────

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
          <svg
            className="w-2 h-2 text-white"
            viewBox="0 0 8 8"
            fill="none"
          >
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
    <div className="w-[260px] flex-shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-y-auto">
      {/* Stack Health */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Stack Health
          </p>
          <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
            Live
          </span>
        </div>
        <div className="space-y-2">
          {STACK_HEALTH.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full flex-shrink-0",
                  item.status === "green"
                    ? "bg-green-400"
                    : item.status === "yellow"
                      ? "bg-amber-400"
                      : "bg-red-400",
                )}
              />
              <span className="text-xs text-slate-600">{item.name}</span>
              <span
                className={cn(
                  "text-[10px] ml-auto",
                  item.status === "green"
                    ? "text-green-600"
                    : item.status === "yellow"
                      ? "text-amber-600"
                      : "text-red-600",
                )}
              >
                {item.status === "green"
                  ? "Connected"
                  : item.status === "yellow"
                    ? "Degraded"
                    : "Offline"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 space-y-5 flex-1">
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
                  p === "critical" ? "🔴 Critical" : p === "high" ? "🟡 High" : "🟢 Medium"
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
                  onChange({
                    ...filters,
                    areas: toggleSet(filters.areas, a),
                  })
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

// ─── Recommendation Card ──────────────────────────────────────────────────────

function RecommendationCard({
  rec,
  selected,
  onClick,
}: {
  rec: Recommendation;
  selected: boolean;
  onClick: () => void;
}) {
  const pc = priorityConfig[rec.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      onClick={onClick}
      className={cn(
        "relative bg-white border rounded-xl p-4 cursor-pointer transition-all duration-150 group",
        rec.priority === "critical" && pc.border,
        selected
          ? "border-indigo-400 ring-1 ring-indigo-200 bg-indigo-50/20 shadow-md"
          : "border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5",
      )}
    >
      {/* Top row */}
      <div className="flex items-center gap-2 mb-2.5">
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full",
            pc.badge,
          )}
        >
          {pc.emoji} {pc.label}
        </span>
        {rec.isNew && (
          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
            New
          </span>
        )}
        <span className="ml-auto text-[11px] text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {relativeTime(rec.detectedAt)}
        </span>
      </div>

      {/* Headline */}
      <p className="text-sm font-semibold text-slate-900 leading-snug mb-1.5">
        {rec.headline}
      </p>

      {/* Evidence summary */}
      <p className="text-xs text-slate-500 leading-relaxed mb-3">
        {rec.evidenceSummary}
      </p>

      {/* Bottom row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Source chips */}
        <div className="flex items-center gap-1 flex-wrap">
          {rec.sources.map((s) => {
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

        {/* Confidence */}
        {rec.confidence !== null ? (
          <span
            className="text-[11px] text-slate-400 ml-auto cursor-help"
            title={`Why did Probe flag this?\n\n${rec.confidenceReason}`}
          >
            {rec.confidence}% confidence
            <span className="inline-block ml-0.5 text-slate-300">ⓘ</span>
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 ml-auto italic">
            Requires triage
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
        <button
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-[11px] font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2 py-1 rounded-md transition-colors"
        >
          <FlaskConical className="w-3 h-3" />
          Start Experiment
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors"
        >
          <TicketIcon className="w-3 h-3" />
          Create Ticket
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

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({
  rec,
  onClose,
}: {
  rec: Recommendation;
  onClose: () => void;
}) {
  const pc = priorityConfig[rec.priority];
  const ContextIcon = contextTypeConfig;

  return (
    <motion.div
      initial={{ x: 24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 24, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-[440px] flex-shrink-0 border-l border-slate-200 bg-white flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-start gap-2 mb-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0",
              pc.badge,
            )}
          >
            {pc.emoji} {pc.label}
          </span>
          {rec.isNew && (
            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
              New
            </span>
          )}
          <button
            onClick={onClose}
            className="ml-auto p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <h2 className="text-sm font-bold text-slate-900 leading-snug">
          {rec.headline}
        </h2>
        <p className="text-xs text-slate-500 mt-1">{rec.impactStatement}</p>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 space-y-6">
          {/* Full Diagnosis */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Full Diagnosis
            </h3>
            <div className="space-y-3">
              {rec.diagnosis.split("\n\n").map((para, i) => (
                <p key={i} className="text-sm text-slate-600 leading-relaxed">
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
              {rec.evidenceChain.map((step, i) => {
                const sc = sourceConfig[step.source];
                const isLast = i === rec.evidenceChain.length - 1;
                return (
                  <div key={i} className="flex gap-3">
                    {/* Timeline dot + line */}
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
                    {/* Content */}
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

          {/* Suggested Next Steps */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3" />
              Suggested Next Steps
            </h3>
            <div className="space-y-3">
              {rec.nextSteps.map((step) => (
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
          {rec.relatedContext.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <History className="w-3 h-3" />
                Related Context
              </h3>
              <div className="space-y-2">
                {rec.relatedContext.map((ctx, i) => {
                  const cfg = ContextIcon[ctx.type];
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
                    {rec.ignoreConsequence}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Spacer */}
          <div className="h-2" />
        </div>
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
      className="w-[440px] flex-shrink-0 border-l border-slate-200 bg-white flex flex-col items-center justify-center text-center p-10 hidden lg:flex"
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
        <Lightbulb className="w-6 h-6 text-slate-300" />
      </div>
      <p className="text-sm font-semibold text-slate-400 mb-1">
        Select a recommendation
      </p>
      <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
        Click any card in the feed to see the full analysis and suggested next steps.
      </p>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RecommendationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    priorities: new Set(),
    sources: new Set(),
    areas: new Set(),
    showResolved: false,
  });

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const filtered = recommendations.filter((r) => {
    if (!filters.showResolved && r.resolved) return false;
    if (filters.priorities.size > 0 && !filters.priorities.has(r.priority))
      return false;
    if (
      filters.sources.size > 0 &&
      !r.sources.some((s) => filters.sources.has(s))
    )
      return false;
    if (filters.areas.size > 0 && !filters.areas.has(r.area)) return false;
    return true;
  });

  const selectedRec = recommendations.find((r) => r.id === selectedId) ?? null;

  function handleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
    setMobileDetailOpen(true);
  }

  return (
    <div className="flex h-full overflow-hidden bg-slate-50">
      {/* Left Sidebar — hidden on mobile */}
      <div className="hidden md:flex">
        <FilterSidebar filters={filters} onChange={setFilters} />
      </div>

      {/* Center Feed */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Feed header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-3 mb-0.5">
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                AI Recommendations
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Prioritized actions, backed by signals from across your product stack.
              </p>
            </div>
            {/* Last updated indicator */}
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] text-slate-400">
                Last updated 4 minutes ago
              </span>
            </div>
          </div>
        </div>

        {/* Feed body */}
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
                No recommendations match your filters
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try adjusting or clearing your filters.
              </p>
              <button
                onClick={() =>
                  setFilters({
                    priorities: new Set(),
                    sources: new Set(),
                    areas: new Set(),
                    showResolved: false,
                  })
                }
                className="mt-4 flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 px-3 py-1.5 bg-indigo-50 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-w-2xl">
              <AnimatePresence mode="popLayout">
                {filtered.map((rec) => (
                  <RecommendationCard
                    key={rec.id}
                    rec={rec}
                    selected={selectedId === rec.id}
                    onClick={() => handleSelect(rec.id)}
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
          {selectedRec ? (
            <DetailPanel
              key={selectedRec.id}
              rec={selectedRec}
              onClose={() => setSelectedId(null)}
            />
          ) : (
            <EmptyDetail key="empty" />
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Detail Modal */}
      <AnimatePresence>
        {mobileDetailOpen && selectedRec && (
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
              <DetailPanel
                rec={selectedRec}
                onClose={() => {
                  setMobileDetailOpen(false);
                  setSelectedId(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
