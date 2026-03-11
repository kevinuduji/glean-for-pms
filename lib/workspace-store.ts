'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Workspace,
  Team,
  TeamMember,
  WorkspaceMember,
  Folder,
  FolderMember,
  FolderItem,
  Visibility,
  TeamRole,
  FolderRole,
  WorkspaceRole,
  UserContext,
  PendingInvite,
} from '@/lib/types/workspace';
import {
  USERS,
  SEED_WORKSPACES,
  SEED_WORKSPACE_MEMBERS,
  SEED_TEAMS,
  SEED_TEAM_MEMBERS,
  SEED_FOLDERS,
  SEED_FOLDER_MEMBERS,
  SEED_FOLDER_ITEMS,
  SEED_PENDING_INVITES,
} from '@/lib/mock-data/workspace';

const CURRENT_USER_ID = 'user-kevin';

const TEAM_COLORS = ['emerald', 'violet', 'rose', 'amber', 'indigo', 'sky', 'orange'];
const TEAM_ICONS = ['TrendingUp', 'Cpu', 'Palette', 'Shield', 'Rocket', 'Zap', 'Globe', 'Lock', 'Star', 'Users'];

type WorkspaceStore = {
  // ── Context ─────────────────────────────────────────────────────────
  currentUserId: string;
  activeWorkspaceId: string;
  activeTeamId: string | null;
  activeFolderId: string | null;

  // ── Debug overrides (for testing roles/plans) ────────────────────────
  debugRole: WorkspaceRole | null;
  debugPlan: Workspace['plan'] | null;

  // ── Mutable state (persisted) ────────────────────────────────────────
  workspaces: Workspace[];
  workspaceMembers: WorkspaceMember[];
  pendingInvites: PendingInvite[];
  teams: Team[];
  folders: Folder[];
  teamMembers: TeamMember[];
  folderMembers: FolderMember[];
  folderItems: FolderItem[];

  // ── Selectors ────────────────────────────────────────────────────────
  getUserContext: () => UserContext;
  getWorkspaceRole: () => WorkspaceRole;
  getActivePlan: () => Workspace['plan'];
  getConnectorLimit: () => number | null; // null = unlimited
  canManageMembers: () => boolean;
  canManageConnectors: () => boolean;
  canManageBilling: () => boolean;
  isWorkspaceAdmin: () => boolean;
  canSeeTeam: (teamId: string) => boolean;
  canSeeFolder: (folderId: string) => boolean;
  canEditFolder: (folderId: string) => boolean;
  getVisibleTeams: () => Team[];
  getVisibleFolders: (teamId: string) => Folder[];
  getFolderItems: (folderId: string) => FolderItem[];
  getContentFolder: (contentId: string, contentType: FolderItem['contentType']) => Folder | null;
  getTeamForContent: (contentId: string, contentType: FolderItem['contentType']) => Team | null;
  getTeamFolders: (teamId: string) => Folder[];
  getAllTeamMembers: (teamId: string) => TeamMember[];
  getFolderMembers: (folderId: string) => FolderMember[];
  isTeamMember: (teamId: string) => boolean;
  getWorkspaceMembersWithUsers: () => Array<WorkspaceMember & { user: typeof USERS[number] }>;
  getWorkspacesForUser: () => Workspace[];
  getPendingInvites: (workspaceId?: string) => PendingInvite[];

  // ── Actions ──────────────────────────────────────────────────────────
  setActiveWorkspace: (id: string) => void;
  setActiveTeam: (id: string | null) => void;
  setActiveFolder: (id: string | null) => void;
  setDebugRole: (role: WorkspaceRole | null) => void;
  setDebugPlan: (plan: Workspace['plan'] | null) => void;
  createWorkspace: (name: string, color: string, plan?: Workspace['plan']) => string;
  deleteWorkspace: (id: string) => void;
  updateWorkspace: (id: string, updates: Partial<Pick<Workspace, 'name' | 'logoColor' | 'visibility' | 'plan'>>) => void;
  createTeam: (input: { name: string; description: string; color: string; icon: string; visibility: Visibility }) => string;
  deleteTeam: (id: string) => void;
  updateTeam: (id: string, updates: Partial<Pick<Team, 'name' | 'description' | 'color' | 'icon' | 'visibility'>>) => void;
  updateTeamVisibility: (teamId: string, visibility: Visibility) => void;
  addTeamMember: (teamId: string, userId: string, role: TeamRole) => void;
  removeTeamMember: (teamId: string, userId: string) => void;
  changeTeamMemberRole: (teamId: string, userId: string, role: TeamRole) => void;
  changeWorkspaceMemberRole: (userId: string, role: WorkspaceRole) => void;
  removeWorkspaceMember: (userId: string) => void;
  inviteMember: (email: string, role: WorkspaceRole, teamId?: string) => void;
  revokeInvite: (inviteId: string) => void;
  createFolder: (teamId: string, input: { name: string; description: string; color: string; visibility: Visibility }) => string;
  deleteFolder: (id: string) => void;
  updateFolder: (id: string, updates: Partial<Pick<Folder, 'name' | 'description' | 'color' | 'visibility'>>) => void;
  updateFolderVisibility: (folderId: string, visibility: Visibility) => void;
  addFolderMember: (folderId: string, userId: string, role: FolderRole) => void;
  removeFolderMember: (folderId: string, userId: string) => void;
  addItemToFolder: (folderId: string, contentId: string, contentType: FolderItem['contentType']) => void;
  removeItemFromFolder: (folderId: string, contentId: string) => void;

  // ── Util ─────────────────────────────────────────────────────────────
  getAvailableColors: () => string[];
  getAvailableIcons: () => string[];
};

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set, get) => ({
      currentUserId: CURRENT_USER_ID,
      activeWorkspaceId: 'ws-probe',
      activeTeamId: null,
      activeFolderId: null,
      debugRole: null,
      debugPlan: null,

      workspaces: SEED_WORKSPACES,
      workspaceMembers: SEED_WORKSPACE_MEMBERS,
      pendingInvites: SEED_PENDING_INVITES,
      teams: SEED_TEAMS,
      folders: SEED_FOLDERS,
      teamMembers: SEED_TEAM_MEMBERS,
      folderMembers: SEED_FOLDER_MEMBERS,
      folderItems: SEED_FOLDER_ITEMS,

      // ── Selectors ──────────────────────────────────────────────────────

      getWorkspaceRole: () => {
        const { currentUserId, activeWorkspaceId, workspaceMembers, debugRole } = get();
        if (debugRole) return debugRole;
        const membership = workspaceMembers.find(
          (m) => m.userId === currentUserId && m.workspaceId === activeWorkspaceId
        );
        return membership?.role ?? 'viewer';
      },

      getActivePlan: () => {
        const { workspaces, activeWorkspaceId, debugPlan } = get();
        if (debugPlan) return debugPlan;
        const ws = workspaces.find((w) => w.id === activeWorkspaceId);
        return ws?.plan ?? 'free';
      },

      getConnectorLimit: () => {
        const plan = get().getActivePlan();
        if (plan === 'free') return 2;
        return null; // unlimited
      },

      canManageMembers: () => get().isWorkspaceAdmin(),
      canManageConnectors: () => get().isWorkspaceAdmin(),
      canManageBilling: () => get().isWorkspaceAdmin(),

      isWorkspaceAdmin: () => get().getWorkspaceRole() === 'admin',

      getUserContext: () => {
        const { currentUserId, teamMembers, folderMembers } = get();
        const user = USERS.find((u) => u.id === currentUserId)!;
        const workspaceRole = get().getWorkspaceRole();
        const teamMemberships = teamMembers
          .filter((m) => m.userId === currentUserId)
          .map((m) => ({ teamId: m.teamId, teamRole: m.role }));
        const folderMemberships = folderMembers
          .filter((m) => m.userId === currentUserId)
          .map((m) => ({ folderId: m.folderId, folderRole: m.role }));
        return { user, workspaceRole, teamMemberships, folderMemberships };
      },

      isTeamMember: (teamId) => {
        const { currentUserId, teamMembers } = get();
        return teamMembers.some((m) => m.userId === currentUserId && m.teamId === teamId);
      },

      canSeeTeam: (teamId) => {
        const { teams } = get();
        const workspaceRole = get().getWorkspaceRole();
        if (workspaceRole === 'admin') return true;
        const team = teams.find((t) => t.id === teamId);
        if (!team) return false;
        if (team.visibility === 'public') return true;
        return get().isTeamMember(teamId);
      },

      canSeeFolder: (folderId) => {
        const { folders, currentUserId, folderMembers } = get();
        const workspaceRole = get().getWorkspaceRole();
        if (workspaceRole === 'admin') return true;
        const folder = folders.find((f) => f.id === folderId);
        if (!folder) return false;
        if (get().isTeamMember(folder.teamId)) return true;
        if (folder.visibility === 'public' && get().canSeeTeam(folder.teamId)) return true;
        return folderMembers.some((m) => m.userId === currentUserId && m.folderId === folderId);
      },

      canEditFolder: (folderId) => {
        const { currentUserId, folderMembers, teamMembers, folders } = get();
        const workspaceRole = get().getWorkspaceRole();
        if (workspaceRole === 'admin') return true;
        const folder = folders.find((f) => f.id === folderId);
        if (!folder) return false;
        const teamMembership = teamMembers.find(
          (m) => m.userId === currentUserId && m.teamId === folder.teamId
        );
        if (teamMembership?.role === 'lead') return true;
        return folderMembers.some(
          (m) => m.userId === currentUserId && m.folderId === folderId && m.role === 'editor'
        );
      },

      getVisibleTeams: () => {
        const { teams, activeWorkspaceId } = get();
        return teams
          .filter((t) => t.workspaceId === activeWorkspaceId)
          .filter((t) => get().canSeeTeam(t.id));
      },

      getVisibleFolders: (teamId) => {
        const { folders } = get();
        return folders
          .filter((f) => f.teamId === teamId)
          .filter((f) => get().canSeeFolder(f.id));
      },

      getFolderItems: (folderId) => {
        return get().folderItems.filter((i) => i.folderId === folderId);
      },

      getContentFolder: (contentId, contentType) => {
        const { folderItems, folders } = get();
        const item = folderItems.find(
          (i) => i.contentId === contentId && i.contentType === contentType
        );
        if (!item) return null;
        return folders.find((f) => f.id === item.folderId) ?? null;
      },

      getTeamForContent: (contentId, contentType) => {
        const { teams } = get();
        const folder = get().getContentFolder(contentId, contentType);
        if (!folder) return null;
        return teams.find((t) => t.id === folder.teamId) ?? null;
      },

      getTeamFolders: (teamId) => {
        return get().folders.filter((f) => f.teamId === teamId);
      },

      getAllTeamMembers: (teamId) => {
        return get().teamMembers.filter((m) => m.teamId === teamId);
      },

      getFolderMembers: (folderId) => {
        return get().folderMembers.filter((m) => m.folderId === folderId);
      },

      getWorkspaceMembersWithUsers: () => {
        const { workspaceMembers, activeWorkspaceId } = get();
        return workspaceMembers
          .filter((m) => m.workspaceId === activeWorkspaceId)
          .map((m) => ({ ...m, user: USERS.find((u) => u.id === m.userId)! }))
          .filter((m) => !!m.user);
      },

      getWorkspacesForUser: () => {
        const { workspaces, workspaceMembers, currentUserId } = get();
        const memberOf = workspaceMembers
          .filter((m) => m.userId === currentUserId)
          .map((m) => m.workspaceId);
        return workspaces.filter((w) => memberOf.includes(w.id));
      },

      getPendingInvites: (workspaceId) => {
        const id = workspaceId ?? get().activeWorkspaceId;
        return get().pendingInvites.filter((i) => i.workspaceId === id);
      },

      // ── Actions ────────────────────────────────────────────────────────

      setActiveWorkspace: (id) => set({ activeWorkspaceId: id, activeTeamId: null, activeFolderId: null }),
      setActiveTeam: (id) => set({ activeTeamId: id, activeFolderId: null }),
      setActiveFolder: (id) => set({ activeFolderId: id }),

      setDebugRole: (role) => set({ debugRole: role }),
      setDebugPlan: (plan) => set({ debugPlan: plan }),

      createWorkspace: (name, color, plan = 'free') => {
        const id = `ws-${Date.now()}`;
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        const workspace: Workspace = {
          id,
          name,
          slug,
          logoInitial: name[0]?.toUpperCase() ?? 'W',
          logoColor: color,
          plan,
          visibility: 'private',
          createdAt: new Date().toISOString(),
          createdBy: CURRENT_USER_ID,
        };
        const membership: WorkspaceMember = {
          userId: CURRENT_USER_ID,
          workspaceId: id,
          role: 'admin',
          joinedAt: new Date().toISOString(),
        };
        set((s) => ({
          workspaces: [...s.workspaces, workspace],
          workspaceMembers: [...s.workspaceMembers, membership],
        }));
        return id;
      },

      deleteWorkspace: (id) => {
        set((s) => ({
          workspaces: s.workspaces.filter((w) => w.id !== id),
          workspaceMembers: s.workspaceMembers.filter((m) => m.workspaceId !== id),
          pendingInvites: s.pendingInvites.filter((i) => i.workspaceId !== id),
          activeWorkspaceId: s.activeWorkspaceId === id ? 'ws-probe' : s.activeWorkspaceId,
        }));
      },

      updateWorkspace: (id, updates) => {
        set((s) => ({
          workspaces: s.workspaces.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        }));
      },

      createTeam: (input) => {
        const { activeWorkspaceId } = get();
        const id = `team-${Date.now()}`;
        const slug = input.name.toLowerCase().replace(/\s+/g, '-');
        const team: Team = {
          id,
          workspaceId: activeWorkspaceId,
          name: input.name,
          slug,
          description: input.description,
          color: input.color,
          icon: input.icon,
          visibility: input.visibility,
          createdAt: new Date().toISOString(),
          createdBy: CURRENT_USER_ID,
        };
        const membership: TeamMember = {
          userId: CURRENT_USER_ID,
          teamId: id,
          role: 'lead',
          joinedAt: new Date().toISOString(),
        };
        set((s) => ({
          teams: [...s.teams, team],
          teamMembers: [...s.teamMembers, membership],
        }));
        return id;
      },

      deleteTeam: (id) => {
        set((s) => ({
          teams: s.teams.filter((t) => t.id !== id),
          teamMembers: s.teamMembers.filter((m) => m.teamId !== id),
          folders: s.folders.filter((f) => f.teamId !== id),
          activeTeamId: s.activeTeamId === id ? null : s.activeTeamId,
        }));
      },

      updateTeam: (id, updates) => {
        set((s) => ({
          teams: s.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },

      updateTeamVisibility: (teamId, visibility) => {
        set((s) => ({
          teams: s.teams.map((t) => (t.id === teamId ? { ...t, visibility } : t)),
        }));
      },

      addTeamMember: (teamId, userId, role) => {
        const exists = get().teamMembers.some((m) => m.teamId === teamId && m.userId === userId);
        if (exists) return;
        set((s) => ({
          teamMembers: [...s.teamMembers, { userId, teamId, role, joinedAt: new Date().toISOString() }],
        }));
      },

      removeTeamMember: (teamId, userId) => {
        set((s) => ({
          teamMembers: s.teamMembers.filter((m) => !(m.teamId === teamId && m.userId === userId)),
        }));
      },

      changeTeamMemberRole: (teamId, userId, role) => {
        set((s) => ({
          teamMembers: s.teamMembers.map((m) =>
            m.teamId === teamId && m.userId === userId ? { ...m, role } : m
          ),
        }));
      },

      changeWorkspaceMemberRole: (userId, role) => {
        const { activeWorkspaceId } = get();
        set((s) => ({
          workspaceMembers: s.workspaceMembers.map((m) =>
            m.userId === userId && m.workspaceId === activeWorkspaceId ? { ...m, role } : m
          ),
        }));
      },

      removeWorkspaceMember: (userId) => {
        const { activeWorkspaceId } = get();
        set((s) => ({
          workspaceMembers: s.workspaceMembers.filter(
            (m) => !(m.userId === userId && m.workspaceId === activeWorkspaceId)
          ),
          teamMembers: s.teamMembers.filter((m) => m.userId !== userId),
        }));
      },

      inviteMember: (email, role, teamId) => {
        const { activeWorkspaceId } = get();
        const invite: PendingInvite = {
          id: `invite-${Date.now()}`,
          workspaceId: activeWorkspaceId,
          email,
          role,
          teamId,
          invitedBy: CURRENT_USER_ID,
          invitedAt: new Date().toISOString(),
          token: `tok_${Math.random().toString(36).slice(2, 10)}`,
        };
        set((s) => ({ pendingInvites: [...s.pendingInvites, invite] }));
      },

      revokeInvite: (inviteId) => {
        set((s) => ({ pendingInvites: s.pendingInvites.filter((i) => i.id !== inviteId) }));
      },

      createFolder: (teamId, input) => {
        const { activeWorkspaceId } = get();
        const id = `folder-${Date.now()}`;
        const folder: Folder = {
          id,
          teamId,
          workspaceId: activeWorkspaceId,
          name: input.name,
          description: input.description,
          color: input.color,
          visibility: input.visibility,
          createdAt: new Date().toISOString(),
          createdBy: CURRENT_USER_ID,
        };
        set((s) => ({ folders: [...s.folders, folder] }));
        return id;
      },

      deleteFolder: (id) => {
        set((s) => ({
          folders: s.folders.filter((f) => f.id !== id),
          folderMembers: s.folderMembers.filter((m) => m.folderId !== id),
          folderItems: s.folderItems.filter((i) => i.folderId !== id),
          activeFolderId: s.activeFolderId === id ? null : s.activeFolderId,
        }));
      },

      updateFolder: (id, updates) => {
        set((s) => ({
          folders: s.folders.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        }));
      },

      updateFolderVisibility: (folderId, visibility) => {
        set((s) => ({
          folders: s.folders.map((f) => (f.id === folderId ? { ...f, visibility } : f)),
        }));
      },

      addFolderMember: (folderId, userId, role) => {
        const exists = get().folderMembers.some((m) => m.folderId === folderId && m.userId === userId);
        if (exists) return;
        set((s) => ({
          folderMembers: [...s.folderMembers, { userId, folderId, role, joinedAt: new Date().toISOString() }],
        }));
      },

      removeFolderMember: (folderId, userId) => {
        set((s) => ({
          folderMembers: s.folderMembers.filter((m) => !(m.folderId === folderId && m.userId === userId)),
        }));
      },

      addItemToFolder: (folderId, contentId, contentType) => {
        const exists = get().folderItems.some(
          (i) => i.folderId === folderId && i.contentId === contentId && i.contentType === contentType
        );
        if (exists) return;
        set((s) => ({
          folderItems: [
            ...s.folderItems,
            {
              id: `fi-${Date.now()}`,
              folderId,
              contentId,
              contentType,
              addedBy: CURRENT_USER_ID,
              addedAt: new Date().toISOString(),
            },
          ],
        }));
      },

      removeItemFromFolder: (folderId, contentId) => {
        set((s) => ({
          folderItems: s.folderItems.filter(
            (i) => !(i.folderId === folderId && i.contentId === contentId)
          ),
        }));
      },

      getAvailableColors: () => TEAM_COLORS,
      getAvailableIcons: () => TEAM_ICONS,
    }),
    {
      name: 'workspace-store-v2',
      partialize: (state) => ({
        activeWorkspaceId: state.activeWorkspaceId,
        activeTeamId: state.activeTeamId,
        activeFolderId: state.activeFolderId,
        debugRole: state.debugRole,
        debugPlan: state.debugPlan,
        workspaces: state.workspaces,
        workspaceMembers: state.workspaceMembers,
        pendingInvites: state.pendingInvites,
        teams: state.teams,
        folders: state.folders,
        teamMembers: state.teamMembers,
        folderMembers: state.folderMembers,
        folderItems: state.folderItems,
      }),
    }
  )
);
