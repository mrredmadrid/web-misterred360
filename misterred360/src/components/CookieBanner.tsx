import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Cookie, Settings, X } from "lucide-react";
import { defaultConsent, useCookies, type ConsentCategory, type CookieConsent } from "../lib/cookies";
import { navigateTo } from "../lib/scroll";
import { useI18n } from "../lib/i18n";

/* ───────────────────────────────────────────────────────────
   Banner de cookies · primera capa (RGPD / AEPD 2024)
   Tres opciones con igual prominencia: aceptar / rechazar /
   configurar. Rechazar disponible en la primera capa.
   ─────────────────────────────────────────────────────────── */

export default function CookieBanner() {
  const { banner, panel, acceptAll, rejectAll, openPanel, closePanel, consent, saveConsent } =
    useCookies();
  const { t } = useI18n();

  return (
    <>
      {/* Banner de primera capa */}
      <AnimatePresence>
        {banner && !panel && (
          <motion.aside
            role="dialog"
            aria-modal="false"
            aria-labelledby="cookie-banner-title"
            aria-describedby="cookie-banner-desc"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:max-w-[460px] z-[95]"
          >
            <div className="rounded-[1.25rem] bg-coal/95 backdrop-blur-md border border-white/12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] p-6 md:p-7">
              <div className="flex items-start gap-4">
                <span className="w-11 h-11 shrink-0 rounded-full bg-brand/15 text-brand flex items-center justify-center">
                  <Cookie className="w-5 h-5" strokeWidth={1.8} />
                </span>
                <div>
                  <h2
                    id="cookie-banner-title"
                    className="font-display font-semibold text-lg leading-tight text-paper"
                  >
                    {t("cookie.title")}
                  </h2>
                  <p
                    id="cookie-banner-desc"
                    className="mt-2 text-sm leading-relaxed text-smoke"
                  >
                    <CookieDesc onLink={() => navigateTo("/politica-de-cookies")} />
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={rejectAll}
                  className="rounded-full border border-white/20 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-paper hover:text-ink"
                >
                  {t("cookie.reject")}
                </button>
                <button
                  onClick={openPanel}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:border-brand hover:text-brand"
                >
                  <Settings className="w-3.5 h-3.5" />
                  {t("cookie.configure")}
                </button>
                <button
                  onClick={acceptAll}
                  className="rounded-full bg-brand px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-flame"
                >
                  {t("cookie.accept")}
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Panel de configuración granular */}
      <PreferencesPanel
        open={panel}
        onClose={closePanel}
        consent={consent}
        onSave={saveConsent}
        onAcceptAll={acceptAll}
        onRejectAll={rejectAll}
      />
    </>
  );
}

function PreferencesPanel({
  open,
  onClose,
  consent,
  onSave,
  onAcceptAll,
  onRejectAll,
}: {
  open: boolean;
  onClose: () => void;
  consent: CookieConsent;
  onSave: (choice: Partial<CookieConsent>) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
}) {
  const [draft, setDraft] = useState<CookieConsent>(consent);
  const { t } = useI18n();
  const categoryOrder: ConsentCategory[] = [
    "necessary",
    "preferences",
    "analytics",
    "marketing",
  ];
  const catLabel = (c: ConsentCategory) => t(`cookie.cat.${c}`);
  const catDesc = (c: ConsentCategory) => t(`cookie.cat.${c}.desc`);
  const catLocked = (c: ConsentCategory) => c === "necessary";

  /* Reinicia el borrador al abrir */
  useEffect(() => {
    if (open) setDraft({ ...defaultConsent, ...consent });
  }, [open, consent]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[96] flex items-end md:items-center md:justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-panel-title"
        >
          <button
            aria-label={t("cookie.close_panel")}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full md:max-w-[640px] max-h-[92vh] flex flex-col rounded-t-[1.5rem] md:rounded-[1.5rem] bg-coal border border-white/10 overflow-hidden shadow-2xl"
          >
            <header className="flex items-start justify-between gap-6 px-6 md:px-8 pt-7 pb-5 border-b border-white/10">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand mb-2">
                  {t("cookie.panel.kicker")}
                </p>
                <h2
                  id="cookie-panel-title"
                  className="font-display font-semibold text-2xl leading-tight text-paper"
                >
                  {t("cookie.panel.title")}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label={t("cookie.close")}
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 md:px-8 py-5 space-y-4">
              <p className="text-sm text-smoke leading-relaxed">{t("cookie.panel.desc")}</p>

              {categoryOrder.map((key) => {
                const value = draft[key];
                const locked = catLocked(key);
                const label = catLabel(key);
                return (
                  <article
                    key={key}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display font-semibold text-lg text-paper leading-tight">
                          {label}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-smoke max-w-md">
                          {catDesc(key)}
                        </p>
                      </div>
                      <Toggle
                        checked={value}
                        disabled={locked}
                        onChange={(v) => !locked && setDraft((d) => ({ ...d, [key]: v }))}
                        label={label}
                      />
                    </div>
                  </article>
                );
              })}

              <p className="text-xs text-ash leading-relaxed">{t("cookie.panel.footer")}</p>
            </div>

            <footer className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 px-6 md:px-8 py-5 border-t border-white/10 bg-[#0c0c11]">
              <button
                onClick={onRejectAll}
                className="rounded-full border border-white/20 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper hover:bg-paper hover:text-ink transition-colors"
              >
                {t("cookie.reject")}
              </button>
              <button
                onClick={() => onSave(draft)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-brand text-brand px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] hover:bg-brand hover:text-white transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                {t("cookie.panel.save")}
              </button>
              <button
                onClick={onAcceptAll}
                className="rounded-full bg-brand px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-flame transition-colors"
              >
                {t("cookie.accept")}
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Descripción con enlace inline: parte el texto por {a}...{/a} */
function CookieDesc({ onLink }: { onLink: () => void }) {
  const { t } = useI18n();
  const raw = t("cookie.desc");
  const [before, rest] = raw.split("{a}");
  const [linkText, after] = (rest ?? "").split("{/a}");
  return (
    <>
      {before}
      <button
        onClick={onLink}
        className="text-brand hover:text-flame underline underline-offset-2"
      >
        {linkText}
      </button>
      {after}
    </>
  );
}

function Toggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`shrink-0 w-14 h-8 rounded-full relative transition-colors ${
        checked ? "bg-brand" : "bg-white/15"
      } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}
