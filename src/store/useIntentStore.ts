import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IntentState {
  intent: string;
  clarificationQuestions: any;
  clarificationAnswers: Record<string, any>;
  plan: any;
  rewards: any;
  selectedReward: any;
  setIntent: (intent: string) => void;
  setQuestions: (qs: any) => void;
  setAnswer: (id: string, answer: any) => void;
  setPlan: (plan: any) => void;
  setRewards: (rewards: any) => void;
  selectReward: (reward: any) => void;
  reset: () => void;
}

export const useIntentStore = create<IntentState>()(
  persist(
    (set) => ({
      intent: '',
      clarificationQuestions: null,
      clarificationAnswers: {},
      plan: null,
      rewards: null,
      selectedReward: null,
      
      setIntent: (intent) => set({ intent }),
      setQuestions: (qs) => set({ clarificationQuestions: qs }),
      setAnswer: (id, answer) => set((state) => ({
        clarificationAnswers: { ...state.clarificationAnswers, [id]: answer }
      })),
      setPlan: (plan) => set({ plan }),
      setRewards: (rewards) => set({ rewards }),
      selectReward: (reward) => set({ selectedReward: reward }),
      reset: () => set({ 
        intent: '', 
        clarificationQuestions: null, 
        clarificationAnswers: {}, 
        plan: null, 
        rewards: null, 
        selectedReward: null 
      }),
    }),
    {
      name: 'intentifier-data',
    }
  )
);
