import { create } from 'zustand';
import { AgentScript, AgentStep, agentScripts } from './mock-data/agent-scripts';

export type AgentStepStatus = 'pending' | 'running' | 'done' | 'error';

export type RunningStep = {
  stepId: string;
  status: AgentStepStatus;
};

export type ConversationMessage = {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  scriptId?: string;
};

type AgentStore = {
  query: string;
  setQuery: (q: string) => void;
  activeScript: AgentScript | null;
  isRunning: boolean;
  isLiveMode: boolean;
  stepStatuses: RunningStep[];
  isComplete: boolean;
  elapsedTime: number;
  conversation: ConversationMessage[];
  runScript: (scriptId: string, queryText?: string) => void;
  runLive: (queryText: string) => void;
  resetAgent: () => void;
};

export const useAgentStore = create<AgentStore>((set, get) => ({
  query: '',
  setQuery: (q) => set({ query: q }),
  activeScript: null,
  isRunning: false,
  isLiveMode: false,
  stepStatuses: [],
  isComplete: false,
  elapsedTime: 0,
  conversation: [],

  runScript: (scriptId: string, queryText?: string) => {
    const script = agentScripts.find(s => s.id === scriptId);
    if (!script) return;

    const userMessage: ConversationMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: queryText || script.query,
      timestamp: new Date(),
    };

    set({
      activeScript: script,
      isRunning: true,
      isLiveMode: false,
      isComplete: false,
      elapsedTime: 0,
      stepStatuses: script.steps.map(s => ({ stepId: s.id, status: 'pending' })),
      conversation: [...get().conversation, userMessage],
      query: queryText || script.query,
    });

    const startTime = Date.now();
    let cumulativeDelay = 0;

    script.steps.forEach((step, index) => {
      const runDelay = cumulativeDelay;
      cumulativeDelay += step.durationMs;
      const doneDelay = cumulativeDelay;

      setTimeout(() => {
        set(state => ({
          stepStatuses: state.stepStatuses.map(s =>
            s.stepId === step.id ? { ...s, status: 'running' } : s
          ),
        }));
      }, runDelay);

      setTimeout(() => {
        set(state => ({
          stepStatuses: state.stepStatuses.map(s =>
            s.stepId === step.id ? { ...s, status: 'done' } : s
          ),
        }));

        if (index === script.steps.length - 1) {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          const agentMessage: ConversationMessage = {
            id: `msg-${Date.now()}`,
            role: 'agent',
            content: script.response,
            timestamp: new Date(),
            scriptId: script.id,
          };
          set(state => ({
            isRunning: false,
            isComplete: true,
            elapsedTime: parseFloat(elapsed),
            conversation: [...state.conversation, agentMessage],
          }));
        }
      }, doneDelay);
    });
  },

  runLive: async (queryText: string) => {
    // Add user message immediately
    const userMessage: ConversationMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date(),
    };

    // Placeholder script while waiting for API
    const placeholderStep: AgentStep = {
      id: 'live-placeholder',
      tool: 'agent',
      action: 'Connecting to data sources and analyzing your query...',
      result: '',
      durationMs: 0,
    };
    const placeholderScript: AgentScript = {
      id: 'live-placeholder',
      query: queryText,
      steps: [placeholderStep],
      response: '',
      relatedCardTypes: [],
    };

    set({
      activeScript: placeholderScript,
      isRunning: true,
      isLiveMode: true,
      isComplete: false,
      elapsedTime: 0,
      stepStatuses: [{ stepId: 'live-placeholder', status: 'running' }],
      conversation: [...get().conversation, userMessage],
      query: queryText,
    });

    const startTime = Date.now();

    // Build conversation history for context (last 6 messages)
    const history = get().conversation.slice(-6).map(m => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText, conversationHistory: history }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);

      const { response, steps } = await res.json() as { response: string; steps: AgentStep[] };

      // Build real script from API response
      const liveScript: AgentScript = {
        id: `live-${Date.now()}`,
        query: queryText,
        steps,
        response,
        relatedCardTypes: [],
      };

      set({
        activeScript: liveScript,
        stepStatuses: steps.map(s => ({ stepId: s.id, status: 'pending' })),
      });

      // Animate steps the same way runScript does
      let cumulativeDelay = 0;
      steps.forEach((step, index) => {
        const runDelay = cumulativeDelay;
        cumulativeDelay += step.durationMs;
        const doneDelay = cumulativeDelay;

        setTimeout(() => {
          set(state => ({
            stepStatuses: state.stepStatuses.map(s =>
              s.stepId === step.id ? { ...s, status: 'running' } : s
            ),
          }));
        }, runDelay);

        setTimeout(() => {
          set(state => ({
            stepStatuses: state.stepStatuses.map(s =>
              s.stepId === step.id ? { ...s, status: 'done' } : s
            ),
          }));

          if (index === steps.length - 1) {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            const agentMessage: ConversationMessage = {
              id: `msg-${Date.now()}`,
              role: 'agent',
              content: response,
              timestamp: new Date(),
            };
            set(state => ({
              isRunning: false,
              isComplete: true,
              isLiveMode: false,
              elapsedTime: parseFloat(elapsed),
              conversation: [...state.conversation, agentMessage],
            }));
          }
        }, doneDelay);
      });
    } catch (err) {
      console.error('runLive error, falling back to script-7:', err);
      // Remove the placeholder user message — runScript will re-add it
      set(state => ({
        conversation: state.conversation.filter(m => m.id !== userMessage.id),
        isLiveMode: false,
      }));
      get().runScript('script-7', queryText);
    }
  },

  resetAgent: () => set({
    activeScript: null,
    isRunning: false,
    isLiveMode: false,
    stepStatuses: [],
    isComplete: false,
    elapsedTime: 0,
    query: '',
  }),
}));
