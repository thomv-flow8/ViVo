// Teksten en cases van de ViVo-site. CONCEPT — door Thomas te beoordelen.
// Alleen feiten die op de sites zelf staan of door Thomas zijn opgegeven; geen verzonnen cijfers.

export const SITE = {
  bedrijf: 'ViVo Products',
  bedrijfKort: 'ViVo',
  url: 'https://vivoproducts.nl',
  // Basisadres voor canonical, deelbeelden (og), sitemap, robots en gestructureerde gegevens.
  // Sinds 4 okt 2026 het eigen domein (DNS bij Strato → GitHub Pages; was https://thomv-flow8.github.io/ViVo).
  basis: 'https://vivoproducts.nl',
  seoTitel: 'ViVo — Webdesign en websites laten maken in Gorinchem',
  mail: 'info@vivoproducts.nl',
  adres: 'Einsteinstraat 3e',
  postcode: '4207 HW',
  plaats: 'Gorinchem',
  btw: '',                          // btw-identificatienummer (NL…B01) — nog aanleveren
  telefoon: '06-28702422',
  telefoonLink: '+31628702422',
  kvk: '80912532',
  jaar: 2026,
  // Meten (statistiek + marketing). Leeg = uit: geen cookiemelding, geen scripts, privacytekst 'geen cookies'.
  // Vul een ID in en de cookiemelding, cookieparagraaf en /cookies/ worden automatisch actief.
  // Contactformulier: leeg = formulier opent het mailprogramma met het bericht ingevuld. Met een Web3Forms-sleutel
  // (gratis account op web3forms.com, aan te maken door Thomas) worden berichten direct verstuurd; de privacytekst past zich aan.
  formulier: { web3forms: '' },
  // Verificatiecodes van Google Search Console en Bing Webmaster Tools (alleen de code uit de meta-tag). Leeg = niets.
  verificatie: { google: '', bing: '' },
  meten: {
    ga4: '',          // Google Analytics 4, bv. 'G-XXXXXXXXXX'   → categorie statistiek
    googleAds: '',    // Google Ads, bv. 'AW-XXXXXXXXXX'          → categorie marketing
    metaPixel: '',    // Meta-pixel, bv. '1234567890123456'       → categorie marketing
  },
  intro: 'ViVo ontwerpt en bouwt snelle, heldere websites, webshops en webapps voor ondernemers die gevonden willen worden — en klanten willen overtuigen.',
  beschrijving: 'ViVo ontwerpt en bouwt snelle, heldere websites, webshops en webapps voor ondernemers. Persoonlijk, van eerste schets tot livegang — vanuit Gorinchem.',
};

export const DIENSTEN = [
  { titel: 'Websites', tekst: 'Je website is vaak de eerste indruk. ViVo ontwerpt en bouwt snelle, heldere sites die laten zien wie je bent — en die bezoekers laten doen wat jij wilt: bellen, mailen, boeken of kopen.', tags: ['Ontwerp', 'Bouw', 'Teksten', 'Vindbaarheid'] },
  { titel: 'Webshops', tekst: 'Een shop die overzichtelijk is, snel laadt en op elke telefoon prettig afrekent — als losse winkel of als onderdeel van je website.', tags: ['E-commerce', 'Betalingen', 'Mobiel'] },
  { titel: 'Webapplicaties', tekst: 'Als een website niet genoeg is: maatwerksoftware voor je bedrijf, zoals een planning, digitale werkbonnen of een klantportaal. Werkt in de browser én als app op je telefoon.', tags: ['Maatwerk', 'Web-app', 'Koppelingen'] },
  { titel: 'Onderhoud & hosting', tekst: 'Hosting, updates en kleine aanpassingen. Jij onderneemt, ViVo houdt je site snel, veilig en actueel.', tags: ['Hosting', 'Updates', 'Support'] },
];

export const STAPPEN = [
  { titel: 'Kennismaken', tekst: 'We bespreken je doelen, je klanten en wat je site moet opleveren.' },
  { titel: 'Ontwerpen', tekst: 'Je ziet een klikbaar ontwerp voordat er één regel code geschreven is.' },
  { titel: 'Bouwen', tekst: 'Snel, toegankelijk en vindbaar — getest op telefoon, tablet en desktop.' },
  { titel: 'Lanceren', tekst: 'Live, en daarna blijft ViVo je aanspreekpunt voor onderhoud en groei.' },
];

// Volgorde = volgorde op de site. kleur = het projectvlak (Clay: de kleur komt uit het werk).
export const CASES = [
  {
    slug: 'thnk', naam: 'THNK', uitgelicht: true, jaar: 2026,
    klant: 'THNK', sector: 'Muziek', soort: 'Website voor een dj en producer',
    rol: ['Concept', 'Ontwerp', 'Bouw', 'Teksten', 'Hosting'],
    live: 'https://www.thnkmusic.com/', kleur: '#14161a', kleurTekst: '#9aa0ab',
    kort: 'Een donkere, grootse site voor techno- en progressive-dj en producer THNK.',
    intro: 'Een eigen online thuis voor techno- en progressive-dj en producer THNK: donker, groots en helemaal in het teken van de muziek.',
    opdracht: 'THNK maakt techno en progressive, met remixes van Greece 2000 en Zocalo en releases op Armada en Coldharbour. De site moest die sound vertalen naar beeld — en bookers in een paar seconden laten zien wie THNK is.',
    aanpak: 'Een sterk typografisch logo boven zwart-witte landschappen, met het groen van mos als enige kleur. Weinig woorden, grote beelden en een heldere route: luisteren, shows, over en boeken.',
    resultaat: 'Een snelle, Engelstalige site die op elk scherm overeind blijft — volledig door ViVo bedacht, ontworpen, geschreven, gebouwd en gehost.',
    vertrekpunt: 'THNK had nog geen eigen website. We bouwden de site vanaf de grond op: een thuisbasis waar fans, promotors en labels in één oogopslag zien wie THNK is, wat hij uitbrengt en hoe je hem boekt.',
    onderdelen: [
      ['Beeld dat de muziek voelbaar maakt', 'Monumentale zwart-witfotografie van bergen, watervallen en ijsgrotten zet de toon: groots, donker en ruimtelijk — net als de muziek zelf.'],
      ['Muziek direct te beluisteren', 'De nieuwste release staat bovenaan, met een ingebouwde Spotify-speler, een overzicht van recente releases en links naar Spotify, Apple Music, Beatport en SoundCloud.'],
      ['Shows en het verhaal erachter', 'Een agenda voor komende en eerdere shows, zoals de Progressive Stage op A State of Trance 850, en een about-sectie met kerncijfers en de artiesten die zijn tracks draaiden.'],
      ['Boeken zonder omwegen', 'Een duidelijke bookingsectie met een direct e-mailadres, zodat promotors en labels meteen contact opnemen. De site is Engelstalig, voor een internationaal publiek.'],
    ],
  },
  {
    slug: 'delphi', naam: 'DELPHI Sleutelbeheersystemen', naamKop: 'DELPHI Sleutelbeheer\u00adsystemen', jaar: 2026, // naamKop: vast breekpunt (zacht afbreekstreepje) voor grote koppen
    klant: 'DELPHI', sector: 'Beveiliging', soort: 'Tweetalige productsite',
    rol: ['Ontwerp', 'Bouw', 'Teksten', 'Hosting'],
    live: 'https://www.sleutelbeheersystemen.nl/', kleur: '#f1f5fb', kleurTekst: '#5b6472', // witter, koel (keuze Thomas: B)
    kort: 'Een heldere, tweetalige productsite voor elektronisch sleutelbeheer.',
    intro: 'Een heldere, tweetalige productsite voor elektronische sleutelbeheersystemen — waar elke sleutel op naam staat en elk moment herleidbaar is.',
    opdracht: 'DELPHI levert elektronische sleutelkasten, lockers en sabotagevrije sleutelringen aan organisaties waar toegang niet ter discussie staat. Het aanbod is technisch en breed; de site moest dat overzichtelijk maken voor inkopers en beheerders.',
    aanpak: 'Een rustig, productgericht ontwerp met veel wit, duidelijke productlijnen en een keuzehulp die bezoekers naar het juiste systeem leidt. ViVo schreef de teksten, bouwde de site in het Nederlands en Engels en verzorgt de hosting.',
    resultaat: 'Een site die vertrouwen uitstraalt en bezoekers in een paar klikken van productkeuze naar offerteaanvraag brengt.',
    vertrekpunt: 'DELPHI had een bestaande website die niet meer paste bij het brede, technische aanbod. Tijd voor een nieuwe site die rust brengt, vertrouwen uitstraalt en bezoekers sneller bij het juiste systeem brengt.',
    onderdelen: [
      ['Heldere productlijnen', 'Het aanbod is ingedeeld in drie lijnen: sleutelbeheer, opbergsystemen en sleutelringen. Elk systeem heeft een eigen vak met een korte omschrijving, een beeld en een directe offerteknop.'],
      ['Keuzehulp in drie vragen', 'Wat wilt u beheren, hoeveel posities zijn nodig en wat moet er vastliggen? Na drie vragen weet de bezoeker welk systeem past en waar te beginnen.'],
      ['Vertrouwen vanaf de eerste blik', 'Logo’s van organisaties die DELPHI gebruiken, vier niveaus van sleutelbeheer en een stappenplan van inventarisatie tot beheer maken de aanpak concreet.'],
      ['Tweetalig en klaar voor aanvragen', 'De hele site is beschikbaar in het Nederlands en het Engels. Op elke pagina staat een duidelijke weg naar een demo of een offerteaanvraag.'],
    ],
  },
  {
    slug: 'mozi', naam: 'Huidzorg Mozi', jaar: 2026, status: 'In ontwikkeling',
    klant: 'Huidzorg Mozi', sector: 'Huidtherapie', soort: 'Website met webshop',
    rol: ['Ontwerp', 'Bouw', 'Webshop'],
    live: '', kleur: '#efe2d2', kleurTekst: '#6b5a45',
    kort: 'Een warme, elegante website met webshop voor een praktijk voor huidtherapie.',
    intro: 'Een warme, elegante website met webshop voor een praktijk voor huidtherapie in Gorinchem.',
    opdracht: 'Huidzorg Mozi helpt jong en oud, van acne en rosacea tot pigment en huidverjonging. De praktijk wilde een site die net zo persoonlijk aanvoelt als de behandeling zelf — en waar je meteen een afspraak maakt.',
    aanpak: 'Een verfijnd ontwerp met een klassieke schreefletter, zachte crèmetinten en veel rust. Behandelingen, tarieven en resultaten zijn overzichtelijk ingedeeld, een gratis intake is overal binnen handbereik en de webshop biedt zorgvuldig gekozen thuisverzorging.',
    resultaat: 'De site is in ontwikkeling en gaat binnenkort live.',
    vertrekpunt: 'Huidzorg Mozi had een bestaande website die niet meer liet zien wat de praktijk te bieden heeft. De nieuwe site moest warmte en vakmanschap uitstralen, en bezoekers zonder drempel naar een intakegesprek leiden.',
    onderdelen: [
      ['Behandelingen overzichtelijk', 'Alle behandelingen staan in een filterbaar overzicht met foto, korte uitleg en vanafprijs. Bezoekers kunnen ook starten vanuit hun klacht, zoals acne, rosacea of pigmentvlekken.'],
      ['Laagdrempelig een intake plannen', 'Overal staat de knop voor een gratis intakegesprek van 30 minuten, dat bezoekers direct online plannen. Een stappenplan laat zien wat ze daarna kunnen verwachten.'],
      ['Resultaat en vertrouwen', 'Een voor-en-nafoto met schuifregelaar, beoordelingen van cliënten, keurmerken en het persoonlijke verhaal van de eigenaar laten zien waarom je hier in goede handen bent.'],
      ['Webshop voor thuisverzorging', 'In de webshop staan de producten die de praktijk zelf gebruikt en aanbeveelt — met prijzen, verzending of ophalen in de praktijk.'],
    ],
  },
  {
    slug: 'flow8', naam: 'Flow8', jaar: 2026, status: 'Eigen product',
    klant: 'ViVo (eigen product)', sector: 'Installatietechniek', soort: 'Webapplicatie',
    rol: ['Concept', 'Ontwerp', 'Development'],
    live: '', kleur: 'radial-gradient(120% 90% at 50% 105%, #26357e 0%, #121838 45%, #0a0c18 100%)', kleurTekst: '#c7cff5', // nachtblauw met gloed, als het Flow8-inlogscherm
    kort: 'Planning, digitale werkbonnen en klantbeheer voor de installatie- en servicebranche.',
    intro: 'Een eigen platform van ViVo: planning, digitale werkbonnen en klantbeheer voor de installatie- en servicebranche.',
    opdracht: 'Installatie- en servicebedrijven plannen vaak nog met whiteboards, spreadsheets en papieren werkbonnen. Flow8 brengt planners op kantoor en monteurs in het veld samen in één omgeving.',
    aanpak: 'Een webapp die op de telefoon werkt als een app: planning met routeoptimalisatie, digitale werkbonnen, klantbeheer, rapportage en HR — met rechten per rol en geschikt voor meerdere bedrijven tegelijk.',
    resultaat: 'Tijdwinst in planning en administratie, meer controle en grip op het werk, betrouwbare data voor rapportages en minder kosten — in een systeem dat prettig werkt, op kantoor én in het veld.',
    vertrekpunt: 'Flow8 is ontstaan in de praktijk. Het bedrijf waar Thomas werkt liep vast op planning en workflow: veel handwerk, weinig overzicht. Daarom bouwde hij één platform waar planners op kantoor en monteurs in het veld met dezelfde, actuele informatie werken.',
    onderdelen: [
      ['Planning en routes', 'Opdrachten inplannen per monteur in een week- of dagoverzicht, met routeoptimalisatie op de kaart: in welke volgorde, met hoeveel reistijd en hoeveel kilometer.'],
      ['Digitale werkbonnen', 'Monteurs zien hun werkbon zodra die is vrijgegeven en vullen hem in op telefoon of tablet. De werkbon wordt vastgelegd als pdf, zonder papierwerk achteraf.'],
      ['Klanten en installaties', 'Een register van klanten en installaties met hun locatie op de kaart, zodat de geschiedenis van elk adres op één plek staat.'],
      ['Team en rapportage', 'Verlof, overuren en onkosten dienen medewerkers zelf in; rapportages tonen opdrachten per monteur en per maand. Flow8 werkt in de browser én als app.'],
    ],
    galerij: [
      { bestand: 'route.jpg', bijschrift: 'Route-optimalisatie: de dag van een monteur in één oogopslag' },
      { bestand: 'kaart.jpg', bijschrift: 'Kaartoverzicht met alle klantlocaties en hun status' },
      { bestand: 'register.jpg', bijschrift: 'Installatieregister met locatie en foto’s' },
      { bestand: 'login.jpg', bijschrift: 'Inloggen, ook met een Google-account' },
      { bestand: 'rapportage.jpg', bijschrift: 'Rapportage: opdrachten per monteur, per type en per maand' },
    ],
    galerijNoot: 'Klantgegevens in deze schermen zijn onherkenbaar gemaakt.',
  },
];
