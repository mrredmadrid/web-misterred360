import type { ReactNode } from "react";

/* ───────────────────────────────────────────────────────────
   Primitivos para redactar páginas legales con estilo editorial
   ─────────────────────────────────────────────────────────── */

export function LegalSection({
  title,
  children,
  id,
}: {
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="border-t border-ink/10 pt-10 md:pt-12 mt-10 md:mt-14 first:mt-0 first:border-t-0 first:pt-0">
      <h2 className="font-display font-semibold uppercase leading-[1.02] text-[clamp(1.5rem,2.6vw,2.2rem)] mb-6">
        {title}
      </h2>
      <div className="space-y-4 text-[15px] md:text-base leading-relaxed text-ink/72 max-w-3xl">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span
            className="mt-2.5 w-1.5 h-1.5 rounded-full bg-brand shrink-0"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LegalTable({
  headers,
  rows,
  caption,
}: {
  headers: string[];
  rows: (string | ReactNode)[][];
  caption?: string;
}) {
  return (
    <div className="not-prose my-6 max-w-4xl">
      <div className="overflow-x-auto rounded-2xl border border-ink/12">
        <table className="w-full text-sm border-collapse">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="bg-ink text-paper">
              {headers.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="text-left font-semibold text-[10px] uppercase tracking-[0.18em] px-4 py-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className={`${ri % 2 ? "bg-ink/[0.02]" : "bg-white"} border-t border-ink/8`}
              >
                {row.map((cell, ci) => (
                  <td key={ci} className="align-top px-4 py-3.5 text-ink/75">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function LegalIdentity() {
  return (
    <dl className="grid sm:grid-cols-2 gap-4 rounded-2xl bg-ink/[0.04] border border-ink/10 p-6 not-italic">
      {[
        ["Razón social", "MR. RED S.L."],
        ["CIF", "B56916133"],
        ["Domicilio social", "Ciudadela 12 · Las Rozas de Madrid"],
        ["Correo electrónico (DPO/privacidad)", "misterred@misterred360.es"],
        ["Sitio web", "www.misterred360.es"],
      ].map(([term, def]) => (
        <div key={term}>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/45 mb-1">
            {term}
          </dt>
          <dd className="text-ink font-medium">{def}</dd>
        </div>
      ))}
    </dl>
  );
}
