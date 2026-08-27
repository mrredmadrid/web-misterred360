# 🚨 Acción manual: sustituir 4 fotos del elenco por las versiones femeninas

El código de la web **ya está preparado y funcionando** para mostrar 4 chimpancés
mujeres alternadas con 4 chimpancés hombres. Solo hace falta que subas los 4
archivos con los **nombres exactos** que el código espera.

---

## 📁 Cómo hacerlo (1 minuto)

Coloca las 4 fotos femeninas que has generado dentro de la carpeta
`public/images/` de este proyecto, respetando **estos nombres exactos** (con la
`-f` al final, minúsculas, extensión `.jpg`):

| Rol en el elenco | Archivo a subir |
| --- | --- |
| **La Portavoz** · Prensa | `public/images/chimp-press-f.jpg` |
| **La Estratega** · Planificación | `public/images/chimp-strategy-f.jpg` |
| **La Diseñadora** · Identidad | `public/images/chimp-brand-f.jpg` |
| **La Publicista** · Marketing | `public/images/chimp-ads-f.jpg` |

Después ejecuta:

```bash
npm run build
```

Y sube la carpeta `dist/` al servidor OVH. Ya está.

---

## 🎯 Resultado en el elenco

Una vez subidas, la sección "El Personaje" mostrará esta alternancia
oficial (4 hombres · 4 mujeres):

| # | Rol | Género | Archivo que carga |
| --- | --- | --- | --- |
| 01 | El Icono · Marca | ♂ | `chimp-hero.jpg` (ya existe) |
| 02 | **La Portavoz · Prensa** | ♀ | `chimp-press-f.jpg` ← nueva |
| 03 | **La Estratega · Planificación** | ♀ | `chimp-strategy-f.jpg` ← nueva |
| 04 | El Anfitrión · Eventos | ♂ | `chimp-events.jpg` (ya existe) |
| 05 | **La Diseñadora · Identidad** | ♀ | `chimp-brand-f.jpg` ← nueva |
| 06 | El Director · Audiovisual | ♂ | `chimp-av.jpg` (ya existe) |
| 07 | **La Publicista · Marketing** | ♀ | `chimp-ads-f.jpg` ← nueva |
| 08 | El Analista · Datos | ♂ | `chimp-data.jpg` (ya existe) |

Los roles en femenino ya están traducidos en la web (español e inglés), y el
badge `♀` aparece automáticamente en la esquina superior derecha de cada foto
femenina.

---

## 💡 ¿Por qué ahora se ven solo hombres?

Porque el componente `CastImage` tiene un **fallback automático**: si el
archivo `-f.jpg` no está en el servidor, carga la versión masculina
equivalente para que la web nunca aparezca rota. En cuanto los 4 archivos
femeninos existan en `public/images/`, se activan automáticamente sin tocar
nada más en el código.

---

## 📐 Especificaciones técnicas de las fotos

Para que encajen perfecto con las masculinas y no se corten:

- **Formato**: JPG (no PNG, no WebP).
- **Proporción**: **vertical 4:5** (ideal 1200×1500 px o 1600×2000 px).
- **Peso**: 300–700 kB por archivo (comprime con TinyJPG o Squoosh si son
  más grandes).
- **Encuadre**: la cara del chimpancé debe estar en el **tercio superior**
  de la foto (así el `object-position: center 22%` del código la deja
  centrada al recortarse en móviles).
- **Estilo**: coherente con las masculinas — traje sastre, luz rim
  roja/azul, fondo carbón.

Si tus fotos tienen otras dimensiones o pesan mucho, cualquier editor
(Photoshop, GIMP, Photopea online) te permite redimensionarlas y guardarlas
como JPG en 30 segundos.

---

## ❓ Verificación rápida después de subir

1. En local: `npm run dev` → visita la sección "El Personaje" y comprueba
   que las cuatro fichas 02, 03, 05 y 07 llevan mujer + badge `♀`.
2. Si aún ves hombres, revisa que los archivos estén escritos exactamente
   como en la tabla (mayúsculas/minúsculas cuentan) y que la extensión sea
   `.jpg` (no `.jpeg`, no `.JPG`).
3. Cuando esté bien en local, `npm run build` + subir `dist/` a OVH.
