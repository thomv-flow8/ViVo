// Genereert huisstijl/ronde1.html — drie huisstijlrichtingen × vier accentkleuren, toegepast op een
// mini-homepage in de opbouw van baunfire.com (Thomas' voorbeeld). Logo's komen uit merk/svg (één bron).
// Draaien: node huisstijl/genereer-huisstijl.mjs
// Let op: deze preview laadt lettertypes van Google Fonts. Op de live site worden ze zelf gehost (AVG).
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// Logo inline met currentColor, zodat het meekleurt met donkere en lichte vlakken
const logo = (naam, cls) => readFileSync(join(root, 'merk/svg', `${naam}-wit.svg`), 'utf8').trim()
  .replace(/(stroke|fill)="#[0-9a-fA-F]{3,8}"/g, '$1="currentColor"') // logokleur → meekleuren met het vlak
  .replace(/^<svg /, `<svg class="${cls}" aria-hidden="true" `)
  .replace(/ width="[^"]+" height="[^"]+"/, '')
  .replace(/<title>[^<]*<\/title>/, '');

const RICHTINGEN = {
  a: { naam: 'A · Rustig', sub: 'Manrope — premium en ingetogen', kop: 'Manrope', tekst: 'Manrope', label: 'Barlow Condensed' },
  b: { naam: 'B · Baunfire', sub: 'Montserrat + Barlow — warm en toegankelijk', kop: 'Montserrat', tekst: 'Barlow', label: 'Barlow Condensed' },
  c: { naam: 'C · Gedurfd', sub: 'Archivo extra breed — groot en uitgesproken', kop: 'Archivo (125%)', tekst: 'Archivo', label: 'Archivo smal' },
};
const ACCENTEN = {
  oranje: { naam: 'Signaaloranje', op: '#ff5b2e', tekst: '#c93f17' },
  kobalt: { naam: 'Kobalt', op: '#6d86ff', tekst: '#2f4fe0' },
  lime: { naam: 'Lime', op: '#c6f135', tekst: '#4a6400' },
  zand: { naam: 'Zand', op: '#dcb37c', tekst: '#85622f' },
};

const pijl = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`;
const browser = `<svg viewBox="0 0 160 100" aria-hidden="true"><rect x="1" y="1" width="158" height="98" rx="6" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".5"/><line x1="1" y1="14" x2="159" y2="14" stroke="currentColor" stroke-width="1.5" opacity=".5"/><circle cx="9" cy="7.5" r="2" fill="currentColor" opacity=".5"/><circle cx="16" cy="7.5" r="2" fill="currentColor" opacity=".5"/><rect x="14" y="28" width="70" height="8" rx="2" fill="currentColor" opacity=".55"/><rect x="14" y="42" width="48" height="4" rx="2" fill="currentColor" opacity=".3"/><rect x="14" y="50" width="56" height="4" rx="2" fill="currentColor" opacity=".3"/><rect x="96" y="26" width="50" height="58" rx="4" fill="currentColor" opacity=".18"/><rect x="14" y="66" width="30" height="10" rx="5" fill="currentColor" opacity=".55"/></svg>`;

const WERK = [
  { naam: 'Flow8', soort: 'Planningsplatform voor installateurs', toon: 'w1' },
  { naam: 'Voorbeeldproject', soort: 'Website op maat', toon: 'w2' },
  { naam: 'Voorbeeldproject', soort: 'Webshop', toon: 'w3' },
];
const DIENSTEN = [
  { titel: 'Websites', tekst: 'Een snelle, heldere website op maat — ontworpen rond jouw klanten en gebouwd om gevonden te worden.' },
  { titel: 'Webshops', tekst: 'Verkopen zonder gedoe: een overzichtelijke shop die werkt op elke telefoon.' },
  { titel: 'Onderhoud', tekst: 'Updates, hosting en kleine aanpassingen. Jij onderneemt, ViVo houdt je site in topvorm.' },
];

const html = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ViVo huisstijl ronde 1</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..900&family=Barlow+Condensed:wght@500;600&family=Barlow:wght@300;400;500&family=Manrope:wght@300;400;500;600;700&family=Montserrat:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="icon" href="../merk/favicon/favicon.svg" type="image/svg+xml">
<style>
  /* ── Tokens per richting ── */
  :root, [data-r="a"] {
    --donker:#151514; --donker2:#1d1c1b; --licht:#f4f2ee; --licht2:#e9e6e0; --inkt:#151514; --wit:#f4f2ee;
    --grijs-op-donker:#9a9893; --grijs-op-licht:#66645f; --lijn-donker:rgba(244,242,238,.12); --lijn-licht:rgba(21,21,20,.12);
    --f-kop:'Manrope', sans-serif; --w-kop:500; --ls-kop:-.035em; --st-kop:100%; --tt-kop:none; --lh-kop:1.04;
    --f-tekst:'Manrope', sans-serif; --w-tekst:400; --ls-tekst:0;
    --f-label:'Barlow Condensed', sans-serif; --w-label:600; --st-label:100%; --ls-label:.42em;
    --h1:clamp(42px, 7.2vw, 104px); --h2:clamp(30px, 4.2vw, 56px); --h3:clamp(22px, 2.2vw, 28px);
    --r-kaart:4px; --r-knop:100px;
  }
  [data-r="b"] {
    --donker:#1f1e1d; --donker2:#262524; --licht:#f2f2f2; --licht2:#e6e6e6; --inkt:#111; --wit:#fff;
    --grijs-op-donker:#9c9c9c; --grijs-op-licht:#6f6f6f;
    --f-kop:'Montserrat', sans-serif; --w-kop:700; --ls-kop:-.012em; --st-kop:100%; --lh-kop:1.08;
    --f-tekst:'Barlow', sans-serif; --w-tekst:300; --ls-tekst:.02em;
    --w-label:600; --ls-label:.6em;
    --h1:clamp(40px, 6vw, 80px); --h2:clamp(28px, 3.4vw, 44px);
    --r-kaart:0px;
  }
  [data-r="c"] {
    --donker:#0e0e0e; --donker2:#181818; --licht:#ebe8e1; --licht2:#dedad1; --inkt:#0e0e0e; --wit:#f6f4ef;
    --f-kop:'Archivo', sans-serif; --w-kop:800; --ls-kop:-.02em; --st-kop:125%; --tt-kop:uppercase; --lh-kop:.94;
    --f-tekst:'Archivo', sans-serif; --w-tekst:400; --ls-tekst:0;
    --f-label:'Archivo', sans-serif; --w-label:600; --st-label:75%; --ls-label:.32em;
    --h1:clamp(40px, 8.4vw, 128px); --h2:clamp(30px, 5vw, 68px);
    --r-kaart:14px;
  }
  /* ── Accenten (op donker / als tekst op licht) ── */
  ${Object.entries(ACCENTEN).map(([k, a]) => `[data-a="${k}"] { --accent:${a.op}; --accent-t:${a.tekst}; }`).join('\n  ')}

  * { box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body { margin:0; background:var(--donker); color:var(--wit); font-family:var(--f-tekst); font-weight:var(--w-tekst); letter-spacing:var(--ls-tekst); font-size:17px; line-height:1.6; -webkit-font-smoothing:antialiased; }
  .w { max-width:1280px; margin:0 auto; padding:0 clamp(16px, 4vw, 56px); }
  h1, h2, h3 { font-family:var(--f-kop); font-weight:var(--w-kop); letter-spacing:var(--ls-kop); font-stretch:var(--st-kop); text-transform:var(--tt-kop); line-height:var(--lh-kop); margin:0; }
  [data-r="c"] h3 { text-transform:none; font-stretch:110%; }
  .label { font-family:var(--f-label); font-weight:var(--w-label); font-stretch:var(--st-label); letter-spacing:var(--ls-label); text-transform:uppercase; font-size:13px; display:inline-flex; align-items:center; gap:14px; }
  .label::before { content:''; width:28px; height:1.5px; background:var(--accent); }
  .op-donker .label { color:var(--accent); }
  .op-licht .label { color:var(--inkt); }
  .op-licht .label::before { background:var(--accent-t); }
  .op-donker { background:var(--donker); color:var(--wit); }
  .op-licht { background:var(--licht); color:var(--inkt); }
  .acc { color:var(--accent); }
  .op-licht .acc { color:var(--accent-t); }

  /* ── Kop ── */
  .kop { position:absolute; inset:0 0 auto; z-index:5; }
  .kop .w { display:flex; align-items:center; gap:20px; height:88px; }
  .kop .logo { height:30px; width:auto; color:var(--wit); }
  .praat { margin-left:auto; font-family:var(--f-label); font-weight:var(--w-label); font-stretch:var(--st-label); letter-spacing:.24em; font-size:13px; text-transform:uppercase; color:var(--wit); text-decoration:none; padding-bottom:6px; border-bottom:1.5px solid currentColor; }
  .menu { width:52px; height:52px; border-radius:50%; background:var(--wit); color:var(--inkt); display:grid; place-items:center; border:0; flex:none; }
  .menu svg { width:22px; height:22px; }
  @media (max-width:560px) { .praat { display:none; } .menu { margin-left:auto; } }

  /* ── Hero ── */
  .hero { position:relative; min-height:min(100svh, 880px); display:flex; align-items:center; overflow:hidden; padding:120px 0 96px; }
  .spook { position:absolute; right:-4vw; top:50%; transform:translateY(-50%); width:min(92vw, 1180px); height:auto; color:var(--wit); opacity:.07; pointer-events:none; }
  .hero .inhoud { position:relative; max-width:900px; }
  .hero h1 { font-size:var(--h1); margin:26px 0 28px; }
  .hero p { max-width:44ch; color:var(--grijs-op-donker); font-size:clamp(17px, 1.4vw, 20px); margin:0; }
  .cta { display:inline-flex; align-items:center; gap:16px; margin-top:44px; color:inherit; text-decoration:none; font-family:var(--f-label); font-weight:var(--w-label); font-stretch:var(--st-label); letter-spacing:.24em; text-transform:uppercase; font-size:13px; }
  .cta .rond { width:52px; height:52px; border-radius:50%; border:1.5px solid var(--accent); display:grid; place-items:center; color:var(--accent); transition:background .25s, color .25s; }
  .op-licht .cta .rond { border-color:var(--inkt); color:var(--inkt); }
  .cta:hover .rond { background:var(--accent); color:var(--donker); }
  .op-licht .cta:hover .rond { background:var(--inkt); color:var(--licht); }
  .cta .rond svg { width:20px; height:20px; }
  .scroll { position:absolute; right:clamp(16px, 4vw, 56px); bottom:48px; writing-mode:vertical-rl; font-family:var(--f-label); letter-spacing:.5em; font-size:11px; text-transform:uppercase; color:var(--grijs-op-donker); display:flex; align-items:center; gap:14px; }
  .scroll::before { content:''; width:1px; height:56px; background:currentColor; }
  @media (max-width:560px) { .scroll { display:none; } }

  /* ── Secties ── */
  section.blok { padding:clamp(72px, 10vw, 140px) 0; }
  .sectiekop { display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between; gap:24px; margin-bottom:clamp(36px, 5vw, 64px); }
  .sectiekop h2 { font-size:var(--h2); margin-top:18px; }
  .sectiekop p { margin:0; max-width:36ch; color:var(--grijs-op-licht); }
  .op-donker .sectiekop p { color:var(--grijs-op-donker); }
  .werk { display:grid; gap:clamp(16px, 2vw, 28px); grid-template-columns:repeat(3, 1fr); }
  @media (max-width:860px) { .werk { grid-template-columns:1fr; } }
  .project { color:inherit; text-decoration:none; }
  .beeld { aspect-ratio:4/3; border-radius:var(--r-kaart); display:grid; place-items:center; overflow:hidden; position:relative; }
  .beeld svg { width:62%; color:var(--wit); transition:transform .5s cubic-bezier(.2,.7,.2,1); }
  .project:hover .beeld svg { transform:scale(1.05) translateY(-2%); }
  .w1 { background:linear-gradient(140deg, var(--donker) 0%, var(--donker2) 100%); }
  .w2 { background:linear-gradient(160deg, #3a3936, #24231f); }
  .w3 { background:linear-gradient(130deg, #4b4843, #2c2a27); }
  .w1::after { content:''; position:absolute; inset:auto 0 0 0; height:4px; background:var(--accent); }
  .project h3 { font-size:var(--h3); margin:20px 0 4px; }
  .project span { color:var(--grijs-op-licht); font-size:15px; }
  .knopregel { margin-top:clamp(36px, 5vw, 56px); }

  .diensten { display:grid; grid-template-columns:repeat(3, 1fr); border-top:1px solid var(--lijn-donker); }
  @media (max-width:860px) { .diensten { grid-template-columns:1fr; } }
  .dienst { padding:36px 32px 36px 0; border-bottom:1px solid var(--lijn-donker); }
  @media (min-width:861px) { .dienst + .dienst { padding-left:32px; border-left:1px solid var(--lijn-donker); } }
  .dienst .nr { font-family:var(--f-label); font-weight:var(--w-label); letter-spacing:.2em; font-size:13px; color:var(--accent); }
  .dienst h3 { font-size:var(--h3); margin:28px 0 12px; }
  .dienst p { margin:0; color:var(--grijs-op-donker); }

  .slot { text-align:left; }
  .slot h2 { font-size:var(--h1); max-width:14ch; margin-top:20px; }

  footer.voet { padding:56px 0 120px; border-top:1px solid var(--lijn-donker); }
  .voet .w { display:flex; flex-wrap:wrap; gap:32px 64px; align-items:flex-start; }
  .voet .logo { height:26px; width:auto; }
  .voet nav, .voet address { display:flex; flex-direction:column; gap:6px; font-style:normal; color:var(--grijs-op-donker); font-size:15px; }
  .voet a { color:inherit; text-decoration:none; }
  .voet small { flex-basis:100%; color:var(--grijs-op-donker); font-size:13px; }

  /* ── Bedieningsbalk (hoort niet bij het ontwerp) ── */
  .bedien { position:fixed; left:50%; bottom:16px; transform:translateX(-50%); z-index:50; display:flex; flex-wrap:wrap; gap:6px; align-items:center; justify-content:center; padding:8px; border-radius:20px; background:rgba(20,20,20,.88); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); box-shadow:0 10px 40px rgba(0,0,0,.35); font:13px/1 system-ui, -apple-system, sans-serif; letter-spacing:0; color:#eee; width:max-content; max-width:calc(100vw - 24px); }
  .bedien button { font:inherit; color:inherit; background:transparent; border:1px solid rgba(255,255,255,.18); border-radius:100px; padding:8px 12px; cursor:pointer; }
  .bedien button.aan { background:#eee; color:#111; border-color:#eee; }
  .bedien .stip { width:30px; height:30px; padding:0; display:grid; place-items:center; }
  .bedien .stip i { width:16px; height:16px; border-radius:50%; display:block; }
  .bedien .stip.aan { background:transparent; border-color:#eee; border-width:2px; }
  .bedien .sep { width:1px; height:22px; background:rgba(255,255,255,.18); margin:0 4px; }
  .bedien .uitleg { padding:0 6px; color:#aaa; }
  .bedien b { font-weight:600; }
  @media (max-width:700px) { .bedien .uitleg, .bedien .lang { display:none; } .bedien button { padding:8px 13px; } }

  /* ── Tokens-overzicht ── */
  .tokens { display:grid; gap:16px; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); }
  .tok { border:1px solid var(--lijn-licht); border-radius:var(--r-kaart); padding:18px; background:var(--licht2); min-width:0; }
  .tok h4 { margin:0 0 12px; font-family:var(--f-label); font-weight:var(--w-label); letter-spacing:.24em; font-size:12px; text-transform:uppercase; }
  .stalen { display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; }
  .staal { aspect-ratio:1; border-radius:6px; border:1px solid var(--lijn-licht); }
  .tok p { margin:6px 0 0; font-size:14px; color:var(--grijs-op-licht); }
  .proef-kop { font-family:var(--f-kop); font-weight:var(--w-kop); font-stretch:var(--st-kop); letter-spacing:var(--ls-kop); font-size:44px; line-height:1; text-transform:var(--tt-kop); }
  .proef-label { font-family:var(--f-label); font-weight:var(--w-label); font-stretch:var(--st-label); letter-spacing:var(--ls-label); text-transform:uppercase; font-size:13px; }
</style>
</head>
<body data-r="b" data-a="oranje">

<header class="kop">
  <div class="w">
    <a href="#" aria-label="ViVo home">${logo('vivo-horizontaal', 'logo')}</a>
    <a class="praat" href="#contact">Laten we praten</a>
    <button class="menu" type="button" aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M4 9h16M8 15h12" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></button>
  </div>
</header>

<section class="hero op-donker">
  ${logo('vivo-woordmerk', 'spook')}
  <div class="w inhoud">
    <span class="label">Wij zijn ViVo</span>
    <h1>Websites die <span class="acc">werken.</span></h1>
    <p>ViVo ontwerpt en bouwt snelle, heldere websites voor ondernemers die gevonden willen worden — en klanten willen overtuigen.</p>
    <a class="cta" href="#werk"><span class="rond">${pijl}</span>Bekijk ons werk</a>
  </div>
  <div class="scroll">Scroll</div>
</section>

<section class="blok op-licht" id="werk">
  <div class="w">
    <div class="sectiekop">
      <div><span class="label">Uitgelicht werk</span><h2>Recente projecten</h2></div>
      <p>Een greep uit websites en webapplicaties die ViVo ontwierp en bouwde.</p>
    </div>
    <div class="werk">
      ${WERK.map(p => `<a class="project" href="#"><div class="beeld ${p.toon}">${browser}</div><h3>${p.naam}</h3><span>${p.soort}</span></a>`).join('\n      ')}
    </div>
    <div class="knopregel"><a class="cta" href="#"><span class="rond">${pijl}</span>Meer werk</a></div>
  </div>
</section>

<section class="blok op-donker">
  <div class="w">
    <div class="sectiekop">
      <div><span class="label">Wat we doen</span><h2>Waar ViVo goed in is</h2></div>
      <p>Van eerste schets tot livegang, en daarna. Eén aanspreekpunt, korte lijnen.</p>
    </div>
    <div class="diensten">
      ${DIENSTEN.map((d, i) => `<div class="dienst"><span class="nr">0${i + 1}</span><h3>${d.titel}</h3><p>${d.tekst}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="blok op-licht slot" id="contact">
  <div class="w">
    <span class="label">Contact</span>
    <h2>Klaar voor een website die <span class="acc">werkt?</span></h2>
    <a class="cta" href="#"><span class="rond">${pijl}</span>Plan een kennismaking</a>
  </div>
</section>

<section class="blok op-licht" style="padding-top:0">
  <div class="w">
    <div class="sectiekop"><div><span class="label">Huisstijl</span><h2 id="tok-naam">Tokens</h2></div><p id="tok-sub"></p></div>
    <div class="tokens">
      <div class="tok"><h4>Kleuren</h4><div class="stalen"><div class="staal" style="background:var(--donker)"></div><div class="staal" style="background:var(--licht)"></div><div class="staal" style="background:var(--accent)"></div></div><p id="tok-kleur"></p></div>
      <div class="tok"><h4>Koppen</h4><div class="proef-kop">Aa Vv</div><p id="tok-kop"></p></div>
      <div class="tok"><h4>Labels</h4><div class="proef-label">Wat we doen</div><p id="tok-label"></p></div>
      <div class="tok"><h4>Tekst</h4><div>Websites die werken, voor ondernemers die gevonden willen worden.</div><p id="tok-tekst"></p></div>
    </div>
  </div>
</section>

<footer class="voet op-donker">
  <div class="w">
    ${logo('vivo-horizontaal', 'logo')}
    <nav><a href="#">Werk</a><a href="#">Diensten</a><a href="#">Over ViVo</a><a href="#">Contact</a></nav>
    <address>hallo@jouwdomein.nl<br>Nederland</address>
    <small>© 2026 ViVo Products · voorbeeldteksten</small>
  </div>
</footer>

<div class="bedien" role="toolbar" aria-label="Preview-instellingen">
  <span class="uitleg">Richting</span>
  ${Object.entries(RICHTINGEN).map(([k, r]) => `<button class="kies-r${k === 'b' ? ' aan' : ''}" data-r="${k}" title="${r.sub}"><b>${r.naam.split(' · ')[0]}</b><span class="lang"> · ${r.naam.split(' · ')[1]}</span></button>`).join('')}
  <span class="sep"></span><span class="uitleg">Accent</span>
  ${Object.entries(ACCENTEN).map(([k, a]) => `<button class="stip kies-a${k === 'oranje' ? ' aan' : ''}" data-a="${k}" title="${a.naam}" aria-label="${a.naam}"><i style="background:${a.op}"></i></button>`).join('')}
</div>

<script>
  const R = ${JSON.stringify(RICHTINGEN)}, A = ${JSON.stringify(ACCENTEN)};
  const body = document.body;
  const zet = (id, t) => { document.getElementById(id).textContent = t; };
  function tokens() {
    const r = R[body.dataset.r], a = A[body.dataset.a], cs = getComputedStyle(body);
    zet('tok-naam', r.naam); zet('tok-sub', r.sub + ' · accent ' + a.naam);
    zet('tok-kleur', 'Donker ' + cs.getPropertyValue('--donker').trim() + ' · Licht ' + cs.getPropertyValue('--licht').trim() + ' · Accent ' + a.op);
    zet('tok-kop', r.kop + ', gewicht ' + cs.getPropertyValue('--w-kop').trim());
    zet('tok-label', r.label + ', kapitalen, ruim gespatieerd');
    zet('tok-tekst', r.tekst + ', gewicht ' + cs.getPropertyValue('--w-tekst').trim());
  }
  function kies(sel, attr) {
    document.querySelectorAll(sel).forEach(k => k.addEventListener('click', () => {
      body.dataset[attr] = k.dataset[attr];
      document.querySelectorAll(sel).forEach(x => x.classList.toggle('aan', x === k));
      tokens();
    }));
  }
  kies('.kies-r', 'r'); kies('.kies-a', 'a'); tokens();
</script>
</body>
</html>
`;

writeFileSync(join(root, 'huisstijl', 'ronde1.html'), html);
console.log('Geschreven: huisstijl/ronde1.html');
