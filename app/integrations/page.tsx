'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, ExternalLink, Github, X, CheckCheck } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';

import { dauTimeSeries, signupFunnelNov, signupFunnelOct, featureAdoptionData } from '@/lib/mock-data/amplitude';
import { checkoutFunnel, ticketPM204 } from '@/lib/mock-data/mixpanel';
import { flaggedSessions } from '@/lib/mock-data/posthog';
import { sentryErrors, validationErrorTimeSeries } from '@/lib/mock-data/sentry';
import { commits, pullRequests } from '@/lib/mock-data/github';
import { paymentsLatency, serviceHealth } from '@/lib/mock-data/prometheus';

// ─── Integration list ───────────────────────────────────────────────────────

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
  },
];

const comingSoon = [
  { name: 'Slack', description: 'Connect team conversations and alerts', bg: 'bg-slate-100', color: 'text-slate-400', letter: 'Sl' },
  { name: 'Notion', description: 'Sync product specs, PRDs, and docs', bg: 'bg-slate-100', color: 'text-slate-400', letter: 'N' },
  { name: 'Jira', description: 'Link tickets to product outcomes', bg: 'bg-slate-100', color: 'text-slate-400', letter: 'J' },
  { name: 'Datadog', description: 'Advanced infrastructure observability', bg: 'bg-slate-100', color: 'text-slate-400', letter: 'D' },
];

// ─── Amplitude Viewer ────────────────────────────────────────────────────────

function AmplitudeViewer() {
  const [tab, setTab] = useState<'dau' | 'funnel' | 'adoption'>('dau');
  const af = featureAdoptionData.advancedFilters;

  const dauData = dauTimeSeries.slice(-30).map(p => ({
    date: p.date.slice(5),
    DAU: p.value,
  }));

  const funnelCompare = signupFunnelNov.map((step, i) => ({
    name: step.step.replace('Landed on /signup', 'Landed').replace('Completed onboarding', 'Completed'),
    Nov: step.count,
    Oct: signupFunnelOct[i].count,
    dropRate: step.dropRate,
  }));

  const tabs = [
    { key: 'dau', label: 'DAU Trend' },
    { key: 'funnel', label: 'Signup Funnel' },
    { key: 'adoption', label: 'Feature Adoption' },
  ] as const;

  return (
    <div>
      <div className="flex gap-1 mb-5 bg-blue-50 rounded-lg p-1">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${tab === key ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-500 hover:text-blue-700'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'dau' && (
        <div>
          <p className="text-xs text-slate-500 mb-3">Daily Active Users — last 30 days</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dauData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
              <YAxis tick={{ fontSize: 10 }} width={45} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="DAU" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-blue-700">~950</p>
              <p className="text-[10px] text-blue-400 mt-0.5">Avg DAU</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-blue-700">142K</p>
              <p className="text-[10px] text-blue-400 mt-0.5">Events tracked</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-blue-700">14</p>
              <p className="text-[10px] text-blue-400 mt-0.5">Active cohorts</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'funnel' && (
        <div>
          <p className="text-xs text-slate-500 mb-3">Signup funnel — Nov vs Oct completion</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={funnelCompare} layout="vertical" margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 9 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={105} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Nov" fill="#3b82f6" radius={[0, 2, 2, 0]} />
              <Bar dataKey="Oct" fill="#93c5fd" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-1.5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Nov drop-off by step</p>
            {funnelCompare.filter(s => s.dropRate > 0).map(step => (
              <div key={step.name} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 truncate mr-2">{step.name}</span>
                <span className={`flex-shrink-0 px-2 py-0.5 rounded-full font-semibold text-[10px] ${step.dropRate >= 30 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  -{step.dropRate}% drop
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'adoption' && (
        <div>
          <p className="text-xs text-slate-500 mb-4">Advanced Filters — Feature Adoption (launched {af.launchDate})</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-blue-700">{af.uniqueUsers.toLocaleString()}</p>
              <p className="text-xs text-blue-500 mt-1">Unique users</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-blue-700">{af.percentMAU}%</p>
              <p className="text-xs text-blue-500 mt-1">% of MAU</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-green-700">{af.d30RetentionWithFeature}%</p>
              <p className="text-xs text-green-600 mt-1">D30 retention <span className="font-semibold">with</span> feature</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-slate-500">{af.d30RetentionWithout}%</p>
              <p className="text-xs text-slate-400 mt-1">D30 retention <span className="font-semibold">without</span></p>
            </div>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
            <strong>+{af.d30RetentionWithFeature - af.d30RetentionWithout}pp retention lift</strong> for users who adopt Advanced Filters — linked to PR #{af.prNumber}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Mixpanel Viewer ─────────────────────────────────────────────────────────

function MixpanelViewer() {
  const maxCount = checkoutFunnel[0].count;

  return (
    <div>
      <p className="text-xs text-slate-500 mb-5">Checkout funnel — {checkoutFunnel[0].count.toLocaleString()} users entered</p>
      <div className="space-y-3 mb-6">
        {checkoutFunnel.map((step, i) => {
          const dropFromPrev = i > 0 ? checkoutFunnel[i - 1].count - step.count : 0;
          const dropPct = i > 0 ? Math.round((dropFromPrev / checkoutFunnel[i - 1].count) * 100) : null;
          const barWidth = (step.count / maxCount) * 100;

          return (
            <div key={step.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700">{step.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {dropPct !== null && (
                    <span className="text-[10px] font-medium text-red-500">-{dropPct}%</span>
                  )}
                  <span className="text-xs font-semibold text-slate-900">{step.count.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400">{step.conversionRate}%</span>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Linked ticket</p>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-[10px] font-bold text-purple-500 bg-purple-100 px-2 py-0.5 rounded-full">{ticketPM204.id}</span>
              <p className="text-sm font-semibold text-slate-800 mt-2">{ticketPM204.title}</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full flex-shrink-0 ml-3">
              <CheckCheck className="w-3 h-3" />
              Met
            </span>
          </div>
          <ul className="space-y-1 mt-2">
            {ticketPM204.successCriteria.map(c => (
              <li key={c} className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── PostHog Viewer ──────────────────────────────────────────────────────────

const issueTypeConfig: Record<string, { label: string; bg: string; text: string }> = {
  'rage-click': { label: 'Rage click', bg: 'bg-red-100', text: 'text-red-700' },
  'dead-click': { label: 'Dead click', bg: 'bg-amber-100', text: 'text-amber-700' },
  'drop-off': { label: 'Drop-off', bg: 'bg-orange-100', text: 'text-orange-700' },
  'repeated-navigation': { label: 'Repeated nav', bg: 'bg-purple-100', text: 'text-purple-700' },
};

function PostHogViewer() {
  const issueBreakdown = flaggedSessions.reduce<Record<string, number>>((acc, s) => {
    if (s.issueType) acc[s.issueType] = (acc[s.issueType] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-5">
        {Object.entries(issueBreakdown).map(([type, count]) => {
          const cfg = issueTypeConfig[type];
          return (
            <div key={type} className={`${cfg.bg} rounded-lg p-3 text-center`}>
              <p className={`text-xl font-bold ${cfg.text}`}>{count}</p>
              <p className={`text-[10px] mt-0.5 ${cfg.text} opacity-80`}>{cfg.label}</p>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Flagged sessions</p>
      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {flaggedSessions.map(session => {
          const cfg = session.issueType ? issueTypeConfig[session.issueType] : null;
          const durationMin = Math.floor(session.duration / 60);
          const durationSec = session.duration % 60;

          return (
            <div key={session.id} className="border border-slate-100 rounded-lg p-3 hover:border-orange-200 hover:bg-orange-50/30 transition-colors">
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    #{session.id}
                  </span>
                  {cfg && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                      {cfg.label}
                    </span>
                  )}
                  {session.converted && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      Converted
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">
                  {durationMin}m {durationSec}s
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-1">{session.flaggedReason}</p>
              {session.agentAnnotation && (
                <p className="text-[10px] text-indigo-600 bg-indigo-50 rounded px-2 py-1 mt-1.5">
                  AI: {session.agentAnnotation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sentry Viewer ───────────────────────────────────────────────────────────

const severityConfig = {
  critical: { label: 'Critical', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  error: { label: 'Error', bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  warning: { label: 'Warning', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-400' },
};

function SentryViewer() {
  const sevCount = sentryErrors.reduce<Record<string, number>>((acc, e) => {
    acc[e.severity] = (acc[e.severity] ?? 0) + 1;
    return acc;
  }, {});

  const chartData = validationErrorTimeSeries.slice(-20).map(p => ({
    date: p.date.slice(5),
    count: p.count,
  }));

  return (
    <div>
      <div className="flex gap-3 mb-5">
        {(Object.entries(sevCount) as [keyof typeof severityConfig, number][]).map(([sev, count]) => {
          const cfg = severityConfig[sev];
          return (
            <div key={sev} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${cfg.bg}`}>
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              <span className={`text-sm font-bold ${cfg.text}`}>{count}</span>
              <span className={`text-xs ${cfg.text} opacity-80`}>{cfg.label}</span>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 mb-5">
        {sentryErrors.map(err => {
          const cfg = severityConfig[err.severity];
          return (
            <div key={err.id} className="border border-slate-100 rounded-lg p-3 hover:border-red-200 transition-colors">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`flex-shrink-0 w-2 h-2 rounded-full mt-1 ${cfg.dot}`} />
                  <span className="text-sm font-semibold text-slate-800 truncate">{err.name}</span>
                </div>
                <span className={`flex-shrink-0 ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2 ml-4 line-clamp-1">{err.message}</p>
              <div className="flex items-center gap-4 ml-4">
                <span className="text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-600">{err.occurrences.toLocaleString()}</span> occurrences
                </span>
                <span className="text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-600">{err.usersAffected.toLocaleString()}</span> users affected
                </span>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                  {err.service}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-500 mb-2">ValidationError — spike after Nov 4th deploy</p>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fde8e8" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={4} />
            <YAxis tick={{ fontSize: 9 }} width={30} />
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Bar dataKey="count" fill="#ef4444" radius={[2, 2, 0, 0]} name="Errors" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── GitHub Viewer ───────────────────────────────────────────────────────────

function GitHubViewer() {
  const [tab, setTab] = useState<'commits' | 'prs'>('prs');

  const prStatusConfig = {
    merged: { label: 'Merged', bg: 'bg-purple-100', text: 'text-purple-700' },
    open: { label: 'Open', bg: 'bg-green-100', text: 'text-green-700' },
    closed: { label: 'Closed', bg: 'bg-slate-100', text: 'text-slate-500' },
  };

  return (
    <div>
      <div className="flex gap-1 mb-5 bg-slate-100 rounded-lg p-1">
        {[['prs', 'Pull Requests'], ['commits', 'Commits']] .map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as 'commits' | 'prs')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${tab === key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'prs' && (
        <div className="space-y-2">
          {pullRequests.map(pr => {
            const cfg = prStatusConfig[pr.status];
            return (
              <div key={pr.number} className="border border-slate-100 rounded-lg p-3 hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-mono text-slate-400 flex-shrink-0">#{pr.number}</span>
                    <span className="text-sm font-semibold text-slate-800 truncate">{pr.title}</span>
                  </div>
                  <span className={`flex-shrink-0 ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                    {cfg.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2 line-clamp-1">{pr.description}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-slate-400">by {pr.author}</span>
                  {pr.daysOpen !== undefined && (
                    <span className="text-[10px] text-amber-600 font-medium">{pr.daysOpen}d open</span>
                  )}
                  {pr.labels.map(lbl => (
                    <span key={lbl} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium">
                      {lbl}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'commits' && (
        <div className="space-y-2">
          {commits.map(commit => (
            <div key={commit.sha} className="border border-slate-100 rounded-lg p-3 hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {commit.author[0].toUpperCase()}
                  </span>
                  <span className="text-sm text-slate-800 truncate">{commit.message}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0 ml-2">
                  {commit.sha}
                </span>
              </div>
              <div className="flex items-center gap-3 ml-8">
                <span className="text-[10px] text-slate-400">{commit.author}</span>
                <span className="text-[10px] text-green-600 font-medium">+{commit.additions}</span>
                <span className="text-[10px] text-red-500 font-medium">-{commit.deletions}</span>
                <span className="text-[10px] text-slate-400">{commit.files.length} file{commit.files.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Prometheus Viewer ───────────────────────────────────────────────────────

function PrometheusViewer() {
  const statusConfig = {
    healthy: { label: 'Healthy', dot: 'bg-green-400', text: 'text-green-700' },
    degraded: { label: 'Degraded', dot: 'bg-amber-400', text: 'text-amber-700' },
    critical: { label: 'Critical', dot: 'bg-red-500', text: 'text-red-700' },
  };

  const latencyData = paymentsLatency.slice(-24).map(p => ({
    time: new Date(p.timestamp).toISOString().slice(11, 16),
    P50: p.p50,
    P95: p.p95,
    P99: p.p99,
  }));

  return (
    <div>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Service health</p>
      <div className="grid grid-cols-2 gap-2 mb-5">
        {serviceHealth.map(svc => {
          const cfg = statusConfig[svc.status as keyof typeof statusConfig];
          return (
            <div key={svc.service} className="border border-slate-100 rounded-lg p-3 hover:border-orange-200 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-slate-600">{svc.service}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  <span className={`text-[10px] font-semibold ${cfg.text}`}>{cfg.label}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-600">{svc.uptime}%</span> uptime
                </span>
                <span className={`text-[10px] font-semibold ${svc.p95Latency > 1000 ? 'text-red-600' : svc.p95Latency > 400 ? 'text-amber-600' : 'text-slate-600'}`}>
                  {svc.p95Latency}ms P95
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-500 mb-2">
          payments-service latency — <span className="text-red-600 font-semibold">P95 spike on Dec 1</span>
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={latencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" tick={{ fontSize: 9 }} interval={5} />
            <YAxis tick={{ fontSize: 9 }} width={45} unit="ms" />
            <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v: number | undefined) => v != null ? `${v.toLocaleString()}ms` : ''} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Line type="monotone" dataKey="P50" stroke="#94a3b8" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="P95" stroke="#f97316" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="P99" stroke="#ef4444" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Data Viewer Modal ───────────────────────────────────────────────────────

const viewerConfig: Record<string, { title: string; subtitle: string; accentBg: string; accentText: string; component: React.ComponentType }> = {
  amplitude: {
    title: 'Amplitude',
    subtitle: 'Product analytics — events, funnels, cohorts',
    accentBg: 'bg-blue-100',
    accentText: 'text-blue-700',
    component: AmplitudeViewer,
  },
  mixpanel: {
    title: 'Mixpanel',
    subtitle: 'User journey analytics and conversion funnels',
    accentBg: 'bg-purple-100',
    accentText: 'text-purple-700',
    component: MixpanelViewer,
  },
  posthog: {
    title: 'PostHog',
    subtitle: 'Session recordings and behavior analysis',
    accentBg: 'bg-orange-100',
    accentText: 'text-orange-700',
    component: PostHogViewer,
  },
  sentry: {
    title: 'Sentry',
    subtitle: 'Error tracking and performance monitoring',
    accentBg: 'bg-red-100',
    accentText: 'text-red-700',
    component: SentryViewer,
  },
  github: {
    title: 'GitHub',
    subtitle: 'Code repository, commit history, pull requests',
    accentBg: 'bg-slate-100',
    accentText: 'text-slate-700',
    component: GitHubViewer,
  },
  prometheus: {
    title: 'Prometheus',
    subtitle: 'Infrastructure metrics, service latency, uptime',
    accentBg: 'bg-orange-100',
    accentText: 'text-orange-600',
    component: PrometheusViewer,
  },
};

function DataViewerModal({ integrationId, onClose }: { integrationId: string; onClose: () => void }) {
  const cfg = viewerConfig[integrationId];
  if (!cfg) return null;
  const ViewerComponent = cfg.component;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${cfg.accentBg} ${cfg.accentText}`}>
              {integrationId === 'github' ? <Github className="w-4 h-4" /> : viewerConfig[integrationId].title.slice(0, 2)}
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 text-sm">{cfg.title}</h2>
              <p className="text-xs text-slate-500">{cfg.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <ViewerComponent />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">Live data from {cfg.title} integration</span>
          <span className="flex items-center gap-1 text-[10px] font-medium text-green-600">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Connected
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

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
                <button
                  onClick={() => setSelectedIntegration(integration.id)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 transition-colors hover:underline"
                >
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

      {/* Data viewer modal */}
      {selectedIntegration && (
        <DataViewerModal
          integrationId={selectedIntegration}
          onClose={() => setSelectedIntegration(null)}
        />
      )}
    </div>
  );
}
