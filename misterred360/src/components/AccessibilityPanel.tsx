import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Accessibility,
  ALargeSmall,
  Contrast,
  Eye,
  Gauge,
  Link as LinkIcon,
  MousePointer2,
  Pause,
  Play,
  RefreshCcw,
  Rows3,
  Type,
  X,
} from "lucide-react";
import { useA11y, type FontScale } from "../lib/accessibility";
import { useI18n } from "../lib/i18n";

/* ───────────────────────────────────────────────────────────
   Panel de Accesibilidad
   FAB fijo abajo-izquierda + drawer lateral con todos los ajustes
   ─────────────────────────────────────────────────────────── */

const fontScales: { value: FontScale; label: string }[] = [
  { value: 100, label: "A" },
  { value: 115, label: "A+" },
  { value: 130, label: "A++" },
  { value: 150, label: "A+++" },
];

export default function AccessibilityPanel() {
  const { settings, panel, openPanel, closePanel, set, reset, speak, stopSpeak, isSpeaking } =
    useA11y();
  const { t } = useI18n();

  /* Cierra con ESC */
  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closePanel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel, closePanel]);

  /* Guía de lectura: barra que sigue al ratón */
  useEffect(() => {
    if (!settings.readingGuide) return;
    const el = document.createElement("div");
    el.className = "a11y-guide";
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
    const move = (e: MouseEvent) => {
      el.style.top = `${e.clientY - 2}px`;
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      el.remove();
    };
  }, [settings.readingGuide]);

  /* Máscara de lectura: dos bandas que oscurecen todo excepto una franja */
  useEffect(() => {
    if (!settings.readingMask) return;
    const top = document.createElement("div");
    const bot = document.createElement("div");
    top.className = "a11y-mask a11y-mask-top";
    bot.className = "a11y-mask a11y-mask-bot";
    top.setAttribute("aria-hidden", "true");
    bot.setAttribute("aria-hidden", "true");
    document.body.appendChild(top);
    document.body.appendChild(bot);
    const H = 140;
    const move = (e: MouseEvent) => {
      top.style.height = `${Math.max(0, e.clientY - H / 2)}px`;
      bot.style.top = `${e.clientY + H / 2}px`;
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      top.remove();
      bot.remove();
    };
  }, [settings.readingMask]);

  const readPage = () => {
    if (isSpeaking) {
      stopSpeak();
      return;
    }
    /* Extrae el contenido significativo del <main> */
    const main = document.querySelector("main");
    if (!main) return;
    const text = Array.from(main.querySelectorAll("h1,h2,h3,p,li,blockquote"))
      .map((n) => n.textContent?.trim() ?? "")
      .filter(Boolean)
      .join(". ");
    speak(text);
  };

  return (
    <>
      {/* FAB de accesibilidad */}
      {/* FAB accesibilidad · ubicado a la izquierda para no colisionar
          con el botón de WhatsApp (que vive a la derecha). */}
      <button
        onClick={openPanel}
        aria-label={t("a11y.open")}
        title={t("a11y.title")}
        data-cursor="button"
        className="fixed z-[92] bottom-5 left-5 md:bottom-7 md:left-7 rounded-full bg-brand text-white shadow-[0_10px_30px_-8px_rgba(232,38,43,0.6)] flex items-center justify-center transition-transform hover:scale-105 focus-visible:scale-105"
        style={{ width: "3.4rem", height: "3.4rem" }}
      >
        <Accessibility className="w-6 h-6" strokeWidth={1.9} />
        <span className="sr-only">Accesibilidad</span>
      </button>

      <AnimatePresence>
        {panel && (
          <motion.div
            className="fixed inset-0 z-[97] flex items-stretch md:items-center md:justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-panel-title"
          >
            <button
              aria-label={t("a11y.close_panel")}
              onClick={closePanel}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full sm:max-w-[440px] h-full flex flex-col bg-coal border-l border-white/10 overflow-hidden shadow-2xl"
            >
              <header className="flex items-start justify-between gap-6 px-6 pt-7 pb-5 border-b border-white/10 shrink-0">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand mb-2">
                    {t("a11y.kicker")}
                  </p>
                  <h2
                    id="a11y-panel-title"
                    className="font-display font-semibold text-2xl leading-tight text-paper"
                  >
                    {t("a11y.panel.title")}
                  </h2>
                </div>
                <button
                  onClick={closePanel}
                  aria-label={t("a11y.close")}
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/5 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                {/* Tamaño de letra */}
                <Section icon={ALargeSmall} title={t("a11y.text")}>
                  <div className="grid grid-cols-4 gap-2">
                    {fontScales.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => set("fontScale", s.value)}
                        aria-pressed={settings.fontScale === s.value}
                        className={`rounded-xl border py-3 font-display font-semibold transition-all ${
                          settings.fontScale === s.value
                            ? "bg-brand border-brand text-white"
                            : "border-white/12 text-paper hover:border-white/30"
                        }`}
                        style={{ fontSize: `${(0.9 * s.value) / 100 + 0.4}rem` }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </Section>

                {/* Espaciado */}
                <Section icon={Rows3} title={t("a11y.spacing")}>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        { id: "normal", label: t("a11y.spacing.normal") },
                        { id: "wide", label: t("a11y.spacing.wide") },
                      ] as const
                    ).map((o) => (
                      <button
                        key={o.id}
                        onClick={() => set("spacing", o.id)}
                        aria-pressed={settings.spacing === o.id}
                        className={`rounded-xl border py-3 text-sm font-medium transition-all ${
                          settings.spacing === o.id
                            ? "bg-brand border-brand text-white"
                            : "border-white/12 text-paper hover:border-white/30"
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </Section>

                {/* Interruptores */}
                <Section icon={Eye} title={t("a11y.view")}>
                  <ToggleRow
                    icon={Contrast}
                    label={t("a11y.contrast")}
                    description={t("a11y.contrast.desc")}
                    checked={settings.highContrast}
                    onChange={(v) => set("highContrast", v)}
                  />
                  <ToggleRow
                    icon={LinkIcon}
                    label={t("a11y.underline")}
                    description={t("a11y.underline.desc")}
                    checked={settings.underlineLinks}
                    onChange={(v) => set("underlineLinks", v)}
                  />
                  <ToggleRow
                    icon={Type}
                    label={t("a11y.dyslexia")}
                    description={t("a11y.dyslexia.desc")}
                    checked={settings.dyslexia}
                    onChange={(v) => set("dyslexia", v)}
                  />
                </Section>

                <Section icon={Gauge} title={t("a11y.motion")}>
                  <ToggleRow
                    icon={Gauge}
                    label={t("a11y.motion.reduce")}
                    description={t("a11y.motion.reduce.desc")}
                    checked={settings.reduceMotion}
                    onChange={(v) => set("reduceMotion", v)}
                  />
                  <ToggleRow
                    icon={Pause}
                    label={t("a11y.motion.grain")}
                    description={t("a11y.motion.grain.desc")}
                    checked={settings.pauseGrain}
                    onChange={(v) => set("pauseGrain", v)}
                  />
                </Section>

                <Section icon={MousePointer2} title={t("a11y.focus")}>
                  <ToggleRow
                    icon={MousePointer2}
                    label={t("a11y.cursor")}
                    description={t("a11y.cursor.desc")}
                    checked={settings.bigCursor}
                    onChange={(v) => set("bigCursor", v)}
                  />
                  <ToggleRow
                    icon={Rows3}
                    label={t("a11y.guide")}
                    description={t("a11y.guide.desc")}
                    checked={settings.readingGuide}
                    onChange={(v) => set("readingGuide", v)}
                  />
                  <ToggleRow
                    icon={Eye}
                    label={t("a11y.mask")}
                    description={t("a11y.mask.desc")}
                    checked={settings.readingMask}
                    onChange={(v) => set("readingMask", v)}
                  />
                </Section>

                {/* Escuchar la página */}
                <Section icon={isSpeaking ? Pause : Play} title={t("a11y.listen")}>
                  <p className="text-sm text-smoke leading-relaxed mb-3">
                    {t("a11y.listen.desc")}
                  </p>
                  <button
                    onClick={readPage}
                    className={`w-full inline-flex items-center justify-center gap-3 rounded-full px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                      isSpeaking
                        ? "bg-white text-ink hover:bg-bone"
                        : "bg-brand text-white hover:bg-flame"
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <Pause className="w-4 h-4" />
                        {t("a11y.listen.stop")}
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        {t("a11y.listen.play")}
                      </>
                    )}
                  </button>
                </Section>

                <button
                  onClick={reset}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-smoke hover:text-paper hover:border-white/30 transition-colors"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  {t("a11y.reset")}
                </button>

                <p className="text-xs text-ash leading-relaxed">{t("a11y.persist")}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ────────────────────────────────────────────────────────── */

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <span className="w-8 h-8 rounded-full border border-white/12 text-brand flex items-center justify-center">
          <Icon className="w-4 h-4" strokeWidth={1.8} />
        </span>
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-paper">
          {title}
        </h3>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${
        checked
          ? "border-brand/45 bg-brand/[0.06]"
          : "border-white/10 bg-white/[0.02] hover:border-white/20"
      }`}
    >
      <span
        className={`mt-0.5 w-9 h-9 rounded-full border shrink-0 flex items-center justify-center ${
          checked ? "border-brand text-brand" : "border-white/15 text-smoke"
        }`}
      >
        <Icon className="w-4 h-4" strokeWidth={1.8} />
      </span>
      <div className="flex-1">
        <p className="font-display font-semibold text-[15px] text-paper leading-tight">
          {label}
        </p>
        <p className="mt-1 text-xs text-smoke leading-relaxed">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`shrink-0 mt-1 w-12 h-7 rounded-full relative transition-colors ${
          checked ? "bg-brand" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}
