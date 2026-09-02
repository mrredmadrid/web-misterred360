import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import PageShell from "../components/PageShell";
import { Counter } from "../components/ui";
import { stats, getSeo } from "../lib/data";
import { useI18n } from "../lib/i18n";
import { SITE } from "../lib/seo";
import { useLightbox } from "../components/Lightbox";

/* Renderiza texto con marcadores {red}...{/red} y {b}...{/b} */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\{red\}[^{]+\{\/red\}|\{b\}[^{]+\{\/b\})/g);
  return (
    <>
      {parts.map((p, i) => {
        const red = p.match(/^\{red\}(.+)\{\/red\}$/);
        if (red) return <span key={i} className="text-brand">{red[1]}</span>;
        const b = p.match(/^\{b\}(.+)\{\/b\}$/);
        if (b) return <strong key={i} className="text-ink font-semibold">{b[1]}</strong>;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

/* ───────────────────────────────────────────────────────────
   Página · EL MANIFIESTO — declaración editorial completa
   ─────────────────────────────────────────────────────────── */

const principles = [
  { n: "01", tKey: "page.man.p01" },
  { n: "02", tKey: "page.man.p02" },
  { n: "03", tKey: "page.man.p03" },
  { n: "04", tKey: "page.man.p04" },
  { n: "05", tKey: "page.man.p05" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function ManifiestoPage({
  onNavigate,
}: {
  onNavigate: (href: string) => void;
}) {
  const { t, locale } = useI18n();
  const seo = getSeo(locale, "manifiesto");
  const openLightbox = useLightbox();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE}/manifiesto#about`,
    name: seo.title,
    description: seo.description,
    url: `${SITE}/manifiesto`,
    mainEntity: { "@id": `${SITE}/#organizacion` },
  };
  return (
    <PageShell
      index="01"
      kicker="page.man.kicker"
      title="page.man.title"
      intro="page.man.intro"
      meta="page.man.meta"
      figure="/images/team-manifesto.jpg"
      figureAlt="El equipo de MISTERRED360 al completo, en color"
      seoTitle={seo.title}
      seoDesc={seo.description}
      path="/manifiesto"
      ogImage={`${SITE}/images/team-manifesto.jpg`}
      breadcrumbs={[
        { name: "Inicio", path: "/" },
        { name: t("page.man.kicker"), path: "/manifiesto" },
      ]}
      jsonLd={jsonLd}
      onNavigate={onNavigate}
    >
      {/* ── A · La declaración ── */}
      <section className="bg-paper text-ink">
        <div className="px-5 md:px-10 xl:px-16 py-20 md:py-28 max-w-[1600px] mx-auto">
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.9, ease }}
            className="font-quote italic leading-[1.06] text-[clamp(2.4rem,6vw,5.4rem)] max-w-5xl whitespace-pre-line"
          >
            <Rich text={t("page.man.quote")} />
          </motion.blockquote>

          <div className="mt-14 grid lg:grid-cols-12 gap-10">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="lg:col-span-7 text-lg md:text-xl leading-relaxed text-ink/70"
            >
              <Rich text={t("page.man.p1")} />
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="lg:col-span-5 text-lg md:text-xl leading-relaxed text-ink/70"
            >
              {t("page.man.p2")}
            </motion.p>
          </div>

          <div className="mt-16 pt-10 border-t border-ink/15 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display font-semibold text-5xl md:text-6xl leading-none">
                  <Counter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-ink/55">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── B · Los cinco principios ── */}
      <section className="relative bg-ink overflow-hidden">
        <div className="absolute inset-0 glow-brand pointer-events-none" aria-hidden="true" />
        <div className="relative px-5 md:px-10 xl:px-16 py-20 md:py-28 max-w-[1600px] mx-auto">
          <h2 className="font-display font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(2.2rem,5vw,4.6rem)] whitespace-pre-line">
            <Rich text={t("page.man.principles.title")} />
          </h2>

          <div className="mt-14 border-b border-white/10">
            {principles.map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.7, delay: i * 0.06, ease }}
                className="group grid md:grid-cols-12 gap-4 md:gap-10 items-baseline border-t border-white/10 py-9 transition-colors duration-500 hover:bg-white/[0.02]"
              >
                <span className="md:col-span-2 font-display font-semibold text-5xl md:text-6xl leading-none text-outline transition-all duration-500 group-hover:text-brand group-hover:[-webkit-text-stroke:0px]">
                  {p.n}
                </span>
                <h3 className="md:col-span-4 font-display font-semibold text-2xl md:text-3xl leading-tight text-paper">
                  {t(`${p.tKey}.t`)}
                </h3>
                <p className="md:col-span-6 text-[15px] leading-relaxed text-smoke max-w-xl">
                  {t(`${p.tKey}.d`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── C · El socio más listo de la sala ── */}
      <section className="bg-paper text-ink overflow-hidden">
        <div className="px-5 md:px-10 xl:px-16 py-20 md:py-28 max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-14 lg:gap-16 items-center">
          {/* Retrato con doble marco editorial */}
          <motion.div
            initial={{ opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease }}
            className="lg:col-span-5"
            data-cursor="view"
            onClick={(e) => {
              const img = e.currentTarget.querySelector("img");
              if (img) openLightbox({ src: img.currentSrc || img.src, alt: img.alt });
            }}
          >
            <div className="relative max-w-[420px] mx-auto lg:mx-0">
              <div
                className="absolute inset-0 -translate-x-3.5 translate-y-3.5 rounded-t-full rounded-b-[2.5rem] bg-brand"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 translate-x-3 -translate-y-3 rounded-t-full rounded-b-[2.5rem] border-2 border-ink/70"
                aria-hidden="true"
              />
              <div className="relative aspect-[4/5] rounded-t-full rounded-b-[2.5rem] overflow-hidden border border-ink/20 group">
                <img
                  src="/images/chimp-hero.jpg"
                  alt={t("page.ele.figure_alt")}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  loading="lazy"
                />
              </div>
              <span className="absolute -bottom-5 right-8 -rotate-3 bg-ink text-paper rounded-full px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] shadow-xl">
                {t("page.man.socio.badge")}
              </span>
            </div>
            <p className="mt-10 text-[11px] uppercase tracking-[0.28em] text-ink/45 max-w-[420px] mx-auto lg:mx-0">
              {t("page.man.socio.fig")}
            </p>
          </motion.div>

          <div className="lg:col-span-7">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
              className="font-display font-semibold uppercase leading-[0.97] tracking-[-0.02em] text-[clamp(2rem,4.4vw,4rem)] whitespace-pre-line"
            >
              <Rich text={t("page.man.socio.title")} />
            </motion.h2>
            <p className="mt-8 text-lg leading-relaxed text-ink/70 max-w-xl">
              {t("page.man.socio.p")}
            </p>
            <p className="mt-5 font-quote italic text-2xl text-ink/80">
              {t("page.man.socio.q")}
            </p>
            <button
              onClick={() => onNavigate("/elenco")}
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-paper transition-all duration-300 hover:gap-4"
            >
              {t("page.man.socio.cta")}
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
