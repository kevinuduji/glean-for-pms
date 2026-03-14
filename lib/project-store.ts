'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project } from '@/lib/types/project';
import { SEED_PROJECTS } from '@/lib/mock-data/projects';
import { ENTERPRISE_PROJECTS } from '@/lib/mock-data/enterprise-projects';

// Enterprise projects are static — not persisted, never mutated
const STATIC_ENTERPRISE = ENTERPRISE_PROJECTS;

type ProjectStore = {
  /** User-created personal projects (persisted) */
  personalProjects: Project[];
  /** IDs of all projects the user has joined (enterprise + personal) */
  joinedProjectIds: string[];
  /** Currently active project */
  activeProjectId: string;

  // ── Computed ──────────────────────────────────────────────────────────────
  /** All projects visible to the user: enterprise (static) + personal */
  getAllProjects: () => Project[];
  /** Only the projects the user has joined */
  getJoinedProjects: () => Project[];
  /** The currently active project object */
  getActiveProject: () => Project | undefined;

  // ── Actions ───────────────────────────────────────────────────────────────
  setActiveProject: (id: string) => void;

  /**
   * Join an enterprise or public project.
   * For private projects, `code` must match `project.inviteCode`.
   * Returns `true` on success, `false` if the code is wrong.
   */
  joinProject: (id: string, code?: string) => boolean;

  /** Remove a project from the user's joined list (doesn't delete it). */
  leaveProject: (id: string) => void;

  /** Create a personal project and auto-join it. Returns the new id. */
  createProject: (input: { name: string; color: string; icon: string | null }) => string;

  updateProject: (id: string, updates: Partial<Pick<Project, 'name' | 'color' | 'icon'>>) => void;

  /** Delete a personal project entirely (enterprise projects use leaveProject). */
  deleteProject: (id: string) => void;
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      personalProjects: SEED_PROJECTS,
      joinedProjectIds: [
        'br-global-markets',          // Enterprise – pre-joined for demo
        ...SEED_PROJECTS.map((p) => p.id),
      ],
      activeProjectId: SEED_PROJECTS[0]?.id ?? '',

      // ── Computed ───────────────────────────────────────────────────────────

      getAllProjects: () => {
        const { personalProjects } = get();
        return [...STATIC_ENTERPRISE, ...personalProjects];
      },

      getJoinedProjects: () => {
        const { joinedProjectIds } = get();
        const all = get().getAllProjects();
        return all.filter((p) => joinedProjectIds.includes(p.id));
      },

      getActiveProject: () => {
        const { activeProjectId } = get();
        return get().getAllProjects().find((p) => p.id === activeProjectId);
      },

      // ── Actions ────────────────────────────────────────────────────────────

      setActiveProject: (id) => {
        set({ activeProjectId: id });
        // Reset active chat — lazy import to avoid circular deps
        import('@/lib/store').then(({ useAgentStore }) => {
          useAgentStore.getState().resetAgent();
        });
      },

      joinProject: (id, code) => {
        const all = get().getAllProjects();
        const project = all.find((p) => p.id === id);
        if (!project) return false;

        // Private project: validate code
        if (!project.isPublic) {
          if (!code || code.trim().toUpperCase() !== project.inviteCode?.toUpperCase()) {
            return false;
          }
        }

        set((s) => ({
          joinedProjectIds: s.joinedProjectIds.includes(id)
            ? s.joinedProjectIds
            : [...s.joinedProjectIds, id],
          activeProjectId: id,
        }));
        // Reset chat for new project context
        import('@/lib/store').then(({ useAgentStore }) => {
          useAgentStore.getState().resetAgent();
        });
        return true;
      },

      leaveProject: (id) => {
        const { joinedProjectIds, activeProjectId } = get();
        const remaining = joinedProjectIds.filter((jid) => jid !== id);
        const newActiveId = activeProjectId === id ? (remaining[0] ?? '') : activeProjectId;
        set({ joinedProjectIds: remaining, activeProjectId: newActiveId });
      },

      createProject: (input) => {
        const id = `project-${Date.now()}`;
        const project: Project = {
          id,
          name: input.name,
          color: input.color,
          icon: input.icon,
          createdAt: new Date().toISOString(),
          isPublic: false,
          isEnterprise: false,
        };
        set((s) => ({
          personalProjects: [...s.personalProjects, project],
          joinedProjectIds: [...s.joinedProjectIds, id],
          activeProjectId: id,
        }));
        return id;
      },

      updateProject: (id, updates) => {
        set((s) => ({
          personalProjects: s.personalProjects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      deleteProject: (id) => {
        const { joinedProjectIds, activeProjectId } = get();
        const remainingJoined = joinedProjectIds.filter((jid) => jid !== id);
        const newActiveId =
          activeProjectId === id ? (remainingJoined[0] ?? '') : activeProjectId;
        set((s) => ({
          personalProjects: s.personalProjects.filter((p) => p.id !== id),
          joinedProjectIds: remainingJoined,
          activeProjectId: newActiveId,
        }));
      },
    }),
    {
      name: 'project-store-v3', // bumped — renamed personal projects
      partialize: (state) => ({
        personalProjects: state.personalProjects,
        joinedProjectIds: state.joinedProjectIds,
        activeProjectId: state.activeProjectId,
      }),
    }
  )
);
