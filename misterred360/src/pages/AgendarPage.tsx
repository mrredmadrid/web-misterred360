import PageShell from "../components/PageShell";
import BookingBlock from "../components/BookingBlock";
import { useI18n } from "../lib/i18n";
import { SITE } from "../lib/seo";

/* ───────────────────────────────────────────────────────────
   Página · AGENDAR LLAMADA (#/agendar)
   Pedir llamada = día + franja aproximada. Te llamamos nosotros.
   ─────────────────────────────────────────────────────────── */

export default function AgendarPage({
  onNavigate,
}: {
  onNavigate: (href: string) => void;
}) {
  const { t } = useI18n();

  return (
    <PageShell
      index="09"
      kicker="agendar.kicker"
      title="agendar.title"
      intro="agendar.intro"
      meta="agendar.meta"
      figure="/images/chimp-strategy.jpg"
      figureAlt="agendar.figure_alt"
      seoTitle="agendar.seo.title"
      seoDesc="agendar.seo.desc"
      path="/agendar"
      ogImage={`${SITE}/images/chimp-strategy.jpg`}
      breadcrumbs={[
        { name: "Inicio", path: "/" },
        { name: t("agendar.kicker"), path: "/agendar" },
      ]}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${SITE}/agendar#page`,
        name: t("agendar.seo.title"),
        description: t("agendar.seo.desc"),
        url: `${SITE}/agendar`,
        inLanguage: "es-ES",
        publisher: { "@id": `${SITE}/#organizacion` },
        potentialAction: {
          "@type": "ReserveAction",
          name: "Pedir llamada",
          target: `${SITE}/#/agendar`,
        },
      }}
      onNavigate={onNavigate}
      hideCta
    >
      <section
        className="relative bg-ink"
        aria-label={t("agendar.aria")}
      >
        <div className="absolute inset-0 glow-brand pointer-events-none" aria-hidden="true" />
        <div className="relative px-5 md:px-10 xl:px-16 py-16 md:py-24 max-w-[1500px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* ── Columna izquierda · contexto ── */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand mb-3">
                  {t("call.aside.kicker")}
                </p>
                <p className="font-display font-semibold text-xl text-paper leading-tight whitespace-pre-line">
                  {t("call.aside.title")}
                </p>
                <p className="mt-3 text-sm text-smoke leading-relaxed">
                  {t("call.aside.desc")}
                </p>
              </div>

              <ul className="space-y-3 text-sm text-smoke">
                {[
                  t("call.perk.1"),
                  t("call.perk.2"),
                  t("call.perk.3"),
                  t("call.perk.4"),
                ].map((p) => (
                  <li key={p} className="flex gap-3">
                    <span
                      className="mt-2 w-1.5 h-1.5 rounded-full bg-brand shrink-0"
                      aria-hidden="true"
                    />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              {/* Enlace lateral al formulario largo */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-smoke mb-3">
                  {t("agendar.alt.kicker")}
                </p>
                <p className="text-sm text-paper leading-relaxed mb-4">
                  {t("agendar.alt.desc")}
                </p>
                <button
                  onClick={() => onNavigate("#/contacto")}
                  className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand hover:text-flame transition-colors"
                >
                  {t("agendar.alt.cta")} →
                </button>
              </div>
            </aside>

            {/* ── Columna derecha · el formulario ── */}
            <div className="lg:col-span-8 bg-coal/85 border border-white/10 rounded-[2rem] p-6 md:p-9 backdrop-blur">
              <BookingBlock />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
