import { useState, type ImgHTMLAttributes } from "react";

/* ───────────────────────────────────────────────────────────
   CastImage · imagen del elenco con fallback automático
   - Si la variante femenina (-f.jpg) no existe, carga la
     versión masculina equivalente sin romper el diseño.
   - Aplica por defecto object-position="center 22%" para que
     la cara del personaje quede siempre visible aunque el
     contenedor recorte por arriba o por abajo (fundamental
     en móvil con aspect ratios verticales).
   ─────────────────────────────────────────────────────────── */

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string;
}

export default function CastImage({ src, alt, className, style, ...rest }: Props) {
  const [current, setCurrent] = useState(src);

  const handleError = () => {
    if (current.includes("-f.")) {
      setCurrent(current.replace("-f.", "."));
    }
  };

  return (
    <img
      src={current}
      alt={alt}
      onError={handleError}
      className={className}
      style={{ objectPosition: "center 22%", ...style }}
      {...rest}
    />
  );
}
