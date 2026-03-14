# PRD: Workspaces
**Product:** Glean for PMs
**Author:** Kevin Uduji
**Date:** 2026-03-11
**Status:** Draft

---

## 1. Feature Overview

### Short Summary
Workspaces are isolated, named environments that let PMs and their teams organize all product intelligence — experiments, connectors, Discover signals, and agent chats — around a specific product, business unit, or project. Each workspace has its own members, roles, plan, and data context.

### Why This Feature Matters
Without workspaces, the app is a single shared environment. As PMs work across multiple products, join different companies, or collaborate with distinct teams, they need hard boundaries between contexts. Workspaces are the top-level container that makes the product scale from a solo PM tool to a full team platform — unlocking collaboration, permission control, and multi-product support in a single account.

---

## 2. User Problem

### What Users Struggle With Today
- A PM managing two separate products (e.g. a mobile consumer app and an internal B2B tool) has no clean way to separate their connectors, experiments, and metrics between the two. Everything bleeds together.
- Teams that share an account can see each other's confidential experiments, board-level metrics, or unreleased feature data.
- Solo PMs who consult for multiple clients need a clean way to switch between client contexts without seeing commingled data.
- There is no concept of "invite a colleague to review this product specifically" — it's all-or-nothing.

### Why Current Solutions Are Insufficient
Most PM tools are either single-environment (everything in one place) or too complex (enterprise org structures with nested permissions that take months to configure). There is no lightweight, fast-to-set-up workspace model that mirrors how tools like Notion, Linear, or Vercel work — where you can spin up a new workspace in 30 seconds and get to work.

---

## 3. Goals and Non-Goals

### Goals
- Allow a user to belong to multiple workspaces and switch between them instantly.
- Isolate all product data (KPIs, experiments, connectors, Discover items, agent chats) per workspace.
- Support role-based access at the workspace, team, and folder level.
- Enable workspace admins to invite members, manage roles, and control plan limits.
- Support plan tiers (Free, Pro, Enterprise) that gate feature access and connector limits per workspace.
- Support sub-organization via Teams (cross-functional groups within a workspace) and Folders (content containers within teams).

### Non-Goals (v1)
- SSO / SAML authentication at workspace level (Enterprise v2+)
- Workspace-level audit logs (v2)
- Transferring ownership of a workspace between users (v2)
- Public/shareable workspace landing pages (v2)
- Cross-workspace search or data aggregation
- Billing / payment collection UI (the app delegates this to the plan system; no Stripe integration in v1)

---

## 4. User Stories

### Workspace Core
- As a **PM**, I want to create a new workspace for a product so that I can keep all its data separate from other products I manage.
- As a **PM**, I want to switch between workspaces from the sidebar so that I can move between products without logging out.
- As a **workspace admin**, I want to invite teammates by email so that they can collaborate in the same product context.
- As a **workspace admin**, I want to assign roles (admin, member, viewer) to workspace members so that I can control who can edit vs. only view.
- As a **workspace admin**, I want to delete a workspace so that I can remove a product context I no longer need.

### Teams
- As a **workspace admin**, I want to create teams (e.g. "Growth", "Platform", "Mobile") so that I can group people and content by function or pod.
- As a **team lead**, I want to set my team to private so that only team members see its folders and content.
- As a **member**, I want to request to join a public team so that I can access its resources.

### Folders
- As a **team lead**, I want to create folders inside my team so that I can organize experiments, chats, and Discover items by initiative or sprint.
- As a **folder editor**, I want to add experiments and agent chats to a folder so that my team can find and revisit them easily.
- As a **folder viewer**, I want to browse folder contents without being able to edit them so that I can stay informed without risking accidental changes.

### Plan & Limits
- As a **free user**, I want to understand what I get on the Free plan so that I can decide if I need to upgrade.
- As a **workspace admin**, I want to see when I'm approaching connector limits so that I can plan an upgrade before I hit the wall.
- As a **pro user**, I want unlimited connectors and team-level features so that my whole pod can operate from one workspace.

---

## 5. Core Functionality

### 5.1 Workspace
A workspace is the top-level container. It has:
- `id`, `name`, `slug`, `logoInitial`, `logoColor`
- `plan`: `free | pro | enterprise`
- `visibility`: `public | private`
- Members with roles: `admin | member | viewer`

**Role permissions:**

| Action | Admin | Member | Viewer |
|---|---|---|---|
| View all content | ✓ | ✓ | ✓ |
| Run experiments / chats | ✓ | ✓ | ✗ |
| Manage connectors | ✓ | ✗ | ✗ |
| Invite members | ✓ | ✗ | ✗ |
| Manage billing/plan | ✓ | ✗ | ✗ |
| Delete workspace | ✓ | ✗ | ✗ |

**Plan limits:**

| Feature | Free | Pro | Enterprise |
|---|---|---|---|
| Connectors | 2 | Unlimited | Unlimited |
| Members | 1 | 10 | Unlimited |
| Teams | 0 | 5 | Unlimited |
| Folders | 0 | 20 | Unlimited |
| Agent chats saved | 10 | Unlimited | Unlimited |

### 5.2 Teams
A team lives inside a workspace. It has:
- `name`, `slug`, `description`, `color`, `icon`
- `visibility`: `public | private`
- Members with roles: `lead | member`

Team leads can manage folder creation, member roles, and team settings. Members can create folders and add content. Private teams are only visible to their members and workspace admins.

### 5.3 Folders
A folder lives inside a team. It has:
- `name`, `description`, `color`
- `visibility`: `public | private`
- Members with roles: `editor | viewer`
- Items: `chat | experiment | recommendation | retro`

Folders act as lightweight "projects" or sprint containers. Content (agent chats, experiments, Discover recommendations) can be added to a folder by team members with edit access.

### 5.4 Switching Workspaces
Switching workspaces resets the active team and folder context and re-renders all workspace-scoped pages (Overview, Experiments, Connectors, Discover, Agent) with the new workspace's data.

### 5.5 Invitations
Admins invite users by email. An invite generates a token-based link. Pending invites are shown in Settings > Members. Invites can be revoked before acceptance. An invited user can optionally be added to a specific team at invite time.

### 5.6 Edge Cases
- If a workspace is deleted, the active workspace falls back to the user's next available workspace. If none exists, show an empty state prompting workspace creation.
- A user cannot remove themselves from a workspace if they are the sole admin.
- Deleting a team cascades to delete all its folders and unassigns those folder items.
- A member demoted to viewer loses write access immediately on next page load.
- Folder visibility `private` + workspace role `admin` still allows the admin to see the folder.

---

## 6. User Flow

### Creating a Workspace
1. User clicks workspace name in sidebar → switcher dropdown opens.
2. User clicks "New Workspace".
3. Modal: enter workspace name → color/logo initial auto-generated → plan defaults to Free.
4. Workspace created → user set as admin → workspace becomes active → redirected to Overview.

### Switching Workspaces
1. User clicks workspace name in sidebar.
2. Dropdown shows all workspaces user belongs to with plan badges.
3. User clicks a workspace → active workspace updates → all pages re-render with new context.

### Inviting a Member
1. Admin goes to Settings → Members tab.
2. Clicks "Invite Member" → enters email, selects role (admin/member/viewer), optionally selects a team.
3. Pending invite appears in the list with a "Revoke" option.
4. Invitee receives email (future) → clicks link → joins workspace.

### Creating a Team
1. User (admin or member with create permission) clicks "+ New Team" in sidebar.
2. Modal: name, description, color, icon, visibility (public/private).
3. Team created → creator auto-assigned as lead → team appears in sidebar.

### Organizing Content into a Folder
1. Team lead clicks "+ New Folder" under a team in sidebar.
2. Names the folder, sets color and visibility.
3. From Experiments page, user right-clicks an experiment → "Add to Folder" → selects folder.
4. Folder now shows the experiment in its item list.

---

## 7. UI / UX Requirements

### Key Screens

**Sidebar**
- Workspace switcher at top: avatar + name + plan badge + chevron.
- Below nav: Teams section lists visible teams. Each team is collapsible to show folders.
- Clicking a team filters the sidebar and highlights team context. Clicking a folder filters to folder contents.
- Collapsed sidebar: shows workspace avatar only; teams collapse into icons.

**Workspace Switcher Dropdown**
- Header: "Your Workspaces"
- List: each workspace row shows avatar, name, plan badge, checkmark if active.
- Footer: "New Workspace" button, "Invite to workspace" shortcut.

**Settings > Members**
- Table: avatar, name, email, role dropdown (editable by admins), "Remove" action.
- Pending Invites section: email, role, invited date, "Revoke" button.
- "Invite Member" button opens a modal (email + role + optional team).

**Settings > Workspace**
- Edit workspace name, logo color.
- Danger zone: Delete workspace (requires typing workspace name to confirm).

**Plan Upgrade Prompt**
- When a user hits a plan limit (e.g. tries to add a 3rd connector on Free), show an inline upgrade banner inside the connector page rather than a hard block.
- Upsell copy is specific to the limit they hit.

### Design Principles
- Workspace switching should feel instant — no full page reload.
- Role-based UI: hide action buttons (not just disable) for viewers.
- Plan limits are surfaced contextually, not via a separate billing page.
- Team and folder creation is accessible from the sidebar with minimal steps (≤ 3 clicks from anywhere).

### Mobile vs Desktop
- Desktop: full sidebar with workspace switcher, teams, and folders visible.
- Mobile (future): bottom sheet for workspace switching; teams/folders accessible via a hamburger menu.
- All modals (create workspace, invite member, create team) should be mobile-responsive.

---

## 8. Technical Requirements

### Data Models
All types are defined in [lib/types/workspace.ts](lib/types/workspace.ts). Key models:

```
Workspace        { id, name, slug, logoInitial, logoColor, plan, visibility, createdAt, createdBy }
WorkspaceMember  { userId, workspaceId, role, joinedAt }
Team             { id, workspaceId, name, slug, description, color, icon, visibility, createdAt, createdBy }
TeamMember       { userId, teamId, role, joinedAt }
Folder           { id, teamId, workspaceId, name, description, color, visibility, createdAt, createdBy }
FolderMember     { userId, folderId, role, joinedAt }
FolderItem       { id, folderId, contentId, contentType, addedBy, addedAt }
PendingInvite    { id, workspaceId, email, role, teamId?, invitedBy, invitedAt, token }
```

**Content types that can live in a folder:** `chat | experiment | recommendation | retro`

### State Management
- All workspace state lives in [lib/workspace-store.ts](lib/workspace-store.ts) (Zustand + `persist` middleware).
- Persisted to `localStorage` under key `workspace-store-v2`.
- `activeWorkspaceId`, `activeTeamId`, `activeFolderId` drive global context.
- Debug overrides (`debugRole`, `debugPlan`) allow testing any role/plan combination without data changes.

### Selectors (Already Implemented)
- `getWorkspaceRole()` — returns effective role (respects debug override)
- `getActivePlan()` — returns active plan (respects debug override)
- `getConnectorLimit()` — returns `2` for free, `null` for pro/enterprise
- `canManageMembers()`, `canManageConnectors()`, `canManageBilling()` — role guards
- `canSeeTeam(teamId)`, `canSeeFolder(folderId)` — visibility + membership checks
- `getVisibleTeams()`, `getVisibleFolders(teamId)` — filtered lists for sidebar rendering

### APIs (Future Backend)
When moving from mock data to a real backend, the following endpoints are needed:

| Method | Path | Description |
|---|---|---|
| GET | `/api/workspaces` | List workspaces for current user |
| POST | `/api/workspaces` | Create workspace |
| PATCH | `/api/workspaces/:id` | Update workspace |
| DELETE | `/api/workspaces/:id` | Delete workspace |
| GET | `/api/workspaces/:id/members` | List members |
| POST | `/api/workspaces/:id/invites` | Send invite |
| DELETE | `/api/workspaces/:id/invites/:inviteId` | Revoke invite |
| GET | `/api/workspaces/:id/teams` | List teams |
| POST | `/api/workspaces/:id/teams` | Create team |
| PATCH | `/api/teams/:id` | Update team |
| DELETE | `/api/teams/:id` | Delete team |
| POST | `/api/teams/:id/members` | Add team member |
| DELETE | `/api/teams/:id/members/:userId` | Remove team member |
| GET | `/api/teams/:id/folders` | List folders |
| POST | `/api/teams/:id/folders` | Create folder |
| PATCH | `/api/folders/:id` | Update folder |
| DELETE | `/api/folders/:id` | Delete folder |
| POST | `/api/folders/:id/items` | Add item to folder |
| DELETE | `/api/folders/:id/items/:contentId` | Remove item |

### Integrations
- **Per-workspace product data:** `getWorkspaceData(workspaceId)` in [lib/mock-data/workspace-data.ts](lib/mock-data/workspace-data.ts) maps workspace IDs to unique KPIs, experiments, connectors, and Discover items. Each page (Overview, Experiments, Connectors, Discover) calls this to render workspace-specific content.
- **Agent store:** `saveCurrentChat()` in [lib/store.ts](lib/store.ts) tags saved chats with `workspaceId`. Chat history is filtered by active workspace.

### Performance Considerations
- Workspace switching is fully synchronous (client-side Zustand state change) — no network round-trip in the mock version.
- `getVisibleTeams()` and `getVisibleFolders()` run linear scans over in-memory arrays. At scale these should be indexed by `workspaceId` and `teamId` respectively.
- Persist store only serializes scalar IDs and array data — avoid persisting derived/computed fields.

---

## 9. Analytics & Metrics

### Events to Track

| Event | Properties |
|---|---|
| `workspace_created` | `plan`, `source` (sidebar / onboarding) |
| `workspace_switched` | `from_workspace_id`, `to_workspace_id` |
| `workspace_deleted` | `plan`, `member_count` |
| `member_invited` | `role`, `has_team_assignment` |
| `member_invite_revoked` | `role` |
| `member_role_changed` | `old_role`, `new_role` |
| `team_created` | `visibility` |
| `team_deleted` | — |
| `folder_created` | `visibility` |
| `folder_item_added` | `content_type` |
| `connector_limit_hit` | `plan`, `connector_count` |
| `upgrade_banner_seen` | `plan`, `limit_type` |
| `upgrade_banner_clicked` | `plan`, `limit_type` |

### KPIs

| KPI | Description | Target |
|---|---|---|
| Workspaces per user (P50) | How many workspaces a user maintains | ≥ 1.5 within 30 days |
| Multi-member workspaces | % of workspaces with ≥ 2 members | ≥ 20% within 60 days |
| Invite acceptance rate | Accepted / sent | ≥ 60% |
| Team adoption | % of Pro+ workspaces with ≥ 1 team | ≥ 40% |
| Folder adoption | % of Pro+ workspaces with ≥ 1 folder | ≥ 30% |
| Connector limit conversion | Free users who hit limit and upgrade | ≥ 10% |

---

## 10. Risks & Open Questions

### Risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| Users confused by workspace vs. team vs. folder hierarchy | Medium | In-app tooltip/onboarding tooltip explaining the 3-tier model on first use |
| Accidental workspace deletion | Medium | Require typing workspace name to confirm; add 30-day soft delete / recovery |
| Role escalation bug (viewer sees admin UI) | Low | Role checks happen at selector level in the store, not just in component conditionals |
| Per-workspace data inconsistency after plan downgrade | Medium | Enforce connector limits on read (hide excess connectors) with a warning banner |
| localStorage persistence conflicts across tabs | Low | Use BroadcastChannel or Zustand cross-tab sync for active workspace state |

### Open Questions
1. **Workspace vs. organization:** Should there be an "organization" tier above workspaces (like GitHub org → repos)? Useful for agencies managing many client workspaces under one billing entity.
2. **Who pays for a workspace?** Is billing per-workspace or per-user? Current model implies per-workspace plan. Confirm before building Stripe integration.
3. **Guest access:** Should there be a time-limited or read-only guest link to share a Discover report or experiment result without adding someone as a member?
4. **Workspace transfer:** What happens to a workspace when its sole admin leaves? Should we require a second admin before allowing the first to leave?
5. **Team membership requests:** Can a member request to join a private team, or is it invite-only? Current data model only supports admin-assigned membership.
6. **Folder items — ordering:** Are folder items ordered by `addedAt` or manually drag-reordered? The current `FolderItem` type has no `sortOrder` field.
7. **Notifications:** Should members be notified (in-app or email) when they're added to a workspace, team, or folder?

---

## 11. Future Improvements

| Improvement | Phase | Notes |
|---|---|---|
| SSO / SAML login per workspace | Enterprise v2 | Required by large enterprise buyers |
| Audit log (who did what, when) | v2 | Especially for compliance-sensitive teams |
| Workspace-level notification preferences | v2 | Per-user, per-workspace notification settings |
| Workspace templates | v2 | Pre-populate a workspace with standard teams, folders, and connector suggestions based on product type (mobile app, B2B SaaS, e-commerce) |
| Cross-workspace insights | v3 | For agencies or holding companies running multiple workspaces — aggregate KPI comparisons |
| Public Discover reports | v2 | Share a read-only link to a Discover signal or experiment result with external stakeholders |
| Mobile app workspace switching | v2 | Bottom-sheet workspace picker, gesture-based switching |
| Workspace activity feed | v2 | Chronological stream of "Kevin added experiment X to Growth folder", "Sarah joined workspace", etc. |
| AI workspace setup assistant | v2 | Agent that asks 3 questions about your product and auto-creates recommended teams, folders, and connector suggestions |
| Guest / collaborator role | v2 | Lightweight access: can view and comment, cannot run experiments or manage connectors |
