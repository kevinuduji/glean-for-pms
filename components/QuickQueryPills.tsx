"use client";

import { motion } from "framer-motion";
import { quickQueryPills } from "@/lib/mock-data/agent-scripts";
import { useAgentStore } from "@/lib/store";
import { useRouter } from "next/navigation";

type QuickQueryPillsProps = {
  layout?: "scroll" | "wrap";
  onPillClick?: (scriptId: string, query: string) => void;
};

export default function QuickQueryPills({
  layout = "scroll",
  onPillClick,
}: QuickQueryPillsProps) {
  const { runScript, setQuery } = useAgentStore();
  const router = useRouter();

  const handleClick = (pill: (typeof quickQueryPills)[0]) => {
    if (onPillClick) {
      onPillClick(pill.scriptId, pill.label);
    } else {
      setQuery(pill.label);
      router.push("/agent");
      setTimeout(() => {
        runScript(pill.scriptId, pill.label);
      }, 100);
    }
  };

  return (
    <div className="relative">
      <div
        className={
          layout === "scroll"
            ? "flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
            : "flex flex-wrap gap-2 justify-center"
        }
      >
        {quickQueryPills.map((pill) => (
          <motion.button
            key={pill.id}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(pill)}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm hover:border-indigo-300 hover:shadow-sm transition-all whitespace-nowrap font-medium"
          >
            <span className="text-lg">{pill.emoji}</span>
            <span>{pill.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
