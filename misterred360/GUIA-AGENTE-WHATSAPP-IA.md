# MISTERRED360 · Guía completa para activar el agente de WhatsApp con IA

Configuración paso a paso del asistente automático que responderá los
WhatsApp del número corporativo con la voz de la marca, usando la
tecnología oficial de Meta (WhatsApp Business Cloud API) + OpenAI.

**Tiempo total estimado: 60-90 minutos** repartidos en dos sesiones (la
verificación de Meta tarda entre 5 minutos y 24 horas).

**Coste mensual estimado**: 2 – 55 € según volumen (ver punto 8).

---

## 📋 Índice

1. [Antes de empezar · qué necesitas tener a mano](#1)
2. [Alta en Meta Business Manager](#2)
3. [Configurar el número de WhatsApp Business](#3)
4. [Crear el System User y obtener el token permanente](#4)
5. [Crear la cuenta de OpenAI y obtener la API key](#5)
6. [Desplegar el backend en Vercel](#6)
7. [Conectar el webhook con Meta](#7)
8. [Ajustar el tono del agente · personalizar respuestas](#8)
9. [Probar end-to-end · comprobación funcional](#9)
10. [Monitorizar, actualizar y controlar costes](#10)
11. [Problemas frecuentes y soluciones](#11)

---

## <a id="1"></a>1 · Antes de empezar · qué necesitas tener a mano

- 📱 **Número de teléfono** (idealmente el corporativo **+34 910 360 360**).
      Importante: **no debe estar usándose en la app normal de WhatsApp**.
      Si lo está, primero borra la cuenta desde la app.
- 💳 **Tarjeta de crédito** para pagar OpenAI (~5 € al mes para
      arrancar). Meta es gratis hasta 1000 conversaciones/mes.
- 📧 Cuenta de Facebook personal (Meta la exige como administrador
      inicial de la cuenta de empresa).
- 💻 Cuenta de **Vercel** o **Railway** (gratuita para este volumen).
- 🌐 Dominio verificado. En nuestro caso: `misterred360.es`.

---

## <a id="2"></a>2 · Alta en Meta Business Manager

### 2.1 Crear la cuenta

1. Ve a [**business.facebook.com**](https://business.facebook.com/).
2. Inicia sesión con tu Facebook personal.
3. Botón **"Crear cuenta"** arriba a la derecha.
4. Rellena:
   - **Nombre del negocio**: MR. RED S.L. (o MISTERRED360).
   - **Nombre y email de contacto**: los oficiales de la empresa.
5. Confirma el email desde tu bandeja de entrada.

### 2.2 Verificar el negocio (recomendado)

Meta pide verificar la empresa para desbloquear límites más altos.
Se hace desde **Configuración de negocio → Centro de seguridad →
Verificación**. Necesitas:

- Copia del CIF (B56916133).
- Recibo reciente a nombre de MR. RED S.L. (agua, luz, teléfono).
- Certificado de titularidad del dominio misterred360.es.

Meta responde en 24-72 horas. **Puedes seguir configurando el resto
mientras**: solo bloquea el paso a "producción a gran escala" (>1000
conversaciones/mes).

---

## <a id="3"></a>3 · Configurar el número de WhatsApp Business

### 3.1 Añadir el número

1. Dentro de Business Manager, ve a **Todas las herramientas → WhatsApp Manager**.
2. Botón **"Empezar"** o **"Añadir número"**.
3. Selecciona **"WhatsApp Business Platform"** (no la app).
4. Rellena:
   - Nombre a mostrar: **MISTERRED360** (aparecerá en los chats).
   - Categoría: **Servicios profesionales**.
   - Descripción breve: "Agencia de comunicación 360. Ponemos el
     alma. Medimos al milímetro."
5. Introduce el número **+34 910 360 360**.
6. Meta te llamará o enviará un SMS con un código de 6 dígitos.
   Introdúcelo para verificar.

### 3.2 Copiar los IDs (crítico)

En la vista general del número, arriba, tienes 3 datos que necesitarás:

| Campo | Ejemplo | Dónde va |
|---|---|---|
| **Phone Number ID** | `123456789012345` | `WHATSAPP_PHONE_ID` |
| **WhatsApp Business Account ID** | `987654321098765` | (opcional) |
| **App ID** | `456789012345678` | (opcional) |

Guárdalos en un documento seguro (Bitwarden, 1Password, o simplemente
una nota cifrada).

---

## <a id="4"></a>4 · Crear el System User y obtener el token permanente

Este paso es lo que **evita que el token caduque cada 24 horas** (que
sería inservible para un servicio 24/7).

### 4.1 Crear el System User

1. En Business Manager → **Configuración de negocio → Usuarios → Usuarios del sistema**.
2. Botón **"Añadir"**.
3. Nombre: `MR360 Whatsapp Bot`.
4. Rol: **Administrador**.
5. Guarda.

### 4.2 Asignar permisos sobre WhatsApp

1. Con el System User seleccionado, click en **"Añadir activos"**.
2. Elige **"WhatsApp Accounts"** → tu cuenta.
3. Marca **"Control total"**.
4. Guarda.

### 4.3 Generar el token permanente

1. Con el System User todavía seleccionado, click en **"Generar nuevo token"**.
2. Selecciona la app que creó Meta cuando activaste WhatsApp (aparece
   en el desplegable).
3. Permisos a marcar:
   - `whatsapp_business_management`
   - `whatsapp_business_messaging`
   - `business_management`
4. Duración: **Nunca caduca**.
5. **Copia el token inmediatamente** — solo se muestra una vez. Empieza
   por `EAAxxx...`. Guárdalo como `WHATSAPP_TOKEN`.

### 4.4 Obtener el App Secret (para verificar firmas)

1. En **Configuración de negocio → Apps** → selecciona la app.
2. **Ajustes → Básico**.
3. Copia el **"Clave secreta de la aplicación"** (haz click en "Mostrar").
   Guárdalo como `WHATSAPP_APP_SECRET`.

### 4.5 Elige tu propio Verify Token

Este es una cadena arbitraria que tú inventas. Sirve para el hand-shake
cuando Meta llama a tu webhook por primera vez. Ejemplo:

```
mr360_wa_verify_2026_zY7Kx9pQ
```

Guárdalo como `WHATSAPP_VERIFY_TOKEN`.

---

## <a id="5"></a>5 · Crear la cuenta de OpenAI y obtener la API key

### 5.1 Alta

1. Ve a [**platform.openai.com**](https://platform.openai.com/).
2. Regístrate con el email corporativo.
3. Verifica el número de teléfono.
4. **Billing → Add payment method** → añade la tarjeta.
5. **Billing → Usage limits**: pon un tope mensual de seguridad
   (recomendado **20 €/mes** al arrancar). Puedes subirlo cuando veas
   el volumen real.

### 5.2 Crear la API key

1. **API keys → Create new secret key**.
2. Nombre: `MR360 WhatsApp Bot`.
3. Permisos: **Restricted** → selecciona solo `model.request` sobre
   los modelos que vas a usar (gpt-4o-mini y gpt-4o).
4. **Copia la key ahora** — no se puede volver a ver. Guárdala como
   `OPENAI_API_KEY`. Empieza por `sk-proj-...`.

---

## <a id="6"></a>6 · Desplegar el backend en Vercel

El código completo ya está en tu proyecto: **`deploy/whatsapp-ai-webhook/`**.

### 6.1 Preparar la carpeta

Desde tu ordenador, en la terminal:

```bash
cd deploy/whatsapp-ai-webhook
npm install
```

### 6.2 Crear el proyecto en Vercel

Necesitas la CLI de Vercel:

```bash
npm i -g vercel
vercel login
```

Y desde la misma carpeta:

```bash
vercel
```

Preguntas del asistente:
- Set up and deploy? → **Y**
- Which scope? → tu cuenta personal o de empresa.
- Link to existing project? → **N**
- Project name → `mr360-whatsapp-ai`
- In which directory is your code? → **`./`**
- Override settings? → **N**

Cuando termine te dará una URL tipo:
`https://mr360-whatsapp-ai-abcdef.vercel.app`. **Guárdala**.

### 6.3 Añadir las variables de entorno

Desde el dashboard de Vercel → tu proyecto → **Settings → Environment
Variables**. Añade una a una:

| Variable | Valor |
|---|---|
| `WHATSAPP_TOKEN` | El token permanente del paso 4.3 |
| `WHATSAPP_PHONE_ID` | El Phone Number ID del paso 3.2 |
| `WHATSAPP_VERIFY_TOKEN` | La cadena inventada del paso 4.5 |
| `WHATSAPP_APP_SECRET` | El App Secret del paso 4.4 |
| `OPENAI_API_KEY` | La key del paso 5.2 |
| `OPENAI_MODEL` | `gpt-4o-mini` |
| `SLACK_WEBHOOK_URL` | (opcional) Ver punto 6.4 |
| `ESCALATE_EMAIL` | `misterred@misterred360.es` |

Aplica a: **Production, Preview y Development**.

### 6.4 (Opcional) Configurar Slack para escalados

Si tenéis Slack en el equipo:

1. En Slack → **Apps → Incoming Webhooks**.
2. Crear webhook para un canal (ej: `#mr360-wa-crisis`).
3. Copia la URL y ponla en `SLACK_WEBHOOK_URL`.

Cuando alguien escriba palabras como "crisis", "urgente" o "prensa", el
bot **notifica al canal** con el mensaje completo para que un humano
tome el relevo.

### 6.5 Re-desplegar con las variables

```bash
vercel --prod
```

Prueba que el servidor responde:

```bash
curl https://mr360-whatsapp-ai-abcdef.vercel.app/api/health
# → {"ok":true,"service":"mr360-whatsapp-ai"}
```

Si ves ese JSON, el backend está vivo.

---

## <a id="7"></a>7 · Conectar el webhook con Meta

### 7.1 Registrar la URL en Meta

1. Vuelve a **WhatsApp Manager** → tu número → **Configuración → Webhooks**.
2. Botón **"Editar"** o **"Configurar webhook"**.
3. **URL de devolución de llamada**:
   ```
   https://mr360-whatsapp-ai-abcdef.vercel.app/api/webhook
   ```
   (Cambia el subdominio por el tuyo real.)
4. **Token de verificación**: el `WHATSAPP_VERIFY_TOKEN` del paso 4.5.
5. Click **Verificar y guardar**.

Meta hace un GET a tu URL para comprobar el token. Si todo va bien,
el estado pasa a **✅ Suscrito**.

### 7.2 Suscribir los eventos

Debajo, marca la casilla del evento **`messages`** y guarda. Solo eso:
no necesitas suscribirte a más eventos.

---

## <a id="8"></a>8 · Ajustar el tono del agente · personalizar respuestas

El "cerebro" del bot está en `deploy/whatsapp-ai-webhook/server.js`, en
la constante **`SYSTEM_PROMPT`**. Es un texto de ~40 líneas que le dice
a la IA cómo comportarse.

### 8.1 Qué ya viene incluido

- Firma verbal *"Ponemos el alma. Medimos al milímetro."*
- 5 reglas innegociables (frases cortas, cero jerga, no inventar
  precios, no inventar datos, no responder fuera del alcance).
- Los 5 territorios de servicios (Reputación, Estrategia, Identidad,
  Creación, Digital).
- Los 3 canales de contacto (formulario, agendar llamada, email/tel).
- Escalado automático si detecta palabras: `crisis`, `urgente`, `medio`,
  `prensa`, `juicio`, `denuncia`, `escándalo`, `boicot`, `presupuesto`.
- Longitud objetivo: 2-4 frases por respuesta.

### 8.2 Cómo personalizarlo

Abre `server.js`, encuentra `const SYSTEM_PROMPT = \`...\`` y edita el
texto entre las comillas invertidas. Ejemplos de ajustes útiles:

- **Añadir sectores** que dominas: "Trabajamos especialmente para
  ayuntamientos, fondos de inversión de impacto y campañas electorales".
- **Enseñar el nombre del portavoz humano**: "Si preguntan por una
  persona concreta, el interlocutor principal es {Nombre}, DIRCOM".
- **Añadir promociones puntuales**: "Este trimestre regalamos la
  auditoría roja al firmar plan anual".
- **Eliminar temas que no queréis tratar**: "No respondas nunca sobre
  precios de la competencia, ni valoraciones de otras agencias".

Después de editar, re-despliega:

```bash
vercel --prod
```

Los cambios están activos en segundos.

### 8.3 Palabras clave de escalado

Están en la constante `KEYWORDS` (línea ~150 de `server.js`). Añade o
quita palabras según lo que os importa detectar en primera instancia.

---

## <a id="9"></a>9 · Probar end-to-end · comprobación funcional

### 9.1 Prueba básica

Desde tu WhatsApp personal, envía al **+34 910 360 360**:

```
Hola, ¿qué servicios ofrecéis?
```

**Debe responder en 2-5 segundos** con un texto natural, corto y con la
firma de la marca. Ejemplo esperado:

> ¡Hola! Trabajamos cinco territorios: reputación, estrategia, identidad,
> creación y digital. Cuéntanos brevemente qué necesitas y te oriento.
> Si prefieres una llamada, elige día y franja: misterred360.es/agendar

### 9.2 Prueba de escalado

Envía:

```
Tenemos una crisis, necesitamos comunicación urgente
```

**Comprobación**:
1. El bot responde algo tipo *"Es exactamente para lo que existe
   nuestro protocolo Crisis 72h... alguien del equipo se pone contigo
   en 15 minutos"*.
2. Si tienes Slack configurado, aparece una alerta en `#mr360-wa-crisis`
   con el mensaje del usuario y la respuesta del bot.

### 9.3 Prueba de contexto

Envía dos mensajes seguidos:

```
Necesito un gabinete de prensa
```

```
¿Cuánto cuesta?
```

**El bot debe recordar** que hablabais de gabinete de prensa. Si no lo
recuerda, revisa que `SYSTEM_PROMPT` no esté cortado y que el TTL de
conversaciones sea > 0.

---

## <a id="10"></a>10 · Monitorizar, actualizar y controlar costes

### 10.1 Panel de Vercel

- **Deployments**: cada `vercel --prod` genera uno nuevo. Puedes
  rebobinar a cualquier versión anterior en 1 click.
- **Logs**: pestaña "Logs" muestra en tiempo real los errores del bot.
- **Analytics**: número de peticiones al webhook por día.

### 10.2 Panel de OpenAI

- **Usage**: gasto real en tiempo real, con desglose por modelo.
- **Alerts**: te llegan email si superas el 80% del tope mensual.
- **Rate limits**: por defecto 500 requests/minuto, sobra para
  cualquier volumen razonable.

### 10.3 Panel de Meta

- **WhatsApp Manager → Insights**: mensajes enviados/recibidos, tiempo
  medio de respuesta, tasa de entrega.
- **Facturación**: los primeros 1000 conversaciones/mes iniciadas por
  usuario son gratis; después ~0,03 € por conversación.

### 10.4 Costes reales estimados

| Volumen | Meta | OpenAI (gpt-4o-mini) | Total |
|---|---|---|---|
| 100 conv./mes | Gratis | ~2 € | **~2 €** |
| 500 conv./mes | Gratis | ~10 € | **~10 €** |
| 2000 conv./mes | ~15 € | ~40 € | **~55 €** |
| 10 000 conv./mes | ~200 € | ~200 € | **~400 €** |

### 10.5 Cuándo pasar a `gpt-4o` (más caro, mejor calidad)

- Si los clientes se quejan de que "el bot suena raro" o inventa cosas.
- Si tenéis pocos mensajes pero muy exigentes (ej: crisis institucional).
- Coste: ~3-4x más que `gpt-4o-mini`. Vale la pena solo cuando la
  calidad marque diferencia comercial real.

Se cambia poniendo `OPENAI_MODEL=gpt-4o` en Vercel y re-desplegando.

---

## <a id="11"></a>11 · Problemas frecuentes y soluciones

| Síntoma | Causa · solución |
|---|---|
| El bot no responde a nada | Ve a Logs de Vercel. Suele ser `OPENAI_API_KEY` mal copiada, o límite de gasto agotado. |
| Meta dice "Failed to verify webhook" | El `WHATSAPP_VERIFY_TOKEN` de Vercel y el que pusiste en Meta no coinciden. |
| El bot recibe pero no envía respuesta | `WHATSAPP_TOKEN` caducado o sin permiso `whatsapp_business_messaging`. Vuelve al paso 4.3. |
| Respuestas muy lentas (>10 s) | Vercel free tira de cold-start. Considera el plan Pro (20 €/mes) o migra a Railway. |
| El bot inventa precios | Refuerza en `SYSTEM_PROMPT`: *"Nunca menciones cifras. Si preguntan, redirige a agendar."* |
| Coste OpenAI se dispara | Sube el rate limit por usuario en `checkRate()` (línea ~85 de `server.js`). Baja de 20 a 10 msg/hora. |
| Escalado no llega a Slack | Prueba el webhook con `curl -X POST -d '{"text":"test"}' $SLACK_WEBHOOK_URL`. |
| Mensajes de firma "Enviado desde WhatsApp" que estropean el prompt | Ya vienen filtrados en `server.js`: el bot solo lee `message.text.body`, no metadatos. |

### Rebobinar a la última versión que funcionaba

```bash
vercel rollback
```

Elige el deployment anterior de la lista. Vuelve a estar activo en
segundos.

---

## ✅ Checklist final antes de dar por bueno el sistema

- [ ] Business Manager verificado (o en proceso).
- [ ] Número +34 910 360 360 dado de alta como WhatsApp Business Platform.
- [ ] Phone Number ID copiado.
- [ ] System User con token permanente generado y guardado.
- [ ] App Secret copiado.
- [ ] Verify Token inventado y guardado en los dos lados.
- [ ] Cuenta OpenAI con tarjeta y tope mensual.
- [ ] API key generada y guardada.
- [ ] Backend desplegado en Vercel con `/api/health` respondiendo OK.
- [ ] Webhook registrado en Meta y suscrito al evento `messages`.
- [ ] Prueba básica desde WhatsApp personal → respuesta natural en 5 s.
- [ ] Prueba de escalado → notificación en Slack/email.
- [ ] SYSTEM_PROMPT ajustado con matices de la agencia.
- [ ] Documentado el flujo para que otro miembro del equipo pueda tocarlo.

Si tienes todos los checks, el sistema está listo para producción y
tu equipo humano puede centrarse solo en las conversaciones importantes.
