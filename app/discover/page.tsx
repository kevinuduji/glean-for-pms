"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  TrendingUp,
  Users,
  FlaskConical,
  Search,
  TicketIcon,
  Filter,
  Sparkles,
  BarChart3,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InsightCard, InsightCardSkeleton } from "@/components/ui/InsightCard";
import { ActionButton } from "@/components/ui/ActionButton";
import { SplitActionButton } from "@/components/ui/SplitActionButton";
import {
  GitPullRequest,
  Check,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

// Mock data combining insights from sessions, recommendations, and patterns
interface DiscoverItem {
  id: string;
  type: "urgent" | "trending" | "recommendation" | "friction";
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  source: string;
  impact: number; // estimated users affected
  confidence?: number;
  timestamp: string;
  data?: {
    metric?: string;
    change?: string;
    sessions?: number;
  };
}

const mockDiscoverItems: DiscoverItem[] = [
  {
    id: "untracked-1",
    type: "recommendation",
    title: "Untracked: User Search Behavior",
    description:
      "I found a search feature in your codebase (src/components/SearchBar.tsx) but no analytics events tracking search queries, result counts, or click-throughs. Tracking these could reveal what users are looking for and whether they're finding it.",
    priority: "high",
    source: "GitHub Code Analysis",
    impact: 0,
    confidence: 94,
    timestamp: "Just now",
    data: {
      metric: "search_query_events",
    },
  },
  {
    id: "untracked-2",
    type: "recommendation",
    title: "Untracked: Error Boundary Recovery",
    description:
      "Your app has error boundaries in 3 routes (src/app/dashboard, src/app/settings, src/app/checkout) but none of them emit events when users hit errors or retry. Without this, you can't measure how often users encounter failures or how they recover.",
    priority: "high",
    source: "GitHub Code Analysis",
    impact: 0,
    confidence: 91,
    timestamp: "Just now",
    data: {
      metric: "error_recovery_events",
    },
  },
  {
    id: "urgent-1",
    type: "urgent",
    title: "Checkout Funnel Broken",
    description:
      "API errors causing 23% of checkout attempts to fail. Revenue impact estimated at $12K/day.",
    priority: "critical",
    source: "Sentry + Amplitude",
    impact: 1200,
    timestamp: "2h ago",
    data: {
      metric: "checkout_completion_rate",
      change: "-23%",
      sessions: 450,
    },
  },
  {
    id: "urgent-2",
    type: "urgent",
    title: "User Complaints Spiking",
    description:
      "Support tickets about 'slow loading' increased 340% in the last 24 hours.",
    priority: "critical",
    source: "Support + Performance",
    impact: 800,
    timestamp: "4h ago",
    data: {
      metric: "support_tickets",
      change: "+340%",
    },
  },
  {
    id: "trending-1",
    type: "trending",
    title: "Mobile Usage Surge",
    description:
      "Mobile traffic increased 47% this week. Desktop conversion rates are 2x higher - opportunity to optimize mobile experience.",
    priority: "high",
    source: "Amplitude",
    impact: 2400,
    timestamp: "1 day ago",
    data: {
      metric: "mobile_traffic",
      change: "+47%",
    },
  },
  {
    id: "recommendation-1",
    type: "recommendation",
    title: "Test Social Proof on Signup",
    description:
      "Similar companies saw 15% conversion lift by adding testimonials. Your signup page has no social proof elements.",
    priority: "high",
    source: "AI Analysis",
    impact: 600,
    confidence: 87,
    timestamp: "2 days ago",
  },
  {
    id: "friction-1",
    type: "friction",
    title: "Pricing Page Confusion",
    description:
      "Users spending 3.2x longer on pricing page with high bounce rate. Session recordings show confusion around feature comparisons.",
    priority: "medium",
    source: "PostHog",
    impact: 320,
    timestamp: "3 days ago",
    data: {
      metric: "pricing_page_time",
      change: "+220%",
      sessions: 89,
    },
  },
  {
    id: "recommendation-2",
    type: "recommendation",
    title: "Optimize Onboarding Flow",
    description:
      "67% of users don't complete onboarding. A/B testing simplified flows could improve activation by 25%.",
    priority: "medium",
    source: "AI Analysis",
    impact: 890,
    confidence: 72,
    timestamp: "1 week ago",
  },
];

const typeConfig = {
  urgent: {
    label: "Urgent",
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  trending: {
    label: "Trending",
    icon: TrendingUp,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  recommendation: {
    label: "AI Recommendation",
    icon: Sparkles,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  friction: {
    label: "User Friction",
    icon: Users,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
};

export default function DiscoverPage() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [isLoading] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [completedId, setCompletedId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return mockDiscoverItems.filter((item) => {
      if (selectedType !== "all" && item.type !== selectedType) return false;
      if (selectedPriority !== "all" && item.priority !== selectedPriority)
        return false;
      return true;
    });
  }, [selectedType, selectedPriority]);

  function handleStartExperiment(item: DiscoverItem) {
    console.log("Starting experiment for:", item.title);
    handleGeneratePR(item); // Link to the new PR flow
  }

  function handleInvestigate(item: DiscoverItem) {
    console.log("Investigating:", item.title);
    // Open detailed analysis
  }

  function handleCreateTicket(item: DiscoverItem) {
    console.log("Creating ticket for:", item.title);
    // Open ticket creation modal
  }

  async function handleGeneratePR(item: DiscoverItem) {
    setGeneratingId(item.id);
    // Simulate AI reasoning and PR generation
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setGeneratingId(null);
    setCompletedId(item.id);
    // Reset after some time
    setTimeout(() => setCompletedId(null), 5000);
  }

  return (
    <div className="h-full bg-slate-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Discover
            </h1>
            <p className="text-slate-500 mt-1">
              What should I work on next? AI-powered insights from across your
              product stack.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">
              Filter by:
            </span>
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="urgent">🔥 Urgent</option>
            <option value="trending">📈 Trending</option>
            <option value="recommendation">🤖 AI Recommendations</option>
            <option value="friction">👥 User Friction</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="critical">🔴 Critical</option>
            <option value="high">🟡 High</option>
            <option value="medium">🟢 Medium</option>
          </select>

          <div className="ml-auto">
            <ActionButton
              icon={BarChart3}
              variant="ghost"
              size="sm"
              onClick={() => console.log("View analytics")}
            >
              View Analytics
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <InsightCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => {
                  const config = typeConfig[item.type];

                  return (
                    <InsightCard
                      key={item.id}
                      title={item.title}
                      description={item.description}
                      priority={item.priority}
                      source={item.source}
                      timestamp={item.timestamp}
                      icon={config.icon}
                      className="hover:shadow-lg"
                      actions={
                        <div className="flex items-center gap-2 w-full">
                          {item.id.startsWith("untracked") ? (
                            <div className="flex items-center gap-2">
                              <SplitActionButton
                                loading={generatingId === item.id}
                                primaryOption={{
                                  label:
                                    completedId === item.id
                                      ? "PR Created"
                                      : "Generate Implementation",
                                  icon: completedId === item.id ? Check : Code,
                                  variant:
                                    completedId === item.id
                                      ? "secondary"
                                      : "primary",
                                  onClick: () => handleGeneratePR(item),
                                }}
                                options={[
                                  {
                                    label: "Create Ticket",
                                    icon: TicketIcon,
                                    onClick: () => handleCreateTicket(item),
                                    description:
                                      "Add to backlog for manual implementation",
                                  },
                                  {
                                    label: "View in Code",
                                    icon: Search,
                                    onClick: () => handleInvestigate(item),
                                    description:
                                      "Examine the relevant source files",
                                  },
                                ]}
                                size="sm"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <SplitActionButton
                                loading={generatingId === item.id}
                                primaryOption={{
                                  label:
                                    completedId === item.id
                                      ? "PR #241 Created"
                                      : item.type === "urgent"
                                        ? "Generate Fix & PR"
                                        : item.type === "recommendation"
                                          ? "Generate Changes"
                                          : "Resolve with AI",
                                  icon:
                                    completedId === item.id
                                      ? Check
                                      : item.type === "urgent"
                                        ? Sparkles
                                        : GitPullRequest,
                                  variant:
                                    completedId === item.id
                                      ? "secondary"
                                      : "primary",
                                  onClick: () => handleGeneratePR(item),
                                }}
                                options={[
                                  {
                                    label: "Create Ticket",
                                    icon: TicketIcon,
                                    onClick: () => handleCreateTicket(item),
                                    description:
                                      "Track this in Jira or GitHub Issues",
                                  },
                                  item.type === "recommendation"
                                    ? {
                                        label: "Start Experiment",
                                        icon: FlaskConical,
                                        onClick: () =>
                                          handleStartExperiment(item),
                                        description:
                                          "Create an A/B test for this",
                                      }
                                    : {
                                        label: "Investigate",
                                        icon: Search,
                                        onClick: () => handleInvestigate(item),
                                        description:
                                          "Drill down into the root cause",
                                      },
                                  {
                                    label: "Discuss in Slack",
                                    icon: MessageSquare,
                                    onClick: () => console.log("Slack"),
                                    description: "Ask the team for context",
                                  },
                                ]}
                                size="sm"
                              />

                              {completedId === item.id && (
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <a href="#" className="hover:underline">
                                    View PR Review
                                  </a>
                                </motion.div>
                              )}
                            </div>
                          )}

                          {item.impact > 0 && (
                            <div className="ml-auto flex items-center gap-1 text-xs text-slate-500">
                              <Users className="w-3 h-3" />
                              {item.impact.toLocaleString()}
                            </div>
                          )}
                        </div>
                      }
                    >
                      {/* Additional data display */}
                      <div className="space-y-2">
                        {/* Type badge */}
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border",
                              config.bg,
                              config.border,
                              config.color,
                            )}
                          >
                            <config.icon className="w-3 h-3" />
                            {config.label}
                          </span>

                          {item.confidence && (
                            <span className="text-xs text-slate-500">
                              {item.confidence}% confidence
                            </span>
                          )}
                        </div>

                        {/* Metrics */}
                        {item.data && (
                          <div className="flex items-center gap-4 text-xs">
                            {item.data.metric && (
                              <span className="font-mono bg-slate-100 px-2 py-1 rounded">
                                {item.data.metric}
                              </span>
                            )}
                            {item.data.change && (
                              <span
                                className={cn(
                                  "font-semibold",
                                  item.data.change.startsWith("+")
                                    ? "text-red-600"
                                    : "text-green-600",
                                )}
                              >
                                {item.data.change}
                              </span>
                            )}
                            {item.data.sessions && (
                              <span className="text-slate-500">
                                {item.data.sessions} sessions
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </InsightCard>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {filteredItems.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No insights match your filters
              </h3>
              <p className="text-slate-500 mb-4">
                Try adjusting your filters or check back later for new insights.
              </p>
              <ActionButton
                variant="secondary"
                onClick={() => {
                  setSelectedType("all");
                  setSelectedPriority("all");
                }}
              >
                Clear Filters
              </ActionButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
