import { ArrowUp } from "lucide-react";
import { navLinks, getAllServices, getBrandTagline, socialLinks, siteContact } from "../lib/data";
import { navigateTo, scrollToHash } from "../lib/scroll";
import { useCookies } from "../lib/cookies";
import { useA11y } from "../lib/accessibility";
import { useI18n } from "../lib/i18n";
import { Kicker, Wordmark } from "./ui";
import ContactBlock from "./ContactBlock";

/* ───────────────────────────────────────────────────────────
   Sección 08 de la landing · CONTACTO + Footer de gran formato
   El formulario vive en ContactBlock (compartido con #/contacto)
   ─────────────────────────────────────────────────────────── */

export default function Contact({
  onNavigate,
}: {
  onNavigate?: (href: string) => void;
}) {
  const { openPanel } = useCookies();
  const { openPanel: openA11y } = useA11y();
  const { t, locale } = useI18n();
  const allServices = getAllServices(locale);
  const brandTagline = getBrandTagline(locale);
  const go = (href: string) => (onNavigate ? onNavigate(href) : navigateTo(href));

  return (
    <>
      <section id="contacto" className="relative bg-ink border-t border-white/[0.07]">
        <div className="absolute inset-0 glow-ocean pointer-events-none" aria-hidden="true" />
        <div className="relative px-5 md:px-10 xl:px-16 py-24 md:py-32 max-w-[1600px] mx-auto">
          <div className="mb-14 max-w-3xl">
            <Kicker index="08">{t("contact.kicker")}</Kicker>
            <h2 className="mt-10 font-display font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(2.4rem,5vw,4.6rem)]">
              {t("contact.title.a")}
              <br />
              {t("contact.title.b")} <span className="text-brand">{t("contact.title.c")}</span>
            </h2>
          </div>

          <ContactBlock />
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#060608] border-t border-white/[0.07]">
        <div className="px-5 md:px-10 xl:px-16 max-w-[1600px] mx-auto">
          {/* Wordmark gigante */}
          <div className="py-14 md:py-20 overflow-hidden border-b border-white/[0.07]">
            <p className="font-display font-semibold uppercase leading-[0.9] tracking-[-0.02em] text-[clamp(1.8rem,10.5vw,10.5rem)] whitespace-nowrap">
              MISTER<span className="text-brand">RED</span>
              <span className="text-outline">360°</span>
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-10 py-14">
            <div className="md:col-span-4">
              <Wordmark className="text-xl" />
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
                {brandTagline}
              </p>
              <p className="mt-5 text-sm leading-relaxed text-smoke max-w-xs">
                {t("shell.footer.short")}
              </p>
              <div className="mt-6 flex gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.short}
                    href="#top"
                    onClick={(e) => e.preventDefault()}
                    aria-label={s.label}
                    className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-[11px] font-semibold tracking-wider hover:border-brand hover:text-brand transition-colors"
                  >
                    {s.short}
                  </a>
                ))}
              </div>
            </div>

            <nav className="md:col-span-2" aria-label={t("footer.explore")}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ash mb-5">
                {t("footer.explore")}
              </p>
              <ul className="space-y-3">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={(e) => {
                        e.preventDefault();
                        if (onNavigate) onNavigate(l.href);
                        else scrollToHash(l.href);
                      }}
                      className="text-sm text-smoke hover:text-brand transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="md:col-span-3" aria-label={t("footer.services")}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ash mb-5">
                {t("footer.services")}
              </p>
              <ul className="grid grid-cols-1 gap-3">
                {allServices.map((s) => (
                  <li key={s.id}>
                    <a
                      href="/servicios"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onNavigate) onNavigate("/servicios");
                        else scrollToHash("/servicios");
                      }}
                      className="text-sm text-smoke hover:text-brand transition-colors"
                    >
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="md:col-span-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ash mb-5">
                {t("footer.den")}
              </p>
              <address className="not-italic text-sm text-smoke space-y-3">
                <p>{siteContact.address} · España</p>
                <p>
                  <a
                    href={`mailto:${siteContact.email}`}
                    className="hover:text-brand transition-colors"
                  >
                    {siteContact.email}
                  </a>
                </p>
                <p>
                  <a href={`tel:${siteContact.phoneHref}`} className="hover:text-brand transition-colors">
                    {siteContact.phone}
                  </a>
                </p>
              </address>
              <button
                onClick={() => scrollToHash("#top")}
                className="group mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper hover:border-brand hover:text-brand transition-colors"
              >
                {t("footer.top")}
                <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8 border-t border-white/[0.07] text-[11px] uppercase tracking-[0.16em] text-ash">
            <p>{t("footer.rights")}</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <button
                onClick={() => go("/politica-de-privacidad")}
                className="hover:text-paper transition-colors"
              >
                {t("footer.privacy")}
              </button>
              <button
                onClick={() => go("/politica-de-cookies")}
                className="hover:text-paper transition-colors"
              >
                {t("footer.cookies")}
              </button>
              <button
                onClick={() => go("/politica-de-ia")}
                className="hover:text-paper transition-colors"
              >
                {t("footer.ia")}
              </button>
              <button onClick={openPanel} className="hover:text-brand transition-colors">
                {t("footer.cookie_prefs")}
              </button>
              <button onClick={openA11y} className="hover:text-brand transition-colors">
                {t("footer.a11y")}
              </button>
              <a
                href="/downloads/misterred360-textos-web.md"
                download
                className="hover:text-brand transition-colors"
              >
                ↓ {t("footer.download")}
              </a>
            </div>
            <p>{t("footer.made")}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
