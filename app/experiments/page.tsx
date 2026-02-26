'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { experiments, Experiment } from '@/lib/mock-data/experiments';
import { FlaskConical, Plus, CheckCircle2, Clock, AlertCircle, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  running: { label: 'Running', color: 'bg-blue-100 text-blue-700', icon: Clock },
  significant: { label: 'Significant', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  inconclusive: { label: 'Inconclusive', color: 'bg-slate-100 text-slate-600', icon: AlertCircle },
  draft: { label: 'Draft', color: 'bg-amber-100 text-amber-700', icon: FileText },
};

function ExperimentDetail({ experiment }: { experiment: Experiment }) {
  const controlValue = 59;
  const variantValue = experiment.currentLift ? controlValue * (1 + experiment.currentLift / 100) : controlValue;

  const chartData = [
    { name: 'Control', value: controlValue, fill: '#94a3b8' },
    { name: 'Variant', value: Math.round(variantValue), fill: '#6366f1' },
  ];

  const status = statusConfig[experiment.status];
  const StatusIcon = status.icon;

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-3">
          <span className={cn('flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full', status.color)}>
            <StatusIcon className="w-3.5 h-3.5" />
            {status.label}
          </span>
          <span className="text-xs text-slate-400 mt-1">Created by {experiment.createdBy}</span>
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-1">{experiment.name}</h2>
        <p className="text-xs text-slate-500">
          Started {experiment.startDate}
          {experiment.endDate && ` · Ended ${experiment.endDate}`}
        </p>
      </div>

      {/* Hypothesis */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-5">
        <p className="text-xs font-semibold text-indigo-600 mb-1 uppercase tracking-wide">Hypothesis</p>
        <p className="text-sm text-slate-700">{experiment.hypothesis}</p>
      </div>

      {/* Control vs Variant */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-500 mb-1.5">Control</p>
          <p className="text-sm text-slate-700">{experiment.control}</p>
          {experiment.sampleSize.control > 0 && (
            <p className="text-xs text-slate-400 mt-2">{experiment.sampleSize.control.toLocaleString()} users</p>
          )}
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-indigo-600 mb-1.5">Variant</p>
          <p className="text-sm text-slate-700">{experiment.variant}</p>
          {experiment.sampleSize.variant > 0 && (
            <p className="text-xs text-slate-400 mt-2">{experiment.sampleSize.variant.toLocaleString()} users</p>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">Primary Metric</p>
          <p className="text-xs font-mono font-semibold text-slate-700">{experiment.primaryMetric}</p>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">Target Lift</p>
          <p className="text-lg font-bold text-slate-900">+{experiment.targetLift}%</p>
        </div>
        {experiment.currentLift !== undefined && (
          <div className={cn('border rounded-xl p-4', experiment.currentLift >= experiment.targetLift ? 'bg-green-50 border-green-200' : 'bg-white border-zinc-200')}>
            <p className="text-xs text-slate-500 mb-1">Current Lift</p>
            <p className={cn('text-lg font-bold', experiment.currentLift >= experiment.targetLift ? 'text-green-700' : 'text-slate-900')}>
              +{experiment.currentLift}%
            </p>
          </div>
        )}
      </div>

      {/* Confidence bar */}
      {experiment.confidence !== undefined && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-medium text-slate-600">Statistical Confidence</p>
            <p className={cn('text-xs font-bold', experiment.confidence >= 95 ? 'text-green-700' : experiment.confidence >= 80 ? 'text-amber-700' : 'text-slate-500')}>
              {experiment.confidence}%
            </p>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${experiment.confidence}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={cn('h-full rounded-full', experiment.confidence >= 95 ? 'bg-green-500' : experiment.confidence >= 80 ? 'bg-amber-400' : 'bg-blue-400')}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {experiment.confidence >= 95 ? 'Statistically significant — ready to ship' :
             experiment.confidence >= 80 ? 'Getting close — continue running' :
             'Not yet significant — more data needed'}
          </p>
        </div>
      )}

      {/* Chart */}
      {experiment.currentLift !== undefined && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-600 mb-3">Metric Comparison</p>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={40}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#cbd5e1' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ fontSize: '11px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  formatter={(v: number | undefined) => [`${v ?? 0}%`, 'Completion Rate']}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Draft scaffold */}
      {experiment.status === 'draft' && (
        <div className="bg-slate-950 rounded-xl p-4 mb-4">
          <p className="text-xs text-slate-400 font-mono mb-2">{'// Agent-scaffolded experiment brief'}</p>
          <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap leading-relaxed">
{`experiment_id: ${experiment.id}
name: "${experiment.name}"
status: draft

hypothesis: >
  ${experiment.hypothesis}

control:
  description: "${experiment.control}"
  sample_target: 3200

variant:
  description: "${experiment.variant}"
  sample_target: 3200

metrics:
  primary: ${experiment.primaryMetric}
  target_lift: +${experiment.targetLift}%
  secondary:
    - profile_completed_later_rate
    - d7_retention
    - time_to_first_action
  guardrail:
    - signup_to_active_rate (must not decrease)

duration_estimate: 14 days
confidence_target: 95%
created_by: "${experiment.createdBy}"`}
          </pre>
        </div>
      )}

      {/* Significant experiment readout */}
      {experiment.status === 'significant' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-green-700 mb-2">AI Readout — Ready to Ship</p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The SMS alternative verification variant beat the control by <strong>+{experiment.currentLift}%</strong> on {experiment.primaryMetric} at <strong>{experiment.confidence}% confidence</strong> — well above the 95% threshold.
            The experiment ran for 27 days with {(experiment.sampleSize.control + experiment.sampleSize.variant).toLocaleString()} total users.
            Shipping the variant is recommended. Roll out to 100% and monitor step-2 completion daily for the next 14 days.
          </p>
        </div>
      )}
    </div>
  );
}

function NewExperimentModal({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">New Experiment</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Describe what you want to test
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. I want to test whether reducing the number of onboarding steps increases completion rate..."
                className="w-full h-28 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-40 transition-colors flex items-center gap-2"
                >
                  <FlaskConical className="w-4 h-4" />
                  Scaffold Experiment
                </button>
              </div>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <p className="text-sm text-green-700 font-medium">Experiment scaffolded by Agent</p>
              </div>
              <div className="bg-slate-950 rounded-xl p-4">
                <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap leading-relaxed">
{`// Agent analyzed your request and pulled context from Amplitude
// Highest drop-off step: Onboarding Step 3 (41% drop)
// Historical experiment: Feb test reduced fields 9→7, lifted +12%

experiment_id: exp-new-${Date.now().toString().slice(-4)}
name: "Onboarding Step 3 — Reduced Fields v2"
status: draft

hypothesis: >
  Reducing mandatory profile fields from 7 to 3 (name, role, company)
  and deferring the rest to an in-app prompt will increase step 3
  completion from 59% by at least +15%.

primary_metric: onboarding_step3_completed
target_lift: +15%
secondary_metrics:
  - profile_completed_later_rate
  - d7_retention
  - time_to_first_action
guardrail:
  - overall_signup_to_active_rate (must not drop)

sample_size_required: ~3,200 per variant
duration_estimate: 14 days
confidence_target: 95%

context:
  prior_test: "Feb 2023 — reduced 9→7 fields, +12% lift"
  current_drop: "41% at step 3 — highest in funnel"
  recommendation: "Go further than Feb. 3 fields max."`}
                </pre>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">
                  Close
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                  Save to Experiments
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function ExperimentsPage() {
  const [selected, setSelected] = useState(experiments[0]);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Left sidebar */}
        <div className="w-72 border-r border-slate-200 bg-white flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h1 className="font-semibold text-slate-900 text-sm">Experiments</h1>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {experiments.map((exp) => {
              const statusCfg = statusConfig[exp.status];
              const StatusIcon = statusCfg.icon;
              const isSelected = selected.id === exp.id;
              return (
                <button
                  key={exp.id}
                  onClick={() => setSelected(exp)}
                  className={cn(
                    'w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors',
                    isSelected && 'bg-indigo-50 border-l-2 border-l-indigo-500'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={cn('flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full', statusCfg.color)}>
                      <StatusIcon className="w-3 h-3" />
                      {statusCfg.label}
                    </span>
                  </div>
                  <p className={cn('text-xs font-medium leading-snug', isSelected ? 'text-indigo-700' : 'text-slate-700')}>
                    {exp.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">{exp.primaryMetric}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{exp.startDate}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right detail panel */}
        <div className="flex-1 bg-slate-50 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="h-full"
            >
              <ExperimentDetail experiment={selected} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showModal && <NewExperimentModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  );
}
