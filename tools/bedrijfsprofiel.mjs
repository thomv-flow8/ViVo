// Maakt een set beelden voor het Google Bedrijfsprofiel in bedrijfsprofiel/ (niet in git).
// Logo (vierkant), omslagfoto (16:9), portret, case-beelden en de dienst-renders — formaten volgens Google (JPG/PNG, ≥720 px).
// Draaien (previewserver nodig, na npm run bouw): node tools/bedrijfsprofiel.mjs
import { chromium } from 'playwright';
import { readFileSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CASES } from '../site/inhoud.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)), uit = join(root, 'bedrijfsprofiel');
mkdirSync(uit, { recursive: true });
const BASIS = 'http://localhost:5178/docs/';
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

// 1. Logo: wit beeldmerk op nacht, vierkant 720×720
const merk = readFileSync(join(root, 'merk/svg/vivo-beeldmerk-wit.svg'), 'utf8').replace(/ width="[^"]+" height="[^"]+"/, '');
const p = await b.newPage({ viewport: { width: 720, height: 720 } });
await p.setContent(`<body style="margin:0;width:720px;height:720px;display:grid;place-items:center;background:#15171c"><div style="width:340px">${merk.replace('<svg ', '<svg style="width:100%;height:auto;display:block" ')}</div></body>`);
await p.screenshot({ path: join(uit, '01-logo.png') });

// 2. Omslagfoto: de hero van de homepage, 1920×1080 (zonder intro-animatie)
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
const h = await ctx.newPage();
await h.goto(BASIS, { waitUntil: 'networkidle' }); await h.waitForTimeout(800);
await h.evaluate(() => document.querySelectorAll('.muiscirkel, .overslaan').forEach(e => e.remove()));
await h.screenshot({ path: join(uit, '02-omslag.jpg'), type: 'jpeg', quality: 90 });

// 3. Portret
copyFileSync(join(root, 'beelden/over/thomas.jpg'), join(uit, '03-portret-thomas.jpg'));

// 4. Cases: hero met tablet en telefoon, 1600×1200
const cctx = await b.newContext({ viewport: { width: 1600, height: 1200 }, reducedMotion: 'reduce' });
let n = 4;
for (const c of CASES) {
  const cp = await cctx.newPage();
  await cp.goto(`${BASIS}werk/${c.slug}/`, { waitUntil: 'networkidle' }); await cp.waitForTimeout(800);
  await cp.evaluate(() => document.querySelectorAll('.muiscirkel, .overslaan').forEach(e => e.remove()));
  await cp.locator('.chero').screenshot({ path: join(uit, `0${n++}-case-${c.slug}.jpg`), type: 'jpeg', quality: 90 }); // alleen de hero
}
// 5. Dienst-renders (staand 3:4)
for (const f of readdirSync(join(root, 'beelden/diensten')).filter(f => f.endsWith('.jpg'))) copyFileSync(join(root, 'beelden/diensten', f), join(uit, `dienst-${f}`));
await b.close();
console.log('Klaar: bedrijfsprofiel/');
