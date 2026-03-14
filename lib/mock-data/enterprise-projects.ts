import type { Project } from "@/lib/types/project";

/**
 * BlackRock organization spaces.
 *
 * Public spaces  → available to anyone who has joined BlackRock via SSO.
 * Private spaces → require an invite code or private link; restricted access.
 */
export const ENTERPRISE_PROJECTS: Project[] = [
  // ─── Public Spaces ─────────────────────────────────────────────────────────
  // Accessible to all BlackRock SSO members
  {
    id: "br-global-markets",
    name: "Global Markets",
    color: "indigo",
    icon: "BarChart2",
    createdAt: "2026-01-01T00:00:00.000Z",
    isPublic: true,
    isEnterprise: true,
    description:
      "Real-time market data, macro trends, and sector rotation signals across global asset classes.",
    memberCount: 312,
  },
  {
    id: "br-esg",
    name: "ESG & Sustainability",
    color: "emerald",
    icon: "Globe",
    createdAt: "2026-01-02T00:00:00.000Z",
    isPublic: true,
    isEnterprise: true,
    description:
      "ESG scoring frameworks, carbon exposure metrics, and regulatory impact reporting across portfolios.",
    memberCount: 184,
  },
  {
    id: "br-risk",
    name: "Risk Analytics",
    color: "amber",
    icon: "Shield",
    createdAt: "2026-01-03T00:00:00.000Z",
    isPublic: true,
    isEnterprise: true,
    description:
      "Portfolio risk modeling, VaR calculations, liquidity stress testing, and credit concentration analysis.",
    memberCount: 97,
  },
  {
    id: "br-client",
    name: "Client Solutions",
    color: "violet",
    icon: "Users",
    createdAt: "2026-01-04T00:00:00.000Z",
    isPublic: true,
    isEnterprise: true,
    description:
      "Advisor portal tools, client reporting workflows, onboarding experience, and AUM retention metrics.",
    memberCount: 143,
  },
  {
    id: "br-product",
    name: "Product Strategy",
    color: "sky",
    icon: "Target",
    createdAt: "2026-01-05T00:00:00.000Z",
    isPublic: true,
    isEnterprise: true,
    description:
      "Fund lineup development, competitive intelligence, fee compression analysis, and ETF roadmap.",
    memberCount: 76,
  },

  // ─── Private Spaces ────────────────────────────────────────────────────────
  // Invite code or private link required
  {
    id: "br-aladdin",
    name: "Aladdin Engineering",
    color: "rose",
    icon: "Cpu",
    createdAt: "2026-01-06T00:00:00.000Z",
    isPublic: false,
    isEnterprise: true,
    inviteCode: "ALADDIN",
    description:
      "Internal Aladdin platform development, API performance, infrastructure reliability, and feature roadmap.",
    memberCount: 38,
  },
  {
    id: "br-dealflow",
    name: "Deal Flow",
    color: "teal",
    icon: "Building2",
    createdAt: "2026-01-07T00:00:00.000Z",
    isPublic: false,
    isEnterprise: true,
    inviteCode: "DEALS24",
    description:
      "M&A pipeline tracking, acquisition targets, due diligence materials, and market multiples analysis.",
    memberCount: 14,
  },
  {
    id: "br-board",
    name: "Board Intelligence",
    color: "slate",
    icon: "Layers",
    createdAt: "2026-01-08T00:00:00.000Z",
    isPublic: false,
    isEnterprise: true,
    inviteCode: "BR0ARD9",
    description:
      "Executive briefing materials, quarterly board decks, investor day preparation, and governance docs.",
    memberCount: 9,
  },
];
