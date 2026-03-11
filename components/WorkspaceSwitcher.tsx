'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Check, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkspaceStore } from '@/lib/workspace-store';
import WorkspaceAvatar from './WorkspaceAvatar';
import PlanBadge from './PlanBadge';
import { useRouter } from 'next/navigation';

export default function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { activeWorkspaceId, setActiveWorkspace, getWorkspacesForUser, workspaces } = useWorkspaceStore();
  const userWorkspaces = getWorkspacesForUser();
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!activeWorkspace) return null;

  return (
    <div ref={ref} className="relative px-2 py-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors group"
      >
        <WorkspaceAvatar
          initial={activeWorkspace.logoInitial}
          color={activeWorkspace.logoColor}
          size="sm"
        />
        <div className="flex-1 min-w-0 text-left">
          <p className="text-slate-200 text-[13px] font-semibold truncate leading-tight">
            {activeWorkspace.name}
          </p>
          <PlanBadge plan={activeWorkspace.plan} />
        </div>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-slate-500 transition-transform duration-200 flex-shrink-0',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div className="absolute left-2 right-2 top-full mt-1 z-50 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
          <div className="px-3 pt-2.5 pb-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
              Workspaces
            </p>
          </div>

          <div className="pb-1">
            {userWorkspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  setActiveWorkspace(ws.id);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-700/60 transition-colors"
              >
                <WorkspaceAvatar initial={ws.logoInitial} color={ws.logoColor} size="sm" />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[13px] font-medium text-slate-200 truncate">{ws.name}</p>
                  <PlanBadge plan={ws.plan} />
                </div>
                {ws.id === activeWorkspaceId && (
                  <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-700 py-1">
            <button
              onClick={() => {
                setOpen(false);
                router.push('/settings/workspace/members?invite=true');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                <UserPlus className="w-3.5 h-3.5" />
              </div>
              <span className="text-[13px] font-medium">Invite people</span>
            </button>
            <button
              onClick={() => {
                setOpen(false);
                router.push('/onboarding');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <span className="text-[13px] font-medium">Create workspace</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
