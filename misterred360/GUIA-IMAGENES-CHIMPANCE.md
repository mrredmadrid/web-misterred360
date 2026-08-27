# MISTERRED360 · Guía de imágenes del chimpancé

El elenco representa 8 versiones del personaje corporativo alternando
sexo masculino y femenino, reflejando la diversidad real del equipo.
Todas las imágenes comparten dirección visual: **traje sastre negro/carbón,
luz rim rojo carmesí + azul acero, fondo studio oscuro, formato editorial
premium, 85mm cinematográfico, jamás caricaturesco**.

---

## 1 · Reparto actual (8 papeles · 4♂ + 4♀)

| # | Rol | Género | Archivo esperado |
| --- | --- | --- | --- |
| 01 | El Icono · Marca | ♂ | `/images/chimp-hero.jpg` ✅ existe |
| 02 | El Portavoz · Prensa | ♀ | `/images/chimp-press-f.jpg` ⏳ pendiente |
| 03 | El Estratega · Planificación | ♀ | `/images/chimp-strategy-f.jpg` ⏳ pendiente |
| 04 | El Anfitrión · Eventos | ♂ | `/images/chimp-events.jpg` ✅ existe |
| 05 | La Diseñadora · Identidad | ♀ | `/images/chimp-brand-f.jpg` ⏳ pendiente |
| 06 | El Director · Audiovisual | ♂ | `/images/chimp-av.jpg` ✅ existe |
| 07 | La Publicista · Marketing | ♀ | `/images/chimp-ads-f.jpg` ⏳ pendiente |
| 08 | El Analista · Datos | ♂ | `/images/chimp-data.jpg` ✅ existe |

**Cómo funciona el fallback:** la web usa el componente `<CastImage>` que
carga automáticamente la versión masculina equivalente si el archivo `-f.jpg`
todavía no existe. Así podéis desplegar los cambios ahora y las nuevas fotos
se activan solas en cuanto las subáis a `public/images/`.

---

## 2 · Prompts exactos para generar cada foto femenina

Copia y pega en la herramienta de IA que prefieras (Midjourney, DALL·E, ChatGPT
con GPT-4o Image, etc.). Formato objetivo: **vertical 4:5**, JPG optimizado
para web (≈ 400–800 kB).

### 2.1 · `/images/chimp-press-f.jpg` · La Portavoz

> Photorealistic cinematic editorial portrait. A female chimpanzee in a
> perfectly tailored charcoal grey pantsuit with a crisp white silk blouse,
> small red earrings, standing authoritatively at a podium covered with
> professional press conference microphones. One hand raised mid-statement,
> confident intelligent expression. Dark studio background with subtle
> out-of-focus press wall logos, dramatic crimson red rim light from the
> side, cool steel blue fill light. Sharp 85mm lens, shallow depth of field.
> Confident female spokesperson, sophisticated corporate brand ambassador,
> editorial press photography style, vertical composition. Feminine but
> powerful, absolutely never cartoonish. High-end fashion editorial quality.

### 2.2 · `/images/chimp-strategy-f.jpg` · La Estratega

> Photorealistic cinematic editorial photograph. A female chimpanzee in a
> sophisticated black tailored blazer over a fine burgundy silk top, delicate
> red rimmed designer glasses, seated at a black polished designer desk in a
> moody dark office at night. Chin resting elegantly on one hand in a
> thoughtful strategist pose, studying printed strategy documents and charts.
> Warm brass desk lamp glow on one side and cool blue monitor glow on the
> other. Shallow depth of field, 85mm cinematic look. Intelligent female
> strategic mastermind, sophisticated, serious, editorial advertising
> photography style. Never cartoonish, never cute. Premium corporate portrait.

### 2.3 · `/images/chimp-brand-f.jpg` · La Diseñadora

> Photorealistic cinematic editorial photograph. A female chimpanzee creative
> director in an elegant black turtleneck under a structured tailored blazer,
> sleeves rolled up, standing sideways in front of a wall covered with brand
> identity moodboards, typography posters and printed red and blue color
> palettes. Holding a red pencil and analyzing the wall with a critical
> creative eye. Dark atmospheric creative studio, dramatic red rim light and
> subtle blue ambient light, shallow depth of field, 85mm. Sophisticated
> female design mastermind of a premium branding agency, editorial style.
> Confident, elegant, absolutely never cartoonish or cute.

### 2.4 · `/images/chimp-ads-f.jpg` · La Publicista

> Photorealistic cinematic editorial photograph. Dynamic low angle shot of a
> female chimpanzee in a sharp tailored black pantsuit with a bold red silk
> scarf, powerfully speaking into a bold glossy red megaphone with energetic
> commanding presence. Deep black studio background, strong crimson red rim
> light, punchy blue accent edge light, high contrast dramatic advertising
> campaign photography, sharp 85mm. Bold, iconic and charismatic female
> publicist of a premium marketing agency, sophisticated editorial style.
> Confident female energy, never cartoonish, never cute, never comedic.

---

## 3 · Buenas prácticas técnicas

- **Resolución mínima**: 1200 × 1500 px (4:5). Ideal 1600 × 2000.
- **Formato**: JPG con calidad 82–86 %. Peso objetivo 300–700 kB por imagen.
- **Recorte**: dejar espacio arriba y abajo para que la máscara circular del
  elenco no corte cabezas ni pies.
- **Coherencia**: usa siempre el mismo prompt-base ("Photorealistic cinematic
  editorial photograph… crimson red rim light + steel blue fill light… 85mm…
  never cartoonish"). Cambia solo el sujeto, la pose y el vestuario.
- **Rechazar** cualquier imagen que salga con estética cómica, ojos
  exagerados o pose "de peluche". La marca es corporativa premium.

---

## 4 · Cómo cambiar la alternancia

El campo `gender` de cada miembro del elenco vive en `src/lib/data.ts`:

```ts
{ id: "portavoz", image: "/images/chimp-press-f.jpg", gender: "f" },
```

Si algún día queréis girar la asignación (por ejemplo, hacer que El Analista
sea mujer), basta con:

1. Cambiar `image` al archivo correspondiente (crea/genera la nueva foto).
2. Cambiar `gender` a `"f"` o `"m"` según toque.

El componente `<CastImage>` gestiona el fallback y el badge `♀/♂` se
actualiza solo.

---

## 5 · Recursos futuros

Si en el futuro grabáis fotos reales del equipo humano y queréis
sustituir el elenco chimpancé por el equipo real:

- Mantened la misma **dirección de arte** (traje negro, fondo carbón,
  luz rim roja + azul).
- Usad el mismo **componente `CastImage`** y estructura de datos.
- La web soporta indistintamente ambos sujetos: la ilustración con
  chimpancés y la fotografía real. Basta con reemplazar las URLs de
  `image` en `castMembers`.
