export interface CohortData {
  name: string;
  users: number;
  conversionRate: number;
  avgSessionDuration: string;
  primaryMetricValue: number;
}

export interface DataSource {
  name: string;
  color: string; // tailwind bg color class for badge
  textColor: string; // tailwind text color class
  borderColor: string; // tailwind border color class
  emoji: string; // icon emoji
  tracking: string[]; // bullet points of what it tracks
}

export interface ExperimentNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface Experiment {
  id: string;
  name: string;
  status:
    | "draft"
    | "running"
    | "completed"
    | "shipped"
    | "failed"
    | "inconclusive";
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
  dataSources?: DataSource[];
  notes?: ExperimentNote[];
}

export interface ExperimentIdea {
  id: string;
  title: string;
  description: string;
  source: "discover" | "ai" | "manual";
  priority: "high" | "medium" | "low";
  estimatedImpact: number;
  confidence: number;
}

export const mockActiveExperiments: Experiment[] = [
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
    dataSources: [
      {
        name: "PostHog",
        color: "bg-orange-50",
        textColor: "text-orange-700",
        borderColor: "border-orange-200",
        emoji: "🦔",
        tracking: [
          "Signup funnel conversion rate per variant",
          "Session duration and scroll depth on signup page",
          "Click-through rate on testimonial elements",
        ],
      },
      {
        name: "Stripe",
        color: "bg-violet-50",
        textColor: "text-violet-700",
        borderColor: "border-violet-200",
        emoji: "💳",
        tracking: [
          "Trial-to-paid conversion rate post-signup",
          "Revenue attribution from new signups",
        ],
      },
    ],
    notes: [
      {
        id: "note-1",
        text: "Variant B is outperforming — consider shifting more traffic to it.",
        author: "Kevin",
        createdAt: "2026-03-01T10:00:00Z",
      },
    ],
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
    dataSources: [
      {
        name: "PostHog",
        color: "bg-orange-50",
        textColor: "text-orange-700",
        borderColor: "border-orange-200",
        emoji: "🦔",
        tracking: [
          "Step-by-step drop-off rates in checkout funnel",
          "Time spent per checkout step",
          "Session recordings of abandoned checkouts",
        ],
      },
      {
        name: "Stripe",
        color: "bg-violet-50",
        textColor: "text-violet-700",
        borderColor: "border-violet-200",
        emoji: "💳",
        tracking: [
          "Successful payment completion rate",
          "Payment failure and retry rates",
        ],
      },
      {
        name: "Sentry",
        color: "bg-rose-50",
        textColor: "text-rose-700",
        borderColor: "border-rose-200",
        emoji: "🛡️",
        tracking: [
          "JavaScript errors during checkout flow",
          "API error rates per variant",
        ],
      },
    ],
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
    dataSources: [
      {
        name: "PostHog",
        color: "bg-orange-50",
        textColor: "text-orange-700",
        borderColor: "border-orange-200",
        emoji: "🦔",
        tracking: [
          "Mobile vs desktop conversion rate split",
          "Pricing plan click-through rates on mobile",
          "Scroll depth and plan comparison interactions",
        ],
      },
      {
        name: "GitHub",
        color: "bg-slate-50",
        textColor: "text-slate-700",
        borderColor: "border-slate-300",
        emoji: "🐙",
        tracking: [
          "Mobile-specific code changes (PR #412)",
          "CSS breakpoint updates linked to variant",
        ],
      },
    ],
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

export const mockExperimentQueue: Experiment[] = [
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
    dataSources: [
      {
        name: "PostHog",
        color: "bg-orange-50",
        textColor: "text-orange-700",
        borderColor: "border-orange-200",
        emoji: "🦔",
        tracking: ["Activation rate per cohort", "Tutorial completion rate"],
      },
      {
        name: "Intercom",
        color: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
        emoji: "💬",
        tracking: [
          "Support tickets from new users",
          "Onboarding message engagement",
        ],
      },
    ],
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
    dataSources: [
      {
        name: "PostHog",
        color: "bg-orange-50",
        textColor: "text-orange-700",
        borderColor: "border-orange-200",
        emoji: "🦔",
        tracking: [
          "Daily active usage per role segment",
          "Feature click rates by role",
        ],
      },
    ],
  },
];

export const mockExperimentIdeas: ExperimentIdea[] = [
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

export const mockArchivedExperiments: Experiment[] = [
  {
    id: "archive-1",
    name: "Social Proof on Signup Page",
    status: "shipped",
    dataSources: [
      {
        name: "PostHog",
        color: "bg-orange-50",
        textColor: "text-orange-700",
        borderColor: "border-orange-200",
        emoji: "🦔",
        tracking: ["Signup funnel conversion rate", "Testimonial hover events"],
      },
      {
        name: "Stripe",
        color: "bg-violet-50",
        textColor: "text-violet-700",
        borderColor: "border-violet-200",
        emoji: "💳",
        tracking: ["Trial-to-paid uplift", "Revenue from shipped variant"],
      },
    ],
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
