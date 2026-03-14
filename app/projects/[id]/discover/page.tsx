"use client";

import { useRouter } from "next/navigation";
import { Compass, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAgentStore } from "@/lib/store";
import { useWorkspaceProjectStore } from "@/lib/workspace-project-store";
import { SEED_WORKSPACE_PROJECTS } from "@/lib/mock-data/workspace-projects";
import {
  BLACKROCK_DISCOVER,
  CATEGORY_CONFIG,
  type DiscoverPrompt,
} from "@/lib/mock-data/blackrock-discover";

// Generic fallback prompts for projects without a specific config
const GENERIC_PROMPTS: DiscoverPrompt[] = [
  {
    label: "Summarise recent activity",
    prompt: "Summarise the most important recent activity and updates in this project.",
    category: "insight",
  },
  {
    label: "Identify blockers",
    prompt: "What are the current blockers or risks that could delay this project?",
    category: "risk",
  },
  {
    label: "Key metrics to track",
    prompt: "What are the most important metrics we should be tracking for this project?",
    category: "performance",
  },
  {
    label: "Next actions",
    prompt: "What are the top 3 next actions to move this project forward?",
    category: "action",
  },
  {
    label: "Document progress",
    prompt: "Help me write a brief progress update for stakeholders on this project.",
    category: "action",
  },
];

interface ProjectDiscoverPageProps {
  params: { id: string };
}

export default function ProjectDiscoverPage({ params }: ProjectDiscoverPageProps) {
  const router = useRouter();
  const { setQuery } = useAgentStore();
  const { userProjects } = useWorkspaceProjectStore();

  const project =
    SEED_WORKSPACE_PROJECTS.find((p) => p.id === params.id) ??
    userProjects.find((p) => p.id === params.id);

  // Look up discover config by project's workspaceId (the parent space),
  // then by the project id itself; fall back to generic.
  const workspaceId = project?.workspaceId ?? "";
  const discoverConfig =
    BLACKROCK_DISCOVER[params.id] ??
    BLACKROCK_DISCOVER[workspaceId] ??
    null;

  const prompts: DiscoverPrompt[] = discoverConfig?.prompts ?? GENERIC_PROMPTS;
  const tagline =
    discoverConfig?.tagline ??
    `Explore insights and actions for ${project?.name ?? "this project"}`;

  function handlePromptClick(prompt: string) {
    setQuery(prompt);
    router.push("/agent");
  }

  // Group prompts by category
  const grouped = prompts.reduce<Record<string, DiscoverPrompt[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <div className="h-full overflow-y-auto bg-slate-950">
      <div className="max-w-3xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-100">Discover</h2>
          </div>
          <p className="text-sm text-slate-400">{tagline}</p>
        </div>

        {/* Prompt groups */}
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, categoryPrompts]) => {
            const config =
              CATEGORY_CONFIG[category as DiscoverPrompt["category"]];
            if (!config) return null;
            return (
              <div key={category}>
                {/* Category label */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      config.dot
                        .replace("bg-rose-400", "bg-rose-400")
                        .replace("bg-indigo-400", "bg-indigo-400")
                        .replace("bg-violet-400", "bg-violet-400")
                        .replace("bg-amber-400", "bg-amber-400")
                        .replace("bg-emerald-400", "bg-emerald-400")
                    )}
                  />
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                    {config.label}
                  </span>
                </div>

                {/* Prompt chips */}
                <div className="flex flex-wrap gap-2">
                  {categoryPrompts.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => handlePromptClick(p.prompt)}
                      className={cn(
                        "flex items-center gap-2 px-3.5 py-2 rounded-full border text-[13px] font-medium transition-all hover:scale-[1.02] active:scale-[0.98]",
                        // Dark-mode chip style
                        "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white hover:bg-slate-800"
                      )}
                    >
                      <Sparkles className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="mt-8 text-[11px] text-slate-600 text-center">
          Clicking a prompt will open the AI assistant with the query pre-filled.
        </p>
      </div>
    </div>
  );
}
