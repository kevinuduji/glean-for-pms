'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { experiments, Experiment } from '@/lib/mock-data/experiments';
import { FlaskConical, Plus, CheckCircle2, Clock, AlertCircle, FileText, X, Loader2, Sparkles, Play, Square, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  running: { label: 'Running', color: 'bg-blue-100 text-blue-700', icon: Clock },
  significant: { label: 'Significant', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  inconclusive: { label: 'Inconclusive', color: 'bg-slate-100 text-slate-600', icon: AlertCircle },
  draft: { label: 'Draft', color: 'bg-amber-100 text-amber-700', icon: FileText },
};

function ExperimentDetail({
  experiment,
  onUpdate,
}: {
  experiment: Experiment;
  onUpdate: (id: string, update: Partial<Experiment>) => void;
}) {
  const [agentAnalysis, setAgentAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [shipped, setShipped] = useState(false);

  // Reset analysis when switching experiments
  useEffect(() => {
    setAgentAnalysis('');
    setIsAnalyzing(false);
    setShipped(false);
  }, [experiment.id]);

  const controlValue = 59;
  const variantValue = experiment.currentLift ? controlValue * (1 + experiment.currentLift / 100) : controlValue;
  const chartData = [
    { name: 'Control', value: controlValue, fill: '#94a3b8' },
    { name: 'Variant', value: Math.round(variantValue), fill: '#6366f1' },
  ];

  const status = statusConfig[experiment.status];
  const StatusIcon = status.icon;

  const agentQueries: Record<string, string> = {
    draft: `I'm about to launch this A/B experiment: "${experiment.name}". Hypothesis: ${experiment.hypothesis}. Control: ${experiment.control}. Variant: ${experiment.variant}. Primary metric: ${experiment.primaryMetric}, target lift: +${experiment.targetLift}%. What risks should I watch for and how long should I run it?`,
    running: `This A/B test is live: "${experiment.name}". Current lift: +${experiment.currentLift ?? 0}% on ${experiment.primaryMetric} at ${experiment.confidence ?? 0}% confidence. Sample: ${(experiment.sampleSize.control + experiment.sampleSize.variant).toLocaleString()} users. Target: +${experiment.targetLift}% at 95% confidence. Should I keep running, stop early, or ship?`,
    significant: `This experiment reached significance: "${experiment.name}". Variant beat control by +${experiment.currentLift}% on ${experiment.primaryMetric} at ${experiment.confidence}% confidence. ${(experiment.sampleSize.control + experiment.sampleSize.variant).toLocaleString()} total users. Should I ship? What should I monitor post-launch?`,
    inconclusive: `This experiment was inconclusive: "${experiment.name}". Hypothesis: ${experiment.hypothesis}. What likely caused it to be inconclusive? Should I retry with a larger sample, adjust the hypothesis, or abandon it?`,
  };

  const handleAskAgent = async () => {
    setIsAnalyzing(true);
    setAgentAnalysis('');
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: agentQueries[experiment.status] }),
      });
      const data = await res.json();
      setAgentAnalysis(data.response ?? 'No response generated.');
    } catch {
      setAgentAnalysis('Failed to load analysis. Check your API key.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLaunch = () => {
    onUpdate(experiment.id, {
      status: 'running',
      startDate: new Date().toISOString().slice(0, 10),
      sampleSize: { control: 124, variant: 131 },
      confidence: 12,
      currentLift: 2.1,
    });
  };

  return (
    <div className="h-full p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-5">
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

      {/* Action buttons */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {experiment.status === 'draft' && (
          <button
            onClick={handleLaunch}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            Launch Experiment
          </button>
        )}
        {experiment.status === 'running' && (
          <button
            onClick={() => onUpdate(experiment.id, { status: 'inconclusive' })}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Square className="w-3.5 h-3.5" />
            Stop Test
          </button>
        )}
        {experiment.status === 'significant' && !shipped && (
          <button
            onClick={() => setShipped(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            <Rocket className="w-3.5 h-3.5" />
            Roll Out to 100%
          </button>
        )}
        {shipped && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Shipped — monitoring active
          </span>
        )}
        <button
          onClick={handleAskAgent}
          disabled={isAnalyzing}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-indigo-200 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50"
        >
          {isAnalyzing
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Sparkles className="w-3.5 h-3.5" />}
          {isAnalyzing ? 'Analyzing...' : 'Ask Agent'}
        </button>
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
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-green-700 mb-2">AI Readout — Ready to Ship</p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The SMS alternative verification variant beat the control by <strong>+{experiment.currentLift}%</strong> on {experiment.primaryMetric} at <strong>{experiment.confidence}% confidence</strong> — well above the 95% threshold.
            The experiment ran for 27 days with {(experiment.sampleSize.control + experiment.sampleSize.variant).toLocaleString()} total users.
            Shipping the variant is recommended. Roll out to 100% and monitor step-2 completion daily for the next 14 days.
          </p>
        </div>
      )}

      {/* Agent analysis panel */}
      <AnimatePresence>
        {(isAnalyzing || agentAnalysis) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="border border-indigo-100 bg-indigo-50 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              {isAnalyzing
                ? <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                : <Sparkles className="w-3.5 h-3.5 text-indigo-500" />}
              <p className="text-xs font-semibold text-indigo-700">
                {isAnalyzing ? 'Agent is analyzing...' : 'Agent Analysis'}
              </p>
            </div>
            {isAnalyzing ? (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{agentAnalysis}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const LOADING_STEPS = [
  { label: 'Querying Amplitude — pulling funnel drop-off data', delay: 0 },
  { label: 'Checking historical experiments for prior lift signals', delay: 900 },
  { label: 'Reading GitHub — current implementation context', delay: 1700 },
  { label: 'Scaffolding experiment brief from connected data...', delay: 2500 },
];

function parseExperimentFromYaml(yaml: string, userInput: string): Experiment {
  const getField = (key: string): string => {
    const m = yaml.match(new RegExp(`^${key}:\\s*["']?([^\\n"']+)["']?`, 'mi'));
    return m?.[1]?.trim() ?? '';
  };
  const getMultiline = (key: string): string => {
    const m = yaml.match(new RegExp(`^${key}:\\s*>\\s*\\n([\\s\\S]*?)(?=\\n[a-z_]+:|$)`, 'mi'));
    if (m) return m[1].replace(/\n\s+/g, ' ').trim();
    return getField(key);
  };
  const getLift = (key: string): number => {
    const raw = getField(key);
    const num = parseFloat(raw.replace(/[^0-9.-]/g, ''));
    return isNaN(num) ? 10 : num;
  };
  return {
    id: `exp-${Date.now().toString().slice(-6)}`,
    name: getField('name') || userInput.slice(0, 60),
    status: 'draft',
    hypothesis: getMultiline('hypothesis') || userInput,
    control: getField('control') || 'Current implementation',
    variant: getField('variant') || 'Proposed change',
    primaryMetric: getField('primary_metric') || 'conversion_rate',
    targetLift: getLift('target_lift'),
    startDate: new Date().toISOString().slice(0, 10),
    sampleSize: { control: 0, variant: 0 },
    createdBy: 'Kevin (Agent-assisted)',
  };
}

function NewExperimentModal({ onClose, onSave }: { onClose: () => void; onSave: (exp: Experiment) => void }) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [agentResponse, setAgentResponse] = useState('');
  const [visibleSteps, setVisibleSteps] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setStatus('loading');
    setVisibleSteps(0);

    // Animate loading steps while API call runs in parallel
    LOADING_STEPS.forEach((step, i) => {
      setTimeout(() => setVisibleSteps(i + 1), step.delay);
    });

    const query = `Scaffold an experiment brief in YAML format for the following idea: "${input.trim()}".

Use the connected product data to inform the hypothesis, baseline metrics, and expected lift. Output ONLY valid YAML with these exact fields:
experiment_id, name, status (set to "draft"), hypothesis, control, variant, primary_metric, target_lift, secondary_metrics (list), guardrail (list), sample_size_required, duration_estimate, confidence_target, context (with prior_test, current_data, recommendation).

Be specific — reference real numbers from the connected data where relevant.`;

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      setAgentResponse(data.response ?? '');
      setStatus('done');
    } catch {
      setStatus('error');
    }
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
          {status === 'idle' && (
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
          )}

          {status === 'loading' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-2">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <p className="text-sm font-medium text-slate-700">Agent is scaffolding your experiment...</p>
              </div>
              <div className="space-y-2.5">
                {LOADING_STEPS.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: i < visibleSteps ? 1 : 0.25, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2.5"
                  >
                    {i < visibleSteps - 1 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    ) : i === visibleSteps - 1 ? (
                      <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-200 flex-shrink-0" />
                    )}
                    <span className={cn(
                      'text-xs font-mono',
                      i < visibleSteps ? 'text-slate-600' : 'text-slate-300'
                    )}>
                      {step.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {status === 'done' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <p className="text-sm text-green-700 font-medium">Experiment scaffolded by Agent</p>
              </div>
              <div className="bg-slate-950 rounded-xl p-4 max-h-72 overflow-y-auto">
                <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap leading-relaxed">
                  {agentResponse}
                </pre>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">
                  Close
                </button>
                <button
                  onClick={() => { onSave(parseExperimentFromYaml(agentResponse, input)); onClose(); }}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save to Experiments
                </button>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
              <p className="text-sm text-red-600 mb-4">Something went wrong. Check that your API key is configured.</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setStatus('idle')}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg transition-colors"
                >
                  Try Again
                </button>
                <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">
                  Close
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
  const [experimentList, setExperimentList] = useState([...experiments]);
  const [selected, setSelected] = useState(experiments[0]);
  const [showModal, setShowModal] = useState(false);

  const handleSave = (exp: Experiment) => {
    setExperimentList(prev => [exp, ...prev]);
    setSelected(exp);
  };

  const handleUpdate = (id: string, update: Partial<Experiment>) => {
    setExperimentList(prev => prev.map(e => e.id === id ? { ...e, ...update } : e));
    setSelected(prev => prev.id === id ? { ...prev, ...update } : prev);
  };

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
            {experimentList.map((exp) => {
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
              <ExperimentDetail experiment={selected} onUpdate={handleUpdate} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showModal && <NewExperimentModal onClose={() => setShowModal(false)} onSave={handleSave} />}
      </AnimatePresence>
    </>
  );
}
