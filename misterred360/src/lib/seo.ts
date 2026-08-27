import { useEffect } from "react";

/* ───────────────────────────────────────────────────────────
   SEO por página · MISTERRED360
   Gestiona título, meta description, canonical, OG, Twitter,
   hreflang y datos estructurados JSON-LD por vista.
   Todas las etiquetas se restauran al desmontar la página.
   ─────────────────────────────────────────────────────────── */

export const SITE = "https://misterred360.es";
export const DEFAULT_TITLE =
  "Agencia de Comunicación y Marketing 360 en Madrid | MISTERRED360";
export const DEFAULT_DESC =
  "MISTERRED360, agencia de comunicación estratégica en Madrid: gabinete de prensa, imagen corporativa, audiovisual, publicidad, RRPP y estudios de mercado.";
export const DEFAULT_OG_IMAGE = `${SITE}/images/chimp-hero.jpg`;

export interface PageSeoOptions {
  title: string;
  description: string;
  /** Ruta relativa desde la raíz. Ej: "/servicios" */
  path?: string;
  /** URL de la imagen OG (absoluta). Por defecto, hero del chimpancé. */
  ogImage?: string;
  /** Type OG (website | article). Por defecto: website */
  ogType?: "website" | "article";
  /** Migas de pan para el schema BreadcrumbList */
  breadcrumbs?: { name: string; path: string }[];
  /** JSON-LD extra (Service, HowTo, FAQPage, BlogPosting…). Un objeto o array. */
  jsonLd?: object | object[];
  /** noindex si se desea excluir la página de buscadores */
  noindex?: boolean;
}

function upsertMeta(
  selector: string,
  attr: "name" | "property",
  key: string,
  value: string
) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
  return el;
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const sel = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;
  let el = document.head.querySelector<HTMLLinkElement>(sel);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (hreflang) el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  return el;
}

export function usePageSeo(
  titleOrOpts: string | PageSeoOptions,
  descriptionArg?: string
) {
  /* Compatibilidad con la firma antigua: usePageSeo(title, desc) */
  const opts: PageSeoOptions =
    typeof titleOrOpts === "string"
      ? { title: titleOrOpts, description: descriptionArg ?? DEFAULT_DESC }
      : titleOrOpts;

  useEffect(() => {
    const path = opts.path ?? window.location.pathname + window.location.hash;
    const url = `${SITE}${path}`;
    const image = opts.ogImage ?? DEFAULT_OG_IMAGE;
    const type = opts.ogType ?? "website";

    /* ── Snapshot para restaurar al desmontar ── */
    const prevTitle = document.title;
    const descMeta = document.head.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    const prevDesc = descMeta?.getAttribute("content") ?? "";
    const prevCanonical = document.head
      .querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.getAttribute("href");

    /* ── Título y descripción ── */
    document.title = opts.title;
    upsertMeta('meta[name="description"]', "name", "description", opts.description);

    /* ── Robots ── */
    upsertMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      opts.noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    /* ── Canonical + hreflang ES/EN ── */
    upsertLink("canonical", url);
    upsertLink("alternate", url, "es");
    upsertLink("alternate", `${url}${url.includes("?") ? "&" : "?"}lang=en`, "en");
    upsertLink("alternate", url, "x-default");

    /* ── Open Graph ── */
    upsertMeta('meta[property="og:type"]', "property", "og:type", type);
    upsertMeta('meta[property="og:locale"]', "property", "og:locale", "es_ES");
    upsertMeta(
      'meta[property="og:site_name"]',
      "property",
      "og:site_name",
      "MISTERRED360"
    );
    upsertMeta('meta[property="og:url"]', "property", "og:url", url);
    upsertMeta('meta[property="og:title"]', "property", "og:title", opts.title);
    upsertMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      opts.description
    );
    upsertMeta('meta[property="og:image"]', "property", "og:image", image);

    /* ── Twitter Card ── */
    upsertMeta(
      'meta[name="twitter:card"]',
      "name",
      "twitter:card",
      "summary_large_image"
    );
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", opts.title);
    upsertMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      opts.description
    );
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", image);

    /* ── JSON-LD específico de la página ── */
    const scripts: HTMLScriptElement[] = [];

    /* WebPage siempre presente */
    const webPage: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: opts.title,
      description: opts.description,
      inLanguage: "es-ES",
      isPartOf: { "@id": `${SITE}/#web` },
      primaryImageOfPage: { "@type": "ImageObject", url: image },
      about: { "@id": `${SITE}/#agencia` },
      publisher: { "@id": `${SITE}/#organizacion` },
    };
    if (opts.breadcrumbs?.length) {
      webPage.breadcrumb = { "@id": `${url}#breadcrumbs` };
    }

    const webPageScript = document.createElement("script");
    webPageScript.type = "application/ld+json";
    webPageScript.setAttribute("data-page-seo", "webpage");
    webPageScript.textContent = JSON.stringify(webPage);
    document.head.appendChild(webPageScript);
    scripts.push(webPageScript);

    /* BreadcrumbList */
    if (opts.breadcrumbs?.length) {
      const breadcrumbScript = document.createElement("script");
      breadcrumbScript.type = "application/ld+json";
      breadcrumbScript.setAttribute("data-page-seo", "breadcrumb");
      breadcrumbScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: opts.breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: `${SITE}${b.path}`,
        })),
      });
      document.head.appendChild(breadcrumbScript);
      scripts.push(breadcrumbScript);
    }

    /* JSON-LD extra (schemas específicos de la página) */
    if (opts.jsonLd) {
      const items = Array.isArray(opts.jsonLd) ? opts.jsonLd : [opts.jsonLd];
      items.forEach((item, i) => {
        const s = document.createElement("script");
        s.type = "application/ld+json";
        s.setAttribute("data-page-seo", `extra-${i}`);
        s.textContent = JSON.stringify(item);
        document.head.appendChild(s);
        scripts.push(s);
      });
    }

    /* ── Cleanup al desmontar la página ── */
    return () => {
      document.title = prevTitle;
      if (descMeta) descMeta.setAttribute("content", prevDesc);
      if (prevCanonical) {
        document.head
          .querySelector<HTMLLinkElement>('link[rel="canonical"]')
          ?.setAttribute("href", prevCanonical);
      }
      scripts.forEach((s) => s.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    opts.title,
    opts.description,
    opts.path,
    opts.ogImage,
    opts.ogType,
    opts.noindex,
    JSON.stringify(opts.breadcrumbs),
    JSON.stringify(opts.jsonLd),
  ]);
}
