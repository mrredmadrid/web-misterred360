import { useMemo } from "react";
import { useI18n } from "./i18n";
import { resolveAll, resolvePost, localizedPosts } from "./insights";
import type { InsightPost } from "./insights";

/* ───────────────────────────────────────────────────────────
   Hook para consumir noticias ya resueltas en el idioma activo
   ─────────────────────────────────────────────────────────── */

export function useInsights(): InsightPost[] {
  const { locale } = useI18n();
  return useMemo(() => resolveAll(locale), [locale]);
}

export function useInsight(slug: string): InsightPost | null {
  const { locale } = useI18n();
  return useMemo(() => {
    const source = localizedPosts.find((p) => p.slug === slug);
    return source ? resolvePost(source, locale) : null;
  }, [slug, locale]);
}
