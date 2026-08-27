import PageShell from "../components/PageShell";
import { LegalIdentity, LegalList, LegalSection } from "../components/LegalContent";
import { useI18n } from "../lib/i18n";
import { SITE } from "../lib/seo";

/* ───────────────────────────────────────────────────────────
   Página · POLÍTICA DE PRIVACIDAD (RGPD / LOPDGDD / LSSI)
   ─────────────────────────────────────────────────────────── */

export default function PoliticaPrivacidadPage({
  onNavigate,
}: {
  onNavigate: (href: string) => void;
}) {
  const { t, locale } = useI18n();
  return (
    <PageShell
      index="§ 01"
      kicker="page.priv.kicker"
      title="page.priv.title"
      intro="page.priv.intro"
      meta={`${t("legal.updated")} · ${t("legal.updated.value")}`}
      seoTitle="page.priv.seo.title"
      seoDesc="page.priv.seo.desc"
      path="/politica-de-privacidad"
      breadcrumbs={[
        { name: "Inicio", path: "/" },
        { name: t("page.priv.kicker"), path: "/politica-de-privacidad" },
      ]}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "PrivacyPolicy",
        "@id": `${SITE}/politica-de-privacidad#policy`,
        name: t("page.priv.seo.title"),
        description: t("page.priv.seo.desc"),
        url: `${SITE}/politica-de-privacidad`,
        inLanguage: "es-ES",
        dateModified: "2026-07-01",
        publisher: { "@id": `${SITE}/#organizacion` },
      }}
      onNavigate={onNavigate}
      hideCta
    >
      <section className="bg-paper text-ink">
        <div className="px-5 md:px-10 xl:px-16 py-16 md:py-24 max-w-[1100px] mx-auto">
          {locale === "en" && (
            <p className="rounded-2xl border border-ink/12 bg-ink/[0.03] p-5 text-sm leading-relaxed text-ink/70 mb-10">
              The full legal text of this privacy policy is provided in Spanish, in accordance with Spanish law (GDPR and LOPDGDD). A summary in English is available on request at{" "}
              <a className="text-brand underline" href="mailto:misterred@misterred360.es">
                misterred@misterred360.es
              </a>
              .
            </p>
          )}
          <LegalSection title="Protección de datos de carácter personal">
            <p>
              <strong>MISTERRED360</strong>, en aplicación de la normativa vigente en materia de
              protección de datos de carácter personal, y en cumplimiento del{" "}
              <strong>Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de
              abril de 2016</strong> (RGPD) y de la <strong>Ley Orgánica 3/2018, de 5 de
              diciembre, de Protección de Datos Personales y garantía de los derechos
              digitales</strong> (LOPDGDD), informa que los datos personales recabados a través
              de los formularios del sitio web <strong>www.misterred360.es</strong> son
              incorporados y tratados en los sistemas de información titularidad de
              MISTERRED360.
            </p>
            <p>
              La recogida y el tratamiento de los datos de carácter personal tiene como
              finalidad el mantenimiento de la relación comercial y el desempeño de tareas de
              información, asesoramiento y otras actividades propias de MISTERRED360.
            </p>
            <p>
              Estos datos únicamente serán cedidos a aquellas entidades estrictamente
              necesarias para dar cumplimiento a las finalidades descritas en la presente
              política, o cuando exista obligación legal para ello.
            </p>
            <p>
              MISTERRED360 adopta las medidas técnicas y organizativas necesarias para
              garantizar la seguridad, integridad y confidencialidad de los datos personales,
              conforme al artículo 32 del RGPD.
            </p>
          </LegalSection>

          <LegalSection title="Identidad del responsable del tratamiento">
            <LegalIdentity />
          </LegalSection>

          <LegalSection title="Finalidad del tratamiento">
            <p>
              En MISTERRED360 tratamos los datos personales recabados a través del sitio web
              con las siguientes finalidades:
            </p>
            <LegalList
              items={[
                <>
                  <strong>Gestión contractual:</strong> en caso de contratación de los bienes o
                  servicios ofertados, para mantener la relación contractual, así como la
                  gestión, administración, información, prestación y mejora del servicio.
                </>,
                <>
                  <strong>Atención de solicitudes:</strong> envío de la información solicitada
                  a través de los formularios habilitados en el sitio web.
                </>,
                <>
                  <strong>Comunicaciones comerciales:</strong> remisión de boletines
                  (<em>newsletters</em>) y comunicaciones comerciales sobre promociones,
                  novedades y publicidad de MISTERRED360 y del sector, siempre que el usuario
                  haya prestado su consentimiento expreso.
                </>,
              ]}
            />
            <p>
              El usuario puede oponerse al envío de comunicaciones comerciales en cualquier
              momento, remitiendo un correo electrónico a la dirección indicada en el apartado
              de identificación del responsable.
            </p>
            <p>
              Los campos marcados como obligatorios en los formularios son imprescindibles para
              atender las finalidades indicadas. La no cumplimentación de dichos campos
              imposibilitará la prestación del servicio o la atención de la solicitud.
            </p>
          </LegalSection>

          <LegalSection title="Plazo de conservación">
            <p>
              Los datos personales proporcionados se conservarán durante el tiempo necesario
              para mantener la relación comercial o hasta que el interesado solicite su
              supresión, y durante los plazos adicionales exigidos por la normativa aplicable
              para hacer frente a eventuales responsabilidades legales derivadas de los
              servicios prestados.
            </p>
          </LegalSection>

          <LegalSection title="Base jurídica del tratamiento">
            <p>El tratamiento de sus datos se ampara en las siguientes bases de legitimación:</p>
            <LegalList
              items={[
                <>
                  <strong>Ejecución de un contrato</strong> (art. 6.1.b RGPD): cuando el
                  tratamiento es necesario para la gestión de la relación contractual o
                  precontractual.
                </>,
                <>
                  <strong>Consentimiento del interesado</strong> (art. 6.1.a RGPD): libre,
                  específico, informado e inequívoco, prestado mediante declaración expresa o
                  acción afirmativa clara, tras la lectura de la presente política.
                </>,
                <>
                  <strong>Interés legítimo</strong> (art. 6.1.f RGPD): para el envío de
                  comunicaciones comerciales sobre productos o servicios similares a los
                  contratados, en los supuestos permitidos por el art. 21.2 de la LSSI.
                </>,
              ]}
            />
            <p>
              En caso de no facilitarse los datos solicitados, o de hacerlo de forma incorrecta
              o incompleta, MISTERRED360 no podrá atender la solicitud ni prestar el servicio
              correspondiente.
            </p>
          </LegalSection>

          <LegalSection title="Destinatarios de los datos">
            <p>
              Los datos personales no serán comunicados a terceros ajenos a MISTERRED360, salvo:
            </p>
            <LegalList
              items={[
                "Cuando exista obligación legal de comunicarlos a autoridades competentes (fuerzas y cuerpos de seguridad del Estado, jueces, tribunales o Ministerio correspondiente).",
                "A encargados del tratamiento que presten servicios en nombre de MISTERRED360 (p. ej., proveedores de alojamiento web, plataformas de envío de correo), con los que se habrán suscrito los contratos de encargo del tratamiento exigidos por el art. 28 RGPD.",
              ]}
            />
            <p>
              No se realizan transferencias internacionales de datos fuera del Espacio
              Económico Europeo, salvo que se informe expresamente al usuario y se garanticen
              las salvaguardas adecuadas previstas en el RGPD.
            </p>
          </LegalSection>

          <LegalSection title="Derechos del interesado">
            <p>
              De conformidad con los artículos 15 a 22 del RGPD y los artículos 12 a 18 de la
              LOPDGDD, el usuario puede ejercer en cualquier momento los siguientes derechos:
            </p>
            <LegalList
              items={[
                <>
                  <strong>Acceso:</strong> conocer qué datos personales trata MISTERRED360.
                </>,
                <>
                  <strong>Rectificación:</strong> solicitar la corrección de datos inexactos o
                  incompletos.
                </>,
                <>
                  <strong>Supresión</strong> («derecho al olvido»): solicitar la eliminación de
                  los datos cuando, entre otros motivos, ya no sean necesarios para los fines
                  para los que fueron recabados.
                </>,
                <>
                  <strong>Oposición:</strong> oponerse al tratamiento de sus datos en
                  determinadas circunstancias.
                </>,
                <>
                  <strong>Limitación del tratamiento:</strong> solicitar la suspensión del
                  tratamiento de los datos en ciertos supuestos.
                </>,
                <>
                  <strong>Portabilidad:</strong> recibir sus datos en un formato estructurado,
                  de uso común y lectura mecánica.
                </>,
                <>
                  <strong>Retirada del consentimiento:</strong> en cualquier momento, sin que
                  ello afecte a la licitud del tratamiento previo.
                </>,
              ]}
            />
            <p>
              El ejercicio de estos derechos puede realizarse mediante solicitud escrita
              dirigida a{" "}
              <a href="mailto:misterred@misterred360.es" className="text-brand underline">
                misterred@misterred360.es
              </a>
              , acreditando su identidad adjuntando copia de su DNI o documento equivalente.
              MISTERRED360 responderá en el plazo máximo de un mes, prorrogable por otros dos
              meses en casos de especial complejidad.
            </p>
            <p>
              Si el usuario considera que el tratamiento de sus datos no se ajusta a la
              normativa, puede presentar una reclamación ante la{" "}
              <strong>Agencia Española de Protección de Datos (AEPD)</strong> —{" "}
              <a
                href="https://www.aepd.es"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline"
              >
                www.aepd.es
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title="Retención de datos — LSSI">
            <p>
              MISTERRED360, en su condición de prestador de servicios de la sociedad de la
              información, y en virtud de lo establecido en la <strong>Ley 34/2002, de 11 de
              julio (LSSI)</strong>, retiene durante un periodo máximo de <strong>12 meses</strong>{" "}
              la información imprescindible para identificar el origen de los datos alojados y
              el momento en que se inició la prestación del servicio.
            </p>
            <p>
              La retención de estos datos no afecta al secreto de las comunicaciones y
              únicamente podrán ser utilizados en el marco de una investigación criminal o para
              la salvaguarda de la seguridad pública, poniéndose a disposición de los jueces,
              tribunales o del Ministerio competente que así lo requiera.
            </p>
          </LegalSection>

          <LegalSection title="Comunicaciones comerciales">
            <p>
              En aplicación del artículo 21 de la LSSI, MISTERRED360 no enviará comunicaciones
              publicitarias o promocionales por correo electrónico u otro medio de comunicación
              electrónica equivalente que previamente no hayan sido solicitadas o expresamente
              autorizadas por sus destinatarios.
            </p>
            <p>
              No obstante, en virtud del art. 21.2 de la LSSI, cuando exista una relación
              contractual previa, MISTERRED360 podrá remitir comunicaciones comerciales
              referentes a productos o servicios propios análogos a los que fueron objeto de
              contratación.
            </p>
            <p>
              En todo caso, el usuario podrá solicitar en cualquier momento que no se le hagan
              llegar más comunicaciones comerciales, sin coste alguno y mediante comunicación a
              los canales de atención habilitados.
            </p>
          </LegalSection>

          <LegalSection title="Propiedad intelectual e industrial">
            <p>
              MISTERRED360 es titular de todos los derechos de autor, propiedad intelectual,
              industrial, <em>know-how</em> y demás derechos relacionados con los contenidos
              del sitio web y los servicios ofertados en el mismo, así como de los programas y
              aplicaciones necesarias para su implementación.
            </p>
            <p>
              Queda expresamente prohibida la reproducción, publicación o uso no estrictamente
              privado de los contenidos del sitio web —totales o parciales— sin el
              consentimiento previo y por escrito de MISTERRED360.
            </p>
            <p>
              El usuario es responsable del uso que realice del sitio web, de los contenidos
              que transmita y almacene, y de cualquier acción que pudiera vulnerar derechos de
              terceros o la normativa aplicable. El usuario indemnizará a MISTERRED360 por
              cualquier gasto, incluidos honorarios de defensa jurídica, derivados de
              reclamaciones imputables a su actuación.
            </p>
          </LegalSection>

          <LegalSection title="Veracidad de los datos">
            <p>
              El usuario declara que todos los datos facilitados son ciertos, exactos y
              actualizados, y se compromete a comunicar a MISTERRED360 cualquier modificación
              que se produzca en los mismos, respondiendo de la veracidad de la información
              aportada.
            </p>
            <p className="text-sm text-ink/45">
              {t("legal.updated")}: {t("legal.updated.value")}.{" "}
              <button
                className="text-brand underline"
                onClick={() => onNavigate("#/politica-de-cookies")}
              >
                {t("footer.cookies")}
              </button>
              .
            </p>
          </LegalSection>
        </div>
      </section>
    </PageShell>
  );
}
