/**
 * Copies the self-hosted web fonts (latin subset) from node_modules into assets/fonts.
 * Self-hosting removes the render-blocking Google Fonts request and keeps the page
 * working offline.   npm run build:fonts
 */
import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'assets/fonts');
mkdirSync(out, { recursive: true });

const files = [
  ['node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'inter-latin-var.woff2'],
  ['node_modules/@fontsource/merriweather/files/merriweather-latin-700-normal.woff2', 'merriweather-latin-700.woff2'],
];
files.forEach(([from, to]) => copyFileSync(join(root, from), join(out, to)));
console.log(`Copied ${files.length} fonts to assets/fonts`);
