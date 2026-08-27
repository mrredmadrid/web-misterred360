import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import { castMembers } from "../lib/data";
import { useI18n } from "../lib/i18n";
import { Kicker, LineReveal } from "./ui";
import CastImage from "./CastImage";

/* ───────────────────────────────────────────────────────────
   Sección 05 · EL ELENCO — slider arrastrable con las
   versiones del personaje: firma gráfica de la marca
   ─────────────────────────────────────────────────────────── */

export default function ChimpGallery() {
  const { t } = useI18n();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!viewportRef.current || !trackRef.current) return;
      setDist(
        Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth)
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section id="elenco" className="bg-paper text-ink overflow-hidden">
      {/* Cabecera: usamos solo padding superior para no crear colchón
          contra la galería que va justo debajo. */}
      <div className="px-5 md:px-10 xl:px-16 pt-24 md:pt-32 pb-6 md:pb-8 max-w-[1600px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Kicker index="05" dark>
              {t("cast.kicker")}
            </Kicker>
            <LineReveal
              as="h2"
              className="mt-6 md:mt-8 font-display font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(2.4rem,5.6vw,5.4rem)]"
              text={t("cast.title")}
            />
            <p className="mt-6 text-base md:text-lg text-ink/65 leading-relaxed max-w-xl">
              {t("cast.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-3 text-ink/50">
            <MoveHorizontal className="w-5 h-5" />
            <span className="text-[11px] uppercase tracking-[0.28em]">
              {t("cast.drag")}
            </span>
          </div>
        </div>
      </div>

      {/* Galería: sin padding-top propio, se pega a la cabecera. */}
      <div
        ref={viewportRef}
        className="pl-5 md:pl-10 xl:pl-16 pb-24 md:pb-32"
        data-cursor="drag"
      >
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -dist, right: 0 }}
          dragElastic={0.07}
          className="flex gap-6 md:gap-8 w-max pr-10 select-none"
        >
          {castMembers.map((m, i) => (
            <figure key={m.id} className="w-[270px] md:w-[340px] shrink-0 group">
              <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-ink/5">
                <CastImage
                  src={m.image}
                  alt={t(`cast.${m.id}.role`)}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  loading="lazy"
                  draggable={false}
                />
                <span className="absolute top-4 left-4 rounded-full bg-paper/90 backdrop-blur px-3.5 py-1.5 font-display font-semibold text-sm text-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-ink/70 backdrop-blur text-paper flex items-center justify-center text-sm font-semibold"
                  aria-label={m.gender === "f" ? "Femenino" : "Masculino"}
                >
                  {m.gender === "f" ? "♀" : "♂"}
                </span>
                <span className="absolute bottom-4 left-4 rounded-full bg-ink text-paper px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em]">
                  {t(`cast.${m.id}.area`)}
                </span>
              </div>
              <figcaption className="mt-5 flex items-baseline justify-between gap-4">
                <span className="font-display font-semibold text-2xl leading-tight">
                  {t(`cast.${m.id}.role`)}
                </span>
                <span className="font-quote italic text-lg text-ink/55 text-right">
                  {t(`cast.${m.id}.quote`)}
                </span>
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
