/* ───────────────────────────────────────────────────────────
   MISTERRED360 · Configuración del asistente virtual
   Cliente ligero que habla con la API OpenAI Assistants
   (ChatGPT) a través de tu propio backend seguro.
   ─────────────────────────────────────────────────────────── */

export interface AssistantConfig {
  /* URL absoluta del backend. Cámbiala por la tuya al desplegar. */
  endpoint: string;
  /* Nombre visible del asistente */
  name: string;
  /* Subtítulo mostrado bajo el nombre */
  tagline: string;
  /* Mensaje de bienvenida (primer mensaje del asistente) */
  greeting: string;
  /* Sugerencias rápidas que aparecen bajo la bienvenida */
  suggestions: string[];
  /* Aviso legal breve al pie del chat */
  disclaimer: string;
}

export const assistantConfig: AssistantConfig = {
  /* Cuando despliegues el backend (Vercel, Railway…) sustituye esta URL.
     Si dejas /api/assistant, la web hará fallback a la respuesta local
     preprogramada (ver README de deploy/openai-assistant-webhook). */
  endpoint:
    (import.meta as unknown as { env?: Record<string, string> }).env
      ?.VITE_ASSISTANT_ENDPOINT ?? "/api/assistant",
  name: "MR360 · Asistente",
  tagline: "Con el conocimiento de la agencia · Habla como MISTERRED360",
  greeting:
    "Hola, soy el asistente de MISTERRED360. Puedo contarte cómo trabajamos, en qué te podemos ayudar y agendarte una llamada. ¿Por dónde empezamos?",
  suggestions: [
    "¿Qué servicios ofrecéis?",
    "Cuéntame cómo trabajáis",
    "Necesito un gabinete de prensa",
    "Quiero agendar una llamada",
  ],
  disclaimer:
    "Asistente virtual con IA. Puede cometer errores: para propuestas formales, contacta con el equipo.",
};

export interface Message {
  role: "user" | "assistant";
  content: string;
}

/* Envía la conversación al backend y devuelve la respuesta.
   Timeout de 30 s para evitar quedarse colgado. */
export async function askAssistant(
  history: Message[],
  threadId?: string
): Promise<{ reply: string; threadId?: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const res = await fetch(assistantConfig.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history, threadId }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { reply: data.reply ?? "", threadId: data.threadId };
  } finally {
    clearTimeout(timeout);
  }
}
