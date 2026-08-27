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
