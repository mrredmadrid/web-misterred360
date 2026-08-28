# MISTERRED360 · Webhook de WhatsApp con IA

Backend Node.js listo para desplegar que conecta WhatsApp Business Cloud
API (Meta) con un modelo de OpenAI (GPT-4o) para **responder
automáticamente** a los mensajes que lleguen al número corporativo,
manteniendo el tono editorial de la marca y el patrón "alma y milímetro".

**Todo el widget del sitio web ya está listo** para funcionar sin
backend: al pulsar el botón flotante se abre `wa.me/34609904063` con el
mensaje pre-rellenado. Este backend opcional se activa cuando queráis
que la primera respuesta sea automática con IA.

---

## 🧩 Cómo funciona el flujo completo

```
Usuario web → botón WhatsApp de misterred360.es → wa.me → WhatsApp del usuario
                                                                 ↓
                                                    Escribe al +34 609 90 40 63
                                                                 ↓
                                       WhatsApp Business Cloud API (Meta)
                                                                 ↓
                                              Webhook POST → este servidor
                                                                 ↓
                                           IA (OpenAI GPT-4o) genera respuesta
                                                  con tono MISTERRED360
                                                                 ↓
                              Respuesta enviada por WhatsApp Cloud API al usuario
                                                                 ↓
                                    Notificación a equipo humano en Slack/email
```

---

## 📦 Requisitos

- **Cuenta de Meta Business** con acceso a WhatsApp Business Platform (gratis
  hasta 1000 conversaciones/mes iniciadas por usuario).
- **Número de teléfono** verificado (idealmente el corporativo +34 609 90 40 63).
- **Cuenta de OpenAI** con acceso a GPT-4o (5–15 € al mes para volumen medio).
- Servidor Node 20+ (Vercel Functions, Railway, Render, o VPS Ubuntu).

## 🔑 Variables de entorno necesarias

```env
# WhatsApp Cloud API (Meta)
WHATSAPP_TOKEN=EAAxxxxxx...                    # Token permanente del System User
WHATSAPP_PHONE_ID=123456789012345               # Phone Number ID de Meta
WHATSAPP_VERIFY_TOKEN=un_secreto_que_tu_eliges  # Cadena arbitraria para el hand-shake

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini                        # gpt-4o para máxima calidad

# Notificaciones internas (opcional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/...   # Para avisar al equipo humano
ESCALATE_EMAIL=misterred@misterred360.es
```

## 🚀 Despliegue en 5 pasos

### 1 · Alta en Meta Business

1. Ve a [business.facebook.com](https://business.facebook.com) → crea la
   cuenta si aún no la tienes.
2. En **WhatsApp Manager** añade el número +34 609 90 40 63 (te enviarán un
   SMS de verificación).
3. Copia el **Phone Number ID** y el **WhatsApp Business Account ID**.
4. Crea un **System User** con permisos de WhatsApp y genera un **token
   permanente**. Guárdalo bien (no volverá a mostrarse).

### 2 · Despliega el webhook

Este mismo directorio (`deploy/whatsapp-ai-webhook/`) contiene un servidor
Express funcional en `server.js`. Súbelo a tu proveedor favorito:

**Vercel (recomendado, gratis para este volumen)**

```bash
cd deploy/whatsapp-ai-webhook
vercel --prod
```

Configura las variables de entorno en el dashboard de Vercel.

**Railway / Render**: `railway up` o `render deploy`, mismo funcionamiento.

**VPS Ubuntu**:

```bash
npm install
pm2 start server.js --name mr360-wa
sudo nginx -s reload   # con proxy_pass a localhost:3000
```

### 3 · Registra la URL del webhook en Meta

1. En Meta → WhatsApp → Configuración → **Webhooks**.
2. URL: `https://tu-servidor.vercel.app/api/webhook`
3. Verify Token: el mismo que pusiste en `WHATSAPP_VERIFY_TOKEN`.
4. Suscribe el evento **`messages`**.
5. Meta hará un GET de verificación; si el token coincide, se activa.

### 4 · Personaliza el prompt del sistema

Abre `server.js` y busca la constante `SYSTEM_PROMPT`. Ahí está el "tono
MISTERRED360" que la IA usará. Ajústalo con tus propios matices, casos de
uso reales, servicios, etc. Ejemplos que ya vienen incluidos:

- Cuándo derivar al equipo humano (proyectos grandes, crisis, etc.).
- Cómo agendar llamada.
- Cómo pedir el reto por email para preparar una idea gratis en 72 h.
- Respuestas prohibidas (nunca promete precios cerrados, nunca miente).

### 5 · Prueba end-to-end

1. Envía un WhatsApp al número corporativo desde tu móvil personal.
2. El webhook debe recibirlo → generar respuesta con IA → enviarla.
3. Recibes la respuesta en tu WhatsApp en 2–5 segundos.
4. Si el mensaje contiene palabras clave de escalado ("crisis", "urgente",
   "presupuesto"), el bot avisa al equipo humano por Slack/email y añade
   una nota al usuario: *"Un compañero se pondrá contigo en breve."*

---

## 🛡️ Seguridad y buenas prácticas

- **Nunca subas los tokens al repositorio Git**. Están en `.env`, que va
  siempre en `.gitignore`.
- El webhook **valida la firma X-Hub-Signature-256** de Meta para
  garantizar que el mensaje viene realmente de sus servidores.
- **Rate limit** aplicado por usuario (máx. 20 mensajes/hora) para evitar
  facturas descontroladas de OpenAI.
- El historial de conversación se guarda solo **1 hora en memoria** para
  contexto; luego se olvida (LOPDGDD-friendly).
- Añade el uso de IA en la **Política de IA** de la web (ya está incluida
  en `#/politica-de-ia`) y en la política de privacidad.

## 💰 Coste estimado mensual

| Volumen | Meta WhatsApp | OpenAI (gpt-4o-mini) | Total |
| --- | --- | --- | --- |
| 100 conversaciones/mes | Gratis | ~2 € | **~2 €** |
| 500 conversaciones/mes | Gratis | ~10 € | **~10 €** |
| 2000 conversaciones/mes | ~15 € | ~40 € | **~55 €** |

Los primeros 1000 conversaciones iniciadas por usuario son gratis en Meta.

---

## 🔧 Sin webhook · funcionamiento actual

Si aún no tienes el webhook desplegado, **el botón funciona perfectamente
en modo básico**: abre WhatsApp Web/App con el mensaje pre-rellenado y el
equipo humano contesta manualmente. El paso a IA es opcional y se hace
sin tocar la web.
