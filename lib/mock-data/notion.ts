export type NotionDocStatus = 'Live' | 'Draft' | 'In Review' | 'Archived';

export type NotionDoc = {
  id: string;
  title: string;
  type: 'PRD' | 'Spec' | 'RFC' | 'Retro' | 'Research';
  status: NotionDocStatus;
  author: string;
  authorInitial: string;
  lastEdited: string;
  linkedTickets: string[];
  excerpt: string;
  emoji: string;
};

export type NotionDatabase = {
  id: string;
  name: string;
  icon: string;
  rowCount: number;
  lastUpdated: string;
  description: string;
};

export const notionDocs: NotionDoc[] = [
  {
    id: 'ND-01',
    title: 'Checkout Reliability — PRD',
    type: 'PRD',
    status: 'Live',
    author: 'Lena Kovacs',
    authorInitial: 'L',
    lastEdited: '2 days ago',
    linkedTickets: ['PM-311', 'PM-308', 'PM-291'],
    excerpt: 'Reduce checkout abandonment from 71% to ≤55% by Dec 15. Root cause: race condition in card tokenization + DB pool saturation during peak traffic.',
    emoji: '🛒',
  },
  {
    id: 'ND-02',
    title: 'Onboarding V2 — Product Spec',
    type: 'Spec',
    status: 'Live',
    author: 'Marcus Webb',
    authorInitial: 'M',
    lastEdited: '4 days ago',
    linkedTickets: ['PM-312', 'PM-297', 'PM-280'],
    excerpt: 'Redesign the 6-step onboarding to reduce profile setup drop-off (currently 41%). Introduce progressive disclosure and defer non-critical fields.',
    emoji: '🚀',
  },
  {
    id: 'ND-03',
    title: 'Advanced Filters — Launch Retro',
    type: 'Retro',
    status: 'Live',
    author: 'Lena Kovacs',
    authorInitial: 'L',
    lastEdited: '1 week ago',
    linkedTickets: ['PM-204'],
    excerpt: 'Feature shipped Sep 22. 31% MAU adoption, +24pp D30 retention lift for adopters. Key win: early dogfooding caught 3 critical bugs pre-launch.',
    emoji: '✅',
  },
  {
    id: 'ND-04',
    title: 'Pricing Page Redesign — RFC',
    type: 'RFC',
    status: 'In Review',
    author: 'Priya Nair',
    authorInitial: 'P',
    lastEdited: '1 day ago',
    linkedTickets: ['PM-315'],
    excerpt: 'Proposal: replace static pricing table with interactive plan comparison. PostHog data shows 214 rage-clicks on dead CTA this week. Expected +12% trial starts.',
    emoji: '💰',
  },
  {
    id: 'ND-05',
    title: 'User Research — Checkout Pain Points',
    type: 'Research',
    status: 'Live',
    author: 'Sarah Chen',
    authorInitial: 'S',
    lastEdited: '3 days ago',
    linkedTickets: ['PM-311'],
    excerpt: 'Interviewed 12 users who abandoned checkout. Top frustrations: (1) card form resets on error, (2) no progress indicator, (3) unexpected fee reveal at final step.',
    emoji: '🔬',
  },
  {
    id: 'ND-06',
    title: 'Q4 Roadmap — Working Draft',
    type: 'PRD',
    status: 'Draft',
    author: 'Marcus Webb',
    authorInitial: 'M',
    lastEdited: '6 hours ago',
    linkedTickets: [],
    excerpt: 'Priorities: (1) Checkout reliability P0, (2) Onboarding V2 activation, (3) Pricing page lift. Stretch: real-time collaboration features for team plan.',
    emoji: '🗺️',
  },
];

export const notionDatabases: NotionDatabase[] = [
  { id: 'DB-01', name: 'Product Roadmap', icon: '🗺️', rowCount: 48, lastUpdated: '6 hours ago', description: 'Epics, features, and milestones by quarter' },
  { id: 'DB-02', name: 'Experiment Tracker', icon: '🧪', rowCount: 23, lastUpdated: '1 day ago', description: 'A/B tests with hypotheses, results, decisions' },
  { id: 'DB-03', name: 'Research Vault', icon: '🔬', rowCount: 31, lastUpdated: '3 days ago', description: 'User interviews, surveys, and synthesis docs' },
  { id: 'DB-04', name: 'Decision Log', icon: '📝', rowCount: 67, lastUpdated: '2 days ago', description: 'Key product decisions with context and rationale' },
];
