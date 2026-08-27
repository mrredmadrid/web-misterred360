import type { CapacitorConfig } from "@capacitor/cli";

/* ───────────────────────────────────────────────────────────
   MISTERRED360 · Configuración de la app nativa
   Envuelve la web (dist/) en contenedores Android e iOS
   mediante Capacitor. Reutiliza 100 % del código de la web.
   ─────────────────────────────────────────────────────────── */

const config: CapacitorConfig = {
  appId: "es.misterred360.app",
  appName: "MISTERRED360",
  webDir: "dist",
  bundledWebRuntime: false,

  server: {
    /* Servir el bundle empaquetado. Para hot-reload durante
       el desarrollo cambia a { url: "http://TU_IP:5173" } */
    androidScheme: "https",
    iosScheme: "https",
    hostname: "misterred360.es",
    /* En producción sirve los archivos incluidos en la app;
       para ver la web en directo, activa la línea siguiente:
       url: "https://misterred360.es"
    */
  },

  ios: {
    contentInset: "always",
    limitsNavigationsToAppBoundDomains: false,
    scheme: "MISTERRED360",
    backgroundColor: "#08080AFF",
  },

  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: "#08080AFF",
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: "#08080A",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      androidSplashResourceName: "splash",
    },
    StatusBar: {
      style: "DARK", // texto blanco sobre fondo negro
      backgroundColor: "#08080A",
      overlaysWebView: false,
    },
    Keyboard: {
      resize: "body",
      style: "DARK",
      resizeOnFullScreen: true,
    },
    App: {
      launchUrl: "/",
    },
  },
};

export default config;
