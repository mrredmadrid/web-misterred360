# MISTERRED360 · Publicación automática a OVH

Con esto configurado, **cada vez que algo cambie en `main`** (incluidos
los guardados desde el panel `/admin`), GitHub compila la web sola y
la sube por FTP a OVH. Ya no hace falta compilar ni subir nada a mano.

El workflow ya está creado en `.github/workflows/deploy.yml`. Solo
falta darle las credenciales FTP de forma segura — **nunca se las
escribas a Claude ni las pegues en un chat**, van directamente a
GitHub.

## Pasos (una sola vez)

1. Ve a tu repositorio en GitHub: `Settings` → `Secrets and variables`
   → `Actions` → pestaña **Secrets** → **New repository secret**.
2. Crea estos tres secrets, con los mismos datos que ya usas en
   FileZilla (ver `GUIA-DESPLIEGUE-OVH.md`, paso A3):

   | Nombre del secret | Valor |
   | --- | --- |
   | `FTP_SERVER` | tu servidor FTP, ej. `ftp.cluster0XX.hosting.ovh.net` |
   | `FTP_USERNAME` | tu usuario FTP de OVH |
   | `FTP_PASSWORD` | tu contraseña FTP de OVH |

3. Guarda. No hace falta hacer nada más: el workflow ya está esperando
   a que existan esos tres secrets.

## Comprobar que funciona

1. Haz cualquier cambio pequeño en `main` (o guarda algo de prueba
   desde el panel `/admin`).
2. Ve a la pestaña **Actions** del repositorio en GitHub.
3. Debería aparecer una ejecución de "Compilar y publicar en OVH" en
   marcha o recién terminada. Ábrela para ver el progreso paso a paso.
4. Si termina en verde, entra en `https://misterred360.es` y comprueba
   que el cambio ya está.

Desde que la web genera una versión "prerenderizada" de cada página
(para que Google y las IA la lean bien, ver `GUIA-SEO.md`), el
workflow tarda un poco más (instala un navegador sin cabeza para
generar esas páginas) — un par de minutos en vez de unos segundos.
Es normal.

## Si algo falla

- El log de cada paso está en la propia ejecución dentro de Actions:
  clica en el paso que tenga la ❌ para ver el error exacto.
- El error más habitual es un secret mal escrito (usuario o contraseña
  FTP incorrectos) — vuelve a comprobarlos en el paso 2.
- El paso `FTP-Deploy-Action` está configurado con
  `dangerous-clean-slate: false`: sube y actualiza archivos, pero
  nunca borra nada en el servidor que no venga del build. Así, aunque
  algo salga mal, no se puede borrar la web por accidente.

## Si en algún momento quieres volver a subir a mano

Nada te lo impide: `npm run build` en `misterred360/` sigue generando
`dist/` igual que siempre, y puedes subirlo por FTP con FileZilla
como se explica en `GUIA-DESPLIEGUE-OVH.md`. El despliegue automático
y el manual conviven sin problema.
