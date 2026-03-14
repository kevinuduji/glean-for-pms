"use client";

import { FlaskConical, Play, CheckCircle2, Circle, AlertTriangle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceProjectStore } from "@/lib/workspace-project-store";
import { SEED_WORKSPACE_PROJECTS } from "@/lib/mock-data/workspace-projects";
import { type Experiment } from "@/lib/mock-data/experiments";

// Mock experiments scoped to a project
const MOCK_PROJECT_EXPERIMENTS: Experiment[] = [
  {
    id: "pexp-1",
    name: "Onboarding step reduction",
    status: "running",
    hypothesis:
      "Reducing onboarding from 5 to 3 steps will increase completion by 20%.",
    primaryMetric: "onboarding_completion_rate",
    targetLift: 20,
    currentLift: 11.4,
    confidence: 72,
    startDate: "2026-02-10T00:00:00.000Z",
    estimatedEndDate: "2026-03-20T00:00:00.000Z",
    sampleSize: { current: 1840, target: 3000 },
    traffic: 30,
  },
  {
    id: "pexp-2",
    name: "Contextual help tooltips",
    status: "completed",
    hypothesis:
      "Adding contextual help tooltips to complex features will reduce support tickets by 15%.",
    primaryMetric: "support_ticket_rate",
    targetLift: 15,
    currentLift: 18.7,
    confidence: 97,
    startDate: "2026-01-15T00:00:00.000Z",
    endDate: "2026-02-08T00:00:00.000Z",
    sampleSize: { current: 5200, target: 5000 },
    traffic: 50,
    keyLearning:
      "Tooltips significantly reduced confusion on the analytics dashboard.",
  },
  {
    id: "pexp-3",
    name: "Invite prompt timing",
    status: "draft",
    hypothesis:
      "Showing the invite prompt after first value moment will improve team adoption.",
    primaryMetric: "team_invite_rate",
    targetLift: 25,
    startDate: "2026-03-20T00:00:00.000Z",
    sampleSize: { current: 0, target: 2000 },
    traffic: 20,
  },
];

const statusConfig: Record<
  Experiment["status"],
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  running: {
    label: "Running",
    icon: Play,
    color: "text-blue-400",
    bg: "bg-blue-900/30 border-blue-800/50",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-900/30 border-emerald-800/50",
  },
  shipped: {
    label: "Shipped",
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-900/30 border-green-800/50",
  },
  draft: {
    label: "Draft",
    icon: Circle,
    color: "text-slate-400",
    bg: "bg-slate-800/50 border-slate-700/50",
  },
  failed: {
    label: "Failed",
    icon: AlertTriangle,
    color: "text-rose-400",
    bg: "bg-rose-900/30 border-rose-800/50",
  },
  inconclusive: {
    label: "Inconclusive",
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-900/30 border-amber-800/50",
  },
};

interface ProjectExperimentsPageProps {
  params: { id: string };
}

export default function ProjectExperimentsPage({ params }: ProjectExperimentsPageProps) {
  const { userProjects } = useWorkspaceProjectStore();
  const project =
    SEED_WORKSPACE_PROJECTS.find((p) => p.id === params.id) ??
    userProjects.find((p) => p.id === params.id);

  return (
    <div className="h-full overflow-y-auto bg-slate-950">
      <div className="max-w-3xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Experiments</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              A/B tests and feature experiments in{" "}
              <span className="text-slate-400">{project?.name ?? params.id}</span>
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold rounded-xl transition-colors">
            <Plus className="w-4 h-4" />
            New experiment
          </button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              label: "Running",
              count: MOCK_PROJECT_EXPERIMENTS.filter((e) => e.status === "running").length,
              color: "text-blue-400",
            },
            {
              label: "Completed",
              count: MOCK_PROJECT_EXPERIMENTS.filter((e) => e.status === "completed").length,
              color: "text-emerald-400",
            },
            {
              label: "Draft",
              count: MOCK_PROJECT_EXPERIMENTS.filter((e) => e.status === "draft").length,
              color: "text-slate-400",
            },
          ].map(({ label, count, color }) => (
            <div
              key={label}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4"
            >
              <div className={cn("text-2xl font-bold mb-0.5", color)}>{count}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>

        {/* Experiments list */}
        <div className="space-y-3">
          {MOCK_PROJECT_EXPERIMENTS.map((exp) => {
            const status = statusConfig[exp.status];
            const StatusIcon = status.icon;
            const progressPct =
              exp.sampleSize.target > 0
                ? Math.min(100, Math.round((exp.sampleSize.current / exp.sampleSize.target) * 100))
                : 0;

            return (
              <div
                key={exp.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-200 mb-0.5">
                      {exp.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {exp.hypothesis}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold flex-shrink-0",
                      status.bg,
                      status.color
                    )}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </div>
                </div>

                {/* Metrics row */}
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <span>
                    Target:{" "}
                    <span className="text-slate-300 font-medium">
                      +{exp.targetLift}%
                    </span>
                  </span>
                  {exp.currentLift != null && (
                    <span>
                      Current:{" "}
                      <span
                        className={cn(
                          "font-medium",
                          exp.currentLift >= exp.targetLift
                            ? "text-emerald-400"
                            : "text-indigo-400"
                        )}
                      >
                        +{exp.currentLift}%
                      </span>
                    </span>
                  )}
                  {exp.confidence != null && (
                    <span>
                      Confidence:{" "}
                      <span className="text-slate-300 font-medium">
                        {exp.confidence}%
                      </span>
                    </span>
                  )}
                </div>

                {/* Progress bar (for running) */}
                {exp.status === "running" && (
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span>Sample progress</span>
                      <span>
                        {exp.sampleSize.current.toLocaleString()} /{" "}
                        {exp.sampleSize.target.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                )}

                {exp.keyLearning && (
                  <div className="mt-3 pt-3 border-t border-slate-800">
                    <p className="text-xs text-slate-400">
                      <span className="text-slate-500 font-medium">
                        Key learning:{" "}
                      </span>
                      {exp.keyLearning}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
