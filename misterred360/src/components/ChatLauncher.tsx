import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, X } from "lucide-react";
import { useI18n } from "../lib/i18n";

/* ───────────────────────────────────────────────────────────
   ChatLauncher · botón único que despliega un menú con
   las dos vías de conversación (Asistente IA + WhatsApp).
   Reemplaza a los dos FAB independientes anteriores.
   ─────────────────────────────────────────────────────────── */

export type LauncherChoice = "assistant" | "whatsapp";

interface Props {
  onPick: (choice: LauncherChoice) => void;
  /* Estados externos para saber si algún panel está abierto */
  panelOpen: boolean;
}

export default function ChatLauncher({ onPick, panelOpen }: Props) {
  const { t } = useI18n();
  const [menu, setMenu] = useState(false);

  const pick = (choice: LauncherChoice) => {
    setMenu(false);
    onPick(choice);
  };

  return (
    <div className="fixed z-[92] bottom-5 right-5 md:bottom-7 md:right-7 flex flex-col items-end gap-3">
      {/* Menú de opciones */}
      <AnimatePresence>
        {menu && !panelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.94 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-end gap-2.5"
            role="menu"
            aria-label={t("launcher.aria")}
          >
            {/* Opción 1 · Asistente IA */}
            <MenuOption
              icon={<Bot className="w-5 h-5" strokeWidth={1.9} />}
              label={t("launcher.assistant.title")}
              hint={t("launcher.assistant.hint")}
              accent="rojo"
              onClick={() => pick("assistant")}
            />

            {/* Opción 2 · WhatsApp */}
            <MenuOption
              icon={<WhatsAppIcon className="w-5 h-5" />}
              label={t("launcher.wa.title")}
              hint={t("launcher.wa.hint")}
              accent="verde"
              onClick={() => pick("whatsapp")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón principal */}
      <button
        onClick={() => setMenu((v) => !v)}
        aria-label={
          menu ? t("launcher.close") : t("launcher.open")
        }
        aria-expanded={menu}
        aria-haspopup="menu"
        data-cursor="button"
        className="relative w-[3.4rem] h-[3.4rem] rounded-full bg-brand hover:bg-flame text-white shadow-[0_10px_30px_-8px_rgba(232,38,43,0.6)] flex items-center justify-center transition-transform hover:scale-105 focus-visible:scale-105"
      >
        <AnimatePresence mode="wait" initial={false}>
          {menu ? (
            <motion.span
              key="close"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <X className="w-6 h-6" strokeWidth={2.2} />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <MessageCircle className="w-6 h-6" strokeWidth={1.9} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Punto rojo pulsante cuando el menú está cerrado */}
        {!menu && !panelOpen && (
          <span
            className="absolute -top-1 -right-1 flex h-3 w-3"
            aria-hidden="true"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
          </span>
        )}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────── */

function MenuOption({
  icon,
  label,
  hint,
  accent,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  accent: "rojo" | "verde";
  onClick: () => void;
}) {
  const bg = accent === "verde" ? "bg-[#25D366]" : "bg-brand";
  const hover = accent === "verde" ? "hover:bg-[#1FBE59]" : "hover:bg-flame";
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className="group flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-full bg-coal border border-white/12 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] hover:border-white/25 transition-colors"
    >
      <span className="text-right leading-tight">
        <span className="block text-[13px] font-semibold text-paper">
          {label}
        </span>
        <span className="block text-[10px] uppercase tracking-[0.14em] text-smoke mt-0.5">
          {hint}
        </span>
      </span>
      <span
        className={`w-10 h-10 rounded-full text-white flex items-center justify-center shrink-0 transition-colors ${bg} ${hover}`}
      >
        {icon}
      </span>
    </button>
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
