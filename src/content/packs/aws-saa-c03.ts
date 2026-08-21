import type { ContentPack } from '../types';
import { domains, topics, questions } from './aws-saa-c03.data';
import { comparisons } from './aws-saa-c03.comparisons';
import { services } from './aws-saa-c03.services';
import { designPatterns } from './aws-saa-c03.patterns';
import { serviceAliases } from './aws-saa-c03.service-aliases';

export const awsSaaC03: ContentPack = {
  id: 'aws-saa-c03',
  name: 'AWS Solutions Architect – Associate',
  code: 'SAA-C03',
  version: '0.8.0',
  exam: {
    minutes: 130,
    numQuestions: 65,
    passScore: 720,
    scoreMin: 100,
    scoreMax: 1000,
  },
  domains,
  topics,
  questions,
  comparisons,
  services,
  designPatterns,
  serviceAliases,
};
