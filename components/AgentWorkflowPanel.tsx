'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAgentStore } from '@/lib/store';
import ToolLogo from './ToolLogo';
import { CheckCircle2, Circle, Loader2, XCircle, Sparkles, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function AgentWorkflowPanel() {
  const { activeScript, stepStatuses, isRunning, isLiveMode, isComplete, elapsedTime } = useAgentStore();
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [showFullTrace, setShowFullTrace] = useState(false);

  const toggleStep = (id: string) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  if (!activeScript && !isRunning) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-8">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6 text-indigo-500" />
        </div>
        <h3 className="text-slate-700 font-medium mb-1">Agent Trace</h3>
        <p className="text-slate-400 text-sm">Submit a query to see the AI agent work through your data sources in real time.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-800">Agent Trace</h3>
          {isLiveMode && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              Live AI
            </span>
          )}
          {isRunning && !isLiveMode && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Running...
            </span>
          )}
          {isComplete && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
              <CheckCircle2 className="w-3 h-3" />
              Complete · {elapsedTime}s
            </span>
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        <AnimatePresence>
          {activeScript?.steps.map((step, index) => {
            const status = stepStatuses.find(s => s.stepId === step.id)?.status || 'pending';
            const isExpanded = expandedSteps.has(step.id);

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                className={cn(
                  'rounded-lg border transition-all',
                  status === 'done' ? 'border-green-100 bg-green-50/30' :
                  status === 'running' ? 'border-indigo-100 bg-indigo-50/30' :
                  'border-slate-100 bg-white'
                )}
              >
                <div
                  className="flex items-start gap-3 p-3 cursor-pointer"
                  onClick={() => status === 'done' && toggleStep(step.id)}
                >
                  {/* Status icon */}
                  <div className="mt-0.5 flex-shrink-0">
                    {status === 'pending' && <Circle className="w-4 h-4 text-slate-300" />}
                    {status === 'running' && <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />}
                    {status === 'done' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {status === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                  </div>

                  {/* Tool logo */}
                  <ToolLogo tool={step.tool} size="sm" />

                  {/* Action text */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-xs font-mono leading-relaxed',
                      status === 'done' ? 'text-slate-600' :
                      status === 'running' ? 'text-indigo-700' :
                      'text-slate-400'
                    )}>
                      {step.action}
                    </p>
                    {status === 'done' && (
                      <p className="text-xs text-green-700 mt-0.5 font-medium">↳ {step.result}</p>
                    )}
                  </div>

                  {/* Expand toggle */}
                  {status === 'done' && (
                    <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform', isExpanded && 'rotate-180')} />
                  )}
                </div>

                {/* Expanded data */}
                {isExpanded && status === 'done' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-3 pb-3 border-t border-slate-100"
                  >
                    <pre className="mt-2 text-xs text-slate-500 font-mono bg-slate-50 rounded p-2 overflow-x-auto whitespace-pre-wrap">
{`// Tool: ${step.tool}
// Action: ${step.action}
// Result: ${step.result}
// Duration: ${(step.durationMs / 1000).toFixed(2)}s`}
                    </pre>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Synthesis step */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-100"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-xs text-indigo-700 font-medium">Synthesis complete — response generated</span>
          </motion.div>
        )}
      </div>

      {/* Full trace expand */}
      {isComplete && (
        <div className="px-6 py-3 border-t border-slate-100">
          <button
            onClick={() => setShowFullTrace(!showFullTrace)}
            className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors"
          >
            <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showFullTrace && 'rotate-180')} />
            {showFullTrace ? 'Hide' : 'View'} full trace
          </button>
          {showFullTrace && (
            <div className="mt-2 p-3 bg-slate-950 rounded-lg overflow-y-auto max-h-48">
              <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
{activeScript?.steps.map(s =>
  `[${s.tool.toUpperCase()}] ${s.action}\n  → ${s.result}\n  → Duration: ${(s.durationMs/1000).toFixed(2)}s\n`
).join('\n')}
{`\n[AGENT] Total elapsed: ${elapsedTime}s\n[AGENT] Response generated from ${activeScript?.steps.length} tool calls`}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
