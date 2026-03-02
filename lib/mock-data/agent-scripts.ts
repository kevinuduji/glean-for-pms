export type AgentStep = {
  id: string;
  tool: 'amplitude' | 'mixpanel' | 'posthog' | 'sentry' | 'github' | 'prometheus' | 'agent';
  action: string;
  result: string;
  durationMs: number;
};

export type AgentScript = {
  id: string;
  query: string;
  steps: AgentStep[];
  response: string;
  relatedCardTypes: string[];
};

export const agentScripts: AgentScript[] = [
  {
    id: 'script-1',
    query: 'Why are signups down 15% this month?',
    steps: [
      { id: 's1-1', tool: 'amplitude', action: 'Querying Amplitude — pulling /signup funnel events (last 60d)', result: '142,000 funnel events found across 6 steps', durationMs: 820 },
      { id: 's1-2', tool: 'amplitude', action: 'Identifying drop-off point — comparing Nov vs Oct cohorts', result: 'Step 2 (email verification) shows 34% drop, up from 8% in Oct', durationMs: 640 },
      { id: 's1-3', tool: 'github', action: 'Scanning GitHub — commits touching /onboarding in last 30 days', result: '3 commits found — most recent: a3f92c by @dan_reeves on Nov 3', durationMs: 510 },
      { id: 's1-4', tool: 'github', action: 'Reading diff for commit a3f92c — onboarding/step2/validation.ts', result: 'Validation regex changed — now rejects emails with + aliases', durationMs: 420 },
      { id: 's1-5', tool: 'sentry', action: 'Checking Sentry — errors on /signup/step-2 since Nov 3', result: 'ValidationError spike: 2,847 occurrences since Nov 4, near-zero before', durationMs: 710 },
      { id: 's1-6', tool: 'agent', action: 'Synthesizing findings across Amplitude, GitHub, Sentry...', result: 'Root cause identified', durationMs: 1500 },
    ],
    response: `Signups dropped 15% starting Nov 4th — one day after commit a3f92c (by @dan_reeves) modified the email validation logic in step 2 of onboarding. The new regex rejects emails containing '+' aliases (e.g. user+tag@gmail.com), which affects ~18% of your user base.

Sentry confirms 2,847 ValidationErrors on that step since the deploy, compared to near-zero the week prior. Amplitude shows the drop is isolated entirely to step 2 — all other funnel steps are healthy.

**Recommended fix:** Revert or patch the validation regex to allow + aliases. Track \`signup_step2_completed\` daily to confirm recovery within 48h of deploy.`,
    relatedCardTypes: ['amplitude-funnel', 'sentry-errors', 'github-commit'],
  },
  {
    id: 'script-2',
    query: 'Did our new homepage help?',
    steps: [
      { id: 's2-1', tool: 'posthog', action: 'Checking PostHog — querying event coverage on /homepage', result: 'Only 2 events tracked: pageview, CTA_click. 0 events on pricing section.', durationMs: 620 },
      { id: 's2-2', tool: 'amplitude', action: 'Pulling Amplitude — traffic to /homepage vs /signup conversion (last 60d)', result: 'Homepage → signup conversion: 3.1% (Oct) vs 2.8% (Nov)', durationMs: 780 },
      { id: 's2-3', tool: 'posthog', action: 'Analyzing session recordings — users entering from /homepage', result: '87 sessions reviewed. 61% scroll to pricing section, 4% click CTA', durationMs: 930 },
      { id: 's2-4', tool: 'github', action: 'Finding homepage launch date — scanning deploy history', result: 'Homepage v2 deployed Oct 14 via PR #204', durationMs: 440 },
      { id: 's2-5', tool: 'agent', action: 'Synthesizing findings — homepage impact analysis...', result: 'Analysis complete', durationMs: 1500 },
    ],
    response: `The short answer: we can't fully tell yet, because the homepage isn't fully instrumented — no events fire on the pricing section or the secondary CTA, which are the two interactions most likely to predict intent.

What we can see: homepage → signup conversion actually dipped slightly from 3.1% to 2.8% after the Oct 14 launch. Session data shows 61% of users reach the pricing section but only 4% click the CTA — suggesting the pricing section may be a drop-off point, not a conversion driver.

**Recommended next steps:**
1. Instrument: \`homepage_pricing_viewed\`, \`homepage_cta_clicked\` (primary), \`homepage_testimonial_engaged\` (secondary)
2. Once 2 weeks of data is collected, re-run this query for a clean read.
3. Consider testing a sticky CTA on scroll as a quick win while we gather data.`,
    relatedCardTypes: ['posthog-sessions', 'amplitude-conversion', 'tracking-gap'],
  },
  {
    id: 'script-3',
    query: 'Set up an A/B test for our onboarding flow',
    steps: [
      { id: 's3-1', tool: 'amplitude', action: 'Pulling current onboarding funnel — identifying highest drop-off step', result: 'Step 3 (profile setup) has 41% drop — highest in funnel', durationMs: 710 },
      { id: 's3-2', tool: 'github', action: 'Reading current onboarding code — /onboarding/step3/ProfileSetup.tsx', result: 'Profile setup requires 7 mandatory fields before proceeding', durationMs: 480 },
      { id: 's3-3', tool: 'amplitude', action: 'Checking historical experiments — any prior tests on onboarding', result: 'Experiment #2 (Feb): Reduced fields from 9→7, lifted completion +12%', durationMs: 650 },
      { id: 's3-4', tool: 'agent', action: 'Scaffolding experiment — defining hypothesis, metrics, and success criteria...', result: 'Experiment brief generated', durationMs: 1500 },
    ],
    response: `Here's your experiment scaffold for onboarding step 3:

**Hypothesis:** Reducing mandatory profile fields from 7 to 3 (name, role, company) and deferring the rest to an in-app prompt will increase step 3 completion.

- Control: Current 7-field form (baseline completion: 59%)
- Variant: 3-field form + 'Complete later' option

**Primary metric:** \`onboarding_step3_completed\` (target: +15% lift)
**Secondary signals:** \`profile_completed_later\` rate, D7 retention, time-to-first-action
**Guardrail:** Overall signup → active user rate must not decrease

Expected duration: 14 days at current traffic to reach 95% significance
Sample size needed: ~3,200 users per variant

I've pre-built the experiment dashboard. Historical context: a similar field-reduction test in Feb lifted completion by 12% — this variant goes further, so 15% lift is a reasonable target.`,
    relatedCardTypes: ['experiment-dag', 'amplitude-funnel', 'prior-experiment'],
  },
  {
    id: 'script-4',
    query: 'Was Feature X worth shipping?',
    steps: [
      { id: 's4-1', tool: 'github', action: 'Finding Feature X launch — scanning PR history and deploy log', result: 'Feature X (Advanced Filters) shipped Sept 22 via PR #187', durationMs: 520 },
      { id: 's4-2', tool: 'amplitude', action: 'Pulling engagement data — `advanced_filters_used` event (last 90d)', result: '4,891 unique users have used it. 31% of MAU.', durationMs: 680 },
      { id: 's4-3', tool: 'amplitude', action: 'Checking retention impact — D30 retention: users who used feature vs not', result: 'Feature users: 67% D30 retention. Non-users: 43% D30 retention', durationMs: 820 },
      { id: 's4-4', tool: 'mixpanel', action: 'Cross-referencing original goal — linked ticket PM-204 success criteria', result: 'Goal was: 25% MAU adoption + retention lift. Both met.', durationMs: 590 },
      { id: 's4-5', tool: 'agent', action: 'Writing retrospective — comparing outcome to original hypothesis...', result: 'Retrospective complete', durationMs: 1500 },
    ],
    response: `Feature X (Advanced Filters) was worth it. Here's the retrospective:

- **Adoption:** 31% of MAU have used it at least once since launch (goal was 25% ✓)
- **Retention:** Users who engage with filters show 67% D30 retention vs 43% for non-users — a 24-point lift that's the strongest feature-retention correlation in the product right now.

The original hypothesis (filters → power user activation) held up. The feature is also being used in ways not originally planned: 22% of filter usage is on the /reports page, which wasn't a target flow. This is worth exploring — it may indicate an unmet need in reporting.

This goes into your prioritization model: filter-type features have strong activation signal for this user base. Worth considering for the export and sharing flows next.`,
    relatedCardTypes: ['amplitude-adoption', 'retention-comparison', 'ticket-reference'],
  },
  {
    id: 'script-5',
    query: 'Is checkout broken — product or infra?',
    steps: [
      { id: 's5-1', tool: 'amplitude', action: 'Querying Amplitude — checkout completion rate (last 7d vs prior 7d)', result: 'Checkout completion dropped from 78% to 61% starting Dec 1', durationMs: 640 },
      { id: 's5-2', tool: 'sentry', action: 'Pulling Sentry — errors on /checkout flow since Dec 1', result: 'PaymentGatewayTimeoutError: 1,203 occurrences. Avg latency: 8.2s', durationMs: 720 },
      { id: 's5-3', tool: 'prometheus', action: 'Checking Prometheus — payments service latency (last 7d)', result: 'P95 latency spiked from 340ms to 8,100ms on Dec 1 at 14:23 UTC', durationMs: 810 },
      { id: 's5-4', tool: 'prometheus', action: 'Isolating service — payments-service vs other services', result: 'Only payments-service affected. All other services nominal.', durationMs: 530 },
      { id: 's5-5', tool: 'github', action: 'Checking deploys around Dec 1 14:00 UTC', result: 'payments-service v2.4.1 deployed Dec 1 at 13:58 UTC by @infra-bot', durationMs: 460 },
      { id: 's5-6', tool: 'agent', action: 'Determining root cause — product vs infrastructure...', result: 'Root cause: infrastructure regression', durationMs: 1500 },
    ],
    response: `This is an infrastructure problem, not a UX problem. **Do not redesign checkout.**

Root cause: payments-service v2.4.1 deployed Dec 1 at 13:58 UTC introduced a latency regression — P95 response time jumped from 340ms to 8.1 seconds within minutes of the deploy. Sentry shows 1,203 PaymentGatewayTimeoutErrors as a direct result. Amplitude confirms the checkout drop (78% → 61%) began at the exact same timestamp.

**The right team to page:** infra / payments squad, not product.
**Recommended immediate action:** Roll back payments-service to v2.4.0.

Expected recovery: Checkout completion should return to baseline within 1 deploy cycle once the rollback is live.

I've flagged this in your Insights feed with a P0 label.`,
    relatedCardTypes: ['prometheus-latency', 'sentry-errors', 'amplitude-checkout'],
  },
  {
    id: 'script-6',
    query: 'Show me sessions where users hit problems',
    steps: [
      { id: 's6-1', tool: 'posthog', action: 'Querying PostHog session recordings — last 7 days, all flows', result: '2,841 sessions found', durationMs: 890 },
      { id: 's6-2', tool: 'posthog', action: 'Filtering — rage clicks, repeated actions, pre-drop sessions', result: '214 sessions flagged by heuristics', durationMs: 1100 },
      { id: 's6-3', tool: 'amplitude', action: 'Cross-referencing — which flagged sessions ended without conversion', result: '89 sessions: user did not complete target action', durationMs: 750 },
      { id: 's6-4', tool: 'agent', action: 'Ranking sessions by signal quality — surfacing most diagnostic...', result: '12 sessions selected for review', durationMs: 1500 },
    ],
    response: `I've surfaced 12 sessions worth watching, ranked by diagnostic value:

**Top 3:**
• **Session #A4821** — User rage-clicked the 'Confirm Order' button 7 times, then abandoned. Checkout was open for 4m 12s. (Likely: payment timeout)
• **Session #B1043** — User navigated to /pricing 3 times in one session, returning from /signup each time. Never converted. (Likely: plan confusion)
• **Session #C7720** — User completed 5 of 7 onboarding steps, left on step 6, returned the next day, couldn't find where they left off. (Likely: no resume state)

These are in your Sessions page, pre-filtered and annotated. The checkout sessions (6 total) likely tie back to the payments-service latency issue — I'd resolve that before redesigning anything.`,
    relatedCardTypes: ['posthog-sessions', 'session-heatmap'],
  },
  {
    id: 'script-7',
    query: 'What should I build next?',
    steps: [
      { id: 's7-1', tool: 'amplitude', action: 'Scanning all flows — identifying highest friction moments (last 30d)', result: 'Top 3 drop-off points: onboarding step 3, /reports export, /settings billing', durationMs: 920 },
      { id: 's7-2', tool: 'sentry', action: 'Pulling recurring errors — frequency × user impact score', result: '5 recurring bugs affecting >100 users/week', durationMs: 680 },
      { id: 's7-3', tool: 'posthog', action: 'Analyzing rage clicks and dead clicks by page', result: '47 dead clicks/day on disabled \'Export CSV\' button in /reports', durationMs: 770 },
      { id: 's7-4', tool: 'github', action: 'Checking open PRs and stale branches — unfinished work', result: '2 PRs open >30 days: CSV export fix, billing page redesign', durationMs: 510 },
      { id: 's7-5', tool: 'amplitude', action: 'Pulling feature usage — identifying underperforming shipped features', result: '3 features with <5% adoption 60 days post-launch', durationMs: 840 },
      { id: 's7-6', tool: 'agent', action: 'Generating prioritized build recommendations...', result: 'Priority list generated', durationMs: 1500 },
    ],
    response: `Based on data across all connected sources, here's your prioritized build list:

**P0 — Fix (this week):**
1. **CSV Export on /reports** — 47 dead clicks/day on a disabled button. A fix PR (#198) has been open for 34 days. Ship it.

**P1 — High impact, next sprint:**
2. **Onboarding step 3** — 41% drop-off (highest in funnel). A/B test reducing mandatory fields. Estimated +12-15% signup completion based on prior test.
3. **Billing page clarity** — users are hitting /settings/billing repeatedly without completing plan changes. Likely a copy/UX issue, not a bug.

**P2 — Investigate:**
4. Three features shipped in Q3 have <5% adoption. Before building new, understand why these aren't being used — could be discoverability, not value.

Want me to scaffold an experiment for any of these, or generate a full prioritization doc?`,
    relatedCardTypes: ['priority-recommendations', 'friction-heatmap', 'dead-click-report'],
  },
  {
    id: 'script-8',
    query: 'What metric will Feature Y move?',
    steps: [
      { id: 's8-1', tool: 'github', action: 'Reading Feature Y description — PR #211: \'Smart Notifications\'', result: 'Feature adds digest email + in-app notification center', durationMs: 480 },
      { id: 's8-2', tool: 'amplitude', action: 'Finding analogous features — similar past ships with notification/email', result: 'Feature: Weekly Digest Email (Mar). Feature: In-app Alerts (Jun)', durationMs: 720 },
      { id: 's8-3', tool: 'amplitude', action: 'Pulling outcome data from analogous features', result: 'Weekly Digest: +9% D30 retention. In-app Alerts: +14% weekly active rate', durationMs: 890 },
      { id: 's8-4', tool: 'amplitude', action: 'Modeling expected impact for Smart Notifications', result: 'Estimated +11% WAU, +7% D30 retention based on analogous signals', durationMs: 660 },
      { id: 's8-5', tool: 'agent', action: 'Generating measurement plan and instrumentation checklist...', result: 'Measurement plan ready', durationMs: 1500 },
    ],
    response: `Based on two analogous features your team has shipped, Smart Notifications is most likely to move **Weekly Active Users** and **D30 Retention**.

- **Primary success metric:** Weekly Active Users (WAU)
- **Predicted lift:** +11% (modeled from Weekly Digest +9% and In-app Alerts +14%)
- **Secondary signals:** notification_opened rate, return_visit_within_48h, D30 retention

**Events to instrument before launch** (required for a clean retrospective):
• \`notification_sent\` (with type: digest | alert | mention)
• \`notification_opened\` (with source: email | in_app)
• \`notification_dismissed\`
• \`return_visit_from_notification\`

**Guardrail:** Watch \`notification_unsubscribed\` rate — if >8% in first 2 weeks, dial back send frequency before it affects email deliverability.

I've drafted an experiment brief and measurement plan. Want me to scaffold the full A/B test?`,
    relatedCardTypes: ['analogous-comparison', 'measurement-plan', 'event-checklist'],
  },
];

export const quickQueryPills = [
  { id: 'pill-1', tool: 'amplitude', label: 'Signup drop', scriptId: 'script-1' },
  { id: 'pill-2', tool: 'posthog', label: 'Homepage impact', scriptId: 'script-2' },
  { id: 'pill-3', tool: 'amplitude', label: 'Onboarding test', scriptId: 'script-3' },
  { id: 'pill-4', tool: 'github', label: 'Feature X impact', scriptId: 'script-4' },
  { id: 'pill-5', tool: 'sentry', label: 'Checkout issues', scriptId: 'script-5' },
  { id: 'pill-6', tool: 'posthog', label: 'Troubled sessions', scriptId: 'script-6' },
  { id: 'pill-7', tool: 'agent', label: 'Roadmap ideas', scriptId: 'script-7' },
  { id: 'pill-8', tool: 'amplitude', label: 'Metric modeling', scriptId: 'script-8' },
];
