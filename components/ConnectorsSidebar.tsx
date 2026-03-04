"use client";

import { useState } from "react";
import { Search, Plus, Check, ChevronRight, Globe, Zap } from "lucide-react";
import ToolLogo, { Tool } from "./ToolLogo";
import { cn } from "@/lib/utils";

const ALL_CONNECTORS: { id: string; name: string; tool: Tool }[] = [
  { id: "amplitude", name: "Amplitude", tool: "amplitude" },
  { id: "mixpanel", name: "Mixpanel", tool: "mixpanel" },
  { id: "posthog", name: "PostHog", tool: "posthog" },
  { id: "sentry", name: "Sentry", tool: "sentry" },
  { id: "github", name: "GitHub", tool: "github" },
  { id: "prometheus", name: "Prometheus", tool: "prometheus" },
  { id: "slack", name: "Slack", tool: "slack" },
  { id: "jira", name: "Jira", tool: "jira" },
  { id: "notion", name: "Notion", tool: "notion" },
];

export default function ConnectorsSidebar() {
  const [selectedConnectors, setSelectedConnectors] = useState<Set<string>>(
    new Set(ALL_CONNECTORS.map((s) => s.id)),
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSource = (id: string) => {
    const next = new Set(selectedConnectors);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedConnectors(next);
  };

  const toggleAll = () => {
    if (selectedConnectors.size === ALL_CONNECTORS.length) {
      setSelectedConnectors(new Set());
    } else {
      setSelectedConnectors(new Set(ALL_CONNECTORS.map((s) => s.id)));
    }
  };

  const filteredConnectors = ALL_CONNECTORS.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 border-r border-slate-200">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 bg-white">
        <h2 className="text-xs font-semibold text-slate-900 mb-3">
          Connectors
        </h2>

        <button className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors mb-3 shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          Add connectors
        </button>

        <div className="relative group mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search for new connectors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center bg-slate-200 rounded text-slate-500 hover:bg-slate-300 transition-colors">
            <ChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-between px-2 py-1 bg-slate-100 rounded text-[10px] font-medium text-slate-600 hover:bg-slate-200 transition-colors border border-slate-200">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              Web
            </div>
            <ChevronRight className="w-2.5 h-2.5 rotate-90" />
          </button>
          <button className="flex-1 flex items-center justify-between px-2 py-1 bg-slate-100 rounded text-[10px] font-medium text-slate-600 hover:bg-slate-200 transition-colors border border-slate-200">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-indigo-500" />
              Fast Research
            </div>
            <ChevronRight className="w-2.5 h-2.5 rotate-90" />
          </button>
        </div>
      </div>

      {/* Connector List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Select all connectors
          </span>
          <button
            onClick={toggleAll}
            className={cn(
              "w-4 h-4 rounded border flex items-center justify-center transition-all",
              selectedConnectors.size === ALL_CONNECTORS.length
                ? "bg-indigo-600 border-indigo-600"
                : "border-slate-300 bg-white hover:border-indigo-500",
            )}
          >
            {selectedConnectors.size === ALL_CONNECTORS.length && (
              <Check className="w-2.5 h-2.5 text-white" />
            )}
          </button>
        </div>

        <div className="space-y-1">
          {filteredConnectors.map((source) => (
            <div
              key={source.id}
              onClick={() => toggleSource(source.id)}
              className={cn(
                "group flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-all",
                selectedConnectors.has(source.id)
                  ? "bg-white shadow-sm border border-slate-200"
                  : "hover:bg-slate-100 border border-transparent",
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-6 h-6 flex-shrink-0">
                  <ToolLogo tool={source.tool} size="sm" />
                </div>
                <span
                  className={cn(
                    "text-xs truncate transition-colors",
                    selectedConnectors.has(source.id)
                      ? "font-medium text-slate-900"
                      : "text-slate-500",
                  )}
                >
                  {source.name}
                </span>
              </div>
              <div
                className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center transition-all",
                  selectedConnectors.has(source.id)
                    ? "bg-indigo-600 border-indigo-600"
                    : "border-slate-300 group-hover:border-slate-400",
                )}
              >
                {selectedConnectors.has(source.id) && (
                  <Check className="w-2.5 h-2.5 text-white" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>{selectedConnectors.size} connectors selected</span>
          <button className="text-indigo-600 font-medium hover:underline">
            Manage
          </button>
        </div>
      </div>
    </div>
  );
}
