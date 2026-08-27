import { marqueeItems } from "../lib/data";

/* ───────────────────────────────────────────────────────────
   Marquee · cinta roja con el ecosistema de servicios
   ─────────────────────────────────────────────────────────── */

export default function Marquee({
  reverse = false,
  className = "",
}: {
  reverse?: boolean;
  className?: string;
}) {
  const Row = ({ hidden }: { hidden?: boolean }) => (
    <div
      aria-hidden={hidden}
      className="flex shrink-0 items-center w-max"
    >
      {marqueeItems.map((item) => (
        <span key={item} className="flex items-center">
          <span className="font-display font-semibold uppercase tracking-[0.04em] text-xl md:text-2xl text-ink px-6 md:px-8 whitespace-nowrap">
            {item}
          </span>
          <span
            className="w-2.5 h-2.5 rotate-45 border-2 border-ink/70"
            aria-hidden="true"
          />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`relative z-20 -rotate-[1.3deg] scale-[1.02] bg-brand border-y-4 border-ink py-4 md:py-5 overflow-hidden shadow-[0_20px_60px_-20px_rgba(232,38,43,0.45)] ${className}`}
    >
      <div
        className={`flex w-max animate-marquee ${reverse ? "animate-marquee-reverse" : ""}`}
        style={{ ["--marquee-dur" as string]: "36s" }}
      >
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
