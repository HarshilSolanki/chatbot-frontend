import { create } from 'zustand';

const getStoredAuth = () => {
  try {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('authUser');
    return {
      token: token || null,
      user: userStr ? JSON.parse(userStr) : null,
    };
  } catch {
    return { token: null, user: null };
  }
};

export const useAuthStore = create((set) => ({
  ...getStoredAuth(),
  setAuth: (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    set({ token: null, user: null });
  },
}));

