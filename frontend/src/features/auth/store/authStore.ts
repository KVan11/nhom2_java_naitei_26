import { create } from 'zustand';
import { User, LoginRequest, RegisterRequest } from '../schemas/auth';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface AuthActions {
  login: (data: LoginRequest) => Promise<User>;
  register: (data: RegisterRequest) => Promise<User>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  loading: false,

  login: async (data: LoginRequest) => {
    set({ loading: true });
    try {
      const user = await authService.login(data);
      set({ user });
      return user;
    } catch (error) {
      set({ user: null });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  register: async (data: RegisterRequest) => {
    set({ loading: true });
    try {
      const user = await authService.register(data);
      return user;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await authService.logout();
    } finally {
      set({ user: null, loading: false });
    }
  },

  checkSession: async () => {
    set({ loading: true });
    try {
      const user = await authService.getMe();
      set({ user });
    } catch (error) {
      set({ user: null });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      set({ loading: false });
    }
  },

  updateUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  }
}));
