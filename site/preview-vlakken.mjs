// Vergelijkingspagina voor de achtergrond van de projectvlakken (DELPHI en Flow8).
// Gebruikt de gebouwde site (docs/css, docs/img) zodat het beeld exact gelijk is aan de echte site.
// Draaien: node site/preview-vlakken.mjs → docs-preview/vlakken.html (niet gepubliceerd)
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CASES } from './inhoud.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const NACHT_GLOED = 'radial-gradient(120% 90% at 50% 105%, #26357e 0%, #121838 45%, #0a0c18 100%)';
const COMBINATIES = [
  { naam: 'A · Lichtblauw (vorige)', uitleg: 'Ter vergelijking: het zachte lichtblauw uit combinatie 1.',
    kleuren: { delphi: '#e6eefa', flow8: NACHT_GLOED } },
  { naam: 'B · Witter, koel', uitleg: 'Een stuk witter, met nog net een koele zweem — het browservenster tekent zich nog af.',
    kleuren: { delphi: '#f1f5fb', flow8: NACHT_GLOED } },
  { naam: 'C · Bijna wit', uitleg: 'Vrijwel wit; het vlak leunt nu op de schaduw van het venster.',
    kleuren: { delphi: '#f7f8fa', flow8: NACHT_GLOED } },
  { naam: 'D · Wit met zachte gloed', uitleg: 'Wit, met onderin een zachte blauwe gloed in de kleur van DELPHI — zo blijft het vlak herkenbaar.',
    kleuren: { delphi: 'radial-gradient(120% 90% at 50% 110%, #dbe8fb 0%, #f3f7fc 45%, #fbfcfd 100%)', flow8: NACHT_GLOED } },
];

const kaart = (c, kleur) => {
  const tel = ['thnk', 'delphi', 'mozi'].includes(c.slug)
    ? `<div class="tel"><img src="../docs/img/cases/${c.slug}/mobiel.jpg" alt=""></div>` : '';
  return `<div class="case"><div class="vlak" style="--case:${kleur}">${c.status ? `<span class="status">${c.status}</span>` : ''}<div class="scherm"><div class="balk"><i></i><i></i><i></i></div><img src="../docs/img/cases/${c.slug}/desktop.jpg" alt=""></div>${tel}</div><h3>${c.naam}</h3></div>`;
};

const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>ViVo — achtergrond projectvlakken</title>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../docs/css/vivo.css">
<style>.combi{padding:56px 0;border-bottom:1px solid var(--lijn)} .combi h2{font-size:var(--h2);margin:14px 0 8px} .combi p.u{color:var(--grijs);max-width:60ch;margin:0 0 32px}</style>
</head><body>
<div class="w" style="padding-top:48px"><span class="label">Preview · niet gepubliceerd</span><h1 style="font-size:var(--h2);margin-top:14px">Achtergrond projectvlakken</h1>
<p style="color:var(--grijs);max-width:60ch">THNK en Mozi blijven gelijk. Witter voor DELPHI, Flow8 nachtblauw met gloed — kies op letter.</p></div>
${COMBINATIES.map(k => `<section class="combi"><div class="w"><span class="label">Combinatie</span><h2>${k.naam}</h2><p class="u">${k.uitleg}</p>
<div class="werk">${CASES.map(c => kaart(c, k.kleuren[c.slug] || c.kleur)).join('')}</div></div></section>`).join('')}
</body></html>`;

mkdirSync(join(root, 'docs-preview'), { recursive: true });
writeFileSync(join(root, 'docs-preview', 'vlakken.html'), html);
console.log('Geschreven: docs-preview/vlakken.html');
