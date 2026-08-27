# MISTERRED360 · Cómo se indexa la web (SEO técnico)

Resumen de lo que cambió para que Google y los buscadores de IA
(ChatGPT, Gemini, Perplexity, Claude...) puedan leer e indexar
correctamente **todas** las páginas de la web, no solo la portada.

## El problema que había

La web es una aplicación de una sola página (SPA): antes, todas las
secciones (`/servicios`, `/metodo`, cada noticia...) eran en
realidad la misma página, con la parte de después de `#` cambiando
el contenido solo en el navegador del visitante. Para Google esto
ya daba problemas de indexación; para los rastreadores de IA era
directamente invisible, porque la mayoría **no ejecuta JavaScript**:
solo leen el HTML tal cual llega del servidor, y ese HTML no tenía
casi nada escrito dentro.

## Qué se ha hecho

1. **Rutas reales.** `/servicios`, `/metodo`, `/insights/una-noticia`...
   ahora son URLs de verdad (antes eran `/#/servicios`, etc.). Cada
   una tiene su propia dirección, se puede compartir y enlazar
   directamente.

2. **Prerenderizado.** En cada `npm run build` (o sea, en cada
   despliegue automático), un script (`scripts/prerender.mjs`) abre
   la web con un navegador invisible, visita cada página real, deja
   que termine de cargar el contenido y **guarda ese HTML ya
   completo** como archivo estático (`servicios.html`,
   `insights/una-noticia.html`...). Así, cualquier rastreador —
   ejecute JavaScript o no — recibe la página ya escrita, con su
   título, su texto y sus datos SEO correctos.

3. **Sirve el archivo correcto sin que se note.** El archivo
   `.htaccess` hace que `/servicios` sirva automáticamente
   `servicios.html` sin que la URL cambie ni haga falta ninguna
   redirección. Si alguien visita una ruta que no existe, cae de
   forma segura a la portada.

4. **Sitemap siempre al día.** `sitemap.xml` se regenera solo en
   cada build, leyendo las noticias reales que haya en ese momento
   en `src/content/posts/` — si publicas una noticia nueva desde
   `/admin`, aparece sola en el sitemap la próxima vez que se
   despliegue.

5. **SEO editable desde el panel.** Cada página tiene ahora su
   propio título y descripción para buscadores, editables en
   `/admin` → "Páginas y secciones" → "SEO por página" — sin tocar
   código.

6. **Ficha de empresa sincronizada.** El teléfono y el email que
   ven Google y las IA en los datos estructurados (`schema.org`) se
   toman del mismo sitio que edita "Marca, footer y contacto" en el
   panel, para que nunca queden desincronizados con lo que se ve en
   la web.

## Lo que queda pendiente (menor)

- La versión en inglés (`?lang=en`) todavía no se sirve realmente en
  esa URL — el selector de idioma sigue funcionando para el
  visitante, pero un rastreador que visite `?lang=en` vería el mismo
  contenido en español. Arreglarlo del todo implicaría prerenderizar
  también cada página en inglés; no es urgente porque el negocio es
  local (España), pero es una mejora pendiente si algún día se quiere
  atacar también el mercado angloparlante en buscadores.
