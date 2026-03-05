"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  RotateCcw,
  Globe,
  Shield,
  Zap,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { useAgentStore } from "@/lib/store";
import QuickQueryPills from "@/components/QuickQueryPills";
import AgentWorkflowPanel from "@/components/AgentWorkflowPanel";
import { cn } from "@/lib/utils";

import ConnectorsSidebar from "@/components/ConnectorsSidebar";

function AgentPageInner() {
  const searchParams = useSearchParams();
  const { runScript, runLive, resetAgent, conversation, isRunning } =
    useAgentStore();
  const [inputValue, setInputValue] = useState("");
  const [webEnabled, setWebEnabled] = useState(true);
  const [searchMode, setSearchMode] = useState<"fast" | "deep">("fast");
  const [connectorsOpen, setConnectorsOpen] = useState(true);
  const [searchFlowOpen, setSearchFlowOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasAutoRun = useRef(false);

  useEffect(() => {
    const scriptParam = searchParams.get("script");
    if (scriptParam && !hasAutoRun.current) {
      hasAutoRun.current = true;
      setTimeout(() => {
        runScript(scriptParam);
      }, 200);
    }
  }, [searchParams, runScript]);

  // Dashboard query handoff: when a query was set on the dashboard and we land here fresh
  useEffect(() => {
    const storeQuery = useAgentStore.getState().query;
    if (
      storeQuery &&
      conversation.length === 0 &&
      !hasAutoRun.current &&
      !searchParams.get("script")
    ) {
      hasAutoRun.current = true;
      setTimeout(() => {
        runLive(storeQuery);
      }, 200);
    }
  }, [conversation.length, runLive, searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = inputValue.trim();
    if (!text || isRunning) return;
    setInputValue("");
    runLive(text);
  };

  const handlePillClick = (scriptId: string, queryText: string) => {
    runScript(scriptId, queryText);
  };

  const formatResponse = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      // Bold text
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const formatted = parts.map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={j} className="font-semibold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        // Inline code
        const codeParts = part.split(/(`[^`]+`)/g);
        return codeParts.map((cp, k) => {
          if (cp.startsWith("`") && cp.endsWith("`")) {
            return (
              <code
                key={k}
                className="font-mono text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded text-xs"
              >
                {cp.slice(1, -1)}
              </code>
            );
          }
          return cp;
        });
      });
      return (
        <p
          key={i}
          className={cn(
            "text-sm text-slate-700 leading-normal",
            i > 0 && line === "" ? "mt-2" : "",
          )}
        >
          {formatted}
        </p>
      );
    });
  };

  return (
    <div className="flex h-full overflow-hidden bg-white">
      {/* Left panel: Connectors */}
      <div className={cn(
        "flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
        connectorsOpen ? "w-[280px]" : "w-0"
      )}>
        <ConnectorsSidebar />
      </div>

      {/* Middle panel: Chat */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setConnectorsOpen(!connectorsOpen)}
              className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
              title={connectorsOpen ? "Hide connectors" : "Show connectors"}
            >
              {connectorsOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeftOpen className="w-4 h-4" />
              )}
            </button>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Probe Agent
              </h1>
              <p className="text-xs text-slate-500">
                Your AI assistant for product insights and experimentation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {conversation.length > 0 && (
              <button
                onClick={() => resetAgent()}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
            <button
              onClick={() => setSearchFlowOpen(!searchFlowOpen)}
              className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
              title={searchFlowOpen ? "Hide search flow" : "Show search flow"}
            >
              {searchFlowOpen ? (
                <PanelRightClose className="w-4 h-4" />
              ) : (
                <PanelRightOpen className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-12">
          {conversation.length === 0 && (
            <div className="max-w-2xl mx-auto space-y-8 mt-12">
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                  How can I help you today?
                </h2>
                <p className="text-slate-500 text-lg max-w-lg mx-auto leading-relaxed font-medium">
                  I can help you analyze your product data, design experiments, investigate user behavior, and make data-driven decisions.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                  Suggested queries
                </p>
                <QuickQueryPills layout="wrap" onPillClick={handlePillClick} />
              </div>

              {/* Quick action cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Investigate Issues</h3>
                  <p className="text-xs text-slate-600">
                    Ask me to analyze user sessions, conversion funnels, or performance issues
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mb-3">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Design Experiments</h3>
                  <p className="text-xs text-slate-600">
                    Get help creating A/B tests, defining hypotheses, and measuring success
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mb-3">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Get Insights</h3>
                  <p className="text-xs text-slate-600">
                    Discover patterns in your data and get recommendations for improvements
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-3xl mx-auto space-y-12">
            <AnimatePresence>
              {conversation.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-7 h-7 rounded-sm flex items-center justify-center text-xs font-bold shadow-sm",
                        msg.role === "user"
                          ? "bg-slate-200 text-slate-700"
                          : "bg-indigo-600 text-white",
                      )}
                    >
                      {msg.role === "user" ? (
                        "U"
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {msg.role === "user" ? "You" : "Probe Agent"}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "text-lg leading-relaxed",
                      msg.role === "user"
                        ? "font-bold text-slate-800"
                        : "font-normal text-slate-600",
                    )}
                  >
                    {msg.role === "user" ? (
                      msg.content
                    ) : (
                      <div className="space-y-4 bg-white/50 border border-slate-100/50 p-6 rounded-3xl -ml-6 w-[calc(100%+3rem)]">
                        {formatResponse(msg.content)}
                      </div>
                    )}
                  </div>

                  {msg.role === "agent" && (
                    <div className="flex items-center gap-4 pt-2">
                      <button className="text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-colors">
                        Save to note
                      </button>
                      <button className="text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-colors">
                        Share
                      </button>
                      <div className="flex items-center gap-2 ml-auto">
                        <button className="p-1 px-2 rounded-md hover:bg-slate-100 transition-colors">
                          <span className="text-xs grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
                            👍
                          </span>
                        </button>
                        <button className="p-1 px-2 rounded-md hover:bg-slate-100 transition-colors">
                          <span className="text-xs grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
                            👎
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isRunning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 pt-4"
              >
                <div className="w-7 h-7 rounded-sm bg-indigo-600 flex items-center justify-center text-white shadow-md animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1.5 px-4 py-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </motion.div>
            )}
          </div>

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-8 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Agent Options */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center bg-slate-100/50 p-1 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50">
                <button
                  type="button"
                  onClick={() => setWebEnabled(true)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all",
                    webEnabled
                      ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50"
                      : "text-slate-400 hover:text-slate-600",
                  )}
                >
                  <Globe className="w-3.5 h-3.5" />
                  Web
                </button>
                <button
                  type="button"
                  onClick={() => setWebEnabled(false)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all",
                    !webEnabled
                      ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50"
                      : "text-slate-400 hover:text-slate-600",
                  )}
                >
                  <Shield className="w-3.5 h-3.5" />
                  No Web
                </button>
              </div>

              <div className="flex items-center bg-slate-100/50 p-1 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50">
                <button
                  type="button"
                  onClick={() => setSearchMode("fast")}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all",
                    searchMode === "fast"
                      ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50"
                      : "text-slate-400 hover:text-slate-600",
                  )}
                >
                  <Zap className="w-3.5 h-3.5" />
                  Fast Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchMode("deep")}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all",
                    searchMode === "deep"
                      ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50"
                      : "text-slate-400 hover:text-slate-600",
                  )}
                >
                  <Search className="w-3.5 h-3.5" />
                  Deep Search
                </button>
              </div>
            </div>

            <div className="relative group">
              <form
                onSubmit={handleSubmit}
                className="relative z-10 transition-all duration-300 transform group-focus-within:translate-y-[-2px]"
              >
                <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                <div className="relative bg-white border border-slate-200 rounded-3xl shadow-lg shadow-slate-200/50 group-focus-within:shadow-indigo-500/10 group-focus-within:border-indigo-500 transition-all overflow-hidden flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything about your product, users, or experiments..."
                    disabled={isRunning}
                    className="flex-1 pl-6 pr-4 py-5 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-base font-medium disabled:opacity-50"
                  />
                  <div className="flex items-center gap-2 pr-4">
                    <div className="text-[10px] font-bold text-slate-400 px-2 py-1 bg-slate-100 rounded-md">
                      {conversation.length === 0
                        ? "Default"
                        : `${conversation.length} msgs`}
                    </div>
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isRunning}
                      className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                    >
                      <Send className="w-5 h-5 translate-x-0.5 -translate-y-0.5" />
                    </button>
                  </div>
                </div>
              </form>
              <p className="text-[11px] text-slate-400 text-center mt-4 font-semibold tracking-wide uppercase">
                Probe can be inaccurate; please double check its responses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel: Search Flow (Visual) */}
      <div className={cn(
        "bg-slate-50 border-l border-slate-200 overflow-hidden transition-all duration-300 ease-in-out flex-shrink-0",
        searchFlowOpen ? "w-[380px]" : "w-0 border-l-0"
      )}>
        <AgentWorkflowPanel />
      </div>
    </div>
  );
}

export default function AgentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="text-slate-400">Loading...</div>
        </div>
      }
    >
      <AgentPageInner />
    </Suspense>
  );
}