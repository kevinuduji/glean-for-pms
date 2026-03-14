/**
 * Per-space Discover prompts for the BlackRock organization.
 * Each prompt appears as a clickable chip on the Discover page,
 * pre-filling the agent chat when clicked.
 */

export type DiscoverPrompt = {
  label: string;
  prompt: string;
  category: "risk" | "performance" | "insight" | "compliance" | "action";
};

export type SpaceDiscoverConfig = {
  tagline: string;
  prompts: DiscoverPrompt[];
};

export const BLACKROCK_DISCOVER: Record<string, SpaceDiscoverConfig> = {
  "br-global-markets": {
    tagline: "Macro signals, sector rotation, and cross-asset intelligence",
    prompts: [
      {
        label: "Top macro risks this quarter",
        prompt: "What are the top macro risks for Q2 2026 across global markets?",
        category: "risk",
      },
      {
        label: "US vs EU equity performance",
        prompt: "Compare US vs EU equity performance year-to-date, broken down by sector.",
        category: "performance",
      },
      {
        label: "Sector momentum signals",
        prompt: "Which sectors are showing the strongest positive momentum signals right now?",
        category: "insight",
      },
      {
        label: "Central bank policy recap",
        prompt: "Summarize the most recent central bank policy changes and their expected market impact.",
        category: "insight",
      },
      {
        label: "EM vs DM divergence",
        prompt: "Analyze emerging market vs developed market divergence in fixed income over the last 90 days.",
        category: "performance",
      },
    ],
  },

  "br-esg": {
    tagline: "ESG scoring, carbon exposure, and regulatory intelligence",
    prompts: [
      {
        label: "Highest carbon-exposed portfolios",
        prompt: "Which of our portfolios have the highest carbon exposure and what's driving it?",
        category: "risk",
      },
      {
        label: "Top ESG-rated funds this quarter",
        prompt: "List our top ESG-rated funds this quarter and what moved their scores.",
        category: "performance",
      },
      {
        label: "Q2 ESG regulation updates",
        prompt: "What new ESG regulatory requirements are taking effect in Q2 2026?",
        category: "compliance",
      },
      {
        label: "Net-zero commitment progress",
        prompt: "Summarize net-zero commitment progress by fund for our 2030 pathway targets.",
        category: "insight",
      },
      {
        label: "ESG score movers",
        prompt: "Which funds had the largest ESG score changes in the past 30 days, and why?",
        category: "insight",
      },
    ],
  },

  "br-risk": {
    tagline: "VaR, stress testing, and credit concentration analysis",
    prompts: [
      {
        label: "VaR across top 10 funds",
        prompt: "What is the current Value-at-Risk (VaR) across our top 10 funds by AUM?",
        category: "risk",
      },
      {
        label: "Rate hike stress test",
        prompt: "Run a stress test scenario: what is the portfolio impact of a 200bps rate hike?",
        category: "risk",
      },
      {
        label: "Credit risk by sector",
        prompt: "Show credit risk concentration by sector across our fixed income holdings.",
        category: "risk",
      },
      {
        label: "Q1 liquidity risk report",
        prompt: "Generate a Q1 liquidity risk summary for our illiquid alternative holdings.",
        category: "compliance",
      },
      {
        label: "Correlation matrix changes",
        prompt: "How has cross-asset correlation changed over the last 6 months?",
        category: "insight",
      },
    ],
  },

  "br-client": {
    tagline: "Advisor tools, client retention, and onboarding experience",
    prompts: [
      {
        label: "Retention by advisor segment",
        prompt: "What are the client retention rates broken down by advisor segment and AUM tier?",
        category: "performance",
      },
      {
        label: "Onboarding completion rates",
        prompt: "What are the onboarding completion rates over the last 30 days, and where are users dropping off?",
        category: "insight",
      },
      {
        label: "Advisor NPS pain points",
        prompt: "What are the top pain points from our most recent advisor NPS survey?",
        category: "insight",
      },
      {
        label: "AUM growth by relationship tier",
        prompt: "Show AUM growth trends by relationship tier (Platinum, Gold, Silver) over Q1.",
        category: "performance",
      },
      {
        label: "Client reporting bottlenecks",
        prompt: "Where are the biggest bottlenecks in our client reporting workflow?",
        category: "action",
      },
    ],
  },

  "br-product": {
    tagline: "Fund development, competitive intelligence, and ETF roadmap",
    prompts: [
      {
        label: "Fee analysis vs Vanguard/Fidelity",
        prompt: "Competitive fee analysis: compare our ETF fees vs Vanguard and Fidelity across categories.",
        category: "insight",
      },
      {
        label: "Fixed income ETF gaps",
        prompt: "What gaps exist in our fixed income ETF lineup relative to top competitors?",
        category: "action",
      },
      {
        label: "Inflow momentum by category",
        prompt: "Which product categories are showing the strongest net inflow momentum this quarter?",
        category: "performance",
      },
      {
        label: "Regulatory impact on pipeline",
        prompt: "How do upcoming SEC regulations affect our current product development pipeline?",
        category: "compliance",
      },
      {
        label: "Thematic fund opportunities",
        prompt: "What thematic fund opportunities (AI, infrastructure, longevity) have the strongest demand signals?",
        category: "insight",
      },
    ],
  },

  "br-aladdin": {
    tagline: "Platform reliability, API performance, and engineering roadmap",
    prompts: [
      {
        label: "Platform SLA compliance",
        prompt: "What was Aladdin platform uptime and SLA compliance over the last 30 days?",
        category: "performance",
      },
      {
        label: "API latency by service",
        prompt: "Show API latency by service and endpoint for the last 7 days, flagging any outliers.",
        category: "risk",
      },
      {
        label: "Ops team feature requests",
        prompt: "What are the top feature requests from the operations team currently in backlog?",
        category: "action",
      },
      {
        label: "Q1 security audit findings",
        prompt: "Summarize the security audit findings from Q1 and their remediation status.",
        category: "compliance",
      },
      {
        label: "Deployment cadence review",
        prompt: "How has our deployment cadence and rollback rate changed over the last quarter?",
        category: "insight",
      },
    ],
  },

  "br-dealflow": {
    tagline: "M&A pipeline, due diligence, and market multiples",
    prompts: [
      {
        label: "Active targets by sector",
        prompt: "What are the active acquisition targets currently in our pipeline, broken down by sector?",
        category: "insight",
      },
      {
        label: "Due diligence pipeline status",
        prompt: "What is the current due diligence status for each deal in the pipeline?",
        category: "action",
      },
      {
        label: "Fintech market multiples",
        prompt: "What are current EV/EBITDA and revenue multiples in fintech and wealth management M&A?",
        category: "insight",
      },
      {
        label: "Regulatory approval timelines",
        prompt: "What are the expected regulatory approval timelines for our pending deals?",
        category: "compliance",
      },
      {
        label: "Synergy modeling summary",
        prompt: "Summarize the synergy modeling outputs for our top 3 active acquisition targets.",
        category: "performance",
      },
    ],
  },

  "br-board": {
    tagline: "Board materials, executive briefings, and investor reporting",
    prompts: [
      {
        label: "Q1 board deck talking points",
        prompt: "What are the key talking points and metrics to highlight in the Q1 board deck?",
        category: "action",
      },
      {
        label: "Investor day metrics",
        prompt: "Which metrics should we prioritize for the upcoming investor day presentation?",
        category: "insight",
      },
      {
        label: "Regulatory risk for board",
        prompt: "Generate a regulatory risk overview suitable for board-level review.",
        category: "compliance",
      },
      {
        label: "Competitive positioning Q2",
        prompt: "Summarize our competitive positioning relative to peers for the Q2 board meeting.",
        category: "insight",
      },
      {
        label: "AUM & revenue snapshot",
        prompt: "What is our current AUM by strategy and year-over-year revenue growth?",
        category: "performance",
      },
    ],
  },
};

/** Category display config */
export const CATEGORY_CONFIG: Record<
  DiscoverPrompt["category"],
  { label: string; bg: string; text: string; dot: string }
> = {
  risk:        { label: "Risk",       bg: "bg-rose-50",   text: "text-rose-700",   dot: "bg-rose-400" },
  performance: { label: "Performance", bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-400" },
  insight:     { label: "Insight",    bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-400" },
  compliance:  { label: "Compliance", bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-400" },
  action:      { label: "Action",     bg: "bg-emerald-50",text: "text-emerald-700",dot: "bg-emerald-400" },
};
