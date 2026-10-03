// Publiceert de motion-preview op GitHub Pages: docs-preview/motion.html → docs/preview/index.html,
// met alle benodigde bestanden (beelden, three.js, GSAP, drie.js) erbij. Zoekmachines: noindex.
// Draaien: na `node site/bouw.mjs` en `node site/preview-motion.mjs` (zit in `npm run bouw`).
// Let op: three.js gaat hier ongebundeld mee (±2,1 MB, gzip ±0,5 MB) — bij de definitieve livegang bundelen.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const uit = join(root, 'docs', 'preview');
const kopieer = (bron, doel) => { mkdirSync(dirname(join(uit, doel)), { recursive: true }); copyFileSync(join(root, bron), join(uit, doel)); };

let html = readFileSync(join(root, 'docs-preview', 'motion.html'), 'utf8');
// Paden omzetten: van docs-preview/ naar docs/preview/ (volgorde: specifiek vóór algemeen)
const PADEN = [
  ['../node_modules/three/build/three.module.js', './js/three/three.module.js'], // importmap-adressen moeten met ./ beginnen
  ['../node_modules/three/examples/jsm/', './js/three/addons/'],
  ['../node_modules/gsap/dist/', 'js/'],
  ['../site/drie.js', 'js/drie.js'],
  ['../beelden/', 'beelden/'],
  ['../docs/', '../'],
];
for (const [van, naar] of PADEN) {
  if (!html.includes(van)) throw new Error(`Pad niet gevonden in de preview: ${van}`);
  html = html.split(van).join(naar);
}
if (/\.\.\/(node_modules|site|beelden|docs)\//.test(html)) throw new Error('Er staat nog een lokaal pad in de preview');
html = html.replace('<meta name="viewport"', '<meta name="robots" content="noindex">\n<meta name="viewport"');

// Elke ../-verwijzing moet in docs/ bestaan
for (const [, pad] of html.matchAll(/(?:src|href)="\.\.\/([^"#?]+)/g)) {
  const doel = join(root, 'docs', pad.endsWith('/') ? pad + 'index.html' : pad);
  if (!existsSync(doel)) throw new Error(`Ontbreekt in docs/: ${pad}`);
}

mkdirSync(uit, { recursive: true });
writeFileSync(join(uit, 'index.html'), html);
// Beelden: alleen de reeks die in gebruik is (niet de bewaarde varianten in kleur/ en zacht/)
for (const f of readdirSync(join(root, 'beelden/diensten')).filter(f => f.endsWith('.jpg'))) kopieer(`beelden/diensten/${f}`, `beelden/diensten/${f}`);
kopieer('beelden/vormen/lus-donker.png', 'beelden/vormen/lus-donker.png');
// Scripts
kopieer('site/drie.js', 'js/drie.js');
kopieer('node_modules/three/build/three.module.js', 'js/three/three.module.js');
kopieer('node_modules/three/build/three.core.js', 'js/three/three.core.js');
kopieer('node_modules/three/LICENSE', 'js/three/LICENSE');
kopieer('node_modules/three/examples/jsm/geometries/RoundedBoxGeometry.js', 'js/three/addons/geometries/RoundedBoxGeometry.js');
kopieer('node_modules/three/examples/jsm/environments/RoomEnvironment.js', 'js/three/addons/environments/RoomEnvironment.js');
kopieer('node_modules/gsap/dist/gsap.min.js', 'js/gsap.min.js');
kopieer('node_modules/gsap/dist/ScrollTrigger.min.js', 'js/ScrollTrigger.min.js');
console.log('docs/preview/ gepubliceerd (motion-preview, noindex)');
