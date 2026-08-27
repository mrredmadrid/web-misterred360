import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { processSteps } from "../lib/data";
import { useI18n } from "../lib/i18n";
import { navigateTo } from "../lib/scroll";
import { Kicker, OrbitBadge } from "./ui";

/* ───────────────────────────────────────────────────────────
   Sección 03 · MÉTODO MILÍMETRO
   Fichas apiladas: cada una sticky con el mismo top y creciente
   z-index. Como sticky las mantiene fijas al llegar arriba y la
   siguiente monta encima al alcanzar la misma posición, se
   consigue el efecto de "cartas que se apilan al hacer scroll".
   ─────────────────────────────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;
const R = 30;
const CIRC = 2 * Math.PI * R;
const STICKY_TOP = 96;
/* Altura fija por ficha para reservar el "scroll runway" que
   permite que la siguiente entre desde abajo. Todas iguales. */
const CARD_HEIGHT_VH = 78;

export default function Process() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();

  /* Progreso general para el dial de grados */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.5,
  });
  const dashOffset = useTransform(smooth, [0.15, 0.85], [CIRC, 0]);
  const degrees = useTransform(smooth, (v) => {
    const clamped = Math.max(0, Math.min(1, (v - 0.15) / 0.7));
    return `${Math.round(clamped * 360)}°`;
  });
  const barScale = useTransform(smooth, [0.15, 0.85], [0, 1]);

  /* Todas las capas: fases + panel final */
  const layers = [
    ...processSteps.map((step, i) => ({ kind: "card" as const, step, i })),
    { kind: "closing" as const, i: processSteps.length },
  ];

  return (
    <section
      id="metodo"
      ref={sectionRef}
      className="relative bg-paper text-ink overflow-hidden"
    >
      {/* Textura decorativa */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, #e8262b 0%, transparent 50%), radial-gradient(circle at 90% 90%, #2e55e8 0%, transparent 55%)",
        }}
      />

      <div className="relative px-5 md:px-10 xl:px-16 pt-24 md:pt-32 pb-24 md:pb-32 max-w-[1400px] mx-auto">
        {/* ── Cabecera con dial ── */}
        <div
          ref={headerRef}
          className="flex flex-wrap items-end justify-between gap-8 mb-10 md:mb-14"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}
            className="max-w-3xl"
          >
            <Kicker index="03" dark>
              {t("method.kicker")}
            </Kicker>
            <h2 className="mt-8 font-display font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(2rem,4.6vw,4.4rem)]">
              {t("method.title.a")}{" "}
              <span className="text-outline-ink">{t("method.title.b")}</span>
            </h2>
            <p className="mt-5 text-sm md:text-base text-ink/60 max-w-md">
              Cuatro fases que se van montando una sobre otra hasta cerrar el
              círculo. Haz scroll para verlas apilarse.
            </p>
          </motion.div>

          <div
            className="hidden sm:block relative w-[104px] h-[104px] shrink-0"
            aria-hidden="true"
          >
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle
                cx="40"
                cy="40"
                r={R}
                fill="none"
                stroke="rgba(8,8,10,0.1)"
                strokeWidth="2"
              />
              <motion.circle
                cx="40"
                cy="40"
                r={R}
                fill="none"
                stroke="#e8262b"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                style={{ strokeDashoffset: reduce ? 0 : dashOffset }}
              />
            </svg>
            <motion.span className="absolute inset-0 flex items-center justify-center font-display font-semibold text-lg tabular-nums text-ink">
              {reduce ? "360°" : degrees}
            </motion.span>
          </div>
        </div>

        {/* Barra móvil */}
        <div className="sm:hidden mb-8">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/45 mb-2">
            {["0°", "90°", "180°", "270°", "360°"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="h-[3px] bg-ink/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand origin-left"
              style={{ scaleX: reduce ? 1 : barScale }}
            />
          </div>
        </div>

        {reduce ? (
          <div className="space-y-6">
            {processSteps.map((step, i) => (
              <StaticCard key={step.index} step={step} index={i} />
            ))}
            <StaticClosingPanel />
          </div>
        ) : (
          <>
            {/* Desktop · Stack apilado */}
            <div className="hidden md:block relative">
              {layers.map((layer) => (
                <div
                  key={layer.kind === "card" ? layer.step.index : "closing"}
                  /* Cada layer ocupa una "pista" de scroll de una pantalla.
                     Es lo que hace que el usuario tenga espacio de scroll
                     entre ficha y ficha. */
                  style={{
                    height: `${CARD_HEIGHT_VH}vh`,
                    marginBottom: layer.i === layers.length - 1 ? 0 : "0",
                  }}
                  className="relative"
                >
                  {/* La ficha real, sticky con offset arriba.
                      Todas las fichas comparten el mismo top, así se
                      apilan exactamente en el mismo lugar. */}
                  <div
                    style={{
                      position: "sticky",
                      top: `${STICKY_TOP}px`,
                      zIndex: layer.i + 1,
                    }}
                    className="w-full"
                  >
                    {layer.kind === "card" ? (
                      <CardBox
                        step={layer.step}
                        index={layer.i}
                        total={processSteps.length}
                      />
                    ) : (
                      <ClosingBox />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Móvil */}
            <div className="md:hidden space-y-6">
              {processSteps.map((step, i) => (
                <StaticCard key={step.index} step={step} index={i} />
              ))}
              <StaticClosingPanel />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   CardBox · el contenido visual de una ficha del método
   ══════════════════════════════════════════════════════ */
function CardBox({
  step,
  index,
  total,
}: {
  step: (typeof import("../lib/data").processSteps)[number];
  index: number;
  total: number;
}) {
  return (
    <article
      className="group relative bg-white border border-ink/10 rounded-[1.75rem] shadow-[0_30px_60px_-25px_rgba(8,8,10,0.35)] overflow-hidden"
      style={{ height: `${CARD_HEIGHT_VH - 10}vh`, maxHeight: 640 }}
    >
      {/* Numeral gigante marca de agua */}
      <span
        aria-hidden="true"
        className="absolute -top-4 -right-4 font-display font-semibold text-[11rem] leading-none text-brand/[0.05] pointer-events-none select-none"
      >
        {step.index}
      </span>

      <div className="relative grid md:grid-cols-2 gap-6 md:gap-8 p-6 md:p-9 items-center h-full">
        <div className={index % 2 === 1 ? "md:order-2" : ""}>
          <div className="flex items-start justify-between gap-4 mb-6">
            <span className="font-display font-semibold text-5xl md:text-6xl leading-none text-outline-ink">
              {step.index}
            </span>
            <span className="relative inline-flex items-center gap-2 rounded-full bg-ink text-paper px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] shrink-0">
              <span className="relative flex w-1.5 h-1.5" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-70" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand" />
              </span>
              {step.verb}
            </span>
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand mb-3">
            Fase {index + 1} / {total}
          </p>
          <h3 className="font-display font-semibold text-2xl md:text-3xl leading-tight text-ink break-words">
            {step.title}
          </h3>
          <p className="mt-3 text-[14px] md:text-[15px] leading-relaxed text-ink/70 break-words">
            {step.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-1.5 md:gap-2">
            {step.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-ink/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-ink/70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          className={`relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-auto md:h-full bg-ink/5 ${
            index % 2 === 1 ? "md:order-1" : ""
          }`}
        >
          <img
            src={step.image}
            alt={`${step.verb} · MISTERRED360`}
            className="w-full h-full object-cover object-top grayscale-[25%]"
            loading="lazy"
            draggable={false}
          />
        </div>
      </div>
    </article>
  );
}

/* ══════════════════════════════════════════════════════
   ClosingBox · panel negro final
   ══════════════════════════════════════════════════════ */
function ClosingBox() {
  return (
    <aside
      className="relative overflow-hidden rounded-[1.75rem] bg-ink text-paper p-8 md:p-12 lg:p-14 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-[0_40px_80px_-30px_rgba(8,8,10,0.6)]"
      style={{ height: `${CARD_HEIGHT_VH - 10}vh`, maxHeight: 640 }}
    >
      <span
        aria-hidden="true"
        className="absolute -right-8 -top-16 font-display font-semibold text-[10rem] md:text-[14rem] leading-none text-brand/10 pointer-events-none select-none tracking-tighter"
      >
        360°
      </span>

      <div
        className="absolute right-6 bottom-6 hidden xl:block w-24 h-24 opacity-90"
        aria-hidden="true"
      >
        <OrbitBadge
          className="w-full h-full"
          text="MÉTODO MILÍMETRO · MISTERRED360 · ALMA + PRECISIÓN · "
        />
      </div>

      <div className="relative max-w-2xl">
        <span className="font-display font-semibold text-brand text-sm">
          (360°)
        </span>
        <p className="mt-3 font-display font-semibold text-3xl md:text-4xl lg:text-5xl leading-[1.02] uppercase tracking-[-0.01em]">
          Y otra vez <span className="text-brand">empezar.</span>
        </p>
        <p className="mt-4 text-sm md:text-base text-smoke leading-relaxed max-w-lg">
          El círculo no se cierra: cada medición alimenta la siguiente vuelta.
          Marcas que empiezan con un gabinete de prensa terminan girando el
          círculo entero.
        </p>

        <button
          onClick={() => navigateTo("#/contacto")}
          className="group mt-8 inline-flex items-center gap-3 rounded-full bg-brand hover:bg-flame px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:gap-4 shadow-[0_0_36px_-10px_rgba(232,38,43,0.55)]"
        >
          Empezar mi primera vuelta
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
        </button>
      </div>
    </aside>
  );
}

/* ══════════════════════════════════════════════════════
   StaticCard · versión móvil + reduced motion
   ══════════════════════════════════════════════════════ */
function StaticCard({
  step,
  index,
}: {
  step: (typeof import("../lib/data").processSteps)[number];
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, delay: 0.05, ease }}
      className="group relative bg-white border border-ink/10 rounded-[1.75rem] shadow-[0_20px_50px_-30px_rgba(8,8,10,0.25)] overflow-hidden"
    >
      <span
        aria-hidden="true"
        className="absolute -top-2 -right-2 font-display font-semibold text-[8rem] leading-none text-brand/[0.05] pointer-events-none select-none"
      >
        {step.index}
      </span>

      <div className="relative p-6 flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <span className="font-display font-semibold text-5xl leading-none text-outline-ink">
            {step.index}
          </span>
          <span className="rounded-full bg-ink text-paper px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] shrink-0">
            {step.verb}
          </span>
        </div>

        <div className="mt-6 rounded-2xl overflow-hidden aspect-[4/3] bg-ink/5">
          <img
            src={step.image}
            alt={`${step.verb} · MISTERRED360`}
            className="w-full h-full object-cover object-top grayscale-[25%]"
            loading="lazy"
            draggable={false}
          />
        </div>

        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand">
          Fase {index + 1} / 4
        </p>
        <h3 className="mt-2 font-display font-semibold text-xl leading-tight text-ink break-words">
          {step.title}
        </h3>
        <p className="mt-3 text-[14px] leading-relaxed text-ink/70 break-words">
          {step.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {step.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-ink/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-ink/70"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function StaticClosingPanel() {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease }}
      className="relative overflow-hidden rounded-[1.75rem] bg-ink text-paper p-8 md:p-12 flex flex-col gap-6 shadow-[0_40px_80px_-30px_rgba(8,8,10,0.6)]"
    >
      <span
        aria-hidden="true"
        className="absolute -right-8 -top-16 font-display font-semibold text-[10rem] leading-none text-brand/10 pointer-events-none select-none tracking-tighter"
      >
        360°
      </span>

      <div className="relative">
        <span className="font-display font-semibold text-brand text-sm">
          (360°)
        </span>
        <p className="mt-3 font-display font-semibold text-3xl md:text-4xl leading-[1.02] uppercase tracking-[-0.01em]">
          Y otra vez <span className="text-brand">empezar.</span>
        </p>
        <p className="mt-4 text-sm text-smoke leading-relaxed max-w-lg">
          El círculo no se cierra: cada medición alimenta la siguiente vuelta.
        </p>

        <button
          onClick={() => navigateTo("#/contacto")}
          className="group mt-6 inline-flex items-center gap-3 rounded-full bg-brand hover:bg-flame px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:gap-4"
        >
          Empezar mi primera vuelta
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
        </button>
      </div>
    </motion.aside>
  );
}
