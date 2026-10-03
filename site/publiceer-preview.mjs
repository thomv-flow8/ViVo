// Publiceert de motion-site als HOMEPAGE: docs-preview/motion.html → docs/index.html, met alle benodigde bestanden
// (beelden, three.js, GSAP, drie.js). Het oude previewadres docs/preview/ stuurt door naar de homepage.
// Draaien: na `node site/bouw.mjs` en `node site/preview-motion.mjs` (zit in `npm run bouw`).
// Let op: three.js gaat ongebundeld mee (±2,1 MB, gzip ±0,5 MB) — later bundelen (esbuild, akkoord Thomas nodig).
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE } from './inhoud.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const docs = join(root, 'docs');
const kopieer = (bron, doel) => { mkdirSync(dirname(join(docs, doel)), { recursive: true }); copyFileSync(join(root, bron), join(docs, doel)); };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const vervang = (html, van, naar) => { if (html.split(van).length - 1 !== 1) throw new Error(`Verwacht precies één keer: ${van.slice(0, 60)}`); return html.replace(van, () => naar); };

let html = readFileSync(join(root, 'docs-preview', 'motion.html'), 'utf8');

// 1. Paden: van docs-preview/ naar de root van docs/ (volgorde: specifiek vóór algemeen)
const PADEN = [
  ['../node_modules/three/build/three.module.js', './js/three/three.module.js'], // importmap-adressen moeten met ./ beginnen
  ['../node_modules/three/examples/jsm/', './js/three/addons/'],
  ['../node_modules/gsap/dist/', 'js/'],
  ['../site/drie.js', 'js/drie.js'],
  ['../beelden/', 'beelden/'],
  ['../docs/', ''],
];
for (const [van, naar] of PADEN) {
  if (!html.includes(van)) throw new Error(`Pad niet gevonden in de preview: ${van}`);
  html = html.split(van).join(naar);
}
if (html.includes('../')) throw new Error('Er staat nog een ../-pad in de homepage');

// 2. Kop van de pagina: titel, beschrijving, deelgegevens, favicon — geen previewlabel
const titel = `${SITE.bedrijfKort} — Websites die werken`;
html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(titel)}</title>
<meta name="description" content="${esc(SITE.beschrijving)}">
<link rel="canonical" href="${SITE.url}/">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(titel)}">
<meta property="og:description" content="${esc(SITE.beschrijving)}">
<meta property="og:url" content="${SITE.url}/">
<meta property="og:locale" content="nl_NL">
<meta name="theme-color" content="#15171c">
<link rel="icon" href="favicon.svg" type="image/svg+xml">`);
html = html.replace(/<div class="noot">[^<]*<\/div>\s*/, '');

// 3. Meten (cookies): alleen als er ID's in SITE.meten staan — zelfde gedrag als de overige pagina's
const M = SITE.meten || {};
if (M.ga4 || M.googleAds || M.metaPixel) {
  html = vervang(html, '<a href="privacy/">Privacy</a><a href="voorwaarden/">Voorwaarden</a>',
    '<a href="privacy/">Privacy</a><a href="voorwaarden/">Voorwaarden</a><a href="cookies/">Cookies</a><a href="#" data-cookie-instellingen>Cookie-instellingen</a>');
  html = vervang(html, '</body>', `<script>window.VIVO_METEN = ${JSON.stringify({ ...M, pad: '' })};</script>\n<script src="js/toestemming.js" defer></script>\n</body>`);
}

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

// 4. Controle: elke lokale verwijzing moet in docs/ bestaan
for (const [, pad] of html.matchAll(/(?:src|href)="(?!https?:|#|mailto:|tel:|data:)([^"#?]+)/g)) {
  const doel = join(docs, pad.endsWith('/') ? pad + 'index.html' : pad);
  if (!existsSync(doel)) throw new Error(`Ontbreekt in docs/: ${pad}`);
}

writeFileSync(join(docs, 'index.html'), html);
// Oud previewadres → homepage
mkdirSync(join(docs, 'preview'), { recursive: true });
writeFileSync(join(docs, 'preview', 'index.html'), `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="robots" content="noindex"><link rel="canonical" href="${SITE.url}/"><meta http-equiv="refresh" content="0; url=../"><title>${esc(titel)}</title></head><body><p><a href="../">Naar de homepage van ${esc(SITE.bedrijfKort)}</a></p></body></html>\n`);
console.log('docs/index.html = motion-site (homepage); docs/preview/ stuurt door');
