import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Kicker, LineReveal, Wordmark } from "./ui";
import { navLinks, getBrandTagline, siteContact } from "../lib/data";
import { usePageSeo } from "../lib/seo";
import type { PageSeoOptions } from "../lib/seo";
import { useCookies } from "../lib/cookies";
import { useA11y } from "../lib/accessibility";
import { useI18n } from "../lib/i18n";

/* ───────────────────────────────────────────────────────────
   PageShell · carcasa común de las páginas interiores
   Header editorial + contenido + banda CTA + footer
   ─────────────────────────────────────────────────────────── */

interface PageShellProps {
  index: string;
  /* Todos los textos aceptan una cadena literal o una clave i18n */
  kicker: string;
  title: string;
  intro: string;
  meta?: string;
  figure?: string;
  figureAlt?: string;
  seoTitle: string;
  seoDesc: string;
  /* SEO avanzado opcional */
  path?: string;
  ogImage?: string;
  ogType?: PageSeoOptions["ogType"];
  breadcrumbs?: PageSeoOptions["breadcrumbs"];
  jsonLd?: PageSeoOptions["jsonLd"];
  onNavigate: (href: string) => void;
  hideCta?: boolean;
  children: ReactNode;
}

export default function PageShell({
  index,
  kicker,
  title,
  intro,
  meta,
  figure,
  figureAlt = "",
  seoTitle,
  seoDesc,
  path,
  ogImage,
  ogType,
  breadcrumbs,
  jsonLd,
  onNavigate,
  hideCta = false,
  children,
}: PageShellProps) {
  const { openPanel } = useCookies();
  const { openPanel: openA11y } = useA11y();
  const { t, locale } = useI18n();

  /* Si el texto empieza por "page." o similar, se traduce; si no, se usa tal cual */
  const tr = (v: string) => (v.includes(".") && !v.includes(" ") ? t(v) : v);
  usePageSeo({
    title: tr(seoTitle),
    description: tr(seoDesc),
    path,
    ogImage,
    ogType,
    breadcrumbs,
    jsonLd,
  });
  const kickerT = tr(kicker);
  const titleT = tr(title);
  const introT = tr(intro);
  const metaT = meta ? tr(meta) : undefined;
  const figureAltT = tr(figureAlt);

  return (
    <main id="contenido-principal" className="bg-ink text-paper">
      {/* ── Header editorial ── */}
      <header className="relative overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0 glow-brand" aria-hidden="true" />
        <div className="absolute inset-0 glow-ocean" aria-hidden="true" />
        <div
          className="absolute inset-0 hidden md:flex justify-between px-[8vw] pointer-events-none"
          aria-hidden="true"
        >
          {[...Array(5)].map((_, i) => (
            <span key={i} className="w-px h-full bg-white/[0.04]" />
          ))}
        </div>

        <div className="relative z-10 px-5 md:px-10 xl:px-16 max-w-[1600px] mx-auto pb-16 md:pb-24">
          <div className="flex items-center justify-between gap-4 mb-12">
            <button
              onClick={() => onNavigate("#top")}
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-smoke hover:text-paper transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("shell.back")}
            </button>
            {metaT && (
              <span className="hidden sm:block text-[11px] font-semibold uppercase tracking-[0.22em] text-ash">
                {metaT}
              </span>
            )}
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <Kicker index={index}>{kickerT}</Kicker>
              <LineReveal
                as="h1"
                className="mt-6 font-display font-semibold uppercase leading-[0.93] tracking-[-0.02em] text-[clamp(1.9rem,6.4vw,6.4rem)]"
                text={titleT}
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 max-w-xl text-base md:text-lg leading-relaxed text-smoke"
              >
                {introT}
              </motion.p>
            </div>

            {figure && (
              <div className="hidden lg:block lg:col-span-5">
                <motion.div
                  initial={{ clipPath: "inset(100% 0 0 0)" }}
                  animate={{ clipPath: "inset(0% 0 0 0)" }}
                  transition={{ duration: 1.1, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
                  className="relative aspect-[4/5] max-w-[400px] ml-auto"
                >
                  <div
                    className="absolute inset-0 translate-x-4 translate-y-4 rounded-t-full rounded-b-[2.5rem] border border-brand/50"
                    aria-hidden="true"
                  />
                  <div
                    role="img"
                    aria-label={figureAltT}
                    className="absolute inset-0 rounded-t-full rounded-b-[2.5rem] overflow-hidden border border-white/10 bg-cover bg-[center_20%]"
                    style={{ backgroundImage: `url(${figure})` }}
                  />
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Contenido específico de cada página ── */}
      {children}

      {/* ── Banda CTA ── */}
      {!hideCta && <section className="relative bg-brand overflow-hidden">
        <span
          className="absolute -right-6 -top-14 font-display font-semibold text-[13rem] leading-none text-ink/[0.08] select-none pointer-events-none"
          aria-hidden="true"
        >
          360°
        </span>
        <div className="relative px-5 md:px-10 xl:px-16 py-14 md:py-16 max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="font-display font-semibold uppercase leading-[0.95] text-[clamp(1.9rem,4vw,3.4rem)] text-ink">
              {t("shell.cta.title")}
            </h2>
            <p className="mt-3 text-ink/70 max-w-lg">{t("shell.cta.desc")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button
              onClick={() => onNavigate("/contacto")}
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-paper transition-all duration-300 hover:gap-4"
            >
              {t("shell.cta.button")}
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
            </button>
            <a
              href={`mailto:${siteContact.email}`}
              className="link-line font-display font-medium text-lg text-ink"
            >
              {siteContact.email}
            </a>
          </div>
        </div>
      </section>}

      {/* ── Footer interior ── */}
      <footer className="bg-[#060608] border-t border-white/[0.07]">
        <div className="px-5 md:px-10 xl:px-16 max-w-[1600px] mx-auto py-14 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <button onClick={() => onNavigate("#top")} aria-label="MISTERRED360, ir al inicio">
              <Wordmark className="text-xl" />
            </button>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
              {getBrandTagline(locale)}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-smoke max-w-sm">
              {t("shell.footer.short")}
            </p>
          </div>
          <nav className="md:col-span-3" aria-label={t("footer.explore")}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ash mb-4">
              {t("footer.explore")}
            </p>
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => onNavigate(l.href)}
                    className="text-sm text-smoke hover:text-brand transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ash mb-4">
              Contacto
            </p>
            <p className="text-sm text-smoke">
              {siteContact.email} · {siteContact.phone}
            </p>
            <p className="mt-1 text-sm text-smoke">
              {siteContact.address}
            </p>
            <button
              onClick={() => onNavigate("/contacto")}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] hover:border-brand hover:text-brand transition-colors"
            >
              {t("shell.footer.gocontact")}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="px-5 md:px-10 xl:px-16 max-w-[1600px] mx-auto py-6 border-t border-white/[0.07] text-[11px] uppercase tracking-[0.16em] text-ash flex flex-col md:flex-row justify-between gap-4 flex-wrap">
          <span>© 2026 MISTERRED360</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <button
              onClick={() => onNavigate("/politica-de-privacidad")}
              className="hover:text-paper transition-colors"
            >
              {t("footer.privacy_short")}
            </button>
            <button
              onClick={() => onNavigate("/politica-de-cookies")}
              className="hover:text-paper transition-colors"
            >
              {t("footer.cookies_short")}
            </button>
            <button
              onClick={() => onNavigate("/politica-de-ia")}
              className="hover:text-paper transition-colors"
            >
              {t("footer.ia_short")}
            </button>
            <button onClick={openPanel} className="hover:text-brand transition-colors">
              {t("footer.prefs_short")}
            </button>
            <button onClick={openA11y} className="hover:text-brand transition-colors">
              {t("footer.a11y")}
            </button>
            <a
              href="/downloads/misterred360-textos-web.md"
              download
              className="hover:text-brand transition-colors"
            >
              ↓ {t("footer.download_short")}
            </a>
          </div>
          <span>{t("footer.slogan")}</span>
        </div>
      </footer>
    </main>
  );
}
