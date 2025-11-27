import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
  socket: null,
  messages: [],
  typing: false,
  typingUser: null,
  isConnected: false,

  setSocket: (socket) => set({ socket, isConnected: socket?.connected || false }),

  addMessage: (message) =>
    set((state) => {
      // Check if message already exists (prevent duplicates)
      const messageExists = state.messages.some((msg) => msg.id === message.id);
      if (messageExists) {
        return state;
      }
      return {
        messages: [...state.messages, message],
      };
    }),

  setMessages: (messages) => set({ messages }),

  setTyping: (typing, user = null) => set({ typing, typingUser: user }),

  clearMessages: () => set({ messages: [] }),
}));

