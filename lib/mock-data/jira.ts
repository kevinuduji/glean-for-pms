export type JiraStatus = 'To Do' | 'In Progress' | 'In Review' | 'Done' | 'Blocked';
export type JiraPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type JiraIssue = {
  id: string;
  title: string;
  status: JiraStatus;
  priority: JiraPriority;
  assignee: string;
  assigneeInitial: string;
  epic: string;
  storyPoints: number;
  daysInStatus: number;
  labels: string[];
};

export type JiraSprint = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  completedPoints: number;
  totalPoints: number;
  issueCount: number;
  completedIssues: number;
};

export type JiraEpic = {
  id: string;
  name: string;
  color: string;
  totalIssues: number;
  completedIssues: number;
  targetDate: string;
};

export const currentSprint: JiraSprint = {
  id: 'SP-24',
  name: 'Sprint 24 — Checkout Hardening',
  startDate: 'Nov 27',
  endDate: 'Dec 8',
  completedPoints: 34,
  totalPoints: 56,
  issueCount: 18,
  completedIssues: 11,
};

export const jiraEpics: JiraEpic[] = [
  { id: 'EP-12', name: 'Checkout Reliability', color: '#ef4444', totalIssues: 14, completedIssues: 9, targetDate: 'Dec 15' },
  { id: 'EP-08', name: 'Onboarding V2', color: '#8b5cf6', totalIssues: 22, completedIssues: 16, targetDate: 'Jan 12' },
  { id: 'EP-15', name: 'Advanced Filters', color: '#3b82f6', totalIssues: 8, completedIssues: 8, targetDate: 'Oct 31' },
  { id: 'EP-17', name: 'Pricing Page Redesign', color: '#f97316', totalIssues: 11, completedIssues: 3, targetDate: 'Jan 31' },
];

export const jiraIssues: JiraIssue[] = [
  {
    id: 'PM-311',
    title: 'Fix payment details form — race condition on card tokenization',
    status: 'In Progress',
    priority: 'Critical',
    assignee: 'Priya Nair',
    assigneeInitial: 'P',
    epic: 'Checkout Reliability',
    storyPoints: 8,
    daysInStatus: 2,
    labels: ['bug', 'payments', 'regression'],
  },
  {
    id: 'PM-312',
    title: 'Email verification retry logic — reduce drop-off at step 3',
    status: 'In Review',
    priority: 'High',
    assignee: 'Marcus Webb',
    assigneeInitial: 'M',
    epic: 'Onboarding V2',
    storyPoints: 5,
    daysInStatus: 1,
    labels: ['onboarding', 'retention'],
  },
  {
    id: 'PM-315',
    title: 'Fix dead "Compare plans" CTA on pricing page',
    status: 'To Do',
    priority: 'High',
    assignee: 'Lena Kovacs',
    assigneeInitial: 'L',
    epic: 'Pricing Page Redesign',
    storyPoints: 2,
    daysInStatus: 0,
    labels: ['ux', 'pricing'],
  },
  {
    id: 'PM-308',
    title: 'Add payments-service DB connection pool monitoring alert',
    status: 'In Review',
    priority: 'High',
    assignee: 'Sarah Chen',
    assigneeInitial: 'S',
    epic: 'Checkout Reliability',
    storyPoints: 3,
    daysInStatus: 3,
    labels: ['infra', 'monitoring'],
  },
  {
    id: 'PM-297',
    title: 'Profile setup step — streamline with progressive disclosure',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Marcus Webb',
    assigneeInitial: 'M',
    epic: 'Onboarding V2',
    storyPoints: 5,
    daysInStatus: 4,
    labels: ['onboarding', 'ux'],
  },
  {
    id: 'PM-305',
    title: 'Rage-click detection: surface heatmap data to PM dashboard',
    status: 'Done',
    priority: 'Medium',
    assignee: 'Lena Kovacs',
    assigneeInitial: 'L',
    epic: 'Pricing Page Redesign',
    storyPoints: 3,
    daysInStatus: 5,
    labels: ['analytics', 'posthog'],
  },
  {
    id: 'PM-291',
    title: 'Blocked: payments-service incident post-mortem action items',
    status: 'Blocked',
    priority: 'High',
    assignee: 'Sarah Chen',
    assigneeInitial: 'S',
    epic: 'Checkout Reliability',
    storyPoints: 5,
    daysInStatus: 6,
    labels: ['incident', 'follow-up'],
  },
  {
    id: 'PM-280',
    title: 'A/B test new onboarding checklist UI — target 15% activation lift',
    status: 'Done',
    priority: 'High',
    assignee: 'Priya Nair',
    assigneeInitial: 'P',
    epic: 'Onboarding V2',
    storyPoints: 8,
    daysInStatus: 12,
    labels: ['experiment', 'onboarding'],
  },
];
