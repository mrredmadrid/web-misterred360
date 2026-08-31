import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getProcessSteps } from "../lib/data";
import { useI18n } from "../lib/i18n";
import { navigateTo } from "../lib/scroll";
import { Kicker } from "./ui";

/* ───────────────────────────────────────────────────────────
   Sección 03 · MÉTODO 360 — versión resumida para la home.
   Las cinco fases en profundidad (con la experiencia de scroll
   apilado) viven en su propia página, /metodo; aquí solo un
   avance compacto con enlace a la versión completa, para no
   alargar la portada con una sección de varias pantallas.
   ─────────────────────────────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;

export default function Process() {
  const { t, locale } = useI18n();
  const processSteps = getProcessSteps(locale);

  return (
    <section id="metodo" className="relative bg-paper text-ink overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, #e8262b 0%, transparent 50%), radial-gradient(circle at 90% 90%, #2e55e8 0%, transparent 55%)",
        }}
      />

      <div className="relative px-5 md:px-10 xl:px-16 py-20 md:py-28 max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-12 md:mb-16">
          <div className="lg:col-span-7">
            <Kicker index="03" dark>
              {t("method.kicker")}
            </Kicker>
            <h2 className="mt-8 font-display font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(2rem,4.6vw,4.4rem)]">
              {t("method.title.a")}{" "}
              <span className="text-outline-ink">{t("method.title.b")}</span>
            </h2>
          </div>
          <p className="lg:col-span-5 text-ink/60 text-base md:text-lg leading-relaxed max-w-md lg:ml-auto">
            Cinco fases que giran en círculo alrededor de tu marca, cada vez
            con más criterio e impacto.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {processSteps.map((step, i) => (
            <motion.article
              key={step.index}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease }}
              className="group relative bg-white border border-ink/10 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-brand/40"
            >
              <span className="font-display font-semibold text-4xl leading-none text-outline-ink">
                {step.index}
              </span>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">
                {step.verb}
              </p>
              <h3 className="mt-2 font-display font-semibold text-lg leading-tight text-ink">
                {step.title}
              </h3>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-center lg:justify-start">
          <button
            onClick={() => navigateTo("/metodo")}
            className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-paper transition-all duration-300 hover:gap-4"
          >
            Ver el método completo
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
          </button>
        </div>
      </div>
    </section>
  );
}
