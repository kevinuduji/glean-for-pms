"use client";
import { useRouter } from "next/navigation";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSectionStore } from "@/lib/section-store";
import { useAgentStore } from "@/lib/store";
import { SEED_WORKSPACE_PROJECTS } from "@/lib/mock-data/workspace-projects";
import {
  BLACKROCK_DISCOVER,
  CATEGORY_CONFIG,
} from "@/lib/mock-data/blackrock-discover";

// Fallback prompts when no space-specific config exists
const FALLBACK_PROMPTS = [
  { label: "Summarize recent changes", prompt: "Summarize the most impactful changes in this area over the last 30 days.", category: "insight" as const },
  { label: "Surface top risks", prompt: "What are the top risks I should be aware of right now?", category: "risk" as const },
  { label: "Identify quick wins", prompt: "What are the highest-leverage improvements I could make this sprint?", category: "action" as const },
  { label: "Run an experiment", prompt: "Help me design an A/B experiment to improve a key metric in this section.", category: "action" as const },
  { label: "Benchmark performance", prompt: "How does current performance compare to last quarter's baseline?", category: "performance" as const },
];

export default function SectionDiscoverPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { getActiveSection } = useSectionStore();
  const { resetAgent, setQuery } = useAgentStore();

  const section = getActiveSection();
  const wsProject = SEED_WORKSPACE_PROJECTS.find((p) => p.id === section?.projectId);

  // Look up discover config by workspace ID
  const discoverConfig = wsProject
    ? BLACKROCK_DISCOVER[wsProject.workspaceId]
    : undefined;

  const prompts = discoverConfig?.prompts ?? FALLBACK_PROMPTS;
  const tagline =
    discoverConfig?.tagline ??
    `AI-powered suggestions for ${section?.name ?? "this section"}`;

  const handlePrompt = (prompt: string) => {
    resetAgent();
    setQuery(prompt);
    router.push("/agent");
  };

  return (
    <div className="bg-slate-950 h-full overflow-y-auto">
      <div className="px-8 py-8 max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-5 h-5 text-indigo-400" />
            <h1 className="text-[18px] font-bold text-slate-100">Discover</h1>
            {wsProject && (
              <span className="ml-1 text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                {wsProject.name}
              </span>
            )}
          </div>
          <p className="text-[14px] text-slate-500 leading-relaxed">{tagline}</p>
        </div>

        {/* Prompt chips */}
        <div className="flex flex-wrap gap-2.5">
          {prompts.map((p, i) => {
            const cat = CATEGORY_CONFIG[p.category] ?? CATEGORY_CONFIG.insight;
            return (
              <button
                key={i}
                onClick={() => handlePrompt(p.prompt)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-full border text-[13px] font-medium transition-all hover:scale-[1.02] active:scale-[0.98]",
                  cat.bg,
                  cat.text,
                  "border-current/20"
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", cat.dot)} />
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Hint */}
        <p className="mt-8 text-[12px] text-slate-700">
          Click any suggestion to open a scoped AI chat pre-loaded with this prompt.
        </p>
      </div>
    </div>
  );
}
