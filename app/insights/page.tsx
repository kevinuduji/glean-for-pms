'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  ResponsiveContainer, Tooltip
} from 'recharts';
import {
  dauTimeSeries, signupFunnelNov, checkoutCompletionSeries,
  homepageConversionSeries
} from '@/lib/mock-data/amplitude';
import { validationErrorTimeSeries } from '@/lib/mock-data/sentry';
import { paymentsLatency } from '@/lib/mock-data/prometheus';
import { TrendingDown, TrendingUp, ExternalLink, AlertTriangle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type MetricCard = {
  id: string;
  title: string;
  value: string;
  delta: string;
  deltaPositive: boolean | null;
  badge?: string;
  badgeColor?: string;
  source: string;
  sourceBg: string;
  sourceColor: string;
  chartType: 'line' | 'bar' | 'area' | 'none';
  chartData: Array<Record<string, unknown>>;
  chartKey: string;
  chartColor: string;
  annotation?: string;
};

const latencyChartData = paymentsLatency.slice(40).map(p => ({
  time: new Date(p.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' }),
  p95: p.p95,
}));

const metricCards: MetricCard[] = [
  {
    id: 'dau',
    title: 'Daily Active Users',
    value: '11,847',
    delta: '+3.2% vs last week',
    deltaPositive: true,
    source: 'Amplitude',
    sourceBg: 'bg-blue-100',
    sourceColor: 'text-blue-700',
    chartType: 'line',
    chartData: dauTimeSeries.slice(-30).map(d => ({ date: d.date.slice(5), value: d.value })),
    chartKey: 'value',
    chartColor: '#6366f1',
    annotation: 'DAU is up 3.2% week-over-week, consistent with the Sept growth trend. No anomalies detected.',
  },
  {
    id: 'signup-funnel',
    title: 'Signup Funnel Completion',
    value: '22.9%',
    delta: '-15.4% vs last month',
    deltaPositive: false,
    badge: 'Drop',
    badgeColor: 'bg-red-100 text-red-700',
    source: 'Amplitude',
    sourceBg: 'bg-blue-100',
    sourceColor: 'text-blue-700',
    chartType: 'bar',
    chartData: signupFunnelNov.map(s => ({ step: s.step.replace('Landed on /', '').slice(0, 12), count: s.count })),
    chartKey: 'count',
    chartColor: '#ef4444',
    annotation: 'Step 2 (email verification) shows a 34% drop in Nov vs 8% in Oct. Root cause: commit a3f92c broke + alias email support.',
  },
  {
    id: 'checkout',
    title: 'Checkout Completion Rate',
    value: '61%',
    delta: '-17% since Dec 1',
    deltaPositive: false,
    badge: 'P0',
    badgeColor: 'bg-red-100 text-red-700',
    source: 'Amplitude',
    sourceBg: 'bg-blue-100',
    sourceColor: 'text-blue-700',
    chartType: 'area',
    chartData: checkoutCompletionSeries.map(d => ({ date: d.date.slice(5), value: d.value })),
    chartKey: 'value',
    chartColor: '#ef4444',
    annotation: 'Checkout dropped from 78% to 61% at 14:23 UTC on Dec 1 — correlates exactly with payments-service v2.4.1 deploy.',
  },
  {
    id: 'payment-latency',
    title: 'Payments P95 Latency',
    value: '8,100ms',
    delta: '+2,282% since Dec 1',
    deltaPositive: false,
    badge: 'Critical',
    badgeColor: 'bg-red-100 text-red-700',
    source: 'Prometheus',
    sourceBg: 'bg-orange-100',
    sourceColor: 'text-orange-600',
    chartType: 'line',
    chartData: latencyChartData.slice(-24),
    chartKey: 'p95',
    chartColor: '#f97316',
    annotation: 'P95 latency spiked from 340ms to 8,100ms on Dec 1. Only payments-service is affected — all other services nominal. Rollback recommended.',
  },
  {
    id: 'active-experiments',
    title: 'Active Experiments',
    value: '2 running',
    delta: '1 significant result',
    deltaPositive: true,
    source: 'Amplitude',
    sourceBg: 'bg-blue-100',
    sourceColor: 'text-blue-700',
    chartType: 'none',
    chartData: [],
    chartKey: '',
    chartColor: '',
    annotation: 'Homepage CTA sticky test (72% confidence) and Billing comparison table test (44% confidence) are both running.',
  },
  {
    id: 'validation-errors',
    title: 'ValidationErrors (Sentry)',
    value: '2,847',
    delta: '+9,400% since Nov 4',
    deltaPositive: false,
    badge: 'Spike',
    badgeColor: 'bg-red-100 text-red-700',
    source: 'Sentry',
    sourceBg: 'bg-red-100',
    sourceColor: 'text-red-700',
    chartType: 'bar',
    chartData: validationErrorTimeSeries.slice(-20).map(d => ({ date: d.date.slice(5), count: d.count })),
    chartKey: 'count',
    chartColor: '#ef4444',
    annotation: 'ValidationErrors spiked from near-zero to 85-115/day on Nov 4 after commit a3f92c modified email validation regex.',
  },
  {
    id: 'homepage-conversion',
    title: 'Homepage → Signup Conversion',
    value: '2.8%',
    delta: '-0.3% since Oct 14',
    deltaPositive: false,
    source: 'Amplitude',
    sourceBg: 'bg-blue-100',
    sourceColor: 'text-blue-700',
    chartType: 'line',
    chartData: homepageConversionSeries.slice(-30).map(d => ({ date: d.date.slice(5), value: d.value })),
    chartKey: 'value',
    chartColor: '#f59e0b',
    annotation: 'Conversion dipped slightly after the Oct 14 homepage v2 launch. Insufficient tracking events to confirm causality — pricing section has 0 events.',
  },
  {
    id: 'feature-adoption',
    title: 'Feature Adoption: Advanced Filters',
    value: '31% MAU',
    delta: '+6% vs target',
    deltaPositive: true,
    source: 'Amplitude',
    sourceBg: 'bg-blue-100',
    sourceColor: 'text-blue-700',
    chartType: 'bar',
    chartData: [
      { label: 'D30 w/ Feature', value: 67 },
      { label: 'D30 w/o Feature', value: 43 },
    ],
    chartKey: 'value',
    chartColor: '#22c55e',
    annotation: 'Advanced Filters exceeded the 25% MAU adoption target (31%). Users who engage with filters show 67% D30 retention vs 43% for non-users — a 24-point lift.',
  },
];

const filters = ['All', 'Critical', 'Amplitude', 'Sentry', 'Prometheus'];

export default function InsightsPage() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const filteredCards = metricCards.filter(card => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Critical') return card.badge === 'P0' || card.badge === 'Critical' || card.badge === 'Spike';
    return card.source === selectedFilter;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Insights</h1>
        <p className="text-slate-500 text-sm mt-1">
          Live metrics from all connected data sources. Updated every 2 minutes.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-6">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              selectedFilter === f
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-zinc-200 text-slate-600 hover:bg-slate-50'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Metric cards grid */}
      <div className="grid grid-cols-3 gap-4">
        {filteredCards.map((card, i) => {
          const isExpanded = expandedCard === card.id;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                'bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-all cursor-pointer',
                isExpanded && 'col-span-2'
              )}
              onClick={() => setExpandedCard(isExpanded ? null : card.id)}
            >
              <div className="p-5">
                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">{card.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-0.5">{card.value}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {card.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    )}
                    <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', isExpanded && 'rotate-180')} />
                  </div>
                </div>

                {/* Delta */}
                <div className="flex items-center gap-1 mb-3">
                  {card.deltaPositive === true && <TrendingUp className="w-3.5 h-3.5 text-green-500" />}
                  {card.deltaPositive === false && <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                  <span className={cn(
                    'text-xs font-medium',
                    card.deltaPositive === true ? 'text-green-600' :
                    card.deltaPositive === false ? 'text-red-600' : 'text-slate-500'
                  )}>
                    {card.delta}
                  </span>
                </div>

                {/* Chart */}
                {card.chartType !== 'none' && card.chartData.length > 0 && (
                  <div className="h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {card.chartType === 'line' ? (
                        <LineChart data={card.chartData}>
                          <Line type="monotone" dataKey={card.chartKey} stroke={card.chartColor} strokeWidth={2} dot={false} />
                          <Tooltip contentStyle={{ fontSize: '11px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                        </LineChart>
                      ) : card.chartType === 'area' ? (
                        <AreaChart data={card.chartData}>
                          <defs>
                            <linearGradient id={`grad-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={card.chartColor} stopOpacity={0.15} />
                              <stop offset="95%" stopColor={card.chartColor} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey={card.chartKey} stroke={card.chartColor} strokeWidth={2} fill={`url(#grad-${card.id})`} dot={false} />
                          <Tooltip contentStyle={{ fontSize: '11px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                        </AreaChart>
                      ) : (
                        <BarChart data={card.chartData}>
                          <Bar dataKey={card.chartKey} fill={card.chartColor} radius={[2, 2, 0, 0]} />
                          <Tooltip contentStyle={{ fontSize: '11px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                )}

                {card.chartType === 'none' && (
                  <div className="h-[120px] flex items-center justify-center bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-400">No chart available</p>
                  </div>
                )}

                {/* Expanded annotation */}
                {isExpanded && card.annotation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-slate-100"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-slate-600 leading-relaxed">{card.annotation}</p>
                    </div>
                  </motion.div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${card.sourceBg} ${card.sourceColor}`}>
                    {card.source}
                  </span>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                  >
                    Open in {card.source}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
