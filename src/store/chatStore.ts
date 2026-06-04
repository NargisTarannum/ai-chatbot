import { create } from 'zustand';
import type { Message, ChatSession } from '@/types';

interface ChatStore {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  currentSession: ChatSession | null;
  setCurrentSession: (sessionId: string) => void;
  addMessage: (message: Message) => void;
  createSession: (title: string) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  setLoading: (loading: boolean) => void;
  fetchSessions: () => Promise<void>;
  deleteSession: (sessionId: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  sessions: [],
  currentSessionId: null,
  isLoading: false,
  currentSession: null,

  setCurrentSession: (sessionId: string) => {
    set({ currentSessionId: sessionId });
    const session = get().sessions.find((s) => s.id === sessionId);
    if (session) {
      set({ currentSession: session });
    }
  },

  addMessage: (message: Message) => {
    const sessionId = get().currentSessionId;
    if (!sessionId) return;

    set((state) => {
      const updatedSessions = state.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, messages: [...session.messages, message] }
          : session
      );
      const currentSession = updatedSessions.find((s) => s.id === sessionId);
      return {
        sessions: updatedSessions,
        currentSession,
      };
    });
  },

  createSession: (title: string) => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'current-user',
    };

    set((state) => ({
      sessions: [...state.sessions, newSession],
      currentSessionId: newSession.id,
      currentSession: newSession,
    }));
  },

  updateMessage: (messageId: string, updates: Partial<Message>) => {
    set((state) => {
      const updatedSessions = state.sessions.map((session) => ({
        ...session,
        messages: session.messages.map((msg) =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        ),
      }));
      const currentSession = updatedSessions.find(
        (s) => s.id === state.currentSessionId
      );
      return {
        sessions: updatedSessions,
        currentSession,
      };
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  fetchSessions: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch('/api/sessions');
      if (response.ok) {
        const sessions = await response.json();
        set({ sessions });
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSession: (sessionId: string) => {
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== sessionId),
      currentSessionId:
        state.currentSessionId === sessionId ? null : state.currentSessionId,
    }));
  },
}));
