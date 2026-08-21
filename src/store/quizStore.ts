import { create } from 'zustand';
import type { Question } from '../content/types';
import { isAnswerCorrect } from '../logic/quiz';

export interface PerQuestionResult {
  qid: string;
  topicId: string;
  domainId: string;
  correct: boolean;
  selected: string[];
}

export interface QuizResult {
  total: number;
  correct: number;
  scopeLabel: string;
  domainId?: string;
  perQuestion: PerQuestionResult[];
}

interface QuizState {
  questions: Question[];
  index: number;
  scopeLabel: string;
  domainId?: string;
  selected: Record<string, string[]>;
  revealed: Record<string, boolean>;
  result?: QuizResult;
  start: (questions: Question[], scopeLabel: string, domainId?: string) => void;
  toggleOption: (qid: string, optionId: string, multi: boolean) => void;
  reveal: (qid: string) => void;
  next: () => void;
  finish: () => QuizResult;
  reset: () => void;
}

export const useQuiz = create<QuizState>((set, get) => ({
  questions: [],
  index: 0,
  scopeLabel: '',
  domainId: undefined,
  selected: {},
  revealed: {},
  result: undefined,
  start: (questions, scopeLabel, domainId) =>
    set({ questions, scopeLabel, domainId, index: 0, selected: {}, revealed: {}, result: undefined }),
  toggleOption: (qid, optionId, multi) =>
    set((s) => {
      if (s.revealed[qid]) return s;
      const cur = s.selected[qid] ?? [];
      let next: string[];
      if (multi) {
        next = cur.includes(optionId) ? cur.filter((o) => o !== optionId) : [...cur, optionId];
      } else {
        next = [optionId];
      }
      return { selected: { ...s.selected, [qid]: next } };
    }),
  reveal: (qid) => set((s) => ({ revealed: { ...s.revealed, [qid]: true } })),
  next: () => set((s) => ({ index: Math.min(s.index + 1, s.questions.length) })),
  finish: () => {
    const s = get();
    const perQuestion: PerQuestionResult[] = s.questions.map((q) => {
      const sel = s.selected[q.id] ?? [];
      return { qid: q.id, topicId: q.topicId, domainId: q.domainId, correct: isAnswerCorrect(q, sel), selected: sel };
    });
    const correct = perQuestion.filter((p) => p.correct).length;
    const result: QuizResult = {
      total: s.questions.length,
      correct,
      scopeLabel: s.scopeLabel,
      domainId: s.domainId,
      perQuestion,
    };
    set({ result });
    return result;
  },
  reset: () => set({ questions: [], index: 0, selected: {}, revealed: {}, result: undefined, scopeLabel: '', domainId: undefined }),
}));
