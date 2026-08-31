import { motion } from "framer-motion";
import { ArrowUpRight, Eye, Antenna, BrainCircuit, Handshake } from "lucide-react";
import PageShell from "../components/PageShell";
import { differentials, stats, getWhyUs, getSeo } from "../lib/data";
import { useI18n } from "../lib/i18n";
import { Counter } from "../components/ui";
import { SITE } from "../lib/seo";

function Rich({ text }: { text: string }) {
  const parts = text.split(/(\{red\}[^{]+\{\/red\})/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\{red\}(.+)\{\/red\}$/);
        return m ? <span key={i} className="text-brand">{m[1]}</span> : <span key={i}>{p}</span>;
      })}
    </>
  );
}

/* ───────────────────────────────────────────────────────────
   Página · POR QUÉ NOSOTROS — los diferenciales de la agencia
   en profundidad, con la misma voz editorial que el resto
   de la web
   ─────────────────────────────────────────────────────────── */

const icons = [Eye, Antenna, BrainCircuit, Handshake];
const ease = [0.22, 1, 0.36, 1] as const;

export default function WhyUsPage({
  onNavigate,
}: {
  onNavigate: (href: string) => void;
}) {
  const { t, locale } = useI18n();
  const w = getWhyUs(locale);
  const seo = getSeo(locale, "whyus");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE}/por-que-nosotros#about`,
    name: seo.title,
    description: seo.description,
    url: `${SITE}/por-que-nosotros`,
    mainEntity: { "@id": `${SITE}/#organizacion` },
  };

  return (
    <PageShell
      index="07"
      kicker="page.why.kicker"
      title="page.why.title"
      titleSize="sm"
      intro="page.why.intro"
      meta="page.why.meta"
      figure="/images/chimp-hero.jpg"
      figureAlt="El chimpancé de MISTERRED360, retrato editorial"
      seoTitle={seo.title}
      seoDesc={seo.description}
      path="/por-que-nosotros"
      ogImage={`${SITE}/images/chimp-hero.jpg`}
      breadcrumbs={[
        { name: "Inicio", path: "/" },
        { name: t("page.why.kicker"), path: "/por-que-nosotros" },
      ]}
      jsonLd={jsonLd}
      onNavigate={onNavigate}
    >
      {/* ── Los cuatro diferenciales ── */}
      <section className="relative bg-ink overflow-hidden">
        <div className="absolute inset-0 glow-brand pointer-events-none" aria-hidden="true" />
        <div className="relative px-5 md:px-10 xl:px-16 py-16 md:py-24 max-w-[1600px] mx-auto">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {differentials.map((d, i) => {
              const Icon = icons[i];
              return (
                <motion.article
                  key={d.title}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease }}
                  className="group bg-coal border border-white/[0.07] rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/40"
                >
                  <span className="w-12 h-12 rounded-full border border-brand/60 text-brand flex items-center justify-center mb-8 transition-colors duration-500 group-hover:bg-brand group-hover:text-white">
                    <Icon className="w-5 h-5" strokeWidth={1.7} />
                  </span>
                  <h3 className="font-display font-semibold text-2xl leading-tight text-paper">
                    {d.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-smoke">{d.description}</p>
                  <div className="mt-8 flex items-center justify-between">
                    <span className="font-display text-sm text-ash group-hover:text-brand transition-colors">
                      0{i + 1} —
                    </span>
                    {d.stat && (
                      <span className="font-display font-semibold text-3xl text-brand">
                        {d.stat.value}
                        {d.stat.suffix}
                      </span>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Banda roja de resultados */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease }}
            className="relative mt-8 rounded-[2.5rem] bg-brand overflow-hidden"
          >
            <span
              className="absolute -right-8 -top-16 font-display font-semibold text-[16rem] leading-none text-ink/[0.08] select-none pointer-events-none"
              aria-hidden="true"
            >
              360°
            </span>
            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-y-10 px-8 md:px-14 py-12 md:py-16">
              {stats.map((s) => (
                <div key={s.label} className="text-white">
                  <p className="font-display font-semibold text-5xl md:text-6xl leading-none">
                    <Counter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-white/75">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Alianzas */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, ease }}
            className="mt-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 rounded-2xl border border-white/[0.07] bg-coal/60 px-8 py-6"
          >
            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
              {w.partnersKicker}
            </span>
            <p className="text-sm md:text-[15px] leading-relaxed text-smoke">
              {w.partnersDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Cierre ── */}
      <section className="bg-paper text-ink">
        <div className="px-5 md:px-10 xl:px-16 py-20 md:py-24 max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand mb-5">
              {t("page.why.close.kicker")}
            </p>
            <h2 className="font-display font-semibold uppercase leading-[0.97] text-[clamp(2rem,4.4vw,3.8rem)] whitespace-pre-line">
              <Rich text={t("page.why.close.title")} />
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/65">{t("page.why.close.p")}</p>
          </div>
          <button
            onClick={() => onNavigate("/contacto")}
            className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-all duration-300 hover:gap-4 shrink-0"
          >
            {t("page.why.close.cta")}
            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
          </button>
        </div>
      </section>
    </PageShell>
  );
}
