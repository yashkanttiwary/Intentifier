import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  momentum: number;
  completedQuests: string[];
  addXp: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  completeQuest: (id: string, xp: number) => void;
  reset: () => void;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      streak: 0,
      momentum: 3, // Starts with basic momentum
      completedQuests: [],
      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        // Simple scaling, e.g. 100 XP per level scaling slightly
        const newLevel = Math.max(1, Math.floor(newXp / 100) + 1);
        return { xp: newXp, level: newLevel };
      }),
      incrementStreak: () => set((state) => ({ streak: state.streak + 1, momentum: Math.min(5, state.momentum + 1) })),
      resetStreak: () => set((state) => ({ streak: 0, momentum: Math.max(0, state.momentum - 1) })),
      completeQuest: (id, amount) => {
        if (!get().completedQuests.includes(id)) {
          get().addXp(amount);
          set((state) => ({ completedQuests: [...state.completedQuests, id] }));
        }
      },
      reset: () => set({ xp: 0, level: 1, streak: 0, momentum: 3, completedQuests: [] })
    }),
    {
      name: 'intentifier-gamification',
    }
  )
);
