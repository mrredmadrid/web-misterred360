import { motion } from "framer-motion";
import { ArrowUpRight, Bot } from "lucide-react";
import { navigateTo } from "../lib/scroll";

/* ───────────────────────────────────────────────────────────
   Franja compacta · avance del servicio de Agentes IA en la
   home, con enlace a su página propia (/agentes-ia). Deliberadamente
   corta: el detalle completo vive en la página dedicada.
   ─────────────────────────────────────────────────────────── */

export default function AgentesIAPromo() {
  return (
    <section className="relative bg-ink border-t border-white/[0.07] overflow-hidden">
      <div className="absolute inset-0 glow-brand pointer-events-none" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative px-5 md:px-10 xl:px-16 py-14 md:py-16 max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center gap-8 md:gap-12"
      >
        <span className="w-14 h-14 shrink-0 rounded-full border border-brand/60 text-brand flex items-center justify-center">
          <Bot className="w-6 h-6" strokeWidth={1.7} />
        </span>
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand">
            Nuevo · Inteligencia Artificial
          </p>
          <h2 className="mt-2 font-display font-semibold text-2xl md:text-3xl leading-tight text-paper">
            Agentes IA personalizados, entrenados con el tono de tu marca
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-smoke max-w-xl">
            Un empleado que atiende, cualifica y responde 24 horas al día,
            sin perder ni un ápice de tu voz.
          </p>
        </div>
        <button
          onClick={() => navigateTo("/agentes-ia")}
          className="group shrink-0 inline-flex items-center gap-3 rounded-full bg-brand px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:gap-4 hover:bg-flame"
        >
          Descubrir agentes IA
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
        </button>
      </motion.div>
    </section>
  );
}
