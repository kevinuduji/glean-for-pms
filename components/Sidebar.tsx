'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, LayoutDashboard, BarChart3, FlaskConical, Play, Plug, Settings, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/agent', label: 'Agent', icon: Sparkles, badge: 'New' },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
  { href: '/experiments', label: 'Experiments', icon: FlaskConical },
  { href: '/sessions', label: 'Sessions', icon: Play },
  { href: '/integrations', label: 'Integrations', icon: Plug },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="fixed left-0 top-0 h-screen w-60 bg-slate-900 flex flex-col z-40 border-r border-slate-800">
      {/* Logo */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">Cursor for PMs</span>
        </div>
        <div className="mt-1 ml-9">
          <span className="text-slate-500 text-xs">Arcova Workspace</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-xs hover:bg-slate-700 transition-colors">
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-left">Search...</span>
          <span className="text-slate-600 text-xs font-mono">⌘K</span>
        </button>
      </div>

      <div className="h-px bg-slate-800 mx-3 mb-2" />

      {/* Nav items */}
      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all relative',
                active
                  ? 'text-indigo-400 bg-indigo-900/40 border-l-2 border-indigo-500 pl-[10px]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
              {badge && (
                <span className="ml-auto text-[10px] font-semibold bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="h-px bg-slate-800 mx-3 mb-2" />

      {/* Bottom items */}
      <div className="px-2 pb-2">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-3 py-3 border-t border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">K</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-200 text-xs font-medium truncate">Kevin</p>
            <p className="text-slate-500 text-xs truncate">Arcova</p>
          </div>
        </div>
      </div>
    </div>
  );
}
