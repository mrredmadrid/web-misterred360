# MISTERRED360 · Checklist técnica antes de publicar

Verificación exhaustiva de indexación, structured data, coherencia NAP y
preparación para AI Overviews. Marcar en verde solo cuando la comprobación
pase 100 %. Pensada para revisarse cada vez que se despliegue una versión
nueva de la web.

Última revisión de esta plantilla: **1 de julio de 2026**.

---

## 1 · Core Web Vitals (mobile-first)

Herramienta: **PageSpeed Insights** → `https://pagespeed.web.dev/analysis?url=https://misterred360.es`.

- [ ] **LCP** (Largest Contentful Paint) ≤ 2,5 s en móvil.
      Confirmar que el `<link rel="preload">` del hero se está aplicando
      (ver Network → tipo *preload* en DevTools).
- [ ] **INP** (Interaction to Next Paint) ≤ 200 ms.
      Comprobar que ningún handler (menú, formulario, cursor personalizado)
      bloquea el hilo principal más de 50 ms.
- [ ] **CLS** (Cumulative Layout Shift) ≤ 0,1.
      Todas las `<img>` con `width` / `height` (o `aspect-ratio` CSS).
      Fuentes cargando con `font-display: swap` sin FOUT excesivo.
- [ ] **TTFB** ≤ 800 ms desde España (medir con WebPageTest).
- [ ] **Total Blocking Time** ≤ 300 ms.
- [ ] **Lighthouse PWA + Best Practices + Accesibilidad** ≥ 95.

## 2 · Rich Results Test

Herramienta: `https://search.google.com/test/rich-results` con la URL
`https://misterred360.es/`.

- [ ] Detectado **Organization** sin errores.
- [ ] Detectado **LocalBusiness / ProfessionalService** con
      dirección, teléfono, horario y coordenadas.
- [ ] Detectado **WebSite** con `SearchAction` (Sitelinks Search Box).
- [ ] Detectado **WebPage** enlazado a la Organization.
- [ ] Detectado **BreadcrumbList** válido.
- [ ] Detectado **FAQPage** con las preguntas visibles en la landing.
- [ ] En páginas de blog: **BlogPosting** con `datePublished`, `dateModified`,
      `author`, `image`.
- [ ] Validado también en `https://validator.schema.org/`.
- [ ] **Cero errores** y **cero advertencias críticas**.

## 3 · Coherencia NAP (Name · Address · Phone)

Debe ser **idéntico carácter a carácter** en:

- [ ] Schema JSON-LD `LocalBusiness` (`index.html`).
- [ ] Footer de la landing (`src/components/Contact.tsx`).
- [ ] Ficha de contacto (`src/components/ContactBlock.tsx`).
- [ ] Página `#/contacto` (`src/pages/ContactPage.tsx`).
- [ ] Footer de páginas interiores (`src/components/PageShell.tsx`).
- [ ] Ficha real de **Google Business Profile**.
- [ ] Todos los directorios externos donde aparezca la empresa
      (Páginas Amarillas, LinkedIn Company, etc.).

Datos oficiales:

```
Nombre:     MR. RED S.L.  ·  MISTERRED360
Dirección:  Ciudadela 12, 28230 Las Rozas de Madrid, España
Teléfono:   +34 910 360 360
Email:      misterred@misterred360.es
Web:        https://misterred360.es
CIF:        B56916133
Horario:    Lun–Vie · 09:00–18:00
Geo:        40.4923, -3.8735
```

## 4 · Search Console

- [ ] Propiedad **`https://misterred360.es`** verificada por DNS.
- [ ] Propiedad `https://www.misterred360.es` verificada y con **301** al dominio raíz.
- [ ] `sitemap.xml` enviado y aceptado sin errores.
- [ ] `robots.txt` accesible (`https://misterred360.es/robots.txt`).
- [ ] **Inspección de URL** de la home muestra "URL en Google" y el HTML
      renderizado incluye el contenido visible (hallazgo 1 del informe).
- [ ] Solicitada **indexación manual** de la home y de todas las páginas
      interiores tras cada despliegue mayor.
- [ ] Sin errores en el informe **Cobertura** ni en **Experiencia en la página**.
- [ ] Reporte **Mejoras → Datos estructurados** sin errores para
      Breadcrumbs, LocalBusiness, FAQPage, BlogPosting.
- [ ] Reporte **Rendimiento → Generative AI performance** monitorizado
      mensualmente (cuando esté disponible para la propiedad).

## 5 · Google Business Profile

- [ ] Ficha reclamada y verificada.
- [ ] **Categoría principal**: "Agencia de comunicación" (o la más específica).
- [ ] Al menos **3 categorías secundarias** (Agencia de publicidad,
      Consultora de marketing, Consultoría de RRPP).
- [ ] Descripción con las palabras clave objetivo (750 caracteres).
- [ ] Al menos **10 fotos**: exterior, interior, equipo, trabajo, chimpancé
      corporativo. Todas con dimensiones ≥ 720×720.
- [ ] Horario de apertura completo y actualizado.
- [ ] Publicaciones activas cada 2 semanas.
- [ ] Enlace directo a **`https://misterred360.es`** como sitio web oficial.
- [ ] Botón de acción configurado: "Reservar cita" o "Solicitar presupuesto".
- [ ] URL corta de la ficha (`https://g.page/misterred360`) enlazada
      desde la web como "Cómo llegar".
- [ ] Sistema activo de **respuesta a reseñas** en < 48 h, siempre.

## 6 · Redes sociales · `sameAs`

Confirmar que las URLs declaradas en el schema existen y están activas:

- [ ] `https://www.instagram.com/misterred360`
- [ ] `https://www.linkedin.com/company/misterred360`
- [ ] `https://x.com/misterred360`
- [ ] `https://www.youtube.com/@misterred360`

Perfil de cada red con la misma foto de marca, la misma bio y el mismo
enlace a `misterred360.es`.

## 7 · HTTPS y seguridad

- [ ] Certificado **SSL A+** en `https://www.ssllabs.com/ssltest/`.
- [ ] Sin **contenido mixto** (ningún recurso servido por HTTP).
- [ ] Cabeceras de seguridad en `.htaccess` u Nginx:
      `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
      `Referrer-Policy: strict-origin-when-cross-origin`,
      `Permissions-Policy: interest-cohort=()`.
- [ ] `301` de `www` → dominio raíz **verificado con `curl -I`**.

## 8 · Accesibilidad (WCAG 2.1 AA)

Herramienta: **Lighthouse Accessibility** + revisión manual.

- [ ] Contraste de color mínimo 4.5:1 en texto normal, 3:1 en grande.
- [ ] Navegación por teclado en toda la web (Tab, Enter, Esc funcionan).
- [ ] **Foco visible** (outline rojo definido en `index.css`).
- [ ] `alt` descriptivo en **todas** las `<img>`.
- [ ] Roles ARIA en menús, diálogos, toggles y switch (panel de cookies,
      accesibilidad y menú móvil ya los llevan).
- [ ] Skip link "Saltar al contenido" funcional al pulsar Tab.
- [ ] Panel de accesibilidad activo con tamaño de letra, alto contraste,
      dislexia, guía y máscara de lectura.
- [ ] `prefers-reduced-motion` respetado en todas las animaciones.

## 9 · AI Overviews / AI Mode / GEO-AEO

- [ ] El contenido **existe en el HTML renderizado** (verificado con
      `curl https://misterred360.es | grep "El Método"`).
- [ ] Cada página tiene autor (`author`), fecha de publicación
      (`datePublished`) y fecha de modificación (`dateModified`) donde aplica.
- [ ] Preguntas frecuentes redactadas como **pregunta directa → respuesta
      concreta en el primer párrafo** (patrón favorable a query fan-out).
- [ ] Contenido de las noticias con **experiencia real** (E-E-A-T),
      no resumen genérico que cualquier IA podría reproducir.
- [ ] Structured data alineado 1:1 con el contenido visible (verificado
      con Rich Results Test cruzando texto DOM ↔ JSON-LD).
- [ ] Cero uso de `llms.txt` (Google lo ignora) o marcado "para IA".
- [ ] Métricas de aparición en AI Overviews monitorizadas cuando Search
      Console las libere para esta propiedad.

## 10 · Migraciones y limpieza

- [ ] `misterred.es` — decidir destino:
      - Migrar contenido con valor a `misterred360.es` y **redirigir con 301
        página por página** (mapa de redirecciones en Excel).
      - O al revés, según decisión del cliente.
- [ ] Confirmar que **no hay dos dominios activos** compitiendo por las
      mismas keywords tras la migración.
- [ ] Retirar de Search Console las propiedades del dominio descontinuado
      después de 90 días con las 301 activas.

---

## Comando rápido de verificación (línea de comandos)

```bash
# ¿Se sirve el contenido en el HTML?
curl -s https://misterred360.es | grep -E "(Método Milímetro|Ponemos el alma|Cuéntanos tu reto)"

# ¿Está bien la redirección 301 de www?
curl -sI https://www.misterred360.es | grep -E "^(HTTP|Location):"

# ¿Está el sitemap?
curl -sI https://misterred360.es/sitemap.xml | head -n 1

# ¿Está el robots.txt sin bloqueos accidentales?
curl -s https://misterred360.es/robots.txt
```

Todos los comandos deben devolver respuestas válidas antes de dar la
publicación por buena.

---

**Firma técnica:** Equipo de comunicación MISTERRED360.
Uso interno · Revisión obligatoria previa a cada despliegue mayor.
