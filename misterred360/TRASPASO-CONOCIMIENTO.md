# Traspaso de conocimiento — proyecto misterred360.es

_23 sept 2026_

## Qué es este proyecto

misterred360.es es la web de MISTERRED360 (agencia de comunicación 360 en Madrid): una SPA (single-page app) hecha a medida, sin WordPress ni plantillas, con panel de edición de contenidos propio.

### Stack técnico

| Pieza | Tecnología |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Estilos | Tailwind CSS 4 |
| Animaciones | Framer Motion |
| Enrutado | Router propio por rutas reales (`/servicios`, `/partners`...), sin librería externa |
| Contenido | Archivos JSON en `src/content/` (uno por sección/página), editables a mano o desde el CMS |
| CMS | Decap CMS (gratuito, open source) en `/admin`, autenticado con GitHub |
| SEO | Cada ruta se "prerenderiza" a HTML real en el build (Playwright sin cabeza) para que Google y las IA la lean sin ejecutar JavaScript |
| Hosting | Alojamiento compartido OVH, subida por FTP |
| Despliegue | GitHub Actions: cada push a `main` que toque `misterred360/` compila y sube sola la web a OVH |
| App nativa (opcional) | Capacitor (Android/iOS) envuelve la misma web, ver `GUIA-APP-NATIVA.md` |

No hay backend propio ni base de datos: todo el contenido vive como archivos de texto en el propio repositorio de GitHub.

## Dónde vive todo (cuentas y accesos)

Claude nunca ha tenido ni visto contraseñas, tokens ni secrets reales — viven todos en sitios que solo controla el dueño. Esto es lo que hay que localizar y, si se migra, transferir o recrear:

| Qué | Dónde vive | Quién lo tiene |
|---|---|---|
| Código fuente completo | Repositorio GitHub `mrredmadrid/web-misterred360` | Cuenta de GitHub del dueño del repo |
| Credenciales FTP a OVH | GitHub → Settings → Secrets and variables → Actions: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` | Solo se ven/editan desde ese panel de GitHub; el valor real solo lo conoce quien las creó |
| Hosting + dominio | Panel de cliente de OVH (alojamiento compartido + dominio misterred360.es) | Cuenta OVH |
| Certificado SSL | Se gestiona automáticamente desde el panel de OVH (Let's Encrypt) | Cuenta OVH |
| Login del panel `/admin` (CMS) | OAuth de GitHub: cualquiera con acceso de escritura al repo puede entrar | Se gestiona en GitHub → colaboradores del repo |
| "Portero" del login del CMS | Cloudflare Worker `misterred360-cms-auth` (`https://misterred360-cms-auth.misterred360.workers.dev`), con sus secrets `GITHUB_CLIENT_ID` y `GITHUB_CLIENT_SECRET` | Cuenta de Cloudflare + la app OAuth creada en GitHub (github.com/settings/developers) |

Los pasos exactos para recrear cada pieza están en este mismo directorio: `GUIA-CMS-SETUP.md`, `GUIA-CI-DEPLOY.md` y `GUIA-DESPLIEGUE-OVH.md`.

## Arquitectura y estructura de carpetas

La web vive dentro de la carpeta `misterred360/` del repositorio. El workflow de despliegue está en la raíz del repo (`.github/workflows/deploy.yml`), no dentro de `misterred360/`.

| Carpeta / archivo | Qué contiene |
|---|---|
| `src/pages/` | Una página por ruta (`ServiciosPage.tsx`, `PartnersPage.tsx`, `ContactPage.tsx`...) |
| `src/components/` | Piezas reutilizables (`Nav.tsx`, `Hero.tsx`, `Testimonials.tsx`, `ClientsCarousel.tsx`, `Lightbox.tsx`...) |
| `src/content/*.json` | El texto e imágenes de cada sección (y `src/content/posts/` para el blog) — esto es lo que edita el CMS |
| `src/lib/data.ts` | Convierte cada JSON de `content/` en los datos que usan los componentes (traducciones ES/EN, iconos...) |
| `public/images/` | Todas las fotos y logos de la web |
| `public/admin/config.yml` | Define qué campos ve el panel CMS y a qué archivo JSON escribe cada uno |
| `public/.htaccess` | Reglas del servidor: fuerza HTTPS, quita el www, activa compresión y cabeceras de seguridad |
| `scripts/prerender.mjs` | Genera el HTML estático de cada ruta para SEO durante el build |
| `cms-oauth-worker/` | El "portero" de login del CMS (Cloudflare Worker), independiente de la web |
| `../.github/workflows/deploy.yml` | La receta que GitHub sigue para compilar y publicar en cada push a `main` |
| `dist/` | Carpeta generada por `npm run build` — es literalmente lo que se sube al servidor; nunca se edita a mano |

Comandos básicos (dentro de `misterred360/`):

```bash
npm install       # instalar dependencias, una sola vez
npm run dev       # servidor local para ver cambios en vivo
npm run build     # compila + prerenderiza + genera dist/
```

## Cómo se edita el contenido

**Desde el panel `/admin` (sin tocar código)** — entrando en <https://misterred360.es/admin> con GitHub:

- Textos de cada sección (Portada, Manifiesto, Servicios, Precios, Método, Equipo, Testimonios, Partners, Pie de página...)
- Fotos y logos (servicios, equipo, clientes, prensa, partners)
- Entradas del blog ("Perspectivas")
- SEO (título y descripción por página)
- Ajustes de diseño básicos (tamaño de letra global)

Cada guardado en el panel crea un commit real en GitHub, que dispara el despliegue automático (ver siguiente sección).

**Requiere tocar código** (y por tanto a un desarrollador o a Claude):

- Cambios de diseño, maquetación o animaciones
- Añadir secciones o componentes nuevos (como el carrusel de logos de clientes o el visor de fotos a pantalla completa)
- Cambios de comportamiento (por ejemplo, a qué URL enlaza un botón)
- Añadir nuevos campos editables al panel (hay que declararlos en `public/admin/config.yml`)

## Cómo funciona el despliegue automático

1. Alguien guarda un cambio en `/admin`, o hace push a la rama `main` con cambios dentro de `misterred360/` (los cambios fuera de esa carpeta no disparan despliegue).
2. Eso dispara el workflow **Compilar y publicar en OVH** (`.github/workflows/deploy.yml`) en GitHub Actions.
3. El workflow instala dependencias, compila la web (`npm run build`, que también genera el HTML prerenderizado de cada página) y sube la carpeta `dist/` a la carpeta `www/` de OVH por FTP usando los tres secrets `FTP_SERVER`, `FTP_USERNAME` y `FTP_PASSWORD`.
4. Con `dangerous-clean-slate: false`, el despliegue nunca borra nada del servidor que no venga del build — solo sube y actualiza.
5. En unos 3-5 minutos el cambio está en vivo en misterred360.es, sin que nadie tenga que compilar ni subir nada a mano.

Se puede volver a lanzar manualmente en cualquier momento desde GitHub → pestaña **Actions** → el workflow → **Run workflow**.

> **Ojo:** la acción de FTP guarda en el servidor un archivo `.ftp-deploy-sync-state.json` con lo que ya subió, y en cada ejecución solo sube lo que ha cambiado respecto a ese registro. Si alguna vez se borra algo del servidor por error, relanzar el workflow **no** lo repone por sí solo: primero hay que borrar ese archivo de estado en `www/` (por FTP o desde el panel de OVH) y después relanzar, para que vuelva a subirlo todo desde cero.

## Historial resumido del proyecto

**Fase 1 — Contenido y diseño base.** Rediseño completo de Portada, Manifiesto, Qué Hacemos, Método, Servicios, Equipo y Partners; simplificación del contacto por WhatsApp; corrección de un bug de separación de palabras (hyphenation) en CSS.

**Fase 2 — Infraestructura de contenido y publicación.** Extracción de todo el texto e imágenes a `src/content/*.json`; instalación del panel Decap CMS en `/admin`; Cloudflare Worker como "portero" de login OAuth; GitHub Actions para compilar y publicar solo en cada push a `main`; cambio de rutas hash a rutas reales; `.htaccess` para URLs limpias; prerenderizado con Playwright para SEO; sitemap dinámico; datos estructurados (JSON-LD) sincronizados con el CMS.

**Fase 3 — Mejoras iterativas.**

- Efecto "máquina de escribir" en el titular de la Portada.
- Visor de fotos a pantalla completa (lightbox) en toda la web.
- Ajustes visuales en Servicios (eslogan de Gabinete de Prensa y bloque de Agentes IA en rojo/negrita).
- Filas de logos de prensa en Gabinete de Prensa, con enlace a la noticia real.
- Página Partners: corrección de un titular cortado y sección de logos de empresas colaboradoras.
- Navegación: botón "¿Hablamos?" a contacto + icono de WhatsApp independiente.
- Carrusel de logos de clientes (Portada y Partners), con scroll infinito.
- Fotos reales en Testimonios (antes era una imagen decorativa fija) — incluyó corregir un bug real de animación que impedía que se llegara a ver.
- Favicon actualizado (primero a PNG, después a SVG: `public/images/favicon-mr-red.svg`).
- Auditoría e informe de fotos duplicadas en el contenido (documento aparte).

## Checklist para trasladar a una cuenta profesional

- [ ] **GitHub:** decidir si la cuenta profesional se añade como colaboradora del repo `mrredmadrid/web-misterred360`, o si el repo se transfiere por completo a la organización/cuenta nueva (GitHub → Settings → Transfer ownership).
- [ ] **Secrets de despliegue:** si cambia el repositorio o la cuenta, volver a crear `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` en Settings → Secrets and variables → Actions del repo de destino.
- [ ] **OVH:** comprobar quién es el titular de la cuenta de hosting y del dominio misterred360.es; si se traslada a una cuenta profesional de OVH, seguir su proceso de transferencia (no es lo mismo que cambiar credenciales FTP).
- [ ] **Cloudflare Worker (`misterred360-cms-auth`):** si migra de cuenta de Cloudflare, volver a desplegarlo (`wrangler deploy` desde `cms-oauth-worker/`) en la nueva cuenta y volver a poner sus secrets (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`) — pasos completos en `GUIA-CMS-SETUP.md`. La URL del Worker cambiará (`*.workers.dev` incluye el subdominio de la cuenta).
- [ ] **App OAuth de GitHub** (github.com/settings/developers): si cambia el Worker de URL, actualizar su "Authorization callback URL" y, si aplica, regenerar el Client Secret.
- [ ] **`public/admin/config.yml`:** confirmar que `backend.repo` sigue apuntando al repositorio correcto y que `backend.base_url` apunta a la URL actual del Worker tras cualquier traspaso.
- [ ] **Accesos de email/DNS del dominio**, si también se trasladan.
- [ ] **Guardar una copia** de este documento y de las guías `GUIA-*.md` del repositorio — son la referencia completa para quien se haga cargo.
