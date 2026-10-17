/**
 * Concatenates + minifies the classic scripts in src/js into js/app.min.js.
 * Order matters: each file registers itself on window.EAK and later files read it.
 * (Classic scripts, not ES modules, so index.html still works when opened via file://.)
 *
 *   npm run build:js
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { transformSync } from 'esbuild';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORDER = ['data', 'icons', 'dates', 'render', 'forms', 'ui', 'main'];

const code = ORDER.map((name) => {
  const source = readFileSync(join(root, 'src/js', `${name}.js`), 'utf8');
  return transformSync(source, { minify: true, target: 'es2019', legalComments: 'none' }).code;
}).join('');

mkdirSync(join(root, 'js'), { recursive: true });
writeFileSync(join(root, 'js/app.min.js'), `/* EAK admissions page. Built from src/js by scripts/build-js.mjs */\n${code}`);
console.log(`Wrote js/app.min.js (${(code.length / 1024).toFixed(1)} KB)`);
