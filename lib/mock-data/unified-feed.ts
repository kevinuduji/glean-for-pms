import { Session, flaggedSessions } from "./posthog";
import { Recommendation, recommendations, Source } from "./recommendations";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FeedItemType = "recommendation" | "friction-session";
export type UnifiedPriority = "critical" | "high" | "medium";

type FeedItemBase = {
  feedId: string;
  unifiedPriority: UnifiedPriority;
  detectedAt: string;
  isNew: boolean;
  area: string;
  resolved: boolean;
};

export type RecommendationFeedItem = FeedItemBase & {
  feedType: "recommendation";
  source: Recommendation;
};

export type FrictionSessionFeedItem = FeedItemBase & {
  feedType: "friction-session";
  source: Session;
};

export type FeedItem = RecommendationFeedItem | FrictionSessionFeedItem;

// ─── Mock PR Types ────────────────────────────────────────────────────────────

export type MockPR = {
  branch: string;
  prNumber: number;
  prTitle: string;
  prDescription: string;
  proposedDiff: MockDiffFile[];
};

export type MockDiffFile = {
  path: string;
  lines: { type: "context" | "add" | "remove"; content: string }[];
};

// ─── Adapters ─────────────────────────────────────────────────────────────────

const priorityOrder: Record<UnifiedPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
};

function sessionPriorityToUnified(s: Session): UnifiedPriority {
  if (s.issueType === "rage-click" || s.issueType === "dead-click") return "critical";
  if (s.priority === "P1") return "critical";
  if (s.priority === "P2") return "high";
  if (s.priority === "P3") return "medium";
  if (s.impactScore >= 40) return "high";
  return "medium";
}

function deriveAreaFromPages(pageViews: string[]): string {
  const path = (pageViews[0] ?? "").toLowerCase();
  if (path.includes("checkout") || path.includes("billing") || path.includes("payment")) return "Revenue";
  if (path.includes("onboard") || path.includes("signup") || path.includes("register")) return "Activation";
  if (path.includes("pricing")) return "Acquisition";
  if (path.includes("settings") || path.includes("account")) return "Retention";
  return "Performance";
}

export function adaptSession(s: Session): FrictionSessionFeedItem {
  return {
    feedId: `session-${s.id}`,
    feedType: "friction-session",
    unifiedPriority: sessionPriorityToUnified(s),
    detectedAt: s.startTime,
    isNew: s.status === "untriaged",
    area: deriveAreaFromPages(s.pageViews),
    resolved: s.status === "triaged" && !!s.linkedTicketId,
    source: s,
  };
}

export function adaptRecommendation(r: Recommendation): RecommendationFeedItem {
  const priorityMap: Record<string, UnifiedPriority> = {
    critical: "critical",
    high: "high",
    medium: "medium",
  };
  return {
    feedId: `rec-${r.id}`,
    feedType: "recommendation",
    unifiedPriority: priorityMap[r.priority] ?? "medium",
    detectedAt: r.detectedAt,
    isNew: r.isNew,
    area: r.area,
    resolved: r.resolved ?? false,
    source: r,
  };
}

export function buildUnifiedFeed(): FeedItem[] {
  const recs = recommendations.map(adaptRecommendation);
  const sessions = flaggedSessions.map(adaptSession);
  return [...recs, ...sessions].sort((a, b) => {
    const pd = priorityOrder[a.unifiedPriority] - priorityOrder[b.unifiedPriority];
    if (pd !== 0) return pd;
    return new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime();
  });
}

// ─── Mock PR Generator ────────────────────────────────────────────────────────

const sessionDiffMap: Record<NonNullable<Session["issueType"]>, MockDiffFile[]> = {
  "rage-click": [
    {
      path: "src/api/checkout/tokenRefresh.ts",
      lines: [
        { type: "context", content: "  async function completeCheckout(session: CheckoutSession) {" },
        { type: "context", content: "    const token = await fetchPaymentToken(session.userId);" },
        { type: "remove", content: "    const result = await processPayment(token, session.cart);" },
        { type: "add", content: "    const result = await processPayment(token, session.cart).catch(err => {" },
        { type: "add", content: "      logger.error('payment_processing_failed', { err, sessionId: session.id });" },
        { type: "add", content: "      throw new PaymentError('Payment processing failed', err);" },
        { type: "add", content: "    });" },
        { type: "context", content: "    return result;" },
        { type: "context", content: "  }" },
      ],
    },
  ],
  "dead-click": [
    {
      path: "src/features/export/CsvExportButton.tsx",
      lines: [
        { type: "context", content: "  export function CsvExportButton({ data }: Props) {" },
        { type: "remove", content: "    if (!featureFlags.csvExport) return null;" },
        { type: "context", content: "    return (" },
        { type: "context", content: "      <button onClick={() => downloadCsv(data)}" },
        { type: "add", content: "        disabled={data.length === 0}" },
        { type: "context", content: "      >" },
        { type: "context", content: "        Export CSV" },
        { type: "context", content: "      </button>" },
        { type: "context", content: "    );" },
        { type: "context", content: "  }" },
      ],
    },
  ],
  "drop-off": [
    {
      path: "src/onboarding/StepThree.tsx",
      lines: [
        { type: "context", content: "  export function StepThree({ onComplete }: Props) {" },
        { type: "add", content: "    const saved = useLocalStorage('onboarding_step3', {});" },
        { type: "add", content: "    const [formState, setFormState] = useState(saved || initialState);" },
        { type: "remove", content: "    const [formState, setFormState] = useState(initialState);" },
        { type: "context", content: "    function handleChange(field: string, value: string) {" },
        { type: "context", content: "      const next = { ...formState, [field]: value };" },
        { type: "context", content: "      setFormState(next);" },
        { type: "add", content: "      saveToLocalStorage('onboarding_step3', next);" },
        { type: "context", content: "    }" },
      ],
    },
  ],
  "repeated-navigation": [
    {
      path: "src/pages/pricing/pricingCopy.ts",
      lines: [
        { type: "context", content: "  export const PRICING_TIERS = {" },
        { type: "context", content: "    starter: {" },
        { type: "remove", content: "      tagline: 'For small teams'," },
        { type: "add", content: "      tagline: 'For teams up to 5 people — includes all core features'," },
        { type: "context", content: "      price: 29," },
        { type: "context", content: "    }," },
        { type: "context", content: "    pro: {" },
        { type: "remove", content: "      tagline: 'For growing companies'," },
        { type: "add", content: "      tagline: 'For teams of 5–50 — advanced analytics, SSO, priority support'," },
        { type: "context", content: "      price: 99," },
        { type: "context", content: "    }," },
      ],
    },
  ],
};

function buildMockDiffFromSources(sources: Source[]): MockDiffFile[] {
  if (sources.includes("GitHub") || sources.includes("Sentry")) {
    return [
      {
        path: "src/middleware/errorBoundary.ts",
        lines: [
          { type: "context", content: "  export function withErrorBoundary<T>(fn: () => Promise<T>): Promise<T> {" },
          { type: "remove", content: "    return fn();" },
          { type: "add", content: "    return fn().catch((err) => {" },
          { type: "add", content: "      Sentry.captureException(err);" },
          { type: "add", content: "      throw err;" },
          { type: "add", content: "    });" },
          { type: "context", content: "  }" },
        ],
      },
    ];
  }
  return [
    {
      path: "src/analytics/trackEvent.ts",
      lines: [
        { type: "context", content: "  export function trackFunnelStep(step: string, props: Record<string, unknown>) {" },
        { type: "context", content: "    amplitude.track(`funnel_${step}`, {" },
        { type: "context", content: "      ...props," },
        { type: "add", content: "      timestamp: Date.now()," },
        { type: "add", content: "      sessionId: getSessionId()," },
        { type: "context", content: "    });" },
        { type: "context", content: "  }" },
      ],
    },
  ];
}

function buildSessionPRDescription(s: Session): string {
  return `## Problem
${s.flaggedReason ?? "User friction detected in session replay."}

${s.agentAnnotation ? `**AI Diagnosis:** ${s.agentAnnotation}\n` : ""}

## Impact
~${s.impactScore} users estimated affected
Path: \`${s.pageViews.join(" → ")}\`
Session: \`#${s.id}\` | Duration: ${Math.floor(s.duration / 60)}m ${s.duration % 60}s

## Fix
${s.issueType === "rage-click" ? "Added proper error handling and user feedback on async operation failure." : ""}
${s.issueType === "dead-click" ? "Removed feature flag guard blocking visible UI element. Added disabled state for empty data." : ""}
${s.issueType === "drop-off" ? "Added localStorage persistence so users can resume where they left off." : ""}
${s.issueType === "repeated-navigation" ? "Clarified pricing tier descriptions to reduce plan confusion." : ""}

## Testing
- [ ] Manually verify the fix resolves the session replay scenario
- [ ] Check no regression in related flows
- [ ] Confirm Sentry error rate drops after deploy

Linked: session-${s.id}`;
}

function buildRecPRDescription(r: Recommendation): string {
  return `## Problem
${r.headline}

**Impact:** ${r.impactStatement}

## Evidence
${r.evidenceSummary}

## Fix
${r.nextSteps.map((s) => `${s.order}. ${s.action} (${s.owner})`).join("\n")}

## What Happens if Ignored
${r.ignoreConsequence}

Linked: probe-${r.id}`;
}

export function buildMockPR(item: FeedItem): MockPR {
  const prNumber = Math.floor(Math.random() * 100) + 300;

  if (item.feedType === "friction-session") {
    const s = item.source;
    const slug = (s.flaggedReason ?? "fix-session")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(" ")
      .slice(0, 4)
      .join("-");
    return {
      branch: `probe/fix-${slug}`,
      prNumber,
      prTitle: `Fix: ${s.agentAnnotation?.split("—")[0]?.trim() ?? s.flaggedReason?.slice(0, 60) ?? "UX friction fix"}`,
      prDescription: buildSessionPRDescription(s),
      proposedDiff: s.issueType ? sessionDiffMap[s.issueType] : sessionDiffMap["drop-off"],
    };
  } else {
    const r = item.source;
    const slug = r.headline
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(" ")
      .slice(0, 4)
      .join("-");
    return {
      branch: `probe/${slug}`,
      prNumber,
      prTitle: `Fix: ${r.headline.slice(0, 70)}`,
      prDescription: buildRecPRDescription(r),
      proposedDiff: buildMockDiffFromSources(r.sources),
    };
  }
}
