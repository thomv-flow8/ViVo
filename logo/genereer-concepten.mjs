// Genereert logo/concepten-ronde1.html — ronde 1 van de ViVo-logoconcepten.
// Alle vormen zijn geometrische paden (geen lettertypes), kleur via currentColor.
// Draaien: node logo/genereer-concepten.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const r = n => Math.round(n * 100) / 100;
const pts = a => a.map(([x, y]) => `${r(x)},${r(y)}`).join(' ');

// Gevulde V: x0..x1 breed, top..bot hoog, a = horizontale armdikte, c = halve breedte platte onderkant (0 = punt)
function vPoly(x0, x1, top, bot, a, c = 0) {
  const cx = (x0 + x1) / 2;
  const t = (cx - x0 - a) / (cx - c - x0);
  const yi = top + t * (bot - top);
  return pts([[x0, top], [x0 + a, top], [cx, yi], [x1 - a, top], [x1, top], [cx + c, bot], [cx - c, bot]]);
}
// Gestreepte chevron met top-y, punt-y en helling s (dx per dy)
const chev = (top, apex, s = 0.6, cx = 50) => {
  const w = (apex - top) * s;
  return pts([[cx - w, top], [cx, apex], [cx + w, top]]);
};
const st = (w, extra = '') => `fill="none" stroke="currentColor" stroke-width="${w}" stroke-miterlimit="10" ${extra}`;

const concepten = [
  // ── Beeldmerken ──
  { naam: 'Pixel-V', groep: 'Beeldmerk', uitleg: 'Een V met de i-punt als pixel. Leest als "Vi" en verwijst naar het scherm.',
    svg: id => `<polygon points="${vPoly(14, 86, 32, 86, 17)}"/><rect x="43" y="12" width="14" height="14"/>` },
  { naam: 'Dubbele chevron', groep: 'Beeldmerk', uitleg: 'Twee V\'s in elkaar, voor de twee V\'s in ViVo. Rustig en ritmisch.',
    svg: id => `<polyline points="${chev(16, 86)}" ${st(10)}/><polyline points="${chev(16, 50)}" ${st(10)}/>` },
  { naam: 'VV-blok', groep: 'Beeldmerk', uitleg: 'Een massief blok waar twee V\'s als negatieve ruimte uit gesneden zijn.',
    svg: id => `<path d="M10,90 L10,12 L21,12 L35.5,70 L50,12 L64.5,70 L79,12 L90,12 L90,90 Z"/>` },
  { naam: 'Lijnen-V', groep: 'Beeldmerk', uitleg: 'Vijf parallelle lijnen vormen samen de V. Naar de lijnmerken van Octan en de "8".',
    svg: id => [86, 74, 62, 50, 38].map(a => `<polyline points="${chev(14, a)}" ${st(3.4)}/>`).join('') },
  { naam: 'Trap-V', groep: 'Beeldmerk', uitleg: 'Een V opgebouwd uit pixels: het web als bouwmateriaal.',
    svg: id => {
      const rijen = [[0, 1, 5, 6], [1, 2, 4, 5], [2, 3, 4], [3]];
      const cel = 10, gat = 2, x0 = 9, y0 = 27;
      return rijen.map((kol, ri) => kol.map(k =>
        `<rect x="${x0 + k * (cel + gat)}" y="${y0 + ri * (cel + gat)}" width="${cel}" height="${cel}"/>`).join('')).join('');
    } },
  { naam: 'Cirkel-V', groep: 'Beeldmerk', uitleg: 'De o van ViVo als cirkel, met een V eruit gesneden.',
    svg: id => `<defs><mask id="${id}m"><rect width="100" height="100" fill="#fff"/><polygon points="${vPoly(20, 80, -6, 74, 14)}" fill="#000"/></mask></defs><circle cx="50" cy="50" r="42" mask="url(#${id}m)"/>` },
  { naam: 'Vo-monogram', groep: 'Beeldmerk', uitleg: 'Het begin en eind van het woord, V en o, als één compact teken.',
    svg: id => `<g transform="translate(5,0)"><polygon points="${vPoly(6, 56, 20, 80, 14)}"/><circle cx="64" cy="59.5" r="15" ${st(11)}/></g>` },
  { naam: 'Code-ruit', groep: 'Beeldmerk', uitleg: 'Een ∧ boven een ∨: de codehaken < > een kwartslag gedraaid, met een pixel in het hart.',
    svg: id => `<polyline points="18,46 50,14 82,46" ${st(11)}/><polyline points="18,54 50,86 82,54" ${st(11)}/><rect x="45" y="45" width="10" height="10"/>` },
  { naam: 'App-tegel', groep: 'Beeldmerk', uitleg: 'Pixel-V uitgespaard in een afgeronde tegel. Direct bruikbaar als app-icoon en favicon.',
    svg: id => `<defs><mask id="${id}m"><rect width="100" height="100" fill="#fff"/><polygon points="${vPoly(27, 73, 36, 78, 12)}" fill="#000"/><rect x="44" y="18" width="12" height="12" fill="#000"/></mask></defs><rect x="6" y="6" width="88" height="88" rx="22" mask="url(#${id}m)"/>` },
  { naam: 'Split-V', groep: 'Beeldmerk', uitleg: 'Twee losse armen. De rechterarm stopt net te vroeg, wat beweging en spanning geeft.',
    svg: id => `<polygon points="10,14 28,14 58,86 40,86"/><polygon points="72,14 90,14 71.7,58 53.7,58"/>` },
  { naam: 'Gevouwen lint', groep: 'Beeldmerk', uitleg: 'Een V als gevouwen strook: de ene arm ligt vóór de andere.',
    svg: id => `<polygon points="71,14 90,14 60,86 41,86" opacity=".42"/><polygon points="10,14 29,14 59,86 40,86"/>` },
  { naam: 'Ringen-V', groep: 'Beeldmerk', uitleg: 'Concentrische ringen, doorsneden door een V. Gelaagd, zoals een goede website.',
    svg: id => `<defs><mask id="${id}m"><rect width="100" height="100" fill="#fff"/><polygon points="${vPoly(20, 80, -4, 72, 11)}" fill="#000"/></mask></defs><g mask="url(#${id}m)">${[42, 34, 26, 18, 10].map(rr => `<circle cx="50" cy="50" r="${rr}" ${st(4)}/>`).join('')}</g>` },
  { naam: 'V-nest', groep: 'Beeldmerk', uitleg: 'Een grote V die de o vasthoudt: ViVo in één beweging.',
    svg: id => `<polygon points="${vPoly(6, 94, 14, 88, 18)}"/><circle cx="50" cy="24" r="9.5" ${st(7)}/>` },
  { naam: 'Raster ViVo', groep: 'Beeldmerk', uitleg: 'De vier letters in een 2×2-raster, naar het OCTAN-raster. Gestructureerd, zoals een grid.',
    svg: id => `<rect x="6" y="6" width="88" height="88" ${st(2.5)}/><line x1="50" y1="6" x2="50" y2="94" ${st(2.5)}/><line x1="6" y1="50" x2="94" y2="50" ${st(2.5)}/>
      <polyline points="18,18 28,38 38,18" ${st(5)}/><line x1="72" y1="24" x2="72" y2="39" ${st(5)}/><rect x="69.5" y="14" width="5" height="5"/>
      <polyline points="18,62 28,82 38,62" ${st(5)}/><circle cx="72" cy="73" r="9" ${st(5)}/>` },
  // ── Woordmerken ──
  { naam: 'Woordmerk Bold', groep: 'Woordmerk', vb: '0 0 169 76', uitleg: 'Krachtig geometrisch ViVo: platte V-punten, een vierkante i-punt en een perfecte cirkel als o.',
    svg: id => `<polygon points="${vPoly(4, 52, 10, 66, 13, 5)}"/><rect x="58" y="30" width="11" height="36"/><rect x="58" y="12" width="11" height="11"/><polygon points="${vPoly(75, 123, 10, 66, 13, 5)}"/><circle cx="146.5" cy="48" r="13" ${st(11)}/>` },
  { naam: 'Woordmerk Lijn', groep: 'Woordmerk', vb: '0 0 160 76', uitleg: 'Dezelfde opbouw in een dunne lijn: verfijnd en luchtig, past bij een premium uitstraling.',
    svg: id => `<polyline points="4,10 26,66 48,10" ${st(3.5)}/><line x1="58" y1="30" x2="58" y2="66" ${st(3.5)}/><rect x="56.25" y="17" width="3.5" height="3.5"/><polyline points="68,10 90,66 112,10" ${st(3.5)}/><circle cx="136" cy="48" r="18" ${st(3.5)}/>` },
  { naam: 'Woordmerk Rond', groep: 'Woordmerk', vb: '0 0 172 76', uitleg: 'Afgeronde uiteinden: vriendelijk en toegankelijk, minder zakelijk.',
    svg: id => `<g ${st(10, 'stroke-linecap="round" stroke-linejoin="round"')}><polyline points="8,12 28,64 48,12"/><line x1="62" y1="32" x2="62" y2="64"/><polyline points="76,12 96,64 116,12"/><circle cx="144" cy="47" r="17"/></g><circle cx="62" cy="14" r="5"/>` },
];

// ── Ronde 2: twintig nieuwe richtingen ──
// Snijpunt van lijn p1-p2 met lijn p3-p4
function snij([x1, y1], [x2, y2], [x3, y3], [x4, y4]) {
  const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  const a = x1 * y2 - y1 * x2, b = x3 * y4 - y3 * x4;
  return [(a * (x3 - x4) - (x1 - x2) * b) / d, (a * (y3 - y4) - (y1 - y2) * b) / d];
}
// Asymmetrische V (dik-dun contrast): aL/aR = armdikte links/rechts, punt onderaan op px
function vAsym(x0, x1, top, bot, aL, aR, px) {
  const binnen = snij([x0 + aL, top], [px + aL, bot], [x1 - aR, top], [px - aR, bot]);
  return pts([[x0, top], [x0 + aL, top], binnen, [x1 - aR, top], [x1, top], [px, bot]]);
}
// Pixelletters op een raster (1 = vlak)
const PIX = {
  V: ['10001', '10001', '10001', '01010', '01010', '00100', '00100'],
  i: ['1', '0', '1', '1', '1', '1', '1'],
  o: ['0000', '0000', '0110', '1001', '1001', '1001', '0110'],
};
function pixelWoord(woord, cel = 8, gat = 1, x0 = 2, y0 = 2) {
  let x = x0, uit = '';
  for (const l of woord) {
    const rij = PIX[l];
    rij.forEach((r, ri) => [...r].forEach((b, ki) => {
      if (b === '1') uit += `<rect x="${x + ki * (cel + gat)}" y="${y0 + ri * (cel + gat)}" width="${cel}" height="${cel}"/>`;
    }));
    x += (rij[0].length + 1) * (cel + gat);
  }
  return uit;
}
const boldWoord = () => `<polygon points="${vPoly(4, 52, 10, 66, 13, 5)}"/><rect x="58" y="30" width="11" height="36"/><rect x="58" y="12" width="11" height="11"/><polygon points="${vPoly(75, 123, 10, 66, 13, 5)}"/><circle cx="146.5" cy="48" r="13" ${st(11)}/>`;
const inlinePad = `<polyline points="10,12 30,64 50,12"/><line x1="70" y1="32" x2="70" y2="64"/><polyline points="90,12 110,64 130,12"/><circle cx="166" cy="47" r="16"/>`;
const laagV = vPoly(8, 84, 10, 82, 17);

const ronde2 = [
  // ── Beeldmerken ──
  { naam: 'Tag-V', groep: 'Beeldmerk', uitleg: 'Een V tussen codehaken: ‹V›. Zegt direct "ik bouw websites".',
    svg: id => `<polyline points="24,28 8,50 24,72" ${st(8)}/><polyline points="76,28 92,50 76,72" ${st(8)}/><polygon points="${vPoly(33, 67, 30, 72, 10)}"/>` },
  { naam: 'Scanlijn-V', groep: 'Beeldmerk', uitleg: 'Een V opgebouwd uit horizontale scanlijnen, als op een beeldscherm. Retro-tech.',
    svg: id => { let s = ''; for (let y = 14; y < 92; y += 8) s += `<rect x="0" y="${y}" width="100" height="5" fill="#fff"/>`;
      return `<defs><mask id="${id}m">${s}</mask></defs><polygon points="${vPoly(8, 92, 14, 88, 20)}" mask="url(#${id}m)"/>`; } },
  { naam: 'Kubus-V', groep: 'Beeldmerk', uitleg: 'Een open kubus: de bovenrand vormt de V. Staat voor bouwen en structuur.',
    svg: id => `<polygon points="13.6,29 50,50 50,92 13.6,71"/><polygon points="50,50 86.4,29 86.4,71 50,92" opacity=".55"/>` },
  { naam: 'Bloem-V', groep: 'Beeldmerk', uitleg: 'Vier V\'s die naar het midden wijzen: samenkomen en focus.',
    svg: id => [0, 90, 180, 270].map(a => `<polyline points="32,12 50,34 68,12" ${st(9)} transform="rotate(${a} 50 50)"/>`).join('') },
  { naam: 'Twee pillen', groep: 'Beeldmerk', uitleg: 'Twee afgeronde staven die samen een V vormen. Vriendelijk en zacht.',
    svg: id => `<g ${st(17, 'stroke-linecap="round"')}><line x1="20" y1="18" x2="40" y2="72"/><line x1="80" y1="18" x2="60" y2="72"/></g>` },
  { naam: 'Stippen-V', groep: 'Beeldmerk', uitleg: 'Een V van stippen die naar de punt toe kleiner worden, als een halftoon.',
    svg: id => { let s = ''; for (let j = 0; j <= 8; j++) { const y = 14 + j * 9, rr = r(5.2 - j * 0.32);
      s += `<circle cx="${r(14 + j * 4.5)}" cy="${y}" r="${rr}"/>`; if (j < 8) s += `<circle cx="${r(86 - j * 4.5)}" cy="${y}" r="${rr}"/>`; } return s; } },
  { naam: 'Ballon-V', groep: 'Beeldmerk', uitleg: 'Een tekstballon met een V erin: contact, gesprek, persoonlijk.',
    svg: id => `<defs><mask id="${id}m"><rect x="8" y="10" width="84" height="64" rx="18" fill="#fff"/><polygon points="22,70 22,92 44,70" fill="#fff"/><polygon points="${vPoly(31, 69, 22, 62, 10)}" fill="#000"/></mask></defs><rect width="100" height="100" mask="url(#${id}m)"/>` },
  { naam: 'Venster-V', groep: 'Beeldmerk', uitleg: 'Een browservenster met een V: letterlijk het web. Direct duidelijk wat je doet.',
    svg: id => `<rect x="8" y="14" width="84" height="72" rx="9" ${st(5)}/><line x1="8" y1="31" x2="92" y2="31" ${st(5)}/><circle cx="19" cy="22.5" r="2.6"/><circle cx="27" cy="22.5" r="2.6"/><circle cx="35" cy="22.5" r="2.6"/><polygon points="${vPoly(33, 67, 42, 76, 10)}"/>` },
  { naam: 'Pijl-V', groep: 'Beeldmerk', uitleg: 'Een navigatiepijl die omlaag wijst: de V als richting en vooruitgang.',
    svg: id => `<polygon points="50,90 16,12 50,34 84,12"/>` },
  { naam: 'Gesneden-V', groep: 'Beeldmerk', uitleg: 'Een cursieve V, in drie sneden doorgesneden. Snelheid en dynamiek.',
    svg: id => `<defs><mask id="${id}m"><rect width="100" height="100" fill="#fff"/>${[36, 52, 68].map(y => `<rect x="0" y="${y}" width="100" height="4" fill="#000"/>`).join('')}</mask></defs><g mask="url(#${id}m)"><polygon points="${vPoly(14, 86, 14, 88, 18, 4)}" transform="skewX(-12) translate(3,0)"/></g>` },
  { naam: 'Pil-V', groep: 'Beeldmerk', uitleg: 'Een gekantelde pil met een V erdoor, naar de OCTAN-pil. Speels maar strak.',
    svg: id => `<defs><mask id="${id}m"><rect x="6" y="28" width="88" height="44" rx="22" transform="rotate(-35 50 50)" fill="#fff"/><polygon points="${vPoly(35, 65, 20, 76, 9)}" fill="#000"/></mask></defs><rect width="100" height="100" mask="url(#${id}m)"/>` },
  { naam: 'Stencil-V', groep: 'Beeldmerk', uitleg: 'Een V uit een vlak gesneden als stencil, met een brug erdoor. Ambachtelijk en industrieel.',
    svg: id => `<defs><mask id="${id}m"><rect x="8" y="8" width="84" height="84" fill="#fff"/><polygon points="${vPoly(20, 80, 18, 82, 16)}" fill="#000"/><rect x="8" y="46" width="84" height="5" fill="#fff"/></mask></defs><rect width="100" height="100" mask="url(#${id}m)"/>` },
  { naam: 'Laag-V', groep: 'Beeldmerk', uitleg: 'Een massieve V met een verschoven contour erachter: lagen en diepte.',
    svg: id => `<polygon points="${laagV}" transform="translate(7,7)" ${st(2.5)}/><polygon points="${laagV}"/>` },
  { naam: 'Gestapeld Vi/Vo', groep: 'Beeldmerk', vb: '0 0 88 100', uitleg: 'Vi boven Vo, als een compact blok. Werkt als beeldmerk én bevat de naam.',
    svg: id => `<polygon points="${vPoly(6, 50, 6, 46, 12, 4)}"/><rect x="56" y="20" width="10" height="26"/><rect x="56" y="6" width="10" height="10"/><polygon points="${vPoly(6, 50, 54, 94, 12, 4)}"/><circle cx="70.5" cy="79.5" r="9.5" ${st(10)}/>` },
  // ── Woordmerken ──
  { naam: 'Woordmerk Contrast', groep: 'Woordmerk', vb: '0 0 180 76', uitleg: 'Dik-dun contrast met schreefjes, als een modetijdschrift. Elegant en premium.',
    svg: id => `<polygon points="${vAsym(4, 56, 12, 66, 13, 4, 30)}"/><rect x="0" y="10" width="21" height="2.4"/><rect x="47" y="10" width="13" height="2.4"/><rect x="63" y="30" width="10" height="36"/><circle cx="68" cy="17" r="6"/><polygon points="${vAsym(80, 132, 12, 66, 13, 4, 106)}"/><rect x="76" y="10" width="21" height="2.4"/><rect x="123" y="10" width="13" height="2.4"/><path fill-rule="evenodd" d="M137,47.5 a19,19 0 1,0 38,0 a19,19 0 1,0 -38,0 Z M145,47.5 a11,15.5 0 1,0 22,0 a11,15.5 0 1,0 -22,0 Z"/>` },
  { naam: 'Woordmerk Kapitalen', groep: 'Woordmerk', vb: '0 0 186 76', uitleg: 'V I V O in dunne, ruim gespatieerde kapitalen, zoals OCTAN. Rustig en architectonisch.',
    svg: id => `<g ${st(3.2)}><polyline points="4,18 20,58 36,18"/><line x1="62" y1="18" x2="62" y2="58"/><polyline points="88,18 104,58 120,18"/><circle cx="160" cy="38" r="20"/></g>` },
  { naam: 'Woordmerk Inline', groep: 'Woordmerk', vb: '0 0 194 76', uitleg: 'Vette letters met een dunne lijn erdoorheen, zoals een racestreep of neonbuis.',
    svg: id => `<defs><mask id="${id}m"><rect width="194" height="76" fill="#fff"/><g fill="none" stroke="#000" stroke-width="3" stroke-linejoin="bevel">${inlinePad}</g></mask></defs><g mask="url(#${id}m)"><g fill="none" stroke="currentColor" stroke-width="14" stroke-linejoin="bevel">${inlinePad}</g><rect x="63" y="10" width="14" height="14"/></g>` },
  { naam: 'Woordmerk Smal', groep: 'Woordmerk', vb: '0 0 117 76', uitleg: 'Hoog en smal (condensed): modern, efficiënt, past overal in een navigatiebalk.',
    svg: id => `<polygon points="${vPoly(4, 30, 8, 68, 8, 2.5)}"/><rect x="36" y="26" width="8" height="42"/><rect x="36" y="12" width="8" height="8"/><polygon points="${vPoly(50, 76, 8, 68, 8, 2.5)}"/><ellipse cx="96" cy="47" rx="13" ry="17" ${st(8)}/>` },
  { naam: 'Woordmerk Horizon', groep: 'Woordmerk', vb: '0 0 169 76', uitleg: 'Het vette woordmerk met één horizontale snede: een horizonlijn, strak en herkenbaar.',
    svg: id => `<defs><mask id="${id}m"><rect width="169" height="76" fill="#fff"/><rect x="0" y="41" width="169" height="3.5" fill="#000"/></mask></defs><g mask="url(#${id}m)">${boldWoord()}</g>` },
  { naam: 'Woordmerk Pixel', groep: 'Woordmerk', vb: '0 0 166 68', uitleg: 'ViVo in pixels, als een 8-bit lettertype. Hoort bij Trap-V en Pixel-V.',
    svg: id => pixelWoord('ViVo') },
];

const kaart = (c, i) => {
  const id = `c${i + 1}`;
  const vb = c.vb || '0 0 100 100';
  const svg = (cls) => `<svg class="${cls}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" fill="currentColor" role="img" aria-label="ViVo — ${c.naam}">${c.svg(id + cls)}</svg>`;
  return `<article class="kaart${c.groep === 'Woordmerk' ? ' breed' : ''}" data-groep="${c.groep}">
  <div class="nr">${String(i + 1).padStart(2, '0')}</div>
  <div class="podium">${svg('groot')}</div>
  <div class="klein" title="Kleine formaten (favicon / navigatie)">${svg('k32')}${svg('k16')}</div>
  <h2>${c.naam}<span>${c.groep}</span></h2>
  <p>${c.uitleg}</p>
</article>`;
};

const pagina = (titel, intro, lijst, start = 0) => `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ViVo logoconcepten</title>
<style>
  :root { --bg:#0b0b0b; --kaart:#141414; --rand:#262626; --fg:#f2f1ec; --muted:#8a8a85; }
  body.licht { --bg:#ecebe6; --kaart:#f6f5f1; --rand:#d9d8d2; --fg:#111; --muted:#6b6b66; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--fg); font:15px/1.5 system-ui, -apple-system, sans-serif; transition:background .2s, color .2s; }
  header { max-width:1200px; margin:0 auto; padding:32px 16px 8px; display:flex; flex-wrap:wrap; gap:16px; align-items:end; justify-content:space-between; }
  h1 { margin:0; font-size:22px; letter-spacing:.02em; }
  header p { margin:4px 0 0; color:var(--muted); max-width:60ch; }
  button { font:inherit; color:var(--fg); background:transparent; border:1px solid var(--rand); border-radius:100px; padding:8px 16px; cursor:pointer; }
  button:hover { border-color:var(--fg); }
  nav { display:flex; flex-wrap:wrap; gap:8px; }
  .filter.aan { background:var(--fg); color:var(--bg); border-color:var(--fg); }
  .verborgen { display:none !important; }
  main { max-width:1200px; margin:0 auto; padding:16px; display:grid; gap:16px; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); }
  .kaart { position:relative; background:var(--kaart); border:1px solid var(--rand); border-radius:14px; padding:20px; display:flex; flex-direction:column; }
  .kaart.breed { grid-column:span 2; }
  @media (max-width:600px) { .kaart.breed { grid-column:auto; } }
  .nr { position:absolute; top:14px; left:16px; font:12px ui-monospace, monospace; color:var(--muted); }
  .podium { height:170px; display:grid; place-items:center; }
  .groot { height:120px; width:auto; max-width:100%; }
  .breed .groot { height:90px; }
  .klein { display:flex; gap:14px; align-items:center; justify-content:flex-end; min-height:32px; padding-top:8px; border-top:1px solid var(--rand); }
  .k32 { height:32px; width:auto; } .k16 { height:16px; width:auto; }
  .breed .k32 { height:24px; } .breed .k16 { height:14px; }
  h2 { margin:14px 0 4px; font-size:16px; display:flex; justify-content:space-between; gap:8px; }
  h2 span { font:11px ui-monospace, monospace; text-transform:uppercase; letter-spacing:.08em; color:var(--muted); align-self:center; }
  .kaart p { margin:0; color:var(--muted); font-size:14px; }
  footer { max-width:1200px; margin:0 auto; padding:8px 16px 40px; color:var(--muted); font-size:13px; }
</style>
</head>
<body>
<header>
  <div>
    <h1>${titel}</h1>
    <p>${intro} Rechtsonder elke kaart staat de favicon-test op 32 en 16 pixels. Kies je favorieten op nummer.</p>
  </div>
  <nav>
    <button class="filter aan" data-f="">Alles</button><button class="filter" data-f="Beeldmerk">Beeldmerken</button><button class="filter" data-f="Woordmerk">Woordmerken</button>
    <button id="thema" type="button">Licht thema</button>
  </nav>
</header>
<main>
${lijst.map((c, j) => kaart(c, j + start)).join('\n')}
</main>
<footer>Alle vormen zijn geometrische SVG-paden, zonder lettertype — overal identiek en oneindig schaalbaar.</footer>
<script>
  const b = document.getElementById('thema');
  b.addEventListener('click', () => {
    const licht = document.body.classList.toggle('licht');
    b.textContent = licht ? 'Donker thema' : 'Licht thema';
  });
  document.querySelectorAll('.filter').forEach(k => k.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(x => x.classList.toggle('aan', x === k));
    document.querySelectorAll('.kaart').forEach(el => el.classList.toggle('verborgen', !!k.dataset.f && el.dataset.groep !== k.dataset.f));
  }));
</script>
</body>
</html>
`;

const map = dirname(fileURLToPath(import.meta.url));
const alle = [...concepten, ...ronde2];
const uitvoer = {
  'concepten-ronde1.html': pagina('ViVo — logoconcepten, ronde 1', `${concepten.length} richtingen, monochroom.`, concepten, 0),
  'concepten-ronde2.html': pagina('ViVo — logoconcepten, ronde 2', `${ronde2.length} nieuwe richtingen (${concepten.length + 1}–${alle.length}), monochroom.`, ronde2, concepten.length),
  'concepten-alle.html': pagina('ViVo — alle logoconcepten', `Alle ${alle.length} richtingen uit ronde 1 en 2 op één pagina.`, alle, 0),
};
// Alleen schrijven als dit script zelf gedraaid wordt (niet bij import door een volgende ronde)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const [naam, inhoud] of Object.entries(uitvoer)) {
    writeFileSync(join(map, naam), inhoud);
    console.log(`Geschreven: ${naam}`);
  }
}

export { concepten, ronde2, st, r };
