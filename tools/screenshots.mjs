// Maakt schermafbeeldingen van de cases voor de ViVo-site (projectvlakken en case-pagina's).
// Draaien: npm run screenshots  (of: node tools/screenshots.mjs [slug])
// Uitvoer: cases/<slug>/desktop.jpg (1440×900 @2x), mobiel.jpg (390×844 @3x), pagina.jpg (hele pagina, desktop @1x)
//
// Er wordt NIETS aangeklikt of geaccepteerd: cookiemeldingen en review-balken worden alleen
// in de opname verborgen (CSS), zodat de site er schoon op staat.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const CASES = [
  { slug: 'thnk', url: 'https://www.thnkmusic.com/' },
  { slug: 'delphi', url: 'https://www.sleutelbeheersystemen.nl/' },
  { slug: 'mozi', url: 'https://thomv-flow8.github.io/Mozi/', verberg: ['Ontwerpvoorstel'] },
];

// Verbergt vaste balken (cookiemelding, review-melding) op basis van hun tekst
async function opschonen(page, extra = []) {
  await page.evaluate((woorden) => {
    const zoek = ['cookie', ...woorden.map(w => w.toLowerCase())];
    for (const el of document.querySelectorAll('body *')) {
      const s = getComputedStyle(el);
      const t = (el.textContent || '').toLowerCase();
      if (!zoek.some(w => t.includes(w)) || t.length > 600) continue;
      const vast = s.position === 'fixed' || s.position === 'sticky';
      const balk = el.getBoundingClientRect().height < 220;
      if (vast || (balk && woorden.length && woorden.some(w => t.includes(w.toLowerCase())) && el.childElementCount < 6)) {
        el.style.setProperty('display', 'none', 'important');
      }
    }
  }, extra);
}

async function scrollDoor(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
    window.scrollTo(0, 0);
  });
}

// Volledige pagina als 'gestikte' opname: scherm voor scherm vastleggen en onder elkaar plakken.
// (Chrome's fullPage-opname tekent sommige grafische lagen buiten beeld niet — bij DELPHI bleven kaarten leeg.)
async function stikPagina(browser, page, pad) {
  const { width, height: vh } = page.viewportSize();
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  const totaal = await page.evaluate(() => document.documentElement.scrollHeight);
  const tegels = [];
  for (let y = 0; y < totaal; y += vh) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    await page.waitForTimeout(450);
    const werkelijk = await page.evaluate(() => window.scrollY);
    tegels.push({ y: werkelijk, data: (await page.screenshot({ type: 'jpeg', quality: 92 })).toString('base64') });
    if (tegels.length === 1) {                      // na het eerste scherm: vaste/kleverige balken verbergen
      await page.evaluate(() => { for (const el of document.querySelectorAll('body *')) { const p = getComputedStyle(el).position; if (p === 'fixed' || p === 'sticky') el.style.setProperty('visibility', 'hidden', 'important'); } });
    }
  }
  const hoogte = Math.min(totaal, 16000);
  const plak = await browser.newPage({ viewport: { width, height: hoogte }, deviceScaleFactor: 1 });
  await plak.setContent('<body style="margin:0;position:relative;height:' + hoogte + 'px;overflow:hidden">' +
    tegels.map(t => '<img src="data:image/jpeg;base64,' + t.data + '" style="position:absolute;left:0;top:' + t.y + 'px;width:' + width + 'px;height:' + vh + 'px">').join('') + '</body>');
  await plak.waitForLoadState('load');
  await plak.screenshot({ path: pad, type: 'jpeg', quality: 80 });
  await plak.close();
}

const alleen = process.argv[2];
const browser = await chromium.launch();
for (const c of CASES.filter(c => !alleen || c.slug === alleen)) {
  const map = join(root, 'cases', c.slug);
  mkdirSync(map, { recursive: true });
  const opnames = [
    { naam: 'desktop', viewport: { width: 1440, height: 900 }, schaal: 2 },
    { naam: 'mobiel', viewport: { width: 390, height: 844 }, schaal: 3, mobiel: true },
  ];
  for (const o of opnames) {
    const ctx = await browser.newContext({ viewport: o.viewport, deviceScaleFactor: o.schaal, isMobile: !!o.mobiel, hasTouch: !!o.mobiel, locale: 'nl-NL' });
    const page = await ctx.newPage();
    await page.goto(c.url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2500);               // intro-animaties laten uitspelen
    await opschonen(page, c.verberg);
    await page.screenshot({ path: join(map, `${o.naam}.jpg`), type: 'jpeg', quality: 86 });
    if (o.naam === 'desktop') {
      // reducedMotion: de sites tonen dan alles direct, zonder scroll-animaties (anders blijft wat buiten beeld viel leeg)
      const vol = await browser.newContext({ viewport: o.viewport, deviceScaleFactor: 1, locale: 'nl-NL', reducedMotion: 'reduce' });
      const p2 = await vol.newPage();
      await p2.goto(c.url, { waitUntil: 'networkidle', timeout: 60000 });
      await scrollDoor(p2);                         // lazy-loaded beelden laden
      await p2.waitForFunction(() => [...document.images].every(i => i.complete), null, { timeout: 20000 }).catch(() => {});
      await p2.waitForTimeout(1500);
      await opschonen(p2, c.verberg);
      await stikPagina(browser, p2, join(map, 'pagina.jpg'));
      await vol.close();
    }
    await ctx.close();
  }
  console.log(`✓ ${c.slug}`);
}
await browser.close();
