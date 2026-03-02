import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type Tool =
  | "amplitude"
  | "mixpanel"
  | "posthog"
  | "sentry"
  | "github"
  | "prometheus"
  | "slack"
  | "jira"
  | "notion"
  | "datadog"
  | "linear"
  | "figma"
  | "intercom"
  | "agent";

const toolConfig: Record<
  Tool,
  {
    label: string;
    bg: string;
    color: string;
    letter?: string;
    Icon?: React.ComponentType<{ className?: string }>;
    slug?: string;
    hex?: string;
    customUrl?: string; // For tools not in SimpleIcons
  }
> = {
  amplitude: {
    label: "Amplitude",
    bg: "bg-blue-100",
    color: "text-blue-700",
    customUrl: "https://www.vectorlogo.zone/logos/amplitude/amplitude-icon.svg",
  },
  mixpanel: {
    label: "Mixpanel",
    bg: "bg-purple-100",
    color: "text-purple-700",
    slug: "mixpanel",
    hex: "7856FF",
  },
  posthog: {
    label: "PostHog",
    bg: "bg-orange-100",
    color: "text-orange-700",
    slug: "posthog",
    hex: "F54E00",
  },
  sentry: {
    label: "Sentry",
    bg: "bg-red-100",
    color: "text-red-700",
    slug: "sentry",
    hex: "362D59",
  },
  github: {
    label: "GitHub",
    bg: "bg-slate-100",
    color: "text-slate-700",
    slug: "github",
    hex: "181717",
  },
  prometheus: {
    label: "Prometheus",
    bg: "bg-orange-100",
    color: "text-orange-600",
    slug: "prometheus",
    hex: "E6522C",
  },
  slack: {
    label: "Slack",
    bg: "bg-violet-100",
    color: "text-violet-700",
    slug: "slack",
    hex: "4A154B",
  },
  jira: {
    label: "Jira",
    bg: "bg-blue-100",
    color: "text-blue-600",
    slug: "jira",
    hex: "0052CC",
  },
  notion: {
    label: "Notion",
    bg: "bg-zinc-100",
    color: "text-zinc-800",
    slug: "notion",
    hex: "000000",
  },
  datadog: {
    label: "Datadog",
    bg: "bg-purple-100",
    color: "text-purple-700",
    slug: "datadog",
    hex: "632CA6",
  },
  linear: {
    label: "Linear",
    bg: "bg-slate-100",
    color: "text-slate-900",
    slug: "linear",
    hex: "000000",
  },
  figma: {
    label: "Figma",
    bg: "bg-zinc-100",
    color: "text-zinc-900",
    slug: "figma",
    hex: "F24E1E",
  },
  intercom: {
    label: "Intercom",
    bg: "bg-blue-100",
    color: "text-blue-600",
    slug: "intercom",
    hex: "2867F1",
  },
  agent: {
    label: "Agent",
    bg: "bg-indigo-100",
    color: "text-indigo-700",
    Icon: Sparkles,
  },
};

export default function ToolLogo({
  tool,
  size = "md",
  className,
}: {
  tool: Tool;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const config = toolConfig[tool];
  if (!config) return null;

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 24,
  };

  const sizeClass = sizeClasses[size];
  const iconSize = iconSizes[size];

  return (
    <div
      className={cn(
        "rounded flex items-center justify-center font-bold flex-shrink-0 overflow-hidden",
        sizeClass,
        config.bg,
        config.color,
        className,
      )}
    >
      {config.Icon ? (
        <config.Icon
          className={
            size === "lg"
              ? "w-6 h-6"
              : size === "md"
                ? "w-3.5 h-3.5"
                : "w-3 h-3"
          }
        />
      ) : config.customUrl || config.slug ? (
        <Image
          src={
            config.customUrl ||
            `https://cdn.simpleicons.org/${config.slug}/${config.hex || "000"}`
          }
          alt={config.label}
          width={iconSize}
          height={iconSize}
          className="object-contain"
          unoptimized
        />
      ) : (
        config.letter
      )}
    </div>
  );
}
