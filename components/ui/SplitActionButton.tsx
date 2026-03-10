"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionButton } from "./ActionButton";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  description?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

interface SplitActionButtonProps {
  primaryOption: Option;
  options: Option[];
  size?: "sm" | "md" | "lg";
  className?: string;
  loading?: boolean;
}

export function SplitActionButton({
  primaryOption,
  options,
  size = "md",
  className,
  loading = false,
}: SplitActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={cn("inline-flex items-center -space-x-px", className)}
      ref={dropdownRef}
    >
      <ActionButton
        icon={primaryOption.icon}
        variant={primaryOption.variant ?? "primary"}
        size={size}
        onClick={primaryOption.onClick}
        loading={loading}
        className="rounded-r-none border-r border-black/10 transition-all duration-200"
      >
        {primaryOption.label}
      </ActionButton>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={loading}
          className={cn(
            "p-2 inline-flex items-center justify-center rounded-r-lg border-l border-black/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1",
            primaryOption.variant === "primary"
              ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
              : primaryOption.variant === "secondary"
                ? "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-500"
                : "text-slate-600 hover:bg-slate-100 focus:ring-slate-500",
            size === "sm"
              ? "h-[32px] w-[32px]"
              : size === "md"
                ? "h-[38px] w-[38px]"
                : "h-[46px] w-[46px]",
            loading && "opacity-50 cursor-not-allowed",
          )}
        >
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden py-1"
            >
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    option.onClick();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                >
                  {option.icon && (
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        option.variant === "danger"
                          ? "bg-red-50 text-red-600"
                          : "bg-indigo-50 text-indigo-600",
                      )}
                    >
                      <option.icon className="w-4 h-4" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        option.variant === "danger"
                          ? "text-red-700"
                          : "text-slate-900",
                      )}
                    >
                      {option.label}
                    </p>
                    {option.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {option.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
