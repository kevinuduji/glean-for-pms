"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  ChevronRight,
  X,
  Lightbulb,
  TrendingUp,
  FlaskConical,
  Search,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContextualSuggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

interface AgentMessage {
  id: string;
  type: "suggestion" | "insight" | "question";
  content: string;
  timestamp: Date;
}

const contextualSuggestions: Record<string, ContextualSuggestion[]> = {
  "/agent": [
    {
      id: "quick-analysis",
      title: "Quick Data Analysis",
      description:
        "I can help you analyze conversion funnels, user behavior, or experiment results.",
      action: "Get Started",
      icon: TrendingUp,
      onClick: () => console.log("Quick analysis"),
    },
    {
      id: "experiment-design",
      title: "Design New Experiment",
      description:
        "Let me help you create a hypothesis and design an A/B test based on your data.",
      action: "Start Design",
      icon: FlaskConical,
      onClick: () => console.log("Design experiment"),
    },
  ],
  "/discover": [
    {
      id: "analyze-funnel",
      title: "Checkout Funnel Issue",
      description:
        "I found 3 similar issues from last quarter that were solved by simplifying the checkout flow.",
      action: "Analyze Pattern",
      icon: TrendingUp,
      onClick: () => console.log("Analyze funnel"),
    },
    {
      id: "test-social-proof",
      title: "Social Proof Opportunity",
      description:
        "Based on your user sessions, adding testimonials could increase signup conversion by 15%.",
      action: "Start Test",
      icon: FlaskConical,
      onClick: () => console.log("Test social proof"),
    },
  ],
  "/experiments": [
    {
      id: "similar-test",
      title: "Similar Test Warning",
      description:
        "This test is similar to one that failed last month. Consider testing the mobile experience first.",
      action: "View History",
      icon: Search,
      onClick: () => console.log("View similar test"),
    },
    {
      id: "experiment-idea",
      title: "Experiment Suggestion",
      description:
        "Your discover insights suggest testing a simplified pricing page. I can help design this experiment.",
      action: "Design Test",
      icon: Lightbulb,
      onClick: () => console.log("Design experiment"),
    },
  ],
  "/overview": [
    {
      id: "next-iteration",
      title: "Next Test Suggestion",
      description:
        "Your social proof test succeeded. Next, try testing different testimonial formats for even higher impact.",
      action: "Plan Next Test",
      icon: ChevronRight,
      onClick: () => console.log("Plan next test"),
    },
    {
      id: "pattern-insight",
      title: "Pattern Recognition",
      description:
        "I notice mobile tests perform 23% better than desktop. Consider mobile-first experimentation.",
      action: "Explore Pattern",
      icon: TrendingUp,
      onClick: () => console.log("Explore pattern"),
    },
  ],
};

export function PersistentAgent() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const suggestions = contextualSuggestions[pathname] || [];

  useEffect(() => {
    // Add contextual message when page changes
    if (suggestions.length > 0) {
      const contextMessage: AgentMessage = {
        id: `context-${Date.now()}`,
        type: "insight",
        content: getContextualMessage(pathname),
        timestamp: new Date(),
      };
      setMessages((prev) => [contextMessage, ...prev.slice(0, 4)]); // Keep last 5 messages
    }
  }, [pathname, suggestions.length]);

  function getContextualMessage(path: string): string {
    switch (path) {
      case "/agent":
        return "I'm your AI assistant for product insights. Ask me anything about your data, users, or experiments.";
      case "/discover":
        return "I'm analyzing your product data and found some interesting patterns. Check out the suggestions below.";
      case "/experiments":
        return "Ready to test your hypotheses? I can help design experiments based on your discovery insights.";
      case "/overview":
        return "Here's your product health dashboard. I can help analyze trends and suggest what to focus on next.";
      default:
        return "I'm here to help you make data-driven product decisions. What would you like to explore?";
    }
  }

  function handleSendMessage() {
    if (!inputValue.trim()) return;

    const userMessage: AgentMessage = {
      id: `user-${Date.now()}`,
      type: "question",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [userMessage, ...prev]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AgentMessage = {
        id: `ai-${Date.now()}`,
        type: "suggestion",
        content:
          "I understand you're asking about that. Let me analyze your data and get back to you with specific recommendations.",
        timestamp: new Date(),
      };
      setMessages((prev) => [aiResponse, ...prev]);
      setIsTyping(false);
    }, 2000);
  }

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="mb-4 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="font-semibold text-slate-900 text-sm">
                  Probe AI
                </span>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-lg hover:bg-white/50 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="max-h-60 overflow-y-auto p-4 space-y-3">
              {isTyping && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="flex gap-1">
                    <div
                      className="w-1 h-1 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-1 h-1 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-1 h-1 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                  Probe is thinking...
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className="text-sm">
                  <div
                    className={cn(
                      "p-3 rounded-xl",
                      message.type === "question"
                        ? "bg-indigo-50 text-indigo-900 ml-8"
                        : "bg-slate-50 text-slate-700",
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="px-4 py-3 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Suggestions
                </p>
                <div className="space-y-2">
                  {suggestions.slice(0, 2).map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={suggestion.onClick}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <suggestion.icon className="w-3 h-3 text-indigo-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-900 mb-1">
                            {suggestion.title}
                          </p>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {suggestion.description}
                          </p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0 mt-1" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200",
          isExpanded
            ? "bg-slate-600 text-white"
            : "bg-indigo-600 text-white hover:bg-indigo-700",
        )}
      >
        {isExpanded ? (
          <X className="w-5 h-5" />
        ) : (
          <div className="relative">
            <Sparkles className="w-5 h-5" />
            {suggestions.length > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            )}
          </div>
        )}
      </motion.button>
    </div>
  );
}
