# Dienstfoto's — Higgsfield

Gemaakt op 3 oktober 2026 met **GPT Image 2.5** (`gpt_image_2_5`), kwaliteit **high**, resolutie **2k**,
beeldverhouding **5:4** (2,75 credits per beeld). Bron-PNG's in `bron/` (niet in git), web-JPG's (1600×1280)
via `node tools/beelden-verkleinen.mjs`.

Vaste beeldstijl: premium redactionele fotografie, zacht daglicht, licht en koel, veel rust, geen tekst, geen logo's.

| Bestand | Dienst | Prompt |
|---|---|---|
| `branding.jpg` | Branding | Premium editorial product photograph of a minimalist brand identity set: stacked blank business cards, a letterhead sheet, a small round embossed seal and a matte black notebook arranged on a pale grey stone surface, soft natural window daylight from the left, gentle long shadows, cool neutral palette of off-white, light grey and charcoal, shallow depth of field, lots of negative space, high-end design studio look, no readable text, no logos |
| `ui.jpg` | Ontwerp & UI/UX | Premium editorial photograph of a hand holding a modern smartphone showing a clean minimalist app interface with soft rounded cards and a subtle blue-violet gradient, bright airy light grey studio background, soft natural daylight, shallow depth of field, cool neutral tones, high-end tech product photography, no readable text, no logos |
| `web.jpg` | Websites & webshops | Premium editorial photograph of an open silver laptop on a light oak desk showing a sleek modern online shop with a clean product grid, a white ceramic cup and a small green plant beside it, soft morning daylight, Scandinavian minimal interior, cool neutral palette, shallow depth of field, lots of negative space, high-end design agency look, no readable text, no logos |
| `content.jpg` | Content | Premium creative studio still life: a compact mirrorless camera, a matte white ceramic sphere, a small glossy cube and a few softly colored paper shapes in muted blue, violet and coral on a pale grey table, soft diffused daylight, gentle shadows, playful yet minimal art direction, shallow depth of field, high-end editorial photography, no text, no logos |
| `netwerk.jpg` | Development | Cinematic close-up of a modern developer workstation at dusk: a dark low-profile keyboard in the foreground and a monitor in the background with a colorful code editor softly out of focus (blue, violet, orange and green syntax highlighting), cool blue ambient light with a soft violet glow, shallow depth of field, premium moody tech photography, no readable text, no logos |
| `hosting.jpg` | Hosting & onderhoud | Premium high-key photograph of a clean minimal server room aisle with white server racks and tiny glowing green status lights, soft bright diffused light, cool white and light grey palette, calm and futuristic, symmetrical perspective, shallow depth of field, high-end architectural tech photography, no text, no logos |

## Versie 2 — zachte 3D-renders (richting A, keuze Thomas 3 okt 2026)

Vervangen de foto's hierboven (die staan nog in git, commit a6728bd, en lokaal in `bron/fotos/`). Zelfde instellingen
(GPT Image 2.5, high, 2k, 5:4). Vaste stijl: *premium soft 3D studio render, matte off-white clay-like material,
subtle pastel tint, seamless light grey studio background, soft global illumination, gentle diffused shadows, minimal
composition, generous negative space, high-end design agency aesthetic, Blender Cycles render, no text, no letters,
no logos*. Tint per dienst sluit aan op de three.js-vormen.

| Bestand | Onderwerp | Tint |
|---|---|---|
| `branding.jpg` | stapel visitekaartjes, zegel, kleurwaaier, notitieboek | periwinkle |
| `ui.jpg` | tablet en telefoon naast elkaar met abstracte interface, klein in beeld met veel ruimte (v2.1; eerste versie met alleen een telefoon in `bron/fotos/ui-render-1.png`) | lavendel/violet |
| `web.jpg` | laptop met abstracte webshop van afgeronde tegels, bol en kubus ernaast | lichtblauw |
| `content.jpg` | camera, afspeelknop-schijf, zwevende bol, kegel en kubus | perzik/koraal |
| `netwerk.jpg` | paneel met codebalkjes, accolades, knooppunten met buizen | lavendel |
| `hosting.jpg` | drie servermodules met groene lampjes, wolk erboven, schild ernaast | lichtblauw |

## Versie 3 — kleurrijke renders in Clay-stijl (3 okt 2026, nu in gebruik)

Zelfde onderwerpen als versie 2, maar verzadigd en levendig: *vibrant premium 3D studio render … mixing matte
clay-like surfaces with glossy and frosted glass accents, on a soft pale <kleur> gradient studio background, soft
global illumination with gentle colored bounce light … high-end design agency aesthetic like clay.global*.
Kleur per dienst: branding kobaltblauw · ui violet/lila · web hemelsblauw/cyaan · content mandarijn/koraal ·
netwerk indigo/violet/magenta · hosting smaragd/mint. De zachte versie 2 staat in `zacht/` (JPG) en `bron/zacht/` (PNG).

## Versie 4 — staande reeks 3:4 (3 okt 2026, nu in gebruik)

Opnieuw gerenderd vóór staand formaat, voor balans: één compact hoofdobject per dienst, gecentreerd net onder het
midden, ±half beeld, rust erboven; dezelfde camera (driekwart, iets boven ooghoogte), zacht licht van linksboven;
mat + één glas-/glansaccent; monochroom per dienst met achtergrond in dezelfde tint. Instellingen: GPT Image 2.5, high,
2k, **3:4**; web-JPG 1200×1600. Kleuren: branding kobaltblauw · ui violet · web hemelsblauw/cyaan · content mandarijn ·
netwerk magenta · hosting smaragd. Vaste prompt (onderwerp en kleur invullen):

> Premium 3D studio render, vertical portrait composition. Hero subject: <onderwerp>, centered and placed slightly below
> the middle of the frame, occupying about half of the frame, with calm empty space above. Camera slightly above eye
> level, three-quarter view. Materials: soft matte clay-like surfaces with one glossy glass accent. Color: monochrome
> <kleur> palette with white, on a smooth seamless pale <kleur> gradient background in the same hue. Soft diffused key
> light from the upper left, gentle soft contact shadow on the floor, subtle colored bounce light. Clean, balanced,
> premium, calm yet joyful, high-end design agency aesthetic like clay.global, Blender Cycles render, no text, no
> letters, no numbers, no logos

Eerdere versies: kleur v3 in `kleur/` + `bron/kleur/`, zacht v2 in `zacht/` + `bron/zacht/`, foto's in `bron/fotos/` (en git a6728bd).
