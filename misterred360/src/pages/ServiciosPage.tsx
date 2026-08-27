import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import PageShell from "../components/PageShell";
import { serviceBlocks } from "../lib/data";
import { useI18n } from "../lib/i18n";
import { SITE } from "../lib/seo";

/* ───────────────────────────────────────────────────────────
   Página · SERVICIOS 360 — los 8 servicios desarrollados
   en profundidad, con navegación fija por bloques
   ─────────────────────────────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;

export default function ServiciosPage({
  onNavigate,
}: {
  onNavigate: (href: string) => void;
}) {
  const { t } = useI18n();
  const refs = useRef<Record<string, HTMLElement | null>>({});

  /* ── Datos estructurados: ItemList con los 8 servicios + Service por cada uno ── */
  const allServices = serviceBlocks.flatMap((b) => b.services);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${SITE}/servicios#lista`,
      itemListElement: allServices.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          "@id": `${SITE}/servicios#${s.id}`,
          name: t(`service.${s.id}.name`),
          description: t(`service.${s.id}.brief`),
          image: `${SITE}${s.image}`,
          serviceType: t(`service.${s.id}.name`),
          areaServed: { "@type": "Country", name: "España" },
          provider: { "@id": `${SITE}/#organizacion` },
          url: `${SITE}/servicios#${s.id}`,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Servicios de comunicación 360",
      description: t("page.srv.intro"),
      provider: { "@id": `${SITE}/#organizacion` },
      areaServed: { "@type": "Country", name: "España" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "MISTERRED360 · Servicios 360",
        itemListElement: serviceBlocks.map((b) => ({
          "@type": "OfferCatalog",
          name: t(`sblock.${b.id}.title`),
          description: t(`sblock.${b.id}.desc`),
          itemListElement: b.services.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: t(`service.${s.id}.name`),
              description: t(`service.${s.id}.long`),
            },
          })),
        })),
      },
    },
  ];

  const goBlock = (id: string) => {
    const el = refs.current[id];
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -132, duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PageShell
      index="02"
      kicker="page.srv.kicker"
      title="page.srv.title"
      intro="page.srv.intro"
      meta="page.srv.meta"
      figure="/images/chimp-ads.jpg"
      figureAlt="page.srv.figure_alt"
      seoTitle="page.srv.seo.title"
      seoDesc="page.srv.seo.desc"
      path="/servicios"
      ogImage={`${SITE}/images/chimp-ads.jpg`}
      breadcrumbs={[
        { name: "Inicio", path: "/" },
        { name: t("page.srv.kicker"), path: "/servicios" },
      ]}
      jsonLd={jsonLd}
      onNavigate={onNavigate}
    >
      {/* ── Navegación fija por bloques ── */}
      <div className="sticky top-[71px] z-40 bg-ink/85 backdrop-blur-md border-y border-white/10">
        <div className="px-5 md:px-10 xl:px-16 max-w-[1600px] mx-auto flex overflow-x-auto">
          {serviceBlocks.map((b) => (
            <button
              key={b.id}
              onClick={() => goBlock(b.id)}
              className="flex items-center gap-3 px-5 md:px-7 py-4 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] text-smoke transition-colors hover:text-paper"
            >
              <span className="font-display text-brand">{b.index}</span>
              {t(`sblock.${b.id}.title`)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bloques de servicios ── */}
      {serviceBlocks.map((block, bi) => {
        const isBrand = block.accent === "brand";
        return (
          <section
            key={block.id}
            id={block.id}
            ref={(el) => {
              refs.current[block.id] = el;
            }}
            className={`px-5 md:px-10 xl:px-16 py-20 md:py-28 scroll-mt-32 ${bi % 2 ? "bg-coal/50" : "bg-ink"}`}
          >
            <div className="max-w-[1600px] mx-auto">
              {/* Cabecera del bloque */}
              <div className="grid lg:grid-cols-12 gap-8 items-end mb-16">
                <div className="lg:col-span-8 flex items-start gap-6 md:gap-10">
                  <span
                    className={`font-display font-semibold leading-none text-7xl md:text-8xl shrink-0 ${
                      isBrand ? "text-outline-brand" : "text-outline"
                    }`}
                    aria-hidden="true"
                  >
                    {block.index}
                  </span>
                  <div>
                    <h2 className="font-display font-semibold uppercase leading-[0.97] tracking-[-0.02em] text-[clamp(2rem,4.6vw,4.2rem)]">
                      {t(`sblock.${block.id}.title`)}
                    </h2>
                    <p
                      className={`mt-4 text-sm font-semibold uppercase tracking-[0.22em] ${
                        isBrand ? "text-brand" : "text-steel"
                      }`}
                    >
                      {t(`sblock.${block.id}.claim`)}
                    </p>
                  </div>
                </div>
                <p className="lg:col-span-4 text-[15px] leading-relaxed text-smoke max-w-md lg:ml-auto">
                  {t(`sblock.${block.id}.desc`)}
                </p>
              </div>

              {/* Servicios del bloque */}
              <div className="space-y-20 md:space-y-24">
                {block.services.map((s, si) => {
                  const Icon = s.icon;
                  const reversed = si % 2 === 1;
                  return (
                    <article
                      key={s.id}
                      className="group grid lg:grid-cols-12 gap-10 lg:gap-16 items-center"
                    >
                      {/* Imagen */}
                      <motion.div
                        initial={{ opacity: 0, y: 34 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.8, ease }}
                        className={`lg:col-span-5 relative ${reversed ? "lg:order-2" : ""}`}
                        data-cursor="view"
                      >
                        <span
                          className="absolute -top-9 -left-2 font-display font-semibold text-7xl text-outline select-none"
                          aria-hidden="true"
                        >
                          {block.index}.{si + 1}
                        </span>
                        <div className="relative rounded-[2rem] overflow-hidden border border-white/10 aspect-[4/5] sm:aspect-[4/3]">
                          <img
                            src={s.image}
                            alt={s.imageAlt}
                            className="w-full h-full object-cover object-[center_22%] duotone-red transition-transform duration-700 group-hover:scale-[1.04]"
                            loading="lazy"
                            onError={(e) => {
                              const img = e.currentTarget;
                              if (img.src.includes("chimp-meeting")) {
                                img.src = img.src.replace("chimp-meeting", "chimp-data");
                              }
                            }}
                          />
                          <span
                            className={`absolute top-4 right-4 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white ${
                              isBrand ? "bg-brand" : "bg-ocean"
                            }`}
                          >
                            {t(`service.${s.id}.tag`)}
                          </span>
                        </div>
                      </motion.div>

                      {/* Contenido */}
                      <motion.div
                        initial={{ opacity: 0, y: 34 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.8, delay: 0.1, ease }}
                        className={`lg:col-span-7 ${reversed ? "lg:order-1" : ""}`}
                      >
                        <span
                          className={`inline-flex w-[3.25rem] h-[3.25rem] rounded-full border items-center justify-center mb-7 ${
                            isBrand ? "border-brand/60 text-brand" : "border-ocean/60 text-steel"
                          }`}
                        >
                          <Icon className="w-6 h-6" strokeWidth={1.6} />
                        </span>
                        <h3 className="font-display font-semibold leading-tight text-[clamp(1.8rem,3.4vw,3rem)] text-paper">
                          {t(`service.${s.id}.name`)}
                        </h3>
                        <p className="mt-5 text-lg md:text-xl font-medium leading-snug text-paper/90 max-w-2xl">
                          {t(`service.${s.id}.brief`)}
                        </p>
                        <p className="mt-4 text-[15px] leading-relaxed text-smoke max-w-2xl">
                          {t(`service.${s.id}.long`)}
                        </p>
                        <button
                          onClick={() => onNavigate("#/contacto")}
                          className={`group/link mt-8 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                            isBrand ? "text-brand hover:text-flame" : "text-steel hover:text-paper"
                          }`}
                        >
                          {t("page.srv.cta.service")}
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </button>
                      </motion.div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* ── Precios ── */}
      <section id="precios" className="relative bg-ink overflow-hidden scroll-mt-32">
        <div className="absolute inset-0 glow-brand pointer-events-none" aria-hidden="true" />
        <div className="relative px-5 md:px-10 xl:px-16 py-20 md:py-28 max-w-[1600px] mx-auto">
          <div className="max-w-2xl mb-14 md:mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand mb-5">
              {t("page.srv.pricing.kicker")}
            </p>
            <h2 className="font-display font-semibold uppercase leading-[0.97] text-[clamp(2rem,4.4vw,3.8rem)]">
              {t("page.srv.pricing.title")}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-smoke max-w-xl">
              {t("page.srv.pricing.desc")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {["web", "estrategia", "gabinete"].map((id, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease }}
                className="group bg-coal border border-white/[0.07] rounded-3xl p-8 flex flex-col transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/40"
              >
                <span className="font-display text-sm text-ash">0{i + 1} —</span>
                <h3 className="mt-5 font-display font-semibold text-2xl leading-tight text-paper">
                  {t(`page.srv.pricing.${id}.name`)}
                </h3>
                <p className="mt-4 font-display font-semibold text-3xl md:text-4xl text-brand">
                  {t(`page.srv.pricing.${id}.price`)}
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-smoke flex-1">
                  {t(`page.srv.pricing.${id}.desc`)}
                </p>
              </motion.div>
            ))}
          </div>

          <p className="mt-10 text-[13px] leading-relaxed text-ash max-w-2xl">
            {t("page.srv.pricing.note")}
          </p>
        </div>
      </section>

      {/* ── El círculo completo ── */}
      <section className="bg-paper text-ink">
        <div className="px-5 md:px-10 xl:px-16 py-20 md:py-24 max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand mb-5">
              {t("page.srv.close.kicker")}
            </p>
            <h2 className="font-display font-semibold uppercase leading-[0.97] text-[clamp(2rem,4.4vw,3.8rem)] whitespace-pre-line">
              {t("page.srv.close.title")}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/65">
              {t("page.srv.close.p")}
            </p>
          </div>
          <button
            onClick={() => onNavigate("#/contacto")}
            className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-all duration-300 hover:gap-4 shrink-0"
          >
            {t("page.srv.close.cta")}
            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
          </button>
        </div>
      </section>
    </PageShell>
  );
}
