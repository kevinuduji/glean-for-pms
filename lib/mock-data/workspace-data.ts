/**
 * Per-workspace mock data.
 * Each workspace has unique metrics, experiments, connectors, and discover items
 * so that switching workspaces actually changes what you see across the whole app.
 */

import type { Experiment, ExperimentIdea } from './experiments';
import {
  mockActiveExperiments,
  mockExperimentQueue,
  mockExperimentIdeas,
  mockArchivedExperiments,
} from './experiments';

// ─── Types ────────────────────────────────────────────────────────────────────

export type WorkspaceKPIs = {
  dauSeed: number;        // Starting DAU for chart generation
  mrrSeed: number;        // Starting MRR for chart generation
  dauLabel: string;       // Display value for KPI card
  dauChange: number;      // WoW % change
  mrrLabel: string;
  mrrChange: number;
  conversionPct: number;  // e.g. 2.1
  conversionChange: number;
  errorRate: number;      // e.g. 1.2
  errorRateChange: number;
  p95Latency: number;     // ms
  p95LatencyChange: number;
  featureUsage: { feature: string; users: number; pctOfDAU: number }[];
  conversionFunnel: { step: string; count: number; pct: number }[];
};

export type ConnectorOverride = {
  id: string;
  stats: { label: string; value: string }[];
};

export type WorkspaceConnectorData = {
  activeIds: string[];       // which connector IDs are connected
  overrides: Record<string, { label: string; value: string }[]>; // per-connector stat overrides
};

export type WorkspaceExperiments = {
  active: Experiment[];
  queue: Experiment[];
  ideas: ExperimentIdea[];
  archived: Experiment[];
};

export type WorkspaceDiscoverItem = {
  id: string;
  type: 'recommendation' | 'friction';
  priority: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  source: string;
  area: string;
  detectedAt: string;
  isNew: boolean;
};

export type WorkspaceData = {
  overview: WorkspaceKPIs;
  connectors: WorkspaceConnectorData;
  experiments: WorkspaceExperiments;
  discoverItems: WorkspaceDiscoverItem[];
  agentChatSeeds: string[];
};

// ─── All connector IDs ────────────────────────────────────────────────────────

export const ALL_CONNECTOR_IDS = [
  'amplitude', 'mixpanel', 'posthog', 'sentry', 'github',
  'prometheus', 'slack', 'jira', 'notion', 'stripe', 'datadog',
];

// ─── Workspace data map ───────────────────────────────────────────────────────

const workspaceDataMap: Record<string, WorkspaceData> = {

  // ── Acme Corp — Enterprise B2B SaaS ─────────────────────────────────────────
  'ws-probe': {
    overview: {
      dauSeed: 5200,
      mrrSeed: 118000,
      dauLabel: '5,247',
      dauChange: 3.2,
      mrrLabel: '$118K',
      mrrChange: 8.4,
      conversionPct: 2.1,
      conversionChange: 0.3,
      errorRate: 1.2,
      errorRateChange: -0.4,
      p95Latency: 165,
      p95LatencyChange: -12,
      featureUsage: [
        { feature: 'Dashboard', users: 4840, pctOfDAU: 92 },
        { feature: 'Search', users: 3920, pctOfDAU: 75 },
        { feature: 'Reports', users: 2610, pctOfDAU: 50 },
        { feature: 'Settings', users: 1890, pctOfDAU: 36 },
        { feature: 'API', users: 1576, pctOfDAU: 30 },
        { feature: 'Integrations', users: 1050, pctOfDAU: 20 },
      ],
      conversionFunnel: [
        { step: 'Visit', count: 48200, pct: 100 },
        { step: 'Signup Start', count: 7230, pct: 15 },
        { step: 'Signup Complete', count: 4820, pct: 10 },
        { step: 'Activation', count: 2892, pct: 6 },
        { step: 'Paid Conversion', count: 1012, pct: 2.1 },
      ],
    },
    connectors: {
      // Enterprise — all connected
      activeIds: ALL_CONNECTOR_IDS,
      overrides: {
        amplitude: [
          { label: 'Events tracked', value: '142K' },
          { label: 'Funnels monitored', value: '6' },
          { label: 'Active cohorts', value: '14' },
        ],
        stripe: [
          { label: 'MRR', value: '$118K' },
          { label: 'MRR Growth', value: '+8.4%' },
          { label: 'Chargebacks', value: '0.1%' },
        ],
        sentry: [
          { label: 'Active errors', value: '12' },
          { label: 'Users affected', value: '4,200' },
          { label: 'Occurrences (30d)', value: '8,140' },
        ],
        github: [
          { label: 'Repos indexed', value: '8' },
          { label: 'Open PRs', value: '11' },
          { label: 'Commits (30d)', value: '214' },
        ],
      },
    },
    // Re-use the existing rich experiments data for Acme Corp
    experiments: {
      active: mockActiveExperiments,
      queue: mockExperimentQueue,
      ideas: mockExperimentIdeas,
      archived: mockArchivedExperiments,
    },
    discoverItems: [
      {
        id: 'disc-probe-1',
        type: 'recommendation',
        priority: 'critical',
        title: 'Checkout drop-off spiked 18% this week',
        description: 'PostHog sessions show users abandoning at the payment step after seeing the order summary. Sentry captured a JS error on Safari that may be blocking the CTA.',
        source: 'PostHog + Sentry',
        area: 'Revenue',
        detectedAt: '2026-03-09T14:22:00Z',
        isNew: true,
      },
      {
        id: 'disc-probe-2',
        type: 'recommendation',
        priority: 'high',
        title: 'Payment P95 latency up 40ms vs last week',
        description: 'Prometheus shows payment service P95 jumped from 125ms to 165ms since Tuesday. Correlates with the Stripe webhook processor upgrade.',
        source: 'Prometheus + Stripe',
        area: 'Performance',
        detectedAt: '2026-03-08T09:00:00Z',
        isNew: true,
      },
      {
        id: 'disc-probe-3',
        type: 'recommendation',
        priority: 'high',
        title: 'Churn signal: 34 enterprise accounts went silent',
        description: 'Amplitude cohort shows 34 enterprise accounts with zero activity in 14 days. Slack #customer-success has 3 unresolved escalations from this group.',
        source: 'Amplitude + Slack',
        area: 'Retention',
        detectedAt: '2026-03-07T16:45:00Z',
        isNew: false,
      },
      {
        id: 'disc-probe-4',
        type: 'recommendation',
        priority: 'high',
        title: 'Mobile conversion 1.4× lower than desktop',
        description: 'Amplitude shows mobile users convert at 1.3% vs 2.1% on desktop. PostHog heatmaps reveal the pricing table overflows on 375px viewports.',
        source: 'Amplitude + PostHog',
        area: 'Acquisition',
        detectedAt: '2026-03-06T11:30:00Z',
        isNew: false,
      },
      {
        id: 'disc-probe-5',
        type: 'friction',
        priority: 'critical',
        title: 'Rage clicks on "Upgrade Plan" button',
        description: 'PostHog flagged 47 rage-click sessions on the upgrade button in the last 24 hours. The button may not be responding on plan pages behind a feature flag.',
        source: 'PostHog',
        area: 'Revenue',
        detectedAt: '2026-03-09T10:00:00Z',
        isNew: true,
      },
      {
        id: 'disc-probe-6',
        type: 'friction',
        priority: 'high',
        title: 'Jira EP-412 blocking Q1 onboarding revamp',
        description: 'The onboarding flow rework epic has been in "In Review" for 9 days. 3 dependent PRs are open and unmerged. Affects the Q1 activation experiment launch.',
        source: 'Jira + GitHub',
        area: 'Activation',
        detectedAt: '2026-03-05T08:00:00Z',
        isNew: false,
      },
    ],
    agentChatSeeds: [
      'Why are signups down 15% this week?',
      'Did our new homepage update help conversion?',
      'Review Q1 experiments and summarize learnings',
      'Which enterprise accounts are at churn risk?',
      'Why did P95 latency spike on Tuesday?',
    ],
  },

  // ── Kevin's Pro — Solo PM, Consumer Mobile App ───────────────────────────────
  'ws-pro': {
    overview: {
      dauSeed: 1820,
      mrrSeed: 24300,
      dauLabel: '1,847',
      dauChange: 5.8,
      mrrLabel: '$24.3K',
      mrrChange: 12.1,
      conversionPct: 3.4,
      conversionChange: 0.8,
      errorRate: 0.6,
      errorRateChange: -0.2,
      p95Latency: 142,
      p95LatencyChange: -8,
      featureUsage: [
        { feature: 'Home Feed', users: 1720, pctOfDAU: 94 },
        { feature: 'Search', users: 1310, pctOfDAU: 72 },
        { feature: 'Notifications', users: 1090, pctOfDAU: 60 },
        { feature: 'Profile', users: 840, pctOfDAU: 46 },
        { feature: 'Settings', users: 460, pctOfDAU: 25 },
        { feature: 'Sharing', users: 274, pctOfDAU: 15 },
      ],
      conversionFunnel: [
        { step: 'Install', count: 8400, pct: 100 },
        { step: 'Onboarding Start', count: 7140, pct: 85 },
        { step: 'Onboarding Complete', count: 4788, pct: 57 },
        { step: 'First Action', count: 3264, pct: 39 },
        { step: 'Day-7 Active', count: 2016, pct: 24 },
      ],
    },
    connectors: {
      activeIds: ['amplitude', 'mixpanel', 'posthog', 'github', 'sentry'],
      overrides: {
        amplitude: [
          { label: 'Events tracked', value: '38K' },
          { label: 'Funnels monitored', value: '3' },
          { label: 'Active cohorts', value: '5' },
        ],
        mixpanel: [
          { label: 'Tracked users', value: '4.2K' },
          { label: 'Funnels', value: '4' },
          { label: 'Tickets linked', value: '1' },
        ],
        posthog: [
          { label: 'Sessions analyzed', value: '842' },
          { label: 'Flagged sessions', value: '22' },
          { label: 'Feature flags', value: '3' },
        ],
        github: [
          { label: 'Repos indexed', value: '2' },
          { label: 'Open PRs', value: '3' },
          { label: 'Commits (30d)', value: '47' },
        ],
        sentry: [
          { label: 'Active errors', value: '3' },
          { label: 'Users affected', value: '128' },
          { label: 'Occurrences (30d)', value: '412' },
        ],
      },
    },
    experiments: {
      active: [
        {
          id: 'pro-exp-1',
          name: 'Onboarding Flow Revamp',
          status: 'running',
          hypothesis:
            'Reducing onboarding from 7 steps to 4 will increase Day-1 activation by removing friction at the "Connect your first integration" step.',
          primaryMetric: 'day1_activation_rate',
          targetLift: 15,
          currentLift: 18.2,
          confidence: 92,
          startDate: '2026-02-15',
          estimatedEndDate: '2026-03-10',
          sampleSize: { current: 3840, target: 4000 },
          traffic: 50,
          source: 'PM Hypothesis',
          dataSources: [
            {
              name: 'Amplitude',
              color: 'bg-violet-50',
              textColor: 'text-violet-700',
              borderColor: 'border-violet-200',
              emoji: '📊',
              tracking: [
                'Day-1 activation rate per variant',
                'Onboarding step completion funnel',
                'Time-to-first-action',
              ],
            },
          ],
        },
        {
          id: 'pro-exp-2',
          name: 'Push Notification Timing Optimization',
          status: 'running',
          hypothesis:
            'Sending re-engagement pushes at 7pm local time instead of 10am will increase D7 retention by catching users during their leisure window.',
          primaryMetric: 'd7_retention_rate',
          targetLift: 8,
          currentLift: 7.8,
          confidence: 74,
          startDate: '2026-02-28',
          estimatedEndDate: '2026-03-14',
          sampleSize: { current: 1620, target: 2500 },
          traffic: 30,
          source: 'Discover — retention dip signal',
          dataSources: [
            {
              name: 'Amplitude',
              color: 'bg-violet-50',
              textColor: 'text-violet-700',
              borderColor: 'border-violet-200',
              emoji: '📊',
              tracking: ['D7 retention by notification time', 'Push open rate'],
            },
          ],
        },
      ],
      queue: [
        {
          id: 'pro-q-1',
          name: 'Social Sharing Incentive',
          status: 'draft',
          hypothesis:
            'Offering a "share to unlock" premium feature will increase referral rate by 25% among existing users.',
          primaryMetric: 'referral_rate',
          targetLift: 25,
          startDate: '2026-03-15',
          sampleSize: { current: 0, target: 3000 },
          traffic: 20,
        },
      ],
      ideas: [
        {
          id: 'pro-idea-1',
          title: 'iOS vs Android UX Parity Audit',
          description:
            'Amplitude shows iOS D30 retention is 31% vs 22% on Android. Worth investigating whether UI differences are responsible.',
          source: 'discover',
          priority: 'high',
          estimatedImpact: 18,
          confidence: 65,
        },
        {
          id: 'pro-idea-2',
          title: 'Streak Mechanic for Daily Engagement',
          description:
            'Adding a daily streak system similar to Duolingo could increase DAU consistency and reduce the Monday morning dip (-22% on weekends observed in Amplitude).',
          source: 'ai',
          priority: 'medium',
          estimatedImpact: 12,
          confidence: 55,
        },
      ],
      archived: [
        {
          id: 'pro-arch-1',
          name: 'In-App Rating Prompt After Milestone',
          status: 'shipped',
          hypothesis:
            'Prompting users for an App Store rating after completing their 5th action will improve average rating.',
          primaryMetric: 'app_store_rating',
          targetLift: 0.3,
          currentLift: 0.4,
          confidence: 88,
          startDate: '2026-01-10',
          endDate: '2026-02-05',
          sampleSize: { current: 4200, target: 4000 },
          traffic: 30,
          keyLearning:
            'Rating climbed from 4.1 to 4.5 over the experiment window. Shipped to 100% of users on Feb 5.',
          nextActions: ['Monitor rating trend over next 60 days'],
        },
      ],
    },
    discoverItems: [
      {
        id: 'disc-pro-1',
        type: 'recommendation',
        priority: 'critical',
        title: 'Onboarding Step 3 drop-off at 41%',
        description: 'Amplitude shows 41% of users abandon at the "Connect your calendar" step. This is 2× the drop rate of steps 1 and 2 — consider making this step optional.',
        source: 'Amplitude',
        area: 'Activation',
        detectedAt: '2026-03-09T08:00:00Z',
        isNew: true,
      },
      {
        id: 'disc-pro-2',
        type: 'recommendation',
        priority: 'high',
        title: 'Push opt-out spike Monday mornings',
        description: 'Amplitude shows a 3× spike in notification opt-outs between 8–10am on Mondays. Early morning push cadence is causing annoyance before the timing experiment lands.',
        source: 'Amplitude',
        area: 'Retention',
        detectedAt: '2026-03-08T11:00:00Z',
        isNew: true,
      },
      {
        id: 'disc-pro-3',
        type: 'recommendation',
        priority: 'high',
        title: 'iOS D30 retention 9 pts higher than Android',
        description: 'Amplitude cohort analysis: iOS users retain at 31% D30 vs 22% on Android. Android onboarding may need a platform-specific pass to close the gap.',
        source: 'Amplitude',
        area: 'Retention',
        detectedAt: '2026-03-06T14:00:00Z',
        isNew: false,
      },
      {
        id: 'disc-pro-4',
        type: 'friction',
        priority: 'high',
        title: 'DAU dips 22% on weekends',
        description: 'The app sees a consistent -22% DAU drop on Saturday and Sunday. Content-based engagement loops or weekend-specific prompts could smooth the curve.',
        source: 'Amplitude',
        area: 'Retention',
        detectedAt: '2026-03-05T09:00:00Z',
        isNew: false,
      },
    ],
    agentChatSeeds: [
      'How is the onboarding revamp performing?',
      'What should I build next to grow retention?',
      'Why is Android retention worse than iOS?',
      'Summarize my active experiments',
    ],
  },

  // ── My Workspace — Free Plan, Solo ───────────────────────────────────────────
  'ws-free': {
    overview: {
      dauSeed: 320,
      mrrSeed: 2100,
      dauLabel: '324',
      dauChange: 8.1,
      mrrLabel: '$2.1K',
      mrrChange: 14.3,
      conversionPct: 5.2,
      conversionChange: 1.1,
      errorRate: 0.8,
      errorRateChange: 0.0,
      p95Latency: 198,
      p95LatencyChange: 5,
      featureUsage: [
        { feature: 'Dashboard', users: 298, pctOfDAU: 92 },
        { feature: 'Search', users: 210, pctOfDAU: 65 },
        { feature: 'Checkout', users: 156, pctOfDAU: 48 },
        { feature: 'Settings', users: 88, pctOfDAU: 27 },
      ],
      conversionFunnel: [
        { step: 'Visit', count: 2840, pct: 100 },
        { step: 'Signup Start', count: 512, pct: 18 },
        { step: 'Signup Complete', count: 340, pct: 12 },
        { step: 'Activation', count: 218, pct: 7.7 },
        { step: 'Paid Conversion', count: 148, pct: 5.2 },
      ],
    },
    connectors: {
      // Free plan — only 2 connectors allowed
      activeIds: ['amplitude', 'github'],
      overrides: {
        amplitude: [
          { label: 'Events tracked', value: '4.2K' },
          { label: 'Funnels monitored', value: '1' },
          { label: 'Active cohorts', value: '2' },
        ],
        github: [
          { label: 'Repos indexed', value: '1' },
          { label: 'Open PRs', value: '2' },
          { label: 'Commits (30d)', value: '18' },
        ],
      },
    },
    experiments: {
      active: [
        {
          id: 'free-exp-1',
          name: 'Homepage CTA Button Color',
          status: 'running',
          hypothesis:
            'Changing the primary CTA from grey to orange will stand out more and increase homepage-to-signup conversion.',
          primaryMetric: 'homepage_cta_ctr',
          targetLift: 5,
          currentLift: 3.1,
          confidence: 58,
          startDate: '2026-03-01',
          estimatedEndDate: '2026-03-20',
          sampleSize: { current: 840, target: 2000 },
          traffic: 50,
          source: 'Manual',
          dataSources: [
            {
              name: 'Amplitude',
              color: 'bg-violet-50',
              textColor: 'text-violet-700',
              borderColor: 'border-violet-200',
              emoji: '📊',
              tracking: ['CTA click-through rate per variant', 'Signup start rate'],
            },
          ],
        },
      ],
      queue: [],
      ideas: [
        {
          id: 'free-idea-1',
          title: 'Pricing Page Testimonials',
          description:
            'Adding 2–3 short customer quotes to the pricing page could reduce hesitation and lift trial starts. Low effort, potentially high conversion impact.',
          source: 'manual',
          priority: 'medium',
          estimatedImpact: 8,
          confidence: 50,
        },
      ],
      archived: [],
    },
    discoverItems: [
      {
        id: 'disc-free-1',
        type: 'recommendation',
        priority: 'high',
        title: 'High bounce rate on pricing page (68%)',
        description: 'Amplitude shows 68% of visitors to /pricing leave without scrolling below the fold. Consider a sticky CTA or moving the key differentiator above the fold.',
        source: 'Amplitude',
        area: 'Acquisition',
        detectedAt: '2026-03-08T10:00:00Z',
        isNew: true,
      },
      {
        id: 'disc-free-2',
        type: 'recommendation',
        priority: 'high',
        title: 'Mobile load time >3s on homepage',
        description: 'Amplitude performance data shows median LCP of 3.4s on mobile. This is above the 2.5s threshold and likely hurting organic SEO rankings.',
        source: 'Amplitude',
        area: 'Performance',
        detectedAt: '2026-03-07T14:00:00Z',
        isNew: true,
      },
    ],
    agentChatSeeds: [
      "What's my biggest growth opportunity right now?",
      'How is my CTA button experiment doing?',
    ],
  },

  // ── Stealth Startup — Enterprise, Pre-launch Seed ────────────────────────────
  'ws-stealth': {
    overview: {
      dauSeed: 340,
      mrrSeed: 8400,
      dauLabel: '342',
      dauChange: 18.4,
      mrrLabel: '$8.4K',
      mrrChange: 31.2,
      conversionPct: 4.1,
      conversionChange: 1.4,
      errorRate: 3.8,
      errorRateChange: 0.9,
      p95Latency: 280,
      p95LatencyChange: 22,
      featureUsage: [
        { feature: 'Waitlist Signup', users: 318, pctOfDAU: 93 },
        { feature: 'Referral Widget', users: 214, pctOfDAU: 63 },
        { feature: 'Dashboard (beta)', users: 142, pctOfDAU: 42 },
        { feature: 'Settings', users: 68, pctOfDAU: 20 },
      ],
      conversionFunnel: [
        { step: 'Landing Visit', count: 4200, pct: 100 },
        { step: 'Waitlist Start', count: 1428, pct: 34 },
        { step: 'Waitlist Signup', count: 882, pct: 21 },
        { step: 'Referral Shared', count: 264, pct: 6.3 },
        { step: 'Beta Access', count: 176, pct: 4.2 },
      ],
    },
    connectors: {
      activeIds: ['amplitude', 'stripe', 'github', 'sentry', 'posthog'],
      overrides: {
        amplitude: [
          { label: 'Events tracked', value: '6.1K' },
          { label: 'Funnels monitored', value: '2' },
          { label: 'Active cohorts', value: '3' },
        ],
        stripe: [
          { label: 'MRR', value: '$8.4K' },
          { label: 'MRR Growth', value: '+31.2%' },
          { label: 'Chargebacks', value: '0.0%' },
        ],
        github: [
          { label: 'Repos indexed', value: '2' },
          { label: 'Open PRs', value: '7' },
          { label: 'Commits (30d)', value: '182' },
        ],
        sentry: [
          { label: 'Active errors', value: '31' },
          { label: 'Users affected', value: '284' },
          { label: 'Occurrences (30d)', value: '2,140' },
        ],
        posthog: [
          { label: 'Sessions analyzed', value: '214' },
          { label: 'Flagged sessions', value: '8' },
          { label: 'Feature flags', value: '4' },
        ],
      },
    },
    experiments: {
      active: [
        {
          id: 'stealth-exp-1',
          name: 'Waitlist Referral Widget',
          status: 'running',
          hypothesis:
            'Adding a "Share to move up the waitlist" widget will increase viral referral signups by at least 20% and reduce paid CAC.',
          primaryMetric: 'referral_signup_rate',
          targetLift: 20,
          currentLift: 27.4,
          confidence: 81,
          startDate: '2026-02-20',
          estimatedEndDate: '2026-03-15',
          sampleSize: { current: 1840, target: 2200 },
          traffic: 50,
          source: 'Founder Hypothesis',
          dataSources: [
            {
              name: 'Amplitude',
              color: 'bg-violet-50',
              textColor: 'text-violet-700',
              borderColor: 'border-violet-200',
              emoji: '📊',
              tracking: [
                'Referral link click-through rate',
                'Waitlist signup rate per variant',
                'Referred-user activation rate',
              ],
            },
            {
              name: 'PostHog',
              color: 'bg-orange-50',
              textColor: 'text-orange-700',
              borderColor: 'border-orange-200',
              emoji: '🦔',
              tracking: [
                'Widget engagement heatmap',
                'Session recordings on referral widget',
              ],
            },
          ],
        },
      ],
      queue: [
        {
          id: 'stealth-q-1',
          name: 'Pricing Page A/B: Flat vs Per-Seat',
          status: 'draft',
          hypothesis:
            'Offering a flat-rate option for small teams ($99/mo) alongside per-seat pricing will increase trial starts from sub-10-person teams.',
          primaryMetric: 'trial_start_rate',
          targetLift: 15,
          startDate: '2026-03-20',
          sampleSize: { current: 0, target: 1500 },
          traffic: 40,
        },
      ],
      ideas: [
        {
          id: 'stealth-idea-1',
          title: 'D7 Retention Email Campaign',
          description:
            'Amplitude shows D7 retention at 18% — far below the 35% benchmark for early-stage B2B. A targeted drip email sequence for days 3, 5, 7 could lift this significantly.',
          source: 'discover',
          priority: 'high',
          estimatedImpact: 30,
          confidence: 60,
        },
        {
          id: 'stealth-idea-2',
          title: 'Reduce API P95 below 200ms',
          description:
            'Current P95 is 280ms. Sentry traces show the main DB query is missing an index. This is a fast engineering win that would improve all user interactions.',
          source: 'ai',
          priority: 'high',
          estimatedImpact: 20,
          confidence: 85,
        },
        {
          id: 'stealth-idea-3',
          title: 'In-app Onboarding Checklist',
          description:
            'Adding a getting-started checklist visible on the dashboard could increase activation from 34% to 50%+ by guiding users through core value actions.',
          source: 'manual',
          priority: 'medium',
          estimatedImpact: 25,
          confidence: 70,
        },
      ],
      archived: [],
    },
    discoverItems: [
      {
        id: 'disc-stealth-1',
        type: 'recommendation',
        priority: 'critical',
        title: 'D7 retention at 18% — 2× below benchmark',
        description: 'Amplitude cohort shows only 18% of new signups return by Day 7. Industry benchmark for early-stage B2B is 35–40%. This is the top growth lever to address.',
        source: 'Amplitude',
        area: 'Retention',
        detectedAt: '2026-03-09T09:00:00Z',
        isNew: true,
      },
      {
        id: 'disc-stealth-2',
        type: 'recommendation',
        priority: 'critical',
        title: '31 open Sentry errors affecting 284 users',
        description: 'Sentry shows 31 unresolved errors in the last 7 days. 8 are categorized P1. At this scale, each P1 bug likely affects >10% of your active users — prioritize this sprint.',
        source: 'Sentry',
        area: 'Performance',
        detectedAt: '2026-03-09T07:30:00Z',
        isNew: true,
      },
      {
        id: 'disc-stealth-3',
        type: 'recommendation',
        priority: 'high',
        title: 'Referral widget showing viral lift signal',
        description: 'Early results from the waitlist referral experiment show 27% lift vs control. Referred users also activate at 2× the rate of organic signups. Worth fast-shipping.',
        source: 'Amplitude + PostHog',
        area: 'Acquisition',
        detectedAt: '2026-03-08T15:00:00Z',
        isNew: true,
      },
      {
        id: 'disc-stealth-4',
        type: 'recommendation',
        priority: 'high',
        title: 'API P95 latency at 280ms — optimize DB index',
        description: 'Prometheus shows median API latency is fine (82ms) but P95 is 280ms. Sentry traces point to a missing index on the user_events table — a 1-day engineering fix.',
        source: 'Prometheus + Sentry',
        area: 'Performance',
        detectedAt: '2026-03-07T12:00:00Z',
        isNew: false,
      },
      {
        id: 'disc-stealth-5',
        type: 'friction',
        priority: 'high',
        title: 'Pricing page — 52% abandon without scrolling',
        description: 'PostHog heatmaps show 52% of pricing page visitors leave before seeing the pricing tiers. The "Request Access" CTA is too far down — move it above the fold.',
        source: 'PostHog',
        area: 'Acquisition',
        detectedAt: '2026-03-06T10:00:00Z',
        isNew: false,
      },
    ],
    agentChatSeeds: [
      'Why is our D7 retention only 18%?',
      'Should we launch a referral program now?',
      'Which bugs should I prioritize this sprint?',
      'How is our MRR growth trending?',
    ],
  },
};

// ─── Default fallback ─────────────────────────────────────────────────────────

const defaultData: WorkspaceData = workspaceDataMap['ws-probe'];

// ─── Public API ───────────────────────────────────────────────────────────────

export function getWorkspaceData(workspaceId: string): WorkspaceData {
  return workspaceDataMap[workspaceId] ?? defaultData;
}
