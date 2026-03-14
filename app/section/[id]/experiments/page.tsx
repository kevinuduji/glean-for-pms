"use client";

import { FlaskConical, Play, CheckCircle2, FileEdit, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSectionStore } from "@/lib/section-store";

type ExperimentStatus = "running" | "completed" | "draft";

const STATUS_CONFIG: Record<
  ExperimentStatus,
  { label: string; badge: string; icon: React.ElementType; iconColor: string }
> = {
  running: {
    label: "Running",
    badge: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    icon: Play,
    iconColor: "text-indigo-400",
  },
  completed: {
    label: "Completed",
    badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    icon: CheckCircle2,
    iconColor: "text-emerald-400",
  },
  draft: {
    label: "Draft",
    badge: "bg-slate-700 text-slate-400 border border-slate-600",
    icon: FileEdit,
    iconColor: "text-slate-400",
  },
};

// Mock experiments — shown for every section (in a real app, scoped by sectionId)
const MOCK_EXPERIMENTS = [
  {
    id: "e1",
    name: "CTA Copy Variant B",
    hypothesis: "Changing the primary CTA from 'Get Started' to 'See Your Dashboard' will improve click-through by 15%.",
    status: "running" as ExperimentStatus,
    startDate: "Mar 1, 2026",
    variant_a: "Get Started",
    variant_b: "See Your Dashboard",
    confidence: 78,
    uplift: "+9.2%",
  },
  {
    id: "e2",
    name: "Onboarding Step Reorder",
    hypothesis: "Moving the integrations step earlier reduces drop-off by surfacing value faster.",
    status: "completed" as ExperimentStatus,
    startDate: "Feb 10, 2026",
    variant_a: "Original order",
    variant_b: "Integrations first",
    confidence: 96,
    uplift: "+14.7%",
  },
  {
    id: "e3",
    name: "Progressive Disclosure Modal",
    hypothesis: "Replacing the full-form modal with a 3-step progressive flow increases completion.",
    status: "draft" as ExperimentStatus,
    startDate: "—",
    variant_a: "Full form",
    variant_b: "3-step wizard",
    confidence: null,
    uplift: null,
  },
];

export default function SectionExperimentsPage({ params }: { params: { id: string } }) {
  const { getActiveSection } = useSectionStore();
  const section = getActiveSection();

  return (
    <div className="bg-slate-950 h-full overflow-y-auto">
      <div className="px-8 py-8 max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[18px] font-bold text-slate-100">Experiments</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              A/B tests and hypothesis tracking for {section?.name ?? "this section"}
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold rounded-lg transition-colors">
            <FlaskConical className="w-3.5 h-3.5" />
            New Experiment
          </button>
        </div>

        {/* Experiment cards */}
        <div className="space-y-4">
          {MOCK_EXPERIMENTS.map((exp) => {
            const cfg = STATUS_CONFIG[exp.status];
            const StatusIcon = cfg.icon;
            return (
              <div
                key={exp.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors"
              >
                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <StatusIcon className={cn("w-4 h-4 flex-shrink-0", cfg.iconColor)} />
                    <span className="text-[14px] font-semibold text-slate-100">{exp.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {exp.status === "running" && (
                      <div className="text-[12px] text-slate-400">
                        Confidence: <span className="text-indigo-400 font-semibold">{exp.confidence}%</span>
                      </div>
                    )}
                    {exp.status === "completed" && exp.uplift && (
                      <div className="flex items-center gap-1 text-emerald-400 text-[12px] font-semibold">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {exp.uplift}
                      </div>
                    )}
                    <span className={cn("text-[11px] font-semibold px-2 py-1 rounded-md", cfg.badge)}>
                      {cfg.label}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="px-5 py-4 space-y-3">
                  <p className="text-[13px] text-slate-400 leading-relaxed">{exp.hypothesis}</p>

                  <div className="flex items-center gap-6 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-600 uppercase tracking-wide font-bold">Control</span>
                      <p className="text-[12px] text-slate-300 mt-0.5">{exp.variant_a}</p>
                    </div>
                    <div className="text-slate-700 text-lg font-light">vs</div>
                    <div>
                      <span className="text-[10px] text-slate-600 uppercase tracking-wide font-bold">Variant</span>
                      <p className="text-[12px] text-slate-300 mt-0.5">{exp.variant_b}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="text-[10px] text-slate-600 uppercase tracking-wide font-bold">Started</span>
                      <p className="text-[12px] text-slate-400 mt-0.5">{exp.startDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
