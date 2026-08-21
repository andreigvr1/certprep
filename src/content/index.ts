import type { ContentPack } from './types';
import { awsSaaC03 } from './packs/aws-saa-c03';

// Registry of all content packs. Adding a new certification = add its pack here.
export const packs: ContentPack[] = [awsSaaC03];

// The pack the app is currently studying. When CertPrep becomes multi-cert, this
// becomes a user-selectable value; for now the first pack is active.
export const activePack: ContentPack = packs[0];
