import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const iconsetsDir = path.resolve(__dirname, '../src/iconsets');

async function main(): Promise<void> {
  console.log('Generating iconsets in pure TypeScript...');

  // 1. MDI (from node_modules/@mdi/font)
  console.log('Fetching MDI...');
  const mdiCssPath = path.resolve(__dirname, '../../../node_modules/@mdi/font/css/materialdesignicons.css');
  let mdiIcons: string[] = [];
  if (fs.existsSync(mdiCssPath)) {
    const css = fs.readFileSync(mdiCssPath, 'utf8');
    mdiIcons = [...new Set([...css.matchAll(/\.mdi-([a-z0-9-]+)::before/g)].map((m) => m[1]))].sort();
  }
  fs.writeFileSync(
    path.join(iconsetsDir, 'mdi.ts'),
    `import type { IconSetDefinition } from '../types';

export const mdiIconSet: IconSetDefinition = {
  id: 'mdi',
  title: 'Material Design',
  prefix: 'mdi mdi-',
  formatter: (name: string) => \`mdi mdi-\${name}\`,
  icons: ${JSON.stringify(mdiIcons, null, 2)}
};
`
  );
  console.log(`MDI saved: ${mdiIcons.length} icons.`);

  // 2. FontAwesome
  console.log('Fetching FontAwesome...');
  try {
    const faRes = await fetch('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/metadata/icons.json');
    const faJson = (await faRes.json()) as Record<string, { free?: string[] }>;
    const faIcons: string[] = [];
    for (const [name, data] of Object.entries(faJson)) {
      if (data.free && data.free.length > 0) {
        if (data.free.includes('brands')) {
          faIcons.push(`fa-brands fa-${name}`);
        } else if (data.free.includes('solid')) {
          faIcons.push(`fa-solid fa-${name}`);
        } else if (data.free.includes('regular')) {
          faIcons.push(`fa-regular fa-${name}`);
        } else {
          faIcons.push(`fa fa-${name}`);
        }
      }
    }
    faIcons.sort();
    fs.writeFileSync(
      path.join(iconsetsDir, 'fontawesome.ts'),
      `import type { IconSetDefinition } from '../types';

export const fontawesomeIconSet: IconSetDefinition = {
  id: 'fa',
  title: 'Font Awesome',
  prefix: 'fa',
  formatter: (name: string) => name,
  icons: ${JSON.stringify(faIcons, null, 2)}
};
`
    );
    console.log(`FontAwesome saved: ${faIcons.length} icons.`);
  } catch (err) {
    console.error('Error generating FontAwesome:', err);
  }

  // 3. Bootstrap Icons
  console.log('Fetching Bootstrap Icons...');
  try {
    const biRes = await fetch('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.json');
    const biJson = (await biRes.json()) as Record<string, unknown>;
    const biIcons = Object.keys(biJson).sort();
    fs.writeFileSync(
      path.join(iconsetsDir, 'bootstrap.ts'),
      `import type { IconSetDefinition } from '../types';

export const bootstrapIconSet: IconSetDefinition = {
  id: 'bi',
  title: 'Bootstrap Icons',
  prefix: 'bi bi-',
  formatter: (name: string) => \`bi bi-\${name}\`,
  icons: ${JSON.stringify(biIcons, null, 2)}
};
`
    );
    console.log(`Bootstrap Icons saved: ${biIcons.length} icons.`);
  } catch (err) {
    console.error('Error generating Bootstrap Icons:', err);
  }

  // 4. Tabler Icons
  console.log('Fetching Tabler Icons...');
  try {
    const tablerRes = await fetch('https://cdn.jsdelivr.net/npm/@tabler/icons@3.19.0/icons.json');
    const tablerJson = await tablerRes.json();
    const tablerIcons = (Array.isArray(tablerJson) ? tablerJson : Object.keys(tablerJson)).sort();
    fs.writeFileSync(
      path.join(iconsetsDir, 'tabler.ts'),
      `import type { IconSetDefinition } from '../types';

export const tablerIconSet: IconSetDefinition = {
  id: 'tabler',
  title: 'Tabler Icons',
  prefix: 'ti ti-',
  formatter: (name: string) => \`ti ti-\${name}\`,
  icons: ${JSON.stringify(tablerIcons, null, 2)}
};
`
    );
    console.log(`Tabler Icons saved: ${tablerIcons.length} icons.`);
  } catch (err) {
    console.error('Error generating Tabler Icons:', err);
  }

  // 5. Remix Icon
  console.log('Fetching Remix Icon...');
  try {
    const riRes = await fetch('https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.glyph.json');
    const riJson = (await riRes.json()) as Record<string, unknown>;
    const riIcons = Object.keys(riJson).sort();
    fs.writeFileSync(
      path.join(iconsetsDir, 'remix.ts'),
      `import type { IconSetDefinition } from '../types';

export const remixIconSet: IconSetDefinition = {
  id: 'remix',
  title: 'Remix Icon',
  prefix: 'ri-',
  formatter: (name: string) => \`ri-\${name}\`,
  icons: ${JSON.stringify(riIcons, null, 2)}
};
`
    );
    console.log(`Remix Icons saved: ${riIcons.length} icons.`);
  } catch (err) {
    console.error('Error generating Remix Icons:', err);
  }

  // 6. Boxicons
  console.log('Fetching Boxicons...');
  try {
    const bxRes = await fetch('https://unpkg.com/boxicons@2.1.4/css/boxicons.css');
    const bxCss = await bxRes.text();
    const bxIcons = [...new Set([...bxCss.matchAll(/\.bx-([a-z0-9-]+):before/g)].map((m) => m[1]))].sort();
    fs.writeFileSync(
      path.join(iconsetsDir, 'boxicons.ts'),
      `import type { IconSetDefinition } from '../types';

export const boxiconsIconSet: IconSetDefinition = {
  id: 'boxicons',
  title: 'Boxicons',
  prefix: 'bx bx-',
  formatter: (name: string) => \`bx bx-\${name}\`,
  icons: ${JSON.stringify(bxIcons, null, 2)}
};
`
    );
    console.log(`Boxicons saved: ${bxIcons.length} icons.`);
  } catch (err) {
    console.error('Error generating Boxicons:', err);
  }

  // 7. Lucide
  console.log('Fetching Lucide Icons...');
  try {
    const lucideRes = await fetch('https://unpkg.com/lucide-static@latest/icon-nodes.json');
    const lucideJson = (await lucideRes.json()) as Record<string, unknown>;
    const lucideIcons = Object.keys(lucideJson).sort();
    fs.writeFileSync(
      path.join(iconsetsDir, 'lucide.ts'),
      `import type { IconSetDefinition } from '../types';

export const lucideIconSet: IconSetDefinition = {
  id: 'lucide',
  title: 'Lucide Icons',
  prefix: 'lucide lucide-',
  formatter: (name: string) => \`lucide lucide-\${name}\`,
  icons: ${JSON.stringify(lucideIcons, null, 2)}
};
`
    );
    console.log(`Lucide Icons saved: ${lucideIcons.length} icons.`);
  } catch (err) {
    console.error('Error generating Lucide Icons:', err);
  }

  // Iconsets index
  fs.writeFileSync(
    path.join(iconsetsDir, 'index.ts'),
    `export * from './mdi';
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
`
  );
  console.log('Generated iconsets/index.ts in pure TypeScript');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
