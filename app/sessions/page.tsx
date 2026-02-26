'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { flaggedSessions, Session } from '@/lib/mock-data/posthog';
import { Play, Sparkles, X, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/utils';

type IssueType = Session['issueType'];

const issueTypeConfig: Record<NonNullable<IssueType>, { label: string; color: string }> = {
  'rage-click': { label: 'Rage Click', color: 'bg-red-100 text-red-700' },
  'dead-click': { label: 'Dead Click', color: 'bg-amber-100 text-amber-700' },
  'drop-off': { label: 'Drop-off', color: 'bg-slate-100 text-slate-600' },
  'repeated-navigation': { label: 'Repeated Nav', color: 'bg-orange-100 text-orange-700' },
};

const filterOptions: Array<{ value: IssueType | 'all'; label: string }> = [
  { value: 'all', label: 'All Issues' },
  { value: 'rage-click', label: 'Rage Click' },
  { value: 'dead-click', label: 'Dead Click' },
  { value: 'drop-off', label: 'Drop-off' },
  { value: 'repeated-navigation', label: 'Repeated Nav' },
];

function SessionCard({
  session,
  onClick,
}: {
  session: Session;
  onClick: () => void;
}) {
  const issueConfig = session.issueType ? issueTypeConfig[session.issueType] : null;
  const durationStr = formatDuration(session.duration);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden"
    >
      {/* Blurred screenshot placeholder */}
      <div className="h-28 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg,
              ${session.issueType === 'rage-click' ? '#fef2f2, #fee2e2' :
                session.issueType === 'dead-click' ? '#fffbeb, #fef3c7' :
                session.issueType === 'repeated-navigation' ? '#fff7ed, #fed7aa' :
                '#f8fafc, #e2e8f0'})`,
          }}
        />
        {/* Fake UI skeleton */}
        <div className="absolute inset-0 p-3 opacity-30">
          <div className="h-2 bg-slate-400 rounded w-3/4 mb-1.5" />
          <div className="h-2 bg-slate-300 rounded w-1/2 mb-3" />
          <div className="flex gap-1.5 mb-2">
            <div className="h-5 bg-slate-300 rounded w-14" />
            <div className="h-5 bg-slate-300 rounded w-20" />
            <div className="h-5 bg-slate-400 rounded w-16" />
          </div>
          <div className="h-2 bg-slate-200 rounded w-full mb-1" />
          <div className="h-2 bg-slate-200 rounded w-5/6" />
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/20">
          <div className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center">
            <Play className="w-4 h-4 text-slate-700 ml-0.5" />
          </div>
        </div>

        {/* Issue type badge */}
        {issueConfig && (
          <div className="absolute top-2 left-2">
            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', issueConfig.color)}>
              {issueConfig.label}
            </span>
          </div>
        )}

        {/* Converted badge */}
        {session.converted && (
          <div className="absolute top-2 right-2">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
              Converted
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Session ID and user */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm font-semibold text-slate-900">Session #{session.id}</p>
            <p className="text-xs text-slate-400 font-mono">{session.userId}</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            {durationStr}
          </div>
        </div>

        {/* Page path */}
        <div className="flex items-center gap-1 flex-wrap mb-2">
          {session.pageViews.slice(0, 4).map((page, i) => (
            <span key={i} className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                {page}
              </span>
              {i < Math.min(session.pageViews.length - 1, 3) && (
                <ChevronRight className="w-2.5 h-2.5 text-slate-300" />
              )}
            </span>
          ))}
          {session.pageViews.length > 4 && (
            <span className="text-[10px] text-slate-400">+{session.pageViews.length - 4}</span>
          )}
        </div>

        {/* Flagged reason */}
        {session.flaggedReason && (
          <p className="text-xs text-slate-500 mb-2 line-clamp-2">{session.flaggedReason}</p>
        )}

        {/* AI annotation */}
        {session.agentAnnotation && (
          <div className="flex items-start gap-1.5 bg-indigo-50 rounded-lg px-2.5 py-2 mb-3">
            <Sparkles className="w-3 h-3 text-indigo-500 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-indigo-700 font-medium leading-relaxed">
              {session.agentAnnotation}
            </p>
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); }}
          className="w-full py-1.5 text-xs text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-300 rounded-lg transition-colors font-medium"
        >
          View Session →
        </button>
      </div>
    </motion.div>
  );
}

function SessionDetailPanel({
  session,
  onClose,
}: {
  session: Session;
  onClose: () => void;
}) {
  const issueConfig = session.issueType ? issueTypeConfig[session.issueType] : null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed right-0 top-0 h-screen w-[440px] bg-white border-l border-slate-200 shadow-xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Session #{session.id}</h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">{session.userId}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Screenshot placeholder */}
        <div
          className="h-48 relative"
          style={{
            background: `linear-gradient(135deg,
              ${session.issueType === 'rage-click' ? '#fef2f2, #fca5a5' :
                session.issueType === 'dead-click' ? '#fffbeb, #fde68a' :
                session.issueType === 'repeated-navigation' ? '#fff7ed, #fb923c' :
                '#f8fafc, #cbd5e1'})`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-lg">
              <Play className="w-6 h-6 text-slate-600 ml-0.5" />
            </div>
          </div>
          {issueConfig && (
            <div className="absolute bottom-3 left-3">
              <span className={cn('text-xs font-semibold px-2 py-1 rounded-full', issueConfig.color)}>
                {issueConfig.label}
              </span>
            </div>
          )}
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500">Duration</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{formatDuration(session.duration)}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500">Pages</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{session.pageViews.length}</p>
            </div>
            <div className={cn('rounded-lg p-3', session.converted ? 'bg-green-50' : 'bg-red-50')}>
              <p className="text-xs text-slate-500">Outcome</p>
              <p className={cn('text-sm font-semibold mt-0.5', session.converted ? 'text-green-700' : 'text-red-700')}>
                {session.converted ? 'Converted' : 'Abandoned'}
              </p>
            </div>
          </div>

          {/* Full path */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-3">Session Path</p>
            <div className="space-y-1.5">
              {session.pageViews.map((page, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-mono flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-xs font-mono text-slate-700 bg-slate-50 px-2 py-1 rounded-lg">
                    {page}
                  </span>
                  {i < session.pageViews.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Flagged reason */}
          {session.flaggedReason && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">What Happened</p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-sm text-slate-700">{session.flaggedReason}</p>
              </div>
            </div>
          )}

          {/* AI annotation */}
          {session.agentAnnotation && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Agent Analysis
              </p>
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                <p className="text-sm text-indigo-900">{session.agentAnnotation}</p>
              </div>
            </div>
          )}

          {/* Source chips */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">Data Sources</p>
            <div className="flex gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">PostHog</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">Amplitude</span>
            </div>
          </div>

          <button className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
            <Play className="w-4 h-4" />
            Watch Session Replay
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function SessionsPage() {
  const [filter, setFilter] = useState<IssueType | 'all'>('all');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const filtered = filter === 'all'
    ? flaggedSessions
    : flaggedSessions.filter(s => s.issueType === filter);

  return (
    <>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Session Intelligence</h1>
          <p className="text-slate-500 text-sm mt-1">
            AI-flagged sessions from PostHog, ranked by diagnostic value. {flaggedSessions.length} sessions flagged this week.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-6">
          {filterOptions.map(opt => (
            <button
              key={opt.value ?? 'all'}
              onClick={() => setFilter(opt.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                filter === opt.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-zinc-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              {opt.label}
              {opt.value !== 'all' && (
                <span className="ml-1.5 text-[10px] opacity-70">
                  {flaggedSessions.filter(s => s.issueType === opt.value).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Sessions grid */}
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onClick={() => setSelectedSession(session)}
            />
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedSession && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSession(null)}
              className="fixed inset-0 bg-slate-900/20 z-40"
            />
            <SessionDetailPanel
              session={selectedSession}
              onClose={() => setSelectedSession(null)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
