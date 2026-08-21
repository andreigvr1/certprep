import { questions, questionsForDomain, questionsForTopic } from '../content/repository';
import type { Question } from '../content/types';
import type { QStat } from '../store/progressStore';
import { getWeakTopicIds } from './mastery';

export type QuizScope =
  | { kind: 'all' }
  | { kind: 'domain'; id: string }
  | { kind: 'topic'; id: string }
  | { kind: 'weak' };

export function isAnswerCorrect(q: Question, selected: string[]): boolean {
  if (selected.length !== q.correct.length) return false;
  const set = new Set(q.correct);
  return selected.every((s) => set.has(s));
}

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Bias selection toward what the learner most needs: unseen first, then previously
// wrong, then previously correct — shuffled within each bucket.
function pickWithBias(pool: Question[], qstats: Record<string, QStat>, count: number): Question[] {
  const unseen: Question[] = [];
  const wrong: Question[] = [];
  const right: Question[] = [];
  for (const q of pool) {
    const st = qstats[q.id];
    if (!st || st.seen === 0) unseen.push(q);
    else if (!st.lastCorrect) wrong.push(q);
    else right.push(q);
  }
  const ordered = [...shuffle(unseen), ...shuffle(wrong), ...shuffle(right)];
  return ordered.slice(0, Math.min(count, ordered.length));
}

export function buildQuiz(scope: QuizScope, qstats: Record<string, QStat>, count = 20): Question[] {
  let pool: Question[];
  switch (scope.kind) {
    case 'domain':
      pool = questionsForDomain(scope.id);
      break;
    case 'topic':
      pool = questionsForTopic(scope.id);
      break;
    case 'weak': {
      const weak = getWeakTopicIds(qstats);
      pool = weak.length ? questions.filter((q) => weak.includes(q.topicId)) : questions;
      break;
    }
    case 'all':
    default:
      pool = questions;
  }
  return pickWithBias(pool, qstats, count);
}
