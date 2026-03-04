"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAgentStore } from "@/lib/store";
import ToolLogo, { Tool } from "./ToolLogo";
import { CheckCircle2, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function AgentWorkflowPanel() {
  const { activeScript, stepStatuses, isRunning, isComplete, elapsedTime } =
    useAgentStore();
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (id: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!activeScript && !isRunning) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-8 bg-slate-50/50">
        <div className="w-16 h-16 rounded-3xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 border border-slate-100 rotate-12 rotate-[-6deg]">
          <Sparkles className="w-8 h-8 text-indigo-500 animate-pulse" />
        </div>
        <h3 className="text-slate-900 font-bold text-lg mb-2 tracking-tight">
          Search Flow
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed max-w-[240px]">
          Start a conversation to see the real-time visual trace of the
          AI&apos;s data exploration.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 tracking-tight">
            Search Flow
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {isRunning ? "Analyzing data connectors..." : "Analysis complete"}
          </p>
        </div>
        {isComplete && (
          <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
            {elapsedTime}s
          </div>
        )}
      </div>

      {/* Visual Flow Area */}
      <div className="flex-1 overflow-y-auto px-5 py-6 relative">
        {/* The connector line */}
        <div className="absolute left-[43px] top-8 bottom-20 w-0.5 bg-slate-200 rounded-full" />

        <div className="space-y-8 relative">
          <AnimatePresence>
            {activeScript?.steps.map((step, index) => {
              const status =
                stepStatuses.find((s) => s.stepId === step.id)?.status ||
                "pending";
              const isExpanded = expandedSteps.has(step.id);

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 group"
                >
                  {/* Node Icon */}
                  <div className="relative z-10">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm border-2",
                        status === "done"
                          ? "bg-white border-green-500 shadow-green-100 scale-105"
                          : status === "running"
                            ? "bg-white border-indigo-500 animate-pulse"
                            : "bg-slate-100 border-slate-200",
                      )}
                    >
                      <ToolLogo tool={step.tool} size="sm" />
                    </div>
                    {status === "running" && (
                      <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 animate-ping scale-150 opacity-30" />
                    )}
                    {status === "done" && (
                      <div className="absolute -right-1 -bottom-1 bg-green-500 rounded-full p-0.5 border-2 border-white shadow-sm">
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Node Content */}
                  <div
                    onClick={() => status === "done" && toggleStep(step.id)}
                    className={cn(
                      "flex-1 p-3 rounded-xl transition-all cursor-pointer border",
                      status === "done"
                        ? "bg-white border-slate-200/60 shadow-md shadow-slate-200/40 hover:border-slate-300"
                        : status === "running"
                          ? "bg-indigo-50/50 border-indigo-100 shadow-lg shadow-indigo-500/5"
                          : "bg-white/50 border-slate-100 opacity-60",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p
                          className={cn(
                            "text-[11px] font-bold font-mono tracking-tight leading-relaxed",
                            status === "done"
                              ? "text-slate-900"
                              : status === "running"
                                ? "text-indigo-700"
                                : "text-slate-400",
                          )}
                        >
                          {step.action}
                        </p>
                        {status === "done" && (
                          <div className="flex items-center gap-2">
                            <span className="w-1 h-3 bg-green-500 rounded-full" />
                            <p className="text-xs text-slate-500 font-medium tracking-tight truncate max-w-[180px]">
                              {step.result}
                            </p>
                          </div>
                        )}
                      </div>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-transform flex-shrink-0",
                          isExpanded && "rotate-180 text-indigo-500",
                        )}
                      />
                    </div>

                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="mt-3 pt-3 border-t border-slate-100"
                      >
                        <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <span>Diagnostic Data</span>
                            <span>{(step.durationMs / 1000).toFixed(2)}s</span>
                          </div>
                          <pre className="text-[10px] text-slate-600 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {JSON.stringify(
                              {
                                tool: step.tool.toUpperCase(),
                                status: "SUCCESS",
                                latency: step.durationMs,
                                message: step.result,
                              },
                              null,
                              2,
                            )}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* End cap */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4 pl-0.5"
            >
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white ring-8 ring-white shadow-xl">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-lg shadow-slate-900/10">
                Synthesis Engine Locked
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-5 bg-white border-t border-slate-200/60">
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4 border border-slate-100">
          <div className="flex -space-x-2">
            {["amplitude", "github", "sentry"].map((tool) => (
              <div
                key={tool}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1 shadow-sm"
              >
                <ToolLogo tool={tool as Tool} size="sm" />
              </div>
            ))}
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-slate-900">
              Multi-connector Sync
            </p>
            <p className="text-[10px] text-slate-500">
              Cross-referencing telemetry data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
