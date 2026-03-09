"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import {
  Search,
  Clock,
  LayoutDashboard,
  Sparkles,
  FlaskConical,
  GitMerge,
  Lightbulb,
  Server,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  mockActiveExperiments,
  mockExperimentQueue,
  mockExperimentIdeas,
  mockArchivedExperiments,
} from "@/app/experiments/page";
import { retroFeatures } from "@/lib/mock-data/retrospective";
import { buildUnifiedFeed } from "@/lib/mock-data/unified-feed";
import { activeConnectors } from "@/lib/mock-data/connectors";

const STATIC_SEARCH_DATA = [
  {
    id: "nav-1",
    title: "Overview Dashboard",
    type: "page",
    url: "/overview",
    icon: LayoutDashboard,
  },
  {
    id: "nav-2",
    title: "Agent Interface",
    type: "page",
    url: "/agent",
    icon: Sparkles,
  },
  {
    id: "nav-3",
    title: "Experiments List",
    type: "page",
    url: "/experiments",
    icon: FlaskConical,
  },
  {
    id: "nav-4",
    title: "Product History",
    type: "page",
    url: "/product-history",
    icon: GitMerge,
  },
  {
    id: "nav-5",
    title: "Discover",
    type: "page",
    url: "/discover",
    icon: Search,
  },
];

export default function TopNav() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Combine data sources
  const MOCK_SEARCH_DATA = useMemo(() => {
    const experiments = [
      ...mockActiveExperiments,
      ...mockExperimentQueue,
      ...mockArchivedExperiments,
    ].map((exp) => ({
      id: `exp-${exp.id}`,
      title: exp.name,
      type: "experiment",
      url: `/experiments?id=${exp.id}`,
      icon: FlaskConical,
    }));

    const ideas = mockExperimentIdeas.map((idea) => ({
      id: `idea-${idea.id}`,
      title: idea.title,
      type: "experiment idea",
      url: `/experiments?id=${idea.id}&tab=ideas`,
      icon: Lightbulb, // Will default to FlaskConical in map if Lightbulb not imported, but let's use FlaskConical or Sparkles. Let's use Sparkles.
    }));

    const retros = retroFeatures.map((retro) => ({
      id: `retro-${retro.id}`,
      title: retro.name,
      type: "product history",
      url: "/product-history",
      icon: GitMerge,
    }));

    const feed = buildUnifiedFeed().map((item) => ({
      id: `feed-${item.feedId}`,
      title:
        item.feedType === "recommendation"
          ? item.source.headline
          : (item.source.flaggedReason ?? "Friction Session"),
      type:
        item.feedType === "recommendation"
          ? "discover recommendation"
          : "discover session",
      url: "/discover",
      icon: Search,
    }));

    const connectors = activeConnectors.map((connector) => ({
      id: `connector-${connector.id}`,
      title: connector.name,
      type: "connector",
      url: `/connectors?connector=${connector.id}`,
      icon: Server,
    }));

    return [
      ...STATIC_SEARCH_DATA,
      ...experiments,
      ...ideas,
      ...retros,
      ...feed,
      ...connectors,
    ];
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        wrapperRef.current?.querySelector("input")?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const results = MOCK_SEARCH_DATA.filter((item) =>
    item.title?.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (url: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(url);
  };

  return (
    <div className="h-12 bg-[#2D3139] border-b border-slate-800 flex items-center justify-center px-4 relative z-50">
      <div className="w-full max-w-xl relative" ref={wrapperRef}>
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all border",
            isOpen
              ? "bg-[#3f444f] border-slate-500 shadow-sm"
              : "bg-[#3B404A] border-transparent hover:bg-[#3f444f] hover:border-slate-500",
          )}
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search for just about anything..."
            className="bg-transparent border-none outline-none text-slate-200 w-full placeholder:text-slate-400"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          <span className="text-slate-500 text-xs font-mono shrink-0 scale-90">
            ⌘K
          </span>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#2D3139] border border-slate-700 rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[400px]">
            {query.length === 0 ? (
              <div className="p-3">
                <p className="text-xs font-medium text-slate-500 mb-2 px-2">
                  RECENT SEARCHES
                </p>
                <button
                  onClick={() => handleSelect("/experiments")}
                  className="w-full flex items-center gap-3 px-2 py-2 text-sm text-slate-300 hover:bg-[#3B404A] hover:text-slate-100 rounded-md transition-colors text-left"
                >
                  <Clock className="w-4 h-4 text-slate-500" />
                  Cart Drop-off Resolution
                </button>
                <button
                  onClick={() => handleSelect("/overview")}
                  className="w-full flex items-center gap-3 px-2 py-2 text-sm text-slate-300 hover:bg-[#3B404A] hover:text-slate-100 rounded-md transition-colors text-left"
                >
                  <Clock className="w-4 h-4 text-slate-500" />
                  Overview Dashboard
                </button>
              </div>
            ) : results.length > 0 ? (
              <div className="p-2 overflow-y-auto">
                <p className="text-xs font-medium text-slate-500 mb-2 px-2 pt-1">
                  RESULTS
                </p>
                {results.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.url)}
                      className="w-full flex items-center gap-3 px-2 py-2 text-sm text-slate-300 hover:bg-[#3B404A] hover:text-slate-100 rounded-md transition-colors text-left"
                    >
                      <div className="w-6 h-6 rounded bg-[#3f444f] flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <span className="flex-1 truncate">{item.title}</span>
                      <span className="text-xs text-slate-500 capitalize">
                        {item.type}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm">
                No results found for &quot;{query}&quot;
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
