// Genereert logo/ronde3-lockups.html — verfijning van Thomas' keuzes uit ronde 1+2:
// woordmerk 33 (Kapitalen) in vier varianten, lockups met beeldmerken 01/09/02/10/11, en een site-mockup.
// Draaien: node logo/genereer-ronde3.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { concepten, st, r } from './genereer-concepten.mjs';

let uid = 0;
const nid = () => `r3x${++uid}`;

// Gekozen beeldmerken met hun visuele kader [x, y, b, h] binnen de 100×100-tekening
const MERKEN = [
  { nr: '01', c: concepten[0], bb: [14, 12, 72, 74] },
  { nr: '09', c: concepten[8], bb: [6, 6, 88, 88] },
  { nr: '02', c: concepten[1], bb: [3.7, 13.4, 92.6, 82.3] },
  { nr: '10', c: concepten[9], bb: [10, 14, 80, 72] },
  { nr: '11', c: concepten[10], bb: [10, 14, 80, 72] },
];

// Woordmerk 33 in vier varianten; kader = kapitaalhoogte (y 18–58)
const kapitalen = w => `<g ${st(w)}><polyline points="4,18 20,58 36,18"/><line x1="62" y1="18" x2="62" y2="58"/><polyline points="88,18 104,58 120,18"/><circle cx="160" cy="38" r="20"/></g>`;
const gemengd = w => `<g ${st(w)}><polyline points="4,18 20,58 36,18"/><line x1="62" y1="32" x2="62" y2="58"/><polyline points="88,18 104,58 120,18"/><circle cx="146" cy="45" r="${r(14.6 - w / 2)}"/></g><rect x="${r(62 - w / 2)}" y="${r(24 - w / 2)}" width="${w}" height="${w}"/>`;
const WM = [
  { k: 'a', naam: 'VIVO dun', uitleg: 'Het origineel: ruim gespatieerde kapitalen in een fijne lijn.', bb: [2.3, 18, 179.3, 40], svg: () => kapitalen(3.2) },
  { k: 'b', naam: 'VIVO medium', uitleg: 'Dezelfde letters, steviger: houdt beter stand naast een vet beeldmerk en op klein formaat.', bb: [1, 18, 181.8, 40], svg: () => kapitalen(5.5) },
  { k: 'c', naam: 'ViVo dun', uitleg: 'De schrijfwijze van je merk, met een kleine i en o. De vierkante i-punt sluit aan op Pixel-V.', bb: [2.3, 18, 158.3, 40], svg: () => gemengd(3.2) },
  { k: 'd', naam: 'ViVo medium', uitleg: 'ViVo in de stevigere lijn.', bb: [1.3, 18, 159.3, 40], svg: () => gemengd(5) },
];

// Geneste svg: tekening met kader bb, geplaatst op (x, y) met hoogte h
const nest = (inner, bb, x, y, h) => {
  const w = (bb[2] / bb[3]) * h;
  return { w, s: `<svg x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" viewBox="${bb.join(' ')}" overflow="visible">${inner}</svg>` };
};
const PAD = 4;
const omhul = (id, cls, w, h, inhoud, label) =>
  `<svg id="${id}" class="${cls}" viewBox="${-PAD} ${-PAD} ${r(w + 2 * PAD)} ${r(h + 2 * PAD)}" xmlns="http://www.w3.org/2000/svg" fill="currentColor" role="img" aria-label="${label}">${inhoud}</svg>`;

function lockH(m, wm) {
  const H = 100, ch = 0.4 * H, gap = 0.3 * H;
  const mk = nest(m.c.svg(nid()), m.bb, 0, 0, H);
  const wd = nest(wm.svg(), wm.bb, mk.w + gap, (H - ch) / 2, ch);
  return omhul(`h-${m.nr}-${wm.k}`, `lock-h wmv v-${wm.k}`, mk.w + gap + wd.w, H, mk.s + wd.s, `ViVo — ${m.c.naam}, horizontaal`);
}
function lockV(m, wm) {
  const H = 100, ch = 0.24 * H, gap = 0.26 * H;
  const mkW = (m.bb[2] / m.bb[3]) * H, wmW = (wm.bb[2] / wm.bb[3]) * ch, W = Math.max(mkW, wmW);
  const mk = nest(m.c.svg(nid()), m.bb, (W - mkW) / 2, 0, H);
  const wd = nest(wm.svg(), wm.bb, (W - wmW) / 2, H + gap, ch);
  return omhul(`v-${m.nr}-${wm.k}`, `lock-v wmv v-${wm.k}`, W, H + gap + ch, mk.s + wd.s, `ViVo — ${m.c.naam}, verticaal`);
}
const merkLos = (m, cls) => { const mk = nest(m.c.svg(nid()), m.bb, 0, 0, 100); return omhul(`m-${m.nr}-${cls}`, cls, mk.w, 100, mk.s, `ViVo — ${m.c.naam}`); };
const woordLos = (wm, cls = 'woord') => { const wd = nest(wm.svg(), wm.bb, 0, 0, 40); return omhul(`w-${wm.k}-${cls}`, cls, wd.w, 40, wd.s, `ViVo woordmerk — ${wm.naam}`); };

const wmKaart = wm => `<article class="kaart breed">
  <div class="nr">33${wm.k}</div>
  <div class="podium">${woordLos(wm, 'woord groot')}</div>
  <div class="klein">${woordLos(wm, 'woord k24')}${woordLos(wm, 'woord k12')}</div>
  <h2>${wm.naam}<span>Woordmerk</span></h2>
  <p>${wm.uitleg}</p>
</article>`;

const lockKaart = m => `<article class="kaart lockkaart">
  <div class="nr">${m.nr}</div>
  <h2>${m.c.naam}<span>Beeldmerk ${m.nr} + 33</span></h2>
  <div class="lockrij">
    <div class="vak hor">${WM.map(wm => lockH(m, wm)).join('')}<small>Horizontaal — navigatie, e-mail, facturen</small></div>
    <div class="vak ver">${WM.map(wm => lockV(m, wm)).join('')}<small>Verticaal — social, visitekaartje</small></div>
  </div>
  <div class="klein"><span>Klein:</span>${WM.map(wm => lockH(m, wm).replace('id="h-', 'id="k-').replace('class="lock-h', 'class="lock-k')).join('')}${merkLos(m, 'k32')}${merkLos(m, 'k16')}</div>
</article>`;

const mockPaneel = (thema) => `<div class="mock ${thema}">
  <div class="mnav"><div class="slot-lock"></div><nav class="mmenu"><span>Diensten</span><span>Werk</span><span>Werkwijze</span><span>Contact</span></nav><span class="mknop">Offerte</span></div>
  <div class="mhero"><div class="slot-woord"></div><p class="mkop">Websites die werken.</p><p class="msub">Snelle, heldere websites voor ondernemers — ontworpen en gebouwd door ViVo.</p><span class="mknop groot">Plan een kennismaking</span></div>
</div>`;

const html = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ViVo lockups</title>
<style>
  :root { --bg:#0b0b0b; --kaart:#141414; --rand:#262626; --fg:#f2f1ec; --muted:#8a8a85; }
  body.licht { --bg:#ecebe6; --kaart:#f6f5f1; --rand:#d9d8d2; --fg:#111; --muted:#6b6b66; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--fg); font:15px/1.5 system-ui, -apple-system, sans-serif; }
  header, section { max-width:1200px; margin:0 auto; padding:0 16px; }
  header { padding-top:32px; position:sticky; top:0; z-index:2; background:var(--bg); padding-bottom:12px; border-bottom:1px solid var(--rand); }
  h1 { margin:0; font-size:22px; }
  @media (max-width:700px) { header { position:static; } }
  header p { margin:4px 0 12px; color:var(--muted); max-width:70ch; }
  .bediening { display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
  .bediening b { font:11px ui-monospace, monospace; text-transform:uppercase; letter-spacing:.08em; color:var(--muted); margin-right:4px; }
  .bediening .tussen { width:12px; }
  button { font:inherit; font-size:14px; color:var(--fg); background:transparent; border:1px solid var(--rand); border-radius:100px; padding:6px 14px; cursor:pointer; }
  button:hover { border-color:var(--fg); }
  button.aan { background:var(--fg); color:var(--bg); border-color:var(--fg); }
  h3 { font-size:13px; font:13px ui-monospace, monospace; text-transform:uppercase; letter-spacing:.1em; color:var(--muted); margin:36px 0 12px; }
  .raster { display:grid; gap:16px; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); }
  .kaart { position:relative; background:var(--kaart); border:1px solid var(--rand); border-radius:14px; padding:20px; display:flex; flex-direction:column; }
  .nr { position:absolute; top:14px; left:16px; font:12px ui-monospace, monospace; color:var(--muted); }
  .podium { height:130px; display:grid; place-items:center; }
  .groot { height:44px; width:auto; max-width:100%; }
  .klein { display:flex; flex-wrap:wrap; gap:14px; align-items:center; justify-content:flex-end; padding-top:10px; border-top:1px solid var(--rand); color:var(--fg); }
  .klein span { font-size:12px; color:var(--muted); margin-right:auto; }
  .k24 { height:24px; width:auto; } .k12 { height:12px; width:auto; } .k32 { height:32px; width:auto; } .k16 { height:16px; width:auto; }
  .lock-k { height:28px; width:auto; }
  h2 { margin:14px 0 4px; font-size:16px; display:flex; justify-content:space-between; gap:8px; }
  .lockkaart h2 { margin:0 0 8px 28px; }
  h2 span { font:11px ui-monospace, monospace; text-transform:uppercase; letter-spacing:.08em; color:var(--muted); align-self:center; }
  .kaart p { margin:0; color:var(--muted); font-size:14px; }
  .lockrij { display:grid; grid-template-columns:3fr 2fr; gap:12px; margin:8px 0 14px; }
  @media (max-width:700px) { .lockrij { grid-template-columns:1fr; } }
  .vak { border:1px dashed var(--rand); border-radius:12px; min-height:200px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; padding:16px; }
  .vak small { color:var(--muted); font-size:12px; text-align:center; }
  .lock-h { width:min(100%, 280px); height:auto; }
  .lock-v { height:130px; width:auto; max-width:100%; }
  .lockgrid { grid-template-columns:1fr; }
  /* Woordmerk-schakelaar */
  .wmv { display:none; }
  ${WM.map(w => `body[data-wm="${w.k}"] .wmv.v-${w.k}`).join(', ')} { display:block; }
  /* Mockup */
  .mocks { display:grid; gap:16px; grid-template-columns:1fr 1fr; }
  @media (max-width:900px) { .mocks { grid-template-columns:1fr; } }
  .mock { border-radius:14px; overflow:hidden; border:1px solid var(--rand); --m-bg:#0b0b0b; --m-fg:#f2f1ec; --m-mu:#8a8a85; background:var(--m-bg); color:var(--m-fg); container-type:inline-size; }
  .mock.licht { --m-bg:#ecebe6; --m-fg:#111; --m-mu:#6b6b66; }
  .mnav { display:flex; align-items:center; gap:16px; padding:16px 20px; border-bottom:1px solid color-mix(in srgb, var(--m-fg) 12%, transparent); }
  .slot-lock svg { height:30px; width:auto; display:block !important; }
  .mmenu { display:flex; gap:18px; margin-left:auto; font-size:14px; color:var(--m-mu); }
  @container (max-width:560px) { .mmenu { display:none; } .mnav .mknop { margin-left:auto; } }
  .mknop { font-size:13px; padding:7px 14px; border-radius:100px; background:var(--m-fg); color:var(--m-bg); white-space:nowrap; }
  .mknop.groot { display:inline-block; font-size:14px; padding:10px 18px; margin-top:20px; }
  .mhero { padding:48px 20px 44px; }
  .slot-woord svg { width:min(100%, 420px); height:auto; display:block !important; }
  .mkop { font-size:clamp(24px, 4vw, 34px); font-weight:600; letter-spacing:-.01em; margin:28px 0 6px; }
  .msub { color:var(--m-mu); margin:0; max-width:42ch; }
  footer { max-width:1200px; margin:0 auto; padding:24px 16px 48px; color:var(--muted); font-size:13px; }
</style>
</head>
<body data-wm="a" data-merk="01">
<header>
  <h1>ViVo — ronde 3: woordmerk en lockups</h1>
  <p>Je keuzes: woordmerk 33 met beeldmerken 01, 09, 02, 10 en 11. Kies hieronder een woordmerkvariant; alle lockups en de mockup schakelen mee.</p>
  <div class="bediening">
    <b>Woordmerk</b>${WM.map((w, i) => `<button class="kies-wm${i ? '' : ' aan'}" data-wm="${w.k}">33${w.k} · ${w.naam}</button>`).join('')}
    <span class="tussen"></span><button id="thema" type="button">Licht thema</button>
  </div>
</header>

<section>
  <h3>1 · Woordmerk 33 — vier varianten</h3>
  <div class="raster">${WM.map(wmKaart).join('\n')}</div>
</section>

<section>
  <h3>2 · Lockups — beeldmerk + woordmerk</h3>
  <div class="raster lockgrid">${MERKEN.map(lockKaart).join('\n')}</div>
</section>

<section>
  <h3>3 · Op de site — navigatie en hero</h3>
  <div class="bediening" style="margin-bottom:12px"><b>Beeldmerk</b>${MERKEN.map((m, i) => `<button class="kies-merk${i ? '' : ' aan'}" data-merk="${m.nr}">${m.nr} · ${m.c.naam}</button>`).join('')}</div>
  <div class="mocks">${mockPaneel('donker')}${mockPaneel('licht')}</div>
  <p style="color:var(--muted);font-size:13px">Teksten en knoppen in de mockup zijn voorbeelden; lettertype en kleuren volgen in fase 4 (huisstijl).</p>
</section>

<div hidden id="bron">${WM.map(wm => woordLos(wm, 'mockwoord')).join('')}</div>
<footer>Alle vormen zijn geometrische SVG-paden, zonder lettertype — overal identiek en oneindig schaalbaar.</footer>
<script>
  const body = document.body;
  function vulMock() {
    const wm = body.dataset.wm, merk = body.dataset.merk;
    const lock = document.getElementById('h-' + merk + '-' + wm);
    const woord = document.getElementById('w-' + wm + '-mockwoord');
    document.querySelectorAll('.slot-lock').forEach(s => { s.replaceChildren(lock.cloneNode(true)); s.firstChild.removeAttribute('id'); });
    document.querySelectorAll('.slot-woord').forEach(s => { s.replaceChildren(woord.cloneNode(true)); s.firstChild.removeAttribute('id'); });
  }
  function kies(sel, attr) {
    document.querySelectorAll(sel).forEach(k => k.addEventListener('click', () => {
      body.dataset[attr] = k.dataset[attr];
      document.querySelectorAll(sel).forEach(x => x.classList.toggle('aan', x === k));
      vulMock();
    }));
  }
  kies('.kies-wm', 'wm');
  kies('.kies-merk', 'merk');
  const t = document.getElementById('thema');
  t.addEventListener('click', () => { const l = body.classList.toggle('licht'); t.textContent = l ? 'Donker thema' : 'Licht thema'; });
  vulMock();
</script>
</body>
</html>
`;

const uit = join(dirname(fileURLToPath(import.meta.url)), 'ronde3-lockups.html');
// Alleen schrijven als dit script zelf gedraaid wordt (niet bij import door een volgende ronde)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(uit, html);
  console.log(`Geschreven: ${uit}`);
}

export { MERKEN, WM, lockH, lockV, merkLos };
