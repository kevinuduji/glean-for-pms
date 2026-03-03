export type SlackMessage = {
  id: string;
  channel: string;
  author: string;
  avatarInitial: string;
  text: string;
  timestamp: string;
  reactions?: { emoji: string; count: number }[];
  isAlert?: boolean;
};

export type SlackChannel = {
  id: string;
  name: string;
  purpose: string;
  messageCount: number;
  membersCount: number;
  lastActivity: string;
};

export const slackChannels: SlackChannel[] = [
  { id: 'C01', name: '#product', purpose: 'Product discussions and roadmap updates', messageCount: 342, membersCount: 28, lastActivity: '2 minutes ago' },
  { id: 'C02', name: '#engineering', purpose: 'Engineering team coordination', messageCount: 891, membersCount: 41, lastActivity: '5 minutes ago' },
  { id: 'C03', name: '#incidents', purpose: 'On-call alerts and incident response', messageCount: 67, membersCount: 55, lastActivity: '18 minutes ago' },
  { id: 'C04', name: '#pm-alerts', purpose: 'Automated PM metrics alerts', messageCount: 124, membersCount: 12, lastActivity: '1 hour ago' },
  { id: 'C05', name: '#design', purpose: 'Design reviews and feedback', messageCount: 215, membersCount: 19, lastActivity: '3 hours ago' },
];

export const recentMessages: SlackMessage[] = [
  {
    id: 'M01',
    channel: '#pm-alerts',
    author: 'Probe Bot',
    avatarInitial: 'P',
    text: '🔴 Alert: Checkout funnel drop-off increased to 71% at "Payment details" step — up from 58% yesterday. Possible regression after PM-311 deploy.',
    timestamp: '10:03 AM',
    isAlert: true,
    reactions: [{ emoji: '👀', count: 4 }, { emoji: '🔥', count: 2 }],
  },
  {
    id: 'M02',
    channel: '#incidents',
    author: 'Sarah Chen',
    avatarInitial: 'S',
    text: 'payments-service P95 latency spiked to 2,800ms at 09:47. On-call paged. Root cause: DB connection pool saturation. Mitigation in progress.',
    timestamp: '9:52 AM',
    isAlert: true,
    reactions: [{ emoji: '🚨', count: 6 }],
  },
  {
    id: 'M03',
    channel: '#product',
    author: 'Marcus Webb',
    avatarInitial: 'M',
    text: 'Feature flags for the new onboarding flow are live in 10% rollout. Amplitude cohort set up to track activation rates. Let\'s review numbers Friday.',
    timestamp: '9:30 AM',
    reactions: [{ emoji: '✅', count: 5 }, { emoji: '🎉', count: 3 }],
  },
  {
    id: 'M04',
    channel: '#engineering',
    author: 'Priya Nair',
    avatarInitial: 'P',
    text: 'PR #312 is up for the email verification retry logic. Addresses the 34% drop-off we saw in the Nov signup funnel. Needs 2 approvals.',
    timestamp: '9:15 AM',
    reactions: [{ emoji: '👍', count: 2 }],
  },
  {
    id: 'M05',
    channel: '#pm-alerts',
    author: 'Probe Bot',
    avatarInitial: 'P',
    text: '📈 DAU up 8.2% week-over-week (1,024 vs 946). Advanced Filters feature showing strong correlation — users who adopted it have 67% D30 retention vs 43% baseline.',
    timestamp: 'Yesterday 4:05 PM',
    isAlert: false,
    reactions: [{ emoji: '📊', count: 3 }, { emoji: '🚀', count: 7 }],
  },
  {
    id: 'M06',
    channel: '#product',
    author: 'Lena Kovacs',
    avatarInitial: 'L',
    text: 'PostHog flagged 214 sessions with rage-clicks on the pricing page this week. Heatmap shows users are clicking the "Compare plans" CTA that leads nowhere. Filing PM-315.',
    timestamp: 'Yesterday 2:30 PM',
    reactions: [{ emoji: '😅', count: 4 }, { emoji: '👀', count: 2 }],
  },
  {
    id: 'M07',
    channel: '#incidents',
    author: 'On-Call Bot',
    avatarInitial: 'O',
    text: '✅ Incident resolved. payments-service latency back to normal (P95: 380ms). Total impact: ~1,200 affected sessions over 47 minutes. Post-mortem scheduled for Thu.',
    timestamp: 'Yesterday 11:10 AM',
    isAlert: true,
    reactions: [{ emoji: '✅', count: 9 }],
  },
];
