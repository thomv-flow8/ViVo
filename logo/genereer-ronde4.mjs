// Genereert logo/ronde4-toepassingen.html — de laatste vier kandidaat-beeldmerken (01, 02, 10, 11)
// met woordmerk 33a naast elkaar in echte toepassingen, om de definitieve keuze te maken.
// Draaien: node logo/genereer-ronde4.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { MERKEN, WM, lockH, lockV, merkLos } from './genereer-ronde3.mjs';

const KANDIDATEN = ['01', '02', '10', '11'].map(nr => MERKEN.find(m => m.nr === nr));
const wm = WM.find(w => w.k === 'a');

// Ronde-3-helpers geven een vast id en schakelklassen mee; hier staat elk logo meerdere keren op de pagina
const los = (svg, cls) => svg.replace(/^<svg id="[^"]+" class="[^"]*"/, `<svg class="${cls}"`);
const H = m => los(lockH(m, wm), 'lh');
const V = m => los(lockV(m, wm), 'lv');
const M = m => los(merkLos(m, 'x'), 'mk');

const TOEPASSINGEN = [
  { naam: 'Browsertabblad', uitleg: 'Favicon op 16 px — het kleinste formaat waarop het merk moet werken.',
    cel: m => `<div class="tabs"><div class="tab donker">${M(m)}<span>ViVo — Websites die werken</span></div><div class="tab licht">${M(m)}<span>ViVo — Websites die werken</span></div></div>` },
  { naam: 'App-icoon', uitleg: 'Op het beginscherm van een telefoon, naast andere apps.',
    cel: m => `<div class="iconen"><div class="ico donker">${M(m)}</div><div class="ico licht">${M(m)}</div><div class="ico klein donker">${M(m)}</div></div>` },
  { naam: 'Social-avatar', uitleg: 'Rond uitgesneden, zoals op LinkedIn en Instagram.',
    cel: m => `<div class="iconen"><div class="ava donker">${M(m)}</div><div class="ava licht">${M(m)}</div></div>` },
  { naam: 'Navigatiebalk', uitleg: 'Horizontale lockup op 28 px hoog, linksboven op de site.',
    cel: m => `<div class="navs"><div class="nav donker">${H(m)}</div><div class="nav licht">${H(m)}</div></div>` },
  { naam: 'Visitekaartje', uitleg: 'Voorkant met de verticale lockup, achterkant met de horizontale.',
    cel: m => `<div class="kaartjes"><div class="vk donker voor">${V(m)}</div><div class="vk licht achter">${H(m)}<p><b>Thomas</b><br>Websites ontwerpen &amp; bouwen</p></div></div>` },
  { naam: 'E-mailhandtekening', uitleg: 'Klein, onder een mail — moet rustig en leesbaar blijven.',
    cel: m => `<div class="mail"><p>Met vriendelijke groet,<br>Thomas</p>${H(m)}<small>Websites · ViVo Products</small></div>` },
  { naam: 'Groot formaat', uitleg: 'Op een slide, een sticker of de eerste schermvullende indruk.',
    cel: m => `<div class="groots">${M(m)}</div>` },
];

const html = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ViVo toepassingen</title>
<style>
  :root { --bg:#0b0b0b; --kaart:#141414; --rand:#262626; --fg:#f2f1ec; --muted:#8a8a85; --d-bg:#0b0b0b; --d-fg:#f2f1ec; --l-bg:#ecebe6; --l-fg:#111; }
  body.licht { --bg:#ecebe6; --kaart:#f6f5f1; --rand:#d9d8d2; --fg:#111; --muted:#6b6b66; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--fg); font:15px/1.5 system-ui, -apple-system, sans-serif; }
  .wrap { max-width:1240px; margin:0 auto; padding:0 16px; }
  header { padding:32px 0 8px; display:flex; flex-wrap:wrap; gap:16px; align-items:end; justify-content:space-between; }
  h1 { margin:0; font-size:22px; }
  header p { margin:4px 0 0; color:var(--muted); max-width:70ch; }
  button { font:inherit; font-size:14px; color:var(--fg); background:transparent; border:1px solid var(--rand); border-radius:100px; padding:6px 14px; cursor:pointer; }
  button:hover { border-color:var(--fg); }
  .rij { display:grid; grid-template-columns:repeat(4, minmax(0, 1fr)); gap:12px; }
  @media (max-width:760px) { .rij { grid-template-columns:repeat(2, minmax(0, 1fr)); } }
  .koppen { position:sticky; top:0; z-index:2; background:var(--bg); padding:12px 0; border-bottom:1px solid var(--rand); }
  .kop { font-weight:600; display:flex; gap:8px; align-items:baseline; }
  .kop span { font:12px ui-monospace, monospace; color:var(--muted); }
  @media (max-width:760px) { .koppen { position:static; } }
  .toep { margin:28px 0 0; }
  .toep h2 { margin:0; font-size:16px; }
  .toep > p { margin:2px 0 10px; color:var(--muted); font-size:14px; }
  .cel { background:var(--kaart); border:1px solid var(--rand); border-radius:14px; padding:14px; min-height:120px; display:flex; flex-direction:column; justify-content:center; gap:10px; min-width:0; }
  .celkop { display:none; font:12px ui-monospace, monospace; color:var(--muted); }
  @media (max-width:760px) { .celkop { display:block; } }
  .donker { background:var(--d-bg); color:var(--d-fg); } .licht:not(body) { background:var(--l-bg); color:var(--l-fg); }
  /* Tabbladen */
  .tabs { display:flex; flex-direction:column; gap:8px; }
  .tab { display:flex; align-items:center; gap:8px; padding:8px 12px; border-radius:10px 10px 0 0; font-size:12px; border:1px solid var(--rand); min-width:0; }
  .tab .mk { height:16px; width:16px; flex:none; }
  .tab span { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  /* Iconen en avatars */
  .iconen { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
  .ico { width:64px; height:64px; border-radius:15px; display:grid; place-items:center; border:1px solid var(--rand); }
  .ico.klein { width:40px; height:40px; border-radius:10px; }
  .ico .mk { width:56%; height:56%; }
  .ava { width:72px; height:72px; border-radius:50%; display:grid; place-items:center; border:1px solid var(--rand); }
  .ava .mk { width:50%; height:50%; }
  /* Navigatie */
  .navs { display:flex; flex-direction:column; gap:8px; }
  .nav { padding:12px; border-radius:10px; border:1px solid var(--rand); }
  .nav .lh { height:28px; width:auto; max-width:100%; display:block; }
  /* Visitekaartjes (85×55) */
  .kaartjes { display:flex; flex-direction:column; gap:8px; }
  .vk { aspect-ratio:85/55; container-type:inline-size; overflow:hidden; border-radius:8px; border:1px solid var(--rand); display:flex; padding:8%; box-shadow:0 6px 18px rgba(0,0,0,.25); }
  .vk.voor { align-items:center; justify-content:center; }
  .vk.voor .lv { height:36cqw; width:auto; max-width:100%; }
  .vk.achter { flex-direction:column; justify-content:space-between; }
  .vk.achter .lh { height:16px; width:auto; align-self:flex-start; max-width:100%; }
  .vk.achter p { margin:0; font-size:11px; line-height:1.4; }
  /* Mail */
  .mail { background:#fff; color:#222; border-radius:10px; padding:14px; font-size:13px; }
  .mail p { margin:0 0 12px; }
  .mail .lh { height:20px; width:auto; max-width:100%; display:block; color:#111; }
  .mail small { display:block; margin-top:6px; color:#777; font-size:11px; }
  /* Groot */
  .groots { display:grid; place-items:center; padding:16px 0; }
  .groots .mk { height:140px; width:auto; max-width:100%; }
  footer { padding:28px 0 48px; color:var(--muted); font-size:13px; }
</style>
</head>
<body>
<div class="wrap">
<header>
  <div>
    <h1>ViVo — ronde 4: de laatste vier in de praktijk</h1>
    <p>Woordmerk 33a (VIVO dun) met de beeldmerken 01, 02, 10 en 11, in zeven echte toepassingen. Kijk per rij welke het best werkt — vooral de kleine formaten bovenaan zijn vaak beslissend.</p>
  </div>
  <button id="thema" type="button">Licht thema</button>
</header>
<div class="koppen rij">${KANDIDATEN.map(m => `<div class="kop">${m.c.naam}<span>${m.nr}</span></div>`).join('')}</div>
${TOEPASSINGEN.map(t => `<section class="toep">
  <h2>${t.naam}</h2><p>${t.uitleg}</p>
  <div class="rij">${KANDIDATEN.map(m => `<div class="cel"><div class="celkop">${m.nr} · ${m.c.naam}</div>${t.cel(m)}</div>`).join('')}</div>
</section>`).join('\n')}
<footer>Teksten zijn voorbeelden. Alle logo's komen uit dezelfde bron als ronde 1–3 (genereer-concepten.mjs).</footer>
</div>
<script>
  const t = document.getElementById('thema');
  t.addEventListener('click', () => { const l = document.body.classList.toggle('licht'); t.textContent = l ? 'Donker thema' : 'Licht thema'; });
</script>
</body>
</html>
`;

const uit = join(dirname(fileURLToPath(import.meta.url)), 'ronde4-toepassingen.html');
writeFileSync(uit, html);
console.log(`Geschreven: ${uit}`);
