// Thin query layer over the active content pack. Screens/logic go through here so the
// underlying storage (bundled JSON today, SQLite later) can change without touching UI.
import { activePack } from './index';
import type { Comparison, DesignPattern, Domain, Question, Service, Topic } from './types';

export const pack = activePack;

export const exam = pack.exam;
export const domains: Domain[] = pack.domains;
export const topics: Topic[] = pack.topics;
export const questions: Question[] = pack.questions;
export const comparisons: Comparison[] = pack.comparisons;
export const services: Service[] = pack.services;
export const designPatterns: DesignPattern[] = pack.designPatterns;

const domainById = new Map(domains.map((d) => [d.id, d]));
const topicById = new Map(topics.map((t) => [t.id, t]));
const questionById = new Map(questions.map((q) => [q.id, q]));

export function getDomain(id: string): Domain | undefined {
  return domainById.get(id);
}
export function getTopic(id: string): Topic | undefined {
  return topicById.get(id);
}
export function getQuestion(id: string): Question | undefined {
  return questionById.get(id);
}
const comparisonById = new Map(comparisons.map((c) => [c.id, c]));
export function getComparison(id: string): Comparison | undefined {
  return comparisonById.get(id);
}
const serviceById = new Map(services.map((s) => [s.id, s]));
export function getService(id: string): Service | undefined {
  return serviceById.get(id);
}
const patternById = new Map(designPatterns.map((p) => [p.id, p]));
export function getPattern(id: string): DesignPattern | undefined {
  return patternById.get(id);
}

function normalizeServiceName(s: string): string {
  return s.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}
const serviceIdByNormalizedName = new Map(services.map((s) => [normalizeServiceName(s.name), s.id]));
const serviceAliases = pack.serviceAliases ?? {};

// Resolves a free-text service name (as it appears in Topic.services) to its Service
// entry — via the pack's alias map first, then an exact/substring match on normalized
// names, so display strings that don't exactly match Service.name still link correctly.
export function getServiceByName(name: string): Service | undefined {
  const aliasId = serviceAliases[name];
  if (aliasId) return getService(aliasId);

  const normalized = normalizeServiceName(name);
  const exact = serviceIdByNormalizedName.get(normalized);
  if (exact) return getService(exact);

  let bestId: string | undefined;
  let bestLen = -1;
  for (const s of services) {
    const sn = normalizeServiceName(s.name);
    if ((normalized.includes(sn) || sn.includes(normalized)) && sn.length > bestLen) {
      bestId = s.id;
      bestLen = sn.length;
    }
  }
  return bestId ? getService(bestId) : undefined;
}

export function servicesByCategory(): { category: string; services: Service[] }[] {
  const order = [...new Set(services.map((s) => s.category))];
  return order.map((category) => ({ category, services: services.filter((s) => s.category === category) }));
}
export function patternsForService(serviceId: string): DesignPattern[] {
  return designPatterns.filter((p) => p.serviceIds.includes(serviceId));
}
export function patternsByCategory(): { category: string; patterns: DesignPattern[] }[] {
  const order = [...new Set(designPatterns.map((p) => p.category))];
  return order.map((category) => ({ category, patterns: designPatterns.filter((p) => p.category === category) }));
}

export function topicsForDomain(domainId: string): Topic[] {
  return topics.filter((t) => t.domainId === domainId);
}
export function questionsForDomain(domainId: string): Question[] {
  return questions.filter((q) => q.domainId === domainId);
}
export function questionsForTopic(topicId: string): Question[] {
  return questions.filter((q) => q.topicId === topicId);
}
export function comparisonsForDomain(domainId: string): Comparison[] {
  return comparisons.filter((c) => c.domainId === domainId);
}

export function domainColor(id: string): string {
  // stable accent hue per domain for charts/bars
  switch (id) {
    case 'd1':
      return '#6366F1'; // indigo
    case 'd2':
      return '#0EA5E9'; // sky
    case 'd3':
      return '#8B5CF6'; // violet
    case 'd4':
      return '#F59E0B'; // amber
    default:
      return '#64748B';
  }
}
