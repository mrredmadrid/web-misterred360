import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useInsights } from "../lib/useInsights";
import { useI18n } from "../lib/i18n";
import { navigateTo } from "../lib/scroll";
import { Kicker } from "./ui";

/* ───────────────────────────────────────────────────────────
   Sección 07 · INSIGHTS — ideas y análisis en formato editorial
   ─────────────────────────────────────────────────────────── */

export default function Insights({
  onOpenBlog,
  onOpenPost,
}: {
  onOpenBlog: () => void;
  onOpenPost: (slug: string) => void;
}) {
  const { t } = useI18n();
  const insights = useInsights();
  const featuredInsights = insights.slice(0, 3);

  return (
    <section id="insights" className="bg-paper text-ink">
      <div className="px-5 md:px-10 xl:px-16 py-24 md:py-36 max-w-[1600px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-8 mb-14 md:mb-20">
          <div>
            <Kicker index="07" dark>
              {t("insights.kicker")}
            </Kicker>
            <h2 className="mt-10 font-display font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(2.4rem,5.6vw,5.4rem)]">
              {t("insights.title.a")}
              <br />
              {t("insights.title.b")} <span className="text-brand">{t("insights.title.c")}</span>
            </h2>
          </div>
          <button
            onClick={onOpenBlog}
            className="group inline-flex items-center gap-2 rounded-full border-2 border-ink px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-paper"
          >
            {t("insights.all")}
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
          </button>
        </div>

        {/* ── El anzuelo diferencial: una idea gratis en 72h ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] bg-ink text-paper p-8 md:p-12 mb-14 flex flex-col lg:flex-row lg:items-center justify-between gap-8"
        >
          <span
            className="absolute -right-6 -top-10 font-display font-semibold text-[10rem] leading-none text-brand/10 pointer-events-none select-none"
            aria-hidden="true"
          >
            72h
          </span>
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-brand mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              {t("insights.kicker")}
            </span>
            <h3 className="font-display font-semibold uppercase leading-[0.98] text-[clamp(1.7rem,3.4vw,2.8rem)]">
              {t("insights.hook.title")}
            </h3>
            <p className="mt-4 text-base md:text-lg text-smoke leading-relaxed">
              {t("insights.hook.desc")}
            </p>
          </div>
          <button
            onClick={() => navigateTo("/contacto")}
            className="relative group inline-flex items-center gap-3 rounded-full bg-brand px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-flame transition-all duration-300 hover:gap-4 shrink-0"
          >
            {t("insights.hook.cta")}
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
          </button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredInsights.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-white rounded-[1.75rem] border border-ink/10 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-30px_rgba(8,8,10,0.35)]"
              data-cursor="view"
            >
              <div className="aspect-[4/3] overflow-hidden bg-ink/5">
                <img
                  src={post.image}
                  alt={`Imagen editorial del insight: ${post.title}`}
                  className="w-full h-full object-cover object-top duotone-red transition-transform duration-700 group-hover:scale-[1.05]"
                  loading="lazy"
                />
              </div>
              <div className="p-5 md:p-6">
                <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                  <span className="rounded-full bg-ink text-paper px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
                    {post.category}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-ink/50">
                    {post.meta}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-[1.25rem] md:text-[1.4rem] leading-[1.18] transition-colors duration-300 group-hover:text-brand break-words">
                  <button
                    onClick={() => onOpenPost(post.slug)}
                    className="w-full text-left"
                    data-cursor="view"
                  >
                    {post.title}
                  </button>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70 break-words">{post.excerpt}</p>
                  <button
                    onClick={() => onOpenPost(post.slug)}
                    className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors group-hover:text-brand"
                  >
                    {t("insights.read")}
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
