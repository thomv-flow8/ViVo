// Genereert het definitieve logopakket in merk/: beeldmerk 02 (Dubbele chevron) + woordmerk 33a (VIVO dun).
// Losse SVG-bestanden (zwart/wit), favicon, app-icoon en merk/gebruiksgids.html.
// Draaien: node logo/genereer-merk.mjs
// Plaatsing gaat via <g transform> (geen geneste <svg>), zodat de bestanden ook in Figma/Illustrator goed openen.
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const r = n => Math.round(n * 100) / 100;
const KLEUR = { zwart: '#0a0b0d', wit: '#f5f6f8' }; // = --inkt en --maan uit huisstijl/tokens.css (koele neutrale basis)

// Chevron met top-y, punt-y, helling 0.6 (dx per dy) — gelijk aan concept 02
const chev = (top, apex) => { const w = (apex - top) * 0.6; return `${r(50 - w)},${top} 50,${apex} ${r(50 + w)},${top}`; };
// Werkelijke buitenrand van een gestreepte chevron (butt-uiteinden + miter in de punt)
function chevRand(top, apex, sw) {
  const w = (apex - top) * 0.6, len = Math.hypot(0.6, 1), px = (1 / len) * sw / 2, py = (0.6 / len) * sw / 2;
  const miter = (sw / 2) / Math.sin(Math.atan(0.6));
  return [50 - w - px, top - py, 50 + w + px, apex + miter];
}

// Onderdelen: tekening(kleur), werkelijke rand [x0,y0,x1,y1] en uitlijnkader [x,y,b,h]
const BEELD = {
  tekening: k => `<g fill="none" stroke="${k}" stroke-width="10" stroke-miterlimit="10"><polyline points="${chev(16, 86)}"/><polyline points="${chev(16, 50)}"/></g>`,
  rand: chevRand(16, 86, 10),
};
BEELD.kader = [BEELD.rand[0], BEELD.rand[1], BEELD.rand[2] - BEELD.rand[0], BEELD.rand[3] - BEELD.rand[1]];

// Kleine variant (16–32 px): dikkere lijn, meer lucht tussen de chevrons
const KLEIN = {
  tekening: k => `<g fill="none" stroke="${k}" stroke-width="13" stroke-miterlimit="10"><polyline points="${chev(16, 86)}"/><polyline points="${chev(16, 46)}"/></g>`,
  rand: chevRand(16, 86, 13),
};

const WOORD = {
  tekening: k => `<g fill="none" stroke="${k}" stroke-width="3.2" stroke-miterlimit="10"><polyline points="4,18 20,58 36,18"/><line x1="62" y1="18" x2="62" y2="58"/><polyline points="88,18 104,58 120,18"/><circle cx="160" cy="38" r="20"/></g>`,
  rand: [2.5, 16.4, 181.6, 62.31],   // incl. lijndikte, O-overshoot en miter van de V
  kader: [2.3, 18, 179.3, 40],       // kapitaalhoogte, voor optische uitlijning
};

// Plaats onderdeel o met uitlijnkader op (X, Y) met hoogte h
function plaats(o, X, Y, h, kleur) {
  const [kx, ky, , kh] = o.kader, s = h / kh, tx = X - kx * s, ty = Y - ky * s;
  const [a, b, c, d] = o.rand;
  return { svg: `<g transform="translate(${r(tx)} ${r(ty)}) scale(${Math.round(s * 10000) / 10000})">${o.tekening(kleur)}</g>`,
    rand: [a * s + tx, b * s + ty, c * s + tx, d * s + ty], breed: (o.kader[2] / kh) * h };
}
const unie = rs => [Math.min(...rs.map(x => x[0])), Math.min(...rs.map(x => x[1])), Math.max(...rs.map(x => x[2])), Math.max(...rs.map(x => x[3]))];
function bestand(titel, delen, rand, pad = 0) {
  const [x0, y0, x1, y1] = rand, w = x1 - x0 + 2 * pad, h = y1 - y0 + 2 * pad;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(x0 - pad)} ${r(y0 - pad)} ${r(w)} ${r(h)}" width="${r(w)}" height="${r(h)}" role="img" aria-label="${titel}"><title>${titel}</title>${delen}</svg>\n`;
}

// Lockups — zelfde verhoudingen als ronde 3 (woordmerk 0,4× / 0,24× de beeldmerkhoogte)
function horizontaal(k) {
  const H = 100, ch = 0.4 * H, gap = 0.3 * H;
  const m = plaats(BEELD, 0, 0, H, k), w = plaats(WOORD, m.breed + gap, (H - ch) / 2, ch, k);
  return bestand('ViVo', m.svg + w.svg, unie([m.rand, w.rand]), 2);
}
function verticaal(k) {
  const H = 100, ch = 0.24 * H, gap = 0.26 * H;
  const mB = (BEELD.kader[2] / BEELD.kader[3]) * H, wB = (WOORD.kader[2] / WOORD.kader[3]) * ch, B = Math.max(mB, wB);
  const m = plaats(BEELD, (B - mB) / 2, 0, H, k), w = plaats(WOORD, (B - wB) / 2, H + gap, ch, k);
  return bestand('ViVo', m.svg + w.svg, unie([m.rand, w.rand]), 2);
}
const beeldmerk = k => bestand('ViVo', BEELD.tekening(k), BEELD.rand, 1);
const beeldmerkKlein = k => { const [a, b, c, d] = KLEIN.rand, z = Math.max(c - a, d - b), cx = (a + c) / 2, cy = (b + d) / 2;
  return bestand('ViVo', KLEIN.tekening(k), [cx - z / 2, cy - z / 2, cx + z / 2, cy + z / 2]); };
const woordmerk = k => bestand('ViVo', WOORD.tekening(k), WOORD.rand, 1);

// Favicon: kleine variant, past zich aan licht/donker tabblad aan
const favicon = (() => { const [a, b, c, d] = KLEIN.rand, z = Math.max(c - a, d - b), cx = (a + c) / 2, cy = (b + d) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(cx - z / 2)} ${r(cy - z / 2)} ${r(z)} ${r(z)}"><style>g{stroke:${KLEUR.zwart}}@media (prefers-color-scheme:dark){g{stroke:${KLEUR.wit}}}</style>${KLEIN.tekening(KLEUR.zwart).replace(` stroke="${KLEUR.zwart}"`, '')}</svg>\n`; })();
// App-icoon: vol vierkant (iOS/Android ronden zelf af), beeldmerk op 56 % van de breedte, optisch iets omhoog
const appIcoon = (() => { const S = 512, mH = S * 0.5, m = plaats(BEELD, 0, 0, mH, KLEUR.wit), x = (S - m.breed) / 2, y = (S - mH) / 2 - S * 0.01;
  const p = plaats(BEELD, x, y, mH, KLEUR.wit);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}"><rect width="${S}" height="${S}" fill="${KLEUR.zwart}"/>${p.svg}</svg>\n`; })();

const BESTANDEN = {};
for (const k of ['zwart', 'wit']) {
  BESTANDEN[`svg/vivo-beeldmerk-${k}.svg`] = beeldmerk(KLEUR[k]);
  BESTANDEN[`svg/vivo-beeldmerk-klein-${k}.svg`] = beeldmerkKlein(KLEUR[k]);
  BESTANDEN[`svg/vivo-horizontaal-${k}.svg`] = horizontaal(KLEUR[k]);
  BESTANDEN[`svg/vivo-verticaal-${k}.svg`] = verticaal(KLEUR[k]);
  BESTANDEN[`svg/vivo-woordmerk-${k}.svg`] = woordmerk(KLEUR[k]);
}
BESTANDEN['favicon/favicon.svg'] = favicon;
BESTANDEN['favicon/app-icoon.svg'] = appIcoon;

// ── Gebruiksgids ──
const img = (pad, cls, alt = 'ViVo') => `<img src="${pad}" class="${cls}" alt="${alt}">`;
const onderdeel = (naam, bas, uitleg, cls) => `<article class="kaart">
  <div class="duo"><div class="vlak donker">${img(`svg/${bas}-wit.svg`, cls)}</div><div class="vlak licht">${img(`svg/${bas}-zwart.svg`, cls)}</div></div>
  <h3>${naam}</h3><p>${uitleg}</p>
  <p class="dl"><a href="svg/${bas}-zwart.svg" download>${bas}-zwart.svg</a> · <a href="svg/${bas}-wit.svg" download>${bas}-wit.svg</a></p>
</article>`;

// Vrije-ruimtediagram: x = kapitaalhoogte van het woordmerk in de lockup (0,4 × beeldmerkhoogte)
const vrij = (() => { const H = 100, ch = 0.4 * H, gap = 0.3 * H, k = 'currentColor';
  const m = plaats(BEELD, 0, 0, H, k), w = plaats(WOORD, m.breed + gap, (H - ch) / 2, ch, k);
  const [x0, y0, x1, y1] = unie([m.rand, w.rand]), X = ch;
  const stip = `fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" opacity=".55"`;
  return `<svg viewBox="${r(x0 - X - 4)} ${r(y0 - X - 4)} ${r(x1 - x0 + 2 * X + 8)} ${r(y1 - y0 + 2 * X + 8)}" class="vrijsvg" role="img" aria-label="Vrije ruimte rond het logo">
    <rect x="${r(x0 - X)}" y="${r(y0 - X)}" width="${r(x1 - x0 + 2 * X)}" height="${r(y1 - y0 + 2 * X)}" ${stip}/>
    <rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" ${stip}/>
    ${m.svg}${w.svg}
    <line x1="${r(x1)}" y1="${r(y0 - X / 2)}" x2="${r(x1 + X)}" y2="${r(y0 - X / 2)}" stroke="currentColor" stroke-width="1.2"/>
    <text x="${r(x1 + X / 2)}" y="${r(y0 - X / 2 - 5)}" font-size="13" text-anchor="middle" fill="currentColor" font-family="ui-monospace, monospace">x</text>
    <rect x="${r(m.breed + gap)}" y="${r((H - ch) / 2)}" width="6" height="${ch}" fill="currentColor" opacity=".25"/>
  </svg>`; })();

const gids = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ViVo merkgids</title>
<link rel="icon" href="favicon/favicon.svg" type="image/svg+xml">
<style>
  :root { --bg:#0b0b0b; --kaart:#141414; --rand:#262626; --fg:#f2f1ec; --muted:#8a8a85; --zwart:${KLEUR.zwart}; --wit:${KLEUR.wit}; }
  body.licht { --bg:#ecebe6; --kaart:#f6f5f1; --rand:#d9d8d2; --fg:#111; --muted:#6b6b66; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--fg); font:15px/1.55 system-ui, -apple-system, sans-serif; }
  .wrap { max-width:1100px; margin:0 auto; padding:0 16px; }
  header { padding:40px 0 24px; display:flex; flex-wrap:wrap; gap:16px; align-items:center; justify-content:space-between; border-bottom:1px solid var(--rand); }
  header img { height:44px; display:block; }
  body:not(.licht) .op-licht, body.licht .op-donker { display:none !important; }
  button { font:inherit; font-size:14px; color:var(--fg); background:transparent; border:1px solid var(--rand); border-radius:100px; padding:6px 14px; cursor:pointer; }
  h2 { font:13px ui-monospace, monospace; text-transform:uppercase; letter-spacing:.1em; color:var(--muted); margin:44px 0 6px; }
  .intro { color:var(--muted); margin:0 0 16px; max-width:70ch; }
  .raster { display:grid; gap:16px; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); }
  .kaart { background:var(--kaart); border:1px solid var(--rand); border-radius:14px; padding:16px; min-width:0; }
  .kaart h3 { margin:14px 0 2px; font-size:16px; }
  .kaart p { margin:0; color:var(--muted); font-size:14px; }
  .kaart .dl { margin-top:8px; font-size:12px; word-break:break-all; }
  a { color:inherit; }
  .duo { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .vlak { border-radius:10px; height:120px; display:grid; place-items:center; padding:16px; border:1px solid var(--rand); }
  .donker { background:var(--zwart); } .licht:not(body) { background:var(--wit); }
  .vlak img { max-width:100%; max-height:100%; }
  .i-beeld { height:64px; } .i-klein { height:32px; } .i-hor { height:40px; } .i-ver { height:84px; } .i-woord { height:22px; }
  .vrij { color:var(--fg); }
  .vrijsvg { width:100%; max-width:640px; height:auto; display:block; }
  .maten { display:flex; flex-wrap:wrap; gap:28px; align-items:flex-end; }
  .maten figure { margin:0; text-align:center; }
  .maten figcaption { font:12px ui-monospace, monospace; color:var(--muted); margin-top:6px; }
  .kleuren { display:flex; flex-wrap:wrap; gap:16px; }
  .staal { width:180px; border-radius:14px; overflow:hidden; border:1px solid var(--rand); background:var(--kaart); }
  .staal div { height:90px; } .staal p { margin:0; padding:10px 12px; font:13px ui-monospace, monospace; }
  ul.regels { margin:0; padding-left:18px; color:var(--muted); } ul.regels li { margin:4px 0; } ul.regels b { color:var(--fg); }
  .twee { display:grid; grid-template-columns:1fr 1fr; gap:16px; } @media (max-width:700px) { .twee, .duo { grid-template-columns:1fr; } }
  pre { background:var(--kaart); border:1px solid var(--rand); border-radius:12px; padding:14px; overflow-x:auto; font-size:13px; }
  .ico { display:flex; gap:20px; align-items:center; flex-wrap:wrap; }
  .favtegel { display:flex; gap:14px; align-items:center; padding:14px 18px; border-radius:12px; border:1px solid var(--rand); }
  .ico img.app { width:88px; height:88px; border-radius:20px; } .ico img.fav { width:16px; height:16px; } .ico img.fav32 { width:32px; height:32px; }
  footer { padding:40px 0 56px; color:var(--muted); font-size:13px; }
</style>
</head>
<body>
<div class="wrap">
<header>
  <div><img class="op-donker" src="svg/vivo-horizontaal-wit.svg" alt="ViVo"><img class="op-licht" src="svg/vivo-horizontaal-zwart.svg" alt="ViVo"></div>
  <button id="thema" type="button">Licht thema</button>
</header>

<h2>Merkgids</h2>
<p class="intro">Het logo van ViVo bestaat uit het beeldmerk (twee in elkaar liggende chevrons, voor de twee V's in ViVo) en het woordmerk VIVO in een fijne, ruim gespatieerde lijn. Alle bestanden zijn SVG: scherp op elk formaat.</p>

<h2>Onderdelen</h2>
<div class="raster">
${onderdeel('Horizontaal', 'vivo-horizontaal', 'De hoofdversie. Navigatie, e-mail, facturen, documenten.', 'i-hor')}
${onderdeel('Verticaal', 'vivo-verticaal', 'Voor vierkante of staande vlakken: social, visitekaartje, sticker.', 'i-ver')}
${onderdeel('Beeldmerk', 'vivo-beeldmerk', 'Los, vanaf 33 px. Avatar, watermerk, groot formaat.', 'i-beeld')}
${onderdeel('Beeldmerk klein', 'vivo-beeldmerk-klein', 'Speciaal voor 16–32 px: dikkere lijn en meer lucht. Favicon en heel kleine plekken.', 'i-klein')}
${onderdeel('Woordmerk', 'vivo-woordmerk', 'VIVO los, als tekstelement op de site of in een hero. Vanaf 14 px hoog.', 'i-woord')}
</div>

<h2>Vrije ruimte</h2>
<p class="intro">Houd rondom het logo minstens <b>x</b> vrij, waarbij x de hoogte van het woordmerk VIVO is. Bij het losse beeldmerk: de helft van zijn hoogte.</p>
<div class="kaart vrij">${vrij}</div>

<h2>Minimale formaten</h2>
<div class="kaart"><div class="maten">
  <figure><img src="svg/vivo-beeldmerk-klein-zwart.svg" class="op-licht" style="height:16px" alt=""><img src="svg/vivo-beeldmerk-klein-wit.svg" class="op-donker" style="height:16px" alt=""><figcaption>klein · 16 px</figcaption></figure>
  <figure><img src="svg/vivo-beeldmerk-klein-zwart.svg" class="op-licht" style="height:32px" alt=""><img src="svg/vivo-beeldmerk-klein-wit.svg" class="op-donker" style="height:32px" alt=""><figcaption>klein · 32 px</figcaption></figure>
  <figure><img src="svg/vivo-beeldmerk-zwart.svg" class="op-licht" style="height:33px" alt=""><img src="svg/vivo-beeldmerk-wit.svg" class="op-donker" style="height:33px" alt=""><figcaption>beeldmerk · ≥ 33 px</figcaption></figure>
  <figure><img src="svg/vivo-horizontaal-zwart.svg" class="op-licht" style="height:24px" alt=""><img src="svg/vivo-horizontaal-wit.svg" class="op-donker" style="height:24px" alt=""><figcaption>horizontaal · ≥ 24 px</figcaption></figure>
  <figure><img src="svg/vivo-woordmerk-zwart.svg" class="op-licht" style="height:14px" alt=""><img src="svg/vivo-woordmerk-wit.svg" class="op-donker" style="height:14px" alt=""><figcaption>woordmerk · ≥ 14 px</figcaption></figure>
</div></div>

<h2>Kleuren</h2>
<p class="intro">Het logo is altijd eenkleurig, in de inkt- of maankleur van de huisstijl. ViVo heeft bewust geen eigen accentkleur: de kleur komt uit het werk.</p>
<div class="kleuren">
  <div class="staal"><div style="background:${KLEUR.zwart}"></div><p>Zwart ${KLEUR.zwart}</p></div>
  <div class="staal"><div style="background:${KLEUR.wit}"></div><p>Wit ${KLEUR.wit}</p></div>
</div>

<h2>Wel en niet</h2>
<div class="twee">
  <div class="kaart"><h3>Wel</h3><ul class="regels">
    <li>Zwart logo op lichte vlakken, wit logo op donkere.</li>
    <li>Onder 33 px altijd de <b>kleine variant</b> van het beeldmerk.</li>
    <li>Het woordmerk altijd in kapitalen: <b>VIVO</b>. In lopende tekst schrijf je de naam als <b>ViVo</b>.</li>
    <li>Op een foto alleen op een rustig, egaal deel.</li>
  </ul></div>
  <div class="kaart"><h3>Niet</h3><ul class="regels">
    <li>Niet uitrekken, kantelen of spiegelen.</li>
    <li>Geen schaduw, gloed, kleurverloop of omlijning toevoegen.</li>
    <li>De lijndikte van het woordmerk niet aanpassen of het woordmerk in een ander lettertype zetten.</li>
    <li>Beeldmerk en woordmerk niet anders schikken dan in de horizontale en verticale lockup.</li>
  </ul></div>
</div>

<h2>Favicon en app-icoon</h2>
<div class="kaart"><div class="ico">
  <div class="favtegel licht"><img class="fav" src="svg/vivo-beeldmerk-klein-zwart.svg" alt="Favicon 16 px, licht tabblad"><img class="fav32" src="svg/vivo-beeldmerk-klein-zwart.svg" alt="Favicon 32 px, licht tabblad"></div><div class="favtegel donker"><img class="fav" src="svg/vivo-beeldmerk-klein-wit.svg" alt="Favicon 16 px, donker tabblad"><img class="fav32" src="svg/vivo-beeldmerk-klein-wit.svg" alt="Favicon 32 px, donker tabblad"></div><img class="app" src="favicon/app-icoon.svg" alt="App-icoon">
  <p>favicon.svg wisselt vanzelf tussen deze twee, mee met een licht of donker tabblad. Het app-icoon is een vol vierkant; iOS en Android ronden de hoeken zelf af. PNG-versies (180, 192 en 512 px) volgen bij de bouw van de site.</p>
</div></div>
<pre>&lt;link rel="icon" href="/favicon.svg" type="image/svg+xml"&gt;</pre>

<footer>Gegenereerd door logo/genereer-merk.mjs — pas het logo daar aan, nooit in de losse bestanden.</footer>
</div>
<script>
  const t = document.getElementById('thema');
  t.addEventListener('click', () => { const l = document.body.classList.toggle('licht'); t.textContent = l ? 'Donker thema' : 'Licht thema'; });
</script>
</body>
</html>
`;
BESTANDEN['gebruiksgids.html'] = gids;

const merk = join(dirname(fileURLToPath(import.meta.url)), '..', 'merk');
for (const [pad, inhoud] of Object.entries(BESTANDEN)) {
  mkdirSync(dirname(join(merk, pad)), { recursive: true });
  writeFileSync(join(merk, pad), inhoud);
}
console.log(`Geschreven in merk/: ${Object.keys(BESTANDEN).length} bestanden`);
