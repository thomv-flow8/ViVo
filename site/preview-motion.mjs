// Motion-preview v5 (NIET op de live site). Nieuw t.o.v. v4: vaste kopbalk waarin het logo krimpt tot het beeldmerk in een
// cirkel (Baunfire), scroll-aanwijzing rechtsonder, Higgsfield-renders als zachte vormen die constant langzaam bewegen,
// lichte afsluiting "Laten we praten" met een grote bewegende lus, Mozi tablet + telefoon, Flow8 start met inloggen.
// —— oorspronkelijke kop v4: —— Feedback Thomas verwerkt:
// - Hero: donker (B) + kleine geanimeerde scroll-aanwijzing onderaan.
// - Diensten (model clay.global/services): grote zachte 3D-vormen (kubussen, bollen, kegels, schijven) op de achtergrond
//   die bewegen; de beelden naast de beschrijvingen bewegen organisch mee met scrollen (eigen tempo per dienst).
//   Beeldvakken tonen beelden/diensten/<naam>.jpg zodra die bestaan (Higgsfield), anders een compositie in code.
// - Werkwijze: tijdlijn met eigen kleur per stap (blauw, paars, oranje, groen), kleurverloop over de lijn, kleurrijke animaties.
// - Cases: elk een eigen startbeeld — schermvullend, tablet + telefoon (inzoomen), browservenster.
// Draaien: node site/preview-motion.mjs → docs-preview/motion.html  (bekijken via npm run preview)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as si from 'simple-icons';
import { CASES, SITE } from './inhoud.mjs';
import { PRIVACY, VOORWAARDEN, COOKIES } from './juridisch.mjs';
import { maakJuridisch, meetVlaggen } from './juridisch-render.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const logo = (naam, cls = '') => readFileSync(join(root, 'merk/svg', `${naam}-wit.svg`), 'utf8').trim()
  .replace(/(stroke|fill)="#[0-9a-fA-F]{3,8}"/g, '$1="currentColor"')
  .replace(/^<svg /, `<svg ${cls ? `class="${cls}" ` : ''}aria-hidden="true" focusable="false" `)
  .replace(/ width="[^"]+" height="[^"]+"/, '')
  .replace(/<title>[^<]*<\/title>/, '');
const pijl = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`;
const icoon = (k) => { const i = si[k]; return `<span class="tech"><svg viewBox="0 0 24 24" role="img" aria-label="${i.title}"><path d="${i.path}" fill="currentColor"/></svg><span>${i.title}</span></span>`; };

// ── 3D-bouwstenen ──
const chevron3d = (lagen = 26, diepte = 1.6) => Array.from({ length: lagen }, (_, i) =>
  `<svg class="laag${i ? '' : ' voor'}" viewBox="0 0 100 100" style="--i:${i};transform:translateZ(${(-i * diepte).toFixed(1)}px)" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="10" stroke-miterlimit="10"><polyline points="8,16 50,86 92,16"/><polyline points="29.6,16 50,50 70.4,16"/></g></svg>`).join('');
const pos = (x, y, s, d = 1, extra = '') => `style="left:${x}%;top:${y}%;--s:${s}cqw;${extra}" data-d="${d}"`;
const bol = (x, y, s, d, soort = '') => `<span class="bol ${soort}" ${pos(x, y, s, d)}></span>`;
const kubus = (x, y, s, d, soort = '', rx = -24, ry = 38) => `<span class="kubus ${soort}" ${pos(x, y, s, d)}><span class="k3" style="transform:rotateX(${rx}deg) rotateY(${ry}deg)">${'<i></i>'.repeat(6)}</span></span>`;
const schijven = (x, y, s, d, n = 3, soort = '') => `<span class="schijven ${soort}" ${pos(x, y, s, d)}>${'<i></i>'.repeat(n)}</span>`;
const kaartje = (x, y, s, d, inhoud, extra = '') => `<span class="uik" ${pos(x, y, s, d, extra)}>${inhoud}</span>`;
const regel = (w, kleur = 'var(--inkt)', h = 6) => `<b style="width:${w}%;height:${h}px;background:${kleur}"></b>`;

// Grote zachte achtergrondvormen (Clay-stijl), maten in vw
const vorm = (soort, x, y, s, d, rx = -26, ry = 36, rz = 0) => {
  const st = `style="left:${x}%;top:${y}%;--s:${s}vw" data-d="${d}"`;
  if (soort === 'bol') return `<span class="zv bol zacht" ${st}></span>`;
  if (soort === 'bol-lila') return `<span class="zv bol zacht lila" ${st}></span>`;
  if (soort === 'kubus') return `<span class="zv kubus zacht" ${st}><span class="k3" style="transform:rotateX(${rx}deg) rotateY(${ry}deg)">${'<i></i>'.repeat(6)}</span></span>`;
  if (soort === 'kegel') return `<span class="zv kegel" ${st}><span class="kg" style="transform:rotate(${rz}deg)"><i></i><b></b></span></span>`;
  if (soort === 'schijven') return `<span class="zv schijven zacht" ${st}><i></i><i></i><i></i></span>`;
  return '';
};
const VORMEN = ['kubussen', 'schijven', 'plaat', 'kegel', 'bollen', 'servers']; // echte 3D-vormen: site/drie.js
const CLUSTERS = [
  [vorm('kubus', 8, 4, 12, 1.4), vorm('bol', 42, 22, 10, 2), vorm('bol-lila', 70, 0, 6, 2.6)],
  [vorm('kegel', 30, 0, 13, 1.6, 0, 0, -38), vorm('schijven', 0, 40, 9, 2.2)],
  [vorm('kubus', 30, 6, 10, 1.8, -20, 50), vorm('kubus', 60, 30, 7, 2.4, -34, 20), vorm('bol', 4, 30, 8, 1.2)],
  [vorm('bol', 20, 0, 14, 1.2), vorm('kegel', 62, 34, 8, 2.4, 0, 0, 24)],
  [vorm('kubus', 24, 0, 11, 1.6, -18, 60), vorm('schijven', 58, 26, 8, 2.2)],
  [vorm('bol', 10, 10, 9, 1.6), vorm('bol-lila', 46, 0, 12, 1.1), vorm('bol', 72, 36, 6, 2.6)],
];

const COMPOSITIES = {
  branding: `<div class="comp licht">${bol(60, 8, 26, 1.6, 'inkt')}${bol(12, 62, 14, 2.2)}${bol(80, 64, 9, 2.8)}
      ${kaartje(14, 16, 40, 0.8, `<em class="aa">Aa</em>${regel(70, 'var(--grijs)', 5)}${regel(50, 'var(--grijs)', 5)}`, 'padding:6% 7%')}
      ${kaartje(40, 52, 44, 1.2, `<span class="stalen"><i style="background:#0a0b0d"></i><i style="background:#646a76"></i><i style="background:#e6e9ee"></i><i style="background:#f5f6f8"></i></span>`, 'padding:5%')}
      <span class="merkteken" ${pos(66, 30, 16, 2)}><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fff"/><path d="M28 34 L50 72 L72 34" fill="none" stroke="#0a0b0d" stroke-width="9"/></svg></span></div>`,
  ui: `<div class="comp licht">${kaartje(10, 12, 46, 0.7, `<span class="foto"></span>${regel(80)}${regel(55, 'var(--grijs)', 5)}<span class="pilletje">Bekijk</span>`, 'padding:4%')}
      ${kaartje(58, 16, 30, 1.4, `<span class="schakelaar"><i></i></span><span class="schakelaar uit"><i></i></span>`, 'padding:6%')}
      ${kaartje(52, 54, 38, 1.9, `<span class="schuif"><i></i></span>${regel(60, 'var(--grijs)', 5)}`, 'padding:7% 8%')}
      ${bol(20, 70, 12, 2.4)}${kubus(80, 74, 8, 2.8)}
      <span class="cursor" ${pos(46, 44, 5, 2.6)}><svg viewBox="0 0 24 24"><path d="M3 2 L3 20 L8 15 L12 23 L15 21 L11 13 L19 13 Z" fill="#0a0b0d" stroke="#fff" stroke-width="1.4"/></svg></span></div>`,
  web: `<div class="comp licht">${kaartje(8, 10, 70, 0.8, `<span class="balkje"><i></i><i></i><i></i></span><span class="rasterje"><i></i><i></i><i></i><i></i><i></i><i></i></span>`, 'padding:0 0 4%')}
      ${kaartje(52, 6, 40, 1.6, `<span class="zoek"><svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15 15l5 5" stroke="currentColor" stroke-width="2"/></svg><b style="width:60%;height:6px;background:var(--grijs)"></b></span>`, 'padding:3.5% 5%')}
      <span class="mand" ${pos(72, 58, 14, 2.2)}><svg viewBox="0 0 24 24"><path d="M3 4h3l2 11h11l2-8H7" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/><circle cx="10" cy="19" r="1.6" fill="#fff"/><circle cx="17" cy="19" r="1.6" fill="#fff"/></svg><em>3</em></span>
      ${kubus(16, 68, 11, 2.4)}${kubus(30, 76, 7, 3, 'inkt', -20, 20)}${bol(88, 30, 8, 3)}</div>`,
  content: `<div class="comp licht">${kaartje(10, 14, 50, 0.9, `<span class="landschap"><i class="zon"></i><i class="berg1"></i><i class="berg2"></i></span>`, 'padding:3%')}
      <span class="speel-bol" ${pos(48, 46, 16, 2)}><svg viewBox="0 0 24 24"><path d="M9 7l9 5-9 5z" fill="#fff"/></svg></span>
      <span class="film" ${pos(58, 64, 36, 1.5)}><i></i><i></i><i></i><i></i></span>${kubus(72, 14, 14, 2.4, '', -30, 45)}${bol(16, 72, 10, 2.8, 'inkt')}</div>`,
  netwerk: `<div class="comp donker"><svg class="lijnen" viewBox="0 0 100 80" preserveAspectRatio="none"><g fill="none" stroke="#9aa0ab" stroke-width="0.35" vector-effect="non-scaling-stroke">
        <path d="M22 22 L50 40 L78 20"/><path d="M50 40 L30 64 M50 40 L74 62"/><path d="M22 22 L30 64"/><path d="M78 20 L74 62"/></g></svg>
      ${bol(17, 15, 10, 1.4)}${bol(45, 32, 11, 1)}${bol(73, 13, 10, 1.6)}${bol(25, 57, 9, 2)}${bol(69, 55, 10, 1.8)}${schijven(80, 66, 14, 2.4, 3, 'db')}
      ${kaartje(6, 70, 34, 2.2, `${regel(60, '#6d86ff')}${regel(80, '#f5f6f8')}${regel(45, '#9aa0ab')}`, 'padding:5% 6%;background:#1e2027')}</div>`,
  hosting: `<div class="comp licht">${schijven(14, 22, 26, 1, 4)}
      <span class="globe" ${pos(56, 12, 30, 1.6)}><span class="bol" style="position:absolute;inset:0;--s:auto"></span><i class="baan"></i><i class="maan"></i></span>
      ${kaartje(44, 62, 46, 2, `<svg class="grafiek" viewBox="0 0 100 34"><polyline points="2,30 18,24 34,26 50,16 66,14 82,8 98,4" fill="none" stroke="#0a0b0d" stroke-width="2"/></svg><span class="status-led"><i></i>Online · 99,9%</span>`, 'padding:5% 6%')}
      ${kubus(84, 44, 7, 2.8, 'inkt')}</div>`,
};

const DIENSTEN = [
  { titel: 'Branding', tekst: 'Een merk dat blijft hangen. We ontwerpen je logo en huisstijl — kleuren, letters, beeldtaal — en leggen alles vast, zodat je overal herkenbaar bent: online, op papier en op social.',
    lijst: ['Logo & beeldmerk', 'Huisstijl', 'Kleuren & typografie', 'Merkrichtlijnen', 'Drukwerk & social'], comp: 'branding' },
  { titel: 'Ontwerp & UI/UX', tekst: 'Schermen die prettig werken én er strak uitzien. We denken mee over je doelgroep en je doelen, en laten alles eerst zien als klikbaar prototype.',
    lijst: ['UI-design', 'UX & gebruiksgemak', 'Klikbare prototypes', 'Design systems', 'Toegankelijkheid'], comp: 'ui' },
  { titel: 'Websites & webshops', tekst: 'Snelle, vindbare sites die bezoekers omzetten in klanten — van bedrijfssite tot webshop met online afspraken, met een eigen beheeromgeving om zelf teksten en producten aan te passen.',
    lijst: ['Websites op maat', 'Webshops', 'Eigen CMS', 'Meertalig', 'SEO & vindbaarheid', 'Koppelingen'], comp: 'web' },
  { titel: 'Content', tekst: 'Beeld dat je verhaal vertelt. We maken foto’s, video’s, animaties en 3D-beelden — zelf geproduceerd en versterkt met AI — en schrijven teksten die passen bij je merk.',
    lijst: ['Fotografie', 'Video & reels', 'Animatie & motion', '3D-visuals', 'Teksten'], comp: 'content' },
  { titel: 'Development', tekst: 'Als een website niet genoeg is: maatwerksoftware die je werk eenvoudiger maakt. Met inloggen, rechten per rol, een eigen database en koppelingen — in de browser én als app.',
    lijst: ['Webapps', 'SaaS-platforms', 'Databases & login', 'Koppelingen & API’s', 'Kaarten & routes', 'Werkt als app (PWA)'], comp: 'netwerk' },
  { titel: 'Hosting & onderhoud', tekst: 'Een site is nooit echt af. ViVo regelt hosting, domein en updates, houdt een oogje in het zeil en helpt je verder groeien met statistieken en verbeteringen.',
    lijst: ['Hosting & domein', 'Updates & back-ups', 'Statistieken', 'Snelheid & veiligheid', 'Support'], comp: 'hosting' },
];
// Beeldvak: foto uit beelden/diensten/<comp>.jpg als die bestaat (Higgsfield), anders de compositie
// Afwisseling in beeldsoort (Clay): een echt project op een kleurvlak, een foto, en verder renders
const BEELD_VERSIE = 5; // ophogen bij nieuwe beelden met dezelfde naam (anders toont de browser de oude uit de cache)
const BEELD = {}; // bv. { ui: 'werk' } (Flow8-schermen op kleurvlak) of { web: 'foto-websites.jpg' }; nu één doorlopende renderreeks
const media = (d) => {
  if (BEELD[d.comp] === 'werk') return `<div class="comp foto werkvlak"><div class="wk wk1"><img src="${img('flow8', 'rapportage.jpg')}" alt=""></div><div class="wk wk2"><img src="${img('flow8', 'desktop.jpg')}" alt=""></div></div>`;
  const f = `beelden/diensten/${BEELD[d.comp] || d.comp + '.jpg'}`, w = f.replace(/\.jpg$/, '.webp');
  return existsSync(join(root, f)) ? `<div class="comp foto"><img src="../${existsSync(join(root, w)) ? w : f}?v=${BEELD_VERSIE}" alt="" width="1200" height="1600" loading="lazy" decoding="async"></div>` : COMPOSITIES[d.comp];
};
const dienst = (d, i) => `<article class="dienst${i % 2 ? ' om' : ''}"><div class="vorm-3d" data-vorm="${VORMEN[i]}" aria-hidden="true"><canvas></canvas></div><div class="dtekst"><span class="label">0${i + 1}</span><h3>${d.titel}</h3><p>${d.tekst}</p><ul>${d.lijst.map(l => `<li>${l}</li>`).join('')}</ul></div><div class="dmedia">${media(d)}</div></article>`;

const TECHNIEK = [
  ['Basis', 'Elke site, met de hand gebouwd: snel en zonder overbodige ballast.', ['siHtml5', 'siCss', 'siJavascript']],
  ['Data & login', 'Databases, inloggen, opslag en serverfuncties voor webapps.', ['siFirebase', 'siNodedotjs']],
  ['Kaarten & mail', 'Locaties, routes en automatische e-mail.', ['siGooglemaps', 'siResend']],
  ['Hosting & beheer', 'Versiebeheer, hosting en een eigen beheeromgeving via GitHub.', ['siGithub', 'siGithubpages', 'siVercel']],
  ['Apps & meten', 'Webapps die werken als app, en inzicht in je bezoekers.', ['siPwa', 'siGoogleanalytics']],
];

// ── Werkwijze: tijdlijn met eigen kleur per stap ──
const KLEUR = ['#4f6ef5', '#8b5cf6', '#ff7a45', '#1fb874'], TINT = ['#e8edff', '#f1ebff', '#ffece3', '#ddf7ea'];
const ICOON = {
  praat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  ontwerp: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  raket: '<path d="M12 15l-3-3c1.5-4.5 5-8 10-9-1 5-4.5 8.5-9 10z"/><path d="M9 12l-4 1-2 3 4 1M12 15l-1 4 3 2 1-4"/><circle cx="15" cy="9" r="1.6"/>',
};
const STAPPEN = [
  { titel: 'Kennismaken', icoon: 'praat', tekst: 'We gaan om tafel: wat wil je bereiken, wie zijn je klanten en wat moet de site opleveren? Je krijgt een helder voorstel met planning en prijs.', duur: 'Week 1' },
  { titel: 'Ontwerpen', icoon: 'ontwerp', tekst: 'We ontwerpen je site en laten hem zien als klikbaar prototype. Met hulp van AI verkennen we snel meerdere richtingen — jij kiest en stuurt bij.', duur: 'Week 1–2' },
  { titel: 'Bouwen', icoon: 'code', tekst: 'We bouwen je site op maat: snel, toegankelijk en vindbaar, getest op telefoon, tablet en desktop. AI versnelt het werk, met de kwaliteit van handwerk.', duur: 'Week 2–4' },
  { titel: 'Lanceren & groeien', icoon: 'raket', tekst: 'Je site gaat live op je eigen domein. Daarna blijft ViVo je vaste aanspreekpunt voor onderhoud, updates en verbeteringen.', duur: 'Daarna' },
];
const ILLU = [
  // Kennismaken (blauw): gesprek met avatars
  `<svg viewBox="0 0 320 200" class="illu"><defs><linearGradient id="gb" x1="0" x2="1"><stop offset="0" stop-color="#6d86ff"/><stop offset="1" stop-color="#4f6ef5"/></linearGradient></defs>
     <circle class="b1" cx="30" cy="44" r="14" fill="#ffd2bf"/><circle class="b1" cx="30" cy="40" r="6" fill="#ff7a45"/>
     <rect class="b1" x="52" y="20" width="160" height="48" rx="16" fill="#fff" stroke="#c9d3ff" stroke-width="1.5"/><rect class="b1" x="68" y="35" width="104" height="7" rx="3.5" fill="#4f6ef5"/><rect class="b1" x="68" y="48" width="66" height="7" rx="3.5" fill="#c9d3ff"/>
     <circle class="b2" cx="292" cy="112" r="14" fill="#d9ccff"/><circle class="b2" cx="292" cy="108" r="6" fill="#8b5cf6"/>
     <rect class="b2" x="100" y="86" width="176" height="52" rx="16" fill="url(#gb)"/><rect class="b2" x="118" y="102" width="118" height="7" rx="3.5" fill="#fff"/><rect class="b2" x="118" y="116" width="76" height="7" rx="3.5" fill="#c9d3ff"/>
     <g class="b3"><rect x="52" y="154" width="86" height="32" rx="16" fill="#fff" stroke="#c9d3ff" stroke-width="1.5"/><circle class="stip" cx="78" cy="170" r="4" fill="#4f6ef5"/><circle class="stip" cx="95" cy="170" r="4" fill="#6d86ff"/><circle class="stip" cx="112" cy="170" r="4" fill="#a5b4ff"/></g>
     <path class="hart" d="M230 168 c-6-8 -18 0 -9 9 l9 8 l9-8 c9-9 -3-17 -9-9z" fill="#ff7a45"/></svg>`,
  // Ontwerpen (paars): wireframe met kleurvlakken, palet en selectie
  `<svg viewBox="0 0 320 200" class="illu"><defs><linearGradient id="gp" x1="0" x2="1"><stop offset="0" stop-color="#a78bfa"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs>
     <rect x="10" y="8" width="300" height="184" rx="12" fill="#fff" stroke="#e4dcff" stroke-width="1.5"/><rect x="10" y="8" width="300" height="20" rx="12" fill="#f4f0ff"/>
     <rect class="w" x="28" y="44" width="160" height="16" rx="4" fill="url(#gp)"/><rect class="w" x="28" y="68" width="116" height="7" rx="3" fill="#cbbdfb"/><rect class="w" x="28" y="86" width="64" height="22" rx="11" fill="#8b5cf6"/>
     <rect class="w2" x="210" y="40" width="82" height="70" rx="10" fill="#ffe4d6"/><circle class="w2" cx="251" cy="75" r="18" fill="#ff7a45"/>
     <rect class="w2" x="28" y="126" width="82" height="50" rx="10" fill="#e8edff"/><rect class="w2" x="120" y="126" width="82" height="50" rx="10" fill="#ddf7ea"/><rect class="w2" x="212" y="126" width="80" height="50" rx="10" fill="#f1ebff"/>
     <rect class="kader" x="116" y="122" width="90" height="58" rx="12" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="5 4"/>
     <g class="palet"><circle cx="232" cy="22" r="0" fill="#4f6ef5"/><circle cx="252" cy="22" r="0" fill="#8b5cf6"/><circle cx="272" cy="22" r="0" fill="#ff7a45"/><circle cx="292" cy="22" r="0" fill="#1fb874"/></g>
     <g class="cursor"><path d="M0 0 L0 18 L5 13 L9 22 L12 20 L8 12 L15 12 Z" fill="#8b5cf6" stroke="#fff" stroke-width="1.2"/></g></svg>`,
  // Bouwen (oranje): editor met syntaxkleuren, build en vinkje
  `<svg viewBox="0 0 320 200" class="illu"><rect x="10" y="8" width="300" height="184" rx="12" fill="#15171c"/><circle cx="26" cy="22" r="4" fill="#ff5f57"/><circle cx="40" cy="22" r="4" fill="#febc2e"/><circle cx="54" cy="22" r="4" fill="#28c840"/>
     ${[[28, 48, 34, '#ff7a45'], [68, 48, 84, '#a5b4ff'], [44, 66, 60, '#8b5cf6'], [110, 66, 100, '#f5f6f8'], [44, 84, 120, '#1fb874'], [60, 102, 70, '#ffb38a'], [136, 102, 64, '#a5b4ff'], [44, 120, 150, '#f5f6f8'], [28, 138, 34, '#ff7a45']].map(([x, y, w, k]) => `<rect class="code" x="${x}" y="${y}" width="${w}" height="8" rx="4" fill="${k}"/>`).join('')}
     <rect class="term" x="28" y="154" width="190" height="24" rx="8" fill="#23262e"/><text class="term" x="40" y="170" font-family="Geist Mono, monospace" font-size="10" fill="#7ee0a8">✓ build geslaagd · 0,8 s</text>
     <circle class="vinkbol" cx="268" cy="150" r="22" fill="#1fb874"/><path class="vinkje" d="M257 150 l8 8 l14 -15" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="40" stroke-dashoffset="40"/></svg>`,
  // Lanceren (groen): browser gaat live, groeigrafiek met vlak, confetti
  `<svg viewBox="0 0 320 200" class="illu"><defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="#1fb874"/><stop offset="1" stop-color="#7ee0a8"/></linearGradient><linearGradient id="gv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1fb874" stop-opacity=".35"/><stop offset="1" stop-color="#1fb874" stop-opacity="0"/></linearGradient></defs>
     <rect x="10" y="10" width="300" height="180" rx="12" fill="#fff" stroke="#c9eedb" stroke-width="1.5"/><rect x="10" y="10" width="300" height="24" rx="12" fill="#eefaf3"/>
     <rect x="70" y="16" width="180" height="12" rx="6" fill="#fff"/><text x="82" y="25.5" font-family="Geist Mono, monospace" font-size="8.5" fill="#1fb874">● vivoproducts.nl</text>
     <rect x="30" y="50" width="260" height="10" rx="5" fill="#eefaf3"/><rect class="laad" x="30" y="50" width="0" height="10" rx="5" fill="url(#gg)"/>
     <path class="vlakg" d="M30 176 L80 164 L130 168 L180 146 L230 136 L290 110 L290 176 Z" fill="url(#gv)" opacity="0"/>
     <polyline class="groei" points="30,176 80,164 130,168 180,146 230,136 290,110" fill="none" stroke="#1fb874" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="330" stroke-dashoffset="330"/>
     <g class="live" opacity="0"><rect x="118" y="78" width="84" height="28" rx="14" fill="#1fb874"/><text x="160" y="96" text-anchor="middle" font-family="Geist, sans-serif" font-weight="600" font-size="12" fill="#fff">Live!</text></g>
     <g class="confetti">${[[96, 80, '#4f6ef5'], [226, 74, '#8b5cf6'], [110, 116, '#ff7a45'], [214, 112, '#1fb874'], [160, 66, '#febc2e'], [244, 92, '#4f6ef5']].map(([x, y, k]) => `<rect x="${x}" y="${y}" width="6" height="6" rx="1.5" fill="${k}" opacity="0"/>`).join('')}</g></svg>`,
];

// ── Cases: elk een eigen startbeeld ──
const webp = (slug, f) => { const w = f.replace(/\.jpg$/, '.webp'); return w !== f && existsSync(join(root, 'docs/img/cases', slug, w)) ? w : f; }; // tools/webp.mjs
const img = (slug, f) => `../docs/img/cases/${slug}/${webp(slug, f)}`;
const pngMaat = p => { const b = readFileSync(p); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
const afm = (slug, f) => { const p = join(root, 'docs/img/cases', slug, f); if (!existsSync(p)) return ''; const [w, h] = f.endsWith('.png') ? pngMaat(p) : jpgMaat(p); return ` width="${w}" height="${h}"`; };
const heeft = (slug, f) => existsSync(join(root, 'docs/img/cases', slug, f));
const MODUS = { thnk: 'vol', delphi: 'tablet', mozi: 'tablet-scroll', flow8: 'scherm' };
const VOLGORDE = { flow8: ['login.jpg', 'rapportage.jpg', 'desktop.jpg', 'route.jpg', 'kaart.jpg'] };
// Op de lichtgrijze projectsectie valt het bijna-witte DELPHI-vlak weg → daar wit
const OP_GRIJS = { delphi: '#ffffff' };
const kaart = (c) => {
  const vol = heeft(c.slug, 'pagina.jpg');
  const reeks = vol ? [] : (VOLGORDE[c.slug] || ['desktop.jpg', ...(c.galerij || []).map(g => g.bestand)]).filter(f => heeft(c.slug, f)).slice(0, 5);
  const scherm = vol
    ? `<img class="site" data-src="${img(c.slug, 'pagina.jpg')}" src="${img(c.slug, 'desktop.jpg')}" alt=""${afm(c.slug, 'desktop.jpg')} loading="lazy" decoding="async">`
    : reeks.map((f, j) => `<img class="dia" src="${img(c.slug, f)}" alt=""${afm(c.slug, f)} loading="lazy" decoding="async" style="opacity:${j ? 0 : 1}">`).join('');
  const modus = MODUS[c.slug] || 'tablet';
  const tel = modus.startsWith('tablet') && heeft(c.slug, 'mobiel.jpg') ? `<div class="tel"><img src="${img(c.slug, 'mobiel.jpg')}" alt=""${afm(c.slug, 'mobiel.jpg')} loading="lazy" decoding="async"></div>` : '';
  const toestel = modus === 'vol' ? `<div class="glas vol">${scherm}</div>`
    : modus === 'scherm' ? `<div class="scherm-kaart"><div class="glas">${scherm}</div></div>` // app-schermen als zwevende kaart (Clay, Digital Products)
    : modus === 'browser' ? `<div class="browser"><div class="balk"><i></i><i></i><i></i></div><div class="glas">${scherm}</div></div>`
    : `<div class="tablet"><div class="glas">${scherm}</div></div>`; // tablet en tablet-scroll
  const hint = modus === 'tablet' ? 'Hover · inzoomen' : vol ? 'Hover · door de site' : 'Hover · schermen';
  return `<a class="case speel" data-modus="${modus}" href="case-${c.slug}.html"><div class="onthul"><div class="vlak modus-${modus}" style="--case:${OP_GRIJS[c.slug] || c.kleur}">${c.status ? `<span class="status">${c.status}</span>` : ''}
    ${toestel}${tel}<span class="hint">${hint}</span></div></div>
    <h3>${c.naam}</h3><p>${c.kort}</p><div class="tags">${c.rol.map(t => `<span>${t}</span>`).join('')}</div><span class="link">Bekijk case ${pijl}</span></a>`;
};

// ── Gedeeld door homepage en case-pagina's: stijl, kopbalk + menu, afsluiter ──
// thuis = pad naar de homepage ('' op de homepage zelf, zodat ankers op dezelfde pagina blijven)
const CSS = `
  /* ── Hero (donker) ── */
  .mhero { position: relative; min-height: 100svh; overflow: hidden; display: flex; align-items: center; padding: 140px 0 110px; background: var(--nacht); color: var(--maan); }
  .mhero .inhoud { position: relative; z-index: 3; width: 100%; }
  .mhero .tekst { max-width: 640px; }
  .mhero h1 { font-size: var(--h1); margin: 24px 0 0; max-width: 11ch; }
  .mhero p { max-width: 40ch; color: var(--grijs-n); font-size: clamp(18px, 1.5vw, 21px); margin: 28px 0 0; }
  .mhero .label { color: var(--grijs-n); } .mhero .label::before { background: var(--maan); }
  .mhero .cirkel { margin-top: 36px; } .mhero .cirkel:hover .rond { background: var(--maan); color: var(--nacht); border-color: var(--maan); }
  .podium { position: absolute; inset: 0; z-index: 1; overflow: hidden; }
  /* Intro (Baunfire): wit vlak met zwarte letters; het donker schuift er van links naar rechts onder vandaan */
  .intro-wit { display: none; position: absolute; inset: 0; z-index: 5; overflow: hidden; background: var(--papier); clip-path: inset(0 0 0 0); }
  .intro .intro-wit { display: block; animation: intro-vangnet .4s 6s forwards; } .intro-wit .letters { color: var(--inkt); }
  @keyframes intro-vangnet { to { visibility: hidden; opacity: 0; } } /* laden de scripts niet, dan blijft het niet wit */
  .mhero .w-r { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: .08em; margin-bottom: -.08em; } .mhero .w-r > span { display: inline-block; }
  .letters { position: absolute; right: clamp(-2vw, 3vw, 80px); top: calc(50% - 70svh); width: 37svh; height: 140svh; color: #1d2027; }
  .letters svg { position: absolute; left: 50%; top: 50%; width: 140svh; height: auto; transform: translate(-50%, -50%) rotate(-90deg); }
  .ring { position: absolute; width: min(70vw, 760px); aspect-ratio: 1; border-radius: 50%; border: 1px solid var(--lijn-n); right: -8vw; top: 50%; margin-top: calc(min(70vw, 760px) / -2); }
  .stip-groep { position: absolute; display: grid; grid-template-columns: repeat(4, 10px); gap: 10px; z-index: 2; }
  .stip-groep i { width: 8px; height: 8px; color: var(--grijs-n); } .stip-groep i svg { width: 100%; height: 100%; display: block; }
  .chev3d { position: absolute; right: clamp(6%, 13vw, 18%); top: calc(50% - clamp(90px, 12.5vw, 180px)); width: clamp(180px, 25vw, 360px); aspect-ratio: 1; perspective: 1100px; z-index: 2; --chev-voor: #f5f6f8; --flank-voor: #9aa0ab; --flank-achter: #23262e; }
  .draai, .zweef { position: absolute; inset: 0; transform-style: preserve-3d; }
  .laag { position: absolute; inset: 0; width: 100%; height: 100%; color: color-mix(in srgb, var(--flank-voor) calc(100% - var(--i) * 4%), var(--flank-achter)); }
  .laag.voor { color: var(--chev-voor); }
  /* Vaste kopbalk die omkeert op lichte/donkere vlakken (mix-blend-mode: difference) */
  .kop { position: fixed; color: #fff; mix-blend-mode: difference; } .kop .pil { background: #fff; color: #000; }
  .kop .logo.morf { display: flex; align-items: center; gap: 12px; position: relative; height: 46px; } /* .kop .logo uit vivo.css weegt zwaarder dan .morf */
  .kop .morf .lm-merk svg { height: 28px; width: auto; display: block; transition: transform .5s var(--ease); }
  .kop .w { max-width: none; } /* kopbalk over de volle breedte: logo helemaal links */
  /* Menu: één witte pil die meeschuift naar het item onder de muis (stijl van de Contact-knop; door difference zwart op licht) */
  .kop nav { position: relative; gap: 2px; margin-right: 12px; }
  .kop nav a { position: relative; z-index: 1; padding: 12px 18px; border-radius: var(--r-pil); font-weight: 500; transition: color .3s var(--ease), opacity .3s var(--ease); }
  .kop nav a:hover, .kop nav a:focus-visible { opacity: 1; color: #000; outline: none; }
  .nav-pil { position: absolute; top: 0; left: 0; height: 100%; width: 0; background: #fff; border-radius: var(--r-pil); opacity: 0; pointer-events: none; transition: transform .5s cubic-bezier(.16, 1, .3, 1), width .5s cubic-bezier(.16, 1, .3, 1), opacity .25s var(--ease); }
  .nav-pil.direct { transition: opacity .25s var(--ease); }
  .nav-pil.rust { background: transparent; box-shadow: inset 0 0 0 1.5px #fff; } /* omlijnd: hier ben je */
  .kop .morf .lm-woord svg { height: 13px; width: auto; display: block; overflow: visible; }
  .lm-woord svg g > * { transition: opacity .45s ease, transform .55s var(--ease); }
  /* terugkomen: van links naar rechts (V, I, V, O) */
  .lm-woord svg g > :nth-child(2) { transition-delay: .06s; } .lm-woord svg g > :nth-child(3) { transition-delay: .12s; } .lm-woord svg g > :nth-child(4) { transition-delay: .18s; }
  /* wegfaden: van rechts naar links (O, V, I, V) */
  .kop.compact .lm-woord svg g > * { opacity: 0; transform: translateX(-10px); }
  .kop.compact .lm-woord svg g > :nth-child(4) { transition-delay: 0s; } .kop.compact .lm-woord svg g > :nth-child(3) { transition-delay: .07s; }
  .kop.compact .lm-woord svg g > :nth-child(2) { transition-delay: .14s; } .kop.compact .lm-woord svg g > :nth-child(1) { transition-delay: .21s; }

  /* scroll-aanwijzing rechtsonder: lijntje met lopende stip + verticaal "Scroll" */
  .scrollcue { position: absolute; right: var(--goot); bottom: 36px; z-index: 4; display: flex; flex-direction: column; align-items: center; gap: 14px; color: var(--grijs-n); text-decoration: none; }
  .scrollcue .lijn { width: 1px; height: 72px; background: rgba(245, 246, 248, .22); position: relative; overflow: hidden; }
  .scrollcue .lijn i { position: absolute; left: -1px; top: -16px; width: 3px; height: 16px; border-radius: 2px; background: var(--maan); animation: val 2.2s cubic-bezier(.6,0,.4,1) infinite; }
  .scrollcue .woord { writing-mode: vertical-rl; font-family: var(--mono); font-size: 10px; letter-spacing: .42em; text-transform: uppercase; }
  @keyframes val { 0% { top: -16px; } 75%, 100% { top: 72px; } }
  @media (prefers-reduced-motion: reduce) { .scrollcue .lijn i { animation: none; top: 28px; } }
  @media (max-width: 860px) { .chev3d { width: 32vw; right: 12vw; top: auto; bottom: 90px; } .mhero { align-items: flex-start; padding-top: 130px; padding-bottom: 52vw; } .stip-groep { display: none; } }

  /* ── 3D-bouwstenen in composities ── */
  .comp { position: relative; aspect-ratio: 5 / 4; border-radius: var(--r); overflow: hidden; container-type: inline-size; isolation: isolate; box-shadow: 0 40px 80px -40px rgba(10, 11, 13, .25); }
  .comp.licht { background: radial-gradient(120% 100% at 30% 0%, #ffffff 0%, var(--papier-2) 60%, #e8ebef 100%); }
  .comp.donker { background: radial-gradient(120% 100% at 50% 100%, #26304a 0%, var(--nacht) 60%); }
  .comp.foto img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .comp > [data-d] { position: absolute; width: var(--s); will-change: transform; }
  .bol { aspect-ratio: 1; border-radius: 50%; background: radial-gradient(circle at 34% 30%, #ffffff 0 8%, #f1f3f6 30%, #cfd4dc 70%, #b7bdc7 100%); box-shadow: 0 2.5cqw 4cqw -1.5cqw rgba(10, 11, 13, .28); }
  .bol.inkt { background: radial-gradient(circle at 34% 30%, #7a808a 0 5%, #2a2e37 38%, #0a0b0d 80%); }
  .kubus { aspect-ratio: 1; perspective: 60cqw; }
  .k3 { position: absolute; inset: 0; transform-style: preserve-3d; }
  .k3 i { position: absolute; inset: 0; background: linear-gradient(135deg, #ffffff, #e2e6ec); border: 1px solid rgba(10, 11, 13, .05); }
  .k3 i:nth-child(1) { transform: translateZ(calc(var(--s) / 2)); }
  .k3 i:nth-child(2) { transform: rotateY(180deg) translateZ(calc(var(--s) / 2)); }
  .k3 i:nth-child(3) { transform: rotateY(90deg) translateZ(calc(var(--s) / 2)); background: linear-gradient(135deg, #e3e7ed, #c4cad3); }
  .k3 i:nth-child(4) { transform: rotateY(-90deg) translateZ(calc(var(--s) / 2)); background: linear-gradient(135deg, #e3e7ed, #c4cad3); }
  .k3 i:nth-child(5) { transform: rotateX(90deg) translateZ(calc(var(--s) / 2)); background: #fbfcfd; }
  .k3 i:nth-child(6) { transform: rotateX(-90deg) translateZ(calc(var(--s) / 2)); background: #b9c0ca; }
  .kubus.inkt .k3 i { background: linear-gradient(135deg, #3a3e46, #15171c); border-color: rgba(255,255,255,.06); } .kubus.inkt .k3 i:nth-child(5) { background: #4a4f59; }
  .schijven i { display: block; aspect-ratio: 3.2 / 1; border-radius: 50%; margin-top: -9%; background: radial-gradient(ellipse at 40% 30%, #ffffff 0%, #e6e9ee 55%, #c8ced7 100%); box-shadow: 0 1.2cqw 0 #c3c9d2, 0 2.4cqw 3cqw -1cqw rgba(10, 11, 13, .2); position: relative; }
  .schijven i:first-child { margin-top: 0; }
  .schijven i::after { content: ''; position: absolute; right: 22%; top: 42%; width: 4%; aspect-ratio: 1; border-radius: 50%; background: #34c37a; box-shadow: 0 0 1.4cqw #34c37a; }
  .schijven.db i { background: radial-gradient(ellipse at 40% 30%, #6d86ff 0%, #3346b8 60%, #1d2a78 100%); box-shadow: 0 1.2cqw 0 #18225f, 0 2.4cqw 3cqw -1cqw rgba(0,0,0,.4); } .schijven.db i::after { display: none; }
  .uik { background: #fff; border-radius: 2.2cqw; box-shadow: 0 2.4cqw 5cqw -1.5cqw rgba(10, 11, 13, .22); display: flex; flex-direction: column; gap: 1.4cqw; }
  .uik b { display: block; border-radius: 3px; }
  .uik .aa { font-style: normal; font-weight: 600; font-size: 13cqw; line-height: .9; letter-spacing: -.04em; color: var(--inkt); }
  .stalen { display: flex; gap: 2cqw; } .stalen i { flex: 1; aspect-ratio: 1; border-radius: 50%; border: 1px solid var(--lijn); }
  .merkteken svg { width: 100%; display: block; filter: drop-shadow(0 1.5cqw 2.5cqw rgba(10,11,13,.18)); }
  .foto { display: block; aspect-ratio: 16 / 9; border-radius: 1.4cqw; background: linear-gradient(160deg, #dfe4ea, #b9c1cc); }
  .pilletje { align-self: flex-start; background: var(--inkt); color: #fff; font-size: 2.6cqw; padding: 1cqw 3cqw; border-radius: 999px; }
  .schakelaar { display: block; width: 46%; aspect-ratio: 2 / 1; border-radius: 999px; background: var(--inkt); position: relative; }
  .schakelaar i { position: absolute; right: 6%; top: 10%; height: 80%; aspect-ratio: 1; border-radius: 50%; background: #fff; }
  .schakelaar.uit { background: #d5dae1; } .schakelaar.uit i { right: auto; left: 6%; }
  .schuif { display: block; height: 1cqw; border-radius: 1cqw; background: #e3e7ec; position: relative; } .schuif::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 62%; background: var(--inkt); border-radius: 1cqw; }
  .schuif i { position: absolute; left: 62%; top: 50%; width: 4cqw; aspect-ratio: 1; border-radius: 50%; background: #fff; border: 2px solid var(--inkt); transform: translate(-50%, -50%); }
  .cursor svg { width: 100%; display: block; } .mand svg { width: 50%; display: block; } .speel-bol svg { width: 44%; display: block; margin-left: 6%; }
  .balkje { display: flex; gap: 1cqw; padding: 1.6cqw 2cqw; background: #eceef1; border-radius: 2.2cqw 2.2cqw 0 0; } .balkje i { width: 1.4cqw; aspect-ratio: 1; border-radius: 50%; background: #c9ccd2; }
  .rasterje { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2cqw; padding: 3cqw 4cqw 0; } .rasterje i { aspect-ratio: 1; border-radius: 1.4cqw; background: linear-gradient(160deg, #eef1f4, #d6dce3); }
  .zoek { display: flex; align-items: center; gap: 2cqw; color: var(--inkt); } .zoek svg { width: 4cqw; flex: none; }
  .mand { aspect-ratio: 1; border-radius: 50%; background: var(--inkt); display: grid; place-items: center; box-shadow: 0 2cqw 4cqw -1cqw rgba(10,11,13,.4); }
  .mand em { position: absolute; right: -4%; top: -4%; width: 34%; aspect-ratio: 1; border-radius: 50%; background: #fff; color: var(--inkt); font: 600 2.6cqw/1 var(--f); display: grid; place-items: center; font-style: normal; box-shadow: 0 0 0 2px var(--inkt); }
  .landschap { display: block; position: relative; aspect-ratio: 4 / 3; border-radius: 1.6cqw; overflow: hidden; background: linear-gradient(180deg, #dfe6ef, #f4f6f9); }
  .landschap .zon { position: absolute; right: 18%; top: 16%; width: 16%; aspect-ratio: 1; border-radius: 50%; background: #0a0b0d; }
  .landschap .berg1 { position: absolute; left: -10%; bottom: 0; width: 80%; height: 60%; background: #9aa0ab; clip-path: polygon(0 100%, 45% 10%, 100% 100%); }
  .landschap .berg2 { position: absolute; right: -10%; bottom: 0; width: 80%; height: 46%; background: #646a76; clip-path: polygon(0 100%, 55% 5%, 100% 100%); }
  .speel-bol { aspect-ratio: 1; border-radius: 50%; background: radial-gradient(circle at 34% 30%, #7a808a 0 5%, #2a2e37 38%, #0a0b0d 80%); display: grid; place-items: center; box-shadow: 0 2.5cqw 5cqw -1.5cqw rgba(10,11,13,.45); }
  .film { display: flex; gap: 1.5cqw; padding: 1.6cqw; background: var(--inkt); border-radius: 1.6cqw; transform: rotate(-6deg); } .film i { flex: 1; aspect-ratio: 4 / 3; border-radius: .8cqw; background: linear-gradient(160deg, #9aa0ab, #3a3e46); }
  .lijnen { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
  .globe { aspect-ratio: 1; position: absolute; } .globe .baan { position: absolute; inset: -12% -22%; border: 1px solid rgba(10,11,13,.25); border-radius: 50%; transform: rotate(-18deg) scaleY(.32); }
  .globe .maan { position: absolute; width: 14%; aspect-ratio: 1; border-radius: 50%; background: var(--inkt); left: 92%; top: 30%; }
  .grafiek { width: 100%; display: block; } .status-led { display: flex; align-items: center; gap: 1.6cqw; font: 500 2.6cqw/1 var(--mono); color: var(--inkt); } .status-led i { width: 1.8cqw; aspect-ratio: 1; border-radius: 50%; background: #34c37a; box-shadow: 0 0 1.4cqw #34c37a; }

  /* ── Grote zachte achtergrondvormen (Clay-stijl) ── */
  .vormen { position: absolute; z-index: 0; width: 46%; height: 70%; top: -8%; right: -4%; pointer-events: none; }
  .dienst.om .vormen { right: auto; left: -4%; }
  .zv { position: absolute; width: var(--s); will-change: transform; }
  .zv.bol.zacht { aspect-ratio: 1; border-radius: 50%; background: radial-gradient(circle at 36% 30%, #ffffff 0 12%, #f4f5f9 38%, #e2e5ec 72%, #d4d8e1 100%); box-shadow: 0 3vw 5vw -2vw rgba(60, 70, 110, .16); }
  .zv.bol.zacht.lila { background: radial-gradient(circle at 36% 30%, #ffffff 0 12%, #f3f1fb 38%, #e3def5 72%, #d6cff0 100%); }
  .zv.kubus { aspect-ratio: 1; perspective: 60vw; }
  .zv.kubus .k3 i { background: linear-gradient(140deg, #ffffff, #eef0f5); border: none; box-shadow: inset 0 0 3vw rgba(255,255,255,.6); }
  .zv.kubus .k3 i:nth-child(3), .zv.kubus .k3 i:nth-child(4) { background: linear-gradient(140deg, #eceef4, #dcdfe8); }
  .zv.kubus .k3 i:nth-child(5) { background: #fbfbfd; } .zv.kubus .k3 i:nth-child(6) { background: #d7dbe4; }
  .zv.kegel { aspect-ratio: 1; } .zv.kegel .kg { position: absolute; inset: 0; }
  .zv.kegel .kg i { position: absolute; inset: 0 0 12% 0; background: linear-gradient(90deg, #dfe2ea 0%, #fbfbfd 42%, #eef0f5 62%, #d9dde6 100%); clip-path: polygon(50% 0, 100% 100%, 0 100%); }
  .zv.kegel .kg b { position: absolute; left: 0; right: 0; bottom: 0; height: 24%; border-radius: 50%; background: radial-gradient(ellipse at 50% 40%, #f6f7fa, #dde1e9); }
  .zv.schijven i { display: block; aspect-ratio: 3.2 / 1; border-radius: 50%; margin-top: -10%; background: radial-gradient(ellipse at 40% 30%, #ffffff 0%, #eef0f5 55%, #dadde6 100%); box-shadow: 0 .8vw 0 #d6dae3, 0 2vw 3vw -1vw rgba(60,70,110,.14); }
  .zv.schijven i:first-child { margin-top: 0; }

  /* ── Zachte vormen (Higgsfield-renders) achter de dienstfoto's ── */
  .vorm-3d { position: absolute; z-index: 0; width: clamp(280px, 34vw, 540px); aspect-ratio: 1; top: -30%; left: 42%; pointer-events: none; } /* rechts van het paginamidden (±148 px op 1440) */
  .vorm-3d canvas { width: 100%; height: 100%; display: block; }
  .dienst.om .vorm-3d { left: auto; right: 42%; } /* links van het paginamidden */
  .diensten2 .sectiekop { position: relative; z-index: 2; } /* kop en intro altijd boven de vormen */
  @media (min-width: 861px) { .sectiekop + .dienst .vorm-3d { top: 0; } } /* eerste vorm niet de sectiekop in laten steken */
  @media (max-width: 860px) { .vorm-3d, .dienst.om .vorm-3d { position: relative; order: 1; justify-self: end; width: 56vw; top: auto; left: auto; right: auto; margin: -2vw -2vw -24vw 0; } .dienst .dmedia { order: 2; } /* mobiel: tussen tekst en foto, de foto valt er half overheen */ }
  .vorm-img { position: absolute; z-index: 0; width: clamp(240px, 30vw, 470px); height: auto; top: -10%; right: -5%; pointer-events: none; will-change: transform; filter: drop-shadow(0 40px 50px rgba(70, 80, 120, .12)); }
  .dienst.om .vorm-img { right: auto; left: -5%; }
  .vorm-img.gespiegeld { scale: -1 1; }
  @media (max-width: 860px) { .vorm-img { width: 60vw; top: auto; bottom: 34%; opacity: .85; } }
  /* ── Beelden komen eenmalig binnen bij het eerste scrollen (zoals clay.global): opacity + omhoog + iets groter.
     Losse translate/scale-eigenschappen, zodat GSAP-transforms (kantelen, meebewegen) er niet mee botsen. ── */
  .js .onthul { --clay: cubic-bezier(.16, 1, .3, 1); opacity: 0; translate: 0 32px; scale: .93; transition: opacity 1s var(--clay), translate 1.2s var(--clay), scale 1.4s var(--clay); transition-delay: var(--vertraging, 0s); }
  .js .onthul.in { opacity: 1; translate: 0 0; scale: 1; }
  @media (prefers-reduced-motion: reduce) { .js .onthul { opacity: 1; translate: none; scale: none; transition: none; } }
  /* ── Dienstbeelden zoals Clay: staand 3:4, scherpe hoeken, aan de buitenrand van de kolom ── */
  .comp.foto { aspect-ratio: 3 / 4; border-radius: 0; box-shadow: none; }
  .dienst .dmedia { width: min(100%, 500px); justify-self: end; } .dienst.om .dmedia { justify-self: start; }
  .werkvlak { background: linear-gradient(160deg, #5a46e0, #3f2fb8); }
  .werkvlak .wk { position: absolute; border-radius: 1.6cqw; overflow: hidden; background: #fff; box-shadow: 0 6cqw 10cqw -4cqw rgba(16, 10, 70, .6); }
  .werkvlak .wk img { display: block; width: 100%; height: auto; }
  .werkvlak .wk1 { width: 150%; left: 16%; top: 12%; } .werkvlak .wk2 { width: 112%; left: -22%; top: 54%; }
  /* ── Diensten ── */
  .diensten2 { position: relative; overflow: hidden; }
  .dienst { --dgap: clamp(32px, 6vw, 96px); display: grid; grid-template-columns: 1fr 1.05fr; gap: var(--dgap); align-items: center; padding: clamp(48px, 7vw, 110px) 0; position: relative; }
  .dienst .dtekst, .dienst .dmedia { position: relative; z-index: 1; }
  .dienst.om .dtekst { order: 2; }
  .dmedia { will-change: transform; }
  .dtekst h3 { font-size: var(--h2); margin: 16px 0 18px; }
  .dtekst p { color: var(--grijs); margin: 0 0 24px; max-width: 46ch; }
  .dtekst ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr; gap: 12px; } /* onder elkaar: de staande beelden geven genoeg hoogte */
  .dtekst li { font-weight: var(--w-nadruk); font-size: 16px; padding-left: 20px; position: relative; }
  .dtekst li::before { content: ''; position: absolute; left: 0; top: .55em; width: 10px; height: 10px; background: currentColor; clip-path: polygon(0 0, 35% 0, 50% 55%, 65% 0, 100% 0, 50% 100%); }
  @media (max-width: 860px) { .dienst .dmedia, .dienst.om .dmedia { width: 100%; justify-self: stretch; } .comp.foto { aspect-ratio: 4 / 5; } .dienst { grid-template-columns: 1fr; } .dienst.om .dtekst { order: 0; } .vormen { width: 80%; height: 40%; top: auto; bottom: 10%; opacity: .7; } }

  /* ── Techniek ── */
  .tabel { border-top: 1px solid var(--lijn-n); }
  .rij { display: grid; grid-template-columns: minmax(160px, 1fr) 2fr 2.4fr; gap: 16px 32px; align-items: center; padding: 26px 0; border-bottom: 1px solid var(--lijn-n); }
  .rij h3 { font-size: 20px; } .rij p { margin: 0; color: var(--grijs-n); font-size: 16px; }
  .rij .logos { display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-end; }
  .tech { display: inline-flex; align-items: center; gap: 10px; border: 1px solid var(--lijn-n); border-radius: var(--r-pil); padding: 9px 16px 9px 12px; font-size: 14px; color: var(--maan); transition: background .25s, color .25s; }
  .tech svg { width: 18px; height: 18px; } .tech:hover { background: var(--maan); color: var(--nacht); }
  @media (max-width: 860px) { .rij { grid-template-columns: 1fr; } .rij .logos { justify-content: flex-start; } }

  /* ── Werkwijze: kleurrijke tijdlijn ── */
  section.werkwijze-sectie { padding-bottom: clamp(48px, 5vw, 72px); } /* section.blok uit vivo.css weegt zwaarder dan alleen de klasse */
  .werkwijze-sectie { position: relative; overflow: hidden;
    background: var(--papier); } /* wit, met onderaan een pastelgloed in de tijdlijnkleuren die weer naar wit uitfadet */
  .werkwijze-sectie::after { content: ''; position: absolute; left: -10%; right: -10%; bottom: 0; height: 56%; pointer-events: none; z-index: 0;
    background: radial-gradient(38% 42% at 18% 64%, rgba(79,110,245,.30), transparent 70%), radial-gradient(34% 40% at 50% 70%, rgba(139,92,246,.28), transparent 70%),
                radial-gradient(30% 38% at 82% 62%, rgba(31,184,116,.26), transparent 70%), radial-gradient(22% 26% at 66% 48%, rgba(255,122,69,.22), transparent 70%);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 30%, #000 62%, transparent 100%); mask-image: linear-gradient(to bottom, transparent 0%, #000 30%, #000 62%, transparent 100%); /* zacht in en uit: naadloos naar wit */
    filter: blur(10px); animation: noorderlicht 16s ease-in-out infinite alternate; }
  @keyframes noorderlicht { from { transform: translateX(-3%) scaleY(1); } to { transform: translateX(3%) scaleY(1.12); } }
  @media (prefers-reduced-motion: reduce) { .werkwijze-sectie::after { animation: none; } }
  .werkwijze-sectie > .w { position: relative; z-index: 1; }
  section.projecten { position: relative; background: var(--papier-2); padding-top: clamp(64px, 7vw, 112px); } /* lichtgrijs vlak zoals clay.global */
  /* geen extra gloed bovenin Projecten: de werkwijze fadet zelf naar wit */
  .projecten > .w { position: relative; }
  .werkwijze-sectie::before { content: ''; position: absolute; inset: 0; background: radial-gradient(40% 30% at 10% 20%, rgba(79,110,245,.10), transparent 70%), radial-gradient(40% 30% at 90% 45%, rgba(139,92,246,.10), transparent 70%), radial-gradient(40% 30% at 12% 70%, rgba(255,122,69,.10), transparent 70%), radial-gradient(40% 30% at 88% 92%, rgba(31,184,116,.12), transparent 70%); pointer-events: none; -webkit-mask-image: linear-gradient(to bottom, #000 78%, transparent 100%); mask-image: linear-gradient(to bottom, #000 78%, transparent 100%); }
  .tijdlijn { position: relative; padding: 20px 0 0; }
  .tlijn { position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
  .tlijn .basis { stroke: var(--lijn); stroke-width: 2; stroke-dasharray: 2 8; stroke-linecap: round; fill: none; }
  .tlijn .voortgang { stroke: url(#tlverloop); stroke-width: 4; fill: none; stroke-linecap: round; filter: drop-shadow(0 0 6px rgba(139,92,246,.35)); }
  .tkop { position: absolute; width: 18px; height: 18px; margin: -9px 0 0 -9px; border-radius: 50%; background: #4f6ef5; box-shadow: 0 0 0 6px color-mix(in srgb, var(--k, #4f6ef5) 22%, transparent), 0 0 28px 4px color-mix(in srgb, var(--k, #4f6ef5) 55%, transparent); z-index: 3; left: 0; top: 0; }
  .tpunt { --kleur: #4f6ef5; --tint: #e8edff; display: grid; grid-template-columns: 1fr 96px 1fr; align-items: center; gap: clamp(16px, 3vw, 40px); margin: 0 0 clamp(70px, 9vw, 120px); position: relative; z-index: 2; }
  ${KLEUR.map((k, i) => `.tpunt[data-i="${i}"] { --kleur: ${k}; --tint: ${TINT[i]}; }`).join(' ')}
  .tpunt:nth-last-of-type(2) { margin-bottom: 56px; } /* laatste stap (vóór het Live-label) */
  .tpunt .knoop { grid-column: 2; justify-self: center; width: 78px; height: 78px; border-radius: 50%; background: var(--papier); border: 1.5px solid var(--lijn); display: grid; place-items: center; color: var(--grijs); position: relative; transition: background .5s, color .5s, border-color .5s, box-shadow .5s; }
  .tpunt .knoop svg { width: 30px; height: 30px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .tpunt .knoop::after { content: ''; position: absolute; inset: -10px; border-radius: 50%; border: 2px solid var(--kleur); opacity: 0; transform: scale(.8); }
  .tpunt.aan .knoop { background: var(--kleur); color: #fff; border-color: var(--kleur); box-shadow: 0 14px 34px -8px var(--kleur); }
  .tpunt.aan .knoop::after { animation: puls 2s ease-out infinite; }
  @keyframes puls { 0% { opacity: .7; transform: scale(.85); } 100% { opacity: 0; transform: scale(1.6); } }
  .tkaart { background: rgba(255,255,255,.9); backdrop-filter: blur(8px); border: 1px solid var(--lijn); border-radius: var(--r); padding: clamp(20px, 2.4vw, 32px); box-shadow: 0 30px 60px -30px rgba(10,11,13,.18); position: relative; overflow: hidden; }
  .tkaart::before { content: ''; position: absolute; left: 0; top: 0; right: 0; height: 4px; background: var(--kleur); transform-origin: left; transform: scaleX(0); transition: transform .8s cubic-bezier(.2,.7,.2,1); }
  .tpunt.aan .tkaart::before { transform: scaleX(1); }
  .tpunt:nth-of-type(odd) .tkaart { grid-column: 1; grid-row: 1; } .tpunt:nth-of-type(odd) .tbeeld { grid-column: 3; grid-row: 1; }
  .tpunt:nth-of-type(even) .tkaart { grid-column: 3; grid-row: 1; } .tpunt:nth-of-type(even) .tbeeld { grid-column: 1; grid-row: 1; }
  .tkaart .duur { font-family: var(--mono); font-size: 12px; letter-spacing: var(--ls-label); text-transform: uppercase; color: var(--kleur); font-weight: 500; }
  .tkaart h3 { font-size: var(--h3); margin: 10px 0 10px; } .tkaart p { margin: 0; color: var(--grijs); }
  .tbeeld { background: radial-gradient(120% 100% at 20% 0%, #ffffff 0%, var(--tint) 100%); border-radius: var(--r); padding: 6%; box-shadow: 0 40px 70px -40px var(--kleur); }
  .tbeeld .illu { width: 100%; display: block; overflow: visible; }
  .tmark { display: flex; justify-content: center; position: relative; z-index: 4; margin-bottom: 56px; } /* boven de lichtgevende kop van de lijn */
  .tmark span { font-family: var(--mono); font-size: 12px; letter-spacing: var(--ls-label); text-transform: uppercase; background: #e8edff; color: #3346b8; border: 1px solid #c9d3ff; border-radius: var(--r-pil); padding: 10px 18px; }
  .tmark.eind { margin-bottom: 0; } /* geen extra lucht onder Live: compactere overgang naar Projecten */
  .tmark.eind span { background: #1fb874; color: #fff; border-color: #1fb874; box-shadow: 0 12px 30px -8px #1fb874; }
  @media (max-width: 860px) {
    .tpunt { grid-template-columns: 64px 1fr; } .tpunt .knoop { grid-column: 1 !important; grid-row: 1; width: 56px; height: 56px; }
    .tpunt .tkaart { grid-column: 2 !important; grid-row: 1 !important; } .tpunt .tbeeld { grid-column: 2 !important; grid-row: 2 !important; }
    .tmark { justify-content: flex-start; }
  }

  /* ── Cases ── */
  .vwerk { display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(44px, 6vw, 96px) clamp(20px, 4vw, 64px); }
  .vwerk .case:nth-child(even) { margin-top: clamp(80px, 14vw, 220px); }
  .vwerk .vlak { aspect-ratio: 5 / 4; overflow: hidden; transform-origin: 0% 100%; will-change: transform; }
  .glas { position: relative; overflow: hidden; background: #fff; }
  .glas img.site { width: 100%; height: auto; display: block; will-change: transform; }
  .glas img.dia { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top left; }
  .vlak.modus-scherm { display: grid; place-items: center; }
  .scherm-kaart { width: 86%; aspect-ratio: 1972 / 1150; border-radius: 12px; overflow: hidden; box-shadow: 0 50px 90px -30px rgba(0, 0, 0, .6), 0 0 0 1px rgba(255, 255, 255, .1); will-change: transform; } /* zelfde verhouding als de schermen: niets valt weg */
  .scherm-kaart .glas { width: 100%; height: 100%; }
  .glas.vol { position: absolute; inset: 0; transform-origin: 50% 0; background: var(--case); }
  .glas.vol img.site { min-height: 100%; object-fit: cover; object-position: top center; } /* startbeeld vult het vlak; de lange pagina scrolt daarna */
  .tablet { position: absolute; left: 12%; top: 14%; width: 76%; aspect-ratio: 4 / 3; border-radius: 22px; background: #0b0c0f; padding: 10px; box-shadow: 0 40px 80px rgba(0,0,0,.35); transform-origin: 50% 50%; will-change: transform; }
  .tablet .glas { width: 100%; height: 100%; border-radius: 13px; }
  .browser { position: absolute; left: 9%; top: 11%; width: 82%; height: 80%; border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 40px 80px -20px rgba(0,0,0,.3); display: flex; flex-direction: column; will-change: transform; }
  .browser .balk { height: 24px; background: #eceef1; display: flex; gap: 6px; align-items: center; padding: 0 12px; flex: none; } .browser .balk i { width: 8px; height: 8px; border-radius: 50%; background: #c9ccd2; }
  .browser .glas { flex: 1; }
  .vwerk .tel { position: absolute; right: 7%; bottom: 8%; width: 18%; border-radius: 18px; padding: 5px; background: #0b0c0f; box-shadow: 0 20px 40px rgba(0,0,0,.35); z-index: 2; } .vwerk .tel img { border-radius: 13px; aspect-ratio: 390/844; object-fit: cover; object-position: top; }
  .hint { position: absolute; right: 16px; top: 16px; z-index: 3; font-family: var(--mono); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; background: rgba(255,255,255,.9); color: var(--inkt); padding: 6px 10px; border-radius: var(--r-pil); transition: opacity .3s; }
  .case:hover .hint { opacity: 0; } .alleen-touch { display: none; } @media (hover: none) { .hint, .alleen-hover { display: none; } .alleen-touch { display: inline; } }
  @media (max-width: 760px) { .vwerk { grid-template-columns: 1fr; } .vwerk .case:nth-child(even) { margin-top: 0; } }
  /* ── Donkere afsluiter met bewegend beeld ── */
  .afsluiter { position: relative; overflow: hidden; padding: clamp(110px, 14vw, 220px) 0 40px; border-top: 1px solid var(--lijn-n); }
  .lus3d { position: absolute; width: min(60vw, 880px); aspect-ratio: 1; right: -18%; top: 50%; translate: 0 -50%; z-index: 0; pointer-events: none; }
  .afsl-raster { display: grid; grid-template-columns: 1fr 1.4fr; gap: 32px; max-width: 640px; margin-top: clamp(80px, 10vw, 140px); padding-top: 32px; border-top: 1px solid var(--lijn-n); }
  .afsl-raster nav, .afsl-raster div { display: flex; flex-direction: column; gap: 8px; color: var(--grijs-n); } .afsl-raster a { text-decoration: none; color: var(--maan); }
  .afsl-raster .kopje { color: var(--maan); font-weight: 600; margin-top: 10px; } .afsl-raster .kopje:first-child { margin-top: 0; }
  .afsl-onder { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-top: 56px; color: var(--grijs-n); font-size: 14px; } .afsl-onder span { display: flex; gap: 20px; } .afsl-onder a { color: inherit; }
  @media (max-width: 860px) { .lus3d { width: 130vw; right: -55%; top: 30%; opacity: .8; } .afsl-raster { grid-template-columns: 1fr; } }
  .lus-donker { position: absolute; width: min(110vw, 1500px); right: -24%; top: 50%; translate: 0 -50%; pointer-events: none; will-change: transform; }
  .afsluiter .w { position: relative; z-index: 1; }
  .afsluiter h2 { font-size: var(--h1); max-width: 13ch; margin: 20px 0 40px; }
  .afsluiter .knoppen { display: flex; flex-wrap: wrap; gap: 16px 28px; align-items: center; }
  @media (max-width: 860px) { .lus-donker { width: 170vw; right: -70%; opacity: .7; } }
  /* ── Afsluiting (Clay "Let's talk") ── */
  .praat { position: relative; overflow: hidden; background: var(--papier-2); padding: clamp(110px, 13vw, 190px) 0 36px; }
  .lus { position: absolute; width: min(120vw, 1650px); left: -22%; top: -8%; pointer-events: none; opacity: .95; will-change: transform; }
  .praat-raster { position: relative; display: grid; grid-template-columns: 1.4fr .6fr 1fr; gap: 40px; align-items: start; }
  .praat-kop h2 { font-size: clamp(56px, 9vw, 140px); line-height: .95; letter-spacing: -.045em; margin: 0 0 28px; }
  .praat-mail { display: inline-block; font-size: clamp(22px, 2.4vw, 34px); letter-spacing: -.02em; text-decoration: none; border-bottom: 1.5px solid currentColor; margin-bottom: 28px; }
  .praat-kop .pil { display: table; }
  .praat-nav { display: flex; flex-direction: column; gap: 10px; font-size: clamp(20px, 2vw, 28px); } .praat-nav a { text-decoration: none; border-bottom: 1px solid var(--lijn); align-self: flex-start; }
  .praat-info { display: flex; flex-direction: column; gap: 6px; color: var(--grijs); } .praat-info .kopje { color: var(--inkt); font-weight: 600; margin-top: 14px; } .praat-info .kopje:first-child { margin-top: 0; }
  .praat-onder { position: relative; display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap; margin-top: clamp(80px, 10vw, 140px); color: var(--grijs); font-size: 14px; } .praat-onder span { display: flex; gap: 20px; } .praat-onder a { color: inherit; }
  @media (max-width: 860px) { .praat-raster { grid-template-columns: 1fr; } .lus { width: 180vw; left: -60%; top: 10%; } }
  .noot { position: fixed; left: 50%; bottom: 14px; transform: translateX(-50%); z-index: 60; font: 12px/1.4 system-ui, sans-serif; background: rgba(20,20,20,.88); color: #eee; padding: 8px 14px; border-radius: 100px; }
`;
const KOP = (thuis = '') => `<a class="overslaan" href="#inhoud">Direct naar de inhoud</a>
<header class="kop"><div class="w"><a class="logo morf" href="${thuis || '#'}" aria-label="ViVo — naar boven"><span class="lm-merk">${logo('vivo-beeldmerk')}</span><span class="lm-woord">${logo('vivo-woordmerk')}</span></a><nav><span class="nav-pil" aria-hidden="true"></span><a href="${thuis}#diensten">Diensten</a><a href="${thuis}#techniek">Techniek</a><a href="${thuis}#werkwijze">Werkwijze</a><a href="${thuis}#projecten">Projecten</a><a href="over.html">Over</a></nav><a class="pil" href="contact.html">Contact</a><button class="menuknop" type="button" aria-label="Menu openen" aria-expanded="false" aria-controls="menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h18M8 15h13" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></button></div></header>
<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu">
  <div class="boven">${logo('vivo-horizontaal', 'logo-svg')}<button class="menuknop" type="button" aria-label="Menu sluiten" data-sluit><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></button></div>
  <ul>${[['Diensten', thuis + '#diensten'], ['Techniek', thuis + '#techniek'], ['Werkwijze', thuis + '#werkwijze'], ['Projecten', thuis + '#projecten'], ['Over ViVo', 'over.html'], ['Contact', 'contact.html']].map(([t, h]) => `<li><a href="${h}" data-sluit>${t}</a></li>`).join('')}</ul>
  <p class="onder">Een website laten maken?<br><a href="mailto:info@vivoproducts.nl">info@vivoproducts.nl</a> · <a href="tel:+31628702422">06-28702422</a></p>
</div>`;
const AFSLUITER = (thuis = '') => `<footer class="afsluiter donker" id="contact" aria-labelledby="afsluiter-kop">
  <img class="lus-donker" src="../beelden/vormen/lus-donker.webp" alt="" aria-hidden="true" width="1000" height="565" loading="lazy" decoding="async">
  <div class="w">
    <span class="label">Contact</span><h2 id="afsluiter-kop">Klaar voor een website die werkt?</h2>
    <div class="knoppen"><a class="pil" href="mailto:info@vivoproducts.nl?subject=Kennismaking%20ViVo">Plan een kennismaking</a><a class="cirkel" href="mailto:info@vivoproducts.nl"><span class="rond">${pijl}</span>info@vivoproducts.nl</a></div>
    <div class="afsl-raster">
      <nav aria-label="Footer"><a href="${thuis}#diensten">Diensten</a><a href="${thuis}#techniek">Techniek</a><a href="${thuis}#werkwijze">Werkwijze</a><a href="${thuis}#projecten">Projecten</a><a href="over.html">Over ViVo</a><a href="contact.html">Contact</a></nav>
      <div><span class="kopje">Bezoekadres</span><span>Einsteinstraat 3e<br>4207 HW Gorinchem</span><span class="kopje">Contact</span><a href="tel:+31628702422">06-28702422</a><a href="mailto:info@vivoproducts.nl">info@vivoproducts.nl</a><span class="kopje">KvK</span><span>80912532</span></div>
    </div>
    <div class="afsl-onder"><small>© 2026 ViVo Products</small><span><a href="../docs/privacy/">Privacy</a><a href="../docs/voorwaarden/">Voorwaarden</a></span></div>
  </div>
</footer>`;


// ── Menu-pil (gedeeld): gevuld boven het item onder de muis; omlijnd in rust op het onderdeel waar je bent ──
const NAV_JS = `
  const navEl = document.querySelector('.kop nav'), navPil = navEl.querySelector('.nav-pil'), navLinks = [...navEl.querySelectorAll('a')];
  let navActief = null;
  const plaatsPil = (a, rust) => {
    if (!a) { navPil.style.opacity = '0'; return; }
    const verborgen = navPil.style.opacity !== '1';
    if (verborgen) navPil.classList.add('direct');
    navPil.classList.toggle('rust', rust);
    navPil.style.width = a.offsetWidth + 'px'; navPil.style.transform = 'translateX(' + a.offsetLeft + 'px)'; navPil.style.opacity = '1';
    if (verborgen) { navPil.offsetWidth; navPil.classList.remove('direct'); }
  };
  const terug = () => plaatsPil(navActief, true);
  navLinks.forEach(a => { a.addEventListener('pointerenter', () => plaatsPil(a, false)); a.addEventListener('focus', () => plaatsPil(a, false)); a.addEventListener('blur', terug); });
  navEl.addEventListener('pointerleave', terug);
  const zetActief = a => { if (a === navActief) return; navLinks.forEach(l => l === a ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current')); navActief = a; if (!navEl.matches(':hover')) terug(); };
  const eigen = navLinks.find(a => !a.hash && a.href.split('#')[0] === location.href.split('#')[0]);
  if (eigen) zetActief(eigen);
  else if (document.querySelector('.chero')) zetActief(navLinks.find(a => a.hash === '#projecten')); // case-pagina's horen bij Projecten
  else {
    // Homepage: het onderdeel dat de middenlijn van het scherm raakt is actief; in de hero en bij Contact geen pil
    const secties = navLinks.map(a => [a, document.getElementById(a.hash.slice(1))]).filter(([, s]) => s);
    const kijker = new IntersectionObserver(items => items.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) zetActief((secties.find(([, s]) => s === target) || [null])[0]);
      else if (navActief && navActief.hash === '#' + target.id) zetActief(null);
    }), { rootMargin: '-50% 0px -50% 0px' });
    secties.forEach(([, s]) => kijker.observe(s));
  }
  addEventListener('resize', terug);`;

// ── Over ViVo: kennismaking op de homepage + eigen pagina ──
const OVER_CSS = `
  .over-teaser { padding: var(--sectie) 0; }
  .over-teaser .w { display: grid; grid-template-columns: minmax(0, .7fr) minmax(0, 1.3fr); gap: clamp(32px, 6vw, 96px); align-items: center; }
  .over-teaser img { width: 100%; height: auto; display: block; border-radius: var(--r); }
  .over-teaser h2 { font-size: var(--h2); margin: 16px 0 20px; max-width: 16ch; }
  .over-teaser p { color: var(--grijs); font-size: clamp(18px, 1.5vw, 21px); max-width: 46ch; margin: 0 0 28px; }
  .ohero { padding: calc(var(--kop-hoogte) + clamp(40px, 6vw, 96px)) 0 clamp(64px, 8vw, 120px); }
  .ohero .w { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, .8fr); gap: clamp(32px, 6vw, 96px); align-items: end; }
  .ohero h1 { font-size: clamp(44px, 6vw, 96px); margin: 22px 0 24px; }
  .ohero .intro { font-size: clamp(20px, 1.9vw, 28px); line-height: 1.4; letter-spacing: -.012em; margin: 0; max-width: 30ch; }
  .ohero img { width: 100%; height: auto; display: block; border-radius: var(--r); }
  .overhaal { padding: 0 0 var(--sectie); }
  .overhaal .w { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr); gap: 24px clamp(32px, 6vw, 96px); border-top: 1px solid var(--lijn); padding-top: clamp(40px, 5vw, 72px); }
  .overhaal p { font-size: clamp(18px, 1.5vw, 21px); line-height: 1.6; margin: 0 0 20px; max-width: 58ch; } .overhaal p:last-child { margin-bottom: 0; }
  .owaarden { background: var(--nacht); color: var(--maan); padding: clamp(64px, 8vw, 112px) 0; }
  .owaarden .raster { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(28px, 4vw, 56px); margin-top: clamp(32px, 4vw, 48px); }
  .owaarden h3 { font-size: var(--h3); margin: 14px 0 12px; } .owaarden p { color: var(--grijs-n); margin: 0; font-size: 17px; line-height: 1.6; }
  @media (max-width: 860px) { .over-teaser .w, .ohero .w, .overhaal .w, .owaarden .raster { grid-template-columns: 1fr; } .over-teaser img, .ohero img { max-width: 420px; } }`;

// ── Tweede cursor (Baunfire): cirkel die de muis volgt en groeit boven knoppen, links en beelden. Alleen met muis. ──
const CURSOR_CSS = `
  .muiscirkel { position: fixed; left: 0; top: 0; z-index: 200; width: 8px; height: 8px; margin: -4px 0 0 -4px; border-radius: 50%; border: 1.5px solid transparent; background-color: #fff; mix-blend-mode: difference; pointer-events: none; opacity: 0; transition: opacity .3s, width .4s cubic-bezier(.16, 1, .3, 1), height .4s cubic-bezier(.16, 1, .3, 1), margin .4s cubic-bezier(.16, 1, .3, 1), background-color .3s, border-color .3s, scale .2s; }
  .muiscirkel.zichtbaar { opacity: 1; }
  .muiscirkel.groot { width: 36px; height: 36px; margin: -18px 0 0 -18px; background-color: transparent; border-color: #fff; } /* variant A (keuze Thomas): stip → dunne ring */
  .muiscirkel.klik { scale: .7; }
  @media (hover: none), (pointer: coarse) { .muiscirkel { display: none; } }`;
const CURSOR_JS = `
  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const cur = document.createElement('div'); cur.className = 'muiscirkel'; cur.setAttribute('aria-hidden', 'true'); document.body.appendChild(cur);
    const naarX = gsap.quickTo(cur, 'x', { duration: 0.3, ease: 'power3' }), naarY = gsap.quickTo(cur, 'y', { duration: 0.3, ease: 'power3' });
    addEventListener('pointermove', e => { naarX(e.clientX); naarY(e.clientY); cur.classList.add('zichtbaar'); }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => cur.classList.remove('zichtbaar'));
    const GROOT = 'a, button, label, .case, .comp, .ctoestel, .doorkijk, .cvenster, .tech';
    document.addEventListener('pointerover', e => cur.classList.toggle('groot', !!e.target.closest(GROOT)));
    addEventListener('pointerdown', () => cur.classList.add('klik')); addEventListener('pointerup', () => cur.classList.remove('klik'));
  }`;

const html = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ViVo — motion-preview v11</title>
<script>document.documentElement.classList.add('js'); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('intro')</script>
<link rel="stylesheet" href="../docs/css/vivo.css">
<style>
${CSS}
${CURSOR_CSS}
${OVER_CSS}
</style>
</head>
<body>
${KOP()}

<main id="inhoud">
<section class="mhero" aria-labelledby="hero-kop">
  <div class="podium" aria-hidden="true"><div class="ring"></div><div class="letters">${logo('vivo-woordmerk')}</div></div>
  <div class="intro-wit" aria-hidden="true"><div class="letters">${logo('vivo-woordmerk')}</div></div>
  <div class="chev3d" aria-hidden="true"><div class="draai"><div class="zweef">${chevron3d()}</div></div></div>
  <div class="stip-groep" style="left:44%;top:22%" aria-hidden="true">${'<i></i>'.repeat(10)}</div>
  <div class="w inhoud"><div class="tekst">
    <span class="label">ViVo · webdesign &amp; development</span>
    <h1 id="hero-kop">Websites die werken.</h1>
    <p>ViVo ontwerpt en bouwt snelle, heldere websites, webshops en webapps voor ondernemers die gevonden willen worden.</p>
    <a class="cirkel" href="#projecten"><span class="rond">${pijl}</span>Bekijk ons werk</a>
  </div></div>
  <a class="scrollcue" href="#diensten" aria-label="Scroll naar de diensten"><span class="lijn"><i></i></span><span class="woord">Scroll</span></a>
</section>

<section class="blok diensten2" id="diensten" aria-labelledby="diensten-kop">
  <div class="w">
    <div class="sectiekop"><div><span class="label">Wat we doen</span><h2 id="diensten-kop">Van merk tot hosting</h2></div><p>Alles voor een sterke online aanwezigheid, onder één dak — van eerste schets tot de site die live staat.</p></div>
    ${DIENSTEN.map(dienst).join('\n    ')}
  </div>
</section>

<section class="blok donker" id="techniek" aria-labelledby="techniek-kop">
  <div class="w">
    <div class="sectiekop"><div><span class="label">Techniek</span><h2 id="techniek-kop">Waarop we bouwen</h2></div><p>Bewezen, moderne technieken — gekozen op snelheid, veiligheid en gemak in beheer.</p></div>
    <div class="tabel">${TECHNIEK.map(([t, p, ks]) => `<div class="rij"><h3>${t}</h3><p>${p}</p><div class="logos">${ks.map(icoon).join('')}</div></div>`).join('')}</div>
  </div>
</section>

<section class="blok werkwijze-sectie" id="werkwijze" aria-labelledby="werkwijze-kop">
  <div class="w">
    <div class="sectiekop"><div><span class="label">Werkwijze</span><h2 id="werkwijze-kop">Van idee tot live</h2></div><p>Vier heldere stappen, met één vast aanspreekpunt van begin tot eind.</p></div>
    <div class="tijdlijn">
      <svg class="tlijn" aria-hidden="true"><defs><linearGradient id="tlverloop" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1000">${KLEUR.map((k, i) => `<stop offset="${(0.12 + i * 0.26).toFixed(2)}" stop-color="${k}"/>`).join('')}</linearGradient></defs><path class="basis"/><path class="voortgang"/></svg><span class="tkop" aria-hidden="true"></span>
      <div class="tmark start"><span>Jouw idee</span></div>
      ${STAPPEN.map((s, i) => `<div class="tpunt" data-i="${i}"><span class="knoop" aria-hidden="true"><svg viewBox="0 0 24 24">${ICOON[s.icoon]}</svg></span><div class="tkaart"><span class="duur">0${i + 1} · ${s.duur}</span><h3>${s.titel}</h3><p>${s.tekst}</p></div><div class="tbeeld" aria-hidden="true">${ILLU[i]}</div></div>`).join('\n      ')}
      <div class="tmark eind"><span>Live</span></div>
    </div>
  </div>
</section>

<section class="blok projecten" id="projecten" aria-labelledby="werk-kop">
  <div class="w">
    <div class="sectiekop"><div><span class="label">Uitgelicht werk</span><h2 id="werk-kop">Recente projecten</h2></div><p><span class="alleen-hover">Beweeg over een project: de site komt tot leven.</span><span class="alleen-touch">Elk project krijgt zijn eigen kleur — net als de merken waarvoor ViVo bouwt.</span></p></div>
    <div class="vwerk">${CASES.map(kaart).join('')}</div>
  </div>
</section>

<section class="over-teaser" aria-labelledby="over-teaser-kop">
  <div class="w">
    <img src="../beelden/over/thomas.webp" alt="Thomas, oprichter van ViVo" width="896" height="1120" loading="lazy" decoding="async">
    <div><span class="label">Achter ViVo</span><h2 id="over-teaser-kop">Eén vast aanspreekpunt, van idee tot live.</h2><p>Ik ben Thomas. Ik ontwerp en bouw je website zelf, denk mee over je merk en blijf daarna bereikbaar voor onderhoud en doorontwikkeling.</p><a class="link" href="over.html">Lees mijn verhaal ${pijl}</a></div>
  </div>
</section>
</main>
${AFSLUITER()}
<div class="noot">Motion-preview v11 · niet live</div>

<script type="importmap">{ "imports": { "three": "../node_modules/three/build/three.module.js", "three/addons/": "../node_modules/three/examples/jsm/" } }</script>
<script src="../docs/js/vivo.js" defer></script>
<script type="module">
  // three.js pas laden als de 3D-vormen (diensten) bijna in beeld komen: de hero laadt sneller
  const eersteVorm = document.querySelector('.vorm-3d');
  if (eersteVorm) {
    let klaar = false; const laad = () => { if (!klaar) { klaar = true; k.disconnect(); import('../site/drie.js'); } };
    const k = new IntersectionObserver(([e]) => { if (e.isIntersecting) laad(); }, { rootMargin: '0px' }); k.observe(eersteVorm);
    addEventListener('load', () => setTimeout(laad, 1500)); // of kort na het laden van de pagina, wat eerder komt
  }
</script>
<script src="../node_modules/gsap/dist/gsap.min.js"></script>
<script src="../node_modules/gsap/dist/ScrollTrigger.min.js"></script>
<script>
  const rustig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const muis = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const KLEUR = ${JSON.stringify(KLEUR)};
  gsap.registerPlugin(ScrollTrigger);

  // ── Onthullen: eenmalig, zodra het beeld in beeld komt én geladen is (anders fadet een leeg vlak in) ──
  document.querySelectorAll('.vwerk .onthul').forEach((el, i) => el.style.setProperty('--vertraging', (i % 2) * 0.12 + 's'));
  const onthulKijker = new IntersectionObserver(items => items.forEach(({ isIntersecting, target }) => {
    if (!isIntersecting) return;
    onthulKijker.unobserve(target);
    const img = target.querySelector('img');
    Promise.resolve(img && !img.complete ? img.decode().catch(() => {}) : null).then(() => target.classList.add('in'));
  }), { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.onthul').forEach(el => rustig ? el.classList.add('in') : onthulKijker.observe(el));
  document.querySelectorAll('.stip-groep i').forEach((el, i) => { el.innerHTML = '<svg viewBox="0 0 100 100"><polyline points="8,16 50,86 92,16" fill="none" stroke="currentColor" stroke-width="16"/></svg>'; if (i % 5 === 2) el.style.color = 'var(--maan)'; });

  // ── Tijdlijn: pad door de knooppunten (organische S-bochten) + kleurverloop over de hoogte ──
  const tl = document.querySelector('.tijdlijn'), svg = tl.querySelector('.tlijn'), basis = svg.querySelector('.basis'), voortgang = svg.querySelector('.voortgang'), kop = tl.querySelector('.tkop');
  function tekenPad() {
    const r0 = tl.getBoundingClientRect();
    const els = [...tl.querySelectorAll('.tmark span, .tpunt .knoop')];
    const punten = els.map((el, i) => { const r = el.getBoundingClientRect(), x = r.left + r.width / 2 - r0.left;
      if (i === 0) return [x, r.bottom - r0.top + 4];                // start: net onder "Jouw idee"
      if (i === els.length - 1) return [x, r.top - r0.top - 14];      // eind: net boven "Live"
      return [x, r.top + r.height / 2 - r0.top]; });
    let d = 'M' + punten[0].join(' ');
    for (let i = 1; i < punten.length; i++) {
      const [x0, y0] = punten[i - 1], [x1, y1] = punten[i], dy = (y1 - y0) / 2, zwaai = innerWidth > 860 ? (i % 2 ? 90 : -90) : 0;
      d += ' C' + (x0 + zwaai) + ' ' + (y0 + dy) + ' ' + (x1 + zwaai) + ' ' + (y1 - dy) + ' ' + x1 + ' ' + y1;
    }
    svg.setAttribute('viewBox', '0 0 ' + r0.width + ' ' + r0.height);
    svg.querySelector('#tlverloop').setAttribute('y2', r0.height);
    basis.setAttribute('d', d); voortgang.setAttribute('d', d);
    const len = voortgang.getTotalLength();
    voortgang.style.strokeDasharray = len; voortgang.style.strokeDashoffset = len;
    return len;
  }
  let lengte = tekenPad();

  if (!rustig) {
    // ── Hero ──
    // Chevron: bij laden recht en plat naar voren; pas bij scrollen draait hij in 3D (scroll-tween hieronder)
    gsap.set('.mhero .draai', { rotateY: 0, rotateX: 0 });
    gsap.to('.chev3d .zweef', { y: -8, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    const hero = { trigger: '.mhero', start: 'top top', end: 'bottom top', scrub: 0.6 };
    gsap.to('.letters', { yPercent: -28, ease: 'none', scrollTrigger: hero });
    gsap.to('.ring', { scale: 1.25, rotate: 25, ease: 'none', scrollTrigger: hero });
    gsap.to('.mhero .draai', { rotateY: 160, rotateX: -18, scale: 1.15, ease: 'none', scrollTrigger: hero });
    gsap.to('.mhero .tekst', { y: -60, opacity: 0.2, ease: 'none', scrollTrigger: { ...hero, start: '20% top' } });
    gsap.to('.scrollcue', { opacity: 0, y: 20, ease: 'none', scrollTrigger: { trigger: '.mhero', start: 'top top', end: '15% top', scrub: true } });
    // ── Intro: wit → donker vlak schuift van links naar rechts → label letter voor letter → kop woord voor woord ──
    const label = document.querySelector('.mhero .label'), kopH1 = document.querySelector('.mhero h1');
    label.setAttribute('aria-label', label.textContent); kopH1.setAttribute('aria-label', kopH1.textContent);
    label.innerHTML = '<span aria-hidden="true">' + [...label.textContent].map(c => '<span class="lt">' + (c === ' ' ? '&nbsp;' : c) + '</span>').join('') + '</span>'; // één binnenrij: het label is een flexbox met gap
    kopH1.innerHTML = kopH1.textContent.split(' ').map(w => '<span class="w-r" aria-hidden="true"><span>' + w + '</span></span>').join(' ');
    const intro = gsap.timeline({ defaults: { ease: 'power4.out' }, onComplete: () => document.documentElement.classList.remove('intro') });
    intro.to('.intro-wit', { clipPath: 'inset(0 0 0 100%)', duration: 1.3, ease: 'expo.inOut', delay: 0.35 })
      .from('.mhero .label .lt', { opacity: 0, duration: 0.5, stagger: 0.035, ease: 'none' }, '-=0.35')
      .from('.mhero h1 .w-r > span', { yPercent: 110, duration: 1.1, stagger: 0.09 }, '<0.1')
      .from('.mhero .tekst > p, .mhero .tekst > .cirkel', { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, '<0.45')
      .from('.chev3d', { opacity: 0, scale: 0.8, duration: 1.4 }, '<')
      .from('.ring', { opacity: 0, duration: 1.6 }, '<')
      .from('.scrollcue', { opacity: 0, y: -10, duration: 1 }, '<0.5');

    // ── Diensten: beelden bewegen organisch mee (eigen tempo), zachte vormen zweven en draaien op de achtergrond ──
    gsap.utils.toArray('.dienst').forEach((d, i) => {
      const st = { trigger: d, start: 'top bottom', end: 'bottom top', scrub: 0.9 };
      const tempo = [0.7, 1.5, 1, 1.7, 0.8, 1.3][i % 6];
      gsap.fromTo(d.querySelector('.dmedia'), { y: 90 * tempo, x: (i % 2 ? -1 : 1) * 14 }, { y: -90 * tempo, x: (i % 2 ? 1 : -1) * 14, ease: 'none', scrollTrigger: st });
      d.querySelectorAll('.comp > [data-d]').forEach(el => { const k = +el.dataset.d; gsap.fromTo(el, { y: k * 26 }, { y: -k * 26, ease: 'none', scrollTrigger: st }); });
      d.querySelectorAll('.comp .k3').forEach((k, j) => gsap.to(k, { rotateY: '+=' + (j % 2 ? -140 : 140), rotateX: '+=30', ease: 'none', scrollTrigger: st }));
      d.querySelectorAll('.lijnen path').forEach(p => { const l = p.getTotalLength(); gsap.fromTo(p, { strokeDasharray: l, strokeDashoffset: l }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: d, start: 'top 75%', end: 'center center', scrub: 0.6 } }); });
      // de 3D-vorm draait zelf (site/drie.js), constant en langzaam — los van het scrollen
      gsap.from(d.querySelectorAll('.dtekst > *, .dtekst li'), { y: 24, opacity: 0, duration: 0.7, stagger: 0.05, ease: 'power3.out', scrollTrigger: { trigger: d, start: 'top 75%' } });
    });
    gsap.to('.lus-donker', { rotate: -10, x: -60, y: 30, scale: 1.08, duration: 18, ease: 'sine.inOut', yoyo: true, repeat: -1 }); // donkere lus: constant, langzaam (v6)
    gsap.from('.afsluiter .w > :not(.afsl-onder)', { y: 30, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.afsluiter', start: 'top 75%' } });
    gsap.from('.rij', { y: 30, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.tabel', start: 'top 80%' } });

    // ── Werkwijze: lijn tekent mee in kleur, kop volgt en kleurt mee, punten lichten op ──
    const kleurOp = gsap.utils.interpolate(KLEUR);
    const plaatsKop = () => {
      const af = lengte - (parseFloat(voortgang.style.strokeDashoffset) || 0), p = voortgang.getPointAtLength(af), k = kleurOp(Math.min(1, af / lengte));
      gsap.set(kop, { x: p.x, y: p.y, backgroundColor: k, '--k': k }); // gloed kleurt mee via --k
    };
    gsap.to(voortgang, { strokeDashoffset: 0, ease: 'none', onUpdate: plaatsKop, scrollTrigger: { trigger: tl, start: 'top 60%', end: 'bottom 60%', scrub: 0.5, invalidateOnRefresh: true, onRefresh: () => { lengte = tekenPad(); plaatsKop(); } } });
    plaatsKop();
    const ILLU_TL = [
      s => gsap.timeline().from(s.querySelectorAll('.b1'), { opacity: 0, x: -24, duration: 0.45, stagger: 0.04 }).from(s.querySelectorAll('.b2'), { opacity: 0, x: 24, duration: 0.45, stagger: 0.04 }, '+=0.15').from(s.querySelector('.b3'), { opacity: 0, y: 10, duration: 0.3 }, '+=0.15').to(s.querySelectorAll('.stip'), { y: -5, duration: 0.3, stagger: 0.12, yoyo: true, repeat: 5 }).from(s.querySelector('.hart'), { scale: 0, transformOrigin: '230px 176px', duration: 0.5, ease: 'back.out(3)' }, '-=1.2'),
      s => gsap.timeline().from(s.querySelectorAll('.w'), { scaleX: 0, transformOrigin: 'left center', duration: 0.35, stagger: 0.15 }).from(s.querySelectorAll('.w2'), { opacity: 0, y: 14, scale: 0.9, duration: 0.35, stagger: 0.08, ease: 'back.out(2)' }, '-=0.1').to(s.querySelectorAll('.palet circle'), { attr: { r: 6 }, duration: 0.3, stagger: 0.08, ease: 'back.out(3)' }, '-=0.2').from(s.querySelector('.kader'), { opacity: 0, scale: 1.1, transformOrigin: '161px 151px', duration: 0.3 }).fromTo(s.querySelector('.cursor'), { x: 290, y: 190 }, { x: 160, y: 150, duration: 1, ease: 'power2.inOut' }, 0.3),
      s => gsap.timeline().from(s.querySelectorAll('.code'), { scaleX: 0, transformOrigin: 'left center', duration: 0.2, stagger: 0.09 }).from(s.querySelectorAll('.term'), { opacity: 0, y: 8, duration: 0.3 }).from(s.querySelector('.vinkbol'), { scale: 0, transformOrigin: '268px 150px', duration: 0.4, ease: 'back.out(3)' }).to(s.querySelector('.vinkje'), { strokeDashoffset: 0, duration: 0.35 }),
      s => gsap.timeline().to(s.querySelector('.laad'), { attr: { width: 260 }, duration: 1, ease: 'power1.inOut' }).to(s.querySelector('.live'), { opacity: 1, duration: 0.3 }).from(s.querySelector('.live'), { scale: 0.6, transformOrigin: '160px 92px', duration: 0.4, ease: 'back.out(3)' }, '<').to(s.querySelectorAll('.confetti rect'), { opacity: 1, y: () => gsap.utils.random(-30, -12), x: () => gsap.utils.random(-14, 14), rotate: () => gsap.utils.random(-90, 90), duration: 0.6, stagger: 0.04, ease: 'power2.out' }, '<').to(s.querySelectorAll('.confetti rect'), { opacity: 0, duration: 0.6 }, '>0.3').to(s.querySelector('.groei'), { strokeDashoffset: 0, duration: 1 }, '-=1').to(s.querySelector('.vlakg'), { opacity: 1, duration: 0.6 }, '-=0.5'),
    ];
    gsap.utils.toArray('.tpunt').forEach((p, i) => {
      const anim = ILLU_TL[i](p.querySelector('.tbeeld')).pause();
      gsap.from(p.querySelector('.tkaart'), { x: i % 2 ? 60 : -60, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 75%' } });
      gsap.from(p.querySelector('.tbeeld'), { x: i % 2 ? -60 : 60, opacity: 0, rotate: i % 2 ? -3 : 3, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 75%' } });
      ScrollTrigger.create({ trigger: p.querySelector('.knoop'), start: 'center 60%', onEnter: () => { p.classList.add('aan'); anim.restart(); gsap.fromTo(p.querySelector('.knoop'), { scale: 0.8 }, { scale: 1, duration: 0.7, ease: 'back.out(3)' }); }, onLeaveBack: () => p.classList.remove('aan') });
    });

    // ── Cases: elk een eigen weergave ──
    gsap.utils.toArray('.speel').forEach((kaartEl, i) => {
      const vlak = kaartEl.querySelector('.vlak'), modus = kaartEl.dataset.modus;
      const tablet = kaartEl.querySelector('.tablet'), browser = kaartEl.querySelector('.browser'), glas = kaartEl.querySelector('.glas');
      const site = kaartEl.querySelector('img.site'), dias = kaartEl.querySelectorAll('img.dia'), tel = kaartEl.querySelector('.tel');
      const tempo = (i % 2 ? 1.6 : 0.6) + ((i * 37) % 10) / 25;
      gsap.fromTo(kaartEl, { y: 60 * tempo }, { y: -60 * tempo, ease: 'none', scrollTrigger: { trigger: kaartEl, start: 'top bottom', end: 'bottom top', scrub: 0.9 } });
      const speel = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } });
      let start = 0.2;
      if (modus === 'tablet-scroll') {
        gsap.set(tablet, { rotateX: 18, rotateY: -14, rotateZ: 4, scale: 0.86, transformPerspective: 1200 });
        if (tel) speel.to(tel, { opacity: 0, y: 40, duration: 0.35 }, 0);
        speel.to(tablet, { rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.04, duration: 0.55 }, 0); start = 0.5;
      } else if (modus === 'tablet') {
        gsap.set(tablet, { rotateX: 18, rotateY: -14, rotateZ: 4, scale: 0.86, transformPerspective: 1200 });
        if (tel) speel.to(tel, { opacity: 0, y: 40, duration: 0.35 }, 0);
        speel.to(tablet, { rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, duration: 0.55 }, 0)
          .to(tablet, { scale: () => Math.max(vlak.offsetWidth / glas.offsetWidth, vlak.offsetHeight / glas.offsetHeight) * 1.03, y: () => (vlak.offsetHeight / 2) - (tablet.offsetTop + tablet.offsetHeight / 2), duration: 0.7 }, 0.45);
        start = 1.15;
      } else if (modus === 'scherm') {
        speel.to(kaartEl.querySelector('.scherm-kaart'), { scale: 1.07, y: -8, duration: 0.6 }, 0); start = 0.35;
      } else if (modus === 'browser') {
        speel.to(browser, { y: -10, scale: 1.04, duration: 0.6 }, 0); start = 0.35;
      } else {
        speel.to(glas, { scale: 1.035, duration: 0.6 }, 0);
      }
      if (site) speel.to(site, { y: () => -(site.offsetHeight - glas.offsetHeight) * 0.55, duration: 3.2, ease: 'none' }, start);
      if (dias.length > 1) dias.forEach((d, j) => { if (j) speel.to(d, { opacity: 1, duration: 0.3 }, start + (j - 1) * 0.9).to(dias[j - 1], { opacity: 0, duration: 0.3 }, start + 0.15 + (j - 1) * 0.9); });
      const laad = () => { if (site && site.dataset.src) { site.src = site.dataset.src; delete site.dataset.src; site.addEventListener('load', () => speel.invalidate(), { once: true }); } };
      if (muis) {
        gsap.set(vlak, { transformPerspective: 1100 });
        kaartEl.addEventListener('pointerenter', () => { laad(); speel.timeScale(1).play(); gsap.to(vlak, { rotateY: 9, rotateX: -3, rotateZ: -1.2, duration: 0.7, ease: 'power3.out' }); });
        kaartEl.addEventListener('pointerleave', () => { speel.timeScale(2.2).reverse(); gsap.to(vlak, { rotateY: 0, rotateX: 0, rotateZ: 0, duration: 0.7, ease: 'power3.out' }); });
      } else {
        ScrollTrigger.create({ trigger: kaartEl, start: 'top 60%', end: 'bottom 30%', onEnter: () => { laad(); speel.play(); }, onLeaveBack: () => speel.reverse(), onEnterBack: () => speel.play() });
      }
    });
  } else {
    voortgang.style.strokeDashoffset = 0; kop.style.display = 'none';
    document.querySelectorAll('.tpunt').forEach(p => p.classList.add('aan'));
    document.querySelectorAll('.illu .vinkje, .illu .groei').forEach(e => e.style.strokeDashoffset = 0);
    document.querySelectorAll('.illu .live, .illu .vlakg').forEach(e => e.setAttribute('opacity', 1));
    document.querySelectorAll('.illu .laad').forEach(e => e.setAttribute('width', 260));
    document.querySelectorAll('.illu .palet circle').forEach(e => e.setAttribute('r', 6));
  }
  addEventListener('resize', () => { lengte = tekenPad(); });
  // ── Menu-pil: schuift naar het item onder de muis; verschijnt ter plekke (zonder te glijden) als hij nog verborgen was ──
${NAV_JS}
  const kopEl = document.querySelector('.kop'), compact = () => kopEl.classList.toggle('compact', scrollY > 80);
  addEventListener('scroll', compact, { passive: true }); compact();
${CURSOR_JS}
</script>
</body>
</html>
`;

mkdirSync(join(root, 'docs-preview'), { recursive: true });
writeFileSync(join(root, 'docs-preview', 'motion.html'), html);
console.log('Geschreven: docs-preview/motion.html');

// ════ Case-pagina (preview, aanpak B): zelfde stijl/kopbalk/afsluiter als de homepage + eigen opbouw ════
// Hero in projectkleur met tablet + telefoon · verhaal groot en leesbaar · galerij (scroll door de site + mobiel)
// · groot "volgende case"-vlak. Eerst alleen DELPHI (akkoord Thomas), daarna doortrekken naar alle cases.
const DONKER = new Set(['thnk', 'flow8']);
const HERO_KLEUR = { delphi: '#ffffff' };
const HERO_BEELD = { flow8: 'rapportage.jpg' }; // Flow8: rapportage oogt het sterkst (en heeft geen telefoonbeeld) // DELPHI-hero wit, net als hun eigen site (keuze Thomas)
const CASE_CSS = `
  /* ── Case-pagina ── */
  .chero { position: relative; overflow: hidden; background: var(--case); color: var(--inkt); padding: calc(var(--kop-hoogte) + clamp(40px, 6vw, 96px)) 0 clamp(64px, 8vw, 120px); }
  .chero.donker { color: var(--maan); } .chero.donker .label { color: var(--grijs-n); } .chero.donker .label::before { background: var(--maan); }
  .chero > .w { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: clamp(32px, 5vw, 80px); align-items: center; }
  .chero .label { text-decoration: none; }
  .chero h1 { font-size: clamp(40px, 5.2vw, 84px); margin: 22px 0 22px; hyphens: manual; -webkit-hyphens: manual; overflow-wrap: break-word; } /* lange namen alleen afbreken op het vaste breekpunt uit naamKop */
  .chero h1 .w-r { max-width: 100%; }
  .chero h1.lang { font-size: clamp(36px, 4.4vw, 64px); } /* lange namen: "Sleutelbeheer-" moet ook op brede schermen in de kolom passen */
  .chero .intro { font-size: clamp(19px, 1.6vw, 23px); line-height: 1.45; letter-spacing: -.01em; color: var(--case-tekst); max-width: 34ch; margin: 0; }
  .cfeiten { display: grid; grid-template-columns: 1fr 1fr; gap: 22px 32px; margin: 40px 0 0; padding-top: 28px; border-top: 1px solid var(--lijn); }
  .chero.donker .cfeiten { border-color: var(--lijn-n); }
  .cfeiten dt { font: 500 var(--label)/1 var(--mono); letter-spacing: var(--ls-label); text-transform: uppercase; color: var(--case-tekst); margin-bottom: 9px; }
  .cfeiten dd { margin: 0; font-weight: 500; overflow-wrap: anywhere; }
  .cfeiten .clogo img { display: block; width: auto; height: auto; max-width: 120px; max-height: 60px; mix-blend-mode: multiply; } /* witte logo-achtergrond valt weg */
  .cstatus { display: inline-block; vertical-align: middle; margin-left: 14px; padding: 7px 12px; border-radius: var(--r-pil); font: 500 var(--label)/1 var(--mono); letter-spacing: var(--ls-label); text-transform: uppercase; background: rgba(10, 11, 13, .07); }
  .chero.donker .cstatus { background: rgba(255, 255, 255, .1); }
  .cschermen { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(20px, 3vw, 40px); }
  .cschermen figure { margin: 0; } .cschermen img { width: 100%; display: block; aspect-ratio: 1972 / 1150; object-fit: cover; object-position: top; }
  .cschermen figcaption { margin-top: 12px; color: var(--grijs); font-size: 15px; } .cnoot { margin: 28px 0 0; color: var(--grijs); font-size: 14px; } /* lichte achtergrond van de uitsnede valt weg */ .cfeiten a { color: inherit; text-underline-offset: 4px; }
  /* Toestellen: het scherm (.glas) heeft exact de verhouding van de schermafbeelding (--beeld), de behuizing groeit eromheen.
     Maten in cqw (breedte van het toestel): telefoon naar een iPhone (71,5 × 146,6 mm, scherm 393 × 852 pt): rand 4,1%,
     hoek 13,5%; tablet naar een iPad: rand 3,2%, hoek 4,8%. Binnenhoek = buitenhoek − rand (concentrisch). */
  .ctoestel { position: relative; display: grid; align-items: center; perspective: 1400px; padding-bottom: 7%; }
  .ctablet, .ctel { container-type: inline-size; will-change: transform; }
  .ctablet { grid-area: 1 / 1; width: 91%; transform: perspective(1400px) rotateY(-14deg) rotateX(8deg) rotateZ(2deg); }
  .ctoestel.zonder-tel .ctablet { width: 100%; }
  .romp { background: #0f1115; }
  .ctablet .romp { padding: 3.2cqw; border-radius: 4.8cqw; box-shadow: 0 60px 100px -40px rgba(20, 30, 60, .45); }
  .ctel .romp { padding: 4.1cqw; border-radius: 13.5cqw; box-shadow: 0 40px 70px -24px rgba(20, 30, 60, .5); }
  .ctablet .glas, .ctel .glas { aspect-ratio: var(--beeld); overflow: hidden; background: #fff; }
  .ctablet .glas { border-radius: 1.6cqw; } .ctel .glas { border-radius: 9.4cqw; }
  .ctablet img, .ctel img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; } /* verhouding gelijk: niets valt weg */
  .chero .ctel { grid-area: 1 / 1; justify-self: end; align-self: end; width: 25%; margin-bottom: -7%; transform: perspective(1400px) rotateY(-10deg) rotateX(6deg) rotateZ(4deg); }
  .cverhaal { background: var(--nacht); color: var(--maan); padding: clamp(64px, 8vw, 112px) 0; }
  .cverhaal .w { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(28px, 4vw, 56px); }
  .cstap h2 { font-size: var(--h3); margin: 14px 0 12px; } .cstap p { color: var(--grijs-n); margin: 0; font-size: 17px; line-height: 1.6; }
  .conderdelen { padding: var(--sectie) 0; }
  .conderdelen .sectiekop p { max-width: 52ch; }
  .craster { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(16px, 2vw, 24px); margin-top: clamp(32px, 4vw, 56px); }
  .conderdeel { background: var(--papier-2); border-radius: var(--r); padding: clamp(24px, 3vw, 36px); }
  .conderdeel h3 { font-size: var(--h3); margin: 14px 0 10px; } .conderdeel p { color: var(--grijs); margin: 0; font-size: 17px; line-height: 1.6; max-width: 48ch; }
  .cgalerij { background: var(--papier-2); padding: var(--sectie) 0; }
  .cgalerij .sectiekop { margin-bottom: clamp(32px, 4vw, 56px); }
  .cgalerij .doorkijk { margin: 0; }
  .cvenster { border-radius: var(--r); overflow: hidden; background: #fff; box-shadow: 0 50px 90px -40px rgba(10, 11, 13, .3); }
  .cvenster .balk { height: 38px; display: flex; gap: 7px; align-items: center; padding: 0 16px; background: #eceef1; }
  .cvenster .balk i { width: 11px; height: 11px; border-radius: 50%; background: #c9ccd2; }
  .cmobiel { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: clamp(32px, 6vw, 96px); align-items: center; margin-top: var(--sectie); }
  .cmobiel .ctel { width: min(100%, 420px); margin: 0 auto; } /* iPhone Plus-breedte */
  .cmobiel h2 { font-size: var(--h2); margin: 16px 0 20px; } .cmobiel p { color: var(--grijs); font-size: clamp(18px, 1.5vw, 21px); max-width: 40ch; margin: 0 0 32px; }
  .cvolgende { display: block; position: relative; overflow: hidden; background: var(--case); color: var(--inkt); text-decoration: none; padding: clamp(48px, 6vw, 88px) 0 0; }
  .cvolgende .w { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 24px clamp(32px, 5vw, 80px); align-items: end; }
  .cvolgende .ctekst { padding-bottom: clamp(48px, 6vw, 88px); }
  .cvolgende.donker { color: var(--maan); }
  .cvolgende h2 { font-size: clamp(34px, 4.6vw, 68px); margin: 16px 0 0; display: flex; align-items: center; gap: .25em; }
  .cvolgende h2 svg { width: .55em; height: .55em; transition: transform .5s var(--ease); } .cvolgende:hover h2 svg { transform: translateX(.2em); }
  .cvolgende .cvenster { transform: translateY(16%); transition: transform .9s cubic-bezier(.16, 1, .3, 1); }
  .cvolgende:hover .cvenster { transform: translateY(5%); }
  .cvolgende .cvenster img { width: 100%; display: block; aspect-ratio: 16 / 10; object-fit: cover; object-position: top; }
  @media (max-width: 860px) {
    .chero > .w, .cverhaal .w, .cmobiel, .cvolgende .w, .cschermen, .craster { grid-template-columns: 1fr; } .cvolgende .ctekst { padding-bottom: 0; }
    .chero .ctoestel { margin-top: 12px; }
  }`;

// Breedte × hoogte uit een JPEG (SOF-marker), zonder extra pakket
function jpgMaat(pad) {
  const b = readFileSync(pad);
  for (let i = 2; i < b.length;) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1], len = b.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + len;
  }
  throw new Error('Geen JPEG-maat: ' + pad);
}
function casePagina(c) {
  const i = CASES.indexOf(c), volgende = CASES[(i + 1) % CASES.length];
  const donker = DONKER.has(c.slug) ? ' donker' : '';
  const kort = u => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  const thuis = 'motion.html'; // preview; publiceer-preview.mjs zet dit om naar '../../'
  const maat = f => { const b = readFileSync(join(root, 'docs/img/cases', c.slug, f)); return [b.readUInt32BE(16), b.readUInt32BE(20)]; }; // PNG-breedte/hoogte
  const logo = heeft(c.slug, 'logo.png') ? maat('logo.png') : null;
  const verh = f => { const [w, h] = jpgMaat(join(root, 'docs/img/cases', c.slug, f)); return `${w} / ${h}`; }; // exacte beeldverhouding
  const heroBeeld = HERO_BEELD[c.slug] || 'desktop.jpg', tel = heeft(c.slug, 'mobiel.jpg');
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${c.naam} — case | ViVo (preview)</title>
<link rel="preload" as="image" href="${img(c.slug, heroBeeld)}" fetchpriority="high">
<script>document.documentElement.classList.add('js')</script>
<link rel="stylesheet" href="../docs/css/vivo.css">
<style>
${CSS}
${CURSOR_CSS}
${CASE_CSS}
</style>
</head>
<body>
${KOP(thuis)}

<main id="inhoud">
<section class="chero${donker}" style="--case:${HERO_KLEUR[c.slug] || c.kleur};--case-tekst:${c.kleurTekst}" aria-labelledby="case-kop">
  <div class="w">
    <div class="ctekst">
      <a class="label" href="${thuis}#projecten">Projecten · ${c.jaar}</a>${c.status ? `<span class="cstatus">${c.status}</span>` : ''}
      <h1 id="case-kop"${c.naam.length > 16 ? ' class="lang"' : ''}>${c.naamKop || c.naam}</h1>
      <p class="intro">${c.intro}</p>
      <dl class="cfeiten">
        <div><dt>Klant</dt><dd${logo ? ` class="clogo"><img src="${img(c.slug, 'logo.png')}" alt="${c.klant}" width="${logo[0]}" height="${logo[1]}">` : '>' + c.klant}</dd></div>
        <div><dt>Sector</dt><dd>${c.sector}</dd></div>
        <div><dt>Wat ViVo deed</dt><dd>${c.rol.join(', ')}</dd></div>
        <div><dt>${c.live ? 'Website' : 'Status'}</dt><dd>${c.live ? `<a href="${c.live}" target="_blank" rel="noopener">${kort(c.live)} ↗</a>` : (c.status || '')}</dd></div>
      </dl>
    </div>
    <div class="ctoestel${tel ? '' : ' zonder-tel'}" aria-hidden="true">
      <div class="ctablet"><div class="romp"><div class="glas" style="--beeld:${verh(heroBeeld)}"><img src="${img(c.slug, heroBeeld)}" alt=""${afm(c.slug, heroBeeld)} fetchpriority="high"></div></div></div>
      ${tel ? `<div class="ctel"><div class="romp"><div class="glas" style="--beeld:${verh('mobiel.jpg')}"><img src="${img(c.slug, 'mobiel.jpg')}" alt=""${afm(c.slug, 'mobiel.jpg')}></div></div></div>` : ''}
    </div>
  </div>
</section>

<section class="cverhaal donker" aria-label="Het verhaal">
  <div class="w">
    ${[['De opdracht', c.opdracht], ['De aanpak', c.aanpak], ['Het resultaat', c.resultaat]].map(([t, p], n) => `<div class="cstap onthul" style="--vertraging:${n * 0.1}s"><span class="label">0${n + 1}</span><h2>${t}</h2><p>${p}</p></div>`).join('\n    ')}
  </div>
</section>

${c.onderdelen ? `<section class="conderdelen" aria-labelledby="onderdelen-kop">
  <div class="w">
    <div class="sectiekop"><div><span class="label">Wat we bouwden</span><h2 id="onderdelen-kop">In het kort</h2></div><p>${c.vertrekpunt}</p></div>
    <div class="craster">${c.onderdelen.map(([t, p], n) => `<div class="conderdeel onthul" style="--vertraging:${(n % 2) * 0.1}s"><span class="label">0${n + 1}</span><h3>${t}</h3><p>${p}</p></div>`).join('')}</div>
  </div>
</section>

` : ''}<section class="cgalerij" aria-label="Beelden van ${c.naam}">
  <div class="w">
    ${heeft(c.slug, 'pagina.jpg') ? `<div class="sectiekop"><div><span class="label">De website</span><h2>Scroll door de site</h2></div></div>
    <div class="doorkijk onthul" style="--case:${c.kleur};--case-tekst:${c.kleurTekst}"><div class="venster"><div class="balk"><i></i><i></i><i></i></div><div class="rol" tabindex="0" aria-label="Volledige pagina van ${c.naam}, scrollbaar"><img src="${img(c.slug, 'pagina.jpg')}" alt="De volledige homepage van ${c.naam}"${afm(c.slug, 'pagina.jpg')} loading="lazy" decoding="async"></div></div><p>Scroll door de site</p></div>` : ''}
    ${heeft(c.slug, 'mobiel.jpg') ? `<div class="cmobiel">
      <div class="ctel onthul"><div class="romp"><div class="glas" style="--beeld:${verh('mobiel.jpg')}"><img src="${img(c.slug, 'mobiel.jpg')}" alt="${c.naam} op mobiel"${afm(c.slug, 'mobiel.jpg')} loading="lazy" decoding="async"></div></div></div>
      <div class="onthul"><span class="label">Mobiel</span><h2>Net zo sterk op de telefoon</h2><p>Elke pagina is ontworpen en getest op telefoon, tablet en desktop — zodat bezoekers overal snel vinden wat ze zoeken.</p>${c.live ? `<a class="pil" href="${c.live}" target="_blank" rel="noopener">Bekijk de live site ↗</a>` : ''}</div>
    </div>` : ''}
    ${c.galerij ? `<div class="sectiekop"><div><span class="label">Het product</span><h2>Een kijkje in ${c.naam}</h2></div></div>
    <div class="cschermen">${c.galerij.map((g, n) => `<figure class="onthul" style="--vertraging:${(n % 2) * 0.1}s"><div class="cvenster"><div class="balk"><i></i><i></i><i></i></div><img src="${img(c.slug, g.bestand)}" alt=""${afm(c.slug, g.bestand)} loading="lazy" decoding="async"></div><figcaption>${g.bijschrift}</figcaption></figure>`).join('')}</div>${c.galerijNoot ? `<p class="cnoot">${c.galerijNoot}</p>` : ''}` : ''}
  </div>
</section>

<a class="cvolgende${DONKER.has(volgende.slug) ? ' donker' : ''}" href="case-${volgende.slug}.html" style="--case:${volgende.kleur}">
  <div class="w"><div class="ctekst onthul"><span class="label">Volgende case</span><h2>${volgende.naam} ${pijl}</h2></div>
  <div class="cvenster"><div class="balk"><i></i><i></i><i></i></div><img src="${img(volgende.slug, 'desktop.jpg')}" alt=""${afm(volgende.slug, 'desktop.jpg')} loading="lazy" decoding="async"></div></div>
</a>

</main>
${AFSLUITER(thuis)}

<script src="../docs/js/vivo.js" defer></script>
<script src="../node_modules/gsap/dist/gsap.min.js"></script>
<script src="../node_modules/gsap/dist/ScrollTrigger.min.js"></script>
<script>
  const rustig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);
  // ── Gedeeld met de homepage: infade, menu-pil, krimpende kopbalk, bewegende lus ──
  const onthulKijker = new IntersectionObserver(items => items.forEach(({ isIntersecting, target }) => {
    if (!isIntersecting) return;
    onthulKijker.unobserve(target);
    const img = target.querySelector('img');
    Promise.resolve(img && !img.complete ? img.decode().catch(() => {}) : null).then(() => target.classList.add('in'));
  }), { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.onthul').forEach(el => rustig ? el.classList.add('in') : onthulKijker.observe(el));
${NAV_JS}
  const kopEl = document.querySelector('.kop'), compact = () => kopEl.classList.toggle('compact', scrollY > 80);
  addEventListener('scroll', compact, { passive: true }); compact();
${CURSOR_JS}

  if (!rustig) {
    gsap.to('.lus-donker', { rotate: -10, x: -60, y: 30, scale: 1.08, duration: 18, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.from('.afsluiter .w > :not(.afsl-onder)', { y: 30, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.afsluiter', start: 'top 75%' } });
    // ── Hero: kop woord voor woord, tekst en feiten omhoog; tablet en telefoon blijven schuin staan ──
    gsap.set('.ctablet', { transformPerspective: 1400, rotateY: -14, rotateX: 8, rotateZ: 2 });
    gsap.set('.chero .ctel', { transformPerspective: 1400, rotateY: -10, rotateX: 6, rotateZ: 4 });
    const h1 = document.querySelector('.chero h1');
    h1.setAttribute('aria-label', h1.textContent);
    h1.innerHTML = h1.textContent.split(' ').map(w => '<span class="w-r" aria-hidden="true"><span>' + w + '</span></span>').join(' ');
    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .from('.chero .label', { opacity: 0, duration: 0.6 }, 0.1)
      .from('.chero h1 .w-r > span', { yPercent: 110, duration: 1.1, stagger: 0.08 }, 0.15)
      .from('.chero .intro, .cfeiten > div', { y: 24, opacity: 0, duration: 1, stagger: 0.07 }, 0.45)
      .from('.ctoestel', { y: 80, opacity: 0, duration: 1.4 }, 0.2)
      .from('.ctablet', { rotateY: -32, rotateX: 18, rotateZ: 4, duration: 1.8 }, 0.2)      // kantelt naar zijn schuine eindstand
      .from('.chero .ctel', { yPercent: 25, opacity: 0, rotateZ: 10, duration: 1.6 }, 0.45);  // yPercent: botst niet met de scroll-y
    gsap.to('.chero .ctel', { y: -50, ease: 'none', scrollTrigger: { trigger: '.chero', start: 'top top', end: 'bottom top', scrub: 0.6 } });
    gsap.to('.ctablet', { y: 30, ease: 'none', scrollTrigger: { trigger: '.chero', start: 'top top', end: 'bottom top', scrub: 0.6 } });
    // Verhaal, mobiel en volgende case komen binnen via .onthul (IntersectionObserver): betrouwbaar, ook met lazy beelden
    addEventListener('load', () => ScrollTrigger.refresh());
  }
</script>
</body>
</html>
`;
}
for (const c of CASES) writeFileSync(join(root, 'docs-preview', `case-${c.slug}.html`), casePagina(c));
console.log(`Geschreven: docs-preview/case-{${CASES.map(c => c.slug).join(',')}}.html`);

// ════ Juridische pagina's in de nieuwe stijl (privacy, voorwaarden, cookies) ════
// Tekst en voorwaarden uit site/juridisch.mjs, opmaak gedeeld met bouw.mjs (site/juridisch-render.mjs).
const MEET = meetVlaggen(SITE.meten);
const JUR = maakJuridisch(MEET);
function juridischPagina(doc) {
  const thuis = 'motion.html';
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${doc.titel} | ViVo (preview)</title>
<script>document.documentElement.classList.add('js')</script>
<link rel="stylesheet" href="../docs/css/vivo.css">
<style>
${CSS}
${CURSOR_CSS}
${OVER_CSS}
</style>
</head>
<body>
${KOP(thuis)}

<main id="inhoud">
${JUR.inhoud(doc, '../docs/')}
</main>

${AFSLUITER(thuis)}

<script src="../docs/js/vivo.js" defer></script>
<script src="../node_modules/gsap/dist/gsap.min.js"></script>
<script src="../node_modules/gsap/dist/ScrollTrigger.min.js"></script>
<script>
  const rustig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);
${NAV_JS}
  const kopEl = document.querySelector('.kop'), compact = () => kopEl.classList.toggle('compact', scrollY > 80);
  addEventListener('scroll', compact, { passive: true }); compact();
${CURSOR_JS}
  if (!rustig) gsap.to('.lus-donker', { rotate: -10, x: -60, y: 30, scale: 1.08, duration: 18, ease: 'sine.inOut', yoyo: true, repeat: -1 });
</script>
</body>
</html>
`;
}
for (const doc of [PRIVACY, VOORWAARDEN, ...(MEET.meten ? [COOKIES] : [])]) writeFileSync(join(root, 'docs-preview', `${doc.slug}.html`), juridischPagina(doc));
console.log('Geschreven: docs-preview/privacy.html, voorwaarden.html' + (MEET.meten ? ', cookies.html' : ''));

// ════ Over ViVo (eigen pagina) — verhaal van Thomas; CONCEPT, Thomas beoordeelt ════
const OVER = {
  intro: 'Altijd al handig met computers, software en IT. Nu bouw ik websites, webshops en webapps voor ondernemers — persoonlijk en met oog voor detail.',
  verhaal: [
    'Ik ben Thomas, de oprichter van ViVo. Computers, software en IT hebben me altijd getrokken: uitzoeken hoe iets werkt, en hoe het slimmer kan.',
    'Naast mijn werk ben ik me steeds verder gaan verdiepen in webdesign, het bouwen van websites en de mogelijkheden van AI. Vanuit mijn werk ontwikkelde ik Flow8, een platform voor planning, werkbonnen en administratie — omdat het bedrijf vastliep op planning en workflow. Zo zag ik van dichtbij wat goede software oplevert: tijdwinst, overzicht en grip.',
    'Met ViVo bied ik dat nu aan als dienst, voor ondernemers die een website, webshop of webapp willen die echt werkt. Je hebt één vast aanspreekpunt: mij. Ik denk mee over je merk en je doelen, ontwerp en bouw de site, en blijf daarna bereikbaar voor onderhoud en doorontwikkeling.',
    'AI gebruik ik om sneller te werken en meer te laten zien: meerdere ontwerprichtingen, beelden en teksten. De keuzes en het vakwerk blijven mensenwerk.',
  ],
  waarden: [
    ['Persoonlijk', 'Eén aanspreekpunt van eerste schets tot livegang. Korte lijnen en snel antwoord.'],
    ['Snel en degelijk', 'Moderne techniek: snelle sites die op elk scherm werken en goed vindbaar zijn.'],
    ['Helder', 'Duidelijke afspraken vooraf, geen verrassingen achteraf. Na betaling ben jij eigenaar van je ontwerp.'],
  ],
};
function overPagina() {
  const thuis = 'motion.html';
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Over ViVo (preview)</title>
<script>document.documentElement.classList.add('js')</script>
<link rel="stylesheet" href="../docs/css/vivo.css">
<style>
${CSS}
${CURSOR_CSS}
${OVER_CSS}
</style>
</head>
<body>
${KOP(thuis)}

<main id="inhoud">
<section class="ohero" aria-labelledby="over-kop">
  <div class="w">
    <div><span class="label">Over ViVo</span><h1 id="over-kop">Achter ViVo staat Thomas.</h1><p class="intro">${OVER.intro}</p></div>
    <img src="../beelden/over/thomas.webp" alt="Portret van Thomas, oprichter van ViVo" width="896" height="1120" fetchpriority="high">
  </div>
</section>
<section class="overhaal" aria-label="Het verhaal">
  <div class="w"><div><span class="label">Het verhaal</span></div><div class="onthul">${OVER.verhaal.map(p => `<p>${p}</p>`).join('')}</div></div>
</section>
<section class="overhaal" aria-labelledby="hulp-kop">
  <div class="w"><div><span class="label">Waar ik je mee help</span></div><div class="onthul"><h2 id="hulp-kop" style="font-size:var(--h3);margin:0 0 16px">Van merk tot hosting, onder één dak</h2><p>Een logo en huisstijl die blijven hangen, een website of webshop die bezoekers omzet in klanten, of maatwerk zoals een webapp met inloggen, rechten en koppelingen. Ik verzorg ook de teksten en beelden, en na de livegang de hosting, updates en verbeteringen — zodat je er zelf geen omkijken naar hebt.</p><p><a class="link" href="motion.html#diensten">Bekijk alle diensten ${pijl}</a></p></div></div>
</section>
<section class="owaarden donker" aria-labelledby="waarden-kop">
  <div class="w"><span class="label">Waar ViVo voor staat</span><h2 id="waarden-kop" style="font-size:var(--h2);margin:16px 0 0">Zo werk ik</h2>
    <div class="raster">${OVER.waarden.map(([t, p], n) => `<div class="onthul" style="--vertraging:${n * 0.1}s"><span class="label">0${n + 1}</span><h3>${t}</h3><p>${p}</p></div>`).join('')}</div>
  </div>
</section>
</main>

${AFSLUITER(thuis)}

<script src="../docs/js/vivo.js" defer></script>
<script src="../node_modules/gsap/dist/gsap.min.js"></script>
<script src="../node_modules/gsap/dist/ScrollTrigger.min.js"></script>
<script>
  const rustig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);
  const onthulKijker = new IntersectionObserver(items => items.forEach(({ isIntersecting, target }) => { if (isIntersecting) { onthulKijker.unobserve(target); target.classList.add('in'); } }), { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.onthul').forEach(el => rustig ? el.classList.add('in') : onthulKijker.observe(el));
${NAV_JS}
  const kopEl = document.querySelector('.kop'), compact = () => kopEl.classList.toggle('compact', scrollY > 80);
  addEventListener('scroll', compact, { passive: true }); compact();
${CURSOR_JS}
  if (!rustig) {
    gsap.to('.lus-donker', { rotate: -10, x: -60, y: 30, scale: 1.08, duration: 18, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.from('.ohero .w > div > *', { y: 30, opacity: 0, duration: 1, stagger: 0.08, ease: 'power3.out' });
    gsap.from('.ohero img', { y: 40, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 });
  }
</script>
</body>
</html>
`;
}
writeFileSync(join(root, 'docs-preview', 'over.html'), overPagina());
console.log('Geschreven: docs-preview/over.html');

// ════ Contact (eigen pagina) — gegevens + formulier. Zonder Web3Forms-sleutel opent het formulier het mailprogramma. ════
const CONTACT_CSS = `
  .khero { padding: calc(var(--kop-hoogte) + clamp(40px, 6vw, 96px)) 0 var(--sectie); }
  .khero .w { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: clamp(40px, 7vw, 112px); align-items: start; }
  .khero h1 { font-size: clamp(44px, 6vw, 96px); margin: 22px 0 24px; }
  .khero .intro { font-size: clamp(19px, 1.6vw, 23px); line-height: 1.45; color: var(--grijs); margin: 0 0 40px; max-width: 34ch; }
  .kgegevens { display: grid; gap: 26px; padding-top: 28px; border-top: 1px solid var(--lijn); }
  .kgegevens dt { font: 500 var(--label)/1 var(--mono); letter-spacing: var(--ls-label); text-transform: uppercase; color: var(--grijs); margin-bottom: 9px; }
  .kgegevens dd { margin: 0; font-size: 19px; font-weight: 500; } .kgegevens a { color: inherit; text-underline-offset: 4px; display: inline-block; padding: 6px 0; } /* ruim klikvlak op mobiel */
  .kknoppen { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }
  .kknoppen .pil.licht { background: transparent; color: var(--inkt); box-shadow: inset 0 0 0 1.5px var(--inkt); }
  .kformulier { background: var(--papier-2); border-radius: var(--r); padding: clamp(24px, 4vw, 48px); display: grid; gap: 18px; }
  .kformulier h2 { font-size: var(--h3); margin: 0 0 4px; }
  .kveld { display: grid; gap: 8px; } .kveld label { font-weight: 500; font-size: 15px; } .kveld label span { color: var(--grijs); font-weight: 400; }
  .kveld input, .kveld textarea { font: inherit; font-size: 17px; color: var(--inkt); background: #fff; border: 1.5px solid var(--lijn); border-radius: 12px; padding: 13px 15px; width: 100%; box-sizing: border-box; transition: border-color .2s; }
  .kveld textarea { min-height: 150px; resize: vertical; }
  .kveld input:focus, .kveld textarea:focus { outline: none; border-color: var(--inkt); }
  .kformulier .pil { justify-self: start; border: 0; cursor: pointer; font: inherit; font-weight: 600; }
  .kformulier .kopmerking { color: var(--grijs); font-size: 14px; margin: 0; } .kformulier .kopmerking a { color: inherit; display: inline-block; padding: 6px 0; }
  .kverloop { padding: 0 0 var(--sectie); } .kverloop .w > div { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(24px, 4vw, 56px); border-top: 1px solid var(--lijn); padding-top: clamp(32px, 4vw, 56px); margin-top: 24px; }
  .kverloop h3 { font-size: var(--h3); margin: 12px 0 10px; } .kverloop p { color: var(--grijs); margin: 0; font-size: 17px; line-height: 1.6; }
  @media (max-width: 860px) { .kverloop .w > div { grid-template-columns: 1fr; } }
  .kmelding { margin: 0; font-weight: 500; min-height: 1.4em; } .kmelding.fout { color: #b42318; }
  .kval { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
  @media (max-width: 860px) { .khero .w { grid-template-columns: 1fr; } }`;
function contactPagina() {
  const thuis = 'motion.html', sleutel = (SITE.formulier || {}).web3forms || '';
  const route = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`${SITE.adres}, ${SITE.postcode} ${SITE.plaats}`);
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Contact (preview)</title>
<script>document.documentElement.classList.add('js')</script>
<link rel="stylesheet" href="../docs/css/vivo.css">
<style>
${CSS}
${CURSOR_CSS}
${CONTACT_CSS}
</style>
</head>
<body>
${KOP(thuis)}

<main id="inhoud">
<section class="khero" aria-labelledby="contact-kop">
  <div class="w">
    <div>
      <span class="label">Contact</span>
      <h1 id="contact-kop">Laten we kennismaken.</h1>
      <p class="intro">Vertel kort wat je wilt bereiken. Je krijgt persoonlijk antwoord, van Thomas zelf.</p>
      <dl class="kgegevens">
        <div><dt>E-mail</dt><dd><a href="mailto:${SITE.mail}">${SITE.mail}</a></dd></div>
        <div><dt>Telefoon</dt><dd><a href="tel:${SITE.telefoonLink}">${SITE.telefoon}</a></dd></div>
        <div><dt>Bezoekadres</dt><dd>${SITE.adres}<br>${SITE.postcode} ${SITE.plaats}<br><a href="${route}" target="_blank" rel="noopener" style="font-size:16px;font-weight:400">Route plannen ↗</a></dd></div>
        <div><dt>KvK</dt><dd>${SITE.kvk}</dd></div>
      </dl>
      <div class="kknoppen"><a class="pil" href="mailto:${SITE.mail}?subject=Kennismaking%20ViVo">Mail direct</a><a class="pil licht" href="tel:${SITE.telefoonLink}">Bel ${SITE.telefoon}</a></div>
    </div>
    <form class="kformulier" novalidate>
      <h2>Stuur een bericht</h2>
      <div class="kveld"><label for="k-naam">Naam</label><input id="k-naam" name="naam" autocomplete="name" enterkeyhint="next" required></div>
      <div class="kveld"><label for="k-email">E-mail</label><input id="k-email" name="email" type="email" autocomplete="email" enterkeyhint="next" required></div>
      <div class="kveld"><label for="k-tel">Telefoon <span>(optioneel)</span></label><input id="k-tel" name="telefoon" type="tel" autocomplete="tel" enterkeyhint="next"></div>
      <div class="kveld"><label for="k-bericht">Waar kan ViVo je mee helpen?</label><textarea id="k-bericht" name="bericht" required></textarea></div>
      <div class="kval" inert><label for="k-web">Laat dit veld leeg</label><input id="k-web" name="website" tabindex="-1" autocomplete="off"></div>
      <button class="pil" type="submit">${sleutel ? 'Verstuur bericht' : 'Verstuur via je mailprogramma'}</button>
      <p class="kmelding" role="status" aria-live="polite"></p>
      <p class="kopmerking">We gebruiken je gegevens alleen om je bericht te beantwoorden. Zie de <a href="../docs/privacy/">privacyverklaring</a>.</p>
    </form>
  </div>
</section>
<section class="kverloop" aria-labelledby="verloop-kop">
  <div class="w"><span class="label">Na je bericht</span><h2 id="verloop-kop" style="font-size:var(--h2);margin:16px 0 0">Zo gaat het verder</h2>
    <div>
      <div><span class="label">01</span><h3>Kennismaken</h3><p>We gaan om tafel: wat wil je bereiken, wie zijn je klanten en wat moet de site opleveren? Daarna krijg je een helder voorstel met planning en prijs.</p></div>
      <div><span class="label">02</span><h3>Ontwerpen</h3><p>Je ziet je site eerst als klikbaar ontwerp, voordat er een regel code geschreven is. Met hulp van AI verkennen we snel meerdere richtingen — jij kiest en stuurt bij.</p></div>
      <div><span class="label">03</span><h3>Bouwen en live</h3><p>ViVo bouwt de site snel, toegankelijk en vindbaar, en test hem op telefoon, tablet en desktop. Na de livegang blijf je één vast aanspreekpunt houden voor onderhoud en verbeteringen.</p></div>
    </div>
  </div>
</section>
</main>

${AFSLUITER(thuis)}

<script src="../docs/js/vivo.js" defer></script>
<script src="../node_modules/gsap/dist/gsap.min.js"></script>
<script src="../node_modules/gsap/dist/ScrollTrigger.min.js"></script>
<script>
  const rustig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);
${NAV_JS}
  const kopEl = document.querySelector('.kop'), compact = () => kopEl.classList.toggle('compact', scrollY > 80);
  addEventListener('scroll', compact, { passive: true }); compact();
${CURSOR_JS}
  if (!rustig) {
    gsap.to('.lus-donker', { rotate: -10, x: -60, y: 30, scale: 1.08, duration: 18, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.from('.khero .w > *', { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out' });
  }
  // ── Formulier: controleren, dan versturen via Web3Forms (als er een sleutel is) of het mailprogramma openen ──
  const SLEUTEL = ${JSON.stringify(sleutel)}, MAIL = ${JSON.stringify(SITE.mail)};
  const form = document.querySelector('.kformulier'), melding = form.querySelector('.kmelding'), knop = form.querySelector('button');
  const meld = (tekst, fout) => { melding.textContent = tekst; melding.classList.toggle('fout', !!fout); };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (form.website.value) return; // spamval: dit veld vullen alleen bots in
    const leeg = [...form.querySelectorAll('[required]')].find(v => !v.value.trim() || (v.type === 'email' && !/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(v.value.trim())));
    if (leeg) { meld(leeg.type === 'email' && leeg.value ? 'Controleer je e-mailadres.' : 'Vul je naam, e-mailadres en bericht in.', true); leeg.focus(); return; }
    const d = Object.fromEntries(new FormData(form));
    if (!SLEUTEL) {
      const tekst = 'Naam: ' + d.naam + '\\nE-mail: ' + d.email + '\\nTelefoon: ' + (d.telefoon || '-') + '\\n\\n' + d.bericht;
      location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Kennismaking via de website') + '&body=' + encodeURIComponent(tekst);
      meld('Je mailprogramma opent met je bericht. Verstuur het daar.');
      return;
    }
    knop.disabled = true; meld('Bezig met versturen…');
    try {
      const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ access_key: SLEUTEL, subject: 'Nieuw bericht via de website van ViVo', from_name: d.naam, email: d.email, telefoon: d.telefoon || '-', message: d.bericht }) });
      const j = await r.json();
      if (!j.success) throw new Error(j.message);
      form.reset(); meld('Bedankt! Je bericht is verstuurd. Je hoort snel van me.');
    } catch { meld('Versturen lukte niet. Mail of bel gerust direct: ' + MAIL, true); }
    finally { knop.disabled = false; }
  });
</script>
</body>
</html>
`;
}
writeFileSync(join(root, 'docs-preview', 'contact.html'), contactPagina());
console.log('Geschreven: docs-preview/contact.html');
