'use client';

import { useState } from 'react';
import { MoreHorizontal, ChevronDown, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WorkspaceRole } from '@/lib/types/workspace';

interface MemberRowProps {
  userId: string;
  displayName: string;
  email: string;
  avatarInitial: string;
  avatarColor: string;
  role: WorkspaceRole;
  joinedAt: string;
  isCurrentUser?: boolean;
  canEdit?: boolean;
  onRoleChange?: (userId: string, role: WorkspaceRole) => void;
  onRemove?: (userId: string) => void;
}

const roleLabels: Record<WorkspaceRole, string> = {
  admin: 'Admin',
  member: 'Member',
  viewer: 'Viewer',
};

const roleBadgeClasses: Record<WorkspaceRole, string> = {
  admin: 'bg-amber-900/40 text-amber-300',
  member: 'bg-indigo-900/40 text-indigo-300',
  viewer: 'bg-slate-700 text-slate-400',
};

export default function MemberRow({
  userId,
  displayName,
  email,
  avatarInitial,
  avatarColor,
  role,
  joinedAt,
  isCurrentUser,
  canEdit,
  onRoleChange,
  onRemove,
}: MemberRowProps) {
  const [roleOpen, setRoleOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const joinedDate = new Date(joinedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex items-center gap-3 py-3 px-4 hover:bg-slate-800/30 rounded-lg transition-colors group">
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-white text-sm',
          avatarColor
        )}
      >
        {avatarInitial}
      </div>

      {/* Name + email */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-medium text-slate-200 truncate">{displayName}</p>
          {isCurrentUser && (
            <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">
              You
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 truncate">{email}</p>
      </div>

      {/* Joined date */}
      <p className="text-[11px] text-slate-600 hidden sm:block flex-shrink-0">{joinedDate}</p>

      {/* Role badge / picker */}
      <div className="relative flex-shrink-0">
        {canEdit && !isCurrentUser ? (
          <button
            onClick={() => { setRoleOpen((o) => !o); setMenuOpen(false); }}
            className={cn(
              'flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md transition-colors',
              roleBadgeClasses[role],
              'hover:opacity-80'
            )}
          >
            {roleLabels[role]}
            <ChevronDown className="w-3 h-3" />
          </button>
        ) : (
          <span className={cn('text-[11px] font-semibold px-2 py-1 rounded-md', roleBadgeClasses[role])}>
            {roleLabels[role]}
          </span>
        )}

        {roleOpen && (
          <div className="absolute right-0 top-full mt-1 z-20 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden min-w-[130px]">
            {(['admin', 'member', 'viewer'] as WorkspaceRole[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  onRoleChange?.(userId, r);
                  setRoleOpen(false);
                }}
                className={cn(
                  'w-full text-left px-3 py-2 text-[13px] transition-colors hover:bg-slate-700',
                  r === role ? 'text-slate-200 font-semibold' : 'text-slate-400'
                )}
              >
                {roleLabels[r]}
                {r === role && <span className="float-right text-indigo-400">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions menu */}
      {canEdit && !isCurrentUser && (
        <div className="relative flex-shrink-0">
          <button
            onClick={() => { setMenuOpen((o) => !o); setRoleOpen(false); }}
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-300 hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 z-20 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden min-w-[160px]">
              <button
                onClick={() => {
                  onRemove?.(userId);
                  setMenuOpen(false);
                }}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-[13px] text-rose-400 hover:bg-slate-700 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove from workspace
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
