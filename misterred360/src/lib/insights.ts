import type { Locale } from "./i18n";

/* ───────────────────────────────────────────────────────────
   MISTERRED360 · Blog / Insights bilingüe
   Cada noticia se escribe una sola vez con sus versiones
   ES y EN. La web muestra automáticamente la correspondiente
   al idioma activo, con fallback a español si falta la EN.

   PARA PUBLICAR UNA NOTICIA NUEVA:
   1. Duplica insightTemplate (bloque completo).
   2. Rellena el slug (sin acentos), la imagen y las fechas.
   3. Rellena `es` y `en` con título, extracto, categoría y
      cuerpo (mismos bloques, texto traducido).
   4. Añade el objeto al inicio del array insightPosts.
   ─────────────────────────────────────────────────────────── */

export type InsightBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] };

/* Contenido específico de un idioma */
export interface InsightLocaleContent {
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  meta: string;
  authorRole: string;
  imageAlt: string;
  tags: string[];
  content: InsightBlock[];
}

/* Documento bilingüe editable */
export interface LocalizedInsightPost {
  slug: string;
  date: string;          // formato humano legible (ES): "12 ene 2026"
  dateEn: string;        // formato humano en inglés: "Jan 12, 2026"
  author: string;        // firma común (no traducible)
  image: string;
  es: InsightLocaleContent;
  en: InsightLocaleContent;
}

/* Estructura ya resuelta para el idioma activo */
export interface InsightPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  meta: string;
  author: string;
  authorRole: string;
  image: string;
  imageAlt: string;
  tags: string[];
  content: InsightBlock[];
}

/* ═══════════════════════════════════════════════════════════
   NOTICIAS PUBLICADAS
   ═══════════════════════════════════════════════════════════ */

export const localizedPosts: LocalizedInsightPost[] = [
  {
    slug: "el-comunicado-ha-muerto-larga-vida-al-relato",
    date: "12 ene 2026",
    dateEn: "Jan 12, 2026",
    author: "MISTERRED360",
    image: "/images/chimp-press.jpg",
    es: {
      category: "Estrategia",
      title: "El comunicado ha muerto. Larga vida al relato.",
      excerpt:
        "Los medios ya no publican notas de prensa: publican historias. Cómo reescribir tu mensaje para que los periodistas quieran contarlo.",
      readTime: "6 min",
      meta: "6 min · Ene 2026",
      authorRole: "Equipo de comunicación estratégica",
      imageAlt: "Chimpancé corporativo de MISTERRED360 en una rueda de prensa",
      tags: ["Gabinete de prensa", "Relato", "Medios"],
      content: [
        {
          type: "paragraph",
          text: "Durante años, muchas marcas han entendido la comunicación como una secuencia de comunicados enviados a una base de datos. Pero el contexto cambió: los periodistas no necesitan más ruido, necesitan historias con foco, datos, contexto y valor para su audiencia.",
        },
        {
          type: "heading",
          text: "La noticia no es lo que haces, es por qué importa",
        },
        {
          type: "paragraph",
          text: "Un lanzamiento, una apertura o una campaña pueden ser relevantes, pero solo si se traducen en un ángulo informativo. El trabajo estratégico consiste en detectar el conflicto, la tendencia, el dato o la utilidad pública que convierte una actividad de marca en un relato publicable.",
        },
        {
          type: "quote",
          text: "Una marca gana presencia cuando deja de pedir atención y empieza a aportar conversación.",
          cite: "MISTERRED360",
        },
        {
          type: "list",
          items: [
            "Define un titular antes de escribir el texto completo.",
            "Sustituye la autopromoción por contexto, datos y consecuencias.",
            "Adapta el ángulo al tipo de medio, sección y audiencia.",
            "Incluye portavoces, recursos visuales y una lectura clara para el periodista.",
          ],
        },
        {
          type: "paragraph",
          text: "La nota de prensa no desaparece, pero deja de ser el centro. Se convierte en una pieza dentro de un sistema más amplio: posicionamiento, relación con medios, contenido experto y seguimiento continuo.",
        },
      ],
    },
    en: {
      category: "Strategy",
      title: "The press release is dead. Long live the story.",
      excerpt:
        "Media outlets no longer publish press releases: they publish stories. How to rewrite your message so journalists actually want to tell it.",
      readTime: "6 min read",
      meta: "6 min · Jan 2026",
      authorRole: "Strategic communication team",
      imageAlt: "MISTERRED360's corporate chimp at a press conference",
      tags: ["Press office", "Storytelling", "Media"],
      content: [
        {
          type: "paragraph",
          text: "For years, many brands have understood communication as a sequence of press releases sent to a database. But the context has shifted: journalists don't need more noise, they need stories with focus, data, context and value for their audience.",
        },
        {
          type: "heading",
          text: "The news isn't what you do, it's why it matters",
        },
        {
          type: "paragraph",
          text: "A launch, an opening or a campaign can be relevant, but only if it translates into a news angle. Strategic work consists of finding the tension, the trend, the data point or the public utility that turns brand activity into a publishable story.",
        },
        {
          type: "quote",
          text: "A brand gains presence when it stops asking for attention and starts contributing to the conversation.",
          cite: "MISTERRED360",
        },
        {
          type: "list",
          items: [
            "Define a headline before writing the full text.",
            "Replace self-promotion with context, data and consequences.",
            "Adapt the angle to the type of outlet, section and audience.",
            "Include spokespeople, visual assets and a clear read for the journalist.",
          ],
        },
        {
          type: "paragraph",
          text: "The press release doesn't disappear, but it stops being the center. It becomes one piece within a wider system: positioning, media relations, expert content and continuous follow-up.",
        },
      ],
    },
  },

  {
    slug: "reputacion-el-activo-que-no-sale-en-el-balance",
    date: "4 feb 2026",
    dateEn: "Feb 4, 2026",
    author: "MISTERRED360",
    image: "/images/chimp-bw.jpg",
    es: {
      category: "Reputación",
      title: "Reputación: el activo que no sale en el balance",
      excerpt:
        "Se construye durante años y se juega en un titular. Por qué la gestión de reputación es la inversión más rentable de tu marca.",
      readTime: "8 min",
      meta: "8 min · Feb 2026",
      authorRole: "Dirección de estrategia",
      imageAlt: "Retrato editorial en blanco y negro del chimpancé de MISTERRED360",
      tags: ["Reputación", "Marca", "Confianza"],
      content: [
        {
          type: "paragraph",
          text: "La reputación no se improvisa en una crisis. Se entrena mucho antes, en cada mensaje, cada aparición pública, cada respuesta y cada silencio. Es el resultado acumulado de cómo una marca se comporta cuando nadie la obliga a comunicar.",
        },
        {
          type: "heading",
          text: "Lo que la gente cree de ti también es negocio",
        },
        {
          type: "paragraph",
          text: "Una buena reputación acorta procesos comerciales, mejora la confianza, reduce fricciones y convierte a los equipos en portavoces naturales. Cuando se trabaja de forma estratégica, deja de ser intangible y empieza a influir en resultados reales.",
        },
        {
          type: "list",
          items: [
            "Audita qué se dice de la marca y dónde se dice.",
            "Ordena mensajes clave para momentos normales y momentos críticos.",
            "Construye autoridad mediante contenidos, portavoces y presencia pública.",
            "Mide percepción, conversación y calidad de impactos, no solo volumen.",
          ],
        },
        {
          type: "quote",
          text: "La reputación es una promesa que el mercado ya cree antes de que vendas nada.",
        },
        {
          type: "paragraph",
          text: "Trabajar reputación no es blindarse: es ser coherente, visible y reconocible. Las marcas fuertes no controlan cada conversación, pero sí saben qué lugar quieren ocupar en ella.",
        },
      ],
    },
    en: {
      category: "Reputation",
      title: "Reputation: the asset that doesn't show up on the balance sheet",
      excerpt:
        "It's built over years and gambled on a single headline. Why reputation management is the most profitable investment your brand can make.",
      readTime: "8 min read",
      meta: "8 min · Feb 2026",
      authorRole: "Strategy direction",
      imageAlt: "Editorial black and white portrait of MISTERRED360's chimp",
      tags: ["Reputation", "Brand", "Trust"],
      content: [
        {
          type: "paragraph",
          text: "Reputation isn't improvised during a crisis. It's trained long before, in every message, every public appearance, every reply and every silence. It's the accumulated result of how a brand behaves when nobody is forcing it to communicate.",
        },
        {
          type: "heading",
          text: "What people believe about you is business too",
        },
        {
          type: "paragraph",
          text: "A strong reputation shortens sales cycles, improves trust, reduces friction and turns teams into natural spokespeople. When it's worked strategically, it stops being intangible and starts influencing real results.",
        },
        {
          type: "list",
          items: [
            "Audit what people say about your brand and where they say it.",
            "Prepare key messages for both regular and critical moments.",
            "Build authority through content, spokespeople and public presence.",
            "Measure perception, conversation and quality of coverage, not only volume.",
          ],
        },
        {
          type: "quote",
          text: "Reputation is a promise the market already believes before you sell anything.",
        },
        {
          type: "paragraph",
          text: "Working on reputation isn't about building a wall: it's about being coherent, visible and recognizable. Strong brands don't control every conversation, but they know exactly what place they want to hold in it.",
        },
      ],
    },
  },

  {
    slug: "del-like-al-lead-redes-sociales-con-proposito",
    date: "18 mar 2026",
    dateEn: "Mar 18, 2026",
    author: "MISTERRED360",
    image: "/images/chimp-hero.jpg",
    es: {
      category: "Social",
      title: "Del like al lead: redes sociales con propósito",
      excerpt:
        "Métricas de vanidad fuera. Cómo integrar la conversación social dentro de una estrategia que de verdad mueve el negocio.",
      readTime: "5 min",
      meta: "5 min · Mar 2026",
      authorRole: "Equipo digital",
      imageAlt: "Chimpancé de MISTERRED360 con gafas rojas como embajador digital",
      tags: ["Comunicación 2.0", "Redes sociales", "Conversión"],
      content: [
        {
          type: "paragraph",
          text: "Las redes sociales no deberían vivir separadas del plan de comunicación. Cuando se gestionan como un calendario de publicaciones aislado, se llenan de contenido correcto pero irrelevante. La pregunta no es qué publicamos hoy, sino qué conversación queremos liderar este trimestre.",
        },
        {
          type: "heading",
          text: "El objetivo no es publicar más, es publicar con intención",
        },
        {
          type: "paragraph",
          text: "Un buen sistema social traduce objetivos de marca en líneas editoriales, formatos, ritmos y llamadas a la acción. Algunas piezas construyen autoridad, otras explican valor, otras captan demanda y otras sostienen comunidad.",
        },
        {
          type: "list",
          items: [
            "Define territorios editoriales antes de diseñar formatos.",
            "Usa cada red para una función concreta dentro del embudo.",
            "Equilibra autoridad, prueba social, contenido útil y activación comercial.",
            "Mide señales de negocio, no solo interacciones visibles.",
          ],
        },
        {
          type: "paragraph",
          text: "El like puede ser una señal, pero no es el destino. El destino es una audiencia que entiende qué haces, por qué importa y qué paso puede dar después.",
        },
      ],
    },
    en: {
      category: "Social",
      title: "From like to lead: social media with purpose",
      excerpt:
        "Vanity metrics out. How to integrate social conversation inside a strategy that actually moves the business.",
      readTime: "5 min read",
      meta: "5 min · Mar 2026",
      authorRole: "Digital team",
      imageAlt: "MISTERRED360's chimp with red glasses as a digital ambassador",
      tags: ["Digital communication", "Social media", "Conversion"],
      content: [
        {
          type: "paragraph",
          text: "Social media shouldn't live apart from the communication plan. When it's managed as an isolated posting calendar, it fills up with content that's correct but irrelevant. The question isn't what we post today, it's what conversation we want to lead this quarter.",
        },
        {
          type: "heading",
          text: "The goal isn't to post more, it's to post with intent",
        },
        {
          type: "paragraph",
          text: "A good social system translates brand objectives into editorial lines, formats, cadences and calls to action. Some pieces build authority, others explain value, others capture demand and others sustain community.",
        },
        {
          type: "list",
          items: [
            "Define editorial territories before designing formats.",
            "Use each network for a specific role within the funnel.",
            "Balance authority, social proof, useful content and commercial activation.",
            "Measure business signals, not only visible interactions.",
          ],
        },
        {
          type: "paragraph",
          text: "A like can be a signal, but it's not the destination. The destination is an audience that understands what you do, why it matters and what step they can take next.",
        },
      ],
    },
  },

  {
    slug: "como-convertir-un-evento-en-una-noticia",
    date: "7 abr 2026",
    dateEn: "Apr 7, 2026",
    author: "MISTERRED360",
    image: "/images/chimp-events.jpg",
    es: {
      category: "Eventos",
      title: "Cómo convertir un evento en una noticia",
      excerpt:
        "Un evento no termina cuando se apagan las luces. Si se diseña con estrategia, puede generar agenda, relaciones y contenido durante semanas.",
      readTime: "7 min",
      meta: "7 min · Abr 2026",
      authorRole: "RRPP y eventos",
      imageAlt: "Chimpancé de MISTERRED360 hablando en un escenario de evento corporativo",
      tags: ["RRPP", "Eventos", "Difusión"],
      content: [
        {
          type: "paragraph",
          text: "El evento es uno de los formatos más potentes para activar reputación porque combina presencia, relación y relato. Pero para que funcione como herramienta de comunicación debe diseñarse desde el titular final, no solo desde la logística.",
        },
        {
          type: "heading",
          text: "La cobertura empieza antes de abrir puertas",
        },
        {
          type: "paragraph",
          text: "El antes genera expectativa, el durante produce contenido y el después consolida impacto. Si cada fase tiene mensajes, portavoces y piezas planificadas, el evento deja de ser una fecha y se convierte en campaña.",
        },
        {
          type: "list",
          items: [
            "Crea un ángulo informativo claro antes de convocar.",
            "Prepara fotografías, clips y declaraciones útiles para medios y redes.",
            "Diseña momentos visuales que puedan circular por sí mismos.",
            "Cierra con resumen, datos de asistencia, impactos y próximos pasos.",
          ],
        },
        {
          type: "paragraph",
          text: "La diferencia entre un acto y una acción de comunicación está en la intención. Lo que no se planifica, normalmente no se cuenta.",
        },
      ],
    },
    en: {
      category: "Events",
      title: "How to turn an event into a news story",
      excerpt:
        "An event doesn't end when the lights go down. When it's designed strategically, it can generate agenda, relationships and content for weeks.",
      readTime: "7 min read",
      meta: "7 min · Apr 2026",
      authorRole: "PR and events",
      imageAlt: "MISTERRED360's chimp speaking on a corporate event stage",
      tags: ["PR", "Events", "Distribution"],
      content: [
        {
          type: "paragraph",
          text: "The event is one of the most powerful formats to activate reputation because it combines presence, relationships and storytelling. But for it to work as a communication tool it must be designed from the final headline, not just from the logistics.",
        },
        {
          type: "heading",
          text: "Coverage starts before the doors open",
        },
        {
          type: "paragraph",
          text: "The build-up creates expectation, the event produces content and the after-phase consolidates impact. If each phase has planned messages, spokespeople and assets, the event stops being a date and becomes a campaign.",
        },
        {
          type: "list",
          items: [
            "Craft a clear news angle before you invite anyone.",
            "Prepare photos, clips and quotes ready for media and social use.",
            "Design visual moments that can travel on their own.",
            "Close with a summary, attendance data, coverage and next steps.",
          ],
        },
        {
          type: "paragraph",
          text: "The difference between hosting a gathering and running a communication action is intent. What isn't planned usually isn't told.",
        },
      ],
    },
  },

  {
    slug: "video-corporativo-que-trabaja-para-ventas",
    date: "21 may 2026",
    dateEn: "May 21, 2026",
    author: "MISTERRED360",
    image: "/images/chimp-av.jpg",
    es: {
      category: "Audiovisual",
      title: "El vídeo corporativo que sí trabaja para ventas",
      excerpt:
        "No todos los vídeos explican valor. La pieza correcta reduce dudas, acelera decisión y convierte una promesa en algo visible.",
      readTime: "6 min",
      meta: "6 min · May 2026",
      authorRole: "Creación audiovisual",
      imageAlt: "Chimpancé de MISTERRED360 dirigiendo una cámara de cine",
      tags: ["Vídeo", "Contenido", "Ventas"],
      content: [
        {
          type: "paragraph",
          text: "El vídeo corporativo falla cuando intenta contarlo todo. Una buena pieza no es un catálogo en movimiento: es una decisión narrativa que ordena el valor de una marca y lo vuelve comprensible en segundos.",
        },
        {
          type: "heading",
          text: "Antes de grabar, decide qué debe cambiar en quien lo ve",
        },
        {
          type: "paragraph",
          text: "Hay vídeos para presentar, para vender, para reclutar, para educar y para posicionar. Cada objetivo necesita estructura, ritmo, tono y llamada a la acción diferentes.",
        },
        {
          type: "list",
          items: [
            "Arranca con el problema o deseo de la audiencia, no con la historia interna.",
            "Muestra evidencias: procesos, personas, resultados y contexto real.",
            "Usa una duración que respete el canal donde se consumirá.",
            "Termina con una acción clara y medible.",
          ],
        },
        {
          type: "quote",
          text: "Un vídeo no debe verse bonito: debe hacer que la propuesta de valor se entienda mejor.",
        },
      ],
    },
    en: {
      category: "Video",
      title: "The corporate video that actually works for sales",
      excerpt:
        "Not every video explains value. The right piece reduces doubt, speeds up decisions and turns a promise into something visible.",
      readTime: "6 min read",
      meta: "6 min · May 2026",
      authorRole: "Video production",
      imageAlt: "MISTERRED360's chimp directing a cinema camera",
      tags: ["Video", "Content", "Sales"],
      content: [
        {
          type: "paragraph",
          text: "Corporate video fails when it tries to say everything. A good piece isn't a catalogue in motion: it's a narrative decision that orders a brand's value and makes it understandable in seconds.",
        },
        {
          type: "heading",
          text: "Before shooting, decide what should change in the viewer",
        },
        {
          type: "paragraph",
          text: "There are videos to introduce, to sell, to recruit, to educate and to position. Each goal needs a different structure, pace, tone and call to action.",
        },
        {
          type: "list",
          items: [
            "Open with the audience's problem or desire, not with your internal story.",
            "Show evidence: processes, people, results and real context.",
            "Use a length that respects the channel where it will be watched.",
            "End with a clear, measurable action.",
          ],
        },
        {
          type: "quote",
          text: "A video shouldn't just look pretty: it should make the value proposition easier to understand.",
        },
      ],
    },
  },

  {
    slug: "estudios-de-mercado-antes-de-decidir-campana",
    date: "9 jun 2026",
    dateEn: "Jun 9, 2026",
    author: "MISTERRED360",
    image: "/images/chimp-data.jpg",
    es: {
      category: "Datos",
      title: "Estudios de mercado antes de decidir campaña",
      excerpt:
        "Investigar antes de comunicar no ralentiza la estrategia: evita invertir en mensajes que el mercado no necesita escuchar.",
      readTime: "7 min",
      meta: "7 min · Jun 2026",
      authorRole: "Investigación y estrategia",
      imageAlt: "Chimpancé de MISTERRED360 analizando gráficos de mercado",
      tags: ["Estudios de mercado", "Datos", "Planificación"],
      content: [
        {
          type: "paragraph",
          text: "La investigación no es una fase burocrática: es una forma de escuchar antes de hablar. Permite entender qué preocupa al mercado, qué lenguaje usa la audiencia y dónde existe una oportunidad real de posicionamiento.",
        },
        {
          type: "heading",
          text: "Los datos no sustituyen la creatividad, la enfocan",
        },
        {
          type: "paragraph",
          text: "Una campaña sin investigación puede ser brillante y equivocada. Con una base de datos, entrevistas, escucha social o análisis competitivo, la creatividad encuentra un blanco más preciso.",
        },
        {
          type: "list",
          items: [
            "Detecta necesidades, objeciones y motivaciones antes del mensaje.",
            "Mapea competidores para evitar territorios saturados.",
            "Identifica oportunidades de comunicación no explotadas.",
            "Convierte hallazgos en decisiones de tono, canal y oferta.",
          ],
        },
        {
          type: "paragraph",
          text: "El mercado siempre habla. La ventaja está en escucharlo antes de que lo haga la competencia.",
        },
      ],
    },
    en: {
      category: "Data",
      title: "Market research before deciding the campaign",
      excerpt:
        "Researching before communicating doesn't slow the strategy down: it stops you from investing in messages the market doesn't need to hear.",
      readTime: "7 min read",
      meta: "7 min · Jun 2026",
      authorRole: "Research and strategy",
      imageAlt: "MISTERRED360's chimp analyzing market charts",
      tags: ["Market research", "Data", "Planning"],
      content: [
        {
          type: "paragraph",
          text: "Research isn't a bureaucratic phase: it's a way of listening before speaking. It lets you understand what worries the market, what language the audience uses and where there's a real positioning opportunity.",
        },
        {
          type: "heading",
          text: "Data doesn't replace creativity, it focuses it",
        },
        {
          type: "paragraph",
          text: "A campaign without research can be brilliant and wrong. With a base of data, interviews, social listening or competitive analysis, creativity finds a sharper target.",
        },
        {
          type: "list",
          items: [
            "Detect needs, objections and motivations before crafting the message.",
            "Map competitors to avoid saturated territories.",
            "Identify unexploited communication opportunities.",
            "Turn findings into decisions on tone, channel and offer.",
          ],
        },
        {
          type: "paragraph",
          text: "The market is always talking. The advantage lies in listening to it before your competition does.",
        },
      ],
    },
  },
];

/* ═══════════════════════════════════════════════════════════
   PLANTILLA BILINGÜE PARA UNA NOTICIA NUEVA
   Duplica este objeto, cambia el slug y rellena ambas versiones.
   ═══════════════════════════════════════════════════════════ */

export const insightTemplate: LocalizedInsightPost = {
  slug: "titulo-de-la-noticia-en-minusculas-y-con-guiones",
  date: "1 ene 2026",
  dateEn: "Jan 1, 2026",
  author: "MISTERRED360",
  image: "/images/chimp-press.jpg",
  es: {
    category: "Categoría",
    title: "Titular de la noticia o insight",
    excerpt:
      "Entradilla breve de 18 a 28 palabras: explica qué aporta la noticia y por qué debe leerse.",
    readTime: "5 min",
    meta: "5 min · Ene 2026",
    authorRole: "Área o equipo responsable",
    imageAlt: "Descripción accesible de la imagen principal",
    tags: ["Etiqueta 1", "Etiqueta 2", "Etiqueta 3"],
    content: [
      { type: "paragraph", text: "Primer párrafo: contexto y problema." },
      { type: "heading", text: "Subtítulo de desarrollo" },
      { type: "paragraph", text: "Segundo párrafo: análisis, dato o argumento." },
      { type: "list", items: ["Idea clave 1", "Idea clave 2", "Idea clave 3"] },
      { type: "quote", text: "Frase destacada para reforzar la idea principal." },
      { type: "paragraph", text: "Cierre con aprendizaje y posible llamada a la acción." },
    ],
  },
  en: {
    category: "Category",
    title: "Story or insight headline",
    excerpt:
      "Short entry paragraph of 18–28 words: explain what the story brings and why it should be read.",
    readTime: "5 min read",
    meta: "5 min · Jan 2026",
    authorRole: "Area or team in charge",
    imageAlt: "Accessible description of the main image",
    tags: ["Tag 1", "Tag 2", "Tag 3"],
    content: [
      { type: "paragraph", text: "First paragraph: context and problem." },
      { type: "heading", text: "Development subhead" },
      { type: "paragraph", text: "Second paragraph: analysis, data or argument." },
      { type: "list", items: ["Key idea 1", "Key idea 2", "Key idea 3"] },
      { type: "quote", text: "Standout sentence to reinforce the main idea." },
      { type: "paragraph", text: "Closing with a takeaway and a possible call to action." },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   RESOLVER: convierte una noticia bilingüe en la vista final
   según el idioma activo (con fallback a español).
   ═══════════════════════════════════════════════════════════ */

export function resolvePost(p: LocalizedInsightPost, locale: Locale): InsightPost {
  const src = locale === "en" ? { ...p.es, ...p.en } : p.es;
  return {
    slug: p.slug,
    author: p.author,
    image: p.image,
    date: locale === "en" ? p.dateEn : p.date,
    category: src.category,
    title: src.title,
    excerpt: src.excerpt,
    readTime: src.readTime,
    meta: src.meta,
    authorRole: src.authorRole,
    imageAlt: src.imageAlt,
    tags: src.tags,
    content: src.content,
  };
}

export function resolveAll(locale: Locale): InsightPost[] {
  return localizedPosts.map((p) => resolvePost(p, locale));
}

/* Compat: se mantiene un array por defecto en español para código
   antiguo que aún no consume el hook `useInsights()`. */
export const insightPosts: InsightPost[] = localizedPosts.map((p) => resolvePost(p, "es"));
