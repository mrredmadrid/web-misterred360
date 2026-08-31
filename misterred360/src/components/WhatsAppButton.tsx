import { AnimatePresence, motion } from "framer-motion";
import { X, Send } from "lucide-react";
import { useState } from "react";
import { useI18n } from "../lib/i18n";
import {
  buildWhatsAppUrl,
  isBusinessHoursNow,
  whatsappConfig,
} from "../lib/whatsapp";

/* ───────────────────────────────────────────────────────────
   WhatsAppPanel · panel de bienvenida controlado desde fuera
   Sin FAB propio: el disparo lo hace ChatLauncher.
   ─────────────────────────────────────────────────────────── */

export default function WhatsAppButton({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [msg, setMsg] = useState("");
  const online = isBusinessHoursNow();

  const send = () => {
    const finalMsg = msg.trim() || whatsappConfig.defaultMessage;
    window.open(buildWhatsAppUrl(finalMsg), "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.94 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="false"
          aria-labelledby="wa-panel-title"
          className="fixed z-[94] bottom-36 right-5 md:bottom-40 md:right-7 w-[min(94vw,340px)] rounded-[1.25rem] overflow-hidden bg-coal border border-white/12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]"
        >
          {/* Cabecera verde WhatsApp */}
          <header className="relative bg-[#25D366] text-[#053e2c] px-5 py-4 flex items-start gap-3">
            <span className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0">
              <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />
            </span>
            <div className="flex-1 min-w-0">
              <p
                id="wa-panel-title"
                className="font-display font-semibold text-base leading-tight"
              >
                {whatsappConfig.agentName}
              </p>
              <p className="text-xs mt-0.5 opacity-80">
                {whatsappConfig.agentRole}
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em]">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    online ? "bg-[#053e2c]" : "bg-[#053e2c]/40"
                  }`}
                  aria-hidden="true"
                />
                {online ? t("wa.online") : t("wa.offline")}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label={t("wa.close")}
              className="w-8 h-8 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </header>

          {/* Cuerpo */}
          <div className="p-5 bg-coal">
            <div className="rounded-2xl rounded-tl-sm bg-white/[0.04] border border-white/[0.06] px-4 py-3 mb-4">
              <p className="text-sm text-paper leading-snug">
                {online ? t("wa.greeting.online") : t("wa.greeting.offline")}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-smoke">
                {whatsappConfig.hours.weekdays} · L–V
              </p>
            </div>

            <label htmlFor="wa-msg" className="sr-only">
              {t("wa.placeholder")}
            </label>
            <textarea
              id="wa-msg"
              rows={3}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder={t("wa.placeholder")}
              className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2.5 text-sm text-paper placeholder:text-ash outline-none focus:border-[#25D366] focus:bg-white/[0.07] resize-none transition-colors"
            />

            <button
              onClick={send}
              className="group mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1FBE59] text-[#053e2c] font-semibold text-[13px] uppercase tracking-[0.12em] px-5 py-3 transition-colors"
            >
              {t("wa.send")}
              <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>

            <p className="mt-3 text-[10px] text-ash text-center leading-relaxed">
              {t("wa.privacy")}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
