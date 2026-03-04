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
            "text-[13px] text-slate-700 leading-normal",
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
      <div className="xl:w-[240px] lg:w-[220px] w-[220px] flex-shrink-0">
        <ConnectorsSidebar />
      </div>

      {/* Middle panel: Chat */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <div className="xl:px-8 lg:px-6 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Chat
            </h1>
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
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto xl:px-8 lg:px-6 px-6 py-8 space-y-12">
          {conversation.length === 0 && (
            <div className="max-w-2xl mx-auto space-y-8 mt-12">
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  How can I help you today?
                </h2>
                <p className="text-slate-500 text-base max-w-md mx-auto leading-relaxed font-medium">
                  Select your data connectors on the left and ask me anything
                  about your product, users, or performance.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                  Suggested queries
                </p>
                <QuickQueryPills layout="wrap" onPillClick={handlePillClick} />
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
                      "text-base leading-relaxed",
                      msg.role === "user"
                        ? "font-bold text-slate-800"
                        : "font-normal text-slate-600",
                    )}
                  >
                    {msg.role === "user" ? (
                      msg.content
                    ) : (
                      <div className="space-y-4 bg-white/50 border border-slate-100/50 p-4 rounded-2xl -ml-4 w-[calc(100%+2rem)]">
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
        <div className="xl:px-8 lg:px-6 px-6 py-6">
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
                    placeholder="Ask a question about your connectors..."
                    disabled={isRunning}
                    className="flex-1 pl-6 pr-4 py-3.5 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-base font-medium disabled:opacity-50"
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
                      className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                    >
                      <Send className="w-4 h-4 translate-x-0.5 -translate-y-0.5" />
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
      <AnimatePresence>
        {conversation.length > 0 && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="xl:w-[320px] lg:w-[280px] w-[280px] bg-slate-50 border-l border-slate-200 overflow-hidden flex-shrink-0"
          >
            <div className="w-[280px] lg:w-[280px] xl:w-[320px]">
              <AgentWorkflowPanel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
