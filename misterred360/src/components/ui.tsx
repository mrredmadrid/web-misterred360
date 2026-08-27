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
