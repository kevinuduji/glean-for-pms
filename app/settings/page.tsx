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
  Building2,
  Users,
  UserPlus,
  Layers,
  Copy,
  MailCheck,
  Trash2,
  TrendingUp,
  Palette,
  Rocket,
  Globe,
  Star,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ToolLogo, { Tool } from "@/components/ToolLogo";
import { useWorkspaceStore } from "@/lib/workspace-store";
import WorkspaceAvatar from "@/components/WorkspaceAvatar";
import PlanBadge from "@/components/PlanBadge";
import MemberRow from "@/components/MemberRow";
import type { WorkspaceRole } from "@/lib/types/workspace";

import { activeConnectors } from "@/lib/mock-data/connectors";

type SettingsSection =
  | "account"
  | "privacy"
  | "billing"
  | "usage"
  | "connectors"
  | "capabilities"
  | "workspace"
  | "members"
  | "teams";

interface SectionConfig {
  id: SettingsSection;
  label: string;
  icon: LucideIcon;
  description: string;
}

const sections: SectionConfig[] = [
  {
    id: "workspace",
    label: "Workspace",
    icon: Building2,
    description: "Manage workspace name, branding, and general settings",
  },
  {
    id: "members",
    label: "Members",
    icon: Users,
    description: "Manage workspace members, roles, and invitations",
  },
  {
    id: "teams",
    label: "Teams",
    icon: Layers,
    description: "Organize members into teams and manage team settings",
  },
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
      case "workspace":
        return <WorkspaceSettings />;
      case "members":
        return <MembersSettings />;
      case "teams":
        return <TeamsSettings />;
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
  { label: "Indigo", value: "bg-indigo-600" },
  { label: "Emerald", value: "bg-emerald-600" },
  { label: "Violet", value: "bg-violet-600" },
  { label: "Rose", value: "bg-rose-600" },
  { label: "Amber", value: "bg-amber-600" },
  { label: "Sky", value: "bg-sky-500" },
];

function WorkspaceSettings() {
  const {
    workspaces,
    activeWorkspaceId,
    updateWorkspace,
    deleteWorkspace,
    isWorkspaceAdmin,
    getActivePlan,
  } = useWorkspaceStore();
  const ws = workspaces.find((w) => w.id === activeWorkspaceId);
  const [name, setName] = useState(ws?.name ?? "");
  const [logoColor, setLogoColor] = useState(ws?.logoColor ?? "bg-indigo-600");
  const [saved, setSaved] = useState(false);
  const isAdmin = isWorkspaceAdmin();
  const plan = getActivePlan();

  if (!ws) return null;

  const handleSave = () => {
    updateWorkspace(activeWorkspaceId, { name, logoColor });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const planDetails = {
    free: { seats: "1 seat", connectors: "2 connectors", price: "$0/mo" },
    pro: { seats: "1 seat (individual)", connectors: "Unlimited", price: "$29/mo" },
    enterprise: { seats: "Unlimited seats", connectors: "Unlimited", price: "$49/seat/mo" },
  };

  return (
    <div className="space-y-8">
      {/* Workspace identity */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
          Identity
        </h3>
        <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-5">
          <div className="flex items-center gap-4">
            <WorkspaceAvatar initial={name[0]?.toUpperCase() ?? "W"} color={logoColor} size="lg" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">{name || ws.name}</p>
              <p className="text-xs text-slate-500">/{ws.slug}</p>
            </div>
            <PlanBadge plan={ws.plan} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Workspace Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isAdmin}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Workspace Slug</label>
            <input
              type="text"
              value={ws.slug}
              disabled
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500 cursor-not-allowed"
            />
            <p className="text-[11px] text-slate-400">Slug cannot be changed after creation.</p>
          </div>

          {isAdmin && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Logo Color</label>
              <div className="flex gap-2">
                {LOGO_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setLogoColor(c.value)}
                    title={c.label}
                    className={cn(
                      "w-7 h-7 rounded-lg transition-all",
                      c.value,
                      logoColor === c.value
                        ? "ring-2 ring-offset-2 ring-slate-400 scale-110"
                        : "hover:scale-105"
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plan summary */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
          Current Plan
        </h3>
        <div className="p-5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlanBadge plan={plan} className="text-sm px-3 py-1" />
            <div>
              <p className="text-sm font-semibold text-slate-900">{planDetails[plan].seats}</p>
              <p className="text-xs text-slate-500">{planDetails[plan].connectors} · {planDetails[plan].price}</p>
            </div>
          </div>
          {plan !== "enterprise" && (
            <button className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              Upgrade
            </button>
          )}
        </div>
        {plan === "free" && (
          <div className="p-4 rounded-xl border border-amber-100 bg-amber-50 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              You&apos;re on the Free plan — limited to 2 connectors. Upgrade to Pro or Enterprise to unlock all integrations and team features.
            </p>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="pt-2">
          <button
            onClick={handleSave}
            className={cn(
              "px-4 py-2 text-sm font-semibold rounded-xl transition-colors",
              saved
                ? "bg-emerald-600 text-white"
                : "bg-slate-900 text-white hover:bg-slate-800"
            )}
          >
            {saved ? "✓ Saved" : "Save Changes"}
          </button>
        </div>
      )}

      {/* Danger zone */}
      {isAdmin && (
        <div className="p-4 rounded-2xl border border-red-100 bg-red-50 space-y-3">
          <h4 className="text-sm font-bold text-red-900 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Danger Zone
          </h4>
          <p className="text-xs text-red-700">
            Deleting this workspace is permanent and cannot be undone. All members, integrations, experiments, and data will be removed.
          </p>
          <button
            onClick={() => deleteWorkspace(activeWorkspaceId)}
            className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Workspace
          </button>
        </div>
      )}

      {!isAdmin && (
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
          <p className="text-sm text-slate-500">Contact your admin to make changes to this workspace.</p>
        </div>
      )}
    </div>
  );
}

// ─── Members Settings ────────────────────────────────────────────────────────

function MembersSettings() {
  const {
    getWorkspaceMembersWithUsers,
    getPendingInvites,
    changeWorkspaceMemberRole,
    removeWorkspaceMember,
    inviteMember,
    revokeInvite,
    isWorkspaceAdmin,
    getActivePlan,
    currentUserId,
  } = useWorkspaceStore();

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>("member");
  const [inviteSent, setInviteSent] = useState<string | null>(null);
  const isAdmin = isWorkspaceAdmin();
  const plan = getActivePlan();
  const members = getWorkspaceMembersWithUsers();
  const pendingInvites = getPendingInvites();

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    inviteMember(inviteEmail.trim(), inviteRole);
    setInviteSent(inviteEmail.trim());
    setInviteEmail("");
    setTimeout(() => setInviteSent(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Invite Section */}
      {isAdmin ? (
        plan === "free" ? (
          <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Free plan — single user only</p>
              <p className="text-xs text-amber-700 mt-0.5">Upgrade to Enterprise to invite teammates to your workspace.</p>
              <button className="mt-2 px-3 py-1.5 text-xs font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors">
                Upgrade to Enterprise
              </button>
            </div>
          </div>
        ) : plan === "pro" ? (
          <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50 flex items-start gap-3">
            <Info className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-indigo-800">Pro Individual — single user</p>
              <p className="text-xs text-indigo-700 mt-0.5">The Pro plan is for individual use. Upgrade to Enterprise to invite teammates.</p>
              <button className="mt-2 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                Upgrade to Enterprise
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Invite Member
            </h3>
            <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                  placeholder="colleague@company.com"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as WorkspaceRole)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button
                  onClick={handleInvite}
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite
                </button>
              </div>
              {inviteSent && (
                <p className="text-xs text-emerald-600 flex items-center gap-1.5">
                  <MailCheck className="w-3.5 h-3.5" />
                  Invite sent to {inviteSent}
                </p>
              )}
              <p className="text-xs text-slate-400">An invite link will be generated. Copy and share it with your teammate.</p>
            </div>
          </div>
        )
      ) : null}

      {/* Members List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
            Members <span className="text-slate-400 font-normal normal-case">({members.length})</span>
          </h3>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-50 overflow-hidden">
          {members.map((m) => (
            <MemberRow
              key={m.userId}
              userId={m.userId}
              displayName={m.user.displayName}
              email={m.user.email}
              avatarInitial={m.user.avatarInitial}
              avatarColor={m.user.avatarColor}
              role={m.role}
              joinedAt={m.joinedAt}
              isCurrentUser={m.userId === currentUserId}
              canEdit={isAdmin}
              onRoleChange={(userId, role) => changeWorkspaceMemberRole(userId, role)}
              onRemove={(userId) => removeWorkspaceMember(userId)}
            />
          ))}
        </div>
      </div>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
            Pending Invites <span className="text-slate-400 font-normal normal-case">({pendingInvites.length})</span>
          </h3>
          <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-50 overflow-hidden">
            {pendingInvites.map((invite) => (
              <div key={invite.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-slate-700 truncate">{invite.email}</p>
                  <p className="text-[11px] text-slate-400">
                    Invited {new Date(invite.invitedAt).toLocaleDateString()} · {invite.role}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                  Pending
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://probe.app/invite/${invite.token}`);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Copy invite link"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {isAdmin && (
                  <button
                    onClick={() => revokeInvite(invite.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Revoke invite"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Teams Settings ──────────────────────────────────────────────────────────

const TEAM_ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp, Cpu, Palette, Shield, Rocket, Zap, Globe, Lock, Star, Users,
};

const TEAM_COLOR_OPTIONS = [
  { label: "Emerald", value: "emerald" },
  { label: "Violet", value: "violet" },
  { label: "Rose", value: "rose" },
  { label: "Amber", value: "amber" },
  { label: "Indigo", value: "indigo" },
  { label: "Sky", value: "sky" },
];

const teamColorDot: Record<string, string> = {
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
  indigo: "bg-indigo-500",
  sky: "bg-sky-500",
};

function TeamsSettings() {
  const {
    getVisibleTeams,
    createTeam,
    deleteTeam,
    updateTeam,
    getAllTeamMembers,
    getWorkspaceMembersWithUsers,
    isWorkspaceAdmin,
    getActivePlan,
  } = useWorkspaceStore();

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newColor, setNewColor] = useState("emerald");
  const [newIcon] = useState("TrendingUp");
  const [newVisibility, setNewVisibility] = useState<"public" | "private">("public");
  const isAdmin = isWorkspaceAdmin();
  const plan = getActivePlan();
  const teams = getVisibleTeams();
  const allMembers = getWorkspaceMembersWithUsers();

  const handleCreate = () => {
    if (!newName.trim()) return;
    createTeam({ name: newName.trim(), description: newDesc, color: newColor, icon: newIcon, visibility: newVisibility });
    setNewName("");
    setNewDesc("");
    setShowCreate(false);
  };

  return (
    <div className="space-y-6">
      {/* Teams List */}
      <div className="space-y-3">
        {teams.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No teams yet. Create one to get started.</p>
        ) : (
          teams.map((team) => {
            const Icon = TEAM_ICON_MAP[team.icon] ?? Users;
            const teamMembers = getAllTeamMembers(team.id);
            const memberUsers = teamMembers
              .map((tm) => allMembers.find((m) => m.userId === tm.userId))
              .filter(Boolean);

            return (
              <div key={team.id} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", teamColorDot[team.color] ?? "bg-slate-500")}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">{team.name}</p>
                        <span className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase",
                          team.visibility === "public" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                        )}>
                          {team.visibility}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{team.description}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => deleteTeam(team.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete team"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Member avatars */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {memberUsers.slice(0, 6).map((m) => m && (
                      <div
                        key={m.userId}
                        className={cn("w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0", m.user.avatarColor)}
                        title={m.user.displayName}
                      >
                        {m.user.avatarInitial}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">{teamMembers.length} member{teamMembers.length !== 1 ? "s" : ""}</span>
                  {isAdmin && (
                    <button
                      onClick={() => updateTeam(team.id, { visibility: team.visibility === "public" ? "private" : "public" })}
                      className="ml-auto text-xs text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      Toggle visibility
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create team */}
      {isAdmin && plan !== "free" && (
        showCreate ? (
          <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">New Team</h4>
            <div className="space-y-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Team name"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {TEAM_COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setNewColor(c.value)}
                      title={c.label}
                      className={cn(
                        "w-6 h-6 rounded-lg transition-all",
                        teamColorDot[c.value],
                        newColor === c.value ? "ring-2 ring-offset-1 ring-slate-400 scale-110" : "hover:scale-105"
                      )}
                    />
                  ))}
                </div>
                <select
                  value={newVisibility}
                  onChange={(e) => setNewVisibility(e.target.value as "public" | "private")}
                  className="ml-auto px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Create Team
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 font-semibold text-sm"
          >
            <Plus className="w-4 h-4" />
            Create New Team
          </button>
        )
      )}
      {plan === "free" && (
        <div className="p-4 rounded-xl border border-amber-100 bg-amber-50 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">Team management requires an Enterprise plan. Upgrade to create multiple teams and invite colleagues.</p>
        </div>
      )}
    </div>
  );
}
