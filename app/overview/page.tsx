"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Lightbulb,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Users,
  DollarSign,
  Share2,
  Download,
  GitMerge,
  Zap,
  AlertTriangle,
  Activity,
  Clock,
  Gauge,
  MousePointerClick,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InsightCard } from "@/components/ui/InsightCard";
import { ActionButton } from "@/components/ui/ActionButton";

// ─── Mock Data: Product Health ──────────────────────────────────────────────────

function generateDailyData(days: number) {
  const data = [];
  const now = new Date();
  let dau = 4200;
  let revenue = 82000;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const dauNoise = Math.round((Math.random() - 0.4) * 300);
    const weekendDip = isWeekend ? -600 : 0;
    dau = Math.max(2800, Math.min(6200, dau + dauNoise + weekendDip + 15));

    const revNoise = Math.round((Math.random() - 0.45) * 4000);
    revenue = Math.max(60000, Math.min(120000, revenue + revNoise + 200));

    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      dau,
      revenue: Math.round(revenue),
      sessions: Math.round(dau * (1.4 + Math.random() * 0.4)),
      errorRate: +(0.8 + Math.random() * 1.2).toFixed(2),
      p95Latency: Math.round(120 + Math.random() * 80),
    });
  }
  return data;
}

const dailyData = generateDailyData(30);
const latest = dailyData[dailyData.length - 1];
const weekAgo = dailyData[dailyData.length - 8];

function generateMonthlyRevenue() {
  const months = [
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
  ];
  let mrr = 62000;
  return months.map((month) => {
    mrr += Math.round(3000 + Math.random() * 5000);
    return { month, mrr };
  });
}

const monthlyRevenue = generateMonthlyRevenue();

const featureUsage = [
  { feature: "Dashboard", users: 3840, pctOfDAU: 91 },
  { feature: "Search", users: 2940, pctOfDAU: 70 },
  { feature: "Reports", users: 2100, pctOfDAU: 50 },
  { feature: "Settings", users: 1680, pctOfDAU: 40 },
  { feature: "API", users: 1260, pctOfDAU: 30 },
  { feature: "Integrations", users: 840, pctOfDAU: 20 },
];

const conversionFunnel = [
  { step: "Visit", count: 28400, pct: 100 },
  { step: "Signup Start", count: 4260, pct: 15 },
  { step: "Signup Complete", count: 2840, pct: 10 },
  { step: "Activation", count: 1704, pct: 6 },
  { step: "Paid Conversion", count: 568, pct: 2 },
];

// ─── KPI Helper ─────────────────────────────────────────────────────────────────

function KPICard({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  const positive = change >= 0;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center",
            color
          )}
        >
          <Icon className="w-4.5 h-4.5 text-white" />
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
            positive
              ? "text-green-700 bg-green-50"
              : "text-red-700 bg-red-50"
          )}
        >
          {positive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-0.5">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-[10px] text-slate-400 mt-1">{changeLabel}</div>
    </div>
  );
}

// ─── Chart Card Wrapper ─────────────────────────────────────────────────────────

function ChartCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-xl p-6",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Learning Insights Data ─────────────────────────────────────────────────────

interface LearningInsight {
  id: string;
  title: string;
  description: string;
  type: "pattern" | "recommendation" | "warning";
  confidence: number;
  relatedExperiments: string[];
  suggestedActions: string[];
}

const mockLearningInsights: LearningInsight[] = [
  {
    id: "insight-1",
    title: "Social Proof Pattern Success",
    description:
      "Your last 3 social proof experiments all exceeded targets. This pattern suggests strong user trust concerns that social validation addresses effectively.",
    type: "pattern",
    confidence: 94,
    relatedExperiments: ["result-1", "exp-social-2", "exp-social-3"],
    suggestedActions: [
      "Apply social proof to other conversion points",
      "Test industry-specific testimonials",
      "Implement real-time user activity indicators",
    ],
  },
  {
    id: "insight-2",
    title: "Mobile Optimization Opportunity",
    description:
      "Mobile conversion rates are consistently 40% lower than desktop across all experiments. This represents a significant growth opportunity.",
    type: "recommendation",
    confidence: 87,
    relatedExperiments: ["result-3", "exp-mobile-1"],
    suggestedActions: [
      "Prioritize mobile-first experiment design",
      "Test mobile-specific user flows",
      "Investigate mobile performance issues",
    ],
  },
  {
    id: "insight-3",
    title: "Checkout Flow Complexity Warning",
    description:
      "Experiments that simplify checkout flows have a 60% failure rate. Users may prefer more steps for high-value purchases to feel secure.",
    type: "warning",
    confidence: 78,
    relatedExperiments: ["result-2", "exp-checkout-1"],
    suggestedActions: [
      "Focus on step optimization rather than reduction",
      "Test progress indicators and reassurance messaging",
      "Segment by purchase value for different flows",
    ],
  },
];

const insightTypeConfig = {
  pattern: {
    label: "Pattern Detected",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: TrendingUp,
  },
  recommendation: {
    label: "Recommendation",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    icon: Lightbulb,
  },
  warning: {
    label: "Warning",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: AlertTriangle,
  },
};

// ─── Main Page ──────────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const [selectedTab, setSelectedTab] = useState<
    "health" | "impact" | "insights"
  >("health");

  const dauChange = +(
    ((latest.dau - weekAgo.dau) / weekAgo.dau) *
    100
  ).toFixed(1);
  const revenueChange = +(
    ((latest.revenue - weekAgo.revenue) / weekAgo.revenue) *
    100
  ).toFixed(1);
  const errorChange = +(
    ((latest.errorRate - weekAgo.errorRate) / weekAgo.errorRate) *
    100
  ).toFixed(1);
  const latencyChange = +(
    ((latest.p95Latency - weekAgo.p95Latency) / weekAgo.p95Latency) *
    100
  ).toFixed(1);

  function handleExportReport() {
    console.log("Exporting report");
  }

  function handleApplyLearning(insight: LearningInsight) {
    console.log("Applying learning:", insight.title);
  }

  const tabs = [
    { id: "health" as const, label: "Product Health", count: null },
    { id: "impact" as const, label: "Business Impact", count: null },
    {
      id: "insights" as const,
      label: "Learning Insights",
      count: mockLearningInsights.length,
    },
  ];

  return (
    <div className="h-full bg-slate-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Overview
            </h1>
            <p className="text-slate-500 mt-1">
              Your product at a glance — health metrics, experiment impact, and
              insights
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {latest.dau.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">DAU Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                $
                {(
                  monthlyRevenue[monthlyRevenue.length - 1].mrr / 1000
                ).toFixed(0)}
                K
              </div>
              <div className="text-xs text-slate-500">MRR</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {latest.p95Latency}ms
              </div>
              <div className="text-xs text-slate-500">P95 Latency</div>
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
              {tab.count !== null && (
                <span className="ml-2 text-xs opacity-75">({tab.count})</span>
              )}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <ActionButton
              icon={Settings2}
              variant="ghost"
              size="sm"
              onClick={() => console.log("Configure dashboard")}
            >
              Configure
            </ActionButton>
            <ActionButton
              icon={Share2}
              variant="secondary"
              size="sm"
              onClick={() => console.log("Share")}
            >
              Share
            </ActionButton>
            <ActionButton
              icon={Download}
              variant="primary"
              size="sm"
              onClick={handleExportReport}
            >
              Export
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {/* ─── Product Health Tab ──────────────────────────────────────── */}
            {selectedTab === "health" && (
              <motion.div
                key="health"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* KPI Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  <KPICard
                    label="Daily Active Users"
                    value={latest.dau.toLocaleString()}
                    change={dauChange}
                    changeLabel="vs last week"
                    icon={Users}
                    color="bg-blue-600"
                  />
                  <KPICard
                    label="Monthly Revenue"
                    value={`$${(monthlyRevenue[monthlyRevenue.length - 1].mrr / 1000).toFixed(0)}K`}
                    change={revenueChange}
                    changeLabel="vs last week"
                    icon={DollarSign}
                    color="bg-green-600"
                  />
                  <KPICard
                    label="Total Users"
                    value="24,812"
                    change={3.2}
                    changeLabel="vs last month"
                    icon={Users}
                    color="bg-indigo-600"
                  />
                  <KPICard
                    label="Conversion Rate"
                    value="2.0%"
                    change={8.4}
                    changeLabel="vs last month"
                    icon={MousePointerClick}
                    color="bg-violet-600"
                  />
                  <KPICard
                    label="P95 Latency"
                    value={`${latest.p95Latency}ms`}
                    change={-latencyChange}
                    changeLabel="vs last week"
                    icon={Gauge}
                    color="bg-amber-600"
                  />
                  <KPICard
                    label="Error Rate"
                    value={`${latest.errorRate}%`}
                    change={-errorChange}
                    changeLabel="vs last week"
                    icon={Activity}
                    color="bg-red-500"
                  />
                </div>

                {/* Main Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* DAU Line Chart */}
                  <ChartCard
                    title="Daily Active Users"
                    subtitle="Last 30 days"
                  >
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dailyData}>
                          <defs>
                            <linearGradient
                              id="dauGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#6366f1"
                                stopOpacity={0.15}
                              />
                              <stop
                                offset="100%"
                                stopColor="#6366f1"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f1f5f9"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                            axisLine={false}
                            tickLine={false}
                            interval={4}
                          />
                          <YAxis
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                            axisLine={false}
                            tickLine={false}
                            width={45}
                            tickFormatter={(v) =>
                              `${(v / 1000).toFixed(1)}k`
                            }
                          />
                          <Tooltip
                            contentStyle={{
                              fontSize: "12px",
                              border: "1px solid #e2e8f0",
                              borderRadius: "8px",
                              boxShadow:
                                "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                            }}
                            formatter={(v: number) => [
                              v.toLocaleString(),
                              "DAU",
                            ]}
                          />
                          <Area
                            type="monotone"
                            dataKey="dau"
                            stroke="#6366f1"
                            strokeWidth={2}
                            fill="url(#dauGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartCard>

                  {/* Revenue Area Chart */}
                  <ChartCard
                    title="Monthly Recurring Revenue"
                    subtitle="Last 7 months"
                  >
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyRevenue}>
                          <defs>
                            <linearGradient
                              id="revenueGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#22c55e"
                                stopOpacity={0.15}
                              />
                              <stop
                                offset="100%"
                                stopColor="#22c55e"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f1f5f9"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="month"
                            tick={{ fontSize: 11, fill: "#94a3b8" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                            axisLine={false}
                            tickLine={false}
                            width={50}
                            tickFormatter={(v) =>
                              `$${(v / 1000).toFixed(0)}k`
                            }
                          />
                          <Tooltip
                            contentStyle={{
                              fontSize: "12px",
                              border: "1px solid #e2e8f0",
                              borderRadius: "8px",
                              boxShadow:
                                "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                            }}
                            formatter={(v: number) => [
                              `$${(v / 1000).toFixed(1)}K`,
                              "MRR",
                            ]}
                          />
                          <Area
                            type="monotone"
                            dataKey="mrr"
                            stroke="#22c55e"
                            strokeWidth={2}
                            fill="url(#revenueGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartCard>
                </div>

                {/* Second Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Feature Adoption Bar Chart */}
                  <ChartCard
                    title="Feature Adoption"
                    subtitle="% of DAU using each feature"
                    className="lg:col-span-1"
                  >
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={featureUsage}
                          layout="vertical"
                          barSize={18}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f1f5f9"
                            horizontal={false}
                          />
                          <XAxis
                            type="number"
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 100]}
                            tickFormatter={(v) => `${v}%`}
                          />
                          <YAxis
                            type="category"
                            dataKey="feature"
                            tick={{ fontSize: 11, fill: "#64748b" }}
                            axisLine={false}
                            tickLine={false}
                            width={85}
                          />
                          <Tooltip
                            contentStyle={{
                              fontSize: "12px",
                              border: "1px solid #e2e8f0",
                              borderRadius: "8px",
                              boxShadow:
                                "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                            }}
                            formatter={(v: number, _name: string, entry: { payload: { users: number } }) => [
                              `${v}% (${entry.payload.users.toLocaleString()} users)`,
                              "Adoption",
                            ]}
                          />
                          <Bar
                            dataKey="pctOfDAU"
                            fill="#6366f1"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartCard>

                  {/* P95 Latency + Error Rate */}
                  <ChartCard
                    title="Performance"
                    subtitle="P95 latency & error rate — 30 days"
                    className="lg:col-span-2"
                  >
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dailyData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f1f5f9"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                            axisLine={false}
                            tickLine={false}
                            interval={4}
                          />
                          <YAxis
                            yAxisId="latency"
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                            axisLine={false}
                            tickLine={false}
                            width={40}
                            tickFormatter={(v) => `${v}ms`}
                          />
                          <YAxis
                            yAxisId="error"
                            orientation="right"
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                            axisLine={false}
                            tickLine={false}
                            width={35}
                            tickFormatter={(v) => `${v}%`}
                          />
                          <Tooltip
                            contentStyle={{
                              fontSize: "12px",
                              border: "1px solid #e2e8f0",
                              borderRadius: "8px",
                              boxShadow:
                                "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                            }}
                          />
                          <Line
                            yAxisId="latency"
                            type="monotone"
                            dataKey="p95Latency"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            dot={false}
                            name="P95 Latency (ms)"
                          />
                          <Line
                            yAxisId="error"
                            type="monotone"
                            dataKey="errorRate"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={false}
                            name="Error Rate (%)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartCard>
                </div>

                {/* Conversion Funnel */}
                <ChartCard
                  title="Conversion Funnel"
                  subtitle="Visitor → Paid conversion"
                >
                  <div className="flex items-end gap-2 h-[140px]">
                    {conversionFunnel.map((step, i) => {
                      const widthPct = Math.max(
                        8,
                        (step.count / conversionFunnel[0].count) * 100
                      );
                      return (
                        <div
                          key={step.step}
                          className="flex-1 flex flex-col items-center gap-2"
                        >
                          <div className="text-center">
                            <div className="text-sm font-bold text-slate-900">
                              {step.count >= 1000
                                ? `${(step.count / 1000).toFixed(1)}K`
                                : step.count}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {step.pct}%
                            </div>
                          </div>
                          <div
                            className="w-full rounded-t-lg transition-all"
                            style={{
                              height: `${Math.max(20, (step.count / conversionFunnel[0].count) * 100)}px`,
                              backgroundColor:
                                i === 0
                                  ? "#e2e8f0"
                                  : i === conversionFunnel.length - 1
                                    ? "#6366f1"
                                    : `rgba(99, 102, 241, ${0.2 + (i / conversionFunnel.length) * 0.6})`,
                            }}
                          />
                          <div className="text-[11px] font-medium text-slate-600 text-center">
                            {step.step}
                          </div>
                          {i < conversionFunnel.length - 1 && (
                            <div className="absolute" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      Overall conversion:{" "}
                      <span className="font-semibold text-indigo-600">
                        {conversionFunnel[conversionFunnel.length - 1].pct}%
                      </span>{" "}
                      of visitors become paying users
                    </div>
                    <div className="flex items-center gap-3">
                      {conversionFunnel.slice(0, -1).map((step, i) => {
                        const nextStep = conversionFunnel[i + 1];
                        const dropoff = +(
                          (1 - nextStep.count / step.count) *
                          100
                        ).toFixed(0);
                        return (
                          <div
                            key={step.step}
                            className="text-[10px] text-slate-400"
                          >
                            {step.step} → {nextStep.step}:{" "}
                            <span className="text-red-500 font-medium">
                              -{dropoff}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </ChartCard>
              </motion.div>
            )}

            {/* ─── Business Impact Tab ────────────────────────────────────── */}
            {selectedTab === "impact" && (
              <motion.div
                key="impact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Q1 2026 Experimentation Impact
                  </h3>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        5
                      </div>
                      <div className="text-sm text-slate-500">
                        Experiments Shipped
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-900 mb-1">
                        23%
                      </div>
                      <div className="text-sm text-slate-500">
                        Overall Conversion &uarr;
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600 mb-1">
                        $127K
                      </div>
                      <div className="text-sm text-slate-500">
                        Revenue Impact
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-600 mb-1">
                        2,340
                      </div>
                      <div className="text-sm text-slate-500">New Users</div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">
                      Top Performing Experiments
                    </h4>
                    <div className="space-y-2">
                      {[
                        {
                          name: "Social Proof on Signup Page",
                          lift: 15.3,
                          revenue: 24000,
                        },
                        {
                          name: "Profile Page Social Proof Badges",
                          lift: 19.7,
                          revenue: 18000,
                        },
                        {
                          name: "Email Verification — SMS Alternative",
                          lift: 23.4,
                          revenue: 35000,
                        },
                      ].map((result) => (
                        <div
                          key={result.name}
                          className="flex items-center justify-between py-2"
                        >
                          <span className="text-sm text-slate-700">
                            {result.name}
                          </span>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-green-600 font-semibold">
                              +{result.lift}%
                            </span>
                            <span className="text-slate-500">
                              ${(result.revenue / 1000).toFixed(0)}K
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-slate-900">
                      Q2 2026 Planning
                    </h3>
                  </div>

                  <p className="text-slate-600 mb-4">
                    Based on your Q1 learnings, here are the top opportunities
                    for next quarter:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/60 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-2">
                        Focus Area: Mobile Optimization
                      </h4>
                      <p className="text-sm text-slate-600 mb-2">
                        Mobile conversion is 40% lower than desktop. Prioritize
                        mobile-first experiments.
                      </p>
                      <div className="text-xs text-indigo-600 font-medium">
                        Potential impact: +$200K revenue
                      </div>
                    </div>

                    <div className="bg-white/60 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-2">
                        Expand: Social Proof Strategy
                      </h4>
                      <p className="text-sm text-slate-600 mb-2">
                        Social proof experiments consistently exceed targets.
                        Scale across all touchpoints.
                      </p>
                      <div className="text-xs text-indigo-600 font-medium">
                        Potential impact: +$150K revenue
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-indigo-200/50">
                    <ActionButton
                      icon={ArrowRight}
                      variant="primary"
                      onClick={() => console.log("Start Q2 planning")}
                    >
                      Start Q2 Planning
                    </ActionButton>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── Learning Insights Tab ──────────────────────────────────── */}
            {selectedTab === "insights" && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {mockLearningInsights.map((insight) => {
                  const config = insightTypeConfig[insight.type];

                  return (
                    <InsightCard
                      key={insight.id}
                      title={insight.title}
                      description={insight.description}
                      priority={
                        insight.confidence >= 90
                          ? "high"
                          : insight.confidence >= 75
                            ? "medium"
                            : "low"
                      }
                      source={`Based on ${insight.relatedExperiments.length} experiments`}
                      timestamp={`${insight.confidence}% confidence`}
                      icon={config.icon}
                      className="hover:shadow-lg"
                      actions={
                        <div className="flex items-center gap-2 w-full">
                          <ActionButton
                            icon={Zap}
                            variant="primary"
                            size="sm"
                            onClick={() => handleApplyLearning(insight)}
                          >
                            Apply Learning
                          </ActionButton>
                          <ActionButton
                            icon={GitMerge}
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              console.log("View related experiments")
                            }
                          >
                            View Related
                          </ActionButton>
                        </div>
                      }
                    >
                      <div className="space-y-3">
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

                        <div>
                          <span className="text-xs font-semibold text-slate-700 mb-2 block">
                            Recommended Actions:
                          </span>
                          <div className="space-y-1">
                            {insight.suggestedActions.map((action, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-xs text-slate-600"
                              >
                                <Target className="w-3 h-3 text-indigo-500" />
                                {action}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </InsightCard>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
