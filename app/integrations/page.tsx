import { CheckCircle2, Clock, ExternalLink, Github } from 'lucide-react';

const activeIntegrations = [
  {
    id: 'amplitude',
    name: 'Amplitude',
    description: 'Product analytics — events, funnels, cohorts, retention',
    bg: 'bg-blue-100',
    color: 'text-blue-700',
    letter: 'A',
    lastSynced: '2 minutes ago',
    stats: [
      { label: 'Events tracked', value: '142K' },
      { label: 'Funnels monitored', value: '6' },
      { label: 'Active cohorts', value: '14' },
    ],
    docsUrl: '#',
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    description: 'User journey analytics and conversion funnels',
    bg: 'bg-purple-100',
    color: 'text-purple-700',
    letter: 'M',
    lastSynced: '5 minutes ago',
    stats: [
      { label: 'Tracked users', value: '12.4K' },
      { label: 'Funnels', value: '4' },
      { label: 'Tickets linked', value: '3' },
    ],
    docsUrl: '#',
  },
  {
    id: 'posthog',
    name: 'PostHog',
    description: 'Session recordings, feature flags, heatmaps',
    bg: 'bg-orange-100',
    color: 'text-orange-700',
    letter: 'P',
    lastSynced: '3 minutes ago',
    stats: [
      { label: 'Sessions analyzed', value: '2,841' },
      { label: 'Flagged sessions', value: '214' },
      { label: 'Feature flags', value: '8' },
    ],
    docsUrl: '#',
  },
  {
    id: 'sentry',
    name: 'Sentry',
    description: 'Error tracking and performance monitoring',
    bg: 'bg-red-100',
    color: 'text-red-700',
    letter: 'S',
    lastSynced: '1 minute ago',
    stats: [
      { label: 'Active errors', value: '5' },
      { label: 'Users affected', value: '3,742' },
      { label: 'Occurrences (30d)', value: '5,420' },
    ],
    docsUrl: '#',
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Code repository, commit history, pull requests',
    bg: 'bg-slate-100',
    color: 'text-slate-700',
    useIcon: true,
    lastSynced: '8 minutes ago',
    stats: [
      { label: 'Repos indexed', value: '3' },
      { label: 'Open PRs', value: '3' },
      { label: 'Commits (30d)', value: '87' },
    ],
    docsUrl: '#',
  },
  {
    id: 'prometheus',
    name: 'Prometheus',
    description: 'Infrastructure metrics, service latency, uptime',
    bg: 'bg-orange-100',
    color: 'text-orange-600',
    letter: 'Pr',
    lastSynced: '30 seconds ago',
    stats: [
      { label: 'Services monitored', value: '6' },
      { label: 'Metrics collected', value: '1.2K' },
      { label: 'Alerts active', value: '2' },
    ],
    docsUrl: '#',
  },
];

const comingSoon = [
  {
    name: 'Slack',
    description: 'Connect team conversations and alerts',
    bg: 'bg-slate-100',
    color: 'text-slate-400',
    letter: 'Sl',
  },
  {
    name: 'Notion',
    description: 'Sync product specs, PRDs, and docs',
    bg: 'bg-slate-100',
    color: 'text-slate-400',
    letter: 'N',
  },
  {
    name: 'Jira',
    description: 'Link tickets to product outcomes',
    bg: 'bg-slate-100',
    color: 'text-slate-400',
    letter: 'J',
  },
  {
    name: 'Datadog',
    description: 'Advanced infrastructure observability',
    bg: 'bg-slate-100',
    color: 'text-slate-400',
    letter: 'D',
  },
];

export default function IntegrationsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Integrations</h1>
        <p className="text-slate-500 text-sm mt-1">
          Connected data sources that power your AI agent. All data is queried in real time.
        </p>
      </div>

      {/* Active integrations */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Active</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            {activeIntegrations.length} connected
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {activeIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${integration.bg} ${integration.color}`}>
                    {integration.useIcon ? <Github className="w-5 h-5" /> : integration.letter}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{integration.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{integration.description}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs text-green-700 font-medium bg-green-50 border border-green-200 px-2 py-0.5 rounded-full flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  Connected
                </span>
              </div>

              {/* Stats */}
              <div className="flex gap-4 py-3 border-t border-b border-slate-100 mb-3">
                {integration.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-sm font-semibold text-slate-900">{stat.value}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>Synced {integration.lastSynced}</span>
                </div>
                <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 transition-colors">
                  View Data
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming soon */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Coming Soon</h2>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {comingSoon.map((integration) => (
            <div
              key={integration.name}
              className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 opacity-60"
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${integration.bg} ${integration.color}`}>
                  {integration.letter}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700 text-sm">{integration.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{integration.description}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  Coming Soon
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
