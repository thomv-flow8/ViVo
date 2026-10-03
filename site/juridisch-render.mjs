// Opmaak van de juridische pagina's (privacy, voorwaarden, cookies) — gedeeld door bouw.mjs en preview-motion.mjs.
// Tekst is platte tekst (veilig ge-escaped); daarna worden vaste plaatshouders vervangen door links.
// Voorwaardelijke secties/blokken ({ als }) hangen af van de meet-ID's in SITE.meten (zie meetVlaggen).
import { SITE } from './inhoud.mjs';

export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const volledigAdres = () => `${SITE.adres}, ${SITE.postcode ? SITE.postcode + ' ' : ''}${SITE.plaats}`;
const opsomming = l => l.length > 1 ? l.slice(0, -1).join(', ') + ' en ' + l.at(-1) : (l[0] || '');

// Welke voorwaarden gelden, op basis van de ingevulde meet-ID's
export function meetVlaggen(meten = {}) {
  const M = { ga4: !!meten.ga4, googleAds: !!meten.googleAds, metaPixel: !!meten.metaPixel };
  M.google = M.ga4 || M.googleAds; M.marketing = M.googleAds || M.metaPixel; M.meten = M.ga4 || M.marketing; M.geenMeten = !M.meten;
  return M;
}

export function maakJuridisch(MEET) {
  const geldt = als => !als || !!MEET[als];
  const opmaak = (t, r) => esc(t)
    .replace(/\{mail\}/g, `<a href="mailto:${SITE.mail}">${SITE.mail}</a>`)
    .replace(/\{tel\}/g, `<a href="tel:${SITE.telefoonLink}">${esc(SITE.telefoon)}</a>`)
    .replace(/\{adres\}/g, esc(volledigAdres()))
    .replace(/\{kvk\}/g, esc(SITE.kvk))
    .replace(/\{privacy\}/g, `<a href="${r}privacy/">privacyverklaring</a>`)
    .replace(/\{voorwaarden\}/g, `<a href="${r}voorwaarden/">algemene voorwaarden</a>`)
    .replace(/\{cookies\}/g, `<a href="${r}cookies/">cookieverklaring</a>`)
    .replace(/\{instellingen\}/g, '<a href="#" data-cookie-instellingen>Cookie-instellingen</a>')
    .replace(/\{marketingdiensten\}/g, opsomming([MEET.metaPixel && 'de Meta-pixel', MEET.googleAds && 'Google Ads'].filter(Boolean)))
    .replace(/\{meetpartijen\}/g, opsomming([MEET.google && 'Google (Google Ireland Ltd.)', MEET.metaPixel && 'Meta (Meta Platforms Ireland Ltd.)'].filter(Boolean)))
    .replace(/\{vsPartijen\}/g, opsomming(['GitHub', MEET.google && 'Google', MEET.metaPixel && 'Meta'].filter(Boolean)).replace(/ en ([^,]+)$/, ' of $1'))
    .replace(/\{ap\}/g, '<a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener">Autoriteit Persoonsgegevens</a>');
  // Blok: string = alinea, array = opsomming, { tabel } = cookietabel, { als, blok|tekst } = alleen als de voorwaarde geldt
  const blok = (b, r) => {
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
  };
  // Kop + tekst van één juridische pagina (r = pad naar de root van de site)
  const inhoud = (doc, r) => `<section class="casekop" aria-labelledby="jur-kop">
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
  return { geldt, inhoud };
}
