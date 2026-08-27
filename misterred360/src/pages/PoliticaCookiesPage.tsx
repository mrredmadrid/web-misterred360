import { Settings } from "lucide-react";
import PageShell from "../components/PageShell";
import { LegalIdentity, LegalList, LegalSection, LegalTable } from "../components/LegalContent";
import { useCookies } from "../lib/cookies";
import { useI18n } from "../lib/i18n";
import { SITE } from "../lib/seo";

/* ───────────────────────────────────────────────────────────
   Página · POLÍTICA DE COOKIES (RGPD / LSSI 22.2 / AEPD 2024)
   ─────────────────────────────────────────────────────────── */

export default function PoliticaCookiesPage({
  onNavigate,
}: {
  onNavigate: (href: string) => void;
}) {
  const { openPanel, reset } = useCookies();
  const { t, locale } = useI18n();

  return (
    <PageShell
      index="§ 02"
      kicker="page.cook.kicker"
      title="page.cook.title"
      intro="page.cook.intro"
      meta={`${t("legal.updated")} · ${t("legal.updated.value")}`}
      seoTitle="page.cook.seo.title"
      seoDesc="page.cook.seo.desc"
      path="/politica-de-cookies"
      breadcrumbs={[
        { name: "Inicio", path: "/" },
        { name: t("page.cook.kicker"), path: "/politica-de-cookies" },
      ]}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${SITE}/politica-de-cookies#policy`,
        name: t("page.cook.seo.title"),
        description: t("page.cook.seo.desc"),
        url: `${SITE}/politica-de-cookies`,
        inLanguage: "es-ES",
        dateModified: "2026-07-01",
        publisher: { "@id": `${SITE}/#organizacion` },
      }}
      onNavigate={onNavigate}
      hideCta
    >
      <section className="bg-paper text-ink">
        <div className="px-5 md:px-10 xl:px-16 py-16 md:py-24 max-w-[1100px] mx-auto">
          {/* Acciones rápidas del panel de consentimiento */}
          <div className="rounded-[1.5rem] bg-ink text-paper p-6 md:p-8 mb-14 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand mb-2">
                {t("page.cook.panel.kicker")}
              </p>
              <h2 className="font-display font-semibold text-2xl leading-tight">
                {t("page.cook.panel.title")}
              </h2>
              <p className="mt-2 text-sm text-smoke max-w-md">
                {t("page.cook.panel.desc")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={openPanel}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-flame transition-colors"
              >
                <Settings className="w-4 h-4" />
                {t("page.cook.panel.configure")}
              </button>
              <button
                onClick={reset}
                className="rounded-full border border-white/20 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper hover:border-brand hover:text-brand transition-colors"
              >
                {t("page.cook.panel.reset")}
              </button>
            </div>
          </div>

          {locale === "en" && (
            <p className="rounded-2xl border border-ink/12 bg-ink/[0.03] p-5 text-sm leading-relaxed text-ink/70 mb-10">
              The full legal text of this cookie policy below is provided in Spanish, in accordance with Spanish law (LSSI and GDPR). A summary in English is available on request at{" "}
              <a className="text-brand underline" href="mailto:misterred@misterred360.es">
                misterred@misterred360.es
              </a>
              .
            </p>
          )}

          <LegalSection title="¿Qué son las cookies?">
            <p>
              Una cookie es un fichero de pequeño tamaño que los sitios web envían al navegador
              del usuario y se almacenan en el terminal (ordenador, smartphone, tableta). Su
              función es recordar información sobre la visita, facilitar la navegación y
              posibilitar determinadas funcionalidades.
            </p>
            <p>
              Conforme al artículo <strong>22.2 de la Ley 34/2002, de 11 de julio, de
              Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI)</strong>,
              en relación con el <strong>Reglamento (UE) 2016/679 (RGPD)</strong> y la{" "}
              <strong>Ley Orgánica 3/2018 (LOPDGDD)</strong>, el uso de cookies que impliquen
              tratamiento de datos personales o el acceso a información almacenada en el
              terminal del usuario requiere el <em>consentimiento previo, libre, específico,
              informado e inequívoco</em> del usuario.
            </p>
          </LegalSection>

          <LegalSection title="Responsable del tratamiento">
            <LegalIdentity />
          </LegalSection>

          <LegalSection title="Tipos de cookies utilizadas">
            <h3 className="font-display font-semibold text-lg text-ink mt-2">
              Por su titularidad
            </h3>
            <LegalTable
              headers={["Tipo", "Descripción"]}
              rows={[
                [
                  "Cookies propias",
                  "Emitidas y gestionadas directamente por MISTERRED360 desde su propio servidor.",
                ],
                [
                  "Cookies de terceros",
                  "Emitidas y gestionadas por empresas externas (p. ej., Google, Meta, YouTube) que prestan servicios solicitados por MISTERRED360.",
                ],
              ]}
            />

            <h3 className="font-display font-semibold text-lg text-ink mt-8">Por su finalidad</h3>
            <LegalTable
              headers={["Categoría", "¿Requiere consentimiento?", "Descripción"]}
              rows={[
                [
                  "Técnicas o estrictamente necesarias",
                  "No",
                  "Imprescindibles para la navegación y el funcionamiento básico del sitio. No pueden desactivarse.",
                ],
                [
                  "Preferencias o personalización",
                  "Sí",
                  "Recuerdan las opciones elegidas por el usuario (idioma, región, ajustes visuales).",
                ],
                [
                  "Analítica o estadística",
                  "Sí",
                  "Contabilizan visitas y miden el rendimiento del sitio para mejorarlo (p. ej., Google Analytics).",
                ],
                [
                  "Marketing o publicidad comportamental",
                  "Sí",
                  "Recogen información del comportamiento del usuario para mostrar publicidad personalizada.",
                ],
              ]}
            />

            <h3 className="font-display font-semibold text-lg text-ink mt-8">Por su duración</h3>
            <LegalTable
              headers={["Tipo", "Descripción"]}
              rows={[
                ["Cookies de sesión", "Se eliminan automáticamente al cerrar el navegador."],
                [
                  "Cookies persistentes",
                  "Permanecen almacenadas durante un periodo determinado (indicado en la tabla de cookies).",
                ],
              ]}
            />
          </LegalSection>

          <LegalSection title="Tabla de cookies utilizadas">
            <p>
              A continuación se detallan las cookies que pueden instalarse en el sitio web{" "}
              <strong>www.misterred360.es</strong>:
            </p>
            <LegalTable
              headers={["Nombre", "Titular", "Finalidad", "Tipo", "Duración"]}
              rows={[
                [
                  "mr360.cookie-consent.v1",
                  "MISTERRED360",
                  "Almacena tu elección de consentimiento de cookies.",
                  "Técnica / Propia",
                  "1 año",
                ],
                [
                  "_ga",
                  "Google Analytics",
                  "Análisis estadístico — distingue usuarios únicos.",
                  "Analítica / Terceros",
                  "2 años",
                ],
                [
                  "_ga_XXXX",
                  "Google Analytics",
                  "Análisis estadístico — persistencia de sesión.",
                  "Analítica / Terceros",
                  "2 años",
                ],
                [
                  "_gid",
                  "Google Analytics",
                  "Análisis estadístico — identifica sesión.",
                  "Analítica / Terceros",
                  "24 horas",
                ],
                [
                  "_fbp",
                  "Meta (Facebook)",
                  "Seguimiento publicitario / pixel de conversión.",
                  "Marketing / Terceros",
                  "3 meses",
                ],
              ]}
            />
            <p className="text-sm text-ink/55">
              Esta tabla se actualiza cada vez que se añaden, modifican o eliminan cookies del
              sitio web.
            </p>
          </LegalSection>

          <LegalSection title="Panel de gestión del consentimiento">
            <p>
              En la primera visita al sitio web, MISTERRED360 muestra al usuario un banner de
              cookies con las siguientes opciones claramente accesibles y de igual prominencia
              visual:
            </p>
            <LegalList
              items={[
                <>
                  <strong>Aceptar todas las cookies.</strong>
                </>,
                <>
                  <strong>Rechazar todas las cookies</strong> (excepto las técnicas).
                </>,
                <>
                  <strong>Configurar mis preferencias</strong> (consentimiento granular por
                  categoría).
                </>,
              ]}
            />
            <p>
              De conformidad con la Guía de Cookies de la AEPD (actualizada en mayo de 2024),
              el botón de rechazo está disponible en la primera capa del panel, con la misma
              accesibilidad y prominencia visual que el botón de aceptación.
            </p>
            <p>
              El consentimiento prestado puede ser <strong>revocado en cualquier momento</strong>,
              sin coste ni perjuicio para el usuario, desde el enlace «Preferencias de cookies»
              del pie de página o desde esta misma página.
            </p>
          </LegalSection>

          <LegalSection title="Cookies de terceros">
            <p>
              Algunos servicios integrados en el sitio web pueden instalar cookies gestionadas
              por terceros. MISTERRED360 no tiene control sobre dichas cookies una vez que han
              sido aceptadas por el usuario. Los principales terceros son:
            </p>
            <LegalTable
              headers={["Proveedor", "Finalidad", "Política de privacidad"]}
              rows={[
                [
                  "Google Analytics",
                  "Análisis estadístico",
                  <a
                    key="ga"
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand underline"
                  >
                    policies.google.com/privacy
                  </a>,
                ],
                [
                  "Google Maps",
                  "Integración de mapas",
                  <a
                    key="gm"
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand underline"
                  >
                    policies.google.com/privacy
                  </a>,
                ],
                [
                  "Meta (Facebook / Instagram)",
                  "Pixel de seguimiento publicitario",
                  <a
                    key="meta"
                    href="https://www.facebook.com/privacy/policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand underline"
                  >
                    facebook.com/privacy/policy
                  </a>,
                ],
                [
                  "YouTube",
                  "Vídeos incrustados",
                  <a
                    key="yt"
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand underline"
                  >
                    policies.google.com/privacy
                  </a>,
                ],
              ]}
            />
          </LegalSection>

          <LegalSection title="Cómo gestionar las cookies desde el navegador">
            <p>
              Independientemente del consentimiento prestado en el panel, el usuario puede
              configurar, bloquear o eliminar las cookies directamente desde la configuración
              de su navegador:
            </p>
            <LegalList
              items={[
                <>
                  <strong>Google Chrome:</strong>{" "}
                  <a
                    className="text-brand underline"
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    support.google.com/chrome/answer/95647
                  </a>
                </>,
                <>
                  <strong>Mozilla Firefox:</strong>{" "}
                  <a
                    className="text-brand underline"
                    href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    support.mozilla.org
                  </a>
                </>,
                <>
                  <strong>Safari:</strong>{" "}
                  <a
                    className="text-brand underline"
                    href="https://support.apple.com/es-es/guide/safari/sfri11471"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    support.apple.com
                  </a>
                </>,
                <>
                  <strong>Microsoft Edge:</strong>{" "}
                  <a
                    className="text-brand underline"
                    href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    support.microsoft.com
                  </a>
                </>,
                <>
                  <strong>Opera:</strong>{" "}
                  <a
                    className="text-brand underline"
                    href="https://help.opera.com/en/latest/web-preferences/#cookies"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    help.opera.com
                  </a>
                </>,
              ]}
            />
            <p className="text-sm text-ink/55">
              ⚠️ La desactivación de determinadas cookies puede afectar al correcto
              funcionamiento de algunas secciones del sitio.
            </p>
          </LegalSection>

          <LegalSection title="Transferencias internacionales">
            <p>
              Algunos terceros proveedores de cookies (como Google o Meta) pueden realizar
              transferencias de datos fuera del Espacio Económico Europeo. Dichas
              transferencias se amparan en las <em>Decisiones de Adecuación</em> de la Comisión
              Europea o en las <em>Cláusulas Contractuales Tipo</em> aprobadas por la Comisión,
              conforme al art. 46 del RGPD.
            </p>
          </LegalSection>

          <LegalSection title="Actualizaciones de la política">
            <p>
              MISTERRED360 puede modificar esta Política de Cookies en función de nuevas
              exigencias legislativas, reglamentarias, jurisprudenciales o por cambios en los
              servicios ofrecidos. En caso de modificaciones sustanciales, se informará al
              usuario mediante aviso visible en el sitio. La fecha de última actualización
              aparece al pie del documento.
            </p>
          </LegalSection>

          <LegalSection title="Información adicional">
            <p>
              Para cualquier consulta relacionada con el tratamiento de datos personales a
              través de cookies:
            </p>
            <LegalList
              items={[
                <>
                  📧{" "}
                  <a
                    className="text-brand underline"
                    href="mailto:misterred@misterred360.es"
                  >
                    misterred@misterred360.es
                  </a>
                </>,
                <>
                  🌐 Política de privacidad:{" "}
                  <button
                    className="text-brand underline"
                    onClick={() => onNavigate("#/politica-de-privacidad")}
                  >
                    misterred360.es/politica-de-privacidad
                  </button>
                </>,
              ]}
            />
            <p className="text-sm text-ink/45">
              {t("legal.updated")}: {t("legal.updated.value")}.
            </p>
          </LegalSection>
        </div>
      </section>
    </PageShell>
  );
}
