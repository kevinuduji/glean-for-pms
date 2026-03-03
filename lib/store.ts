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

export type Project = {
  id: string;
  name: string;
  color: string;
  createdAt: string;
};

export const PROJECT_COLORS = ['indigo', 'emerald', 'amber', 'rose', 'violet', 'sky'] as const;

// ─── localStorage helpers ──────────────────────────────────────────────────

const LS_KEY = 'agent-chat-history';

function loadPersisted(): { savedChats: Chat[]; projects: Project[] } {
  if (typeof window === 'undefined') return { savedChats: [], projects: [] };
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : { savedChats: [], projects: [] };
  } catch {
    return { savedChats: [], projects: [] };
  }
}

function syncToStorage(savedChats: Chat[], projects: Project[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ savedChats, projects }));
  } catch {}
}

function autoTitle(messages: ConversationMessage[]): string {
  const first = messages.find(m => m.role === 'user');
  if (!first) return 'Untitled chat';
  return first.content.length > 50 ? first.content.slice(0, 50) + '…' : first.content;
}

function nextColor(projects: Project[]): string {
  const used = projects.map(p => p.color);
  const available = PROJECT_COLORS.filter(c => !used.includes(c));
  return available[0] ?? PROJECT_COLORS[projects.length % PROJECT_COLORS.length];
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
  projects: Project[];
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

  // Project actions
  createProject: (name: string) => string;
  deleteProject: (projectId: string) => void;
  renameProject: (projectId: string, name: string) => void;
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
  projects: [],
  activeChatId: null,

  hydrate: () => {
    const { savedChats, projects } = loadPersisted();
    set({ savedChats, projects });
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
    const { conversation, activeChatId, savedChats, projects } = get();
    if (conversation.length === 0) return null;

    const now = new Date().toISOString();

    if (activeChatId) {
      // Update existing chat
      const updated = savedChats.map(c =>
        c.id === activeChatId
          ? { ...c, messages: conversation, updatedAt: now }
          : c
      );
      set({ savedChats: updated });
      syncToStorage(updated, projects);
      return activeChatId;
    }

    // Create new saved chat
    const chat: Chat = {
      id: `chat-${Date.now()}`,
      title: autoTitle(conversation),
      messages: conversation,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [chat, ...savedChats];
    set({ savedChats: updated });
    syncToStorage(updated, projects);
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
    const { savedChats, projects, activeChatId } = get();
    const updated = savedChats.filter(c => c.id !== chatId);
    set({
      savedChats: updated,
      ...(activeChatId === chatId ? { activeChatId: null, conversation: [] } : {}),
    });
    syncToStorage(updated, projects);
  },

  renameChat: (chatId: string, title: string) => {
    const { savedChats, projects } = get();
    const updated = savedChats.map(c =>
      c.id === chatId ? { ...c, title, updatedAt: new Date().toISOString() } : c
    );
    set({ savedChats: updated });
    syncToStorage(updated, projects);
  },

  moveChatToProject: (chatId: string, projectId: string | null) => {
    const { savedChats, projects } = get();
    const updated = savedChats.map(c =>
      c.id === chatId
        ? { ...c, projectId: projectId ?? undefined, updatedAt: new Date().toISOString() }
        : c
    );
    set({ savedChats: updated });
    syncToStorage(updated, projects);
  },

  // ── Project actions ────────────────────────────────────────────────────

  createProject: (name: string) => {
    const { savedChats, projects } = get();
    const project: Project = {
      id: `proj-${Date.now()}`,
      name,
      color: nextColor(projects),
      createdAt: new Date().toISOString(),
    };
    const updated = [...projects, project];
    set({ projects: updated });
    syncToStorage(savedChats, updated);
    return project.id;
  },

  deleteProject: (projectId: string) => {
    const { savedChats, projects } = get();
    const updatedProjects = projects.filter(p => p.id !== projectId);
    // Unassign chats from deleted project
    const updatedChats = savedChats.map(c =>
      c.projectId === projectId ? { ...c, projectId: undefined } : c
    );
    set({ projects: updatedProjects, savedChats: updatedChats });
    syncToStorage(updatedChats, updatedProjects);
  },

  renameProject: (projectId: string, name: string) => {
    const { savedChats, projects } = get();
    const updated = projects.map(p => p.id === projectId ? { ...p, name } : p);
    set({ projects: updated });
    syncToStorage(savedChats, updated);
  },
}));
