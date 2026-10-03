// Bewerkt de door Thomas aangeleverde Flow8-opnames voor de site:
// Safari-balk wegsnijden en ECHTE klantgegevens (namen, adressen, monteurs) vervagen.
// Bron: cases/flow8/bron/*.webp (staat in .gitignore — bevat persoonsgegevens, nooit committen)
// Uitvoer: cases/flow8/<naam>.jpg (alleen deze bewerkte versies gaan naar git)
// Draaien: node tools/flow8-beelden.mjs
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const map = fileURLToPath(new URL('../cases/flow8/', import.meta.url));
// Bijsnijden: alles onder de Safari-balk (y ≥ 143) en zonder de schaduwrand rechts (x < 1972)
const SNIJ = { x: 0, y: 143, w: 1972, h: 1150 };
// Vervaagvlakken in coördinaten van de originele opname (2000×1293): [x, y, breedte, hoogte, rond?]
const BEELDEN = [
  { bron: '4.webp', uit: 'desktop.jpg', vlakken: [[100, 462, 1872, 831]] },                 // planning: monteurs + alle opdrachtkaarten
  { bron: '5.webp', uit: 'kaart.jpg', vlakken: [[95, 240, 840, 30], [1022, 716, 68, 68, true]] },  // legenda-namen + klantlogo op de kaart (rond)
  { bron: '7.webp', uit: 'register.jpg', vlakken: [[115, 268, 895, 64]] },                  // klant + adres
  { bron: '8.webp', uit: 'route.jpg', vlakken: [[345, 328, 260, 34], [425, 532, 345, 605],
    [0, 143, 317, 1150], [1683, 143, 317, 1150], [317, 143, 1366, 57], [317, 1235, 1366, 58]] }, // monteur, klanten + de planning rondom het venster
  { bron: '6.webp', uit: 'login.jpg', vlakken: [] },
  { bron: '9.webp', uit: 'rapportage.jpg', vlakken: [[315, 476, 170, 186]] },                // rapportage: monteursnamen in de legenda
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: SNIJ.w, height: SNIJ.h }, deviceScaleFactor: 1 });
for (const b of BEELDEN) {
  const data = readFileSync(join(map, 'bron', b.bron)).toString('base64');
  const vlakken = b.vlakken.map(([x, y, w, h, rond]) =>
    `<div style="position:absolute;left:${x - SNIJ.x}px;top:${y - SNIJ.y}px;width:${w}px;height:${h}px;backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px)${rond ? ';border-radius:50%' : ''}"></div>`).join('');
  await page.setContent(`<html><body style="margin:0;overflow:hidden"><div style="position:relative;width:${SNIJ.w}px;height:${SNIJ.h}px;overflow:hidden">
    <img src="data:image/webp;base64,${data}" style="position:absolute;left:${-SNIJ.x}px;top:${-SNIJ.y}px;width:2000px;height:1293px">${vlakken}</div></body></html>`);
  await page.waitForLoadState('load');
  await page.screenshot({ path: join(map, b.uit), type: 'jpeg', quality: 86, clip: { x: 0, y: 0, width: SNIJ.w, height: SNIJ.h } });
  console.log(`✓ ${b.uit}`);
}
await browser.close();
