"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Building2, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/workspace-store";
import WorkspaceAvatar from "@/components/WorkspaceAvatar";

type Plan = "free" | "pro" | "enterprise";

const LOGO_COLORS = [
  { label: "Indigo", value: "bg-indigo-600" },
  { label: "Emerald", value: "bg-emerald-600" },
  { label: "Violet", value: "bg-violet-600" },
  { label: "Rose", value: "bg-rose-600" },
  { label: "Amber", value: "bg-amber-600" },
  { label: "Sky", value: "bg-sky-500" },
];

const PLANS: { id: Plan; name: string; price: string; seats: string; connectors: string; highlight?: boolean }[] = [
  {
    id: "free",
    name: "Free",
    price: "$0/mo",
    seats: "1 seat",
    connectors: "2 connectors",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29/mo",
    seats: "1 seat (individual)",
    connectors: "All connectors",
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$49/seat/mo",
    seats: "Unlimited seats",
    connectors: "All connectors + team features",
  },
];

const STEPS = ["Name & Brand", "Choose Plan", "Done"];

export default function OnboardingPage() {
  const router = useRouter();
  const { createWorkspace, setActiveWorkspace } = useWorkspaceStore();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [logoColor, setLogoColor] = useState("bg-indigo-600");
  const [plan, setPlan] = useState<Plan>("pro");

  const handleFinish = () => {
    const id = createWorkspace(name.trim() || "New Workspace", logoColor, plan);
    setActiveWorkspace(id);
    router.push("/overview");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-indigo-400 text-sm font-bold uppercase tracking-widest mb-2">Probe</p>
          <h1 className="text-3xl font-bold text-white mb-2">Create a workspace</h1>
          <p className="text-slate-400 text-sm">Bring your team, data, and decisions together.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                    i < step
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : i === step
                        ? "bg-slate-800 border-indigo-500 text-indigo-400"
                        : "bg-slate-900 border-slate-700 text-slate-600"
                  )}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <p className={cn(
                  "text-[10px] font-semibold mt-1 whitespace-nowrap",
                  i === step ? "text-indigo-400" : "text-slate-600"
                )}>
                  {label}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("w-16 h-px mb-4 mx-2", i < step ? "bg-indigo-600" : "bg-slate-800")} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-8"
            >
              {step === 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Building2 className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-lg font-bold text-white">Name your workspace</h2>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-800/60 rounded-2xl">
                    <WorkspaceAvatar
                      initial={name[0]?.toUpperCase() || "W"}
                      color={logoColor}
                      size="lg"
                    />
                    <div>
                      <p className="text-white font-semibold">{name || "Your Workspace"}</p>
                      <p className="text-slate-500 text-xs">
                        /{(name || "your-workspace").toLowerCase().replace(/\s+/g, "-")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Workspace Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Acme Corp"
                      autoFocus
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Logo Color
                    </label>
                    <div className="flex gap-2">
                      {LOGO_COLORS.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => setLogoColor(c.value)}
                          title={c.label}
                          className={cn(
                            "w-8 h-8 rounded-lg transition-all",
                            c.value,
                            logoColor === c.value
                              ? "ring-2 ring-offset-2 ring-offset-slate-900 ring-white scale-110"
                              : "hover:scale-105 opacity-70 hover:opacity-100"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <Zap className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-lg font-bold text-white">Choose a plan</h2>
                  </div>

                  <div className="space-y-3">
                    {PLANS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPlan(p.id)}
                        className={cn(
                          "w-full text-left p-4 rounded-2xl border-2 transition-all",
                          plan === p.id
                            ? "border-indigo-500 bg-indigo-950/40"
                            : "border-slate-700 hover:border-slate-600 bg-slate-800/30"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-white font-bold">{p.name}</p>
                              {p.highlight && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full uppercase">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-slate-400 text-xs">{p.seats} · {p.connectors}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-white font-bold text-sm">{p.price}</p>
                            <div className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                              plan === p.id ? "border-indigo-500 bg-indigo-500" : "border-slate-600"
                            )}>
                              {plan === p.id && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 text-center">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-8 h-8 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">You&apos;re all set!</h2>
                    <p className="text-slate-400 text-sm">
                      <span className="text-white font-semibold">{name || "Your workspace"}</span> is ready.
                      Connect your first integration to start seeing insights.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 p-4 bg-slate-800/50 rounded-2xl">
                    <WorkspaceAvatar
                      initial={name[0]?.toUpperCase() || "W"}
                      color={logoColor}
                      size="md"
                    />
                    <div className="text-left">
                      <p className="text-white font-semibold text-sm">{name || "Your Workspace"}</p>
                      <p className="text-slate-400 text-xs capitalize">{plan} plan</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <p>Invite your team from <span className="text-slate-300 font-medium">Settings → Members</span> after setup.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer navigation */}
          <div className="px-8 pb-8 flex items-center justify-between">
            {step > 0 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-sm font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <button
                onClick={() => router.push("/overview")}
                className="text-sm text-slate-500 hover:text-slate-400 transition-colors"
              >
                Cancel
              </button>
            )}

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-bold"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-sm font-bold"
              >
                Launch workspace
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
