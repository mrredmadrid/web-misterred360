import { motion } from "framer-motion";
import { Eye, Antenna, BrainCircuit, Handshake } from "lucide-react";
import { differentials, stats } from "../lib/data";
import { useI18n } from "../lib/i18n";
import { Kicker, LineReveal, Counter } from "./ui";

/* ───────────────────────────────────────────────────────────
   Sección 04 · DIFERENCIALES — por qué una visión 360 y
   banda roja de resultados
   ─────────────────────────────────────────────────────────── */

const icons = [Eye, Antenna, BrainCircuit, Handshake];

export default function WhyUs() {
  const { t } = useI18n();
  return (
    <section id="porque" className="relative bg-ink overflow-hidden">
      <div className="absolute inset-0 glow-brand pointer-events-none" aria-hidden="true" />
      <div className="relative px-5 md:px-10 xl:px-16 py-24 md:py-36 max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-14 md:mb-20">
          <div className="lg:col-span-7">
            <Kicker index="04">{t("whyus.kicker")}</Kicker>
            <LineReveal
              as="h2"
              className="mt-10 font-display font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(2.4rem,5.6vw,5.4rem)]"
              text={t("whyus.title")}
            />
          </div>
          <p className="lg:col-span-5 text-smoke text-base md:text-lg leading-relaxed max-w-md lg:ml-auto">
            {t("whyus.desc")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {differentials.map((d, i) => {
            const Icon = icons[i];
            return (
              <motion.article
                key={d.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-coal border border-white/[0.07] rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/40"
              >
                <span className="w-12 h-12 rounded-full border border-brand/60 text-brand flex items-center justify-center mb-8 transition-colors duration-500 group-hover:bg-brand group-hover:text-white">
                  <Icon className="w-5 h-5" strokeWidth={1.7} />
                </span>
                <h3 className="font-display font-semibold text-2xl leading-tight text-paper">
                  {d.title}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-smoke">{d.description}</p>
                <span className="mt-8 block font-display text-sm text-ash group-hover:text-brand transition-colors">
                  0{i + 1} —
                </span>
              </motion.article>
            );
          })}
        </div>

        {/* Banda roja de resultados */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-20 rounded-[2.5rem] bg-brand overflow-hidden"
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
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 rounded-2xl border border-white/[0.07] bg-coal/60 px-8 py-6"
        >
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
            {t("whyus.partners.kicker")}
          </span>
          <p className="text-sm md:text-[15px] leading-relaxed text-smoke">
            {t("whyus.partners.desc")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
