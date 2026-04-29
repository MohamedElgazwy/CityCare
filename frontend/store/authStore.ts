import { create } from 'zustand';

type AuthUser = {
  id: number;
  email: string;
  role: 'USER' | 'TECHNICIAN' | 'ADMIN';
  name?: string;
  photoUrl?: string | null;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  hydrated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  hydrate: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  hydrated: false,

  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },

  hydrate: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    set({ token, user: user ? JSON.parse(user) : null, hydrated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));
