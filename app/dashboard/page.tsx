"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, MessageSquare } from "lucide-react";
import QuickQueryPills from "@/components/QuickQueryPills";
import { useAgentStore } from "@/lib/store";

export default function DashboardPage() {
  const { setQuery } = useAgentStore();
  const [inputValue, setInputValue] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = () => {
    if (!inputValue.trim()) return;
    setQuery(inputValue);
    router.push("/agent");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center pt-16 lg:pt-32 pb-12 px-6 bg-white">
      <AnimatePresence>
        {mounted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-3xl text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">
              Make Data-Driven Decisions{" "}
              <span className="text-indigo-600">Faster</span>
            </h1>

            <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              Gather data from Amplitude, PostHog, GitHub, and Sentry in
              seconds.
            </p>

            {/* Search Container */}
            <div className="relative group mb-12">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[2rem] blur opacity-15 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white border-2 border-slate-100 rounded-[1.8rem] shadow-xl overflow-hidden focus-within:border-indigo-500/50 transition-all duration-300">
                <div className="flex flex-col p-4 md:p-6 pb-4">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="What do you want to know about your product?"
                    className="w-full text-lg md:text-xl text-slate-900 placeholder:text-slate-400 bg-transparent border-none focus:ring-0 resize-none min-h-[120px] outline-none"
                  />
                  <div className="flex items-center justify-between mt-4">
                    <div />
                    <button
                      onClick={handleSearch}
                      disabled={!inputValue.trim()}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold transition-all duration-300 ${
                        inputValue.trim()
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      Ask Agent
                      <ArrowRight
                        className={`w-4 h-4 transition-transform duration-300 ${inputValue.trim() ? "translate-x-0" : ""}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Queries */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center gap-2 mb-4 text-slate-400">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">Suggested queries</span>
              </div>
              <div className="flex justify-center">
                <QuickQueryPills layout="wrap" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decor */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-50/60 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              x: [0, -40, 0],
              y: [0, 60, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-50/60 rounded-full blur-[120px]"
          />
        </div>
      )}
    </div>
  );
}
