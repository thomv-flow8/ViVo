// Teksten en cases van de ViVo-site. CONCEPT — door Thomas te beoordelen.
// Alleen feiten die op de sites zelf staan of door Thomas zijn opgegeven; geen verzonnen cijfers.

export const SITE = {
  bedrijf: 'ViVo Products',
  bedrijfKort: 'ViVo',
  url: 'https://vivoproducts.nl',
  mail: 'info@vivoproducts.nl',
  plaats: 'Nederland',
  jaar: 2026,
  intro: 'ViVo ontwerpt en bouwt snelle, heldere websites, webshops en webapps voor ondernemers die gevonden willen worden — en klanten willen overtuigen.',
  beschrijving: 'ViVo ontwerpt en bouwt snelle, heldere websites, webshops en webapps. Persoonlijk, van eerste schets tot livegang.',
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
  },
  {
    slug: 'delphi', naam: 'DELPHI Sleutelbeheersystemen', jaar: 2026,
    klant: 'DELPHI', sector: 'Beveiliging', soort: 'Tweetalige productsite',
    rol: ['Ontwerp', 'Bouw', 'Teksten', 'Hosting'],
    live: 'https://www.sleutelbeheersystemen.nl/', kleur: '#f1f5fb', kleurTekst: '#5b6472', // witter, koel (keuze Thomas: B)
    kort: 'Een heldere, tweetalige productsite voor elektronisch sleutelbeheer.',
    intro: 'Een heldere, tweetalige productsite voor elektronische sleutelbeheersystemen — waar elke sleutel op naam staat en elk moment herleidbaar is.',
    opdracht: 'DELPHI levert elektronische sleutelkasten, lockers en sabotagevrije sleutelringen aan organisaties waar toegang niet ter discussie staat. Het aanbod is technisch en breed; de site moest dat overzichtelijk maken voor inkopers en beheerders.',
    aanpak: 'Een rustig, productgericht ontwerp met veel wit, duidelijke productlijnen en een keuzehulp die bezoekers naar het juiste systeem leidt. ViVo schreef de teksten, bouwde de site in het Nederlands en Engels en verzorgt de hosting.',
    resultaat: 'Een site die vertrouwen uitstraalt en bezoekers in een paar klikken van productkeuze naar offerteaanvraag brengt.',
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
    resultaat: 'Flow8 laat zien wat ViVo bouwt als een website niet genoeg is: maatwerksoftware die het dagelijkse werk eenvoudiger maakt.',
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
