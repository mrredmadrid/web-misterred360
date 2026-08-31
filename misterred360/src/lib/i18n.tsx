import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ───────────────────────────────────────────────────────────
   MISTERRED360 · Sistema de traducción
   Tres idiomas: Español (es), English (en), Català (ca)
   Uso: const { t } = useI18n();  →  t("hero.title")
   ─────────────────────────────────────────────────────────── */

export type Locale = "es" | "en";

export const LOCALES: { code: Locale; label: string; short: string }[] = [
  { code: "es", label: "Español", short: "ES" },
  { code: "en", label: "English", short: "EN" },
];

const STORAGE_KEY = "mr360.locale";

/* ── Diccionario ────────────────────────────────────────── */
type Dict = Record<string, string>;

const es: Dict = {
  /* Navegación */
  "seo.title": "Agencia de Comunicación y Marketing 360 en Madrid | MISTERRED360",
  "seo.desc": "MISTERRED360, agencia de comunicación estratégica en Madrid: gabinete de prensa, imagen corporativa, audiovisual, publicidad, RRPP y estudios de mercado.",

  "nav.manifiesto": "Manifiesto",
  "nav.servicios": "Servicios",
  "nav.metodo": "Método 360",
  "nav.precios": "Precios",
  "nav.agentesIA": "Agentes IA",
  "nav.elenco": "Equipo",
  "nav.partners": "Partners",
  "nav.insights": "Conocimiento",
  "nav.inicio": "Inicio",
  "nav.contacto": "Contacto",
  "nav.cta": "Cuéntanos tu reto",
  "nav.book": "Pedir llamada",
  "nav.talk": "¿Hablamos?",
  "nav.status": "Contestamos en 24h. Contesta una persona.",
  "nav.language": "Idioma",
  "nav.follow": "Síguenos",
  "nav.open": "Abrir menú",
  "nav.close": "Cerrar menú",
  "nav.home_aria": "MISTERRED360, ir al inicio",
  "nav.skip": "Saltar al contenido",

  /* Hero, Manifiesto, marca y WhyUs: contenido editable en
     src/content/{hero,manifesto,site,whyus}.json (panel /admin) */
  "hero.scroll": "Scroll",

  /* Servicios (landing) */
  "services.kicker": "Qué hacemos",
  "services.title": "360 grados.\n*Ni uno de relleno.*",
  "services.desc":
    "Cinco territorios con nombre propio. Reputación, estrategia, identidad, creación y digital. Ni uno solo lo vas a recibir estandarizado: trajes a medida, nunca tallas.",
  "services.cta": "Quiero este servicio",
  "services.note.cast": "El chimpancé cambia de rol según la misión.",

  /* Bloques de servicios: contenido en src/content/services.json */

  /* Método */
  "method.kicker": "El Método Milímetro",
  "method.title.a": "Escuchar. Medir.",
  "method.title.b": "Construir. Estar.",

  /* WhyUs: contenido en src/content/whyus.json */

  /* Elenco: contenido en src/content/team.json */
  "cast.kicker": "El personaje",
  "cast.title": "Vemos lo que otros\npasan por *alto.*",
  "cast.subtitle": "No somos versiones. Somos profesionales con experiencia, con un mismo instinto: marcar la diferencia y hacer que tu marca crezca.",
  "cast.drag": "Arrastra para conocer al embajador",

  /* Testimonios */
  "testi.kicker": "Casos",
  "testi.title.a": "Tu proyecto no es",
  "testi.title.b": "una cuenta. Es",
  "testi.title.c": "una obsesión.",
  "testi.rating": "4.9 / 5 · Clientes que repiten",
  "testi.aria": "Valoración 5 de 5",
  "testi.prev": "Testimonio anterior",
  "testi.next": "Testimonio siguiente",

  /* El Hilo Rojo (antes Insights) */
  "insights.kicker": "El Hilo Rojo",
  "insights.title.a": "Ideas que generan",
  "insights.title.b": "oportunidades.",
  "insights.title.c": "Gratis.",
  "insights.all": "Ver todas las ideas",
  "insights.read": "Leer la idea",
  "insights.hook.title": "Antes de contratarnos, llévate una idea.",
  "insights.hook.desc":
    "Cuéntanos tu reto en tres líneas. Te devolvemos una idea concreta y ejecutable en 72 horas. Sin reunión de 40 diapositivas, sin compromiso.",
  "insights.hook.cta": "Quiero mi idea →",

  /* FAQ */
  "faq.kicker": "Preguntas frecuentes",
  "faq.title.a": "Dudas resueltas",
  "faq.title.b": "antes del",
  "faq.title.c": "briefing.",
  "faq.desc":
    "Lo que marcas, empresas e instituciones nos preguntan antes de empezar a trabajar con una agencia de comunicación 360.",
  "faq.cta": "¿Otra duda? Escríbenos",

  /* CTA */
  "cta.kicker": "Tu turno",
  "cta.title": "Tu competencia lleva\nseis meses hablando.\n*¿Y tú?*",
  "cta.desc":
    "Cuéntanos tu reto en tres líneas. En menos de {b}72 horas{/b} te devolvemos una idea concreta y ejecutable. Gratis. Una por empresa. Sin letra pequeña.",
  "cta.button": "Cuéntanos tu reto",

  /* Contacto (landing y footer) */
  "contact.kicker": "Contacto",
  "contact.title.a": "Cuéntanoslo.",
  "contact.title.b": "El resto",
  "contact.title.c": "es cosa nuestra.",
  "contact.desc":
    "Contestamos en 24 horas. Contesta una persona, con nombre. Siempre. Sin formularios de catorce campos, sin llamada comercial, sin «ya te llamaremos».",

  /* Formulario */
  "form.email": "Email directo",
  "form.phone": "Teléfono",
  "form.address": "La guarida",
  "form.status": "Respondemos en menos de 24h laborables",
  "form.stat.60s": "para completar el formulario",
  "form.stat.48h": "para nuestra primera lectura",
  "form.stat.0": "por la propuesta inicial",
  "form.stat.1": "conversación para arrancar",
  "form.quote": "«Cuéntanoslo todo. Lo que no sirva, lo tiramos; lo que valga, lo amplificamos.»",
  "form.step.of": "Paso {n} de {total}",
  "form.step.last": "Último paso",
  "form.back": "Atrás",
  "form.continue": "Continuar",
  "form.send": "Enviar propuesta",
  "form.sending": "Enviando señal",
  "form.step.aria": "Paso {n}",

  "form.q1.title": "¿En qué te podemos ayudar?",
  "form.q1.desc":
    "Elige tantas como quieras. Sin trampa: si aún no lo sabes, hay un chip para eso.",
  "form.q2.title": "Cuéntanos quién eres.",
  "form.q2.desc": "Dos toques y seguimos: quién nos escribe y desde qué momento.",
  "form.q2.profile": "¿Qué eres?",
  "form.q2.stage": "¿En qué momento estáis?",
  "form.q3.title": "Un par de detalles más.",
  "form.q3.desc": "Nos ayuda a ir al grano en la primera llamada. Nada es vinculante.",
  "form.q3.timing": "¿Cuándo lo necesitáis?",
  "form.q3.source": "¿Cómo nos has conocido?",
  "form.q4.title": "Y por último, tus datos.",
  "form.q4.desc": "Solo necesitamos por dónde escribirte. Todo lo demás ya nos lo has contado.",
  "form.field.name": "Nombre *",
  "form.field.company": "Empresa u organización",
  "form.field.email": "Email *",
  "form.field.phone": "Teléfono (opcional)",
  "form.field.message": "¿Algo más que debamos saber? (opcional)",
  "form.privacy": "He leído y acepto la política de privacidad de MISTERRED360.",
  "form.sent.title": "Recibido.",
  "form.sent.desc":
    "El equipo ya está dándole vueltas a tu mensaje. Te devolvemos una primera lectura estratégica en menos de 48 horas.",
  "form.sent.top": "Volver arriba",
  "form.sent.another": "Enviar otro mensaje",

  "need.prensa": "Salir en prensa",
  "need.plan": "Plan de comunicación",
  "need.identidad": "Nueva identidad",
  "need.audiovisual": "Vídeo y contenido",
  "need.redes": "Redes sociales",
  "need.eventos": "RRPP y eventos",
  "need.publicidad": "Campañas y ads",
  "need.datos": "Estudios de mercado",
  "need.360": "Todo el círculo 360°",
  "need.explorar": "Aún estamos explorando",

  "profile.empresa": "Empresa / Marca",
  "profile.institucion": "Institución pública",
  "profile.startup": "Startup / Emprendedor",
  "profile.ong": "ONG / Asociación",
  "profile.personal": "Marca personal",

  "stage.lanzamos": "Lanzamos algo nuevo",
  "stage.reactivar": "Necesitamos reactivar",
  "stage.crisis": "Estamos en un momento crítico",
  "stage.crecer": "Queremos crecer con orden",
  "stage.reposicionar": "Toca reposicionarnos",

  "timing.ya": "Ya",
  "timing.mes": "Este mes",
  "timing.tri": "Este trimestre",
  "timing.flex": "Flexible",

  "source.google": "Búsqueda en Google",
  "source.redes": "Redes sociales",
  "source.prensa": "En prensa o medios",
  "source.recomendacion": "Nos recomendaron",
  "source.evento": "Evento o ponencia",
  "source.cliente": "Ya somos clientes",
  "source.otro": "Otro canal",

  /* Footer */
  "footer.explore": "Explorar",
  "footer.services": "Servicios 360",
  "footer.den": "La guarida",
  "footer.top": "Volver arriba",
  "footer.rights": "© 2026 MISTERRED360 — Todos los derechos reservados",
  "footer.slogan": "Profesionales con experiencia, con un mismo instinto: marcar la diferencia y hacer que tu marca crezca",
  "footer.made": "Hecho con instinto · 40.4168° N",
  "footer.privacy": "Política de privacidad",
  "footer.cookies": "Política de cookies",
  "footer.cookie_prefs": "Preferencias de cookies",
  "footer.a11y": "Accesibilidad",
  "footer.privacy_short": "Privacidad",
  "footer.cookies_short": "Cookies",
  "footer.prefs_short": "Preferencias",
  "footer.download": "Descargar textos",
  "footer.download_short": "Textos",

  /* PageShell */
  "shell.back": "Volver a la home",
  "shell.cta.title": "¿Hablamos de tu marca?",
  "shell.cta.desc":
    "Primera lectura estratégica en 48 horas. Sin compromiso y sin respuestas de manual.",
  "shell.cta.button": "Solicitar propuesta",
  "shell.footer.short":
    "Agencia de comunicación estratégica, reputación y crecimiento 360 en Madrid.",
  "shell.footer.contact": "Contacto",
  "shell.footer.gocontact": "Ir a contacto",

  /* Cookies */
  "cookie.title": "Cookies con criterio.",
  "cookie.desc":
    "Usamos cookies propias y de terceros para analizar la navegación y mejorar la experiencia. Puedes aceptar todas, rechazarlas o configurarlas por categoría. Más información en nuestra {a}política de cookies{/a}.",
  "cookie.reject": "Rechazar todas",
  "cookie.configure": "Configurar",
  "cookie.accept": "Aceptar todas",
  "cookie.panel.kicker": "Preferencias",
  "cookie.panel.title": "Configura tus cookies",
  "cookie.panel.desc":
    "Puedes aceptar o rechazar cada categoría por separado. Las cookies técnicas son imprescindibles para el funcionamiento del sitio y no pueden desactivarse.",
  "cookie.panel.save": "Guardar preferencias",
  "cookie.panel.footer":
    "Puedes cambiar estas preferencias en cualquier momento desde el enlace «Preferencias de cookies» del pie de página.",
  "cookie.close": "Cerrar",
  "cookie.close_panel": "Cerrar panel de cookies",
  "cookie.cat.necessary": "Técnicas o estrictamente necesarias",
  "cookie.cat.necessary.desc":
    "Imprescindibles para el funcionamiento básico del sitio: navegación, formularios, seguridad y preferencias de sesión. No pueden desactivarse.",
  "cookie.cat.preferences": "Preferencias o personalización",
  "cookie.cat.preferences.desc":
    "Recuerdan las opciones elegidas por el usuario (idioma, región, ajustes visuales) para personalizar la experiencia.",
  "cookie.cat.analytics": "Analítica o estadística",
  "cookie.cat.analytics.desc":
    "Permiten medir el uso del sitio, contabilizar visitas y analizar el rendimiento para mejorarlo (p. ej., Google Analytics).",
  "cookie.cat.marketing": "Marketing o publicidad comportamental",
  "cookie.cat.marketing.desc":
    "Recogen información sobre tu navegación para mostrarte publicidad personalizada dentro y fuera de este sitio.",

  /* Accesibilidad */
  "a11y.open": "Abrir panel de accesibilidad",
  "a11y.title": "Accesibilidad",
  "a11y.kicker": "Accesibilidad",
  "a11y.panel.title": "Ajusta la experiencia",
  "a11y.close": "Cerrar",
  "a11y.close_panel": "Cerrar panel de accesibilidad",
  "a11y.text": "Tamaño del texto",
  "a11y.spacing": "Espaciado de lectura",
  "a11y.spacing.normal": "Normal",
  "a11y.spacing.wide": "Amplio",
  "a11y.view": "Visualización",
  "a11y.contrast": "Alto contraste",
  "a11y.contrast.desc": "Fondo negro puro y texto blanco con acento rojo.",
  "a11y.underline": "Subrayar enlaces",
  "a11y.underline.desc":
    "Marca visualmente todos los enlaces y botones interactivos.",
  "a11y.dyslexia": "Fuente para dislexia",
  "a11y.dyslexia.desc":
    "Cambia a una tipografía sans más neutra y con más espaciado.",
  "a11y.motion": "Movimiento",
  "a11y.motion.reduce": "Reducir animaciones",
  "a11y.motion.reduce.desc":
    "Desactiva parallax, transiciones y motion no esenciales.",
  "a11y.motion.grain": "Pausar grano de fondo",
  "a11y.motion.grain.desc": "Detiene la textura animada de la web.",
  "a11y.focus": "Lectura y foco",
  "a11y.cursor": "Cursor grande",
  "a11y.cursor.desc": "Aumenta el tamaño del cursor personalizado.",
  "a11y.guide": "Guía de lectura",
  "a11y.guide.desc": "Línea horizontal roja que sigue al puntero.",
  "a11y.mask": "Máscara de lectura",
  "a11y.mask.desc":
    "Oscurece el resto de la pantalla dejando una franja.",
  "a11y.listen": "Escuchar contenido",
  "a11y.listen.desc":
    "Lectura por voz en español de los titulares y textos de la página actual.",
  "a11y.listen.play": "Escuchar esta página",
  "a11y.listen.stop": "Detener lectura",
  "a11y.reset": "Restablecer ajustes",
  "a11y.persist":
    "Estos ajustes se guardan en tu navegador y se aplican en todas las páginas del sitio.",

  /* Loader */
  "loader.a11y": "Cargando MISTERRED360",
  "loader.subtitle": "Poniendo la marca en órbita",
  "loader.experience": "Experiencia 360°",

  /* ═══ Páginas interiores ═══ */
  "page.man.seo.title": "Manifiesto — Agencia de Comunicación Estratégica | MISTERRED360",
  "page.man.seo.desc": "La declaración de intenciones de MISTERRED360: comunicación estratégica, reputación y crecimiento en 360 grados. Los cinco principios de nuestra agencia de comunicación en Madrid.",
  "page.man.kicker": "El manifiesto",
  "page.man.meta": "Madrid · Desde 2011",
  "page.man.title": "Creemos en la comunicación\ncomo *ventaja competitiva.*",
  "page.man.intro": "Esto no es una página «sobre nosotros». Es la declaración de intenciones de una agencia que vive la comunicación como el negocio de sus clientes.",
  "page.man.quote": "Ponemos el {red}alma{/red}\nen cada proyecto.",
  "page.man.p1": "Somos la agencia que no cabe en un briefing. Una agencia convencional te asigna un ejecutivo de cuentas. Nosotros te asignamos unas personas que se implican y dejan el alma en cada proyecto.",
  "page.man.p2": "Hacemos comunicación como se hacía antes —conversando en profundidad contigo, escuchándote, entendiéndote— con la magia de las herramientas de ahora. 360 grados de cobertura a cero grados de distancia.",
  "page.man.principles.title": "Cinco principios.\n{red}Cero excusas.{/red}",
  "page.man.p01.t": "La comunicación manda",
  "page.man.p01.d": "No es un departamento, un extra o una ocurrencia de final de proyecto. Es la infraestructura sobre la que se construyen la reputación, la confianza y el crecimiento de una marca.",
  "page.man.p02.t": "Estrategia antes que estética",
  "page.man.p02.d": "Lo bonito que no funciona es decoración. Cada pieza que producimos responde a un objetivo, un mensaje y una audiencia definidos antes de abrir el ordenador.",
  "page.man.p03.t": "Instinto + datos",
  "page.man.p03.d": "El olfato abre caminos; los datos los confirman. Investigamos antes de proponer y medimos después de publicar. La creatividad se defiende con evidencia.",
  "page.man.p04.t": "Cercanía radical",
  "page.man.p04.d": "Hablas con quien piensa y ejecuta tu cuenta. Sin capas, sin intermediarios, sin respuestas de manual. La confianza también es un entregable.",
  "page.man.p05.t": "La vuelta completa",
  "page.man.p05.d": "Ninguna acción aislada construye una marca. Prensa, identidad, contenido y difusión giran juntos o no giran. Por eso nos llamamos 360.",
  "page.man.socio.title": "El socio más listo\nde la {red}sala.{/red}",
  "page.man.socio.p": "Nuestro chimpancé no es una mascota ni un chiste corporativo. Es un embajador: observa antes de hablar, piensa tres jugadas por delante y nunca pasa desapercibido. Exactamente lo que le pedimos a cada estrategia que firmamos.",
  "page.man.socio.q": "«La esencia de una compañía debe emanar de una gran estrategia de comunicación que la haga diferente y única.»",
  "page.man.socio.badge": "El jefe de la manada",
  "page.man.socio.fig": "Fig. 02 — Observa. Piensa. Habla. En ese orden.",
  "page.man.socio.cta": "Conocer al elenco",
  "page.man.final.quote": "«Donde haga falta, cuando haga falta. {red}Esa es toda la política de comunicación.{/red}»",
  "page.man.final.badge": "La manada · En directo",
  "page.man.final.fig": "Fig. 03 — La vuelta completa, en directo.",

  "page.srv.seo.title": "Servicios de Agencia de Comunicación 360: Prensa, Branding y Marketing | MISTERRED360",
  "page.srv.seo.desc": "Servicios de comunicación 360 en Madrid: gabinete de prensa, planificación estratégica, comunicación 2.0, RRPP y eventos, imagen corporativa, audiovisual, publicidad y estudios de mercado.",
  "page.srv.kicker": "Servicios 360",
  "page.srv.meta": "8 servicios · 4 bloques · 1 visión",
  "page.srv.title": "360 grados: *máxima eficacia*\ny visibilidad.",
  "page.srv.intro": "Tres territorios con nombre propio: gabinete de comunicación, estrategia y plan de acción, branding e identidad, creación y relato digital. Ni uno solo lo vas a percibir estandarizado: trajes a medida, no tallas sueltas.",
  "page.srv.figure_alt": "La Publicista: la chimpancé de MISTERRED360 revisando la estrategia de marketing",
  "page.srv.cta.service": "Solicitar este servicio",
  "page.srv.close.kicker": "El círculo completo",
  "page.srv.close.title": "¿No sabes qué pieza\nnecesitas? Empieza por la vuelta entera.",
  "page.srv.close.p": "Auditamos tu comunicación actual, detectamos las fugas de reputación y te proponemos un plan 360 con prioridades claras. Sin humo y con presupuesto cerrado.",
  "page.srv.close.cta": "Pedir auditoría 360",

  "page.ai.capabilities_kicker": "Qué hace",
  "page.ai.capabilities_title": "Un empleado que no descansa, pero que sí escucha",
  "page.ai.process_kicker": "Cómo lo hacemos",
  "page.ai.process_title": "De la idea al agente en marcha",
  "page.ai.process_desc": "Nada de plantillas genéricas. Cada agente se construye desde cero con tu conocimiento real.",
  "page.ai.faq_kicker": "Dudas frecuentes",
  "page.ai.faq_title": "Antes de que preguntes",
  "page.ai.faq_cta": "Cuéntanos tu caso",

  "page.met.seo.title": "Método 360: Plan de Comunicación en 4 Fases | MISTERRED360",
  "page.met.seo.desc": "Cómo trabaja MISTERRED360, agencia de comunicación en Madrid: observar, pensar, crear, amplificar y visionar. Un plan de comunicación completo en cinco fases medibles.",
  "page.met.kicker": "El Método Milímetro",
  "page.met.meta": "5 fases · 360 grados · 0 improvisación",
  "page.met.title": "Escuchar. Medir.\nConstruir. *Estar.*",
  "page.met.intro": "Cinco fases que giran en círculo alrededor de tu marca, cada vez con más criterio e impacto.",
  "page.met.figure_alt": "El Estratega: el chimpancé de MISTERRED360 analizando su hoja de ruta",
  "page.met.deliverables": "Entregables de la fase",
  "page.met.verb.observar": "OBSERVAR",
  "page.met.verb.pensar": "PENSAR",
  "page.met.verb.crear": "CREAR",
  "page.met.verb.amplificar": "AMPLIFICAR",
  "page.met.verb.visionar": "VISIONAR",
  "page.met.p01.title": "Primero escuchamos. Siempre.",
  "page.met.p01.desc": "Auditoría de marca, estudios de mercado y escucha activa. Antes de decir una palabra en tu nombre, entendemos tu entorno, tu audiencia y tus oportunidades reales.",
  "page.met.p01.ext": "Auditamos tu marca, tu entorno y la conversación que ya existe sobre ti. Entrevistas, estudios de mercado y escucha social para saber exactamente dónde estás antes de decidir a dónde vamos.",
  "page.met.p01.d1": "Auditoría de comunicación",
  "page.met.p01.d2": "Estudio de mercado",
  "page.met.p01.d3": "Mapa de audiencias y medios",
  "page.met.p02.title": "La estrategia marca el ritmo.",
  "page.met.p02.desc": "Convertimos hallazgos en una hoja de ruta: mensajes ordenados, canales priorizados y objetivos alineados con una visión global de 360 grados.",
  "page.met.p02.ext": "Convertimos los hallazgos en decisiones: qué decir, a quién, cómo y dónde. Un plan de comunicación realista y medible que ordena mensajes, prioriza canales y marca el ritmo de todo lo que viene después.",
  "page.met.p02.d1": "Plan de comunicación",
  "page.met.p02.d2": "Arquitectura de mensajes",
  "page.met.p02.d3": "Plan de canales y calendario",
  "page.met.p03.title": "Piezas que nadie ignora.",
  "page.met.p03.desc": "Identidad, prensa, audiovisual y campañas con carácter propio. La creatividad no decora la estrategia: la hace imposible de ignorar.",
  "page.met.p03.ext": "Identidad, contenidos, piezas de prensa, vídeo y campañas con carácter propio. La creatividad no decora la estrategia: la hace imposible de ignorar. Cada pieza nace del plan, nunca del capricho.",
  "page.met.p03.d1": "Identidad y piezas de marca",
  "page.met.p03.d2": "Contenidos editoriales y prensa",
  "page.met.p03.d3": "Vídeo y piezas de campaña",
  "page.met.p04.title": "Vuelta completa. Y otra más.",
  "page.met.p04.desc": "Difusión en medios, redes, publicidad y eventos. Medimos, aprendemos y optimizamos: el círculo de 360° nunca se cierra del todo.",
  "page.met.p04.ext": "Difusión en medios, redes, publicidad y eventos. Medimos impacto, aprendemos y optimizamos. Y cuando el círculo se completa, empieza otra vez: cada vuelta alimenta la siguiente.",
  "page.met.p04.d1": "Difusión en medios y redes",
  "page.met.p04.d2": "Campañas y activaciones",
  "page.met.p04.d3": "Informe de resultados y learning",
  "page.met.p05.title": "El círculo se cierra. Y crece.",
  "page.met.p05.desc": "Crecimiento de marca y retorno garantizado para afrontar un nuevo ejercicio con nuevos retos desde un escenario óptimo: marcas con potencial se consolidan, se diferencian y se convierten en referentes de su sector.",
  "page.met.p05.ext": "El círculo se cierra con crecimiento de marca y retorno garantizado para afrontar un nuevo ejercicio con nuevos retos y objetivos desde un escenario óptimo y propicio. Marcas con potencial se consolidan y se diferencian en un mercado cada vez más competitivo, y consiguen ser referentes del sector con acciones y planteamientos novedosos, frescos y diferentes.",
  "page.met.p05.d1": "Informe de crecimiento",
  "page.met.p05.d2": "Plan del nuevo ejercicio",
  "page.met.p05.d3": "Nuevos retos y objetivos",
  "page.met.close.title": "El círculo nunca\nse {red}cierra.{/red}",
  "page.met.close.p": "Cada medición alimenta la siguiente vuelta. Marcas que empiezan con un gabinete de prensa terminan girando el círculo completo: esa es la trayectoria natural cuando la comunicación se toma en serio.",
  "page.met.close.cta": "Empezar mi primera vuelta",

  "page.ele.seo.title": "El Elenco — Branding con Carácter | MISTERRED360",
  "page.ele.seo.desc": "El chimpancé de MISTERRED360: ocho versiones de un embajador de marca premium. Portavoz, estratega, anfitrión, diseñador, director, publicista y analista.",
  "page.ele.kicker": "El elenco",
  "page.ele.meta": "1 personaje · 8 roles · 360° de carácter",
  "page.ele.title": "Profesionales con experiencia,\ncon un mismo *instinto:* marcar\nla diferencia y hacer que tu marca crezca.",
  "page.ele.intro": "Vemos lo que otros pasan por alto. Experiencia, profesionalidad y trayectorias contrastadas en el mundo del periodismo, diseño web, audiovisual, publicidad, marketing y expertos en IA.",
  "page.ele.figure_alt": "El Icono: el chimpancé de MISTERRED360 con traje negro y gafas rojas",
  "page.ele.h.title": "Un embajador,\nno una {red}mascota.{/red}",
  "page.ele.h.p1": "La mayoría de los personajes corporativos hacen gracia. El nuestro hace estrategia. Observa, analiza, comunica, lidera y conecta: cada versión del elenco encarna una disciplina de la agencia y una forma de estar delante de tu marca.",
  "page.ele.h.p2": "Por eso funciona como firma gráfica en cualquier soporte: del arco del hero a la diapositiva de un plan de comunicación, siempre es el mismo carácter con un traje distinto.",
  "page.ele.h.fig": "Fig. 00 — La versión original. Todo lo demás es vestuario.",
  "page.ele.treat.1.t": "Duotono rojo",
  "page.ele.treat.1.d": "Para insights y editorial.",
  "page.ele.treat.2.t": "Monocromo",
  "page.ele.treat.2.d": "Para manifiesto y reputación.",
  "page.ele.treat.3.t": "Arco editorial",
  "page.ele.treat.3.d": "Para hero y portadas.",
  "page.ele.treat.4.t": "Glow controlado",
  "page.ele.treat.4.d": "Solo donde aporta valor.",
  "page.ele.full.title": "El elenco\n{red}completo.{/red}",
  "page.ele.full.p": "No somos versiones. Somos profesionales con experiencia, con un mismo instinto: marcar la diferencia y hacer que tu marca crezca.",
  "page.ele.collab.title": "Los Colaboradores",
  "page.ele.collab.desc": "Aportando valor, frescura y relevo generacional.",
  "page.ele.allies.title": "Alianzas",
  "page.ele.allies.desc": "Si quieres ser el mejor, rodéate de los mejores. Y en eso estamos.",
  "page.ele.close.kicker": "Únete a la manada",
  "page.ele.close.title": "Toda gran marca necesita\nun personaje así.",
  "page.ele.close.p": "O al menos, una agencia que trabaje con el mismo instinto. Cuéntanos tu caso y te diremos qué versión del elenco necesita tu marca.",
  "page.ele.close.cta": "Presentarme al elenco",

  "page.cont.seo.title": "Contacto — Agencia de Comunicación en Madrid | MISTERRED360",
  "page.cont.seo.desc": "Contacta con MISTERRED360, agencia de comunicación estratégica en Madrid. Solicita tu propuesta de gabinete de prensa, identidad corporativa, audiovisual, publicidad o plan 360 completo.",
  "page.cont.meta": "Respuesta en menos de 24h laborables",
  "page.cont.title": "Cuéntanos tu historia.\nNosotros ponemos *el eco.*",
  "page.cont.intro": "Toda gran marca empieza con una conversación. Sin formularios eternos ni respuestas automáticas: nos escribes, leemos a fondo y te devolvemos una primera lectura estratégica en 48 horas.",
  "page.cont.figure_alt": "El chimpancé de MISTERRED360 señalando directamente al visitante desde su despacho",
  "page.cont.form_aria": "Formulario y datos de contacto",

  "page.blog.seo.title": "Insights y Noticias de Comunicación y Marketing | MISTERRED360",
  "page.blog.seo.desc": "Blog de MISTERRED360: noticias, análisis e insights sobre comunicación estratégica, gabinete de prensa, reputación de marca, branding, audiovisual y marketing.",
  "page.blog.back": "Volver a la home",
  "page.blog.kicker": "Insights",
  "page.blog.title.a": "Noticias de",
  "page.blog.title.b": "comunicación",
  "page.blog.title.c": "con {red}criterio.{/red}",
  "page.blog.intro": "Un apartado sencillo para publicar noticias, análisis y opinión desde la mirada MISTERRED360: comunicación, reputación, marca, marketing y crecimiento.",
  "page.blog.last": "Último insight",
  "page.blog.all.kicker": "Todas las noticias",
  "page.blog.all.title": "Archivo insight",
  "page.blog.all.desc": "Haz clic en cualquier noticia para verla con la plantilla editorial completa.",
  "page.blog.mini.subtitle": "Volver a la experiencia 360",
  "page.blog.mini.services": "Servicios",
  "page.blog.mini.contact": "Contacto",

  "post.back.index": "Todos los insights",
  "post.back.home": "Volver a la home",
  "post.kicker": "Noticia",
  "post.card.author": "Autor",
  "post.card.category": "Categoría",
  "post.card.read": "Lectura",
  "post.card.title": "Ficha de noticia",
  "post.cta.title": "¿Quieres que tu marca sea noticia?",
  "post.cta.button": "Solicitar propuesta",
  "post.related.kicker": "Todas las noticias",
  "post.related.title": "Sigue leyendo",
  "post.related.button": "Ver índice completo",
  "post.404.kicker": "Insight no encontrado",
  "post.404.title": "Esta noticia no existe.",
  "post.404.button": "Ver todos los insights",

  "legal.updated": "Última actualización",
  "legal.updated.value": "1 de julio de 2026",

  "page.priv.seo.title": "Política de Privacidad | MISTERRED360",
  "page.priv.seo.desc": "Política de privacidad de MISTERRED360, agencia de comunicación en Madrid: responsable, finalidades, base jurídica, plazos y derechos del interesado conforme al RGPD.",
  "page.priv.kicker": "Legal · Privacidad",
  "page.priv.title": "Política\nde *privacidad.*",
  "page.priv.intro": "Cómo tratamos, protegemos y respetamos los datos personales que recibimos a través del sitio web de MISTERRED360, conforme al RGPD y la LOPDGDD.",

  "page.cook.seo.title": "Política de Cookies | MISTERRED360",
  "page.cook.seo.desc": "Política de cookies de MISTERRED360: cookies propias y de terceros, finalidades, duración y gestión del consentimiento conforme al RGPD y la LSSI.",
  "page.cook.kicker": "Legal · Cookies",
  "page.cook.title": "Política\nde *cookies.*",
  "page.cook.intro": "Toda la información sobre cómo MISTERRED360 usa cookies propias y de terceros, y cómo puedes aceptarlas, rechazarlas o configurarlas en cualquier momento.",
  "page.cook.panel.kicker": "Panel de preferencias",
  "page.cook.panel.title": "Gestiona tu consentimiento",
  "page.cook.panel.desc": "Puedes cambiar tu elección en cualquier momento o restablecerla por completo.",
  "page.cook.panel.configure": "Configurar cookies",
  "page.cook.panel.reset": "Restablecer consentimiento",

  /* ═══ Contacto · selector de vía ═══ */
  "contact.mode.kicker": "Elige cómo hablamos",
  "contact.mode.title.a": "Dos vías.",
  "contact.mode.title.b": "Sin ruido.",
  "contact.mode.desc":
    "Puedes contarnos tu reto por escrito, con calma, o pedir directamente una llamada nuestra. Tú eliges cómo empezamos la conversación.",
  "contact.mode.back": "Cambiar de opción",
  "contact.mode.foot":
    "Sin llamadas comerciales, sin trampas: elijas lo que elijas, hablas con una persona con nombre y teléfono.",

  "contact.mode.option.a.kicker": "Opción 01",
  "contact.mode.option.a.title": "Cuéntanos\ntu reto por escrito",
  "contact.mode.option.a.desc":
    "Formulario breve con lo que necesitamos saber para preparar una primera lectura estratégica. Te contestamos en menos de 24h laborables.",
  "contact.mode.option.a.cta": "Ir al formulario",
  "contact.mode.form.title": "Cuéntanos tu reto",
  "contact.mode.form.desc":
    "Tres pasos ágiles para que sepamos con quién hablamos y qué necesita tu marca. Te devolvemos una idea concreta en 72 horas.",

  "contact.mode.option.b.kicker": "Opción 02",
  "contact.mode.option.b.title": "Que os\nllamemos nosotros",
  "contact.mode.option.b.desc":
    "Elige un día y una franja aproximada (mañana o tarde). Te llamamos nosotros en ese hueco desde el número corporativo. Sin apps, sin videollamadas: teléfono y ya.",
  "contact.mode.option.b.cta": "Pedir llamada",
  "contact.mode.call.title": "Pide que te llamemos",
  "contact.mode.call.desc":
    "Sin agendas complicadas ni enlaces de videollamada: elige un día y una franja aproximada, deja el teléfono y te llamamos. Un interlocutor, siempre el mismo.",

  /* ═══ BookingBlock · pedir llamada ═══ */
  "call.step.1.title": "¿Qué día te viene bien?",
  "call.step.2.title": "¿Mañana o tarde?",
  "call.step.3.title": "¿A qué número te llamamos?",
  "call.slot.morning": "Por la mañana",
  "call.slot.afternoon": "Por la tarde",
  "call.pending": "Selecciona día y franja para dejarnos tu teléfono.",
  "call.prev": "Semana anterior",
  "call.next": "Semana siguiente",

  "call.field.name": "Nombre *",
  "call.field.phone": "Teléfono *",
  "call.field.email": "Email (opcional)",
  "call.field.topic": "Sobre qué llamamos (opcional)",
  "call.privacy":
    "Acepto la política de privacidad. Podréis llamarme al número facilitado dentro de la franja horaria elegida.",

  "call.confirm": "Pedir llamada",
  "call.sending": "Anotando la llamada",
  "call.sent.title": "Anotado. Te llamamos.",
  "call.sent.desc":
    "Te llamaremos dentro de la franja que has indicado desde nuestro número corporativo. Si no lo coges, lo intentamos una vez más y te escribimos por email.",
  "call.sent.card": "Tu llamada",
  "call.sent.another": "Pedir otra llamada",

  "call.aside.kicker": "Cómo funciona",
  "call.aside.title": "Sin agenda cruzada.\nSin enlaces raros.",
  "call.aside.desc":
    "Nos guardamos el hueco en calendario y te llamamos nosotros. Sin videollamadas, sin apps, sin PIN de sala. Solo teléfono.",
  "call.perk.1": "Un interlocutor. El mismo siempre.",
  "call.perk.2": "Duración estimada: 15–20 minutos.",
  "call.perk.3": "Si no lo coges, reintentamos y te escribimos.",
  "call.perk.4": "Cero venta agresiva. Palabra.",

  /* ═══ Página Agendar (/agendar) ═══ */
  "agendar.kicker": "Pedir llamada",
  "agendar.title": "Elige día y franja.\n*Te llamamos nosotros.*",
  "agendar.intro":
    "Sin agendas cruzadas, sin enlaces de videollamada. Elige un día laborable, marca si prefieres mañana o tarde, déjanos tu teléfono y te llamamos en ese hueco. Un interlocutor, siempre el mismo.",
  "agendar.meta": "Llamada · 15–20 min · 0 €",
  "agendar.figure_alt":
    "El Estratega: el chimpancé de MISTERRED360 analizando su hoja de ruta",
  "agendar.seo.title": "Pedir llamada — Agencia de Comunicación | MISTERRED360",
  "agendar.seo.desc":
    "Pide una llamada rápida con MISTERRED360, agencia de comunicación en Madrid. Elige día y franja, te llamamos nosotros. Sin apps, sin videollamadas.",
  "agendar.aria": "Formulario para pedir llamada",
  "agendar.alt.kicker": "¿Prefieres escribirlo?",
  "agendar.alt.desc":
    "Si el reto es largo o necesitas adjuntar contexto, es mejor usar el formulario con tres pasos.",
  "agendar.alt.cta": "Cuéntanos tu reto",

  /* ═══ Contacto · aviso lateral hacia /agendar ═══ */
  "contact.tip.title": "¿Con prisa?",
  "contact.tip.desc":
    "Si prefieres que te llamemos nosotros en un momento concreto, elige día y hora aproximada.",
  "contact.tip.cta": "Pedir llamada",

  /* ═══ Contacto · pestañas ═══ */
  "contact.tabs.aria": "Elige cómo quieres contactar",
  "contact.tab.form.label": "Por escrito",
  "contact.tab.form.hint": "Formulario detallado",
  "contact.tab.form.title": "Cuéntanos tu reto por escrito",
  "contact.tab.form.desc":
    "Tres pasos ágiles para que sepamos con quién hablamos y qué necesita tu marca. Te devolvemos una idea concreta en 72 horas.",
  "contact.tab.call.label": "Pedir llamada",
  "contact.tab.call.hint": "Elige día y franja",
  "contact.tab.call.title": "Que te llamemos nosotros",
  "contact.tab.call.desc":
    "Sin agendas complicadas ni enlaces de videollamada: elige un día y una franja aproximada, deja el teléfono y te llamamos.",
  "contact.whatsapp.cta": "O habla ahora mismo por WhatsApp",

  /* ═══ Contacto · info de la empresa ═══ */
  "contact.company.aria": "Información de la empresa",
  "contact.company.kicker": "La empresa",
  "contact.company.title": "Aquí nos encuentras.",
  "contact.company.desc":
    "Un teléfono, un email, una dirección, un horario. Sin centralitas, sin trampas: hablas siempre con la persona que lleva tu cuenta.",
  "contact.company.hours": "Horario",
  "contact.company.legal": "Agencia de comunicación 360 en Madrid",
  "contact.company.reply": "Respuesta en menos de 24h",

  /* ═══ Chat Launcher · botón único ═══ */
  "launcher.open": "Abrir opciones de chat",
  "launcher.close": "Cerrar opciones de chat",
  "launcher.aria": "Elegir vía de contacto",
  "launcher.assistant.title": "Asistente virtual",
  "launcher.assistant.hint": "Respuesta al instante · IA",
  "launcher.wa.title": "Hablar por WhatsApp",
  "launcher.wa.hint": "Habla con una persona",

  /* ═══ Asistente virtual (ChatGPT) ═══ */
  "ai.open": "Abrir asistente virtual",
  "ai.close": "Cerrar",
  "ai.close_panel": "Cerrar asistente",
  "ai.reset": "Reiniciar conversación",
  "ai.send": "Enviar",
  "ai.placeholder": "Escribe tu pregunta…",
  "ai.error.empty": "Perdona, no he podido responder. ¿Puedes reformular la pregunta?",
  "ai.error.offline":
    "El asistente está en modo básico ahora mismo. Contestando con la información esencial de la web.",

  /* ═══ WhatsApp · botón flotante ═══ */
  "wa.open": "Abrir WhatsApp",
  "wa.close": "Cerrar",
  "wa.close_panel": "Cerrar panel de WhatsApp",
  "wa.online": "Disponibles ahora",
  "wa.offline": "Fuera de horario",
  "wa.greeting.online":
    "¡Hola! ¿En qué podemos ayudarte? Cuéntanos brevemente tu proyecto y te contestamos en unos minutos.",
  "wa.greeting.offline":
    "Estamos fuera de horario laboral. Déjanos tu mensaje y te contestamos a primera hora del próximo día hábil.",
  "wa.placeholder": "Escribe tu mensaje…",
  "wa.send": "Abrir en WhatsApp",
  "wa.privacy":
    "Al enviar aceptas nuestra política de privacidad. No compartimos tu número con terceros.",

  "page.ia.seo.title": "Política de uso de IA | MISTERRED360",
  "page.ia.seo.desc":
    "Política de uso responsable de la inteligencia artificial en MISTERRED360, conforme al Reglamento (UE) 2024/1689 (AI Act), el RGPD y la LOPDGDD.",
  "page.ia.kicker": "Legal · IA",
  "page.ia.title": "Política de uso\nde la *IA.*",
  "page.ia.intro":
    "Cómo utiliza MISTERRED360 la inteligencia artificial en sus servicios de comunicación, marketing y contenido, con qué principios y con qué garantías para el usuario.",

  "footer.ia": "Política de IA",
  "footer.ia_short": "IA",
};

const en: Dict = {
  "seo.title": "360 Communication and Marketing Agency in Madrid | MISTERRED360",
  "seo.desc": "MISTERRED360, strategic communication agency in Madrid: press office, corporate identity, video, advertising, PR and market research.",

  "nav.manifiesto": "Manifesto",
  "nav.servicios": "Services",
  "nav.metodo": "360 Method",
  "nav.precios": "Pricing",
  "nav.agentesIA": "AI Agents",
  "nav.elenco": "Team",
  "nav.partners": "Partners",
  "nav.insights": "Insights",
  "nav.inicio": "Home",
  "nav.contacto": "Contact",
  "nav.cta": "Tell us your challenge",
  "nav.book": "Request a call",
  "nav.talk": "Let's talk?",
  "nav.status": "We reply within 24h. A real person answers.",
  "brand.tagline": "The evolution of communication",
  "nav.language": "Language",
  "nav.follow": "Follow us",
  "nav.open": "Open menu",
  "nav.close": "Close menu",
  "nav.home_aria": "MISTERRED360, go to home",
  "nav.skip": "Skip to content",

  "hero.kicker": "360 communication agency · Madrid",
  "hero.title": "Stop clowning\naround and\nmake the\n*difference.*",
  "hero.desc":
    "360 Communication Agency in Madrid specialised in brand strategy and communication, adding value and increasing return with {b}a greater degree of insight and presence{/b} in local, regional, national and international media.",
  "hero.cta.primary": "Tell us your challenge",
  "hero.cta.secondary": "Get a free idea →",
  "hero.audience": "Companies / Institutions / Brands with something to say",
  "hero.badge": "A real person replies. By name.",
  "hero.scroll": "Scroll",
  "hero.chip.prensa": "Reputation",
  "hero.chip.branding": "Identity",
  "hero.chip.av": "Creation",
  "hero.chip.estrategia": "Strategy",
  "hero.chip.impacto": "Impact",

  "manifesto.kicker": "The manifesto",
  "manifesto.title": "Soul and *precision.*\nEvery millimetre.",
  "manifesto.eco": "We're the agency that doesn't fit in a brief.",
  "manifesto.p1":
    "A regular agency assigns you an account manager. We assign you an obsession. A regular agency has a method and fits you into it; we measure your business to the millimetre and build the method around it.",
  "manifesto.p2":
    "We do communication the way it used to be done —talking to you, listening to you, understanding you— with the tools of today. 360 degrees of coverage. Zero degrees of distance.",
  "manifesto.quote": "\"We see what\neveryone else *misses*.\"",
  "manifesto.fig": "Fig. 01 — Instinct for the idea. Method for the execution.",
  "manifesto.badge": "Name, face and phone",
  "manifesto.ceo.quote": "\"The essence of a company must come from a great communication strategy that makes it different and unique.\"",
  "manifesto.ceo.role": "CEO · MISTERRED360",

  "services.kicker": "What we do",
  "services.title": "360 degrees.\n*No filler.*",
  "services.desc":
    "Five territories with names of their own. Reputation, strategy, identity, creation and digital. None of them delivered off the shelf: tailored suits, never sizes.",
  "services.cta": "I want this service",
  "services.note.cast": "The chimp changes role depending on the mission.",

  "method.kicker": "The Millimetre Method",
  "method.title.a": "Listen. Measure.",
  "method.title.b": "Build. Show up.",

  "cast.kicker": "The character",
  "cast.title": "We see what everyone\nelse *misses.*",
  "cast.subtitle": "We're not versions. We're experienced professionals, with one same instinct: make the difference and help your brand grow.",
  "cast.drag": "Drag to meet the ambassador",

  "testi.kicker": "Cases",
  "testi.title.a": "Your project isn't",
  "testi.title.b": "an account. It's",
  "testi.title.c": "an obsession.",
  "testi.rating": "4.9 / 5 · Clients who come back",
  "testi.aria": "Rating 5 out of 5",
  "testi.prev": "Previous testimonial",
  "testi.next": "Next testimonial",

  "insights.kicker": "The Red Thread",
  "insights.title.a": "Ideas that create",
  "insights.title.b": "opportunities.",
  "insights.title.c": "Free.",
  "insights.all": "See all ideas",
  "insights.read": "Read the idea",
  "insights.hook.title": "Before you hire us, take an idea home.",
  "insights.hook.desc":
    "Tell us your challenge in three lines. We'll come back with a concrete, executable idea in 72 hours. No 40-slide meeting, no strings.",
  "insights.hook.cta": "Get my idea →",

  "faq.kicker": "Frequently asked questions",
  "faq.title.a": "Answers before",
  "faq.title.b": "the",
  "faq.title.c": "briefing.",
  "faq.desc":
    "What brands, companies and institutions ask us before working with a 360 communication agency.",
  "faq.cta": "Another question? Write to us",

  "cta.kicker": "Your turn",
  "cta.title": "Your competition has\nbeen talking for six\nmonths. *And you?*",
  "cta.desc":
    "Tell us your challenge in three lines. In less than {b}72 hours{/b} we come back with a concrete, executable idea. Free. One per company. No small print.",
  "cta.button": "Tell us your challenge",

  "contact.kicker": "Contact",
  "contact.title.a": "Tell us.",
  "contact.title.b": "The rest",
  "contact.title.c": "is on us.",
  "contact.desc":
    "We reply within 24 hours. A real person replies, by name. Always. No 14-field forms, no sales call, no «we'll get back to you».",

  "form.email": "Direct email",
  "form.phone": "Phone",
  "form.address": "The den",
  "form.status": "We reply within 24 business hours",
  "form.stat.60s": "to fill out the form",
  "form.stat.48h": "for our first read",
  "form.stat.0": "for the initial proposal",
  "form.stat.1": "conversation to get going",
  "form.quote":
    "\"Tell us everything. What isn't useful, we drop; what is, we amplify.\"",
  "form.step.of": "Step {n} of {total}",
  "form.step.last": "Last step",
  "form.back": "Back",
  "form.continue": "Continue",
  "form.send": "Send proposal",
  "form.sending": "Sending signal",
  "form.step.aria": "Step {n}",

  "form.q1.title": "How can we help you?",
  "form.q1.desc":
    "Pick as many as you like. No trick: if you don't know yet, there's a chip for that too.",
  "form.q2.title": "Tell us who you are.",
  "form.q2.desc": "Two taps and we keep going: who's writing and from what moment.",
  "form.q2.profile": "What are you?",
  "form.q2.stage": "Where are you now?",
  "form.q3.title": "A couple more details.",
  "form.q3.desc": "It helps us get to the point on the first call. Nothing binding.",
  "form.q3.timing": "When do you need it?",
  "form.q3.source": "How did you find us?",
  "form.q4.title": "And finally, your details.",
  "form.q4.desc":
    "We just need how to reach you. Everything else you've already told us.",
  "form.field.name": "Name *",
  "form.field.company": "Company or organisation",
  "form.field.email": "Email *",
  "form.field.phone": "Phone (optional)",
  "form.field.message": "Anything else we should know? (optional)",
  "form.privacy": "I have read and accept MISTERRED360's privacy policy.",
  "form.sent.title": "Received.",
  "form.sent.desc":
    "The team is already working on your message. We'll come back with a first strategic read within 48 hours.",
  "form.sent.top": "Back to top",
  "form.sent.another": "Send another message",

  "need.prensa": "Get in the press",
  "need.plan": "Communication plan",
  "need.identidad": "New identity",
  "need.audiovisual": "Video and content",
  "need.redes": "Social media",
  "need.eventos": "PR and events",
  "need.publicidad": "Campaigns and ads",
  "need.datos": "Market research",
  "need.360": "The full 360° circle",
  "need.explorar": "We're still exploring",

  "profile.empresa": "Company / Brand",
  "profile.institucion": "Public institution",
  "profile.startup": "Startup / Founder",
  "profile.ong": "NGO / Association",
  "profile.personal": "Personal brand",

  "stage.lanzamos": "We're launching something new",
  "stage.reactivar": "We need to reactivate",
  "stage.crisis": "We're in a critical moment",
  "stage.crecer": "We want to grow with order",
  "stage.reposicionar": "Time to reposition",

  "timing.ya": "Now",
  "timing.mes": "This month",
  "timing.tri": "This quarter",
  "timing.flex": "Flexible",

  "source.google": "Google search",
  "source.redes": "Social media",
  "source.prensa": "In press or media",
  "source.recomendacion": "Someone recommended us",
  "source.evento": "Event or talk",
  "source.cliente": "We're already clients",
  "source.otro": "Another channel",

  "footer.explore": "Explore",
  "footer.services": "360 Services",
  "footer.den": "The den",
  "footer.top": "Back to top",
  "footer.rights": "© 2026 MISTERRED360 — All rights reserved",
  "footer.slogan": "Experienced professionals, with one same instinct: make the difference and help your brand grow",
  "footer.made": "Made with instinct · 40.4168° N",
  "footer.privacy": "Privacy policy",
  "footer.cookies": "Cookie policy",
  "footer.cookie_prefs": "Cookie preferences",
  "footer.a11y": "Accessibility",
  "footer.privacy_short": "Privacy",
  "footer.cookies_short": "Cookies",
  "footer.prefs_short": "Preferences",
  "footer.download": "Download copy",
  "footer.download_short": "Copy",

  "shell.back": "Back to home",
  "shell.cta.title": "Shall we talk about your brand?",
  "shell.cta.desc":
    "First strategic read within 48 hours. No commitment, no scripted answers.",
  "shell.cta.button": "Request a proposal",
  "shell.footer.short":
    "Strategic communication, reputation and 360 growth agency in Madrid.",
  "shell.footer.contact": "Contact",
  "shell.footer.gocontact": "Go to contact",

  "cookie.title": "Cookies with criteria.",
  "cookie.desc":
    "We use own and third-party cookies to analyze browsing and improve the experience. You can accept all, reject them or configure them by category. More info in our {a}cookie policy{/a}.",
  "cookie.reject": "Reject all",
  "cookie.configure": "Configure",
  "cookie.accept": "Accept all",
  "cookie.panel.kicker": "Preferences",
  "cookie.panel.title": "Configure your cookies",
  "cookie.panel.desc":
    "You can accept or reject each category separately. Technical cookies are essential for the site to work and cannot be turned off.",
  "cookie.panel.save": "Save preferences",
  "cookie.panel.footer":
    "You can change these preferences at any time from the \"Cookie preferences\" link in the footer.",
  "cookie.close": "Close",
  "cookie.close_panel": "Close cookie panel",
  "cookie.cat.necessary": "Technical or strictly necessary",
  "cookie.cat.necessary.desc":
    "Essential for the basic operation of the site: navigation, forms, security and session preferences. Cannot be disabled.",
  "cookie.cat.preferences": "Preferences or personalisation",
  "cookie.cat.preferences.desc":
    "Remember the user's choices (language, region, visual settings) to personalise the experience.",
  "cookie.cat.analytics": "Analytics or statistics",
  "cookie.cat.analytics.desc":
    "Measure site usage, count visits and analyse performance to improve it (e.g., Google Analytics).",
  "cookie.cat.marketing": "Marketing or behavioural advertising",
  "cookie.cat.marketing.desc":
    "Collect information about your browsing to show personalised advertising on and off this site.",

  "a11y.open": "Open accessibility panel",
  "a11y.title": "Accessibility",
  "a11y.kicker": "Accessibility",
  "a11y.panel.title": "Adjust the experience",
  "a11y.close": "Close",
  "a11y.close_panel": "Close accessibility panel",
  "a11y.text": "Text size",
  "a11y.spacing": "Reading spacing",
  "a11y.spacing.normal": "Normal",
  "a11y.spacing.wide": "Wide",
  "a11y.view": "Display",
  "a11y.contrast": "High contrast",
  "a11y.contrast.desc": "Pure black background with white text and red accent.",
  "a11y.underline": "Underline links",
  "a11y.underline.desc": "Visually mark all interactive links and buttons.",
  "a11y.dyslexia": "Dyslexia-friendly font",
  "a11y.dyslexia.desc":
    "Switches to a more neutral sans typeface with extra spacing.",
  "a11y.motion": "Motion",
  "a11y.motion.reduce": "Reduce animations",
  "a11y.motion.reduce.desc":
    "Disables parallax, transitions and non-essential motion.",
  "a11y.motion.grain": "Pause background grain",
  "a11y.motion.grain.desc": "Stops the animated grain texture.",
  "a11y.focus": "Reading and focus",
  "a11y.cursor": "Large cursor",
  "a11y.cursor.desc": "Increases the size of the custom cursor.",
  "a11y.guide": "Reading guide",
  "a11y.guide.desc": "Horizontal red line that follows the pointer.",
  "a11y.mask": "Reading mask",
  "a11y.mask.desc": "Darkens the rest of the screen leaving a bright strip.",
  "a11y.listen": "Listen to content",
  "a11y.listen.desc": "Voice reading of the headings and texts of the current page.",
  "a11y.listen.play": "Listen to this page",
  "a11y.listen.stop": "Stop reading",
  "a11y.reset": "Reset settings",
  "a11y.persist":
    "These settings are stored in your browser and applied on every page of the site.",

  "loader.a11y": "Loading MISTERRED360",
  "loader.subtitle": "Putting the brand into orbit",
  "loader.experience": "360° Experience",

  /* ═══ Interior pages ═══ */
  "page.man.seo.title": "Manifesto — Strategic Communication Agency | MISTERRED360",
  "page.man.seo.desc": "MISTERRED360's declaration of intent: strategic communication, reputation and 360-degree growth. The five principles of our communication agency in Madrid.",
  "page.man.kicker": "The manifesto",
  "page.man.meta": "Madrid · Since 2011",
  "page.man.title": "We believe in communication\nas a *competitive advantage.*",
  "page.man.intro": "This isn't an \"about us\" page. It's the declaration of intent of an agency that treats communication as its clients' business.",
  "page.man.quote": "We put our {red}soul{/red}\ninto every project.",
  "page.man.p1": "We're the agency that doesn't fit in a brief. A regular agency assigns you an account manager. We assign you people who get involved and put their soul into every project.",
  "page.man.p2": "We do communication the way it used to be done —talking to you in depth, listening to you, understanding you— with the magic of today's tools. 360 degrees of coverage at zero degrees of distance.",
  "page.man.principles.title": "Five principles.\n{red}Zero excuses.{/red}",
  "page.man.p01.t": "Communication leads",
  "page.man.p01.d": "It's not a department, an extra, or a late-project idea. It's the infrastructure on which a brand's reputation, trust and growth are built.",
  "page.man.p02.t": "Strategy before aesthetics",
  "page.man.p02.d": "Pretty that doesn't work is decoration. Every piece we produce answers to an objective, a message and an audience defined before opening the computer.",
  "page.man.p03.t": "Instinct + data",
  "page.man.p03.d": "Instinct opens paths; data confirms them. We investigate before proposing and measure after publishing. Creativity is defended with evidence.",
  "page.man.p04.t": "Radical closeness",
  "page.man.p04.d": "You speak with the people who think and execute your account. No layers, no middlemen, no scripted answers. Trust is a deliverable too.",
  "page.man.p05.t": "The full turn",
  "page.man.p05.d": "No isolated action builds a brand. Press, identity, content and distribution spin together or they don't spin at all. That's why we're called 360.",
  "page.man.socio.title": "The smartest partner\nin the {red}room.{/red}",
  "page.man.socio.p": "Our chimp isn't a mascot or a corporate joke. He's an ambassador: he observes before speaking, thinks three moves ahead and never goes unnoticed. Exactly what we ask of every strategy we sign.",
  "page.man.socio.q": "\"The essence of a company must emanate from a great communication strategy that makes it different and unique.\"",
  "page.man.socio.badge": "The leader of the pack",
  "page.man.socio.fig": "Fig. 02 — Observe. Think. Speak. In that order.",
  "page.man.socio.cta": "Meet the cast",
  "page.man.final.quote": "\"Wherever it's needed, whenever it's needed. {red}That's the entire communication policy.{/red}\"",
  "page.man.final.badge": "The pack · Live",
  "page.man.final.fig": "Fig. 03 — The full turn, live.",

  "page.srv.seo.title": "360 Communication Agency Services: Press, Branding and Marketing | MISTERRED360",
  "page.srv.seo.desc": "360 communication services in Madrid: press office, strategic planning, digital communication, PR and events, corporate identity, video, advertising and market research.",
  "page.srv.kicker": "360 Services",
  "page.srv.meta": "8 services · 4 blocks · 1 vision",
  "page.srv.title": "360 degrees: *maximum impact*\nand visibility.",
  "page.srv.intro": "Three territories with a name of their own: press office, strategy and action plan, branding and identity, creation and digital storytelling. Not one of them will feel standardized: made to measure, never off the rack.",
  "page.srv.figure_alt": "The Publicist: MISTERRED360's chimp reviewing the marketing strategy",
  "page.srv.cta.service": "Request this service",
  "page.srv.close.kicker": "The full circle",
  "page.srv.close.title": "Don't know which piece\nyou need? Start with the full turn.",
  "page.srv.close.p": "We audit your current communication, spot reputation leaks and propose a 360 plan with clear priorities. No smoke, and a closed budget.",
  "page.srv.close.cta": "Request 360 audit",

  "page.ai.capabilities_kicker": "What it does",
  "page.ai.capabilities_title": "An employee that never rests, but always listens",
  "page.ai.process_kicker": "How we do it",
  "page.ai.process_title": "From idea to live agent",
  "page.ai.process_desc": "No generic templates. Every agent is built from scratch with your real knowledge.",
  "page.ai.faq_kicker": "Frequent questions",
  "page.ai.faq_title": "Before you ask",
  "page.ai.faq_cta": "Tell us your case",

  "page.met.seo.title": "360 Method: Communication Plan in 4 Phases | MISTERRED360",
  "page.met.seo.desc": "How MISTERRED360, a communication agency in Madrid, works: observe, think, create, amplify and envision. A complete communication plan in five measurable phases.",
  "page.met.kicker": "The Millimetre Method",
  "page.met.meta": "5 phases · 360 degrees · 0 improvisation",
  "page.met.title": "Listen. Measure.\nBuild. *Show up.*",
  "page.met.intro": "Five phases that spin in a circle around your brand, each time with more judgment and more impact.",
  "page.met.figure_alt": "The Strategist: MISTERRED360's chimp analyzing his roadmap",
  "page.met.deliverables": "Phase deliverables",
  "page.met.verb.observar": "OBSERVE",
  "page.met.verb.pensar": "THINK",
  "page.met.verb.crear": "CREATE",
  "page.met.verb.amplificar": "AMPLIFY",
  "page.met.verb.visionar": "ENVISION",
  "page.met.p01.title": "First we listen. Always.",
  "page.met.p01.desc": "Brand audit, market research and active listening. Before saying a word on your behalf, we understand your environment, your audience and your real opportunities.",
  "page.met.p01.ext": "We audit your brand, your environment and the conversation that already exists about you. Interviews, market research and social listening to know exactly where you are before deciding where we go.",
  "page.met.p01.d1": "Communication audit",
  "page.met.p01.d2": "Market study",
  "page.met.p01.d3": "Audience and media map",
  "page.met.p02.title": "Strategy sets the pace.",
  "page.met.p02.desc": "We turn findings into a roadmap: ordered messages, prioritized channels and goals aligned with a 360-degree global vision.",
  "page.met.p02.ext": "We turn findings into decisions: what to say, to whom, how and where. A realistic, measurable communication plan that orders messages, prioritizes channels and sets the pace for everything that follows.",
  "page.met.p02.d1": "Communication plan",
  "page.met.p02.d2": "Message architecture",
  "page.met.p02.d3": "Channel plan and calendar",
  "page.met.p03.title": "Pieces nobody ignores.",
  "page.met.p03.desc": "Identity, press, video and campaigns with their own character. Creativity doesn't decorate the strategy: it makes it impossible to ignore.",
  "page.met.p03.ext": "Identity, content, press pieces, video and campaigns with their own character. Creativity doesn't decorate the strategy: it makes it impossible to ignore. Every piece is born from the plan, never from whim.",
  "page.met.p03.d1": "Identity and brand pieces",
  "page.met.p03.d2": "Editorial and press content",
  "page.met.p03.d3": "Video and campaign pieces",
  "page.met.p04.title": "Full turn. And another.",
  "page.met.p04.desc": "Media distribution, social, advertising and events. We measure, learn and optimize: the 360° circle never fully closes.",
  "page.met.p04.ext": "Distribution in media, social, advertising and events. We measure impact, learn and optimize. And when the circle completes, it starts over: every turn feeds the next.",
  "page.met.p04.d1": "Media and social distribution",
  "page.met.p04.d2": "Campaigns and activations",
  "page.met.p04.d3": "Results report and learning",
  "page.met.p05.title": "The circle closes. And grows.",
  "page.met.p05.desc": "Brand growth and guaranteed return to face a new cycle with new challenges from an optimal position: brands with potential consolidate, stand out and become benchmarks in their sector.",
  "page.met.p05.ext": "The circle closes with brand growth and guaranteed return to face a new cycle with new challenges and goals from an optimal, favourable position. Brands with potential consolidate and stand out in an increasingly competitive market, becoming sector benchmarks with fresh, different approaches.",
  "page.met.p05.d1": "Growth report",
  "page.met.p05.d2": "New cycle plan",
  "page.met.p05.d3": "New challenges and goals",
  "page.met.close.title": "The circle never\nfully {red}closes.{/red}",
  "page.met.close.p": "Every measurement feeds the next turn. Brands that start with a press office end up spinning the full circle: that's the natural trajectory when communication is taken seriously.",
  "page.met.close.cta": "Start my first turn",

  "page.ele.seo.title": "The Cast — Branding with Character | MISTERRED360",
  "page.ele.seo.desc": "MISTERRED360's chimp: eight versions of a premium brand ambassador. Spokesperson, strategist, host, designer, director, publicist and analyst.",
  "page.ele.kicker": "The cast",
  "page.ele.meta": "1 character · 8 roles · 360° of character",
  "page.ele.title": "Experienced professionals,\nwith one same *instinct:* make\nthe difference and help your brand grow.",
  "page.ele.intro": "We see what others overlook. Experience, professionalism and proven track records in journalism, web design, video, advertising, marketing and AI expertise.",
  "page.ele.figure_alt": "The Icon: MISTERRED360's chimp in black suit and red glasses",
  "page.ele.h.title": "An ambassador,\nnot a {red}mascot.{/red}",
  "page.ele.h.p1": "Most corporate characters get a laugh. Ours does strategy. He observes, analyzes, communicates, leads and connects: every version of the cast embodies a discipline of the agency and a way of standing in front of your brand.",
  "page.ele.h.p2": "That's why he works as a graphic signature on any surface: from the hero arch to the slide of a communication plan, always the same character in a different suit.",
  "page.ele.h.fig": "Fig. 00 — The original version. Everything else is wardrobe.",
  "page.ele.treat.1.t": "Red duotone",
  "page.ele.treat.1.d": "For insights and editorial.",
  "page.ele.treat.2.t": "Monochrome",
  "page.ele.treat.2.d": "For manifesto and reputation.",
  "page.ele.treat.3.t": "Editorial arch",
  "page.ele.treat.3.d": "For hero and covers.",
  "page.ele.treat.4.t": "Controlled glow",
  "page.ele.treat.4.d": "Only where it adds value.",
  "page.ele.full.title": "The full\n{red}cast.{/red}",
  "page.ele.full.p": "We're not versions. We're experienced professionals, with one same instinct: make the difference and help your brand grow.",
  "page.ele.collab.title": "Collaborators",
  "page.ele.collab.desc": "Bringing value, freshness and new generations into the mix.",
  "page.ele.allies.title": "Partnerships",
  "page.ele.allies.desc": "If you want to be the best, surround yourself with the best. And that's exactly what we're doing.",
  "page.ele.close.kicker": "Join the pack",
  "page.ele.close.title": "Every great brand needs\na character like this.",
  "page.ele.close.p": "Or at least an agency that works with the same instinct. Tell us your case and we'll tell you which version of the cast your brand needs.",
  "page.ele.close.cta": "Introduce me to the cast",


  "page.cont.seo.title": "Contact — Communication Agency in Madrid | MISTERRED360",
  "page.cont.seo.desc": "Contact MISTERRED360, strategic communication agency in Madrid. Request your proposal for press office, corporate identity, video, advertising or a full 360 plan.",
  "page.cont.meta": "Reply within 24 business hours",
  "page.cont.title": "Tell us your story.\nWe'll bring *the echo.*",
  "page.cont.intro": "Every great brand starts with a conversation. No endless forms, no automatic replies: you write to us, we read carefully and come back with a first strategic read within 48 hours.",
  "page.cont.figure_alt": "MISTERRED360's chimp pointing directly at the visitor from his office",
  "page.cont.form_aria": "Contact form and details",

  "page.blog.seo.title": "Insights and News on Communication and Marketing | MISTERRED360",
  "page.blog.seo.desc": "MISTERRED360's blog: news, analysis and insights on strategic communication, press office, brand reputation, branding, video and marketing.",
  "page.blog.back": "Back to home",
  "page.blog.kicker": "Insights",
  "page.blog.title.a": "Communication news",
  "page.blog.title.b": "written",
  "page.blog.title.c": "with {red}judgment.{/red}",
  "page.blog.intro": "A simple section for publishing news, analysis and opinion from the MISTERRED360 lens: communication, reputation, brand, marketing and growth.",
  "page.blog.last": "Latest insight",
  "page.blog.all.kicker": "All the news",
  "page.blog.all.title": "Insight archive",
  "page.blog.all.desc": "Click any story to see it in the full editorial template.",
  "page.blog.mini.subtitle": "Back to the 360 experience",
  "page.blog.mini.services": "Services",
  "page.blog.mini.contact": "Contact",

  "post.back.index": "All insights",
  "post.back.home": "Back to home",
  "post.kicker": "Story",
  "post.card.author": "Author",
  "post.card.category": "Category",
  "post.card.read": "Reading",
  "post.card.title": "Story card",
  "post.cta.title": "Want your brand to make news?",
  "post.cta.button": "Request a proposal",
  "post.related.kicker": "All the news",
  "post.related.title": "Keep reading",
  "post.related.button": "See full index",
  "post.404.kicker": "Insight not found",
  "post.404.title": "This story doesn't exist.",
  "post.404.button": "See all insights",

  "legal.updated": "Last updated",
  "legal.updated.value": "July 1, 2026",

  "page.priv.seo.title": "Privacy Policy | MISTERRED360",
  "page.priv.seo.desc": "MISTERRED360's privacy policy, communication agency in Madrid: controller, purposes, legal basis, retention and rights of the data subject in accordance with the GDPR.",
  "page.priv.kicker": "Legal · Privacy",
  "page.priv.title": "Privacy\n*policy.*",
  "page.priv.intro": "How we handle, protect and respect the personal data received through the MISTERRED360 website, in accordance with the GDPR and the Spanish LOPDGDD.",

  "page.cook.seo.title": "Cookie Policy | MISTERRED360",
  "page.cook.seo.desc": "MISTERRED360's cookie policy: own and third-party cookies, purposes, duration and consent management in accordance with the GDPR and the Spanish LSSI.",
  "page.cook.kicker": "Legal · Cookies",
  "page.cook.title": "Cookie\n*policy.*",
  "page.cook.intro": "Everything on how MISTERRED360 uses own and third-party cookies, and how you can accept, reject or configure them at any time.",
  "page.cook.panel.kicker": "Preferences panel",
  "page.cook.panel.title": "Manage your consent",
  "page.cook.panel.desc": "You can change your choice at any time or reset it completely.",
  "page.cook.panel.configure": "Configure cookies",
  "page.cook.panel.reset": "Reset consent",

  /* ═══ Contact · mode selector ═══ */
  "contact.mode.kicker": "Choose how we talk",
  "contact.mode.title.a": "Two ways.",
  "contact.mode.title.b": "No noise.",
  "contact.mode.desc":
    "You can walk us through your challenge in writing, at your own pace, or simply ask us to call you. You choose how the conversation starts.",
  "contact.mode.back": "Change option",
  "contact.mode.foot":
    "No sales calls, no gimmicks: whichever you pick, you speak with a real person by name and phone.",

  "contact.mode.option.a.kicker": "Option 01",
  "contact.mode.option.a.title": "Tell us\nyour challenge in writing",
  "contact.mode.option.a.desc":
    "Short form with the essentials so we can prepare a first strategic read. We reply within 24 business hours.",
  "contact.mode.option.a.cta": "Go to the form",
  "contact.mode.form.title": "Tell us your challenge",
  "contact.mode.form.desc":
    "Three quick steps so we know who's writing and what your brand needs. We come back with a concrete idea in 72 hours.",

  "contact.mode.option.b.kicker": "Option 02",
  "contact.mode.option.b.title": "Ask us\nto call you",
  "contact.mode.option.b.desc":
    "Pick a day and a rough time slot (morning or afternoon). We'll call you from our corporate number within that window. No apps, no video calls: just phone.",
  "contact.mode.option.b.cta": "Request a call",
  "contact.mode.call.title": "Ask us to call you",
  "contact.mode.call.desc":
    "No shared calendars or video links: pick a day and a rough time slot, leave your phone and we'll call. Same person every time.",

  /* ═══ BookingBlock · request a call ═══ */
  "call.step.1.title": "Which day works for you?",
  "call.step.2.title": "Morning or afternoon?",
  "call.step.3.title": "Which number should we call?",
  "call.slot.morning": "In the morning",
  "call.slot.afternoon": "In the afternoon",
  "call.pending": "Pick a day and slot to leave your phone.",
  "call.prev": "Previous week",
  "call.next": "Next week",

  "call.field.name": "Name *",
  "call.field.phone": "Phone *",
  "call.field.email": "Email (optional)",
  "call.field.topic": "What's the call about (optional)",
  "call.privacy":
    "I accept the privacy policy. You may call me at the number provided within the chosen time slot.",

  "call.confirm": "Request the call",
  "call.sending": "Booking the call",
  "call.sent.title": "Noted. We'll call you.",
  "call.sent.desc":
    "We'll call you within the slot you picked from our corporate number. If you miss it, we try once more and follow up by email.",
  "call.sent.card": "Your call",
  "call.sent.another": "Request another call",

  "call.aside.kicker": "How it works",
  "call.aside.title": "No calendar tug-of-war.\nNo weird links.",
  "call.aside.desc":
    "We block the slot on our end and call you. No video meetings, no apps, no room PINs. Just phone.",
  "call.perk.1": "One contact. Always the same.",
  "call.perk.2": "Expected length: 15–20 minutes.",
  "call.perk.3": "If you miss it, we retry and email you.",
  "call.perk.4": "Zero pushy sales. Promise.",

  /* ═══ Book a call page (/agendar) ═══ */
  "agendar.kicker": "Request a call",
  "agendar.title": "Pick day and slot.\n*We call you.*",
  "agendar.intro":
    "No calendar tug-of-war, no video links. Pick a weekday, choose morning or afternoon, leave your phone and we call you within that slot. One contact, always the same.",
  "agendar.meta": "Call · 15–20 min · 0 €",
  "agendar.figure_alt":
    "The Strategist: MISTERRED360's chimp analysing his roadmap",
  "agendar.seo.title": "Request a Call — Communication Agency | MISTERRED360",
  "agendar.seo.desc":
    "Request a quick call with MISTERRED360, a communication agency in Madrid. Pick day and slot, we call you. No apps, no video meetings.",
  "agendar.aria": "Request-a-call form",
  "agendar.alt.kicker": "Prefer to write it out?",
  "agendar.alt.desc":
    "If the challenge is long or needs context to attach, the three-step form works better.",
  "agendar.alt.cta": "Tell us your challenge",

  /* ═══ Contact · sidebar tip pointing to /agendar ═══ */
  "contact.tip.title": "In a hurry?",
  "contact.tip.desc":
    "If you'd rather have us call you at a specific moment, pick a day and rough time slot.",
  "contact.tip.cta": "Request a call",

  /* ═══ Contact · tabs ═══ */
  "contact.tabs.aria": "Pick how you'd like to reach us",
  "contact.tab.form.label": "In writing",
  "contact.tab.form.hint": "Detailed form",
  "contact.tab.form.title": "Tell us your challenge in writing",
  "contact.tab.form.desc":
    "Three quick steps so we know who's writing and what your brand needs. We come back with a concrete idea in 72 hours.",
  "contact.tab.call.label": "Request a call",
  "contact.tab.call.hint": "Pick day and slot",
  "contact.tab.call.title": "Ask us to call you",
  "contact.tab.call.desc":
    "No shared calendars, no video links: pick a day and a rough time slot, leave your phone and we'll call you.",
  "contact.whatsapp.cta": "Or talk right now on WhatsApp",

  /* ═══ Contact · company info ═══ */
  "contact.company.aria": "Company information",
  "contact.company.kicker": "The company",
  "contact.company.title": "This is where you'll find us.",
  "contact.company.desc":
    "One phone, one email, one address, one set of hours. No call centres, no gimmicks: you always speak with the person handling your account.",
  "contact.company.hours": "Business hours",
  "contact.company.legal": "360 communication agency in Madrid",
  "contact.company.reply": "Reply within 24h",

  /* ═══ Chat Launcher · single button ═══ */
  "launcher.open": "Open chat options",
  "launcher.close": "Close chat options",
  "launcher.aria": "Pick a contact channel",
  "launcher.assistant.title": "Virtual assistant",
  "launcher.assistant.hint": "Instant reply · AI",
  "launcher.wa.title": "Chat on WhatsApp",
  "launcher.wa.hint": "Talk to a real person",

  /* ═══ Virtual assistant (ChatGPT) ═══ */
  "ai.open": "Open virtual assistant",
  "ai.close": "Close",
  "ai.close_panel": "Close assistant",
  "ai.reset": "Reset conversation",
  "ai.send": "Send",
  "ai.placeholder": "Type your question…",
  "ai.error.empty": "Sorry, I couldn't answer that. Could you rephrase?",
  "ai.error.offline":
    "The assistant is in basic mode right now. Replying with the site's essential info.",

  /* ═══ WhatsApp · floating button ═══ */
  "wa.open": "Open WhatsApp",
  "wa.close": "Close",
  "wa.close_panel": "Close WhatsApp panel",
  "wa.online": "Available now",
  "wa.offline": "Outside business hours",
  "wa.greeting.online":
    "Hi! How can we help? Tell us briefly about your project and we'll reply in a few minutes.",
  "wa.greeting.offline":
    "We're outside business hours. Leave us your message and we'll reply first thing on the next business day.",
  "wa.placeholder": "Type your message…",
  "wa.send": "Open in WhatsApp",
  "wa.privacy":
    "By sending you accept our privacy policy. We won't share your number with third parties.",

  "page.ia.seo.title": "AI Use Policy | MISTERRED360",
  "page.ia.seo.desc":
    "MISTERRED360's responsible AI use policy, aligned with Regulation (EU) 2024/1689 (AI Act), the GDPR and the Spanish LOPDGDD.",
  "page.ia.kicker": "Legal · AI",
  "page.ia.title": "AI use\n*policy.*",
  "page.ia.intro":
    "How MISTERRED360 uses artificial intelligence across its communication, marketing and content services — with which principles and which safeguards for users.",

  "footer.ia": "AI use policy",
  "footer.ia_short": "AI",
};

/* eslint-disable */
// @ts-ignore
const _unused_ca: Dict = {
  "nav.manifiesto": "Manifest",
  "nav.servicios": "Serveis",
  "nav.metodo": "Mètode 360",
  "nav.elenco": "Repartiment",
  "nav.insights": "Insights",
  "nav.inicio": "Inici",
  "nav.contacto": "Contacte",
  "nav.cta": "Sol·licitar proposta",
  "nav.status": "Acceptant marques el 2026",
  "nav.language": "Idioma",
  "nav.follow": "Segueix-nos",
  "nav.open": "Obrir menú",
  "nav.close": "Tancar menú",
  "nav.home_aria": "MISTERRED360, anar a l'inici",
  "nav.skip": "Saltar al contingut",

  "hero.kicker": "Agència de comunicació estratègica · Madrid",
  "hero.title": "Agència de\ncomunicació que\ndona la *volta*\na la teva marca.",
  "hero.desc":
    "Estratègia, reputació i creixement en {b}360 graus{/b}. Premsa, identitat, audiovisual i màrqueting girant junts al voltant d'un únic objectiu: que es parli —i bé— de la teva marca.",
  "hero.cta.primary": "Sol·licitar proposta",
  "hero.cta.secondary": "Veure serveis 360",
  "hero.audience": "Empreses / Institucions / Marques amb història",
  "hero.badge": "El soci més llest de la sala",
  "hero.scroll": "Scroll",
  "hero.chip.prensa": "Premsa",
  "hero.chip.branding": "Branding",
  "hero.chip.av": "Audiovisual",

  "manifesto.kicker": "El manifest",
  "manifesto.title": "Comunicació estratègica,\nreputació i *creixement.*",
  "manifesto.eco": "No fem soroll: fem ressò.",
  "manifesto.p1":
    "MISTERRED360 no ven serveis solts. Dissenyem ecosistemes de comunicació on l'estratègia mana, la creativitat sorprèn i els resultats es mesuren.",
  "manifesto.p2":
    "Venim de molts anys explicant històries d'altres, ara amb una ambició més gran: fer la volta completa. Premsa, identitat, contingut, difusió i dades girant a la mateixa òrbita. La teva marca.",
  "manifesto.quote": "«El mico observa, pensa i parla.\nEn aquest ordre.»",
  "manifesto.fig": "Fig. 01 — El soci més llest de la sala, al seu hàbitat.",
  "manifesto.badge": "El fundador silenciós",

  "services.kicker": "Serveis 360",
  "services.title": "Serveis d'agència\nde comunicació *360.*",
  "services.desc":
    "Vuit especialitats, una visió: la comunicació és el nucli; la identitat i la difusió giren al seu voltant. Gabinet de premsa, branding, audiovisual i màrqueting amb la mateixa direcció estratègica.",
  "services.cta": "Vull aquest servei",
  "services.note.cast": "El repartiment canvia de rol segons la missió.",

  "sblock.comunicacion.title": "Comunicació Estratègica",
  "sblock.comunicacion.claim": "El cor de tot el que fem.",
  "sblock.comunicacion.desc":
    "Convertim fets en notícies i notícies en reputació. Cap marca creix sense un relat que la sostingui: aquí comença tot.",
  "sblock.identidad.title": "Identitat i Posicionament",
  "sblock.identidad.claim": "Qui ets, com et veus i per què importes.",
  "sblock.identidad.desc":
    "Les marques que perduren es reconeixen a l'instant. Construïm identitats amb caràcter i continguts que les fan inoblidables.",
  "sblock.difusion.title": "Difusió, Màrqueting i Creixement",
  "sblock.difusion.claim": "La visibilitat, convertida en negoci.",
  "sblock.difusion.desc":
    "Amplifiquem amb criteri: campanyes, mitjans i dades que transformen l'atenció en resultats mesurables.",

  "method.kicker": "Mètode 360",
  "method.title.a": "Pla de comunicació",
  "method.title.b": "en quatre girs.",

  "whyus.kicker": "Per què 360",
  "whyus.title": "La teva agència de comunicació\ni *màrqueting* a Madrid.",
  "whyus.desc":
    "Instint d'agència, visió de consultora. Qualsevol pot publicar, imprimir o anunciar-se. El difícil és que tot digui el mateix, en el moment just i cap al mateix objectiu. Això és el que fem.",

  "cast.kicker": "El repartiment",
  "cast.title": "Branding i imatge\ncorporativa amb *caràcter.*",
  "cast.drag": "Arrossega per conèixer l'equip",

  "testi.kicker": "Reputació",
  "testi.title.a": "Reputació construïda",
  "testi.title.b": "amb",
  "testi.title.c": "marques reals.",
  "testi.rating": "4,9 / 5 · Clients que parlen",
  "testi.aria": "Valoració 5 de 5",
  "testi.prev": "Testimoni anterior",
  "testi.next": "Testimoni següent",

  "insights.kicker": "Insights",
  "insights.title.a": "Blog i insights de",
  "insights.title.b": "comunicació i",
  "insights.title.c": "màrqueting.",
  "insights.all": "Veure tots els insights",
  "insights.read": "Llegir insight",

  "faq.kicker": "Preguntes freqüents",
  "faq.title.a": "Dubtes resolts",
  "faq.title.b": "abans del",
  "faq.title.c": "briefing.",
  "faq.desc":
    "El que marques, empreses i institucions ens pregunten abans de començar a treballar amb una agència de comunicació 360.",
  "faq.cta": "Un altre dubte? Escriu-nos",

  "cta.kicker": "El teu torn",
  "cta.title": "Parlem\nde la *teva marca?*",
  "cta.desc":
    "Explica'ns què necessita la teva marca. En menys de {b}48 hores{/b} et retornem una primera lectura estratègica: clara, honesta i sense compromís.",
  "cta.button": "Començar ara",

  "contact.kicker": "Contacte",
  "contact.title.a": "Contacta amb la teva",
  "contact.title.b": "agència de",
  "contact.title.c": "comunicació.",
  "contact.desc":
    "Explica'ns la teva història. Cada gran marca comença amb una conversa i la nostra comença aquí: sense formularis eterns ni respostes automàtiques.",

  "form.email": "Email directe",
  "form.phone": "Telèfon",
  "form.address": "El cau",
  "form.status": "Responem en menys de 24h laborables",
  "form.stat.60s": "per completar el formulari",
  "form.stat.48h": "per a la nostra primera lectura",
  "form.stat.0": "per la proposta inicial",
  "form.stat.1": "conversa per arrencar",
  "form.quote":
    "«Explica-ho tot. El que no serveixi, ho llencem; el que valgui, ho amplifiquem.»",
  "form.step.of": "Pas {n} de {total}",
  "form.step.last": "Últim pas",
  "form.back": "Enrere",
  "form.continue": "Continuar",
  "form.send": "Enviar proposta",
  "form.sending": "Enviant senyal",
  "form.step.aria": "Pas {n}",

  "form.q1.title": "En què et podem ajudar?",
  "form.q1.desc":
    "Tria'n tantes com vulguis. Sense trampa: si encara no ho saps, hi ha un xip per a això.",
  "form.q2.title": "Explica'ns qui ets.",
  "form.q2.desc": "Dos tocs i continuem: qui ens escriu i des de quin moment.",
  "form.q2.profile": "Què ets?",
  "form.q2.stage": "En quin moment esteu?",
  "form.q3.title": "Un parell de detalls més.",
  "form.q3.desc":
    "Ens ajuda a anar al gra a la primera trucada. Res és vinculant.",
  "form.q3.timing": "Quan ho necessiteu?",
  "form.q3.source": "Com ens has conegut?",
  "form.q4.title": "I per últim, les teves dades.",
  "form.q4.desc":
    "Només necessitem per on escriure't. Tota la resta ja ens ho has explicat.",
  "form.field.name": "Nom *",
  "form.field.company": "Empresa o organització",
  "form.field.email": "Email *",
  "form.field.phone": "Telèfon (opcional)",
  "form.field.message": "Alguna cosa més que hàgim de saber? (opcional)",
  "form.privacy": "He llegit i accepto la política de privacitat de MISTERRED360.",
  "form.sent.title": "Rebut.",
  "form.sent.desc":
    "L'equip ja hi està donant voltes al teu missatge. Et retornem una primera lectura estratègica en menys de 48 hores.",
  "form.sent.top": "Tornar amunt",
  "form.sent.another": "Enviar un altre missatge",

  "need.prensa": "Sortir a la premsa",
  "need.plan": "Pla de comunicació",
  "need.identidad": "Nova identitat",
  "need.audiovisual": "Vídeo i contingut",
  "need.redes": "Xarxes socials",
  "need.eventos": "RRPP i esdeveniments",
  "need.publicidad": "Campanyes i ads",
  "need.datos": "Estudis de mercat",
  "need.360": "Tot el cercle 360°",
  "need.explorar": "Encara estem explorant",

  "profile.empresa": "Empresa / Marca",
  "profile.institucion": "Institució pública",
  "profile.startup": "Startup / Emprenedor",
  "profile.ong": "ONG / Associació",
  "profile.personal": "Marca personal",

  "stage.lanzamos": "Estem llançant alguna cosa nova",
  "stage.reactivar": "Necessitem reactivar",
  "stage.crisis": "Estem en un moment crític",
  "stage.crecer": "Volem créixer amb ordre",
  "stage.reposicionar": "Toca reposicionar-nos",

  "timing.ya": "Ja",
  "timing.mes": "Aquest mes",
  "timing.tri": "Aquest trimestre",
  "timing.flex": "Flexible",

  "source.google": "Cerca a Google",
  "source.redes": "Xarxes socials",
  "source.prensa": "A premsa o mitjans",
  "source.recomendacion": "Ens van recomanar",
  "source.evento": "Esdeveniment o ponència",
  "source.cliente": "Ja som clients",
  "source.otro": "Un altre canal",

  "footer.explore": "Explorar",
  "footer.services": "Serveis 360",
  "footer.den": "El cau",
  "footer.top": "Tornar amunt",
  "footer.rights": "© 2026 MISTERRED360 — Tots els drets reservats",
  "footer.slogan": "Comunicació que dona la volta a la teva marca",
  "footer.made": "Fet amb instint · 40,4168° N",
  "footer.privacy": "Política de privacitat",
  "footer.cookies": "Política de cookies",
  "footer.cookie_prefs": "Preferències de cookies",
  "footer.a11y": "Accessibilitat",
  "footer.privacy_short": "Privacitat",
  "footer.cookies_short": "Cookies",
  "footer.prefs_short": "Preferències",
  "footer.download": "Descarregar textos",
  "footer.download_short": "Textos",

  "shell.back": "Tornar a la home",
  "shell.cta.title": "Parlem de la teva marca?",
  "shell.cta.desc":
    "Primera lectura estratègica en 48 hores. Sense compromís i sense respostes de manual.",
  "shell.cta.button": "Sol·licitar proposta",
  "shell.footer.short":
    "Agència de comunicació estratègica, reputació i creixement 360 a Madrid.",
  "shell.footer.contact": "Contacte",
  "shell.footer.gocontact": "Anar a contacte",

  "cookie.title": "Cookies amb criteri.",
  "cookie.desc":
    "Fem servir cookies pròpies i de tercers per analitzar la navegació i millorar l'experiència. Pots acceptar-les totes, rebutjar-les o configurar-les per categoria. Més informació a la nostra {a}política de cookies{/a}.",
  "cookie.reject": "Rebutjar totes",
  "cookie.configure": "Configurar",
  "cookie.accept": "Acceptar totes",
  "cookie.panel.kicker": "Preferències",
  "cookie.panel.title": "Configura les teves cookies",
  "cookie.panel.desc":
    "Pots acceptar o rebutjar cada categoria per separat. Les cookies tècniques són imprescindibles per al funcionament del lloc i no es poden desactivar.",
  "cookie.panel.save": "Desar preferències",
  "cookie.panel.footer":
    "Pots canviar aquestes preferències en qualsevol moment des de l'enllaç «Preferències de cookies» del peu de pàgina.",
  "cookie.close": "Tancar",
  "cookie.close_panel": "Tancar panell de cookies",
  "cookie.cat.necessary": "Tècniques o estrictament necessàries",
  "cookie.cat.necessary.desc":
    "Imprescindibles per al funcionament bàsic del lloc: navegació, formularis, seguretat i preferències de sessió. No es poden desactivar.",
  "cookie.cat.preferences": "Preferències o personalització",
  "cookie.cat.preferences.desc":
    "Recorden les opcions triades per l'usuari (idioma, regió, ajustos visuals) per personalitzar l'experiència.",
  "cookie.cat.analytics": "Analítica o estadística",
  "cookie.cat.analytics.desc":
    "Permeten mesurar l'ús del lloc, comptar visites i analitzar el rendiment per millorar-lo (p. ex., Google Analytics).",
  "cookie.cat.marketing": "Màrqueting o publicitat comportamental",
  "cookie.cat.marketing.desc":
    "Recullen informació sobre la teva navegació per mostrar-te publicitat personalitzada dins i fora d'aquest lloc.",

  "a11y.open": "Obrir panell d'accessibilitat",
  "a11y.title": "Accessibilitat",
  "a11y.kicker": "Accessibilitat",
  "a11y.panel.title": "Ajusta l'experiència",
  "a11y.close": "Tancar",
  "a11y.close_panel": "Tancar panell d'accessibilitat",
  "a11y.text": "Mida del text",
  "a11y.spacing": "Espaiat de lectura",
  "a11y.spacing.normal": "Normal",
  "a11y.spacing.wide": "Ampli",
  "a11y.view": "Visualització",
  "a11y.contrast": "Contrast alt",
  "a11y.contrast.desc": "Fons negre pur i text blanc amb accent vermell.",
  "a11y.underline": "Subratllar enllaços",
  "a11y.underline.desc":
    "Marca visualment tots els enllaços i botons interactius.",
  "a11y.dyslexia": "Font per a dislèxia",
  "a11y.dyslexia.desc":
    "Canvia a una tipografia sans més neutra i amb més espaiat.",
  "a11y.motion": "Moviment",
  "a11y.motion.reduce": "Reduir animacions",
  "a11y.motion.reduce.desc":
    "Desactiva parallax, transicions i motion no essencials.",
  "a11y.motion.grain": "Pausar gra de fons",
  "a11y.motion.grain.desc": "Atura la textura animada del web.",
  "a11y.focus": "Lectura i focus",
  "a11y.cursor": "Cursor gran",
  "a11y.cursor.desc": "Augmenta la mida del cursor personalitzat.",
  "a11y.guide": "Guia de lectura",
  "a11y.guide.desc": "Línia horitzontal vermella que segueix el punter.",
  "a11y.mask": "Màscara de lectura",
  "a11y.mask.desc":
    "Enfosqueix la resta de la pantalla deixant una franja.",
  "a11y.listen": "Escoltar contingut",
  "a11y.listen.desc":
    "Lectura per veu dels titulars i textos de la pàgina actual.",
  "a11y.listen.play": "Escoltar aquesta pàgina",
  "a11y.listen.stop": "Aturar lectura",
  "a11y.reset": "Restablir ajustos",
  "a11y.persist":
    "Aquests ajustos es desen al teu navegador i s'apliquen a totes les pàgines del lloc.",

  "loader.a11y": "Carregant MISTERRED360",
  "loader.subtitle": "Posant la marca en òrbita",
  "loader.experience": "Experiència 360°",
};

const dicts: Record<Locale, Dict> = { es, en };

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && ["es", "en"].includes(saved)) {
        setLocaleState(saved);
        return;
      }
      const nav = navigator.language.slice(0, 2).toLowerCase();
      if (nav === "en") setLocaleState("en");
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* noop */
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let value = dicts[locale][key] ?? dicts.es[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          value = value.split(`{${k}}`).join(String(v));
        }
      }
      return value;
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n debe usarse dentro de <I18nProvider>");
  return ctx;
}
