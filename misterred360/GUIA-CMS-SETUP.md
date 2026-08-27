# MISTERRED360 · Panel de contenidos (Decap CMS)

Guía de puesta en marcha, **una sola vez**. Después de esto, cambiar
textos o fotos es entrar en `https://misterred360.es/admin/`, editar y
guardar — sin tocar código, sin FTP.

## 0 · Cómo funciona (resumen)

- El panel `/admin/` vive dentro de la propia web (carpeta
  `public/admin/`) y lo gestiona **Decap CMS**, gratuito y de código
  abierto.
- Cuando entras, inicias sesión con tu cuenta de **GitHub** (la misma
  con la que se trabaja en este repositorio).
- Cada cambio que guardes en el panel se convierte en un commit real
  en GitHub, en la carpeta `misterred360/src/content/`.
- Como GitHub no permite que una web (JavaScript en el navegador)
  inicie sesión directamente por motivos de seguridad, hace falta un
  intermediario mínimo: un **Cloudflare Worker** (gratis) que solo se
  encarga de esa parte del login. No aloja nada de la web, solo hace
  de "portero".
- Una vez el commit llega a `main`, el GitHub Action (ver
  `GUIA-CI-DEPLOY.md`) compila la web y la sube sola a OVH. Así que
  guardar en el panel = publicado en unos minutos, sin que nadie
  tenga que hacer nada más.

Todo esto ya está programado. Solo faltan 5 pasos de configuración,
la mayoría "copiar y pegar", que **solo tú puedes hacer** porque
requieren tus propias cuentas.

---

## 1 · Instalar y entrar en Cloudflare (gratis)

1. Si no tienes cuenta, créala en [cloudflare.com](https://dash.cloudflare.com/sign-up)
   (el plan gratuito es suficiente).
2. En tu ordenador, dentro de la carpeta `cms-oauth-worker/` de este
   proyecto, ejecuta:
   ```bash
   npm install -g wrangler
   wrangler login
   ```
   Esto abre el navegador para autorizar Wrangler (la herramienta de
   línea de comandos de Cloudflare) con tu cuenta.

## 2 · Publicar el "portero" (Cloudflare Worker)

Dentro de `cms-oauth-worker/`:

```bash
wrangler deploy
```

Al terminar, te dará una URL parecida a:

```
https://misterred360-cms-auth.TU-CUENTA.workers.dev
```

**Guarda esa URL**, la necesitas en los pasos 3 y 5.

## 3 · Crear la aplicación OAuth en GitHub

1. Ve a [github.com/settings/developers](https://github.com/settings/developers)
   → pestaña **OAuth Apps** → **New OAuth App**.
2. Rellena:
   - **Application name**: `MISTERRED360 CMS`
   - **Homepage URL**: `https://misterred360.es`
   - **Authorization callback URL**: la URL del paso 2 + `/callback`,
     por ejemplo `https://misterred360-cms-auth.TU-CUENTA.workers.dev/callback`
3. Pulsa **Register application**.
4. Copia el **Client ID** que aparece.
5. Pulsa **Generate a new client secret** y cópialo también (solo se
   muestra una vez).

## 4 · Guardar esas claves en el Worker

Sin salir de `cms-oauth-worker/`:

```bash
wrangler secret put GITHUB_CLIENT_ID
# pega el Client ID del paso 3 y pulsa Enter

wrangler secret put GITHUB_CLIENT_SECRET
# pega el Client Secret del paso 3 y pulsa Enter
```

Estas claves quedan guardadas de forma segura en Cloudflare, nunca en
el código ni en GitHub.

## 5 · Apuntar el panel al Worker

Edita `misterred360/public/admin/config.yml` y sustituye esta línea:

```yaml
base_url: https://misterred360-cms-auth.YOUR-SUBDOMAIN.workers.dev
```

por tu URL real del paso 2. Guarda, haz commit y push (o pídeme a mí
que lo haga).

## 6 · Probarlo

1. Ve a `https://misterred360.es/admin/` (tras el próximo despliegue).
2. Pulsa **Login with GitHub**.
3. Autoriza la aplicación la primera vez.
4. Deberías ver el panel con las secciones: Perspectivas (blog),
   Páginas y secciones (Hero, Manifiesto, Servicios, Precios, Método
   360, Equipo, Testimonios, Marca/footer/contacto).
5. Cambia un texto de prueba, pulsa **Publish** (o "Save" según la
   vista) y comprueba que aparece un commit nuevo en GitHub.

---

## Notas importantes

- **Quién puede entrar**: cualquiera que inicie sesión con GitHub
  puede *intentar* entrar, pero solo podrá guardar cambios si esa
  cuenta tiene permiso de escritura sobre el repositorio
  `mrredmadrid/web-misterred360`. Es la propia GitHub la que bloquea
  a cualquier otra persona.
- **Alcance del acceso**: la aplicación OAuth pide permiso de tipo
  "repo" (repositorio completo), no solo sobre los archivos de
  contenido. Es una limitación de cómo funciona GitHub OAuth con este
  tipo de panel — no hay forma de limitarlo solo a `src/content/` sin
  montar algo bastante más complejo. Como el acceso ya está
  restringido a las cuentas con permiso de escritura sobre el propio
  repo, el riesgo adicional es bajo.
- **Fotos nuevas**: al subir una imagen desde el panel, se guarda en
  `misterred360/public/images/` automáticamente.
- **Coste**: 0 €. Tanto Decap CMS como el plan gratuito de Cloudflare
  Workers cubren esto de sobra para un panel de un único sitio.
