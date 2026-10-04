// Regressietest: alle pagina's op desktop en mobiel — scriptfouten, ontbrekende bestanden, overloop, <main>, infades, 3D.
// Draaien (server nodig): node tools/regressie.mjs [basis-url]   standaard http://localhost:5178/docs/ — live: https://thomv-flow8.github.io/ViVo/
import { chromium } from 'playwright';
const B = process.argv[2] || 'http://localhost:5178/docs/';
const PAGINAS = ['', 'over/', 'contact/', 'privacy/', 'voorwaarden/', 'werk/thnk/', 'werk/delphi/', 'werk/mozi/', 'werk/flow8/'];
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
let problemen = 0;
for (const pad of PAGINAS) for (const w of [1440, 390]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 500, hasTouch: w < 500 });
  const p = await ctx.newPage();
  const fout = [];
  p.on('pageerror', e => fout.push(e.message));
  p.on('response', r => { if (r.status() >= 400) fout.push(r.status() + ' ' + r.url().replace(B, '')); });
  await p.goto(B + pad, { waitUntil: 'load' });
  const hoog = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < hoog; y += 700) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(90); }
  await p.waitForTimeout(pad === '' ? 2500 : 1200);
  const i = await p.evaluate(() => ({
    sw: document.documentElement.scrollWidth, main: !!document.querySelector('main#inhoud'),
    onzichtbaar: [...document.querySelectorAll('.onthul')].filter(e => +getComputedStyle(e).opacity < 1).length,
    d3: [...document.querySelectorAll('.vorm-3d canvas')].filter(c => c.width > 0).length, titel: document.title,
  }));
  const ok = !fout.length && i.sw === w && i.main && !i.onzichtbaar && (pad !== '' || i.d3 === 6);
  if (!ok) problemen++;
  console.log(`${ok ? '✓' : '✗'} ${(pad || 'home').padEnd(13)} ${w}  ${i.titel.slice(0, 48).padEnd(48)} ${pad === '' ? '3D:' + i.d3 : ''} ${fout.length ? 'FOUTEN: ' + fout.join(' | ') : ''}${i.sw !== w ? ' OVERLOOP ' + i.sw : ''}${!i.main ? ' GEEN MAIN' : ''}${i.onzichtbaar ? ' ONZICHTBAAR ' + i.onzichtbaar : ''}`);
  await ctx.close();
}
console.log(problemen ? `${problemen} probleem/problemen` : 'Alles in orde');
await b.close();
