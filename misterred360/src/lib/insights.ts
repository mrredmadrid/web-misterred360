import type { Locale } from "./i18n";

/* ───────────────────────────────────────────────────────────
   MISTERRED360 · Blog / Insights bilingüe
   Cada noticia se escribe una sola vez con sus versiones
   ES y EN. La web muestra automáticamente la correspondiente
   al idioma activo, con fallback a español si falta la EN.

   PARA PUBLICAR UNA NOTICIA NUEVA:
   1. Duplica insightTemplate (bloque completo).
   2. Rellena el slug (sin acentos), la imagen y las fechas.
   3. Rellena `es` y `en` con título, extracto, categoría y
      cuerpo (mismos bloques, texto traducido).
   4. Añade el objeto al inicio del array insightPosts.
   ─────────────────────────────────────────────────────────── */

export type InsightBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] };

/* Contenido específico de un idioma */
export interface InsightLocaleContent {
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  meta: string;
  authorRole: string;
  imageAlt: string;
  tags: string[];
  content: InsightBlock[];
}

/* Documento bilingüe editable */
export interface LocalizedInsightPost {
  slug: string;
  date: string;          // formato humano legible (ES): "12 ene 2026"
  dateEn: string;        // formato humano en inglés: "Jan 12, 2026"
  author: string;        // firma común (no traducible)
  image: string;
  es: InsightLocaleContent;
  en: InsightLocaleContent;
}

/* Estructura ya resuelta para el idioma activo */
export interface InsightPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  meta: string;
  author: string;
  authorRole: string;
  image: string;
  imageAlt: string;
  tags: string[];
  content: InsightBlock[];
}

/* ═══════════════════════════════════════════════════════════
   NOTICIAS PUBLICADAS
   Cada noticia vive en su propio archivo dentro de
   src/content/posts/*.json (editable desde el panel /admin sin
   tocar código). Se cargan todas en build time y se ordenan por
   fecha, más reciente primero.
   ═══════════════════════════════════════════════════════════ */

const postModules = import.meta.glob("../content/posts/*.json", {
  eager: true,
  import: "default",
}) as Record<string, LocalizedInsightPost>;

/* "12 ene 2026" → "2026-01-12" (mismo formato que usa el listado del blog) */
const MONTHS: Record<string, string> = {
  ene: "01", enero: "01", jan: "01", january: "01",
  feb: "02", febrero: "02", february: "02",
  mar: "03", marzo: "03", march: "03",
  abr: "04", abril: "04", apr: "04", april: "04",
  may: "05", mayo: "05",
  jun: "06", junio: "06", june: "06",
  jul: "07", julio: "07", july: "07",
  ago: "08", agosto: "08", aug: "08", august: "08",
  sep: "09", septiembre: "09", september: "09",
  oct: "10", octubre: "10", october: "10",
  nov: "11", noviembre: "11", november: "11",
  dic: "12", diciembre: "12", dec: "12", december: "12",
};
function toIsoDate(human: string): string {
  const parts = human.toLowerCase().replace(/,/g, "").split(/\s+/);
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, "0");
    const month = MONTHS[parts[1]] ?? "01";
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return "1970-01-01";
}

/* Más reciente primero (insightPosts[0] se usa como "destacada") */
export const localizedPosts: LocalizedInsightPost[] = Object.values(postModules).sort(
  (a, b) => toIsoDate(b.date).localeCompare(toIsoDate(a.date))
);

/* ═══════════════════════════════════════════════════════════
   PLANTILLA BILINGÜE PARA UNA NOTICIA NUEVA
   Duplica este objeto, cambia el slug y rellena ambas versiones.
   ═══════════════════════════════════════════════════════════ */

export const insightTemplate: LocalizedInsightPost = {
  slug: "titulo-de-la-noticia-en-minusculas-y-con-guiones",
  date: "1 ene 2026",
  dateEn: "Jan 1, 2026",
  author: "MISTERRED360",
  image: "/images/chimp-press.jpg",
  es: {
    category: "Categoría",
    title: "Titular de la noticia o insight",
    excerpt:
      "Entradilla breve de 18 a 28 palabras: explica qué aporta la noticia y por qué debe leerse.",
    readTime: "5 min",
    meta: "5 min · Ene 2026",
    authorRole: "Área o equipo responsable",
    imageAlt: "Descripción accesible de la imagen principal",
    tags: ["Etiqueta 1", "Etiqueta 2", "Etiqueta 3"],
    content: [
      { type: "paragraph", text: "Primer párrafo: contexto y problema." },
      { type: "heading", text: "Subtítulo de desarrollo" },
      { type: "paragraph", text: "Segundo párrafo: análisis, dato o argumento." },
      { type: "list", items: ["Idea clave 1", "Idea clave 2", "Idea clave 3"] },
      { type: "quote", text: "Frase destacada para reforzar la idea principal." },
      { type: "paragraph", text: "Cierre con aprendizaje y posible llamada a la acción." },
    ],
  },
  en: {
    category: "Category",
    title: "Story or insight headline",
    excerpt:
      "Short entry paragraph of 18–28 words: explain what the story brings and why it should be read.",
    readTime: "5 min read",
    meta: "5 min · Jan 2026",
    authorRole: "Area or team in charge",
    imageAlt: "Accessible description of the main image",
    tags: ["Tag 1", "Tag 2", "Tag 3"],
    content: [
      { type: "paragraph", text: "First paragraph: context and problem." },
      { type: "heading", text: "Development subhead" },
      { type: "paragraph", text: "Second paragraph: analysis, data or argument." },
      { type: "list", items: ["Key idea 1", "Key idea 2", "Key idea 3"] },
      { type: "quote", text: "Standout sentence to reinforce the main idea." },
      { type: "paragraph", text: "Closing with a takeaway and a possible call to action." },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   RESOLVER: convierte una noticia bilingüe en la vista final
   según el idioma activo (con fallback a español).
   ═══════════════════════════════════════════════════════════ */

export function resolvePost(p: LocalizedInsightPost, locale: Locale): InsightPost {
  const src = locale === "en" ? { ...p.es, ...p.en } : p.es;
  return {
    slug: p.slug,
    author: p.author,
    image: p.image,
    date: locale === "en" ? p.dateEn : p.date,
    category: src.category,
    title: src.title,
    excerpt: src.excerpt,
    readTime: src.readTime,
    meta: src.meta,
    authorRole: src.authorRole,
    imageAlt: src.imageAlt,
    tags: src.tags,
    content: src.content,
  };
}

export function resolveAll(locale: Locale): InsightPost[] {
  return localizedPosts.map((p) => resolvePost(p, locale));
}

/* Compat: se mantiene un array por defecto en español para código
   antiguo que aún no consume el hook `useInsights()`. */
export const insightPosts: InsightPost[] = localizedPosts.map((p) => resolvePost(p, "es"));
