"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  BarChart3,
  GitBranch,
  FlaskConical,
  Search,
  Zap,
  Shield,
  TrendingUp,
  Brain,
  Layers,
  MessagesSquare,
  Activity,
  Bug,
  Eye,
  Target,
  Play,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

const integrations = [
  { name: "Amplitude", color: "bg-blue-100 text-blue-700" },
  { name: "Mixpanel", color: "bg-purple-100 text-purple-700" },
  { name: "PostHog", color: "bg-orange-100 text-orange-700" },
  { name: "Sentry", color: "bg-red-100 text-red-700" },
  { name: "GitHub", color: "bg-slate-100 text-slate-700" },
  { name: "Stripe", color: "bg-violet-100 text-violet-700" },
  { name: "Jira", color: "bg-blue-100 text-blue-700" },
  { name: "Slack", color: "bg-green-100 text-green-700" },
  { name: "Prometheus", color: "bg-amber-100 text-amber-700" },
  { name: "Notion", color: "bg-slate-100 text-slate-700" },
];

const features = [
  {
    icon: Search,
    title: "Unified Data Intelligence",
    description:
      "Connect Amplitude, Sentry, GitHub, Stripe, Jira, and more into a single interface. Stop stitching context across a dozen tabs.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Brain,
    title: "AI-Powered Recommendations",
    description:
      "Get specific, evidence-backed recommendations about what to build. Not just data — actionable direction with the reasoning behind it.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: FlaskConical,
    title: "Natural Language Experiments",
    description:
      "Design A/B tests by describing what you want to learn. Probe scaffolds the experiment, defines success metrics, and writes the readout.",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    icon: TrendingUp,
    title: "Compounding Intelligence",
    description:
      "Every experiment result, user pattern, and decision feeds a growing intelligence index unique to your product. The longer you use it, the sharper it gets.",
    gradient: "from-amber-500 to-orange-600",
  },
];

const useCases = [
  {
    icon: BarChart3,
    question: "Signups are down 15%. Why?",
    answer:
      "Probe queries your funnel data, cross-references a recent deploy from GitHub, and flags the onboarding change that correlates with the drop — plus a specific fix to test.",
    color: "border-blue-200 bg-blue-50/50",
    iconColor: "bg-blue-600",
  },
  {
    icon: GitBranch,
    question: "Was that feature launch worth it?",
    answer:
      "Probe pulls engagement data, compares behavior before and after, cross-references the original ticket, and produces a retrospective that feeds future prioritization.",
    color: "border-purple-200 bg-purple-50/50",
    iconColor: "bg-purple-600",
  },
  {
    icon: Activity,
    question: "Is this a product bug or infra issue?",
    answer:
      "Probe correlates the metric drop with Prometheus latency and Sentry errors to surface the root cause — so the right team gets paged, not the wrong redesign.",
    color: "border-emerald-200 bg-emerald-50/50",
    iconColor: "bg-emerald-600",
  },
  {
    icon: Eye,
    question: "What are users actually doing?",
    answer:
      "Instead of scrubbing hours of recordings, Probe surfaces the sessions worth watching — frustrated users, abandoned purchases, unexpected navigation patterns.",
    color: "border-amber-200 bg-amber-50/50",
    iconColor: "bg-amber-600",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    hydrate();
    setHydrated(true);
  }, [hydrate]);

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace("/agent");
    }
  }, [hydrated, isAuthenticated, router]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Only hide after we've confirmed authentication
  if (hydrated && isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
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
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo("features")}
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollTo("demo")}
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >
              Demo
            </button>
            <button
              onClick={() => scrollTo("integrations")}
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >
              Integrations
            </button>
            <button
              onClick={() => scrollTo("use-cases")}
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >
              Use Cases
            </button>
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

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-white" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-700 tracking-wide">
                AI-POWERED PRODUCT INTELLIGENCE
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-6"
          >
            Stop guessing.
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              Start knowing.
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10 font-medium"
          >
            Probe connects the dots between your product&apos;s data and your
            next decision.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="flex items-center justify-center gap-4"
          >
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/25 active:scale-[0.98]"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 px-8 py-4 rounded-2xl border border-slate-200 transition-all"
            >
              Sign in
            </Link>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="mt-20 relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden bg-white">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-400 font-mono">
                    app.probe.ai
                  </div>
                </div>
              </div>
              <div className="p-8 bg-gradient-to-br from-slate-50 to-white">
                <div className="flex gap-6">
                  {/* Mini sidebar */}
                  <div className="w-48 space-y-3 hidden md:block">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-100">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-xs font-semibold text-indigo-700">
                        Agent
                      </span>
                    </div>
                    {[
                      { icon: Search, label: "Discover" },
                      { icon: FlaskConical, label: "Experiments" },
                      { icon: Layers, label: "Overview" },
                    ].map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400"
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{label}</span>
                      </div>
                    ))}
                  </div>
                  {/* Mock content */}
                  <div className="flex-1 space-y-4">
                    <div className="rounded-xl border border-slate-100 p-4 bg-white">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Probe Agent
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-100 rounded w-full" />
                        <div className="h-3 bg-slate-100 rounded w-4/5" />
                        <div className="h-3 bg-slate-100 rounded w-3/5" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {
                          label: "Funnel Drop",
                          value: "-15%",
                          color: "text-red-600 bg-red-50 border-red-100",
                        },
                        {
                          label: "Active Users",
                          value: "12.4K",
                          color:
                            "text-emerald-600 bg-emerald-50 border-emerald-100",
                        },
                        {
                          label: "Experiments",
                          value: "3 Active",
                          color:
                            "text-indigo-600 bg-indigo-50 border-indigo-100",
                        },
                      ].map(({ label, value, color }) => (
                        <div
                          key={label}
                          className={`rounded-lg border p-3 ${color}`}
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-wider opacity-60 mb-1">
                            {label}
                          </p>
                          <p className="text-lg font-bold">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Integrations */}
      <section
        id="integrations"
        className="py-20 border-t border-slate-100 scroll-mt-20"
      >
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8"
          >
            Connects with your entire stack
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="flex flex-wrap justify-center gap-3"
          >
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className={`px-4 py-2 rounded-lg text-xs font-semibold ${integration.color} border border-transparent`}
              >
                {integration.name}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Demo Video */}
      <section id="demo" className="py-24 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">
              See it in action
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Watch how Probe works
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              See how product teams use Probe to go from question to answer in
              minutes, not days.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            <div className="relative rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden bg-slate-900 aspect-video group cursor-pointer">
              {/* Replace the src below with your actual video or embed */}
              {/* Option A: Embed a YouTube/Loom video with an iframe */}
              {/* <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                title="Probe Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              /> */}

              {/* Option B: Use a local or hosted video file */}
              {/* <video
                className="absolute inset-0 w-full h-full object-cover"
                src="/demo.mp4"
                controls
                poster="/demo-poster.jpg"
              /> */}

              {/* Placeholder — remove this when adding your real video */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-600/10 via-transparent to-transparent" />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <div className="text-center">
                  <p className="text-white/80 text-sm font-semibold mb-1">
                    Product Demo
                  </p>
                  <p className="text-white/40 text-xs">3 min watch</p>
                </div>
              </div>

              {/* Bottom bar to mimic video player chrome */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/40 to-transparent">
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-0 bg-indigo-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">
              Platform
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Your AI product partner
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              Like Cursor for developers, Probe eliminates the slow, manual
              parts of product work — so you can focus on judgment, not data
              wrangling.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="group relative bg-white rounded-2xl border border-slate-200 p-8 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg shadow-indigo-600/10`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">
              How it works
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Three stages of product maturity
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              Whether you&apos;re just starting or fully instrumented, Probe
              meets you where you are.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Foundation",
                description:
                  "Don't know what to track? Probe looks at your product and recommends a measurement foundation — the events, funnels, and metrics that actually matter.",
                icon: Target,
                color: "text-blue-600",
              },
              {
                step: "02",
                title: "Acceleration",
                description:
                  "Have partial observability? Probe fills gaps, connects your data sources, and starts generating recommendations from what you already have.",
                icon: Zap,
                color: "text-violet-600",
              },
              {
                step: "03",
                title: "Intelligence",
                description:
                  "Mature instrumentation? Probe becomes a true decision partner — surfacing what's broken, what's working, and what's worth building next.",
                icon: Brain,
                color: "text-emerald-600",
              },
            ].map((stage, i) => {
              const Icon = stage.icon;
              return (
                <motion.div
                  key={stage.step}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="relative"
                >
                  <span className="text-6xl font-black text-slate-100 absolute -top-2 -left-1">
                    {stage.step}
                  </span>
                  <div className="relative pt-12">
                    <div
                      className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 ${stage.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {stage.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">
              Use Cases
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Ask Probe anything
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              Real questions that PMs, TPMs, and developers face every day —
              answered with evidence, not intuition alone.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((uc, i) => {
              const Icon = uc.icon;
              return (
                <motion.div
                  key={uc.question}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className={`rounded-2xl border p-6 ${uc.color}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg ${uc.iconColor} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-2">
                        &ldquo;{uc.question}&rdquo;
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {uc.answer}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Differentiator */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Beyond analytics. Beyond search.
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              Existing tools show you what happened. Probe tells you what to do
              about it.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Full-Stack Visibility",
                description:
                  "Most PM tools see clicks and page views. Probe ingests from the full stack — product events, infrastructure metrics, error tracking, and feature flags.",
              },
              {
                icon: MessagesSquare,
                title: "Institutional Memory",
                description:
                  "Cross-references Slack threads, Jira tickets, and GitHub PRs to understand not just what happened, but why decisions were made.",
              },
              {
                icon: Bug,
                title: "Root Cause, Not Symptoms",
                description:
                  "Correlates metric drops with infrastructure data to tell you if it's a product problem or an engineering problem — before you waste a week on the wrong fix.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Ship faster with higher confidence
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 font-medium">
              Turn your data-rich-but-insight-poor team into one that knows
              exactly what to build, why, and whether it worked.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 active:scale-[0.98]"
              >
                Get started free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold text-sm tracking-tight">
                Probe
              </span>
            </div>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Probe AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
