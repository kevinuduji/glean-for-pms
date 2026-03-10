"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Search, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ToolLogo, { Tool } from "./ToolLogo";

export interface AgentStep {
  id: string;
  tool: string;
  action: string;
  result: string;
  durationMs: number;
}

export interface RunningStep {
  stepId: string;
  status: "pending" | "running" | "done" | "error";
}

interface InlineAgentWorkflowProps {
  steps: AgentStep[];
  stepStatuses?: RunningStep[];
  isComplete: boolean;
  query?: string;
}

export default function InlineAgentWorkflow({
  steps,
  stepStatuses,
  isComplete,
  query,
}: InlineAgentWorkflowProps) {
  // Start expanded if not complete, otherwise start collapsed
  const [isExpanded, setIsExpanded] = useState(!isComplete);

  useEffect(() => {
    if (isComplete) {
      // Small timeout to allow users to see it hit 'done' before collapsing
      const timer = setTimeout(() => setIsExpanded(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  const getStatus = (stepId: string) => {
    if (!stepStatuses) return "done";
    const s = stepStatuses.find((s) => s.stepId === stepId);
    return s ? s.status : "pending";
  };

  const doneCount = steps.filter((s) => getStatus(s.id) === "done").length;

  return (
    <div className="w-full flex justify-center mb-6">
      <div className="w-full max-w-3xl">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
            !isComplete
              ? "bg-indigo-50 text-indigo-700 border-indigo-100"
              : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200",
          )}
        >
          {isComplete ? (
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Reviewed {steps.length} sources
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              Analyzing {steps.length} sources
            </div>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 ml-1 opacity-60" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-1 opacity-60" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pl-4 relative border-l-2 border-slate-100 ml-4 py-2 space-y-6">
                {/* Searching Segment */}
                {query && (
                  <div className="relative">
                    <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                    <div className="text-sm font-semibold text-slate-700 mb-2">
                      Searching
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-sm text-slate-600 shadow-sm">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      {query}
                    </div>
                  </div>
                )}

                {/* Reviewing sources segment */}
                <div className="relative">
                  <div
                    className={cn(
                      "absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white",
                      !isComplete && doneCount < steps.length
                        ? "bg-indigo-500"
                        : "bg-slate-300",
                    )}
                  />
                  <div className="text-sm font-semibold text-slate-700 mb-3">
                    Reviewing sources
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <AnimatePresence>
                      {steps.map((step) => {
                        const status = getStatus(step.id);
                        if (status === "pending" && !isComplete) return null; // Show them progressively? Or show all as pending.
                        // Let's show all, but style them differently based on status
                        return (
                          <motion.div
                            key={step.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-xl border bg-white transition-all",
                              status === "running"
                                ? "border-indigo-200 shadow-md shadow-indigo-500/5 ring-1 ring-indigo-500/10"
                                : status === "done"
                                  ? "border-slate-200 shadow-sm"
                                  : "border-slate-100 opacity-50",
                            )}
                          >
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100 overflow-hidden relative">
                              {status === "running" && (
                                <div className="absolute inset-0 bg-indigo-500/10 animate-pulse" />
                              )}
                              <ToolLogo tool={step.tool as Tool} size="sm" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] font-medium text-slate-900 truncate">
                                {step.action}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {status === "running"
                                  ? "Analyzing..."
                                  : status === "done"
                                    ? step.result
                                    : "Waiting..."}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Finished Segment */}
                {isComplete && (
                  <div className="relative">
                    <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                    <div className="text-sm font-semibold text-slate-700">
                      Finished
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
