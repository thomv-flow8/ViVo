// Bouwt de ViVo-website in docs/ (de map die GitHub Pages straks publiceert).
// Bron: site/inhoud.mjs (teksten, cases), site/vivo.css (stijl), huisstijl/tokens.css (tokens), merk/ (logo),
//       cases/<slug>/ (schermafbeeldingen).  Draaien: npm run bouw
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, DIENSTEN, STAPPEN, CASES } from './inhoud.mjs';
import { PRIVACY, VOORWAARDEN, COOKIES } from './juridisch.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// METEN_TEST=1 npm run bouw → bouwt met test-ID's naar docs-preview/meten-test/ (cookiemelding zichtbaar, géén echte scripts)
const TEST = process.env.METEN_TEST === '1';
const uit = join(root, TEST ? 'docs-preview/meten-test' : 'docs');
const METEN = TEST ? { ga4: 'G-TEST', googleAds: 'AW-TEST', metaPixel: 'TEST', test: true } : SITE.meten;
const MEET = { ga4: !!METEN.ga4, googleAds: !!METEN.googleAds, metaPixel: !!METEN.metaPixel };
MEET.google = MEET.ga4 || MEET.googleAds; MEET.marketing = MEET.googleAds || MEET.metaPixel; MEET.meten = MEET.ga4 || MEET.marketing; MEET.geenMeten = !MEET.meten;
const geldt = als => !als || !!MEET[als];
const opsomming = l => l.length > 1 ? l.slice(0, -1).join(', ') + ' en ' + l.at(-1) : (l[0] || '');
const lees = p => readFileSync(join(root, p), 'utf8');
const schrijf = (p, s) => { mkdirSync(dirname(join(uit, p)), { recursive: true }); writeFileSync(join(uit, p), s); };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Logo inline, meekleurend met het vlak (currentColor)
const logo = (naam, cls = '') => lees(`merk/svg/${naam}-wit.svg`).trim()
  .replace(/(stroke|fill)="#[0-9a-fA-F]{3,8}"/g, '$1="currentColor"')
  .replace(/^<svg /, `<svg ${cls ? `class="${cls}" ` : ''}aria-hidden="true" focusable="false" `)
  .replace(/ width="[^"]+" height="[^"]+"/, '')
  .replace(/<title>[^<]*<\/title>/, '');

const pijl = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`;
const chevron = `<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="10"><polyline points="8,16 50,86 92,16"/><polyline points="29.6,16 50,50 70.4,16"/></g></svg>`;
const hamburger = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h18M8 15h13" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`;
const kruis = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`;
// Mockup voor cases zonder schermafbeelding (Flow8, tot Thomas eigen opnames aanlevert)
const mockup = `<svg class="mockup" viewBox="0 0 320 210" aria-hidden="true"><rect x=".75" y=".75" width="318.5" height="208.5" rx="10" fill="#fff"/><rect x=".75" y=".75" width="318.5" height="22" rx="10" fill="#eceef1"/><circle cx="14" cy="12" r="3.5" fill="#c9ccd2"/><circle cx="26" cy="12" r="3.5" fill="#c9ccd2"/><circle cx="38" cy="12" r="3.5" fill="#c9ccd2"/><rect x="0" y="23" width="64" height="187" fill="#15171c"/><rect x="12" y="38" width="40" height="5" rx="2" fill="#4f6ef5"/><rect x="12" y="52" width="34" height="4" rx="2" fill="#9aa0ab"/><rect x="12" y="62" width="38" height="4" rx="2" fill="#9aa0ab"/><rect x="12" y="72" width="30" height="4" rx="2" fill="#9aa0ab"/>${[0, 1, 2, 3, 4].map(i => `<rect x="${76 + i * 47}" y="36" width="41" height="6" rx="2" fill="#646a76" opacity=".5"/>`).join('')}${[[78, 52, 70, '#4f6ef5'], [125, 66, 40, '#35c4e3'], [172, 52, 56, '#4f6ef5'], [219, 88, 44, '#f5a524'], [266, 58, 36, '#35c4e3'], [78, 128, 52, '#f5a524'], [172, 116, 40, '#4f6ef5'], [266, 104, 64, '#4f6ef5']].map(([x, y, h, c]) => `<rect x="${x}" y="${y}" width="39" height="${h}" rx="4" fill="${c}" opacity=".85"/>`).join('')}</svg>`;

const relPad = diepte => '../'.repeat(diepte);
const volledigAdres = () => `${SITE.adres}, ${SITE.postcode ? SITE.postcode + ' ' : ''}${SITE.plaats}`;

function vlak(c, r, opties = {}) {
  const img = existsSync(join(root, 'cases', c.slug, 'desktop.jpg'));
  const scherm = img
    ? `<div class="scherm"><div class="balk"><i></i><i></i><i></i></div><img src="${r}img/cases/${c.slug}/desktop.jpg" alt="${esc(`Website van ${c.naam} op desktop`)}" loading="${opties.eager ? 'eager' : 'lazy'}" width="1440" height="900"></div>`
    : mockup;
  const tel = img && existsSync(join(root, 'cases', c.slug, 'mobiel.jpg'))
    ? `<div class="tel"><img src="${r}img/cases/${c.slug}/mobiel.jpg" alt="${esc(`${c.naam} op mobiel`)}" loading="lazy" width="390" height="844"></div>` : '';
  const status = c.status ? `<span class="status">${esc(c.status)}</span>` : '';
  return `<div class="vlak" style="--case:${c.kleur}">${status}${scherm}${tel}</div>`;
}

function kop(r, actief = '', donker = false) {
  const nav = [['Werk', `${r}#werk`, 'werk'], ['Diensten', `${r}#diensten`], ['Werkwijze', `${r}#werkwijze`], ['Contact', `${r}#contact`]];
  return `<a class="overslaan" href="#inhoud">Direct naar de inhoud</a>
<header class="kop${donker ? ' op-donker' : ''}">
  <div class="w">
    <a class="logo" href="${r || './'}" aria-label="ViVo — naar de homepage">${logo('vivo-horizontaal')}</a>
    <nav aria-label="Hoofdmenu">${nav.map(([t, h, k]) => `<a href="${h}"${k && k === actief ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
    <a class="pil" href="mailto:${SITE.mail}">Contact</a>
    <button class="menuknop" type="button" aria-label="Menu openen" aria-expanded="false" aria-controls="menu">${hamburger}</button>
  </div>
</header>
<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu">
  <div class="boven">${logo('vivo-horizontaal', 'logo-svg')}<button class="menuknop" type="button" aria-label="Menu sluiten" data-sluit>${kruis}</button></div>
  <ul>${nav.map(([t, h]) => `<li><a href="${h}" data-sluit>${t}</a></li>`).join('')}</ul>
  <p class="onder">Een website laten maken?<br><a href="mailto:${SITE.mail}">${SITE.mail}</a></p>
</div>`;
}

function slot(r) {
  return `<section class="blok donker slot" id="contact" aria-labelledby="contact-kop">
  ${logo('vivo-beeldmerk', 'spookmerk')}
  <div class="w">
    <span class="label">Contact</span>
    <h2 id="contact-kop">Klaar voor een website die werkt?</h2>
    <div class="knoppen"><a class="pil" href="mailto:${SITE.mail}?subject=Kennismaking%20ViVo">Plan een kennismaking</a><a class="cirkel" href="mailto:${SITE.mail}"><span class="rond">${pijl}</span>${SITE.mail}</a></div>
  </div>
</section>
<footer class="voet donker">
  <div class="w">
    <a class="logo" href="${r || './'}" aria-label="ViVo — naar de homepage">${logo('vivo-horizontaal')}</a>
    <nav aria-label="Footer"><a href="${r}#werk">Werk</a><a href="${r}#diensten">Diensten</a><a href="${r}#werkwijze">Werkwijze</a><a href="${r}#contact">Contact</a></nav>
    <address><span>${esc(SITE.adres)}</span><span>${esc(SITE.postcode)} ${esc(SITE.plaats)}</span><a href="tel:${SITE.telefoonLink}">${esc(SITE.telefoon)}</a><a href="mailto:${SITE.mail}">${SITE.mail}</a><span>KvK ${esc(SITE.kvk)}</span>${SITE.btw ? `<span>Btw ${esc(SITE.btw)}</span>` : ''}</address>
    <small>© ${SITE.jaar} ${esc(SITE.bedrijf)} · <a href="${r}privacy/">Privacy</a> · <a href="${r}voorwaarden/">Voorwaarden</a>${MEET.meten ? ` · <a href="${r}cookies/">Cookies</a> · <a href="#" data-cookie-instellingen>Cookie-instellingen</a>` : ''}</small>
  </div>
</footer>`;
}

function pagina({ titel, beschrijving, r, pad, inhoud, actief, donkereKop }) {
  const url = `${SITE.url}${pad}`;
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titel)}</title>
<meta name="description" content="${esc(beschrijving)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(titel)}">
<meta property="og:description" content="${esc(beschrijving)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="nl_NL">
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="${r}favicon.svg" type="image/svg+xml">
<!-- Lettertypes zelf gehost (AVG: geen verzoeken naar Google) -->
<link rel="preload" href="${r}fonts/Geist-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${r}fonts/Geist-SemiBold.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${r}css/vivo.css">
</head>
<body>
${kop(r, actief, donkereKop)}
<main id="inhoud">
${inhoud}
</main>
${slot(r)}
<script src="${r}js/vivo.js" defer></script>${MEET.meten ? `
<script>window.VIVO_METEN = ${JSON.stringify({ ...METEN, pad: r })};</script>
<script src="${r}js/toestemming.js" defer></script>` : ''}
</body>
</html>
`;
}

// ── Homepage ──
function home() {
  const r = '';
  const show = CASES.find(c => c.uitgelicht) || CASES[0];
  const inhoud = `<section class="hero" aria-labelledby="hero-kop">
  ${logo('vivo-woordmerk', 'spook')}
  <div class="w inhoud">
    <span class="label">ViVo · webdesign &amp; development</span>
    <h1 id="hero-kop">Websites die werken.</h1>
    <div class="onder">
      <p>${SITE.intro}</p>
      <a class="cirkel" href="#werk"><span class="rond">${pijl}</span>Bekijk ons werk</a>
    </div>
  </div>
</section>

<section class="show" aria-label="Uitgelicht project">
  <div class="w">
    <a href="werk/${show.slug}/" style="text-decoration:none;display:block">${vlak(show, r, { eager: true })}</a>
    <div class="bijschrift"><span>Uitgelicht · ${esc(show.naam)}</span><span>${esc(show.soort)}</span></div>
  </div>
</section>

<section class="statement" aria-label="Over ViVo">
  <div class="w"><p>Eén aanspreekpunt, van eerste schets tot livegang. <span class="grijs">Persoonlijk, snel en zonder vakjargon — met een site die blijft werken.</span></p></div>
</section>

<section class="blok donker" id="diensten" aria-labelledby="diensten-kop">
  <div class="w">
    <div class="sectiekop"><div><span class="label">Wat we doen</span><h2 id="diensten-kop">Waar ViVo goed in is</h2></div><p>Klik een dienst open voor meer uitleg.</p></div>
    <div class="lijst">
      ${DIENSTEN.map((d, i) => `<details${i === 0 ? ' open' : ''}><summary><span class="nr">0${i + 1}</span><h3>${esc(d.titel)}</h3><span class="chev">${chevron}</span></summary><div class="uitleg"><span></span><div><p>${esc(d.tekst)}</p><div class="tags">${d.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div></div></div></details>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="blok" id="werk" aria-labelledby="werk-kop">
  <div class="w">
    <div class="sectiekop"><div><span class="label">Uitgelicht werk</span><h2 id="werk-kop">Recente projecten</h2></div><p>Elk project krijgt zijn eigen kleur — net als de merken waarvoor ViVo bouwt.</p></div>
    <div class="werk">
      ${CASES.map(c => `<a class="case" href="werk/${c.slug}/">${vlak(c, r)}<h3>${esc(c.naam)}</h3><p>${esc(c.kort)}</p><div class="tags">${c.rol.map(t => `<span>${esc(t)}</span>`).join('')}</div><span class="link">Bekijk case ${pijl}</span></a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="blok" id="werkwijze" style="padding-top:0" aria-labelledby="werkwijze-kop">
  <div class="w">
    <div class="sectiekop"><div><span class="label">Werkwijze</span><h2 id="werkwijze-kop">Zo werken we samen</h2></div></div>
    <div class="stappen">
      ${STAPPEN.map((s, i) => `<div class="stap"><span class="nr">0${i + 1}</span><h3>${esc(s.titel)}</h3><p>${esc(s.tekst)}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>`;
  return pagina({ titel: `${SITE.bedrijfKort} — Websites die werken`, beschrijving: SITE.beschrijving, r, pad: '/', inhoud });
}

// ── Case-pagina ──
function casePagina(c, i) {
  const r = relPad(2);
  const volgende = CASES[(i + 1) % CASES.length];
  const heeftPagina = existsSync(join(root, 'cases', c.slug, 'pagina.jpg'));
  const inhoud = `<section class="casekop" aria-labelledby="case-kop">
  <div class="w">
    <a class="label" href="${r}#werk" style="text-decoration:none">Werk · ${c.jaar}</a>
    <h1 id="case-kop">${esc(c.naam)}</h1>
    <p class="intro">${esc(c.intro)}</p>
    <dl class="feiten">
      <div><dt>Klant</dt><dd>${esc(c.klant)}</dd></div>
      <div><dt>Sector</dt><dd>${esc(c.sector)}</dd></div>
      <div><dt>Wat ViVo deed</dt><dd>${esc(c.rol.join(', '))}</dd></div>
      <div><dt>${c.live ? 'Website' : 'Status'}</dt><dd>${c.live ? `<a class="link" href="${c.live}" target="_blank" rel="noopener">${esc(c.live.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''))} ${pijl}</a>` : esc(c.status || '')}</dd></div>
    </dl>
  </div>
</section>

<section class="casebeeld" aria-label="Beeld van het project"><div class="w">${vlak(c, r, { eager: true })}</div></section>

<section class="blok" aria-label="Het verhaal">
  <div class="w verhaal">
    ${[['De opdracht', c.opdracht], ['De aanpak', c.aanpak], ['Het resultaat', c.resultaat]].map(([t, p], n) => `<div><span class="label">0${n + 1}</span><h2>${t}</h2><p>${esc(p)}</p></div>`).join('\n    ')}
  </div>
</section>

${heeftPagina ? `<section style="padding-bottom:var(--sectie)" aria-label="Scroll door de website">
  <div class="w"><div class="doorkijk" style="--case:${c.kleur};--case-tekst:${c.kleurTekst}"><div class="venster"><div class="balk"><i></i><i></i><i></i></div><div class="rol" tabindex="0" aria-label="Volledige pagina van ${esc(c.naam)}, scrollbaar"><img src="${r}img/cases/${c.slug}/pagina.jpg" alt="${esc(`De volledige homepage van ${c.naam}`)}" loading="lazy" width="1440"></div></div><p>Scroll door de site</p></div></div>
</section>` : ''}

${c.galerij ? `<section style="padding-bottom:var(--sectie)" aria-label="Schermen van ${esc(c.naam)}">
  <div class="w"><div class="doorkijk" style="--case:${c.kleur};--case-tekst:${c.kleurTekst}"><div class="galerij">${c.galerij.map(g => `<figure><div class="venster"><div class="balk"><i></i><i></i><i></i></div><img src="${r}img/cases/${c.slug}/${g.bestand}" alt="${esc(g.bijschrift)}" loading="lazy" width="1972" height="1150"></div><figcaption>${esc(g.bijschrift)}</figcaption></figure>`).join('')}</div>${c.galerijNoot ? `<p>${esc(c.galerijNoot)}</p>` : ''}</div></div>
</section>

` : ''}<a class="volgende" href="${r}werk/${volgende.slug}/"><div class="w"><span class="label">Volgende case</span><h2>${esc(volgende.naam)} ${pijl}</h2></div></a>`;
  return pagina({ titel: `${c.naam} — case | ${SITE.bedrijfKort}`, beschrijving: c.intro, r, pad: `/werk/${c.slug}/`, inhoud, actief: 'werk' });
}

// ── Juridische pagina's (privacy, voorwaarden) ──
// Tekst is platte tekst (veilig ge-escaped); daarna worden de vaste plaatshouders vervangen door links.
function opmaak(t, r) {
  return esc(t)
    .replace(/\{mail\}/g, `<a href="mailto:${SITE.mail}">${SITE.mail}</a>`)
    .replace(/\{tel\}/g, `<a href="tel:${SITE.telefoonLink}">${esc(SITE.telefoon)}</a>`)
    .replace(/\{adres\}/g, esc(volledigAdres()))
    .replace(/\{kvk\}/g, esc(SITE.kvk))
    .replace(/\{privacy\}/g, `<a href="${r}privacy/">privacyverklaring</a>`)
    .replace(/\{cookies\}/g, `<a href="${r}cookies/">cookieverklaring</a>`)
    .replace(/\{instellingen\}/g, '<a href="#" data-cookie-instellingen>Cookie-instellingen</a>')
    .replace(/\{marketingdiensten\}/g, opsomming([MEET.metaPixel && 'de Meta-pixel', MEET.googleAds && 'Google Ads'].filter(Boolean)))
    .replace(/\{meetpartijen\}/g, opsomming([MEET.google && 'Google (Google Ireland Ltd.)', MEET.metaPixel && 'Meta (Meta Platforms Ireland Ltd.)'].filter(Boolean)))
    .replace(/\{vsPartijen\}/g, opsomming(['GitHub', MEET.google && 'Google', MEET.metaPixel && 'Meta'].filter(Boolean)).replace(/ en ([^,]+)$/, ' of $1'))
    .replace(/\{ap\}/g, '<a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener">Autoriteit Persoonsgegevens</a>');
}
// Blok: string = alinea, array = opsomming, { tabel } = cookietabel, { als, blok|tekst } = alleen als de voorwaarde geldt
function blok(b, r) {
  if (b && !Array.isArray(b) && typeof b === 'object') {
    if (!geldt(b.als)) return '';
    if (b.tabel) {
      const rijen = b.tabel.map(x => Array.isArray(x) ? x : geldt(x.als) ? x.rij : null).filter(Boolean);
      return `<div class="jtabel"><table><thead><tr><th>Cookie</th><th>Doel</th><th>Bewaartermijn</th><th>Van</th></tr></thead><tbody>${rijen.map(rij => `<tr>${rij.map((c, i) => i ? `<td>${esc(c)}</td>` : `<td><code>${esc(c)}</code></td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    }
    return blok(b.blok ?? b.tekst, r);
  }
  if (Array.isArray(b)) { const items = b.filter(li => typeof li === 'string' || geldt(li.als)).map(li => typeof li === 'string' ? li : li.tekst); return `<ul>${items.map(li => `<li>${opmaak(li, r)}</li>`).join('')}</ul>`; }
  return `<p>${opmaak(b, r)}</p>`;
}
function juridischePagina(doc) {
  const r = relPad(1);
  const inhoud = `<section class="casekop" aria-labelledby="jur-kop">
  <div class="w">
    <span class="label">Laatst bijgewerkt · ${esc(doc.bijgewerkt)}</span>
    <h1 id="jur-kop">${esc(doc.titel)}</h1>
    <p class="intro">${esc(doc.intro)}</p>
  </div>
</section>
<section class="blok juridisch" style="padding-top:0">
  <div class="w"><div class="jtekst">
    ${doc.secties.filter(s => geldt(s.als)).map((s, i) => `<section aria-labelledby="j${i + 1}"><h2 id="j${i + 1}"><span>${String(i + 1).padStart(2, '0')}</span>${esc(s.titel)}</h2>${s.blokken.map(b => blok(b, r)).join('')}</section>`).join('\n    ')}
  </div></div>
</section>`;
  return pagina({ titel: `${doc.titel} | ${SITE.bedrijfKort}`, beschrijving: doc.intro, r, pad: `/${doc.slug}/`, inhoud });
}

// ── Schrijven ──
rmSync(uit, { recursive: true, force: true });
// Lettertypes: Geist uit het officiële npm-pakket (SIL OFL — licentie gaat mee)
const LETTERS = [['geist-sans/Geist-Regular.woff2', 'Geist', 400], ['geist-sans/Geist-Medium.woff2', 'Geist', 500], ['geist-sans/Geist-SemiBold.woff2', 'Geist', 600], ['geist-mono/GeistMono-Medium.woff2', 'Geist Mono', 500]];
const fontBron = join(root, 'node_modules/geist/dist/fonts');
if (!existsSync(fontBron)) throw new Error('Geist ontbreekt — draai eerst: npm install');
mkdirSync(join(uit, 'fonts'), { recursive: true });
for (const [p] of LETTERS) copyFileSync(join(fontBron, p), join(uit, 'fonts', p.split('/')[1]));
copyFileSync(join(root, 'node_modules/geist/LICENSE.txt'), join(uit, 'fonts', 'LICENSE.txt'));
const fontFace = LETTERS.map(([p, fam, w]) => `@font-face { font-family: '${fam}'; src: url('../fonts/${p.split('/')[1]}') format('woff2'); font-weight: ${w}; font-style: normal; font-display: swap; }`).join('\n');
schrijf('css/vivo.css', `${fontFace}\n${lees('huisstijl/tokens.css')}\n${lees('site/vivo.css')}`);
schrijf('js/vivo.js', lees('site/vivo.js'));
schrijf('favicon.svg', lees('merk/favicon/favicon.svg'));
schrijf('.nojekyll', '');
schrijf('index.html', home());
CASES.forEach((c, i) => schrijf(`werk/${c.slug}/index.html`, casePagina(c, i)));
for (const doc of [PRIVACY, VOORWAARDEN, ...(MEET.meten ? [COOKIES] : [])]) schrijf(`${doc.slug}/index.html`, juridischePagina(doc));
if (MEET.meten) schrijf('js/toestemming.js', lees('site/toestemming.js'));
for (const c of CASES) for (const f of ['desktop.jpg', 'mobiel.jpg', 'pagina.jpg', ...(c.galerij || []).map(g => g.bestand)]) {
  const bron = join(root, 'cases', c.slug, f);
  if (existsSync(bron)) { mkdirSync(join(uit, 'img/cases', c.slug), { recursive: true }); copyFileSync(bron, join(uit, 'img/cases', c.slug, f)); }
}
console.log(`${TEST ? 'docs-preview/meten-test/ (TEST-ID\'s)' : 'docs/'} gebouwd: homepage + ${CASES.length} case-pagina's + privacy + voorwaarden${MEET.meten ? ' + cookies (meten aan)' : ' (meten uit)'}`);
