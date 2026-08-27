# MISTERRED360 · Guía para publicar la app en Android y iOS

Toda la web ya está preparada para funcionar como **app nativa** en Android e
iOS mediante **Capacitor**, reutilizando el 100 % del código y del diseño.

> El objetivo es *una única base de código* que funciona como sitio web, PWA y
> app nativa en las dos tiendas oficiales, sin mantener versiones paralelas.

---

## 1 · Requisitos previos

| Para | Necesitas |
| --- | --- |
| **Ambas plataformas** | Node 20+, npm, Git |
| **Android** | Android Studio (Ladybug/Iguana o superior) + JDK 17 |
| **iOS** | macOS con Xcode 15+, CocoaPods (`sudo gem install cocoapods`) |
| **Publicar** | Cuenta **Google Play Console** (25 $ pago único) · Cuenta **Apple Developer** (99 $/año) |

---

## 2 · Añadir las plataformas nativas (solo la primera vez)

Desde la raíz del proyecto:

```bash
# Compilar la web
npm run build

# Añadir Android (crea la carpeta android/)
npx cap add android

# Añadir iOS (solo en macOS; crea la carpeta ios/)
npx cap add ios

# Copiar el build a los proyectos nativos y sincronizar plugins
npx cap sync
```

Al terminar tendrás dos nuevas carpetas: **`android/`** y **`ios/`**. Son
proyectos nativos completos, editables desde Android Studio y Xcode.

---

## 3 · Ciclo de trabajo habitual

Cada vez que cambies el código de la web:

```bash
npm run build      # compila la SPA
npx cap sync       # copia dist/ a android/ e ios/
npx cap open android   # abre Android Studio (o "ios" para Xcode)
```

También puedes lanzar el emulador directamente:

```bash
npx cap run android
npx cap run ios
```

### Hot-reload en el móvil (opcional)

Muy útil durante el desarrollo:

1. En `capacitor.config.ts`, dentro del bloque `server`, activa:
   ```ts
   url: "http://TU_IP_LOCAL:5173",
   cleartext: true,
   ```
2. Ejecuta la web en local: `npm run dev -- --host`
3. Lanza la app: `npx cap run android` o `npx cap run ios`.
4. Cada cambio se refleja al instante en el móvil (como en el navegador).

Recuerda **desactivar `url`** antes de compilar para tiendas.

---

## 4 · Iconos y splash screens

El proyecto ya incluye `public/favicon.svg` y `public/apple-touch-icon.svg`. Para
generar automáticamente todos los tamaños que piden Android e iOS:

```bash
# Instalar la herramienta (una sola vez)
npm install -D @capacitor/assets

# Colocar dos imágenes de origen en resources/:
#   resources/icon.png     (1024 × 1024, cuadrado, con la cara del chimpancé)
#   resources/splash.png   (2732 × 2732, fondo #08080A con logo centrado)

# Generar todo
npx capacitor-assets generate --iconBackgroundColor "#08080A" --splashBackgroundColor "#08080A"
```

Esto rellena automáticamente `android/app/src/main/res/` y `ios/App/App/Assets.xcassets/`.

---

## 5 · Configuración clave (`capacitor.config.ts`)

```ts
appId:   "es.misterred360.app"   // ID único en las tiendas
appName: "MISTERRED360"           // Nombre visible bajo el icono
webDir:  "dist"                   // Carpeta que se empaqueta
```

**Cambiar el `appId` implica reinstalar** la app en cualquier dispositivo donde
la tuvieras ya instalada.

---

## 6 · Publicar en Google Play (Android)

1. `npx cap open android` → Android Studio.
2. `Build → Generate Signed Bundle / APK…` → **Android App Bundle (.aab)**.
3. Crea (o reutiliza) tu **keystore** y guárdala en un sitio seguro. Si la
   pierdes no podrás actualizar la app.
4. En [Google Play Console](https://play.google.com/console):
   - Crea la app (idioma principal ES, título *MISTERRED360*).
   - Sube el `.aab` en **Producción → Nueva versión**.
   - Completa la ficha: descripción larga, capturas (mínimo 2), icono 512×512,
     gráfico destacado 1024×500, política de privacidad
     (`https://misterred360.es/politica-de-privacidad`).
5. Revisión de Google: 1–3 días.

---

## 7 · Publicar en App Store (iOS)

1. `npx cap open ios` → Xcode.
2. En la barra lateral selecciona **App** → firma con tu **Team** de Apple
   Developer, elige un **Bundle Identifier** único (`es.misterred360.app`).
3. `Product → Archive` (con el destino en *Any iOS Device*).
4. En el **Organizer** que aparece: **Distribute App → App Store Connect →
   Upload**.
5. En [App Store Connect](https://appstoreconnect.apple.com):
   - Crea la app, versión 1.0.
   - Rellena metadatos, capturas (iPhone 6.7" y iPad 13"), icono 1024×1024,
     descripción, palabras clave y URL de privacidad.
   - Envía a revisión. Suele tardar 24–72 h.

---

## 8 · Buenas prácticas incluidas

Ya activas de serie:

- **Barra de estado oscura** con el rojo/negro corporativo.
- **Splash screen** con el fondo `#08080A` y desvanecido automático a 1,5 s.
- **Botón físico "Atrás" de Android** integrado con el historial de la SPA:
  primero navega hacia atrás; solo cierra la app cuando ya no hay historial.
- **Teclado**: la variable CSS `--keyboard-height` se actualiza sola para
  reajustar el formulario cuando el teclado aparece.
- **Enlaces externos** (redes sociales, política de terceros…) se abren dentro
  de un *in-app browser* nativo: mejor UX que salir a Safari/Chrome.
- **Compartir por sistema** disponible via `shareContent()` de
  `src/lib/native.ts` — útil para noticias del blog.
- **Haptics ligeros** (`tap()`) opcional en botones clave para dar sensación
  premium al pulsar.

Todo se degrada de forma segura: en el navegador web las funciones nativas
simplemente no hacen nada.

---

## 9 · Actualizaciones futuras

- **Cambios solo de contenido** (noticias, textos, ajustes visuales): edita,
  `npm run build`, `npx cap sync`, y **sube una nueva versión a las tiendas**.
- **Cambios que solo tocan la web publicada**: si tuvieras activo `server.url`
  apuntando a `https://misterred360.es`, la app cargaría los cambios sin
  necesidad de nuevo build — pero Apple **rechaza** apps 100 % web-loader,
  así que se recomienda dejar el bundle empaquetado y publicar actualizaciones
  reales cuando haya novedades.

---

## 10 · Solución rápida de problemas

| Síntoma | Causa / solución |
| --- | --- |
| Pantalla blanca al abrir la app | Faltó `npx cap sync` tras `npm run build`. |
| El icono sale con bordes blancos en Android | Regenera con `capacitor-assets` y comprueba que `icon.png` es cuadrado 1024×1024 sin transparencia. |
| Rechazo de Apple "app is just a website" | Añade funcionalidad nativa (compartir, notificaciones, offline) y describe el valor de la app en la ficha. La integración con `Share` y `Haptics` ya cuenta. |
| Rechazo de Google por privacidad | Asegúrate de que la URL `/politica-de-privacidad` está accesible y declarada en la ficha. |
| El teclado tapa los campos del formulario | Ya está resuelto con `--keyboard-height`. Verifica que tu contenedor use `padding-bottom: var(--keyboard-height)`. |
