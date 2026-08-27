import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { socialLinks } from "../lib/data";
import { scrollToHash } from "../lib/scroll";
import { useI18n } from "../lib/i18n";
import { Wordmark } from "./ui";
import LanguageSwitcher from "./LanguageSwitcher";

/* ───────────────────────────────────────────────────────────
   Nav · sticky con blur + menú full-screen de autor + i18n
   ─────────────────────────────────────────────────────────── */

const NAV_ROUTES = [
  { key: "nav.manifiesto", href: "#/manifiesto" },
  { key: "nav.servicios", href: "#/servicios" },
  { key: "nav.metodo", href: "#/metodo" },
  { key: "nav.elenco", href: "#/elenco" },
  { key: "nav.insights", href: "#/insights" },
] as const;

export default function Nav({
  visible,
  onNavigate,
}: {
  visible: boolean;
  onNavigate?: (href: string) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    if (onNavigate) onNavigate(href);
    else scrollToHash(href);
  };

  const mobileLinks = [
    { key: "nav.inicio", href: "#top" },
    ...NAV_ROUTES,
    { key: "nav.contacto", href: "#/contacto" },
    { key: "nav.book", href: "#/agendar" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={visible ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className={`fixed top-0 inset-x-0 z-[70] transition-colors duration-500 ${
          scrolled ? "bg-ink/80 backdrop-blur-md border-b border-white/[0.07]" : ""
        }`}
      >
        <div className="flex items-center justify-between h-[72px] px-5 md:px-10 gap-4">
          <a
            href="#top"
            onClick={(e) => go(e, "#top")}
            className="text-[17px] leading-none"
            aria-label={t("nav.home_aria")}
          >
            <Wordmark />
          </a>

          <nav
            className="hidden lg:flex items-center gap-8"
            aria-label={t("nav.manifiesto")}
          >
            {NAV_ROUTES.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => go(e, l.href)}
                className="link-line text-[13px] font-medium uppercase tracking-[0.14em] text-paper/80 hover:text-paper transition-colors"
              >
                {t(l.key)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-smoke">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-blink" />
              {t("nav.status")}
            </span>
            <LanguageSwitcher />
            <a
              href="#/agendar"
              onClick={(e) => go(e, "#/agendar")}
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-paper transition-colors hover:border-brand hover:text-brand"
            >
              {t("nav.book")}
            </a>
            <a
              href="#/contacto"
              onClick={(e) => go(e, "#/contacto")}
              className="group hidden sm:inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-flame"
            >
              {t("nav.cta")}
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/15 text-paper"
              aria-label={t("nav.open")}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Menú full-screen */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] bg-ink flex flex-col"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.open")}
          >
            <div className="flex items-center justify-between h-[72px] px-5 md:px-10 border-b border-white/[0.07]">
              <Wordmark className="text-[17px]" />
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <button
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/15"
                  aria-label={t("nav.close")}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 grid lg:grid-cols-[1fr_360px] overflow-hidden">
              <nav
                className="flex flex-col justify-center gap-1 px-5 md:px-10"
                aria-label={t("nav.open")}
              >
                {mobileLinks.map((l, i) => (
                  <div key={l.href} className="overflow-hidden">
                    <motion.a
                      href={l.href}
                      onClick={(e) => go(e, l.href)}
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      transition={{
                        delay: 0.15 + i * 0.05,
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group flex items-baseline gap-4 py-2 font-display font-semibold uppercase leading-[1.02] text-[clamp(2rem,7vw,3.6rem)] text-paper hover:text-brand transition-colors"
                    >
                      <span className="text-xs text-brand font-sans tracking-widest">
                        0{i + 1}
                      </span>
                      {t(l.key)}
                    </motion.a>
                  </div>
                ))}
              </nav>

              <div className="hidden lg:flex flex-col justify-between border-l border-white/[0.07] p-10">
                <div className="rounded-2xl overflow-hidden aspect-[4/5] max-w-[260px]">
                  <img
                    src="/images/chimp-bw.jpg"
                    alt="MISTERRED360"
                    className="w-full h-full object-cover object-[center_20%]"
                  />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-smoke mb-4">
                    {t("nav.follow")}
                  </p>
                  <div className="flex gap-3">
                    {socialLinks.map((s) => (
                      <a
                        key={s.short}
                        href="#top"
                        onClick={(e) => e.preventDefault()}
                        className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-[11px] font-semibold tracking-wider hover:border-brand hover:text-brand transition-colors"
                        aria-label={s.label}
                      >
                        {s.short}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
