// Publiceert de motion-site naar docs/ (GitHub Pages): homepage, case-pagina's en juridische pagina's in de nieuwe stijl.
// Bron: docs-preview/*.html (gemaakt door site/preview-motion.mjs). Draaien via `npm run bouw` (na bouw.mjs + preview-motion.mjs).
// Per pagina: paden omzetten, titel/beschrijving/canonical/deelbeeld, inline CSS/JS verkleinen, cookiemelding (als er
// gemeten wordt) en een controle dat elke lokale verwijzing bestaat. three.js wordt met esbuild gebundeld en verkleind.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { SITE, CASES } from './inhoud.mjs';
import { PRIVACY, VOORWAARDEN, COOKIES } from './juridisch.mjs';
import { esc, meetVlaggen } from './juridisch-render.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const docs = join(root, 'docs');
const kopieer = (bron, doel) => { mkdirSync(dirname(join(docs, doel)), { recursive: true }); copyFileSync(join(root, bron), join(docs, doel)); };
const vervang = (html, van, naar) => { if (html.split(van).length - 1 !== 1) throw new Error(`Verwacht precies één keer: ${van.slice(0, 60)}`); return html.replace(van, () => naar); };
const M = SITE.meten || {}, MEET = meetVlaggen(M);

// ── Bestanden die de pagina's nodig hebben ──
for (const f of readdirSync(join(root, 'beelden/diensten')).filter(f => /\.(jpg|webp)$/.test(f))) kopieer(`beelden/diensten/${f}`, `beelden/diensten/${f}`);
kopieer('beelden/vormen/lus-donker.webp', 'beelden/vormen/lus-donker.webp');
for (const f of readdirSync(join(root, 'beelden/over')).filter(f => /\.(jpg|webp)$/.test(f))) kopieer(`beelden/over/${f}`, `beelden/over/${f}`);
kopieer('node_modules/gsap/dist/gsap.min.js', 'js/gsap.min.js');
kopieer('node_modules/gsap/dist/ScrollTrigger.min.js', 'js/ScrollTrigger.min.js');
kopieer('node_modules/three/LICENSE', 'js/three-LICENSE.txt');
// three.js: alleen wat drie.js gebruikt, gebundeld en verkleind (was ±2,1 MB los)
await build({ entryPoints: [join(root, 'site/drie.js')], bundle: true, minify: true, format: 'esm', target: 'es2020', outfile: join(docs, 'js/drie.js'), legalComments: 'none', logLevel: 'error' });
// Deelbeelden (tools/og-beelden.mjs) → docs/og/
const OG = existsSync(join(root, 'beelden/og')) ? readdirSync(join(root, 'beelden/og')).filter(f => f.endsWith('.jpg')) : [];
for (const f of OG) kopieer(`beelden/og/${f}`, `og/${f}`);

// ── Eén pagina publiceren ──
// r = pad van de pagina naar de root van de site ('' voor de homepage, '../../' voor een case)
function publiceer(bron, doel, r, { titel, beschrijving, pad, og }) {
  let p = readFileSync(join(root, 'docs-preview', bron), 'utf8');
  // 1. Paden van docs-preview/ naar de plek in docs/ (specifiek vóór algemeen)
  const PADEN = [
    ['<script type="importmap">{ "imports": { "three": "../node_modules/three/build/three.module.js", "three/addons/": "../node_modules/three/examples/jsm/" } }</script>\n', ''],
    ['<script type="module" src="../site/drie.js"></script>', `<script type="module" src="${r}js/drie.js"></script>`],
    ['../node_modules/gsap/dist/', `${r}js/`],
    ['../beelden/', `${r}beelden/`],
    ['../docs/', r],
    ['motion.html', r || './'],
    ['over.html', `${r}over/`],
    ...CASES.map(c => [`case-${c.slug}.html`, `${r}werk/${c.slug}/`]),
  ];
  for (const [van, naar] of PADEN) p = p.split(van).join(naar);
  if (/\.\.\/(node_modules|site|docs)\/|motion\.html|case-[a-z0-9]+\.html/.test(p)) throw new Error(`${bron}: er staat nog een previewpad in`);
  // 2. Kop: titel, beschrijving, canonical, deelgegevens, favicon — geen previewlabel
  const url = SITE.basis + pad, beeld = og && OG.includes(og) ? `${SITE.basis}/og/${og}` : '';
  p = p.replace(/<title>[^<]*<\/title>/, `<title>${esc(titel)}</title>
<meta name="description" content="${esc(beschrijving)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.bedrijfKort)}">
<meta property="og:title" content="${esc(titel)}">
<meta property="og:description" content="${esc(beschrijving)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="nl_NL">${beeld ? `
<meta property="og:image" content="${beeld}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">` : ''}
<meta name="twitter:card" content="${beeld ? 'summary_large_image' : 'summary'}">
<meta name="theme-color" content="#15171c">
<link rel="icon" href="${r}favicon.svg" type="image/svg+xml">
<link rel="sitemap" type="application/xml" href="${r}sitemap.xml">`);
  p = p.replace(/<div class="noot">[^<]*<\/div>\s*/, '').replace(/\n  \.noot \{[^}]*\}/, ''); // previewlabel + stijl eruit
  // 3. Verkleinen: commentaar en overbodige witruimte uit inline <style> en <script> (geen JSON/importmap)
  p = p.replace(/<!--[\s\S]*?-->/g, '');
  p = p.replace(/<style>([\s\S]*?)<\/style>/g, (_, css) => `<style>${css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n\s*/g, '\n').replace(/\n+/g, '\n').trim()}</style>`);
  p = p.replace(/<script>([\s\S]*?)<\/script>/g, (_, js) => `<script>${js.split('\n').filter(l => !/^\s*\/\//.test(l)).map(l => l.trim()).filter(Boolean).join('\n')}</script>`);
  // 4. Meten (cookies): alleen als er ID's in SITE.meten staan
  if (MEET.meten) {
    p = vervang(p, `<a href="${r}privacy/">Privacy</a><a href="${r}voorwaarden/">Voorwaarden</a>`,
      `<a href="${r}privacy/">Privacy</a><a href="${r}voorwaarden/">Voorwaarden</a><a href="${r}cookies/">Cookies</a><a href="#" data-cookie-instellingen>Cookie-instellingen</a>`);
    p = vervang(p, '</body>', `<script>window.VIVO_METEN = ${JSON.stringify({ ...M, pad: r })};</script>\n<script src="${r}js/toestemming.js" defer></script>\n</body>`);
  }
  // 5. Controle: elke lokale verwijzing moet in docs/ bestaan
  const map = join(docs, dirname(doel));
  for (const [, ref] of p.matchAll(/(?:src|href)="(?!https?:|#|mailto:|tel:|data:)([^"#?]*)/g)) {
    if (!ref) continue;
    const pad2 = join(map, ref.endsWith('/') ? ref + 'index.html' : ref);
    if (pad2 !== join(docs, doel) && !existsSync(pad2)) throw new Error(`${doel}: ontbreekt ${ref}`); // verwijzing naar zichzelf mag
  }
  mkdirSync(map, { recursive: true });
  writeFileSync(join(docs, doel), p);
}

// ── Titels en beschrijvingen ──
const kortNaam = c => c.naam.length > 20 ? c.klant : c.naam;
const caseBeschrijving = c => {           // ±120–160 tekens: intro, zo nodig aangevuld
  const extra = ' Bekijk de aanpak en het resultaat van ViVo.';
  return c.intro.length < 120 && (c.intro + extra).length <= 160 ? c.intro + extra : c.intro;
};

// Volgorde: eerst Over (daar verwijzen alle menu's naar), dan cases en juridisch, als laatste de homepage
publiceer('over.html', 'over/index.html', '../', { titel: 'Over ViVo — Thomas, webdesign en websites uit Gorinchem', beschrijving: 'Achter ViVo staat Thomas: altijd al handig met computers en IT, nu bouwer van websites, webshops en webapps voor ondernemers. Eén vast aanspreekpunt.', pad: '/over/', og: 'over.jpg' });
for (const c of CASES) publiceer(`case-${c.slug}.html`, `werk/${c.slug}/index.html`, '../../',
  { titel: `${kortNaam(c)} — case | ViVo webdesign Gorinchem`, beschrijving: caseBeschrijving(c), pad: `/werk/${c.slug}/`, og: `${c.slug}.jpg` });
for (const doc of [PRIVACY, VOORWAARDEN, ...(MEET.meten ? [COOKIES] : [])]) publiceer(`${doc.slug}.html`, `${doc.slug}/index.html`, '../',
  { titel: doc.seoTitel, beschrijving: doc.omschrijving, pad: `/${doc.slug}/`, og: 'home.jpg' });
publiceer('motion.html', 'index.html', '', { titel: SITE.seoTitel, beschrijving: SITE.beschrijving, pad: '/', og: 'home.jpg' });

// Oud previewadres → homepage
mkdirSync(join(docs, 'preview'), { recursive: true });
writeFileSync(join(docs, 'preview', 'index.html'), `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="robots" content="noindex"><link rel="canonical" href="${SITE.basis}/"><meta http-equiv="refresh" content="0; url=../"><title>${esc(SITE.seoTitel)}</title></head><body><p><a href="../">Naar de homepage van ${esc(SITE.bedrijfKort)}</a></p></body></html>\n`);
console.log(`docs/ gepubliceerd: homepage + ${CASES.length} cases + juridisch (nieuwe stijl), three.js gebundeld${OG.length ? `, ${OG.length} deelbeelden` : ', nog geen deelbeelden (node tools/og-beelden.mjs)'}`);
