// Add ANTHROPIC_API_KEY to .env.local:
// ANTHROPIC_API_KEY=sk-ant-...

import { NextRequest, NextResponse } from 'next/server';

export type AgentStep = {
  id: string;
  tool: 'amplitude' | 'mixpanel' | 'posthog' | 'sentry' | 'github' | 'prometheus' | 'agent';
  action: string;
  result: string;
  durationMs: number;
};

const SYSTEM_PROMPT = `You are an AI product intelligence agent for a SaaS company. You have access to live connected data from multiple analytics and engineering tools. Answer the user's question with specific numbers from the data below, use **bold** for key metrics, and end with a concrete recommendation.

CONNECTED LIVE DATA:

Amplitude (Product Analytics):
- DAU: ~11,847
- Signup funnel completion: 22.9% (down 15% vs last month)
- Step 2 (email verification): 34% drop-off since Nov 4 (was 8% in Oct)
- Step 3 (profile setup): 41% drop-off, highest in funnel
- Checkout completion: dropped from 78% to 61% on Dec 1
- Advanced Filters feature: 31% MAU adoption, 67% vs 43% D30 retention lift for users who engage

GitHub (Engineering):
- Commit a3f92c by @dan_reeves on Nov 3: changed email validation regex in onboarding/step2/validation.ts — now rejects emails with + aliases (e.g. user+tag@gmail.com)
- payments-service v2.4.1 deployed Dec 1 at 13:58 UTC by @infra-bot — caused checkout latency regression
- PR #198 (CSV export fix for /reports) has been open for 34 days unmerged

Sentry (Error Tracking):
- ValidationError: 2,847 occurrences since Nov 4 on /signup/step-2 (near-zero before)
- PaymentGatewayTimeoutError: 1,203 occurrences since Dec 1, avg latency 8.2s

PostHog (Session Analytics):
- 47 dead clicks/day on the disabled "Export CSV" button on /reports page
- 61% of homepage users scroll to pricing section, only 4% click the CTA
- 214 sessions flagged this week by rage-click and pre-drop heuristics

Prometheus (Infrastructure Metrics):
- payments-service P95 latency: spiked from 340ms to 8,100ms on Dec 1 at 14:23 UTC
- All other services nominal — only payments-service affected

Answer concisely and directly. Reference specific numbers. Bold the most important metrics. End with a clear recommended action.`;

// Keyword-to-tool step templates
function buildSteps(query: string): AgentStep[] {
  const q = query.toLowerCase();
  const steps: AgentStep[] = [];
  let stepNum = 1;

  const mkId = () => `live-step-${stepNum++}`;

  const hasSignup = q.includes('signup') || q.includes('sign up') || q.includes('onboard') || q.includes('email') || q.includes('validation') || q.includes('register');
  const hasDeploy = q.includes('deploy') || q.includes('commit') || q.includes('release') || q.includes('git') || q.includes('version');
  const hasError = q.includes('error') || q.includes('bug') || q.includes('crash') || q.includes('broken') || q.includes('exception') || q.includes('fail');
  const hasSession = q.includes('session') || q.includes('recording') || q.includes('click') || q.includes('user behav') || q.includes('ux');
  const hasLatency = q.includes('latency') || q.includes('slow') || q.includes('performance') || q.includes('timeout') || q.includes('speed');
  const hasCheckout = q.includes('checkout') || q.includes('payment') || q.includes('billing') || q.includes('purchase');
  const hasFeature = q.includes('feature') || q.includes('adoption') || q.includes('retention') || q.includes('worth') || q.includes('impact');
  const hasMetric = q.includes('metric') || q.includes('kpi') || q.includes('measure') || q.includes('track');

  // Always start with Amplitude for funnel/traffic context
  steps.push({
    id: mkId(),
    tool: 'amplitude',
    action: 'Querying Amplitude — pulling relevant funnel and event data',
    result: `DAU: 11,847 | Signup funnel: 22.9% completion | Checkout: 61%`,
    durationMs: 800,
  });

  if (hasSignup || hasError) {
    steps.push({
      id: mkId(),
      tool: 'sentry',
      action: 'Checking Sentry — scanning for errors on signup and onboarding flows',
      result: 'ValidationError: 2,847 occurrences since Nov 4 on /signup/step-2',
      durationMs: 700,
    });
    steps.push({
      id: mkId(),
      tool: 'github',
      action: 'Scanning GitHub — commits touching onboarding and validation logic',
      result: 'Commit a3f92c by @dan_reeves (Nov 3): email validation regex changed, blocks + aliases',
      durationMs: 580,
    });
  }

  if (hasCheckout || hasLatency) {
    steps.push({
      id: mkId(),
      tool: 'prometheus',
      action: 'Checking Prometheus — payments-service latency metrics (last 7d)',
      result: 'P95 latency: 340ms → 8,100ms spike on Dec 1 at 14:23 UTC',
      durationMs: 750,
    });
    steps.push({
      id: mkId(),
      tool: 'sentry',
      action: 'Pulling Sentry — PaymentGatewayTimeoutError occurrences',
      result: 'PaymentGatewayTimeoutError: 1,203 occurrences since Dec 1',
      durationMs: 620,
    });
  }

  if (hasCheckout || hasDeploy) {
    steps.push({
      id: mkId(),
      tool: 'github',
      action: 'Checking GitHub deploys — payments-service version history',
      result: 'payments-service v2.4.1 deployed Dec 1 at 13:58 UTC by @infra-bot',
      durationMs: 490,
    });
  }

  if (hasSession || q.includes('homepage') || q.includes('click')) {
    steps.push({
      id: mkId(),
      tool: 'posthog',
      action: 'Querying PostHog — session recordings and click heatmaps',
      result: '214 sessions flagged | 47 dead clicks/day on Export CSV | 61% reach pricing → 4% CTA',
      durationMs: 860,
    });
  }

  if (hasFeature || q.includes('retention') || q.includes('adopt')) {
    steps.push({
      id: mkId(),
      tool: 'amplitude',
      action: 'Pulling Amplitude — feature adoption and retention cohort comparison',
      result: 'Advanced Filters: 31% MAU | Feature users 67% vs 43% D30 retention',
      durationMs: 720,
    });
    steps.push({
      id: mkId(),
      tool: 'mixpanel',
      action: 'Cross-referencing Mixpanel — feature goal tracking and success criteria',
      result: 'Adoption goal met (25% MAU target exceeded). Retention lift confirmed.',
      durationMs: 550,
    });
  }

  if (hasMetric || q.includes('measure') || q.includes('track') || q.includes('instrument')) {
    steps.push({
      id: mkId(),
      tool: 'posthog',
      action: 'Checking PostHog — event coverage and instrumentation gaps',
      result: 'Homepage: only 2 events tracked. Pricing section: no events. CTA: tracked.',
      durationMs: 640,
    });
  }

  // If no specific signals matched, add generic cross-tool steps
  if (steps.length === 1) {
    steps.push({
      id: mkId(),
      tool: 'sentry',
      action: 'Scanning Sentry — top recurring errors by impact (last 30d)',
      result: '5 recurring errors affecting >100 users/week identified',
      durationMs: 670,
    });
    steps.push({
      id: mkId(),
      tool: 'posthog',
      action: 'Analyzing PostHog — rage clicks and friction points by page',
      result: '47 dead clicks/day on Export CSV | 214 flagged sessions this week',
      durationMs: 780,
    });
    steps.push({
      id: mkId(),
      tool: 'github',
      action: 'Reviewing GitHub — open PRs and stale branches (>30 days)',
      result: 'PR #198 (CSV export fix) open 34 days. payments-service v2.4.1 under review.',
      durationMs: 500,
    });
  }

  // Always end with agent synthesis
  steps.push({
    id: mkId(),
    tool: 'agent',
    action: 'Synthesizing findings across all connected data connectors...',
    result: 'Analysis complete — response generated',
    durationMs: 1400,
  });

  return steps;
}

export async function POST(req: NextRequest) {
  try {
    const { query, conversationHistory = [] } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    // Build messages array: prior conversation history + current query
    const messages = [
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'agent' ? 'assistant' : 'user',
        content: msg.content,
      })),
      { role: 'user', content: query },
    ];

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      console.error('Anthropic API error:', err);
      return NextResponse.json({ error: 'Anthropic API error' }, { status: 502 });
    }

    const data = await anthropicRes.json();
    const response: string = data.content?.[0]?.text ?? 'No response generated.';
    const steps: AgentStep[] = buildSteps(query);

    return NextResponse.json({ response, steps });
  } catch (err) {
    console.error('Agent route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
