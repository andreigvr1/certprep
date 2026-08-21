// Core content model for CertPrep. Content is DATA, not code: every certification
// is a ContentPack that plugs into the same app. Keep this stable — the repository,
// stores, and screens all depend on these shapes.

export type QuestionType = 'single' | 'multi';

export interface QuestionOption {
  id: string; // 'A' | 'B' | 'C' | 'D' | 'E'
  text: string;
}

export interface Question {
  id: string;
  domainId: string;
  topicId: string;
  type: QuestionType;
  stem: string;
  options: QuestionOption[];
  correct: string[]; // option ids
  explanation: string;
  difficulty: 1 | 2 | 3; // 1 easy, 2 medium, 3 hard
  tags: string[];
  references?: string[]; // AWS doc breadcrumbs, e.g. "AWS Documentation > Amazon S3 > ..."
  inShort?: string; // plain-language one-line takeaway of why the answer is right
  trap?: string; // the most tempting wrong option and the distinction that rules it out
  confusableId?: string; // id of the most relevant Comparison card, if one applies
}

export interface Topic {
  id: string;
  domainId: string;
  name: string;
  summary: string;
  learn: string; // markdown study note
  keyPoints: string[];
  services: string[];
  verified: boolean; // passed the adversarial correctness pass
  taskId?: string; // official exam task statement id, e.g. "1.1"
  taskTitle?: string; // e.g. "Design secure access to AWS resources"
  inShort?: string; // plain-language one-liner: the single thing to remember for this topic
  triggers?: { when: string; pick: string }[]; // decision-trigger heuristics ("when you see X, pick Y")
}

export interface Domain {
  id: string;
  name: string;
  weight: number; // percent of the exam
  blurb: string;
}

// A "confusables" card: directly contrasts services/concepts that create exam confusion.
export interface Comparison {
  id: string;
  domainId: string;
  title: string;
  items: string[]; // the things being contrasted
  rows: { label: string; values: string[] }[]; // values aligned to items
  bottomLine: string; // the exam heuristic
  tags: string[];
}

// A service glossary entry: the canonical definition of one AWS service/feature,
// written to answer "what is this, exactly, and when do I reach for it over its look-alikes."
export interface Service {
  id: string; // slug, e.g. 's3', 'ebs', 'lambda'
  name: string; // canonical display name, e.g. "Amazon S3"
  category: string; // one of SERVICE_CATEGORIES
  oneLiner: string; // one-sentence definition in plain language
  specifics: string[]; // concrete, exam-relevant facts: scope (regional/zonal/global), limits, pricing shape, behavior
  bestFor: string[]; // scenarios where this is the right pick
  watchOutFor?: string[]; // limitations, common misconceptions, or where it's frequently mis-picked
  distinguishFrom?: { service: string; note: string; comparisonId?: string }[]; // the specific tell vs a look-alike service; comparisonId links to a full Comparison card when one exists
  patternIds?: string[]; // related DesignPattern ids
  triggers?: { when: string; pick: string }[]; // recognition cues: "when the scenario says X, that's a sign to pick this service" — same shape as Topic.triggers
}

export const SERVICE_CATEGORIES = [
  'Compute',
  'Storage',
  'Database',
  'Networking',
  'Security & Identity',
  'Messaging & Integration',
  'Analytics & Streaming',
  'Migration & Transfer',
  'Management, Monitoring & Cost',
  'Machine Learning',
] as const;

// A reusable architecture recipe: the problem shape that calls for it, the solution,
// which services compose it, and the trap the exam sets around it.
export interface DesignPattern {
  id: string;
  name: string;
  category: 'Security' | 'Resilience' | 'Performance' | 'Cost';
  problem: string; // the scenario shape that signals this pattern
  solution: string; // the recipe
  serviceIds: string[]; // Service ids involved, in order of the data/request flow
  watchOutFor?: string; // the exam trap most associated with this pattern
}

export interface ExamMeta {
  minutes: number;
  numQuestions: number;
  passScore: number;
  scoreMin: number;
  scoreMax: number;
}

export interface ContentPack {
  id: string;
  name: string;
  code: string;
  version: string;
  exam: ExamMeta;
  domains: Domain[];
  topics: Topic[];
  questions: Question[];
  comparisons: Comparison[];
  services: Service[];
  designPatterns: DesignPattern[];
  // Maps free-text service names as they appear in Topic.services / question tags to
  // canonical Service ids, for cases a plain substring match on Service.name won't catch
  // (e.g. "Application Load Balancer (ALB)" -> "elb"). Optional per pack.
  serviceAliases?: Record<string, string>;
}
