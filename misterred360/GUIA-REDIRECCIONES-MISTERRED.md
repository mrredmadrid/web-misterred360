# Guía · Redirigir misterred.es → misterred360.es (301 permanente)

Cambio único, sencillo, sin riesgo si se hace bien. **Tiempo estimado: 15 minutos**.

## 🎯 Qué vamos a hacer

Configurar redirecciones permanentes (código HTTP 301) desde **todo el
dominio antiguo `misterred.es`** hacia el **nuevo `misterred360.es`**, de
forma que:

- Cualquier persona que teclee la URL antigua acabe en la nueva.
- Cada URL específica salte a su equivalente semántica (`/servicios` va a
  la sección de servicios, `/aviso-legal` a la política de privacidad, etc.).
- **Google transfiera automáticamente el peso SEO** del dominio antiguo al
  nuevo (esto es lo importante: 301 es la única redirección que preserva
  posicionamiento).
- El sitemap antiguo apunte al nuevo para que Google descubra las URLs.

## 📦 Archivo que vas a subir

En este proyecto ya tienes preparado el archivo:

```
deploy/redirects-misterred-es.htaccess
```

Cubre:

- **7 páginas principales** de misterred.es
- **11 páginas de servicios** de la web antigua (cada una a `/servicios` de la nueva)
- Legal (aviso legal, privacidad, cookies)
- Blog / noticias / actualidad / prensa (todos a `/insights`)
- Categorías, tags, autores de WordPress
- Feeds RSS, uploads, sitemap antiguo
- **Catch-all final**: cualquier URL no contemplada cae en la home nueva

## 🔧 Cómo instalarlo (paso a paso)

### Opción A · misterred.es está en un hosting Apache (típico en OVH, Raiola, Webempresa, SiteGround…)

Esto es lo habitual con WordPress.

1. Entra por **FTP / SFTP** al servidor donde está alojado `misterred.es`.
   Usa FileZilla o el gestor de archivos del panel del hosting.
2. Ve a la carpeta raíz del sitio (típicamente `www/`, `public_html/`
   o `httpdocs/`).
3. **Busca el archivo `.htaccess` existente** (WordPress lo crea siempre).
   - Si existe: descárgalo primero como backup local (`.htaccess.backup`).
   - Abre el original con un editor de texto.
4. **Pega el contenido de `deploy/redirects-misterred-es.htaccess` al
   principio del archivo**, antes de la sección `# BEGIN WordPress`.
   Es importante que vaya arriba: se procesan en orden.
5. Guarda y sube el archivo.

**Verificación inmediata** desde tu ordenador:

```bash
curl -I https://www.misterred.es/
# Debe devolver:
#   HTTP/1.1 301 Moved Permanently
#   Location: https://misterred360.es/

curl -I https://www.misterred.es/servicios/gabinete-de-prensa/
# Debe devolver:
#   HTTP/1.1 301 Moved Permanently
#   Location: https://misterred360.es/#/servicios
```

### Opción B · Si no tienes acceso FTP · desde el panel del hosting

La mayoría de paneles (cPanel, Plesk, Directadmin, panel OVH…) tienen un
gestor de archivos web:

1. Entra al panel del hosting con tus credenciales.
2. Busca **"Gestor de archivos"** o **"File Manager"**.
3. Navega a la raíz del dominio.
4. Edita `.htaccess` en el editor online y pega el contenido, como en
   la opción A.
5. Guarda.

### Opción C · Si misterred.es está en Nginx (menos habitual con WordPress)

Nginx no usa `.htaccess`. En su lugar hay que añadir estos bloques al
archivo de configuración del sitio (`/etc/nginx/sites-available/misterred.es`
o similar):

```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name misterred.es www.misterred.es;

    # ── Redirecciones permanentes al nuevo dominio ──
    location = /                                  { return 301 https://misterred360.es/; }
    location ~* ^/servicios/?$                    { return 301 https://misterred360.es/#/servicios; }
    location ~* ^/servicios/(.+)/?$               { return 301 https://misterred360.es/#/servicios; }
    location ~* ^/contacto/?$                     { return 301 https://misterred360.es/#/contacto; }
    location ~* ^/(sobre-nosotros|quienes-somos|nosotros)/?$ { return 301 https://misterred360.es/#/manifiesto; }
    location ~* ^/(equipo)/?$                     { return 301 https://misterred360.es/#/elenco; }
    location ~* ^/(aviso-legal|politica-de-privacidad|privacidad)/?$ { return 301 https://misterred360.es/#/politica-de-privacidad; }
    location ~* ^/(politica-de-cookies|cookies)/?$ { return 301 https://misterred360.es/#/politica-de-cookies; }
    location ~* ^/(blog|noticias|actualidad|prensa) { return 301 https://misterred360.es/#/insights; }
    location ~* ^/(category|tag|author|categoria|etiqueta|autor)/(.+) { return 301 https://misterred360.es/#/insights; }
    location ~* ^/[0-9]{4}/[0-9]{2}/         { return 301 https://misterred360.es/#/insights; }
    location = /wp-sitemap.xml                    { return 301 https://misterred360.es/sitemap.xml; }
    location = /sitemap.xml                       { return 301 https://misterred360.es/sitemap.xml; }

    # Catch-all al final
    location / { return 301 https://misterred360.es/; }
}
```

Después ejecuta:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## ✅ Después de instalar · 4 pasos que no puedes saltarte

### 1 · Verifica que las redirecciones funcionan

Prueba con al menos 5 URLs desde el navegador o con `curl -I`:

- `https://www.misterred.es/`
- `https://misterred.es/servicios/gabinete-de-prensa/`
- `https://misterred.es/contacto/`
- `https://misterred.es/aviso-legal/`
- `https://misterred.es/2024/03/una-noticia-cualquiera/` *(cualquier post
  antiguo)*

Todas deben responder con **`301`** y llegar al destino correcto.

### 2 · Google Search Console

1. Entra a **Search Console** con la propiedad de `misterred.es`.
2. Menú → **Configuración → Cambio de dirección**.
3. Selecciona `misterred360.es` como destino y confirma.
4. Google lee las redirecciones y **transfiere el peso automáticamente**
   en las siguientes semanas.
5. Envía también el nuevo sitemap:
   `https://misterred360.es/sitemap.xml` (desde la propiedad de misterred360.es).

### 3 · Google Business Profile

Si tenías ficha de Google Business Profile con `misterred.es` como sitio web:

1. Entra a `https://business.google.com/`
2. Edita la ficha.
3. Cambia el sitio web a `https://misterred360.es/`.
4. Guarda.

Sin esto, la ficha seguirá enlazando al dominio antiguo.

### 4 · Enlaces externos (opcional pero recomendado)

Los dominios importantes (LinkedIn de la empresa, X, Instagram, prensa
mencionando la web, directorios sectoriales) siguen apuntando al viejo.
Las 301 los cubren, pero **actualízalos manualmente** en tus propias
cuentas para máxima limpieza:

- Bio de LinkedIn, X, Instagram, YouTube: `misterred360.es`.
- Firma de email de todo el equipo.
- Tarjetas de visita, brochures, catálogos digitales.

## ⏱️ Cuándo notarás el efecto en Google

- **Redirecciones activas**: al instante después de guardar el `.htaccess`.
- **Google actualiza el índice**: entre 2 y 8 semanas. Puedes acelerarlo
  solicitando indexación de la nueva home en Search Console y publicando
  contenido nuevo con frecuencia en `misterred360.es`.
- **Autoridad transferida**: entre 3 y 6 meses, alcanzando el 100 % del
  peso SEO del dominio antiguo.

## ⚠️ Precauciones importantes

- **NO borres `misterred.es`** durante al menos 12 meses. Las 301 solo
  funcionan si el dominio sigue vivo y respondiendo. Renueva el dominio
  antes de que caduque.
- **NO desactives el hosting antiguo** aunque no publiques nada nuevo:
  necesita seguir sirviendo el `.htaccess` para las redirecciones.
- Si el dominio antiguo estaba en un plan de hosting caro con WordPress,
  puedes migrar a un plan **"solo redirecciones"** más barato (algunos
  registradores ofrecen redirección web incluida sin necesidad de hosting).

## 🧯 Solución rápida de problemas

| Síntoma | Solución |
| --- | --- |
| Redirect no funciona | Comprueba que `mod_rewrite` está activo en el hosting (pregunta al soporte). |
| Devuelve 302 en vez de 301 | Falta la letra `R=301`. Revisa el archivo. |
| Loop infinito de redirecciones | El `.htaccess` de WordPress está reescribiendo por encima. Coloca las reglas de este archivo **antes** de `# BEGIN WordPress`. |
| Cambio no visible en Google | Espera 48h y solicita re-inspección de URLs en Search Console. |
