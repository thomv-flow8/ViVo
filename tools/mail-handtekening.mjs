// Maakt de beelden voor de e-mailhandtekening (PNG op 2x — e-mailclients tonen geen SVG) en de handtekening zelf.
// Uitvoer: beelden/mail/*.png  →  door publiceer-preview.mjs naar docs/mail/ (publieke URL's, nodig in e-mail)
//          handtekening/*.html — drie varianten om uit te kiezen + handtekening/index.html als overzicht
// Draaien: node tools/mail-handtekening.mjs   (daarna npm run bouw en pushen, zodat de beelden live staan)
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE } from '../site/inhoud.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const uit = join(root, 'beelden/mail'), hUit = join(root, 'handtekening');
mkdirSync(uit, { recursive: true }); mkdirSync(hUit, { recursive: true });
const svg = n => readFileSync(join(root, 'merk/svg', n), 'utf8').replace(/ width="[^"]+" height="[^"]+"/, '');
const BASIS = `${SITE.basis}/mail`;

const browser = await chromium.launch();
// Beeld renderen op 2x: in de mail staat het op de halve breedte, dus scherp op elk scherm
async function maak(naam, breed, hoog, html, achtergrond = 'transparent') {
  const p = await browser.newPage({ viewport: { width: breed, height: hoog }, deviceScaleFactor: 2 });
  await p.setContent(`<body style="margin:0;width:${breed}px;height:${hoog}px;background:${achtergrond};font-family:-apple-system,'Helvetica Neue',Arial,sans-serif">${html}</body>`);
  await p.waitForTimeout(120);
  await p.screenshot({ path: join(uit, naam + '.png'), omitBackground: achtergrond === 'transparent' });
  await p.close();
  console.log(`✓ beelden/mail/${naam}.png  ${breed}×${hoog} (2x)`);
}

// 1. Logo: beeldmerk + woordmerk, zwart op transparant
await maak('logo', 150, 44, `<div style="height:44px;display:flex;align-items:center;gap:11px">
  <div style="width:30px">${svg('vivo-beeldmerk-zwart.svg').replace('<svg ', '<svg style="width:100%;height:auto;display:block" ')}</div>
  <div style="width:74px">${svg('vivo-woordmerk-zwart.svg').replace('<svg ', '<svg style="width:100%;height:auto;display:block" ')}</div>
</div>`);

// 2. Beeldmerk alleen (compacte variant)
await maak('beeldmerk', 48, 48, `<div style="width:48px;height:48px;display:grid;place-items:center">
  <div style="width:40px">${svg('vivo-beeldmerk-zwart.svg').replace('<svg ', '<svg style="width:100%;height:auto;display:block" ')}</div></div>`);

// 3. Banner: donkere strook met het merk en de pay-off — klikbaar naar de website
await maak('banner', 520, 96, `<div style="width:520px;height:96px;background:#15171c;display:flex;align-items:center;justify-content:space-between;padding:0 26px;box-sizing:border-box">
  <div>
    <div style="color:#f5f6f8;font-size:19px;font-weight:600;letter-spacing:-.4px;line-height:1.25">Websites die werken.</div>
    <div style="color:#9aa0ab;font-size:12.5px;margin-top:4px;letter-spacing:.2px">Webdesign &amp; development · Gorinchem</div>
  </div>
  <div style="display:flex;align-items:center;gap:9px">
    <div style="width:22px">${svg('vivo-beeldmerk-wit.svg').replace('<svg ', '<svg style="width:100%;height:auto;display:block" ')}</div>
    <div style="width:54px">${svg('vivo-woordmerk-wit.svg').replace('<svg ', '<svg style="width:100%;height:auto;display:block" ')}</div>
  </div>
</div>`, '#15171c');

await browser.close();

// ── De handtekeningen ──
// Opbouw met <table>: Outlook (Word-rendering) kan geen flexbox of grid. Alle opmaak staat inline.
const L = { inkt: '#0a0b0d', grijs: '#646a76', lijn: '#dcdee3', nacht: '#15171c' };
const F = `-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif`;
const link = (tekst, url, extra = '') => `<a href="${url}" style="color:${L.inkt};text-decoration:none;${extra}">${tekst}</a>`;
const grijsLink = (tekst, url) => `<a href="${url}" style="color:${L.grijs};text-decoration:none">${tekst}</a>`;
const banner = `<a href="${SITE.url}?utm_source=mailhandtekening" style="text-decoration:none;display:inline-block">
            <img src="${BASIS}/banner.png" alt="ViVo — Websites die werken. Webdesign &amp; development, Gorinchem" width="520" height="96" style="display:block;border:0;outline:none;text-decoration:none;max-width:100%;height:auto;border-radius:10px">
          </a>`;
const naam = 'Thomas Vink', functie = 'Webdesign &amp; development';

const VARIANTEN = {
  'a-compleet': {
    titel: 'A · Compleet',
    uitleg: 'Logo links, gegevens rechts, banner eronder. De meest complete variant — goed voor een eerste mail aan een nieuwe klant.',
    html: `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${F};font-size:14px;line-height:1.5;color:${L.inkt};border-collapse:collapse">
  <tr>
    <td width="170" style="width:170px;padding:0 20px 0 0;vertical-align:top">
      <img src="${BASIS}/logo.png" alt="ViVo" width="150" height="44" style="display:block;border:0">
    </td>
    <td style="padding:0 0 0 20px;border-left:1px solid ${L.lijn};vertical-align:top">
      <div style="font-size:15px;font-weight:600;color:${L.inkt}">${naam}</div>
      <div style="font-size:13px;color:${L.grijs};padding-top:2px">${functie}</div>
      <div style="padding-top:11px;font-size:13.5px;color:${L.grijs};line-height:1.7">
        ${link(SITE.telefoon, 'tel:' + SITE.telefoonLink)}<br>
        ${link(SITE.mail, 'mailto:' + SITE.mail)}<br>
        ${link('vivoproducts.nl', SITE.url + '?utm_source=mailhandtekening', 'font-weight:600')}
      </div>
    </td>
  </tr>
  <tr><td colspan="2" style="padding:20px 0 0">${banner}</td></tr>
  <tr><td colspan="2" style="padding:12px 0 0;font-size:11.5px;color:${L.grijs};line-height:1.6">
    ${SITE.adres}, ${SITE.postcode} ${SITE.plaats} · KvK ${SITE.kvk}
  </td></tr>
</table>`,
  },
  'b-compact': {
    titel: 'B · Compact',
    uitleg: 'Eén regel met het beeldmerk, je naam en de gegevens eronder. Geen banner — prettig in een lopend gesprek, waar de handtekening niet elke keer groot in beeld moet.',
    html: `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${F};font-size:14px;line-height:1.5;color:${L.inkt};border-collapse:collapse">
  <tr>
    <td style="padding:0 14px 0 0;vertical-align:top">
      <img src="${BASIS}/beeldmerk.png" alt="ViVo" width="34" height="34" style="display:block;border:0">
    </td>
    <td style="vertical-align:top">
      <div style="font-size:15px;font-weight:600;color:${L.inkt}">${naam}<span style="color:${L.grijs};font-weight:400"> · ViVo</span></div>
      <div style="padding-top:5px;font-size:13.5px;color:${L.grijs}">
        ${grijsLink(SITE.telefoon, 'tel:' + SITE.telefoonLink)} &nbsp;·&nbsp;
        ${grijsLink(SITE.mail, 'mailto:' + SITE.mail)} &nbsp;·&nbsp;
        ${link('vivoproducts.nl', SITE.url + '?utm_source=mailhandtekening', 'font-weight:600')}
      </div>
    </td>
  </tr>
</table>`,
  },
  'c-banner': {
    titel: 'C · Banner boven',
    uitleg: 'De banner bovenaan, gegevens eronder. Het merk valt het meest op — goed voor offertes en aanbiedingen.',
    html: `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${F};font-size:14px;line-height:1.5;color:${L.inkt};border-collapse:collapse">
  <tr><td style="padding:0 0 18px">${banner}</td></tr>
  <tr>
    <td>
      <div style="font-size:15px;font-weight:600;color:${L.inkt}">${naam}</div>
      <div style="font-size:13px;color:${L.grijs};padding-top:2px">${functie}</div>
      <div style="padding-top:10px;font-size:13.5px;color:${L.grijs}">
        ${grijsLink(SITE.telefoon, 'tel:' + SITE.telefoonLink)} &nbsp;·&nbsp;
        ${grijsLink(SITE.mail, 'mailto:' + SITE.mail)} &nbsp;·&nbsp;
        ${link('vivoproducts.nl', SITE.url + '?utm_source=mailhandtekening', 'font-weight:600')}
      </div>
      <div style="padding-top:10px;font-size:11.5px;color:${L.grijs}">
        ${SITE.adres}, ${SITE.postcode} ${SITE.plaats} · KvK ${SITE.kvk}
      </div>
    </td>
  </tr>
</table>`,
  },
};

for (const [sleutel, v] of Object.entries(VARIANTEN)) {
  writeFileSync(join(hUit, sleutel + '.html'), `<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>ViVo-handtekening ${v.titel}</title></head><body style="margin:0;padding:24px;background:#fff">\n${v.html}\n</body></html>\n`);
}

// Overzichtspagina om te kiezen
writeFileSync(join(hUit, 'index.html'), `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>ViVo — e-mailhandtekening</title><style>
  body { margin:0; padding:40px 24px 80px; background:#f3f4f6; font:16px/1.6 ${F}; color:#0a0b0d; }
  .w { max-width: 780px; margin: 0 auto; }
  h1 { font-size: 28px; margin: 0 0 8px; letter-spacing: -.5px; }
  .in { color:#646a76; margin: 0 0 36px; }
  .kaart { background:#fff; border-radius:14px; padding:28px; margin-bottom:22px; box-shadow:0 1px 3px rgba(10,11,13,.08); }
  h2 { font-size:19px; margin:0 0 6px; } .u { color:#646a76; font-size:14px; margin:0 0 22px; }
  .proef { border:1px solid #dcdee3; border-radius:10px; padding:22px; background:#fff; overflow-x:auto; }
  .hoe { background:#15171c; color:#f5f6f8; border-radius:14px; padding:28px; margin-top:34px; }
  .hoe h2 { color:#fff; } .hoe ol { margin:0; padding-left:20px; color:#c9cdd4; } .hoe li { margin-bottom:8px; }
  code { background:rgba(255,255,255,.1); padding:2px 6px; border-radius:4px; font-size:13px; }
</style></head><body><div class="w">
<h1>E-mailhandtekening</h1>
<p class="in">Drie varianten. Open het losse bestand van je keuze, selecteer alles (⌘A), kopieer (⌘C) en plak het in je mailprogramma.<br><small style='color:#8a9099'>Hieronder staan de beelden lokaal; in de losse bestanden staan ze op vivoproducts.nl, zodat ze bij de ontvanger laden.</small></p>
${Object.entries(VARIANTEN).map(([s, v]) => `<div class="kaart"><h2>${v.titel}</h2><p class="u">${v.uitleg} — <a href="${s}.html">los openen om te kopiëren</a></p><div class="proef">${v.html.split(BASIS).join('../beelden/mail')}</div></div>`).join('\n')}
<div class="hoe"><h2>Instellen in Apple Mail</h2><ol>
  <li>Open het bestand van je keuze (bijvoorbeeld <code>a-compleet.html</code>) in Safari.</li>
  <li>Selecteer alles met ⌘A en kopieer met ⌘C.</li>
  <li>Mail → Instellingen → Handtekeningen → <b>+</b> om een nieuwe te maken.</li>
  <li>Verwijder de standaardtekst en plak met <b>⌘V</b>. Gebruik niet ⇧⌥⌘V, want dan verdwijnt de opmaak.</li>
  <li>Zet <b>"Gebruik altijd het standaardlettertype"</b> <i>uit</i>, anders vervalt de opmaak.</li>
  <li>Kies bij je account welke handtekening standaard wordt gebruikt.</li>
</ol></div>
<div class="hoe"><h2>Instellen in Outlook of Gmail</h2><ol>
  <li><b>Outlook:</b> Instellingen → E-mail → Opstellen en beantwoorden → Handtekening → plakken met ⌘V.</li>
  <li><b>Gmail:</b> Instellingen → Alle instellingen → Handtekening → Nieuwe maken → plakken met ⌘V.</li>
  <li>De beelden staan op <code>vivoproducts.nl</code>, dus ze laden overal — zolang de ontvanger beelden toont.</li>
</ol></div>
</div></body></html>\n`);
console.log(`✓ handtekening/index.html + ${Object.keys(VARIANTEN).length} varianten`);
