/* ───────────────────────────────────────────────────────────
   MISTERRED360 · Puente hacia funciones nativas (Capacitor)
   Todas las funciones son safe-no-op en el navegador web.
   ─────────────────────────────────────────────────────────── */

import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Share } from "@capacitor/share";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Keyboard } from "@capacitor/keyboard";
import { SplashScreen } from "@capacitor/splash-screen";

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform(); // "ios" | "android" | "web"

/* Inicialización única al arrancar la app nativa */
export async function bootstrapNative(onBack: () => boolean) {
  if (!isNative) return;

  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#08080A" });
    await SplashScreen.hide({ fadeOutDuration: 300 });
  } catch {
    /* Algunos plugins no están disponibles en todas las plataformas */
  }

  /* Botón físico "Atrás" en Android:
     - Si onBack() devuelve true (hubo historial que retroceder), no cerramos.
     - Si devuelve false y estamos en la raíz, se minimiza la app. */
  App.addListener("backButton", ({ canGoBack }) => {
    const handled = onBack();
    if (!handled && !canGoBack) {
      App.exitApp();
    }
  });

  /* Ajusta el layout cuando aparece el teclado (útil en el form) */
  Keyboard.addListener("keyboardWillShow", (info) => {
    document.documentElement.style.setProperty(
      "--keyboard-height",
      `${info.keyboardHeight}px`
    );
  });
  Keyboard.addListener("keyboardWillHide", () => {
    document.documentElement.style.setProperty("--keyboard-height", "0px");
  });
}

/* Feedback háptico ligero al pulsar CTA importantes */
export async function tap(style: "light" | "medium" | "heavy" = "light") {
  if (!isNative) return;
  try {
    await Haptics.impact({
      style:
        style === "heavy"
          ? ImpactStyle.Heavy
          : style === "medium"
            ? ImpactStyle.Medium
            : ImpactStyle.Light,
    });
  } catch {
    /* noop */
  }
}

/* Abrir un enlace externo:
   - En nativo usa un in-app browser (mejor UX que salir a Safari/Chrome).
   - En web hace lo normal. */
export async function openExternal(url: string) {
  if (isNative) {
    await Browser.open({ url, presentationStyle: "popover" });
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

/* Compartir por el sistema (útil para noticias del blog) */
export async function shareContent(opts: {
  title?: string;
  text?: string;
  url?: string;
  dialogTitle?: string;
}) {
  if (isNative) {
    try {
      await Share.share({
        title: opts.title,
        text: opts.text,
        url: opts.url,
        dialogTitle: opts.dialogTitle ?? "Compartir",
      });
      return true;
    } catch {
      return false;
    }
  }
  /* Fallback web moderno */
  if (navigator.share) {
    try {
      await navigator.share({
        title: opts.title,
        text: opts.text,
        url: opts.url,
      });
      return true;
    } catch {
      return false;
    }
  }
  /* Fallback final: copiar al portapapeles */
  if (opts.url) {
    try {
      await navigator.clipboard.writeText(opts.url);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
