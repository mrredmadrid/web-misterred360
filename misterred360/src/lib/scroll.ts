import Lenis from "lenis";

/* Lenis como singleton: scroll suave con física premium */
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function initSmoothScroll(): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }
  const lenis = new Lenis({ lerp: 0.095, smoothWheel: true });
  window.__lenis = lenis;

  let raf = 0;
  const loop = (time: number) => {
    lenis.raf(time);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    lenis.destroy();
    window.__lenis = undefined;
  };
}

/* ── Navegación global entre rutas ──
   App registra su función navigate; cualquier componente puede
   llamar a navigateTo() sin necesidad de recibir props. */
type NavigatorFn = (href: string) => void;
let appNavigator: NavigatorFn | null = null;

export function registerNavigator(fn: NavigatorFn) {
  appNavigator = fn;
}

export function navigateTo(href: string) {
  if (appNavigator) appNavigator(href);
  else scrollToHash(href);
}

export function scrollToHash(href: string) {
  const lenis = window.__lenis;
  if (href === "#top") {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.querySelector(href);
  if (!el) return;
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -70, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}
