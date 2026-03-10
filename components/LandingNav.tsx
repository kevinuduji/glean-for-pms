"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function LandingNav() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const isPricingPage = pathname === "/pricing";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-slate-900 font-bold text-lg tracking-tight">
            Probe
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              isLanding
                ? "text-slate-900"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Explore
          </Link>
          <Link
            href="/pricing"
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              isPricingPage
                ? "text-slate-900"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98]"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
