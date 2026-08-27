import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/* ───────────────────────────────────────────────────────────
   MISTERRED360 · Sistema de cookies conforme RGPD / LSSI 22.2
   Consentimiento granular · aceptar / rechazar / configurar
   ─────────────────────────────────────────────────────────── */

export type ConsentCategory = "necessary" | "preferences" | "analytics" | "marketing";

export type CookieConsent = Record<ConsentCategory, boolean>;

export interface ConsentPayload {
  version: number;
  timestamp: string;
  consent: CookieConsent;
}

export const CONSENT_VERSION = 1;
export const CONSENT_KEY = "mr360.cookie-consent.v1";

export const defaultConsent: CookieConsent = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
};

export const categoryInfo: Record<
  ConsentCategory,
  { label: string; description: string; locked: boolean }
> = {
  necessary: {
    label: "Técnicas o estrictamente necesarias",
    description:
      "Imprescindibles para el funcionamiento básico del sitio: navegación, formularios, seguridad y preferencias de sesión. No pueden desactivarse.",
    locked: true,
  },
  preferences: {
    label: "Preferencias o personalización",
    description:
      "Recuerdan las opciones elegidas por el usuario (idioma, región, ajustes visuales) para personalizar la experiencia.",
    locked: false,
  },
  analytics: {
    label: "Analítica o estadística",
    description:
      "Permiten medir el uso del sitio, contabilizar visitas y analizar el rendimiento para mejorarlo (p. ej., Google Analytics).",
    locked: false,
  },
  marketing: {
    label: "Marketing o publicidad comportamental",
    description:
      "Recogen información sobre tu navegación para mostrarte publicidad personalizada dentro y fuera de este sitio.",
    locked: false,
  },
};

interface CookiesContextValue {
  consent: CookieConsent;
  hasChosen: boolean;
  saved: ConsentPayload | null;
  banner: boolean;
  panel: boolean;
  openPanel: () => void;
  closePanel: () => void;
  acceptAll: () => void;
  rejectAll: () => void;
  saveConsent: (choice: Partial<CookieConsent>) => void;
  reset: () => void;
}

const CookiesContext = createContext<CookiesContextValue | null>(null);

export function CookiesProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<ConsentPayload | null>(null);
  const [banner, setBanner] = useState(false);
  const [panel, setPanel] = useState(false);

  /* Carga el consentimiento guardado en el primer render */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) {
        setBanner(true);
        return;
      }
      const parsed = JSON.parse(raw) as ConsentPayload;
      if (parsed?.version !== CONSENT_VERSION) {
        setBanner(true);
        return;
      }
      setSaved(parsed);
    } catch {
      setBanner(true);
    }
  }, []);

  const persist = useCallback((consent: CookieConsent) => {
    const payload: ConsentPayload = {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      consent: { ...consent, necessary: true },
    };
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
    } catch {
      /* Almacenamiento no disponible: continuamos sin persistir */
    }
    setSaved(payload);
    setBanner(false);
    setPanel(false);
  }, []);

  const value = useMemo<CookiesContextValue>(
    () => ({
      consent: saved?.consent ?? defaultConsent,
      hasChosen: !!saved,
      saved,
      banner,
      panel,
      openPanel: () => setPanel(true),
      closePanel: () => setPanel(false),
      acceptAll: () =>
        persist({ necessary: true, preferences: true, analytics: true, marketing: true }),
      rejectAll: () => persist(defaultConsent),
      saveConsent: (choice) =>
        persist({ ...(saved?.consent ?? defaultConsent), ...choice, necessary: true }),
      reset: () => {
        try {
          localStorage.removeItem(CONSENT_KEY);
        } catch {
          /* noop */
        }
        setSaved(null);
        setBanner(true);
      },
    }),
    [saved, banner, panel, persist]
  );

  return <CookiesContext.Provider value={value}>{children}</CookiesContext.Provider>;
}

export function useCookies() {
  const ctx = useContext(CookiesContext);
  if (!ctx) throw new Error("useCookies debe usarse dentro de <CookiesProvider>");
  return ctx;
}
