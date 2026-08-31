import { useEffect, useState } from "react";
import { motion, animate, useReducedMotion } from "framer-motion";
import { useI18n } from "../lib/i18n";

/* ───────────────────────────────────────────────────────────
   Loader · El chimpancé presenta la marca
   Cuenta 0°→ 360° + wordmark por letras + salida cinematográfica
   ─────────────────────────────────────────────────────────── */

const WORD = [
  { letters: "MISTER", cls: "text-paper" },
  { letters: "RED", cls: "text-brand" },
  { letters: "360°", cls: "text-paper" },
];

export default function Loader({ onDone }: { onDone: () => void }) {
  const [deg, setDeg] = useState(0);
  const reduce = useReducedMotion();
  const { t } = useI18n();

  useEffect(() => {
    const controls = animate(0, 360, {
      duration: reduce ? 0.5 : 2,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setDeg(Math.round(v)),
      onComplete: () => setTimeout(onDone, 350),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const letterAnim = (i: number) => ({
    initial: { y: "110%" },
    animate: {
      y: "0%",
      transition: { delay: 0.35 + i * 0.04, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  });

  let letterIndex = 0;

  return (
    <motion.div
      className="fixed inset-0 z-[120] bg-ink flex flex-col items-center justify-center"
      style={{ borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px" }}
      exit={{ y: "-100%", borderBottomLeftRadius: "60px", borderBottomRightRadius: "60px" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      role="status"
      aria-label={t("loader.a11y")}
    >
      {/* Chimpancé: aparece en máscara circular */}
      <div className="relative w-28 h-28 mb-8">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full animate-spin-slow text-brand"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="47"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="70 225"
            strokeLinecap="round"
          />
        </svg>
        <motion.div
          className="absolute inset-2 rounded-full overflow-hidden"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <img
            src="/images/gioconda-chimp.png"
            alt=""
            className="w-full h-full object-cover object-[center_20%] scale-110"
          />
        </motion.div>
      </div>

      {/* Wordmark por letras */}
      <h1 className="sr-only">MISTERRED360</h1>
      <div
        aria-hidden="true"
        className="flex overflow-hidden font-display font-semibold text-3xl md:text-4xl tracking-tight"
      >
        {WORD.map((chunk, ci) => (
          <span key={ci} className={`flex ${chunk.cls}`}>
            {chunk.letters.split("").map((l) => {
              const i = letterIndex++;
              return (
                <motion.span key={i} className="block" {...letterAnim(i)}>
                  {l}
                </motion.span>
              );
            })}
          </span>
        ))}
      </div>

      <motion.p
        className="mt-4 text-[10px] uppercase tracking-[0.4em] text-smoke"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {t("loader.subtitle")}
      </motion.p>

      {/* Barra inferior con cuenta de grados */}
      <div className="absolute bottom-0 inset-x-0 px-6 md:px-10 pb-8">
        <div className="flex items-end justify-between mb-4">
          <span className="text-[10px] uppercase tracking-[0.35em] text-ash">
            {t("loader.experience")}
          </span>
          <span className="font-display text-6xl md:text-7xl font-medium leading-none text-paper tabular-nums">
            {deg}
            <span className="text-brand">°</span>
          </span>
        </div>
        <div className="h-px w-full bg-white/10 relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-brand"
            style={{ width: `${(deg / 360) * 100}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
