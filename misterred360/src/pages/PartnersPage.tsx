import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import PageShell from "../components/PageShell";
import { getPartners, getSeo } from "../lib/data";
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
   Página · PARTNERS — alianzas internacionales para proyectos
   de gran formato, con la misma voz editorial que el resto
   de la web
   ─────────────────────────────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;

export default function PartnersPage({
  onNavigate,
}: {
  onNavigate: (href: string) => void;
}) {
  const { locale } = useI18n();
  const p = getPartners(locale);
  const seo = getSeo(locale, "partners");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}/partners#service`,
    name: p.hero.title,
    serviceType: "Alianzas internacionales de producción",
    description: seo.description,
    provider: { "@id": `${SITE}/#organizacion` },
    areaServed: { "@type": "Place", name: "Internacional" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "MISTERRED360 · Partners",
      itemListElement: p.pillars.map((pl) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: pl.title, description: pl.description },
      })),
    },
  };

  return (
    <PageShell
      index="06"
      titleSize="sm"
      kicker={p.hero.kicker}
      title={p.hero.title}
      intro={p.hero.intro}
      meta={p.hero.meta}
      figure="/images/oficina.png"
      figureAlt="El equipo de MISTERRED360 trabajando junto a sus partners"
      seoTitle={seo.title}
      seoDesc={seo.description}
      path="/partners"
      ogImage={`${SITE}/images/oficina.png`}
      breadcrumbs={[
        { name: "Inicio", path: "/" },
        { name: p.hero.title, path: "/partners" },
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
            <Rich text={p.statement} />
          </motion.blockquote>
        </div>
      </section>

      {/* ── B · Las cuatro disciplinas ── */}
      <section id="disciplinas" className="relative bg-ink overflow-hidden">
        <div className="absolute inset-0 glow-brand pointer-events-none" aria-hidden="true" />
        <div className="relative px-5 md:px-10 xl:px-16 py-20 md:py-28 max-w-[1600px] mx-auto">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {p.pillars.map((pl, i) => {
              const Icon = pl.icon;
              return (
                <motion.article
                  key={pl.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease }}
                  className="group bg-coal border border-white/[0.07] rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/40"
                >
                  <span className="w-12 h-12 rounded-full border border-brand/60 text-brand flex items-center justify-center mb-8 transition-colors duration-500 group-hover:bg-brand group-hover:text-white">
                    <Icon className="w-5 h-5" strokeWidth={1.7} />
                  </span>
                  <h3 className="font-display font-semibold text-xl leading-tight text-paper">
                    {pl.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-smoke">{pl.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── B.5 · Empresas con las que colaboramos ── */}
      <section className="relative bg-ink overflow-hidden border-t border-white/[0.07]">
        <div className="relative px-5 md:px-10 xl:px-16 py-20 md:py-24 max-w-[1600px] mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand mb-5">
            {p.logos.kicker}
          </p>
          <h2 className="font-display font-semibold uppercase leading-[0.97] text-[clamp(1.8rem,3.6vw,3rem)] max-w-3xl mb-12">
            {p.logos.title}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {p.logos.items.map((l, i) => (
              <CompanyLogo key={i} logo={l.logo} name={l.name} url={l.url} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── C · Cierre ── */}
      <section className="bg-paper text-ink">
        <div className="px-5 md:px-10 xl:px-16 py-20 md:py-24 max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand mb-5">
              {p.close.kicker}
            </p>
            <h2 className="font-display font-semibold uppercase leading-[0.97] text-[clamp(2rem,4.4vw,3.8rem)] whitespace-pre-line">
              {p.close.title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/65">{p.close.description}</p>
          </div>
          <button
            onClick={() => onNavigate("/contacto")}
            className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-all duration-300 hover:gap-4 shrink-0"
          >
            {p.close.cta}
            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
          </button>
        </div>
      </section>
    </PageShell>
  );
}

/* Hueco para el logo de una empresa: si hay web, es un enlace que
   abre esa web; si aún no se ha subido el logo, muestra el nombre
   a la espera de que se suba desde el panel de administración */
function CompanyLogo({
  logo,
  name,
  url,
  index,
}: {
  logo?: string;
  name?: string;
  url?: string;
  index: number;
}) {
  const label = name || `Logo ${index + 1}`;
  const className = `flex aspect-[3/2] items-center justify-center rounded-2xl border p-6 transition-colors duration-300 ${
    logo
      ? "border-white/10 bg-white hover:border-brand/50"
      : "border-dashed border-white/20 bg-white/5"
  }`;
  const content = logo ? (
    <img src={logo} alt={label} className="max-h-full max-w-full object-contain" loading="lazy" />
  ) : (
    <span className="text-center text-[9px] font-semibold uppercase leading-tight tracking-[0.1em] text-white/40">
      {label}
    </span>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }
  return <div className={className}>{content}</div>;
}
