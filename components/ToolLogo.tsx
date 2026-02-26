import { Github, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tool = 'amplitude' | 'mixpanel' | 'posthog' | 'sentry' | 'github' | 'prometheus' | 'agent';

const toolConfig: Record<Tool, { label: string; bg: string; color: string; letter?: string; Icon?: React.ComponentType<{ className?: string }> }> = {
  amplitude: { label: 'Amplitude', bg: 'bg-blue-100', color: 'text-blue-700', letter: 'A' },
  mixpanel: { label: 'Mixpanel', bg: 'bg-purple-100', color: 'text-purple-700', letter: 'M' },
  posthog: { label: 'PostHog', bg: 'bg-orange-100', color: 'text-orange-700', letter: 'P' },
  sentry: { label: 'Sentry', bg: 'bg-red-100', color: 'text-red-700', letter: 'S' },
  github: { label: 'GitHub', bg: 'bg-slate-100', color: 'text-slate-700', Icon: Github },
  prometheus: { label: 'Prometheus', bg: 'bg-orange-100', color: 'text-orange-600', letter: 'Pr' },
  agent: { label: 'Agent', bg: 'bg-indigo-100', color: 'text-indigo-700', Icon: Sparkles },
};

export default function ToolLogo({ tool, size = 'md' }: { tool: Tool; size?: 'sm' | 'md' }) {
  const config = toolConfig[tool];
  const sizeClass = size === 'sm' ? 'w-5 h-5 text-[9px]' : 'w-6 h-6 text-xs';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  return (
    <div className={cn('rounded flex items-center justify-center font-bold flex-shrink-0', sizeClass, config.bg, config.color)}>
      {config.Icon ? <config.Icon className={iconSize} /> : config.letter}
    </div>
  );
}
