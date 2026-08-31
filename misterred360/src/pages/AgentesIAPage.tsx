import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import PageShell from "../components/PageShell";
import { Kicker } from "../components/ui";
import { getAgentesIA, getSeo } from "../lib/data";
import { useI18n } from "../lib/i18n";
import { SITE } from "../lib/seo";

/* Renderiza texto con marcador {red}...{/red}, igual que el resto de páginas */
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
   Página · AGENTES IA — servicio de agentes de inteligencia
   artificial personalizados, con la misma voz editorial que
   el resto de la web
   ─────────────────────────────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;

export default function AgentesIAPage({
  onNavigate,
}: {
  onNavigate: (href: string) => void;
}) {
  const { t, locale } = useI18n();
  const a = getAgentesIA(locale);
  const seo = getSeo(locale, "agentesIA");
  const [openFaq, setOpenFaq] = useState(0);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${SITE}/agentes-ia#service`,
      name: a.hero.title,
      serviceType: "Desarrollo de agentes de inteligencia artificial",
      description: seo.description,
      provider: { "@id": `${SITE}/#organizacion` },
      areaServed: [{ "@type": "Country", name: "España" }],
      audience: { "@type": "Audience", audienceType: "Empresas y negocios" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${SITE}/agentes-ia#faq`,
      mainEntity: a.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <PageShell
      index="04"
      kicker={a.hero.kicker}
      title={a.hero.title}
      intro={a.hero.intro}
      meta={a.hero.meta}
      figure="/images/chimp-data.jpg"
      figureAlt="El Ingeniero: el chimpancé de MISTERRED360 revisando el panel de control de un agente de inteligencia artificial"
      seoTitle={seo.title}
      seoDesc={seo.description}
      path="/agentes-ia"
      ogImage={`${SITE}/images/chimp-data.jpg`}
      breadcrumbs={[
        { name: "Inicio", path: "/" },
        { name: a.hero.title, path: "/agentes-ia" },
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
            className="font-quote italic leading-[1.1] text-[clamp(2rem,5vw,4.4rem)] max-w-4xl"
          >
            <Rich text={a.statement} />
          </motion.blockquote>
        </div>
      </section>

      {/* ── B · Qué hace tu agente ── */}
      <section id="capacidades" className="relative bg-ink overflow-hidden">
        <div className="absolute inset-0 glow-brand pointer-events-none" aria-hidden="true" />
        <div className="relative px-5 md:px-10 xl:px-16 py-20 md:py-28 max-w-[1600px] mx-auto">
          <Kicker index="01">{t("page.ai.capabilities_kicker")}</Kicker>
          <h2 className="mt-8 font-display font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(2rem,4.6vw,4.2rem)] max-w-3xl">
            {t("page.ai.capabilities_title")}
          </h2>

          <div className="mt-14 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {a.capabilities.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.article
                  key={c.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease }}
                  className="group bg-coal border border-white/[0.07] rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/40"
                >
                  <span className="w-12 h-12 rounded-full border border-brand/60 text-brand flex items-center justify-center mb-8 transition-colors duration-500 group-hover:bg-brand group-hover:text-white">
                    <Icon className="w-5 h-5" strokeWidth={1.7} />
                  </span>
                  <h3 className="font-display font-semibold text-xl leading-tight text-paper">
                    {c.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-smoke">{c.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── C · Cómo lo construimos ── */}
      <section id="proceso" className="bg-paper text-ink">
        <div className="px-5 md:px-10 xl:px-16 py-20 md:py-28 max-w-[1600px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 items-end mb-14">
            <div className="lg:col-span-7">
              <Kicker index="02">{t("page.ai.process_kicker")}</Kicker>
              <h2 className="mt-8 font-display font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(2rem,4.6vw,4.2rem)]">
                {t("page.ai.process_title")}
              </h2>
            </div>
            <p className="lg:col-span-5 text-ink/65 text-base md:text-lg leading-relaxed max-w-md lg:ml-auto">
              {t("page.ai.process_desc")}
            </p>
          </div>

          <div className="border-t border-ink/10">
            {a.process.map((p, i) => (
              <motion.div
                key={p.index}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.7, delay: i * 0.06, ease }}
                className="group grid md:grid-cols-12 gap-4 md:gap-10 items-baseline border-b border-ink/10 py-9"
              >
                <span className="md:col-span-2 font-display font-semibold text-5xl md:text-6xl leading-none text-outline transition-all duration-500 group-hover:text-brand group-hover:[-webkit-text-stroke:0px]">
                  {p.index}
                </span>
                <h3 className="md:col-span-3 font-display font-semibold text-2xl md:text-3xl leading-tight">
                  {p.title}
                </h3>
                <p className="md:col-span-7 text-[15px] leading-relaxed text-ink/65 max-w-xl">
                  {p.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── D · Preguntas frecuentes ── */}
      <section id="faq" className="relative bg-ink border-t border-white/[0.07] overflow-hidden">
        <div className="absolute inset-0 glow-ocean pointer-events-none" aria-hidden="true" />
        <div className="relative px-5 md:px-10 xl:px-16 py-20 md:py-28 max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Kicker index="FAQ">{t("page.ai.faq_kicker")}</Kicker>
            <h2 className="mt-10 font-display font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(2rem,4.4vw,4rem)]">
              {t("page.ai.faq_title")}
            </h2>
            <button
              onClick={() => onNavigate("/contacto")}
              className="group mt-8 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand hover:text-flame transition-colors"
            >
              {t("page.ai.faq_cta")}
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
            </button>
          </div>

          <div className="lg:col-span-7">
            {a.faq.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={f.q} className="border-t border-white/10 last:border-b">
                  <h3 className="m-0">
                    <button
                      onClick={() => setOpenFaq(i)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center gap-5 md:gap-8 py-6 text-left group"
                    >
                      <span
                        className={`font-display text-sm font-semibold shrink-0 ${
                          isOpen ? "text-brand" : "text-ash"
                        }`}
                      >
                        0{i + 1}
                      </span>
                      <span
                        className={`flex-1 font-display font-semibold text-lg md:text-2xl leading-snug transition-colors duration-300 ${
                          isOpen ? "text-paper" : "text-smoke group-hover:text-paper"
                        }`}
                      >
                        {f.q}
                      </span>
                      <span
                        className={`w-9 h-9 shrink-0 rounded-full border flex items-center justify-center transition-all duration-500 ${
                          isOpen
                            ? "rotate-45 bg-brand border-brand text-white"
                            : "border-white/15 text-smoke"
                        }`}
                        aria-hidden="true"
                      >
                        <Plus className="w-4 h-4" />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease }}
                        className="overflow-hidden"
                      >
                        <p className="pb-7 pl-9 md:pl-[4.5rem] pr-2 text-[15px] md:text-base leading-relaxed text-smoke max-w-2xl">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
