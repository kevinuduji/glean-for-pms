export type WorkspaceProject = {
  id: string;
  workspaceId: string; // parent space ID (e.g. 'personal-blackrock')
  name: string;
  color: string;
  description?: string;
  isPublic: boolean;
  inviteCode?: string;
  memberCount?: number;
  createdAt: string;
  isStatic?: boolean; // true = demo seed, can't be deleted
};
