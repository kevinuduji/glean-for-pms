import type { WorkspaceProject } from '@/lib/types/workspace-project';

export const SEED_WORKSPACE_PROJECTS: WorkspaceProject[] = [
  // ── personal-blackrock ────────────────────────────────────────────────────
  {
    id: 'br-q4-roadmap',
    workspaceId: 'personal-blackrock',
    name: 'Q4 Roadmap',
    color: 'indigo',
    description: 'Q4 2026 product planning and prioritisation',
    isPublic: true,
    memberCount: 8,
    createdAt: '2026-01-15T00:00:00.000Z',
    isStatic: true,
  },
  {
    id: 'br-client-dash',
    workspaceId: 'personal-blackrock',
    name: 'Client Dashboard',
    color: 'violet',
    description: 'Redesign of the client-facing analytics dashboard',
    isPublic: true,
    memberCount: 5,
    createdAt: '2026-01-16T00:00:00.000Z',
    isStatic: true,
  },
  {
    id: 'br-internal-ops',
    workspaceId: 'personal-blackrock',
    name: 'Internal Ops',
    color: 'slate',
    description: 'Internal tooling and operational workflows',
    isPublic: false,
    inviteCode: 'BRINOPS',
    memberCount: 3,
    createdAt: '2026-01-17T00:00:00.000Z',
    isStatic: true,
  },

  // ── br-global-markets ─────────────────────────────────────────────────────
  {
    id: 'gm-fixed-income',
    workspaceId: 'br-global-markets',
    name: 'Fixed Income',
    color: 'indigo',
    description: 'Bond market analytics, duration risk, and yield curve modelling',
    isPublic: true,
    memberCount: 42,
    createdAt: '2026-01-10T00:00:00.000Z',
    isStatic: true,
  },
  {
    id: 'gm-equity-research',
    workspaceId: 'br-global-markets',
    name: 'Equity Research',
    color: 'emerald',
    description: 'Equity screening, factor analysis, and earnings intelligence',
    isPublic: true,
    memberCount: 31,
    createdAt: '2026-01-11T00:00:00.000Z',
    isStatic: true,
  },
  {
    id: 'gm-private-markets',
    workspaceId: 'br-global-markets',
    name: 'Private Markets',
    color: 'amber',
    description: 'Private equity deal tracking and portfolio company analytics',
    isPublic: false,
    inviteCode: 'PRIVMKT',
    memberCount: 12,
    createdAt: '2026-01-12T00:00:00.000Z',
    isStatic: true,
  },

  // ── personal-metronome ────────────────────────────────────────────────────
  {
    id: 'mt-billing',
    workspaceId: 'personal-metronome',
    name: 'Billing Engine',
    color: 'teal',
    description: 'Usage-based billing logic, invoicing, and revenue recognition',
    isPublic: true,
    memberCount: 4,
    createdAt: '2026-01-20T00:00:00.000Z',
    isStatic: true,
  },
  {
    id: 'mt-usage',
    workspaceId: 'personal-metronome',
    name: 'Usage Analytics',
    color: 'rose',
    description: 'Internal product usage dashboards and cohort analytics',
    isPublic: false,
    inviteCode: 'METRICS',
    memberCount: 2,
    createdAt: '2026-01-21T00:00:00.000Z',
    isStatic: true,
  },
];

export const WORKSPACE_PROJECTS_BY_WORKSPACE: Record<string, WorkspaceProject[]> =
  SEED_WORKSPACE_PROJECTS.reduce<Record<string, WorkspaceProject[]>>((acc, project) => {
    if (!acc[project.workspaceId]) acc[project.workspaceId] = [];
    acc[project.workspaceId].push(project);
    return acc;
  }, {});
