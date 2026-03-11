'use client';

import { cn } from '@/lib/utils';

interface PlanBadgeProps {
  plan: 'free' | 'pro' | 'enterprise';
  className?: string;
}

const planConfig = {
  free: { label: 'Free', classes: 'bg-slate-700 text-slate-300' },
  pro: { label: 'Pro', classes: 'bg-indigo-900/60 text-indigo-300' },
  enterprise: { label: 'Enterprise', classes: 'bg-emerald-900/60 text-emerald-300' },
};

export default function PlanBadge({ plan, className }: PlanBadgeProps) {
  const config = planConfig[plan];
  return (
    <span
      className={cn(
        'text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded',
        config.classes,
        className
      )}
    >
      {config.label}
    </span>
  );
}
