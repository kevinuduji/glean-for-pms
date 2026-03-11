'use client';

import { cn } from '@/lib/utils';

interface WorkspaceAvatarProps {
  initial: string;
  color: string; // Tailwind bg class e.g. 'bg-indigo-600'
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  xs: 'w-5 h-5 text-[10px]',
  sm: 'w-7 h-7 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

export default function WorkspaceAvatar({ initial, color, size = 'sm', className }: WorkspaceAvatarProps) {
  return (
    <div
      className={cn(
        'rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-white',
        sizeClasses[size],
        color,
        className
      )}
    >
      {initial}
    </div>
  );
}
