import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Phone, Clock, PenLine, Phone as PhoneIcon, MessageCircle } from "lucide-react";
import PageShell from "../components/PageShell";
import ContactBlock from "../components/ContactBlock";
import BookingBlock from "../components/BookingBlock";
import { useI18n } from "../lib/i18n";
import { SITE } from "../lib/seo";
import { buildWhatsAppUrl } from "../lib/whatsapp";

/* ───────────────────────────────────────────────────────────
   Página · CONTACTO (#/contacto)
   Sistema de dos pestañas visibles a la vez:
   · Por escrito (formulario largo)
   · Pedir llamada (día + franja)
   Debajo, tarjeta con información completa de la empresa.
   ─────────────────────────────────────────────────────────── */

type Tab = "form" | "call";

const ease = [0.22, 1, 0.36, 1] as const;

export default function ContactPage({
  onNavigate,
}: {
  onNavigate: (href: string) => void;
}) {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("form");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE}/contacto#contact`,
    name: t("page.cont.seo.title"),
    description: t("page.cont.seo.desc"),
    url: `${SITE}/contacto`,
    mainEntity: {
      "@type": "Organization",
      "@id": `${SITE}/#organizacion`,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: "misterred@misterred360.es",
          telephone: "+34910360360",
          areaServed: "ES",
          availableLanguage: ["es", "en"],
        },
      ],
    },
  };

  return (
    <PageShell
      index="08"
      kicker="contact.kicker"
      title="page.cont.title"
      intro="page.cont.intro"
      meta="page.cont.meta"
      figure="/images/chimp-cta.jpg"
      figureAlt="page.cont.figure_alt"
      seoTitle="page.cont.seo.title"
      seoDesc="page.cont.seo.desc"
      path="/contacto"
      ogImage={`${SITE}/images/chimp-cta.jpg`}
      breadcrumbs={[
        { name: "Inicio", path: "/" },
        { name: t("contact.kicker"), path: "/contacto" },
      ]}
      jsonLd={jsonLd}
      onNavigate={onNavigate}
      hideCta
    >
      {/* ── SECCIÓN 1 · Selector de pestañas + panel activo ── */}
      <section
        className="relative bg-ink"
        aria-label={t("page.cont.form_aria")}
      >
        <div
          className="absolute inset-0 glow-ocean pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative px-5 md:px-10 xl:px-16 py-14 md:py-20 max-w-[1500px] mx-auto">
          {/* ─── Tabs · ambas visibles a la vez ─── */}
          <div
            role="tablist"
            aria-label={t("contact.tabs.aria")}
            className="mx-auto max-w-2xl grid grid-cols-2 gap-2 p-1.5 bg-coal/70 border border-white/10 rounded-full mb-10"
          >
            <TabButton
              active={tab === "form"}
              onClick={() => setTab("form")}
              icon={<PenLine className="w-4 h-4" strokeWidth={1.9} />}
              label={t("contact.tab.form.label")}
              hint={t("contact.tab.form.hint")}
              id="tab-form"
              controls="panel-form"
            />
            <TabButton
              active={tab === "call"}
              onClick={() => setTab("call")}
              icon={<PhoneIcon className="w-4 h-4" strokeWidth={1.9} />}
              label={t("contact.tab.call.label")}
              hint={t("contact.tab.call.hint")}
              id="tab-call"
              controls="panel-call"
            />
          </div>

          {/* ─── Vía directa: WhatsApp ─── */}
          <div className="mx-auto max-w-2xl mb-10 -mt-4 flex justify-center">
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-smoke hover:text-brand hover:border-brand/50 transition-colors"
            >
              <MessageCircle className="w-4 h-4" strokeWidth={1.9} />
              {t("contact.whatsapp.cta")}
            </a>
          </div>

          {/* ─── Contenedor del panel activo ─── */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {tab === "form" ? (
                <motion.div
                  key="form"
                  role="tabpanel"
                  id="panel-form"
                  aria-labelledby="tab-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <div className="text-center max-w-2xl mx-auto mb-10">
                    <h2 className="font-display font-semibold uppercase leading-[0.98] text-[clamp(1.6rem,3.4vw,2.4rem)] text-paper">
                      {t("contact.tab.form.title")}
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-smoke leading-relaxed">
                      {t("contact.tab.form.desc")}
                    </p>
                  </div>
                  <ContactBlock />
                </motion.div>
              ) : (
                <motion.div
                  key="call"
                  role="tabpanel"
                  id="panel-call"
                  aria-labelledby="tab-call"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <div className="text-center max-w-2xl mx-auto mb-10">
                    <h2 className="font-display font-semibold uppercase leading-[0.98] text-[clamp(1.6rem,3.4vw,2.4rem)] text-paper">
                      {t("contact.tab.call.title")}
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-smoke leading-relaxed">
                      {t("contact.tab.call.desc")}
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    <aside className="lg:col-span-4 space-y-4">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand mb-3">
                          {t("call.aside.kicker")}
                        </p>
                        <p className="font-display font-semibold text-lg text-paper leading-tight whitespace-pre-line">
                          {t("call.aside.title")}
                        </p>
                        <p className="mt-3 text-sm text-smoke leading-relaxed">
                          {t("call.aside.desc")}
                        </p>
                      </div>

                      <ul className="space-y-2.5 text-sm text-smoke px-2">
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
                    </aside>

                    <div className="lg:col-span-8 bg-coal/85 border border-white/10 rounded-[2rem] p-6 md:p-8 backdrop-blur">
                      <BookingBlock />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 2 · Información de la empresa ── */}
      <CompanyInfo />
    </PageShell>
  );
}

/* ══════════════════════════════════════════════════════
   TabButton · botón de pestaña con estado activo
   ══════════════════════════════════════════════════════ */
function TabButton({
  active,
  onClick,
  icon,
  label,
  hint,
  id,
  controls,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  hint: string;
  id: string;
  controls: string;
}) {
  return (
    <button
      id={id}
      role="tab"
      aria-selected={active}
      aria-controls={controls}
      onClick={onClick}
      className={`relative flex items-center justify-center gap-3 rounded-full px-4 py-3 md:py-3.5 text-left transition-colors duration-300 ${
        active
          ? "bg-brand text-white shadow-[0_10px_30px_-10px_rgba(232,38,43,0.5)]"
          : "text-paper hover:bg-white/[0.04]"
      }`}
    >
      <span
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          active ? "bg-white/20" : "bg-white/[0.06] border border-white/10"
        }`}
      >
        {icon}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[13px] font-semibold uppercase tracking-[0.1em]">
          {label}
        </span>
        <span
          className={`text-[10px] font-medium mt-0.5 ${
            active ? "text-white/80" : "text-smoke"
          }`}
        >
          {hint}
        </span>
      </span>
    </button>
  );
}

/* ══════════════════════════════════════════════════════
   CompanyInfo · tarjeta con datos completos de la empresa
   ══════════════════════════════════════════════════════ */
function CompanyInfo() {
  const { t } = useI18n();

  return (
    <section
      className="relative bg-paper text-ink border-t border-ink/5"
      aria-label={t("contact.company.aria")}
    >
      <div className="px-5 md:px-10 xl:px-16 py-16 md:py-24 max-w-[1500px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand mb-4">
            {t("contact.company.kicker")}
          </p>
          <h2 className="font-display font-semibold uppercase leading-[0.98] text-[clamp(1.8rem,4vw,3rem)]">
            {t("contact.company.title")}
          </h2>
          <p className="mt-4 text-sm md:text-base text-ink/60 leading-relaxed">
            {t("contact.company.desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <InfoCard
            icon={<Mail className="w-5 h-5" strokeWidth={1.7} />}
            label={t("form.email")}
            value="misterred@misterred360.es"
            href="mailto:misterred@misterred360.es"
          />
          <InfoCard
            icon={<Phone className="w-5 h-5" strokeWidth={1.7} />}
            label={t("form.phone")}
            value="+34 910 360 360"
            href="tel:+34910360360"
          />
          <InfoCard
            icon={<MapPin className="w-5 h-5" strokeWidth={1.7} />}
            label={t("form.address")}
            value="Las Rozas de Madrid"
            hint="España"
          />
          <InfoCard
            icon={<Clock className="w-5 h-5" strokeWidth={1.7} />}
            label={t("contact.company.hours")}
            value="09:00 – 18:00"
            hint="Lun – Vie"
          />
        </div>

        {/* Datos fiscales legales · pequeña línea al pie */}
        <div className="mt-10 pt-8 border-t border-ink/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-ink/55">
          <p>
            <span className="font-semibold text-ink/80">MR. RED S.L.</span>{" "}
            · CIF B56916133 · {t("contact.company.legal")}
          </p>
          <p className="uppercase tracking-[0.18em] font-semibold text-ink/60">
            {t("contact.company.reply")}
          </p>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  label,
  value,
  hint,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  href?: string;
}) {
  const inner = (
    <>
      <span className="w-11 h-11 rounded-full bg-ink text-paper flex items-center justify-center mb-4 group-hover:bg-brand transition-colors duration-300">
        {icon}
      </span>
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/45 mb-1.5">
        {label}
      </p>
      <p className="font-display font-semibold text-lg md:text-xl text-ink leading-tight break-words">
        {value}
      </p>
      {hint && (
        <p className="text-xs text-ink/55 mt-1.5 leading-relaxed">{hint}</p>
      )}
    </>
  );

  const cls =
    "group relative bg-white border border-ink/10 rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(8,8,10,0.2)] hover:border-brand/40";

  return href ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
