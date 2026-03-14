import type { Section, SectionFolder } from '@/lib/types/section';

const CREATED_AT = '2026-01-15T00:00:00.000Z';

// ─── Seed Folders ─────────────────────────────────────────────────────────────

export const SEED_FOLDERS: SectionFolder[] = [
  // br-q4-roadmap
  { id: 'f-q4-planning', projectId: 'br-q4-roadmap', name: 'Planning', order: 0 },
  { id: 'f-q4-exec',     projectId: 'br-q4-roadmap', name: 'Execution', order: 1 },

  // br-client-dash
  { id: 'f-cd-screens', projectId: 'br-client-dash', name: 'Screens', order: 0 },
  { id: 'f-cd-flows',   projectId: 'br-client-dash', name: 'Flows', order: 1 },

  // gm-fixed-income
  { id: 'f-fi-analytics', projectId: 'gm-fixed-income', name: 'Analytics', order: 0 },
  { id: 'f-fi-portfolio', projectId: 'gm-fixed-income', name: 'Portfolio', order: 1 },

  // gm-equity-research
  { id: 'f-er-screens', projectId: 'gm-equity-research', name: 'Research', order: 0 },

  // mt-billing
  { id: 'f-bt-revenue', projectId: 'mt-billing', name: 'Revenue', order: 0 },
];

// ─── Seed Sections ────────────────────────────────────────────────────────────

export const SEED_SECTIONS: Section[] = [
  // br-q4-roadmap
  { id: 's-q4-okrs',    projectId: 'br-q4-roadmap', folderId: 'f-q4-planning', name: 'OKRs & Goals',    order: 0, createdAt: CREATED_AT, isStatic: true },
  { id: 's-q4-canvas',  projectId: 'br-q4-roadmap', folderId: 'f-q4-planning', name: 'Roadmap Canvas',  order: 1, createdAt: CREATED_AT, isStatic: true },
  { id: 's-q4-sprint',  projectId: 'br-q4-roadmap', folderId: 'f-q4-exec',     name: 'Sprint Tracker',  order: 0, createdAt: CREATED_AT, isStatic: true },
  { id: 's-q4-backlog', projectId: 'br-q4-roadmap', folderId: 'f-q4-exec',     name: 'Backlog',         order: 1, createdAt: CREATED_AT, isStatic: true },
  { id: 's-q4-weekly',  projectId: 'br-q4-roadmap',                             name: 'Weekly Sync',     order: 2, createdAt: CREATED_AT, isStatic: true },

  // br-client-dash
  { id: 's-cd-home',       projectId: 'br-client-dash', folderId: 'f-cd-screens', name: 'Dashboard Home',    order: 0, createdAt: CREATED_AT, isStatic: true },
  { id: 's-cd-portfolio',  projectId: 'br-client-dash', folderId: 'f-cd-screens', name: 'Portfolio View',    order: 1, createdAt: CREATED_AT, isStatic: true },
  { id: 's-cd-analytics',  projectId: 'br-client-dash', folderId: 'f-cd-screens', name: 'Analytics',         order: 2, createdAt: CREATED_AT, isStatic: true },
  { id: 's-cd-onboarding', projectId: 'br-client-dash', folderId: 'f-cd-flows',   name: 'Onboarding',        order: 0, createdAt: CREATED_AT, isStatic: true },
  { id: 's-cd-reports',    projectId: 'br-client-dash', folderId: 'f-cd-flows',   name: 'Report Generation', order: 1, createdAt: CREATED_AT, isStatic: true },
  { id: 's-cd-design',     projectId: 'br-client-dash',                            name: 'Design System',     order: 2, createdAt: CREATED_AT, isStatic: true },

  // gm-fixed-income
  { id: 's-fi-duration', projectId: 'gm-fixed-income', folderId: 'f-fi-analytics', name: 'Duration Risk',   order: 0, createdAt: CREATED_AT, isStatic: true },
  { id: 's-fi-yield',    projectId: 'gm-fixed-income', folderId: 'f-fi-analytics', name: 'Yield Curves',    order: 1, createdAt: CREATED_AT, isStatic: true },
  { id: 's-fi-holdings', projectId: 'gm-fixed-income', folderId: 'f-fi-portfolio', name: 'Holdings View',   order: 0, createdAt: CREATED_AT, isStatic: true },
  { id: 's-fi-pnl',      projectId: 'gm-fixed-income', folderId: 'f-fi-portfolio', name: 'P&L Attribution', order: 1, createdAt: CREATED_AT, isStatic: true },
  { id: 's-fi-market',   projectId: 'gm-fixed-income',                              name: 'Market Overview', order: 2, createdAt: CREATED_AT, isStatic: true },

  // gm-equity-research
  { id: 's-er-screening', projectId: 'gm-equity-research', folderId: 'f-er-screens', name: 'Factor Screening', order: 0, createdAt: CREATED_AT, isStatic: true },
  { id: 's-er-earnings',  projectId: 'gm-equity-research', folderId: 'f-er-screens', name: 'Earnings Intel',   order: 1, createdAt: CREATED_AT, isStatic: true },
  { id: 's-er-market',    projectId: 'gm-equity-research',                             name: 'Market Summary',  order: 2, createdAt: CREATED_AT, isStatic: true },

  // mt-billing
  { id: 's-bt-mrr',      projectId: 'mt-billing', folderId: 'f-bt-revenue', name: 'MRR Dashboard',    order: 0, createdAt: CREATED_AT, isStatic: true },
  { id: 's-bt-invoices', projectId: 'mt-billing', folderId: 'f-bt-revenue', name: 'Invoice Pipeline', order: 1, createdAt: CREATED_AT, isStatic: true },
  { id: 's-bt-usage',    projectId: 'mt-billing',                            name: 'Usage Breakdown',  order: 2, createdAt: CREATED_AT, isStatic: true },
];

// ─── Indexed lookups ──────────────────────────────────────────────────────────

export const SECTIONS_BY_PROJECT: Record<string, Section[]> = SEED_SECTIONS.reduce<
  Record<string, Section[]>
>((acc, section) => {
  if (!acc[section.projectId]) acc[section.projectId] = [];
  acc[section.projectId].push(section);
  return acc;
}, {});

export const FOLDERS_BY_PROJECT: Record<string, SectionFolder[]> = SEED_FOLDERS.reduce<
  Record<string, SectionFolder[]>
>((acc, folder) => {
  if (!acc[folder.projectId]) acc[folder.projectId] = [];
  acc[folder.projectId].push(folder);
  return acc;
}, {});
