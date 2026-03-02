"use client";

import { useState } from "react";
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
import {
  FlaskConical,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  string,
  {
    label: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  running: {
    label: "Running",
    color: "bg-blue-100 text-blue-700",
    icon: Clock,
  },
  significant: {
    label: "Significant",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle2,
  },
  inconclusive: {
    label: "Inconclusive",
    color: "bg-slate-100 text-slate-600",
    icon: AlertCircle,
  },
  draft: {
    label: "Draft",
    color: "bg-amber-100 text-amber-700",
    icon: FileText,
  },
};

function ExperimentDetail({ experiment }: { experiment: Experiment }) {
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
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-3">
          <span
            className={cn(
              "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
              status.color,
            )}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {status.label}
          </span>
          <span className="text-xs text-slate-400 mt-1">
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

      {/* Overview */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">
          Hypothesis
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          {experiment.hypothesis}
        </p>
      </div>

      {/* Control vs Variant */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            Control
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              Baseline
            </span>
          </h3>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm min-h-[100px]">
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
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
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4 shadow-sm min-h-[100px]">
            <p className="text-sm text-slate-900 leading-relaxed mb-3">
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

      {/* Metrics */}
      <div className="flex items-center gap-8 mb-8 pb-8 border-b border-slate-100">
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

      {/* Confidence bar */}
      {experiment.confidence !== undefined && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Statistical Confidence
            </h3>
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
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">
            Metric Comparison
          </h3>
          <div className="h-[200px] border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
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
                  formatter={(v: number | undefined) => [
                    `${v ?? 0}%`,
                    "Completion Rate",
                  ]}
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

      {/* Draft scaffold */}
      {experiment.status === "draft" && (
        <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
              <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              AI Configuration
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                Target Sample Size
              </p>
              <p className="text-sm font-medium text-slate-900">
                3,200 per variant
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                Estimated Duration
              </p>
              <p className="text-sm font-medium text-slate-900">14 days</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                Secondary Metrics
              </p>
              <ul className="text-sm font-medium text-slate-900 list-disc list-inside space-y-1">
                <li>profile_completed_later_rate</li>
                <li>d7_retention</li>
                <li>time_to_first_action</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                Guardrail Metrics
              </p>
              <ul className="text-sm font-medium text-slate-900 list-disc list-inside space-y-1">
                <li className="flex items-center gap-2">
                  signup_to_active_rate{" "}
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-bold uppercase">
                    Must not decrease
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Significant experiment readout */}
      {experiment.status === "significant" && (
        <div className="mb-8 bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-emerald-800">Ready to Ship</h3>
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
            </strong>{" "}
            — well above the 95% threshold.
          </p>
          <div className="mt-4 pt-4 border-t border-emerald-200/60 text-sm text-emerald-800">
            <p>
              The experiment ran for 27 days with{" "}
              {(
                experiment.sampleSize.control + experiment.sampleSize.variant
              ).toLocaleString()}{" "}
              total users.
            </p>
            <p className="mt-2 text-emerald-900 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Recommendation: Roll out to 100% and monitor step-2 completion
              daily for 14 days.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function NewExperimentModal({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">New Experiment</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Describe what you want to test
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. I want to test whether reducing the number of onboarding steps increases completion rate..."
                className="w-full h-28 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-40 transition-colors flex items-center gap-2"
                >
                  <FlaskConical className="w-4 h-4" />
                  Scaffold Experiment
                </button>
              </div>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 flex items-start gap-3">
                <div className="bg-emerald-100 rounded-full p-1 mt-0.5 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-emerald-800 mb-1">
                    Experiment scaffolded successfully
                  </h3>
                  <p className="text-sm text-emerald-700 leading-relaxed">
                    Based on Amplitude data, Onboarding Step 3 has the highest
                    drop-off (41%). Given your history (reducing fields in Feb
                    2023 yielded +12%), this experiment targets a more
                    aggressive field reduction.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
                <h4 className="font-semibold text-slate-900 mb-4 text-sm">
                  Onboarding Step 3 — Reduced Fields v2
                </h4>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                      Hypothesis
                      <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[10px]">
                        AI Generated
                      </span>
                    </h5>
                    <p className="text-sm text-slate-700 bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm leading-relaxed">
                      Reducing mandatory profile fields from 7 to 3 (name, role,
                      company) and deferring the rest to an in-app prompt will
                      increase step 3 completion from 59% by at least +15%.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                        Primary Target
                      </h5>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100">
                          onboarding_step3_completed
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          +15% lift
                        </span>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                        Guardrail
                      </h5>
                      <span className="text-xs font-mono bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-100">
                        signup_to_active
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                    <div>
                      <h5 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        Sample Required
                      </h5>
                      <p className="text-sm font-medium text-slate-900">
                        ~3,200 / variant
                      </p>
                    </div>
                    <div>
                      <h5 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        Estimated Duration
                      </h5>
                      <p className="text-sm font-medium text-slate-900">
                        14 days
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Save to Experiments
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function ExperimentsPage() {
  const [selected, setSelected] = useState(experiments[0]);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Left sidebar */}
        <div className="w-72 border-r border-slate-200 bg-white flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h1 className="font-semibold text-slate-900 text-sm">
              Experiments
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {experiments.map((exp) => {
              const statusCfg = statusConfig[exp.status];
              const StatusIcon = statusCfg.icon;
              const isSelected = selected.id === exp.id;
              return (
                <button
                  key={exp.id}
                  onClick={() => setSelected(exp)}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors",
                    isSelected && "bg-indigo-50 border-l-2 border-l-indigo-500",
                  )}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={cn(
                        "flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                        statusCfg.color,
                      )}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusCfg.label}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-xs font-medium leading-snug",
                      isSelected ? "text-indigo-700" : "text-slate-700",
                    )}
                  >
                    {exp.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    {exp.primaryMetric}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {exp.startDate}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right detail panel */}
        <div className="flex-1 bg-slate-50 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="h-full"
            >
              <ExperimentDetail experiment={selected} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <NewExperimentModal onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
