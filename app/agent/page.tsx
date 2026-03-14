"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  PanelRightClose,
  PanelRightOpen,
  FlaskConical,
  Code,
  Activity,
  LineChart,
  ArrowRight,
  Compass,
  Ticket,
} from "lucide-react";
import { useAgentStore } from "@/lib/store";
import { agentScripts } from "@/lib/mock-data/agent-scripts";
import InlineAgentWorkflow from "@/components/InlineAgentWorkflow";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from "@/assets/Probe Logo.png";

import ConnectorsSidebar from "@/components/ConnectorsSidebar";

const getSuggestions = (text: string) => {
  if (!text.trim()) return [];
  const lowerText = text.toLowerCase();

  if (lowerText.startsWith("resea")) {
    return [
      "Research competitor pricing models",
      "Research user onboarding drop-off reasons",
      "Research new integration opportunities",
    ];
  }
  if (
    lowerText.startsWith("create jira ticket") ||
    lowerText.startsWith("create ticket")
  ) {
    return [
      "Create JIRA ticket for login failure",
      "Create JIRA ticket for page speed regression",
      "Create JIRA ticket for new onboarding flow",
    ];
  }
  if (lowerText.startsWith("creat") || lowerText.startsWith("add")) {
    return [
      "Create new button on onboarding",
      "Create experiment for signup flow",
      "Create feature spec for dark mode",
    ];
  }
  if (lowerText.startsWith("gener")) {
    return [
      "Generate features for an AI assistant",
      "Generate features to improve retention",
      "Generate features for enterprise customers",
    ];
  }
  if (lowerText.startsWith("latest") || lowerText.startsWith("show")) {
    return [
      "Latest updates on key metrics",
      "Latest updates on active experiments",
      "Latest updates from product team",
    ];
  }
  if (
    lowerText.startsWith("track") ||
    lowerText.startsWith("monitor") ||
    lowerText.startsWith("experi")
  ) {
    return [
      "Track experiment: Social Proof on Signup Page",
      "Track experiment: Simplified Checkout Flow",
      "Track experiment: Mobile-First Pricing Page",
    ];
  }
  if (lowerText.startsWith("why is")) {
    return [
      "Why is churn increasing in the enterprise segment?",
      "Why is activation rate higher for social signups?",
      "Why is the new onboarding flow underperforming?",
      "Why is Sunday the highest engagement day?",
    ];
  }
  return [];
};

function AgentPageInner() {
  const searchParams = useSearchParams();
  const { runScript, runLive, conversation, isRunning } = useAgentStore();
  const [isConnectorsOpen, setIsConnectorsOpen] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasAutoRun = useRef(false);

  const suggestions = getSuggestions(inputValue);

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
      {/* Middle panel: Chat */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <div className="xl:px-8 lg:px-6 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                useAgentStore.getState().resetAgent();
                if (window.location.pathname !== "/agent") {
                  window.location.href = "/agent";
                }
              }}
              className="text-xl font-playfair font-medium text-slate-900 tracking-tight hover:opacity-80 transition-opacity ml-1"
            >
              Probe
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsConnectorsOpen(!isConnectorsOpen)}
              className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all font-medium flex items-center gap-2"
              title={
                isConnectorsOpen ? "Hide connectors" : "Show connectors"
              }
            >
              <span className="text-xs uppercase tracking-wider font-bold">Connectors</span>
              {isConnectorsOpen ? (
                <PanelRightClose className="w-4 h-4" />
              ) : (
                <PanelRightOpen className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Messages */}
        {conversation.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 lg:px-8 -mt-20">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight text-center mb-10 font-playfair">
              What are we working on today?
            </h2>

            <div className="w-full max-w-3xl relative group mb-6">
              <form
                onSubmit={handleSubmit}
                className="relative z-10 transition-all duration-300 transform group-focus-within:translate-y-[-2px]"
              >
                <div className="absolute inset-0 bg-slate-900/5 blur-2xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                <div className="relative bg-white border border-slate-200/80 rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-focus-within:shadow-[0_4px_24px_rgba(0,0,0,0.06)] group-focus-within:border-slate-300 transition-all flex flex-col p-2">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything about your product, users, or experiments..."
                    disabled={isRunning}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (inputValue.trim() && !isRunning) {
                          handleSubmit();
                        }
                      }
                    }}
                    className="w-full resize-none bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-[15px] p-3 min-h-[60px]"
                  />

                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex flex-col gap-1 overflow-hidden"
                      >
                        <div className="pt-2 pb-1 border-t border-slate-100/60 mt-2 px-2">
                          {suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setInputValue("");
                                runLive(suggestion);
                              }}
                              className="w-full text-left px-3 py-2 text-[14px] text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors flex flex-col"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 px-1">
                      {/* Perplexity-style bottom action button (e.g. Focus) */}
                      {/* Focus button removed */}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={!inputValue.trim() || isRunning}
                        className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Options below the search bar */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl w-full">
              {[
                {
                  label: "Discover",
                  icon: Compass,
                  prefix: "Why is ",
                },
                {
                  label: "Research",
                  icon: Search,
                  prefix: "Research ",
                },
                {
                  label: "Create Experiment",
                  icon: FlaskConical,
                  prefix: "Create ",
                },
                {
                  label: "Generate Features",
                  icon: Code,
                  prefix: "Generate features ",
                },
                {
                  label: "Create JIRA ticket",
                  icon: Ticket,
                  prefix: "Create JIRA ticket for ",
                },
                {
                  label: "Latest Updates",
                  icon: Activity,
                  prefix: "Latest updates ",
                },
                {
                  label: "Monitor Experiments",
                  icon: LineChart,
                  prefix: "Track experiment ",
                },
              ].map((pill, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputValue(pill.prefix);
                    inputRef.current?.focus();
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all text-[13px] font-medium shadow-sm hover:shadow"
                >
                  <pill.icon className="w-3.5 h-3.5 text-slate-400" />
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto xl:px-8 lg:px-6 px-6 py-8 space-y-12">
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
                          "w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold shadow-sm",
                          msg.role === "user"
                            ? "bg-slate-200 text-slate-700 font-bold"
                            : "bg-white border border-slate-100",
                        )}
                      >
                        {msg.role === "user" ? (
                          "U"
                        ) : (
                          <Image
                            src={logo}
                            alt="Probe Logo"
                            width={28}
                            height={28}
                            className="w-full h-full object-cover"
                          />
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
                          {(() => {
                            const script = msg.scriptId
                              ? agentScripts.find((s) => s.id === msg.scriptId)
                              : null;
                            return script ? (
                              <>
                                <InlineAgentWorkflow
                                  steps={script.steps}
                                  isComplete={true}
                                  query={script.query}
                                />
                                {formatResponse(msg.content)}
                              </>
                            ) : (
                              formatResponse(msg.content)
                            );
                          })()}
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

              {isRunning && useAgentStore.getState().activeScript && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-4"
                >
                  <InlineAgentWorkflow
                    steps={useAgentStore.getState().activeScript!.steps}
                    stepStatuses={useAgentStore.getState().stepStatuses}
                    isComplete={false}
                    query={useAgentStore.getState().activeScript!.query}
                  />
                </motion.div>
              )}
            </div>

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input when conversation > 0 */}
        {conversation.length > 0 && (
          <div className="xl:px-8 lg:px-6 px-6 py-4 border-t border-slate-100 bg-white">
            <div className="max-w-3xl mx-auto">
              <div className="relative group">
                <form
                  onSubmit={handleSubmit}
                  className="relative z-10 transition-all duration-300 transform group-focus-within:translate-y-[-2px]"
                >
                  <div className="absolute inset-0 bg-slate-900/5 blur-2xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                  <div className="relative bg-white border border-slate-200/80 rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-focus-within:shadow-[0_4px_24px_rgba(0,0,0,0.06)] group-focus-within:border-slate-300 transition-all flex flex-col p-2">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask me anything about your product, users, or experiments..."
                      disabled={isRunning}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (inputValue.trim() && !isRunning) {
                            handleSubmit();
                          }
                        }
                      }}
                      className="w-full resize-none bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-[15px] p-3 min-h-[50px]"
                    />

                    <AnimatePresence>
                      {suggestions.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="flex flex-col gap-1 overflow-hidden"
                        >
                          <div className="pt-2 pb-1 border-t border-slate-100/60 mt-2 px-2">
                            {suggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setInputValue("");
                                  runLive(suggestion);
                                }}
                                className="w-full text-left px-3 py-2 text-[14px] text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors flex flex-col"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 px-1">
                        {/* Focus button removed */}
                      </div>
                      <div className="flex items-center gap-2 pr-2">
                        <div className="text-[10px] font-bold text-slate-400 px-2 py-1 bg-slate-100 rounded-md">
                          {conversation.length} msgs
                        </div>
                        <button
                          type="submit"
                          disabled={!inputValue.trim() || isRunning}
                          className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="flex items-center justify-center mt-2.5">
                  <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                    Probe can make mistakes. Consider verifying important
                    information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right panel: Connectors */}
      <motion.div
        animate={{ width: isConnectorsOpen ? "240px" : "0px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "flex-shrink-0 h-full overflow-hidden",
          isConnectorsOpen && "border-l border-slate-200"
        )}
      >
        <div
          className={cn(
            "h-full transition-all duration-300",
            isConnectorsOpen ? "w-[240px]" : "w-0",
          )}
        >
          <ConnectorsSidebar
            isCollapsed={!isConnectorsOpen}
            className="border-none"
          />
        </div>
      </motion.div>
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
