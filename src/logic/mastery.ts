import { comparisons, domains, exam, getServiceByName, questions, questionsForDomain, questionsForTopic, services, topics } from '../content/repository';
import type { QStat } from '../store/progressStore';

export type TopicStatus = 'new' | 'learning' | 'weak' | 'ok' | 'strong';

export interface TopicMastery {
  topicId: string;
  domainId: string;
  name: string;
  attempts: number;
  correct: number;
  accuracy: number;
  seenCount: number;
  totalCount: number;
  coverage: number;
  status: TopicStatus;
  weak: boolean;
}

export interface DomainMastery {
  domainId: string;
  name: string;
  weight: number;
  attempts: number;
  correct: number;
  accuracy: number;
  coverage: number;
}

export interface Readiness {
  answered: number;
  totalQuestions: number;
  accuracy: number; // weighted by domain weight, 0..1
  scaled: number; // mapped onto the exam's score scale
  enoughData: boolean;
  ready: boolean;
  label: string;
}

function statusFor(attempts: number, accuracy: number): TopicStatus {
  if (attempts === 0) return 'new';
  if (attempts < 3) return 'learning';
  if (accuracy < 0.7) return 'weak';
  if (accuracy < 0.85) return 'ok';
  return 'strong';
}

export function topicMastery(qstats: Record<string, QStat>): TopicMastery[] {
  return topics.map((t) => {
    const qs = questionsForTopic(t.id);
    let attempts = 0;
    let correct = 0;
    let seenCount = 0;
    for (const q of qs) {
      const st = qstats[q.id];
      if (st && st.seen > 0) {
        attempts += st.seen;
        correct += st.correct;
        seenCount += 1;
      }
    }
    const accuracy = attempts ? correct / attempts : 0;
    const status = statusFor(attempts, accuracy);
    return {
      topicId: t.id,
      domainId: t.domainId,
      name: t.name,
      attempts,
      correct,
      accuracy,
      seenCount,
      totalCount: qs.length,
      coverage: qs.length ? seenCount / qs.length : 0,
      status,
      weak: status === 'weak',
    };
  });
}

export function domainMastery(qstats: Record<string, QStat>): DomainMastery[] {
  return domains.map((d) => {
    const qs = questionsForDomain(d.id);
    let attempts = 0;
    let correct = 0;
    let seenCount = 0;
    for (const q of qs) {
      const st = qstats[q.id];
      if (st && st.seen > 0) {
        attempts += st.seen;
        correct += st.correct;
        seenCount += 1;
      }
    }
    return {
      domainId: d.id,
      name: d.name,
      weight: d.weight,
      attempts,
      correct,
      accuracy: attempts ? correct / attempts : 0,
      coverage: qs.length ? seenCount / qs.length : 0,
    };
  });
}

// Weak topics for targeted review: genuine weak topics first; if none yet, fall back
// to the least-accurate tested topics so "review" always has something useful.
export function getWeakTopics(qstats: Record<string, QStat>): TopicMastery[] {
  const all = topicMastery(qstats);
  const weak = all
    .filter((t) => t.weak)
    .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts);
  if (weak.length) return weak;
  return all
    .filter((t) => t.attempts > 0 && t.accuracy < 0.85)
    .sort((a, b) => a.accuracy - b.accuracy);
}

export function getWeakTopicIds(qstats: Record<string, QStat>): string[] {
  return getWeakTopics(qstats).map((t) => t.topicId);
}

// ------------------------------------------------------------------ weakest-first ranking
// Score is 0..1 accuracy, or -1 for "not attempted yet" — unattempted material sorts first,
// treated as the highest priority (mirrors the browser artifact's convention).
function accOrUnstarted(seen: number, correct: number): number {
  return seen ? correct / seen : -1;
}

export function topicWeaknessMap(qstats: Record<string, QStat>): Record<string, number> {
  const map: Record<string, number> = {};
  for (const t of topics) {
    let seen = 0;
    let correct = 0;
    for (const q of questionsForTopic(t.id)) {
      const st = qstats[q.id];
      if (st) {
        seen += st.seen;
        correct += st.correct;
      }
    }
    map[t.id] = accOrUnstarted(seen, correct);
  }
  return map;
}

// Built once at module load: which topics reference each service (via the same name
// resolution TopicDetailScreen uses for its service pills), so a service's weakness can be
// derived as a proxy from the topics that touch it.
const topicIdsByServiceId: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {};
  for (const t of topics) {
    for (const name of t.services) {
      const svc = getServiceByName(name);
      if (!svc) continue;
      (map[svc.id] ??= []).push(t.id);
    }
  }
  return map;
})();

export function serviceWeaknessMap(qstats: Record<string, QStat>): Record<string, number> {
  const map: Record<string, number> = {};
  for (const s of services) {
    let seen = 0;
    let correct = 0;
    for (const tid of topicIdsByServiceId[s.id] ?? []) {
      for (const q of questionsForTopic(tid)) {
        const st = qstats[q.id];
        if (st) {
          seen += st.seen;
          correct += st.correct;
        }
      }
    }
    map[s.id] = accOrUnstarted(seen, correct);
  }
  return map;
}

// Uses the direct question.confusableId link (more precise than the service proxy above).
export function comparisonWeaknessMap(qstats: Record<string, QStat>): Record<string, number> {
  const map: Record<string, number> = {};
  for (const c of comparisons) {
    let seen = 0;
    let correct = 0;
    for (const q of questions) {
      if (q.confusableId !== c.id) continue;
      const st = qstats[q.id];
      if (st) {
        seen += st.seen;
        correct += st.correct;
      }
    }
    map[c.id] = accOrUnstarted(seen, correct);
  }
  return map;
}

export function byWeaknessScore(score: Record<string, number>) {
  return (a: { id: string }, b: { id: string }) => (score[a.id] ?? -1) - (score[b.id] ?? -1);
}

export function readiness(qstats: Record<string, QStat>): Readiness {
  const dm = domainMastery(qstats);
  const totalQuestions = topics.reduce((n, t) => n + questionsForTopic(t.id).length, 0);
  const answered = Object.values(qstats).filter((s) => s.seen > 0).length;

  // Weighted accuracy across domains that have data, using exam domain weights.
  let wSum = 0;
  let wAcc = 0;
  for (const d of dm) {
    if (d.attempts > 0) {
      wSum += d.weight;
      wAcc += d.accuracy * d.weight;
    }
  }
  const accuracy = wSum ? wAcc / wSum : 0;
  const scaled = Math.round(exam.scoreMin + accuracy * (exam.scoreMax - exam.scoreMin));

  const domainsCovered = dm.filter((d) => d.attempts > 0).length;
  const enoughData = answered >= 25 && domainsCovered >= 3;
  const ready = enoughData && scaled >= exam.passScore;

  let label: string;
  if (!enoughData) label = 'Keep practicing to unlock your estimate';
  else if (scaled >= exam.passScore + 60) label = 'On track — you look ready';
  else if (scaled >= exam.passScore) label = 'Around the pass line — keep going';
  else if (scaled >= exam.passScore - 100) label = 'Getting there — focus your weak spots';
  else label = 'Early days — lots of upside';

  return { answered, totalQuestions, accuracy, scaled, enoughData, ready, label };
}
