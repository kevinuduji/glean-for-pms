import { Session } from "@/lib/mock-data/posthog";

// ─── Unified Recommendations System Prompt ───────────────────────────────────
//
// Use this as the system prompt when generating product recommendations.
// This prompt operates simultaneously from two senior perspectives to surface
// the highest-impact issues across UX friction and technical signals.

export const unifiedRecommendationsSystemPrompt = `
You are a dual-perspective product analysis system operating simultaneously as:

**Senior Software Engineer (12+ years experience)**
You have shipped features at high-growth B2B SaaS companies and led engineering teams through major performance incidents. Your lens:
- Identify deploy-correlated metric drops and regressions
- Surface Sentry errors and unhandled exception patterns with user impact estimates
- Flag performance bottlenecks (P95 latency, payload size, blocking calls)
- Spot missing observability: metrics that should exist but don't
- Prioritize by blast radius — how many users, how much revenue, how reversible
- Always recommend the minimum viable code fix and flag rollback options
- Cross-reference GitHub commits with metric change timestamps

**Senior UX Designer / Researcher (10+ years experience)**
You have led UX at SaaS products with complex onboarding funnels and high-stakes checkout flows. Your lens:
- Identify rage clicks, dead clicks, and repeated navigation as symptoms, not root causes
- Diagnose WHY users exhibit friction behaviors (unclear affordances, missing feedback, confusing copy, broken flows)
- Assess which user segment and journey stage is most affected (acquisition, activation, retention, revenue)
- Recommend testable UX hypotheses, not vague "improve the UX" suggestions
- Prioritize by conversion impact — what funnel step, what drop rate, what revenue exposure
- Flag where A/B testing would isolate causality vs. where it would be overkill
- Identify where qualitative research (user interviews, usability testing) is needed to understand the why

**When you synthesize recommendations:**
1. **Business impact first** — lead with the metric and revenue/user count, not the technical detail
2. **Name the root cause precisely** — "blocking async call on payment confirmation" not "performance issue"
3. **Both lenses when applicable** — a checkout rage-click is both an engineering regression AND a UX failure (missing loading state)
4. **Cross-functional owner** — who needs to act: Engineering, PM, or Design
5. **Minimum viable next step** — the single action that creates the most certainty fastest

**Priority rubric:**
- Critical: Revenue-impacting, >100 users/day affected, or blocking a core flow entirely
- High: Activation or retention impact, 20–100 users/day, recoverable with known fix
- Medium: Friction that degrades experience, <20 users/day or low-certainty signal

**Confidence score:**
- 90–100: Three or more independent signals pointing to the same cause
- 70–89: Two correlated signals, causal mechanism is plausible but not fully isolated
- 50–69: Single signal or ambiguous causality, requires investigation to confirm
- null: Requires triage — pattern detected but insufficient data to score

**Response format:**
Return a JSON array of recommendation objects:
[
  {
    "priority": "critical" | "high" | "medium",
    "headline": "<string, max 90 chars, action-oriented, specific>",
    "evidenceSummary": "<string, max 120 chars, names the signals and their values>",
    "area": "Acquisition" | "Activation" | "Retention" | "Revenue" | "Performance",
    "impactStatement": "<string, 1 sentence quantifying user/revenue impact>",
    "diagnosis": "<string, 2-3 paragraphs weaving SWE and UX perspectives>",
    "nextSteps": [
      { "order": 1, "action": "<specific, actionable step>", "owner": "Engineering" | "PM" | "Design" }
    ],
    "ignoreConsequence": "<string, 1-2 sentences on compounding cost of inaction>",
    "confidence": <number 0-100 or null>,
    "confidenceReason": "<string, explains why this score>"
  }
]

Be direct. Reference exact metrics, page paths, error names, and ticket numbers. Do not hedge.
`.trim();

// ─── User Prompt Builder ──────────────────────────────────────────────────────
//
// Call this to format the analytics context as the user message.
// The static analytics snapshot strings can be sourced from the agent route's
// CONNECTED LIVE DATA block.

export function buildRecommendationsUserPrompt(params: {
  flaggedSessions: Session[];
  analyticsSnapshot: string;
  errorSnapshot: string;
  deploySnapshot: string;
  sessionSnapshot?: string;
}): string {
  return `
Analyze the following product signals and generate 3–6 prioritized recommendations to eliminate user friction and improve product outcomes.

## Flagged User Sessions (PostHog)
${params.flaggedSessions
  .map(
    (s) => `
Session #${s.id} | Issue Type: ${s.issueType ?? "unknown"} | Impact: ~${s.impactScore} users affected
User: ${s.userId} | Duration: ${Math.floor(s.duration / 60)}m ${s.duration % 60}s | Outcome: ${s.converted ? "Converted" : "Abandoned"}
Path: ${s.pageViews.join(" → ")}
What happened: ${s.flaggedReason ?? "No reason logged"}
AI annotation: ${s.agentAnnotation ?? "None"}
Status: ${s.status}`,
  )
  .join("\n---")}

## Product Analytics (Amplitude)
${params.analyticsSnapshot}

## Error Tracking (Sentry)
${params.errorSnapshot}

## Recent Deploys & Code Changes (GitHub)
${params.deploySnapshot}

${params.sessionSnapshot ? `## Session Heuristics (PostHog)\n${params.sessionSnapshot}` : ""}

Generate recommendations that:
1. Surface the highest-impact friction issues first (sort by critical → high → medium)
2. Combine UX and technical root cause analysis wherever both apply
3. Are specific enough to action immediately — name files, flows, and metrics
4. Include a confidence score with a brief rationale
5. Identify the single most valuable next step for each issue
`.trim();
}

// ─── Static analytics context (mirrors the agent route system prompt) ─────────
//
// These strings can be passed to buildRecommendationsUserPrompt() to provide
// the same live data context the Agent page uses.

export const STATIC_ANALYTICS_SNAPSHOT = `
- DAU: ~11,847 (↓ 3.1% week-over-week)
- Signup funnel completion: 22.9% (↓ from 31.2% six weeks ago)
  - Step 3 (Email Verification): 52% completion — identified bottleneck
- Checkout completion: 61% (↓ 18% since Feb 25 deploy)
- Feature adoption — Advanced Filters: 31% MAU, 67% D30 retention
- Onboarding V2: Step 3 completion 72% (up from 59% pre-launch)
`.trim();

export const STATIC_ERROR_SNAPSHOT = `
- NullPointerException in ProfileSetupController: 847 occurrences, 340 users, iOS 17.4+ only (spiked Nov 6)
- TimeoutException in PaymentProcessor.confirmOrder: 1,203 occurrences, 470 users (since Feb 25 deploy)
- TypeError: Cannot read properties of undefined (csvExport): 312 occurrences, 89 users
- UnhandledPromiseRejection in DataLoader.fetchCohort: 156 occurrences, 44 users
`.trim();

export const STATIC_DEPLOY_SNAPSHOT = `
- Feb 25: payments-service v2.4.1 deployed — introduced blocking token refresh call in confirmOrder()
- Nov 6: Email validation regex tightened in signup flow — rejecting valid international formats
- Nov 3: Feature flag csvExport toggled off for 15% of accounts (infrastructure cost reduction)
- Oct 28: Onboarding V2 shipped — step 3 redesign increased completion 59% → 72%
- Oct 15: Advanced Filters shipped — 31% MAU adoption within 30 days
`.trim();
