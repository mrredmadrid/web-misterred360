import { motion } from "framer-motion";
import { Bot, X } from "lucide-react";
import { useI18n } from "../lib/i18n";

/* ───────────────────────────────────────────────────────────
   ChatLauncher · dos FAB siempre visibles (Asistente IA +
   WhatsApp), sin menú intermedio: cada botón abre/cierra su
   propio panel directamente al pulsarlo.
   ─────────────────────────────────────────────────────────── */

export type LauncherChoice = "assistant" | "whatsapp";

interface Props {
  onPick: (choice: LauncherChoice) => void;
  /* Qué panel está abierto ahora mismo, si alguno */
  active: LauncherChoice | null;
}

export default function ChatLauncher({ onPick, active }: Props) {
  const { t } = useI18n();

  return (
    <div className="fixed z-[92] bottom-5 right-5 md:bottom-7 md:right-7 flex flex-col items-end gap-3">
      <Fab
        icon={
          active === "assistant" ? (
            <X className="w-6 h-6" strokeWidth={2.2} />
          ) : (
            <Bot className="w-6 h-6" strokeWidth={1.9} />
          )
        }
        label={active === "assistant" ? t("launcher.close") : t("launcher.assistant.title")}
        accent="rojo"
        pulsing={active === null}
        onClick={() => onPick("assistant")}
      />
      <Fab
        icon={
          active === "whatsapp" ? (
            <X className="w-6 h-6" strokeWidth={2.2} />
          ) : (
            <WhatsAppIcon className="w-6 h-6" />
          )
        }
        label={active === "whatsapp" ? t("launcher.close") : t("launcher.wa.title")}
        accent="verde"
        pulsing={false}
        onClick={() => onPick("whatsapp")}
      />
    </div>
  );
}

/* ─────────────────────────────────────────── */

function Fab({
  icon,
  label,
  accent,
  pulsing,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  accent: "rojo" | "verde";
  pulsing: boolean;
  onClick: () => void;
}) {
  const bg = accent === "verde" ? "bg-[#25D366]" : "bg-brand";
  const hover = accent === "verde" ? "hover:bg-[#1FBE59]" : "hover:bg-flame";
  const shadow =
    accent === "verde"
      ? "shadow-[0_10px_30px_-8px_rgba(37,211,102,0.55)]"
      : "shadow-[0_10px_30px_-8px_rgba(232,38,43,0.6)]";
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      aria-label={label}
      data-cursor="button"
      className={`relative w-[3.4rem] h-[3.4rem] rounded-full text-white flex items-center justify-center transition-transform hover:scale-105 focus-visible:scale-105 ${bg} ${hover} ${shadow}`}
    >
      {icon}
      {pulsing && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
      )}
    </motion.button>
  );
}

export function WhatsAppIcon({ className = "" }: { className?: string }) {
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
