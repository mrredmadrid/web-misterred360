import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Globe } from "lucide-react";
import { LOCALES, useI18n } from "../lib/i18n";

/* Selector de idioma compacto para la cabecera y el menú móvil */
export default function LanguageSwitcher({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const trigger =
    variant === "dark"
      ? "border border-white/15 text-paper hover:border-brand hover:text-brand"
      : "border border-ink/15 text-ink hover:border-brand hover:text-brand";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("nav.language")}
        aria-expanded={open}
        className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${trigger}`}
      >
        <Globe className="w-3.5 h-3.5" />
        {active.short}
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={t("nav.language")}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 mt-3 w-40 rounded-2xl bg-coal border border-white/12 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.65)] overflow-hidden z-[75]"
          >
            {LOCALES.map((l) => {
              const isActive = l.code === locale;
              return (
                <li key={l.code}>
                  <button
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      setLocale(l.code);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors ${
                      isActive
                        ? "bg-brand/10 text-paper"
                        : "text-smoke hover:bg-white/[0.04] hover:text-paper"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-[10px] font-semibold tracking-[0.2em] w-6">
                        {l.short}
                      </span>
                      {l.label}
                    </span>
                    {isActive && <Check className="w-4 h-4 text-brand" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
