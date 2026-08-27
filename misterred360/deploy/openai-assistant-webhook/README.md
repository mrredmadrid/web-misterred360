# MISTERRED360 · Asistente Virtual con ChatGPT

Backend Node.js listo para desplegar que expone un único endpoint
(`POST /api/assistant`) al que el widget de la web (`AIAssistant`)
llama para conversar con un **asistente propio creado en OpenAI**,
alimentado con el conocimiento real de MISTERRED360.

Es el mismo tipo de asistente que verías en ChatGPT (Custom GPT):
persistencia de conversación por hilo, respuestas en el tono editorial
de la marca, opción de "file search" (RAG) sobre documentos privados
y "function calling" para acciones (agendar, escalar a humano, etc.).

---

## 🧩 Arquitectura

```
Widget de la web (src/components/AIAssistant.tsx)
        │
        │ POST { messages: [...], threadId?: "thread_abc" }
        ▼
Este backend (Node + Express)
        │
        │ OpenAI Assistants API v2
        ▼
Tu asistente propio "MR360 · Asistente"
   · System prompt con el tono de la marca
   · Base de conocimiento (opcional): PDFs, notas de prensa, presentaciones
   · Tools: file_search, function calling
        │
        ▼
Respuesta ← se guarda el thread_id para el próximo mensaje
```

Cada visitante mantiene su propio **thread_id** en localStorage, por lo
que el asistente recuerda el contexto durante toda la sesión sin
necesidad de base de datos.

---

## 🚀 Despliegue en 4 pasos (15 minutos)

### 1 · Crear el asistente en OpenAI

1. Ve a [platform.openai.com/assistants](https://platform.openai.com/assistants).
2. **Create → Give it a name**: "MR360 · Asistente".
3. **Instructions** (system prompt): copia el contenido de
   `system-prompt.md` (viene en este mismo directorio).
4. **Model**: `gpt-4o-mini` (barato y rápido) o `gpt-4o` (máxima calidad).
5. Activa la herramienta **File Search** si quieres alimentarlo con
   documentos propios (PDFs, presentaciones, textos web). Sube:
   - `misterred360-textos-web.md` (ya está en `public/downloads/`).
   - Cualquier presentación comercial, PDF de servicios, etc.
6. Copia el **Assistant ID** (empieza por `asst_...`).

### 2 · Variables de entorno

Copia `.env.example` a `.env` y rellena:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxx
OPENAI_ASSISTANT_ID=asst_xxxxxxxxxx
ALLOWED_ORIGIN=https://misterred360.es    # tu dominio
```

### 3 · Desplegar el backend

**Opción A · Vercel (gratis, recomendado):**

```bash
cd deploy/openai-assistant-webhook
vercel --prod
```

Añade las variables en el dashboard de Vercel → Settings → Environment.
La URL será tipo `https://mr360-assistant.vercel.app/api/assistant`.

**Opción B · Railway / Render:**

```bash
railway up      # o render deploy
```

**Opción C · VPS OVH (junto a tu web):**

```bash
npm install
pm2 start server.js --name mr360-assistant
# Añadir bloque proxy_pass en Nginx a localhost:3000
```

### 4 · Conectar el widget con el backend

En la raíz de tu proyecto principal (no en este subdirectorio) crea o
edita `.env.local`:

```env
VITE_ASSISTANT_ENDPOINT=https://mr360-assistant.vercel.app/api/assistant
```

Recompila la web (`npm run build`) y súbela. El widget del chat ya
llamará a tu backend.

**Si no defines la variable**, el widget usa `/api/assistant` como
default: útil si despliegas el backend en el mismo dominio con Nginx
haciendo proxy.

---

## 🧪 Sin backend · el widget funciona igual

El widget tiene una **respuesta local de emergencia** (`localFallback`
en `AIAssistant.tsx`) que cubre las 5 preguntas más frecuentes con la
información real de la web:

- Servicios que ofrecéis
- Cómo trabajáis / método
- Gabinete de prensa
- Agendar llamada
- Precios / presupuesto

Así el widget se puede publicar hoy mismo (funciona sin IA), y el
día que despliegues el backend con ChatGPT, el mismo widget pasa a
usar la IA de forma automática sin tocar la web.

---

## 💰 Coste estimado

Con **gpt-4o-mini** (recomendado):

| Volumen | Coste mensual estimado |
| --- | --- |
| 500 conversaciones (~5 msg cada una) | ~2 € |
| 2000 conversaciones | ~10 € |
| 10 000 conversaciones | ~50 € |

Con **gpt-4o** (más caro, más preciso):

| Volumen | Coste mensual estimado |
| --- | --- |
| 500 conversaciones | ~15 € |
| 2000 conversaciones | ~60 € |

## 🛡️ Seguridad y buenas prácticas

- Verificación de **origen (CORS)**: solo `misterred360.es` puede
  hablar con el backend (no se puede llamar desde otras webs).
- **Rate limit** por IP: 30 mensajes / hora / IP.
- **Longitud máxima** de mensaje: 2000 caracteres (evita prompt
  injection largos).
- El asistente **no ejecuta código**, no accede a datos del usuario y
  no guarda historial en base de datos: solo el thread_id vive en el
  navegador del propio visitante.
- La política de uso de IA de la web (`#/politica-de-ia`) ya cubre
  legalmente este asistente al declarar el uso de sistemas de IA
  conforme al AI Act.

## 🔧 Personalización avanzada

- **Cambiar el tono**: edita el `Instructions` del asistente en el
  panel de OpenAI, sin tocar código.
- **Añadir conocimiento**: sube más documentos a File Search.
- **Function calling**: puedes definir funciones como
  `agendarLlamada(dia, franja, telefono)` para que el asistente actúe
  sobre tu backend real (ej: guardar en Notion, avisar a Slack).
- **Multilingüe**: el asistente detecta el idioma del usuario
  automáticamente y responde en el mismo idioma.
