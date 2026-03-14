'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Section, SectionFolder } from '@/lib/types/section';
import { SEED_SECTIONS, SEED_FOLDERS, SECTIONS_BY_PROJECT, FOLDERS_BY_PROJECT } from '@/lib/mock-data/sections';

type SectionStore = {
  // ── Persisted state ────────────────────────────────────────────────────────
  userSections: Section[];
  userFolders: SectionFolder[];
  activeSectionId: string;

  // ── Computed ───────────────────────────────────────────────────────────────
  getSectionsForProject: (projectId: string) => Section[];
  getFoldersForProject: (projectId: string) => SectionFolder[];
  getActiveSection: () => Section | undefined;

  // ── Actions ────────────────────────────────────────────────────────────────
  setActiveSection: (id: string) => void;
  createSection: (input: { projectId: string; name: string; folderId?: string; description?: string }) => string;
  createFolder: (input: { projectId: string; name: string }) => string;
  deleteSection: (id: string) => void;
  deleteFolder: (id: string) => void;
};

const useStore = create<SectionStore>()(
  persist(
    (set, get) => ({
      userSections: [],
      userFolders: [],
      activeSectionId: '',

      // ── Computed ─────────────────────────────────────────────────────────────

      getSectionsForProject: (projectId) => {
        const { userSections } = get();
        const seeds = SECTIONS_BY_PROJECT[projectId] ?? [];
        const user = userSections.filter((s) => s.projectId === projectId);
        return [...seeds, ...user].sort((a, b) => a.order - b.order);
      },

      getFoldersForProject: (projectId) => {
        const { userFolders } = get();
        const seeds = FOLDERS_BY_PROJECT[projectId] ?? [];
        const user = userFolders.filter((f) => f.projectId === projectId);
        return [...seeds, ...user].sort((a, b) => a.order - b.order);
      },

      getActiveSection: () => {
        const { activeSectionId, userSections } = get();
        if (!activeSectionId) return undefined;
        const seed = SEED_SECTIONS.find((s) => s.id === activeSectionId);
        if (seed) return seed;
        return userSections.find((s) => s.id === activeSectionId);
      },

      // ── Actions ───────────────────────────────────────────────────────────────

      setActiveSection: (id) => {
        set({ activeSectionId: id });
      },

      createSection: (input) => {
        const { userSections } = get();
        const existing = get().getSectionsForProject(input.projectId);
        const maxOrder = existing.length > 0 ? Math.max(...existing.map((s) => s.order)) : -1;
        const id = `s-user-${Date.now()}`;
        const newSection: Section = {
          id,
          projectId: input.projectId,
          folderId: input.folderId,
          name: input.name,
          description: input.description,
          order: maxOrder + 1,
          createdAt: new Date().toISOString(),
          isStatic: false,
        };
        set({ userSections: [...userSections, newSection] });
        return id;
      },

      createFolder: (input) => {
        const { userFolders } = get();
        const existingFolders = get().getFoldersForProject(input.projectId);
        const maxOrder = existingFolders.length > 0 ? Math.max(...existingFolders.map((f) => f.order)) : -1;
        const id = `f-user-${Date.now()}`;
        const newFolder: SectionFolder = {
          id,
          projectId: input.projectId,
          name: input.name,
          order: maxOrder + 1,
        };
        set({ userFolders: [...userFolders, newFolder] });
        return id;
      },

      deleteSection: (id) => {
        set((s) => ({
          userSections: s.userSections.filter((sec) => sec.id !== id),
        }));
      },

      deleteFolder: (id) => {
        set((s) => ({
          userFolders: s.userFolders.filter((f) => f.id !== id),
          userSections: s.userSections.map((sec) =>
            sec.folderId === id ? { ...sec, folderId: undefined } : sec
          ),
        }));
      },
    }),
    {
      name: 'section-store-v1',
      partialize: (state) => ({
        userSections: state.userSections,
        userFolders: state.userFolders,
        activeSectionId: state.activeSectionId,
      }),
    }
  )
);

export const useSectionStore = useStore;
