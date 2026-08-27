import {
  Newspaper,
  Compass,
  RadioTower,
  Users,
  Fingerprint,
  Clapperboard,
  Megaphone,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

/* ───────────────────────────────────────────────────────────
   MISTERRED360 · Contenido y arquitectura de servicios
   Comunicación como eje: 3 bloques, 8 servicios, 1 visión.
   ─────────────────────────────────────────────────────────── */

export interface Service {
  id: string;
  name: string;
  tagline: string;
  brief: string;
  long: string;
  image: string;
  imageAlt: string;
  icon: LucideIcon;
}

export interface ServiceBlock {
  id: string;
  index: string;
  title: string;
  claim: string;
  description: string;
  accent: "brand" | "ocean";
  services: Service[];
}

export const serviceBlocks: ServiceBlock[] = [
  {
    id: "comunicacion",
    index: "01",
    title: "Comunicación Estratégica",
    claim: "El corazón de todo lo que hacemos.",
    description:
      "Convertimos hechos en noticias y noticias en reputación. Ninguna marca crece sin un relato que la sostenga: aquí empieza todo.",
    accent: "brand",
    services: [
      {
        id: "gabinete-de-prensa",
        name: "Gabinete de Prensa",
        tagline: "Del hecho al titular.",
        brief:
          "Transformamos tu actividad en noticias, contenidos y oportunidades de visibilidad para que tu marca gane presencia, credibilidad e impacto público.",
        long: "Convertimos la actividad de tu empresa, institución o proyecto en mensajes con valor informativo para que tu trabajo gane visibilidad, reputación y presencia pública. Diseñamos acciones de comunicación, elaboramos contenidos periodísticos y trabajamos la relación con medios para transformar tu actividad en noticia y posicionarte donde de verdad importa.",
        image: "/images/chimp-press.jpg",
        imageAlt: "El Portavoz: el chimpancé de MISTERRED360 en un atril de rueda de prensa",
        icon: Newspaper,
      },
      {
        id: "planificacion-estrategica",
        name: "Planificación Estratégica",
        tagline: "La hoja de ruta.",
        brief:
          "Diseñamos planes de comunicación claros y eficaces para alinear mensajes, canales y objetivos con una visión global.",
        long: "Toda comunicación eficaz necesita una hoja de ruta clara. Diseñamos planes de comunicación estructurados, realistas y alineados con tus objetivos para ordenar mensajes, priorizar canales y coordinar cada acción con una visión global de marca.",
        image: "/images/chimp-strategy.jpg",
        imageAlt: "El Estratega: el chimpancé de MISTERRED360 analizando planes en su despacho",
        icon: Compass,
      },
      {
        id: "comunicacion-2-0",
        name: "Comunicación 2.0",
        tagline: "La conversación nunca duerme.",
        brief:
          "Integramos redes sociales y comunicación digital dentro de una estrategia coherente que amplifica tu mensaje y fortalece tu marca.",
        long: "Las redes sociales no son un canal aislado, sino una extensión natural de la estrategia de comunicación. Integramos la comunicación digital en el plan global de marca para amplificar mensajes, fortalecer la conversación con la audiencia y generar una presencia coherente en todos los entornos online.",
        image: "/images/chimp-hero.jpg",
        imageAlt: "El rostro de MISTERRED360: el chimpancé corporativo con gafas rojas",
        icon: RadioTower,
      },
      {
        id: "rrpp-eventos",
        name: "RRPP y Eventos",
        tagline: "Presencia que se recuerda.",
        brief:
          "Diseñamos acciones y eventos que refuerzan relaciones, multiplican la difusión y proyectan tu mensaje con más fuerza.",
        long: "Las relaciones públicas amplían el alcance del mensaje y refuerzan la reputación de la marca en entornos clave. Diseñamos acciones de relación institucional, networking y organización de eventos con una coordinación personalizada para multiplicar la difusión, generar conexiones de valor y dar relevancia a cada iniciativa.",
        image: "/images/chimp-events.jpg",
        imageAlt: "El Anfitrión: el chimpancé de MISTERRED360 hablando sobre un escenario",
        icon: Users,
      },
    ],
  },
  {
    id: "identidad",
    index: "02",
    title: "Identidad y Posicionamiento",
    claim: "Quién eres, cómo te ves y por qué importas.",
    description:
      "Las marcas que perduran se reconocen al instante. Construimos identidades con carácter y contenidos que las hacen inolvidables.",
    accent: "ocean",
    services: [
      {
        id: "imagen-corporativa",
        name: "Imagen Corporativa",
        tagline: "Identidad con carácter.",
        brief:
          "Creamos o redefinimos tu identidad visual para que refleje con claridad la esencia y el valor de tu actividad.",
        long: "La imagen de una marca debe expresar con claridad quién es, qué ofrece y por qué es diferente. Desarrollamos o renovamos identidades corporativas para que reflejen la esencia de tu actividad y proyecten una imagen sólida, coherente y profesional en todos tus puntos de contacto.",
        image: "/images/chimp-brand.jpg",
        imageAlt: "El Diseñador: el chimpancé de MISTERRED360 ante un muro de identidad de marca",
        icon: Fingerprint,
      },
      {
        id: "creacion-audiovisual",
        name: "Creación Audiovisual",
        tagline: "Historias que se ven.",
        brief:
          "Producimos contenidos audiovisuales que conectan, explican y potencian tus campañas, productos y canales digitales.",
        long: "El contenido audiovisual es una de las herramientas más eficaces para captar atención, explicar valor y conectar con nuevas audiencias. Creamos piezas de vídeo personalizadas para empresas, instituciones y negocios, orientadas a reforzar campañas, presentar servicios, impulsar redes sociales y mejorar el impacto de la comunicación digital.",
        image: "/images/chimp-av.jpg",
        imageAlt: "El Director: el chimpancé de MISTERRED360 tras una cámara de cine",
        icon: Clapperboard,
      },
    ],
  },
  {
    id: "difusion",
    index: "03",
    title: "Difusión, Marketing y Crecimiento",
    claim: "La visibilidad, convertida en negocio.",
    description:
      "Amplificamos con criterio: campañas, medios y datos que transforman la atención en resultados medibles.",
    accent: "brand",
    services: [
      {
        id: "publicidad-marketing",
        name: "Publicidad y Marketing",
        tagline: "Impacto que convierte.",
        brief:
          "Desarrollamos campañas y mensajes orientados a maximizar visibilidad, notoriedad e impacto comercial.",
        long: "Diseñamos acciones publicitarias y campañas de marketing enfocadas a mejorar el alcance, la notoriedad y la respuesta del público. Definimos mensajes, creatividad y soportes adecuados para que cada campaña tenga coherencia estratégica y genere un impacto real en tus objetivos comerciales y de comunicación.",
        image: "/images/chimp-ads.jpg",
        imageAlt: "El Publicista: el chimpancé de MISTERRED360 con un megáfono rojo",
        icon: Megaphone,
      },
      {
        id: "estudios-de-mercado",
        name: "Estudios de Mercado",
        tagline: "Decidir con datos.",
        brief:
          "Generamos información útil para entender mejor tu entorno y tomar decisiones estratégicas con mayor seguridad.",
        long: "Tomar decisiones sin información es asumir riesgos innecesarios. Desarrollamos estudios e investigaciones de mercado para obtener datos relevantes sobre tu actividad, tu entorno y tus oportunidades, facilitando decisiones más precisas, estrategias mejor orientadas y una capacidad de reacción más ágil ante los cambios.",
        image: "/images/chimp-data.jpg",
        imageAlt: "El Analista: el chimpancé de MISTERRED360 estudiando datos de mercado",
        icon: BarChart3,
      },
    ],
  },
];

/* ── Método 360 ─────────────────────────────────────────── */
export interface ProcessStep {
  index: string;
  verb: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

export const processSteps: ProcessStep[] = [
  {
    index: "01",
    verb: "OBSERVAR",
    title: "Primero escuchamos. Siempre.",
    description:
      "Auditoría de marca, estudios de mercado y escucha activa. Antes de decir una palabra en tu nombre, entendemos tu entorno, tu audiencia y tus oportunidades reales.",
    image: "/images/chimp-data.jpg",
    tags: ["Auditoría", "Estudios de mercado", "Escucha social"],
  },
  {
    index: "02",
    verb: "PENSAR",
    title: "La estrategia marca el ritmo.",
    description:
      "Convertimos hallazgos en una hoja de ruta: mensajes ordenados, canales priorizados y objetivos alineados con una visión global de 360 grados.",
    image: "/images/chimp-strategy.jpg",
    tags: ["Plan de comunicación", "Mensajes", "Canales"],
  },
  {
    index: "03",
    verb: "CREAR",
    title: "Piezas que nadie ignora.",
    description:
      "Identidad, prensa, audiovisual y campañas con carácter propio. La creatividad no decora la estrategia: la hace imposible de ignorar.",
    image: "/images/chimp-brand.jpg",
    tags: ["Identidad", "Contenidos", "Campañas"],
  },
  {
    index: "04",
    verb: "AMPLIFICAR",
    title: "Vuelta completa. Y otra más.",
    description:
      "Difusión en medios, redes, publicidad y eventos. Medimos, aprendemos y optimizamos: el círculo de 360° nunca se cierra del todo.",
    image: "/images/chimp-ads.jpg",
    tags: ["Difusión", "Medición", "Optimización"],
  },
];

/* ── Diferenciales ──────────────────────────────────────── */
export const differentials = [
  {
    title: "Aquí nadie te pasa a un becario",
    description:
      "Un interlocutor. El mismo siempre. Localizable el día 3, no el día 30. Trabajamos con pocos clientes para poder trabajar bien.",
  },
  {
    title: "Trajes a medida. Nunca tallas.",
    description:
      "Nada de lo que hacemos para ti se parece a lo de otro. Nos adaptamos al milímetro: primero medimos tu negocio, después construimos el método.",
  },
  {
    title: "Instinto para la idea. Método para ejecutarla.",
    description:
      "Vemos lo que otros pasan por alto. Y después lo demostramos con números. Alma y milímetro no son alternativas: son el mismo trabajo.",
  },
  {
    title: "Contestamos en 24 horas. Con nombre.",
    description:
      "Y una persona. Siempre. Es el ADN convertido en promesa verificable: si alguna vez tardamos más, tienes derecho a decirlo.",
  },
];

export const stats = [
  { value: 15, suffix: "+", label: "Años puliendo el método" },
  { value: 120, suffix: "+", label: "Marcas con nombre y apellidos" },
  { value: 24, suffix: "h", label: "Para contestar. Siempre." },
  { value: 98, suffix: "%", label: "Clientes que repiten" },
];

/* ── El Elenco: las caras del personaje ─────────────────── */
/* Alternamos géneros para reflejar la diversidad real del equipo.
   Los archivos terminados en "-f" son las versiones femeninas del
   personaje (mismo estilo visual editorial). */
export const castMembers: {
  id: string;
  image: string;
  gender: "m" | "f";
}[] = [
  { id: "icono", image: "/images/chimp-hero.jpg", gender: "m" },
  { id: "portavoz", image: "/images/chimp-press-f.jpg", gender: "f" },
  { id: "estratega", image: "/images/chimp-strategy-f.jpg", gender: "f" },
  { id: "anfitrion", image: "/images/chimp-events.jpg", gender: "m" },
  { id: "disenador", image: "/images/chimp-brand-f.jpg", gender: "f" },
  { id: "director", image: "/images/chimp-av.jpg", gender: "m" },
  { id: "publicista", image: "/images/chimp-ads-f.jpg", gender: "f" },
  { id: "analista", image: "/images/chimp-data.jpg", gender: "m" },
];

/* ── Testimonios ────────────────────────────────────────── */
export const testimonials = [
  {
    quote:
      "Pasamos de 3 apariciones al año en prensa a 47 en nueve meses. Y ninguna comprada. Entendieron nuestra historia mejor que nosotros.",
    name: "Marta Olivares",
    role: "Directora de Comunicación · Grupo Alborada",
  },
  {
    quote:
      "No ejecutan: lideran. Nos ordenaron la casa entera en un trimestre y multiplicamos por 4 los leads cualificados sin subir un euro de inversión.",
    name: "Iñigo Sarria",
    role: "CEO · Nectia Foods",
  },
  {
    quote:
      "El vídeo corporativo que produjeron triplicó el tiempo de permanencia en la web. Cada pieza tiene una intención medida al milímetro.",
    name: "Lucía Ferrán",
    role: "Gerente · Clínica Vertev",
  },
  {
    quote:
      "Un director de comunicación senior sin ponerlo en nómina. Contesta el mismo día. No sabía que se pudiera trabajar así.",
    name: "Andrés Prats",
    role: "Fundador · Studio Prats Arquitectura",
  },
];

/* ── Insights / Blog ────────────────────────────────────── */
export { insightPosts as insights } from "./insights";

/* ── Marquee ────────────────────────────────────────────── */
export const marqueeItems = [
  "Gabinete de Prensa",
  "Imagen Corporativa",
  "Planificación Estratégica",
  "Comunicación 2.0",
  "Creación Audiovisual",
  "RRPP y Eventos",
  "Publicidad y Marketing",
  "Estudios de Mercado",
];

/* Rutas de las páginas interiores (hash routing) */
export const navLinks = [
  { label: "Manifiesto", href: "#/manifiesto" },
  { label: "Servicios", href: "#/servicios" },
  { label: "Método 360", href: "#/metodo" },
  { label: "Elenco", href: "#/elenco" },
  { label: "Insights", href: "#/insights" },
];

/* Iconos sociales editoriales (lucide ya no incluye marcas) */
export const socialLinks = [
  { short: "IG", label: "Instagram" },
  { short: "IN", label: "LinkedIn" },
  { short: "X", label: "X / Twitter" },
  { short: "YT", label: "YouTube" },
];
