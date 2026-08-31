import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { navigateTo } from "../lib/scroll";
import { useI18n } from "../lib/i18n";
import { Kicker } from "./ui";

/* ───────────────────────────────────────────────────────────
   FAQ · Preguntas frecuentes con schema FAQPage (rich snippets)
   Las preguntas contienen keywords long-tail del sector.
   ─────────────────────────────────────────────────────────── */

export const faqs = [
  {
    q: "¿En qué se diferencia MISTERRED360 de una agencia de comunicación al uso?",
    a: "En que no te asignamos un ejecutivo de cuentas: te asignamos una obsesión. Trabajamos con pocos clientes, con un único interlocutor localizable, y construimos el método alrededor de tu negocio en lugar de meterte en el nuestro. Ponemos el alma. Medimos al milímetro.",
  },
  {
    q: "¿De verdad regaláis una idea antes de contratar?",
    a: "Sí. Cuéntanos tu reto en tres líneas y en 72 horas te devolvemos una idea concreta y ejecutable para tu negocio, con coste y plazo. Puedes aplicarla tú o pedirnos que la ejecutemos. Una por empresa, sin letra pequeña.",
  },
  {
    q: "¿Qué incluye vuestro 360?",
    a: "Cinco territorios con nombre propio: comunicación (prensa, RRPP, crisis), estrategia (plan, estudios, DIRCOM externo), identidad (branding, naming), creación (audiovisual, publicidad, eventos) y digital (redes, web, IA aplicada). Contratas el círculo entero o solo las piezas que necesitas.",
  },
  {
    q: "¿Con quién NO trabajáis?",
    a: "Con quien quiere resultados sin cambiar nada. Con quien pide que mintamos, aunque sea un poco. Con quien no puede dedicarnos dos horas al mes. Con quien busca el más barato: no lo somos, y no vamos a fingirlo. Trabajamos con quien quiere que su marca signifique algo.",
  },
  {
    q: "¿Cuánto cuesta trabajar con vosotros?",
    a: "Depende del alcance: un gabinete de prensa mensual no es un plan 360 completo. Tras una primera Auditoría Roja (diagnóstico en 10 días) te proponemos un plan cerrado con objetivos, acciones e inversión detallada. Sin permanencias opacas y sin sorpresas en factura.",
  },
  {
    q: "¿En cuánto tiempo respondéis?",
    a: "En menos de 24 horas laborables. Contesta una persona, con nombre. Siempre. Es el ADN convertido en promesa verificable: si alguna vez tardamos más, tienes derecho a decirlo.",
  },
];

export default function Faq() {
  const { t } = useI18n();
  const [open, setOpen] = useState(0);

  /* Inyecta el schema FAQPage para rich snippets de Google */
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "faq-jsonld";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <section
      id="faq"
      className="relative bg-ink border-t border-white/[0.07] overflow-hidden"
      aria-label="Preguntas frecuentes sobre agencias de comunicación"
    >
      <div className="absolute inset-0 glow-ocean pointer-events-none" aria-hidden="true" />
      <div className="relative px-5 md:px-10 xl:px-16 py-24 md:py-32 max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Kicker index="FAQ">{t("faq.kicker")}</Kicker>
          <h2 className="mt-10 font-display font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(2.2rem,4.6vw,4.4rem)]">
            {t("faq.title.a")}
            <br />
            {t("faq.title.b")} <span className="text-brand">{t("faq.title.c")}</span>
          </h2>
          <p className="mt-8 text-smoke text-base md:text-lg leading-relaxed max-w-md">
            {t("faq.desc")}
          </p>
          <button
            onClick={() => navigateTo("/contacto")}
            className="group mt-8 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand hover:text-flame transition-colors"
          >
            {t("faq.cta")}
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
          </button>
        </div>

        <div className="lg:col-span-7">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-t border-white/10 last:border-b">
                <h3 className="m-0">
                  <button
                    onClick={() => setOpen(i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center gap-5 md:gap-8 py-6 text-left group"
                  >
                    <span
                      className={`font-display text-sm font-semibold shrink-0 ${
                        isOpen ? "text-brand" : "text-ash"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={`flex-1 font-display font-semibold text-lg md:text-2xl leading-snug transition-colors duration-300 ${
                        isOpen ? "text-paper" : "text-smoke group-hover:text-paper"
                      }`}
                    >
                      {f.q}
                    </span>
                    <span
                      className={`w-9 h-9 shrink-0 rounded-full border flex items-center justify-center transition-all duration-500 ${
                        isOpen
                          ? "rotate-45 bg-brand border-brand text-white"
                          : "border-white/15 text-smoke"
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
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-7 pl-9 md:pl-[4.5rem] pr-2 text-[15px] md:text-base leading-relaxed text-smoke max-w-2xl">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
