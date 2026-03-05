export type WorkspaceRole = 'admin' | 'member' | 'viewer';
export type TeamRole = 'lead' | 'member';
export type FolderRole = 'editor' | 'viewer';
export type Visibility = 'public' | 'private';

export type WorkspaceUser = {
  id: string;
  handle: string;
  displayName: string;
  avatarInitial: string;
  avatarColor: string;
  email: string;
};

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  logoInitial: string;
  logoColor: string;
  plan: 'free' | 'pro' | 'enterprise';
  visibility: Visibility;
  createdAt: string;
  createdBy: string;
};

export type WorkspaceMember = {
  userId: string;
  workspaceId: string;
  role: WorkspaceRole;
  joinedAt: string;
};

export type Team = {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  visibility: Visibility;
  createdAt: string;
  createdBy: string;
};

export type TeamMember = {
  userId: string;
  teamId: string;
  role: TeamRole;
  joinedAt: string;
};

export type Folder = {
  id: string;
  teamId: string;
  workspaceId: string;
  name: string;
  description: string;
  color: string;
  visibility: Visibility;
  createdAt: string;
  createdBy: string;
};

export type FolderMember = {
  userId: string;
  folderId: string;
  role: FolderRole;
  joinedAt: string;
};

export type FolderItem = {
  id: string;
  folderId: string;
  contentId: string;
  contentType: 'chat' | 'experiment' | 'recommendation' | 'retro';
  addedBy: string;
  addedAt: string;
};

// Derived view model used by UI
export type TeamWithMembers = Team & {
  members: Array<WorkspaceMember & { user: WorkspaceUser; teamRole: TeamRole }>;
  folders: Folder[];
};

export type FolderWithMembers = Folder & {
  members: Array<{ user: WorkspaceUser; role: FolderRole }>;
  items: FolderItem[];
};

export type UserContext = {
  user: WorkspaceUser;
  workspaceRole: WorkspaceRole;
  teamMemberships: Array<{ teamId: string; teamRole: TeamRole }>;
  folderMemberships: Array<{ folderId: string; folderRole: FolderRole }>;
};
