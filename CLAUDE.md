# ViVo — projectcontext voor Claude Code

Eigen website van **ViVo Products** (merknaam naar buiten: **ViVo**): Thomas biedt hier zijn
diensten aan als websitebouwer. Eigenaar en ontwikkelaar: Thomas.

**Taal: alle communicatie én alle sitetekst is Nederlands.**

## Werkwijze

Volg de skill `projectontwikkeling-werkwijze`: Analyse → Gevolgen → Oplossing → Uitvoering.
Preview vóór visuele wijzigingen, akkoord van Thomas vóór grote stappen, commit en push.

## Preview

`node tools/serve.mjs` → http://localhost:5178/ (hele project, juiste MIME-types voor SVG/fonts).
Ook als `vivo-preview` in `.claude/launch.json`.

## Fasering

1. Projectbasis (map, git, skill `svg-logo-designer` in `.claude/skills/`) — klaar
2. Logo: concepten → keuze → verfijning (lockups, licht/donker, favicon) — klaar, akkoord Thomas 3 okt 2026
3. Huisstijl — **klaar (3 okt 2026)**. Canoniek: **`huisstijl/tokens.css`** — gebruik die tokens, geen losse waarden.
   Besluiten: neutraal en **koel**, **geen accentkleur** (kleur komt uit de cases), **hero licht**,
   **Geist** (+ Geist Mono voor labels). Opbouw: mix Baunfire + Clay zoals `huisstijl/ronde3.html`.
   - Voorbeeld van Thomas: **baunfire.com** (warm antraciet, één fel accent, grote vette koppen, kleine
     ruim gespatieerde labels, lichte tekst, spookletters, rond menuknopje). Sfeer: premium & rustig +
     toegankelijk & warm + uitgesproken.
   - `huisstijl/genereer-huisstijl.mjs` → `huisstijl/ronde1.html`: mini-homepage met 3 richtingen
     (A Rustig/Manrope, B Baunfire/Montserrat+Barlow, C Gedurfd/Archivo breed) × 4 accenten.
   - Thomas wil geen 1-op-1-kopie van Baunfire → mix met **clay.global** (licht, één vette krappe letter,
     pilknop, projectvlakken in projectkleur, diensten als uitklaplijst, tags + "Bekijk case →").
     `huisstijl/genereer-ronde2.mjs` → `huisstijl/ronde2.html`: de mix + ViVo-eigen details (labels in
     monospace, chevron uit het logo als uitklappijl). Schakelaars: hero licht/donker × Geist/Inter Tight/Manrope × accent.
   - **Besluit Thomas (3 okt 2026): kleuraanpak van Clay** — géén eigen accentkleur; de site is neutraal,
     de kleur komt uit de cases (projectvlakken in projectkleur). **Lettertype: Geist** (labels Geist Mono).
     `huisstijl/genereer-ronde3.mjs` → `huisstijl/ronde3.html` (schakelaars hero licht/donker, basis warm/koel).
   - Live site: lettertypes **zelf hosten** (geen Google Fonts-CDN, AVG). Neue Plak (Baunfire) is betaald.
4. Siteconcept → preview → bouw — **bezig**
   - Domein **vivoproducts.nl** (DNS bij Strato; mail info@ loopt via Strato — MX-records nooit aanraken).
     Contact op de site: **info@vivoproducts.nl**. Hosting: **GitHub Pages, main → /docs** (staat aan sinds 3 okt 2026):
     https://thomv-flow8.github.io/ViVo/ — alleen de site wordt gepubliceerd, niet de logo-/huisstijlrondes.
     **Elke push naar main = live.**
   - Opzet (akkoord Thomas): homepage (hero, showcase, statement, diensten, werk, werkwijze, contact)
     **én** meteen case-pagina's. 'Bekijk case' → eigen case-pagina, met link naar de live site.
   - Cases: **Flow8** (eigen product, blauw #4f6ef5), **THNK** thnkmusic.com (zwart, Archivo),
     **DELPHI** sleutelbeheersystemen.nl (licht + blauw #0071e3, Inter), **Huidzorg Mozi**
     thomv-flow8.github.io/Mozi (crème #f5ebdf, Cormorant + Jost) — label **'In ontwikkeling'**.
     Klanten (DELPHI, Mozi) om toestemming vragen vóór publicatie; Mozi toont een foto van de eigenaar.
   - Schermafbeeldingen: `npm run screenshots` (Playwright) → `cases/<slug>/` desktop.jpg, mobiel.jpg,
     pagina.jpg. Cookiemeldingen/review-balken worden alleen in de opname verborgen, nooit aangeklikt.
     pagina.jpg = scherm-voor-scherm gestikt met reducedMotion (Chrome's fullPage liet scroll-animaties
     en grafische lagen buiten beeld leeg) — controleer na elke nieuwe opname of niets leeg is.
     Flow8 zit achter een login: Thomas levert de opnames aan (Safari, 2000×1293).
   - **Privacy (AVG): Flow8-opnames bevatten ECHTE klantgegevens.** Ruwe opnames staan in
     `cases/*/bron/` (gitignored, nooit committen). `node tools/flow8-beelden.mjs` snijdt de Safari-balk weg en
     vervaagt namen, adressen en monteurs → `cases/flow8/*.jpg`. **Controleer elk nieuw beeld visueel vóór gebruik.**
   - **Site bouwen: `npm run bouw`** → `docs/` (nooit met de hand in docs/ werken). Bron: `site/inhoud.mjs`
     (alle teksten en cases — CONCEPT, Thomas beoordeelt), `site/vivo.css` (alleen tokens gebruiken),
     `site/vivo.js` (mobiel menu), `site/bouw.mjs` (sjablonen). Preview: http://localhost:5178/docs/
   - Lettertypes: **zelf gehost** uit npm-pakket `geist` (bouw kopieert Geist 400/500/600 + Mono 500 + LICENSE
     naar docs/fonts) — geen externe verzoeken. `npm install` is nodig vóór `npm run bouw`.
   - **Motion-preview v4 (nog niet live):** `node site/preview-motion.mjs` → `docs-preview/motion.html` (gitignored).
     GSAP 3.15 + ScrollTrigger en Simple Icons (CC0) via npm; bij livegang zelf meeleveren, geen CDN.
     Besluiten Thomas: hero donker + kleine scroll-aanwijzing. Diensten (model clay.global/services, zes stuks) met
     **foto's** naast de tekst die organisch meebewegen, en **grote zachte 3D-vormen** (kubus, bol, kegel, schijven) op de
     achtergrond. Tijdlijn **in kleur** (blauw #4f6ef5, paars #8b5cf6, oranje #ff7a45, groen #1fb874) — 'world class'.
     Cases elk een eigen startbeeld: THNK schermvullend, DELPHI tablet + inzoomen, Mozi browservenster, Flow8 schermvullend.
     Let op in CSS: geen %-padding in absolute elementen van een compositie (rekent met de vakbreedte).
     Altijd: prefers-reduced-motion → geen animaties/pin, tijdlijn direct volledig.
   - **v5 (feedback Thomas):** vaste kopbalk (mix-blend-mode: difference) waarin het logo bij scrollen krimpt tot het
     beeldmerk in een cirkel (Baunfire); scroll-aanwijzing rechtsonder; zachte vormen = **Higgsfield-renders**
     (`beelden/vormen/`, transparant, prompts in `beelden/vormen/PROMPTS.md`) die **constant langzaam** bewegen, niet door
     scrollen; géén schijven met groene stip; lichte afsluiting **Laten we praten** met grote langzaam bewegende lus (Clay);
     Mozi = tablet + telefoon (scrollen, geen zoom); Flow8 start met inloggen → rapportage → planning → route → kaart.
   - **v9:** onderaan weer de **Higgsfield-render `lus-donker.png`** (zoals v6) in het donkere slotblok, langzaam bewegend
     met GSAP — die oogde rijker dan de three.js-buis (keuze Thomas). De 3D-vormen bij de diensten blijven three.js.
     3D-vormen bij de diensten staan **links en rechts van het midden** (afwisselend, tussen tekst en foto), niet in lijn met de foto's.
     Overgang Werkwijze → Projecten compacter (Live → kop 306 → 132 px). Let op: `section.blok` uit vivo.css weegt
     zwaarder dan een losse klasse — overschrijf padding met `section.<klasse>`.
   - **v10:** 3D-vormen horizontaal **gecentreerd boven de foto** (calc op de kolommen 1fr/1.05fr + `--dgap`), op mobiel
     tussen tekst en foto; draaien trager (0,2 rad/s). Beelden komen **eenmalig binnen bij het eerste scrollen** (Clay:
     opacity + 32px omhoog + schaal .93→1, `cubic-bezier(.16,1,.3,1)`, pas na het laden van het beeld) via `.onthul` —
     gebruik losse `translate`/`scale`, want GSAP zet `scale: none` inline op elementen die het transformeert (zet
     `.onthul` dus op een eigen laag). **Projecten op lichtgrijs `--papier-2`** (Clay); DELPHI-vlak daar wit.
   - **v11 (Clay-diensten):** dienstbeelden **staand 3:4, scherpe hoeken**, aan de buitenrand van de kolom (max 500 px);
     mobiel 4:5. **Eén doorlopende renderreeks v4** (staand gerenderd, zelfde compositie/camera/licht, één kleur per dienst —
     vaste prompt in `beelden/diensten/PROMPTS.md`). Gemengde beeldsoorten (Flow8-schermen, foto) gaven te weinig balans;
     de optie staat nog in `BEELD` in preview-motion.mjs. 3D-vormen blijven **wit** zoals bij Clay, op 42% (±148 px van het midden).
     Geen infade bij de dienstbeelden (wel bij projecten). Menu: **glijdende pil** bij hover (stijl Contact-knop).
     Flow8-projectkaart: modus **`scherm`** — scherm als zwevende kaart in de juiste verhouding, niets valt weg.
   - **Homepage = de motion-site (akkoord Thomas 3 okt 2026):** `npm run bouw` = bouw.mjs → preview-motion.mjs →
     `site/publiceer-preview.mjs`, die `docs-preview/motion.html` als **`docs/index.html`** publiceert (paden omgezet, titel/og/favicon,
     zonder previewlabel; beelden, three.js ongebundeld, GSAP, drie.js mee; elke lokale verwijzing wordt gecontroleerd).
     `docs/preview/` stuurt door naar de homepage. Case- en juridische pagina's (bouw.mjs) hebben hetzelfde menu:
     Diensten · Techniek · Werkwijze · Projecten · Contact. Importmap-adressen moeten met `./` beginnen.
     **Hero-intro (Baunfire):** wit + zwarte VIVO-letters → donker vlak schuift van links naar rechts → label per letter,
     kop per woord. Vangnet: na 6 s verdwijnt het witte vlak ook zonder JS. Chevron bij laden plat, pas 3D bij scrollen.
     Mobiel menu: menuknop + uitklapmenu (gedrag uit `docs/js/vivo.js`).
   - **Case-pagina's, aanpak B — live voor alle vier (akkoord Thomas 3 okt 2026):** gegenereerd in `site/preview-motion.mjs`
     (`casePagina`) → `docs-preview/case-<slug>.html` → door `publiceer-preview.mjs` naar `docs/werk/<slug>/` (paden, titel/og,
     elke verwijzing gecontroleerd). Status (Mozi, Flow8) als label in de hero; Flow8 zonder telefoon/volledige pagina krijgt
     een galerij met de (vervaagde) schermen + noot; `HERO_BEELD`/`HERO_KLEUR` voor uitzonderingen (DELPHI-hero wit).
     Logo's van Thomas: `cases/delphi/logo.png`, `cases/mozi/logo.png` (THNK/Flow8: naam als tekst). Oude case-sjabloon in
     bouw.mjs wordt overschreven; privacy/voorwaarden/cookies gebruiken nog het oude sjabloon (kopbalk zonder cursor/pil).
     Gedeeld: met gedeelde `CSS`, `KOP(thuis)`, `AFSLUITER(thuis)`, `CURSOR_CSS/JS`. Hero in projectkleur
     met tablet + telefoon die **schuin blijven**; verhaal compact op zwart (3 kolommen); scrollvenster zoals vroeger (zelf
     scrollen, `.doorkijk`); telefoon iPhone Plus-formaat; compacte "volgende case". Klantlogo: `cases/<slug>/logo.png`
     (DELPHI uitgesneden uit de eigen opname). `naamKop` = naam met vast afbreekpunt (\u00ad) voor grote koppen.
     Infades via `.onthul` (IntersectionObserver) — níet via ScrollTrigger-start, die mist bij lazy beelden.
   - **Tweede cursor (Baunfire):** `.muiscirkel` volgt de muis, groeit boven links/knoppen/beelden; alleen met muis, niet
     bij minder beweging. Let op: `.cursor` is al in gebruik (muispijl in een werkwijze-illustratie).
   - **Audit (squirrelscan, 3 okt 2026) en fixes:** draaien met `NO_TELEMETRY=1 npx -y squirrelscan audit <url> --format llm`
     (geen installatie nodig). Doorgevoerd: `robots.txt`, `sitemap.xml`, `llms.txt` (bouw.mjs); **`SITE.basis`** = basisadres voor
     canonical/og/sitemap — nu het GitHub-adres, **na koppelen vivoproducts.nl omzetten naar SITE.url**; SEO-titels en
     -omschrijvingen (SITE.seoTitel, doc.seoTitel/omschrijving, cases automatisch); deelbeelden `beelden/og/*.jpg` via
     `node tools/og-beelden.mjs` (server nodig, daarna opnieuw bouwen); **WebP** via `node tools/webp.mjs` (na nieuwe opnames/renders);
     beeldmaten (width/height), lazy/eager + fetchpriority/preload; `<main>` + overslaan-link; inline CSS/JS verkleind bij
     publiceren; **three.js gebundeld met esbuild** (devDependency) → `docs/js/drie.js` (±585 kB i.p.v. 2,1 MB).
     Juridische pagina's nu ook in de nieuwe stijl (opmaak gedeeld via `site/juridisch-render.mjs`).
     Niet op te lossen op GitHub Pages: CSP/X-Frame-headers (later via Cloudflare), /ViVo/ in de URL (weg na eigen domein).
     Open (keuze Thomas): meer tekst per case (>300 woorden), een Over ViVo-pagina.
   - **Cookies / meten (keuze Thomas: analytics + marketing):** ID's in `SITE.meten` (`ga4`, `googleAds`, `metaPixel`).
     **Leeg = uit**: geen melding, geen scripts, privacytekst "geen cookies". Ingevuld → automatisch cookiemelding
     (`site/toestemming.js`: niets laden vóór toestemming, weigeren even makkelijk als accepteren, Consent Mode v2,
     keuze 12 mnd in localStorage, intrekken ruimt cookies op + herlaadt), cookieparagrafen in de privacyverklaring
     (`als:`-voorwaarden in `site/juridisch.mjs`), `/cookies/` met tabel en footerlinks "Cookies · Cookie-instellingen".
     Testen: `METEN_TEST=1 npm run bouw` → `docs-preview/meten-test/` (test-ID's, géén echte scripts).
   - **Juridisch:** `site/juridisch.mjs` → `docs/privacy/` en `docs/voorwaarden/` (CONCEPT, Thomas beoordeelt; voorwaarden
     voor zakelijke klanten). Contactgegevens in `SITE` (adres, telefoon, KvK); **postcode en btw-nummer nog aanleveren**.
   - **v8:** logo subtieler — bij scrollen faden de letters V-I-V-O **van rechts naar links** weg (O eerst), het beeldmerk
     blijft staan; kopbalk over de volle breedte (logo helemaal links). **Projecten blijft wit** (keuze Thomas); de werkwijze
     is wit met onderaan een **pastelgloed in de tijdlijnkleuren** die naadloos naar wit uitfadet (mask-image). De lijn begint
     onder "Jouw idee" en eindigt boven "Live", zodat het bolletje het label niet meer kruist.
   - **v7: echte 3D met three.js** (0.186, MIT; akkoord Thomas, zelf gehost via importmap): `site/drie.js` maakt per
     `<div class="vorm-3d" data-vorm="...">` een canvas met een object dat **langzaam om zijn as draait** — kubussen,
     schijven, zeshoekplaat, kegel, bollen, serverplaten (licht, mat wit + pastelzweem via grondlicht) en de **donkere lus**
     met randlicht (blauw/paars/oranje). Rendert alleen in beeld; minder beweging → stilstaand beeld.
     Onderaan nu **één donker blok** (vraag + contact + footer) met de 3D-lus; de lichte footer is vervallen.
     De Higgsfield-vormrenders (`beelden/vormen/*.png`) worden niet meer gebruikt.
     Vóór livegang: three.js **bundelen/tree-shaken** (pakket heeft geen minified build; ~2,1 MB los) — vraag akkoord voor de tool.
   - **v6:** menu = Diensten · Techniek · Werkwijze · **Projecten** (was Werk). Werkwijze krijgt een **verloop van wit naar
     donker**; Projecten staat daarna op donker. Volgorde onderaan: Projecten → **donkere afsluiter** (render `lus-donker.png`,
     constant langzaam bewegend) → lichte **Laten we praten** als footer.
   - **Dienstfoto's:** gemaakt met Higgsfield (GPT Image 2.5, high, 2k, 5:4 — 2,75 credits/stuk; akkoord Thomas).
     Prompts + vaste beeldstijl in `beelden/diensten/PROMPTS.md`. Bron-PNG's in `beelden/*/bron/` (gitignored),
     web-JPG's via `node tools/beelden-verkleinen.mjs`. Een beeldvak toont `beelden/diensten/<naam>.jpg` zodra die bestaat.
   - Nog te doen: beelden optimaliseren (webp),
     Flow8-opnames, privacy/colofon, CNAME + DNS bij Strato, GitHub Pages aanzetten op `docs/`.

## Logo

- `logo/genereer-concepten.mjs` genereert `logo/concepten-ronde1.html` (1–17), `concepten-ronde2.html`
  (18–37) en `concepten-alle.html` (alles, met filter) — `node logo/genereer-concepten.mjs`.
  Nummers blijven vast: nieuwe concepten komen achteraan, zodat Thomas' keuzes op nummer blijven kloppen.
- Keuze na ronde 1+2 (3 okt 2026): woordmerk **33 Kapitalen**, beeldmerken **01, 09, 02, 10, 11**.
- `logo/genereer-ronde3.mjs` → `logo/ronde3-lockups.html`: woordmerk 33a–d (VIVO/ViVo × dun/medium),
  lockups horizontaal + verticaal per beeldmerk, en een site-mockup (nav + hero). Importeert de vormen
  uit `genereer-concepten.mjs` (één bron per logo).
- Na ronde 3: woordmerk **33a VIVO dun** staat vast. Beeldmerk-kandidaten: **01 Pixel-V, 02 Dubbele chevron**
  (favorieten), **10 Split-V, 11 Gevouwen lint** (ook mooi).
- `logo/genereer-ronde4.mjs` → `logo/ronde4-toepassingen.html`: die vier naast elkaar in zeven toepassingen
  (tabblad, app-icoon, avatar, navigatie, visitekaartje, e-mail, groot). Importeert uit ronde 3.
- **Definitief (3 okt 2026): beeldmerk 02 Dubbele chevron + woordmerk 33a VIVO dun.**
  `logo/genereer-merk.mjs` → `merk/`: `svg/` (beeldmerk, beeldmerk-klein, horizontaal, verticaal, woordmerk;
  elk zwart + wit), `favicon/` (favicon.svg past zich aan licht/donker aan, app-icoon.svg) en
  `merk/gebruiksgids.html`. **Pas het logo aan in de generator, nooit in de losse bestanden.**
- Onder 33 px altijd de kleine variant van het beeldmerk (lijn 13 i.p.v. 10, meer lucht).
- Logokleuren = huisstijl: zwart `#0a0b0d` (--inkt) / wit `#f5f6f8` (--maan). Wijzig je de tokens, pas dan ook
  `KLEUR` in `logo/genereer-merk.mjs` aan en genereer opnieuw.
- PNG-versies (180/192/512) nog niet gemaakt: er staat geen SVG→PNG-tool op deze Mac. Volgt in de bouwfase.
- Logo's zijn **geometrische SVG-paden, geen lettertypes**, kleur via `currentColor`.
- Stijl: monochroom, geometrisch, strak (inspiratie: Drumcode, Octan, monogrammen).
