'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorkspaceProject } from '@/lib/types/workspace-project';
import {
  SEED_WORKSPACE_PROJECTS,
  WORKSPACE_PROJECTS_BY_WORKSPACE,
} from '@/lib/mock-data/workspace-projects';

// IDs of public seed projects the user starts pre-joined
const DEFAULT_JOINED_IDS = [
  'br-q4-roadmap',
  'br-client-dash',
  'gm-fixed-income',
  'gm-equity-research',
  'mt-billing',
];

type WorkspaceProjectStore = {
  // ── Persisted state ────────────────────────────────────────────────────────
  userProjects: WorkspaceProject[];
  joinedProjectIds: string[];
  activeWorkspaceProjectId: string;

  // ── Computed ───────────────────────────────────────────────────────────────
  getAllProjectsForWorkspace: (workspaceId: string) => WorkspaceProject[];
  getJoinedProjectsForWorkspace: (workspaceId: string) => WorkspaceProject[];
  getActiveWorkspaceProject: () => WorkspaceProject | undefined;

  // ── Actions ────────────────────────────────────────────────────────────────
  setActiveWorkspaceProject: (id: string) => void;
  joinWorkspaceProject: (id: string, code?: string) => boolean;
  leaveWorkspaceProject: (id: string) => void;
  createWorkspaceProject: (input: {
    workspaceId: string;
    name: string;
    color: string;
    description?: string;
    isPublic: boolean;
    inviteCode?: string;
  }) => string;
  deleteWorkspaceProject: (id: string) => void;
  updateWorkspaceProject: (id: string, updates: Partial<Pick<WorkspaceProject, 'name' | 'color' | 'description' | 'isPublic' | 'inviteCode'>>) => void;
};

export const useWorkspaceProjectStore = create<WorkspaceProjectStore>()(
  persist(
    (set, get) => ({
      userProjects: [],
      joinedProjectIds: DEFAULT_JOINED_IDS,
      activeWorkspaceProjectId: '',

      // ── Computed ─────────────────────────────────────────────────────────────

      getAllProjectsForWorkspace: (workspaceId) => {
        const { userProjects } = get();
        const seeds = WORKSPACE_PROJECTS_BY_WORKSPACE[workspaceId] ?? [];
        return [
          ...seeds,
          ...userProjects.filter((p) => p.workspaceId === workspaceId),
        ];
      },

      getJoinedProjectsForWorkspace: (workspaceId) => {
        const { joinedProjectIds } = get();
        return get()
          .getAllProjectsForWorkspace(workspaceId)
          .filter((p) => joinedProjectIds.includes(p.id));
      },

      getActiveWorkspaceProject: () => {
        const { activeWorkspaceProjectId, userProjects } = get();
        if (!activeWorkspaceProjectId) return undefined;
        const seed = SEED_WORKSPACE_PROJECTS.find(
          (p) => p.id === activeWorkspaceProjectId
        );
        if (seed) return seed;
        return userProjects.find((p) => p.id === activeWorkspaceProjectId);
      },

      // ── Actions ───────────────────────────────────────────────────────────────

      setActiveWorkspaceProject: (id) => {
        set({ activeWorkspaceProjectId: id });
      },

      joinWorkspaceProject: (id, code) => {
        const all = [
          ...SEED_WORKSPACE_PROJECTS,
          ...get().userProjects,
        ];
        const project = all.find((p) => p.id === id);
        if (!project) return false;

        if (!project.isPublic) {
          if (
            !code ||
            code.trim().toUpperCase() !== project.inviteCode?.toUpperCase()
          ) {
            return false;
          }
        }

        set((s) => ({
          joinedProjectIds: s.joinedProjectIds.includes(id)
            ? s.joinedProjectIds
            : [...s.joinedProjectIds, id],
          activeWorkspaceProjectId: id,
        }));
        return true;
      },

      leaveWorkspaceProject: (id) => {
        const { joinedProjectIds, activeWorkspaceProjectId } = get();
        const remaining = joinedProjectIds.filter((jid) => jid !== id);
        const newActiveId =
          activeWorkspaceProjectId === id
            ? (remaining[0] ?? '')
            : activeWorkspaceProjectId;
        set({ joinedProjectIds: remaining, activeWorkspaceProjectId: newActiveId });
      },

      createWorkspaceProject: (input) => {
        const id = `wp-${Date.now()}`;
        const project: WorkspaceProject = {
          id,
          workspaceId: input.workspaceId,
          name: input.name,
          color: input.color,
          description: input.description,
          isPublic: input.isPublic,
          inviteCode: input.isPublic ? undefined : input.inviteCode,
          memberCount: 1,
          createdAt: new Date().toISOString(),
          isStatic: false,
        };
        set((s) => ({
          userProjects: [...s.userProjects, project],
          joinedProjectIds: [...s.joinedProjectIds, id],
          activeWorkspaceProjectId: id,
        }));
        return id;
      },

      deleteWorkspaceProject: (id) => {
        const { joinedProjectIds, activeWorkspaceProjectId } = get();
        const remainingJoined = joinedProjectIds.filter((jid) => jid !== id);
        const newActiveId =
          activeWorkspaceProjectId === id
            ? (remainingJoined[0] ?? '')
            : activeWorkspaceProjectId;
        set((s) => ({
          userProjects: s.userProjects.filter((p) => p.id !== id),
          joinedProjectIds: remainingJoined,
          activeWorkspaceProjectId: newActiveId,
        }));
      },

      updateWorkspaceProject: (id, updates) => {
        set((s) => ({
          userProjects: s.userProjects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },
    }),
    {
      name: 'workspace-project-store-v1',
      partialize: (state) => ({
        userProjects: state.userProjects,
        joinedProjectIds: state.joinedProjectIds,
        activeWorkspaceProjectId: state.activeWorkspaceProjectId,
      }),
    }
  )
);
