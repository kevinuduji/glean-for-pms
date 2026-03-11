'use client';

import { Bug, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useWorkspaceStore } from '@/lib/workspace-store';
import type { WorkspaceRole } from '@/lib/types/workspace';

const ROLES: { value: WorkspaceRole | null; label: string }[] = [
  { value: null, label: 'Real' },
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
];

const PLANS: { value: 'free' | 'pro' | 'enterprise' | null; label: string }[] = [
  { value: null, label: 'Real' },
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Ent.' },
];

export default function DebugRoleSwitcher() {
  const [expanded, setExpanded] = useState(true);
  const { debugRole, debugPlan, setDebugRole, setDebugPlan } = useWorkspaceStore();

  return (
    <div className="mx-2 mb-2 rounded-xl bg-slate-800/80 border border-slate-700/50 overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-slate-300 transition-colors"
      >
        <Bug className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex-1 text-left">
          Dev Tools
        </span>
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2.5 border-t border-slate-700/50 pt-2">
          {/* Role switcher */}
          <div>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Test as role
            </p>
            <div className="flex gap-1">
              {ROLES.map(({ value, label }) => (
                <button
                  key={label}
                  onClick={() => setDebugRole(value)}
                  className={cn(
                    'flex-1 text-[10px] font-semibold py-1 rounded-md transition-colors',
                    debugRole === value
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-700/60 text-slate-500 hover:text-slate-300 hover:bg-slate-700'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Plan switcher */}
          <div>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Test as plan
            </p>
            <div className="flex gap-1">
              {PLANS.map(({ value, label }) => (
                <button
                  key={label}
                  onClick={() => setDebugPlan(value)}
                  className={cn(
                    'flex-1 text-[10px] font-semibold py-1 rounded-md transition-colors',
                    debugPlan === value
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'bg-slate-700/60 text-slate-500 hover:text-slate-300 hover:bg-slate-700'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Active override indicator */}
          {(debugRole !== null || debugPlan !== null) && (
            <p className="text-[10px] text-amber-400/80 text-center">
              ⚠ Overrides active
            </p>
          )}
        </div>
      )}
    </div>
  );
}
