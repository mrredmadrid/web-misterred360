# MISTERRED360 · Guía de instalación en un servidor OVH

Guía paso a paso para publicar la web en **misterred360.es** con OVHcloud.
Dos caminos: **hosting compartido** (el más sencillo, recomendado para empezar)
y **VPS** (Nginx + control total).

> **Dato clave:** la web usa rutas hash (`#/servicios`, `#/insights/...`), así que
> **no necesita configuración especial del servidor**: con servir la carpeta
> `dist/` es suficiente. El `.htaccess` incluido solo añade HTTPS, compresión,
> caché y seguridad.

---

## 0 · Qué se publica exactamente

| Qué | Dónde |
| --- | --- |
| Web compilada | carpeta `dist/` (generada con `npm run build`) |
| Configuración Apache | `public/.htaccess` (Vite la copia dentro de `dist/` automáticamente) |
| Configuración Nginx (solo VPS) | `deploy/nginx-misterred360.conf` |
| Script de publicación (solo VPS) | `deploy/deploy-vps.sh` |

Compila siempre antes de subir:

```bash
npm install     # solo la primera vez
npm run build   # genera dist/
```

`dist/` contiene `index.html`, la carpeta `images/`, `robots.txt`,
`sitemap.xml` y `.htaccess`. **Ese contenido entero es tu web.**

---

## OPCIÓN A · Hosting compartido OVH (recomendado)

### A1. Contratar y vincular el dominio

1. En [ovhcloud.com/es](https://www.ovhcloud.com/es/) → **Web Cloud** → **Alojamientos web**.
2. Contrata un plan (Start 10M o superior; el dominio `.es` suele incluirse el primer año).
3. Durante el alta, indica el dominio **misterred360.es**.
   - Si el dominio ya es tuyo en OVH: selecciónalo y acepta el cambio de configuración.
   - Si está en otro registrador: apunta sus DNS a los servidores de OVH
     (`dns10.ovh.net` / `ns10.ovh.net` y `dns11.ovh.net` / `ns11.ovh.net`)
     o cambia los nameservers en tu registrador actual.
4. En el panel del alojamiento → pestaña **Multisitio** → comprueba que
   `misterred360.es` apunta a la carpeta **`www`**. Márcalo como dominio principal.

### A2. Activar el certificado SSL (gratis)

1. Panel del alojamiento → pestaña **Información** → apartado **SSL**.
2. Pulsa **Regenerar el certificado SSL** → OVH emite un Let's Encrypt en unos minutos.
3. Comprueba después que `https://misterred360.es` carga con el candado.

### A3. Crear el acceso FTP

1. Pestaña **FTP - SSH** → **Añadir una cuenta FTP** (o usa `admin` + la contraseña
   que definiste en el alta).
2. Anota: usuario, contraseña y servidor (`ftp.cluster0XX.hosting.ovh.net`).

### A4. Subir la web con FileZilla

1. Descarga [FileZilla Client](https://filezilla-project.org/) y abre el
   **Administrador de sitios** → **Nuevo sitio**.
2. Rellena:
   | Campo | Valor |
   | --- | --- |
   | Protocolo | FTP (los planes Pro permiten SFTP) |
   | Servidor | `ftp.cluster0XX.hosting.ovh.net` (el tuyo) |
   | Puerto | 21 |
   | Usuario / Contraseña | los del paso A3 |
3. Conecta. A la derecha verás el servidor: entra en la carpeta **`www/`**.
4. A la izquierda, navega hasta tu proyecto y entra en **`dist/`**.
5. Selecciona **todo el contenido de `dist/`** (no la carpeta en sí) y arrástralo
   dentro de `www/`:

   ```
   www/
   ├── index.html      ← la web
   ├── .htaccess       ← HTTPS + caché + seguridad
   ├── robots.txt
   ├── sitemap.xml
   └── images/         ← las 10 imágenes del chimpancé
   ```

6. Si `www/` tenía archivos de ejemplo de OVH (tipo `index.html` de bienvenida),
   **bórralos antes** para evitar conflictos.

### A5. Verificar

- `https://misterred360.es` muestra la web.
- `https://www.misterred360.es` redirige al dominio sin www.
- `http://misterred360.es` salta a HTTPS.
- `https://misterred360.es/robots.txt` y `/sitemap.xml` responden.

---

## OPCIÓN B · VPS OVH (Nginx + Let's Encrypt)

Para tener control total (mejor rendimiento, logs, escalado).

### B1. Provisionar el VPS

1. **Web Cloud** → **Servidores VPS** → plan Starter o Value (2 vCore / 2 GB sobra).
2. Distribución: **Ubuntu 24.04**. Anota la IP pública y la contraseña root
   (te llega por email).

### B2. Preparar el servidor (por SSH)

```bash
ssh root@TU_IP_VPS

# Nginx y Certbot
apt update && apt upgrade -y
apt install -y nginx certbot python3-certbot-nginx

# Carpeta de la web
mkdir -p /var/www/misterred360
```

### B3. Configurar Nginx

Sube la configuración incluida en el proyecto (o pega su contenido):

```bash
# Desde tu equipo local:
scp deploy/nginx-misterred360.conf root@TU_IP_VPS:/etc/nginx/sites-available/misterred360.es

# En el servidor:
ln -s /etc/nginx/sites-available/misterred360.es /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### B4. Apuntar el dominio a la IP del VPS

En el panel OVH → dominio **misterred360.es** → **Zona DNS** → crea/edita:

| Tipo | Nombre | Valor |
| --- | --- | --- |
| A | `@` | `TU_IP_VPS` |
| CNAME | `www` | `misterred360.es.` |

Espera la propagación (minutos–horas) y comprueba con `ping misterred360.es`.

### B5. Certificado SSL gratuito

```bash
certbot --nginx -d misterred360.es -d www.misterred360.es
# Responde a las preguntas; Certbot reescribe la config con el bloque 443
# y deja la renovación automática instalada (certbot renew --dry-run)
```

### B6. Publicar la web

Edita `deploy/deploy-vps.sh` (usuario e IP), da permisos y ejecútalo:

```bash
chmod +x deploy/deploy-vps.sh
./deploy/deploy-vps.sh
```

El script compila en local (`npm run build`) y sincroniza `dist/` con
`/var/www/misterred360` mediante rsync. Primera vez y siempre: el mismo comando.

---

## 1 · Cómo se actualiza la web después

El flujo es siempre el mismo, da igual la opción elegida:

1. **Edita el contenido** (noticias → `src/lib/insights.ts`, ver `GUIA-INSIGHTS.md`).
2. **Compila**: `npm run build`.
3. **Publica**:
   - Hosting compartido → vuelve a subir el contenido de `dist/` con FileZilla
     (sobrescribe; con rsync OVH: `rsync -avz dist/ admin@ftp...:www/`).
   - VPS → `./deploy/deploy-vps.sh`.

El `.htaccess`/Nginx marcan `index.html` como "sin caché", así que **los cambios
se ven al momento** sin que el navegador sirva versiones antiguas.

---

## 2 · Checklist post-instalación

- [ ] La web carga por HTTPS con candado válido.
- [ ] `www` redirige a `misterred360.es` y `http` redirige a `https`.
- [ ] Secciones y páginas funcionan: `#/servicios`, `#/manifiesto`, `#/metodo`,
      `#/elenco`, `#/insights` y cada noticia.
- [ ] `robots.txt` y `sitemap.xml` accesibles.
- [ ] **Google Search Console**: verifica el dominio (método DNS o etiqueta)
      y envía `https://misterred360.es/sitemap.xml`.
- [ ] **Google Business Profile** para posicionar "agencia de comunicación en Madrid".
- [ ] Comprobar compartición social (Open Graph): [opengraph.xyz](https://www.opengraph.xyz/)
      con la URL de la home.
- [ ] Auditoría rápida: Lighthouse (Chrome DevTools) → objetivo 90+ en SEO y
      mejores prácticas.
- [ ] Email: crea el buzón `misterred@misterred360.es` en el panel OVH
      (pestaña **Emails** del dominio) para que el mailto: del CTA reciba correo real.

---

## 3 · Problemas frecuentes

| Síntoma | Causa / solución |
| --- | --- |
| Página en blanco al abrir | Has subido la carpeta `dist` en lugar de su **contenido** dentro de `www/`, o quedó el `index.html` de bienvenida de OVH por delante. |
| Error 500 tras subir `.htaccess` | Tu plan no permite algún módulo; borra el bloque correspondiente (normalmente `mod_headers`) y deja el resto. |
| El navegador muestra una versión antigua | Caché local: Ctrl+F5. El servidor ya sirve el HTML sin caché. |
| Las imágenes no cargan | Falta la carpeta `images/` dentro de `www/` (va dentro de `dist/`). |
| SSL no se activa | En hosting compartido, regenera el certificado (paso A2) y espera 10–15 min; en VPS, revisa que el dominio ya apunta a la IP antes de lanzar Certbot. |
| `misterred360.es` no resuelve | DNS sin propagar: revisa la zona DNS (B4) o los nameservers (A1) y espera. |

---

## 4 · Nota para el futuro (WordPress)

Si más adelante migras a WordPress + Elementor en este mismo dominio, la guía de
`sitemap.xml` incluye el patrón de URLs reales (`/insights/slug/`) para sustituirlas
por las rutas hash de esta versión.
