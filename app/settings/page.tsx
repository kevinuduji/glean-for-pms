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

import { activeConnectors } from "@/lib/mock-data/connectors";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { USERS, SEED_WORKSPACE_MEMBERS } from "@/lib/mock-data/workspace";
import VisibilityToggle from "@/components/VisibilityToggle";
import CreateTeamModal from "@/components/modals/CreateTeamModal";
import TeamMemberModal from "@/components/modals/TeamMemberModal";
import type { Visibility, WorkspaceRole, TeamRole } from "@/lib/types/workspace";
import * as LucideIcons from "lucide-react";

type SettingsSection =
  | "account"
  | "privacy"
  | "billing"
  | "usage"
  | "connectors"
  | "capabilities"
  | "workspace"
  | "teams";

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
  {
    id: "workspace",
    label: "Workspace",
    icon: Settings,
    description: "Manage workspace members, roles, and general settings",
  },
  {
    id: "teams",
    label: "Teams",
    icon: Cpu,
    description: "Create and manage teams, membership, and access control",
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
      case "workspace":
        return <WorkspaceSettings />;
      case "teams":
        return <TeamsSettings />;
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

// ─── Workspace Settings ──────────────────────────────────────────────────────

const LOGO_COLORS = [
  { name: "bg-indigo-600", label: "Indigo" },
  { name: "bg-emerald-600", label: "Emerald" },
  { name: "bg-violet-600", label: "Violet" },
  { name: "bg-rose-600", label: "Rose" },
  { name: "bg-amber-600", label: "Amber" },
  { name: "bg-sky-600", label: "Sky" },
  { name: "bg-orange-600", label: "Orange" },
];

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  member: "Member",
  viewer: "Viewer",
};

function WorkspaceSettings() {
  const {
    workspaces,
    activeWorkspaceId,
    updateWorkspace,
    getWorkspaceRole,
    changeWorkspaceMemberRole,
  } = useWorkspaceStore();

  const ws = workspaces.find((w) => w.id === activeWorkspaceId);
  const isAdmin = getWorkspaceRole() === "admin";
  const [nameValue, setNameValue] = useState(ws?.name ?? "");
  const [saved, setSaved] = useState(false);

  const members = SEED_WORKSPACE_MEMBERS.filter(
    (m) => m.workspaceId === activeWorkspaceId
  );

  if (!ws) return null;

  const handleSave = () => {
    updateWorkspace(ws.id, { name: nameValue });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="space-y-10">
      {/* General */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
          General
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">
              Workspace Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                disabled={!isAdmin}
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
              />
              {isAdmin && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 transition-colors"
                >
                  {saved ? "Saved" : "Save"}
                </button>
              )}
            </div>
          </div>

          {/* Logo color */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">
              Logo Color
            </label>
            <div className="flex gap-2">
              {LOGO_COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  disabled={!isAdmin}
                  onClick={() => isAdmin && updateWorkspace(ws.id, { logoColor: c.name })}
                  className={cn(
                    "w-7 h-7 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                    c.name,
                    ws.logoColor === c.name
                      ? "ring-2 ring-offset-2 ring-offset-white ring-slate-800"
                      : ""
                  )}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Plan */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Plan</label>
            <span className="inline-flex items-center px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200 capitalize">
              {ws.plan}
            </span>
          </div>

          {/* Visibility */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">
              Workspace Visibility
            </label>
            <VisibilityToggle
              value={ws.visibility}
              onChange={(v: Visibility) => isAdmin && updateWorkspace(ws.id, { visibility: v })}
              disabled={!isAdmin}
            />
            <p className="mt-1 text-xs text-slate-400">
              {ws.visibility === "public"
                ? "Anyone with the link can view this workspace."
                : "Only invited members can access this workspace."}
            </p>
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
            Members ({members.length})
          </h3>
          {isAdmin && (
            <button className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-500 font-medium">
              <Plus className="w-3.5 h-3.5" />
              Invite member
            </button>
          )}
        </div>
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
          {members.map((m) => {
            const user = USERS.find((u) => u.id === m.userId);
            if (!user) return null;
            const isSelf = m.userId === "user-kevin";
            return (
              <div key={m.userId} className="flex items-center gap-3 px-4 py-3 bg-white">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0", user.avatarColor)}>
                  {user.avatarInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {user.displayName} {isSelf && <span className="text-slate-400 font-normal text-xs">(you)</span>}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
                {isAdmin && !isSelf ? (
                  <select
                    value={m.role}
                    onChange={(e) => changeWorkspaceMemberRole(m.userId, e.target.value as WorkspaceRole)}
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                    <option value="viewer">Viewer</option>
                  </select>
                ) : (
                  <span className="text-xs text-slate-500 capitalize">{ROLE_LABEL[m.role]}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger zone — admin only */}
      {isAdmin && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wider">
            Danger Zone
          </h3>
          <div className="flex items-center justify-between px-4 py-3 border border-red-200 rounded-xl bg-red-50">
            <div>
              <p className="text-sm font-medium text-slate-900">Delete Workspace</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Permanently delete this workspace and all its data.
              </p>
            </div>
            <button
              disabled
              title="Only available on Enterprise plan"
              className="px-3 py-1.5 border border-red-300 text-red-500 text-xs rounded-lg opacity-50 cursor-not-allowed"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Teams Settings ───────────────────────────────────────────────────────────

const TEAM_COLOR_BG: Record<string, string> = {
  emerald: "bg-emerald-500", violet: "bg-violet-500", rose: "bg-rose-500",
  amber: "bg-amber-500", indigo: "bg-indigo-500", sky: "bg-sky-500", orange: "bg-orange-500",
};

function TeamIconEl({ name, className }: { name: string; className?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}

const TEAM_COLOR_OPTIONS = [
  { name: "emerald", bg: "bg-emerald-500" },
  { name: "violet",  bg: "bg-violet-500" },
  { name: "rose",    bg: "bg-rose-500" },
  { name: "amber",   bg: "bg-amber-500" },
  { name: "indigo",  bg: "bg-indigo-500" },
  { name: "sky",     bg: "bg-sky-500" },
  { name: "orange",  bg: "bg-orange-500" },
];

function TeamsSettings() {
  const {
    teams,
    teamMembers,
    getWorkspaceRole,
    updateTeam,
    updateTeamVisibility,
    deleteTeam,
    removeTeamMember,
    changeTeamMemberRole,
    activeWorkspaceId,
  } = useWorkspaceStore();

  const isAdmin = getWorkspaceRole() === "admin";
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const wsTeams = teams.filter((t) => t.workspaceId === activeWorkspaceId);

  const startEdit = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;
    setEditName(team.name);
    setEditDesc(team.description);
    setEditingTeamId(teamId);
  };

  const saveEdit = (teamId: string) => {
    updateTeam(teamId, { name: editName, description: editDesc });
    setEditingTeamId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{wsTeams.length} team{wsTeams.length !== 1 ? "s" : ""}</p>
        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-500 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Team
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wsTeams.map((team) => {
          const memberCount = teamMembers.filter((m) => m.teamId === team.id).length;
          const isEditing = editingTeamId === team.id;
          const myTeamRole = teamMembers.find(
            (m) => m.teamId === team.id && m.userId === "user-kevin"
          )?.role;
          const canManage = isAdmin || myTeamRole === "lead";

          return (
            <div
              key={team.id}
              className="border border-slate-200 rounded-xl bg-white overflow-hidden"
            >
              {/* Card header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", TEAM_COLOR_BG[team.color] ?? "bg-slate-500")}>
                  <TeamIconEl name={team.icon} className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{team.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{memberCount} member{memberCount !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Visibility toggle — inline */}
                  {canManage ? (
                    <VisibilityToggle
                      value={team.visibility}
                      onChange={(v: Visibility) => updateTeamVisibility(team.id, v)}
                      size="sm"
                    />
                  ) : (
                    <span className="text-[10px] text-slate-400 capitalize">{team.visibility}</span>
                  )}
                  {canManage && (
                    <button
                      onClick={() => isEditing ? setEditingTeamId(null) : startEdit(team.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-xs"
                    >
                      {isEditing ? "✕" : "Edit"}
                    </button>
                  )}
                </div>
              </div>

              {/* Edit panel */}
              {isEditing && (
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 space-y-3">
                  <div>
                    <label className="text-[10px] font-medium text-slate-500 block mb-1">Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-500 block mb-1">Description</label>
                    <textarea
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      rows={2}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                  {/* Color */}
                  <div>
                    <label className="text-[10px] font-medium text-slate-500 block mb-1">Color</label>
                    <div className="flex gap-1.5">
                      {TEAM_COLOR_OPTIONS.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => updateTeam(team.id, { color: c.name })}
                          className={cn(
                            "w-5 h-5 rounded-full transition-all",
                            c.bg,
                            team.color === c.name ? "ring-2 ring-offset-1 ring-offset-slate-50 ring-slate-800" : ""
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        if (confirm(`Delete team "${team.name}"?`)) {
                          deleteTeam(team.id);
                          setEditingTeamId(null);
                        }
                      }}
                      className="text-xs text-red-500 hover:text-red-600 transition-colors"
                    >
                      Delete team
                    </button>
                    <button
                      onClick={() => saveEdit(team.id)}
                      className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-500 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              {/* Members list */}
              <div className="px-4 py-3 space-y-2">
                {teamMembers
                  .filter((m) => m.teamId === team.id)
                  .map((m) => {
                    const user = USERS.find((u) => u.id === m.userId);
                    if (!user) return null;
                    return (
                      <div key={m.userId} className="flex items-center gap-2">
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold text-[10px] flex-shrink-0", user.avatarColor)}>
                          {user.avatarInitial}
                        </div>
                        <span className="flex-1 text-xs text-slate-700 truncate">{user.displayName}</span>
                        {canManage ? (
                          <select
                            value={m.role}
                            onChange={(e) => changeTeamMemberRole(team.id, m.userId, e.target.value as TeamRole)}
                            disabled={m.userId === "user-kevin"}
                            className="text-[10px] border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-500 focus:outline-none disabled:opacity-50"
                          >
                            <option value="lead">Lead</option>
                            <option value="member">Member</option>
                          </select>
                        ) : (
                          <span className="text-[10px] text-slate-400 capitalize">{m.role}</span>
                        )}
                        {canManage && m.userId !== "user-kevin" && (
                          <button
                            onClick={() => removeTeamMember(team.id, m.userId)}
                            className="text-slate-400 hover:text-red-400 transition-colors text-[10px]"
                            title="Remove"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    );
                  })}
                {canManage && (
                  <button
                    onClick={() => setShowAddMemberModal(team.id)}
                    className="flex items-center gap-1 text-[11px] text-indigo-500 hover:text-indigo-600 transition-colors mt-1"
                  >
                    <Plus className="w-3 h-3" /> Add member
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <CreateTeamModal onClose={() => setShowCreateModal(false)} />
      )}
      {showAddMemberModal && (
        <TeamMemberModal
          teamId={showAddMemberModal}
          onClose={() => setShowAddMemberModal(null)}
        />
      )}
    </div>
  );
}
