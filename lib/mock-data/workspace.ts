import type {
  Workspace,
  WorkspaceUser,
  WorkspaceMember,
  Team,
  TeamMember,
  Folder,
  FolderMember,
  FolderItem,
} from '@/lib/types/workspace';

// ─── Users ────────────────────────────────────────────────────────────────

export const USERS: WorkspaceUser[] = [
  {
    id: 'user-kevin',
    handle: 'kevin',
    displayName: 'Kevin',
    avatarInitial: 'K',
    avatarColor: 'bg-indigo-600',
    email: 'kevin@probe.app',
  },
  {
    id: 'user-dan',
    handle: 'dan_reeves',
    displayName: 'Dan Reeves',
    avatarInitial: 'D',
    avatarColor: 'bg-emerald-600',
    email: 'dan@probe.app',
  },
  {
    id: 'user-sarah',
    handle: 'sarah_kim',
    displayName: 'Sarah Kim',
    avatarInitial: 'S',
    avatarColor: 'bg-rose-600',
    email: 'sarah@probe.app',
  },
  {
    id: 'user-marcus',
    handle: 'marcus_chen',
    displayName: 'Marcus Chen',
    avatarInitial: 'M',
    avatarColor: 'bg-amber-600',
    email: 'marcus@probe.app',
  },
  {
    id: 'user-priya',
    handle: 'priya_nair',
    displayName: 'Priya Nair',
    avatarInitial: 'P',
    avatarColor: 'bg-violet-600',
    email: 'priya@probe.app',
  },
  {
    id: 'user-tom',
    handle: 'tom_wu',
    displayName: 'Tom Wu',
    avatarInitial: 'T',
    avatarColor: 'bg-sky-600',
    email: 'tom@probe.app',
  },
  {
    id: 'user-alex',
    handle: 'alex_torres',
    displayName: 'Alex Torres',
    avatarInitial: 'A',
    avatarColor: 'bg-orange-600',
    email: 'alex@probe.app',
  },
  {
    id: 'user-bot',
    handle: 'infra-bot',
    displayName: 'Infra Bot',
    avatarInitial: 'B',
    avatarColor: 'bg-slate-500',
    email: 'bot@probe.app',
  },
];

// ─── Workspaces ───────────────────────────────────────────────────────────

export const SEED_WORKSPACES: Workspace[] = [
  {
    id: 'ws-probe',
    name: 'Probe HQ',
    slug: 'probe-hq',
    logoInitial: 'P',
    logoColor: 'bg-indigo-600',
    plan: 'pro',
    visibility: 'private',
    createdAt: '2023-01-15T00:00:00Z',
    createdBy: 'user-kevin',
  },
  {
    id: 'ws-acme',
    name: 'Acme Corp',
    slug: 'acme-corp',
    logoInitial: 'A',
    logoColor: 'bg-emerald-600',
    plan: 'free',
    visibility: 'private',
    createdAt: '2024-06-01T00:00:00Z',
    createdBy: 'user-kevin',
  },
];

// ─── Workspace Members ────────────────────────────────────────────────────

export const SEED_WORKSPACE_MEMBERS: WorkspaceMember[] = [
  { userId: 'user-kevin',  workspaceId: 'ws-probe', role: 'admin',  joinedAt: '2023-01-15T00:00:00Z' },
  { userId: 'user-dan',    workspaceId: 'ws-probe', role: 'member', joinedAt: '2023-02-01T00:00:00Z' },
  { userId: 'user-sarah',  workspaceId: 'ws-probe', role: 'member', joinedAt: '2023-02-15T00:00:00Z' },
  { userId: 'user-marcus', workspaceId: 'ws-probe', role: 'member', joinedAt: '2023-03-01T00:00:00Z' },
  { userId: 'user-priya',  workspaceId: 'ws-probe', role: 'member', joinedAt: '2023-03-10T00:00:00Z' },
  { userId: 'user-tom',    workspaceId: 'ws-probe', role: 'member', joinedAt: '2023-04-01T00:00:00Z' },
  { userId: 'user-alex',   workspaceId: 'ws-probe', role: 'member', joinedAt: '2023-04-15T00:00:00Z' },
  { userId: 'user-bot',    workspaceId: 'ws-probe', role: 'viewer', joinedAt: '2023-01-20T00:00:00Z' },
  // Acme Corp
  { userId: 'user-kevin',  workspaceId: 'ws-acme',  role: 'admin',  joinedAt: '2024-06-01T00:00:00Z' },
];

// ─── Teams ────────────────────────────────────────────────────────────────

export const SEED_TEAMS: Team[] = [
  {
    id: 'team-growth',
    workspaceId: 'ws-probe',
    name: 'Growth',
    slug: 'growth',
    description: 'Acquisition, activation, and revenue experiments.',
    color: 'emerald',
    icon: 'TrendingUp',
    visibility: 'public',
    createdAt: '2023-02-01T00:00:00Z',
    createdBy: 'user-kevin',
  },
  {
    id: 'team-platform',
    workspaceId: 'ws-probe',
    name: 'Platform',
    slug: 'platform',
    description: 'Core infrastructure, reliability, and developer experience.',
    color: 'violet',
    icon: 'Cpu',
    visibility: 'public',
    createdAt: '2023-02-10T00:00:00Z',
    createdBy: 'user-kevin',
  },
  {
    id: 'team-design',
    workspaceId: 'ws-probe',
    name: 'Design',
    slug: 'design',
    description: 'UX research, design systems, and user testing.',
    color: 'rose',
    icon: 'Palette',
    visibility: 'public',
    createdAt: '2023-03-01T00:00:00Z',
    createdBy: 'user-sarah',
  },
  {
    id: 'team-exec',
    workspaceId: 'ws-probe',
    name: 'Executive',
    slug: 'executive',
    description: 'Leadership strategy, OKRs, and board-level reporting.',
    color: 'amber',
    icon: 'Shield',
    visibility: 'private',
    createdAt: '2023-01-20T00:00:00Z',
    createdBy: 'user-kevin',
  },
];

// ─── Team Members ─────────────────────────────────────────────────────────

export const SEED_TEAM_MEMBERS: TeamMember[] = [
  // Growth
  { userId: 'user-kevin', teamId: 'team-growth',   role: 'lead',   joinedAt: '2023-02-01T00:00:00Z' },
  { userId: 'user-sarah', teamId: 'team-growth',   role: 'member', joinedAt: '2023-02-15T00:00:00Z' },
  { userId: 'user-dan',   teamId: 'team-growth',   role: 'member', joinedAt: '2023-02-20T00:00:00Z' },
  { userId: 'user-priya', teamId: 'team-growth',   role: 'member', joinedAt: '2023-03-10T00:00:00Z' },
  // Platform
  { userId: 'user-marcus',teamId: 'team-platform', role: 'lead',   joinedAt: '2023-02-10T00:00:00Z' },
  { userId: 'user-bot',   teamId: 'team-platform', role: 'member', joinedAt: '2023-02-10T00:00:00Z' },
  { userId: 'user-dan',   teamId: 'team-platform', role: 'member', joinedAt: '2023-03-01T00:00:00Z' },
  // Design
  { userId: 'user-sarah', teamId: 'team-design',   role: 'lead',   joinedAt: '2023-03-01T00:00:00Z' },
  { userId: 'user-tom',   teamId: 'team-design',   role: 'member', joinedAt: '2023-04-01T00:00:00Z' },
  { userId: 'user-alex',  teamId: 'team-design',   role: 'member', joinedAt: '2023-04-15T00:00:00Z' },
  // Executive (private — Kevin only)
  { userId: 'user-kevin', teamId: 'team-exec',     role: 'lead',   joinedAt: '2023-01-20T00:00:00Z' },
];

// ─── Folders ──────────────────────────────────────────────────────────────

export const SEED_FOLDERS: Folder[] = [
  // Growth folders
  {
    id: 'folder-growth-q1',
    teamId: 'team-growth',
    workspaceId: 'ws-probe',
    name: 'Q1 Acquisition Push',
    description: 'Focus area for Q1 signup growth — experiments, recs, and session analysis.',
    color: 'emerald',
    visibility: 'public',
    createdAt: '2026-01-05T00:00:00Z',
    createdBy: 'user-kevin',
  },
  {
    id: 'folder-growth-checkout',
    teamId: 'team-growth',
    workspaceId: 'ws-probe',
    name: 'Checkout Optimization',
    description: 'Reducing checkout drop-off and fixing the latency regression.',
    color: 'emerald',
    visibility: 'public',
    createdAt: '2026-01-10T00:00:00Z',
    createdBy: 'user-sarah',
  },
  {
    id: 'folder-growth-revenue',
    teamId: 'team-growth',
    workspaceId: 'ws-probe',
    name: 'Revenue Strategy',
    description: 'Private pricing and expansion revenue planning.',
    color: 'emerald',
    visibility: 'private',
    createdAt: '2026-02-01T00:00:00Z',
    createdBy: 'user-kevin',
  },
  // Platform folders
  {
    id: 'folder-platform-infra',
    teamId: 'team-platform',
    workspaceId: 'ws-probe',
    name: 'Infra Reliability',
    description: 'Service health, latency regressions, and on-call incidents.',
    color: 'violet',
    visibility: 'public',
    createdAt: '2026-01-15T00:00:00Z',
    createdBy: 'user-marcus',
  },
  {
    id: 'folder-platform-oncall',
    teamId: 'team-platform',
    workspaceId: 'ws-probe',
    name: 'On-Call Runbooks',
    description: 'Private runbooks and incident response playbooks.',
    color: 'violet',
    visibility: 'private',
    createdAt: '2026-01-20T00:00:00Z',
    createdBy: 'user-marcus',
  },
  // Design folders
  {
    id: 'folder-design-ds',
    teamId: 'team-design',
    workspaceId: 'ws-probe',
    name: 'Design System',
    description: 'Component library, tokens, and visual standards.',
    color: 'rose',
    visibility: 'public',
    createdAt: '2026-01-08T00:00:00Z',
    createdBy: 'user-sarah',
  },
  {
    id: 'folder-design-research',
    teamId: 'team-design',
    workspaceId: 'ws-probe',
    name: 'User Research',
    description: 'Session recordings, friction analysis, and usability findings.',
    color: 'rose',
    visibility: 'public',
    createdAt: '2026-01-12T00:00:00Z',
    createdBy: 'user-tom',
  },
  // Executive folders
  {
    id: 'folder-exec-board',
    teamId: 'team-exec',
    workspaceId: 'ws-probe',
    name: 'Board Reports',
    description: 'Quarterly board decks and investor materials.',
    color: 'amber',
    visibility: 'private',
    createdAt: '2026-01-01T00:00:00Z',
    createdBy: 'user-kevin',
  },
  {
    id: 'folder-exec-okrs',
    teamId: 'team-exec',
    workspaceId: 'ws-probe',
    name: 'OKRs 2026',
    description: 'Company-level OKRs and key result tracking.',
    color: 'amber',
    visibility: 'private',
    createdAt: '2026-01-02T00:00:00Z',
    createdBy: 'user-kevin',
  },
];

// ─── Folder Members ───────────────────────────────────────────────────────

export const SEED_FOLDER_MEMBERS: FolderMember[] = [
  // folder-growth-revenue (private — Kevin + Sarah only)
  { userId: 'user-kevin', folderId: 'folder-growth-revenue', role: 'editor', joinedAt: '2026-02-01T00:00:00Z' },
  { userId: 'user-sarah', folderId: 'folder-growth-revenue', role: 'editor', joinedAt: '2026-02-01T00:00:00Z' },
  // folder-platform-oncall (private — Marcus + bot only)
  { userId: 'user-marcus',folderId: 'folder-platform-oncall', role: 'editor', joinedAt: '2026-01-20T00:00:00Z' },
  { userId: 'user-bot',   folderId: 'folder-platform-oncall', role: 'viewer', joinedAt: '2026-01-20T00:00:00Z' },
  // folder-exec-board (private — Kevin only)
  { userId: 'user-kevin', folderId: 'folder-exec-board', role: 'editor', joinedAt: '2026-01-01T00:00:00Z' },
  // folder-exec-okrs (private — Kevin only)
  { userId: 'user-kevin', folderId: 'folder-exec-okrs', role: 'editor', joinedAt: '2026-01-02T00:00:00Z' },
];

// ─── Folder Items (content tagged to folders) ─────────────────────────────

export const SEED_FOLDER_ITEMS: FolderItem[] = [
  // Q1 Acquisition Push
  { id: 'fi-1',  folderId: 'folder-growth-q1',       contentId: 'exp-001', contentType: 'experiment',     addedBy: 'user-kevin', addedAt: '2026-01-05T00:00:00Z' },
  { id: 'fi-2',  folderId: 'folder-growth-q1',       contentId: 'exp-002', contentType: 'experiment',     addedBy: 'user-sarah', addedAt: '2026-01-06T00:00:00Z' },
  { id: 'fi-3',  folderId: 'folder-growth-q1',       contentId: 'exp-003', contentType: 'experiment',     addedBy: 'user-dan',   addedAt: '2026-01-07T00:00:00Z' },
  { id: 'fi-4',  folderId: 'folder-growth-q1',       contentId: 'rec-3',   contentType: 'recommendation', addedBy: 'user-kevin', addedAt: '2026-03-01T00:00:00Z' },
  { id: 'fi-5',  folderId: 'folder-growth-q1',       contentId: 'rec-4',   contentType: 'recommendation', addedBy: 'user-kevin', addedAt: '2026-03-02T00:00:00Z' },
  // Checkout Optimization
  { id: 'fi-6',  folderId: 'folder-growth-checkout', contentId: 'exp-004', contentType: 'experiment',     addedBy: 'user-sarah', addedAt: '2026-01-10T00:00:00Z' },
  { id: 'fi-7',  folderId: 'folder-growth-checkout', contentId: 'exp-005', contentType: 'experiment',     addedBy: 'user-kevin', addedAt: '2026-01-11T00:00:00Z' },
  // Infra Reliability
  { id: 'fi-8',  folderId: 'folder-platform-infra',  contentId: 'rec-1',   contentType: 'recommendation', addedBy: 'user-marcus',addedAt: '2026-02-27T00:00:00Z' },
  { id: 'fi-9',  folderId: 'folder-platform-infra',  contentId: 'rec-2',   contentType: 'recommendation', addedBy: 'user-marcus',addedAt: '2026-02-28T00:00:00Z' },
  { id: 'fi-10', folderId: 'folder-platform-infra',  contentId: 'rec-7',   contentType: 'recommendation', addedBy: 'user-marcus',addedAt: '2026-03-02T00:00:00Z' },
  // Design System
  { id: 'fi-11', folderId: 'folder-design-ds',       contentId: 'rec-6',   contentType: 'recommendation', addedBy: 'user-sarah', addedAt: '2026-02-28T00:00:00Z' },
  { id: 'fi-12', folderId: 'folder-design-ds',       contentId: 'exp-008', contentType: 'experiment',     addedBy: 'user-tom',   addedAt: '2026-01-20T00:00:00Z' },
  // User Research
  { id: 'fi-13', folderId: 'folder-design-research', contentId: 'exp-006', contentType: 'experiment',     addedBy: 'user-alex',  addedAt: '2026-01-15T00:00:00Z' },
  // OKRs 2026 (private exec)
  { id: 'fi-14', folderId: 'folder-exec-okrs',       contentId: 'rec-5',   contentType: 'recommendation', addedBy: 'user-kevin', addedAt: '2026-03-01T00:00:00Z' },
  // Revenue Strategy (private growth)
  { id: 'fi-15', folderId: 'folder-growth-revenue',  contentId: 'exp-007', contentType: 'experiment',     addedBy: 'user-kevin', addedAt: '2026-02-15T00:00:00Z' },
];
