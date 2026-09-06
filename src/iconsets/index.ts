export * from './mdi';
export * from './fontawesome';
export * from './bootstrap';
export * from './tabler';
export * from './remix';
export * from './boxicons';
export * from './lucide';

import { mdiIconSet } from './mdi';
import { fontawesomeIconSet } from './fontawesome';
import { bootstrapIconSet } from './bootstrap';
import { tablerIconSet } from './tabler';
import { remixIconSet } from './remix';
import { boxiconsIconSet } from './boxicons';
import { lucideIconSet } from './lucide';
import type { IconSetDefinition } from '../types';

export const builtInIconSets: Record<string, IconSetDefinition> = {
  mdi: mdiIconSet,
  fa: fontawesomeIconSet,
  fontawesome: fontawesomeIconSet,
  bi: bootstrapIconSet,
  bootstrap: bootstrapIconSet,
  tabler: tablerIconSet,
  ti: tablerIconSet,
  remix: remixIconSet,
  ri: remixIconSet,
  boxicons: boxiconsIconSet,
  bx: boxiconsIconSet,
  lucide: lucideIconSet,
};
