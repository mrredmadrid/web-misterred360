import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import PageShell from "../components/PageShell";
import { getCastMembers, getSeo } from "../lib/data";
import { useI18n } from "../lib/i18n";
import { SITE } from "../lib/seo";
import CastImage from "../components/CastImage";

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
   Página · EL ELENCO — el personaje como sistema visual
   de marca, con las ocho versiones completas
   ─────────────────────────────────────────────────────────── */

const TREATMENTS = ["1", "2", "3", "4"];

const ease = [0.22, 1, 0.36, 1] as const;

export default function ElencoPage({
  onNavigate,
}: {
  onNavigate: (href: string) => void;
}) {
  const { t, locale } = useI18n();
  const castMembers = getCastMembers(locale);
  const seo = getSeo(locale, "elenco");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE}/elenco#collection`,
    name: seo.title,
    description: seo.description,
    url: `${SITE}/elenco`,
    hasPart: castMembers.map((m) => ({
      "@type": "ImageObject",
      contentUrl: `${SITE}${m.image}`,
      name: m.role,
      caption: m.quote,
      about: m.area,
    })),
  };
  return (
    <PageShell
      index="05"
      kicker="page.ele.kicker"
      title="page.ele.title"
      intro="page.ele.intro"
      meta="page.ele.meta"
      figure="/images/chimp-hero.jpg"
      figureAlt="page.ele.figure_alt"
      seoTitle={seo.title}
      seoDesc={seo.description}
      path="/elenco"
      ogImage={`${SITE}/images/chimp-hero.jpg`}
      breadcrumbs={[
        { name: "Inicio", path: "/" },
        { name: t("page.ele.kicker"), path: "/elenco" },
      ]}
      jsonLd={jsonLd}
      onNavigate={onNavigate}
    >
      {/* ── El personaje como sistema ── */}
      <section className="bg-paper text-ink">
        <div className="px-5 md:px-10 xl:px-16 py-20 md:py-28 max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
              className="font-display font-semibold uppercase leading-[0.97] tracking-[-0.02em] text-[clamp(2rem,4.4vw,4rem)] whitespace-pre-line"
            >
              <Rich text={t("page.ele.h.title")} />
            </motion.h2>
            <p className="mt-8 text-lg leading-relaxed text-ink/70 max-w-xl">
              {t("page.ele.h.p1")}
            </p>
            <p className="mt-5 text-lg leading-relaxed text-ink/70 max-w-xl">
              {t("page.ele.h.p2")}
            </p>

            <div className="mt-10 grid sm:grid-cols-2 gap-4 max-w-xl">
              {TREATMENTS.map((n, i) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.07, ease }}
                  className="border border-ink/15 rounded-2xl p-5 transition-colors hover:border-brand"
                >
                  <p className="font-display font-semibold text-lg">
                    {t(`page.ele.treat.${n}.t`)}
                  </p>
                  <p className="mt-1 text-sm text-ink/55">{t(`page.ele.treat.${n}.d`)}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            whileInView={{ clipPath: "inset(0% 0 0 0)" }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="lg:col-span-5 relative"
            data-cursor="view"
          >
            <div
              className="absolute inset-0 translate-x-4 -translate-y-3 rounded-[2rem] bg-ink"
              aria-hidden="true"
            />
            <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] max-w-[420px] lg:ml-auto group">
              <img
                src="/images/chimp-bw.jpg"
                alt={t("page.ele.figure_alt")}
                className="w-full h-full object-cover object-[center_20%] duotone-red"
                loading="lazy"
              />
            </div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-ink/45 max-w-[420px] lg:ml-auto">
              {t("page.ele.h.fig")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Elenco completo ── */}
      <section className="relative bg-ink overflow-hidden">
        <div className="absolute inset-0 glow-brand pointer-events-none" aria-hidden="true" />
        <div className="relative px-5 md:px-10 xl:px-16 py-20 md:py-28 max-w-[1600px] mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <h2 className="font-display font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(2rem,4.6vw,4.2rem)] whitespace-pre-line">
              <Rich text={t("page.ele.full.title")} />
            </h2>
            <p className="text-smoke max-w-sm text-[15px] leading-relaxed">
              {t("page.ele.full.p")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {castMembers.map((m, i) => (
              <motion.figure
                key={m.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease }}
                className="group"
                data-cursor="view"
              >
                <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden border border-white/10">
                  <CastImage
                    src={m.image}
                    alt={m.role}
                    className="w-full h-full object-cover duotone-red transition-transform duration-700 group-hover:scale-[1.05]"
                    loading="lazy"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-ink/80 backdrop-blur px-3.5 py-1.5 font-display font-semibold text-sm text-paper">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-ink/80 backdrop-blur text-paper flex items-center justify-center text-sm font-semibold"
                    aria-label={m.gender === "f" ? "Femenino" : "Masculino"}
                  >
                    {m.gender === "f" ? "♀" : "♂"}
                  </span>
                  <span
                    className={`absolute bottom-4 left-4 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white ${
                      i % 2 ? "bg-ocean" : "bg-brand"
                    }`}
                  >
                    {m.area}
                  </span>
                </div>
                <figcaption className="mt-5">
                  <p className="font-display font-semibold text-2xl leading-tight text-paper transition-colors group-hover:text-brand">
                    {m.role}
                  </p>
                  <p className="mt-1 font-quote italic text-lg text-smoke">
                    {m.quote}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── La manada ── */}
      <section className="bg-paper text-ink">
        <div className="px-5 md:px-10 xl:px-16 py-20 md:py-24 max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand mb-5">
              {t("page.ele.close.kicker")}
            </p>
            <h2 className="font-display font-semibold uppercase leading-[0.97] text-[clamp(2rem,4.4vw,3.8rem)] whitespace-pre-line">
              {t("page.ele.close.title")}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/65">
              {t("page.ele.close.p")}
            </p>
          </div>
          <button
            onClick={() => onNavigate("/contacto")}
            className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-all duration-300 hover:gap-4 shrink-0"
          >
            {t("page.ele.close.cta")}
            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
          </button>
        </div>
      </section>
    </PageShell>
  );
}
