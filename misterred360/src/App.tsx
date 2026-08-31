import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { initSmoothScroll, registerNavigator, scrollToHash } from "./lib/scroll";

import Cursor from "./components/Cursor";
import Loader from "./components/Loader";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Manifesto from "./components/Manifesto";
import Services from "./components/Services";
import Process from "./components/Process";
import WhyUs from "./components/WhyUs";
import AgentesIAPromo from "./components/AgentesIAPromo";
import Testimonials from "./components/Testimonials";
import Faq from "./components/Faq";
import CTA from "./components/CTA";
import Contact from "./components/Contact";
import Blog from "./components/Blog";

import ManifiestoPage from "./pages/ManifiestoPage";
import ServiciosPage from "./pages/ServiciosPage";
import MetodoPage from "./pages/MetodoPage";
import AgentesIAPage from "./pages/AgentesIAPage";
import ElencoPage from "./pages/ElencoPage";
import PartnersPage from "./pages/PartnersPage";
import ContactPage from "./pages/ContactPage";
import PoliticaCookiesPage from "./pages/PoliticaCookiesPage";
import PoliticaPrivacidadPage from "./pages/PoliticaPrivacidadPage";
import PoliticaIAPage from "./pages/PoliticaIAPage";
import AgendarPage from "./pages/AgendarPage";

import { CookiesProvider } from "./lib/cookies";
import CookieBanner from "./components/CookieBanner";
import { A11yProvider } from "./lib/accessibility";
import AccessibilityPanel from "./components/AccessibilityPanel";
import WhatsAppButton from "./components/WhatsAppButton";
import AIAssistant from "./components/AIAssistant";
import ChatLauncher, { type LauncherChoice } from "./components/ChatLauncher";
import { I18nProvider, useI18n } from "./lib/i18n";
import HomeSeo from "./components/HomeSeo";
import { bootstrapNative } from "./lib/native";

/* ───────────────────────────────────────────────────────────
   MISTERRED360 · Enrutado por ruta real (History API)
   Home (landing intacta) + páginas interiores:
   /manifiesto · /servicios · /metodo · /elenco · /insights
   ─────────────────────────────────────────────────────────── */

type Page = "manifiesto" | "servicios" | "metodo" | "agentes-ia" | "elenco" | "partners";
type LegalPage = "politica-de-cookies" | "politica-de-privacidad" | "politica-de-ia";
type Route =
  | { name: "home" }
  | { name: "page"; page: Page }
  | { name: "contact" }
  | { name: "agendar" }
  | { name: "legal"; page: LegalPage }
  | { name: "blog" }
  | { name: "post"; slug: string };

const LEGAL_PAGES: LegalPage[] = [
  "politica-de-cookies",
  "politica-de-privacidad",
  "politica-de-ia",
];

const PAGES: Page[] = ["manifiesto", "servicios", "metodo", "agentes-ia", "elenco", "partners"];

function parseRoute(): Route {
  if (typeof window === "undefined") return { name: "home" };
  /* Ruta real (History API); el ancla interna ("/contacto#agendar")
     se maneja aparte tras la navegación, no forma parte de la ruta. */
  const raw = window.location.pathname;
  const path = raw.length > 1 && raw.endsWith("/") ? raw.slice(0, -1) : raw;
  if (path.startsWith("/insights/")) {
    return { name: "post", slug: decodeURIComponent(path.slice("/insights/".length)) };
  }
  if (path === "/insights") return { name: "blog" };
  if (path === "/contacto") return { name: "contact" };
  if (path === "/agendar") return { name: "agendar" };
  for (const p of PAGES) if (path === `/${p}`) return { name: "page", page: p };
  for (const p of LEGAL_PAGES) if (path === `/${p}`) return { name: "legal", page: p };
  return { name: "home" };
}

/* Extrae el ancla interna de un href tipo "/contacto#agendar" */
function extractInnerAnchor(href: string): string | null {
  const secondHash = href.indexOf("#", 1);
  if (secondHash <= 0) return null;
  return href.slice(secondHash); // "#agendar"
}

/* Reintenta hasta ~1.5s hasta que el elemento del ancla exista en el DOM
   (la página interior tarda 450ms en montar tras la transición de ruta)
   y entonces hace scroll. Evita depender de un delay fijo que a veces
   dispara antes de que el contenido nuevo esté montado. */
function waitForElementAndScroll(hash: string, attempt = 0) {
  if (document.querySelector(hash)) {
    scrollToHash(hash);
    return;
  }
  if (attempt >= 15) return;
  setTimeout(() => waitForElementAndScroll(hash, attempt + 1), 100);
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState<Route>(() => parseRoute());

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.3,
  });

  /* Scroll suave con física (Lenis) */
  useEffect(() => initSmoothScroll(), []);

  /* Puente con la app nativa: gestiona StatusBar, splash y
     el botón físico "Atrás" de Android usando el historial de la SPA */
  useEffect(() => {
    bootstrapNative(() => {
      if (window.history.length > 1) {
        window.history.back();
        return true;
      }
      return false;
    });
  }, []);

  /* Sincroniza la ruta con la URL (flechas atrás/adelante del navegador) */
  useEffect(() => {
    const sync = () => setRoute(parseRoute());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  /* Bloquea el scroll durante la intro */
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    if (!loading && window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  const jumpTop = () => {
    setTimeout(() => {
      if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
      else window.scrollTo({ top: 0, left: 0 });
    }, 0);
  };

  /* Navegación única: rutas interiores (/...) o secciones de la home (#...) */
  const navigate = useCallback((href: string) => {
    if (href.startsWith("/")) {
      window.history.pushState(null, "", href);
      setRoute(parseRoute());
      const inner = extractInnerAnchor(href);
      if (inner) {
        /* Espera al montaje de la nueva página antes de saltar al ancla.
           La transición de ruta tarda 450ms (AnimatePresence "wait"), así
           que reintentamos hasta que el elemento exista en el DOM en vez
           de fiarnos de un único delay fijo. */
        waitForElementAndScroll(inner);
      } else {
        jumpTop();
      }
    } else {
      /* Ancla de la home (p.ej. "#top"): no es una ruta propia, así
         que la URL vuelve a "/" en vez de arrastrar el fragmento. */
      window.history.pushState(null, "", "/");
      setRoute({ name: "home" });
      setTimeout(() => scrollToHash(href), 90);
    }
  }, []);

  /* Registra el navegador global para los CTAs sin props */
  useEffect(() => {
    registerNavigator(navigate);
  }, [navigate]);

  /* ── Contenido según ruta ── */
  let content: ReactNode;
  let routeKey: string;

  if (route.name === "blog" || route.name === "post") {
    const blogRoute =
      route.name === "blog" ? { type: "index" as const } : { type: "article" as const, slug: route.slug };
    routeKey = route.name === "blog" ? "blog" : `post-${route.slug}`;
    content = (
      <Blog
        route={blogRoute}
        onBackHome={(href = "#top") => navigate(href)}
        onOpenIndex={() => navigate("/insights")}
        onOpenPost={(slug) => navigate(`/insights/${encodeURIComponent(slug)}`)}
      />
    );
  } else if (route.name === "contact") {
    routeKey = "contact";
    content = <ContactPage onNavigate={navigate} />;
  } else if (route.name === "agendar") {
    routeKey = "agendar";
    content = <AgendarPage onNavigate={navigate} />;
  } else if (route.name === "legal") {
    routeKey = `legal-${route.page}`;
    content =
      route.page === "politica-de-cookies" ? (
        <PoliticaCookiesPage onNavigate={navigate} />
      ) : route.page === "politica-de-privacidad" ? (
        <PoliticaPrivacidadPage onNavigate={navigate} />
      ) : (
        <PoliticaIAPage onNavigate={navigate} />
      );
  } else if (route.name === "page") {
    routeKey = `page-${route.page}`;
    const pageProps = { onNavigate: navigate };
    content =
      route.page === "manifiesto" ? (
        <ManifiestoPage {...pageProps} />
      ) : route.page === "servicios" ? (
        <ServiciosPage {...pageProps} />
      ) : route.page === "metodo" ? (
        <MetodoPage {...pageProps} />
      ) : route.page === "agentes-ia" ? (
        <AgentesIAPage {...pageProps} />
      ) : route.page === "partners" ? (
        <PartnersPage {...pageProps} />
      ) : (
        <ElencoPage {...pageProps} />
      );
  } else {
    routeKey = "home";
    content = (
      <main id="contenido-principal">
        <HomeSeo />
        {/* 00 · Hero: propuesta de valor */}
        <Hero start={!loading} />

        {/* Cinta de ecosistema */}
        <div className="relative z-30 -my-7">
          <Marquee />
        </div>

        {/* 01 · Manifiesto */}
        <Manifesto />

        {/* 02 · Servicios 360 (comunicación al centro) */}
        <Services />

        {/* 03 · Método 360 (scroll horizontal fijado) */}
        <Process />

        {/* 04 · Diferenciales + resultados */}
        <WhyUs />

        {/* 05 · Avance de Agentes IA (detalle completo en /agentes-ia) */}
        <AgentesIAPromo />

        {/* 06 · Reputación */}
        <Testimonials />

        {/* Preguntas frecuentes · rich snippets FAQPage */}
        <Faq />

        {/* CTA de alto impacto */}
        <CTA />

        {/* 08 · Contacto + footer */}
        <Contact onNavigate={navigate} />
      </main>
    );
  }

  return (
    <I18nProvider>
    <A11yProvider>
    <CookiesProvider>
      <AppShell
        loading={loading}
        setLoading={setLoading}
        content={content}
        routeKey={routeKey}
        progress={progress}
        navigate={navigate}
      />
    </CookiesProvider>
    </A11yProvider>
    </I18nProvider>
  );
}

function AppShell({
  loading,
  setLoading,
  content,
  routeKey,
  progress,
  navigate,
}: {
  loading: boolean;
  setLoading: (v: boolean) => void;
  content: ReactNode;
  routeKey: string;
  progress: ReturnType<typeof useSpring>;
  navigate: (href: string) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="bg-ink text-paper antialiased">
      {/* Skip link · salta al contenido principal */}
      <a href="#contenido-principal" className="a11y-skip">
        {t("nav.skip")}
      </a>

      {/* Intro */}
      <AnimatePresence>{loading && <Loader onDone={() => setLoading(false)} />}</AnimatePresence>

      {/* Sistema de atmósfera */}
      <Cursor />
      <div className="grain" aria-hidden="true" />

      {/* Barra de progreso global */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-brand z-[75] origin-left"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      <Nav visible={!loading} onNavigate={navigate} />

      {/* Transición entre rutas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={routeKey}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {content}
        </motion.div>
      </AnimatePresence>

      {/* Banner y panel de cookies (RGPD) */}
      {!loading && <CookieBanner />}

      {/* Accesibilidad · FAB + drawer (izquierda) */}
      {!loading && <AccessibilityPanel />}

      {/* Launcher unificado (derecha): un único botón que despliega
          las dos opciones (Asistente IA + WhatsApp). */}
      {!loading && <ChatDock />}
    </div>
  );
}

/* Dos FAB siempre visibles · dos panels controlados */
function ChatDock() {
  const [wa, setWa] = useState(false);
  const [ai, setAi] = useState(false);

  const pick = (choice: LauncherChoice) => {
    if (choice === "assistant") {
      setWa(false);
      setAi((v) => !v);
    } else {
      setAi(false);
      setWa((v) => !v);
    }
  };

  return (
    <>
      <ChatLauncher onPick={pick} active={ai ? "assistant" : wa ? "whatsapp" : null} />
      <WhatsAppButton open={wa} onClose={() => setWa(false)} />
      <AIAssistant open={ai} onClose={() => setAi(false)} />
    </>
  );
}
