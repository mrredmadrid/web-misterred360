import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import PageShell from "../components/PageShell";
import { getProcessSteps, getSeo } from "../lib/data";
import { useI18n } from "../lib/i18n";
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
   Página · MÉTODO 360 — las cinco fases en profundidad,
   con el arco de grados como motivo narrativo
   ─────────────────────────────────────────────────────────── */

const phaseMap: Record<string, { deg: string; accent: "brand" | "ocean" }> = {
  "01": { deg: "72°", accent: "brand" },
  "02": { deg: "144°", accent: "ocean" },
  "03": { deg: "216°", accent: "brand" },
  "04": { deg: "288°", accent: "ocean" },
  "05": { deg: "360°", accent: "brand" },
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function MetodoPage({
  onNavigate,
}: {
  onNavigate: (href: string) => void;
}) {
  const { t, locale } = useI18n();
  const processSteps = getProcessSteps(locale);
  const seo = getSeo(locale, "metodo");
  /* HowTo con las 5 fases */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${SITE}/metodo#howto`,
    name: seo.title,
    description: t("page.met.intro"),
    inLanguage: "es-ES",
    totalTime: "PT12W",
    step: processSteps.map((s) => ({
      "@type": "HowToStep",
      position: parseInt(s.index, 10),
      name: s.verb,
      text: s.description,
      image: `${SITE}${s.image}`,
      url: `${SITE}/metodo#${s.index}`,
    })),
  };
  return (
    <PageShell
      index="03"
      kicker="page.met.kicker"
      title="page.met.title"
      intro="page.met.intro"
      meta="page.met.meta"
      figure="/images/chimp-data.jpg"
      figureAlt="page.met.figure_alt"
      seoTitle={seo.title}
      seoDesc={seo.description}
      path="/metodo"
      ogImage={`${SITE}/images/chimp-data.jpg`}
      breadcrumbs={[
        { name: "Inicio", path: "/" },
        { name: t("page.met.kicker"), path: "/metodo" },
      ]}
      jsonLd={jsonLd}
      onNavigate={onNavigate}
    >
      {/* ── Línea de grados ── */}
      <div className="px-5 md:px-10 xl:px-16 max-w-[1600px] mx-auto pt-14">
        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.22em] text-ash">
          {["0°", "90°", "180°", "270°", "360°"].map((d) => (
            <span key={d} className="flex flex-col items-center gap-2">
              <span className="w-px h-4 bg-white/20" aria-hidden="true" />
              {d}
            </span>
          ))}
        </div>
        <div className="h-[3px] bg-white/10 rounded-full mt-2 overflow-hidden">
          <motion.div
            className="h-full bg-brand origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.6, ease }}
          />
        </div>
      </div>

      {/* ── Fases · cada una alterna fondo claro/oscuro ── */}
      {processSteps.map((step, i) => {
        const extra = phaseMap[step.index];
        const isBrand = extra.accent === "brand";
        const isDark = i % 2 === 0;
        const reversed = i % 2 === 1;
        const txtPrimary = isDark ? "text-paper" : "text-ink";
        const txtSecondary = isDark ? "text-smoke" : "text-ink/65";
        const txtMuted = isDark ? "text-ash" : "text-ink/45";
        const borderCol = isDark ? "border-white/10" : "border-ink/15";
        const pillBorder = isDark ? "border-white/15" : "border-ink/20";
        const pillHover = isDark
          ? "hover:border-brand hover:text-paper"
          : "hover:border-brand hover:text-ink";
        const numOutline = isBrand ? "text-outline-brand" : isDark ? "text-outline" : "text-outline-ink";
        return (
          <section key={step.index} id={step.index} className={isDark ? "bg-ink" : "bg-paper"}>
            <div className="px-5 md:px-10 xl:px-16 py-16 md:py-24 max-w-[1600px] mx-auto">
              <article className="grid lg:grid-cols-12 gap-10 lg:gap-16">
                {/* Columna numérica */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, ease }}
                  className={`lg:col-span-4 ${reversed ? "lg:order-2" : ""}`}
                >
                  <div className="lg:sticky lg:top-32">
                    <span
                      className={`font-display font-semibold leading-none text-[clamp(5rem,10vw,9rem)] block ${numOutline}`}
                      aria-hidden="true"
                    >
                      {step.index}
                    </span>
                    <div className="mt-6 flex items-center gap-4">
                      <span
                        className={`rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white ${
                          isBrand ? "bg-brand" : "bg-ocean"
                        }`}
                      >
                        {step.verb}
                      </span>
                      <span className={`font-display font-semibold text-2xl ${txtSecondary}`}>
                        {extra.deg}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Columna de contenido */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, delay: 0.1, ease }}
                  className={`lg:col-span-8 ${reversed ? "lg:order-1" : ""}`}
                >
                  <h2 className={`font-display font-semibold leading-tight text-[clamp(1.9rem,3.8vw,3.2rem)] ${txtPrimary}`}>
                    {step.title}
                  </h2>
                  <p className={`mt-6 text-lg leading-relaxed max-w-2xl ${isDark ? "text-paper/85" : "text-ink/85"}`}>
                    {step.description}
                  </p>
                  <p className={`mt-4 text-[15px] leading-relaxed max-w-2xl ${txtSecondary}`}>
                    {step.extended}
                  </p>

                  <div className={`mt-8 rounded-[2rem] overflow-hidden border ${borderCol} aspect-[4/5] sm:aspect-[4/3] md:aspect-[16/10] group`}>
                    <img
                      src={step.image}
                      alt={step.verb}
                      className="w-full h-full object-cover object-[center_22%] duotone-red transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>

                  <p className={`mt-8 text-[10px] font-semibold uppercase tracking-[0.28em] ${txtMuted}`}>
                    {t("page.met.deliverables")}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {step.deliverables.map((d) => (
                      <span
                        key={d}
                        className={`rounded-full border ${pillBorder} px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] ${txtSecondary} transition-colors ${pillHover}`}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </article>
            </div>
          </section>
        );
      })}

      {/* ── El bucle ── */}
      <section className="bg-paper text-ink">
        <div className="px-5 md:px-10 xl:px-16 py-20 md:py-24 max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8">
            <h2 className="font-display font-semibold uppercase leading-[0.97] text-[clamp(2rem,4.4vw,3.8rem)] whitespace-pre-line">
              <Rich text={t("page.met.close.title")} />
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/65 max-w-xl">
              {t("page.met.close.p")}
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <button
              onClick={() => onNavigate("/contacto")}
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-all duration-300 hover:gap-4"
            >
              {t("page.met.close.cta")}
              <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
