# MISTERRED360 · Guía de imágenes del equipo (portada Manifiesto + Estudios de Mercado)

Esta guía sigue la misma mecánica que `GUIA-IMAGENES-CHIMPANCE.md`: el
código ya está preparado con **fallback automático**, así que la web
nunca se rompe aunque estas dos fotos aún no existan. En cuanto subas
los archivos con los nombres exactos indicados, se activan solas.

---

## 1 · Las dos imágenes pendientes

| # | Dónde se usa | Archivo esperado | Fallback actual |
| --- | --- | --- | --- |
| 1 | Portada del Manifiesto (retrato grande) | `public/images/team-manifesto.jpg` | `chimp-bw.jpg` (retrato individual en blanco y negro) |
| 2 | Servicio "Estudios de Mercado" (visor de Servicios y página `/servicios`) | `public/images/chimp-meeting.jpg` | `chimp-data.jpg` (el Analista) |

Coloca los dos archivos en `public/images/` con esos nombres exactos
(minúsculas, extensión `.jpg`) y ejecuta `npm run build` + sube `dist/`.
No hace falta tocar nada más en el código.

---

## 2 · Prompts exactos para generar cada imagen

### 2.1 · `public/images/team-manifesto.jpg` · Portada del Manifiesto

Sustituye el retrato individual en blanco y negro por una foto de
**equipo al completo, en color** (nunca en blanco y negro): 8 chimpancés
macho, 5 chimpancés hembra y 3 chimpancés de diferente edad, con
vestimenta moderna y colorida — no trajes negros de gala.

> Photorealistic cinematic editorial group photograph of a full team of
> 16 diverse chimpanzees — mixed ages, mixed genders, modern and
> colourful smart-casual outfits (never black-tie, never identical
> suits) — standing and sitting together in a bright, warm office
> space, smiling and relaxed, looking like a real creative agency team.
> Full colour, vibrant but tasteful palette with red and blue accent
> tones matching a corporate brand identity. Natural daylight, shallow
> depth of field, 35mm editorial group-portrait style. Confident,
> warm, collaborative energy — absolutely never cartoonish, never
> aggressive, never black and white.

- **Formato**: JPG, vertical 4:5 (ideal 1600×2000 px), 300–700 kB.
- **Encuadre**: deja aire arriba y abajo para el recorte redondeado de
  la sección Manifiesto.

### 2.2 · `public/images/chimp-meeting.jpg` · Estudios de Mercado

Sustituye la imagen de "mono gritando" del servicio Estudios de Mercado
por una sala de reuniones de trabajo, con el logo MISTERRED en la
pizarra y los 8 miembros del equipo trabajando (sonrientes, nunca
gritando ni agresivos).

> Photorealistic cinematic editorial photograph of a modern meeting
> room. A whiteboard in the background has "MISTERRED360" written on
> it alongside strategy diagrams. Eight diverse chimpanzees (mixed
> genders and ages, smart-casual modern outfits) are gathered around a
> table, collaborating, pointing at charts and laptops, calm and
> focused — smiling, engaged, professional, never shouting or
   aggressive. Warm natural light, shallow depth of field, 35mm
> editorial corporate photography style. Full colour. Absolutely never
> cartoonish, never comedic, never aggressive.

- **Formato**: JPG, horizontal 4:3 o 4:5 (ideal 1600×1200 px o
  1600×2000 px), 300–700 kB.

---

## 3 · Por qué no rompe nada mientras tanto

- La portada del Manifiesto usa `onError` para caer de vuelta a
  `chimp-bw.jpg` (con su filtro duotono) si `team-manifesto.jpg` no
  existe todavía.
- El servicio "Estudios de Mercado" usa `onError` para caer de vuelta a
  `chimp-data.jpg` si `chimp-meeting.jpg` no existe todavía.

Esto sigue exactamente el mismo patrón que ya usa `<CastImage>` para
las fotos femeninas del elenco (ver `GUIA-IMAGENES-CHIMPANCE.md`).
