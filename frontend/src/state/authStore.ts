import { create } from 'zustand';
import { loginUser, getMe, type UserData } from '../services/authService';

interface AuthState {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  login: async (phone: string, password: string) => {
    set({ isLoading: true });
    try {
      const data = await loginUser({ phone, password });
      localStorage.setItem('token', data.access_token);
      set({
        token: data.access_token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
      throw new Error('Invalid phone number or password');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null, token: null });
      return;
    }
    try {
      const user = await getMe();
      set({ user, isAuthenticated: true, token });
    } catch {
      // Token expired or invalid
      localStorage.removeItem('token');
      set({ isAuthenticated: false, user: null, token: null });
    }
  },
}));
