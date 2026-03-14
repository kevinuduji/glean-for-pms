export type ActivityItem = {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  workspaceName: string;
  projectName: string;
  sectionName: string;
  sectionId: string;
  message: string;
  timestamp: string;
  read: boolean;
};

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 'a1',
    severity: 'critical',
    workspaceName: 'Global Markets',
    projectName: 'Fixed Income',
    sectionName: 'Duration Risk',
    sectionId: 's-fi-duration',
    message: 'Duration gap widened 18% above threshold — review hedging posture',
    timestamp: '2m ago',
    read: false,
  },
  {
    id: 'a2',
    severity: 'warning',
    workspaceName: 'BlackRock',
    projectName: 'Client Dashboard',
    sectionName: 'Onboarding',
    sectionId: 's-cd-onboarding',
    message: 'Onboarding completion rate dropped 9 pts this week',
    timestamp: '14m ago',
    read: false,
  },
  {
    id: 'a3',
    severity: 'info',
    workspaceName: 'Metronome',
    projectName: 'Billing Engine',
    sectionName: 'MRR Dashboard',
    sectionId: 's-bt-mrr',
    message: 'MRR crossed $1M milestone 🎉',
    timestamp: '1h ago',
    read: true,
  },
  {
    id: 'a4',
    severity: 'warning',
    workspaceName: 'Global Markets',
    projectName: 'Equity Research',
    sectionName: 'Factor Screening',
    sectionId: 's-er-screening',
    message: 'Value factor momentum reversing — 3 holdings flagged for review',
    timestamp: '3h ago',
    read: true,
  },
  {
    id: 'a5',
    severity: 'info',
    workspaceName: 'BlackRock',
    projectName: 'Q4 Roadmap',
    sectionName: 'Sprint Tracker',
    sectionId: 's-q4-sprint',
    message: 'Sprint 12 velocity 22% above baseline',
    timestamp: '5h ago',
    read: true,
  },
];
