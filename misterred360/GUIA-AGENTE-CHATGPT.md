# MISTERRED360 · Guía completa para activar el asistente virtual con ChatGPT

Configuración paso a paso del **chat inteligente que aparece en la
esquina inferior derecha** de la web, conectado a un asistente propio
creado en la plataforma OpenAI (la misma tecnología que ChatGPT).

**Tiempo total estimado: 20-30 minutos**.

**Coste mensual estimado**: 2 – 50 € según volumen (ver punto 8).

---

## 📋 Índice

1. [Qué vas a montar · arquitectura del sistema](#1)
2. [Antes de empezar · qué necesitas](#2)
3. [Crear el asistente en OpenAI Platform](#3)
4. [Subir el conocimiento propio (File Search / RAG)](#4)
5. [Obtener las credenciales](#5)
6. [Desplegar el backend en Vercel](#6)
7. [Conectar la web con el backend](#7)
8. [Probar end-to-end + controlar costes](#8)
9. [Personalización avanzada](#9)
10. [Problemas frecuentes y soluciones](#10)

---

## <a id="1"></a>1 · Qué vas a montar · arquitectura del sistema

```
Visitante web → Widget del chat (esquina inferior derecha)
                        │
                        │ POST /api/assistant
                        ▼
              Tu backend en Vercel (server.js)
                        │
                        │ OpenAI Assistants API v2
                        ▼
       Tu asistente propio "MR360 · Asistente"
       · System prompt con el tono de la marca
       · File Search (RAG) con documentos oficiales
       · Threads persistentes por visitante
                        │
                        ▼
       Respuesta natural, con memoria de conversación
```

**Es exactamente la misma tecnología que ChatGPT**: la única diferencia
es que en vez de responder desde chatgpt.com, responde desde el chat
de tu web con las instrucciones y el conocimiento que le des tú.

### Ventajas frente al WhatsApp bot

- El visitante **no necesita salir de la web** ni tener WhatsApp.
- Puedes darle **base de conocimiento propia** (PDFs, presentaciones,
  guías internas).
- El asistente **recuerda toda la conversación** aunque el visitante
  navegue entre páginas.
- **Función "borrar historial"** para el usuario en cualquier momento.

---

## <a id="2"></a>2 · Antes de empezar · qué necesitas

- 💳 **Cuenta de OpenAI** con tarjeta configurada (5-10 €/mes iniciales
  bastan para arrancar).
- 💻 Cuenta de **Vercel** o **Railway** (gratuita para este volumen).
- 📄 **Documentos que quieras que el asistente conozca**:
  - Base ya lista en el proyecto: `public/downloads/misterred360-textos-web.md`.
  - Recomendado añadir: presentación comercial en PDF, catálogo de
    servicios detallado, dosier de prensa con casos reales, guía de
    tarifas orientativas (uso interno, no visible en respuestas).

---

## <a id="3"></a>3 · Crear el asistente en OpenAI Platform

### 3.1 Alta y facturación

Si ya lo tienes de la guía del bot de WhatsApp, salta al paso 3.2.

1. Ve a [**platform.openai.com**](https://platform.openai.com/).
2. Regístrate con el email corporativo.
3. **Billing → Add payment method** → añade la tarjeta.
4. **Billing → Usage limits**: pon un tope mensual de seguridad
   (recomendado **20 €/mes** al arrancar).

### 3.2 Crear el asistente

1. Menú lateral → **Assistants** → **Create**.
2. **Name**: `MR360 · Asistente`.
3. **Description**: `Asistente virtual de MISTERRED360, agencia de comunicación 360.`
4. **Instructions**: aquí va el "cerebro" del asistente. Abre el
   archivo `deploy/openai-assistant-webhook/system-prompt.md` de tu
   proyecto y **copia todo su contenido** en este campo. Ya trae:
   - Firma verbal *"Ponemos el alma. Medimos al milímetro."*
   - 7 reglas innegociables de estilo.
   - Los 5 territorios de servicios.
   - Los sectores donde sois imbatibles.
   - Todas las vías de contacto reales.
   - Respuestas modelo para casos frecuentes (precios, crisis, sector, etc.).
   - Instrucción multilingüe (responde en el idioma del visitante).
5. **Model**: elige uno de los dos:

   | Modelo | Cuándo elegirlo |
   |---|---|
   | **`gpt-4o-mini`** | ✅ Recomendado para empezar. Rápido, barato, calidad muy buena. Cubre >90 % de las conversaciones habituales. |
   | **`gpt-4o`** | Solo si necesitas máxima precisión (crisis institucionales, temas legales, marcas grandes). 3-4x más caro. |

6. **Tools**: activa las siguientes:
   - ✅ **File Search** (para que use tus documentos como base).
   - ❌ Code Interpreter (no lo necesitamos, ahorra coste).
   - ❌ Functions (opcional, solo si quieres que el asistente ejecute
      acciones reales — ver punto 9).
7. **Response format**: `text` (no JSON).
8. **Temperature**: `0.6` (equilibrio entre precisión y naturalidad).
9. **Top P**: `1`.
10. Click **Create**.

### 3.3 Copiar el Assistant ID

En la vista del asistente, arriba, hay un botón para copiar el ID.
Empieza por `asst_...`. **Guárdalo**: es una de las 2 credenciales que
necesitarás.

---

## <a id="4"></a>4 · Subir el conocimiento propio (File Search / RAG)

Aquí es donde el asistente se convierte en **experto real de MISTERRED360**
en vez de un ChatGPT genérico.

### 4.1 Preparar los documentos

Formatos aceptados: **PDF, DOCX, TXT, MD, PPTX**. Máximo 512 MB por
archivo, 10 000 archivos por asistente.

**Documentos recomendados** (por orden de prioridad):

1. **`misterred360-textos-web.md`** (ya está en `public/downloads/`
   de tu proyecto) — cubre toda la web escrita.
2. **`GUIA-INSIGHTS.md`** — cubre la voz y estilo del blog.
3. Presentación comercial actual en PDF.
4. Catálogo de servicios detallado (con qué incluye cada uno).
5. Casos de éxito reales con cifras verificadas (aunque no salgan en
   la web, el asistente puede citarlos en conversaciones privadas).
6. Preguntas frecuentes internas con respuestas oficiales del equipo.
7. Media kit / dosier de prensa.

### 4.2 Subir los documentos

1. En el asistente → sección **File Search → Vector Store**.
2. Click **Create vector store** → nombre: `MR360 Knowledge Base`.
3. **Upload files** → arrastra los archivos.
4. OpenAI los procesa (~30 segundos por archivo).
5. Marca los archivos que quieres que el asistente use.

### 4.3 Referenciar los documentos en el prompt

Añade al final del System Prompt esta línea:

```
Cuando cites información, apóyate en los documentos disponibles a través
de File Search. Si un dato no está en los documentos, admite que no lo
sabes y ofrece derivar a una persona del equipo.
```

Así fuerzas al asistente a **no inventar**.

---

## <a id="5"></a>5 · Obtener las credenciales

Necesitas exactamente **2** cosas:

### 5.1 API Key

1. Menú lateral → **API keys → Create new secret key**.
2. Nombre: `MR360 Assistant`.
3. Permisos: **Restricted** → selecciona:
   - `model.request`
   - `assistant.read`, `assistant.write`
   - `thread.read`, `thread.write`
   - `message.read`, `message.write`
4. Copia la key inmediatamente. Empieza por `sk-proj-...`.
   **Guárdala** como `OPENAI_API_KEY` (no se puede volver a ver).

### 5.2 Assistant ID

El que copiaste en el paso 3.3, empezando por `asst_...`. Se guarda
como `OPENAI_ASSISTANT_ID`.

---

## <a id="6"></a>6 · Desplegar el backend en Vercel

El código está listo en tu proyecto: **`deploy/openai-assistant-webhook/`**.

### 6.1 Instalar dependencias

```bash
cd deploy/openai-assistant-webhook
npm install
```

### 6.2 Crear el proyecto en Vercel

```bash
npm i -g vercel   # solo la primera vez
vercel login
vercel
```

Preguntas del asistente:
- Set up and deploy? → **Y**
- Which scope? → tu cuenta.
- Link to existing project? → **N**
- Project name → `mr360-assistant`
- In which directory is your code? → **`./`**
- Override settings? → **N**

Cuando termine te dará la URL, tipo:
`https://mr360-assistant-abc123.vercel.app`.

### 6.3 Añadir las variables de entorno

Dashboard de Vercel → tu proyecto → **Settings → Environment Variables**:

| Variable | Valor |
|---|---|
| `OPENAI_API_KEY` | La key del paso 5.1 |
| `OPENAI_ASSISTANT_ID` | El ID del paso 5.2 |
| `ALLOWED_ORIGIN` | `https://misterred360.es` |

Aplica a: **Production, Preview y Development**.

### 6.4 Re-desplegar con las variables

```bash
vercel --prod
```

Prueba que responde:

```bash
curl https://mr360-assistant-abc123.vercel.app/api/health
# → {"ok":true,"service":"mr360-assistant"}
```

---

## <a id="7"></a>7 · Conectar la web con el backend

### 7.1 Añadir la URL del backend a la web

En la raíz de tu proyecto principal (el de la web, no el subdirectorio
del backend), crea el archivo **`.env.local`** con:

```env
VITE_ASSISTANT_ENDPOINT=https://mr360-assistant-abc123.vercel.app/api/assistant
```

Cambia el subdominio por el tuyo real.

### 7.2 Recompilar y subir

```bash
npm run build
```

Sube la nueva carpeta `dist/` a OVH.

### 7.3 Sin recompilar · alternativa rápida

Si prefieres no tocar la web todavía, el widget **funciona igualmente
en modo básico** con las 5 respuestas frecuentes locales que ya trae
programadas. Cuando quieras activar la IA real, solo hay que añadir la
variable y recompilar.

---

## <a id="8"></a>8 · Probar end-to-end + controlar costes

### 8.1 Prueba básica

Abre `https://misterred360.es` en el navegador. En la esquina inferior
derecha verás **dos botones flotantes verticales**:
- Abajo: WhatsApp (verde).
- Arriba: **Asistente virtual (icono de bot rojo)** ← este.

Click en el bot rojo → se abre el panel de chat. Escribe:

```
¿Qué servicios ofrecéis?
```

**Respuesta esperada** en 2-4 segundos, natural y con el tono de la
marca:

> Trabajamos cinco territorios: reputación (prensa, RRPP, crisis),
> estrategia (plan 360, DIRCOM externo, auditoría roja), identidad
> (branding, naming), creación (audiovisual, publicidad, eventos) y
> digital (redes, formación en IA). ¿Cuál te interesa más?

### 8.2 Prueba de memoria

Sigue con:

```
Cuéntame más de lo primero
```

El asistente debe recordar que hablabas de reputación y desarrollar
sin necesidad de repetirlo.

### 8.3 Prueba con conocimiento propio (File Search)

Si has subido documentos, pregunta algo que solo esté ahí:

```
¿Tenéis caso de éxito con ayuntamientos?
```

Si el documento del case study estaba subido, el asistente lo cita.
Si no lo tenía, dirá que no puede confirmar cifras y ofrecerá derivar
al equipo.

### 8.4 Prueba multilingüe

Escribe:

```
Hi, what services do you offer?
```

El asistente **debe responder en inglés** (detección automática del
idioma según el System Prompt).

### 8.5 Controlar el gasto

- **OpenAI dashboard → Usage**: gasto real en tiempo real.
- **Vercel dashboard → Analytics**: número de conversaciones al día.
- **Billing alerts**: OpenAI te envía email si superas el 80% del tope.

### 8.6 Costes reales estimados

Con **`gpt-4o-mini`** (recomendado):

| Volumen mensual | Coste |
|---|---|
| 500 conversaciones (~5 mensajes cada una) | **~2 €** |
| 2000 conversaciones | **~10 €** |
| 10 000 conversaciones | **~50 €** |

Con **`gpt-4o`**:

| Volumen mensual | Coste |
|---|---|
| 500 conversaciones | **~15 €** |
| 2000 conversaciones | **~60 €** |

---

## <a id="9"></a>9 · Personalización avanzada

### 9.1 Cambiar el tono sin tocar código

Vuelve a **Assistants → tu asistente → Instructions** y edita el
System Prompt directamente en el panel de OpenAI. **Guarda**. Los
cambios están activos al instante, sin re-desplegar el backend.

### 9.2 Añadir nuevos documentos

**File Search → Vector Store → Upload files**. Al subir, el asistente
los indexa en 30-60 segundos y ya puede citarlos.

### 9.3 Function Calling · que el asistente actúe

El nivel siguiente: el asistente puede ejecutar acciones reales
(guardar un lead en Notion, avisar por Slack, agendar en un calendario)
en vez de solo hablar.

Ejemplo: función `agendarLlamada`:

1. En el asistente → **Functions → Add**.
2. Define el schema (JSON) de la función:
   ```json
   {
     "name": "agendarLlamada",
     "description": "Agenda una llamada con el usuario cuando lo pida",
     "parameters": {
       "type": "object",
       "properties": {
         "fecha":     { "type": "string", "format": "date" },
         "franja":    { "type": "string", "enum": ["mañana","tarde"] },
         "telefono":  { "type": "string" },
         "tema":      { "type": "string" }
       },
       "required": ["fecha","franja","telefono"]
     }
   }
   ```
3. En `server.js`, cuando el asistente devuelve un `run.status === "requires_action"`,
   lees los argumentos y llamas a tu API real (Notion, Google Calendar,
   Zapier…).

Es un desarrollo adicional (medio día de trabajo) pero convierte el
chat en un **captador de leads automatizado**.

### 9.4 Personalizar el widget visual

En `src/lib/assistant.ts` puedes cambiar:

- `name`: nombre visible del asistente.
- `tagline`: subtítulo bajo el nombre.
- `greeting`: mensaje de bienvenida.
- `suggestions`: los 4 chips de sugerencias iniciales.
- `disclaimer`: aviso legal al pie.

En `src/components/AIAssistant.tsx` puedes cambiar tamaños, colores y
comportamiento del panel (con Tailwind).

### 9.5 Analítica de conversaciones

Añade en `server.js` (después de generar la respuesta):

```js
await fetch("https://tu-backend-analytics/log", {
  method: "POST",
  body: JSON.stringify({
    thread: currentThreadId,
    user: lastUser.content,
    reply,
    timestamp: Date.now(),
  }),
});
```

Y desde tu backend de analytics registras qué se preguntan más
para mejorar el System Prompt cada mes.

---

## <a id="10"></a>10 · Problemas frecuentes y soluciones

| Síntoma | Causa · solución |
|---|---|
| Chat abre pero dice "modo básico" en errores | `VITE_ASSISTANT_ENDPOINT` mal apuntada o backend caído. Prueba `/api/health`. |
| CORS blocked | El dominio no coincide con `ALLOWED_ORIGIN` en Vercel. Añade `https://misterred360.es` exactamente igual. |
| Respuestas cortadas al enviar mensajes largos | Sube `max_tokens` en `server.js`. Por defecto no hay límite duro. |
| El asistente inventa cifras | Añade al System Prompt: *"Nunca inventes cifras. Si no las tienes en los documentos, dilo."* + refresca vector store. |
| El asistente no cita los documentos | Comprueba que File Search está activado y que los archivos aparecen marcados. |
| Muy lento (>10 s por respuesta) | Cold start de Vercel free. Considera Vercel Pro (20 €/mes) o Railway. |
| Se dispara el gasto | En Vercel baja `openai.chat.completions.create({...max_tokens: 300})` y en OpenAI baja el tope mensual. |
| Historial se pierde entre visitas | Es por diseño: el thread ID vive en localStorage del navegador. Si el usuario limpia caché, empieza de cero. |
| Quiero que sea multi-tenant (varios clientes con el mismo backend) | Cada cliente = un Assistant ID diferente. Puedes tener varios asistentes en la misma cuenta OpenAI. |

### Rebobinar a la última versión que funcionaba

```bash
vercel rollback
```

Elige el deployment anterior. Vuelve a estar activo en segundos.

---

## ✅ Checklist final antes de dar por bueno el sistema

- [ ] Cuenta OpenAI con tarjeta y tope mensual configurado.
- [ ] Asistente `MR360 · Asistente` creado con `gpt-4o-mini`.
- [ ] System Prompt copiado desde `system-prompt.md`.
- [ ] File Search activado y con al menos 3 documentos indexados.
- [ ] Assistant ID copiado (empieza por `asst_...`).
- [ ] API Key copiada y guardada.
- [ ] Backend desplegado en Vercel con `/api/health` respondiendo OK.
- [ ] 3 variables de entorno configuradas en Vercel.
- [ ] `.env.local` en el proyecto principal con la URL del backend.
- [ ] Web recompilada y subida a OVH.
- [ ] Prueba desde el navegador → respuesta natural en 3 s.
- [ ] Prueba de memoria (2 mensajes seguidos) → recuerda contexto.
- [ ] Prueba multilingüe → responde en el idioma del visitante.
- [ ] Prueba con dato de File Search → cita el documento correctamente.
- [ ] Alertas de gasto configuradas en OpenAI.
- [ ] Política de uso de IA (`#/politica-de-ia`) revisada y actualizada
      con la mención al asistente.

Con todos los checks marcados, el asistente está en producción,
respondiendo con la voz de la marca, apoyado en documentación real,
recordando contexto y bajo control de costes.

**Los dos agentes (WhatsApp + ChatGPT) trabajan de forma independiente
pero comparten filosofía**: filtran las conversaciones básicas y solo
escalan al equipo humano cuando merece la pena — que es exactamente
lo que hace un buen director de comunicación.
