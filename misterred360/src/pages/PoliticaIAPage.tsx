import PageShell from "../components/PageShell";
import { LegalIdentity, LegalList, LegalSection } from "../components/LegalContent";
import { useI18n } from "../lib/i18n";
import { SITE } from "../lib/seo";

/* ───────────────────────────────────────────────────────────
   Página · POLÍTICA DE USO DE LA IA
   Cumplimiento del Reglamento (UE) 2024/1689 (AI Act),
   el RGPD y la Ley Orgánica 3/2018 (LOPDGDD).
   ─────────────────────────────────────────────────────────── */

export default function PoliticaIAPage({
  onNavigate,
}: {
  onNavigate: (href: string) => void;
}) {
  const { t, locale } = useI18n();

  return (
    <PageShell
      index="§ 03"
      kicker="page.ia.kicker"
      title="page.ia.title"
      intro="page.ia.intro"
      meta={`${t("legal.updated")} · ${t("legal.updated.value")}`}
      seoTitle="page.ia.seo.title"
      seoDesc="page.ia.seo.desc"
      path="/politica-de-ia"
      breadcrumbs={[
        { name: "Inicio", path: "/" },
        { name: t("page.ia.kicker"), path: "/politica-de-ia" },
      ]}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${SITE}/politica-de-ia#policy`,
        name: t("page.ia.seo.title"),
        description: t("page.ia.seo.desc"),
        url: `${SITE}/politica-de-ia`,
        inLanguage: "es-ES",
        dateModified: "2026-07-01",
        publisher: { "@id": `${SITE}/#organizacion` },
        about: [
          {
            "@type": "Thing",
            name: "Reglamento (UE) 2024/1689 · AI Act",
          },
          {
            "@type": "Thing",
            name: "Reglamento (UE) 2016/679 · RGPD",
          },
          {
            "@type": "Thing",
            name: "Ley Orgánica 3/2018 · LOPDGDD",
          },
        ],
      }}
      onNavigate={onNavigate}
      hideCta
    >
      <section className="bg-paper text-ink">
        <div className="px-5 md:px-10 xl:px-16 py-16 md:py-24 max-w-[1100px] mx-auto">
          {locale === "en" && (
            <p className="rounded-2xl border border-ink/12 bg-ink/[0.03] p-5 text-sm leading-relaxed text-ink/70 mb-10">
              The full legal text of this AI use policy below is provided in Spanish, in
              accordance with Spanish and EU law (Regulation (EU) 2024/1689 · AI Act, GDPR
              and LOPDGDD). A summary in English is available on request at{" "}
              <a className="text-brand underline" href="mailto:misterred@misterred360.es">
                misterred@misterred360.es
              </a>
              .
            </p>
          )}

          {/* Aviso destacado */}
          <div className="rounded-[1.5rem] bg-ink text-paper p-6 md:p-8 mb-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand mb-3">
              Marco normativo aplicable
            </p>
            <h2 className="font-display font-semibold text-2xl md:text-3xl leading-tight">
              MISTERRED360 utiliza sistemas de inteligencia artificial de forma
              responsable, supervisada y conforme al AI Act.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-smoke max-w-2xl">
              Esta política declara cómo, cuándo y con qué garantías empleamos herramientas
              de IA en nuestros servicios de comunicación, marketing, contenido y
              relación con clientes. Se alinea con el <strong>Reglamento (UE) 2024/1689</strong>{" "}
              (AI Act), el <strong>RGPD</strong> y la <strong>LOPDGDD</strong>.
            </p>
          </div>

          <LegalSection title="1. Objeto y ámbito de aplicación">
            <p>
              La presente Política de uso de Inteligencia Artificial (en adelante, la
              «Política») regula la utilización, por parte de <strong>MR. RED S.L.</strong>{" "}
              (MISTERRED360), de sistemas de inteligencia artificial (IA) tanto en la
              prestación de sus servicios profesionales como en la operación del sitio web{" "}
              <strong>www.misterred360.es</strong>.
            </p>
            <p>
              Aplica a cualquier persona usuaria, cliente, proveedor o tercero que
              interactúe con MISTERRED360 o con sistemas de IA gestionados o desplegados
              por MISTERRED360, incluyendo asistentes conversacionales, herramientas de
              generación de contenido, análisis de datos y automatización de comunicaciones.
            </p>
          </LegalSection>

          <LegalSection title="2. Responsable">
            <LegalIdentity />
            <p className="mt-4 text-sm">
              MISTERRED360 actúa como <strong>responsable del despliegue</strong> (deployer)
              conforme al art. 3 del AI Act cuando incorpora sistemas de IA de terceros a
              su actividad profesional, y como <strong>proveedor</strong> cuando desarrolla
              sistemas propios.
            </p>
          </LegalSection>

          <LegalSection title="3. Principios rectores">
            <p>
              Todo uso de IA por parte de MISTERRED360 se rige por los siguientes
              principios, alineados con el art. 4 bis del AI Act y las directrices éticas
              del Grupo de Expertos de Alto Nivel de la Comisión Europea:
            </p>
            <LegalList
              items={[
                <>
                  <strong>Supervisión humana efectiva.</strong> Ningún resultado generado por
                  IA se entrega al cliente ni se publica sin revisión humana previa por
                  parte del equipo profesional de MISTERRED360.
                </>,
                <>
                  <strong>Transparencia.</strong> Informamos con claridad cuándo un
                  contenido, comunicación o interacción ha sido asistido o generado con IA.
                </>,
                <>
                  <strong>Proporcionalidad y minimización de datos.</strong> Solo se
                  utilizan datos estrictamente necesarios para la finalidad concreta, y no
                  se introducen datos personales sensibles en herramientas de IA de
                  terceros sin base legítima y garantías adecuadas.
                </>,
                <>
                  <strong>Seguridad y confidencialidad.</strong> Se aplican medidas técnicas
                  y organizativas para proteger la información introducida en sistemas de
                  IA, especialmente la información confidencial de clientes.
                </>,
                <>
                  <strong>No discriminación.</strong> Rechazamos usos de IA que puedan
                  generar sesgos discriminatorios injustificados o vulnerar derechos
                  fundamentales.
                </>,
                <>
                  <strong>Trazabilidad.</strong> Documentamos internamente qué sistemas de
                  IA se utilizan en cada proyecto, con qué finalidad y con qué medidas de
                  supervisión.
                </>,
              ]}
            />
          </LegalSection>

          <LegalSection title="4. Casos de uso permitidos">
            <p>
              MISTERRED360 emplea herramientas de IA únicamente para tareas de apoyo a la
              labor profesional, dentro de las siguientes categorías:
            </p>
            <LegalList
              items={[
                "Redacción asistida y edición de contenidos (borradores, sinopsis, propuestas creativas y variantes).",
                "Traducción y adaptación lingüística de textos.",
                "Análisis de datos, monitorización de medios y escucha social.",
                "Generación de imágenes, ilustraciones y elementos gráficos de apoyo, siempre revisados por el equipo creativo.",
                "Transcripción de audio y vídeo, subtitulado y accesibilidad.",
                "Investigación exploratoria, estudios de mercado y síntesis de fuentes públicas.",
                "Automatización de tareas internas de organización y flujos de trabajo.",
              ]}
            />
          </LegalSection>

          <LegalSection title="5. Usos expresamente excluidos">
            <p>
              MISTERRED360 no utiliza sistemas de IA para ninguna de las prácticas
              prohibidas por el <strong>art. 5 del AI Act</strong> ni para finalidades que
              vulneren derechos fundamentales. En particular, no emplea IA para:
            </p>
            <LegalList
              items={[
                "Manipulación subliminal o técnicas que distorsionen materialmente el comportamiento de personas causándoles perjuicio.",
                "Explotación de vulnerabilidades por edad, discapacidad o situación socioeconómica.",
                "Clasificación social (social scoring) de personas físicas.",
                "Categorización biométrica basada en datos sensibles (origen racial, opiniones políticas, creencias, orientación sexual, etc.).",
                "Reconocimiento facial en tiempo real en espacios públicos.",
                "Predicción individual de riesgo de comisión de delitos.",
                "Detección de emociones en el ámbito laboral o educativo.",
              ]}
            />
          </LegalSection>

          <LegalSection title="6. Clasificación de riesgo">
            <p>
              Los sistemas de IA utilizados actualmente por MISTERRED360 se clasifican,
              conforme al AI Act, como sistemas de <strong>riesgo limitado</strong> o{" "}
              <strong>riesgo mínimo</strong>. Esto incluye:
            </p>
            <LegalList
              items={[
                "Modelos generativos de texto e imagen de propósito general (asistentes conversacionales, herramientas de creación de contenido).",
                "Herramientas de análisis y organización sin toma de decisiones automatizada con efectos jurídicos significativos sobre las personas.",
              ]}
            />
            <p>
              MISTERRED360 no despliega sistemas de <strong>alto riesgo</strong> en el
              sentido del Anexo III del AI Act. En caso de que un servicio futuro requiera
              incorporarlos, se aplicarán los requisitos reforzados (gestión de riesgos,
              gobernanza de datos, documentación técnica, supervisión humana, registro y
              trazabilidad).
            </p>
          </LegalSection>

          <LegalSection title="7. Transparencia frente al usuario">
            <p>
              En cumplimiento del <strong>art. 50 del AI Act</strong> (obligaciones de
              transparencia):
            </p>
            <LegalList
              items={[
                "Cuando el usuario interactúe con un sistema de IA (por ejemplo, un chatbot), se identificará como tal salvo que resulte evidente.",
                "Los contenidos generados o modificados de forma sustancial mediante IA (imágenes, audio, vídeo o texto de larga extensión con relevancia informativa) se etiquetarán o mencionarán como tales cuando la normativa así lo exija.",
                "El usuario podrá solicitar en cualquier momento información sobre el uso de IA en la comunicación recibida, escribiendo a misterred@misterred360.es.",
              ]}
            />
          </LegalSection>

          <LegalSection title="8. Datos personales e IA">
            <p>
              El tratamiento de datos personales asociado al uso de IA se rige por nuestra{" "}
              <button
                className="text-brand underline"
                onClick={() => onNavigate("#/politica-de-privacidad")}
              >
                política de privacidad
              </button>{" "}
              y por el RGPD. Como reglas específicas:
            </p>
            <LegalList
              items={[
                "No se introducen datos personales identificativos en herramientas de IA públicas sin base legal adecuada y garantías equivalentes (encargo del tratamiento, cláusulas contractuales tipo o decisión de adecuación).",
                "Se prioriza el uso de entornos empresariales de IA con políticas de no-retención y no-entrenamiento con datos de cliente.",
                "El usuario puede ejercer sus derechos RGPD (acceso, rectificación, supresión, oposición, limitación y portabilidad) sobre cualquier dato tratado por sistemas de IA gestionados por MISTERRED360.",
                "No se realiza toma de decisiones automatizada con efectos jurídicos significativos sobre personas físicas basada exclusivamente en IA (art. 22 RGPD).",
              ]}
            />
          </LegalSection>

          <LegalSection title="9. Propiedad intelectual y contenidos generados con IA">
            <p>
              Todo contenido generado o coasistido con IA que MISTERRED360 entregue a un
              cliente ha sido revisado, seleccionado y aprobado por profesionales humanos.
              Los derechos y las licencias de uso se articulan mediante contrato entre las
              partes.
            </p>
            <p>
              MISTERRED360 vela por no incorporar en sus entregables contenidos que
              vulneren derechos de propiedad intelectual o industrial de terceros, y
              aplica controles razonables para minimizar el riesgo de reproducción no
              autorizada por parte de sistemas generativos.
            </p>
          </LegalSection>

          <LegalSection title="10. Alfabetización y gobernanza interna">
            <p>
              Conforme al <strong>art. 4 del AI Act</strong>, MISTERRED360 asegura un nivel
              adecuado de alfabetización en materia de IA de las personas que utilizan
              estas herramientas en nombre de la agencia, mediante:
            </p>
            <LegalList
              items={[
                "Formación continua del equipo en uso responsable de IA generativa y en normativa aplicable.",
                "Protocolos internos de revisión editorial, verificación de fuentes y control de calidad.",
                "Registro interno de proveedores y herramientas de IA autorizadas.",
                "Punto de contacto interno para consultas y reporte de incidencias relacionadas con IA.",
              ]}
            />
          </LegalSection>

          <LegalSection title="11. Derechos del usuario">
            <p>El usuario tiene derecho, en cualquier momento, a:</p>
            <LegalList
              items={[
                "Solicitar información sobre si un contenido o comunicación específica ha sido generado o asistido con IA.",
                "Solicitar la revisión humana de cualquier resultado que le afecte directamente.",
                "Oponerse a determinados tratamientos automatizados de sus datos.",
                "Presentar reclamaciones ante la autoridad nacional competente en materia de IA cuando esté designada, o ante la Agencia Española de Protección de Datos (AEPD) para cuestiones de datos personales.",
              ]}
            />
            <p>
              Para ejercer estos derechos:{" "}
              <a href="mailto:misterred@misterred360.es" className="text-brand underline">
                misterred@misterred360.es
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title="12. Proveedores y terceros">
            <p>
              MISTERRED360 selecciona proveedores de IA con arreglo a criterios de
              seguridad, transparencia, cumplimiento normativo y respeto a la propiedad
              intelectual. Antes de incorporar un nuevo sistema evaluamos, entre otros
              aspectos: base jurídica del tratamiento, ubicación del procesamiento,
              políticas de retención y entrenamiento, medidas de seguridad, mecanismos de
              gobernanza y trazabilidad, y compatibilidad con el AI Act.
            </p>
          </LegalSection>

          <LegalSection title="13. Actualizaciones">
            <p>
              MISTERRED360 podrá modificar esta Política para adaptarla a la evolución
              normativa (calendario de aplicación del AI Act), a los sistemas de IA
              utilizados o a nuevas prácticas del sector. En caso de modificaciones
              sustanciales, se informará a través del sitio web.
            </p>
            <p className="text-sm text-ink/45">
              {t("legal.updated")}: {t("legal.updated.value")}.
            </p>
          </LegalSection>
        </div>
      </section>
    </PageShell>
  );
}
