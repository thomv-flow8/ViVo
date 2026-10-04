// Maakt de deelbeelden (og:image, 1200×630) van de homepage en de case-pagina's: een opname van de hero.
// Vereist de previewserver (node tools/serve.mjs 5178) en een recente `npm run bouw`. Uitvoer: beelden/og/<naam>.jpg
// Daarna opnieuw `npm run bouw`, zodat de beelden in docs/og/ komen en in de pagina's worden genoemd.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CASES } from '../site/inhoud.mjs';

const uit = fileURLToPath(new URL('../beelden/og/', import.meta.url));
mkdirSync(uit, { recursive: true });
const BASIS = 'http://localhost:5178/docs/';
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
// reducedMotion: geen intro-animatie, de hero staat direct in zijn eindstand
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
for (const [naam, pad] of [['home', ''], ['over', 'over/'], ['contact', 'contact/'], ...CASES.map(c => [c.slug, `werk/${c.slug}/`])]) {
  const p = await ctx.newPage();
  await p.goto(BASIS + pad, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  await p.evaluate(() => { for (const s of ['.muiscirkel', '.overslaan']) document.querySelectorAll(s).forEach(e => e.remove()); });
  await p.screenshot({ path: uit + naam + '.jpg', type: 'jpeg', quality: 86 });
  await p.close();
  console.log(`✓ beelden/og/${naam}.jpg`);
}
await browser.close();
