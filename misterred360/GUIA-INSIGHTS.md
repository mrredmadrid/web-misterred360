# MISTERRED360 · Guía de redacción y publicación de Insights (bilingüe)

Guía operativa para escribir nuevas noticias/insights en **español e inglés**
y actualizarlas en la web. Todo el contenido del blog vive en un único archivo:
**`src/lib/insights.ts`**.

---

## 1. Dónde se escribe

| Qué | Dónde |
| --- | --- |
| Todas las noticias publicadas | `src/lib/insights.ts` → array `localizedPosts` |
| Plantilla bilingüe lista para duplicar | `src/lib/insights.ts` → objeto `insightTemplate` |
| Bloques de contenido admitidos | `paragraph` · `heading` · `quote` · `list` |
| Vista previa del blog | ruta `#/insights` (índice) y `#/insights/{slug}` (noticia) |

Al cambiar de idioma en el selector superior, **las noticias también cambian
automáticamente** al idioma activo. Si no existiera la versión EN de una
noticia, la web muestra la versión ES como respaldo.

---

## 2. Paso a paso para publicar una noticia bilingüe

1. **Abrir** `src/lib/insights.ts`.
2. **Copiar** el bloque completo de `insightTemplate` (desde `{` hasta `},`).
3. **Pegar** la copia justo después de `export const localizedPosts: LocalizedInsightPost[] = [` (primera posición).
4. **Editar los campos comunes** (fuera de `es`/`en`):
   - `slug`, `date`, `dateEn`, `author`, `image`.
5. **Rellenar la versión española** dentro de `es: {...}`:
   - `category`, `title`, `excerpt`, `readTime`, `meta`, `authorRole`,
     `imageAlt`, `tags`, `content`.
6. **Traducir cada campo al inglés** dentro de `en: {...}` respetando el
   mismo número y orden de bloques del array `content`.
7. **Guardar** el archivo.
8. **Comprobar** en local: `npm run dev` → abrir `#/insights` y probar cambiando
   el idioma para asegurarse de que ambas versiones lucen bien.
9. **Actualizar la web**: `npm run build` y publicar la carpeta `dist/`.

> Regla de oro: la estructura de `content` **debe ser idéntica en `es` y `en`**
> (mismos tipos de bloque y mismo orden). Solo cambia el texto.

---

## 3. Campos comunes (no traducibles)

| Campo | Qué es | Ejemplo |
| --- | --- | --- |
| `slug` | Dirección de la noticia (`/insights/{slug}`) | `el-titular-es-el-producto` |
| `date` | Fecha ES en formato humano | `14 jul 2026` |
| `dateEn` | Fecha EN en formato humano | `Jul 14, 2026` |
| `author` | Firma común | `MISTERRED360` |
| `image` | Ruta a la imagen principal | `/images/chimp-press.jpg` |

**Slug**: minúsculas, sin acentos ni eñes, palabras separadas por guiones.

---

## 4. Campos por idioma (`es` y `en`)

Ambos objetos tienen exactamente los mismos campos:

| Campo | Descripción |
| --- | --- |
| `category` | Etiqueta temática. Ej.: `Estrategia` / `Strategy` |
| `title` | Titular. Máx. ~60 caracteres, sin clickbait |
| `excerpt` | Entradilla, 18–28 palabras |
| `readTime` | Tiempo de lectura. Ej.: `5 min` / `5 min read` |
| `meta` | Meta card. Ej.: `5 min · Jul 2026` |
| `authorRole` | Área firmante. Ej.: `Gabinete de prensa` / `Press office` |
| `imageAlt` | Texto alternativo accesible/SEO |
| `tags` | 3 etiquetas por idioma. Ej.: `["Prensa","Relato","Medios"]` |
| `content` | Bloques del cuerpo (ver punto 5) |

---

## 5. Bloques de contenido admitidos

```ts
{ type: "paragraph", text: "Texto del párrafo." }
{ type: "heading",   text: "Subtítulo con gancho" }
{ type: "quote",     text: "Frase memorable.", cite: "MISTERRED360" }  // cite opcional
{ type: "list",      items: ["Idea 1", "Idea 2", "Idea 3"] }
```

Combínalos siempre en el mismo orden en `es` y `en`.

---

## 6. Qué imagen usar según el tema

Las imágenes del personaje están en `public/images/`:

| Tema | Imagen |
| --- | --- |
| Prensa · medios · titulares | `/images/chimp-press.jpg` |
| Estrategia · planificación | `/images/chimp-strategy.jpg` |
| Redes sociales · marca | `/images/chimp-hero.jpg` |
| RRPP · eventos | `/images/chimp-events.jpg` |
| Identidad · branding | `/images/chimp-brand.jpg` |
| Vídeo · audiovisual | `/images/chimp-av.jpg` |
| Publicidad · campañas | `/images/chimp-ads.jpg` |
| Datos · investigación | `/images/chimp-data.jpg` |
| Reputación · editorial | `/images/chimp-bw.jpg` |
| CTA · llamada directa | `/images/chimp-cta.jpg` |

---

## 7. Estructura recomendada por noticia

Orden probado en las 6 noticias actuales:

1. `paragraph` — contexto y problema.
2. `heading` — subtítulo de desarrollo.
3. `paragraph` — análisis, dato o argumento.
4. `quote` — frase destacada (opcional).
5. `list` — 3–5 claves accionables.
6. `paragraph` — cierre con aprendizaje.

Longitud total por idioma: **300–500 palabras**.

---

## 8. Voz y estilo

**Español**: estratégico, directo, con criterio. Frases cortas, verbos de acción.
**Inglés**: mismo tono pero natural, sin traducción literal. Evita giros
"traducidos" (por ejemplo, "vanity metrics", "long story short"…). Prioriza que
suene escrito en inglés, no adaptado.

- **SÍ**: comunicación, reputación, posicionamiento, crecimiento.
- **NO**: tono infantil sobre el chimpancé (es un embajador corporativo).
- **NO**: jerga vacía ("synergies", "solutions", "next-gen 360…").

---

## 9. Errores frecuentes

| Error | Solución |
| --- | --- |
| Bloques distintos en `es` y `en` | Copia el array `content` de `es` y traduce texto a texto |
| Slug con acentos o espacios | `cómo escribir` → `como-escribir` |
| `meta` incoherente con `date`/`readTime` | Copia siempre el patrón `X min · Mmm YYYY` |
| Falta la coma tras el objeto | Añadirla siempre antes de la siguiente noticia |
| `heading` como primer bloque | Empezar siempre con `paragraph` |
| Imagen inexistente | Comprobar que está en `public/images/` |

---

## 10. Checklist antes de publicar

- [ ] Slug único, minúsculas, con guiones.
- [ ] `date` y `dateEn` coherentes con la fecha real.
- [ ] `title` ES y EN ≤ 60 caracteres cada uno.
- [ ] `excerpt` 18–28 palabras en ambos idiomas.
- [ ] `readTime` y `meta` coherentes.
- [ ] Imagen elegida según la tabla del punto 6 + `imageAlt` en ambos idiomas.
- [ ] 3 etiquetas por idioma en `tags`.
- [ ] `content` con mismos bloques y orden en `es` y `en`.
- [ ] Comprobado en local: cambiar el selector ES/EN y ver que todo funciona.
- [ ] `npm run build` sin errores → publicar `dist/`.

---

## 11. Ejemplo mínimo listo para copiar

```ts
{
  slug: "el-titular-es-el-producto",
  date: "14 jul 2026",
  dateEn: "Jul 14, 2026",
  author: "MISTERRED360",
  image: "/images/chimp-press.jpg",
  es: {
    category: "Estrategia",
    title: "El titular es el producto.",
    excerpt:
      "Si el titular no sostiene la historia, la campaña no existe. Cómo escribir mensajes que los medios quieran publicar sin retocar.",
    readTime: "5 min",
    meta: "5 min · Jul 2026",
    authorRole: "Gabinete de prensa",
    imageAlt: "Chimpancé de MISTERRED360 como portavoz ante micrófonos de prensa",
    tags: ["Titulares", "Prensa", "Mensaje"],
    content: [
      { type: "paragraph", text: "Primer párrafo: contexto y problema." },
      { type: "heading", text: "Subtítulo de desarrollo" },
      { type: "paragraph", text: "Segundo párrafo: argumento o dato." },
      { type: "quote", text: "Un titular correcto ahorra la mitad de la campaña.", cite: "MISTERRED360" },
      { type: "list", items: ["Clave 1", "Clave 2", "Clave 3"] },
      { type: "paragraph", text: "Cierre con aprendizaje y siguiente paso." },
    ],
  },
  en: {
    category: "Strategy",
    title: "The headline is the product.",
    excerpt:
      "If the headline doesn't hold the story, the campaign doesn't exist. How to write messages media want to publish without a rewrite.",
    readTime: "5 min read",
    meta: "5 min · Jul 2026",
    authorRole: "Press office",
    imageAlt: "MISTERRED360's chimp as a spokesperson at a press mic wall",
    tags: ["Headlines", "Press", "Message"],
    content: [
      { type: "paragraph", text: "Opening paragraph: context and problem." },
      { type: "heading", text: "Development subhead" },
      { type: "paragraph", text: "Second paragraph: argument or data point." },
      { type: "quote", text: "The right headline saves half the campaign.", cite: "MISTERRED360" },
      { type: "list", items: ["Key 1", "Key 2", "Key 3"] },
      { type: "paragraph", text: "Closing with a takeaway and next step." },
    ],
  },
},
```

Pega este bloque al inicio de `localizedPosts`, edita los campos y publica.
