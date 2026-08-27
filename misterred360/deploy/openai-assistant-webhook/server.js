/**
 * MISTERRED360 · Asistente Virtual · Webhook Backend
 * ────────────────────────────────────────────────────────────
 * Un único endpoint (POST /api/assistant) que conversa con un
 * asistente propio creado en platform.openai.com/assistants.
 *
 * Cada visitante mantiene su propio thread_id en localStorage,
 * así el asistente recuerda el contexto sin necesidad de base
 * de datos en nuestro lado.
 * ────────────────────────────────────────────────────────────
 */

import express from "express";
import cors from "cors";
import OpenAI from "openai";

const {
  OPENAI_API_KEY,
  OPENAI_ASSISTANT_ID,
  ALLOWED_ORIGIN = "https://misterred360.es",
  PORT = 3000,
} = process.env;

if (!OPENAI_API_KEY || !OPENAI_ASSISTANT_ID) {
  console.error(
    "[MR360 AI] Faltan variables: OPENAI_API_KEY y OPENAI_ASSISTANT_ID"
  );
  process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const app = express();
app.use(express.json({ limit: "20kb" }));

/* CORS · solo dominios permitidos (misterred360.es + localhost dev) */
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // curl o mismo origen
      const allowed = [
        ALLOWED_ORIGIN,
        "http://localhost:5173",
        "http://localhost:4173",
      ];
      cb(null, allowed.includes(origin));
    },
    methods: ["POST", "OPTIONS"],
  })
);

/* Rate limit sencillo por IP · 30 msg / hora */
const hits = new Map();
function rateLimit(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  if (arr.length >= 30) return false;
  arr.push(now);
  hits.set(ip, arr);
  return true;
}

/* ═══════════════════════════════════════════════════════════
   Endpoint principal
   Body: { messages: [{ role, content }, ...], threadId?: string }
   Devuelve: { reply: string, threadId: string }
   ═══════════════════════════════════════════════════════════ */
app.post("/api/assistant", async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "?";

  if (!rateLimit(String(ip))) {
    return res.status(429).json({
      reply:
        "Estás enviando mensajes muy rápido. Espera un momento y vuelve a intentarlo.",
    });
  }

  const { messages = [], threadId } = req.body ?? {};
  const lastUser = [...messages].reverse().find((m) => m.role === "user");

  if (!lastUser?.content || typeof lastUser.content !== "string") {
    return res
      .status(400)
      .json({ reply: "Falta el mensaje. Escribe algo y volvemos a intentarlo." });
  }
  if (lastUser.content.length > 2000) {
    return res.status(400).json({
      reply:
        "Tu mensaje es demasiado largo. Resúmelo en 200-300 palabras y lo estudiamos con calma.",
    });
  }

  try {
    /* 1 · Reusa el thread existente o crea uno nuevo */
    let currentThreadId = threadId;
    if (!currentThreadId) {
      const thread = await openai.beta.threads.create();
      currentThreadId = thread.id;
    }

    /* 2 · Añade el mensaje del usuario */
    await openai.beta.threads.messages.create(currentThreadId, {
      role: "user",
      content: lastUser.content,
    });

    /* 3 · Lanza el run y espera el resultado (polling) */
    const run = await openai.beta.threads.runs.createAndPoll(
      currentThreadId,
      { assistant_id: OPENAI_ASSISTANT_ID }
    );

    if (run.status !== "completed") {
      console.error("[MR360 AI] run no completado:", run.status, run.last_error);
      return res.json({
        reply:
          "Perdona, ha habido un problema técnico. Prueba a preguntarlo de otra forma o escríbenos a misterred@misterred360.es.",
        threadId: currentThreadId,
      });
    }

    /* 4 · Recupera el último mensaje del asistente */
    const list = await openai.beta.threads.messages.list(currentThreadId, {
      limit: 1,
      order: "desc",
    });
    const first = list.data[0];
    const reply =
      first?.content
        ?.filter((c) => c.type === "text")
        .map((c) => c.text.value)
        .join("\n\n") ??
      "No he podido componer la respuesta. Vuelve a intentarlo.";

    return res.json({ reply, threadId: currentThreadId });
  } catch (err) {
    console.error("[MR360 AI]", err);
    return res.status(500).json({
      reply:
        "Ahora mismo el asistente no puede responder. Escríbenos a misterred@misterred360.es y te contestamos en persona.",
    });
  }
});

/* Health check */
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, service: "mr360-assistant" })
);

app.listen(PORT, () => {
  console.log(`[MR360 AI] Asistente escuchando en :${PORT}`);
});
