export type Priority = "critical" | "high" | "medium";
export type Source = "Amplitude" | "GitHub" | "Sentry" | "Prometheus" | "UX";
export type Area =
  | "Acquisition"
  | "Activation"
  | "Retention"
  | "Revenue"
  | "Performance";

export type EvidenceStep = {
  source: Source;
  signal: string;
  timestamp?: string;
};

export type NextStep = {
  order: number;
  action: string;
  owner: "Engineering" | "PM" | "Design";
};

export type RelatedContext = {
  type: "retrospective" | "incident" | "decision";
  label: string;
  description: string;
};

export type Recommendation = {
  id: string;
  priority: Priority;
  headline: string;
  evidenceSummary: string;
  sources: Source[];
  confidence: number | null;
  confidenceReason: string;
  detectedAt: string;
  isNew: boolean;
  area: Area;
  impactStatement: string;
  diagnosis: string;
  evidenceChain: EvidenceStep[];
  nextSteps: NextStep[];
  relatedContext: RelatedContext[];
  ignoreConsequence: string;
  resolved?: boolean;
};

export const recommendations: Recommendation[] = [
  {
    id: "rec-1",
    priority: "critical",
    headline:
      "Mobile onboarding step 3 is broken for iOS 17.4 users — costing ~340 signups/week",
    evidenceSummary:
      "Correlated across Amplitude funnel data + Sentry null pointer spike + Prometheus (infra ruled out)",
    sources: ["Sentry", "Amplitude", "Prometheus"],
    confidence: 94,
    confidenceReason:
      "Three independent signals converge on the same user segment and time window. Prometheus data rules out infrastructure as a cause, which increases confidence that the issue is code-level. Amplitude shows a perfect 100% drop-off rate for this specific cohort since iOS 17.4 rollout.",
    detectedAt: "2026-02-29T09:14:00Z",
    isNew: false,
    area: "Activation",
    impactStatement: "Affecting ~340 iOS 17.4 users/week. Zero complete signups from this segment since March 1st.",
    diagnosis: `On Friday, March 1st at approximately 09:14 AM, Probe detected a sharp and complete drop-off at step 3 of the mobile onboarding funnel, isolated entirely to users running iOS 17.4. Amplitude's funnel analysis showed a 100% abandonment rate at this step for this segment, while users on other iOS versions continued to convert normally. The pattern emerged within hours of iOS 17.4 reaching significant adoption in your user base.

Sentry simultaneously recorded a spike in null pointer exceptions originating from the onboarding module — specifically in the permissions flow that requests camera and notification access. These errors map exactly to the step 3 UI, and the error volume correlates with the cohort size on iOS 17.4. Cross-referencing with Prometheus, Probe confirmed no latency degradation or backend errors on the onboarding API during this window, effectively ruling out infrastructure as a cause.

The evidence points to a client-side regression likely triggered by a breaking change in how iOS 17.4 handles permission request callbacks. A recent commit to the mobile onboarding module (4 days before the signal emerged) touched the permissions flow. This is a high-confidence, code-level bug that is silently blocking a significant and growing portion of new signups.`,
    evidenceChain: [
      {
        source: "Amplitude",
        signal: "100% drop-off at onboarding step 3 for iOS 17.4 segment",
        timestamp: "Mar 1, 09:14 AM",
      },
      {
        source: "Sentry",
        signal: "Spike: 217 null pointer exceptions in onboarding/permissions module",
        timestamp: "Mar 1, 09:18 AM",
      },
      {
        source: "Prometheus",
        signal: "No latency increase on /api/onboarding — infra ruled out",
        timestamp: "Mar 1, 09:22 AM",
      },
    ],
    nextSteps: [
      {
        order: 1,
        action:
          "Pull Sentry error traces and identify the exact line in the permissions callback causing the null pointer. Check for iOS 17.4 API changes in the permission request flow.",
        owner: "Engineering",
      },
      {
        order: 2,
        action:
          "Verify fix with a targeted Amplitude funnel check on the iOS 17.4 segment within 24 hours of deploy.",
        owner: "PM",
      },
      {
        order: 3,
        action:
          "Add a Sentry alert for null pointer errors in the onboarding module with a threshold of >10 errors/hour.",
        owner: "Engineering",
      },
    ],
    relatedContext: [
      {
        type: "incident",
        label: "Similar iOS permission crash — Nov 2023",
        description:
          "iOS 17.0 introduced a similar breaking change to the AVCaptureDevice permission API. That incident took 3 days to resolve and affected ~180 users. Fix pattern: add nil guard before calling the completion handler.",
      },
      {
        type: "retrospective",
        label: "Onboarding V2 Retro — Jan 2024",
        description:
          "The onboarding step 3 redesign in January noted that iOS permission handling was 'fragile and needs better error boundaries.' That tech debt was deferred. This may be the downstream consequence.",
      },
    ],
    ignoreConsequence:
      "At current rates, this will block ~340 additional signups per week. Over the next 7 days, that's ~340 users who will never activate — compounding churn risk before they even reach your product.",
    resolved: false,
  },
  {
    id: "rec-2",
    priority: "critical",
    headline:
      "Checkout completion dropped 18% — likely a deploy issue, not UX",
    evidenceSummary:
      "GitHub deploy 4 days ago touched payments service + Prometheus latency spike + Amplitude drop began within 2hrs",
    sources: ["GitHub", "Prometheus", "Amplitude"],
    confidence: 91,
    confidenceReason:
      "The temporal correlation between the deploy event, the Prometheus latency spike, and the Amplitude drop-off is extremely tight (under 2 hours). This pattern — deploy → latency → conversion drop — is a strong signature of a backend regression rather than a UX or organic trend change.",
    detectedAt: "2026-02-27T14:30:00Z",
    isNew: false,
    area: "Revenue",
    impactStatement: "Estimated $12,400 weekly revenue impact. 18% fewer checkouts completing compared to pre-deploy baseline.",
    diagnosis: `On Tuesday, February 25th at 3:12 PM, a deploy to the payments service was pushed that included a modification to the token refresh logic used during checkout sessions. Within 2 hours of that deploy going live, Amplitude recorded an 18% drop in checkout completion rates. This timing is not coincidental — the drop was statistically abrupt, not gradual, which is characteristic of a code regression rather than an organic behavioral shift.

Prometheus confirmed a latency increase of 340ms on the /api/checkout endpoint beginning at 5:08 PM on the same day. This latency increase persisted and is still present. Sentry logged 47 new timeout errors on the /api/checkout endpoint during this window, with the error message "token refresh timeout after 5000ms." The errors spike during peak traffic hours, suggesting the issue becomes more severe under load.

The most likely root cause is that the token refresh logic introduced a blocking call that adds latency to every checkout request. Under normal traffic this may cause occasional timeouts; under peak load, the timeout rate increases significantly, causing users to see a failed checkout state. Many users abandon rather than retry. This is a backend regression with measurable, ongoing revenue impact.`,
    evidenceChain: [
      {
        source: "GitHub",
        signal: "Deploy to payments-service: modified token refresh logic in checkout flow",
        timestamp: "Feb 25, 3:12 PM",
      },
      {
        source: "Prometheus",
        signal: "+340ms latency on /api/checkout — persisting since deploy",
        timestamp: "Feb 25, 5:08 PM",
      },
      {
        source: "Amplitude",
        signal: "Checkout completion rate drops 18% vs. prior 14-day baseline",
        timestamp: "Feb 25, 5:22 PM",
      },
    ],
    nextSteps: [
      {
        order: 1,
        action:
          "Page the backend team to review the February 25th payments service deploy. Focus on the token refresh change — likely a blocking async call needs to be made non-blocking.",
        owner: "Engineering",
      },
      {
        order: 2,
        action:
          "Confirm fix by monitoring the /api/checkout latency in Prometheus and the checkout funnel in Amplitude within 1 hour of any patch deploy.",
        owner: "PM",
      },
      {
        order: 3,
        action:
          "Add a Sentry alert for checkout timeout errors exceeding 10/hour. Add a Prometheus alert for /api/checkout p95 latency exceeding 500ms.",
        owner: "Engineering",
      },
    ],
    relatedContext: [
      {
        type: "incident",
        label: "Payments latency incident — Oct 2023",
        description:
          "A similar token refresh regression in October 2023 caused a 22% checkout drop over 48 hours before it was identified. Resolution required rolling back a single commit. Post-mortem recommended adding latency monitoring to all payment endpoints — that work was not completed.",
      },
      {
        type: "decision",
        label: "Slack: 'Defer checkout monitoring dashboard' — Dec 2023",
        description:
          "In December, the team decided to defer building a real-time checkout health dashboard due to Q4 priorities. This incident would likely have been caught within minutes with that tooling.",
      },
    ],
    ignoreConsequence:
      "At $12,400/week in lost revenue, every additional day costs approximately $1,770. Over the next 7 days without intervention, estimated cumulative revenue loss is ~$86,800.",
    resolved: false,
  },
  {
    id: "rec-3",
    priority: "high",
    headline:
      "Users who don't complete email verification churn at 3× the rate — 24hr reminder could close the gap",
    evidenceSummary:
      "Amplitude cohort analysis + retention data show a stark and persistent churn differential",
    sources: ["Amplitude"],
    confidence: 82,
    confidenceReason:
      "The cohort analysis is based on 90 days of data and 2,400+ users, giving strong statistical power. The 3× churn differential is consistent across monthly cohorts. Confidence is capped at 82% because the causal direction is not fully established — it's possible that users who are less engaged are both less likely to verify email AND more likely to churn, rather than email verification itself being the lever.",
    detectedAt: "2026-03-01T11:00:00Z",
    isNew: true,
    area: "Retention",
    impactStatement:
      "Unverified users churn at 3× the rate of verified users within the first 30 days. ~28% of signups currently never complete email verification.",
    diagnosis: `Probe's cohort analysis across the past 90 days reveals a stark and persistent pattern: users who complete email verification within 48 hours of signup retain at dramatically higher rates than those who don't. The 30-day retention rate for verified users is 61%; for unverified users, it's 21% — a 3× churn multiplier.

Approximately 28% of new signups never complete email verification. The drop-off in verification is highest between hours 4 and 48 after signup, suggesting that users who don't verify quickly tend not to come back. The current verification email is sent once at signup with no follow-up.

The suggested intervention — a single reminder email at the 24-hour mark — is a low-effort, high-confidence test. If the reminder nudges even 20% of currently-unverified users to verify, and those users retain at the verified-user rate, the projected improvement in 30-day retention is approximately 4-5 percentage points. This hypothesis should be validated with an A/B test before full rollout.`,
    evidenceChain: [
      {
        source: "Amplitude",
        signal: "Cohort analysis: 61% vs 21% 30-day retention (verified vs unverified)",
        timestamp: "90-day rolling window",
      },
      {
        source: "Amplitude",
        signal: "28% of signups never complete email verification",
        timestamp: "90-day rolling window",
      },
      {
        source: "Amplitude",
        signal: "Verification drop-off highest between hours 4–48 post-signup",
        timestamp: "90-day rolling window",
      },
    ],
    nextSteps: [
      {
        order: 1,
        action:
          "Design a 24-hour verification reminder email. Keep it short — one CTA, no upsell. Test subject lines: 'One step left' vs 'Finish setting up your account'.",
        owner: "PM",
      },
      {
        order: 2,
        action:
          "Implement a 24hr reminder trigger in the email service. Gate it behind a feature flag for A/B testing.",
        owner: "Engineering",
      },
      {
        order: 3,
        action:
          "Run the experiment for 4 weeks. Primary metric: email verification completion rate. Secondary: 30-day retention of users who received the reminder.",
        owner: "PM",
      },
    ],
    relatedContext: [
      {
        type: "decision",
        label: "Slack: Email verification UX deferred — Q3 2023",
        description:
          "The team discussed improving the verification flow in Q3 2023 but deprioritized it in favor of the onboarding redesign. The data now shows this was a costly deferral.",
      },
    ],
    ignoreConsequence:
      "Each week, ~28% of new signups go unverified. At current signup volume and the 3× churn differential, this represents an ongoing, compounding retention leak that widens as the unverified cohort accumulates.",
    resolved: false,
  },
  {
    id: "rec-4",
    priority: "high",
    headline:
      "Dashboard V2 is underused — most users revert to the old view within 30 seconds",
    evidenceSummary:
      "12% feature adoption after 6 weeks + session replay shows users navigating back within 30s",
    sources: ["Amplitude", "UX"],
    confidence: 78,
    confidenceReason:
      "Adoption data is clear and consistent (12% after 6 weeks is well below the 35% adoption target). Session replay behavioral data corroborates abandonment. Confidence is 78% rather than higher because we don't yet know why users are reverting — it could be discoverability, learning curve, or genuine preference. Discovery interviews are needed before investing further.",
    detectedAt: "2026-03-02T08:00:00Z",
    isNew: true,
    area: "Activation",
    impactStatement:
      "Dashboard V2 adoption is 12% after 6 weeks, vs. a 35% target. Engineering investment at risk of going unused.",
    diagnosis: `Dashboard V2 shipped 6 weeks ago with the expectation of reaching 35% adoption within the first month. Current adoption stands at 12% — significantly below target with no upward trend in the past two weeks. The feature is not failing to launch; it's launching and then being immediately abandoned.

Session replay analysis reveals a consistent behavior pattern: users land on Dashboard V2 (often via a prompt or notification), spend an average of 28 seconds exploring, and then navigate back to the classic dashboard. This behavior is observed across user segments and geographies, ruling out localization or segment-specific issues.

The critical unknown is why. The 28-second average session on V2 is too short to encounter a genuine usability blocker — it suggests the layout or information architecture is unfamiliar enough to cause users to disengage before they find value. This is a discovery and onboarding problem, but it could also indicate that V2 doesn't solve a real user need. Discovery interviews with both adopters and non-adopters should precede any further V2 investment.`,
    evidenceChain: [
      {
        source: "Amplitude",
        signal: "Dashboard V2 adoption: 12% (target: 35%) after 6 weeks",
        timestamp: "6-week rolling window",
      },
      {
        source: "UX",
        signal: "Session replay: avg 28s on V2 before reverting to classic view",
        timestamp: "Past 2 weeks",
      },
      {
        source: "Amplitude",
        signal: "No upward adoption trend in past 14 days — plateau, not growth",
        timestamp: "Past 14 days",
      },
    ],
    nextSteps: [
      {
        order: 1,
        action:
          "Schedule 5 discovery interviews with users who tried V2 and reverted. Ask: What were you looking for? What made you go back? What would need to be true for you to switch?",
        owner: "PM",
      },
      {
        order: 2,
        action:
          "Pause further V2 feature development until interview findings are synthesized. Avoid sunk-cost investment.",
        owner: "PM",
      },
      {
        order: 3,
        action:
          "Add a feedback widget to the V2 dashboard — a single question: 'What's missing from this view?' Collect data for 2 weeks.",
        owner: "Design",
      },
    ],
    relatedContext: [
      {
        type: "retrospective",
        label: "Dashboard V1 Launch Retro — 2022",
        description:
          "When Dashboard V1 launched, adoption was also slow (9% in month one) but accelerated after a targeted onboarding flow was added. V2 may need a similar guided introduction rather than a passive rollout.",
      },
    ],
    ignoreConsequence:
      "Without understanding why V2 is being abandoned, continued investment could result in a feature that never reaches critical mass, while the engineering resources spent on it could have addressed higher-confidence opportunities.",
    resolved: false,
  },
  {
    id: "rec-5",
    priority: "medium",
    headline:
      "Power users are hitting API rate limits — creating friction right before expansion revenue",
    evidenceSummary:
      "Prometheus rate limit events correlate with engagement plateau in Amplitude's high-activity user cohort",
    sources: ["Prometheus", "Amplitude"],
    confidence: 73,
    confidenceReason:
      "The correlation between rate limit events and engagement plateaus is present but not perfectly tight — some high-activity users plateau without hitting rate limits. Confidence is 73% because we can't yet confirm that surfacing an upgrade prompt at the rate limit moment will convert, though the intent signal is strong.",
    detectedAt: "2026-03-01T15:00:00Z",
    isNew: false,
    area: "Revenue",
    impactStatement:
      "~40 power users/month are hitting rate limits. These users have the highest engagement scores and represent the strongest expansion revenue signal.",
    diagnosis: `Prometheus logs show that approximately 40 users per month are hitting API rate limits — and these are not casual users. Cross-referencing with Amplitude's engagement scores, these are the top 5% of active users by feature usage, session frequency, and API call volume.

The problem: when a power user hits a rate limit, they receive a generic 429 error with no clear path forward. Amplitude data shows that high-activity users who hit rate limits show a measurable engagement plateau in the 7 days following their first rate limit event. This is the product's ceiling creating a ceiling in user growth.

The opportunity is significant. These users are already sold on the product — they're hitting limits precisely because they're getting value. Surfacing an upgrade prompt at the moment of rate limit friction (with clear framing: "You've hit your plan limit — upgrade to remove it") converts intent into revenue at the highest-probability moment.`,
    evidenceChain: [
      {
        source: "Prometheus",
        signal: "~40 users/month receiving 429 rate limit responses",
        timestamp: "Past 30 days",
      },
      {
        source: "Amplitude",
        signal: "Rate-limited users are in top 5% by engagement score",
        timestamp: "Past 30 days",
      },
      {
        source: "Amplitude",
        signal: "Engagement plateau observed in 7 days following first rate limit event",
        timestamp: "Past 60 days",
      },
    ],
    nextSteps: [
      {
        order: 1,
        action:
          "Design an in-product upgrade prompt that surfaces when a user receives a rate limit response. Framing: show remaining quota + upgrade CTA. Do not show a generic error.",
        owner: "Design",
      },
      {
        order: 2,
        action:
          "Implement the upgrade prompt behind a feature flag. Log impressions and clicks as a conversion funnel in Amplitude.",
        owner: "Engineering",
      },
      {
        order: 3,
        action:
          "Review Prometheus rate limit logs to identify if any users are hitting limits due to misconfigured integrations vs. genuine high usage — and segment the upgrade prompt accordingly.",
        owner: "PM",
      },
    ],
    relatedContext: [
      {
        type: "decision",
        label: "Pricing retro: 'Rate limits are a good expansion signal' — Q2 2023",
        description:
          "In Q2 2023, the pricing team noted that users who hit rate limits had 3× higher upgrade conversion when contacted by sales. This is an opportunity to automate what sales is doing manually.",
      },
    ],
    ignoreConsequence:
      "Each month, ~40 high-intent users hit a wall with no upgrade path. Some will find workarounds, but others will begin evaluating alternatives. This is the most expensive moment to lose a user.",
    resolved: false,
  },
  {
    id: "rec-6",
    priority: "medium",
    headline:
      "'Invite teammate' flow has 67% abandonment — simplification could unlock viral growth",
    evidenceSummary:
      "Amplitude funnel shows drop-off at role-selection step; simplifying to single email input is the hypothesis",
    sources: ["Amplitude"],
    confidence: 88,
    confidenceReason:
      "The funnel data is clean and the drop-off point is clear and consistent: 67% of users who begin the invite flow abandon at the role selection step. This is a high-confidence signal. The suggested fix (removing role selection) is low-risk. Confidence is 88% rather than higher because we haven't yet tested whether removing role selection affects downstream collaboration quality.",
    detectedAt: "2026-02-28T10:00:00Z",
    isNew: false,
    area: "Acquisition",
    impactStatement:
      "67% of users who start an invite flow abandon before completing it. Virality coefficient is suppressed by a friction point that may be unnecessary.",
    diagnosis: `The 'Invite teammate' flow is a core viral loop for Probe — users who successfully invite teammates have significantly higher retention and expansion revenue. But Amplitude's funnel analysis reveals that 67% of users who begin the invite flow never complete it, abandoning at the role selection step.

The role selection step asks users to assign a permission level (Admin, Editor, Viewer) before sending an invite. This is a decision that most users aren't prepared to make mid-flow — they want to invite someone quickly, and being asked to make a permissions decision creates enough friction to cause abandonment. Many users likely don't know the difference between permission levels at this stage.

The hypothesis: removing role selection from the invite flow (defaulting new invitees to a sensible default like "Editor") and allowing permission adjustments post-invite would reduce abandonment significantly. This is a common pattern in collaboration tools (Notion, Figma, Linear) and requires minimal engineering effort to test.`,
    evidenceChain: [
      {
        source: "Amplitude",
        signal: "Invite flow funnel: 67% abandonment specifically at role-selection step",
        timestamp: "Past 60 days",
      },
      {
        source: "Amplitude",
        signal: "Users who complete invites have 2.4× higher 90-day retention",
        timestamp: "Past 90 days",
      },
    ],
    nextSteps: [
      {
        order: 1,
        action:
          "Redesign the invite flow: remove role selection, default to 'Editor' permission, add a note 'You can adjust permissions after they join.' Test with a simple A/B experiment.",
        owner: "Design",
      },
      {
        order: 2,
        action:
          "Implement the simplified invite flow behind a feature flag. Primary metric: invite completion rate. Secondary: invitee accept rate.",
        owner: "Engineering",
      },
      {
        order: 3,
        action:
          "Monitor whether defaulting to Editor causes any downstream permission disputes or support tickets. Track for 4 weeks post-launch.",
        owner: "PM",
      },
    ],
    relatedContext: [
      {
        type: "decision",
        label: "Invite flow design discussion — Slack, Aug 2023",
        description:
          "In August 2023, the team added role selection to the invite flow based on an enterprise customer request. The decision was made without A/B testing the impact on invite completion. This data suggests it may have been net negative for the majority of users.",
      },
    ],
    ignoreConsequence:
      "At current signup volume, the 67% abandonment rate means roughly 2 out of 3 invite attempts never complete. Every week this persists, the virality coefficient remains suppressed and the organic growth flywheel turns more slowly.",
    resolved: false,
  },
  {
    id: "rec-7",
    priority: "medium",
    headline:
      "3 new error patterns in Sentry are unlinked to any ticket — ownership unclear",
    evidenceSummary:
      "Sentry flagged 3 distinct error clusters in the past 5 days with no corresponding Jira ticket or assigned owner",
    sources: ["Sentry"],
    confidence: null,
    confidenceReason:
      "This recommendation requires human triage before a confidence score is meaningful. The errors are real and present, but their severity and root cause can only be determined by an engineer reviewing the stack traces. Probe has flagged them so they don't fall through the cracks.",
    detectedAt: "2026-03-02T16:00:00Z",
    isNew: true,
    area: "Performance",
    impactStatement:
      "3 untracked error patterns with no owner. Unknown user impact until triaged.",
    diagnosis: `Sentry has recorded 3 distinct error clusters in the past 5 days that have not been linked to any Jira ticket and have no assigned owner. These errors are not yet generating high volume, but they are new patterns — meaning they either represent regressions from recent deploys or emerging edge cases that were not previously triggered.

The three patterns are: (1) A "NullPointerException in UserPreferencesService" occurring ~12 times/day, predominantly for users in the EU region; (2) A "Timeout: database connection pool exhausted" error in the reporting service, occurring ~8 times/day during business hours; (3) A "Failed to parse response: unexpected token" in the third-party analytics integration, occurring ~5 times/day with no clear user segment pattern.

None of these are currently at a severity that would page on-call, which is precisely why they haven't been caught. But left untracked, low-volume errors can become high-volume incidents. The right action is human triage to assess severity, identify root cause, and either create a ticket or close as won't-fix with documentation.`,
    evidenceChain: [
      {
        source: "Sentry",
        signal: "NullPointerException in UserPreferencesService — ~12/day, EU users",
        timestamp: "Past 5 days",
      },
      {
        source: "Sentry",
        signal: "Database connection pool exhaustion in reporting service — ~8/day",
        timestamp: "Past 5 days",
      },
      {
        source: "Sentry",
        signal: "Failed to parse response in analytics integration — ~5/day",
        timestamp: "Past 5 days",
      },
    ],
    nextSteps: [
      {
        order: 1,
        action:
          "Assign an engineer to review each of the 3 Sentry error clusters. For each: determine if it's a regression, assess user impact, and either create a Jira ticket or document as won't-fix.",
        owner: "Engineering",
      },
      {
        order: 2,
        action:
          "Review the Sentry alert configuration — these error patterns should have surfaced in a weekly error triage process. If that process doesn't exist, create one.",
        owner: "PM",
      },
      {
        order: 3,
        action:
          "Set volume thresholds in Sentry so that any new error pattern exceeding 5 occurrences/day without a linked ticket triggers a Slack notification to the on-call channel.",
        owner: "Engineering",
      },
    ],
    relatedContext: [
      {
        type: "retrospective",
        label: "Payment timeout incident post-mortem — Oct 2023",
        description:
          "The October 2023 payments incident started as a low-volume Sentry error that went untracked for 5 days before reaching critical volume. The post-mortem recommended an error triage cadence, which has not been consistently followed.",
      },
    ],
    ignoreConsequence:
      "Low-volume errors have a history of becoming high-volume incidents in this codebase (see: October 2023). Three untracked error patterns represent three unknown risks. The cost of triage now is an hour; the cost of an incident later is potentially days.",
    resolved: false,
  },
];
