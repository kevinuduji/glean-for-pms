"use client";

import { useRouter } from "next/navigation";
import { useAgentStore } from "@/lib/store";

export default function TopNav() {
  const router = useRouter();
  const { resetAgent } = useAgentStore();

  return (
    <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center px-6 relative z-50">
      <div className="flex-1 flex items-center">
        <button
          onClick={() => {
            resetAgent();
            router.push("/agent");
          }}
          className="text-white font-playfair text-xl font-medium tracking-tight hover:opacity-80 transition-opacity"
        >
          Probe
        </button>
      </div>
      <div className="flex-1" />
    </div>
  );
}
