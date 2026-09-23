import { useState } from "react";
import { getClients } from "../lib/data";
import { useI18n } from "../lib/i18n";

/* ───────────────────────────────────────────────────────────
   Carrusel de logos de clientes: cinta con scroll infinito,
   misma mecánica que el Marquee de servicios (fila duplicada).
   ─────────────────────────────────────────────────────────── */

export default function ClientsCarousel() {
  const { locale } = useI18n();
  const { title, items } = getClients(locale);

  const Row = ({ hidden }: { hidden?: boolean }) => (
    <div aria-hidden={hidden} className="flex shrink-0 items-center gap-10 md:gap-16 px-5 md:px-8 w-max">
      {items.map((c, i) => (
        <ClientLogo key={i} name={c.name} src={c.logo} />
      ))}
    </div>
  );

  return (
    <section className="relative bg-paper border-y border-ink/10 py-12 md:py-16 overflow-hidden">
      <p className="px-5 md:px-10 xl:px-16 max-w-[1600px] mx-auto text-center md:text-left text-[11px] font-semibold uppercase tracking-[0.28em] text-ink/40 mb-9">
        {title}
      </p>
      <div className="marquee-mask">
        <div className="flex w-max animate-marquee" style={{ ["--marquee-dur" as string]: "30s" }}>
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}

function ClientLogo({ name, src }: { name: string; src: string }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  return (
    <div
      title={name}
      className={`flex h-20 md:h-24 w-44 md:w-56 shrink-0 items-center justify-center rounded-xl ${
        showPlaceholder ? "border border-dashed border-ink/20 bg-ink/[0.03]" : ""
      }`}
    >
      {showPlaceholder ? (
        <span className="text-center text-[9px] font-semibold uppercase leading-tight tracking-[0.1em] text-ink/35">
          {name}
        </span>
      ) : (
        <img
          src={src}
          alt={name}
          className="max-h-full max-w-full object-contain grayscale transition-all duration-300 hover:grayscale-0"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
