// Vergelijkingspagina voor de tweede cursor: zes kleine, ingetogen varianten om uit te kiezen.
// Elke variant staat in een eigen vak; beweeg erin om hem te proberen (boven de knop, de link en het beeld).
// Draaien: node site/preview-cursors.mjs → docs-preview/cursors.html (niet gepubliceerd)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const chevron = readFileSync(join(root, 'merk/svg/vivo-beeldmerk-klein-wit.svg'), 'utf8').trim()
  .replace(/(stroke|fill)="#[0-9a-fA-F]{3,8}"/g, '$1="currentColor"').replace(/ width="[^"]+" height="[^"]+"/, '').replace(/<title>[^<]*<\/title>/, '');

const VARIANTEN = [
  ['stip', 'A · Stip', 'Een stip van 8 px die meeloopt. Boven knoppen en beelden wordt het een dunne ring van 36 px.'],
  ['ring', 'B · Kleine ring', 'Een ring van 22 px, iets kleiner en lichter dan nu. Groeit tot 40 px, zonder vulling.'],
  ['duo', 'C · Stip + ring', 'Een stip precies op de muis en een ring die er rustig achteraan komt. Klassiek voor ontwerpbureaus.'],
  ['chevron', 'D · Mini-chevron', 'Het ViVo-beeldmerk, 12 px, volgt de muis. Boven knoppen en beelden draait het en wordt het iets groter. Eigen en herkenbaar.'],
  ['label', 'E · Stip met label', 'Een stip van 8 px. Boven een beeld verschijnt een kleine pil met “Bekijk”, boven knoppen en links alleen een ring.'],
  ['magneet', 'F · Magnetisch', 'Een stip van 10 px. Boven een knop springt hij eromheen als omlijning en trekt de knop een paar pixels mee.'],
];

const vak = ([id, titel, uitleg]) => `<section class="vak" data-variant="${id}">
  <div class="vak-kop"><h2>${titel}</h2><p>${uitleg}</p></div>
  <div class="proef">
    <a class="pil" href="#" onclick="return false">Plan een kennismaking</a>
    <a class="tekstlink" href="#" onclick="return false">Bekijk case →</a>
    <div class="beeld"><img src="../beelden/diensten/web.jpg" alt=""></div>
  </div>
</section>`;

const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>ViVo — cursorvarianten</title>
<link rel="stylesheet" href="../docs/css/vivo.css">
<style>
  body { background: var(--papier-2); }
  .intro-tekst { padding: 56px 0 24px; } .intro-tekst h1 { font-size: var(--h2); margin: 14px 0 10px; } .intro-tekst p { color: var(--grijs); max-width: 60ch; margin: 0; }
  .raster { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 400px), 1fr)); gap: 20px; padding-bottom: 80px; }
  .vak { background: #fff; border-radius: var(--r); padding: 26px; display: flex; flex-direction: column; gap: 22px; }
  .vak:nth-child(even) { background: var(--nacht); color: var(--maan); } .vak:nth-child(even) .vak-kop p { color: var(--grijs-n); } .vak:nth-child(even) .pil { background: var(--maan); color: var(--nacht); } .vak:nth-child(even) .tekstlink { color: var(--maan); }
  .vak-kop h2 { font-size: 22px; margin: 0 0 6px; } .vak-kop p { color: var(--grijs); margin: 0; font-size: 15px; min-height: 3.2em; }
  .proef { display: grid; grid-template-columns: auto 1fr; gap: 18px 24px; align-items: center; }
  .tekstlink { color: var(--inkt); font-weight: 500; text-decoration: none; }
  .beeld { grid-column: 1 / -1; aspect-ratio: 16 / 9; overflow: hidden; border-radius: 12px; } .beeld img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .pil { transition: transform .3s cubic-bezier(.16, 1, .3, 1); }
  /* ── Cursorlagen ── */
  .c-laag { position: fixed; left: 0; top: 0; z-index: 200; pointer-events: none; mix-blend-mode: difference; color: #fff; opacity: 0; transition: opacity .25s; }
  .c-laag.aan { opacity: 1; }
  .c-vorm { position: absolute; left: 0; top: 0; translate: -50% -50%; transition: width .4s cubic-bezier(.16, 1, .3, 1), height .4s cubic-bezier(.16, 1, .3, 1), background-color .3s, border-color .3s, rotate .5s cubic-bezier(.16, 1, .3, 1), scale .4s cubic-bezier(.16, 1, .3, 1), border-radius .4s; }
  /* A — stip → ring */
  .v-stip .c-vorm { width: 8px; height: 8px; border-radius: 50%; background: #fff; border: 1.5px solid transparent; }
  .v-stip.groot .c-vorm { width: 36px; height: 36px; background: transparent; border-color: #fff; }
  /* B — kleine ring */
  .v-ring .c-vorm { width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid #fff; }
  .v-ring.groot .c-vorm { width: 40px; height: 40px; }
  /* C — stip + ring (ring is de trage laag) */
  .v-duo .c-vorm { width: 6px; height: 6px; border-radius: 50%; background: #fff; }
  .v-duo-ring .c-vorm { width: 30px; height: 30px; border-radius: 50%; border: 1px solid #fff; }
  .v-duo-ring.groot .c-vorm { width: 46px; height: 46px; }
  /* D — mini-chevron */
  .v-chevron .c-vorm { width: 12px; height: 12px; display: grid; place-items: center; }
  .v-chevron .c-vorm svg { width: 100%; height: 100%; display: block; }
  .v-chevron.groot .c-vorm { rotate: 180deg; scale: 1.6; }
  /* E — stip met label */
  .v-label .c-vorm { width: 8px; height: 8px; border-radius: 50%; background: #fff; border: 1.5px solid transparent; display: grid; place-items: center; overflow: hidden; font: 600 12px/1 var(--f); color: #000; white-space: nowrap; }
  .c-vorm span { display: none; } .v-label .c-vorm span { display: block; opacity: 0; transition: opacity .2s; } /* label alleen bij E */
  .v-label.groot .c-vorm { width: 30px; height: 30px; background: transparent; border-color: #fff; }
  .v-label.beeld-op .c-vorm { width: 68px; height: 28px; border-radius: 100px; background: #fff; border-color: #fff; } .v-label.beeld-op .c-vorm span { opacity: 1; transition-delay: .12s; }
  /* F — magnetisch */
  .v-magneet .c-vorm { width: 10px; height: 10px; border-radius: 50%; background: #fff; border: 1.5px solid transparent; }
  .v-magneet.groot .c-vorm { width: 34px; height: 34px; background: transparent; border-color: #fff; }
  .v-magneet.vast .c-vorm { background: transparent; border-color: #fff; border-radius: 100px; }
  @media (hover: none), (pointer: coarse) { .c-laag { display: none; } }
</style></head><body>
<div class="w intro-tekst"><span class="label">Preview · niet gepubliceerd</span><h1>Kies een cursor</h1>
<p>Beweeg in een vak om de variant te proberen, ook boven de knop, de link en het beeld. Witte en donkere vakken wisselen elkaar af, zodat je ziet hoe de cursor zich op beide gedraagt (hij keert van kleur om). Je gewone muispijl blijft altijd zichtbaar.</p></div>
<div class="w raster">${VARIANTEN.map(vak).join('\n')}</div>
<div class="c-laag" id="laag1"><div class="c-vorm"><span>Bekijk</span></div></div>
<div class="c-laag" id="laag2"><div class="c-vorm"></div></div>
<script src="../node_modules/gsap/dist/gsap.min.js"></script>
<script>
  const CHEVRON = ${JSON.stringify(chevron)};
  const l1 = document.getElementById('laag1'), l2 = document.getElementById('laag2'), v1 = l1.firstElementChild;
  const snel = { x: gsap.quickTo(l1, 'x', { duration: 0.18, ease: 'power3' }), y: gsap.quickTo(l1, 'y', { duration: 0.18, ease: 'power3' }) };
  const traag = { x: gsap.quickTo(l2, 'x', { duration: 0.55, ease: 'power3' }), y: gsap.quickTo(l2, 'y', { duration: 0.55, ease: 'power3' }) };
  let variant = null, knop = null;
  function zet(v) {
    if (v === variant) return; variant = v;
    l1.className = 'c-laag' + (v ? ' aan v-' + v : ''); l2.className = 'c-laag' + (v === 'duo' ? ' aan v-duo-ring' : '');
    v1.innerHTML = v === 'chevron' ? CHEVRON : '<span>Bekijk</span>';
    // per variant een ander volgtempo: C heeft een snelle stip + trage ring, de rest volgt rustig
    const tempo = v === 'duo' ? 0.12 : v === 'chevron' ? 0.4 : 0.3;
    snel.x = gsap.quickTo(l1, 'x', { duration: tempo, ease: 'power3' }); snel.y = gsap.quickTo(l1, 'y', { duration: tempo, ease: 'power3' });
  }
  addEventListener('pointermove', e => {
    const vakEl = e.target.closest('.vak'); zet(vakEl ? vakEl.dataset.variant : null);
    const opKnop = e.target.closest('.pil, .tekstlink'), opBeeld = e.target.closest('.beeld');
    for (const l of [l1, l2]) { l.classList.toggle('groot', !!(opKnop || opBeeld)); }
    l1.classList.toggle('beeld-op', !!opBeeld);
    // F — magnetisch: rond de knop vastklikken en de knop een beetje meetrekken
    if (variant === 'magneet' && opKnop && opKnop.classList.contains('pil')) {
      const r = opKnop.getBoundingClientRect(), mx = r.left + r.width / 2, my = r.top + r.height / 2;
      l1.classList.add('vast'); v1.style.width = (r.width + 12) + 'px'; v1.style.height = (r.height + 12) + 'px';
      snel.x(mx + (e.clientX - mx) * 0.15); snel.y(my + (e.clientY - my) * 0.15);
      opKnop.style.transform = 'translate(' + (e.clientX - mx) * 0.12 + 'px,' + (e.clientY - my) * 0.2 + 'px)'; knop = opKnop;
    } else {
      if (knop) { knop.style.transform = ''; knop = null; }
      l1.classList.remove('vast'); v1.style.width = v1.style.height = '';
      snel.x(e.clientX); snel.y(e.clientY);
    }
    traag.x(e.clientX); traag.y(e.clientY);
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => zet(null));
</script>
</body></html>`;

mkdirSync(join(root, 'docs-preview'), { recursive: true });
writeFileSync(join(root, 'docs-preview', 'cursors.html'), html);
console.log('Geschreven: docs-preview/cursors.html');
