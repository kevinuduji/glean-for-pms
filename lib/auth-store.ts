import { create } from 'zustand';

type User = {
  name: string;
  email: string;
  avatar?: string;
};

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (user?: Partial<User>) => void;
  signOut: () => void;
  hydrate: () => void;
};

const AUTH_LS_KEY = 'probe-auth';

function loadAuth(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistAuth(user: User | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(AUTH_LS_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_LS_KEY);
    }
  } catch {}
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  hydrate: () => {
    const user = loadAuth();
    set({ user, isAuthenticated: !!user });
  },

  signIn: (partial) => {
    const user: User = {
      name: partial?.name ?? 'Kevin',
      email: partial?.email ?? 'kevin@probe.ai',
      avatar: partial?.avatar,
    };
    persistAuth(user);
    set({ user, isAuthenticated: true });
  },

  signOut: () => {
    persistAuth(null);
    set({ user: null, isAuthenticated: false });
  },
}));
