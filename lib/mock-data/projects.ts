import type { Project } from '@/lib/types/project';

/**
 * Personal seed projects — pre-populated for the demo user.
 * These appear as user-owned (non-enterprise) spaces.
 */
export const SEED_PROJECTS: Project[] = [
  {
    id: 'personal-blackrock',
    name: 'BlackRock',
    color: 'indigo',
    icon: null,
    createdAt: '2026-01-10T00:00:00.000Z',
    isPublic: false,
    isEnterprise: true,
  },
  {
    id: 'personal-metronome',
    name: 'Metronome',
    color: 'violet',
    icon: null,
    createdAt: '2026-01-11T00:00:00.000Z',
    isPublic: false,
    isEnterprise: false,
  },
];
