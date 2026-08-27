/**
 * MISTERRED360 · Webhook WhatsApp + IA
 * ────────────────────────────────────────────────────────────
 * Recibe mensajes de WhatsApp Business Cloud API (Meta),
 * genera respuestas con OpenAI (GPT-4o) manteniendo el tono
 * editorial de la marca, y devuelve la respuesta por WhatsApp.
 *
 * Escalado a equipo humano si detecta urgencia/crisis.
 * ────────────────────────────────────────────────────────────
 */

import express from "express";
import crypto from "node:crypto";
import OpenAI from "openai";

const app = express();
app.use(express.json({ verify: keepRawBody }));

/* Guarda el body raw para verificar la firma HMAC de Meta */
function keepRawBody(req, _res, buf) {
  req.rawBody = buf;
}

const {
  WHATSAPP_TOKEN,
  WHATSAPP_PHONE_ID,
  WHATSAPP_VERIFY_TOKEN,
  WHATSAPP_APP_SECRET,
  OPENAI_API_KEY,
  OPENAI_MODEL = "gpt-4o-mini",
  SLACK_WEBHOOK_URL,
  ESCALATE_EMAIL,
  PORT = 3000,
} = process.env;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

/* ═══════════════════════════════════════════════════════════
   TONO EDITORIAL · MISTERRED360
   Este system prompt es lo que hace que la IA hable "como tú".
   Ajústalo con casos reales, tarifas de partida, matices de
   voz que hayan salido bien en entrevistas o campañas.
   ═══════════════════════════════════════════════════════════ */
const SYSTEM_PROMPT = `
Eres el asistente virtual de MISTERRED360, agencia de comunicación 360
con sede en Las Rozas de Madrid. Firma verbal: "Ponemos el alma.
Medimos al milímetro."

REGLAS INNEGOCIABLES:
1. Frases cortas, tono directo, español natural. Nada de "sinergias",
   "soluciones integrales", "líderes del sector". Cero jerga vacía.
2. Segunda persona ("tú"), nunca "vosotros" corporativo.
3. Nunca prometas precios cerrados. Si preguntan tarifas, di que
   trabajáis con presupuestos personalizados tras una primera lectura
   estratégica gratuita, y ofrece agendar llamada.
4. Nunca inventes datos, casos ni cifras. Si no sabes algo, dilo y
   ofrece derivar a una persona del equipo.
5. Nunca respondas sobre política, religión, temas personales del
   usuario o cualquier cosa fuera del alcance de la comunicación.

QUÉ HACE MISTERRED360:
- Reputación: gabinete de prensa, RRPP, crisis 72h.
- Estrategia: plan 360, DIRCOM externo, auditoría roja, estudios de mercado.
- Identidad: branding, imagen corporativa, naming.
- Creación: audiovisual, publicidad, eventos.
- Digital: redes, web, formación en IA aplicada.

VÍAS DE CONTACTO QUE PUEDES OFRECER:
- Formulario detallado: https://misterred360.es/#/contacto (idea gratis en 72h).
- Agendar llamada rápida: https://misterred360.es/#/agendar (día + franja).
- Email directo: misterred@misterred360.es
- Teléfono: +34 910 360 360 (L–V 9-18).

CUÁNDO ESCALAR A HUMANO INMEDIATO:
- Si aparecen palabras: "crisis", "urgente", "medio", "prensa", "juicio",
  "denuncia", "escándalo", "reputación en riesgo", "boicot".
- Si el usuario está molesto o dice "quiero hablar con una persona".
- Si pide un presupuesto o una propuesta formal.
En esos casos di: "Lo comparto ahora mismo con el equipo. Te contactan
en menos de 15 minutos." y devuelve además el flag {"escalate": true}.

LONGITUD DE RESPUESTA: 2-4 frases como máximo. Si el usuario pregunta algo
complejo, resume y ofrece agendar llamada.

CIERRE HABITUAL: propón siempre un siguiente paso concreto (agendar,
enviar reto, dar tu email).
`;

/* Cache de conversaciones · 1 hora en memoria por número */
const conversations = new Map();
const TTL = 60 * 60 * 1000;

function getHistory(from) {
  const entry = conversations.get(from);
  if (!entry) return [];
  if (Date.now() - entry.updated > TTL) {
    conversations.delete(from);
    return [];
  }
  return entry.messages;
}

function saveHistory(from, messages) {
  conversations.set(from, { messages: messages.slice(-16), updated: Date.now() });
}

/* Rate limit sencillo: 20 mensajes / hora por número */
const rateHits = new Map();
function checkRate(from) {
  const now = Date.now();
  const hits = (rateHits.get(from) || []).filter((t) => now - t < 3600_000);
  if (hits.length >= 20) return false;
  hits.push(now);
  rateHits.set(from, hits);
  return true;
}

/* ═══════════════════════════════════════════════════════════
   1 · Verificación del webhook (Meta hace GET al registrarlo)
   ═══════════════════════════════════════════════════════════ */
app.get("/api/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

/* ═══════════════════════════════════════════════════════════
   2 · Recepción de mensajes entrantes
   ═══════════════════════════════════════════════════════════ */
app.post("/api/webhook", async (req, res) => {
  /* Firma HMAC (si has configurado WHATSAPP_APP_SECRET) */
  if (WHATSAPP_APP_SECRET && !verifySignature(req)) {
    return res.sendStatus(403);
  }

  res.sendStatus(200); // respuesta inmediata a Meta

  try {
    const entry = req.body?.entry?.[0]?.changes?.[0]?.value;
    const message = entry?.messages?.[0];
    if (!message || message.type !== "text") return;

    const from = message.from;
    const text = message.text.body;

    if (!checkRate(from)) {
      await sendWhatsApp(
        from,
        "Estás enviando muchos mensajes seguidos. En un ratito seguimos."
      );
      return;
    }

    /* Genera respuesta con IA */
    const history = getHistory(from);
    history.push({ role: "user", content: text });

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.55,
      max_tokens: 320,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
    });

    const reply =
      completion.choices[0]?.message?.content ??
      "Perdona, un problema técnico. Escríbenos a misterred@misterred360.es y te contestamos rápido.";

    history.push({ role: "assistant", content: reply });
    saveHistory(from, history);

    await sendWhatsApp(from, reply);

    /* Escalado automático */
    if (needsEscalation(text, reply)) {
      await notifyTeam({ from, text, reply });
    }
  } catch (err) {
    console.error("[MR360 WA] error procesando mensaje:", err);
  }
});

/* ═══════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════ */

async function sendWhatsApp(to, body) {
  const url = `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_ID}/messages`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body },
    }),
  });
  if (!r.ok) {
    console.error("[MR360 WA] envío falló:", r.status, await r.text());
  }
}

function verifySignature(req) {
  const signature = req.headers["x-hub-signature-256"];
  if (!signature) return false;
  const expected =
    "sha256=" +
    crypto
      .createHmac("sha256", WHATSAPP_APP_SECRET)
      .update(req.rawBody)
      .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

const KEYWORDS = [
  "crisis",
  "urgente",
  "medio",
  "prensa",
  "juicio",
  "denuncia",
  "escándalo",
  "reputación",
  "boicot",
  "presupuesto",
  "propuesta",
  "hablar con una persona",
];
function needsEscalation(text, reply) {
  const t = (text + " " + reply).toLowerCase();
  return KEYWORDS.some((k) => t.includes(k));
}

async function notifyTeam({ from, text, reply }) {
  const summary = `⚠️ *WhatsApp escalado* de +${from}\n\n📥 "${text}"\n\n🤖 "${reply}"`;
  if (SLACK_WEBHOOK_URL) {
    try {
      await fetch(SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summary }),
      });
    } catch (e) {
      console.error("[MR360 WA] slack error:", e);
    }
  }
  if (ESCALATE_EMAIL) {
    console.log("[MR360 WA] escalar a", ESCALATE_EMAIL, ":", summary);
    // Aquí integrarías Resend / SendGrid / SES para el email real.
  }
}

/* Health check para monitorización */
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, service: "mr360-whatsapp-ai" })
);

app.listen(PORT, () => {
  console.log(`[MR360 WA] Webhook escuchando en :${PORT}`);
});
