import type { Locale } from "./i18n";

/* ───────────────────────────────────────────────────────────
   Helper para contenido bilingüe cargado desde src/content/*.json
   (editable vía el panel CMS). Cada campo traducible se guarda
   como { es: "...", en: "..." } y se resuelve aquí según idioma.
   ─────────────────────────────────────────────────────────── */

export interface Localized<T = string> {
  es: T;
  en: T;
}

export function loc<T>(field: Localized<T>, locale: Locale): T {
  return field[locale] ?? field.es;
}

/* El selector de imágenes del CMS a veces guarda la ruta completa
   del repo ("misterred360/public/images/foo.png") en vez de la ruta
   pública servida por el sitio ("/images/foo.png"). Normalizamos
   aquí para que cualquier imagen subida desde el panel funcione
   sin tener que corregir el JSON a mano cada vez. */
export function img(path: string | undefined | null): string {
  if (!path) return "";
  const cleaned = path.replace(/^.*\/public\//, "/");
  return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
}
