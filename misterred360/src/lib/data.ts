import {
  Newspaper,
  Compass,
  RadioTower,
  Users,
  Fingerprint,
  Clapperboard,
  Megaphone,
  BarChart3,
  Bot,
  Clock,
  Target,
  MessageCircle,
  Video,
  Scissors,
  Wand2,
  CalendarCheck,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "./i18n";
import { loc, img, type Localized } from "./content";

import servicesContent from "../content/services.json";
import processContent from "../content/process.json";
import whyusContent from "../content/whyus.json";
import statsContent from "../content/stats.json";
import teamContent from "../content/team.json";
import testimonialsContent from "../content/testimonials.json";
import pricingContent from "../content/pricing.json";
import heroContent from "../content/hero.json";
import manifestoContent from "../content/manifesto.json";
import siteContent from "../content/site.json";
import designContent from "../content/design.json";
import seoContent from "../content/seo.json";
import agentesIAContent from "../content/agentesIA.json";
import partnersContent from "../content/partners.json";

/* ───────────────────────────────────────────────────────────
   MISTERRED360 · Capa de resolución de contenido
   Los datos "en crudo" viven en src/content/*.json (editables
   desde el panel /admin sin tocar código). Este archivo expone
   funciones get*(locale) que devuelven el contenido ya resuelto
   al idioma activo, con la misma forma que usaban antes los
   componentes, para minimizar cambios en el resto de la app.
   ─────────────────────────────────────────────────────────── */

const ICONS: Record<string, LucideIcon> = {
  newspaper: Newspaper,
  compass: Compass,
  "radio-tower": RadioTower,
  users: Users,
  fingerprint: Fingerprint,
  clapperboard: Clapperboard,
  megaphone: Megaphone,
  "bar-chart-3": BarChart3,
  bot: Bot,
  clock: Clock,
  target: Target,
  "message-circle": MessageCircle,
  video: Video,
  scissors: Scissors,
  "wand-2": Wand2,
  "calendar-check": CalendarCheck,
};

/* ── Servicios ──────────────────────────────────────────── */
export interface Service {
  id: string;
  name: string;
  tagline: string;
  brief: string;
  long: string;
  image: string;
  imageAlt: string;
  icon: LucideIcon;
}

export interface ServiceBlock {
  id: string;
  index: string;
  title: string;
  claim: string;
  description: string;
  accent: "brand" | "ocean";
  image?: string;
  imageAlt?: string;
  services: Service[];
}

export function getServiceBlocks(locale: Locale): ServiceBlock[] {
  return servicesContent.blocks.map((b) => ({
    id: b.id,
    index: b.index,
    title: loc(b.title, locale),
    claim: loc(b.claim, locale),
    description: loc(b.description, locale),
    accent: b.accent as "brand" | "ocean",
    image: img((b as { image?: string }).image),
    imageAlt: (b as { imageAlt?: string }).imageAlt,
    services: b.services.map((s) => ({
      id: s.id,
      name: loc(s.name, locale),
      tagline: loc(s.tagline, locale),
      brief: loc(s.brief, locale),
      long: loc(s.long, locale),
      image: img(s.image),
      imageAlt: s.imageAlt,
      icon: ICONS[s.icon] ?? Newspaper,
    })),
  }));
}

/* Lista plana de todos los servicios (para footer, sitemap, SEO) */
export function getAllServices(locale: Locale): Service[] {
  return getServiceBlocks(locale).flatMap((b) => b.services);
}

/* ── Método 360 ─────────────────────────────────────────── */
export interface ProcessStep {
  index: string;
  id: string;
  verb: string;
  title: string;
  description: string;
  extended: string;
  image: string;
  tags: string[];
  deliverables: string[];
}

export function getProcessSteps(locale: Locale): ProcessStep[] {
  return processContent.steps.map((s) => ({
    index: s.index,
    id: s.id,
    verb: loc(s.verb, locale),
    title: loc(s.title, locale),
    description: loc(s.description, locale),
    extended: loc(s.extended, locale),
    image: img(s.image),
    tags: loc(s.tags as unknown as Localized<string[]>, locale),
    deliverables: loc(s.deliverables as unknown as Localized<string[]>, locale),
  }));
}

/* ── Por qué nosotros ───────────────────────────────────── */
export function getWhyUs(locale: Locale) {
  return {
    kicker: loc(whyusContent.kicker, locale),
    title: loc(whyusContent.title, locale),
    description: loc(whyusContent.description, locale),
    partnersKicker: loc(whyusContent.partners.kicker, locale),
    partnersDescription: loc(whyusContent.partners.description, locale),
  };
}

export const differentials = whyusContent.differentials;

/* ── Cifras ─────────────────────────────────────────────── */
export const stats = statsContent.items;

/* ── El Elenco: las caras del personaje ─────────────────── */
export interface CastMember {
  id: string;
  image: string;
  gender: "m" | "f";
  role: string;
  area: string;
  quote: string;
}

export function getCastMembers(locale: Locale): CastMember[] {
  return teamContent.members.map((m) => ({
    id: m.id,
    image: img(m.image),
    gender: m.gender as "m" | "f",
    role: loc(m.role, locale),
    area: loc(m.area, locale),
    quote: loc(m.quote, locale),
  }));
}

/* ── Testimonios ────────────────────────────────────────── */
export const testimonials = testimonialsContent.items;

/* ── Precios ────────────────────────────────────────────── */
export function getPricing(locale: Locale) {
  return {
    kicker: loc(pricingContent.kicker, locale),
    title: loc(pricingContent.title, locale),
    description: loc(pricingContent.description, locale),
    note: loc(pricingContent.note, locale),
    tiers: pricingContent.tiers.map((t) => ({
      id: t.id,
      name: loc(t.name, locale),
      price: loc(t.price, locale),
      description: loc(t.description, locale),
    })),
  };
}

/* ── Hero ───────────────────────────────────────────────── */
export function getHero(locale: Locale) {
  return {
    kicker: loc(heroContent.kicker, locale),
    title: loc(heroContent.title, locale),
    description: loc(heroContent.description, locale),
    ctaPrimary: loc(heroContent.ctaPrimary, locale),
    ctaSecondary: loc(heroContent.ctaSecondary, locale),
    audience: loc(heroContent.audience, locale),
    badge: loc(heroContent.badge, locale),
    chips: {
      prensa: loc(heroContent.chips.prensa, locale),
      branding: loc(heroContent.chips.branding, locale),
      av: loc(heroContent.chips.av, locale),
      estrategia: loc(heroContent.chips.estrategia, locale),
      impacto: loc(heroContent.chips.impacto, locale),
    },
  };
}

/* ── Manifiesto ─────────────────────────────────────────── */
export function getManifesto(locale: Locale) {
  return {
    kicker: loc(manifestoContent.kicker, locale),
    title: loc(manifestoContent.title, locale),
    eco: loc(manifestoContent.eco, locale),
    p1: loc(manifestoContent.p1, locale),
    p2: loc(manifestoContent.p2, locale),
    quote: loc(manifestoContent.quote, locale),
    fig: loc(manifestoContent.fig, locale),
    badge: loc(manifestoContent.badge, locale),
    ceoQuote: loc(manifestoContent.ceoQuote, locale),
    ceoRole: loc(manifestoContent.ceoRole, locale),
    image: img(manifestoContent.image),
    imageFallback: img(manifestoContent.imageFallback),
  };
}

/* ── Marca / sitio ──────────────────────────────────────── */
export function getBrandTagline(locale: Locale): string {
  return loc(siteContent.brandTagline, locale);
}
export function getFooterSlogan(locale: Locale): string {
  return loc(siteContent.footerSlogan, locale);
}
export const siteContact = siteContent.contact;
export const siteLegal = siteContent.legal;

/* Tamaño de letra por defecto de toda la web, editable desde el
   panel /admin ("Ajustes de diseño"). El visitante puede seguir
   ajustándolo a su gusto desde el panel de accesibilidad; este
   valor es solo el punto de partida. */
export const siteFontScale = designContent.fontScale;

/* ── SEO por página, editable desde el panel /admin ────────── */
export type SeoPage = keyof typeof seoContent;
export function getSeo(locale: Locale, page: SeoPage): { title: string; description: string } {
  const entry = seoContent[page];
  return {
    title: loc(entry.title, locale),
    description: loc(entry.description, locale),
  };
}

/* ── Marquee ────────────────────────────────────────────── */
export const marqueeItems = [
  "Identidad",
  "Comunicación",
  "Creación",
  "Estrategia",
  "Impacto",
  "Gabinete de Prensa",
  "Imagen Corporativa",
  "Planificación Estratégica",
  "Comunicación 2.0",
  "Creación Audiovisual",
  "RRPP y Eventos",
  "Publicidad y Marketing",
];

/* Rutas de las páginas interiores (hash routing) */
export const navLinks = [
  { label: "Manifiesto", href: "/manifiesto" },
  { label: "Servicios", href: "/servicios" },
  { label: "Método 360", href: "/metodo" },
  { label: "Agentes IA", href: "/agentes-ia" },
  { label: "Elenco", href: "/elenco" },
  { label: "Partners", href: "/partners" },
  { label: "Por qué nosotros", href: "/por-que-nosotros" },
  { label: "Insights", href: "/insights" },
];

/* Iconos sociales editoriales (lucide ya no incluye marcas) */
export const socialLinks = [
  { short: "IG", label: "Instagram" },
  { short: "IN", label: "LinkedIn" },
  { short: "X", label: "X / Twitter" },
  { short: "YT", label: "YouTube" },
];

/* ── Página Agentes IA ─────────────────────────────────── */
export interface AgentCapability {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface AgentProcessStep {
  index: string;
  title: string;
  description: string;
}

export interface AgentFaqItem {
  q: string;
  a: string;
}

export function getAgentesIA(locale: Locale) {
  return {
    hero: {
      kicker: loc(agentesIAContent.hero.kicker, locale),
      title: loc(agentesIAContent.hero.title, locale),
      intro: loc(agentesIAContent.hero.intro, locale),
      meta: loc(agentesIAContent.hero.meta, locale),
    },
    statement: loc(agentesIAContent.statement, locale),
    promo: {
      badge: loc(agentesIAContent.promo.badge, locale),
      title: loc(agentesIAContent.promo.title, locale),
      description: loc(agentesIAContent.promo.description, locale),
      cta: loc(agentesIAContent.promo.cta, locale),
    },
    capabilities: agentesIAContent.capabilities.map((c): AgentCapability => ({
      id: c.id,
      icon: ICONS[c.icon] ?? Bot,
      title: loc(c.title, locale),
      description: loc(c.description, locale),
    })),
    process: agentesIAContent.process.map((p): AgentProcessStep => ({
      index: p.index,
      title: loc(p.title, locale),
      description: loc(p.description, locale),
    })),
    faq: agentesIAContent.faq.map((f): AgentFaqItem => ({
      q: loc(f.q, locale),
      a: loc(f.a, locale),
    })),
  };
}

/* ── Página Partners ────────────────────────────────────── */
export interface PartnerPillar {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function getPartners(locale: Locale) {
  return {
    hero: {
      kicker: loc(partnersContent.hero.kicker, locale),
      title: loc(partnersContent.hero.title, locale),
      intro: loc(partnersContent.hero.intro, locale),
      meta: loc(partnersContent.hero.meta, locale),
    },
    statement: loc(partnersContent.statement, locale),
    pillars: partnersContent.pillars.map((p): PartnerPillar => ({
      id: p.id,
      icon: ICONS[p.icon] ?? Users,
      title: loc(p.title, locale),
      description: loc(p.description, locale),
    })),
    close: {
      kicker: loc(partnersContent.close.kicker, locale),
      title: loc(partnersContent.close.title, locale),
      description: loc(partnersContent.close.description, locale),
      cta: loc(partnersContent.close.cta, locale),
    },
  };
}
