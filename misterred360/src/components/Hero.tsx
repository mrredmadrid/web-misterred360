import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { navigateTo, scrollToHash } from "../lib/scroll";
import { useI18n } from "../lib/i18n";
import { getHero } from "../lib/data";
import { LineReveal, OrbitBadge } from "./ui";

/* ───────────────────────────────────────────────────────────
   Hero · reveal por capas: parrilla editorial + titular
   por líneas + chimpancé en arco con parallax y chips
   ─────────────────────────────────────────────────────────── */

export default function Hero({ start }: { start: boolean }) {
  const { t, locale } = useI18n();
  const hero = getHero(locale);
  const chips = [
    { label: hero.chips.prensa, dot: "bg-brand", pos: "top-[16%] -right-4 md:-right-10", anim: "animate-float" },
    { label: hero.chips.branding, dot: "bg-ocean", pos: "bottom-[30%] -left-4 md:-left-12", anim: "animate-float-delay" },
    { label: hero.chips.av, dot: "bg-brand", pos: "bottom-[8%] right-[12%]", anim: "animate-float" },
    { label: hero.chips.estrategia, dot: "bg-ocean", pos: "top-[44%] -left-6 md:-left-16", anim: "animate-float" },
    { label: hero.chips.impacto, dot: "bg-brand", pos: "top-[2%] left-[14%]", anim: "animate-float-delay" },
  ];
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 130]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);
  const frameRotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -6]);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: start ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      ref={ref}
      id="top"
      className="relative min-h-svh flex flex-col justify-center overflow-hidden bg-ink"
    >
      {/* Capas de ambiente */}
      <div className="absolute inset-0 glow-brand" aria-hidden="true" />
      <div className="absolute inset-0 glow-ocean" aria-hidden="true" />
      {/* Parrilla editorial de fondo */}
      <div
        className="absolute inset-0 hidden md:flex justify-between px-[8vw] pointer-events-none"
        aria-hidden="true"
      >
        {[...Array(5)].map((_, i) => (
          <span key={i} className="w-px h-full bg-white/[0.045]" />
        ))}
      </div>

      <div className="relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-6 items-center px-5 md:px-10 xl:px-16 pt-32 pb-20 lg:pt-36">
        {/* Columna de texto */}
        <motion.div style={{ opacity: textOpacity }} className="lg:col-span-7 relative">
          <motion.div {...fade(0.35)} className="flex items-center gap-4 mb-7">
            <svg
              viewBox="0 0 20 20"
              className="w-4 h-4 text-brand"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 0l2 7 7 3-7 3-2 7-2-7-7-3 7-3 2-7z" />
            </svg>
            <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-smoke">
              {hero.kicker}
            </span>
            <span className="hidden sm:block h-px w-20 bg-white/15" />
          </motion.div>

          <div className="relative">
            <LineReveal
              as="h1"
              start={start}
              delay={0.45}
              className="font-display font-semibold uppercase leading-[0.94] tracking-[-0.02em] text-[clamp(1.9rem,5.8vw,5.9rem)]"
              text={hero.title}
            />
            {/* Badge rotatorio solapado sobre el titular */}
            <motion.div
              {...fade(1.25)}
              className="hidden xl:block absolute -right-4 top-[6%] w-32 h-32"
            >
              <OrbitBadge className="w-full h-full" />
            </motion.div>
          </div>

          <motion.p
            {...fade(0.95)}
            className="mt-8 max-w-xl text-base md:text-lg leading-relaxed text-smoke"
          >
            <TranslatedRich text={hero.description} />
          </motion.p>

          <motion.div {...fade(1.1)} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="/contacto"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("/contacto");
              }}
              className="group inline-flex items-center gap-3 rounded-full bg-brand px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-flame hover:gap-4 shadow-[0_0_40px_-8px_rgba(232,38,43,0.5)]"
            >
              {hero.ctaPrimary}
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
            </a>
            <a
              href="#servicios"
              onClick={(e) => {
                e.preventDefault();
                scrollToHash("#servicios");
              }}
              className="inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-paper transition-colors duration-300 hover:bg-paper hover:text-ink"
            >
              {hero.ctaSecondary}
            </a>
          </motion.div>

          <motion.div
            {...fade(1.3)}
            className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.25em] text-ash"
          >
            {hero.audience.split(" / ").map((piece, idx, arr) => (
              <span key={piece} className="flex items-center gap-x-6">
                <span>{piece}</span>
                {idx < arr.length - 1 && <span className="text-brand">/</span>}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Columna visual: el icono de la marca */}
        <div className="lg:col-span-5">
          <motion.div
            style={{ y: imgY, rotate: frameRotate }}
            className="relative aspect-[4/5] w-full max-w-[460px] mx-auto lg:ml-auto"
          >
            {/* Marcos de eco detrás */}
            <div
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-t-full rounded-b-[2.5rem] border border-brand/50"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 -translate-x-3 -translate-y-3 rounded-t-full rounded-b-[2.5rem] border border-ocean/40"
              aria-hidden="true"
            />

            {/* Arco principal con reveal por máscara */}
            <motion.div
              className="absolute inset-0 rounded-t-full rounded-b-[2.5rem] overflow-hidden border border-white/10 will-change-[clip-path]"
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              animate={start ? { clipPath: "inset(0% 0% 0% 0%)" } : {}}
              transition={{ duration: 1.15, delay: 0.65, ease: [0.76, 0, 0.24, 1] }}
            >
              <motion.img
                src="/images/gioconda-chimp.png"
                alt="La Gioconda reinterpretada con el chimpancé de MISTERRED360"
                className="w-full h-full object-cover object-center"
                initial={{ scale: 1.28 }}
                animate={start ? { scale: 1.04 } : {}}
                transition={{ duration: 1.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
                fetchPriority="high"
              />
              {/* Vignette inferior */}
              <div
                className="absolute inset-x-0 bottom-0 h-1/3"
                style={{
                  background:
                    "radial-gradient(120% 90% at 50% 115%, rgba(8,8,10,0.85), transparent 60%)",
                }}
                aria-hidden="true"
              />
            </motion.div>

            {/* Chips flotantes */}
            {chips.map((c, i) => (
              <motion.span
                key={c.label}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={start ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.4 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute ${c.pos} ${c.anim} z-10 inline-flex items-center gap-2 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/15 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-paper`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                {c.label}
              </motion.span>
            ))}

            {/* Etiqueta del personaje */}
            <motion.div
              {...fade(1.55)}
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 max-w-[90%] rounded-full bg-ink border border-white/15 px-5 py-3 shadow-2xl text-center"
            >
              <p className="text-[10px] uppercase tracking-[0.28em] text-smoke">
                {hero.badge}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        {...fade(1.7)}
        className="absolute bottom-8 left-5 md:left-10 flex items-center gap-4"
        aria-hidden="true"
      >
        <span className="relative block w-px h-14 bg-white/15 overflow-hidden scroll-line" />
        <span className="text-[10px] uppercase tracking-[0.35em] text-ash">
          {t("hero.scroll")}
        </span>
      </motion.div>
    </section>
  );
}

/* Renderiza un texto con marcadores {b}...{/b} en negrita */
function TranslatedRich({ text }: { text: string }) {
  const parts = text.split(/(\{b\}[^{]+\{\/b\})/g);
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
