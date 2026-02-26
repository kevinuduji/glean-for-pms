'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, RotateCcw } from 'lucide-react';
import { useAgentStore } from '@/lib/store';
import { agentScripts } from '@/lib/mock-data/agent-scripts';
import QuickQueryPills from '@/components/QuickQueryPills';
import AgentWorkflowPanel from '@/components/AgentWorkflowPanel';
import { cn } from '@/lib/utils';

function AgentPageInner() {
  const searchParams = useSearchParams();
  const { runScript, resetAgent, conversation, isRunning } = useAgentStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasAutoRun = useRef(false);

  useEffect(() => {
    const scriptParam = searchParams.get('script');
    if (scriptParam && !hasAutoRun.current) {
      hasAutoRun.current = true;
      setTimeout(() => {
        runScript(scriptParam);
      }, 200);
    }
  }, [searchParams, runScript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = inputValue.trim();
    if (!text || isRunning) return;

    const matchedScript = agentScripts.find(s =>
      s.query.toLowerCase() === text.toLowerCase() ||
      s.query.toLowerCase().includes(text.toLowerCase()) ||
      text.toLowerCase().includes(s.query.toLowerCase().slice(0, 20))
    );

    const scriptId = matchedScript?.id || 'script-7';
    setInputValue('');
    runScript(scriptId, text);
  };

  const handlePillClick = (scriptId: string, queryText: string) => {
    runScript(scriptId, queryText);
  };

  const formatResponse = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Bold text
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const formatted = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        // Inline code
        const codeParts = part.split(/(`[^`]+`)/g);
        return codeParts.map((cp, k) => {
          if (cp.startsWith('`') && cp.endsWith('`')) {
            return <code key={k} className="font-mono text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded text-xs">{cp.slice(1, -1)}</code>;
          }
          return cp;
        });
      });
      return (
        <p key={i} className={cn('text-sm text-slate-700 leading-relaxed', i > 0 && line === '' ? 'mt-2' : '')}>
          {formatted}
        </p>
      );
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left panel: Chat */}
      <div className="w-[40%] border-r border-slate-200 flex flex-col bg-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              AI Agent
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Powered by your connected data sources</p>
          </div>
          {conversation.length > 0 && (
            <button
              onClick={resetAgent}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New
            </button>
          )}
        </div>

        {/* Suggested pills */}
        {conversation.length === 0 && (
          <div className="px-6 pt-4 pb-2">
            <QuickQueryPills layout="wrap" onPillClick={handlePillClick} />
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {conversation.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <p className="text-slate-400 text-sm">Ask anything about your product, users, or data.</p>
              <p className="text-slate-300 text-xs mt-1">The agent will query your connected tools and synthesize an answer.</p>
            </div>
          )}

          <AnimatePresence>
            {conversation.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {msg.role === 'user' ? (
                  <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-indigo-600 text-white text-sm">
                    {msg.content}
                  </div>
                ) : (
                  <div className="max-w-[95%]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                      </div>
                      <span className="text-xs font-medium text-slate-600">Agent</span>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm space-y-1">
                      {formatResponse(msg.content)}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isRunning && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-4 border-t border-slate-100 bg-slate-50">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about your product data..."
              disabled={isRunning}
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isRunning}
              className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 text-center mt-2">Queries run against Amplitude, Sentry, GitHub, Prometheus, PostHog, Mixpanel</p>
        </div>
      </div>

      {/* Right panel: Agent trace */}
      <div className="flex-1 bg-slate-50 overflow-hidden">
        <AgentWorkflowPanel />
      </div>
    </div>
  );
}

export default function AgentPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="text-slate-400">Loading...</div></div>}>
      <AgentPageInner />
    </Suspense>
  );
}
