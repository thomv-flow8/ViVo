// Verkleint bronbeelden (Higgsfield-PNG's) tot web-formaat. Gebruikt Playwright als beeldbewerker.
//  - beelden/diensten/bron/*  → beelden/diensten/<naam>.jpg   (1200×1600, staand 3:4, JPG)
//  - beelden/vormen/bron/*    → beelden/vormen/<naam>.png     (max 1000 px, transparant PNG)
// Draaien: node tools/beelden-verkleinen.mjs
import { chromium } from 'playwright';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../beelden/', import.meta.url));
const SETS = [
  { map: 'diensten', breed: 1200, hoog: 1600, type: 'jpeg', ext: '.jpg' },
  { map: 'vormen', max: 1000, type: 'png', ext: '.png' },
];
const browser = await chromium.launch();
for (const s of SETS) {
  const bron = join(root, s.map, 'bron');
  if (!existsSync(bron)) continue;
  for (const f of readdirSync(bron).filter(f => /\.(png|jpe?g|webp)$/i.test(f))) {
    const buf = readFileSync(join(bron, f));
    const mime = 'image/' + extname(f).slice(1).replace('jpg', 'jpeg');
    let w = s.breed, h = s.hoog;
    if (s.max) { const iw = buf.readUInt32BE(16), ih = buf.readUInt32BE(20), k = Math.min(1, s.max / Math.max(iw, ih)); w = Math.round(iw * k); h = Math.round(ih * k); }
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await page.setContent(`<body style="margin:0;background:transparent"><img src="data:${mime};base64,${buf.toString('base64')}" style="width:${w}px;height:${h}px;object-fit:cover;display:block"></body>`);
    await page.waitForLoadState('load');
    const uit = join(root, s.map, basename(f, extname(f)) + s.ext);
    await page.screenshot({ path: uit, type: s.type, ...(s.type === 'jpeg' ? { quality: 82 } : { omitBackground: true }), clip: { x: 0, y: 0, width: w, height: h } });
    await page.close();
    console.log(`✓ ${s.map}/${basename(uit)}  ${w}×${h}  ${Math.round(statSync(uit).size / 1024)} kB`);
  }
}
await browser.close();
