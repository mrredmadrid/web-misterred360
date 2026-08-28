import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { getServiceBlocks, socialLinks } from "../lib/data";
import { navigateTo } from "../lib/scroll";
import { useI18n } from "../lib/i18n";
import { Wordmark } from "./ui";
import LanguageSwitcher from "./LanguageSwitcher";

/* ───────────────────────────────────────────────────────────
   Nav · sticky con blur + menú full-screen de autor + i18n
   ─────────────────────────────────────────────────────────── */

/* "Servicios" despliega un mega-menú en fondo blanco con los
   tres bloques de servicios + Método 360 + Precios. */
const NAV_ROUTES = [
  { key: "nav.manifiesto", href: "/manifiesto" },
  { key: "nav.servicios", href: "/servicios", dropdown: true },
  { key: "nav.agentesIA", href: "/agentes-ia" },
  { key: "nav.elenco", href: "/elenco" },
  { key: "nav.insights", href: "/insights" },
] as const;

const SERVICES_DROPDOWN_EXTRA = [
  { key: "nav.metodo", href: "/metodo" },
  { key: "nav.precios", href: "/servicios#precios" },
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
  const [dropdown, setDropdown] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t, locale } = useI18n();
  const serviceBlocks = getServiceBlocks(locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    setDropdown(false);
    if (onNavigate) onNavigate(href);
    else navigateTo(href);
  };

  const openDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdown(true);
  };
  const scheduleCloseDropdown = () => {
    closeTimer.current = setTimeout(() => setDropdown(false), 150);
  };

  const mobileLinks = [
    { key: "nav.inicio", href: "#top" },
    { key: "nav.manifiesto", href: "/manifiesto" },
    { key: "nav.servicios", href: "/servicios" },
    { key: "nav.metodo", href: "/metodo" },
    { key: "nav.precios", href: "/servicios#precios" },
    { key: "nav.agentesIA", href: "/agentes-ia" },
    { key: "nav.elenco", href: "/elenco" },
    { key: "nav.insights", href: "/insights" },
    { key: "nav.talk", href: "/contacto" },
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
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:flex items-center lg:justify-between h-[72px] px-5 md:px-10 gap-3">
          <a
            href="#top"
            onClick={(e) => go(e, "#top")}
            className="justify-self-start text-[15px] sm:text-[17px] leading-none truncate"
            aria-label={t("nav.home_aria")}
          >
            <Wordmark />
          </a>

          {/* Hamburguesa · centrada en móvil, oculta desde lg (la barra completa ya está visible) */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden justify-self-center shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/15 text-paper"
            aria-label={t("nav.open")}
          >
            <Menu className="w-5 h-5" />
          </button>

          <nav
            className="hidden lg:flex items-center gap-8"
            aria-label={t("nav.manifiesto")}
          >
            {NAV_ROUTES.map((l) =>
              "dropdown" in l && l.dropdown ? (
                <div
                  key={l.href}
                  className="relative"
                  onMouseEnter={openDropdown}
                  onMouseLeave={scheduleCloseDropdown}
                >
                  <a
                    href={l.href}
                    onClick={(e) => go(e, l.href)}
                    aria-expanded={dropdown}
                    className="link-line inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.14em] text-paper/80 hover:text-paper transition-colors"
                  >
                    {t(l.key)}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${dropdown ? "rotate-180" : ""}`}
                    />
                  </a>
                  <AnimatePresence>
                    {dropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[300px]"
                      >
                        <div className="rounded-2xl bg-paper text-ink border border-ink/10 shadow-[0_30px_60px_-20px_rgba(8,8,10,0.4)] overflow-hidden p-2">
                          {serviceBlocks.map((b) => (
                            <a
                              key={b.id}
                              href={`/servicios#${b.id}`}
                              onClick={(e) => go(e, `/servicios#${b.id}`)}
                              className="flex items-baseline gap-3 rounded-xl px-4 py-3 text-[13px] font-medium hover:bg-ink/5 transition-colors"
                            >
                              <span className="font-display text-brand text-xs font-semibold">
                                {b.index}
                              </span>
                              {b.title}
                            </a>
                          ))}
                          <div className="my-1.5 h-px bg-ink/10" />
                          {SERVICES_DROPDOWN_EXTRA.map((e2) => (
                            <a
                              key={e2.href}
                              href={e2.href}
                              onClick={(e) => go(e, e2.href)}
                              className="flex items-center rounded-xl px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.08em] hover:bg-ink/5 transition-colors"
                            >
                              {t(e2.key)}
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => go(e, l.href)}
                  className="link-line text-[13px] font-medium uppercase tracking-[0.14em] text-paper/80 hover:text-paper transition-colors"
                >
                  {t(l.key)}
                </a>
              )
            )}
          </nav>

          <div className="justify-self-end flex flex-col lg:flex-row items-end lg:items-center gap-1.5 lg:gap-3">
            <a
              href="/contacto"
              onClick={(e) => go(e, "/contacto")}
              className="lg:order-2 group inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-brand px-3.5 sm:px-5 py-1.5 sm:py-2.5 text-[10px] sm:text-[12px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.12em] text-white transition-colors hover:bg-flame"
            >
              {t("nav.talk")}
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <div className="lg:order-1">
              <LanguageSwitcher />
            </div>
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

            <div className="flex-1 grid lg:grid-cols-[1fr_360px] overflow-y-auto overflow-x-hidden">
              <nav
                className="flex flex-col justify-center gap-1 px-5 md:px-10 py-6"
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
