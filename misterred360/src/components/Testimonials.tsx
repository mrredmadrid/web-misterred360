import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { testimonials } from "../lib/data";
import { useI18n } from "../lib/i18n";
import { Kicker } from "./ui";
import { useLightbox } from "./Lightbox";

/* ───────────────────────────────────────────────────────────
   Sección 06 · REPUTACIÓN — testimonios con avance automático
   y retrato monocromo del personaje
   ─────────────────────────────────────────────────────────── */

/* Iniciales del nombre para el avatar circular (sin fotos reales aún) */
function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function Testimonials() {
  const { t } = useI18n();
  const openLightbox = useLightbox();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const item = testimonials[idx];

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIdx((v) => (v + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section
      id="testimonios"
      className="relative bg-ink overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 glow-ocean pointer-events-none" aria-hidden="true" />
      <div className="relative px-5 md:px-10 xl:px-16 py-24 md:py-36 max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-14">
        {/* Retrato */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-32">
            <motion.div
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              whileInView={{ clipPath: "inset(0 0 0% 0)" }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              className="relative rounded-[2rem] overflow-hidden aspect-[3/4] max-w-[380px] group"
              data-cursor="view"
              onClick={(e) => {
                const img = e.currentTarget.querySelector("img");
                if (img) openLightbox({ src: img.currentSrc || img.src, alt: img.alt });
              }}
            >
              <img
                src="/images/chimp-bw.jpg"
                alt="Retrato monocromo del chimpancé de MISTERRED360 escuchando atento"
                className="w-full h-full object-cover object-[center_20%] duotone-red"
                loading="lazy"
              />
            </motion.div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-ash max-w-[380px]">
              Escuchando a la manada desde 2011.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="flex items-center justify-between gap-6">
            <Kicker index="06">{t("testi.kicker")}</Kicker>
            <div className="hidden sm:flex items-center gap-1.5 text-brand" aria-label={t("testi.aria")}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-brand" />
              ))}
              <span className="ml-3 text-xs text-smoke tracking-[0.2em] uppercase">
                {t("testi.rating")}
              </span>
            </div>
          </div>

          <h2 className="mt-12 font-display font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(2rem,4.4vw,3.8rem)]">
            {t("testi.title.a")}
            <br />
            {t("testi.title.b")} <span className="text-brand">{t("testi.title.c")}</span>
          </h2>

          <div className="mt-10 min-h-[240px] md:min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={idx}
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-quote italic leading-[1.18] text-[clamp(1.7rem,3.4vw,3rem)] text-paper">
                  “{item.quote}”
                </p>
                <footer className="mt-10 flex items-center gap-4">
                  <span
                    className="w-12 h-12 rounded-full bg-brand/15 border border-brand/40 text-brand flex items-center justify-center font-display font-semibold text-sm shrink-0"
                    aria-hidden="true"
                  >
                    {initials(item.name)}
                  </span>
                  <div>
                    <p className="font-display font-semibold text-lg text-paper">{item.name}</p>
                    <p className="text-sm text-smoke">{item.role}</p>
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Controles */}
          <div className="mt-12 flex items-center justify-between">
            <div className="flex gap-2.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Ver testimonio ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === idx ? "w-10 bg-brand" : "w-4 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-display text-sm text-ash tabular-nums mr-2">
                0{idx + 1} / 0{testimonials.length}
              </span>
              <button
                onClick={() => setIdx((idx - 1 + testimonials.length) % testimonials.length)}
                className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center hover:bg-paper hover:text-ink transition-colors"
                aria-label={t("testi.prev")}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIdx((idx + 1) % testimonials.length)}
                className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center hover:bg-paper hover:text-ink transition-colors"
                aria-label={t("testi.next")}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
