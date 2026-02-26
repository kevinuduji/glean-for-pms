import { create } from 'zustand';
import { AgentScript, agentScripts } from './mock-data/agent-scripts';

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
  stepStatuses: RunningStep[];
  isComplete: boolean;
  elapsedTime: number;
  conversation: ConversationMessage[];
  runScript: (scriptId: string, queryText?: string) => void;
  resetAgent: () => void;
};

export const useAgentStore = create<AgentStore>((set, get) => ({
  query: '',
  setQuery: (q) => set({ query: q }),
  activeScript: null,
  isRunning: false,
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

  resetAgent: () => set({
    activeScript: null,
    isRunning: false,
    stepStatuses: [],
    isComplete: false,
    elapsedTime: 0,
    query: '',
  }),
}));
