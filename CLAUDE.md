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
