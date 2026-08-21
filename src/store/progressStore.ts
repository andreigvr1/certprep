import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface QStat {
  seen: number;
  correct: number;
  lastAt: number;
  lastCorrect: boolean;
}

export interface SessionRecord {
  id: string;
  at: number;
  scopeLabel: string;
  domainId?: string;
  total: number;
  correct: number;
}

interface ProgressState {
  qstats: Record<string, QStat>;
  sessions: SessionRecord[];
  hydrated: boolean;
  recordAttempt: (qid: string, isCorrect: boolean) => void;
  recordSession: (rec: { scopeLabel: string; domainId?: string; total: number; correct: number }) => void;
  resetAll: () => void;
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      qstats: {},
      sessions: [],
      hydrated: false,
      recordAttempt: (qid, isCorrect) =>
        set((s) => {
          const prev = s.qstats[qid] ?? { seen: 0, correct: 0, lastAt: 0, lastCorrect: false };
          return {
            qstats: {
              ...s.qstats,
              [qid]: {
                seen: prev.seen + 1,
                correct: prev.correct + (isCorrect ? 1 : 0),
                lastAt: Date.now(),
                lastCorrect: isCorrect,
              },
            },
          };
        }),
      recordSession: (rec) =>
        set((s) => ({
          sessions: [{ id: uid('s'), at: Date.now(), ...rec }, ...s.sessions].slice(0, 100),
        })),
      resetAll: () => set({ qstats: {}, sessions: [] }),
    }),
    {
      name: 'certprep-progress-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ qstats: s.qstats, sessions: s.sessions }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);
