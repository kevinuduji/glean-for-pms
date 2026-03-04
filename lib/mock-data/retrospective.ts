// ─── Types ────────────────────────────────────────────────────────────────────

export type Verdict = "met" | "partial" | "missed";

export type MetricRow = {
  label: string;
  before: string;
  after: string;
  delta: string;
  deltaPositive: boolean;
  isPrimary: boolean;
};

export type ThreadItem = {
  author: string;
  avatarInitial: string;
  avatarColor: string; // Tailwind bg class e.g. "bg-violet-500"
  text: string;
  timestamp: string;
  source: "slack" | "jira";
  reactions?: { emoji: string; count: number }[];
};

export type RetroFeature = {
  id: string;
  name: string;
  shipDate: string;
  shipDateRelative: string;
  originalGoal: string;
  jiraTicket: string;
  owningTeam: string;
  verdict: Verdict;
  verdictSummary: string;
  metrics: MetricRow[];
  narrativeBullets: string[];
  thread: ThreadItem[];
  lessons: string[];
  roadmapInitiative: string;
  roadmapEpic: string;
  roadmapConnection: string;
  roadmapInfluenceCount: number;
  generatedAt: string;
  version: string;
  quarter: string;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const retroFeatures: RetroFeature[] = [
  // ── 1. Onboarding Redesign — Partially Met ────────────────────────────────
  {
    id: "retro-001",
    name: "Onboarding Redesign",
    shipDate: "Nov 4, 2023",
    shipDateRelative: "3 months ago",
    originalGoal:
      "Reduce onboarding drop-off at Step 3 (profile setup) by 20pp and increase Day-7 retention by 5pp.",
    jiraTicket: "PM-280",
    owningTeam: "Growth",
    verdict: "partial",
    verdictSummary:
      "Step 3 drop-off improved by 13pp but D7 retention only moved +2pp — activation lifted, retention did not follow.",
    version: "v2.3.0",
    quarter: "Q4 2023",
    metrics: [
      {
        label: "Step 3 Completion Rate",
        before: "59%",
        after: "72%",
        delta: "+13pp",
        deltaPositive: true,
        isPrimary: true,
      },
      {
        label: "Day-7 Retention",
        before: "31%",
        after: "33%",
        delta: "+2pp",
        deltaPositive: true,
        isPrimary: false,
      },
      {
        label: "Full Onboarding Completion",
        before: "28.7%",
        after: "31.2%",
        delta: "+2.5pp",
        deltaPositive: true,
        isPrimary: false,
      },
      {
        label: "Time-to-First-Action (median)",
        before: "9m 14s",
        after: "7m 52s",
        delta: "−1m 22s",
        deltaPositive: true,
        isPrimary: false,
      },
    ],
    narrativeBullets: [
      "The 3-field form removed the two fields with the highest abandonment rates (company size and role title), directly explaining the step-3 completion lift.",
      "D7 retention barely moved because users who skipped profile fields were less likely to engage with team-based features — onboarding completion is a leading indicator, not a retention lever on its own.",
      "The 'Complete later' path was used by 38% of users who reached step 3, suggesting the default experience still has friction that users are deferring rather than resolving.",
      "Mobile users saw a disproportionate benefit: step-3 completion on mobile jumped from 41% to 61%, likely due to reduced form fatigue on small keyboards.",
    ],
    thread: [
      {
        author: "Marcus Webb",
        avatarInitial: "M",
        avatarColor: "bg-blue-500",
        source: "slack",
        text: "Shipping the 3-field form at 100% today. Step 3 was our biggest single drop-off point and this is the cleanest fix. The 'Complete later' option is a crutch but necessary to unblock activation.",
        timestamp: "Nov 4, 9:14 AM",
        reactions: [
          { emoji: "🚀", count: 7 },
          { emoji: "✅", count: 4 },
        ],
      },
      {
        author: "Priya Nair",
        avatarInitial: "P",
        avatarColor: "bg-emerald-500",
        source: "slack",
        text: "The tradeoff: we're collecting less data upfront. We'll need a progressive re-prompt in-app once users hit a feature that needs the missing fields. Filed PM-297 for that.",
        timestamp: "Nov 4, 9:31 AM",
        reactions: [{ emoji: "👍", count: 3 }],
      },
      {
        author: "PM-280",
        avatarInitial: "J",
        avatarColor: "bg-blue-700",
        source: "jira",
        text: "Ticket closed. Reduced mandatory fields from 7 to 3. Acceptance criteria met. Follow-on: PM-297 (progressive disclosure for deferred fields), PM-305 (re-prompt logic).",
        timestamp: "Nov 3, 5:02 PM",
        reactions: [],
      },
    ],
    lessons: [
      "Activation metrics (funnel completion) and retention metrics (D7, D30) decouple easily — ship activation wins but always instrument a retention cohort before declaring victory.",
      "The 'Complete later' escape hatch should be treated as technical debt: track its usage rate and build a re-prompt path within 2 sprints of launch, not as a follow-on someday item.",
      "Mobile-specific impact was never in the original success criteria. Add device-segmented hypotheses to the template for any form-facing change.",
    ],
    roadmapInitiative: "Q1 Retention Sprint",
    roadmapEpic: "EP-08",
    roadmapConnection:
      "The D7 gap here directly motivates the in-app re-engagement drip campaign in EP-08, targeting users who used 'Complete later' at Step 3.",
    roadmapInfluenceCount: 2,
    generatedAt: "2024-02-04T09:12:00Z",
  },

  // ── 2. Dashboard V2 — Goal Met ────────────────────────────────────────────
  {
    id: "retro-002",
    name: "Dashboard V2",
    shipDate: "Dec 18, 2023",
    shipDateRelative: "6 weeks ago",
    originalGoal:
      "Increase daily dashboard visits per active user from 1.4 to 2.0 and reduce support tickets about 'can't find X' by 30%.",
    jiraTicket: "PM-301",
    owningTeam: "Core Product",
    verdict: "met",
    verdictSummary:
      "Daily dashboard visits reached 2.3 (target: 2.0) and nav-confusion tickets dropped 41% — both primary goals exceeded.",
    version: "v2.4.0",
    quarter: "Q4 2023",
    metrics: [
      {
        label: "Daily Dashboard Visits / Active User",
        before: "1.4",
        after: "2.3",
        delta: "+0.9",
        deltaPositive: true,
        isPrimary: true,
      },
      {
        label: "Support Tickets: Navigation Confusion",
        before: "47 / week",
        after: "28 / week",
        delta: "−41%",
        deltaPositive: true,
        isPrimary: false,
      },
      {
        label: "Feature Discovery Rate (clicked w/in 7d)",
        before: "18%",
        after: "29%",
        delta: "+11pp",
        deltaPositive: true,
        isPrimary: false,
      },
      {
        label: "Page Load Time (P75)",
        before: "1,840ms",
        after: "2,210ms",
        delta: "+370ms",
        deltaPositive: false,
        isPrimary: false,
      },
    ],
    narrativeBullets: [
      "The persistent widget rail drove 60% of the additional daily visits — users returned specifically to check pinned widgets, creating a pull-to-return loop that didn't exist before.",
      "The load time regression (+370ms at P75) is a real concern that partially offsets the engagement gains; it correlates with the new server-side personalization layer added for widget ordering.",
      "Support ticket reduction exceeded target because the global search bar resolved a class of 'hidden feature' tickets that were never navigation problems — users just didn't know features existed.",
      "Power users (top 20% by session frequency) increased visits from 3.8 to 5.1/day; casual users barely moved (1.1 to 1.3). Gains are concentrated in users already engaged.",
    ],
    thread: [
      {
        author: "Lena Kovacs",
        avatarInitial: "L",
        avatarColor: "bg-pink-500",
        source: "slack",
        text: "V2 is live. We kept the legacy layout toggle for 30 days — expect a gradual migration rather than a cliff. Monitoring rage-clicks on the new nav for the first 72h.",
        timestamp: "Dec 18, 10:45 AM",
        reactions: [
          { emoji: "🎉", count: 12 },
          { emoji: "🚢", count: 5 },
        ],
      },
      {
        author: "Sarah Chen",
        avatarInitial: "S",
        avatarColor: "bg-teal-500",
        source: "slack",
        text: "Heads up: P75 load time is 2.2s in staging with the personalization service on. We shipped it but opened PM-318 to optimize the SSR personalization query — this will bite us at scale.",
        timestamp: "Dec 17, 4:22 PM",
        reactions: [{ emoji: "👀", count: 3 }],
      },
      {
        author: "PM-301",
        avatarInitial: "J",
        avatarColor: "bg-blue-700",
        source: "jira",
        text: "Dashboard V2 shipped. Known issue: SSR personalization adds ~370ms to P75 load. Follow-on PM-318 (performance) and PM-320 (deprecate legacy toggle in March).",
        timestamp: "Dec 18, 11:00 AM",
        reactions: [],
      },
    ],
    lessons: [
      "Always add a P75/P95 load time row to the success criteria table before shipping any server-side personalization change — performance regressions shipping under the radar erode trust.",
      "The power-user concentration in the engagement gains suggests Dashboard V2 optimized for the wrong segment. The next iteration should focus on casual user re-engagement, not richer widgets for power users.",
      "Keeping a legacy toggle is good for risk management but complicates instrumentation — two surfaces, two event schemas. Plan the deprecation date before you ship the toggle.",
    ],
    roadmapInitiative: "Performance Hardening Sprint",
    roadmapEpic: "EP-12",
    roadmapConnection:
      "PM-318 (SSR personalization optimization) is already filed and should be treated as a high-priority follow-on, not a nice-to-have, to protect the engagement gains.",
    roadmapInfluenceCount: 3,
    generatedAt: "2024-01-29T14:05:00Z",
  },

  // ── 3. Mobile Push Notifications — Goal Missed ────────────────────────────
  {
    id: "retro-003",
    name: "Mobile Push Notifications",
    shipDate: "Dec 4, 2023",
    shipDateRelative: "2 months ago",
    originalGoal:
      "Increase D30 retention for mobile users from 34% to 42% by delivering timely push notifications for key events.",
    jiraTicket: "PM-288",
    owningTeam: "Mobile",
    verdict: "missed",
    verdictSummary:
      "D30 retention for mobile users is unchanged at 34%; opt-out rate hit 29% within 14 days of launch.",
    version: "v2.3.2",
    quarter: "Q4 2023",
    metrics: [
      {
        label: "Mobile D30 Retention",
        before: "34%",
        after: "34%",
        delta: "0pp",
        deltaPositive: false,
        isPrimary: true,
      },
      {
        label: "Push Opt-out Rate (Day 14)",
        before: "—",
        after: "29%",
        delta: "—",
        deltaPositive: false,
        isPrimary: false,
      },
      {
        label: "Push Open Rate",
        before: "—",
        after: "11%",
        delta: "—",
        deltaPositive: false,
        isPrimary: false,
      },
      {
        label: "Session-from-Push Rate",
        before: "—",
        after: "6.2%",
        delta: "—",
        deltaPositive: false,
        isPrimary: false,
      },
    ],
    narrativeBullets: [
      "The 29% opt-out rate within 14 days reveals an overly aggressive strategy — the default cadence was 2.4 notifications/user/day; industry best practice for B2B tools is 0.5–1.0.",
      "An 11% open rate is below the 18–22% benchmark for productivity apps; the notification copy was generic ('You have updates') rather than contextual ('Marcus commented on your sprint retro').",
      "Session-from-push at 6.2% means fewer than 1 in 16 people who received a push actually opened the app — the content did not create urgency or relevance.",
      "Retention was likely already at a floor for these users; push notifications cannot substitute for solving the underlying product gaps causing churn.",
    ],
    thread: [
      {
        author: "Dan Reeves",
        avatarInitial: "D",
        avatarColor: "bg-amber-500",
        source: "slack",
        text: "Two weeks post-launch and the opt-out rate is 29%. That's painful. We defaulted everyone to 'all notifications' — we should have started with 'mentions only' and let users expand from there.",
        timestamp: "Dec 18, 2:11 PM",
        reactions: [
          { emoji: "😬", count: 6 },
          { emoji: "💀", count: 2 },
        ],
      },
      {
        author: "Marcus Webb",
        avatarInitial: "M",
        avatarColor: "bg-blue-500",
        source: "slack",
        text: "Filing PM-323 to change default cadence to 'mentions + critical alerts only' and add a granular preference center. Let's not wait for Q2.",
        timestamp: "Dec 18, 3:45 PM",
        reactions: [{ emoji: "✅", count: 8 }],
      },
      {
        author: "PM-288",
        avatarInitial: "J",
        avatarColor: "bg-blue-700",
        source: "jira",
        text: "Post-launch retro flagged high opt-out rate as primary failure mode. Root cause: aggressive default cadence and generic copy. Follow-on: PM-323 (preference center), PM-325 (contextual copy templates).",
        timestamp: "Dec 19, 9:00 AM",
        reactions: [],
      },
    ],
    lessons: [
      "Default notification settings should always start at the most conservative tier (mentions-only) — users who want more will opt up; users who get too many will opt out permanently.",
      "Measure opt-out rate in the first 7 days as an early-warning KPI for any notification launch; at 15% you have a warning, at 25% you have a crisis. Build a kill-switch into the rollout plan.",
      "Retention goals that require changing user behavior (return because of push) need a 60–90 day measurement window — ship the feature 60 days before the retention measurement point.",
    ],
    roadmapInitiative: "Q1 Engagement Re-platform",
    roadmapEpic: "EP-19",
    roadmapConnection:
      "PM-323 (notification preference center) and PM-325 (contextual copy) are the remediation items; both should be prioritized in the next sprint to recover users who haven't yet opted out.",
    roadmapInfluenceCount: 4,
    generatedAt: "2024-02-04T10:30:00Z",
  },

  // ── 4. Checkout Flow Simplification — Goal Met ────────────────────────────
  {
    id: "retro-004",
    name: "Checkout Flow Simplification",
    shipDate: "Dec 27, 2023",
    shipDateRelative: "5 weeks ago",
    originalGoal:
      "Increase checkout completion rate from 61% back toward the pre-incident 78% baseline by removing two redundant confirmation steps.",
    jiraTicket: "PM-311",
    owningTeam: "Payments",
    verdict: "met",
    verdictSummary:
      "Checkout completion reached 79.3%, exceeding the pre-incident baseline; payment error rate also fell from 4.1% to 1.8%.",
    version: "v2.4.1",
    quarter: "Q4 2023",
    metrics: [
      {
        label: "Checkout Completion Rate",
        before: "61%",
        after: "79.3%",
        delta: "+18.3pp",
        deltaPositive: true,
        isPrimary: true,
      },
      {
        label: "Payment Error Rate",
        before: "4.1%",
        after: "1.8%",
        delta: "−2.3pp",
        deltaPositive: true,
        isPrimary: false,
      },
      {
        label: "Checkout Median Duration",
        before: "3m 42s",
        after: "2m 09s",
        delta: "−1m 33s",
        deltaPositive: true,
        isPrimary: false,
      },
      {
        label: "Chargebacks (30-day window)",
        before: "12",
        after: "9",
        delta: "−3",
        deltaPositive: true,
        isPrimary: false,
      },
    ],
    narrativeBullets: [
      "The two removed steps ('Are you sure?' confirmation modal and the redundant address re-entry prompt) were legacy guard rails from a 2021 fraud spike that was resolved 18 months ago — they had zero fraud-prevention value.",
      "The payment error rate drop is partially attributed to the flow change (less user confusion, fewer mis-entries) and partially to the DB connection pool fix from the December incident — these are hard to fully isolate.",
      "Checkout duration dropping by 1m 33s (median) is the clearest causal signal: users are not spending time re-reading redundant prompts or re-entering data.",
      "The 79.3% completion rate actually exceeds the pre-incident 78% baseline, suggesting the old flow itself had friction that the incident surfaced but did not create.",
    ],
    thread: [
      {
        author: "Priya Nair",
        avatarInitial: "P",
        avatarColor: "bg-emerald-500",
        source: "slack",
        text: "PM-311 is live. Removed the double-confirm modal and the redundant address re-entry. Both were added in 2021 and have had no fraud-prevention audit since. Shocked these were still in prod.",
        timestamp: "Dec 27, 11:30 AM",
        reactions: [
          { emoji: "😅", count: 9 },
          { emoji: "🚀", count: 6 },
        ],
      },
      {
        author: "Sarah Chen",
        avatarInitial: "S",
        avatarColor: "bg-teal-500",
        source: "slack",
        text: "Monitoring Stripe webhook error rate post-deploy. Down from 4.1% to 1.8% in the first 6h. Some of this is the flow, some is the DB pool fix from last week — hard to untangle cleanly.",
        timestamp: "Dec 27, 5:45 PM",
        reactions: [{ emoji: "📊", count: 4 }],
      },
      {
        author: "PM-311",
        avatarInitial: "J",
        avatarColor: "bg-blue-700",
        source: "jira",
        text: "Completion rate recovery confirmed. Exceeded baseline. Caveat: payment error improvement is co-attributed to DB pool fix. Opened PM-331 to instrument checkout with isolated A/B path to cleanly attribute future changes.",
        timestamp: "Dec 28, 9:15 AM",
        reactions: [],
      },
    ],
    lessons: [
      "Every legacy 'safety' UX pattern (extra confirmation steps, redundant prompts) should have a documented expiry review date when created — if not, it survives indefinitely and bleeds conversion silently.",
      "When multiple changes ship close together, add a causal isolation note to the retro immediately, before context fades — PM-331's instrumentation plan is the right follow-through.",
      "The fact that completion exceeded the pre-incident baseline means the incident was a diagnostic tool: it forced inspection of the checkout path that nobody had audited in two years.",
    ],
    roadmapInitiative: "Checkout Reliability Initiative",
    roadmapEpic: "EP-12",
    roadmapConnection:
      "PM-331 (isolated checkout instrumentation) should close before the next payment feature ships, so future retros have clean causal attribution rather than co-mingled signals.",
    roadmapInfluenceCount: 2,
    generatedAt: "2024-01-31T16:45:00Z",
  },

  // ── 5. Search Autocomplete — Goal Met ─────────────────────────────────────
  {
    id: "retro-005",
    name: "Search Autocomplete",
    shipDate: "Aug 14, 2023",
    shipDateRelative: "6 months ago",
    originalGoal:
      "Reduce zero-result searches from 31% to under 15% and increase search-to-action conversion by 20pp.",
    jiraTicket: "PM-241",
    owningTeam: "Growth",
    verdict: "met",
    verdictSummary:
      "Zero-result searches fell to 9% and search-to-action conversion improved +24pp — both targets exceeded.",
    version: "v2.1.0",
    quarter: "Q3 2023",
    metrics: [
      {
        label: "Zero-result Search Rate",
        before: "31%",
        after: "9%",
        delta: "−22pp",
        deltaPositive: true,
        isPrimary: true,
      },
      {
        label: "Search-to-Action Conversion",
        before: "38%",
        after: "62%",
        delta: "+24pp",
        deltaPositive: true,
        isPrimary: false,
      },
      {
        label: "Avg. Keystrokes Before Result Click",
        before: "11.4",
        after: "5.1",
        delta: "−6.3",
        deltaPositive: true,
        isPrimary: false,
      },
      {
        label: "Search Sessions / DAU",
        before: "0.8",
        after: "1.4",
        delta: "+0.6",
        deltaPositive: true,
        isPrimary: false,
      },
    ],
    narrativeBullets: [
      "Fuzzy matching on the backend eliminated the largest bucket of zero-result queries — typos and partial entity names that previously returned nothing now resolve correctly.",
      "The 'recent searches' rail drove 28% of all search interactions in the first month, signaling that search is now used as a navigation shortcut, not just a fallback.",
      "Search sessions per DAU increasing from 0.8 to 1.4 means users discovered the feature and integrated it into their workflow — autocomplete lowered the perceived cost of starting a search.",
      "Enterprise accounts saw a 40% larger lift in search-to-action conversion than SMB, likely because they have more entities (projects, teammates, documents) where autocomplete disambiguation matters most.",
    ],
    thread: [
      {
        author: "Lena Kovacs",
        avatarInitial: "L",
        avatarColor: "bg-pink-500",
        source: "slack",
        text: "Autocomplete shipped with fuzzy match + recent history. The backend Typesense integration was clean — query latency is under 80ms at P95, well within our 200ms budget.",
        timestamp: "Aug 14, 2:30 PM",
        reactions: [
          { emoji: "⚡", count: 8 },
          { emoji: "🎯", count: 5 },
        ],
      },
      {
        author: "Dan Reeves",
        avatarInitial: "D",
        avatarColor: "bg-amber-500",
        source: "slack",
        text: "One week in: zero-result rate dropped from 31% to 12% already. Expect further improvement as the index warms up with more user behavior data.",
        timestamp: "Aug 21, 11:15 AM",
        reactions: [{ emoji: "📈", count: 6 }],
      },
      {
        author: "PM-241",
        avatarInitial: "J",
        avatarColor: "bg-blue-700",
        source: "jira",
        text: "Autocomplete shipped, metrics trending ahead of target. Follow-on: PM-254 (semantic search for docs), PM-258 (cross-entity search federation).",
        timestamp: "Aug 15, 9:00 AM",
        reactions: [],
      },
    ],
    lessons: [
      "Instrument search latency from day one of any search feature — users tolerate 150ms but will abandon at 400ms; the budget should be in the acceptance criteria, not post-launch monitoring.",
      "Recent search history as a surface is under-valued; it is effectively a personalized nav shortcut that users build themselves. Treat it as a first-class feature, not a convenience.",
      "Enterprise vs. SMB segmentation for search features is almost always worth doing upfront — entity density changes the entire value proposition.",
    ],
    roadmapInitiative: "Q4 Search Platform",
    roadmapEpic: "EP-15",
    roadmapConnection:
      "PM-254 (semantic search) builds directly on the Typesense integration and the behavioral data collected during this rollout.",
    roadmapInfluenceCount: 3,
    generatedAt: "2024-01-15T11:20:00Z",
  },

  // ── 6. Team Collaboration Mode — Partially Met ────────────────────────────
  {
    id: "retro-006",
    name: "Team Collaboration Mode",
    shipDate: "Jun 22, 2023",
    shipDateRelative: "8 months ago",
    originalGoal:
      "Enable real-time co-editing on project documents and increase multi-user session rate from 4% to 15%.",
    jiraTicket: "PM-198",
    owningTeam: "Core Product",
    verdict: "partial",
    verdictSummary:
      "Co-editing shipped and works reliably, but multi-user session rate only reached 8% — adoption is gated by org-level enablement friction.",
    version: "v2.0.0",
    quarter: "Q2 2023",
    metrics: [
      {
        label: "Multi-user Session Rate",
        before: "4%",
        after: "8%",
        delta: "+4pp",
        deltaPositive: true,
        isPrimary: true,
      },
      {
        label: "Collab Session Duration (avg)",
        before: "—",
        after: "22m",
        delta: "—",
        deltaPositive: true,
        isPrimary: false,
      },
      {
        label: "Conflict Resolution Events / Session",
        before: "—",
        after: "0.3",
        delta: "—",
        deltaPositive: true,
        isPrimary: false,
      },
      {
        label: "Orgs with ≥1 Collab Session",
        before: "0%",
        after: "34%",
        delta: "+34pp",
        deltaPositive: true,
        isPrimary: false,
      },
    ],
    narrativeBullets: [
      "The feature works reliably — conflict resolution rate of 0.3 events per session is well below the 1.0 threshold we set as acceptable, confirming the CRDT implementation is sound.",
      "The gap between 34% of orgs trying the feature and only 8% of sessions being multi-user reveals an adoption funnel problem: teams discover it but don't establish a habit.",
      "Admin enablement is required at the org level before any user can invite collaborators — this gate was under-estimated; 41% of orgs that tried the feature had an admin-user gap where the invitee couldn't join.",
      "Power users who did adopt show strong retention signal: 78% of accounts with ≥3 collab sessions in month 1 retained for month 2.",
    ],
    thread: [
      {
        author: "Marcus Webb",
        avatarInitial: "M",
        avatarColor: "bg-blue-500",
        source: "slack",
        text: "Collab mode shipped. CRDT conflict resolution is working cleanly in production. The big unknown is whether teams will actually use it — we're at 4% baseline and need 15%.",
        timestamp: "Jun 22, 3:00 PM",
        reactions: [
          { emoji: "🤝", count: 10 },
          { emoji: "🚀", count: 7 },
        ],
      },
      {
        author: "Priya Nair",
        avatarInitial: "P",
        avatarColor: "bg-emerald-500",
        source: "slack",
        text: "The admin-gate issue is real. We need a 'no-admin invite' path for personal workspaces. Filing PM-212 — this is blocking adoption more than anything else.",
        timestamp: "Jul 14, 10:22 AM",
        reactions: [{ emoji: "🔑", count: 5 }],
      },
      {
        author: "PM-198",
        avatarInitial: "J",
        avatarColor: "bg-blue-700",
        source: "jira",
        text: "Partially met — technical delivery successful, adoption gated by admin enablement friction. PM-212 (no-admin invite path) and PM-219 (onboarding tooltip for collab) are the unlock items.",
        timestamp: "Jul 28, 9:00 AM",
        reactions: [],
      },
    ],
    lessons: [
      "For any enterprise feature requiring admin setup, build a self-serve path or shadow mode first — admin-gated features have an adoption ceiling that is completely independent of how good the feature is.",
      "Track org-level adoption (did ≥1 user in an org try it?) separately from session-level adoption — the 34% vs. 8% gap here would have been invisible without org-level segmentation.",
      "Strong month-2 retention for power adopters is a signal to double down on that cohort rather than waiting for laggards — build a case study or in-product social proof loop from early adopters.",
    ],
    roadmapInitiative: "Collaboration Platform",
    roadmapEpic: "EP-22",
    roadmapConnection:
      "PM-212 (no-admin invite) is the highest-leverage unlock; shipping it would remove the single biggest adoption barrier identified in this retro.",
    roadmapInfluenceCount: 5,
    generatedAt: "2023-09-01T08:45:00Z",
  },

  // ── 7. API Rate Limit Dashboard — Goal Missed ─────────────────────────────
  {
    id: "retro-007",
    name: "API Rate Limit Dashboard",
    shipDate: "Sep 8, 2023",
    shipDateRelative: "5 months ago",
    originalGoal:
      "Reduce developer support tickets about rate limit errors by 40% and increase API integration success rate from 62% to 80%.",
    jiraTicket: "PM-253",
    owningTeam: "Infrastructure",
    verdict: "missed",
    verdictSummary:
      "Developer tickets decreased only 12% and API integration success rate moved from 62% to 67% — well short of both targets.",
    version: "v2.2.0",
    quarter: "Q3 2023",
    metrics: [
      {
        label: "Developer Support Tickets (rate limit)",
        before: "84 / month",
        after: "74 / month",
        delta: "−12%",
        deltaPositive: false,
        isPrimary: true,
      },
      {
        label: "API Integration Success Rate",
        before: "62%",
        after: "67%",
        delta: "+5pp",
        deltaPositive: true,
        isPrimary: false,
      },
      {
        label: "Dashboard Weekly Active Users",
        before: "—",
        after: "18%",
        delta: "—",
        deltaPositive: false,
        isPrimary: false,
      },
      {
        label: "Time-to-Rate-Limit-Discovery (avg)",
        before: "4.2 days",
        after: "3.8 days",
        delta: "−0.4d",
        deltaPositive: true,
        isPrimary: false,
      },
    ],
    narrativeBullets: [
      "Only 18% of developers with API keys opened the rate limit dashboard even once — the surface is invisible; most developers only learn about rate limits when they hit a 429 error.",
      "The dashboard showed current usage against limits, but did not provide proactive alerts — developers who never checked the dashboard got no benefit, which is most of them.",
      "The integration success rate improvement (+5pp) correlates with the subset of developers who did use the dashboard, but the sample is too small to be causally meaningful.",
      "Root cause: the dashboard solves a reactive problem (I hit a limit, let me check why) but the primary developer pain is proactive (warn me before I hit the limit).",
    ],
    thread: [
      {
        author: "Sarah Chen",
        avatarInitial: "S",
        avatarColor: "bg-teal-500",
        source: "slack",
        text: "Dashboard shipped in the developer portal. Shows live request counts, remaining quota, and a 7-day usage chart. No email/webhook alerts in this version — that was scoped out.",
        timestamp: "Sep 8, 1:00 PM",
        reactions: [
          { emoji: "📊", count: 4 },
          { emoji: "👍", count: 3 },
        ],
      },
      {
        author: "Dan Reeves",
        avatarInitial: "D",
        avatarColor: "bg-amber-500",
        source: "slack",
        text: "6 weeks post-launch: tickets only down 12%, not 40%. Root cause is clear — devs don't visit the portal unless they already have a problem. We need webhook alerts or in-API warning headers.",
        timestamp: "Oct 22, 9:30 AM",
        reactions: [{ emoji: "😬", count: 4 }],
      },
      {
        author: "PM-253",
        avatarInitial: "J",
        avatarColor: "bg-blue-700",
        source: "jira",
        text: "Dashboard delivery complete but goal missed. Proactive alerts were descoped; post-launch data confirms they were the critical path item. PM-271 (webhook alerts at 80% quota) is the remediation.",
        timestamp: "Oct 24, 10:00 AM",
        reactions: [],
      },
    ],
    lessons: [
      "Dashboards require user pull; alerts create developer push — for infrastructure observability features, proactive notifications drive behavior change far more than passive dashboards.",
      "When descoping a feature, explicitly document which success criteria assumptions break — the 40% ticket reduction assumed developers would check the dashboard proactively.",
      "Developer portal adoption rates are almost always lower than expected; instrument feature discovery funnel (API key → portal login → dashboard view) before setting adoption-dependent success criteria.",
    ],
    roadmapInitiative: "Developer Experience Platform",
    roadmapEpic: "EP-25",
    roadmapConnection:
      "PM-271 (proactive webhook alerts at 80% quota threshold) is the critical remediation; shipping it converts the dashboard from passive to proactive.",
    roadmapInfluenceCount: 2,
    generatedAt: "2023-11-01T13:30:00Z",
  },

  // ── 8. Email Digest Feature — Goal Met ────────────────────────────────────
  {
    id: "retro-008",
    name: "Weekly Email Digest",
    shipDate: "Oct 31, 2023",
    shipDateRelative: "4 months ago",
    originalGoal:
      "Increase D30 retention for low-frequency users (≤2 sessions/week) from 28% to 38% using a personalized weekly summary email.",
    jiraTicket: "PM-267",
    owningTeam: "Growth",
    verdict: "met",
    verdictSummary:
      "D30 retention for low-frequency users reached 39%, and email open rate of 41% is among the highest performing lifecycle emails in the product.",
    version: "v2.3.1",
    quarter: "Q4 2023",
    metrics: [
      {
        label: "D30 Retention (low-frequency users)",
        before: "28%",
        after: "39%",
        delta: "+11pp",
        deltaPositive: true,
        isPrimary: true,
      },
      {
        label: "Email Open Rate",
        before: "—",
        after: "41%",
        delta: "—",
        deltaPositive: true,
        isPrimary: false,
      },
      {
        label: "Click-through Rate",
        before: "—",
        after: "18%",
        delta: "—",
        deltaPositive: true,
        isPrimary: false,
      },
      {
        label: "Unsubscribe Rate (30 days)",
        before: "—",
        after: "2.1%",
        delta: "—",
        deltaPositive: true,
        isPrimary: false,
      },
    ],
    narrativeBullets: [
      "The personalization engine driving the digest (surfacing activity from teammates, not just the user's own activity) was the key differentiator — users said the digest felt like a briefing, not spam.",
      "41% open rate vs. the 22% industry benchmark for SaaS lifecycle email confirms the signal was relevant; the subject line variant 'Your team moved on 3 things this week' outperformed 4 other variants in the A/B test.",
      "18% CTR driving users back to specific content items (not the home page) meant users landed in context — reducing the 'what am I supposed to do here?' friction that plagues lifecycle re-engagement.",
      "The 2.1% unsubscribe rate after 30 days indicates the cadence (weekly) matched user tolerance; previous monthly newsletter had a 0.4% rate, but also had 8% open rate.",
    ],
    thread: [
      {
        author: "Lena Kovacs",
        avatarInitial: "L",
        avatarColor: "bg-pink-500",
        source: "slack",
        text: "Digest emails are live for 100% of low-frequency users. The personalization layer took 3 extra sprints but it's the entire bet — a generic digest would have been table stakes.",
        timestamp: "Oct 31, 9:00 AM",
        reactions: [
          { emoji: "📧", count: 6 },
          { emoji: "🎯", count: 8 },
        ],
      },
      {
        author: "Marcus Webb",
        avatarInitial: "M",
        avatarColor: "bg-blue-500",
        source: "slack",
        text: "4-week results: open rate 41%, CTR 18%, unsubscribe only 2.1%. The 'your team moved on X things' framing is working. D30 retention cohort analysis will take another 2 weeks to fully close.",
        timestamp: "Nov 28, 2:45 PM",
        reactions: [{ emoji: "📈", count: 9 }],
      },
      {
        author: "PM-267",
        avatarInitial: "J",
        avatarColor: "bg-blue-700",
        source: "jira",
        text: "Email digest goal met. D30 retention up 11pp for target segment. Strong email engagement metrics. Follow-on: PM-284 (daily digest option for power users), PM-291 (mobile push variant of digest).",
        timestamp: "Nov 30, 11:00 AM",
        reactions: [],
      },
    ],
    lessons: [
      "Team-activity framing ('your teammates did X') drives higher open rates than user-activity framing ('you did X last week') — the digest is more valuable as a social briefing than a personal log.",
      "Personalization investment paid off: the extra 3 sprints to build the recommendation engine vs. a static digest was the difference between 41% and an estimated 18% open rate.",
      "A/B test email subject lines at launch, not as a follow-on — the winning variant was clear within 48 hours and would have been available for the full rollout if started earlier.",
    ],
    roadmapInitiative: "Lifecycle Re-engagement Program",
    roadmapEpic: "EP-17",
    roadmapConnection:
      "PM-284 (daily digest) targets power users who want higher frequency — the unsubscribe data shows weekly is the right floor, not the ceiling.",
    roadmapInfluenceCount: 3,
    generatedAt: "2024-01-08T10:00:00Z",
  },

  // ── 9. Dark Mode Support — Partially Met ─────────────────────────────────
  {
    id: "retro-009",
    name: "Dark Mode Support",
    shipDate: "Jan 15, 2024",
    shipDateRelative: "3 weeks ago",
    originalGoal:
      "Achieve 25% dark mode adoption within 60 days and reduce eye-strain support tickets by 50%.",
    jiraTicket: "PM-342",
    owningTeam: "Design Systems",
    verdict: "partial",
    verdictSummary:
      "Dark mode adoption hit 31% (ahead of target), but eye-strain tickets only fell 18% — the ticket volume was driven by a separate contrast issue on data tables.",
    version: "v2.5.0",
    quarter: "Q1 2024",
    metrics: [
      {
        label: "Dark Mode Adoption Rate",
        before: "0%",
        after: "31%",
        delta: "+31pp",
        deltaPositive: true,
        isPrimary: true,
      },
      {
        label: "Eye-strain Support Tickets",
        before: "23 / month",
        after: "19 / month",
        delta: "−18%",
        deltaPositive: false,
        isPrimary: false,
      },
      {
        label: "User Satisfaction (CSAT, dark mode users)",
        before: "—",
        after: "4.6 / 5",
        delta: "—",
        deltaPositive: true,
        isPrimary: false,
      },
      {
        label: "Component Contrast Failures (WCAG AA)",
        before: "—",
        after: "14",
        delta: "—",
        deltaPositive: false,
        isPrimary: false,
      },
    ],
    narrativeBullets: [
      "31% adoption in the first 3 weeks without any in-product nudge or default change is a strong signal — users were actively seeking this feature and toggled it as soon as it appeared.",
      "The 14 WCAG AA contrast failures are concentrated in data tables and form inputs; these were not caught in QA because accessibility audit tooling was run only against a light-mode fixture.",
      "Eye-strain tickets correlating with table contrast rather than the general dark theme means the primary hypothesis (dark mode reduces eye strain) was correct, but incomplete — contrast quality matters as much as mode.",
      "CSAT of 4.6 from dark mode users is the highest satisfaction score for any feature shipped in the last 6 months, confirming high user value despite the incomplete ticket reduction.",
    ],
    thread: [
      {
        author: "Priya Nair",
        avatarInitial: "P",
        avatarColor: "bg-emerald-500",
        source: "slack",
        text: "Dark mode is live. Full token system implemented — 240 semantic tokens mapped across light and dark. Known issue: data table contrast in dark mode needs a pass; PM-356 filed.",
        timestamp: "Jan 15, 11:00 AM",
        reactions: [
          { emoji: "🌙", count: 14 },
          { emoji: "✨", count: 11 },
        ],
      },
      {
        author: "Lena Kovacs",
        avatarInitial: "L",
        avatarColor: "bg-pink-500",
        source: "slack",
        text: "Week 3 data: 31% adoption already. The eye-strain tickets aren't moving as much as expected — digging in, it looks like those tickets are specifically about table readability, not background color.",
        timestamp: "Feb 5, 3:30 PM",
        reactions: [{ emoji: "🔍", count: 4 }],
      },
      {
        author: "PM-342",
        avatarInitial: "J",
        avatarColor: "bg-blue-700",
        source: "jira",
        text: "Dark mode shipped, adoption ahead of target. Eye-strain metric partially met — root cause is table contrast failures, not mode switch. PM-356 (table contrast fix) is the unlock for the secondary goal.",
        timestamp: "Feb 6, 9:15 AM",
        reactions: [],
      },
    ],
    lessons: [
      "Run accessibility audits against both light and dark mode fixtures in CI — single-fixture audits create a false sense of coverage that will resurface in production.",
      "Track adoption by user segment from day 1 of any preference feature — knowing whether power users or new users adopt first changes the follow-on strategy entirely.",
      "Satisfaction scores for long-requested features are often artificially high in the first 30 days; set a 90-day CSAT baseline before treating the score as stable signal.",
    ],
    roadmapInitiative: "Accessibility & Design Systems Hardening",
    roadmapEpic: "EP-28",
    roadmapConnection:
      "PM-356 (table contrast remediation) is a P1 follow-on — it is the only remaining blocker between the dark mode ship and full WCAG AA compliance.",
    roadmapInfluenceCount: 2,
    generatedAt: "2024-02-07T14:00:00Z",
  },

  // ── 10. Bulk Export Tool — Goal Met ───────────────────────────────────────
  {
    id: "retro-010",
    name: "Bulk Export Tool",
    shipDate: "Jan 29, 2024",
    shipDateRelative: "1 week ago",
    originalGoal:
      "Reduce data export support requests by 60% and unlock self-serve reporting for enterprise accounts that currently require manual CSV extraction.",
    jiraTicket: "PM-348",
    owningTeam: "Core Product",
    verdict: "met",
    verdictSummary:
      "Data export support requests fell 67% in the first week and 84% of enterprise accounts used the tool within 5 days of launch.",
    version: "v2.5.1",
    quarter: "Q1 2024",
    metrics: [
      {
        label: "Data Export Support Requests",
        before: "31 / week",
        after: "10 / week",
        delta: "−67%",
        deltaPositive: true,
        isPrimary: true,
      },
      {
        label: "Enterprise Account Adoption (5 days)",
        before: "0%",
        after: "84%",
        delta: "+84pp",
        deltaPositive: true,
        isPrimary: false,
      },
      {
        label: "Avg. Export Job Duration",
        before: "—",
        after: "4m 12s",
        delta: "—",
        deltaPositive: true,
        isPrimary: false,
      },
      {
        label: "Export Error Rate",
        before: "—",
        after: "0.8%",
        delta: "—",
        deltaPositive: true,
        isPrimary: false,
      },
    ],
    narrativeBullets: [
      "84% enterprise adoption in 5 days is an unusually strong signal — enterprise teams had been waiting for this feature and immediately integrated it into their reporting workflows.",
      "The 0.8% error rate on exports is within acceptable range, but all errors are concentrated in exports >500k rows; the async job queue needs a memory ceiling fix before the 1M-row export tier ships.",
      "Support request reduction was instantaneous — tickets dropped from day 1, confirming that most requests were 'how do I get my data out?' workflow questions, not bugs.",
      "The bulk export tool was also used as an onboarding tool by 3 enterprise accounts migrating from a competitor — they used it to validate data completeness before committing to the platform.",
    ],
    thread: [
      {
        author: "Sarah Chen",
        avatarInitial: "S",
        avatarColor: "bg-teal-500",
        source: "slack",
        text: "Bulk export is live. Async job queue, S3 signed URL delivery, CSV and JSON formats. Max 500k rows in this version — 1M row support requires a memory limit fix we'll do in PM-362.",
        timestamp: "Jan 29, 10:30 AM",
        reactions: [
          { emoji: "📦", count: 7 },
          { emoji: "🏢", count: 9 },
        ],
      },
      {
        author: "Marcus Webb",
        avatarInitial: "M",
        avatarColor: "bg-blue-500",
        source: "slack",
        text: "5 days in: 84% of enterprise accounts have used it. Support queue is down 67%. The 3 migration use-cases were unplanned — worth flagging to Sales as a competitive differentiator.",
        timestamp: "Feb 3, 4:00 PM",
        reactions: [{ emoji: "🎯", count: 11 }],
      },
      {
        author: "PM-348",
        avatarInitial: "J",
        avatarColor: "bg-blue-700",
        source: "jira",
        text: "Both goals met and exceeded. Unplanned use-case: migration onboarding (flag to Sales). Follow-on: PM-362 (1M row support), PM-365 (scheduled export jobs for reporting automation).",
        timestamp: "Feb 3, 5:30 PM",
        reactions: [],
      },
    ],
    lessons: [
      "When enterprise accounts immediately use a self-serve tool for migration validation, document it as a use case and route it to Sales and Onboarding — unplanned use cases from early adopters often represent new acquisition motions.",
      "Async job architectures for bulk operations should always have an explicit memory ceiling in the acceptance criteria, not as a follow-on; the row limit here was a workaround, not a feature.",
      "Support ticket reduction as a primary KPI is one of the cleanest causal metrics available — when it drops on day 1, you have unambiguous evidence that you solved a real workflow problem.",
    ],
    roadmapInitiative: "Enterprise Self-serve Platform",
    roadmapEpic: "EP-30",
    roadmapConnection:
      "PM-365 (scheduled export jobs) is the natural evolution — enterprise users who adopted bulk export for reporting will want to automate it; this is the path to reducing manual reporting labor entirely.",
    roadmapInfluenceCount: 4,
    generatedAt: "2024-02-05T09:00:00Z",
  },
];
