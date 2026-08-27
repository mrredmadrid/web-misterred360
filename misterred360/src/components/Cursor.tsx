import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* ───────────────────────────────────────────────────────────
   Cursor personalizado · punto rojo + anillo con etiqueta
   Solo activo en punteros finos (desktop)
   ─────────────────────────────────────────────────────────── */

type CursorState = { variant: "default" | "hover" | "label"; label?: string };

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>({ variant: "default" });

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotX = useSpring(x, { stiffness: 900, damping: 50, mass: 0.4 });
  const dotY = useSpring(y, { stiffness: 900, damping: 50, mass: 0.4 });
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor], a, button, [role='button']"
      );
      if (!t) {
        setState({ variant: "default" });
        return;
      }
      const tag = t.getAttribute("data-cursor");
      if (tag === "drag") setState({ variant: "label", label: "Arrastra" });
      else if (tag === "view") setState({ variant: "label", label: "Ver" });
      else setState({ variant: "hover" });
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Punto */}
      <motion.div
        aria-hidden="true"
        className={`fixed left-0 top-0 z-[105] pointer-events-none rounded-full bg-brand ${
          state.variant === "label" ? "opacity-0" : "opacity-100"
        }`}
        style={{ x: dotX, y: dotY, width: 8, height: 8, marginLeft: -4, marginTop: -4 }}
      />
      {/* Anillo */}
      <motion.div
        aria-hidden="true"
        className={`fixed left-0 top-0 z-[104] pointer-events-none rounded-full flex items-center justify-center ${
          state.variant === "label"
            ? "bg-brand text-white"
            : "border border-white mix-blend-difference"
        }`}
        style={{ x: ringX, y: ringY }}
        animate={{
          width: state.variant === "label" ? 76 : state.variant === "hover" ? 56 : 34,
          height: state.variant === "label" ? 76 : state.variant === "hover" ? 56 : 34,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {state.variant === "label" && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
            {state.label}
          </span>
        )}
      </motion.div>
    </>
  );
}
