import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, animate, useInView } from "framer-motion";

/* ───────────────────────────────────────────────────────────
   MISTERRED360 · Átomos compartidos
   ─────────────────────────────────────────────────────────── */

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display font-semibold tracking-[-0.01em] leading-none select-none ${className}`}
    >
      MISTER<span className="text-brand">RED</span>
      <span className="inline-flex items-start">
        360<sup className="text-brand text-[0.5em] mt-[0.12em] ml-[0.02em]">°</sup>
      </span>
    </span>
  );
}

export function Kicker({
  index,
  children,
  dark = false,
  className = "",
}: {
  index: string;
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="font-display text-brand text-sm font-semibold">({index})</span>
      <span
        className={`text-[11px] font-semibold uppercase tracking-[0.32em] ${
          dark ? "text-ink/70" : "text-smoke"
        }`}
      >
        {children}
      </span>
      <span className="h-px w-16 bg-brand" aria-hidden="true" />
    </div>
  );
}

/* Badge circular con texto rotatorio — sello de marca */
export function OrbitBadge({
  className = "",
  text = "COMUNICACIÓN ESTRATÉGICA · MISTERRED360 · CRECIMIENTO · ",
}: {
  className?: string;
  text?: string;
}) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="w-full h-full animate-spin-slow">
        <defs>
          <path
            id="mr-orbit"
            d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0"
            fill="none"
          />
        </defs>
        <text className="fill-paper text-[8.6px] font-semibold uppercase tracking-[0.22em]">
          <textPath href="#mr-orbit">{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-brand" />
    </div>
  );
}

/* Reveal de titulares por líneas con máscara y stagger */
export function LineReveal({
  text,
  delay = 0,
  className = "",
  start = true,
  as = "div",
}: {
  text: string;
  delay?: number;
  className?: string;
  start?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "div";
}) {
  const lines = text.split("\n");
  const MotionTag =
    ((motion as unknown as Record<string, typeof motion.div>)[as] as typeof motion.div) ??
    motion.div;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate={start ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.14, delayChildren: delay } },
      }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <motion.span
            className="block will-change-transform"
            variants={{
              hidden: { y: "115%", rotate: 2.5 },
              visible: {
                y: "0%",
                rotate: 0,
                transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {renderAccent(line)}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/* Reveal de titulares "a máquina de escribir": las letras aparecen
   una a una, con un cursor parpadeante que se detiene al final —
   pensado para el titular de portada. */
export function TypeReveal({
  text,
  delay = 0,
  className = "",
  start = true,
  as = "div",
  charDelay = 0.032,
}: {
  text: string;
  delay?: number;
  className?: string;
  start?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  charDelay?: number;
}) {
  const lines = text.split("\n").map(splitAccentChars);
  const totalChars = lines.reduce((sum, l) => sum + l.length, 0);
  const MotionTag =
    ((motion as unknown as Record<string, typeof motion.div>)[as] as typeof motion.div) ??
    motion.div;
  const cursor = (
    <motion.span
      key="cursor"
      aria-hidden="true"
      className="inline-block w-[0.05em] h-[0.85em] -mb-[0.05em] ml-1 bg-brand"
      initial={{ opacity: 0 }}
      animate={
        start
          ? { opacity: [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0] }
          : { opacity: 0 }
      }
      transition={
        start
          ? {
              delay: delay + totalChars * charDelay,
              duration: 2.4,
              times: [0, 0.02, 0.25, 0.27, 0.5, 0.52, 0.75, 0.77, 0.9, 0.92, 0.98, 1],
              repeat: Infinity,
            }
          : { duration: 0 }
      }
    />
  );
  let i = 0;
  return (
    <MotionTag className={className}>
      {lines.map((chars, li) => (
        <span key={li} className="block">
          {chars.map((c, ci) => {
            const charIndex = i++;
            const node = c.char;
            return (
              <motion.span
                key={ci}
                className={c.red ? "text-brand" : undefined}
                initial={{ opacity: 0 }}
                animate={start ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.01, delay: delay + charIndex * charDelay }}
              >
                {node}
              </motion.span>
            );
          })}
          {li === lines.length - 1 && cursor}
        </span>
      ))}
    </MotionTag>
  );
}

/* Divide un texto en caracteres conservando qué tramos van en *rojo* */
function splitAccentChars(line: string): { char: string; red: boolean }[] {
  const parts = line.split(/(\*[^*]+\*)/g);
  const chars: { char: string; red: boolean }[] = [];
  for (const part of parts) {
    const red = part.startsWith("*") && part.endsWith("*");
    const clean = red ? part.slice(1, -1) : part;
    for (const ch of clean) {
      chars.push({ char: ch, red });
    }
  }
  return chars;
}

/* Marcas de acento: *rojo* y ~outline~ */
function renderAccent(line: string) {
  const parts = line.split(/(\*[^*]+\*|~[^~]+~)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="not-italic text-brand">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("~") && part.endsWith("~")) {
      return (
        <span key={i} className="text-outline">
          {part.slice(1, -1)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/* Contador animado al entrar en vista */
export function Counter({
  value,
  suffix = "",
  className = "",
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => c.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {n}
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
