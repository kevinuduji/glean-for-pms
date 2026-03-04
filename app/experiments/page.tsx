"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { experiments, Experiment } from "@/lib/mock-data/experiments";
import { agentScripts, AgentStep } from "@/lib/mock-data/agent-scripts";
import {
  BookOpen,
  Activity,
  GitMerge,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Loader2,
  Circle,
  Plus,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Send,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "archive" | "live" | "decisions" | "scaffold";
type FilterStatus =
  | "all"
  | "running"
  | "significant"
  | "inconclusive"
  | "draft";
type SortBy = "newest" | "oldest" | "highest-lift" | "most-confident";

type LocalStepStatus = "pending" | "running" | "done";

type LocalAgentState = {
  scriptId: string | null;
  query: string;
  steps: (AgentStep & { status: LocalStepStatus })[];
  response: string;
  isRunning: boolean;
  isComplete: boolean;
};

const emptyAgentState: LocalAgentState = {
  scriptId: null,
  query: "",
  steps: [],
  response: "",
  isRunning: false,
  isComplete: false,
};

// ─── Status config ────────────────────────────────────────────────────────────

const statusConfig: Record<
  string,
  {
    label: string;
    color: string;
    dot: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  running: {
    label: "Running",
    color: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
    icon: Clock,
  },
  significant: {
    label: "Significant",
    color: "bg-green-100 text-green-700",
    dot: "bg-green-500",
    icon: CheckCircle2,
  },
  inconclusive: {
    label: "Inconclusive",
    color: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
    icon: AlertCircle,
  },
  draft: {
    label: "Draft",
    color: "bg-amber-100 text-amber-700",
    dot: "bg-amber-400",
    icon: FileText,
  },
};

const areaColors: Record<string, string> = {
  onboarding: "bg-violet-50 text-violet-700 border-violet-100",
  activation: "bg-blue-50 text-blue-700 border-blue-100",
  conversion: "bg-indigo-50 text-indigo-700 border-indigo-100",
  retention: "bg-teal-50 text-teal-700 border-teal-100",
  billing: "bg-emerald-50 text-emerald-700 border-emerald-100",
  homepage: "bg-orange-50 text-orange-700 border-orange-100",
  notifications: "bg-pink-50 text-pink-700 border-pink-100",
  search: "bg-cyan-50 text-cyan-700 border-cyan-100",
  pricing: "bg-lime-50 text-lime-700 border-lime-100",
};

// ─── Local script runner ───────────────────────────────────────────────────────

function useLocalAgent() {
  const [agentState, setAgentState] =
    useState<LocalAgentState>(emptyAgentState);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const runLocalScript = useCallback(
    (scriptId: string, overrideQuery?: string) => {
      // Clear any existing timers
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];

      const script = agentScripts.find((s) => s.id === scriptId);
      if (!script) return;

      setAgentState({
        scriptId,
        query: overrideQuery || script.query,
        steps: script.steps.map((s) => ({ ...s, status: "pending" })),
        response: "",
        isRunning: true,
        isComplete: false,
      });

      let cumulative = 0;
      script.steps.forEach((step, index) => {
        const runAt = cumulative;
        cumulative += step.durationMs;
        const doneAt = cumulative;

        const runTimer = setTimeout(() => {
          setAgentState((prev) => ({
            ...prev,
            steps: prev.steps.map((s) =>
              s.id === step.id
                ? { ...s, status: "running" as LocalStepStatus }
                : s,
            ),
          }));
        }, runAt);

        const doneTimer = setTimeout(() => {
          setAgentState((prev) => {
            const updated = {
              ...prev,
              steps: prev.steps.map((s) =>
                s.id === step.id
                  ? { ...s, status: "done" as LocalStepStatus }
                  : s,
              ),
            };
            if (index === script.steps.length - 1) {
              return {
                ...updated,
                isRunning: false,
                isComplete: true,
                response: script.response,
              };
            }
            return updated;
          });
        }, doneAt);

        timersRef.current.push(runTimer, doneTimer);
      });
    },
    [],
  );

  const resetAgent = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setAgentState(emptyAgentState);
  }, []);

  return { agentState, runLocalScript, resetAgent };
}

// ─── formatResponse (same as agent page) ──────────────────────────────────────

function formatResponse(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const formatted = parts.map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={j} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      const codeParts = part.split(/(`[^`]+`)/g);
      return codeParts.map((cp, k) => {
        if (cp.startsWith("`") && cp.endsWith("`")) {
          return (
            <code
              key={k}
              className="font-mono text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded text-xs"
            >
              {cp.slice(1, -1)}
            </code>
          );
        }
        return cp;
      });
    });
    return (
      <p
        key={i}
        className={cn(
          "text-sm text-slate-700 leading-relaxed",
          i > 0 && line === "" ? "mt-2" : "",
        )}
      >
        {formatted}
      </p>
    );
  });
}

// ─── InlineAgentButton ────────────────────────────────────────────────────────

function InlineAgentButton({
  label,
  scriptId,
  onAskAgent,
}: {
  label: string;
  scriptId: string;
  onAskAgent: (scriptId: string) => void;
}) {
  return (
    <button
      onClick={() => onAskAgent(scriptId)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 hover:border-indigo-200 transition-colors group"
    >
      <Sparkles className="w-3 h-3" />
      {label}
      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-0.5" />
    </button>
  );
}

// ─── ArchiveDetailPanel ───────────────────────────────────────────────────────

function ArchiveDetailPanel({
  experiment,
  onAskAgent,
}: {
  experiment: Experiment;
  onAskAgent: (scriptId: string) => void;
}) {
  const controlValue = 59;
  const variantValue = experiment.currentLift
    ? controlValue * (1 + experiment.currentLift / 100)
    : controlValue;

  const chartData = [
    { name: "Control", value: controlValue, fill: "#94a3b8" },
    { name: "Variant", value: Math.round(variantValue), fill: "#6366f1" },
  ];

  const status = statusConfig[experiment.status];
  const StatusIcon = status.icon;

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className={cn(
              "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
              status.color,
            )}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {status.label}
          </span>
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full border",
              areaColors[experiment.area],
            )}
          >
            {experiment.area}
          </span>
          <span className="text-xs text-slate-400">
            Created by {experiment.createdBy}
          </span>
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-1">
          {experiment.name}
        </h2>
        <p className="text-xs text-slate-500">
          Started {experiment.startDate}
          {experiment.endDate && ` · Ended ${experiment.endDate}`}
        </p>
      </div>

      {/* Insight callout (for completed experiments) */}
      {experiment.insight && (
        <div className="mb-6 flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <TrendingUp className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-slate-700 leading-relaxed">
            <span className="font-semibold text-slate-900">Key takeaway: </span>
            {experiment.insight}
          </p>
        </div>
      )}

      {/* Hypothesis */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-900">Hypothesis</h3>
          <InlineAgentButton
            label="Find analogous tests"
            scriptId="script-exp-analogs"
            onAskAgent={onAskAgent}
          />
        </div>
        <p className="text-sm text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          {experiment.hypothesis}
        </p>
      </div>

      {/* Control vs Variant */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            Control
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              Baseline
            </span>
          </h3>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm min-h-[90px]">
            <p className="text-sm text-slate-700 leading-relaxed mb-2">
              {experiment.control}
            </p>
            {experiment.sampleSize.control > 0 && (
              <p className="text-xs text-slate-500 font-medium">
                {experiment.sampleSize.control.toLocaleString()} users
              </p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            Variant
            <span className="text-xs font-normal text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
              Tested
            </span>
          </h3>
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4 shadow-sm min-h-[90px]">
            <p className="text-sm text-slate-900 leading-relaxed mb-2">
              {experiment.variant}
            </p>
            {experiment.sampleSize.variant > 0 && (
              <p className="text-xs text-indigo-600/70 font-medium">
                {experiment.sampleSize.variant.toLocaleString()} users
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Metrics row */}
      <div className="flex items-center gap-8 mb-6 pb-6 border-b border-slate-100">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">
            Primary Metric
          </p>
          <p className="text-sm font-mono font-medium text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md max-w-fit">
            {experiment.primaryMetric}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">
            Target Lift
          </p>
          <p className="text-xl font-semibold text-slate-900">
            +{experiment.targetLift}%
          </p>
        </div>
        {experiment.currentLift !== undefined && (
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">
              Current Lift
            </p>
            <p
              className={cn(
                "text-xl font-semibold",
                experiment.currentLift >= experiment.targetLift
                  ? "text-green-600"
                  : "text-slate-900",
              )}
            >
              +{experiment.currentLift}%
            </p>
          </div>
        )}
      </div>

      {/* Secondary metrics */}
      {experiment.secondaryMetrics &&
        experiment.secondaryMetrics.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
              Watching
            </p>
            <div className="flex flex-wrap gap-2">
              {experiment.secondaryMetrics.map((m) => (
                <span
                  key={m}
                  className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

      {/* Confidence bar */}
      {experiment.confidence !== undefined && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Statistical Confidence
            </h3>
            <div className="flex items-center gap-2">
              {experiment.status === "running" && (
                <InlineAgentButton
                  label="Is this result trustworthy?"
                  scriptId="script-exp-trust"
                  onAskAgent={onAskAgent}
                />
              )}
              <p
                className={cn(
                  "text-sm font-bold",
                  experiment.confidence >= 95
                    ? "text-green-600"
                    : experiment.confidence >= 80
                      ? "text-amber-600"
                      : "text-slate-500",
                )}
              >
                {experiment.confidence}%
              </p>
            </div>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${experiment.confidence}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                experiment.confidence >= 95
                  ? "bg-green-500"
                  : experiment.confidence >= 80
                    ? "bg-amber-400"
                    : "bg-blue-400",
              )}
            />
          </div>
          <p className="text-xs font-medium text-slate-500">
            {experiment.confidence >= 95
              ? "Statistically significant — ready to ship"
              : experiment.confidence >= 80
                ? "Getting close — continue running"
                : "Not yet significant — more data needed"}
          </p>
        </div>
      )}

      {/* Chart */}
      {experiment.currentLift !== undefined && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Metric Comparison
          </h3>
          <div className="h-[180px] border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={48}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    fontSize: "12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                  }}
                  formatter={(v: number | undefined) => [`${v ?? 0}%`, "Rate"]}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Draft: AI Config */}
      {experiment.status === "draft" && (
        <div className="mb-6 p-5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">
                AI Configuration
              </h3>
            </div>
            <InlineAgentButton
              label="Scaffold fully"
              scriptId="script-exp-scaffold"
              onAskAgent={onAskAgent}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">
                Target Sample Size
              </p>
              <p className="text-sm font-medium text-slate-900">
                3,200 per variant
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">
                Estimated Duration
              </p>
              <p className="text-sm font-medium text-slate-900">14 days</p>
            </div>
          </div>
        </div>
      )}

      {/* Significant: Ready to Ship */}
      {experiment.status === "significant" && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-emerald-800">Ready to Ship</h3>
            </div>
            <InlineAgentButton
              label="Write launch brief"
              scriptId="script-exp-launch"
              onAskAgent={onAskAgent}
            />
          </div>
          <p className="text-sm text-emerald-900 leading-relaxed">
            The variant beat the control by{" "}
            <strong className="font-semibold px-1 py-0.5 bg-emerald-100 rounded">
              +{experiment.currentLift}%
            </strong>{" "}
            on{" "}
            <span className="font-mono text-xs bg-white/60 px-1 py-0.5 rounded border border-emerald-100">
              {experiment.primaryMetric}
            </span>{" "}
            at{" "}
            <strong className="font-semibold text-emerald-700">
              {experiment.confidence}% confidence
            </strong>
            .
          </p>
          <div className="mt-4 pt-4 border-t border-emerald-200/60 text-sm text-emerald-800">
            <p>
              Ran for{" "}
              {experiment.endDate
                ? Math.round(
                    (new Date(experiment.endDate).getTime() -
                      new Date(experiment.startDate).getTime()) /
                      86400000,
                  )
                : 27}{" "}
              days with{" "}
              {(
                experiment.sampleSize.control + experiment.sampleSize.variant
              ).toLocaleString()}{" "}
              total users.
            </p>
            <p className="mt-2 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Recommendation: Roll out to 100% and monitor daily for 14 days.
            </p>
          </div>
        </div>
      )}

      {/* Inconclusive: What we learned */}
      {experiment.status === "inconclusive" && (
        <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-slate-500" />
            <h3 className="font-semibold text-slate-700">Inconclusive</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            The experiment ran to completion but did not reach statistical
            significance.{" "}
            {experiment.insight
              ? experiment.insight
              : "Consider iterating on the hypothesis before re-running."}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── LiveModePanel ─────────────────────────────────────────────────────────────

function LiveModePanel({
  runningExperiments,
  onAskAgent,
  onSelectExperiment,
}: {
  runningExperiments: Experiment[];
  onAskAgent: (scriptId: string, experimentName?: string) => void;
  onSelectExperiment: (exp: Experiment) => void;
}) {
  if (runningExperiments.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
        <Activity className="w-10 h-10 text-slate-300 mb-4" />
        <h3 className="font-semibold text-slate-700 mb-1">
          No running experiments
        </h3>
        <p className="text-sm text-slate-400 max-w-xs">
          All experiments have concluded. Switch to Archive to review results,
          or Scaffold a new test.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">
          Live experiments
        </h2>
        <p className="text-sm text-slate-500">
          {runningExperiments.length} test
          {runningExperiments.length !== 1 ? "s" : ""} currently running. Click
          any card to see full details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {runningExperiments.map((exp) => {
          const daysRunning = Math.round(
            (Date.now() - new Date(exp.startDate).getTime()) / 86400000,
          );
          const daysToSignificance = exp.confidence
            ? Math.round(
                ((95 - exp.confidence) / exp.confidence) * daysRunning * 1.4,
              )
            : null;

          return (
            <div
              key={exp.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer"
              onClick={() => onSelectExperiment(exp)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span
                    className={cn(
                      "flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full mb-2 max-w-fit",
                      statusConfig[exp.status].color,
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full animate-pulse",
                        statusConfig[exp.status].dot,
                      )}
                    />
                    Running · Day {daysRunning}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                    {exp.name}
                  </h3>
                </div>
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full border ml-2 flex-shrink-0",
                    areaColors[exp.area],
                  )}
                >
                  {exp.area}
                </span>
              </div>

              {/* Confidence bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">Confidence</span>
                  <span
                    className={cn(
                      "text-xs font-bold",
                      (exp.confidence ?? 0) >= 95
                        ? "text-green-600"
                        : (exp.confidence ?? 0) >= 80
                          ? "text-amber-600"
                          : "text-slate-500",
                    )}
                  >
                    {exp.confidence ?? 0}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${exp.confidence ?? 0}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full",
                      (exp.confidence ?? 0) >= 95
                        ? "bg-green-500"
                        : (exp.confidence ?? 0) >= 80
                          ? "bg-amber-400"
                          : "bg-blue-400",
                    )}
                  />
                </div>
              </div>

              {/* Lift stats */}
              <div className="flex items-center gap-6 mb-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                    Current lift
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    +{exp.currentLift ?? 0}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                    Target
                  </p>
                  <p className="text-base font-semibold text-slate-400">
                    +{exp.targetLift}%
                  </p>
                </div>
                {daysToSignificance !== null && (
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                      Est. days left
                    </p>
                    <p className="text-base font-semibold text-slate-900">
                      ~{Math.max(0, daysToSignificance)}
                    </p>
                  </div>
                )}
              </div>

              {/* Metric + agent button */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                  {exp.primaryMetric}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAskAgent("script-exp-trust", exp.name);
                  }}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  Is this trustworthy?
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── DecisionsModePanel ────────────────────────────────────────────────────────

type ShipDecision = "ship" | "no-ship" | "needs-more-data" | null;

function DecisionsModePanel({
  experiments: allExperiments,
  onAskAgent,
}: {
  experiments: Experiment[];
  onAskAgent: (scriptId: string, experimentName?: string) => void;
}) {
  const decisionExperiments = allExperiments.filter(
    (e) => (e.confidence ?? 0) >= 80 || e.status === "significant",
  );
  const [decisions, setDecisions] = useState<Record<string, ShipDecision>>({});

  if (decisionExperiments.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
        <GitMerge className="w-10 h-10 text-slate-300 mb-4" />
        <h3 className="font-semibold text-slate-700 mb-1">
          No decisions ready
        </h3>
        <p className="text-sm text-slate-400 max-w-xs">
          Experiments appear here once they reach 80% confidence or better.
          Check back when your running tests have more data.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">
          Decisions needed
        </h2>
        <p className="text-sm text-slate-500">
          {decisionExperiments.length} experiment
          {decisionExperiments.length !== 1 ? "s" : ""} at ≥80% confidence.
          Ship, hold, or close each one.
        </p>
      </div>

      <div className="space-y-5">
        {decisionExperiments.map((exp) => {
          const decision = decisions[exp.id] ?? null;
          return (
            <div
              key={exp.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span
                      className={cn(
                        "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
                        statusConfig[exp.status].color,
                      )}
                    >
                      {exp.status === "significant" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      {statusConfig[exp.status].label} · {exp.confidence}%
                      confidence
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full border",
                        areaColors[exp.area],
                      )}
                    >
                      {exp.area}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {exp.name}
                  </h3>
                </div>
                <InlineAgentButton
                  label="Write launch brief"
                  scriptId="script-exp-launch"
                  onAskAgent={onAskAgent}
                />
              </div>

              {/* Hypothesis */}
              <p className="text-sm text-slate-600 leading-relaxed mb-4 bg-slate-50 rounded-lg p-3 border border-slate-100">
                {exp.hypothesis}
              </p>

              {/* Lift numbers */}
              <div className="flex items-center gap-6 mb-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                    Lift achieved
                  </p>
                  <p className="text-xl font-semibold text-green-600">
                    +{exp.currentLift}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                    Target was
                  </p>
                  <p className="text-xl font-semibold text-slate-400">
                    +{exp.targetLift}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                    Primary metric
                  </p>
                  <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                    {exp.primaryMetric}
                  </span>
                </div>
              </div>

              {/* Guardrail metrics */}
              {exp.secondaryMetrics && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-xs font-semibold text-amber-800">
                      Check before shipping
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {exp.secondaryMetrics.map((m) => (
                      <span
                        key={m}
                        className="text-xs font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Decision buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 mr-1">Your call:</p>
                {[
                  {
                    key: "ship" as ShipDecision,
                    label: "Ship it",
                    color: "bg-emerald-600 hover:bg-emerald-700 text-white",
                    active:
                      "bg-emerald-700 text-white ring-2 ring-emerald-500 ring-offset-1",
                  },
                  {
                    key: "needs-more-data" as ShipDecision,
                    label: "Need more data",
                    color: "bg-amber-100 hover:bg-amber-200 text-amber-800",
                    active:
                      "bg-amber-200 text-amber-900 ring-2 ring-amber-400 ring-offset-1",
                  },
                  {
                    key: "no-ship" as ShipDecision,
                    label: "No ship",
                    color: "bg-slate-100 hover:bg-slate-200 text-slate-700",
                    active:
                      "bg-slate-200 text-slate-900 ring-2 ring-slate-400 ring-offset-1",
                  },
                ].map(({ key, label, color, active }) => (
                  <button
                    key={key}
                    onClick={() =>
                      setDecisions((d) => ({
                        ...d,
                        [exp.id]: d[exp.id] === key ? null : key,
                      }))
                    }
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                      decision === key ? active : color,
                    )}
                  >
                    {label}
                  </button>
                ))}
                {decision === "ship" && (
                  <span className="ml-auto text-xs text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Decision logged
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ScaffoldModePanel ─────────────────────────────────────────────────────────

function ScaffoldModePanel({
  allExperiments,
  onSave,
}: {
  allExperiments: Experiment[];
  onSave: (hypothesis: string) => void;
}) {
  const [input, setInput] = useState("");
  const { agentState, runLocalScript } = useLocalAgent();
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || agentState.isRunning) return;
    runLocalScript("script-exp-scaffold", input.trim());
  };

  const handleSave = () => {
    onSave(input);
    setSaved(true);
  };

  const analogExperiments = allExperiments
    .filter((e) => e.area === "onboarding" || e.status === "significant")
    .slice(0, 3);

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Scaffold a new experiment
            </h2>
          </div>
          <p className="text-sm text-slate-500 ml-10">
            Describe what you want to learn or the metric you want to move. The
            agent will pull relevant data, surface analogous past tests, and
            generate a full experiment brief.
          </p>
        </div>

        {/* Input form */}
        {!agentState.isRunning && !agentState.isComplete && (
          <form onSubmit={handleSubmit} className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              What do you want to learn?
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. I want to test whether showing social proof on the signup page increases conversions..."
              className="w-full h-28 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-3"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">
                The agent will analyze your funnel data and past experiments to
                scaffold a complete test.
              </p>
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-40 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Generate scaffold
              </button>
            </div>
          </form>
        )}

        {/* Agent trace */}
        {(agentState.isRunning || agentState.isComplete) && (
          <div className="mb-6 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium text-slate-700">
                Agent is working...
              </span>
              {agentState.isRunning && (
                <span className="flex items-center gap-1.5 ml-auto text-xs text-indigo-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  Running
                </span>
              )}
              {agentState.isComplete && (
                <span className="flex items-center gap-1.5 ml-auto text-xs text-green-600 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Done
                </span>
              )}
            </div>
            <div className="p-4 space-y-2">
              {agentState.steps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-start gap-3 p-2.5 rounded-lg border transition-all",
                    step.status === "done"
                      ? "border-green-100 bg-green-50/30"
                      : step.status === "running"
                        ? "border-indigo-100 bg-indigo-50/30"
                        : "border-slate-100 bg-white",
                  )}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {step.status === "pending" && (
                      <Circle className="w-3.5 h-3.5 text-slate-300" />
                    )}
                    {step.status === "running" && (
                      <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                    )}
                    {step.status === "done" && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-xs font-mono leading-relaxed",
                        step.status === "done"
                          ? "text-slate-600"
                          : step.status === "running"
                            ? "text-indigo-700"
                            : "text-slate-400",
                      )}
                    >
                      {step.action}
                    </p>
                    {step.status === "done" && (
                      <p className="text-xs text-green-700 mt-0.5">
                        ↳ {step.result}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated scaffold output */}
        {agentState.isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Generated experiment brief
              </h3>
              <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                {formatResponse(agentState.response)}
              </div>
            </div>

            {/* Analogous past experiments */}
            {analogExperiments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Analogous experiments in your archive
                </h3>
                <div className="space-y-2">
                  {analogExperiments.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-3"
                    >
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                          statusConfig[exp.status].color,
                        )}
                      >
                        {statusConfig[exp.status].label}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-800 truncate">
                          {exp.name}
                        </p>
                        {exp.currentLift && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            +{exp.currentLift}% lift on {exp.primaryMetric}
                          </p>
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium px-1.5 py-0.5 rounded-full border flex-shrink-0",
                          areaColors[exp.area],
                        )}
                      >
                        {exp.area}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!saved ? (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setInput("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Start over
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Save to Archive
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Saved to Archive as a draft experiment.
              </div>
            )}
          </motion.div>
        )}

        {/* Archive preview (before input) */}
        {!agentState.isRunning && !agentState.isComplete && (
          <div className="mt-10 pt-8 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">
              Archive — recent experiments for context
            </p>
            <div className="space-y-3">
              {allExperiments.slice(0, 4).map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-slate-200 transition-all"
                >
                  <div className="w-20 flex-shrink-0">
                    <span
                      className={cn(
                        "inline-block text-[10px] font-bold px-2 py-0.5 rounded-md text-center w-full",
                        statusConfig[exp.status].color,
                      )}
                    >
                      {statusConfig[exp.status].label}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {exp.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                      {exp.primaryMetric}
                    </p>
                  </div>
                  {exp.currentLift !== undefined && (
                    <div className="text-right flex-shrink-0">
                      <span
                        className={cn(
                          "text-sm font-bold",
                          exp.currentLift >= 0
                            ? "text-green-600"
                            : "text-red-500",
                        )}
                      >
                        {exp.currentLift >= 0 ? "+" : ""}
                        {exp.currentLift}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── RightAgentPanel ───────────────────────────────────────────────────────────

function RightAgentPanel({
  experiment,
  agentState,
  onRunScript,
}: {
  experiment: Experiment;
  agentState: LocalAgentState;
  onRunScript: (scriptId: string) => void;
}) {
  const [customQuery, setCustomQuery] = useState("");

  const quickActions: Record<string, { label: string; scriptId: string }[]> = {
    draft: [
      { label: "Scaffold fully", scriptId: "script-exp-scaffold" },
      { label: "Find analogous tests", scriptId: "script-exp-analogs" },
    ],
    running: [
      { label: "Is this result trustworthy?", scriptId: "script-exp-trust" },
      { label: "Find similar past tests", scriptId: "script-exp-analogs" },
    ],
    significant: [
      { label: "Write launch brief", scriptId: "script-exp-launch" },
      { label: "Find similar past tests", scriptId: "script-exp-analogs" },
    ],
    inconclusive: [
      { label: "Find similar past tests", scriptId: "script-exp-analogs" },
      { label: "Write launch brief", scriptId: "script-exp-launch" },
    ],
  };

  const chips = quickActions[experiment.status] ?? [];

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Quick action chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {chips.map((chip) => (
          <button
            key={chip.scriptId}
            onClick={() => onRunScript(chip.scriptId)}
            disabled={agentState.isRunning}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3 h-3" />
            {chip.label}
          </button>
        ))}
      </div>

      {/* Agent trace + response */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 pb-4">
        {/* Idle state */}
        {!agentState.isRunning && !agentState.isComplete && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">
              Ask about this test
            </p>
            <p className="text-[10px] text-slate-400 max-w-[200px] leading-tight">
              Use a quick action above, or type a question about this experiment
              below.
            </p>
          </div>
        )}

        {/* Step trace */}
        {(agentState.isRunning || agentState.isComplete) &&
          agentState.steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-2.5 p-2.5 rounded-lg border transition-all",
                step.status === "done"
                  ? "border-green-100 bg-green-50/30"
                  : step.status === "running"
                    ? "border-indigo-100 bg-indigo-50/30"
                    : "border-slate-100",
              )}
            >
              <div className="mt-0.5 flex-shrink-0">
                {step.status === "pending" && (
                  <Circle className="w-3.5 h-3.5 text-slate-300" />
                )}
                {step.status === "running" && (
                  <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                )}
                {step.status === "done" && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-[10px] font-mono leading-relaxed",
                    step.status === "done"
                      ? "text-slate-600"
                      : step.status === "running"
                        ? "text-indigo-700"
                        : "text-slate-400",
                  )}
                >
                  {step.action}
                </p>
                {step.status === "done" && (
                  <p className="text-[10px] text-green-700 mt-0.5">
                    ↳ {step.result}
                  </p>
                )}
              </div>
            </div>
          ))}

        {/* Synthesis indicator */}
        {agentState.isComplete && (
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-indigo-50 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span className="text-[10px] text-indigo-700 font-bold">
              Analysis complete
            </span>
          </div>
        )}

        {/* Response */}
        {agentState.isComplete && agentState.response && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
            {formatResponse(agentState.response)}
          </div>
        )}
      </div>

      {/* Custom query input */}
      <div className="pt-3 flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (customQuery.trim()) {
              onRunScript("script-exp-analogs");
              setCustomQuery("");
            }
          }}
          className="flex items-center gap-2"
        >
          <input
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="Ask agent..."
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 font-medium"
          />
          <button
            type="submit"
            disabled={!customQuery.trim() || agentState.isRunning}
            className="p-2 text-slate-400 hover:text-indigo-600 disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── ExperimentBrowseCard ─────────────────────────────────────────────────────

function ExperimentBrowseCard({
  experiment,
  onSelect,
}: {
  experiment: Experiment;
  onSelect: (exp: Experiment) => void;
}) {
  const status = statusConfig[experiment.status];
  const StatusIcon = status.icon;

  return (
    <button
      onClick={() => onSelect(experiment)}
      className="w-full text-left bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-200 hover:shadow-md transition-all duration-150 group flex flex-col"
    >
      {/* Status + area */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={cn(
            "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
            status.color,
          )}
        >
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </span>
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full border",
            areaColors[experiment.area],
          )}
        >
          {experiment.area}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-sm font-semibold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors leading-snug">
        {experiment.name}
      </h3>

      {/* Hypothesis */}
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">
        {experiment.hypothesis}
      </p>

      {/* Lift stats */}
      {experiment.currentLift !== undefined && (
        <div className="flex items-center gap-5 mb-3">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
              Lift
            </p>
            <p
              className={cn(
                "text-sm font-bold",
                experiment.currentLift >= experiment.targetLift
                  ? "text-green-600"
                  : "text-slate-700",
              )}
            >
              +{experiment.currentLift}%
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
              Target
            </p>
            <p className="text-sm font-bold text-slate-400">
              +{experiment.targetLift}%
            </p>
          </div>
        </div>
      )}

      {/* Confidence bar */}
      {experiment.confidence !== undefined && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-400">Confidence</span>
            <span
              className={cn(
                "text-[10px] font-bold",
                experiment.confidence >= 95
                  ? "text-green-600"
                  : experiment.confidence >= 80
                    ? "text-amber-600"
                    : "text-slate-500",
              )}
            >
              {experiment.confidence}%
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full",
                experiment.confidence >= 95
                  ? "bg-green-500"
                  : experiment.confidence >= 80
                    ? "bg-amber-400"
                    : "bg-blue-400",
              )}
              style={{ width: `${experiment.confidence}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
          {experiment.primaryMetric}
        </span>
        <span className="text-[10px] text-slate-400">{experiment.createdBy}</span>
      </div>
    </button>
  );
}

// ─── ExperimentBrowseView ─────────────────────────────────────────────────────

function ExperimentBrowseView({
  experiments: exps,
  allCount,
  search,
  filter,
  onSearch,
  onFilter,
  onSelect,
  onScaffold,
}: {
  experiments: Experiment[];
  allCount: number;
  search: string;
  filter: FilterStatus;
  onSearch: (v: string) => void;
  onFilter: (v: FilterStatus) => void;
  onSelect: (exp: Experiment) => void;
  onScaffold: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white h-full">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Experiments
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {allCount} experiments tracked
            </p>
          </div>
          <button
            onClick={onScaffold}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add experiment
          </button>
        </div>

        {/* Search + filter row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search experiments…"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-slate-400"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {(
              [
                "all",
                "running",
                "significant",
                "inconclusive",
                "draft",
              ] as FilterStatus[]
            ).map((f) => (
              <button
                key={f}
                onClick={() => onFilter(f)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-semibold rounded-full transition-all capitalize",
                  filter === f
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card grid */}
      <div className="flex-1 overflow-y-auto p-8">
        {exps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search className="w-10 h-10 text-slate-200 mb-4" />
            <p className="text-sm font-semibold text-slate-500">
              No experiments match
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {exps.map((exp) => (
              <ExperimentBrowseCard key={exp.id} experiment={exp} onSelect={onSelect} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ExperimentsPage() {
  const [mode, setMode] = useState<Mode>("archive");
  const [selected, setSelected] = useState<Experiment | null>(null);
  const [agentPanelOpen, setAgentPanelOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [sortBy] = useState<SortBy>("newest");
  const [allExperiments, setAllExperiments] = useState(experiments);

  const { agentState, runLocalScript, resetAgent } = useLocalAgent();

  const handleAskAgent = useCallback(
    (scriptId: string) => {
      resetAgent();
      setAgentPanelOpen(true);
      // Small delay so panel is open before script starts
      setTimeout(() => runLocalScript(scriptId), 50);
    },
    [resetAgent, runLocalScript],
  );

  // Filter + sort experiments
  const filteredExperiments = allExperiments
    .filter((e) => {
      const matchSearch =
        !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.hypothesis.toLowerCase().includes(search.toLowerCase()) ||
        e.primaryMetric.toLowerCase().includes(search.toLowerCase()) ||
        e.area.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || e.status === filter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      if (sortBy === "oldest")
        return (
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      if (sortBy === "highest-lift")
        return (b.currentLift ?? 0) - (a.currentLift ?? 0);
      if (sortBy === "most-confident")
        return (b.confidence ?? 0) - (a.confidence ?? 0);
      return 0;
    });

  const runningExperiments = allExperiments.filter(
    (e) => e.status === "running",
  );

  // Full browse mode: archive tab + no card selected
  const isBrowseMode = mode === "archive" && selected === null;

  const handleCloseDetail = useCallback(() => {
    setSelected(null);
    setMode("archive");
  }, []);

  const handleSaveScaffold = (hypothesis: string) => {
    const newExp: (typeof experiments)[0] = {
      id: `exp-${Date.now()}`,
      name: "New Experiment (Draft)",
      status: "draft",
      hypothesis,
      control: "Current experience (baseline TBD)",
      variant: "Variant TBD",
      primaryMetric: "metric_tbd",
      targetLift: 15,
      startDate: new Date().toISOString().split("T")[0],
      sampleSize: { control: 0, variant: 0 },
      createdBy: "Kevin (Agent-assisted)",
      area: "onboarding",
    };
    setAllExperiments((prev) => [newExp, ...prev]);
    setSelected(newExp);
    setMode("archive");
  };

  const modes = [
    {
      id: "archive" as Mode,
      label: "Archive",
      Icon: BookOpen,
      description: "Browse all tests",
      color: "text-blue-600",
      activeBg: "bg-blue-600",
    },
    {
      id: "live" as Mode,
      label: "Live",
      Icon: Activity,
      description: "Running now",
      color: "text-emerald-600",
      activeBg: "bg-emerald-600",
    },
    {
      id: "decisions" as Mode,
      label: "Decisions",
      Icon: GitMerge,
      description: "Ship or hold",
      color: "text-indigo-600",
      activeBg: "bg-indigo-600",
    },
    {
      id: "scaffold" as Mode,
      label: "Scaffold",
      Icon: Sparkles,
      description: "Start new test",
      color: "text-amber-600",
      activeBg: "bg-amber-600",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* ── Browse / Sidebar+Detail Layout (animated) ──────────────────────── */}
      <AnimatePresence mode="wait" initial={false}>
        {isBrowseMode ? (
          /* Full browse view — no sidebar, card grid fills the space */
          <motion.div
            key="browse-layout"
            className="flex-1 overflow-hidden flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <ExperimentBrowseView
              experiments={filteredExperiments}
              allCount={allExperiments.length}
              search={search}
              filter={filter}
              onSearch={setSearch}
              onFilter={setFilter}
              onSelect={(exp) => {
                setSelected(exp);
                setMode("archive");
              }}
              onScaffold={() => setMode("scaffold")}
            />
          </motion.div>
        ) : (
          /* Sidebar + detail / live / decisions / scaffold */
          <motion.div
            key="detail-layout"
            className="flex-1 flex overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* ── Left Panel: Sources / Experiments ──────────────────────── */}
            <div className="w-72 border-r border-slate-200 bg-white flex flex-col flex-shrink-0">
              <div className="p-4 border-b border-slate-100">
                <h1 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  Experiments
                </h1>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">
                  {allExperiments.length} Sources Connected
                </p>
              </div>

              <div className="px-3 py-3 border-b border-slate-100">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search experiments..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
                  />
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {(["all", "running", "significant"] as FilterStatus[]).map(
                    (f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                          "px-2 py-0.5 text-[9px] font-bold rounded-full transition-all uppercase tracking-tighter",
                          filter === f
                            ? "bg-slate-800 text-white"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                        )}
                      >
                        {f}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Experiment List */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="px-4 py-3">
                  <button
                    onClick={() => setMode("scaffold")}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-all mb-4"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add experiment
                  </button>

                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">
                    All Experiments
                  </p>
                  <div className="space-y-0.5 -mx-4">
                    {filteredExperiments.map((exp) => (
                      <button
                        key={exp.id}
                        onClick={() => {
                          setSelected(exp);
                          setMode("archive");
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors group",
                          selected?.id === exp.id && mode === "archive"
                            ? "bg-indigo-50/50 border-r-2 border-indigo-600"
                            : "hover:bg-slate-50",
                        )}
                      >
                        <div
                          className={cn(
                            "mt-1 w-2 h-2 rounded-full flex-shrink-0",
                            statusConfig[exp.status].dot,
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-xs font-semibold truncate",
                              selected?.id === exp.id && mode === "archive"
                                ? "text-indigo-700"
                                : "text-slate-700",
                            )}
                          >
                            {exp.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {exp.primaryMetric}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Center Panel: Main Workspace ────────────────────────────── */}
            <div className="flex-1 overflow-hidden flex flex-col relative bg-slate-50">
              <div className="h-14 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <h2 className="font-bold text-slate-900 tracking-tight">
                    {mode === "archive" && selected
                      ? selected.name
                      : modes.find((m) => m.id === mode)?.label}
                  </h2>
                  {mode === "archive" && selected && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-tighter",
                        statusConfig[selected.status].color,
                      )}
                    >
                      {statusConfig[selected.status].label}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <Search className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <Activity className="w-4 h-4" />
                  </button>
                  {mode === "archive" && selected && (
                    <button
                      onClick={handleCloseDetail}
                      title="Back to all experiments"
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  {mode === "archive" && selected && (
                    <motion.div
                      key={`archive-${selected.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="h-full"
                    >
                      <ArchiveDetailPanel
                        experiment={selected}
                        onAskAgent={handleAskAgent}
                      />
                    </motion.div>
                  )}

                  {mode === "live" && (
                    <motion.div
                      key="live"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full"
                    >
                      <LiveModePanel
                        runningExperiments={runningExperiments}
                        onAskAgent={(scriptId) => handleAskAgent(scriptId)}
                        onSelectExperiment={(exp) => {
                          setSelected(exp);
                          setMode("archive");
                        }}
                      />
                    </motion.div>
                  )}

                  {mode === "decisions" && (
                    <motion.div
                      key="decisions"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full"
                    >
                      <DecisionsModePanel
                        experiments={allExperiments}
                        onAskAgent={(scriptId) => handleAskAgent(scriptId)}
                      />
                    </motion.div>
                  )}

                  {mode === "scaffold" && (
                    <motion.div
                      key="scaffold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full"
                    >
                      <ScaffoldModePanel
                        allExperiments={allExperiments}
                        onSave={handleSaveScaffold}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Right Panel: Studio (always visible) ───────────────────────────── */}
      <div className="w-[340px] border-l border-slate-200 bg-white flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
            Studio
          </h2>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setAgentPanelOpen(!agentPanelOpen)}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                agentPanelOpen
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-slate-400 hover:bg-slate-50",
              )}
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  "flex flex-col items-start gap-2.5 p-3.5 rounded-2xl border text-left transition-all duration-200 group",
                  mode === m.id
                    ? cn(
                        "border-transparent ring-2 ring-indigo-500 ring-offset-2",
                        m.activeBg,
                        "text-white shadow-lg shadow-indigo-100",
                      )
                    : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm",
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-xl transition-colors",
                    mode === m.id
                      ? "bg-white/20 text-white"
                      : "bg-slate-50 text-slate-600 group-hover:bg-slate-100",
                  )}
                >
                  <m.Icon className="w-4 h-4" />
                </div>
                <div>
                  <p
                    className={cn(
                      "text-xs font-bold leading-none",
                      mode === m.id ? "text-white" : "text-slate-900",
                    )}
                  >
                    {m.label}
                  </p>
                  <p
                    className={cn(
                      "text-[9px] font-medium mt-1 leading-tight",
                      mode === m.id ? "text-white/80" : "text-slate-400",
                    )}
                  >
                    {m.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Agent Section inside Studio if panel open */}
          <AnimatePresence>
            {agentPanelOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-slate-100 mt-2 pt-6 overflow-hidden flex flex-col h-full min-h-0"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Agent Intelligence
                  </h3>
                  <button
                    onClick={() => resetAgent()}
                    className="text-[9px] font-bold text-indigo-600 hover:underline"
                  >
                    Clear
                  </button>
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                  {selected ? (
                    <RightAgentPanel
                      experiment={selected}
                      agentState={agentState}
                      onRunScript={handleAskAgent}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-3">
                        <Sparkles className="w-5 h-5 text-slate-300" />
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-[180px]">
                        Select an experiment to use the agent.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
