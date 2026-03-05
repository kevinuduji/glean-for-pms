"use client";

import { Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Visibility } from "@/lib/types/workspace";

interface VisibilityToggleProps {
  value: Visibility;
  onChange: (value: Visibility) => void;
  disabled?: boolean;
  size?: "sm" | "md";
}

export default function VisibilityToggle({
  value,
  onChange,
  disabled = false,
  size = "md",
}: VisibilityToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-lg border border-slate-700 overflow-hidden",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onChange("public")}
        className={cn(
          "flex items-center gap-1.5 transition-colors",
          size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs",
          value === "public"
            ? "bg-slate-700 text-slate-100"
            : "bg-transparent text-slate-400 hover:text-slate-300",
          disabled && "pointer-events-none"
        )}
      >
        <Globe className={cn(size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5")} />
        Public
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onChange("private")}
        className={cn(
          "flex items-center gap-1.5 transition-colors border-l border-slate-700",
          size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs",
          value === "private"
            ? "bg-slate-700 text-slate-100"
            : "bg-transparent text-slate-400 hover:text-slate-300",
          disabled && "pointer-events-none"
        )}
      >
        <Lock className={cn(size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5")} />
        Private
      </button>
    </div>
  );
}
