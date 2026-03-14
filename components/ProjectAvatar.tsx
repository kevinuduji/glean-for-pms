'use client';

import {
  Smartphone, Globe, Rocket, Building2, ShoppingCart, Zap, Shield,
  BarChart2, Layers, Cpu, Users, Package, Target, Megaphone,
  CreditCard, Headphones, Settings2, Store,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, LucideIcon> = {
  Smartphone, Globe, Rocket, Building2, ShoppingCart, Zap, Shield,
  BarChart2, Layers, Cpu, Users, Package, Target, Megaphone,
  CreditCard, Headphones, Settings2, Store,
};

const COLOR_MAP: Record<string, string> = {
  indigo:  'bg-indigo-600',
  emerald: 'bg-emerald-600',
  violet:  'bg-violet-600',
  rose:    'bg-rose-600',
  amber:   'bg-amber-500',
  sky:     'bg-sky-500',
  orange:  'bg-orange-500',
  teal:    'bg-teal-600',
  slate:   'bg-slate-600',
};

type Size = 'xs' | 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<Size, { outer: string; icon: string; text: string }> = {
  xs:  { outer: 'w-5 h-5 rounded-md',  icon: 'w-2.5 h-2.5', text: 'text-[9px] font-bold' },
  sm:  { outer: 'w-7 h-7 rounded-lg',  icon: 'w-3.5 h-3.5', text: 'text-[11px] font-bold' },
  md:  { outer: 'w-9 h-9 rounded-xl',  icon: 'w-4.5 h-4.5', text: 'text-sm font-bold' },
  lg:  { outer: 'w-14 h-14 rounded-2xl', icon: 'w-7 h-7',   text: 'text-xl font-bold' },
};

interface ProjectAvatarProps {
  name: string;
  color: string;
  icon: string | null;
  size?: Size;
  className?: string;
}

export default function ProjectAvatar({
  name,
  color,
  icon,
  size = 'sm',
  className,
}: ProjectAvatarProps) {
  const bg = COLOR_MAP[color] ?? 'bg-slate-600';
  const sz = SIZE_MAP[size];
  const IconComponent = icon ? ICON_MAP[icon] : null;

  return (
    <div
      className={cn(
        'flex items-center justify-center flex-shrink-0 text-white',
        bg,
        sz.outer,
        className,
      )}
    >
      {IconComponent ? (
        <IconComponent className={sz.icon} />
      ) : (
        <span className={sz.text}>{name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}
