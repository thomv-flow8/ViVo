# ViVo — openstaande punten

Bijgewerkt: 5 oktober 2026. Afgeronde punten weghalen, nieuwe onderaan de juiste lijst.

## Wacht op Thomas

- [ ] **Cookiemelding aanzetten** — zodra je Google Analytics, Google Ads of de Meta-pixel wilt gebruiken.
      Lever de ID's aan; ze gaan in `SITE.meten` in `site/inhoud.mjs`. Dan verschijnen automatisch de melding,
      de pagina `/cookies/`, de cookieparagrafen in de privacyverklaring en de footerlinks.
      Nu bewust uit: de site plaatst geen cookies en laadt geen externe scripts.
- [ ] **Btw-nummer** — gaat in `SITE.btw`; verschijnt dan vanzelf in de footer (informatieplicht).
- [ ] **Google Bedrijfsprofiel** — verificatie afronden zodra Google de code stuurt.
- [ ] **Search Console** — controleren of de sitemap op "Geslaagd" staat; na 1–2 weken Prestaties bekijken.
- [ ] **Algemene voorwaarden** — concept; laten nalezen door een jurist of vergelijken met modelvoorwaarden.
- [ ] **Huidzorg Mozi** — zodra de site live is: status "In ontwikkeling" eraf en de link toevoegen.

## Technisch, wanneer het uitkomt

- [ ] **https afdwingen** — kan pas als het GitHub-certificaat op "approved" staat.
      GitHub → repo ViVo → Settings → Pages → "Enforce HTTPS". Of vraag het mij.
- [ ] **Cloudflare** — voor beveiligingsheaders (HSTS, CSP); beveiligingsscore van ±85 naar ±95.
      Vereist verhuizing van de naamservers bij Strato; let op de mailinstellingen (MX).
- [ ] **Prestaties** (audit: 49) — three.js, GSAP en de volledige-pagina-opnames wegen het zwaarst.
      Verder verkleinen gaat deels ten koste van de animaties: keuze van Thomas.

## Later

- [ ] **Referenties van klanten** — een of twee citaten bij de cases (THNK, DELPHI).
- [ ] **PNG-versies van het logo** (180/192/512) voor app-iconen — zie `logo/genereer-merk.mjs`.
