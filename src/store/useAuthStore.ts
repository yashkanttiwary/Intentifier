import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  apiKey: string;
  rememberKey: boolean;
  setApiKey: (key: string, remember: boolean) => void;
  clearApiKey: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      apiKey: '',
      rememberKey: false,
      setApiKey: (key, remember) => set({ apiKey: key, rememberKey: remember }),
      clearApiKey: () => set({ apiKey: '', rememberKey: false }),
    }),
    {
      name: 'intentifier-auth',
      partialize: (state) => ({
        // Only persist if rememberKey is true
        ...(state.rememberKey ? { apiKey: state.apiKey, rememberKey: state.rememberKey } : { rememberKey: state.rememberKey }),
      }),
    }
  )
);
