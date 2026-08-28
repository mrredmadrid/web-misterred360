#!/usr/bin/env node
/**
 * MISTERRED360 · Prerenderizado estático para SEO
 * ────────────────────────────────────────────────────────────────
 * La web es una SPA (React) que hasta ahora solo servía una
 * "cáscara" vacía en el HTML inicial: el contenido real solo
 * aparecía tras ejecutar JavaScript. Los rastreadores que no
 * ejecutan JS (la mayoría de los bots de IA: GPTBot, ClaudeBot,
 * PerplexityBot...) no veían nada.
 *
 * Este script, tras `vite build`, visita cada ruta real de la web
 * con un navegador sin cabeza (Playwright), espera a que React
 * termine de pintar el contenido y los datos SEO (título, meta,
 * JSON-LD), y guarda ese HTML ya completo como archivo estático
 * junto a index.html (p.ej. servicios.html, insights/mi-post.html).
 *
 * El archivo público/.htaccess sirve esa versión directamente para
 * la URL limpia correspondiente (/servicios → servicios.html), y
 * cae a index.html para cualquier ruta no generada aquí. El bundle
 * de React sigue siendo el mismo en todos los archivos: al cargar,
 * "toma el control" de la página con normalidad (SPA de siempre).
 *
 * También regenera sitemap.xml con las rutas reales + las noticias
 * del blog leídas de src/content/posts, para que nunca se
 * desactualice cuando se publique una noticia nueva desde /admin.
 */

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/* En algunos entornos de desarrollo el navegador de Playwright ya
   viene preinstalado en una ruta fija, con una revisión distinta a
   la que buscaría por defecto el paquete npm. Si existe, se usa esa
   ruta directamente en vez de intentar resolver/descargar otra. */
const LOCAL_CHROMIUM = "/opt/pw-browsers/chromium";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const CONTENT_POSTS = path.join(ROOT, "src/content/posts");
const SITE = "https://misterred360.es";
const PORT = 4531;

/* ── Rutas fijas de la web (fuente única, también usada para sitemap.xml) ── */
const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/manifiesto", changefreq: "monthly", priority: "0.8" },
  { path: "/servicios", changefreq: "monthly", priority: "0.9" },
  { path: "/metodo", changefreq: "monthly", priority: "0.7" },
  { path: "/agentes-ia", changefreq: "monthly", priority: "0.9" },
  { path: "/elenco", changefreq: "monthly", priority: "0.6" },
  { path: "/contacto", changefreq: "monthly", priority: "0.9" },
  { path: "/agendar", changefreq: "monthly", priority: "0.9" },
  { path: "/insights", changefreq: "weekly", priority: "0.8" },
  { path: "/politica-de-privacidad", changefreq: "yearly", priority: "0.3" },
  { path: "/politica-de-cookies", changefreq: "yearly", priority: "0.3" },
  { path: "/politica-de-ia", changefreq: "yearly", priority: "0.4" },
];

const MONTHS = {
  ene: "01", enero: "01", jan: "01", january: "01",
  feb: "02", febrero: "02", february: "02",
  mar: "03", marzo: "03", march: "03",
  abr: "04", abril: "04", apr: "04", april: "04",
  may: "05", mayo: "05",
  jun: "06", junio: "06", june: "06",
  jul: "07", julio: "07", july: "07",
  ago: "08", agosto: "08", aug: "08", august: "08",
  sep: "09", septiembre: "09", september: "09",
  oct: "10", octubre: "10", october: "10",
  nov: "11", noviembre: "11", november: "11",
  dic: "12", diciembre: "12", dec: "12", december: "12",
};
function toIsoDate(human) {
  const parts = String(human).toLowerCase().replace(/,/g, "").split(/\s+/);
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, "0");
    const month = MONTHS[parts[1]] ?? "01";
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return new Date().toISOString().slice(0, 10);
}

async function getPosts() {
  const files = (await readdir(CONTENT_POSTS)).filter((f) => f.endsWith(".json"));
  const posts = [];
  for (const f of files) {
    const raw = JSON.parse(await readFile(path.join(CONTENT_POSTS, f), "utf8"));
    posts.push({ slug: raw.slug, date: toIsoDate(raw.date) });
  }
  return posts;
}

/* ── Servidor estático mínimo: imita el comportamiento del .htaccess
   (archivo exacto → archivo.html → index.html) para que el prerender
   se comporte igual que en producción ── */
async function resolveFile(p) {
  try {
    const s = await stat(p);
    if (s.isFile()) return p;
  } catch {
    /* no existe */
  }
  return null;
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".webmanifest": "application/manifest+json",
  ".md": "text/markdown",
};

function startServer(root, port) {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      const direct = path.join(root, urlPath);
      let target =
        (await resolveFile(direct)) ??
        (await resolveFile(`${direct}.html`)) ??
        path.join(root, "index.html");
      const data = await readFile(target);
      const ext = path.extname(target);
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      res.end(data);
    } catch (err) {
      res.writeHead(500);
      res.end(String(err));
    }
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

function routeToOutFile(routePath) {
  if (routePath === "/") return path.join(DIST, "index.html");
  return path.join(DIST, `${routePath.replace(/^\//, "")}.html`);
}

/* Baja hasta el final de la página en pasos, para disparar las
   animaciones "whileInView" (Framer Motion) y que el HTML capturado
   no quede con el contenido bajo el pliegue en opacidad 0. */
async function revealByScrolling(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      const step = 700;
      let total = 0;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        total += step;
        if (total >= document.body.scrollHeight + 800) {
          clearInterval(timer);
          resolve(undefined);
        }
      }, 45);
    });
  });
  await page.evaluate(() => window.scrollTo(0, 0));
}

async function prerenderRoute(page, routePath) {
  const url = `http://localhost:${PORT}${routePath}`;
  await page.goto(url, { waitUntil: "networkidle" });
  await page
    .waitForSelector('script[data-page-seo="webpage"]', { timeout: 8000 })
    .catch(() => {});
  await revealByScrolling(page);
  await page.waitForTimeout(350);
  const html = await page.content();
  const outFile = routeToOutFile(routePath);
  await mkdir(path.dirname(outFile), { recursive: true });
  await writeFile(outFile, html);
  return outFile;
}

function buildSitemap(routes, posts) {
  const today = new Date().toISOString().slice(0, 10);
  const urlBlocks = routes
    .map(
      (r) => `  <url>
    <loc>${SITE}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${SITE}${r.path}" />
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${r.path}?lang=en" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${r.path}" />
  </url>`
    )
    .join("\n\n");
  const postBlocks = posts
    .map(
      (p) => `  <url>
    <loc>${SITE}/insights/${p.slug}</loc>
    <lastmod>${p.date}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join("\n\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${urlBlocks}

${postBlocks}
</urlset>
`;
}

/**
 * El JSON-LD estático de la Organización/LocalBusiness en index.html
 * (email y teléfono) se sincroniza aquí con src/content/site.json, el
 * mismo archivo que edita "Marca, footer y contacto" en /admin. Así
 * un cambio de teléfono desde el panel se refleja también en los
 * datos estructurados que lee Google, y no solo en el texto visible.
 * (La dirección postal estructurada, horarios y redes sociales no
 * tienen todavía un campo equivalente en el CMS, así que se quedan
 * tal cual están escritos en index.html.)
 */
async function syncNapWithSiteContent() {
  const site = JSON.parse(await readFile(path.join(ROOT, "src/content/site.json"), "utf8"));
  const indexPath = path.join(DIST, "index.html");
  const html = await readFile(indexPath, "utf8");

  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!match) return;

  let graph;
  try {
    graph = JSON.parse(match[1]);
  } catch {
    return;
  }

  const patch = (node) => {
    if (site.contact?.email) node.email = site.contact.email;
    if (site.contact?.phoneHref) node.telephone = site.contact.phoneHref;
    for (const cp of node.contactPoint ?? []) {
      if (site.contact?.email) cp.email = site.contact.email;
      if (site.contact?.phoneHref) cp.telephone = site.contact.phoneHref;
    }
  };

  for (const node of graph["@graph"] ?? []) {
    if (node["@id"] === `${SITE}/#organizacion` || node["@id"] === `${SITE}/#agencia`) {
      patch(node);
    }
  }

  const newHtml =
    html.slice(0, match.index) +
    `<script type="application/ld+json">${JSON.stringify(graph, null, 2)}</script>` +
    html.slice(match.index + match[0].length);
  await writeFile(indexPath, newHtml);
}

async function main() {
  await syncNapWithSiteContent();
  const posts = await getPosts();
  const routes = [...STATIC_ROUTES, ...posts.map((p) => ({ path: `/insights/${p.slug}` }))];

  console.log(`Prerenderizando ${routes.length} rutas (${posts.length} noticias)...`);
  const server = await startServer(DIST, PORT);
  const browser = await chromium.launch(
    existsSync(LOCAL_CHROMIUM) ? { executablePath: LOCAL_CHROMIUM } : {}
  );
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
    /* El idioma por defecto de la web es español; sin fijar esto el
       navegador headless reporta "en-US" y la app arranca en inglés
       (auto-detección por navigator.language), justo lo contrario de
       lo que debe ver Google en las URLs canónicas (sin ?lang=en). */
    locale: "es-ES",
  });

  for (const r of routes) {
    const outFile = await prerenderRoute(page, r.path);
    console.log(`  · ${r.path.padEnd(38)} → ${path.relative(DIST, outFile)}`);
  }

  await browser.close();
  await new Promise((resolve) => server.close(resolve));

  const sitemap = buildSitemap(STATIC_ROUTES, posts);
  await writeFile(path.join(DIST, "sitemap.xml"), sitemap);
  console.log("sitemap.xml regenerado con las rutas reales.");
  console.log("Prerender completo.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
