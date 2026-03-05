"use client";

import { useState, useMemo } from "react";
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
import {
  FlaskConical,
  Play,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  Target,
  Sparkles,
  Plus,
  BarChart3,
  AlertCircle,
  ArrowLeft,
  Lightbulb,
  Zap,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Calendar,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InsightCard } from "@/components/ui/InsightCard";
import { ActionButton } from "@/components/ui/ActionButton";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface CohortData {
  name: string;
  users: number;
  conversionRate: number;
  avgSessionDuration: string;
  primaryMetricValue: number;
}

interface Experiment {
  id: string;
  name: string;
  status: "draft" | "running" | "completed" | "shipped" | "failed" | "inconclusive";
  hypothesis: string;
  primaryMetric: string;
  targetLift: number;
  currentLift?: number;
  confidence?: number;
  startDate: string;
  estimatedEndDate?: string;
  endDate?: string;
  sampleSize: {
    current: number;
    target: number;
  };
  traffic: number;
  source?: string;
  expectedOutcome?: string;
  cohorts?: CohortData[];
  keyLearning?: string;
  nextActions?: string[];
  businessImpact?: {
    revenue?: number;
    users?: number;
    metric?: string;
  };
}

interface ExperimentIdea {
  id: string;
  title: string;
  description: string;
  source: "discover" | "ai" | "manual";
  priority: "high" | "medium" | "low";
  estimatedImpact: number;
  confidence: number;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────────

const mockActiveExperiments: Experiment[] = [
  {
    id: "exp-1",
    name: "Social Proof on Signup Page",
    status: "running",
    hypothesis:
      "Adding customer testimonials to the signup page will increase conversion by showing social proof and reducing hesitation.",
    primaryMetric: "signup_conversion_rate",
    targetLift: 10,
    currentLift: 12.3,
    confidence: 87,
    startDate: "2026-02-20",
    estimatedEndDate: "2026-03-06",
    expectedOutcome:
      "We expect to see a measurable increase in signup completions, particularly from first-time visitors.",
    sampleSize: { current: 2400, target: 3200 },
    traffic: 50,
    source: "AI Recommendation from Discover",
    cohorts: [
      {
        name: "Control",
        users: 1200,
        conversionRate: 4.2,
        avgSessionDuration: "2m 14s",
        primaryMetricValue: 4.2,
      },
      {
        name: "Variant A — Testimonials",
        users: 800,
        conversionRate: 4.7,
        avgSessionDuration: "2m 48s",
        primaryMetricValue: 4.7,
      },
      {
        name: "Variant B — Logos + Testimonials",
        users: 400,
        conversionRate: 5.1,
        avgSessionDuration: "3m 02s",
        primaryMetricValue: 5.1,
      },
    ],
  },
  {
    id: "exp-2",
    name: "Simplified Checkout Flow",
    status: "running",
    hypothesis:
      "Reducing checkout steps from 4 to 2 will decrease abandonment and improve completion rates.",
    primaryMetric: "checkout_completion_rate",
    targetLift: 15,
    currentLift: 8.1,
    confidence: 34,
    startDate: "2026-02-25",
    estimatedEndDate: "2026-03-11",
    expectedOutcome:
      "Fewer steps should reduce cognitive load and cart abandonment, leading to higher completion rates.",
    sampleSize: { current: 890, target: 2800 },
    traffic: 25,
    cohorts: [
      {
        name: "Control — 4-step",
        users: 445,
        conversionRate: 62.1,
        avgSessionDuration: "4m 32s",
        primaryMetricValue: 62.1,
      },
      {
        name: "Variant — 2-step",
        users: 445,
        conversionRate: 67.1,
        avgSessionDuration: "2m 18s",
        primaryMetricValue: 67.1,
      },
    ],
  },
  {
    id: "exp-3",
    name: "Mobile-First Pricing Page",
    status: "running",
    hypothesis:
      "Redesigning pricing page for mobile-first experience will improve mobile conversion rates.",
    primaryMetric: "mobile_conversion_rate",
    targetLift: 20,
    currentLift: 5.2,
    confidence: 28,
    startDate: "2026-02-15",
    expectedOutcome:
      "Mobile users should find it easier to compare plans and select one, increasing mobile-specific conversions.",
    sampleSize: { current: 1200, target: 2000 },
    traffic: 30,
    cohorts: [
      {
        name: "Control",
        users: 600,
        conversionRate: 2.1,
        avgSessionDuration: "1m 45s",
        primaryMetricValue: 2.1,
      },
      {
        name: "Variant — Mobile-first",
        users: 600,
        conversionRate: 2.2,
        avgSessionDuration: "2m 10s",
        primaryMetricValue: 2.2,
      },
    ],
  },
];

const mockExperimentQueue: Experiment[] = [
  {
    id: "queue-1",
    name: "Onboarding Tutorial Redesign",
    status: "draft",
    hypothesis:
      "Interactive tutorial will improve activation rates by helping users understand core features faster.",
    primaryMetric: "activation_rate",
    targetLift: 25,
    startDate: "2026-03-10",
    expectedOutcome:
      "Users who go through the interactive tutorial should activate within the first session at a higher rate.",
    sampleSize: { current: 0, target: 2500 },
    traffic: 50,
    source: "Discover Hub - User Friction",
  },
  {
    id: "queue-2",
    name: "Personalized Dashboard",
    status: "draft",
    hypothesis:
      "Showing personalized content based on user role will increase engagement and feature adoption.",
    primaryMetric: "daily_active_usage",
    targetLift: 18,
    startDate: "2026-03-15",
    expectedOutcome:
      "Role-based personalization should surface relevant features, increasing daily return rates.",
    sampleSize: { current: 0, target: 3000 },
    traffic: 40,
  },
];

const mockExperimentIdeas: ExperimentIdea[] = [
  {
    id: "idea-1",
    title: "Email Subject Line Optimization",
    description:
      "Test personalized vs. generic subject lines for onboarding emails",
    source: "ai",
    priority: "high",
    estimatedImpact: 800,
    confidence: 78,
  },
  {
    id: "idea-2",
    title: "Feature Discovery Modal",
    description:
      "Add contextual tooltips to help users discover advanced features",
    source: "discover",
    priority: "medium",
    estimatedImpact: 1200,
    confidence: 65,
  },
  {
    id: "idea-3",
    title: "Pricing Tier Simplification",
    description:
      "Reduce from 4 pricing tiers to 3 to decrease decision paralysis",
    source: "discover",
    priority: "high",
    estimatedImpact: 600,
    confidence: 82,
  },
];

const mockArchivedExperiments: Experiment[] = [
  {
    id: "archive-1",
    name: "Social Proof on Signup Page",
    status: "shipped",
    hypothesis:
      "Adding customer testimonials will increase signup conversion by building trust and reducing hesitation.",
    primaryMetric: "signup_conversion_rate",
    targetLift: 10,
    currentLift: 15.3,
    confidence: 97,
    startDate: "2026-01-20",
    endDate: "2026-02-02",
    sampleSize: { current: 3200, target: 3200 },
    traffic: 50,
    businessImpact: {
      revenue: 24000,
      users: 480,
      metric: "Monthly signups increased by 480 users",
    },
    keyLearning:
      "Social proof works exceptionally well for B2B SaaS. Testimonials from recognizable companies had 2x impact of generic reviews.",
    nextActions: [
      "Test different testimonial formats (video vs text)",
      "Add social proof to pricing page",
      "Implement dynamic testimonials based on visitor industry",
    ],
    cohorts: [
      {
        name: "Control",
        users: 1600,
        conversionRate: 4.2,
        avgSessionDuration: "2m 10s",
        primaryMetricValue: 4.2,
      },
      {
        name: "Variant A — Customer Logos",
        users: 800,
        conversionRate: 4.5,
        avgSessionDuration: "2m 22s",
        primaryMetricValue: 4.5,
      },
      {
        name: "Variant B — Full Testimonials",
        users: 800,
        conversionRate: 4.8,
        avgSessionDuration: "2m 55s",
        primaryMetricValue: 4.8,
      },
    ],
  },
  {
    id: "archive-2",
    name: "Simplified Checkout Flow v1",
    status: "failed",
    hypothesis:
      "Reducing checkout steps from 4 to 2 will decrease abandonment and improve completion rates.",
    primaryMetric: "checkout_completion_rate",
    targetLift: 15,
    currentLift: -3.2,
    confidence: 89,
    startDate: "2026-01-25",
    endDate: "2026-02-05",
    sampleSize: { current: 2800, target: 2800 },
    traffic: 50,
    keyLearning:
      "Users actually prefer more steps when purchasing high-value items. The removed confirmation step caused anxiety about accidental purchases.",
    nextActions: [
      "Test 3-step flow as middle ground",
      "Add progress indicators to current 4-step flow",
      "A/B test different confirmation messaging",
    ],
    cohorts: [
      {
        name: "Control — 4-step",
        users: 1400,
        conversionRate: 68.5,
        avgSessionDuration: "4m 12s",
        primaryMetricValue: 68.5,
      },
      {
        name: "Variant — 2-step",
        users: 1400,
        conversionRate: 66.3,
        avgSessionDuration: "2m 05s",
        primaryMetricValue: 66.3,
      },
    ],
  },
  {
    id: "archive-3",
    name: "Mobile-First Pricing Page v1",
    status: "inconclusive",
    hypothesis:
      "Redesigning pricing page for mobile-first experience will improve mobile conversion rates.",
    primaryMetric: "mobile_conversion_rate",
    targetLift: 20,
    currentLift: 8.7,
    confidence: 72,
    startDate: "2026-01-15",
    endDate: "2026-02-01",
    sampleSize: { current: 1800, target: 1800 },
    traffic: 50,
    keyLearning:
      "Mobile improvements helped but didn't reach statistical significance. Need larger sample size and longer test duration.",
    nextActions: [
      "Re-run test with 50% more traffic allocation",
      "Test mobile-specific pricing tiers",
      "Analyze mobile user behavior patterns",
    ],
    cohorts: [
      {
        name: "Control",
        users: 900,
        conversionRate: 2.1,
        avgSessionDuration: "1m 38s",
        primaryMetricValue: 2.1,
      },
      {
        name: "Variant — Mobile-first",
        users: 900,
        conversionRate: 2.3,
        avgSessionDuration: "2m 04s",
        primaryMetricValue: 2.3,
      },
    ],
  },
];

// ─── Status Configs ─────────────────────────────────────────────────────────────

const statusConfig = {
  draft: {
    label: "Draft",
    color: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-200",
    icon: FlaskConical,
  },
  running: {
    label: "Running",
    color: "text-blue-600",
    bg: "bg-blue-100",
    border: "border-blue-200",
    icon: Play,
  },
  completed: {
    label: "Completed",
    color: "text-green-600",
    bg: "bg-green-100",
    border: "border-green-200",
    icon: CheckCircle2,
  },
  shipped: {
    label: "Shipped",
    color: "text-green-600",
    bg: "bg-green-100",
    border: "border-green-200",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    color: "text-red-600",
    bg: "bg-red-100",
    border: "border-red-200",
    icon: XCircle,
  },
  inconclusive: {
    label: "Inconclusive",
    color: "text-amber-600",
    bg: "bg-amber-100",
    border: "border-amber-200",
    icon: AlertTriangle,
  },
};

// ─── Experiment Detail View ─────────────────────────────────────────────────────

function ExperimentDetail({
  experiment,
  onBack,
}: {
  experiment: Experiment;
  onBack: () => void;
}) {
  const config = statusConfig[experiment.status];
  const daysRunning = Math.floor(
    (Date.now() - new Date(experiment.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const testDuration = experiment.endDate
    ? Math.floor(
        (new Date(experiment.endDate).getTime() -
          new Date(experiment.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : daysRunning;

  const chartData = experiment.cohorts?.map((cohort) => ({
    name: cohort.name.length > 20 ? cohort.name.slice(0, 20) + "…" : cohort.name,
    value: cohort.primaryMetricValue,
    users: cohort.users,
    fill:
      cohort.name.toLowerCase().includes("control")
        ? "#94a3b8"
        : cohort.name.includes("Variant B") || cohort.name.includes("Variant C")
          ? "#818cf8"
          : "#6366f1",
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full overflow-y-auto"
    >
      {/* Back Button & Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Experiments
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {experiment.name}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border",
                  config.bg,
                  config.border,
                  config.color
                )}
              >
                <config.icon className="w-3 h-3" />
                {config.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {experiment.endDate
                  ? `${testDuration} day test`
                  : `Day ${daysRunning}`}
              </span>
              <span>
                {experiment.sampleSize.current.toLocaleString()} /{" "}
                {experiment.sampleSize.target.toLocaleString()} users
              </span>
              {experiment.traffic && (
                <span>{experiment.traffic}% traffic allocation</span>
              )}
            </div>
          </div>

          {experiment.confidence !== undefined && (
            <div className="text-right">
              <div
                className={cn(
                  "text-3xl font-bold",
                  experiment.confidence >= 95
                    ? "text-green-600"
                    : experiment.confidence >= 80
                      ? "text-amber-600"
                      : "text-slate-400"
                )}
              >
                {experiment.confidence}%
              </div>
              <div className="text-xs text-slate-500">confidence</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 max-w-6xl mx-auto space-y-8">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Primary Metric
            </div>
            <div className="font-mono text-sm font-semibold text-slate-800 bg-slate-50 px-3 py-1.5 rounded-lg inline-block">
              {experiment.primaryMetric}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Target Lift
            </div>
            <div className="text-2xl font-bold text-slate-900">
              +{experiment.targetLift}%
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Current Lift
            </div>
            <div
              className={cn(
                "text-2xl font-bold",
                experiment.currentLift !== undefined
                  ? experiment.currentLift >= experiment.targetLift
                    ? "text-green-600"
                    : experiment.currentLift >= 0
                      ? "text-slate-900"
                      : "text-red-600"
                  : "text-slate-300"
              )}
            >
              {experiment.currentLift !== undefined
                ? `${experiment.currentLift >= 0 ? "+" : ""}${experiment.currentLift}%`
                : "—"}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Sample Progress
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {Math.round(
                (experiment.sampleSize.current / experiment.sampleSize.target) *
                  100
              )}
              %
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (experiment.sampleSize.current / experiment.sampleSize.target) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Hypothesis & Expected Outcome */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-500" />
              Hypothesis
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {experiment.hypothesis}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Expected Outcome
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {experiment.expectedOutcome || "No expected outcome defined yet."}
            </p>
          </div>
        </div>

        {/* Cohort / Test Group Breakdown */}
        {experiment.cohorts && experiment.cohorts.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-5 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              Test Cohorts
            </h3>

            {/* Chart */}
            {chartData && (
              <div className="h-[220px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={56}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      cursor={{ fill: "#f8fafc" }}
                      contentStyle={{
                        fontSize: "12px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                      }}
                      formatter={(v: number) => [`${v}%`, "Conversion"]}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Cohort Table */}
            <div className="border border-slate-100 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Cohort
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Users
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Conversion
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Avg Session
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {experiment.cohorts.map((cohort, i) => (
                    <tr
                      key={i}
                      className={cn(
                        "border-b border-slate-50 last:border-0",
                        i === 0 ? "bg-white" : "bg-indigo-50/20"
                      )}
                    >
                      <td className="px-4 py-3 font-medium text-slate-800">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-2.5 h-2.5 rounded-full flex-shrink-0",
                              i === 0
                                ? "bg-slate-400"
                                : i === 1
                                  ? "bg-indigo-500"
                                  : "bg-indigo-300"
                            )}
                          />
                          {cohort.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {cohort.users.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={cn(
                            "font-semibold",
                            i > 0 &&
                              cohort.conversionRate >
                                experiment.cohorts![0].conversionRate
                              ? "text-green-600"
                              : "text-slate-800"
                          )}
                        >
                          {cohort.conversionRate}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {cohort.avgSessionDuration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Confidence Bar (for running experiments) */}
        {experiment.confidence !== undefined && experiment.status === "running" && (
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Statistical Confidence
              </h3>
              <span
                className={cn(
                  "text-sm font-bold",
                  experiment.confidence >= 95
                    ? "text-green-600"
                    : experiment.confidence >= 80
                      ? "text-amber-600"
                      : "text-slate-500"
                )}
              >
                {experiment.confidence}%
              </span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
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
                      : "bg-blue-400"
                )}
              />
            </div>
            <p className="text-xs text-slate-500">
              {experiment.confidence >= 95
                ? "Statistically significant — ready to ship"
                : experiment.confidence >= 80
                  ? "Getting close — continue running"
                  : "Not yet significant — more data needed"}
            </p>
          </div>
        )}

        {/* Key Learning (for archived experiments) */}
        {experiment.keyLearning && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-900">
                Key Learning
              </h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {experiment.keyLearning}
            </p>
          </div>
        )}

        {/* Next Actions */}
        {experiment.nextActions && experiment.nextActions.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Suggested Next Actions
            </h3>
            <div className="space-y-2">
              {experiment.nextActions.map((action, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-slate-700"
                >
                  <ArrowRight className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  {action}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Business Impact (for shipped experiments) */}
        {experiment.businessImpact && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-green-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Business Impact
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {experiment.businessImpact.revenue && (
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    ${(experiment.businessImpact.revenue / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-green-600">Revenue Impact</div>
                </div>
              )}
              {experiment.businessImpact.users && (
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    +{experiment.businessImpact.users}
                  </div>
                  <div className="text-xs text-green-600">Users Gained</div>
                </div>
              )}
              {experiment.businessImpact.metric && (
                <div className="col-span-1">
                  <div className="text-sm font-medium text-green-700">
                    {experiment.businessImpact.metric}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export default function ExperimentsPage() {
  const [selectedTab, setSelectedTab] = useState<
    "active" | "queue" | "ideas" | "archive"
  >("active");
  const [selectedExperiment, setSelectedExperiment] =
    useState<Experiment | null>(null);
  const [showAIDesigner, setShowAIDesigner] = useState(false);
  const [aiInput, setAiInput] = useState("");

  const stats = useMemo(() => {
    const running = mockActiveExperiments.filter(
      (exp) => exp.status === "running"
    ).length;
    const avgConfidence =
      mockActiveExperiments
        .filter((exp) => exp.confidence)
        .reduce((sum, exp) => sum + (exp.confidence || 0), 0) /
      mockActiveExperiments.filter((exp) => exp.confidence).length;
    const totalIdeas =
      mockExperimentQueue.length + mockExperimentIdeas.length;

    return {
      running,
      avgConfidence: Math.round(avgConfidence),
      totalIdeas,
    };
  }, []);

  function handleViewExperiment(experiment: Experiment) {
    setSelectedExperiment(experiment);
  }

  function handleDesignExperiment(idea: ExperimentIdea) {
    console.log("Designing experiment for:", idea.title);
    setShowAIDesigner(true);
  }

  function handleGenerateExperiment() {
    if (!aiInput.trim()) return;
    console.log("Generating experiment for:", aiInput);
    setAiInput("");
    setShowAIDesigner(false);
  }

  const tabs = [
    {
      id: "active" as const,
      label: "Active Tests",
      count: mockActiveExperiments.length,
    },
    {
      id: "queue" as const,
      label: "Queue",
      count: mockExperimentQueue.length,
    },
    {
      id: "ideas" as const,
      label: "Ideas",
      count: mockExperimentIdeas.length,
    },
    {
      id: "archive" as const,
      label: "Archive",
      count: mockArchivedExperiments.length,
    },
  ];

  if (selectedExperiment) {
    return (
      <div className="h-full bg-slate-50 overflow-hidden flex flex-col">
        <ExperimentDetail
          experiment={selectedExperiment}
          onBack={() => setSelectedExperiment(null)}
        />
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Experiments
            </h1>
            <p className="text-slate-500 mt-1">
              Track and analyze your product experiments
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.running}
              </div>
              <div className="text-xs text-slate-500">Running Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {stats.avgConfidence}%
              </div>
              <div className="text-xs text-slate-500">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {stats.totalIdeas}
              </div>
              <div className="text-xs text-slate-500">Ideas in Pipeline</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                selectedTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              {tab.label}
              <span className="ml-2 text-xs opacity-75">({tab.count})</span>
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <ActionButton
              icon={Sparkles}
              variant="secondary"
              size="sm"
              onClick={() => setShowAIDesigner(true)}
            >
              AI Designer
            </ActionButton>
            <ActionButton
              icon={Plus}
              variant="primary"
              size="sm"
              onClick={() => console.log("New experiment")}
            >
              New Experiment
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Active Tests */}
            {selectedTab === "active" && (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {mockActiveExperiments.map((experiment) => {
                  const config = statusConfig[experiment.status];
                  const progress =
                    (experiment.sampleSize.current /
                      experiment.sampleSize.target) *
                    100;
                  const daysRunning = Math.floor(
                    (Date.now() -
                      new Date(experiment.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  );

                  return (
                    <InsightCard
                      key={experiment.id}
                      title={experiment.name}
                      description={experiment.hypothesis}
                      priority={
                        experiment.confidence && experiment.confidence >= 95
                          ? "high"
                          : "medium"
                      }
                      source={experiment.source || "Manual"}
                      timestamp={`Day ${daysRunning}`}
                      icon={config.icon}
                      className="hover:shadow-lg cursor-pointer"
                      actions={
                        <div className="flex items-center gap-2 w-full">
                          <ActionButton
                            icon={Eye}
                            variant="primary"
                            size="sm"
                            onClick={() => handleViewExperiment(experiment)}
                          >
                            View Experiment
                          </ActionButton>

                          <div className="ml-auto text-xs text-slate-500">
                            {experiment.sampleSize.current.toLocaleString()} /{" "}
                            {experiment.sampleSize.target.toLocaleString()} users
                          </div>
                        </div>
                      }
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border",
                              config.bg,
                              config.border,
                              config.color
                            )}
                          >
                            <config.icon className="w-3 h-3" />
                            {config.label}
                          </span>

                          {experiment.confidence && (
                            <span
                              className={cn(
                                "text-xs font-semibold",
                                experiment.confidence >= 95
                                  ? "text-green-600"
                                  : experiment.confidence >= 80
                                    ? "text-amber-600"
                                    : "text-slate-500"
                              )}
                            >
                              {experiment.confidence}% confidence
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="text-slate-500">
                              Primary Metric
                            </span>
                            <div className="font-mono bg-slate-100 px-2 py-1 rounded mt-1">
                              {experiment.primaryMetric}
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-500">Target Lift</span>
                            <div className="font-semibold text-slate-900 mt-1">
                              +{experiment.targetLift}%
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-500">
                              Current Lift
                            </span>
                            <div
                              className={cn(
                                "font-semibold mt-1",
                                experiment.currentLift &&
                                  experiment.currentLift >=
                                    experiment.targetLift
                                  ? "text-green-600"
                                  : "text-slate-900"
                              )}
                            >
                              {experiment.currentLift
                                ? `+${experiment.currentLift}%`
                                : "—"}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span>Sample Size Progress</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              className="h-full bg-indigo-500 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </InsightCard>
                  );
                })}
              </motion.div>
            )}

            {/* Queue */}
            {selectedTab === "queue" && (
              <motion.div
                key="queue"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {mockExperimentQueue.map((experiment) => (
                  <InsightCard
                    key={experiment.id}
                    title={experiment.name}
                    description={experiment.hypothesis}
                    priority="medium"
                    source={experiment.source || "Manual"}
                    timestamp={`Scheduled for ${experiment.startDate}`}
                    icon={FlaskConical}
                    actions={
                      <div className="flex items-center gap-2 w-full">
                        <ActionButton
                          icon={Eye}
                          variant="primary"
                          size="sm"
                          onClick={() => handleViewExperiment(experiment)}
                        >
                          View Details
                        </ActionButton>
                        <ActionButton
                          variant="secondary"
                          size="sm"
                          onClick={() => console.log("Edit experiment")}
                        >
                          Edit
                        </ActionButton>

                        <div className="ml-auto text-xs text-slate-500">
                          Target:{" "}
                          {experiment.sampleSize.target.toLocaleString()} users
                        </div>
                      </div>
                    }
                  >
                    <div className="flex items-center gap-4 text-xs">
                      <span className="font-mono bg-slate-100 px-2 py-1 rounded">
                        {experiment.primaryMetric}
                      </span>
                      <span className="text-slate-500">
                        Target: +{experiment.targetLift}%
                      </span>
                      <span className="text-slate-500">
                        Traffic: {experiment.traffic}%
                      </span>
                    </div>
                  </InsightCard>
                ))}
              </motion.div>
            )}

            {/* Ideas */}
            {selectedTab === "ideas" && (
              <motion.div
                key="ideas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {mockExperimentIdeas.map((idea) => (
                  <InsightCard
                    key={idea.id}
                    title={idea.title}
                    description={idea.description}
                    priority={idea.priority as "high" | "medium" | "low"}
                    source={
                      idea.source === "discover"
                        ? "From Discover Hub"
                        : "AI Generated"
                    }
                    icon={idea.source === "ai" ? Sparkles : Lightbulb}
                    actions={
                      <div className="flex items-center gap-2 w-full">
                        <ActionButton
                          icon={Zap}
                          variant="primary"
                          size="sm"
                          onClick={() => handleDesignExperiment(idea)}
                        >
                          Design Experiment
                        </ActionButton>
                        <ActionButton
                          variant="ghost"
                          size="sm"
                          onClick={() => console.log("Dismiss idea")}
                        >
                          Dismiss
                        </ActionButton>

                        <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
                          <Users className="w-3 h-3" />
                          {idea.estimatedImpact.toLocaleString()}
                          <span className="ml-2">
                            {idea.confidence}% confidence
                          </span>
                        </div>
                      </div>
                    }
                  />
                ))}
              </motion.div>
            )}

            {/* Archive */}
            {selectedTab === "archive" && (
              <motion.div
                key="archive"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {mockArchivedExperiments.map((result) => {
                  const config = statusConfig[result.status];
                  const testDuration = result.endDate
                    ? Math.floor(
                        (new Date(result.endDate).getTime() -
                          new Date(result.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    : 0;

                  return (
                    <InsightCard
                      key={result.id}
                      title={result.name}
                      description={result.hypothesis}
                      priority={
                        result.status === "shipped"
                          ? "high"
                          : result.status === "failed"
                            ? "low"
                            : "medium"
                      }
                      source={`${testDuration} day test • ${result.sampleSize.current.toLocaleString()} users`}
                      timestamp={`Ended ${result.endDate}`}
                      icon={config.icon}
                      className="hover:shadow-lg cursor-pointer"
                      actions={
                        <div className="flex items-center gap-2 w-full">
                          <ActionButton
                            icon={Eye}
                            variant="primary"
                            size="sm"
                            onClick={() => handleViewExperiment(result)}
                          >
                            View Results
                          </ActionButton>
                          <ActionButton
                            icon={Zap}
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              console.log("Plan next test:", result.name)
                            }
                          >
                            Plan Next Test
                          </ActionButton>

                          {result.businessImpact && (
                            <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
                              {result.businessImpact.revenue && (
                                <span className="flex items-center gap-1 text-green-600 font-semibold">
                                  $
                                  {(
                                    result.businessImpact.revenue / 1000
                                  ).toFixed(0)}
                                  K
                                </span>
                              )}
                              {result.businessImpact.users && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />+
                                  {result.businessImpact.users}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      }
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border",
                              config.bg,
                              config.border,
                              config.color
                            )}
                          >
                            <config.icon className="w-3 h-3" />
                            {config.label}
                          </span>

                          <div className="flex items-center gap-4 text-xs">
                            <span className="font-mono bg-slate-100 px-2 py-1 rounded">
                              {result.primaryMetric}
                            </span>
                            <span className="text-slate-500">
                              Target: +{result.targetLift}%
                            </span>
                            <span
                              className={cn(
                                "font-semibold",
                                result.currentLift !== undefined &&
                                  result.currentLift >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              )}
                            >
                              Actual:{" "}
                              {result.currentLift !== undefined
                                ? `${result.currentLift >= 0 ? "+" : ""}${result.currentLift}%`
                                : "—"}
                            </span>
                            {result.confidence && (
                              <span className="text-slate-500">
                                {result.confidence}% confidence
                              </span>
                            )}
                          </div>
                        </div>

                        {result.keyLearning && (
                          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Lightbulb className="w-4 h-4 text-amber-500" />
                              <span className="text-xs font-semibold text-slate-700">
                                Key Learning
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {result.keyLearning}
                            </p>
                          </div>
                        )}
                      </div>
                    </InsightCard>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* AI Designer Modal */}
      <AnimatePresence>
        {showAIDesigner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAIDesigner(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  AI Experiment Designer
                </h3>
              </div>

              <p className="text-sm text-slate-600 mb-4">
                Describe what you want to test and I&apos;ll help design a
                complete experiment with hypothesis, metrics, and success
                criteria.
              </p>

              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="e.g., I want to test whether showing social proof on our pricing page increases conversions..."
                className="w-full h-24 p-3 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex items-center gap-2 mt-4">
                <ActionButton
                  variant="secondary"
                  onClick={() => setShowAIDesigner(false)}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  icon={Sparkles}
                  variant="primary"
                  onClick={handleGenerateExperiment}
                  disabled={!aiInput.trim()}
                >
                  Generate Experiment
                </ActionButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
