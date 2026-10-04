// Juridische pagina's van ViVo: privacyverklaring en algemene voorwaarden.
// CONCEPT — Thomas beoordeelt; geen juridisch advies. Laat de voorwaarden bij voorkeur nalezen door een jurist
// of vergelijk met de modelvoorwaarden van een brancheorganisatie.
// Opmaak: een string is een alinea, een array is een opsomming. In de tekst worden vervangen:
// {mail} {tel} {adres} {kvk} {privacy} {ap} {cookies} {instellingen} — zie bouw.mjs (opmaak()).
// Voorwaardelijk: een sectie of blok als object { als: '<voorwaarde>', ... } verschijnt alleen als die geldt.
// Voorwaarden (uit SITE.meten): meten, geenMeten, ga4, googleAds, metaPixel, google, marketing.

const BIJGEWERKT = '3 oktober 2026';

export const PRIVACY = {
  slug: 'privacy',
  titel: 'Privacyverklaring',
  seoTitel: 'Privacyverklaring — hoe ViVo met je gegevens omgaat',
  omschrijving: 'Hoe ViVo omgaat met persoonsgegevens: geen tracking, wat we bewaren als je contact opneemt of klant wordt, en welke rechten je hebt.',
  intro: 'Kort gezegd: deze website volgt je niet. Geen cookies, geen statistieken, geen advertenties. Persoonsgegevens krijgen we alleen als jij contact opneemt of klant wordt.',
  bijgewerkt: BIJGEWERKT,
  secties: [
    { titel: 'Wie zijn wij', blokken: [
      'ViVo is de handelsnaam van ViVo Products, gevestigd aan {adres} en ingeschreven bij de Kamer van Koophandel onder nummer {kvk}. ViVo is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in deze verklaring.',
      'Vragen over privacy? Mail naar {mail} of bel {tel}.',
    ] },
    { titel: 'Als je deze website bezoekt', als: 'meten', blokken: [
      'Lettertypes, scripts en beelden staan op onze eigen server. Statistiek- en marketingcookies plaatsen we alleen als je daar in de cookiemelding toestemming voor geeft. Zonder toestemming laden we niets van Google of Meta. Hoe dat werkt, lees je hieronder bij Cookies en in de {cookies}.',
      'De website wordt gehost via GitHub Pages (GitHub Inc.). Zoals elke webserver ontvangt GitHub bij een bezoek technische gegevens, waaronder je IP-adres. GitHub legt die vast voor de beveiliging van de dienst. Wij hebben geen toegang tot die gegevens en gebruiken ze niet.',
      'Op de case-pagina’s staan links naar websites van klanten. Die hebben een eigen privacybeleid.',
    ] },
    { titel: 'Cookies', als: 'meten', blokken: [
      'We gebruiken de volgende soorten cookies en vergelijkbare technieken:',
      [
        'Noodzakelijk: we onthouden je cookiekeuze 12 maanden in je browser. Hiervoor is geen toestemming nodig.',
        { als: 'ga4', tekst: 'Statistiek, alleen met toestemming: Google Analytics laat ons zien hoe bezoekers de site gebruiken, bijvoorbeeld welke pagina’s worden bekeken en hoe bezoekers binnenkomen. Google Analytics slaat geen volledige IP-adressen op. We bewaren deze gegevens maximaal 14 maanden en gebruiken ze alleen om de site te verbeteren.' },
        { als: 'marketing', tekst: 'Marketing, alleen met toestemming: we meten of onze advertenties werken en kunnen advertenties tonen aan mensen die de site eerder bezochten. Daarvoor gebruiken we {marketingdiensten}. Deze partijen kunnen de gegevens ook voor eigen doeleinden gebruiken; daarvoor zijn zij zelf verantwoordelijk, volgens hun eigen privacybeleid.' },
      ],
      'Grondslag: jouw toestemming. Je kunt die altijd wijzigen of intrekken via {instellingen} onderaan elke pagina. Een overzicht van alle cookies, met bewaartermijnen, staat in de {cookies}.',
    ] },
    { titel: 'Als je deze website bezoekt', als: 'geenMeten', blokken: [
      'Deze website plaatst geen cookies en gebruikt geen statistieken-, advertentie- of trackingdiensten. Lettertypes, scripts en beelden staan op onze eigen server; je browser maakt dus geen verbinding met bijvoorbeeld Google.',
      'De website wordt gehost via GitHub Pages (GitHub Inc.). Zoals elke webserver ontvangt GitHub bij een bezoek technische gegevens, waaronder je IP-adres. GitHub legt die vast voor de beveiliging van de dienst. Wij hebben geen toegang tot die gegevens en gebruiken ze niet. Meer hierover lees je in de privacyverklaring van GitHub.',
      'Op de case-pagina’s staan links naar websites van klanten. Die hebben een eigen privacybeleid.',
    ] },
    { titel: 'Als je contact opneemt', blokken: [
      'Mail of bel je ons, dan verwerken we de gegevens die je zelf deelt:',
      ['je naam en eventueel je bedrijfsnaam', 'je e-mailadres en/of telefoonnummer', 'de inhoud van je bericht en wat we daarna afspreken'],
      { als: 'formulier', blok: 'Gebruik je het contactformulier op de website, dan wordt je bericht verstuurd via Web3Forms, een dienst die formulieren doorstuurt naar ons e-mailadres. Web3Forms gebruikt je gegevens alleen om het bericht af te leveren.' },
      'We gebruiken deze gegevens alleen om je vraag te beantwoorden en, als je dat wilt, een offerte te maken. Grondslag: de stappen die nodig zijn vóór een eventuele overeenkomst, en ons gerechtvaardigd belang om berichten te kunnen beantwoorden.',
    ] },
    { titel: 'Als je klant wordt', blokken: [
      'Voor het uitvoeren van een opdracht verwerken we contact- en factuurgegevens, afspraken en de correspondentie over het project. Grondslag: de uitvoering van de overeenkomst. Facturen en de bijbehorende administratie bewaren we omdat de wet dat verplicht. De afspraken over opdrachten staan in onze {voorwaarden}.',
      'Bouwen of beheren we voor jou een website of app waarin persoonsgegevens van jouw klanten of medewerkers staan, dan ben jij daarvoor verantwoordelijk en verwerken wij die gegevens alleen in jouw opdracht. Daarvoor sluiten we een verwerkersovereenkomst.',
    ] },
    { titel: 'Hoe lang we gegevens bewaren', blokken: [
      ['Contactberichten die niet tot een opdracht leiden: maximaal 12 maanden na het laatste contact.', { als: 'meten', tekst: 'Cookies: zie de bewaartermijnen in de {cookies}. Statistiekgegevens in Google Analytics: maximaal 14 maanden.' }, 'Klant- en projectgegevens: zolang we samenwerken, en daarna zo lang als nodig voor nazorg of garantie.', 'Facturen en administratie: 7 jaar, zoals de fiscale bewaarplicht voorschrijft.'],
    ] },
    { titel: 'Met wie we gegevens delen', blokken: [
      'We verkopen geen gegevens en delen ze niet voor marketing. We schakelen alleen dienstverleners in die we nodig hebben om ons werk te doen, zoals onze e-mailprovider (Strato, Duitsland), onze hostingpartij (GitHub) en onze boekhouding. Zij mogen de gegevens alleen voor ons gebruiken. Daarnaast verstrekken we gegevens als de wet ons daartoe verplicht.',
      { als: 'meten', blok: 'Geef je toestemming voor statistiek- of marketingcookies, dan ontvangen ook {meetpartijen} gegevens over je bezoek, zoals je IP-adres, apparaat- en browsergegevens en de bekeken pagina’s.' },
      'Gaan gegevens buiten de Europese Economische Ruimte, zoals bij {vsPartijen} in de Verenigde Staten, dan gebeurt dat alleen met de waarborgen die de AVG voorschrijft, zoals het EU-VS Data Privacy Framework of standaardcontractbepalingen.',
    ] },
    { titel: 'Beveiliging', blokken: [
      'De website werkt alleen via een beveiligde verbinding (https). Accounts die we voor ons werk gebruiken zijn beveiligd met sterke wachtwoorden en, waar mogelijk, tweestapsverificatie. Toegang tot klantgegevens is beperkt tot wat nodig is voor de opdracht.',
    ] },
    { titel: 'Jouw rechten', blokken: [
      'Je mag ons altijd vragen welke gegevens we van je hebben. Je kunt ze laten corrigeren of verwijderen, bezwaar maken tegen het gebruik, het gebruik laten beperken of je gegevens in een gangbaar bestand ontvangen. Mail je verzoek naar {mail}; we reageren binnen een maand. Om misbruik te voorkomen kunnen we vragen of je je identiteit wilt bevestigen.',
      'Ben je niet tevreden over hoe we met je gegevens omgaan? Laat het ons eerst weten, dan zoeken we samen een oplossing. Je hebt ook altijd het recht een klacht in te dienen bij de {ap}.',
    ] },
    { titel: 'Wijzigingen', blokken: [
      'Verandert er iets aan de website of aan onze werkwijze, bijvoorbeeld omdat er een contactformulier bij komt, dan passen we deze verklaring aan. Bovenaan staat altijd de datum van de laatste versie.',
    ] },
  ],
};

export const VOORWAARDEN = {
  slug: 'voorwaarden',
  titel: 'Algemene voorwaarden',
  seoTitel: 'Algemene voorwaarden — ViVo webdesign Gorinchem',
  omschrijving: 'De algemene voorwaarden van ViVo voor offertes, websites, webshops, hosting en onderhoud: betaling, oplevering, eigendom en aansprakelijkheid.',
  intro: 'Heldere afspraken maken samenwerken makkelijker. Deze voorwaarden gelden voor alle offertes en opdrachten van ViVo.',
  bijgewerkt: BIJGEWERKT,
  secties: [
    { titel: 'Begrippen', blokken: [
      ['ViVo: ViVo Products, gevestigd aan {adres}, KvK {kvk}.', 'Opdrachtgever: de onderneming of organisatie die ViVo een opdracht geeft.', 'Opdracht: de afgesproken werkzaamheden, zoals ontwerp, bouw, teksten, content, hosting of onderhoud van een website, webshop of webapplicatie.', 'Schriftelijk: per brief of per e-mail.'],
    ] },
    { titel: 'Toepasselijkheid', blokken: [
      'Deze voorwaarden gelden voor elke offerte, opdracht en overeenkomst tussen ViVo en de opdrachtgever. Afwijkingen gelden alleen als ze schriftelijk zijn afgesproken. Voorwaarden van de opdrachtgever zijn niet van toepassing.',
      'Deze voorwaarden zijn geschreven voor zakelijke opdrachtgevers. Werkt ViVo voor een particulier, dan gaan de wettelijke regels voor consumenten voor op deze voorwaarden.',
      'Is een bepaling ongeldig, dan blijven de overige bepalingen gewoon gelden. De ongeldige bepaling wordt vervangen door een bepaling die zo dicht mogelijk bij de bedoeling ligt.',
    ] },
    { titel: 'Offertes en totstandkoming', blokken: [
      'Een offerte is 30 dagen geldig, tenzij er een andere termijn in staat. De opdracht komt tot stand zodra de opdrachtgever de offerte schriftelijk accepteert, of zodra ViVo met instemming van de opdrachtgever aan het werk gaat.',
      'Een offerte is gebaseerd op de informatie die de opdrachtgever heeft gegeven. Blijkt die onvolledig of anders, dan mag ViVo de offerte aanpassen.',
    ] },
    { titel: 'Uitvoering en medewerking', blokken: [
      'ViVo voert de opdracht zorgvuldig en naar beste kunnen uit. ViVo mag voor onderdelen derden inschakelen, zoals hostingpartijen of fotografen, na overleg met de opdrachtgever als dat gevolgen heeft voor de prijs.',
      'De opdrachtgever zorgt op tijd voor wat nodig is: teksten, beelden, logo’s, toegang tot accounts en domeinen, en feedback. Komt dat te laat of is het onvolledig, dan kan de planning opschuiven en mag ViVo extra werk in rekening brengen.',
    ] },
    { titel: 'Planning en termijnen', blokken: [
      'Genoemde opleverdata zijn een zo goed mogelijke inschatting en geen fatale termijnen. Dreigt een termijn te worden overschreden, dan laat ViVo dat zo snel mogelijk weten en spreken we samen een nieuwe planning af.',
    ] },
    { titel: 'Meerwerk en wijzigingen', blokken: [
      'Wensen die buiten de offerte vallen, of wijzigingen in iets dat al is goedgekeurd, zijn meerwerk. ViVo meldt vooraf dat iets meerwerk is en wat het kost. Meerwerk wordt uitgevoerd na akkoord van de opdrachtgever en gefactureerd tegen het afgesproken uurtarief of een vaste prijs.',
    ] },
    { titel: 'Oplevering en acceptatie', blokken: [
      'Na oplevering heeft de opdrachtgever 14 dagen om het resultaat te testen en eventuele fouten schriftelijk te melden. ViVo herstelt gemelde fouten die binnen de opdracht vallen kosteloos en binnen een redelijke termijn.',
      'Het resultaat geldt als geaccepteerd als de opdrachtgever binnen die 14 dagen geen fouten meldt, of als de website of applicatie in gebruik wordt genomen (bijvoorbeeld live wordt gezet). Kleine gebreken die het gebruik niet in de weg staan, zijn geen reden om de oplevering te weigeren; die worden alsnog hersteld.',
    ] },
    { titel: 'Prijzen en betaling', blokken: [
      'Alle prijzen zijn in euro’s en exclusief btw, tenzij anders vermeld. Hoe en wanneer er betaald wordt, staat in de offerte. Bij grotere projecten spreken we meestal termijnen af, bijvoorbeeld bij de start, na akkoord op het ontwerp en bij oplevering. Is er niets afgesproken, dan factureert ViVo 50% bij akkoord op de offerte en 50% bij oplevering. Hosting en onderhoud via ViVo worden vooraf gefactureerd, per maand of per jaar zoals afgesproken.',
      'Facturen worden betaald binnen 14 dagen na factuurdatum. Wordt een factuur niet op tijd betaald, dan stuurt ViVo eerst een herinnering. Blijft betaling daarna uit, dan is de opdrachtgever de wettelijke handelsrente en redelijke incassokosten verschuldigd, en mag ViVo het werk of de dienstverlening opschorten.',
      'ViVo mag tarieven voor doorlopende diensten zoals hosting en onderhoud eenmaal per jaar aanpassen. Een prijsverhoging wordt minstens een maand van tevoren aangekondigd.',
    ] },
    { titel: 'Hosting, domeinen en onderhoud', blokken: [
      'Hosting en onderhoud zijn niet verplicht. De opdrachtgever kiest of ViVo dit verzorgt, of dat de opdrachtgever het zelf of via een andere partij regelt. Regelt de opdrachtgever de hosting zelf, dan levert ViVo de website op en helpt bij de livegang; beschikbaarheid, beveiliging en updates vallen dan onder de verantwoordelijkheid van de opdrachtgever, tenzij er een onderhoudsafspraak is.',
      'Doorlopende diensten via ViVo worden aangegaan voor de periode in de offerte, en anders voor een jaar. Daarna lopen ze steeds met dezelfde periode door, tenzij een van beide partijen uiterlijk een maand voor het einde van de periode schriftelijk opzegt.',
      'Voor hosting en domeinen werkt ViVo met externe partijen. ViVo doet haar best voor een goed bereikbare en veilige website, maar kan niet garanderen dat die altijd zonder onderbreking beschikbaar is. Storingen bij die partijen vallen buiten de invloed van ViVo.',
      'Domeinnamen worden zoveel mogelijk op naam van de opdrachtgever geregistreerd. Bij beëindiging werkt ViVo mee aan een verhuizing naar een andere partij, zodra alle openstaande facturen zijn betaald.',
    ] },
    { titel: 'Intellectueel eigendom', blokken: [
      'Zodra alle facturen voor een opdracht zijn betaald, krijgt de opdrachtgever het eigendom van het ontwerp en de teksten die speciaal voor de opdrachtgever zijn gemaakt, en het onbeperkte recht om de opgeleverde website of applicatie te gebruiken, te laten aanpassen en te laten beheren.',
      'ViVo blijft eigenaar van eigen hulpmiddelen, werkwijzen, sjablonen en herbruikbare code die zij ook voor andere projecten gebruikt. Onderdelen van derden, zoals open-sourcesoftware, lettertypes of stockbeelden, vallen onder hun eigen licenties.',
      'ViVo mag het project noemen en tonen in haar portfolio en op haar website, tenzij de opdrachtgever schriftelijk laat weten daar bezwaar tegen te hebben. Vertrouwelijke informatie wordt daarbij nooit getoond.',
    ] },
    { titel: 'Materiaal van de opdrachtgever', blokken: [
      'De opdrachtgever staat ervoor in dat aangeleverde teksten, beelden en ander materiaal gebruikt mogen worden en dat het gebruik daarvan geen rechten van anderen schendt. De opdrachtgever vrijwaart ViVo voor claims van derden hierover.',
    ] },
    { titel: 'Persoonsgegevens en geheimhouding', blokken: [
      'Verwerkt ViVo bij een opdracht persoonsgegevens namens de opdrachtgever, bijvoorbeeld in een webshop of webapplicatie, dan sluiten partijen een verwerkersovereenkomst. Hoe ViVo zelf met persoonsgegevens omgaat, staat in de {privacy}.',
      'Beide partijen houden vertrouwelijke informatie van de ander geheim, ook na afloop van de opdracht.',
    ] },
    { titel: 'Aansprakelijkheid', blokken: [
      'De aansprakelijkheid van ViVo is beperkt tot directe schade en tot ten hoogste het bedrag dat voor de betreffende opdracht is gefactureerd. Bij doorlopende diensten is dat ten hoogste het bedrag van de laatste twaalf maanden. In elk geval is de aansprakelijkheid beperkt tot het bedrag dat de verzekeraar van ViVo in dat geval uitkeert, als dat lager is.',
      'ViVo is niet aansprakelijk voor indirecte schade, zoals gederfde omzet of winst, verlies van gegevens of reputatieschade. De opdrachtgever blijft zelf verantwoordelijk voor het bewaren van een eigen kopie van belangrijke gegevens, tenzij back-ups uitdrukkelijk zijn afgesproken.',
      'Deze beperkingen gelden niet als de schade het gevolg is van opzet of bewuste roekeloosheid van ViVo.',
    ] },
    { titel: 'Overmacht', blokken: [
      'ViVo is niet gehouden tot nakoming als dat door overmacht niet mogelijk is, zoals ziekte, storingen bij hosting- of internetproviders, of andere omstandigheden buiten haar invloed. Duurt de overmacht langer dan twee maanden, dan mogen beide partijen de opdracht beëindigen. Wat al is geleverd, wordt naar verhouding gefactureerd.',
    ] },
    { titel: 'Beëindiging', blokken: [
      'Beëindigt de opdrachtgever een project voordat het klaar is, dan wordt het werk betaald dat tot dan toe is gedaan. Beide partijen mogen de overeenkomst direct beëindigen als de ander failliet gaat, surseance van betaling krijgt of de afspraken ernstig en blijvend niet nakomt.',
    ] },
    { titel: 'Toepasselijk recht en geschillen', blokken: [
      'Op deze voorwaarden en alle opdrachten is Nederlands recht van toepassing. Bij een meningsverschil gaan we eerst samen in gesprek. Komen we er niet uit, dan is de bevoegde rechter in het arrondissement waar ViVo is gevestigd bevoegd.',
      'ViVo mag deze voorwaarden wijzigen. Voor lopende opdrachten gelden de voorwaarden die van toepassing waren toen de opdracht werd gegeven.',
    ] },
  ],
};

// Cookieverklaring — wordt alleen gebouwd als er gemeten wordt (SITE.meten). Tabelrijen: [cookie, doel, bewaartermijn, van].
export const COOKIES = {
  slug: 'cookies',
  titel: 'Cookieverklaring',
  seoTitel: 'Cookieverklaring — welke cookies ViVo gebruikt',
  omschrijving: 'Welke cookies de website van ViVo gebruikt, waarvoor en hoe lang — en hoe je je keuze voor statistiek en marketing altijd kunt wijzigen.',
  intro: 'Welke cookies deze website gebruikt, waarvoor en hoe lang. Statistiek- en marketingcookies plaatsen we alleen met jouw toestemming.',
  bijgewerkt: BIJGEWERKT,
  secties: [
    { titel: 'Wat zijn cookies', blokken: [
      'Cookies zijn kleine bestanden die een website in je browser opslaat. Vergelijkbare technieken, zoals opslag in je browser of een pixel, behandelen we op dezelfde manier. In deze verklaring noemen we ze allemaal cookies.',
    ] },
    { titel: 'Noodzakelijk', blokken: [
      'Deze zijn nodig om de site te laten werken zoals je verwacht. Hiervoor vragen we geen toestemming.',
      { tabel: [['vivo-toestemming', 'Onthoudt je cookiekeuze (opslag in je browser)', '12 maanden', 'ViVo']] },
    ] },
    { titel: 'Statistiek', als: 'ga4', blokken: [
      'Alleen met jouw toestemming. Met Google Analytics zien we hoe bezoekers de site gebruiken, zodat we die kunnen verbeteren. Google Analytics slaat geen volledige IP-adressen op en we delen deze gegevens niet met Google voor andere doeleinden.',
      { tabel: [['_ga', 'Onderscheidt bezoekers', '2 jaar', 'Google'], ['_ga_…', 'Bewaart de status van je bezoek', '2 jaar', 'Google']] },
    ] },
    { titel: 'Marketing', als: 'marketing', blokken: [
      'Alleen met jouw toestemming. Hiermee meten we of onze advertenties werken en kunnen we advertenties tonen aan mensen die de site eerder bezochten. De aanbieders kunnen deze gegevens ook voor eigen doeleinden gebruiken, volgens hun eigen privacybeleid.',
      { tabel: [
        { als: 'googleAds', rij: ['_gcl_au', 'Meet of een advertentie tot een bezoek of aanvraag leidt', '3 maanden', 'Google'] },
        { als: 'metaPixel', rij: ['_fbp', 'Herkent je browser voor het meten en tonen van advertenties', '3 maanden', 'Meta'] },
        { als: 'metaPixel', rij: ['_fbc', 'Onthoudt via welke advertentie je binnenkwam', '3 maanden', 'Meta'] },
      ] },
      { als: 'metaPixel', blok: 'Ben je ingelogd bij Facebook of Instagram, dan kan Meta daarnaast eigen cookies op zijn eigen domein gebruiken.' },
    ] },
    { titel: 'Je keuze wijzigen', blokken: [
      'Je kunt je toestemming altijd wijzigen of intrekken via {instellingen}, ook onderaan elke pagina. Trek je toestemming in, dan verwijderen we de cookies van Google en Meta van dit domein. Je kunt cookies ook zelf verwijderen via de instellingen van je browser.',
      'Meer over hoe we met persoonsgegevens omgaan, lees je in de {privacy}.',
    ] },
  ],
};
