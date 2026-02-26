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
  },
];
