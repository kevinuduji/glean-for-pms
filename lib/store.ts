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

export type Chat = {
  id: string;
  title: string;
  messages: ConversationMessage[];
  projectId?: string;
  createdAt: string;
  updatedAt: string;
};

// ─── localStorage helpers ──────────────────────────────────────────────────

const LS_KEY = 'agent-chat-history-v2';

function loadPersisted(): { savedChats: Chat[] } {
  if (typeof window === 'undefined') return { savedChats: [] };
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : { savedChats: [] };
  } catch {
    return { savedChats: [] };
  }
}

function syncToStorage(savedChats: Chat[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ savedChats }));
  } catch {}
}

function autoTitle(messages: ConversationMessage[]): string {
  const first = messages.find(m => m.role === 'user');
  if (!first) return 'Untitled chat';
  return first.content.length > 50 ? first.content.slice(0, 50) + '…' : first.content;
}

// ─── Store types ───────────────────────────────────────────────────────────

type AgentStore = {
  // Active chat state
  query: string;
  setQuery: (q: string) => void;
  activeScript: AgentScript | null;
  isRunning: boolean;
  isLiveMode: boolean;
  stepStatuses: RunningStep[];
  isComplete: boolean;
  elapsedTime: number;
  conversation: ConversationMessage[];

  // Chat history
  savedChats: Chat[];
  activeChatId: string | null;

  // Init
  hydrate: () => void;

  // Agent actions
  runScript: (scriptId: string, queryText?: string) => void;
  runLive: (queryText: string) => void;
  resetAgent: (saveFirst?: boolean) => void;

  // Chat history actions
  saveCurrentChat: () => string | null;
  loadChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  renameChat: (chatId: string, title: string) => void;
  moveChatToProject: (chatId: string, projectId: string | null) => void;
};

// ─── Store ────────────────────────────────────────────────────────────────

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

  savedChats: [],
  activeChatId: null,

  hydrate: () => {
    const { savedChats } = loadPersisted();
    set({ savedChats });
  },

  // ── Agent runners ──────────────────────────────────────────────────────

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
      activeChatId: null,
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
    const userMessage: ConversationMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date(),
    };

    const placeholderStep: AgentStep = {
      id: 'live-placeholder',
      tool: 'agent',
      action: 'Connecting to data connectors and analyzing your query...',
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
      activeChatId: null,
    });

    const startTime = Date.now();

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
      set(state => ({
        conversation: state.conversation.filter(m => m.id !== userMessage.id),
        isLiveMode: false,
      }));
      get().runScript('script-7', queryText);
    }
  },

  resetAgent: (saveFirst = false) => {
    if (saveFirst) get().saveCurrentChat();
    set({
      activeScript: null,
      isRunning: false,
      isLiveMode: false,
      stepStatuses: [],
      isComplete: false,
      elapsedTime: 0,
      query: '',
      conversation: [],
      activeChatId: null,
    });
  },

  // ── Chat history actions ───────────────────────────────────────────────

  saveCurrentChat: () => {
    const { conversation, activeChatId, savedChats } = get();
    if (conversation.length === 0) return null;

    const now = new Date().toISOString();

    if (activeChatId) {
      const updated = savedChats.map(c =>
        c.id === activeChatId
          ? { ...c, messages: conversation, updatedAt: now }
          : c
      );
      set({ savedChats: updated });
      syncToStorage(updated);
      return activeChatId;
    }

    // Tag chat with the currently active project
    const activeProjectId: string = (() => {
      try {
        // Lazy access to avoid circular dependency
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { useProjectStore } = require('@/lib/project-store');
        return useProjectStore.getState().activeProjectId ?? '';
      } catch {
        return '';
      }
    })();

    const chat: Chat = {
      id: `chat-${Date.now()}`,
      title: autoTitle(conversation),
      messages: conversation,
      ...(activeProjectId ? { projectId: activeProjectId } : {}),
      createdAt: now,
      updatedAt: now,
    };
    const updated = [chat, ...savedChats];
    set({ savedChats: updated, activeChatId: chat.id });
    syncToStorage(updated);
    return chat.id;
  },

  loadChat: (chatId: string) => {
    const chat = get().savedChats.find(c => c.id === chatId);
    if (!chat) return;
    set({
      conversation: chat.messages,
      activeChatId: chatId,
      activeScript: null,
      isRunning: false,
      isLiveMode: false,
      stepStatuses: [],
      isComplete: false,
      elapsedTime: 0,
      query: '',
    });
  },

  deleteChat: (chatId: string) => {
    const { savedChats, activeChatId } = get();
    const updated = savedChats.filter(c => c.id !== chatId);
    set({
      savedChats: updated,
      ...(activeChatId === chatId ? { activeChatId: null, conversation: [] } : {}),
    });
    syncToStorage(updated);
  },

  renameChat: (chatId: string, title: string) => {
    const { savedChats } = get();
    const updated = savedChats.map(c =>
      c.id === chatId ? { ...c, title, updatedAt: new Date().toISOString() } : c
    );
    set({ savedChats: updated });
    syncToStorage(updated);
  },

  moveChatToProject: (chatId: string, projectId: string | null) => {
    const { savedChats } = get();
    const updated = savedChats.map(c => {
      if (c.id !== chatId) return c;
      const chat = { ...c, updatedAt: new Date().toISOString() };
      if (projectId) {
        chat.projectId = projectId;
      } else {
        delete chat.projectId;
      }
      return chat;
    });
    set({ savedChats: updated });
    syncToStorage(updated);
  },
}));
