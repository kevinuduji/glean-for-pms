/**
 * Per-project mock data.
 * Two projects: Mobile App and B2B Tool — each with realistic, differentiated
 * metrics, experiments, connectors, and discover items.
 */

import type { Experiment, ExperimentIdea } from './experiments';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProjectKPIs = {
  dauSeed: number;
  mrrSeed: number;
  dauLabel: string;
  dauChange: number;
  mrrLabel: string;
  mrrChange: number;
  conversionPct: number;
  conversionChange: number;
  errorRate: number;
  errorRateChange: number;
  p95Latency: number;
  p95LatencyChange: number;
  featureUsage: { feature: string; users: number; pctOfDAU: number }[];
  conversionFunnel: { step: string; count: number; pct: number }[];
};

export type ProjectConnectorData = {
  activeIds: string[];
  overrides: Record<string, { label: string; value: string }[]>;
};

export type ProjectExperiments = {
  active: Experiment[];
  queue: Experiment[];
  ideas: ExperimentIdea[];
  archived: Experiment[];
};

export type ProjectDiscoverItem = {
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

export type ProjectData = {
  overview: ProjectKPIs;
  connectors: ProjectConnectorData;
  experiments: ProjectExperiments;
  discoverItems: ProjectDiscoverItem[];
  agentChatSeeds: string[];
};

// ─── All connector IDs ────────────────────────────────────────────────────────

export const ALL_CONNECTOR_IDS = [
  'amplitude', 'mixpanel', 'posthog', 'sentry', 'github',
  'prometheus', 'slack', 'jira', 'notion', 'stripe', 'datadog',
];

// ─── Project data map ─────────────────────────────────────────────────────────

const projectDataMap: Record<string, ProjectData> = {

  // ── Mobile App ──────────────────────────────────────────────────────────────
  'project-mobile': {
    overview: {
      dauSeed:           18500,
      mrrSeed:           52800,
      dauLabel:          '18,500',
      dauChange:         6.2,
      mrrLabel:          '$52.8K',
      mrrChange:         9.3,
      conversionPct:     28,       // D7 Retention (%)
      conversionChange:  1.4,
      errorRate:         0.9,      // Crash-free session failures (%)
      errorRateChange:   -0.2,
      p95Latency:        142,
      p95LatencyChange:  -8,
      featureUsage: [
        { feature: 'Home Feed',      users: 17390, pctOfDAU: 94 },
        { feature: 'Notifications',  users: 13690, pctOfDAU: 74 },
        { feature: 'Activity',       users: 10730, pctOfDAU: 58 },
        { feature: 'Profile',        users:  8510, pctOfDAU: 46 },
        { feature: 'Settings',       users:  5180, pctOfDAU: 28 },
        { feature: 'Social Share',   users:  2220, pctOfDAU: 12 },
      ],
      conversionFunnel: [
        { step: 'App Install',          count: 42000, pct: 100  },
        { step: 'Onboarding Start',     count: 35700, pct: 85   },
        { step: 'Onboarding Complete',  count: 22680, pct: 54   },
        { step: 'First Core Action',    count: 15120, pct: 36   },
        { step: 'D7 Active',            count: 11760, pct: 28   },
      ],
    },

    connectors: {
      activeIds: ['amplitude', 'mixpanel', 'posthog', 'sentry', 'github'],
      overrides: {
        amplitude: [
          { label: 'Events tracked',    value: '214K' },
          { label: 'Funnels monitored', value: '5'    },
          { label: 'Active cohorts',    value: '11'   },
        ],
        mixpanel: [
          { label: 'Tracked users',  value: '94K' },
          { label: 'Funnels',        value: '6'   },
          { label: 'Reports',        value: '18'  },
        ],
        posthog: [
          { label: 'Sessions analyzed', value: '3,840' },
          { label: 'Flagged sessions',  value: '62'    },
          { label: 'Feature flags',     value: '7'     },
        ],
        sentry: [
          { label: 'Active errors',      value: '8'     },
          { label: 'Users affected',     value: '1,620' },
          { label: 'Occurrences (30d)',  value: '4,210' },
        ],
        github: [
          { label: 'Repos indexed', value: '3'   },
          { label: 'Open PRs',      value: '6'   },
          { label: 'Commits (30d)', value: '184' },
        ],
      },
    },

    experiments: {
      active: [
        {
          id:              'mob-exp-1',
          name:            'Simplified Onboarding (5 → 3 Steps)',
          status:          'running',
          hypothesis:
            'Reducing onboarding from 5 steps to 3 by removing the "Connect Calendar" and "Invite Friends" gates will increase D1 activation by removing the two highest drop-off points.',
          primaryMetric:   'd1_activation_rate',
          targetLift:      12,
          currentLift:     15.8,
          confidence:      91,
          startDate:       '2026-02-24',
          estimatedEndDate: '2026-03-17',
          sampleSize:      { current: 7840, target: 8000 },
          traffic:         50,
          source:          'Discover — onboarding drop-off signal',
          dataSources: [
            {
              name: 'Amplitude',
              color: 'bg-violet-50',
              textColor: 'text-violet-700',
              borderColor: 'border-violet-200',
              emoji: '📊',
              tracking: [
                'D1 activation rate per variant',
                'Onboarding step completion funnel',
                'Time-to-first-core-action',
              ],
            },
            {
              name: 'PostHog',
              color: 'bg-orange-50',
              textColor: 'text-orange-700',
              borderColor: 'border-orange-200',
              emoji: '🦔',
              tracking: [
                'Session recordings at each onboarding step',
                'Rage click detection on step CTAs',
              ],
            },
          ],
        },
        {
          id:              'mob-exp-2',
          name:            'Push Notification Timing (6pm vs 8pm)',
          status:          'running',
          hypothesis:
            'Sending re-engagement push notifications at 8pm local time will outperform 6pm by catching users in their leisure window, increasing D7 retention.',
          primaryMetric:   'd7_retention_rate',
          targetLift:      8,
          currentLift:     7.8,
          confidence:      74,
          startDate:       '2026-03-01',
          estimatedEndDate: '2026-03-22',
          sampleSize:      { current: 4210, target: 6000 },
          traffic:         30,
          source:          'PM Hypothesis',
          dataSources: [
            {
              name: 'Amplitude',
              color: 'bg-violet-50',
              textColor: 'text-violet-700',
              borderColor: 'border-violet-200',
              emoji: '📊',
              tracking: [
                'D7 retention by push send time',
                'Push open rate per variant',
                'Session starts within 30min of push',
              ],
            },
          ],
        },
      ],
      queue: [
        {
          id:        'mob-q-1',
          name:      'Bottom Nav Reorder — Activity First',
          status:    'draft',
          hypothesis:
            'Moving "Activity" to the first tab position will increase engagement with the feature from 58% to 70%+ of DAU, given it is the stickiest surface in session data.',
          primaryMetric: 'activity_tab_engagement',
          targetLift:  20,
          startDate:   '2026-03-24',
          sampleSize:  { current: 0, target: 10000 },
          traffic:     50,
        },
        {
          id:        'mob-q-2',
          name:      'Dark Mode Default for New Installs',
          status:    'draft',
          hypothesis:
            'Defaulting to dark mode on new installs will reduce early uninstall rate, as PostHog sessions show users who manually switch to dark mode have 2× the D30 retention.',
          primaryMetric: 'd30_retention_rate',
          targetLift:  10,
          startDate:   '2026-04-01',
          sampleSize:  { current: 0, target: 8000 },
          traffic:     20,
        },
      ],
      ideas: [
        {
          id:              'mob-idea-1',
          title:           'Daily Streak Gamification for Power Users',
          description:
            'Amplitude shows a -22% DAU dip on weekends. Adding a daily streak mechanic (similar to Duolingo) could create a "must open" habit loop that smooths the weekly curve.',
          source:          'discover',
          priority:        'high',
          estimatedImpact: 18,
          confidence:      62,
        },
        {
          id:              'mob-idea-2',
          title:           'Social Share on Achievement Unlock',
          description:
            'Activity-tab power users spend 3× longer in the app but share content at only 12% of DAU. An in-context share prompt at achievement moments could grow organic installs.',
          source:          'ai',
          priority:        'medium',
          estimatedImpact: 11,
          confidence:      48,
        },
      ],
      archived: [
        {
          id:        'mob-arch-1',
          name:      'Force Update Modal Variant',
          status:    'inconclusive',
          hypothesis:
            'A softer "update available" banner instead of a blocking modal will reduce force-update session abandonment.',
          primaryMetric: 'update_abandonment_rate',
          targetLift:  15,
          currentLift: 4.2,
          confidence:  51,
          startDate:   '2026-01-12',
          endDate:     '2026-02-08',
          sampleSize:  { current: 9800, target: 10000 },
          traffic:     50,
          keyLearning:
            'Inconclusive — the soft banner drove slightly lower abandonment but the effect was within noise. Shipped the default (blocking modal) with improved copy.',
          nextActions: ['Revisit with a snooze mechanic in Q3'],
        },
        {
          id:        'mob-arch-2',
          name:      'Splash Screen A/B — Illustration vs Stats',
          status:    'shipped',
          hypothesis:
            'Showing social proof stats ("100K users") on the splash screen will outperform illustration-only for first impression.',
          primaryMetric: 'd1_activation_rate',
          targetLift:  5,
          currentLift: 6.8,
          confidence:  88,
          startDate:   '2026-01-20',
          endDate:     '2026-02-15',
          sampleSize:  { current: 14200, target: 12000 },
          traffic:     50,
          keyLearning:
            'Stats variant won with +6.8% D1 activation. Shipped to 100% on Feb 15.',
          nextActions: ['Test stats copy variations in Q2'],
        },
      ],
    },

    discoverItems: [
      {
        id:          'disc-mob-1',
        type:        'recommendation',
        priority:    'critical',
        title:       'Step 3 onboarding drop-off spiked +23% this week',
        description:
          'Amplitude shows 54% of users abandon at the "Connect Calendar" step — up from 44% last week. PostHog recordings show users hesitating on the permissions dialog. Making this step optional would recover an estimated 4,000+ activations per week.',
        source:      'Amplitude + PostHog',
        area:        'Activation',
        detectedAt:  '2026-03-10T08:30:00Z',
        isNew:       true,
      },
      {
        id:          'disc-mob-2',
        type:        'recommendation',
        priority:    'high',
        title:       'iOS 17 users showing 0.8% crash rate on payment screen',
        description:
          'Sentry captured a null reference exception on the PaymentViewController that only affects iOS 17.2+. Crash-free rate for this cohort is 99.2% vs 99.9% for iOS 16. Affects ~3,200 active users.',
        source:      'Sentry',
        area:        'Stability',
        detectedAt:  '2026-03-09T14:00:00Z',
        isNew:       true,
      },
      {
        id:          'disc-mob-3',
        type:        'recommendation',
        priority:    'high',
        title:       'Power users spending 3× longer on Activity tab — underinvested surface',
        description:
          'Amplitude cohort shows users who engage with the Activity tab at least 3×/week have D30 retention of 61% vs 28% overall. The tab receives 58% of DAU but only 4 engineering sprints in the last 6 months.',
        source:      'Amplitude',
        area:        'Retention',
        detectedAt:  '2026-03-08T10:00:00Z',
        isNew:       false,
      },
      {
        id:          'disc-mob-4',
        type:        'friction',
        priority:    'high',
        title:       'Push opt-out spike on Monday mornings (8–10am)',
        description:
          'Amplitude shows 3× the normal push opt-out rate on Monday mornings. The 8am automated re-engagement push is firing during a low-intent window. Pausing Monday morning sends could reduce opt-outs while the timing experiment runs.',
        source:      'Amplitude',
        area:        'Retention',
        detectedAt:  '2026-03-08T11:30:00Z',
        isNew:       true,
      },
      {
        id:          'disc-mob-5',
        type:        'recommendation',
        priority:    'medium',
        title:       'Android D30 retention 9pp below iOS — platform gap',
        description:
          'Amplitude cohort: iOS D30 retention = 31%, Android = 22%. The gap has persisted across 3 releases. PostHog shows Android users encounter more scroll jitter on the Home Feed, which may explain earlier churn.',
        source:      'Amplitude + PostHog',
        area:        'Retention',
        detectedAt:  '2026-03-06T09:00:00Z',
        isNew:       false,
      },
    ],

    agentChatSeeds: [
      'Why did onboarding drop-off spike this week?',
      'How is the simplified onboarding experiment performing?',
      'What should I do to improve D7 retention?',
      'Summarize the Activity tab engagement data',
      'Which experiments are closest to stat significance?',
    ],
  },

  // ── B2B Tool ────────────────────────────────────────────────────────────────
  'project-b2b': {
    overview: {
      dauSeed:           1240,
      mrrSeed:           84200,
      dauLabel:          '1,240',
      dauChange:         4.8,
      mrrLabel:          '$84.2K',
      mrrChange:         7.4,
      conversionPct:     22,       // Trial-to-paid conversion (%)
      conversionChange:  2.8,
      errorRate:         0.6,
      errorRateChange:   -0.3,
      p95Latency:        210,
      p95LatencyChange:  14,
      featureUsage: [
        { feature: 'Dashboard',     users: 1128, pctOfDAU: 91 },
        { feature: 'Reports',       users:  856, pctOfDAU: 69 },
        { feature: 'Integrations',  users:  608, pctOfDAU: 49 },
        { feature: 'Team Reports',  users:   99, pctOfDAU:  8 },
        { feature: 'API Access',    users:  360, pctOfDAU: 29 },
        { feature: 'Admin Settings',users:  248, pctOfDAU: 20 },
      ],
      conversionFunnel: [
        { step: 'Landing Visit',    count: 28400, pct: 100  },
        { step: 'Trial Start',      count:  5112, pct: 18   },
        { step: 'Integration Setup',count:  3323, pct: 11.7 },
        { step: 'Activation',       count:  2046, pct: 7.2  },
        { step: 'Paid Conversion',  count:  1125, pct: 3.96 },
      ],
    },

    connectors: {
      activeIds: ['amplitude', 'stripe', 'mixpanel', 'slack', 'jira', 'github'],
      overrides: {
        amplitude: [
          { label: 'Events tracked',    value: '88K' },
          { label: 'Funnels monitored', value: '8'   },
          { label: 'Active cohorts',    value: '16'  },
        ],
        stripe: [
          { label: 'MRR',         value: '$84.2K'  },
          { label: 'MRR Growth',  value: '+7.4%'   },
          { label: 'Churn Rate',  value: '2.1%/mo' },
        ],
        mixpanel: [
          { label: 'Tracked users', value: '6.8K' },
          { label: 'Funnels',       value: '9'    },
          { label: 'Reports',       value: '24'   },
        ],
        slack: [
          { label: 'Channels monitored', value: '14'  },
          { label: 'Alerts fired (30d)',  value: '42'  },
          { label: 'Escalations open',   value: '3'   },
        ],
        jira: [
          { label: 'Epics tracked',     value: '8'   },
          { label: 'Open blockers',     value: '2'   },
          { label: 'Tickets (30d)',     value: '112' },
        ],
        github: [
          { label: 'Repos indexed', value: '5'   },
          { label: 'Open PRs',      value: '9'   },
          { label: 'Commits (30d)', value: '231' },
        ],
      },
    },

    experiments: {
      active: [
        {
          id:              'b2b-exp-1',
          name:            'Pricing Page: Annual Toggle Prominence',
          status:          'running',
          hypothesis:
            'Making annual billing the default-selected option (currently monthly) will increase annual plan take rate from 31% to 40%+, reducing churn and increasing LTV.',
          primaryMetric:   'annual_plan_take_rate',
          targetLift:      9,
          currentLift:     10.2,
          confidence:      96,
          startDate:       '2026-02-14',
          estimatedEndDate: '2026-03-14',
          sampleSize:      { current: 4820, target: 5000 },
          traffic:         50,
          source:          'PM Hypothesis',
          dataSources: [
            {
              name: 'Stripe',
              color: 'bg-indigo-50',
              textColor: 'text-indigo-700',
              borderColor: 'border-indigo-200',
              emoji: '💳',
              tracking: [
                'Annual vs monthly plan selection rate',
                'Revenue per new customer by variant',
                'Churn rate at 90 days by plan type',
              ],
            },
            {
              name: 'Amplitude',
              color: 'bg-violet-50',
              textColor: 'text-violet-700',
              borderColor: 'border-violet-200',
              emoji: '📊',
              tracking: [
                'Pricing page → checkout funnel by variant',
                'Time-on-pricing-page before conversion',
              ],
            },
          ],
        },
        {
          id:              'b2b-exp-2',
          name:            'Trial Extension Offer at Day 12',
          status:          'running',
          hypothesis:
            'Offering a 7-day trial extension to unconverted Day-12 trial users will recover 15% of at-risk conversions before they churn from the trial.',
          primaryMetric:   'trial_conversion_rate',
          targetLift:      15,
          currentLift:     11.4,
          confidence:      82,
          startDate:       '2026-03-01',
          estimatedEndDate: '2026-03-28',
          sampleSize:      { current: 2140, target: 3000 },
          traffic:         30,
          source:          'Discover — trial drop-off signal',
          dataSources: [
            {
              name: 'Stripe',
              color: 'bg-indigo-50',
              textColor: 'text-indigo-700',
              borderColor: 'border-indigo-200',
              emoji: '💳',
              tracking: [
                'Trial-to-paid conversion rate by cohort',
                'Revenue recovered from extension users',
              ],
            },
            {
              name: 'Amplitude',
              color: 'bg-violet-50',
              textColor: 'text-violet-700',
              borderColor: 'border-violet-200',
              emoji: '📊',
              tracking: [
                'Feature usage depth during extension period',
                'Activation completion during extension',
              ],
            },
          ],
        },
      ],
      queue: [
        {
          id:        'b2b-q-1',
          name:      'In-app Upgrade Prompt After Feature Limit Hit',
          status:    'draft',
          hypothesis:
            'Showing a contextual upgrade prompt immediately after a user hits a free-tier limit will convert 25% of limit-hitters, vs. 8% who upgrade through the pricing page.',
          primaryMetric: 'feature_limit_upgrade_rate',
          targetLift:  25,
          startDate:   '2026-03-24',
          sampleSize:  { current: 0, target: 2000 },
          traffic:     50,
        },
        {
          id:        'b2b-q-2',
          name:      'Onboarding Checklist Redesign — Progress Bar First',
          status:    'draft',
          hypothesis:
            'Leading with a progress bar showing "2/5 steps complete" before showing the checklist items creates a completion pull that increases activation rate.',
          primaryMetric: 'activation_rate',
          targetLift:  18,
          startDate:   '2026-04-01',
          sampleSize:  { current: 0, target: 1500 },
          traffic:     50,
        },
      ],
      ideas: [
        {
          id:              'b2b-idea-1',
          title:           'Expansion Revenue Email Sequence for Accounts with 3+ Seats',
          description:
            'Stripe shows accounts with 5+ seats churn at 4× lower rate than solo accounts. An outbound email sequence to 3-seat accounts that highlights team features could drive seat expansion.',
          source:          'discover',
          priority:        'high',
          estimatedImpact: 24,
          confidence:      70,
        },
        {
          id:              'b2b-idea-2',
          title:           'Admin Dashboard Personalization by Role',
          description:
            'Amplitude shows "Team Reports" has only 8% adoption despite being the top-voted feature. Surfacing it based on admin vs IC role on first login could drive adoption without redesign.',
          source:          'ai',
          priority:        'medium',
          estimatedImpact: 14,
          confidence:      55,
        },
      ],
      archived: [
        {
          id:        'b2b-arch-1',
          name:      'Free Tier Feature Gating Test',
          status:    'inconclusive',
          hypothesis:
            'Gating the Integrations feature behind paid plans will increase trial-to-paid conversion by creating urgency.',
          primaryMetric: 'trial_conversion_rate',
          targetLift:  10,
          currentLift: -3.2,
          confidence:  78,
          startDate:   '2026-01-15',
          endDate:     '2026-02-12',
          sampleSize:  { current: 3800, target: 3500 },
          traffic:     50,
          keyLearning:
            'Backfired — NPS dropped 6 points and trial conversion fell 3%. Users who couldn\'t access integrations churned faster. Feature gating removed; restored to all tiers.',
          nextActions: ['Explore usage-based pricing instead of hard gates'],
        },
        {
          id:        'b2b-arch-2',
          name:      'Referral Banner — Top-of-Dashboard Placement',
          status:    'shipped',
          hypothesis:
            'Moving the referral program banner from settings to the top of the main dashboard will increase referral program discovery and activation.',
          primaryMetric: 'referral_program_activation',
          targetLift:  30,
          currentLift: 34.8,
          confidence:  94,
          startDate:   '2026-01-28',
          endDate:     '2026-02-24',
          sampleSize:  { current: 2200, target: 2000 },
          traffic:     50,
          keyLearning:
            'Dashboard placement drove +34.8% referral activation. Shipped Feb 24. Generated 48 new sign-ups in first 2 weeks.',
          nextActions: ['A/B test banner copy variations in Q2'],
        },
      ],
    },

    discoverItems: [
      {
        id:          'disc-b2b-1',
        type:        'recommendation',
        priority:    'critical',
        title:       '35% of trial users never complete integration setup — biggest conversion killer',
        description:
          'Amplitude funnel shows 65% of trial users who reach the "Connect your first integration" step abandon without completing. Users who successfully connect an integration convert to paid at 4× the rate of those who don\'t. Estimated monthly revenue impact of fixing: +$12K MRR.',
        source:      'Amplitude + Stripe',
        area:        'Activation',
        detectedAt:  '2026-03-10T09:00:00Z',
        isNew:       true,
      },
      {
        id:          'disc-b2b-2',
        type:        'recommendation',
        priority:    'high',
        title:       'Accounts with 5+ seats have 4× lower churn — not in pricing strategy',
        description:
          'Stripe cohort analysis: monthly churn for 1-seat accounts is 4.8% vs 1.2% for accounts with 5+ seats. The current pricing structure doesn\'t incentivize seat expansion. A team tier or volume discount could shift the mix.',
        source:      'Stripe + Amplitude',
        area:        'Retention',
        detectedAt:  '2026-03-09T11:00:00Z',
        isNew:       true,
      },
      {
        id:          'disc-b2b-3',
        type:        'recommendation',
        priority:    'high',
        title:       '"Team Reports" has 8% adoption — top-voted feature for 2 quarters',
        description:
          'Amplitude shows only 8% of DAU uses Team Reports despite it topping the feature request board for 6 months. Intercom shows users ask about it in 14% of support tickets. Discoverability is likely the issue — it\'s buried 3 levels deep in Settings.',
        source:      'Amplitude + Intercom',
        area:        'Engagement',
        detectedAt:  '2026-03-08T14:00:00Z',
        isNew:       false,
      },
      {
        id:          'disc-b2b-4',
        type:        'friction',
        priority:    'high',
        title:       'P95 API latency climbing — up 14ms in 7 days',
        description:
          'Datadog shows P95 latency rose from 196ms to 210ms over the past week. Jira EP-509 (DB query optimization) has been in review for 11 days. If the trend continues, it will breach the 250ms SLA threshold by end of month.',
        source:      'Datadog + Jira',
        area:        'Performance',
        detectedAt:  '2026-03-09T08:00:00Z',
        isNew:       true,
      },
      {
        id:          'disc-b2b-5',
        type:        'recommendation',
        priority:    'medium',
        title:       'NPS score of +41 — detractors concentrated in SMB segment',
        description:
          'Intercom NPS breakdown: enterprise accounts score +68, SMB accounts score +18. Top detractor complaint: "too complex for a small team." A simplified onboarding flow for solo/2-person teams could address this segment.',
        source:      'Intercom',
        area:        'Satisfaction',
        detectedAt:  '2026-03-07T13:00:00Z',
        isNew:       false,
      },
    ],

    agentChatSeeds: [
      'What is blocking trial-to-paid conversion?',
      'How is the annual pricing toggle experiment performing?',
      'Which accounts are at churn risk this month?',
      'Why is Team Reports adoption so low despite high demand?',
      'Summarize our B2B growth metrics for the past 30 days',
    ],
  },
};

// ─── Default fallback ─────────────────────────────────────────────────────────

const defaultData: ProjectData = projectDataMap['project-mobile'];

// ─── Public API ───────────────────────────────────────────────────────────────

export function getProjectData(projectId: string): ProjectData {
  return projectDataMap[projectId] ?? defaultData;
}
