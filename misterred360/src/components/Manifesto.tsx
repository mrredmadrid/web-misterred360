import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Kicker, LineReveal, Counter } from "./ui";
import { stats } from "../lib/data";
import { useI18n } from "../lib/i18n";

/* ───────────────────────────────────────────────────────────
   Sección 01 · EL MANIFIESTO — declaración editorial en claro
   ─────────────────────────────────────────────────────────── */

export default function Manifesto() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-22% 0px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  const ease = [0.22, 1, 0.36, 1] as const;
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 28 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section ref={sectionRef} id="manifiesto" className="relative bg-paper text-ink">
      <div className="px-5 md:px-10 xl:px-16 py-24 md:py-36 max-w-[1600px] mx-auto">
        <motion.div {...rise(0)}>
          <Kicker index="01" dark>
            {t("manifesto.kicker")}
          </Kicker>
        </motion.div>

        <LineReveal
          as="h2"
          start={inView}
          delay={0.15}
          className="mt-6 font-display font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(1.9rem,6.4vw,6.2rem)]"
          text={t("manifesto.title")}
        />

        <div className="mt-16 grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Columna de texto */}
          <div className="lg:col-span-7 space-y-8">
            <motion.p {...rise(0.3)} className="text-xl md:text-2xl leading-snug font-medium max-w-2xl">
              <span className="text-brand">{t("manifesto.eco")}</span> {t("manifesto.p1")}
            </motion.p>
            <motion.p {...rise(0.42)} className="text-base md:text-lg leading-relaxed text-ink/65 max-w-xl">
              {t("manifesto.p2")}
            </motion.p>

            <motion.div {...rise(0.54)} className="flex items-center gap-6 pt-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-ink/80 shrink-0">
                <img
                  src="/images/chimp-bw.jpg"
                  alt="Retrato en blanco y negro del chimpancé de MISTERRED360"
                  className="w-full h-full object-cover object-[center_18%]"
                  loading="lazy"
                />
              </div>
              <p className="font-quote italic text-xl md:text-2xl text-ink/80 whitespace-pre-line">
                {t("manifesto.quote")}
              </p>
            </motion.div>

            <motion.blockquote
              {...rise(0.66)}
              className="border-l-2 border-brand pl-6"
            >
              <p className="font-quote italic text-lg md:text-xl text-ink/75 leading-snug">
                {t("manifesto.ceo.quote")}
              </p>
              <cite className="mt-3 block not-italic text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45">
                {t("manifesto.ceo.role")}
              </cite>
            </motion.blockquote>
          </div>

          {/* Retrato con parallax */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={inView ? { clipPath: "inset(0% 0 0 0)" } : {}}
              transition={{ duration: 1, delay: 0.35, ease: [0.76, 0, 0.24, 1] }}
              className="relative rounded-[2rem] overflow-hidden aspect-[4/5] max-w-[440px] lg:ml-auto group"
              data-cursor="view"
            >
              <motion.img
                style={{ y: imgY, scale: 1.12 }}
                src="/images/team-manifesto.jpg"
                alt="El equipo de MISTERRED360: la manada al completo, en color"
                className="w-full h-full object-cover object-[center_20%]"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  img.onerror = null;
                  img.src = "/images/chimp-bw.jpg";
                  img.alt = "El chimpancé de MISTERRED360 en retrato editorial monocromo";
                  img.className = "w-full h-full object-cover object-[center_20%] duotone-red";
                }}
              />
              <div className="absolute top-4 right-4 rounded-full bg-ink text-paper px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em]">
                {t("manifesto.badge")}
              </div>
            </motion.div>
            <motion.p {...rise(0.6)} className="mt-4 text-[11px] uppercase tracking-[0.28em] text-ink/45 max-w-[440px] lg:ml-auto">
              {t("manifesto.fig")}
            </motion.p>
          </div>
        </div>

        {/* Cifras */}
        <motion.div
          {...rise(0.5)}
          className="mt-20 pt-10 border-t border-ink/15 grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display font-semibold text-5xl md:text-6xl leading-none">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-ink/55">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
