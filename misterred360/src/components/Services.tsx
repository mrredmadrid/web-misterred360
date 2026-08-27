import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { serviceBlocks } from "../lib/data";
import { navigateTo } from "../lib/scroll";
import { useI18n } from "../lib/i18n";
import { Kicker, LineReveal } from "./ui";

/* ───────────────────────────────────────────────────────────
   Sección 02 · SERVICIOS 360 — tres bloques, comunicación al centro.
   Selector de bloque + acordeón editorial + visor del personaje.
   Fondo claro: menos negro al navegar, más contraste editorial.
   ─────────────────────────────────────────────────────────── */

export default function Services() {
  const { t } = useI18n();
  const [blockIdx, setBlockIdx] = useState(0);
  const [openIdx, setOpenIdx] = useState(0);

  const block = serviceBlocks[blockIdx];
  const active = block.services[openIdx] ?? block.services[0];
  const isBrand = block.accent === "brand";

  const selectBlock = (i: number) => {
    setBlockIdx(i);
    setOpenIdx(0);
  };

  return (
    <section id="servicios" className="relative bg-paper text-ink overflow-hidden">
      <div className="absolute inset-0 glow-ocean pointer-events-none" aria-hidden="true" />
      <div className="relative px-5 md:px-10 xl:px-16 py-24 md:py-36 max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <Kicker index="02" dark>{t("services.kicker")}</Kicker>
            <LineReveal
              as="h2"
              className="mt-10 font-display font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(2.4rem,5.6vw,5.4rem)]"
              text={t("services.title")}
            />
          </div>
          <div className="lg:col-span-5">
            <p className="text-ink/65 text-base md:text-lg leading-relaxed max-w-md lg:ml-auto">
              {t("services.desc")}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Selector de bloque + visor */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="border-b border-ink/10">
              {serviceBlocks.map((b, i) => {
                const isActive = i === blockIdx;
                const bTitle = t(`sblock.${b.id}.title`);
                const bClaim = t(`sblock.${b.id}.claim`);
                return (
                  <h3 key={b.id} className="m-0 border-t border-ink/10">
                  <button
                    onClick={() => selectBlock(i)}
                    aria-expanded={isActive}
                    className="relative w-full text-left py-6 pr-4 group"
                  >
                    <span
                      className={`absolute left-0 top-6 bottom-6 w-[3px] rounded-full transition-colors duration-500 ${
                        isActive ? (b.accent === "brand" ? "bg-brand" : "bg-ocean") : "bg-transparent"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="flex items-baseline gap-5 pl-5">
                      <span
                        className={`font-display text-sm font-semibold transition-colors ${
                          isActive ? (b.accent === "brand" ? "text-brand" : "text-ocean") : "text-ink/40"
                        }`}
                      >
                        {b.index}
                      </span>
                      <span className="flex-1">
                        <span
                          className={`block font-display font-semibold text-2xl md:text-[1.7rem] leading-tight transition-colors duration-300 ${
                            isActive ? "text-ink" : "text-ink/40 group-hover:text-ink"
                          }`}
                        >
                          {bTitle}
                        </span>
                        {isActive && (
                          <motion.span
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="block mt-2 text-xs text-ink/55 max-w-xs leading-relaxed"
                          >
                            {bClaim}
                          </motion.span>
                        )}
                      </span>
                    </span>
                  </button>
                  </h3>
                );
              })}
            </div>

            {/* Visor del personaje según servicio */}
            <div className="mt-10 lg:sticky lg:top-28">
              <div
                className="relative rounded-[2rem] overflow-hidden border border-ink/10 aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] bg-white shadow-[0_30px_60px_-30px_rgba(8,8,10,0.25)]"
                data-cursor="view"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={active.id}
                    src={active.image}
                    alt={active.imageAlt}
                    className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
                    initial={{ opacity: 0, scale: 1.12 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.04 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.src.includes("chimp-meeting")) {
                        img.src = img.src.replace("chimp-meeting", "chimp-data");
                      }
                    }}
                  />
                </AnimatePresence>
                <div
                  className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(120% 100% at 50% 115%, rgba(8,8,10,0.85), transparent 62%)",
                  }}
                  aria-hidden="true"
                />
                <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/70 mb-1.5">
                      {block.index} · {t(`sblock.${block.id}.title`)}
                    </p>
                    <p className="font-display font-semibold text-xl text-white leading-tight">
                      {active.name}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 font-display font-semibold text-sm px-3 py-1.5 rounded-full ${
                      isBrand ? "bg-brand text-white" : "bg-ocean text-white"
                    }`}
                  >
                    {active.tagline}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-ink/40">
                {t("services.note.cast")}
              </p>
            </div>
          </div>

          {/* Acordeón de servicios */}
          <div className="lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {block.services.map((s, i) => {
                  const isOpen = i === openIdx;
                  const Icon = s.icon;
                  return (
                    <div key={s.id} className="border-t border-ink/10 last:border-b">
                      <h3 className="m-0">
                      <button
                        onClick={() => setOpenIdx(i)}
                        aria-expanded={isOpen}
                        aria-controls={`srv-${s.id}`}
                        className="w-full grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto] items-center gap-5 md:gap-8 py-7 text-left group"
                      >
                        <span
                          className={`w-12 h-12 md:w-14 md:h-14 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                            isOpen
                              ? "bg-brand border-brand text-white"
                              : "border-ink/15 text-ink/50 group-hover:border-ink/40 group-hover:text-ink"
                          }`}
                        >
                          <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.6} />
                        </span>
                        <span
                          className={`font-display font-semibold leading-tight text-[clamp(1.35rem,2.6vw,2.3rem)] transition-colors duration-300 ${
                            isOpen ? "text-ink" : "text-ink/45 group-hover:text-ink"
                          }`}
                        >
                          {s.name}
                        </span>
                        <span className="hidden md:block text-xs uppercase tracking-[0.22em] text-ink/40">
                          {s.tagline}
                        </span>
                        <span
                          className={`w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center transition-transform duration-500 ${
                            isOpen ? "rotate-45 bg-ink text-paper border-ink" : ""
                          }`}
                          aria-hidden="true"
                        >
                          <Plus className="w-4 h-4" />
                        </span>
                      </button>
                      </h3>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`srv-${s.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pb-10 md:pl-[4.75rem] lg:pl-[5.25rem] max-w-3xl">
                              <p className="text-lg md:text-xl font-medium leading-snug text-ink">
                                {s.brief}
                              </p>
                              <p className="mt-4 text-[15px] leading-relaxed text-ink/60">
                                {s.long}
                              </p>
                              <button
                                onClick={() => navigateTo("#/contacto")}
                                className="group/link mt-6 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand hover:text-flame transition-colors"
                              >
                                {t("services.cta")}
                                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Nota del bloque */}
                <div className="mt-8 rounded-2xl border border-ink/10 bg-ink/[0.03] p-6 flex items-start gap-4">
                  <span
                    className={`mt-1 w-2 h-2 rounded-full shrink-0 ${isBrand ? "bg-brand" : "bg-ocean"}`}
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-relaxed text-ink/60">
                    {t(`sblock.${block.id}.desc`)}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
