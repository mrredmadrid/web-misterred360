import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { navigateTo } from "../lib/scroll";
import { useI18n } from "../lib/i18n";
import { LineReveal, OrbitBadge } from "./ui";

/* ───────────────────────────────────────────────────────────
   CTA final · momento de alto impacto: el chimpancé te señala
   ─────────────────────────────────────────────────────────── */

export default function CTA() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 1.14, 1]);

  return (
    <section ref={ref} className="relative min-h-[92svh] flex items-center bg-ink overflow-hidden">
      {/* El chimpancé señala: fondo con máscara radial y parallax */}
      <motion.div
        style={{ scale }}
        className="absolute inset-y-0 right-0 w-full lg:w-[62%] opacity-45 lg:opacity-100"
        aria-hidden="true"
      >
        <img
          src="/images/chimp-cta.jpg"
          alt=""
          className="w-full h-full object-cover object-[center_25%] lg:object-center"
          loading="lazy"
          style={{
            maskImage:
              "radial-gradient(85% 90% at 68% 50%, black 42%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(85% 90% at 68% 50%, black 42%, transparent 80%)",
          }}
        />
      </motion.div>
      <div className="absolute inset-0 glow-brand pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 px-5 md:px-10 xl:px-16 py-28 max-w-[1600px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4 mb-10"
        >
          <span className="font-display text-brand text-sm font-semibold">(¿?)</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-smoke">
            {t("cta.kicker")}
          </span>
          <span className="h-px w-16 bg-brand" aria-hidden="true" />
        </motion.div>

        <LineReveal
          as="h2"
          className="font-display font-semibold uppercase leading-[0.94] tracking-[-0.02em] text-[clamp(2rem,9vw,9rem)]"
          text={t("cta.title")}
        />

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-xl text-base md:text-lg leading-relaxed text-smoke"
        >
          <CtaDesc />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-wrap items-center gap-6"
        >
          <a
            href="#/contacto"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("#/contacto");
            }}
            className="group inline-flex items-center gap-3 rounded-full bg-brand px-8 py-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-flame hover:gap-4 shadow-[0_0_50px_-8px_rgba(232,38,43,0.55)]"
          >
            {t("cta.button")}
            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
          </a>
          <a
            href="mailto:misterred@misterred360.es"
            className="link-line font-display font-medium text-xl md:text-2xl text-paper"
          >
            misterred@misterred360.es
          </a>
        </motion.div>
      </div>

      <div className="absolute right-8 bottom-8 hidden xl:block w-28 h-28">
        <OrbitBadge
          className="w-full h-full"
          text="SIN COMPROMISO · PRIMERA LECTURA EN 48H · MISTERRED360 · "
        />
      </div>
    </section>
  );
}

function CtaDesc() {
  const { t } = useI18n();
  const raw = t("cta.desc");
  const parts = raw.split(/(\{b\}[^{]+\{\/b\})/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\{b\}(.+)\{\/b\}$/);
        return m ? (
          <span key={i} className="text-paper font-medium">
            {m[1]}
          </span>
        ) : (
          <span key={i}>{p}</span>
        );
      })}
    </>
  );
}
