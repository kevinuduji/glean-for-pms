import { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  MessageSquare,
  Folder,
  FlaskConical,
  SquarePen,
} from "lucide-react";
import { useAgentStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import {
  mockActiveExperiments,
  mockExperimentQueue,
  mockArchivedExperiments,
} from "@/lib/mock-data/experiments";
// import { retroFeatures } from "@/lib/mock-data/retrospective";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const {
    savedChats,
    projects,
    loadChat,
    resetAgent,
    setQuery: setAgentQuery,
  } = useAgentStore();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      // Add a small delay for focus to ensure it works after animation starts
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const STATIC_DATA = useMemo(() => {
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

    // const retros = retroFeatures.map((retro) => ({
    //   id: `retro-${retro.id}`,
    //   title: retro.name,
    //   type: "product history",
    //   url: "/product-history",
    //   icon: GitMerge,
    // }));

    return [...experiments];
  }, []);

  const filteredChats = savedChats.filter((chat) =>
    chat.title.toLowerCase().includes(query.toLowerCase()),
  );
  const filteredProjects = projects.filter((proj) =>
    proj.name.toLowerCase().includes(query.toLowerCase()),
  );
  const filteredStatic = STATIC_DATA.filter((item) =>
    item.title?.toLowerCase().includes(query.toLowerCase()),
  );

  const hasResults =
    filteredChats.length > 0 ||
    filteredProjects.length > 0 ||
    filteredStatic.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
                <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search chats, projects, and experiments..."
                  className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-500 text-lg"
                />
                <button
                  onClick={onClose}
                  className="p-1 px-2 text-xs font-medium rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  ESC
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
                {/* Always show "Ask Agent" option if there's a query */}
                {query.trim().length > 0 && (
                  <div className="mb-4">
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Ask Probe
                    </div>
                    <button
                      onClick={() => {
                        resetAgent();
                        setAgentQuery(query);
                        router.push("/agent");
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/60 transition-colors text-left group"
                    >
                      <SquarePen className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                      <span className="text-sm text-slate-200 font-medium group-hover:text-white truncate">
                        Ask about &quot;{query}&quot;
                      </span>
                    </button>
                  </div>
                )}

                {filteredProjects.length > 0 && (
                  <div className="mb-4">
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Projects
                    </div>
                    {filteredProjects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          onClose();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/60 transition-colors text-left group"
                      >
                        <Folder
                          className={cn(
                            "w-4 h-4",
                            project.color === "indigo"
                              ? "text-indigo-400"
                              : project.color === "emerald"
                                ? "text-emerald-400"
                                : project.color === "amber"
                                  ? "text-amber-400"
                                  : project.color === "rose"
                                    ? "text-rose-400"
                                    : "text-slate-400",
                          )}
                        />
                        <span className="text-sm text-slate-200 font-medium group-hover:text-white">
                          {project.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {filteredStatic.length > 0 && (
                  <div className="mb-4">
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Product Data
                    </div>
                    {filteredStatic.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            router.push(item.url);
                            onClose();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/60 transition-colors text-left group"
                        >
                          <Icon className="w-4 h-4 text-slate-500 group-hover:text-slate-400" />
                          <div className="flex-1 min-w-0 flex items-center gap-2">
                            <span className="text-sm text-slate-200 font-medium group-hover:text-white truncate">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-slate-500 capitalize bg-slate-800 px-1.5 py-0.5 rounded flex-shrink-0">
                              {item.type}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {filteredChats.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Chats
                    </div>
                    {filteredChats.map((chat) => {
                      const project = projects.find(
                        (p) => p.id === chat.projectId,
                      );
                      return (
                        <button
                          key={chat.id}
                          onClick={() => {
                            loadChat(chat.id);
                            router.push("/agent");
                            onClose();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/60 transition-colors text-left group"
                        >
                          <MessageSquare className="w-4 h-4 text-slate-500 group-hover:text-slate-400" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm text-slate-200 font-medium truncate group-hover:text-white">
                              {chat.title}
                            </h4>
                            {project && (
                              <p className="text-xs text-slate-500 truncate">
                                {project.name}
                              </p>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 flex-shrink-0">
                            {new Date(chat.updatedAt).toLocaleDateString()}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {!hasResults && query.trim().length === 0 && (
                  <div className="py-14 text-center text-slate-500 text-sm">
                    Start typing to search...
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
