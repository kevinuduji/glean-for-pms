export type ExperimentArea =
  | 'onboarding'
  | 'activation'
  | 'conversion'
  | 'retention'
  | 'billing'
  | 'homepage'
  | 'notifications'
  | 'search'
  | 'pricing';

export type Experiment = {
  id: string;
  name: string;
  status: 'running' | 'significant' | 'inconclusive' | 'draft';
  hypothesis: string;
  control: string;
  variant: string;
  primaryMetric: string;
  targetLift: number;
  currentLift?: number;
  confidence?: number;
  startDate: string;
  endDate?: string;
  sampleSize: { control: number; variant: number };
  createdBy: string;
  area: ExperimentArea;
  secondaryMetrics?: string[];
  insight?: string;
};

export const experiments: Experiment[] = [
  {
    id: 'exp-001',
    name: 'Onboarding Step 3 — Reduced Fields',
    status: 'draft',
    hypothesis: 'Reducing mandatory profile fields from 7 to 3 will increase step 3 completion by +15%',
    control: 'Current 7-field form (baseline completion: 59%)',
    variant: '3-field form + "Complete later" option',
    primaryMetric: 'onboarding_step3_completed',
    targetLift: 15,
    startDate: '2023-12-10',
    sampleSize: { control: 0, variant: 0 },
    createdBy: 'Kevin (Agent-assisted)',
    area: 'onboarding',
    secondaryMetrics: ['profile_completed_later_rate', 'd7_retention', 'time_to_first_action'],
  },
  {
    id: 'exp-002',
    name: 'Homepage CTA — Sticky on Scroll',
    status: 'running',
    hypothesis: 'A sticky CTA on scroll will increase homepage → signup conversion from 2.8% to 3.3%',
    control: 'Static CTA at top of page',
    variant: 'Sticky CTA that follows user on scroll',
    primaryMetric: 'homepage_cta_clicked',
    targetLift: 18,
    currentLift: 8.4,
    confidence: 72,
    startDate: '2023-11-28',
    sampleSize: { control: 1842, variant: 1890 },
    createdBy: 'sarah_kim',
    area: 'homepage',
    secondaryMetrics: ['signup_completed', 'bounce_rate'],
  },
  {
    id: 'exp-003',
    name: 'Email Verification — SMS Alternative',
    status: 'significant',
    hypothesis: 'Offering SMS as an alternative to email verification will reduce step 2 drop-off',
    control: 'Email-only verification',
    variant: 'Email or SMS verification',
    primaryMetric: 'signup_step2_completed',
    targetLift: 20,
    currentLift: 23.4,
    confidence: 97,
    startDate: '2023-10-01',
    endDate: '2023-10-28',
    sampleSize: { control: 4211, variant: 4308 },
    createdBy: 'dan_reeves',
    area: 'onboarding',
    insight: 'SMS verification dramatically reduced friction for mobile users — biggest win in Q4.',
    secondaryMetrics: ['d1_retention', 'time_to_verify'],
  },
  {
    id: 'exp-004',
    name: 'Billing Page — Plan Comparison Table',
    status: 'running',
    hypothesis: 'Adding a side-by-side plan comparison table will increase upgrade conversion',
    control: 'Current billing page with plan cards',
    variant: 'New comparison table layout',
    primaryMetric: 'upgrade_completed',
    targetLift: 12,
    currentLift: 3.1,
    confidence: 44,
    startDate: '2023-11-15',
    sampleSize: { control: 892, variant: 904 },
    createdBy: 'tom_wu',
    area: 'billing',
    secondaryMetrics: ['plan_page_time_spent', 'faq_expansion_rate'],
  },
  {
    id: 'exp-005',
    name: 'Notifications — Digest vs Real-time',
    status: 'draft',
    hypothesis: 'Batching notifications into a daily digest will increase open rate and reduce opt-out rate',
    control: 'Real-time push notifications (current)',
    variant: 'Daily digest email at 9 AM local time',
    primaryMetric: 'notification_open_rate',
    targetLift: 25,
    startDate: '2024-01-08',
    sampleSize: { control: 0, variant: 0 },
    createdBy: 'Kevin (Agent-assisted)',
    area: 'notifications',
    secondaryMetrics: ['notification_opt_out_rate', 'dau_next_day'],
  },
  {
    id: 'exp-006',
    name: 'Search — Autocomplete Suggestions',
    status: 'inconclusive',
    hypothesis: 'Showing autocomplete suggestions while typing will increase search result click-through',
    control: 'Search input with no autocomplete',
    variant: 'Autocomplete dropdown with top 5 suggestions',
    primaryMetric: 'search_result_clicked',
    targetLift: 15,
    currentLift: 2.1,
    confidence: 68,
    startDate: '2023-09-05',
    endDate: '2023-09-30',
    sampleSize: { control: 2890, variant: 2940 },
    createdBy: 'priya_nair',
    area: 'search',
    insight: 'Lift was too small and noisy to ship. Likely a UX polish win, not a growth lever. Revisit only if search becomes a core retention driver.',
    secondaryMetrics: ['search_abandonment_rate', 'time_to_first_result_click'],
  },
  {
    id: 'exp-007',
    name: 'Pricing Page — Annual Toggle Highlight',
    status: 'running',
    hypothesis: 'Visually highlighting the annual plan savings badge will increase annual plan selection',
    control: 'Monthly/annual toggle with no visual emphasis',
    variant: 'Toggle with animated "Save 25%" badge on annual',
    primaryMetric: 'annual_plan_selected',
    targetLift: 20,
    currentLift: 14.2,
    confidence: 81,
    startDate: '2023-12-01',
    sampleSize: { control: 1204, variant: 1198 },
    createdBy: 'sarah_kim',
    area: 'pricing',
    secondaryMetrics: ['checkout_started', 'plan_page_bounce_rate'],
  },
  {
    id: 'exp-008',
    name: 'Profile Page — Social Proof Badges',
    status: 'significant',
    hypothesis: 'Showing verified-user badges on profile completion prompts will increase profile completion rate',
    control: 'Plain profile completion prompt',
    variant: 'Prompt with "Join 12,000+ verified users" social proof badge',
    primaryMetric: 'profile_completed',
    targetLift: 15,
    currentLift: 19.7,
    confidence: 96,
    startDate: '2023-11-01',
    endDate: '2023-11-22',
    sampleSize: { control: 3102, variant: 3089 },
    createdBy: 'dan_reeves',
    area: 'activation',
    insight: 'Social proof meaningfully moved profile completions. Follow-on: test dynamic badge counts vs. static.',
    secondaryMetrics: ['d7_retention', 'first_connection_made'],
  },
];
