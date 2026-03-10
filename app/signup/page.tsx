"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Eye, EyeOff, Check } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

const benefits = [
  "Connect 10+ data sources in minutes",
  "AI-powered product recommendations",
  "Natural language experiment design",
  "Compounding intelligence over time",
];

export default function SignupPage() {
  const router = useRouter();
  const { signIn } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignUp = () => {
    signIn({ name: "Kevin", email: "kevin@probe.ai" });
    router.push("/agent");
  };

  const handleEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    signIn({
      name: name || "User",
      email: email || "user@probe.ai",
    });
    router.push("/agent");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-transparent" />
        <div className="absolute top-20 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl" />

        <div className="relative">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Probe
            </span>
          </Link>
        </div>

        <div className="relative space-y-8">
          <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Start making
            <br />
            confident decisions
          </h2>
          <div className="space-y-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <span className="text-slate-300 text-sm font-medium">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["bg-indigo-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500"].map(
                  (bg, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full ${bg} border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  )
                )}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">
                  Join 500+ product teams
                </p>
                <p className="text-slate-500 text-xs">
                  Already using Probe to ship faster
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Probe AI
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-8 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-slate-900 font-bold text-xl tracking-tight">
              Probe
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Create your account
          </h1>
          <p className="text-slate-500 mb-8 font-medium">
            Get started with Probe in under 5 minutes
          </p>

          {/* Google sign up */}
          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.99] shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
          </button>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              or
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Work email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 active:scale-[0.99]"
            >
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400 leading-relaxed">
            By creating an account, you agree to our{" "}
            <span className="text-indigo-600 font-medium cursor-pointer">Terms of Service</span> and{" "}
            <span className="text-indigo-600 font-medium cursor-pointer">Privacy Policy</span>
          </p>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
