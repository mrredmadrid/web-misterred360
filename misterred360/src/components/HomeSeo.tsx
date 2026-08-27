import { faqs } from "./Faq";
import { getAllServices, getSeo } from "../lib/data";
import { useI18n } from "../lib/i18n";
import { SITE, usePageSeo } from "../lib/seo";

/* ───────────────────────────────────────────────────────────
   SEO enriquecido para la home:
   WebPage + FAQPage + ItemList de servicios + BreadcrumbList
   ─────────────────────────────────────────────────────────── */

export default function HomeSeo() {
  const { locale } = useI18n();

  const allServices = getAllServices(locale);
  const seo = getSeo(locale, "home");

  usePageSeo({
    title: seo.title,
    description: seo.description,
    path: "/",
    ogImage: `${SITE}/images/chimp-hero.jpg`,
    breadcrumbs: [{ name: "Inicio", path: "/" }],
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${SITE}/#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": `${SITE}/#servicios-lista`,
        name: "Servicios de comunicación 360",
        itemListElement: allServices.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE}/servicios#${s.id}`,
          name: s.name,
        })),
      },
    ],
  });

  return null;
}
