"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Shield,
  CreditCard,
  Zap,
  Plug,
  Sparkles,
  ChevronRight,
  Mail,
  Lock,
  Plus,
  ArrowUpRight,
  Check,
  Bot,
  Cpu,
  History,
  Info,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ToolLogo, { Tool } from "@/components/ToolLogo";

import { activeConnectors, comingSoon } from "@/lib/mock-data/connectors";

type SettingsSection =
  | "account"
  | "privacy"
  | "billing"
  | "usage"
  | "connectors"
  | "capabilities";

interface SectionConfig {
  id: SettingsSection;
  label: string;
  icon: LucideIcon;
  description: string;
}

const sections: SectionConfig[] = [
  {
    id: "account",
    label: "General Account",
    icon: User,
    description: "Manage your profile and account security",
  },
  {
    id: "privacy",
    label: "Privacy & Data",
    icon: Shield,
    description: "Control your data and sharing preferences",
  },
  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
    description: "Manage your subscription and payment methods",
  },
  {
    id: "usage",
    label: "Usage",
    icon: Zap,
    description: "Monitor your API and resource consumption",
  },
  {
    id: "connectors",
    label: "Connectors",
    icon: Plug,
    description: "Connect your tools and data connectors",
  },

  {
    id: "capabilities",
    label: "Capabilities",
    icon: Bot,
    description: "Configure AI models and advanced features",
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("account");

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return <AccountSettings />;
      case "privacy":
        return <PrivacySettings />;
      case "billing":
        return <BillingSettings />;
      case "usage":
        return <UsageSettings />;
      case "connectors":
        return <ConnectorsSettings />;

      case "capabilities":
        return <CapabilitiesSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-slate-50">
      {/* Settings Navigation */}
      <div className="w-64 border-r border-slate-200 bg-white p-6 flex flex-col gap-1">
        <h1 className="text-xl font-bold text-slate-900 mb-6 px-2">Settings</h1>
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200/50"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-400 group-hover:text-slate-600",
                )}
              />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto bg-white/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-8 py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  {sections.find((s) => s.id === activeSection)?.label}
                </h2>
                <p className="text-slate-500 mt-1">
                  {sections.find((s) => s.id === activeSection)?.description}
                </p>
              </div>

              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-Components ─────────────────────────────────────────────────────────

function AccountSettings() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
          Profile Information
        </h3>
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200">
              K
            </div>
            <div>
              <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                Change Avatar
              </button>
              <p className="text-xs text-slate-500 mt-0.5">
                JPG, GIF or PNG. Max size of 800K
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="Kevin"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  defaultValue="kevin@example.com"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm italic text-slate-500 cursor-not-allowed"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
          Security
        </h3>
        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <Lock className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Password</p>
                <p className="text-xs text-slate-500">
                  Last changed 3 months ago
                </p>
              </div>
            </div>
            <button className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              Update
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <Shield className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-amber-600 font-medium italic">
                  Not enabled
                </p>
              </div>
            </div>
            <button className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              Enable
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function PrivacySettings() {
  const [toggles, setToggles] = useState({
    dataSharing: true,
    activityLog: true,
    aiTraining: false,
    marketing: false,
  });

  const Toggle = ({
    id,
    label,
    description,
  }: {
    id: keyof typeof toggles;
    label: string;
    description: string;
  }) => (
    <div className="flex items-start justify-between py-4 border-b border-slate-100 last:border-0">
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500 max-w-md">{description}</p>
      </div>
      <button
        onClick={() => setToggles((prev) => ({ ...prev, [id]: !prev[id] }))}
        className={cn(
          "w-10 h-6 rounded-full transition-all relative flex-shrink-0",
          toggles[id] ? "bg-indigo-600 shadow-inner" : "bg-slate-200",
        )}
      >
        <motion.div
          animate={{ x: toggles[id] ? 18 : 2 }}
          className="absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow-sm"
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 px-6">
        <Toggle
          id="dataSharing"
          label="Data Sharing"
          description="Allow us to share anonymized usage patterns with our core partners to improve the platform."
        />
        <Toggle
          id="activityLog"
          label="Detailed Activity Log"
          description="Keep a persistent log of all your actions for audit and debugging purposes."
        />
        <Toggle
          id="aiTraining"
          label="Improve AI Models"
          description="Allow our models to learn from your interactions. Your data will be de-identified."
        />
        <Toggle
          id="marketing"
          label="Personalized Recommendations"
          description="Receive suggestions for new features and workflows based on your usage."
        />
      </div>

      <div className="p-4 rounded-2xl border border-red-100 bg-red-50 space-y-3">
        <h4 className="text-sm font-bold text-red-900 flex items-center gap-2">
          <History className="w-4 h-4" />
          Data Retention
        </h4>
        <p className="text-xs text-red-700 leading-relaxed">
          You can request to delete all your data permanently. This action
          cannot be undone and will immediately terminate your access to the
          platform history.
        </p>
        <button className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
          Delete My Data
        </button>
      </div>
    </div>
  );
}

function BillingSettings() {
  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full">
                Professional
              </span>
              <span className="text-xs text-slate-400">Current Plan</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">
              $49.00
              <span className="text-sm font-normal text-slate-400">/mo</span>
            </h3>
            <p className="text-sm text-slate-300">
              Next billing date: April 12, 2026
            </p>
          </div>
          <button className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors shadow-xl shadow-white/5">
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
          Payment Method
        </h3>
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-slate-100 flex items-center justify-center">
              <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center">
                <div className="flex gap-0.5">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Mastercard ending in 4242
              </p>
              <p className="text-xs text-slate-500">Expiry 12/28</p>
            </div>
          </div>
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
            Edit
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
          Recent Invoices
        </h3>
        <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {[
            { date: "March 12, 2026", amount: "$49.00", status: "Paid" },
            { date: "Feb 12, 2026", amount: "$49.00", status: "Paid" },
            { date: "Jan 12, 2026", amount: "$49.00", status: "Paid" },
          ].map((invoice, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {invoice.date}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Invoice #INV-2026-00{3 - i}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-900">
                  {invoice.amount}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                  {invoice.status}
                </span>
                <button className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsageSettings() {
  return (
    <div className="space-y-8">
      {/* Usage Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              API Requests
            </span>
            <Zap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-end gap-2 mb-2">
            <h4 className="text-3xl font-bold text-slate-900">12,402</h4>
            <span className="text-xs text-slate-400 mb-1">/ 50,000</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "24.8%" }}
              className="h-full bg-indigo-500 rounded-full"
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-3 font-medium">
            Resetting in 9 days
          </p>
        </div>
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Token Usage
            </span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-end gap-2 mb-2">
            <h4 className="text-3xl font-bold text-slate-900">1.2M</h4>
            <span className="text-xs text-slate-400 mb-1">/ 5M Tokens</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "24%" }}
              className="h-full bg-amber-500 rounded-full"
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-3 font-medium">
            Resetting in 9 days
          </p>
        </div>
      </div>

      {/* Usage Chart Placeholder */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
          Daily Consumption
        </h3>
        <div className="h-48 w-full border border-slate-200 rounded-2xl bg-white p-6 flex flex-col justify-end gap-2">
          <div className="flex items-end justify-between h-full gap-2">
            {[40, 65, 45, 90, 75, 55, 60, 85, 40, 30, 50, 80, 70, 45, 95].map(
              (h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className="flex-1 bg-indigo-100 hover:bg-indigo-300 rounded-t-sm transition-colors relative group"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {Math.round(h * 12.5)} req
                  </div>
                </motion.div>
              ),
            )}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-50">
            <span>Mar 1</span>
            <span>Mar 15</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-500 mt-0.5" />
        <p className="text-xs text-indigo-700 leading-relaxed">
          Usage data is updated every 30 minutes. High concurrency periods might
          result in slight processing delays.
        </p>
      </div>
    </div>
  );
}

function ConnectorsSettings() {
  const allConnectors = [
    ...activeConnectors.map((i) => ({ ...i, status: "Connected" })),
    ...comingSoon.map((i) => ({ ...i, status: "Coming Soon" })),
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4">
        {allConnectors.map((c) => (
          <div
            key={c.id}
            className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between hover:shadow-md hover:border-indigo-100 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden",
                  c.status === "Connected"
                    ? "bg-slate-50 border border-slate-100"
                    : "bg-slate-100 opacity-60",
                )}
              >
                <ToolLogo tool={c.id as Tool} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{c.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase",
                      c.status === "Connected"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {c.status}
                  </span>
                  {c.status === "Connected" && "lastSynced" in c && (
                    <span className="text-[10px] text-slate-400">
                      Synced {c.lastSynced}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 font-semibold">
        <Plus className="w-4 h-4" />
        Connect New Tool
      </button>
    </div>
  );
}

function CapabilitiesSettings() {
  const [enabledFeatures, setEnabledFeatures] = useState([
    "rag",
    "semantic-search",
    "workflow-automation",
  ]);

  const features = [
    {
      id: "rag",
      name: "RAG Engine",
      desc: "Augment AI responses with your real-time data context.",
    },
    {
      id: "semantic-search",
      name: "Semantic Search",
      desc: "Search through vector embeddings for precise results.",
    },
    {
      id: "workflow-automation",
      name: "Workflow Automation",
      desc: "Let AI take actions based on detected patterns.",
    },
    {
      id: "advanced-reasoning",
      name: "Advanced Reasoning",
      desc: "Use extra compute for complex multi-step analysis.",
      premium: true,
    },
    {
      id: "custom-models",
      name: "Custom Fine-tuning",
      desc: "Train models on your specific company dialect.",
      premium: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-start gap-4">
        <div className="p-2.5 rounded-2xl bg-white shadow-sm">
          <Cpu className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-indigo-900">Platform Brain</h4>
          <p className="text-xs text-indigo-700 leading-relaxed">
            Configure the underlying logic and AI capabilities of your instance.
            Some features may incur additional token costs.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {features.map((f) => {
          const isEnabled = enabledFeatures.includes(f.id);
          return (
            <div
              key={f.id}
              onClick={() => {
                if (f.premium) return;
                setEnabledFeatures((prev) =>
                  prev.includes(f.id)
                    ? prev.filter((x) => x !== f.id)
                    : [...prev, f.id],
                );
              }}
              className={cn(
                "p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between",
                isEnabled
                  ? "bg-white border-indigo-200 shadow-sm"
                  : "bg-slate-50/50 border-slate-100 grayscale-[0.5]",
                f.premium && "opacity-60 cursor-not-allowed",
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    isEnabled
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 text-slate-500",
                  )}
                >
                  {isEnabled ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">{f.name}</p>
                    {f.premium && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full uppercase">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
