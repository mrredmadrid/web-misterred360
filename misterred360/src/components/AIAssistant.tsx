import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Loader2, RefreshCw, Sparkles, X } from "lucide-react";
import { useI18n } from "../lib/i18n";
import { askAssistant, assistantConfig, type Message } from "../lib/assistant";

/* ───────────────────────────────────────────────────────────
   AIAssistant · Asistente virtual con ChatGPT integrado
   - Botón flotante (esquina inferior derecha inferior)
   - Panel de chat con burbujas, sugerencias, indicador
     "escribiendo…" e historial persistente en localStorage
   - Se comunica con /api/assistant (backend OpenAI Assistants
     descrito en deploy/openai-assistant-webhook)
   ─────────────────────────────────────────────────────────── */

const STORAGE_KEY = "mr360.assistant.thread";
const HISTORY_KEY = "mr360.assistant.history";

export default function AIAssistant({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: assistantConfig.greeting },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /* Carga historial persistente */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      const savedThread = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (parsed.length > 0) setMessages(parsed);
      }
      if (savedThread) setThreadId(savedThread);
    } catch {
      /* noop */
    }
  }, []);

  /* Guarda historial en cada mensaje nuevo */
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
    } catch {
      /* noop */
    }
  }, [messages]);

  useEffect(() => {
    if (threadId) {
      try {
        localStorage.setItem(STORAGE_KEY, threadId);
      } catch {
        /* noop */
      }
    }
  }, [threadId]);

  /* Auto-scroll al último mensaje */
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, busy]);

  /* Focus al abrir */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || busy) return;

    setError(null);
    setInput("");
    const nextHistory: Message[] = [
      ...messages,
      { role: "user", content },
    ];
    setMessages(nextHistory);
    setBusy(true);

    try {
      const { reply, threadId: newThread } = await askAssistant(
        nextHistory,
        threadId
      );
      if (newThread) setThreadId(newThread);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: reply || t("ai.error.empty") },
      ]);
    } catch (err) {
      console.error("[MR360 AI]", err);
      /* Fallback local si el backend no está desplegado */
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: localFallback(content),
        },
      ]);
      setError(t("ai.error.offline"));
    } finally {
      setBusy(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    send();
  };

  const reset = () => {
    setMessages([{ role: "assistant", content: assistantConfig.greeting }]);
    setThreadId(undefined);
    setError(null);
    try {
      localStorage.removeItem(HISTORY_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          role="dialog"
          aria-modal="false"
          aria-labelledby="ai-title"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-[94] bottom-36 right-5 md:bottom-40 md:right-7 w-[min(94vw,400px)] h-[min(78vh,600px)] flex flex-col rounded-[1.25rem] overflow-hidden bg-coal border border-white/12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)]"
        >
            {/* Cabecera */}
            <header className="relative px-5 py-4 border-b border-white/10 bg-ink flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shrink-0 shadow-[0_0_18px_-4px_rgba(232,38,43,0.65)]">
                <Sparkles className="w-4 h-4" strokeWidth={2} />
              </span>
              <div className="flex-1 min-w-0">
                <p
                  id="ai-title"
                  className="font-display font-semibold text-[15px] leading-tight text-paper"
                >
                  {assistantConfig.name}
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-smoke mt-0.5">
                  {assistantConfig.tagline}
                </p>
              </div>
              <button
                onClick={reset}
                aria-label={t("ai.reset")}
                title={t("ai.reset")}
                className="w-8 h-8 rounded-full border border-white/12 flex items-center justify-center text-smoke hover:text-paper hover:border-white/25 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                aria-label={t("ai.close")}
                className="w-8 h-8 rounded-full border border-white/12 flex items-center justify-center text-smoke hover:text-paper hover:border-white/25 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </header>

            {/* Zona de mensajes */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-coal"
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 text-sm leading-snug whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-brand text-white rounded-2xl rounded-tr-sm"
                        : "bg-white/[0.05] text-paper rounded-2xl rounded-tl-sm border border-white/[0.06]"
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {/* Sugerencias iniciales */}
              {messages.length === 1 && !busy && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {assistantConfig.suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs text-paper hover:border-brand hover:text-brand transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Indicador "escribiendo…" */}
              {busy && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/[0.05] border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </motion.div>
              )}

              {error && (
                <p className="text-[11px] text-brand/80 text-center">{error}</p>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={submit}
              className="border-t border-white/10 bg-ink p-3 space-y-2"
            >
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={1}
                  placeholder={t("ai.placeholder")}
                  disabled={busy}
                  className="w-full max-h-32 min-h-[42px] rounded-2xl bg-white/[0.05] border border-white/10 pl-4 pr-12 py-2.5 text-sm text-paper placeholder:text-ash outline-none focus:border-brand focus:bg-white/[0.07] resize-none transition-colors disabled:opacity-60"
                />
                <button
                  type="submit"
                  aria-label={t("ai.send")}
                  disabled={busy || !input.trim()}
                  className="absolute right-2 bottom-2 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center hover:bg-flame transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {busy ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowUp className="w-4 h-4" strokeWidth={2.4} />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-ash text-center leading-relaxed px-2">
                {assistantConfig.disclaimer}
              </p>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
  );
}

/* Respuesta local mínima si el backend aún no está desplegado.
   Cubre las 4 preguntas frecuentes con datos ya redactados en la web. */
function localFallback(userMsg: string): string {
  const q = userMsg.toLowerCase();
  if (q.includes("servicio") || q.includes("hacéis") || q.includes("hacéis")) {
    return "Trabajamos cinco territorios: Reputación (prensa, RRPP, crisis), Estrategia (plan 360, DIRCOM externo, auditoría), Identidad (branding, naming), Creación (audiovisual, publicidad, eventos) y Digital (redes, formación en IA). Puedes ver el detalle en la sección Servicios de la web.";
  }
  if (q.includes("cómo trabaj") || q.includes("método") || q.includes("proceso")) {
    return "Aplicamos el Método Milímetro: escuchar hasta que duela, medir antes de opinar, construir a tu medida y estar cuando haga falta. Un interlocutor único, respuesta en 24h y una idea gratis ejecutable en 72h antes de contratar.";
  }
  if (q.includes("prensa") || q.includes("gabinete")) {
    return "Nuestro gabinete de prensa convierte tu actividad en noticia: relación con medios, notas de valor, portavocía y seguimiento. ¿Te agendo una llamada para valorarlo? Puedes hacerlo en /agendar.";
  }
  if (q.includes("agenda") || q.includes("llamada") || q.includes("cita")) {
    return "Perfecto. En la sección Pedir llamada eliges día y franja (mañana o tarde) y te llamamos nosotros desde el corporativo. Sin apps, sin videollamadas: teléfono y ya. Enlace: /agendar";
  }
  if (q.includes("precio") || q.includes("presupuesto") || q.includes("cuánto")) {
    return "Trabajamos con presupuestos personalizados tras una primera lectura estratégica gratuita. Cuéntanos el reto por el formulario o pide llamada y te devolvemos una propuesta cerrada.";
  }
  return "Puedo ayudarte con servicios, método, agendar una llamada o resolver dudas de comunicación. Escríbeme más detalle o elige una de las sugerencias del principio.";
}
