// ViVo — cookiemelding en toestemming (AVG/Telecommunicatiewet).
// Werkt alleen als de bouw window.VIVO_METEN zet (alleen bij ingevulde meet-ID's in site/inhoud.mjs).
// - Niets laden vóór toestemming: Google (gtag) en Meta-pixel komen pas binnen na een 'ja' (basic consent mode).
// - Weigeren is net zo makkelijk als accepteren; geen vooraf aangevinkte vakjes.
// - Keuze 12 maanden onthouden (localStorage); daarna opnieuw vragen. Wijzigen via [data-cookie-instellingen].
// - Google Consent Mode v2: standaard alles 'denied', bij toestemming 'update'.
(() => {
  const M = window.VIVO_METEN;
  if (!M) return;
  const SLEUTEL = 'vivo-toestemming', VERSIE = 1, GELDIG = 365 * 24 * 3600 * 1000;
  const heeft = { statistiek: !!M.ga4, marketing: !!(M.googleAds || M.metaPixel) };

  // Consent Mode v2: standaardstand vóór alles
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });

  const lees = () => {
    try {
      const k = JSON.parse(localStorage.getItem(SLEUTEL));
      return k && k.versie === VERSIE && Date.now() - k.datum < GELDIG ? k : null;
    } catch { return null; }
  };
  const bewaar = k => { try { localStorage.setItem(SLEUTEL, JSON.stringify({ ...k, versie: VERSIE, datum: Date.now() })); } catch {} };

  const laadScript = src => { const s = document.createElement('script'); s.async = true; s.src = src; document.head.appendChild(s); };
  let gtagGeladen = false, metaGeladen = false;
  function pasToe(k) {
    gtag('consent', 'update', {
      analytics_storage: k.statistiek ? 'granted' : 'denied',
      ad_storage: k.marketing ? 'granted' : 'denied',
      ad_user_data: k.marketing ? 'granted' : 'denied',
      ad_personalization: k.marketing ? 'granted' : 'denied',
    });
    if (M.test) { console.info('[ViVo] testmodus — toestemming:', k); return; } // preview: geen echte scripts
    const ga = k.statistiek && M.ga4, ads = k.marketing && M.googleAds;
    if ((ga || ads) && !gtagGeladen) {
      gtagGeladen = true;
      laadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(M.ga4 || M.googleAds));
      gtag('js', new Date());
    }
    if (ga) gtag('config', M.ga4);
    if (ads) gtag('config', M.googleAds);
    if (k.marketing && M.metaPixel && !metaGeladen) {
      metaGeladen = true;
      const f = window.fbq = function () { f.callMethod ? f.callMethod.apply(f, arguments) : f.queue.push(arguments); };
      if (!window._fbq) window._fbq = f;
      f.push = f; f.loaded = true; f.version = '2.0'; f.queue = [];
      laadScript('https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', M.metaPixel); fbq('track', 'PageView');
    }
  }

  // Bij intrekken: cookies van derden op dit domein opruimen en herladen (geladen scripts zijn niet te 'ontladen')
  function ruimOp() {
    document.cookie.split(';').map(c => c.split('=')[0].trim()).filter(n => /^(_ga|_gid|_gat|_gcl|_fbp|_fbc)/.test(n)).forEach(n => {
      const d = location.hostname.split('.').slice(-2).join('.');
      for (const domein of ['', '; domain=' + location.hostname, '; domain=.' + d]) document.cookie = n + '=; Max-Age=0; path=/' + domein;
    });
  }

  // ── De melding ──
  const cat = (naam, titel, tekst) => heeft[naam]
    ? `<label class="tm-cat"><input type="checkbox" name="${naam}"><span><b>${titel}</b>${tekst}</span></label>` : '';
  const el = document.createElement('div');
  el.className = 'toestemming';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'false');
  el.setAttribute('aria-labelledby', 'tm-kop');
  el.hidden = true;
  el.innerHTML = `<h2 id="tm-kop">Cookies</h2>
    <p>We gebruiken cookies om te zien hoe de site wordt gebruikt${heeft.marketing ? ' en om onze advertenties te meten en relevanter te maken' : ''}. Alleen als jij dat goed vindt. <a href="${M.pad}cookies/">Meer over cookies</a></p>
    <form class="tm-keuze" hidden>
      <label class="tm-cat"><input type="checkbox" checked disabled><span><b>Noodzakelijk</b>Onthoudt je cookiekeuze. Altijd aan.</span></label>
      ${cat('statistiek', 'Statistiek', 'Google Analytics: welke pagina’s worden bezocht en hoe.')}
      ${cat('marketing', 'Marketing', 'Meta en Google Ads: advertenties meten en tonen aan bezoekers van deze site.')}
    </form>
    <div class="tm-knoppen">
      <button type="button" class="pil" data-tm="alles">Alles accepteren</button>
      <button type="button" class="pil tm-tweede" data-tm="weiger">Alleen noodzakelijk</button>
      <button type="button" class="tm-link" data-tm="instellen">Instellen</button>
      <button type="button" class="pil" data-tm="opslaan" hidden>Keuze opslaan</button>
    </div>`;
  document.body.appendChild(el);
  const form = el.querySelector('.tm-keuze');
  const knop = n => el.querySelector(`[data-tm="${n}"]`);

  function toon(metKeuze) {
    const k = lees() || { statistiek: false, marketing: false };
    form.querySelectorAll('input[name]').forEach(i => { i.checked = !!k[i.name]; });
    form.hidden = !metKeuze; knop('instellen').hidden = metKeuze; knop('opslaan').hidden = !metKeuze;
    el.hidden = false;
    (metKeuze ? form.querySelector('input[name]') || knop('opslaan') : knop('alles')).focus({ preventScroll: true });
  }
  function kies(k) {
    const oud = lees();
    k = { statistiek: heeft.statistiek && !!k.statistiek, marketing: heeft.marketing && !!k.marketing };
    bewaar(k);
    el.hidden = true;
    const ingetrokken = oud && ((oud.statistiek && !k.statistiek) || (oud.marketing && !k.marketing));
    if (ingetrokken) { ruimOp(); location.reload(); return; }
    pasToe(k);
  }
  knop('alles').addEventListener('click', () => kies({ statistiek: true, marketing: true }));
  knop('weiger').addEventListener('click', () => kies({ statistiek: false, marketing: false }));
  knop('instellen').addEventListener('click', () => toon(true));
  knop('opslaan').addEventListener('click', () => kies(Object.fromEntries([...form.querySelectorAll('input[name]')].map(i => [i.name, i.checked]))));
  document.querySelectorAll('[data-cookie-instellingen]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); toon(true); }));

  const k = lees();
  if (k) pasToe(k); else toon(false);
})();
