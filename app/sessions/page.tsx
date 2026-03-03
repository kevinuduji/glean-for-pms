"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { flaggedSessions, Session } from "@/lib/mock-data/posthog";
import {
  Play,
  Sparkles,
  X,
  ChevronRight,
  Clock,
  Ticket,
  Search,
  Share2,
  BarChart2,
  Check,
  Copy,
  AlertCircle,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/utils";
import { useAgentStore } from "@/lib/store";

type IssueType = Session["issueType"];
type StatusFilter = "all" | "untriaged" | "in-review" | "triaged";

const issueTypeConfig: Record<
  NonNullable<IssueType>,
  { label: string; color: string }
> = {
  "rage-click": { label: "Rage Click", color: "bg-red-100 text-red-700" },
  "dead-click": { label: "Dead Click", color: "bg-amber-100 text-amber-700" },
  "drop-off": { label: "Drop-off", color: "bg-slate-100 text-slate-600" },
  "repeated-navigation": {
    label: "Repeated Nav",
    color: "bg-orange-100 text-orange-700",
  },
};

const priorityConfig: Record<"P1" | "P2" | "P3", { color: string }> = {
  P1: { color: "bg-red-100 text-red-700" },
  P2: { color: "bg-amber-100 text-amber-700" },
  P3: { color: "bg-slate-100 text-slate-600" },
};

const defaultPriorityForIssue = (issueType: IssueType): "P1" | "P2" | "P3" => {
  if (issueType === "rage-click" || issueType === "dead-click") return "P1";
  return "P2";
};

// ─── Ticket Modal ─────────────────────────────────────────────────────────────

function TicketModal({
  session,
  onClose,
  onSubmit,
}: {
  session: Session;
  onClose: () => void;
  onSubmit: (ticketId: string) => void;
}) {
  const issueLabel = session.issueType
    ? issueTypeConfig[session.issueType].label
    : "Issue";
  const defaultTitle = `[${issueLabel}] ${(session.flaggedReason ?? "").slice(0, 60)}`;
  const defaultDesc = [
    `## Issue`,
    session.agentAnnotation ?? "",
    ``,
    `## Affected Session`,
    `Session #${session.id} | User: ${session.userId}`,
    `Path: ${session.pageViews.join(" → ")}`,
    `Duration: ${formatDuration(session.duration)} | Outcome: ${session.converted ? "Converted" : "Abandoned"}`,
    ``,
    `## Impact`,
    `~${session.impactScore} users estimated affected`,
  ].join("\n");

  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDesc);
  const [priority, setPriority] = useState<"P1" | "P2" | "P3">(
    defaultPriorityForIssue(session.issueType),
  );
  const [assignee, setAssignee] = useState("Unassigned");
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const labels = [
    session.issueType?.replace("-", "_") ?? "bug",
    session.pageViews[0]?.replace("/", "") ?? "frontend",
    "PM-flagged",
  ];

  const handleSubmit = () => {
    const id = `JIRA-${1040 + Math.floor(Math.random() * 20)}`;
    setTicketId(id);
    setSubmitted(true);
    onSubmit(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Ticket className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-slate-900 text-sm">
              Create Jira Ticket
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <p className="font-semibold text-slate-900 text-base mb-1">
              Ticket created
            </p>
            <p className="text-slate-500 text-sm mb-4">
              <span className="font-mono font-semibold text-blue-600">
                {ticketId}
              </span>{" "}
              has been added to your Jira backlog.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Title */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={7}
                className="w-full text-xs font-mono border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent resize-none leading-relaxed"
              />
            </div>

            {/* Priority + Assignee row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                  Priority
                </label>
                <div className="flex gap-1.5">
                  {(["P1", "P2", "P3"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={cn(
                        "flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all",
                        priority === p
                          ? p === "P1"
                            ? "bg-red-500 border-red-500 text-white"
                            : p === "P2"
                              ? "bg-amber-500 border-amber-500 text-white"
                              : "bg-slate-500 border-slate-500 text-white"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                  Assignee
                </label>
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                >
                  <option>Unassigned</option>
                  <option>You</option>
                  <option>Engineering</option>
                </select>
              </div>
            </div>

            {/* Labels */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Labels
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {labels.map((l) => (
                  <span
                    key={l}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              Submit to Jira
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Share Modal ──────────────────────────────────────────────────────────────

function ShareModal({
  session,
  onClose,
}: {
  session: Session;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"slack" | "notion" | "plain">("slack");
  const [copied, setCopied] = useState(false);

  const issueLabel = session.issueType
    ? issueTypeConfig[session.issueType].label
    : "Issue";
  const priorityStr =
    session.priority ?? defaultPriorityForIssue(session.issueType);

  const slackText = [
    `*Session #${session.id} — ${issueLabel}*`,
    `> ${session.flaggedReason}`,
    `:sparkles: *Root cause:* ${session.agentAnnotation}`,
    `:bust_in_silhouette: User: \`${session.userId}\` | :stopwatch: ${formatDuration(session.duration)} | ${session.converted ? ":white_check_mark: Converted" : ":no_entry: Abandoned"}`,
    `:chart_with_upwards_trend: ~${session.impactScore} users estimated affected`,
    `:mag: Status: ${session.status.replace("-", " ")} | Priority: ${priorityStr}`,
  ].join("\n");

  const notionText = [
    `## Session #${session.id} | ${issueLabel} | ${priorityStr}`,
    ``,
    `**What happened:** ${session.flaggedReason}`,
    `**AI Analysis:** ${session.agentAnnotation}`,
    `**User:** ${session.userId} | **Duration:** ${formatDuration(session.duration)} | **Outcome:** ${session.converted ? "Converted" : "Abandoned"}`,
    `**Impact:** ~${session.impactScore} users estimated | **Status:** ${session.status.replace("-", " ")}`,
    `**Path:** ${session.pageViews.join(" → ")}`,
  ].join("\n");

  const plainText = [
    `Session #${session.id} — ${issueLabel}`,
    ``,
    `What happened: ${session.flaggedReason}`,
    `AI analysis: ${session.agentAnnotation}`,
    `User: ${session.userId} | Duration: ${formatDuration(session.duration)} | Outcome: ${session.converted ? "Converted" : "Abandoned"}`,
    `Impact: ~${session.impactScore} users estimated`,
    `Path: ${session.pageViews.join(" → ")}`,
    `Status: ${session.status} | Priority: ${priorityStr}`,
  ].join("\n");

  const activeText =
    tab === "slack" ? slackText : tab === "notion" ? notionText : plainText;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Share2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-slate-900 text-sm">
              Share Session Summary
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Format tabs */}
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {(
              [
                ["slack", "Slack"],
                ["notion", "Notion"],
                ["plain", "Plain Text"],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setTab(val)}
                className={cn(
                  "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all",
                  tab === val
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <pre className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-mono">
              {activeText}
            </pre>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className={cn(
              "w-full py-2.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all",
              copied
                ? "bg-green-500 text-white"
                : "bg-slate-900 text-white hover:bg-slate-700",
            )}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy to Clipboard
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Prioritize Modal ─────────────────────────────────────────────────────────

const mockBacklog = [
  {
    title: "Add resume state to onboarding flow",
    priority: "P2" as const,
    impactScore: 61,
    status: "in-review",
  },
  {
    title: "Fix Export CSV dead-click on reports page",
    priority: "P1" as const,
    impactScore: 18,
    status: "triaged",
  },
  {
    title: "Rewrite pricing page copy for clarity",
    priority: "P3" as const,
    impactScore: 23,
    status: "in-review",
  },
];

function PrioritizeModal({
  session,
  onClose,
  onSubmit,
}: {
  session: Session;
  onClose: () => void;
  onSubmit: (priority: "P1" | "P2" | "P3") => void;
}) {
  const [priority, setPriority] = useState<"P1" | "P2" | "P3">(
    session.priority ?? defaultPriorityForIssue(session.issueType),
  );
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const issueLabel = session.issueType
    ? issueTypeConfig[session.issueType].label
    : "Issue";

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit(priority);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[520px] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <BarChart2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-slate-900 text-sm">
              Prioritize Against Backlog
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="font-semibold text-slate-900 text-base mb-1">
              Added to backlog
            </p>
            <p className="text-slate-500 text-sm mb-4">
              Session #{session.id} is now{" "}
              <span
                className={cn(
                  "font-semibold px-1.5 py-0.5 rounded text-xs",
                  priority === "P1"
                    ? "bg-red-100 text-red-700"
                    : priority === "P2"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-600",
                )}
              >
                {priority}
              </span>{" "}
              and marked as In Review.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* This session */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-500">
                  THIS SESSION
                </span>
                <span
                  className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                    session.issueType
                      ? issueTypeConfig[session.issueType].color
                      : "bg-slate-100 text-slate-600",
                  )}
                >
                  {issueLabel}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-900 mb-1">
                {session.flaggedReason}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> ~{session.impactScore} users
                </span>
                <span>Session #{session.id}</span>
              </div>
            </div>

            {/* Comparison */}
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">
                How this compares to your backlog
              </p>
              <div className="space-y-2">
                {mockBacklog.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-3 py-2.5"
                  >
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0",
                        priorityConfig[item.priority].color,
                      )}
                    >
                      {item.priority}
                    </span>
                    <p className="text-xs text-slate-700 flex-1 leading-snug">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0">
                      <Users className="w-2.5 h-2.5" />
                      {item.impactScore}
                    </div>
                    {item.status === "triaged" && (
                      <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Priority selector */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-2 block">
                Assign Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["P1", "P2", "P3"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={cn(
                      "py-2.5 text-sm font-bold rounded-xl border-2 transition-all",
                      priority === p
                        ? p === "P1"
                          ? "bg-red-500 border-red-500 text-white shadow-md"
                          : p === "P2"
                            ? "bg-amber-500 border-amber-500 text-white shadow-md"
                            : "bg-slate-500 border-slate-500 text-white shadow-md"
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add context for your team..."
                rows={2}
                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none placeholder:text-slate-400"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <BarChart2 className="w-4 h-4" />
              Add to Backlog as {priority}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Session Card ─────────────────────────────────────────────────────────────

function SessionCard({
  session,
  onClick,
  onTicket,
  onInvestigate,
  onShare,
  onPrioritize,
}: {
  session: Session;
  onClick: () => void;
  onTicket: () => void;
  onInvestigate: () => void;
  onShare: () => void;
  onPrioritize: () => void;
}) {
  const issueConfig = session.issueType
    ? issueTypeConfig[session.issueType]
    : null;
  const durationStr = formatDuration(session.duration);

  const statusDot = {
    untriaged: { dot: "bg-red-400", label: "Untriaged" },
    "in-review": { dot: "bg-amber-400", label: "In Review" },
    triaged: { dot: "bg-green-500", label: "Triaged" },
  }[session.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden"
    >
      {/* Blurred screenshot placeholder */}
      <div className="h-28 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg,
              ${
                session.issueType === "rage-click"
                  ? "#fef2f2, #fee2e2"
                  : session.issueType === "dead-click"
                    ? "#fffbeb, #fef3c7"
                    : session.issueType === "repeated-navigation"
                      ? "#fff7ed, #fed7aa"
                      : "#f8fafc, #e2e8f0"
              })`,
          }}
        />
        {/* Fake UI skeleton */}
        <div className="absolute inset-0 p-3 opacity-30">
          <div className="h-2 bg-slate-400 rounded w-3/4 mb-1.5" />
          <div className="h-2 bg-slate-300 rounded w-1/2 mb-3" />
          <div className="flex gap-1.5 mb-2">
            <div className="h-5 bg-slate-300 rounded w-14" />
            <div className="h-5 bg-slate-300 rounded w-20" />
            <div className="h-5 bg-slate-400 rounded w-16" />
          </div>
          <div className="h-2 bg-slate-200 rounded w-full mb-1" />
          <div className="h-2 bg-slate-200 rounded w-5/6" />
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/20">
          <div className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center">
            <Play className="w-4 h-4 text-slate-700 ml-0.5" />
          </div>
        </div>

        {/* Issue type badge */}
        {issueConfig && (
          <div className="absolute top-2 left-2">
            <span
              className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                issueConfig.color,
              )}
            >
              {issueConfig.label}
            </span>
          </div>
        )}

        {/* Status dot */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur rounded-full px-2 py-0.5">
          <span className={cn("w-1.5 h-1.5 rounded-full", statusDot.dot)} />
          <span className="text-[9px] font-semibold text-slate-600">
            {statusDot.label}
          </span>
        </div>
      </div>

      <div className="p-4">
        {/* Session ID and user */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Session #{session.id}
            </p>
            <p className="text-xs text-slate-400 font-mono">{session.userId}</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            {durationStr}
          </div>
        </div>

        {/* Impact + badges row */}
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <span className="flex items-center gap-1 text-[10px] text-slate-500">
            <Users className="w-2.5 h-2.5" />~{session.impactScore} users
            affected
          </span>
          {session.priority && (
            <span
              className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                priorityConfig[session.priority].color,
              )}
            >
              {session.priority}
            </span>
          )}
          {session.linkedTicketId && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700">
              {session.linkedTicketId}
            </span>
          )}
        </div>

        {/* Page path */}
        <div className="flex items-center gap-1 flex-wrap mb-2">
          {session.pageViews.slice(0, 4).map((page, i) => (
            <span key={i} className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                {page}
              </span>
              {i < Math.min(session.pageViews.length - 1, 3) && (
                <ChevronRight className="w-2.5 h-2.5 text-slate-300" />
              )}
            </span>
          ))}
          {session.pageViews.length > 4 && (
            <span className="text-[10px] text-slate-400">
              +{session.pageViews.length - 4}
            </span>
          )}
        </div>

        {/* Flagged reason */}
        {session.flaggedReason && (
          <p className="text-xs text-slate-500 mb-2 line-clamp-2">
            {session.flaggedReason}
          </p>
        )}

        {/* AI annotation */}
        {session.agentAnnotation && (
          <div className="flex items-start gap-1.5 bg-indigo-50 rounded-lg px-2.5 py-2 mb-3">
            <Sparkles className="w-3 h-3 text-indigo-500 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-indigo-700 font-medium leading-relaxed">
              {session.agentAnnotation}
            </p>
          </div>
        )}

        {/* Quick action row */}
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          <ActionButton
            icon={<Ticket className="w-3.5 h-3.5" />}
            label="Ticket"
            onClick={onTicket}
            color="blue"
          />
          <ActionButton
            icon={<Search className="w-3.5 h-3.5" />}
            label="Investigate"
            onClick={onInvestigate}
            color="indigo"
          />
          <ActionButton
            icon={<Share2 className="w-3.5 h-3.5" />}
            label="Share"
            onClick={onShare}
            color="violet"
          />
          <ActionButton
            icon={<BarChart2 className="w-3.5 h-3.5" />}
            label="Prioritize"
            onClick={onPrioritize}
            color="emerald"
          />
        </div>
      </div>
    </motion.div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: "blue" | "indigo" | "violet" | "emerald";
}) {
  const colors = {
    blue: "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200",
    indigo: "hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200",
    violet: "hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200",
    emerald:
      "hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200",
  };

  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "group/btn relative flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-medium text-slate-500 border border-slate-200 rounded-lg transition-all",
        colors[color],
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function SessionDetailPanel({
  session,
  onClose,
  onTicket,
  onInvestigate,
  onShare,
  onPrioritize,
}: {
  session: Session;
  onClose: () => void;
  onTicket: () => void;
  onInvestigate: () => void;
  onShare: () => void;
  onPrioritize: () => void;
}) {
  const issueConfig = session.issueType
    ? issueTypeConfig[session.issueType]
    : null;

  const statusConfig = {
    untriaged: { label: "Untriaged", color: "bg-red-100 text-red-700" },
    "in-review": { label: "In Review", color: "bg-amber-100 text-amber-700" },
    triaged: { label: "Triaged", color: "bg-green-100 text-green-700" },
  }[session.status];

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed right-0 top-0 h-screen w-[460px] bg-white border-l border-slate-200 shadow-xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Session #{session.id}
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {session.userId}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Screenshot placeholder */}
        <div
          className="h-44 relative"
          style={{
            background: `linear-gradient(135deg,
              ${
                session.issueType === "rage-click"
                  ? "#fef2f2, #fca5a5"
                  : session.issueType === "dead-click"
                    ? "#fffbeb, #fde68a"
                    : session.issueType === "repeated-navigation"
                      ? "#fff7ed, #fb923c"
                      : "#f8fafc, #cbd5e1"
              })`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-lg">
              <Play className="w-6 h-6 text-slate-600 ml-0.5" />
            </div>
          </div>
          {issueConfig && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
              <span
                className={cn(
                  "text-xs font-semibold px-2 py-1 rounded-full",
                  issueConfig.color,
                )}
              >
                {issueConfig.label}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold px-2 py-1 rounded-full",
                  statusConfig.color,
                )}
              >
                {statusConfig.label}
              </span>
              {session.priority && (
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-1 rounded-full",
                    priorityConfig[session.priority].color,
                  )}
                >
                  {session.priority}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Stats row — 4 stats */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-slate-50 rounded-lg p-2.5">
              <p className="text-[10px] text-slate-500">Duration</p>
              <p className="text-xs font-semibold text-slate-900 mt-0.5">
                {formatDuration(session.duration)}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2.5">
              <p className="text-[10px] text-slate-500">Pages</p>
              <p className="text-xs font-semibold text-slate-900 mt-0.5">
                {session.pageViews.length}
              </p>
            </div>
            <div
              className={cn(
                "rounded-lg p-2.5",
                session.converted ? "bg-green-50" : "bg-red-50",
              )}
            >
              <p className="text-[10px] text-slate-500">Outcome</p>
              <p
                className={cn(
                  "text-xs font-semibold mt-0.5",
                  session.converted ? "text-green-700" : "text-red-700",
                )}
              >
                {session.converted ? "Converted" : "Abandoned"}
              </p>
            </div>
            <div className="bg-amber-50 rounded-lg p-2.5">
              <p className="text-[10px] text-slate-500">Impact</p>
              <p className="text-xs font-semibold text-amber-700 mt-0.5">
                ~{session.impactScore}
              </p>
            </div>
          </div>

          {/* Full path */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-3">
              Session Path
            </p>
            <div className="space-y-1.5">
              {session.pageViews.map((page, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-mono flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-xs font-mono text-slate-700 bg-slate-50 px-2 py-1 rounded-lg">
                    {page}
                  </span>
                  {i < session.pageViews.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Flagged reason */}
          {session.flaggedReason && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                What Happened
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-sm text-slate-700">
                  {session.flaggedReason}
                </p>
              </div>
            </div>
          )}

          {/* AI annotation */}
          {session.agentAnnotation && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Agent Analysis
              </p>
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                <p className="text-sm text-indigo-900">
                  {session.agentAnnotation}
                </p>
              </div>
            </div>
          )}

          {/* Quick investigations */}
          {session.suggestedPrompts.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                Quick Investigations
              </p>
              <div className="space-y-1.5">
                {session.suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => onInvestigate()}
                    className="w-full text-left text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl px-3 py-2 transition-colors leading-relaxed"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Source chips */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">
              Data Connectors
            </p>
            <div className="flex gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">
                PostHog
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                Amplitude
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky 4-action footer */}
      <div className="border-t border-slate-100 px-6 py-4 bg-white space-y-2">
        <button
          onClick={onTicket}
          className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Ticket className="w-4 h-4" />
          Create Jira Ticket
        </button>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onInvestigate}
            className="py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            Investigate
          </button>
          <button
            onClick={onShare}
            className="py-2 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
          <button
            onClick={onPrioritize}
            className="py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Prioritize
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState(() =>
    flaggedSessions.map((s) => ({ ...s })),
  );
  const [issueFilter, setIssueFilter] = useState<IssueType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [actionModal, setActionModal] = useState<{
    type: "ticket" | "share" | "prioritize" | null;
    session: Session | null;
  }>({ type: null, session: null });

  const updateSession = (id: string, patch: Partial<Session>) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );
    // Also update selectedSession if it's the same one
    setSelectedSession((prev) =>
      prev?.id === id ? { ...prev, ...patch } : prev,
    );
  };

  const handleInvestigate = (session: Session) => {
    const query = `Investigate Session #${session.id}: ${session.flaggedReason}. Root cause analysis: ${session.agentAnnotation}. How many users are affected and what is the recommended fix?`;
    useAgentStore.getState().setQuery(query);
    router.push("/agent");
  };

  const filtered = sessions
    .filter((s) => issueFilter === "all" || s.issueType === issueFilter)
    .filter((s) => statusFilter === "all" || s.status === statusFilter);

  const counts = {
    untriaged: sessions.filter((s) => s.status === "untriaged").length,
    inReview: sessions.filter((s) => s.status === "in-review").length,
    triaged: sessions.filter((s) => s.status === "triaged").length,
  };

  const issueFilterOptions: Array<{ value: IssueType | "all"; label: string }> =
    [
      { value: "all", label: "All Issues" },
      { value: "rage-click", label: "Rage Click" },
      { value: "dead-click", label: "Dead Click" },
      { value: "drop-off", label: "Drop-off" },
      { value: "repeated-navigation", label: "Repeated Nav" },
    ];

  const statusFilterOptions: Array<{
    value: StatusFilter;
    label: string;
    dot?: string;
  }> = [
    { value: "all", label: "All" },
    { value: "untriaged", label: "Untriaged", dot: "bg-red-400" },
    { value: "in-review", label: "In Review", dot: "bg-amber-400" },
    { value: "triaged", label: "Triaged", dot: "bg-green-500" },
  ];

  const modalSession = actionModal.session;

  return (
    <>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Sessions</h1>
          <p className="text-slate-500 text-sm mt-1">
            Flagged friction points — review each session and turn it into
            action.
          </p>
          {/* Triage status strip */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-sm font-semibold text-red-600">
                {counts.untriaged}
              </span>
              <span className="text-xs text-slate-500">untriaged</span>
            </div>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-sm font-semibold text-amber-600">
                {counts.inReview}
              </span>
              <span className="text-xs text-slate-500">in review</span>
            </div>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-semibold text-green-600">
                {counts.triaged}
              </span>
              <span className="text-xs text-slate-500">triaged this week</span>
            </div>
          </div>
        </div>

        {/* Filter bars */}
        <div className="space-y-2 mb-6">
          {/* Issue type filter */}
          <div className="flex items-center gap-2">
            {issueFilterOptions.map((opt) => (
              <button
                key={opt.value ?? "all"}
                onClick={() => setIssueFilter(opt.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  issueFilter === opt.value
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-zinc-200 text-slate-600 hover:bg-slate-50",
                )}
              >
                {opt.label}
                {opt.value !== "all" && (
                  <span className="ml-1.5 text-[10px] opacity-70">
                    {sessions.filter((s) => s.issueType === opt.value).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            {statusFilterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5",
                  statusFilter === opt.value
                    ? "bg-slate-800 text-white"
                    : "bg-white border border-zinc-200 text-slate-600 hover:bg-slate-50",
                )}
              >
                {opt.dot && (
                  <span className={cn("w-1.5 h-1.5 rounded-full", opt.dot)} />
                )}
                {opt.label}
                {opt.value !== "all" && (
                  <span className="text-[10px] opacity-70">
                    {sessions.filter((s) => s.status === opt.value).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions grid */}
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onClick={() => setSelectedSession(session)}
              onTicket={() => setActionModal({ type: "ticket", session })}
              onInvestigate={() => handleInvestigate(session)}
              onShare={() => setActionModal({ type: "share", session })}
              onPrioritize={() =>
                setActionModal({ type: "prioritize", session })
              }
            />
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedSession && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSession(null)}
              className="fixed inset-0 bg-slate-900/20 z-40"
            />
            <SessionDetailPanel
              session={selectedSession}
              onClose={() => setSelectedSession(null)}
              onTicket={() => {
                setActionModal({ type: "ticket", session: selectedSession });
              }}
              onInvestigate={() => handleInvestigate(selectedSession)}
              onShare={() =>
                setActionModal({ type: "share", session: selectedSession })
              }
              onPrioritize={() =>
                setActionModal({ type: "prioritize", session: selectedSession })
              }
            />
          </>
        )}
      </AnimatePresence>

      {/* Action modals */}
      <AnimatePresence>
        {actionModal.type === "ticket" && modalSession && (
          <TicketModal
            session={modalSession}
            onClose={() => setActionModal({ type: null, session: null })}
            onSubmit={(ticketId) => {
              updateSession(modalSession.id, {
                linkedTicketId: ticketId,
                status: "triaged",
              });
            }}
          />
        )}
        {actionModal.type === "share" && modalSession && (
          <ShareModal
            session={modalSession}
            onClose={() => setActionModal({ type: null, session: null })}
          />
        )}
        {actionModal.type === "prioritize" && modalSession && (
          <PrioritizeModal
            session={modalSession}
            onClose={() => setActionModal({ type: null, session: null })}
            onSubmit={(priority) => {
              updateSession(modalSession.id, { priority, status: "in-review" });
              setActionModal({ type: null, session: null });
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
