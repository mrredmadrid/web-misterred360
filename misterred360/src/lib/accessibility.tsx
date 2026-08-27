import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ───────────────────────────────────────────────────────────
   MISTERRED360 · Accesibilidad
   Ajustes que se aplican mediante clases y variables CSS en <html>.
   Se persisten en localStorage bajo mr360.a11y.v1.
   ─────────────────────────────────────────────────────────── */

export type FontScale = 100 | 115 | 130 | 150;
export type SpacingScale = "normal" | "wide";

export interface A11ySettings {
  fontScale: FontScale;
  spacing: SpacingScale;
  highContrast: boolean;
  underlineLinks: boolean;
  reduceMotion: boolean;
  bigCursor: boolean;
  readingGuide: boolean;
  readingMask: boolean;
  dyslexia: boolean;
  pauseGrain: boolean;
}

export const defaultA11y: A11ySettings = {
  fontScale: 100,
  spacing: "normal",
  highContrast: false,
  underlineLinks: false,
  reduceMotion: false,
  bigCursor: false,
  readingGuide: false,
  readingMask: false,
  dyslexia: false,
  pauseGrain: false,
};

const STORAGE_KEY = "mr360.a11y.v1";

interface A11yContextValue {
  settings: A11ySettings;
  panel: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  set: <K extends keyof A11ySettings>(key: K, value: A11ySettings[K]) => void;
  reset: () => void;
  speak: (text: string) => void;
  stopSpeak: () => void;
  isSpeaking: boolean;
}

const A11yContext = createContext<A11yContextValue | null>(null);

export function A11yProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<A11ySettings>(defaultA11y);
  const [panel, setPanel] = useState(false);
  const [isSpeaking, setSpeaking] = useState(false);

  /* Carga inicial + respeto de prefers-reduced-motion del sistema */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<A11ySettings>;
        setSettings((s) => ({ ...s, ...parsed }));
        return;
      }
    } catch {
      /* noop */
    }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setSettings((s) => ({ ...s, reduceMotion: true }));
    }
  }, []);

  /* Aplica los ajustes al <html> (clases + variables CSS) */
  useEffect(() => {
    const html = document.documentElement;
    const cls = html.classList;

    cls.toggle("a11y-contrast", settings.highContrast);
    cls.toggle("a11y-underline", settings.underlineLinks);
    cls.toggle("a11y-reduce-motion", settings.reduceMotion);
    cls.toggle("a11y-cursor", settings.bigCursor);
    cls.toggle("a11y-dyslexia", settings.dyslexia);
    cls.toggle("a11y-pause-grain", settings.pauseGrain);
    cls.toggle("a11y-spacing-wide", settings.spacing === "wide");

    html.style.setProperty("--a11y-font-scale", `${settings.fontScale / 100}`);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* noop */
    }
  }, [settings]);

  /* Detiene la voz al desmontar */
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const set = useCallback(
    <K extends keyof A11ySettings>(key: K, value: A11ySettings[K]) => {
      setSettings((s) => ({ ...s, [key]: value }));
    },
    []
  );

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window) || !text.trim()) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-ES";
    utter.rate = 1;
    utter.pitch = 1;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(utter);
  }, []);

  const stopSpeak = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const value = useMemo<A11yContextValue>(
    () => ({
      settings,
      panel,
      openPanel: () => setPanel(true),
      closePanel: () => setPanel(false),
      togglePanel: () => setPanel((v) => !v),
      set,
      reset: () => setSettings(defaultA11y),
      speak,
      stopSpeak,
      isSpeaking,
    }),
    [settings, panel, set, speak, stopSpeak, isSpeaking]
  );

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export function useA11y() {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y debe usarse dentro de <A11yProvider>");
  return ctx;
}

/* ── Lector de sección: botón "Escuchar" reutilizable ── */
export function useReadable() {
  const { speak, stopSpeak, isSpeaking } = useA11y();
  return { speak, stopSpeak, isSpeaking };
}
