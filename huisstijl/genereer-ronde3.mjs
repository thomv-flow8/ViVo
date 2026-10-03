// Genereert huisstijl/ronde3.html — ronde 2 (mix Baunfire + Clay) met de kleuraanpak van Clay:
// géén eigen accentkleur; de site is neutraal en de kleur komt uit de cases (projectvlakken).
// Schakelaar Warm/Koel kiest de neutrale basis. (Ronde 2 blijft ongewijzigd bewaard.)
// Clay: lichte basis, één vette krappe schreefloze letter, pilknop, grote projectvlakken in projectkleur,
//       diensten als uitklaplijst, tags + "Bekijk case →".
// Baunfire: donkere warme secties, labels met accentstreep, spookletters, rond menu, pijl-in-cirkel, één accent.
// ViVo: labels in monospace (knipoog naar code), chevron uit het logo als uitklappijl, dunne lijnen.
// Schakelaars: hero licht/donker × lettertype (Geist / Inter Tight / Manrope) × accent.
// Draaien: node huisstijl/genereer-ronde2.mjs — preview laadt Google Fonts; live site host ze zelf (AVG).
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const logo = (naam, cls) => readFileSync(join(root, 'merk/svg', `${naam}-wit.svg`), 'utf8').trim()
  .replace(/(stroke|fill)="#[0-9a-fA-F]{3,8}"/g, '$1="currentColor"') // logokleur → meekleuren met het vlak
  .replace(/^<svg /, `<svg class="${cls}" aria-hidden="true" `)
  .replace(/ width="[^"]+" height="[^"]+"/, '')
  .replace(/<title>[^<]*<\/title>/, '');

const LETTERS = {
  geist: { naam: 'Geist', css: "'Geist', sans-serif", gewicht: 600 },
  inter: { naam: 'Inter Tight', css: "'Inter Tight', sans-serif", gewicht: 650 },
  manrope: { naam: 'Manrope', css: "'Manrope', sans-serif", gewicht: 700 },
};
const BASIS = {
  koel: { naam: 'Koel', papier: '#ffffff', papier2: '#f3f4f6', inkt: '#0a0b0d', grijs: '#646a76', nacht: '#15171c', nacht2: '#1e2027', maan: '#f5f6f8', grijsN: '#9aa0ab' },
  warm: { naam: 'Warm', papier: '#f7f6f3', papier2: '#eeece7', inkt: '#121211', grijs: '#6b6a66', nacht: '#1b1a19', nacht2: '#242322', maan: '#f4f2ee', grijsN: '#9c9a95' },
};

const pijl = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`;
// Chevron uit het beeldmerk (Dubbele chevron) als uitklappijl
const chevron = `<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="10"><polyline points="8,16 50,86 92,16"/><polyline points="29.6,16 50,50 70.4,16"/></g></svg>`;
// Apparaat-mockups voor de projectvlakken
const browser = (licht) => `<svg class="mock" viewBox="0 0 320 210" aria-hidden="true"><rect x="0.75" y="0.75" width="318.5" height="208.5" rx="10" fill="${licht ? '#fff' : '#17171a'}" stroke="rgba(0,0,0,.12)" stroke-width="1.5"/><line x1="0" y1="24" x2="320" y2="24" stroke="${licht ? 'rgba(0,0,0,.1)' : 'rgba(255,255,255,.1)'}" stroke-width="1.5"/><circle cx="14" cy="12.5" r="3.5" fill="${licht ? '#ddd' : '#444'}"/><circle cx="26" cy="12.5" r="3.5" fill="${licht ? '#ddd' : '#444'}"/><circle cx="38" cy="12.5" r="3.5" fill="${licht ? '#ddd' : '#444'}"/><rect x="22" y="48" width="132" height="14" rx="3" fill="${licht ? '#1b1a19' : '#f2f1ec'}" opacity=".9"/><rect x="22" y="70" width="104" height="6" rx="3" fill="${licht ? '#1b1a19' : '#f2f1ec'}" opacity=".3"/><rect x="22" y="82" width="116" height="6" rx="3" fill="${licht ? '#1b1a19' : '#f2f1ec'}" opacity=".3"/><rect x="22" y="102" width="52" height="16" rx="8" fill="${licht ? '#1b1a19' : '#f2f1ec'}"/><rect x="176" y="42" width="122" height="146" rx="6" fill="currentColor" opacity=".9"/><rect x="22" y="140" width="66" height="48" rx="5" fill="${licht ? '#1b1a19' : '#f2f1ec'}" opacity=".08"/><rect x="96" y="140" width="66" height="48" rx="5" fill="${licht ? '#1b1a19' : '#f2f1ec'}" opacity=".08"/></svg>`;
const telefoon = `<svg class="tel" viewBox="0 0 90 180" aria-hidden="true"><rect x="1" y="1" width="88" height="178" rx="16" fill="#111" /><rect x="6" y="6" width="78" height="168" rx="12" fill="#fff"/><rect x="14" y="26" width="46" height="8" rx="2" fill="#1b1a19"/><rect x="14" y="40" width="58" height="4" rx="2" fill="#1b1a19" opacity=".3"/><rect x="14" y="48" width="50" height="4" rx="2" fill="#1b1a19" opacity=".3"/><rect x="14" y="64" width="62" height="70" rx="6" fill="currentColor"/><rect x="14" y="144" width="30" height="12" rx="6" fill="#1b1a19"/></svg>`;

const WERK = [
  { naam: 'Flow8', tekst: 'Planningsplatform en digitale werkbonnen voor de installatiebranche.', tags: ['Webapp', 'UX/UI', 'Development'], kleur: '#4f6ef5', inkt: '#dfe5ff', licht: false },
  { naam: 'Voorbeeldproject', tekst: 'Een nieuwe website die van bezoekers klanten maakt.', tags: ['Website', 'Copy', 'SEO'], kleur: '#f3e7a1', inkt: '#1b1a19', licht: true },
  { naam: 'Voorbeeldproject', tekst: 'Een webshop die net zo makkelijk werkt op je telefoon.', tags: ['Webshop', 'Mobiel'], kleur: '#d7e6dc', inkt: '#1f5a3a', licht: true },
  { naam: 'Voorbeeldproject', tekst: 'Huisstijl en website voor een startende ondernemer.', tags: ['Branding', 'Website'], kleur: '#2a2826', inkt: '#dcb37c', licht: false },
];
const DIENSTEN = [
  { titel: 'Websites', tekst: 'Je website is vaak de eerste indruk. ViVo ontwerpt en bouwt snelle, heldere sites die laten zien wie je bent — en die bezoekers laten doen wat jij wilt: bellen, mailen, kopen.', tags: ['Ontwerp', 'Development', 'SEO-basis'] },
  { titel: 'Webshops', tekst: 'Een shop die overzichtelijk is, snel laadt en op elke telefoon prettig afrekent. Gekoppeld aan je betaalprovider en voorraad.', tags: ['E-commerce', 'Betalingen', 'Mobiel'] },
  { titel: 'Webapplicaties', tekst: 'Als een website niet genoeg is: maatwerk-tools voor je bedrijf, zoals planning, werkbonnen of een klantportaal.', tags: ['Maatwerk', 'Firebase', 'PWA'] },
  { titel: 'Onderhoud & hosting', tekst: 'Updates, back-ups, hosting en kleine aanpassingen. Jij onderneemt, ViVo houdt je site veilig en in topvorm.', tags: ['Hosting', 'Updates', 'Support'] },
];
const STAPPEN = [
  { titel: 'Kennismaken', tekst: 'We bespreken je doelen, je klanten en wat je site moet opleveren.' },
  { titel: 'Ontwerpen', tekst: 'Je ziet een klikbaar ontwerp voordat er één regel code geschreven is.' },
  { titel: 'Bouwen', tekst: 'Snel, toegankelijk en vindbaar — getest op telefoon, tablet en desktop.' },
  { titel: 'Lanceren', tekst: 'Live, en daarna blijft ViVo je aanspreekpunt voor onderhoud en groei.' },
];

const html = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ViVo huisstijl ronde 3</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300..800&family=Geist+Mono:wght@400;500&family=Inter+Tight:wght@300..800&family=Manrope:wght@300..800&display=swap" rel="stylesheet">
<link rel="icon" href="../merk/favicon/favicon.svg" type="image/svg+xml">
<style>
  :root {
    --papier:#f7f6f3; --papier2:#eeece7; --inkt:#121211; --grijs:#6b6a66; --lijn:rgba(18,18,17,.12);
    --nacht:#1b1a19; --nacht2:#242322; --maan:#f4f2ee; --grijs-n:#9c9a95; --lijn-n:rgba(244,242,238,.13);
    --f:'Geist', sans-serif; --w-kop:600; --mono:'Geist Mono', ui-monospace, monospace;
    --h1:clamp(44px, 7.4vw, 112px); --h2:clamp(32px, 4.6vw, 64px); --h3:clamp(22px, 2.4vw, 32px);
    --r:18px; --w:1320px;
  }
  ${Object.entries(LETTERS).map(([k, l]) => `[data-f="${k}"] { --f:${l.css}; --w-kop:${l.gewicht}; }`).join('\n  ')}
  ${Object.entries(BASIS).map(([k, b]) => `[data-b="${k}"] { --papier:${b.papier}; --papier2:${b.papier2}; --inkt:${b.inkt}; --grijs:${b.grijs}; --nacht:${b.nacht}; --nacht2:${b.nacht2}; --maan:${b.maan}; --grijs-n:${b.grijsN}; }`).join('\n  ')}
  /* Geen eigen accent (Clay): accent = de tekstkleur van het vlak */
  body { --accent:var(--maan); --accent-t:var(--inkt); }
  .acc { color:inherit !important; }

  * { box-sizing:border-box; }
  body { margin:0; background:var(--papier); color:var(--inkt); font-family:var(--f); font-size:18px; line-height:1.55; font-weight:400; -webkit-font-smoothing:antialiased; }
  .w { max-width:var(--w); margin:0 auto; padding:0 clamp(16px, 4vw, 56px); }
  h1, h2, h3 { font-weight:var(--w-kop); letter-spacing:-.035em; line-height:1.02; margin:0; }
  h3 { letter-spacing:-.02em; line-height:1.15; }
  a { color:inherit; }
  .donker { background:var(--nacht); color:var(--maan); }
  .label { font-family:var(--mono); font-weight:500; font-size:12px; letter-spacing:.16em; text-transform:uppercase; display:inline-flex; align-items:center; gap:12px; color:var(--grijs); }
  .label::before { content:''; width:24px; height:1.5px; background:var(--accent-t); }
  .donker .label { color:var(--grijs-n); } .donker .label::before { background:var(--accent); }
  .acc { color:var(--accent-t); } .donker .acc { color:var(--accent); }

  /* Kop */
  .kop { position:absolute; inset:0 0 auto; z-index:5; color:var(--inkt); }
  [data-h="donker"] .kop { color:var(--maan); }
  .kop .w { display:flex; align-items:center; gap:12px; height:84px; }
  .kop .logo { height:28px; width:auto; }
  .kop nav { display:flex; gap:28px; margin-left:auto; margin-right:16px; font-size:15px; }
  .kop nav a { text-decoration:none; opacity:.75; } .kop nav a:hover { opacity:1; }
  .pil { display:inline-flex; align-items:center; gap:8px; background:var(--inkt); color:var(--papier); border-radius:999px; padding:11px 18px; font-size:14px; font-weight:600; text-decoration:none; white-space:nowrap; }
  [data-h="donker"] .kop .pil, .donker .pil { background:var(--maan); color:var(--nacht); }
  .menu { width:44px; height:44px; border-radius:50%; border:1.5px solid currentColor; background:transparent; color:inherit; display:grid; place-items:center; flex:none; }
  .menu svg { width:18px; }
  @media (max-width:860px) { .kop nav { display:none; } .kop .pil { margin-left:auto; } }

  /* Hero */
  .hero { position:relative; overflow:hidden; padding:clamp(150px, 20vw, 220px) 0 clamp(48px, 6vw, 80px); }
  [data-h="donker"] .hero { background:var(--nacht); color:var(--maan); }
  [data-h="donker"] .hero .label { color:var(--grijs-n); } [data-h="donker"] .hero .label::before { background:var(--accent); }
  [data-h="donker"] .hero .acc { color:var(--accent); }
  .spook { position:absolute; right:-6vw; top:46%; transform:translateY(-50%); width:min(96vw, 1260px); height:auto; opacity:.06; pointer-events:none; }
  .hero .inhoud { position:relative; }
  .hero h1 { font-size:var(--h1); margin:24px 0 0; max-width:12ch; }
  .hero .onder { display:flex; flex-wrap:wrap; gap:28px 48px; align-items:flex-end; justify-content:space-between; margin-top:clamp(28px, 4vw, 48px); }
  .hero p { margin:0; max-width:40ch; color:var(--grijs); font-size:clamp(18px, 1.5vw, 21px); }
  [data-h="donker"] .hero p { color:var(--grijs-n); }
  .cirkel { display:inline-flex; align-items:center; gap:14px; text-decoration:none; font-family:var(--mono); font-size:12px; letter-spacing:.16em; text-transform:uppercase; font-weight:500; }
  .cirkel .rond { width:54px; height:54px; border-radius:50%; border:1.5px solid currentColor; display:grid; place-items:center; transition:background .25s, color .25s, border-color .25s; }
  .cirkel .rond svg { width:20px; }
  .cirkel:hover .rond { background:var(--inkt); border-color:var(--inkt); color:var(--papier); }
  .donker .cirkel:hover .rond, [data-h="donker"] .hero .cirkel:hover .rond { background:var(--maan); border-color:var(--maan); color:var(--nacht); }

  /* Showcase (Clay: groot beeld direct onder de hero) */
  .show { padding:0 0 clamp(72px, 9vw, 128px); }
  [data-h="donker"] .show { background:linear-gradient(var(--nacht) 0 50%, var(--papier) 50% 100%); }
  .paneel { position:relative; border-radius:var(--r); overflow:hidden; aspect-ratio:16/8; min-height:320px; display:grid; place-items:center; background:radial-gradient(120% 120% at 20% 10%, #6d86ff 0%, #4f6ef5 40%, #2b3fb8 100%); color:#ffb547; }
  .paneel .mock { width:min(64%, 760px); height:auto; filter:drop-shadow(0 30px 60px rgba(0,0,0,.35)); transform:translateY(6%); }
  .paneel .tel { position:absolute; width:min(15%, 150px); right:12%; bottom:-4%; filter:drop-shadow(0 20px 40px rgba(0,0,0,.35)); color:#4f6ef5; }
  .paneel .bijschrift { position:absolute; left:20px; bottom:18px; color:#fff; font-family:var(--mono); font-size:12px; letter-spacing:.14em; text-transform:uppercase; opacity:.85; }
  @media (max-width:640px) { .paneel { aspect-ratio:4/5; } .paneel .mock { width:84%; } .paneel .tel { width:26%; right:6%; } }

  /* Intro-statement */
  .statement { padding:0 0 clamp(72px, 9vw, 128px); }
  .statement p { margin:0; font-size:clamp(26px, 3.2vw, 44px); line-height:1.18; letter-spacing:-.025em; font-weight:500; max-width:24ch; }
  .statement .grijs { color:var(--grijs); }

  section.blok { padding:clamp(72px, 9vw, 128px) 0; }
  .sectiekop { display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between; gap:20px 40px; margin-bottom:clamp(32px, 4.5vw, 64px); }
  .sectiekop h2 { font-size:var(--h2); margin-top:16px; max-width:16ch; }
  .sectiekop p { margin:0; max-width:34ch; color:var(--grijs); }
  .donker .sectiekop p { color:var(--grijs-n); }

  /* Diensten als uitklaplijst */
  .lijst { border-top:1px solid var(--lijn-n); }
  details { border-bottom:1px solid var(--lijn-n); }
  summary { list-style:none; cursor:pointer; display:grid; grid-template-columns:56px 1fr auto; align-items:center; gap:16px; padding:clamp(20px, 2.6vw, 32px) 0; }
  summary::-webkit-details-marker { display:none; }
  summary .nr { font-family:var(--mono); font-size:13px; color:var(--grijs-n); letter-spacing:.1em; }
  summary h3 { font-size:var(--h3); }
  summary .chev { width:22px; height:22px; color:var(--grijs-n); transition:transform .35s cubic-bezier(.2,.7,.2,1), color .2s; }
  details[open] summary .chev { transform:rotate(180deg); color:var(--accent); }
  summary:hover h3 { opacity:.7; }
  .uitleg { display:grid; grid-template-columns:56px 1fr; gap:16px; padding:0 0 32px; }
  .uitleg p { margin:0 0 16px; max-width:60ch; color:var(--grijs-n); }
  .tags { font-size:15px; color:var(--grijs); } .donker .tags { color:var(--grijs-n); }
  .tags span + span::before { content:' · '; }

  /* Werk (Clay-kaarten) */
  .werk { display:grid; grid-template-columns:repeat(2, 1fr); gap:clamp(40px, 5vw, 72px) clamp(16px, 2.4vw, 32px); }
  @media (max-width:760px) { .werk { grid-template-columns:1fr; } }
  .case .vlak { border-radius:var(--r); aspect-ratio:4/3; display:grid; place-items:center; overflow:hidden; }
  .case .vlak .mock { width:76%; height:auto; transition:transform .6s cubic-bezier(.2,.7,.2,1); filter:drop-shadow(0 18px 36px rgba(0,0,0,.18)); }
  .case:hover .vlak .mock { transform:scale(1.04) translateY(-2%); }
  .case h3 { font-size:var(--h3); margin:22px 0 6px; }
  .case p { margin:0 0 6px; }
  .case .lees { display:inline-flex; gap:8px; align-items:center; margin-top:14px; font-weight:500; text-decoration:none; border-bottom:1.5px solid currentColor; padding-bottom:3px; }
  .case .lees svg { width:18px; transition:transform .25s; } .case:hover .lees svg { transform:translateX(4px); }

  /* Werkwijze */
  .stappen { display:grid; grid-template-columns:repeat(4, 1fr); gap:24px; }
  @media (max-width:900px) { .stappen { grid-template-columns:repeat(2, 1fr); } }
  @media (max-width:520px) { .stappen { grid-template-columns:1fr; } }
  .stap { border-top:1.5px solid var(--inkt); padding-top:20px; }
  .stap .nr { font-family:var(--mono); font-size:12px; letter-spacing:.14em; color:var(--grijs); }
  .stap h3 { font-size:24px; margin:28px 0 10px; }
  .stap p { margin:0; color:var(--grijs); font-size:16px; }

  /* Slot */
  .slot { position:relative; overflow:hidden; }
  .slot .spookmerk { position:absolute; right:-8%; top:50%; transform:translateY(-50%); width:min(60vw, 720px); opacity:.05; }
  .slot h2 { font-size:var(--h1); max-width:13ch; margin:20px 0 40px; position:relative; }
  .slot .knoppen { display:flex; flex-wrap:wrap; gap:16px 28px; align-items:center; position:relative; }
  footer.voet { padding:48px 0 120px; border-top:1px solid var(--lijn-n); }
  .voet .w { display:flex; flex-wrap:wrap; gap:28px 64px; }
  .voet .logo { height:24px; width:auto; }
  .voet nav, .voet address { display:flex; flex-direction:column; gap:6px; font-style:normal; color:var(--grijs-n); font-size:15px; }
  .voet a { text-decoration:none; } .voet small { flex-basis:100%; color:var(--grijs-n); font-size:13px; }

  /* Bedieningsbalk (hoort niet bij het ontwerp) */
  .bedien { position:fixed; left:50%; bottom:16px; transform:translateX(-50%); z-index:50; display:flex; gap:6px; align-items:center; padding:8px; border-radius:20px; background:rgba(20,20,20,.9); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); box-shadow:0 10px 40px rgba(0,0,0,.3); font:13px/1 system-ui, -apple-system, sans-serif; color:#eee; width:max-content; max-width:calc(100vw - 16px); }
  .bedien button { font:inherit; color:inherit; background:transparent; border:1px solid rgba(255,255,255,.18); border-radius:100px; padding:8px 11px; cursor:pointer; white-space:nowrap; }
  .bedien button.aan { background:#eee; color:#111; border-color:#eee; }
  .bedien .stip { width:30px; height:30px; padding:0; display:grid; place-items:center; }
  .bedien .stip i { width:16px; height:16px; border-radius:50%; display:block; }
  .bedien .stip.aan { background:transparent; border:2px solid #eee; }
  .bedien .duo { display:inline-block; width:12px; height:12px; border-radius:50%; margin-right:6px; vertical-align:-2px; border:1px solid rgba(255,255,255,.4); }
  .bedien .sep { width:1px; height:22px; background:rgba(255,255,255,.18); margin:0 3px; flex:none; }
  @media (max-width:700px) { .bedien { flex-wrap:wrap; justify-content:center; } .bedien .lang { display:none; } }
</style>
</head>
<body data-h="licht" data-f="geist" data-b="koel">

<header class="kop">
  <div class="w">
    <a href="#" aria-label="ViVo home">${logo('vivo-horizontaal', 'logo')}</a>
    <nav><a href="#werk">Werk</a><a href="#diensten">Diensten</a><a href="#werkwijze">Werkwijze</a><a href="#">Over</a></nav>
    <a class="pil" href="#contact">Contact</a>
    <button class="menu" type="button" aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M3 9h18M8 15h13" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></button>
  </div>
</header>

<section class="hero">
  ${logo('vivo-woordmerk', 'spook')}
  <div class="w inhoud">
    <span class="label">ViVo · webdesign &amp; development</span>
    <h1>Websites die <span class="acc">werken.</span></h1>
    <div class="onder">
      <p>ViVo ontwerpt en bouwt snelle, heldere websites en webapps voor ondernemers die gevonden willen worden — en klanten willen overtuigen.</p>
      <a class="cirkel" href="#werk"><span class="rond">${pijl}</span>Bekijk ons werk</a>
    </div>
  </div>
</section>

<section class="show">
  <div class="w"><div class="paneel">${browser(true)}${telefoon}<span class="bijschrift">Uitgelicht · Flow8</span></div></div>
</section>

<section class="statement">
  <div class="w"><p>Eén aanspreekpunt, van eerste schets tot livegang. <span class="grijs">Persoonlijk, snel en zonder vakjargon — met een site die blijft werken.</span></p></div>
</section>

<section class="blok donker" id="diensten">
  <div class="w">
    <div class="sectiekop"><div><span class="label">Wat we doen</span><h2>Waar ViVo goed in is</h2></div><p>Klik een dienst open voor meer uitleg.</p></div>
    <div class="lijst">
      ${DIENSTEN.map((d, i) => `<details${i === 0 ? ' open' : ''}><summary><span class="nr">0${i + 1}</span><h3>${d.titel}</h3><span class="chev">${chevron}</span></summary><div class="uitleg"><span></span><div><p>${d.tekst}</p><div class="tags">${d.tags.map(t => `<span>${t}</span>`).join('')}</div></div></div></details>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="blok" id="werk">
  <div class="w">
    <div class="sectiekop"><div><span class="label">Uitgelicht werk</span><h2>Recente projecten</h2></div><p>Elk project krijgt zijn eigen kleur — net als de merken waarvoor ViVo bouwt.</p></div>
    <div class="werk">
      ${WERK.map(p => `<a class="case" href="#" style="text-decoration:none"><div class="vlak" style="background:${p.kleur};color:${p.inkt}">${browser(p.licht)}</div><h3>${p.naam}</h3><p>${p.tekst}</p><div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div><span class="lees">Bekijk case ${pijl}</span></a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="blok" id="werkwijze" style="padding-top:0">
  <div class="w">
    <div class="sectiekop"><div><span class="label">Werkwijze</span><h2>Zo werken we samen</h2></div></div>
    <div class="stappen">
      ${STAPPEN.map((s, i) => `<div class="stap"><span class="nr">0${i + 1}</span><h3>${s.titel}</h3><p>${s.tekst}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="blok donker slot" id="contact">
  ${logo('vivo-beeldmerk', 'spookmerk')}
  <div class="w">
    <span class="label">Contact</span>
    <h2>Klaar voor een website die <span class="acc">werkt?</span></h2>
    <div class="knoppen"><a class="pil" href="#">Plan een kennismaking</a><a class="cirkel" href="#"><span class="rond">${pijl}</span>hallo@jouwdomein.nl</a></div>
  </div>
</section>
<footer class="voet donker">
  <div class="w">
    ${logo('vivo-horizontaal', 'logo')}
    <nav><a href="#werk">Werk</a><a href="#diensten">Diensten</a><a href="#werkwijze">Werkwijze</a><a href="#contact">Contact</a></nav>
    <address>hallo@jouwdomein.nl<br>Nederland</address>
    <small>© 2026 ViVo Products · voorbeeldteksten en -projecten</small>
  </div>
</footer>

<div class="bedien" role="toolbar" aria-label="Preview-instellingen">
  <button class="kies-h aan" data-h="licht" title="Hero licht">Licht</button><button class="kies-h" data-h="donker" title="Hero donker">Donker</button>
  <span class="sep"></span>
  ${Object.entries(LETTERS).map(([k, l], i) => `<button class="kies-f${k === 'geist' ? ' aan' : ''}" data-f="${k}" style="font-family:${l.css.replace(/'/g, '&#39;')}">${l.naam}</button>`).join('')}
  <span class="sep"></span>
  ${Object.entries(BASIS).map(([k, b], i) => `<button class="kies-b${i ? '' : ' aan'}" data-b="${k}" title="Neutrale basis ${b.naam.toLowerCase()}"><i class="duo" style="background:linear-gradient(90deg, ${b.inkt} 50%, ${b.papier} 50%)"></i>${b.naam}</button>`).join('')}
</div>

<script>
  const body = document.body;
  function kies(sel, attr) {
    document.querySelectorAll(sel).forEach(k => k.addEventListener('click', () => {
      body.dataset[attr] = k.dataset[attr];
      document.querySelectorAll(sel).forEach(x => x.classList.toggle('aan', x === k));
    }));
  }
  kies('.kies-h', 'h'); kies('.kies-f', 'f'); kies('.kies-b', 'b');
</script>
</body>
</html>
`;

writeFileSync(join(root, 'huisstijl', 'ronde3.html'), html);
console.log('Geschreven: huisstijl/ronde3.html');
