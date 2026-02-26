export type GitCommit = {
  sha: string;
  author: string;
  date: string;
  message: string;
  files: string[];
  additions: number;
  deletions: number;
};

export type PullRequest = {
  number: number;
  title: string;
  author: string;
  status: 'open' | 'merged' | 'closed';
  openedAt: string;
  mergedAt?: string;
  description: string;
  labels: string[];
  daysOpen?: number;
};

export const commits: GitCommit[] = [
  {
    sha: 'a3f92c',
    author: 'dan_reeves',
    date: '2023-11-03T16:42:11Z',
    message: 'fix: tighten email validation regex in onboarding step 2',
    files: ['src/onboarding/step2/validation.ts', 'src/onboarding/step2/validation.test.ts'],
    additions: 12,
    deletions: 8,
  },
  {
    sha: 'b8e41d',
    author: 'infra-bot',
    date: '2023-12-01T13:58:22Z',
    message: 'chore: deploy payments-service v2.4.1',
    files: ['deploy/payments-service/values.yaml'],
    additions: 3,
    deletions: 3,
  },
  {
    sha: 'c9f3a1',
    author: 'sarah_kim',
    date: '2023-10-14T10:22:44Z',
    message: 'feat: launch homepage v2 redesign',
    files: ['src/pages/homepage/index.tsx', 'src/pages/homepage/Hero.tsx', 'src/pages/homepage/Pricing.tsx'],
    additions: 847,
    deletions: 312,
  },
  {
    sha: 'd4b72e',
    author: 'marcus_chen',
    date: '2023-09-22T09:15:33Z',
    message: 'feat: ship Advanced Filters (PR #187)',
    files: ['src/components/filters/AdvancedFilters.tsx', 'src/api/filters.ts'],
    additions: 421,
    deletions: 0,
  },
  {
    sha: 'e1c853',
    author: 'priya_nair',
    date: '2023-11-15T14:30:22Z',
    message: 'fix: CSV export button disabled state fix (partial)',
    files: ['src/pages/reports/ExportButton.tsx'],
    additions: 18,
    deletions: 4,
  },
];

export const pullRequests: PullRequest[] = [
  {
    number: 204,
    title: 'Homepage v2 redesign',
    author: 'sarah_kim',
    status: 'merged',
    openedAt: '2023-10-12T09:00:00Z',
    mergedAt: '2023-10-14T10:22:44Z',
    description: 'Complete redesign of marketing homepage with new pricing section and hero component.',
    labels: ['design', 'marketing'],
  },
  {
    number: 198,
    title: 'Fix: Enable CSV export button on /reports',
    author: 'priya_nair',
    status: 'open',
    openedAt: '2023-10-22T11:30:00Z',
    description: 'The CSV export button is disabled due to a missing feature flag check. This PR removes the incorrect guard.',
    labels: ['bug', 'reports'],
    daysOpen: 34,
  },
  {
    number: 203,
    title: 'Billing page UX redesign',
    author: 'tom_wu',
    status: 'open',
    openedAt: '2023-10-18T08:45:00Z',
    description: 'Redesign the billing settings page to clarify plan options and improve upgrade CTA visibility.',
    labels: ['design', 'billing'],
    daysOpen: 38,
  },
  {
    number: 211,
    title: 'feat: Smart Notifications (digest email + in-app center)',
    author: 'alex_torres',
    status: 'open',
    openedAt: '2023-11-20T13:15:00Z',
    description: 'Adds weekly digest email and in-app notification center. See PM-244 for context.',
    labels: ['feature', 'notifications'],
    daysOpen: 9,
  },
  {
    number: 187,
    title: 'feat: Advanced Filters for all list views',
    author: 'marcus_chen',
    status: 'merged',
    openedAt: '2023-09-18T10:00:00Z',
    mergedAt: '2023-09-22T09:15:33Z',
    description: 'Adds advanced filtering capabilities to all list/table views. Tied to PM-204 success criteria.',
    labels: ['feature', 'core'],
  },
];
