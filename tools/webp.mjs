// Zet de beelden die de site gebruikt om naar WebP (naast het origineel), voor kleinere bestanden.
// Gebruikt Chromium (Playwright) als encoder — geen extra pakket. Originelen blijven staan (og-beelden, terugval).
// Draaien: node tools/webp.mjs   (opnieuw nodig na nieuwe opnames of renders)
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const KWALITEIT = 0.8;
const bronnen = [];
for (const slug of readdirSync(join(root, 'cases'))) {
  const map = join(root, 'cases', slug);
  if (!statSync(map).isDirectory()) continue;
  for (const f of readdirSync(map)) if (/\.(jpe?g)$/i.test(f)) bronnen.push(join(map, f));
}
for (const f of readdirSync(join(root, 'beelden/diensten'))) if (/\.jpe?g$/i.test(f)) bronnen.push(join(root, 'beelden/diensten', f));
bronnen.push(join(root, 'beelden/vormen/lus-donker.png'));
if (existsSync(join(root, 'beelden/over'))) for (const f of readdirSync(join(root, 'beelden/over'))) if (/\.jpe?g$/i.test(f)) bronnen.push(join(root, 'beelden/over', f));

const browser = await chromium.launch();
const page = await browser.newPage();
let voor = 0, na = 0;
for (const bron of bronnen) {
  const doel = bron.replace(/\.(jpe?g|png)$/i, '.webp');
  const mime = extname(bron).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
  const breed = /pagina\.jpg$/.test(bron) ? 1200 : 0; // volledige pagina's: 1200 px is genoeg voor het scrollvenster
  const data = await page.evaluate(async ({ b64, mime, q, breed }) => {
    const img = new Image(); img.src = `data:${mime};base64,${b64}`; await img.decode();
    const k = breed && img.naturalWidth > breed ? breed / img.naturalWidth : 1;
    const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(img, 0, 0, c.width, c.height);
    const uit = c.toDataURL('image/webp', q); c.width = c.height = 0;
    return uit.slice(uit.indexOf(',') + 1);
  }, { b64: readFileSync(bron).toString('base64'), mime, q: KWALITEIT, breed });
  writeFileSync(doel, Buffer.from(data, 'base64'));
  const a = statSync(bron).size, b = statSync(doel).size; voor += a; na += b;
  console.log(`${doel.replace(root, '')}  ${Math.round(a / 1024)} → ${Math.round(b / 1024)} kB`);
}
await browser.close();
console.log(`Totaal ${Math.round(voor / 1024)} → ${Math.round(na / 1024)} kB`);
